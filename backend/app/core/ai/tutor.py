from typing import List, Dict, Optional
import openai
from langchain.llms import OpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalQA
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate
from langchain.callbacks import AsyncCallbackManager
from langchain.retrievers import TimeWeightedVectorStoreRetriever
from app.core.config import settings
from app.models.ai import TutorConfig, StudentProfile

class AITutor:
    def __init__(self, config: TutorConfig):
        self.config = config
        self.llm = OpenAI(
            temperature=config.temperature,
            model_name=settings.MODEL_NAME,
            max_tokens=config.max_response_tokens,
            openai_api_key=settings.OPENAI_API_KEY
        )
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=settings.OPENAI_API_KEY
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.memory = ConversationBufferWindowMemory(
            memory_key="chat_history",
            k=5,
            return_messages=True
        )
        self.load_knowledge_base()

    async def load_knowledge_base(self):
        """Load the tutor's knowledge base from vector store"""
        try:
            self.vectorstore = FAISS.load_local(
                f"{settings.VECTOR_DB_PATH}/{self.config.id}",
                self.embeddings
            )
            self.retriever = TimeWeightedVectorStoreRetriever(
                vectorstore=self.vectorstore,
                decay_rate=0.95,
                k=5
            )
        except Exception:
            # Initialize empty vector store if none exists
            self.vectorstore = FAISS.from_texts(
                ["Initial knowledge base"],
                self.embeddings
            )
            self.retriever = TimeWeightedVectorStoreRetriever(
                vectorstore=self.vectorstore,
                decay_rate=0.95,
                k=5
            )

    def get_system_prompt(self, student_profile: Optional[StudentProfile] = None) -> str:
        """Generate system prompt based on tutor config and student profile"""
        base_prompt = f"""You are an AI tutor specialized in {self.config.subject} for {', '.join(self.config.grade_level)} students.
        Your teaching style is {self.config.teaching_style} and your personality is {self.config.personality}.
        You communicate in {self.config.language} using a {self.config.interaction_style} tone.
        
        Your expertise includes: {', '.join(self.config.expertise)}
        
        Key instructions:
        1. Always provide accurate information
        2. Use examples when explaining complex concepts
        3. Break down complex topics into simpler parts
        4. Encourage critical thinking
        5. Provide positive reinforcement
        6. Adapt explanations based on student understanding
        7. Ask follow-up questions to ensure comprehension
        
        When responding:
        - Keep explanations clear and concise
        - Use analogies and real-world examples
        - Provide step-by-step explanations for problems
        - Encourage students to think through solutions
        - Offer hints rather than immediate answers
        - Validate student efforts and progress"""

        if student_profile:
            base_prompt += f"""
            
            Current student profile:
            - Learning style: {student_profile.learning_style}
            - Current knowledge level: {student_profile.knowledge_level}
            - Areas of strength: {', '.join(student_profile.strengths)}
            - Areas for improvement: {', '.join(student_profile.weaknesses)}
            - Preferred examples: {', '.join(student_profile.interests)}
            
            Adapt your responses accordingly."""

        return base_prompt

    async def train(self, content: str, metadata: Dict) -> bool:
        """Train the AI tutor with new content"""
        try:
            # Preprocess content
            texts = self.text_splitter.split_text(content)
            
            # Create embeddings with metadata
            metadatas = [{
                **metadata,
                "chunk_id": i,
                "total_chunks": len(texts)
            } for i in range(len(texts))]
            
            # Add to vector store
            self.vectorstore.add_texts(
                texts,
                metadatas=metadatas
            )
            
            # Save updated vector store
            self.vectorstore.save_local(
                f"{settings.VECTOR_DB_PATH}/{self.config.id}"
            )
            return True
        except Exception as e:
            print(f"Error training tutor: {e}")
            return False

    async def generate_lesson(
        self,
        topic: str,
        student_profile: Optional[StudentProfile] = None
    ) -> Dict:
        """Generate a personalized lesson plan"""
        try:
            # Create lesson generation prompt
            lesson_prompt = PromptTemplate(
                template="""Based on the following topic and student profile, create a detailed lesson plan.
                Topic: {topic}
                
                The lesson plan should include:
                1. Clear learning objectives
                2. Prerequisites
                3. Introduction to the topic
                4. Main content with examples
                5. Interactive activities
                6. Assessment questions
                7. Additional resources
                
                {system_prompt}
                
                Generate the lesson plan in a structured format.""",
                input_variables=["topic", "system_prompt"]
            )

            # Get relevant context from knowledge base
            context = self.retriever.get_relevant_documents(topic)
            
            # Generate lesson plan
            response = await self.llm.agenerate([
                lesson_prompt.format(
                    topic=topic,
                    system_prompt=self.get_system_prompt(student_profile)
                )
            ])
            
            # Parse and structure the response
            lesson_content = response.generations[0][0].text
            
            # TODO: Implement proper parsing of the generated lesson content
            # For now, return a basic structure
            return {
                "title": topic,
                "content": lesson_content,
                "subject": self.config.subject,
                "gradeLevel": self.config.grade_level[0],
                "objectives": [],  # Parse from content
                "activities": [],  # Parse from content
                "assessment": {
                    "questions": []  # Parse from content
                }
            }
        except Exception as e:
            print(f"Error generating lesson: {e}")
            raise

    async def chat(
        self,
        question: str,
        student_profile: Optional[StudentProfile] = None,
        context: Optional[str] = None
    ) -> str:
        """Handle student questions using the tutor's knowledge"""
        try:
            # Create QA chain
            qa_chain = ConversationalRetrievalQA.from_llm(
                llm=self.llm,
                retriever=self.retriever,
                memory=self.memory,
                verbose=True
            )
            
            # Get system prompt
            system_prompt = self.get_system_prompt(student_profile)
            
            # Prepare the question with context
            full_question = f"""System: {system_prompt}
            
            Previous context: {context if context else 'No previous context'}
            
            Student question: {question}
            
            Provide a helpful, encouraging response that addresses the question while following the system instructions."""
            
            # Get response
            response = await qa_chain.arun(full_question)
            
            return response
        except Exception as e:
            print(f"Error in chat: {e}")
            raise

    async def evaluate_understanding(
        self,
        student_id: str,
        lesson_id: str,
        responses: List[Dict]
    ) -> Dict:
        """Evaluate student understanding based on their responses"""
        try:
            # Analyze responses
            evaluation = await self.llm.agenerate([
                f"""Analyze the following student responses and provide an evaluation:
                
                Responses: {responses}
                
                Provide:
                1. Overall understanding score (0-100)
                2. Identified strengths
                3. Areas for improvement
                4. Specific recommendations
                5. Next steps for learning
                
                Format the response as JSON."""
            ])
            
            # Parse evaluation
            evaluation_text = evaluation.generations[0][0].text
            # TODO: Implement proper JSON parsing
            
            return {
                "studentId": student_id,
                "lessonId": lesson_id,
                "score": 0,  # Parse from evaluation
                "strengths": [],  # Parse from evaluation
                "weaknesses": [],  # Parse from evaluation
                "recommendations": []  # Parse from evaluation
            }
        except Exception as e:
            print(f"Error in evaluation: {e}")
            raise

    async def generate_practice_problems(
        self,
        topic: str,
        difficulty: str,
        count: int = 5
    ) -> List[Dict]:
        """Generate practice problems for a specific topic"""
        try:
            prompt = f"""Generate {count} practice problems about {topic} at {difficulty} difficulty level.
            
            For each problem, provide:
            1. Question
            2. Solution steps
            3. Final answer
            4. Hints
            5. Common mistakes to avoid
            
            Format the response as JSON."""
            
            response = await self.llm.agenerate([prompt])
            
            # TODO: Implement proper JSON parsing
            return []
        except Exception as e:
            print(f"Error generating practice problems: {e}")
            raise

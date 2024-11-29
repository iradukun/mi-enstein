from typing import List, Dict, Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from app.core.config import settings
from app.models.ai import TrainingData, ProcessingStatus

class TrainingManager:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=settings.OPENAI_API_KEY
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.executor = ThreadPoolExecutor(max_workers=3)

    async def process_training_data(
        self,
        training_data: TrainingData
    ) -> ProcessingStatus:
        """Process and vectorize training data"""
        try:
            # Extract text from different file types
            content = await self._extract_text(training_data)
            
            # Clean and preprocess text
            cleaned_content = await self._preprocess_text(content)
            
            # Split into chunks
            chunks = self.text_splitter.split_text(cleaned_content)
            
            # Create embeddings
            embeddings = await self._create_embeddings(chunks)
            
            # Store in vector database
            await self._store_vectors(
                embeddings,
                chunks,
                training_data
            )
            
            return ProcessingStatus.COMPLETED
        except Exception as e:
            print(f"Error processing training data: {e}")
            return ProcessingStatus.FAILED

    async def _extract_text(self, training_data: TrainingData) -> str:
        """Extract text from various file formats"""
        # Implementation for different file types
        # TODO: Add support for more file types
        return training_data.content

    async def _preprocess_text(self, text: str) -> str:
        """Clean and preprocess text"""
        # Basic cleaning
        text = text.replace('\n', ' ').replace('\r', ' ')
        text = ' '.join(text.split())
        
        # TODO: Add more sophisticated preprocessing
        return text

    async def _create_embeddings(self, chunks: List[str]) -> np.ndarray:
        """Create embeddings for text chunks"""
        try:
            # Process in batches to avoid rate limits
            embeddings = []
            batch_size = 100
            
            for i in range(0, len(chunks), batch_size):
                batch = chunks[i:i + batch_size]
                batch_embeddings = await asyncio.get_event_loop().run_in_executor(
                    self.executor,
                    self.embeddings.embe
</ReactProject>

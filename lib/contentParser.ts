import { PDFExtract } from 'pdf.js-extract'
import mammoth from 'mammoth'

export async function parseContent(file: File): Promise<string> {
  const fileType = file.type
  let content = ''

  if (fileType === 'application/pdf') {
    const pdfExtract = new PDFExtract()
    const data = await pdfExtract.extractBuffer(await file.arrayBuffer())
    content = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n')
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
    content = result.value
  } else if (fileType === 'text/plain') {
    content = await file.text()
  } else {
    throw new Error('Unsupported file type')
  }

  return content
}

export function structureContent(content: string): { [key: string]: string } {
  const sections = content.split(/\n(?=Chapter|Section)/)
  const structuredContent: { [key: string]: string } = {}

  sections.forEach(section => {
    const [title, ...body] = section.split('\n')
    structuredContent[title.trim()] = body.join('\n').trim()
  })

  return structuredContent
}


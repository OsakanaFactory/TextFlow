import { useMemo } from 'react'

interface CharCountResult {
  totalChars: number
  totalCharsWithoutSpace: number
  bytes: number
  lines: number
  words: number
  paragraphs: number
  manuscripts: number
  sns: {
    twitter: number
    instagram: number
  }
}

export function useCharCount(text: string): CharCountResult {
  return useMemo(() => {
    const totalChars = text.length
    const totalCharsWithoutSpace = text.replace(/\s/g, '').length
    const bytes = new Blob([text]).size
    const lines = text === '' ? 0 : text.split('\n').length
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
    const paragraphs = text.trim() === ''
      ? 0
      : text.split(/\n\s*\n/).filter((p) => p.trim()).length
    const manuscripts = Math.ceil(totalChars / 400)

    return {
      totalChars,
      totalCharsWithoutSpace,
      bytes,
      lines,
      words,
      paragraphs,
      manuscripts,
      sns: {
        twitter: totalChars,
        instagram: totalChars
      }
    }
  }, [text])
}

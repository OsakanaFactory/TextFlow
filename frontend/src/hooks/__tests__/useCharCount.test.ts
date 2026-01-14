import { describe, it, expect, vi } from 'vitest'
import { useCharCount } from '../useCharCount'

// Simple mock for useMemo since we are testing the logic
// In a real project, we would use @testing-library/react-hooks
vi.mock('react', () => ({
  useMemo: (factory: () => any) => factory()
}))

describe('useCharCount', () => {
  it('should return zeros for empty string', () => {
    const result = useCharCount('')
    expect(result.totalChars).toBe(0)
    expect(result.lines).toBe(0)
    expect(result.words).toBe(0)
    expect(result.paragraphs).toBe(0)
  })

  it('should count characters correctly', () => {
    const result = useCharCount('Hello World')
    expect(result.totalChars).toBe(11)
    expect(result.totalCharsWithoutSpace).toBe(10)
  })

  it('should count lines correctly', () => {
    const result = useCharCount('Line 1\nLine 2\nLine 3')
    expect(result.lines).toBe(3)
  })

  it('should count words correctly', () => {
    const result = useCharCount('Three simple words')
    expect(result.words).toBe(3)
  })

  it('should count paragraphs correctly', () => {
    const result = useCharCount('Para 1\n\nPara 2\n\nPara 3')
    expect(result.paragraphs).toBe(3)
  })

  it('should calculate bytes correctly', () => {
    const result = useCharCount('Text')
    // Blob might not available in some node environments, but vitest usually handles it
    expect(result.bytes).toBe(4)
  })
})

import { useState, useEffect } from 'react'
import { diffLines, Change } from 'diff'

interface DiffStats {
  addedLines: number
  deletedLines: number
  changeRate: number
}

export function useDiff(textBefore: string, textAfter: string) {
  const [diffs, setDiffs] = useState<Change[]>([])
  const [stats, setStats] = useState<DiffStats>({
    addedLines: 0,
    deletedLines: 0,
    changeRate: 0
  })

  useEffect(() => {
    if (!textBefore && !textAfter) {
      setDiffs([])
      setStats({
        addedLines: 0,
        deletedLines: 0,
        changeRate: 0
      })
      return
    }

    const timeoutId = setTimeout(() => {
      const result = diffLines(textBefore, textAfter)
      setDiffs(result)

      let addedLines = 0
      let deletedLines = 0

      result.forEach((change) => {
        const lineCount = change.value.split('\n').filter((l) => l !== '').length
        if (change.added) {
          addedLines += lineCount
        } else if (change.removed) {
          deletedLines += lineCount
        }
      })

      const totalLines = Math.max(
        textBefore.split('\n').length,
        textAfter.split('\n').length
      )
      const changeRate =
        totalLines > 0 ? ((addedLines + deletedLines) / totalLines) * 100 : 0

      setStats({
        addedLines,
        deletedLines,
        changeRate: Math.round(changeRate * 10) / 10,
      })
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [textBefore, textAfter])

  return { diffs, stats }
}

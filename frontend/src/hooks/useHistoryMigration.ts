import { useCallback } from 'react'
import { useLocalHistory } from './useLocalHistory'
import api from '../services/api'

export function useHistoryMigration() {
  const { getHistoriesForImport, clearHistories } = useLocalHistory()

  const migrate = useCallback(async () => {
    const localHistories = getHistoriesForImport()

    if (localHistories.length === 0) return

    try {
      await api.post('/history/import', {
        histories: localHistories
      })
      clearHistories()
      console.log('History successfully migrated to database')
    } catch (error) {
      console.error('Failed to migrate history:', error)
    }
  }, [getHistoriesForImport, clearHistories])

  return { migrate }
}

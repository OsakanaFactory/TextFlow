import { useState, useEffect } from 'react'

interface LocalHistory {
  id: string
  title: string
  content: string
  contentType: string
  charCount: number
  createdAt: string
}

const STORAGE_KEY = 'textflow_histories'
const MAX_GUEST_HISTORIES = 5

export function useLocalHistory() {
  const [histories, setHistories] = useState<LocalHistory[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setHistories(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse histories:', e)
      }
    }
  }, [])

  const saveHistory = (content: string, title?: string) => {
    const newHistory: LocalHistory = {
      id: Date.now().toString(),
      title: title || (content.length > 30 ? content.substring(0, 30) + '...' : content),
      content,
      contentType: 'plain',
      charCount: content.length,
      createdAt: new Date().toISOString(),
    }

    const updated = [newHistory, ...histories].slice(0, MAX_GUEST_HISTORIES)
    setHistories(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

    return newHistory
  }

  const deleteHistory = (id: string) => {
    const updated = histories.filter((h) => h.id !== id)
    setHistories(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const clearHistories = () => {
    setHistories([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const getHistoriesForImport = () => {
    return histories.map((h) => ({
      title: h.title,
      content: h.content,
      contentType: h.contentType,
      createdAt: h.createdAt,
    }))
  }

  return {
    histories,
    saveHistory,
    deleteHistory,
    clearHistories,
    getHistoriesForImport,
    canSaveMore: histories.length < MAX_GUEST_HISTORIES,
  }
}

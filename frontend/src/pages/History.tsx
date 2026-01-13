import { useTranslation } from 'react-i18next'
import { useLocalHistory } from '../hooks/useLocalHistory'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { History as HistoryIcon, Clock, Trash2, Copy, FileText, ArrowRight, BookOpen } from 'lucide-react'

export default function History() {
  const { t } = useTranslation()
  const { histories, deleteHistory } = useLocalHistory()
  const { isAuthenticated } = useAuth()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500">
           <HistoryIcon size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('history.title', '履歴')}
        </h1>
      </div>

      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                 <Clock size={20} />
             </div>
             <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">ゲストモードで利用中</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('history.guestNotice', 'ゲストモードでは最大5件まで保存できます。')}
                </p>
             </div>
          </div>
          <Link 
            to="/register" 
            className="whitespace-nowrap px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm flex items-center gap-2"
          >
            {t('history.registerCta', '無料登録で無制限に保存')}
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {histories.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
             <BookOpen size={40} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {t('history.noHistory', '履歴がありません')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
             テキストを入力して保存すると、ここに履歴が表示されます。
          </p>
          <Link
            to="/counter"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
          >
            <FileText size={18} />
            {t('history.startCounting', '文字数カウントを始める')}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {histories.map((history) => (
            <div
              key={history.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md hover:border-primary-100 dark:hover:border-primary-900 transition-all duration-300"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {history.title || 'Untitled'}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                     <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(history.createdAt)}
                     </span>
                     <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                        <FileText size={12} />
                        {history.charCount.toLocaleString()} {t('counter.chars', '文字')}
                     </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                    {history.content}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(history.content)
                    }}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors border border-transparent hover:border-primary-100"
                    title={t('common.copy', 'コピー')}
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(t('history.deleteConfirm', 'この履歴を削除しますか？'))) {
                        deleteHistory(history.id)
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                    title={t('common.delete', '削除')}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

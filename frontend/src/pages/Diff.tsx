import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDiff } from '../hooks/useDiff'
import { FileDiff, Split, Minimize2 } from 'lucide-react'

export default function Diff() {
  const { t } = useTranslation()
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side')
  
  const { diffs, stats } = useDiff(oldText, newText)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileDiff className="text-teal-500" />
          {t('diff.title', '差分比較')}
        </h1>
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'side-by-side'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <Split size={16} />
            {t('diff.sideBySide', '横並び表示')}
          </button>
          <button
            onClick={() => setViewMode('unified')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'unified'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <Minimize2 size={16} />
            {t('diff.unified', '統合表示')}
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                {t('diff.text1', '変更前')}
            </label>
            <textarea
                value={oldText}
                onChange={(e) => setOldText(e.target.value)}
                placeholder={t('diff.placeholder1', '変更前のテキストを入力...')}
                className="w-full h-80 p-5 rounded-2xl bg-white dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 dark:focus:border-teal-500 ring-0 text-base leading-relaxed resize-none shadow-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none transition-colors font-mono"
            />
        </div>
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                {t('diff.text2', '変更後')}
            </label>
            <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder={t('diff.placeholder2', '変更後のテキストを入力...')}
                className="w-full h-80 p-5 rounded-2xl bg-white dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 dark:focus:border-teal-500 ring-0 text-base leading-relaxed resize-none shadow-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none transition-colors font-mono"
            />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
           <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('diff.added', '追加')}</div>
           <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
             <span>+{stats.addedLines}</span>
             <span className="text-xs font-normal text-gray-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">lines</span>
           </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
           <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('diff.deleted', '削除')}</div>
           <div className="text-2xl font-bold text-rose-600 flex items-center gap-2">
             <span>-{stats.deletedLines}</span>
             <span className="text-xs font-normal text-gray-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full">lines</span>
           </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
           <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('diff.changeRate', '変更率')}</div>
           <div className="text-2xl font-bold text-amber-600 flex items-center gap-2">
             <span>{stats.changeRate}%</span>
           </div>
        </div>
      </div>

      {/* Result */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('diff.result', '比較結果')}
          </h2>
        </div>
        
        <div className="p-0 overflow-x-auto">
          {viewMode === 'side-by-side' ? (
            <table className="w-full border-collapse font-mono text-sm">
              <tbody>
                {diffs.map((diff, index) => (
                  <tr key={index} className="border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className={`p-4 w-1/2 align-top border-r border-gray-100 dark:border-gray-700/50 ${
                      diff.removed ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-100' : ''
                    }`}>
                      {diff.removed && <span className="select-none text-rose-300 dark:text-rose-600 mr-2 opacity-50">-</span>}
                      <span className="whitespace-pre-wrap break-all">{diff.removed ? diff.value : (!diff.added ? diff.value : '')}</span>
                    </td>
                    <td className={`p-4 w-1/2 align-top ${
                      diff.added ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100' : ''
                    }`}>
                      {diff.added && <span className="select-none text-emerald-300 dark:text-emerald-600 mr-2 opacity-50">+</span>}
                      <span className="whitespace-pre-wrap break-all">{diff.added ? diff.value : (!diff.removed ? diff.value : '')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
             <div className="p-6 font-mono text-sm leading-relaxed">
                {diffs.map((diff, index) => (
                    <span 
                        key={index}
                        className={`
                            ${diff.added ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 decoration-clone px-1 rounded-sm' : ''}
                            ${diff.removed ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-900 dark:text-rose-100 decoration-clone px-1 rounded-sm line-through decoration-rose-400/50' : ''}
                        `}
                    >
                        {diff.value}
                    </span>
                ))}
             </div>
          )}
        </div>
      </div>
    </div>
  )
}

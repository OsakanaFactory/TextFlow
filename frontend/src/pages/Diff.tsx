import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDiff } from '../hooks/useDiff'
import { FileDiff, Split, Minimize2 } from 'lucide-react'
import AdLayout from '../components/layout/AdLayout'
import AdBanner from '../components/common/AdBanner'

export default function Diff() {
  const { t } = useTranslation()
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side')
  
  const { diffs, stats } = useDiff(oldText, newText)

  return (
    <AdLayout>
      <div className="space-y-8">
        <header className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FileDiff className="text-slate-600 dark:text-slate-400" />
            {t('diff.title', '差分比較')}
            </h1>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                viewMode === 'side-by-side'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
            >
                <Split size={16} />
                {t('diff.sideBySide', '横並び表示')}
            </button>
            <button
                onClick={() => setViewMode('unified')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                viewMode === 'unified'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
            >
                <Minimize2 size={16} />
                {t('diff.unified', '統合表示')}
            </button>
            </div>
        </header>

        {/* Input Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                    {t('diff.text1', '変更前')}
                </label>
                <textarea
                    value={oldText}
                    onChange={(e) => setOldText(e.target.value)}
                    placeholder={t('diff.placeholder1', '変更前のテキストを入力...')}
                    className="w-full h-80 p-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 ring-0 text-base leading-relaxed resize-none text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none transition-colors font-mono"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                    {t('diff.text2', '変更後')}
                </label>
                <textarea
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder={t('diff.placeholder2', '変更後のテキストを入力...')}
                    className="w-full h-80 p-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 ring-0 text-base leading-relaxed resize-none text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none transition-colors font-mono"
                />
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('diff.added', '追加')}</div>
            <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
                <span>+{stats.addedLines}</span>
                <span className="text-xs font-normal text-slate-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">lines</span>
            </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('diff.deleted', '削除')}</div>
            <div className="text-2xl font-bold text-rose-600 flex items-center gap-2">
                <span>-{stats.deletedLines}</span>
                <span className="text-xs font-normal text-slate-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full">lines</span>
            </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('diff.changeRate', '変更率')}</div>
            <div className="text-2xl font-bold text-amber-600 flex items-center gap-2">
                <span>{stats.changeRate}%</span>
            </div>
            </div>
        </div>
        
        {/* Result */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border-2 border-slate-100 dark:border-slate-700">
            <div className="px-6 py-4 border-b-2 border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {t('diff.result', '比較結果')}
            </h2>
            </div>
            
            <div className="p-0 overflow-x-auto">
            {viewMode === 'side-by-side' ? (
                <table className="w-full border-collapse font-mono text-sm">
                <tbody>
                    {diffs.map((diff, index) => (
                    <tr key={index} className="border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className={`p-4 w-1/2 align-top border-r border-slate-100 dark:border-slate-700/50 ${
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
                <div className="p-6 font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                    {diffs.map((diff, index) => (
                        <span 
                            key={index}
                            className={`
                                ${diff.added ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 decoration-clone px-1 rounded-sm' : ''}
                                ${diff.removed ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 decoration-clone px-1 rounded-sm line-through decoration-rose-400/50' : ''}
                            `}
                        >
                            {diff.value}
                        </span>
                    ))}
                </div>
            )}
            </div>
        </div>

        {/* Mobile only ad */}
        <div className="xl:hidden">
            <AdBanner />
        </div>
      </div>
    </AdLayout>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCharCount } from '../hooks/useCharCount'
import { useAuth } from '../contexts/AuthContext'
import { Copy, Save, Check, Type, AlignLeft, FileText, Hash, Eraser, Twitter, Instagram } from 'lucide-react'
import api from '../services/api'
import AdLayout from '../components/layout/AdLayout'
import AdBanner from '../components/common/AdBanner'

export default function Counter() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const stats = useCharCount(text)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    if (!text.trim()) return
    try {
      await api.post('/history', {
        title: text.slice(0, 20) + (text.length > 20 ? '...' : ''),
        content: text,
        type: 'COUNTER'
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save history:', error)
    }
  }

  const handleClear = () => {
      if (window.confirm('Clear text?')) {
          setText('')
      }
  }

  const statItems = [
    { label: t('counter.totalChars', '総文字数'), value: stats.totalChars, icon: Type, color: 'text-slate-600' },
    { label: t('counter.totalCharsWithoutSpace', '空白なし'), value: stats.totalCharsWithoutSpace, icon: AlignLeft, color: 'text-slate-600' },
    { label: t('counter.lines', '行数'), value: stats.lines, icon: Hash, color: 'text-slate-600' },
    { label: t('counter.paragraphs', '段落数'), value: stats.paragraphs, icon: FileText, color: 'text-slate-600' },
    { label: t('counter.manuscripts', '原稿用紙換算'), value: stats.manuscripts + t('counter.pages', '枚'), icon: FileText, color: 'text-slate-600' },
  ]

  return (
    <AdLayout>
      <div className="flex flex-col gap-6">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Type className="text-slate-600 dark:text-slate-400" />
                {t('counter.title', '文字数カウント')}
            </h1>
            <div className="flex space-x-2">
                 <button
                    onClick={handleClear}
                    className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                    title="Clear"
                 >
                     <Eraser size={20} />
                 </button>
                <button
                    onClick={handleCopy}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        copied
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    <span>{copied ? t('common.copied', 'コピーしました') : t('common.copy', 'コピー')}</span>
                </button>
                
                {isAuthenticated && (
                    <button
                    onClick={handleSave}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        saved
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm'
                    }`}
                    >
                    {saved ? <Check size={18} /> : <Save size={18} />}
                    <span>{saved ? t('counter.saved', '保存しました') : t('common.save', '保存')}</span>
                    </button>
                )}
            </div>
        </header>

        {/* Flex Container for Input and Stats */}
        <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Input Area */}
            <div className="flex-1 relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t('counter.placeholder', 'テキストを入力してください...')}
                  className="w-full h-[600px] p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 ring-0 text-lg leading-relaxed resize-none text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none transition-colors"
                  spellCheck={false}
                />
            </div>

            {/* Stats Sidebar (Inside Main Content) */}
            <aside className="lg:w-80 space-y-6">
              <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b-2 border-slate-50 dark:border-slate-700 pb-4">
                    {t('counter.results', 'カウント結果')}
                </h2>
                
                <div className="space-y-6">
                  {statItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center group">
                      <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                        <item.icon size={20} className={`${item.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className="text-2xl font-bold text-slate-800 dark:text-white font-mono">
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  
                  <div className="pt-6 border-t-2 border-slate-50 dark:border-slate-700">
                     <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 mb-2">
                        <span>Byte count (UTF-8)</span>
                        <span className="font-mono">{stats.bytes.toLocaleString()} bytes</span>
                     </div>
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  {t('counter.snsCount', 'SNS文字数')}
                </h3>
                
                <div className="space-y-5">
                  {/* Twitter */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                          <Twitter size={16} className="text-[#1DA1F2]" />
                          Twitter / X
                      </span>
                      <span className={`font-mono font-bold ${stats.sns.twitter > 140 ? 'text-rose-500' : 'text-slate-600 dark:text-slate-400'}`}>
                        {stats.sns.twitter} / 140
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          stats.sns.twitter > 140 ? 'bg-rose-500' : 'bg-[#1DA1F2]'
                        }`}
                        style={{ width: `${Math.min((stats.sns.twitter / 140) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                        <Instagram size={16} className="text-[#E1306C]" />
                        Instagram
                      </span>
                      <span className={`font-mono font-bold ${stats.sns.instagram > 2200 ? 'text-rose-500' : 'text-slate-600 dark:text-slate-400'}`}>
                        {stats.sns.instagram} / 2200
                      </span>
                    </div>
                    {/* No gradients allowed - using solid color */}
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                           stats.sns.instagram > 2200 ? 'bg-rose-500' : 'bg-[#E1306C]'
                        }`}
                        style={{ width: `${Math.min((stats.sns.instagram / 2200) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </section>
            </aside>
        </div>

        {/* Mobile only ad */}
        <div className="xl:hidden mt-6">
           <AdBanner />
        </div>
      </div>
    </AdLayout>
  )
}

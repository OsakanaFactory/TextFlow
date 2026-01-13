import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCharCount } from '../hooks/useCharCount'
import { useAuth } from '../contexts/AuthContext'
import { Copy, Save, Check, Type, AlignLeft, FileText, Hash, Eraser, Twitter, Instagram } from 'lucide-react'
import api from '../services/api'
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
    { label: t('counter.totalChars', '総文字数'), value: stats.totalChars, icon: Type, color: 'text-primary-600' },
    { label: t('counter.totalCharsWithoutSpace', '空白なし'), value: stats.totalCharsWithoutSpace, icon: AlignLeft, color: 'text-blue-600' },
    { label: t('counter.lines', '行数'), value: stats.lines, icon: Hash, color: 'text-indigo-600' },
    { label: t('counter.paragraphs', '段落数'), value: stats.paragraphs, icon: FileText, color: 'text-violet-600' },
    { label: t('counter.manuscripts', '原稿用紙換算'), value: stats.manuscripts + t('counter.pages', '枚'), icon: FileText, color: 'text-gray-600' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Input Area */}
        <div className="lg:w-2/3 space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Type className="text-primary-500" />
                    {t('counter.title', '文字数カウント')}
                </h1>
                <div className="flex space-x-2">
                     <button
                        onClick={handleClear}
                        className="p-2 text-gray-500 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                        title="Clear"
                     >
                         <Eraser size={20} />
                     </button>
                    <button
                        onClick={handleCopy}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            copied
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        <span>{copied ? t('common.copied', 'コピーしました') : t('common.copy', 'コピー')}</span>
                    </button>
                    
                    {isAuthenticated && (
                        <button
                        onClick={handleSave}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            saved
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                        }`}
                        >
                        {saved ? <Check size={18} /> : <Save size={18} />}
                        <span>{saved ? t('counter.saved', '保存しました') : t('common.save', '保存')}</span>
                        </button>
                    )}
                </div>
            </div>

          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('counter.placeholder', 'テキストを入力してください...')}
              className="w-full h-[calc(100vh-300px)] min-h-[400px] p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 dark:focus:border-primary-500 ring-0 text-lg leading-relaxed resize-none shadow-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none transition-colors"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4">
                {t('counter.results', 'カウント結果')}
            </h2>
            
            <div className="space-y-6">
              {statItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center group">
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                    <item.icon size={20} className={`${item.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
              
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                 <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>Byte count (UTF-8)</span>
                    <span className="font-mono">{stats.bytes.toLocaleString()} bytes</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              {t('counter.snsCount', 'SNS文字数')}
            </h3>
            
            <div className="space-y-4">
              {/* Twitter */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Twitter size={16} className="text-[#1DA1F2]" />
                      Twitter / X
                  </span>
                  <span className={`font-medium ${stats.sns.twitter > 140 ? 'text-danger-500' : 'text-emerald-600'}`}>
                    {stats.sns.twitter} / 140
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      stats.sns.twitter > 140 ? 'bg-danger-500' : 'bg-[#1DA1F2]'
                    }`}
                    style={{ width: `${Math.min((stats.sns.twitter / 140) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Instagram */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Instagram size={16} className="text-[#E1306C]" />
                    Instagram
                  </span>
                  <span className={`font-medium ${stats.sns.instagram > 2200 ? 'text-danger-500' : 'text-emerald-600'}`}>
                    {stats.sns.instagram} / 2200
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                       stats.sns.instagram > 2200 ? 'bg-danger-500' : 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]'
                    }`}
                    style={{ width: `${Math.min((stats.sns.instagram / 2200) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Ad Section */}
          <AdBanner className="mt-6" />
        </div>
      </div>
    </div>
  )
}

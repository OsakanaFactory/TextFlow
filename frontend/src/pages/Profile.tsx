import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { User, Mail, Calendar, Trash2, Save, AlertTriangle } from 'lucide-react'
import { api } from '../services/api'

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const { t } = useTranslation()
  const [username, setUsername] = useState(user?.username || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  if (!user) return null

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setMessage({ type: '', text: '' })
    try {
      await updateProfile(username)
      setMessage({ type: 'success', text: 'プロフィールを更新しました' })
    } catch (err) {
      setMessage({ type: 'error', text: '更新に失敗しました' })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) return

    setIsDeleting(true)
    try {
      await api.delete('/users/me')
      logout()
    } catch (err) {
      setMessage({ type: 'error', text: 'アカウントの削除に失敗しました' })
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {t('profile.title', 'アカウント設定')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          プロフィール情報の管理とアカウント設定。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-2 space-y-8">
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <User size={20} className="text-primary-500" />
              基本情報
            </h2>

            {message.text && (
              <div className={`p-4 rounded-xl mb-6 text-sm flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
              }`}>
                <p>{message.text}</p>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                  ユーザー名
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                  メールアドレス
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-400 ml-1">メールアドレスは変更できません</p>
              </div>

              <button
                type="submit"
                disabled={isUpdating || username === user.username}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-600/20"
              >
                <Save size={18} />
                変更を保存
              </button>
            </form>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 border-l-4 border-l-rose-500">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-rose-500" />
              危険ゾーン
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
              アカウントを削除すると、すべての履歴データが永久に失われます。
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="flex items-center gap-2 px-6 py-3 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
            >
              <Trash2 size={18} />
              退会する
            </button>
          </section>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">アカウント詳細</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 flex items-center gap-2">
                  <Calendar size={14} /> 登録日
                </span>
                <span className="text-slate-900 dark:text-slate-300 font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">プラン</span>
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-lg uppercase">
                  {user.plan}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Type, FileDiff, History as HistoryIcon, ArrowRight } from 'lucide-react'
import AdLayout from '../components/layout/AdLayout'
import AdBanner from '../components/common/AdBanner'

export default function Home() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Type,
      title: t('home.features.counter.title', '文字数カウント'),
      description: t('home.features.counter.description', 'リアルタイムで文字数、行数、バイト数をカウント。SNS投稿の文字数制限もチェックできます。'),
      color: 'text-slate-600 dark:text-slate-300',
      bg: 'bg-slate-100 dark:bg-slate-800'
    },
    {
      icon: FileDiff,
      title: t('home.features.diff.title', '差分比較'),
      description: t('home.features.diff.description', '2つのテキストを比較して、追加・削除・変更箇所を視覚的に表示します。'),
      color: 'text-slate-600 dark:text-slate-300',
      bg: 'bg-slate-100 dark:bg-slate-800'
    },
    {
      icon: HistoryIcon,
      title: t('home.features.history.title', '履歴管理'),
      description: t('home.features.history.description', '編集したテキストを自動保存。過去のバージョンにいつでも戻れます。'),
      color: 'text-slate-600 dark:text-slate-300',
      bg: 'bg-slate-100 dark:bg-slate-800'
    }
  ]

  return (
    <AdLayout>
      <div className="flex-1 space-y-16">
        {/* Hero Section */}
        <section className="text-center py-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
            </span>
            <span>v1.0 Now Available</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mb-8 leading-tight">
            {t('home.hero.title', 'テキスト処理を、もっとシンプルに')}
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            {t('home.hero.subtitle', '文字数カウント、差分比較、履歴管理を一つのプラットフォームで。')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/counter"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800 dark:bg-slate-700 text-white font-semibold text-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {t('home.hero.cta', '今すぐ始める')}
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-semibold text-lg border-2 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center"
            >
              {t('home.hero.register', '無料で登録')}
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              {t('home.features.title', '主な機能')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              必要な機能だけを、使いやすくまとめました。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <article 
                  key={index} 
                  className="p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                    <Icon size={28} className={feature.color} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-12">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800/50 px-6 py-16 md:px-16 md:py-20 text-center border-2 border-slate-200 dark:border-slate-700">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
                {t('home.cta.title', '今すぐTextFlowを体験しよう')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                {t('home.cta.description', '登録不要ですぐに使えます。会員登録すると履歴を無制限に保存できます。')}
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-bold hover:bg-slate-700 dark:hover:bg-slate-300 transition-all shadow-sm transform hover:-translate-y-1"
              >
                {t('home.cta.button', '無料で始める')}
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
        
        {/* Mobile only ad */}
        <div className="xl:hidden">
             <AdBanner />
        </div>
      </div>
    </AdLayout>
  )
}

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Type, FileDiff, History as HistoryIcon, ArrowRight } from 'lucide-react'

export default function Home() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Type,
      title: t('home.features.counter.title', '文字数カウント'),
      description: t('home.features.counter.description', 'リアルタイムで文字数、行数、バイト数をカウント。SNS投稿の文字数制限もチェックできます。'),
      color: 'text-primary-600 dark:text-primary-400',
      bg: 'bg-primary-50 dark:bg-primary-900/20'
    },
    {
      icon: FileDiff,
      title: t('home.features.diff.title', '差分比較'),
      description: t('home.features.diff.description', '2つのテキストを比較して、追加・削除・変更箇所を視覚的に表示します。'),
      color: 'text-teal-600 dark:text-teal-400', // Using teal as secondary accent
      bg: 'bg-teal-50 dark:bg-teal-900/20'
    },
    {
      icon: HistoryIcon,
      title: t('home.features.history.title', '履歴管理'),
      description: t('home.features.history.description', '編集したテキストを自動保存。過去のバージョンにいつでも戻れます。'),
      color: 'text-amber-600 dark:text-amber-400', // Using amber for warmth
      bg: 'bg-amber-50 dark:bg-amber-900/20'
    }
  ]

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span>v1.0 Now Available</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
            {t('home.hero.title', 'テキスト処理を、もっとシンプルに')}
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            {t('home.hero.subtitle', '文字数カウント、差分比較、履歴管理を一つのプラットフォームで。')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/counter"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
            >
              {t('home.hero.cta', '今すぐ始める')}
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center"
            >
              {t('home.hero.register', '無料で登録')}
            </Link>
          </div>
        </div>
        
        {/* Abstract shapes/blobs instead of gradients - subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gray-100 dark:bg-gray-800/50 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/2"></div>
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gray-100 dark:bg-gray-800/50 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.features.title', '主な機能')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              必要な機能だけを、使いやすくまとめました。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index} 
                  className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg hover:shadow-primary-900/5 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className={feature.color} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gray-900 dark:bg-gray-800 px-6 py-16 md:px-16 md:py-20 text-center">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('home.cta.title', '今すぐTextFlowを体験しよう')}
              </h2>
              <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
                {t('home.cta.description', '登録不要ですぐに使えます。会員登録すると履歴を無制限に保存できます。')}
              </p>
              <Link
                to="/counter"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all shadow-lg transform hover:-translate-y-1"
              >
                {t('home.cta.button', '無料で始める')}
                <ArrowRight size={20} />
              </Link>
            </div>
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

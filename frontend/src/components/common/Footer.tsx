import { useTranslation } from 'react-i18next'
// import { Link } from 'react-router-dom'
// Icons removed temporarily to fix build issues

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
          
          <div className="flex flex-col items-center md:items-start space-y-1">
             <div className="font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <span className="w-5 h-5 bg-primary-600 rounded flex items-center justify-center text-white text-[10px]">TF</span>
                <span>TextFlow</span>
             </div>
             <p className="text-gray-500 dark:text-gray-400">
               © {year} OsakanaFactory. All rights reserved.
             </p>
          </div>

          <div className="flex space-x-6 text-gray-600 dark:text-gray-400 font-medium">
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {t('footer.privacy', 'プライバシーポリシー')}
            </a>
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {t('footer.terms', '利用規約')}
            </a>
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {t('footer.contact', 'お問い合わせ')}
            </a>
          </div>

          <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-400 transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

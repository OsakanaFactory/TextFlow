import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useHistoryMigration } from '../hooks/useHistoryMigration'

export default function OAuth2RedirectHandler() {
    const navigate = useNavigate()
    const location = useLocation()
    const { loginWithToken } = useAuth()
    const { migrate } = useHistoryMigration()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const token = params.get('token')
        const error = params.get('error')

        if (token) {
            handleLogin(token)
        } else if (error) {
            navigate('/login', { state: { error } })
        } else {
            navigate('/login')
        }
    }, [])

    const handleLogin = async (token: string) => {
        try {
            await loginWithToken(token)
            await migrate()
            navigate('/counter')
        } catch (err) {
            navigate('/login', { state: { error: 'ソーシャルログインに失敗しました' } })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                <p className="text-gray-500 font-medium">ログインを完了しています...</p>
            </div>
        </div>
    )
}

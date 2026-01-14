# TextFlow 基本設計書

**バージョン**: 1.0  
**作成日**: 2026-01-13  
**最終更新日**: 2026-01-13

---

## 1. システムアーキテクチャ

### 1.1 全体構成

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Layer                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │   Web Browser   │  │  Mobile Browser │  │   PWA (将来対応)    │  │
│  └────────┬────────┘  └────────┬────────┘  └──────────┬──────────┘  │
│           └────────────────────┴──────────────────────┘              │
│                    ┌───────────▼───────────┐                        │
│                    │   React + TypeScript   │                        │
│                    │   (Vite / Vercel)      │                        │
│                    └───────────┬───────────┘                        │
└────────────────────────────────┼────────────────────────────────────┘
                                 │ HTTPS
┌────────────────────────────────▼────────────────────────────────────┐
│                          Backend Layer                               │
│                    ┌───────────────────────┐                        │
│                    │   Spring Boot 3.x     │                        │
│                    │   (Render / Railway)  │                        │
│                    ├───────────────────────┤                        │
│                    │  Spring Security      │                        │
│                    │  Spring Data JPA      │                        │
│                    └───────────┬───────────┘                        │
└────────────────────────────────┼────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                          Data Layer                                  │
│  ┌─────────────────────────┐       ┌─────────────────────────────┐  │
│  │      PostgreSQL 15+     │       │   Redis (Phase 2 Cache)     │  │
│  │   (Docker / Neon)       │       └─────────────────────────────┘  │
│  └─────────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 コンポーネント構成

**Frontend (React)**
- Pages: Home, Counter, Diff, History, Login, Register, Profile
- Components: Header, Footer, TextArea, DiffViewer, StatsCard, Sidebar
- Hooks: useCharCount, useDiff, useHistory, useAuth, useTheme
- Context: AuthContext, ThemeContext, HistoryContext
- Workers: diffWorker.ts (Web Worker for diff calculation)
- i18n: ja.json, en.json

**Backend (Spring Boot)**
- Controller: AuthController, UserController, HistoryController, CountController
- Service: AuthService, UserService, HistoryService, CountService
- Repository: UserRepository, TextHistoryRepository, DiffHistoryRepository
- Entity: User, TextHistory, DiffHistory
- Security: JwtFilter, SecurityConfig
- Config: CorsConfig, WebConfig

---

## 2. データベース設計

### 2.1 ER図

```
┌────────────────────┐       ┌────────────────────────┐
│       users        │       │    text_histories      │
├────────────────────┤       ├────────────────────────┤
│ PK id              │───┐   │ PK id                  │
│    username        │   │   │ FK user_id             │
│    email           │   └──▶│    title               │
│    password_hash   │       │    content             │
│    plan            │       │    content_type        │
│    created_at      │       │    char_count          │
│    updated_at      │       │    line_count          │
│    last_login_at   │       │    created_at          │
└────────────────────┘       │    updated_at          │
         │                   └────────────────────────┘
         │
         │                   ┌────────────────────────┐
         │                   │    diff_histories      │
         │                   ├────────────────────────┤
         └──────────────────▶│ PK id                  │
                             │ FK user_id             │
                             │    title               │
                             │    text_before         │
                             │    text_after          │
                             │    added_lines         │
                             │    deleted_lines       │
                             │    changed_lines       │
                             │    created_at          │
                             └────────────────────────┘
```

### 2.2 テーブル定義

#### users（ユーザー）

| カラム名 | データ型 | NULL | 説明 |
|---------|---------|------|------|
| id | BIGSERIAL | NO | 主キー |
| username | VARCHAR(50) | NO | ユーザー名（一意） |
| email | VARCHAR(255) | NO | メールアドレス（一意） |
| password_hash | VARCHAR(255) | NO | BCryptハッシュ |
| plan | VARCHAR(20) | NO | プラン (free/premium) |
| created_at | TIMESTAMP | NO | 作成日時 |
| updated_at | TIMESTAMP | NO | 更新日時 |
| last_login_at | TIMESTAMP | YES | 最終ログイン日時 |

#### text_histories（テキスト履歴）

| カラム名 | データ型 | NULL | 説明 |
|---------|---------|------|------|
| id | BIGSERIAL | NO | 主キー |
| user_id | BIGINT | NO | 外部キー (users.id) |
| title | VARCHAR(100) | NO | タイトル |
| content | TEXT | NO | テキスト内容 |
| content_type | VARCHAR(20) | NO | plain/markdown |
| char_count | INTEGER | NO | 文字数 |
| line_count | INTEGER | NO | 行数 |
| created_at | TIMESTAMP | NO | 作成日時 |
| updated_at | TIMESTAMP | NO | 更新日時 |

#### diff_histories（差分履歴）

| カラム名 | データ型 | NULL | 説明 |
|---------|---------|------|------|
| id | BIGSERIAL | NO | 主キー |
| user_id | BIGINT | NO | 外部キー (users.id) |
| title | VARCHAR(100) | NO | タイトル |
| text_before | TEXT | NO | 変更前テキスト |
| text_after | TEXT | NO | 変更後テキスト |
| added_lines | INTEGER | NO | 追加行数 |
| deleted_lines | INTEGER | NO | 削除行数 |
| changed_lines | INTEGER | NO | 変更行数 |
| created_at | TIMESTAMP | NO | 作成日時 |

---

## 3. API設計

### 3.1 認証API

| メソッド | エンドポイント | 説明 | 認証 |
|---------|---------------|------|------|
| POST | /api/auth/register | ユーザー登録 | 不要 |
| POST | /api/auth/login | ログイン | 不要 |
| POST | /api/auth/logout | ログアウト | 必要 |

**POST /api/auth/register**
```json
// Request
{ "username": "string", "email": "string", "password": "string" }
// Response (201)
{ "id": 1, "username": "testuser", "email": "test@example.com", "plan": "free" }
```

**POST /api/auth/login**
```json
// Request
{ "email": "string", "password": "string" }
// Response (200)
{ "accessToken": "eyJ...", "tokenType": "Bearer", "expiresIn": 3600, "user": {...} }
```

### 3.2 文字数カウントAPI

| メソッド | エンドポイント | 説明 | 認証 |
|---------|---------------|------|------|
| POST | /api/count | テキスト文字数カウント | 不要 |

```json
// Request
{ "text": "string (最大100,000文字)" }
// Response
{
  "totalChars": 1234,
  "totalCharsWithoutSpace": 1100,
  "bytes": 2468,
  "lines": 50,
  "words": 200,
  "paragraphs": 10,
  "manuscripts": 4
}
```

### 3.3 履歴API（認証必須）

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/histories | 履歴一覧取得 |
| POST | /api/histories | 履歴保存 |
| GET | /api/histories/{id} | 履歴詳細取得 |
| DELETE | /api/histories/{id} | 履歴削除 |
| POST | /api/histories/import | localStorage履歴インポート |

### 3.4 ユーザーAPI（認証必須）

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/users/me | 現在のユーザー情報取得 |
| PUT | /api/users/me | ユーザー情報更新 |
| PUT | /api/users/me/password | パスワード変更 |

### 3.5 エラーレスポンス

```json
{
  "error": "ERROR_CODE",
  "message": "エラーメッセージ",
  "timestamp": "2026-01-13T12:00:00Z"
}
```

| コード | HTTP Status | 説明 |
|--------|-------------|------|
| VALIDATION_ERROR | 400 | バリデーションエラー |
| UNAUTHORIZED | 401 | 認証エラー |
| FORBIDDEN | 403 | 権限エラー |
| NOT_FOUND | 404 | リソースが見つからない |
| CONFLICT | 409 | 重複エラー |

---

## 4. 認証設計

### 4.1 JWT認証フロー

```
Client                    Server                    Database
  │ POST /api/auth/login    │                           │
  │ {email, password}       │                           │
  │────────────────────────▶│                           │
  │                         │ SELECT user WHERE email=? │
  │                         │──────────────────────────▶│
  │                         │◀─────────── User data ────│
  │                         │ Verify password (BCrypt)  │
  │                         │ Generate JWT              │
  │◀── {accessToken} ───────│                           │
  │                         │                           │
  │ GET /api/histories      │                           │
  │ Authorization: Bearer   │                           │
  │────────────────────────▶│                           │
  │                         │ Validate JWT              │
  │                         │ Extract user_id           │
  │◀── {histories} ─────────│◀─────────── Data ─────────│
```

### 4.2 セキュリティ設定

| 項目 | 設定値 |
|------|--------|
| パスワードハッシュ | BCrypt (strength: 12) |
| JWT アルゴリズム | HS256 |
| JWT 有効期限 | 1時間 |
| セッション | ステートレス |

---

## 5. フロントエンド設計

### 5.1 ディレクトリ構成

```
frontend/
├── public/locales/        # i18n翻訳ファイル
│   ├── ja/translation.json
│   └── en/translation.json
├── src/
│   ├── components/        # UIコンポーネント
│   ├── pages/             # ページコンポーネント
│   ├── contexts/          # React Context
│   ├── hooks/             # カスタムフック
│   ├── services/          # API通信
│   ├── workers/           # Web Worker
│   ├── utils/             # ユーティリティ
│   └── types/             # TypeScript型定義
└── package.json
```

### 5.2 画面一覧

| パス | 画面名 | 認証 | 説明 |
|------|--------|------|------|
| / | ホーム | 不要 | サービスの概要と主要機能へのリンク |
| /counter | 文字数カウント | 不要 | 高機能文字数カウントツール |
| /diff | 差分比較 | 不要 | テキスト比較・差分表示ツール |
| /history | 履歴一覧 | 不要 | 保存された履歴の一覧表示 |
| /login | ログイン | 不要 | ユーザーログイン |
| /register | ユーザー登録 | 不要 | 新規ユーザー登録 |
| /profile | プロフィール | 必要 | ユーザー情報管理 |

### 5.3 レスポンシブブレークポイント

| デバイス | 幅 |
|---------|-----|
| Mobile | 〜767px |
| Tablet | 768px〜1023px |
| Desktop | 1024px〜 |

---

## 6. 国際化（i18n）設計

### 6.1 対応言語
- 日本語（ja）- デフォルト
- 英語（en）

### 6.2 実装方法
- フロントエンド: `react-i18next`
- バックエンド: Spring `MessageSource`
- 言語設定: localStorage に保存

---

## 7. デプロイ構成

### 7.1 開発環境
- PostgreSQL: Docker Compose
- Frontend: localhost:5173 (Vite dev server)
- Backend: localhost:8080

### 7.2 本番環境
- Frontend: Vercel
- Backend: Render / Railway
- Database: Neon PostgreSQL
- CI/CD: GitHub Actions

---

## 変更履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| 1.0 | 2026-01-13 | 初版作成 |

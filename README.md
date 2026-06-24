# ToLoveList

---

## 日本語

### 概要

ToLoveList は、カップル、友人、グループのための AI パーソナライズ推薦エンジンです。短いアンケートに答えるだけで、AI があなたと相手の好みを分析し、レストラン、アクティビティ、旅行先、エンターテイメントなどを提案します。

「どこに行こう？」「何をしよう？」という決断の疲れをなくし、本当に大切なひとときに集中できるようにします。

---

### 主な機能

- **AI レコメンデーション** — あなたの好みを学習し、5つのパーソナライズ提案を生成
- **カテゴリ別アンケート** — 6つのカテゴリ（フード、レジャー、トラベル、TV番組、ゲーム、本）の22問
- **マルチプロファイル** — 自分用・パートナー用に複数プロフィールを作成し好みを分離
- **グループ** — グループメンバー全員の好みを統合したレコメンデーション
- **ステータス管理** — 「完了」または「却下」マークで、次回の推薦から除外
- **位置情報対応** — ブラウザの位置情報を活用した地域密着型のおすすめ
- **複数 AI プロバイダ対応** — Anthropic Claude、OpenAI GPT、Google Gemini、OpenRouter、Ollama

---

### 技術スタック

ToLoveList は npm workspaces を使用したモノレポ構成です。

```
tolovelist/
├── shared/          # 共有型・Zodスキーマ・定数
├── server/          # Express + Prisma + PostgreSQL + AI
└── client/          # React 19 + Vite + Tailwind CSS
```

#### shared/

| 技術 | 用途 |
|---|---|
| TypeScript | 型安全な共有インターフェース |
| Zod | ランタイムバリデーションスキーマ |

サーバーとクライアント間で型・スキーマ・定数を共有し、一貫性を保証します。

#### server/

| 技術 | 用途 |
|---|---|
| Node.js / Express | HTTP サーバー、ルーティング、ミドルウェア |
| TypeScript | 型安全なバックエンド |
| Prisma | ORM（PostgreSQL → 型安全なクエリ） |
| PostgreSQL | メインデータベース（Docker Compose） |
| Zod | API 境界でのリクエストバリデーション |
| JWT (jsonwebtoken) | アクセストークン・リフレッシュトークン認証 |
| bcryptjs | パスワードハッシュ化 |
| dotenv | 環境変数管理 |

**レイヤードアーキテクチャ:**

```
Routes → Controllers → Services → Repositories → Prisma → PostgreSQL
```

各レイヤーが単一責任を持ち、テスト容易性と関心の分離を実現します。

**AI プロバイダシステム:**

```
AIProvider (interface)
├── AnthropicProvider  (Claude)
├── OpenAIProvider     (GPT-4o-mini)
├── GeminiProvider     (Gemini)
├── OpenRouterProvider
└── OllamaProvider     (ローカル)
```

環境変数 `AI_PROVIDER` で切り替え可能。各プロバイダは同じ `chat()` と `chatWithTools()` インターフェースを実装します。

ワークフロー:
1. ユーザーの回答をプロンプトに変換
2. 対象カテゴリの system prompt + user prompt を構築
3. AI がツール（Web検索・周辺検索）を使用して情報収集
4. 応答を JSON としてパースしデータベースに保存

**データベースモデル:**

```
User → Profile → Answer → Question → Category
     → Group → GroupProfile
     → Recommendation → Category
     → RecommendationHistory
     → RefreshToken
```

#### client/

| 技術 | 用途 |
|---|---|
| React 19 (RC) | UI ライブラリ |
| TypeScript | 型安全なフロントエンド |
| Vite | ビルドツール・開発サーバー |
| Tailwind CSS | ユーティリティファーストスタイリング |
| TanStack React Query | サーバーステート管理・キャッシュ |
| Zustand | クライアントステート管理 |
| React Router v6 | ルーティング |
| Framer Motion | アニメーション |

**コンポーネント構成:**

```
Pages (Routing)
├── Landing / Login / Register
├── Dashboard
├── Questionnaires
├── Recommendations
│   ├── Hub (カテゴリグリッド)
│   ├── Feed (個人別)
│   └── Detail (グループ別)
├── Profiles
└── Groups
```

---

### 開発環境のセットアップ

```bash
# 1. 依存関係のインストール
npm install

# 2. 環境変数の設定
cp .env.example .env
# .env に必要なシークレットを記入

# 3. PostgreSQL の起動（Docker）
docker compose up -d postgres

# 4. データベースのセットアップ
npm run db:push
npm run db:seed

# 5. 開発サーバーの起動
npm run dev
# → Server (port 4000) + Client (port 5173) が自動起動
```

---

## English

### Overview

ToLoveList is an AI-powered personalized recommendation engine for couples, friends, and groups. By answering a short questionnaire, the AI analyzes your preferences and suggests restaurants, activities, travel destinations, and entertainment tailored to what you and your partner love.

It eliminates decision fatigue around "Where should we go?" and "What should we do?", letting you focus on what truly matters — spending quality time together.

---

### Key Features

- **AI Recommendations** — Learns your taste and generates 5 personalized suggestions per category
- **Category Questionnaires** — 22 questions across 6 categories (Food, Leisure, Travel, TV Shows, Games, Books)
- **Multi-Profile** — Create separate profiles for yourself and your partner to keep preferences distinct
- **Groups** — Combine preferences from all group members for shared recommendations
- **Status Tracking** — Mark recommendations as "Completed" or "Dismissed" to exclude them from future rounds
- **Location-Aware** — Uses browser geolocation for local recommendations
- **Multi-Provider AI** — Supports Anthropic Claude, OpenAI GPT, Google Gemini, OpenRouter, and local Ollama

---

### Tech Stack

ToLoveList is a monorepo using npm workspaces.

```
tolovelist/
├── shared/          # Shared types, Zod schemas, constants
├── server/          # Express + Prisma + PostgreSQL + AI
└── client/          # React 19 + Vite + Tailwind CSS
```

#### shared/

| Tech | Purpose |
|---|---|
| TypeScript | Type-safe shared interfaces |
| Zod | Runtime validation schemas |

Guarantees consistency between server and client by sharing types, schemas, and constants.

#### server/

| Tech | Purpose |
|---|---|
| Node.js / Express | HTTP server, routing, middleware |
| TypeScript | Type-safe backend |
| Prisma | ORM (PostgreSQL → type-safe queries) |
| PostgreSQL | Main database (Docker Compose) |
| Zod | Request validation at API boundaries |
| JWT (jsonwebtoken) | Access + refresh token auth |
| bcryptjs | Password hashing |
| dotenv | Environment variable management |

**Layered Architecture:**

```
Routes → Controllers → Services → Repositories → Prisma → PostgreSQL
```

Each layer has a single responsibility, enabling testability and separation of concerns.

**AI Provider System:**

```
AIProvider (interface)
├── AnthropicProvider  (Claude)
├── OpenAIProvider     (GPT-4o-mini)
├── GeminiProvider     (Gemini)
├── OpenRouterProvider
└── OllamaProvider     (local)
```

Switchable via the `AI_PROVIDER` env variable. All providers implement the same `chat()` and `chatWithTools()` interface.

Workflow:
1. User answers are converted into prompts
2. Category-specific system + user prompts are constructed
3. AI optionally uses tools (web search, nearby places) to gather real-time info
4. Response is parsed as JSON and persisted to the database

**Database Models:**

```
User → Profile → Answer → Question → Category
     → Group → GroupProfile
     → Recommendation → Category
     → RecommendationHistory
     → RefreshToken
```

#### client/

| Tech | Purpose |
|---|---|
| React 19 (RC) | UI library |
| TypeScript | Type-safe frontend |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| TanStack React Query | Server state & caching |
| Zustand | Client state management |
| React Router v6 | Routing |
| Framer Motion | Animations |

**Component Architecture:**

```
Pages (Routing)
├── Landing / Login / Register
├── Dashboard
├── Questionnaires
├── Recommendations
│   ├── Hub (category grid)
│   ├── Feed (individual)
│   └── Detail (group)
├── Profiles
└── Groups
```

---

### Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in secrets in .env

# 3. Start PostgreSQL (Docker)
docker compose up -d postgres

# 4. Set up the database
npm run db:push
npm run db:seed

# 5. Start the dev servers
npm run dev
# → Server (port 4000) + Client (port 5173) start concurrently
```

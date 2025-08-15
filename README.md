# Finance Frontend

家庭の財務支出記録を管理するためのWebアプリケーションです。

## 機能

- 📊 Excelスタイルの費用支出テーブル表示
- 💰 現金・デジタル支払いの色分け表示
- 📅 日付フォーマット（YYYY-MM-DD）
- 💵 金額の会計形式表示（カンマ区切り）
- 💬 コメント列のツールチップ機能
- 🎨 カスタムCSSスタイリングシステム
- 📱 レスポンシブデザイン

## 技術スタック

### フロントエンド
- **React 19** - UIライブラリ
- **TypeScript** - 型安全な開発
- **Vite** - 高速なビルドツール
- **Tailwind CSS** - ユーティリティファーストCSSフレームワーク

### バックエンド
- **Express.js** - Node.js Webフレームワーク
- **MySQL2** - MySQLデータベース接続
- **CORS** - クロスオリジンリクエスト対応

## プロジェクト構造

```
finance-frontend/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   └── ExpenseTable.tsx # 費用テーブルコンポーネント
│   ├── pages/               # ページコンポーネント
│   │   └── ExpensePage.tsx  # メインページ
│   ├── services/            # APIサービス
│   │   └── databaseService.ts
│   ├── styles/              # スタイルファイル
│   │   ├── common.css       # 共通スタイル
│   │   └── README.md        # スタイル使用ガイド
│   └── main.tsx             # アプリケーションエントリーポイント
├── server.js                # Express.jsサーバー
├── vite.config.ts           # Vite設定
└── tailwind.config.js       # Tailwind CSS設定
```

## セットアップ

### 前提条件
- Node.js (v18以上)
- MySQL データベース

### インストール

1. **リポジトリをクローン**
```bash
git clone https://github.com/EchoesAct3/finance-frontend.git
cd finance-frontend
```

2. **依存関係をインストール**
```bash
npm install
```

3. **データベース設定**
`server.js`ファイルでMySQL接続情報を設定：
```javascript
const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  database: 'family_finances',
  user: 'root',
  password: 'your_password'
};
```

## 実行方法

### 開発モード（フロントエンド + バックエンド）
```bash
npm run dev:full
```

### 個別実行

**フロントエンドのみ**
```bash
npm run dev
```
- URL: http://localhost:5173

**バックエンドのみ**
```bash
npm run server
```
- URL: http://localhost:3001

### 本番ビルド
```bash
npm run build
```

## API エンドポイント

- `GET /api/expenses` - 費用データの取得
- `GET /api/health` - サーバー健康チェック

## スタイリングシステム

プロジェクトには統一されたスタイリングシステムが含まれています：

- **共通CSS変数** - 色やサイズの統一
- **コンポーネントスタイル** - テーブル、ボタン、カード等
- **レスポンシブデザイン** - モバイル対応
- **アニメーション** - スムーズなUI効果

詳細は `src/styles/README.md` を参照してください。

## 開発者向け情報

### データベースビュー
このアプリケーションは `family_finances.tmnt_expenses_view` ビューを使用します。

### カスタマイズ
- テーブル列の表示/非表示は `ExpenseTable.tsx` で設定
- スタイルの変更は `src/styles/common.css` で管理
- 色の変更はCSS変数で統一管理

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献

プルリクエストやイシューの報告を歓迎します。

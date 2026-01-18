# GitHub Pagesでの公開手順（詳細版）

このドキュメントでは、「カスタマイズ検索くん」をGitHub Pagesで公開する手順を詳しく説明します。

## 📋 前提条件

- GitHubアカウントを持っていること
- Gitがインストールされていること（確認: `git --version`）

## 🚀 ステップバイステップガイド

### ステップ1: GitHubにリポジトリを作成

1. **GitHubにログイン**
   - https://github.com にアクセス
   - ログインします

2. **新しいリポジトリを作成**
   - 右上の「+」ボタンをクリック → 「New repository」を選択
   - または https://github.com/new に直接アクセス

3. **リポジトリの設定**
   - **Repository name**: `custom-search-kun`（任意の名前でOK）
   - **Description**: `カスタマイズ可能な検索ツール`（任意）
   - **Public**を選択（無料でGitHub Pagesを使用するため）
   - **Initialize this repository with:**のチェックボックスは全て外す
   - 「Create repository」をクリック

### ステップ2: ローカルでGitリポジトリを初期化

プロジェクトフォルダで以下のコマンドを実行します：

```bash
# Gitリポジトリの初期化
git init

# すべてのファイルをステージング
git add .

# 最初のコミット
git commit -m "Initial commit: カスタマイズ検索くんの初回リリース"

# デフォルトブランチをmainに設定
git branch -M main
```

### ステップ3: GitHubにプッシュ

GitHubのリポジトリページに表示されているコマンドを使用します：

```bash
# リモートリポジトリを追加（あなたのユーザー名とリポジトリ名に置き換えてください）
git remote add origin https://github.com/あなたのユーザー名/custom-search-kun.git

# コードをプッシュ
git push -u origin main
```

**例:**
```bash
git remote add origin https://github.com/yamada-taro/custom-search-kun.git
git push -u origin main
```

### ステップ4: GitHub Pagesを有効化

1. **GitHubのリポジトリページにアクセス**
   - `https://github.com/あなたのユーザー名/custom-search-kun`

2. **Settingsタブをクリック**
   - リポジトリページの上部メニューにあります

3. **Pagesセクションに移動**
   - 左サイドバーの「Pages」をクリック

4. **ソースの設定**
   - **Source**セクションで「Deploy from a branch」を選択
   - **Branch**で「main」を選択
   - フォルダは「/ (root)」を選択
   - 「Save」をクリック

5. **デプロイを待つ**
   - 数分待つと、ページ上部に緑色のボックスが表示されます
   - 「Your site is live at https://あなたのユーザー名.github.io/custom-search-kun/」

### ステップ5: 公開されたサイトにアクセス

ブラウザで以下のURLにアクセスします：

```
https://あなたのユーザー名.github.io/リポジトリ名/
```

**例:**
```
https://yamada-taro.github.io/custom-search-kun/
```

🎉 **おめでとうございます！あなたのサイトが公開されました！**

## 🔄 更新方法

コードを修正した後、以下のコマンドで更新できます：

```bash
# 変更をステージング
git add .

# コミット
git commit -m "機能追加: ○○を実装"

# プッシュ
git push
```

プッシュ後、GitHub Pagesが自動的に更新されます（数分かかる場合があります）。

## 🛠️ トラブルシューティング

### サイトが表示されない場合

1. **404エラーが出る**
   - GitHub PagesのURLが正しいか確認
   - デプロイが完了するまで数分待つ
   - Settings > Pages でデプロイ状況を確認

2. **スタイルが適用されない**
   - ブラウザのキャッシュをクリア（Ctrl+Shift+Del）
   - 開発者ツール（F12）でエラーを確認

3. **変更が反映されない**
   - GitHub Pagesのキャッシュがクリアされるまで待つ（最大10分）
   - ハードリフレッシュ（Ctrl+F5）を試す

### 認証エラーが出る場合

GitHubのパーソナルアクセストークンを使用してください：

1. GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. 「Generate new token」をクリック
3. `repo`権限を選択してトークンを生成
4. パスワードの代わりにトークンを使用

または、SSH keyを設定することもできます。

## 📞 サポート

問題が解決しない場合は、以下を確認してください：

- GitHub Pages公式ドキュメント: https://docs.github.com/pages
- リポジトリのActionsタブでビルドログを確認
- ブラウザの開発者ツールでエラーメッセージを確認

## 🎯 次のステップ

サイトが公開されたら：

1. ✅ 検索サイトをカスタマイズ
2. ✅ エクスポート機能でバックアップ
3. ✅ 友人や同僚にURLを共有
4. ✅ 必要に応じて機能を追加・改善

---

**最終更新日**: 2026-01-18

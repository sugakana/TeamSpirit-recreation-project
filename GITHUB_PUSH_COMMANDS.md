# GitHubプッシュコマンド

## リポジトリ作成後の手順

GitHubで「Create repository」ボタンをクリックした後、以下のコマンドを順番に実行してください：

### 1. リモートリポジトリを追加

```powershell
git remote add origin https://github.com/sugakana/TeamSpirit-recreation-project.git
```

### 2. ブランチ名をmainに変更（必要に応じて）

```powershell
git branch -M main
```

### 3. コードをプッシュ

```powershell
git push -u origin main
```

## 認証について

プッシュ時に認証が求められる場合：

1. **ユーザー名**: `sugakana` を入力
2. **パスワード**: GitHubのPersonal Access Token (PAT) を入力
   - パスワードではなく、Personal Access Tokenが必要です
   - まだ作成していない場合は、以下の手順で作成：
     - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
     - 「Generate new token (classic)」をクリック
     - 「repo」スコープにチェック
     - トークンを生成してコピー
     - パスワードの代わりにこのトークンを使用

## すべてのコマンドを一度に実行

```powershell
git remote add origin https://github.com/sugakana/TeamSpirit-recreation-project.git
git branch -M main
git push -u origin main
```

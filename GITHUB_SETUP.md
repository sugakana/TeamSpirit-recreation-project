# GitHub管理セットアップガイド

## 現在の状態

✅ Gitリポジトリの初期化が完了しました
✅ `.gitignore`ファイルを作成しました
✅ 初回コミットが完了しました

## 次のステップ：GitHubリポジトリの作成とプッシュ

### 1. GitHubでリポジトリを作成

1. [GitHub](https://github.com)にログインします
2. 右上の「+」ボタンをクリック → 「New repository」を選択
3. リポジトリ名を入力（例：`TeamSpirit再現企画` または `teamspirit-attendance-system`）
4. 説明を追加（オプション）
5. **Public** または **Private** を選択
6. **「Initialize this repository with a README」はチェックしない**（既にローカルにリポジトリがあるため）
7. 「Create repository」をクリック

### 2. リモートリポジトリを追加

GitHubでリポジトリを作成したら、以下のコマンドを実行してください：

```powershell
# リモートリポジトリを追加（YOUR_USERNAMEとYOUR_REPO_NAMEを実際の値に置き換えてください）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 例：
# git remote add origin https://github.com/yourusername/teamspirit-attendance-system.git
```

### 3. コードをプッシュ

```powershell
# メインブランチをプッシュ
git branch -M main
git push -u origin main
```

### 4. 認証について

GitHubへのプッシュ時に認証が求められる場合：

- **Personal Access Token (PAT) を使用する場合**：
  1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. 「Generate new token」をクリック
  3. 必要な権限（repo）を選択してトークンを生成
  4. パスワードの代わりにこのトークンを使用

- **GitHub CLIを使用する場合**：
  ```powershell
  gh auth login
  ```

## 今後の作業フロー

### 変更をコミットしてプッシュ

```powershell
# 変更をステージング
git add .

# コミット
git commit -m "変更内容の説明"

# プッシュ
git push origin main
```

### ブランチを作成して作業

```powershell
# 新しいブランチを作成
git checkout -b feature/新機能名

# 変更をコミット
git add .
git commit -m "新機能の実装"

# ブランチをプッシュ
git push origin feature/新機能名
```

## 注意事項

⚠️ **機密情報はコミットしないでください**
- `.env`ファイル（データベースパスワードなど）
- `credentials.env`ファイル
- 個人情報を含むファイル

これらは`.gitignore`に含まれているため、自動的に除外されます。

## トラブルシューティング

### リモートリポジトリを変更したい場合

```powershell
# 既存のリモートを削除
git remote remove origin

# 新しいリモートを追加
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### プッシュが拒否される場合

```powershell
# リモートの変更を取得
git pull origin main --allow-unrelated-histories

# その後、再度プッシュ
git push origin main
```



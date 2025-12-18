# 自動APIテスト 実行プロンプト（JavaScript 実行前提）

私はテスト用コードを事前に用意しません。あなた（Cursor）は **JavaScript** を直接実行して、**プロンプトで指定されたAPIテスト仕様書** からテストケースを抽出し、確実にテストを実行し、結果とエビデンスを保存してください。

## 使用方法
- プロンプトで具体的なテスト仕様書ファイルを指定してください
- 例: 「`docs/tests/api/login-test-spec.md` のテストを実行してください」
- 例: 「`docs/tests/api/login-test-spec.md` と `docs/tests/api/create-account-test-spec.md` のテストを実行してください」

## 重要な制約事項
- **JavaScript 直接実行**を想定しています
- **Node.js 環境**での実行を前提としています
- **必要なパッケージのインストール**が必要です
- **設定ファイルの作成**が必要です

- **必須前提**:
- **Node.js** がインストールされていること
- **JavaScript** が実行可能な環境であること
- **AWS CLI** がインストールされ、`aws configure`で認証情報が設定されていること（認証情報取得用のみ）
- **必要なパッケージ** をインストールすること（aws-sdkを含む）
- **package.json** の作成が必要です
- **node_modules** ディレクトリの作成が必要です
- テストの生成・実行は **ローカル環境** で完結させること
- **AWS認証情報**: AWS CLI設定済みユーザーは追加設定不要（自動取得）
- **AWS CLI使用**: AWS CLIは認証情報取得のみに使用、DynamoDB操作はAWS SDKのみ使用

## 対象
- 仕様書: **プロンプトで指定された** `docs/tests/api/*.md` ファイル
  - 各仕様書には以下が記載されている（値は含めない）  
    - アクセスポイント（URL またはパス）  
    - アクセスメソッド（GET/POST/PUT/DELETE 等）  
    - 認証要否（APIキー必要 / アクセストークン必要 / 不要）
- 認証値（実値の所在）:  
  **`.cursor\rules\R05_UT_Test\R0502_Api_Test_Automation\credentials.env`** からCursorが事前に読み取り、テストコード生成時に直接埋め込むこと。  
  仕様書に値は書かない。

### `credentials.env` フォーマット
- 1行1設定の **KEY=VALUE** 形式（UTF-8 / BOMなし）
API_KEY=xxxxx
ACCESS_TOKEN=yyyyy

- 使用ルール：
  - 仕様書が相対パスの場合は `BASE_URL + パス` で解決。
  - 「APIキー必要」とあれば `x-api-key: ${API_KEY}` を自動付与。
  - 「アクセストークン必要」とあれば `Authorization: Bearer ${ACCESS_TOKEN}` を自動付与。
  - 任意ヘッダーが必要な場合は、仕様書に**ヘッダー名だけ**明記し、値は `credentials.env` から解決。
  - **重要**: Cursorが事前に`credentials.env`ファイルから値を読み取り、テストケースJSONとJavaScriptテストファイルに直接埋め込むこと。

## 実施フロー

### ステップ1: テストケース抽出とファイル化
1. **仕様書と実装コードの読み込み**  
   - **プロンプトで指定された** `docs/tests/api/*.md` ファイルを読み込む
   - 対応する実装コードを `FaceHealthStoreLambda/<API名>/lambda_function.py` から読み込む
   - 各ファイルから以下を抽出：
     - URL/メソッド/認証要否
     - 「テスト仕様書」「バリエーション」テーブルの**すべてのテストケース**
     - **「確認対象」列の値**（各テストケースごとに抽出）
       - 例: 「レスポンス」「レスポンス・DB」「レスポンス・DB・メール」など
       - この値を`confirmationTarget`フィールドに設定
       - 「メール」が含まれている場合は`emailVerification`フィールドを追加
     - 実装コードから実際のリクエスト/レスポンス構造、エラーハンドリング、バリデーション処理

2. **API名の取得**  
   - テスト仕様書ファイル名から`-test-spec.md`を除いた部分をAPI名として取得
   - 例: `add-admin-info-test-spec.md` → API名は `add-admin-info`
   - 例: `login-test-spec.md` → API名は `login`

3. **既存ファイルの確認（スキップ判定）**  
   - **テストケースファイル**: `docs/tests/api_results/<API名>/code/<API名>-test-cases.json`
   - **テストコードファイル**: `docs/tests/api_results/<API名>/code/<API名>.test.js`
   - **実行環境ファイル**: `docs/tests/api_results/<API名>/code/package.json`および`node_modules`
   - **重要**: テストケースファイルとテストコードファイルが既に存在する場合は、ステップ1とステップ3の作成工程をスキップ
   - **重要**: 実行環境（package.jsonとnode_modules）が既に存在する場合は、ステップ2のプロジェクト初期化をスキップ
   - **スキップ時のログ**: 
     - テストファイル: 「既存のテストケースファイルとテストコードファイルが見つかりました。作成工程をスキップします。」
     - 実行環境: 「既存のJavaScript実行環境が見つかりました。プロジェクト初期化をスキップします。」
   - **スキップしない場合**: ファイルが存在しない場合は新規作成

4. **テストケースファイルの生成**（既存ファイルがない場合のみ）  
   - 仕様書と実装コードの両方を参考にして、テストケースを `docs/tests/api_results/<API名>/code/` に個別ファイルとして保存
   - ファイル名: `<API名>-test-cases.json`
   - **重要**: ファイルパスは絶対パスを使用して固定すること（プロジェクトルートからの相対パス）
   - **重要**: codeディレクトリ内に保存すること（API名は上記で取得した値を使用）
   - **メール送信検出ロジック**:
     - 各テストケースの`confirmationTarget`フィールド（テスト仕様書の「確認対象」列から抽出）を確認
     - `confirmationTarget`に「メール」という文字列が含まれている場合、`emailVerification`フィールドを追加
     - **判定例**:
       - `"confirmationTarget": "レスポンス・DB・メール"` → メール確認**必要**
       - `"confirmationTarget": "メール・DB"` → メール確認**必要**
       - `"confirmationTarget": "レスポンス・メール"` → メール確認**必要**
       - `"confirmationTarget": "レスポンス・DB"` → メール確認**不要**
       - `"confirmationTarget": "レスポンス"` → メール確認**不要**
     - **メールアドレスフィールドパスの検出**:
       - リクエストボディからメールアドレスが含まれるフィールドを検出
       - 検出優先順位:
         1. `adminInfo.adminUserId`（フィールド名に`userId`を含み、値が`@`を含む場合）
         2. `email`（フィールド名そのもの）
         3. `userId`（値が`@`を含む場合）
         4. その他、値に`@`を含むフィールド（ネストされたオブジェクトも含む）
     - **emailVerificationフィールドの構造**:
       ```json
       "emailVerification": {
         "required": true,
         "recipientPath": "adminInfo.adminUserId",
         "description": "仮パスワード通知メール"
       }
       ```
   - 各テストケースファイルには以下を確実に含める：
   
   **同時にテストデータファイルを生成**:
   - テスト仕様書の「事前データ」セクションから抽出したテストデータをDynamoDB JSON形式で保存
   - ファイル名: `<API名>-test-data.json`
   - DynamoDB JSON形式で保存（`{S: "値"}`, `{N: "数値"}` 形式）
   - 各テストケースで必要なテストデータを配列形式で保存
   - **重要**: AWS SDKの`putItem`で直接使用できる形式で保存
   - **例**:
     ```json
     [
       {
         "tableName": "facerec-stg-organization-information",
         "item": {
           "ORGANIZATION_ID": {"S": "OZ000"},
           "ORGANIZATION_NAME": {"S": "テスト組織"},
           "CREATE_DATE": {"S": "2025-01-01T00:00:00.000Z"},
           "UPDATE_DATE": {"S": "2025-01-01T00:00:00.000Z"}
         },
         "primaryKey": {
           "ORGANIZATION_ID": {"S": "OZ000"}
         }
       }
     ]
     ```
   
   各テストケースファイルには以下を確実に含める：
     ```json
     {
       "testCases": [
         {
           "caseId": "TC001",
           "description": "テストケースの説明",
           "request": {
             "method": "POST",
             "url": "https://api.example.com/login",
             "headers": {
               "Content-Type": "application/json",
               "x-api-key": "NZHuBqBOIw80dILt7URwG8y8Wso7xaJ55GtOrq0I"
             },
             "body": {
               "email": "test@example.com",
               "password": "password123"
             }
           },
           "expectedResponse": {
             "status": 200,
             "body": {
               "statusCode": 200,
               "returnCode": "I00000",
               "returnMessage": "ログインに成功しました"
             }
           },
          "confirmationTarget": "レスポンス・DB・メール",
          "isDbUpdateOperation": true,
          "tableName": "facerec-stg-client-admin-information",
          "emailVerification": {
            "required": true,
            "recipientPath": "adminInfo.adminUserId",
            "description": "仮パスワード通知メール"
          },
           "primaryKeys": {
             "ORGANIZATION_ID": "organizationId",
             "ADMIN_USER_ID": "adminUserId"
           },
           "validationFields": [
             {
               "dbKey": "USER_FAMILY_NAME",
               "requestPath": "adminInfo.userFamilyName"
             },
             {
               "dbKey": "USER_FIRST_NAME", 
               "requestPath": "adminInfo.userFirstName"
             }
           ],
           "testData": [
             {
               "tableName": "facerec-stg-organization-information",
               "item": {
                 "ORGANIZATION_ID": {"S": "OZ000"},
                 "ORGANIZATION_NAME": {"S": "テスト組織"}
               }
             }
           ]
         }
       ]
     }
     ```

### ステップ2: プロジェクト初期化（既存環境がない場合のみ）
5. **実行環境の確認**:
   - `docs/tests/api_results/<API名>/code/`ディレクトリの存在確認
   - `package.json`ファイルの存在確認
   - `node_modules`ディレクトリの存在確認
   - **重要**: 上記が全て存在する場合は、このステップ全体をスキップ

6. **package.jsonの作成**（既存環境がない場合のみ）:
   - `docs/tests/api_results/<API名>/code/`ディレクトリを作成
   - テスト用のpackage.jsonを`code`ディレクトリ内に作成
   - 必要な依存関係を定義（axios, @types/node, dotenv, aws-sdk等）
   - **重要**: `aws-sdk`パッケージを必ず含める（AWS SDK for JavaScript用）

7. **必要なパッケージのインストール**（既存環境がない場合のみ）:
   - `code`ディレクトリに移動
   - `npm install` でパッケージをインストール
   - `node_modules`が`code`ディレクトリ内に生成される

### ステップ3: JavaScriptテストファイル生成
8. **テストファイル生成**（既存ファイルがない場合のみ）  
   - テストケースファイルを読み込み、**JavaScript（.js）** ファイルを生成
   - **生成先**: `docs/tests/api_results/<API名>/code/<API名>.test.js`（codeディレクトリ内）
   - **重要**: ステップ1で既存ファイルがあると判定された場合は、この工程もスキップ
   - **重要**: 各テストケースを個別の `test()` 関数として生成
   - **必須**: テストファイルは必ず **JavaScript（.js）** 形式で作成すること
   - **必須**: axios等のHTTPライブラリを使用してAPIテストを実装すること
   - **必須**: テストケースファイルは同じディレクトリ内（codeディレクトリ）にあるため、相対パスで参照
   - **必須**: `node_modules`は同じディレクトリ内にあるため、相対パスで参照
  - **必須**: SSL証明書の検証を無効にする設定を含めること
  - **必須**: `fs` モジュールを使用してMarkdownファイルを生成すること
  - **必須**: `child_process` モジュールを使用してAWS CLIコマンドを実行すること
  - **必須**: `package.json`、`tsconfig.json` 等の設定ファイルの作成が必要
  - **必須**: Cursorが事前に`credentials.env`から認証情報を読み取り、テストケースJSONとJavaScriptテストファイルに直接埋め込むこと
  - **必須**: AWS確認工程のログをテスト結果に含めること：
    - AWS確認工程が実行された場合、すべてのログを収集してテスト結果に保存
    - AWS認証情報確認、テーブル一覧確認、DynamoDBデータ取得、データ検証の各ログを含める
    - エラーが発生した場合はエラーメッセージとスタックトレースも含める
    - 日本語データの文字化け等の問題も含めて、すべての詳細を記録する

### ステップ4: 認証・共通設定の適用
9. **認証情報の適用**  
   - `credentials.env` を読み込む
   - 仕様書がフルURLでない場合、`BASE_URL` を前置
   - 認証要否に応じて `x-api-key` / `Authorization` を自動付与
   - 追加ヘッダーが仕様書に**名前だけ**列挙されていれば、`credentials.env` の同名キーから値を取り、注入

### ステップ5: テスト実行
10. **実行（JavaScript 直接実行）**  
  - **Node.js環境でJavaScriptテストファイルを直接実行する**
  - **実行ディレクトリ**: `docs/tests/api_results/<API名>/code/`（テストコードファイルがある場所）
  - **node_modules参照**: 同じディレクトリ内の`node_modules`を使用
  - **実行コマンド例**: `node --no-warnings <API名>.test.js`
    - `--no-warnings`フラグ: ES Module警告やAWS SDK v2メンテナンスモード通知を抑制
  - axios等のHTTPライブラリを使用してAPIテストを実行
  - テスト実行後、`fs` モジュールを使用してMarkdownファイルを生成する
  - AWS確認工程（DB確認対象の場合）を実行する
  - タイムアウト/リトライ/並列数は「実行ポリシー（既定値）」を適用
   - **正常系テストの優先実行**:
     - 正常系テスト（TC021等）が失敗した場合、APIの実装に問題がある可能性がある
     - 正常系テストが成功するまで、異常系テストの結果は参考程度として扱う
   - **🚫 絶対禁止**: Windows PowerShellで`&&`を使用したコマンド連結は行わない

### ステップ6: 結果保存と報告
11. **保存と報告**  
   - **JavaScriptによるファイル生成**:
     - テスト実行スクリプト内でJavaScriptを使用して結果ファイルを生成する
     - `fs` モジュールと`path`モジュールを使用してMarkdownファイルを直接作成する
     - **必須**: 絶対パスを使用して`docs/tests/api_results/<API名>/results/`に確実に保存する
     - **必須**: 保存先ディレクトリが存在しない場合は自動作成する
     - **重要**: テスト結果ファイルとAWSログファイルは`results`サブディレクトリに保存
   - **見やすいサマリーファイルの生成**:
     - `test-results-summary-<RUN_ID>.md`: 全体のテスト結果をMarkdown形式で見やすくまとめ（メインファイル）
     - **保存先**: `docs/tests/api_results/<API名>/results/`
     - すべてのテスト結果情報をこの1つのファイルに集約
     - **必須**: **すべてのテストケース**（成功・失敗問わず）の詳細を必ず記載する
     - **必須**: 各テストケースに期待レスポンスと実際レスポンスを並べて記載
     - **必須**: 各テストケースの実行ログをそのままコピペして記載
     - **必須**: AWS確認工程が実行された場合は、**AWS確認結果の詳細ログを必ず記載する**
     - **必須**: 全体の実行ログサマリーを最後に記載
     - **重要**: テストケースの記載漏れは絶対に避けること
     - **重要**: AWS確認工程のログ漏れも絶対に避けること
   - **JavaScript実行ログの取得**:
    - Node.js環境でのJavaScript実行時に出力される実際のログを取得する
     - 生成したログではなく、Node.jsが実際に出力するログを使用する
     - コンソール出力、テスト実行ログ、エラーメッセージ等をそのまま記録する
   - 実行完了後、失敗ケースの要約・エビデンスパスを報告する

## 実行ポリシー（既定値）
- タイムアウト: 10,000ms  
- リトライ: 429/5xx を最大 2 回、500ms 間隔  
- レート制限: 1 秒あたり 最大 5 リクエスト  
- 並列実行: 4 ワーカー  
- 環境変数置換: 仕様書内 `${NAME}` は `credentials.env`（→必要に応じて Cursor 環境変数）で上書き
- **実行環境対応**:
  - 実行環境はWindows PowerShellを想定
  - コマンド実行時は`&&`を使用せず、個別のコマンドとして実行
  - API Gatewayを利用しているため、直接URLにアクセスすると403エラーとなる
  - **必須**: axios等のHTTPライブラリを使用してAPIテストを実行し、直接URLアクセスは絶対に避ける

## 保存規約（必須）
- **ルート**: `docs/tests/api_results/<API名>/`（API名ごとのディレクトリ）
  - `<API名>`は、テスト仕様書ファイル名から`-test-spec`を除いた部分
  - 例: `add-admin-info-test-spec.md` → `docs/tests/api_results/add-admin-info/`
  - 例: `login-test-spec.md` → `docs/tests/api_results/login/`
- **ディレクトリ構造**:
  ```
  docs/tests/api_results/<API名>/
  ├── <API名>-test-data.json           （既存の場合はスキップ）
  ├── code/                             （JavaScript実行環境用ディレクトリ）
  │   ├── <API名>-test-cases.json      （既存の場合はスキップ）
  │   ├── <API名>.test.js               （既存の場合はスキップ）
  │   ├── package.json                  （既存の場合はスキップ）
  │   ├── package-lock.json             （npm install実行時に自動生成）
  │   └── node_modules/                 （既存の場合はnpm installスキップ）
  └── results/                          （テスト実行結果用サブディレクトリ）
      ├── aws-log-<RUN_ID>.md
      └── test-results-summary-<RUN_ID>.md
  ```
- **生成物**（7つのファイル/ディレクトリ）:
  1. **テストデータファイル**: `<API名>-test-data.json`（API名ディレクトリ直下）
     - 既存の場合は作成スキップ
  2. **実行環境ディレクトリ**: `code/`（API名ディレクトリ直下）
  3. **テストケースファイル**: `code/<API名>-test-cases.json`（codeディレクトリ内）
     - 既存の場合は作成スキップ
  4. **テストコードファイル**: `code/<API名>.test.js`（codeディレクトリ内）
     - 既存の場合は作成スキップ
  5. **package.json**: `code/package.json`
     - 既存の場合は作成スキップ
  6. **node_modules**: `code/node_modules`
     - 既存の場合はnpm installスキップ
  5. **AWSログファイル**: `aws-log-<RUN_ID>.md`（resultsサブディレクトリ）
     - 毎回新規作成（スキップしない）
     - Markdown形式で出力
  6. **テスト結果ファイル**: `test-results-summary-<RUN_ID>.md`（resultsサブディレクトリ）
     - 毎回新規作成（スキップしない）
     - Markdownフォーマットが崩れないように出力
- **ファイル名の`<RUN_ID>`**: `YYYYMMDD-HHMMSS`形式（日本時間）
- **既存成果物**: 
  - テストケースファイル、テストデータファイル、テストコードファイルは既存の場合スキップ
  - AWSログファイル、テスト結果ファイルは毎回新しいファイル名で作成（上書きしない）
- **絶対パス使用**: ファイル生成時は必ず絶対パスを使用して場所を固定する（プロジェクトルートからの相対パス）
- **ディレクトリ自動作成**: 保存先ディレクトリが存在しない場合は自動作成する
- **注意**: `summary.json`、`request.json`、`response_meta.json`、`response.txt`、`response.json`、`test-case-detail.md` 等の個別ファイルは生成しない

## テストケース抽出ルール
- **テスト仕様書テーブル**: 概要と件数
- **バリエーションテーブル**: 個別の入力と想定結果
  - 各行を個別のテストケースとして扱う
  - リクエスト用JSONとレスポンス想定JSONを確実に含める
- **実装コード参照**: `FaceHealthStoreLambda/<API名>/lambda_function.py` から以下を抽出
  - 実際のリクエストパラメータ構造（event['body']の解析）
  - 実際のレスポンス構造（return文の形式）
  - エラーハンドリングの実装（try-catch文、エラーメッセージ）
  - バリデーション処理（入力値チェック、必須項目確認）
  - データベースアクセス処理（DynamoDB操作）
- **テーブル定義参照**: `.cursor/rules/R05_UT_Test/R0502_Api_Test_Automation/テーブル定義.md` から以下を抽出
  - DynamoDBテーブル名とフィールド名のマッピング（AWS正式英名を使用）
  - プライマリキーとソートキーの構成
  - 各テーブルのフィールド定義（正式英名、データ型、桁数等）
  - AWS確認工程で検証すべきフィールドの特定
  - **重要**: テーブル一覧の「正式英名」列にAWS DynamoDBの実際のテーブル名が記載されている
- **文字数制限テストケースの正確性確保**:
  - 文字数制限をテストする場合、テストデータの文字数を正確に計算して生成する
  - 例：「41文字の場合」と記載されている場合は、必ず41文字の文字列を生成する
  - 例：「51文字の場合」と記載されている場合は、必ず51文字の文字列を生成する
  - 文字数計算方法：
    - 英数字の場合：`'a'.repeat(文字数)` を使用
    - 日本語の場合：`'あ'.repeat(文字数)` を使用
    - 混合の場合：指定された文字数になるよう正確に計算
  - **検証必須**: 生成したテストデータの文字数を必ず確認し、期待値と一致することを検証する
  - **実装例**:
    ```javascript
    // 41文字の氏名テストケース生成例
    const userName41Chars = 'a'.repeat(41); // 正確に41文字
    console.log('Generated userName length:', userName41Chars.length); // 41であることを確認
    
    // 51文字の管理者IDテストケース生成例
    const adminId51Chars = 'a'.repeat(51); // 正確に51文字
    console.log('Generated adminId length:', adminId51Chars.length); // 51であることを確認
    ```
- 期待値の例：
  - 「メッセージコード：E00001」→ `json.error.code === "E00001"`
  - 「正常/エラー」→ 200 / 4xx といったステータス断言
  - テキスト一致・部分一致は `equals / contains` にマップ
- **AWS関連処理（包括的DB更新処理対応）**:
  - **処理タイプの判定**:
    - **DB更新処理**: テスト仕様書の「確認対象」列に「DB」が含まれている場合
    - **テストデータ処理**: テストデータが必要な場合（事前データ、依存データ等）
    - **処理フロー**:
      1. **テストデータ事前追加**: テストデータが必要な場合、テスト実行前にAWSにテストデータを追加
      2. **テスト前DB状態取得**: DB更新処理の場合、テスト実行前にAWSのDB状態を取得
      3. **テスト実行**: APIテストを実行
      4. **テスト後DB状態取得**: DB更新処理の場合、テスト実行後にAWSのDB状態を取得
      5. **DB状態比較検証**: テスト前後のDB状態を比較して正しくデータが更新できたか確認
         - 差分があった場合は、その詳細（追加/更新/削除されたアイテム）をログに記録
  - **AWS SDK for JavaScriptを使用**: DynamoDBのデータを取得・追加・検証
    - **文字化け問題の根本的解決**: AWS SDKは内部でUTF-8エンコーディングを適切に処理
    - **認証情報の自動取得**: AWS CLI設定済みユーザーは追加設定不要
    - **堅牢性の向上**: SDKのエラーハンドリングとリトライ機能を活用
    - **AWS CLI不要**: AWS CLIは使用せず、AWS SDKのみで処理を完結
  - **重要**: AWS関連処理は正常系テスト（APIが成功した場合）のみ実行する
  - **処理詳細**:
    - **テストデータ事前追加**: 
      - テスト仕様書の「事前データ」セクションからテストデータを抽出
      - **AWS SDK使用**: `dynamodb.putItem(putItemParams).promise()`を使用
      - テストデータの追加ログを記録（JSON形式は見やすくフォーマット）
    - **テスト前DB状態取得**:
      - DB更新処理の場合、テスト実行前にDynamoDBの状態を取得
      - **AWS SDK使用**: `dynamodb.scan(scanParams).promise()`を使用
      - 全テーブルのスキャンまたは特定条件でのクエリを実行
      - 取得した状態をログに記録
    - **テスト後DB状態取得**:
      - DB更新処理の場合、テスト実行後にDynamoDBの状態を取得
      - **AWS SDK使用**: `dynamodb.scan(scanParams).promise()`を使用
      - テスト前と同じ条件で状態を取得
      - 取得した状態をログに記録
    - **DB状態比較検証**:
      - テスト前後のDB状態を比較
      - 追加・更新・削除が正しく実行されたかを検証
      - **重要**: プライマリキーを使用した正確なアイテム照合
        - プライマリキーを基準にアイテムを識別
        - 追加されたアイテム: テスト後に新しく追加されたデータ
        - 削除されたアイテム: テスト前に存在したが、テスト後に削除されたデータ
        - 更新されたアイテム: プライマリキーは同じだが内容が変更されたデータ
      - **重要**: 差分があった場合は、その詳細をログに記録
        - 追加されたアイテム: 新しく追加されたデータの完全な内容（JSON形式）
        - 削除されたアイテム: 削除されたデータの完全な内容（JSON形式）
        - 更新されたアイテム: 
          - プライマリキーの値
          - フィールド単位での変更内容（変更前/変更後を並べて表示）
          - 完全なアイテム（変更前/変更後）
      - 差分の件数と内容をログに記録（JSON形式は見やすくフォーマット）
      - **重要**: DB状態に変化がない場合もその旨を記録
  - **確認方法**:
    - **AWS SDK for JavaScriptを使用**:
      - `aws-sdk`パッケージを`package.json`に追加
      - `new AWS.DynamoDB({ region: 'ap-northeast-1', apiVersion: '2012-08-10' })`で初期化
      - 認証情報はAWS CLI設定から自動取得（追加設定不要）
      - 日本語文字化け問題の根本的解決
    - **認証情報の自動取得**:
      - AWS CLI設定済みユーザーは追加設定不要
      - `aws configure`で設定した認証情報を自動使用
      - 環境変数、認証情報ファイル、IAMロールの順で自動解決
    - 追加・更新されたデータの存在確認と内容検証を実行
  - **テストデータのクリーンアップ方針**:
    - **重要**: テストデータは追加したまま放置する方針とする
    - テスト実行後のデータ削除（クリーンアップ）は実施しない
    - これにより、テスト実行履歴が残り、データの蓄積が可能となる
- **AWS API Gateway統合レスポンス対応**:
  - **重要**: AWS API Gatewayの設定により、すべてのレスポンスでHTTPステータスコード200が返される
  - 実際のステータスコードはレスポンスボディ内の`statusCode`フィールドに含まれている
  - テスト検証ではHTTPステータスコード200は検証対象外とし、レスポンスボディ内の`statusCode`を検証する
  - レスポンスボディ内の`returnCode`、`returnMessage`、データ構造が期待値と一致していればテストを正常とする
  - **レスポンスボディの形式対応**:
    - API Gateway統合レスポンスのため、正常レスポンスであってもbodyが文字列形式（JSON文字列）であることが予想される
    - レスポンスボディが文字列形式でも、JSON.parse()で解析可能であれば構造エラーとして判定しない
    - 例：`{"statusCode": 200, "body": "{\"returnCode\": \"I00000\", \"returnMessage\": \"成功\"}"}`の場合、bodyが文字列でも正常なレスポンスとして扱う
- **必須実装**: テスト検証ロジックでは以下の処理を必ず実装すること
  ```javascript
  // レスポンスボディの解析処理
  let actualData = responseData;
  if (responseData.body && typeof responseData.body === 'string') {
    try {
      actualData = JSON.parse(responseData.body);
    } catch (e) {
      // JSON解析に失敗した場合は元のデータを使用
      actualData = responseData;
    }
  }
  
  // HTTPステータスコードの検証（API Gateway統合レスポンス対応）
  // HTTPステータスコード200は検証対象外、レスポンスボディ内のstatusCodeを検証
  if (actualData.statusCode && actualData.statusCode !== expectedStatusCode) {
    // ステータスコード不一致
  } else {
    // ステータスコード一致（またはstatusCodeフィールドが存在しない場合はスキップ）
  }
  
  // 実際のデータで検証を実行
  if (actualData.returnCode === expectedReturnCode) {
    // 正常
  }
  ```
- **日本語文字化け対策（必須）**:
  - **AWS SDK for JavaScriptを使用**:
    - AWS SDKは内部でUTF-8エンコーディングを適切に処理
    - 日本語データの文字化け問題を根本的に解決
    - 追加の環境変数設定は不要
    - AWS CLIは使用しないため、CLI関連の文字化け対策は不要
  - これにより、DynamoDBの日本語データが正しく表示される
- **SSL証明書問題の事前対応（必須）**:
  - テストファイル生成時に必ずSSL証明書の検証を無効にする設定を含める
  - axiosのデフォルト設定と個別リクエストの両方で適用する
  - 環境変数の読み込みも含める
- **テストファイル生成の必須実装**:
  ```javascript
// テストファイルの先頭に必ず含める設定
// 注意: node_modules、テストケースファイルは同じディレクトリ内にある
const https = require('https');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const AWS = require('aws-sdk'); // AWS SDK for JavaScript

// AWS SDK初期化（認証情報は自動取得）
const dynamodb = new AWS.DynamoDB({ 
  region: 'ap-northeast-1', 
  apiVersion: '2012-08-10' 
});

// ログを2系統に分離
// 1. API実行ログ: テスト結果ファイル用（リクエスト/レスポンスの詳細）
const apiExecutionLogs = [];
// 2. AWS関連ログ: AWSログファイル専用（DB操作の詳細）
const awsLogEntries = [];
  
  // SSL証明書の検証を無効にする設定（必須）
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false
  });
  
  // axiosのデフォルト設定に適用
  axios.defaults.httpsAgent = httpsAgent;
  
    // 初期化メッセージ（コンソール出力のみ、ファイルには記録しない）
    console.log('認証情報: テストケースJSONファイルから直接取得');
    console.log('AWS認証情報: AWS CLI設定から自動取得（追加設定不要）');
    console.log('実行環境: 同一ディレクトリ内のnode_modulesを使用');
    
    // テストケースファイルの読み込み（同一ディレクトリ内）
    const testCasesPath = path.resolve(__dirname, 'add-admin-info-test-cases.json');
    console.log('テストケースファイルパス:', testCasesPath);
    
    if (!fs.existsSync(testCasesPath)) {
      console.error('テストケースファイルが見つかりません:', testCasesPath);
      process.exit(1);
    }
    
    const testCases = JSON.parse(fs.readFileSync(testCasesPath, 'utf8'));
    
    // AWS関連処理ログファイルのパス（親ディレクトリのresultsサブディレクトリ）
    const runId = new Date().getFullYear().toString() +
      (new Date().getMonth() + 1).toString().padStart(2, '0') +
      new Date().getDate().toString().padStart(2, '0') + '-' +
      new Date().getHours().toString().padStart(2, '0') +
      new Date().getMinutes().toString().padStart(2, '0') +
      new Date().getSeconds().toString().padStart(2, '0');
    const awsLogFilePath = path.resolve(__dirname, '..', 'results', `aws-log-${runId}.md`);
  
   // AWS関連処理の実行関数（AWS SDKのみ使用）
   async function executeAWSProcesses(testCase) {
     const awsLogs = [];
     const timestamp = new Date().toISOString();
     
     try {
       // 1. テストデータ事前追加
       if (testCase.testData && testCase.testData.length > 0) {
         const logEntry = `\n[${timestamp}] [${testCase.caseId}] テストデータ事前追加を開始\n`;
         console.log('テストデータ事前追加を開始します...');
         awsLogs.push(logEntry);
         awsLogEntries.push(logEntry);
         
      for (const testDataItem of testCase.testData) {
        console.log('AWS SDKを使用してテストデータを追加します...');
        const putItemParams = {
          TableName: testDataItem.tableName,
          Item: testDataItem.item
        };
        const result = await dynamodb.putItem(putItemParams).promise();
        console.log('AWS SDKテストデータ追加完了:', result);
        
        const logMsg = `AWS SDKテストデータ追加: ${testDataItem.tableName}\n${JSON.stringify(testDataItem.item, null, 2)}\n`;
        awsLogs.push(logMsg);
        awsLogEntries.push(logMsg);
      }
       }
       
       // 2. テスト前DB状態取得（DB更新処理の場合）
       let beforeState = null;
       if (testCase.isDbUpdateOperation && testCase.tableName) {
         const logEntry = `\n[${timestamp}] [${testCase.caseId}] テスト前DB状態取得を開始\n`;
         console.log('テスト前DB状態取得を開始します...');
         awsLogs.push(logEntry);
         awsLogEntries.push(logEntry);
         
         console.log('AWS SDKを使用してDB状態を取得します...');
          const scanParams = {
            TableName: testCase.tableName
          };
          const result = await dynamodb.scan(scanParams).promise();
          beforeState = result;
          console.log('AWS SDKテスト前DB状態:', JSON.stringify(beforeState, null, 2));
          
          const logMsg = `AWS SDKテスト前DB状態: ${testCase.tableName}\n${JSON.stringify(result, null, 2)}\n`;
          awsLogs.push(logMsg);
          awsLogEntries.push(logMsg);
       }
       
       return { beforeState, awsLogs };
     } catch (error) {
       console.error('AWS事前処理エラー:', error.message);
       const errorLog = `AWS事前処理エラー: ${error.message}\n${error.stack}\n`;
       awsLogs.push(errorLog);
       awsLogEntries.push(errorLog);
       return { beforeState: null, awsLogs };
     }
   }
   
  // AWS事後処理の実行関数（AWS SDKのみ使用）
  // ※重要: クリーンアップ（データ削除）は実施しない。テスト後のDB状態取得と比較検証のみを行う。
  async function executeAWSPostProcess(testCase, testResult) {
    const awsLogs = [];
    const timestamp = new Date().toISOString();
    
    try {
      // 1. テスト後DB状態取得（DB更新処理の場合）
       let afterState = null;
       if (testCase.isDbUpdateOperation && testCase.tableName) {
         const logEntry = `\n[${timestamp}] [${testCase.caseId}] テスト後DB状態取得を開始\n`;
         console.log('テスト後DB状態取得を開始します...');
         awsLogs.push(logEntry);
         awsLogEntries.push(logEntry);
         
          console.log('AWS SDKを使用してDB状態を取得します...');
          const scanParams = {
            TableName: testCase.tableName
          };
          const result = await dynamodb.scan(scanParams).promise();
          afterState = result;
          console.log('AWS SDKテスト後DB状態:', JSON.stringify(afterState, null, 2));
          
          const logMsg = `AWS SDKテスト後DB状態: ${testCase.tableName}\n${JSON.stringify(result, null, 2)}\n`;
          awsLogs.push(logMsg);
          awsLogEntries.push(logMsg);
         
         // DB状態比較検証
         if (testResult.beforeState && afterState) {
           const compareLogEntry = `\n[${timestamp}] [${testCase.caseId}] DB状態比較検証を開始\n`;
           console.log('DB状態比較検証を開始します...');
           awsLogs.push(compareLogEntry);
           awsLogEntries.push(compareLogEntry);
           
           const beforeItems = testResult.beforeState.Items || [];
           const afterItems = afterState.Items || [];
           const diff = afterItems.length - beforeItems.length;
           
           console.log(`DB状態比較結果: テスト前${beforeItems.length}件 → テスト後${afterItems.length}件 (差分: ${diff}件)`);
           const compareMsg = `DB状態比較: テスト前${beforeItems.length}件 → テスト後${afterItems.length}件 (差分: ${diff}件)\n`;
           awsLogs.push(compareMsg);
           awsLogEntries.push(compareMsg);
           
           // プライマリキーを取得する関数（DynamoDBアイテムから）
           const getPrimaryKeyValue = (item, testCase) => {
             if (!testCase.primaryKeys) return null;
             const keyValues = [];
             for (const dbKey of Object.keys(testCase.primaryKeys)) {
               if (item[dbKey]) {
                 keyValues.push(item[dbKey].S || item[dbKey].N || JSON.stringify(item[dbKey]));
               }
             }
             return keyValues.join('#');
           };
           
           // アイテムをプライマリキーでマッピング
           const beforeItemsMap = new Map();
           beforeItems.forEach(item => {
             const key = getPrimaryKeyValue(item, testCase);
             if (key) beforeItemsMap.set(key, item);
           });
           
           const afterItemsMap = new Map();
           afterItems.forEach(item => {
             const key = getPrimaryKeyValue(item, testCase);
             if (key) afterItemsMap.set(key, item);
           });
           
           // 追加されたアイテムを検出
           const addedItems = [];
           afterItemsMap.forEach((item, key) => {
             if (!beforeItemsMap.has(key)) {
               addedItems.push(item);
             }
           });
           
           // 削除されたアイテムを検出
           const deletedItems = [];
           beforeItemsMap.forEach((item, key) => {
             if (!afterItemsMap.has(key)) {
               deletedItems.push(item);
             }
           });
           
           // 更新されたアイテムを検出（プライマリキーは同じだが内容が異なる）
           const updatedItems = [];
           beforeItemsMap.forEach((beforeItem, key) => {
             if (afterItemsMap.has(key)) {
               const afterItem = afterItemsMap.get(key);
               if (JSON.stringify(beforeItem) !== JSON.stringify(afterItem)) {
                 // フィールド単位での差分を検出
                 const fieldChanges = [];
                 const allKeys = new Set([...Object.keys(beforeItem), ...Object.keys(afterItem)]);
                 allKeys.forEach(fieldKey => {
                   const beforeValue = JSON.stringify(beforeItem[fieldKey]);
                   const afterValue = JSON.stringify(afterItem[fieldKey]);
                   if (beforeValue !== afterValue) {
                     fieldChanges.push({
                       field: fieldKey,
                       before: beforeItem[fieldKey],
                       after: afterItem[fieldKey]
                     });
                   }
                 });
                 updatedItems.push({
                   primaryKey: key,
                   changes: fieldChanges,
                   beforeItem: beforeItem,
                   afterItem: afterItem
                 });
               }
             }
           });
           
           // 結果のサマリーを出力
           if (addedItems.length > 0) {
             console.log(`✅ データが正しく追加されました (${addedItems.length}件)`);
             const successMsg = `✅ データが正しく追加されました (${addedItems.length}件)\n`;
             awsLogs.push(successMsg);
             awsLogEntries.push(successMsg);
           }
           if (deletedItems.length > 0) {
             console.log(`✅ データが正しく削除されました (${deletedItems.length}件)`);
             const successMsg = `✅ データが正しく削除されました (${deletedItems.length}件)\n`;
             awsLogs.push(successMsg);
             awsLogEntries.push(successMsg);
           }
           if (updatedItems.length > 0) {
             console.log(`✅ データが正しく更新されました (${updatedItems.length}件)`);
             const successMsg = `✅ データが正しく更新されました (${updatedItems.length}件)\n`;
             awsLogs.push(successMsg);
             awsLogEntries.push(successMsg);
           }
           if (addedItems.length === 0 && deletedItems.length === 0 && updatedItems.length === 0) {
             console.log('ℹ️ DB状態に変化はありませんでした');
             const noChangeMsg = 'ℹ️ DB状態に変化はありませんでした\n';
             awsLogs.push(noChangeMsg);
             awsLogEntries.push(noChangeMsg);
           }
         }
         
         // DB差分の詳細をログに記録
         if (testResult.beforeState && afterState) {
           const beforeItems = testResult.beforeState.Items || [];
           const afterItems = afterState.Items || [];
           
           // プライマリキーを取得する関数（DynamoDBアイテムから）
           const getPrimaryKeyValue = (item, testCase) => {
             if (!testCase.primaryKeys) return null;
             const keyValues = [];
             for (const dbKey of Object.keys(testCase.primaryKeys)) {
               if (item[dbKey]) {
                 keyValues.push(item[dbKey].S || item[dbKey].N || JSON.stringify(item[dbKey]));
               }
             }
             return keyValues.join('#');
           };
           
           // アイテムをプライマリキーでマッピング
           const beforeItemsMap = new Map();
           beforeItems.forEach(item => {
             const key = getPrimaryKeyValue(item, testCase);
             if (key) beforeItemsMap.set(key, item);
           });
           
           const afterItemsMap = new Map();
           afterItems.forEach(item => {
             const key = getPrimaryKeyValue(item, testCase);
             if (key) afterItemsMap.set(key, item);
           });
           
           // 追加されたアイテムを検出
           const addedItems = [];
           afterItemsMap.forEach((item, key) => {
             if (!beforeItemsMap.has(key)) {
               addedItems.push(item);
             }
           });
           
           // 削除されたアイテムを検出
           const deletedItems = [];
           beforeItemsMap.forEach((item, key) => {
             if (!afterItemsMap.has(key)) {
               deletedItems.push(item);
             }
           });
           
           // 更新されたアイテムを検出
           const updatedItems = [];
           beforeItemsMap.forEach((beforeItem, key) => {
             if (afterItemsMap.has(key)) {
               const afterItem = afterItemsMap.get(key);
               if (JSON.stringify(beforeItem) !== JSON.stringify(afterItem)) {
                 // フィールド単位での差分を検出
                 const fieldChanges = [];
                 const allKeys = new Set([...Object.keys(beforeItem), ...Object.keys(afterItem)]);
                 allKeys.forEach(fieldKey => {
                   const beforeValue = JSON.stringify(beforeItem[fieldKey]);
                   const afterValue = JSON.stringify(afterItem[fieldKey]);
                   if (beforeValue !== afterValue) {
                     fieldChanges.push({
                       field: fieldKey,
                       before: beforeItem[fieldKey],
                       after: afterItem[fieldKey]
                     });
                   }
                 });
                 updatedItems.push({
                   primaryKey: key,
                   changes: fieldChanges,
                   beforeItem: beforeItem,
                   afterItem: afterItem
                 });
               }
             }
           });
           
           // 詳細ログの出力
           if (addedItems.length > 0 || deletedItems.length > 0 || updatedItems.length > 0) {
             const diffDetailEntry = `\n[${timestamp}] [${testCase.caseId}] DB差分の詳細\n`;
             console.log('DB差分の詳細を記録します...');
             awsLogs.push(diffDetailEntry);
             awsLogEntries.push(diffDetailEntry);
             
             // 追加されたアイテムの詳細
             if (addedItems.length > 0) {
               const addedLog = `\n【追加されたアイテム (${addedItems.length}件)】\n${JSON.stringify(addedItems, null, 2)}\n`;
               console.log(addedLog);
               awsLogs.push(addedLog);
               awsLogEntries.push(addedLog);
             }
             
             // 削除されたアイテムの詳細
             if (deletedItems.length > 0) {
               const deletedLog = `\n【削除されたアイテム (${deletedItems.length}件)】\n${JSON.stringify(deletedItems, null, 2)}\n`;
               console.log(deletedLog);
               awsLogs.push(deletedLog);
               awsLogEntries.push(deletedLog);
             }
             
             // 更新されたアイテムの詳細（フィールド単位での変更内容）
             if (updatedItems.length > 0) {
               const updatedLog = `\n【更新されたアイテム (${updatedItems.length}件)】\n`;
               console.log(updatedLog);
               awsLogs.push(updatedLog);
               awsLogEntries.push(updatedLog);
               
               updatedItems.forEach((update, index) => {
                 const itemLog = `\n更新アイテム ${index + 1}:\nプライマリキー: ${update.primaryKey}\n\n変更内容:\n`;
                 console.log(itemLog);
                 awsLogs.push(itemLog);
                 awsLogEntries.push(itemLog);
                 
                 update.changes.forEach(change => {
                   const changeLog = `  - フィールド: ${change.field}\n    変更前: ${JSON.stringify(change.before, null, 2)}\n    変更後: ${JSON.stringify(change.after, null, 2)}\n`;
                   console.log(changeLog);
                   awsLogs.push(changeLog);
                   awsLogEntries.push(changeLog);
                 });
                 
                 const fullItemLog = `\n完全なアイテム（変更前）:\n${JSON.stringify(update.beforeItem, null, 2)}\n\n完全なアイテム（変更後）:\n${JSON.stringify(update.afterItem, null, 2)}\n`;
                 console.log(fullItemLog);
                 awsLogs.push(fullItemLog);
                 awsLogEntries.push(fullItemLog);
               });
             }
           }
         }
       }
       
       // ※重要: クリーンアップ（データ削除）は実施しない
       // テストデータは追加したまま放置する方針とする
       
       return awsLogs;
    } catch (error) {
      console.error('AWS事後処理エラー:', error.message);
      const errorLog = `AWS事後処理エラー: ${error.message}\n${error.stack}\n`;
      awsLogs.push(errorLog);
      awsLogEntries.push(errorLog);
      return awsLogs;
    }
  }
   
   // テスト実行関数
   async function runTest(testCase) {
     try {
       // API実行ログを記録（詳細）
       let executionLog = [];
       executionLog.push(`\n=== ${testCase.caseId}: ${testCase.description} ===`);
       executionLog.push(`実行開始時刻: ${new Date().toISOString()}`);
       
    // AWS事前処理
    const awsPreResult = await executeAWSProcesses(testCase);
    if (awsPreResult.awsLogs.length > 0) {
      executionLog.push(`AWS事前処理: 実行済み（詳細はaws-log-${runId}.mdを参照）`);
    }
       
       // リクエストヘッダーの準備（認証情報はテストケースJSONに直接埋め込まれている）
       const headers = { ...testCase.request.headers };
       
       // リクエスト詳細をログに記録
       executionLog.push(`\n【リクエスト】`);
       executionLog.push(`メソッド: ${testCase.request.method}`);
       executionLog.push(`URL: ${testCase.request.url}`);
       executionLog.push(`ヘッダー: ${JSON.stringify(headers, null, 2)}`);
       executionLog.push(`ボディ: ${JSON.stringify(testCase.request.body, null, 2)}`);
       
       // APIリクエスト実行
       executionLog.push(`\nAPIリクエスト送信...`);
       const requestStartTime = Date.now();
       const response = await axios.post(testCase.request.url, testCase.request.body, {
         headers: headers,
         httpsAgent: httpsAgent  // 個別リクエストでも適用
       });
       const requestDuration = Date.now() - requestStartTime;
       executionLog.push(`レスポンス受信完了 (${requestDuration}ms)`);
      
      // レスポンス検証（API Gateway統合レスポンス対応）
      let actualData = response.data;
      if (response.data.body && typeof response.data.body === 'string') {
        try {
          actualData = JSON.parse(response.data.body);
        } catch (e) {
          // JSON解析に失敗した場合は元のデータを使用
          actualData = response.data;
        }
      }
      
      // レスポンス詳細をログに記録
      executionLog.push(`\n【レスポンス】`);
      executionLog.push(`HTTPステータス: ${response.status}`);
      executionLog.push(`レスポンスボディ: ${JSON.stringify(actualData, null, 2)}`);
      
      const testResult = {
        caseId: testCase.caseId,
        description: testCase.description,
        status: 'PASS',
        request: testCase.request,
        expectedResponse: testCase.expectedResponse,
        actualResponse: {
          status: response.status,
          body: actualData
        },
        validationResults: [],
        awsPreLog: awsPreResult.awsLogs.join('\n'),
        beforeState: awsPreResult.beforeState,
        awsPostLog: '',
        executionLog: executionLog.join('\n'),
        emailVerification: testCase.emailVerification || null
      };
      
      // HTTPステータスコードの検証（API Gateway統合レスポンス対応）
      // HTTPステータスコード200は検証対象外、レスポンスボディ内のstatusCodeを検証
      if (testCase.expectedResponse.status && actualData.statusCode && actualData.statusCode !== testCase.expectedResponse.status) {
        testResult.validationResults.push(`❌ レスポンスステータス: 期待値${testCase.expectedResponse.status} ≠ 実際値${actualData.statusCode}`);
        testResult.status = 'FAIL';
      } else {
        testResult.validationResults.push(`✅ HTTPステータス: ${response.status}（API Gateway統合レスポンス、検証対象外）`);
        if (actualData.statusCode) {
          testResult.validationResults.push(`✅ レスポンスステータス: ${actualData.statusCode}`);
        }
      }
      
      // レスポンスボディの検証
      if (testCase.expectedResponse.body) {
        if (actualData.returnCode !== testCase.expectedResponse.body.returnCode) {
          testResult.validationResults.push(`❌ メッセージコード: 期待値${testCase.expectedResponse.body.returnCode} ≠ 実際値${actualData.returnCode}`);
          testResult.status = 'FAIL';
        } else {
          testResult.validationResults.push(`✅ メッセージコード: 期待値${testCase.expectedResponse.body.returnCode} = 実際値${actualData.returnCode}`);
        }
        
        if (actualData.returnMessage !== testCase.expectedResponse.body.returnMessage) {
          testResult.validationResults.push(`❌ エラーメッセージ: 期待値「${testCase.expectedResponse.body.returnMessage}」≠ 実際値「${actualData.returnMessage}」`);
          testResult.status = 'FAIL';
        } else {
          testResult.validationResults.push(`✅ エラーメッセージ: 期待値「${testCase.expectedResponse.body.returnMessage}」= 実際値「${actualData.returnMessage}」`);
        }
      }
      
      // 検証結果をログに記録
      executionLog.push(`\n【検証結果】`);
      testResult.validationResults.forEach(result => {
        executionLog.push(result);
      });
      executionLog.push(`\n最終判定: ${testResult.status}`);
      
      // AWS事後処理（正常系テストの場合のみ）
      // ※クリーンアップ（データ削除）は実施せず、DB状態の取得と比較のみを行う
      if (testResult.status === 'PASS') {
      const awsPostLogs = await executeAWSPostProcess(testCase, testResult);
      testResult.awsPostLog = awsPostLogs.join('\n');
      if (awsPostLogs.length > 0) {
        executionLog.push(`\nAWS事後処理: 実行済み（詳細はaws-log-${runId}.mdを参照）`);
      }
    }
       
       // 最終的なexecutionLogを更新
       executionLog.push(`\n実行完了時刻: ${new Date().toISOString()}`);
       testResult.executionLog = executionLog.join('\n');
       
       return testResult;
      
    } catch (error) {
      console.error('テスト実行エラー:', error.message);
      throw error;
    }
  }
  ```
- **AWS確認工程の必須実装**:
  ```javascript
  // テスト仕様書の「確認対象」に「DB」が含まれている場合のAWS確認工程
  if (testCase.confirmationTarget && testCase.confirmationTarget.includes('DB')) {
    try {
      // AWS SDK優先、AWS CLIフォールバックでDynamoDBのデータを確認
      const { execSync } = require('child_process');
      
        // AWS SDK優先での確認
        try {
          console.log('AWS SDKを使用してDynamoDBデータを確認します...');
          const getItemParams = {
            TableName: tableName,
            Key: primaryKey
          };
          const result = await dynamodb.getItem(getItemParams).promise();
          
          if (result.Item) {
            console.log(`AWS SDK確認: DynamoDBテーブル${tableName}にデータが正しく追加されました`);
            validateDynamoData(result.Item, testCase, testCase.request.body);
            console.log('AWS SDK確認: すべての確認が正常に完了しました');
            testResult.awsConfirmationLog = capturedLogs.join('\n');
            return;
          } else {
            throw new Error('データが見つかりませんでした');
          }
        } catch (sdkError) {
          console.log('AWS SDK失敗、AWS CLIにフォールバックします:', sdkError.message);
          
          // AWS CLIフォールバック
          // 環境変数を設定（aws configureで設定したローカル認証情報を使用）
          const awsEnv = {
            // AWS_REGION、AWS_ACCESS_KEY_ID、AWS_SECRET_ACCESS_KEY は明示的に設定しない
            // aws configureで設定したローカル認証情報（~/.aws/credentials、~/.aws/config）を使用
            PYTHONIOENCODING: 'utf-8',
            PYTHONUTF8: '1',
            AWS_PAGER: '',
            AWS_CLI_AUTO_PROMPT: 'off',
            AWS_DEFAULT_REGION: 'ap-northeast-1',
            AWS_DEFAULT_OUTPUT: 'json',
            LANG: 'ja_JP.UTF-8',
            LC_ALL: 'ja_JP.UTF-8',
            LC_CTYPE: 'ja_JP.UTF-8',
            CHCP: '65001',
            CONSOLE_CODEPAGE: '65001'
          };
        
- **AWS確認工程の必須実装**:
  ```javascript
  // テスト仕様書の「確認対象」に「DB」が含まれている場合のAWS確認工程
  if (testCase.confirmationTarget && testCase.confirmationTarget.includes('DB')) {
    try {
      // AWS SDKを使用してDynamoDBのデータを確認
      const tableName = testCase.tableName;
      if (!tableName) {
        console.warn('テーブル名が指定されていません。AWS確認をスキップします。');
        return;
      }
      
      // プライマリキーを構築（Cursorが事前に検出したプライマリキーマッピングを使用）
      const primaryKey = buildPrimaryKeyFromMapping(testCase.request.body, testCase.primaryKeys);
      
      console.log('AWS SDKを使用してDynamoDBデータを確認します...');
      const getItemParams = {
        TableName: tableName,
        Key: primaryKey
      };
      const result = await dynamodb.getItem(getItemParams).promise();
      
      if (result.Item) {
        console.log(`AWS SDK確認: DynamoDBテーブル${tableName}にデータが正しく追加されました`);
        validateDynamoData(result.Item, testCase, testCase.request.body);
        console.log('AWS SDK確認: すべての確認が正常に完了しました');
        testResult.awsConfirmationLog = capturedLogs.join('\n');
      } else {
        console.log('AWS SDK確認: データが見つかりませんでした。レスポンス:', JSON.stringify(result, null, 2));
        throw new Error(`AWS SDK確認失敗: DynamoDBテーブル${tableName}にデータが見つかりません`);
      }
        
    } catch (error) {
      console.error('AWS SDK確認エラー:', error);
      
      // AWS SDK確認のエラーは警告として扱い、テストを失敗させない
      console.warn(`AWS SDK確認でエラーが発生しましたが、テストは継続します: ${error.message}`);
      console.log('AWS SDK確認: エラーが発生しましたが、API自体は正常に動作しているためテストを継続します');
    }
  }
  
  
  // プライマリキーを構築する関数（Cursor事前検出版）
  function buildPrimaryKeyFromMapping(requestBody, primaryKeysMapping) {
    // Cursorが事前に検出したprimaryKeysマッピングを使用してプライマリキーを構築
    // primaryKeysMapping形式: { "ORGANIZATION_ID": "organizationId", "ADMIN_USER_ID": "adminUserId" }
    
    if (!primaryKeysMapping) {
      console.warn('プライマリキーマッピングが指定されていません');
      return {};
    }
    
    const key = {};
    
    // マッピングに基づいてプライマリキーを構築
    for (const [dbKey, requestKey] of Object.entries(primaryKeysMapping)) {
      const value = getValueFromRequestBody(requestBody, requestKey);
      if (value) {
        key[dbKey] = { S: String(value) };
      }
    }
    
    // デバッグ用ログ
    console.log('構築されたプライマリキー:', JSON.stringify(key, null, 2));
    console.log('JSON.stringify結果:', JSON.stringify(key));
    
    return key;
  }
  
  // リクエストボディから値を取得する関数（ネストされたオブジェクトに対応）
  function getValueFromRequestBody(requestBody, key) {
    // シンプルなキーの場合
    if (requestBody[key]) {
      return requestBody[key];
    }
    
    // ネストされたオブジェクトの場合（adminInfo.userFamilyNameなど）
    const pathParts = key.split('.');
    let value = requestBody;
    for (const part of pathParts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return null;
      }
    }
    
    return value;
  }
  
  // DynamoDBデータの内容を検証する関数（Cursor事前検出版）
  function validateDynamoData(item, testCase, requestBody) {
    console.log('DynamoDBアイテム全体:', JSON.stringify(item, null, 2));
    
    // プライマリキーの検証（Cursorが事前に検出したprimaryKeysマッピングを使用）
    if (testCase.primaryKeys) {
      for (const [dbKey, requestKey] of Object.entries(testCase.primaryKeys)) {
        const expectedValue = getValueFromRequestBody(requestBody, requestKey);
        if (expectedValue && item[dbKey]) {
          const actualValue = item[dbKey].S;
          if (actualValue === String(expectedValue)) {
            console.log(`AWS確認: ${dbKey}の値が正しく設定されています (${actualValue})`);
          } else {
            throw new Error(`AWS確認失敗: ${dbKey}の値が期待値と一致しません (期待: ${expectedValue}, 実際: ${actualValue})`);
          }
        }
      }
    }
    
    // 追加データの検証（Cursorが事前に検出したvalidationFieldsを使用）
    if (testCase.validationFields) {
      for (const field of testCase.validationFields) {
        const expectedValue = getValueFromRequestBody(requestBody, field.requestPath);
        if (expectedValue && item[field.dbKey]) {
          const actualValue = item[field.dbKey].S;
          if (actualValue === String(expectedValue)) {
            console.log(`AWS確認: ${field.dbKey}の値が正しく設定されています (${actualValue})`);
          } else {
            console.log(`AWS確認: ${field.dbKey}の値が期待値と一致しません (期待: ${expectedValue}, 実際: ${actualValue})`);
            // データの不一致は警告として扱い、テストを失敗させない
          }
        } else if (expectedValue && !item[field.dbKey]) {
          console.log(`AWS確認: ${field.dbKey}がDynamoDBアイテムに存在しません`);
          // データの不存在は警告として扱い、テストを失敗させない
        }
      }
    }
    
    console.log('AWS確認: データ検証が完了しました（警告は無視され、テストは継続されます）');
  }
  
  
  
  ```
- **JavaScriptによるファイル生成の必須実装**:
  - テスト実行スクリプト内でJavaScriptを使用して結果ファイルを生成する
  - `fs` モジュールを使用してMarkdownファイルを直接作成する
  - ファイル生成はテスト実行の最後に実行する
  - **必須**: 生成先ディレクトリを確実に作成する
  - **必須**: 絶対パスを使用してファイル生成場所を固定する
  - 生成するファイル: `test-results-summary-<RUN_ID>.md`
  
  ```javascript
  // テスト結果ファイル生成の必須実装
  const path = require('path');
  
   // API名を取得（テスト仕様書ファイル名から-test-specを除いた部分）
   // 例: add-admin-info-test-spec.md → add-admin-info
   const apiName = 'add-admin-info'; // テスト仕様書ファイル名から自動取得
   
   // 結果保存ディレクトリの絶対パスを設定（親ディレクトリのresultsサブディレクトリ）
   const resultsDir = path.resolve(__dirname, '..', 'results');
  
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
    console.log(`結果保存ディレクトリを作成しました: ${resultsDir}`);
  }
  
  // RUN_IDの生成（YYYYMMDD-HHMMSS形式）
  const now = new Date();
  const runId = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') + '-' +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');
  
  // 結果ファイルの絶対パス
  const resultFilePath = path.join(resultsDir, `test-results-summary-${runId}.md`);
  
  // テスト結果をMarkdown形式で生成（実行ログも含める）
  const markdownContent = generateTestResultsMarkdown(testResults, runId, executionLogs, apiName);
  
  // ファイルに書き込み
  fs.writeFileSync(resultFilePath, markdownContent, 'utf8');
  console.log(`テスト結果を保存しました: ${resultFilePath}`);
  
  // AWS関連処理ログファイルの保存（Markdown形式）
  if (awsLogEntries.length > 0) {
    const awsLogContent = `# AWS関連処理実行ログ\n\n実行日時: ${new Date().toISOString()}\n\n${awsLogEntries.join('')}`;
    fs.writeFileSync(awsLogFilePath, awsLogContent, 'utf8');
    console.log(`AWS関連処理ログを保存しました: ${awsLogFilePath}`);
  }
  
  // 結果ファイルのパスを返す
  return resultFilePath;
  
  // Markdown生成関数（メール配信確認セクション含む）
  function generateTestResultsMarkdown(testResults, runId, executionLogs, apiName) {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    
    let markdown = `# APIテスト結果サマリー\n\n`;
    markdown += `## 実行概要\n`;
    markdown += `- 実行日時: ${timestamp}\n`;
    markdown += `- 実行ID: ${runId}\n`;
  markdown += `- 総テスト数: ${testResults.length}\n`;
  markdown += `- 成功: ${testResults.filter(r => r.status === 'PASS').length}\n`;
  markdown += `- 失敗: ${testResults.filter(r => r.status === 'FAIL').length}\n`;
  markdown += `- AWS詳細ログ: \`aws-log-${runId}.md\`\n\n`;
    
    // テスト結果一覧テーブル
    markdown += `## テスト結果一覧\n`;
    markdown += `| テストケースID | テスト名 | ステータス | 期待値 | 実際値 | 差分 | メール配信確認 |\n`;
    markdown += `|:---|:---|:---|:---|:---|:---|:---|\n`;
    
    testResults.forEach(result => {
      const statusIcon = result.status === 'PASS' ? '✅ PASS' : '❌ FAIL';
      const expectedCode = result.expectedResponse?.body?.returnCode || '-';
      const actualCode = result.actualResponse?.body?.returnCode || '-';
      const diff = result.status === 'FAIL' ? result.validationResults.filter(r => r.includes('❌')).join(', ') : '-';
      
      // メール送信が必要なテストケースかチェック
      const emailStatus = result.emailVerification?.required ? '⬜ 未確認' : '-';
      
      markdown += `| ${result.caseId} | ${result.description} | ${statusIcon} | ${expectedCode} | ${actualCode} | ${diff} | ${emailStatus} |\n`;
    });
    
    markdown += `\n## 全テストケース詳細\n\n`;
    
    // 各テストケースの詳細
    testResults.forEach(result => {
      const statusIcon = result.status === 'PASS' ? '✅ PASS' : '❌ FAIL';
      markdown += `### ${result.caseId}: ${result.description} ${statusIcon}\n`;
  markdown += `- **リクエスト**: ${result.request.method} ${result.request.url}\n`;
  markdown += `- **リクエストボディ**:\n\n`;
  markdown += `\`\`\`json\n`;
  markdown += `${JSON.stringify(result.request.body, null, 2)}\n`;
  markdown += `\`\`\`\n\n`;
  markdown += `- **期待レスポンス**:\n\n`;
  markdown += `\`\`\`json\n`;
  markdown += `${JSON.stringify(result.expectedResponse, null, 2)}\n`;
  markdown += `\`\`\`\n\n`;
  markdown += `- **実際レスポンス**:\n\n`;
  markdown += `\`\`\`json\n`;
  markdown += `${JSON.stringify(result.actualResponse, null, 2)}\n`;
  markdown += `\`\`\`\n\n`;
      markdown += `- **検証結果**:\n`;
      result.validationResults.forEach(validation => {
        markdown += `  - ${validation}\n`;
      });
      
    // AWS関連処理結果（詳細ログはAWSログファイルに記録）
    if (result.awsPreLog || result.awsPostLog) {
      markdown += `- **AWS関連処理結果（DB更新処理）**:\n`;
      markdown += `  - ✅ AWS処理実行済み\n`;
      markdown += `  - 📄 詳細ログ: \`aws-log-${runId}.md\` を参照\n`;
    }
      
      // メール配信確認セクション（メール送信が必要なテストケースのみ）
      if (result.emailVerification && result.emailVerification.required) {
        const recipientEmail = getValueFromRequestBody(result.request.body, result.emailVerification.recipientPath) || '（取得失敗）';
        
        markdown += `- **メール配信確認（手動）**:\n`;
        markdown += `  - ⬜ 未確認\n`;
        markdown += `  - 📧 確認対象メールアドレス: \`${recipientEmail}\`\n`;
        markdown += `  - 📝 確認内容: \n`;
        markdown += `    - [ ] メールが届いた（件名:、送信者:、本文内容:）\n`;
        markdown += `    - [ ] メールが届かなかった（理由:）\n`;
        markdown += `  - 📅 確認日時: YYYY-MM-DD HH:MM:SS（目視確認後に記入）\n`;
        markdown += `  - 🔍 確認者: （確認者名を記入）\n`;
        markdown += `  - ✏️ 備考: （その他気づいた点があれば記入）\n`;
      }
      
    // 実行ログ
    if (result.executionLog) {
      markdown += `- **実行ログ**:\n\n`;
      markdown += `\`\`\`\n`;
      markdown += `${result.executionLog}\n`;
      markdown += `\`\`\`\n\n`;
    }
    
    markdown += `\n---\n\n`;
    });
    
  // 全体の実行ログ
  if (executionLogs && executionLogs.length > 0) {
    markdown += `## 全体実行ログ\n\n`;
    markdown += `\`\`\`\n`;
    markdown += executionLogs.join('\n\n---\n\n');
    markdown += `\n\`\`\`\n`;
  }
  
  return markdown;
  }
  
  // リクエストボディから値を取得する関数
  function getValueFromRequestBody(requestBody, path) {
    const keys = path.split('.');
    let value = requestBody;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return null;
      }
    }
    return value;
  }
  ```
- **全テストケース詳細記載の必須実装**:
  - テスト実行後、**すべてのテストケース**（成功・失敗問わず）の詳細を必ず記載する
  - テストケースの記載漏れは絶対に避ける
  - 各テストケースには以下を必ず含める：
    - リクエスト詳細（メソッド、URL、ヘッダー、ボディ）
    - 期待レスポンス（JSON形式）
    - 実際レスポンス（JSON形式）
    - 検証結果（各項目の成功/失敗）
  - **AWS関連処理結果（DB更新処理の場合）**:
    - AWS関連処理が実行された場合は、**詳細なログを必ず記載する**
    - 以下の内容を含める：
      - **AWS事前処理ログ**:
        - テストデータ事前追加ログ（AWS SDK putItemの結果）
        - テスト前DB状態取得ログ（AWS SDK scanの結果）
      - **AWS事後処理ログ**:
        - テスト後DB状態取得ログ（AWS SDK scanの結果）
        - DB状態比較検証ログ（テスト前後の差分確認）
        - **DB差分の詳細ログ**（差分がある場合）:
          - 追加されたアイテムの完全な内容（JSON形式、見やすくフォーマット）
          - 削除されたアイテムの完全な内容（JSON形式、見やすくフォーマット）
          - 更新されたアイテムの詳細:
            - プライマリキーの値
            - フィールド単位での変更内容（フィールド名、変更前、変更後）
            - 完全なアイテム（変更前のJSON）
            - 完全なアイテム（変更後のJSON）
        - **DB状態に変化がない場合**: その旨を明記
      - エラーが発生した場合はエラーメッセージとスタックトレース
      - AWS関連処理の実行時間
  - **重要**: AWS関連処理のログは実際のコンソール出力をそのままコピーして記載する
  - **重要**: 日本語データの文字化け等の問題も含めて、すべての詳細を記載する
    - 実行ログ（タイムスタンプ付き）

- **JavaScript実行ログの必須実装**:
  - Node.js環境でJavaScriptテストを実行した際に実際に出力されるログをそのままコピーしてエビデンスとする
  - 生成したログではなく、Node.jsの実際の実行ログを使用する
  - **重要**: JavaScript実行時に出力される以下のログを必ず取得・記録する：
    - コンソール出力（console.log、console.error等）
    - テスト実行ログ（テスト開始・終了メッセージ等）
    - 各テストケースの実行結果（✓ PASS、✗ FAIL等）
    - AWS確認ログ（AWS CLIコマンドの実行結果等）
    - エラーメッセージ（Error: expect(received).toBe(expected)等）
    - 実行時間とサマリー（X passed (Y.Zs)等）
  - **実装方法**: Node.jsの実行結果から実際のログ出力を取得し、そのままコピーする

## 出力（報告メッセージに含めること）
- 失敗数と失敗ケース名  
- 各失敗の差分（例：expected 200, actual 400）  
- レスポンス抜粋（先頭 512 文字程度）  
- AWS確認結果（DB確認対象の場合）
- **メール配信確認欄**: テスト結果一覧テーブルおよび各テストケース詳細にメール配信確認の状態（⬜ 未確認、✅ 配信確認済、❌ 未配信）を記載
  - メール送信が必要なテストケースには「⬜ 未確認」と表示
  - 目視確認後、手動で「✅ 配信確認済」または「❌ 未配信」に更新可能
- **既存ファイルのスキップ状況**:
  - テストケースファイル、テストデータファイル、テストコードファイルが既に存在していた場合、その旨を報告
  - 例: 「既存のテストケースファイルとテストコードファイルが見つかりました。作成工程をスキップしました。」
  - 実行環境（package.json、node_modules）が既に存在していた場合、その旨を報告
  - 例: 「既存のJavaScript実行環境が見つかりました。プロジェクト初期化をスキップしました。」
- **生成ファイルのパス（7つのファイル/ディレクトリ）**:
  1. `docs/tests/api_results/<API名>/<API名>-test-cases.json` …… テストケースファイル（既存の場合はスキップ）
  2. `docs/tests/api_results/<API名>/<API名>-test-data.json` …… テストデータファイル（既存の場合はスキップ）
  3. `docs/tests/api_results/<API名>/<API名>.test.js` …… JavaScriptテストファイル（既存の場合はスキップ）
  4. `docs/tests/api_results/<API名>/code/package.json` …… パッケージ定義ファイル（既存の場合はスキップ）
  5. `docs/tests/api_results/<API名>/code/node_modules/` …… Node.jsモジュール（既存の場合はnpm installスキップ）
  6. `docs/tests/api_results/<API名>/results/<API名>-aws-log-<RUN_ID>.txt` …… AWS関連処理実行ログファイル（毎回新規作成）
  7. `docs/tests/api_results/<API名>/results/test-results-summary-<RUN_ID>.md` …… テスト結果サマリー（毎回新規作成）
- **実行方法**:
  - `cd docs/tests/api_results/<API名>/code`
  - `node --no-warnings <API名>.test.js`

## サマリーファイル形式

### test-results-summary-<RUN_ID>.md の構成
```markdown
# APIテスト結果サマリー

## 実行概要
- 実行日時: YYYY-MM-DD HH:MM:SS
- 実行ID: <RUN_ID>
- 総テスト数: XX
- 成功: XX
- 失敗: XX
- AWS詳細ログ: `<API名>-aws-log-<RUN_ID>.txt`

## テスト結果一覧
| テストケースID | テスト名 | ステータス | 期待値 | 実際値 | 差分 | メール配信確認 |
|:---|:---|:---|:---|:---|:---|:---|
| TC001 | 正常系テスト | ✅ PASS | I00000 | I00000 | - | ⬜ 未確認 |
| TC002 | 異常系テスト | ❌ FAIL | E00001 | E00001 | レスポンスステータス不一致 | - |

## 全テストケース詳細

### TC001: 正常系テスト ✅ PASS
- **リクエスト**: POST /api/login
- **リクエストボディ**:
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **期待レスポンス**:
  ```json
  {
    "statusCode": 200,
    "returnCode": "I00000",
    "returnMessage": "ログインに成功しました",
    "data": {
      "userId": "user123",
      "token": "jwt_token_here"
    }
  }
  ```
- **実際レスポンス**:
  ```json
  {
    "statusCode": 200,
    "returnCode": "I00000",
    "returnMessage": "ログインに成功しました",
    "data": {
      "userId": "user123",
      "token": "jwt_token_here"
    }
  }
  ```
- **検証結果**:
       - ✅ HTTPステータス: 200（API Gateway統合レスポンス、検証対象外）
       - ✅ レスポンスステータス: 200
       - ✅ レスポンス構造: JSON形式で正常
       - ✅ メッセージコード: 期待値I00000 = 実際値I00000
       - ✅ データ存在: userId、tokenが存在
       - ✅ データ型: userIdは文字列、tokenは文字列
- **AWS関連処理結果（DB更新処理）**:
  - ✅ AWS処理実行済み
  - 📄 詳細ログ: `<API名>-aws-log-<RUN_ID>.txt` を参照
- **メール配信確認（手動）**:
  - ⬜ 未確認
  - 📧 確認対象メールアドレス: `admin@example.com`
  - 📝 確認内容: 
    - [ ] メールが届いた（件名:、送信者:、本文内容:）
    - [ ] メールが届かなかった（理由:）
  - 📅 確認日時: YYYY-MM-DD HH:MM:SS（目視確認後に記入）
  - 🔍 確認者: （確認者名を記入）
  - ✏️ 備考: （その他気づいた点があれば記入）

- **実行ログ**:
  ```
  Running 1 test using 1 worker
  
  [chromium] › list-clients.spec.ts:3:1 › TC001: 正常系テスト
  ✓ TC001: 正常系テスト (1.2s)
  
  [chromium] › list-clients.spec.ts:15:1 › TC002: 異常系テスト
  ✗ TC002: 異常系テスト (0.8s)
  
  Error: expect(received).toBe(expected)
  
  Expected: "E00001"
  Received: "I00000"
  
  at TC002: 異常系テスト (list-clients.spec.ts:25:15)
  
  1 passed (2.0s)
  ```

### TC002: 異常系テスト ❌ FAIL
- **リクエスト**: POST /api/login
- **リクエストボディ**:
  ```json
  {
    "email": "invalid@example.com",
    "password": "wrongpassword"
  }
  ```
- **期待レスポンス**:
  ```json
  {
    "statusCode": 400,
    "returnCode": "E00001",
    "returnMessage": "認証に失敗しました"
  }
  ```
- **実際レスポンス**:
  ```json
  {
    "statusCode": 200,
    "returnCode": "I00000",
    "returnMessage": "ログインに成功しました"
  }
  ```
- **検証結果**:
  - ✅ HTTPステータス: 200（API Gateway統合レスポンス、検証対象外）
  - ✅ レスポンスステータス: 400
  - ❌ メッセージコード: 期待値E00001 ≠ 実際値I00000
  - ❌ エラーメッセージ: 期待値「認証に失敗しました」≠ 実際値「ログインに成功しました」
  - ❌ データ検証: 無効な認証情報でも成功レスポンスが返される
- **差分**: 期待されるエラー処理が実行されていない
- **実行ログ**:
  ```
  [chromium] › list-clients.spec.ts:15:1 › TC002: 異常系テスト
  ✗ TC002: 異常系テスト (0.8s)
  
  Error: expect(received).toBe(expected)
  
  Expected: "E00001"
  Received: "I00000"
  
  at TC002: 異常系テスト (list-clients.spec.ts:25:15)
  ```

## 実行ログサマリー
```
Running 2 tests using 1 worker

[chromium] › list-clients.spec.ts:3:1 › TC001: 正常系テスト
✓ TC001: 正常系テスト (1.2s)

[chromium] › list-clients.spec.ts:15:1 › TC002: 異常系テスト
✗ TC002: 異常系テスト (0.8s)

Error: expect(received).toBe(expected)

Expected: "E00001"
Received: "I00000"

at TC002: 異常系テスト (list-clients.spec.ts:25:15)

1 passed (2.0s)
```
```

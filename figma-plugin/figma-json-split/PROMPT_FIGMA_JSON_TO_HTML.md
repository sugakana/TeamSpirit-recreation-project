# Figma JSONからHTMLへの変換プロンプト

## 目的

このプロンプトは、Figma JSONファイルをHTMLファイルに変換する作業を再現するためのものです。すべてのファイルは分割を試み、分割結果が1ファイルになっても問題ありません。

## 前提条件

1. **Figma JSONファイル**: 変換対象のFigma JSONファイルが存在すること
2. **分割スクリプトの存在**: `split-figma-json.js` が既に存在すること
3. **統合ログファイル**: `conversion-log.json` が存在するか、新規作成可能であること

## 行数ベースの読み込み制限について

**重要**: Cursorの制限を考慮し、大きなJSONファイルを処理する際は、一度に全ノードを読み込もうとせず、**200-300行ずつ**段階的に読み込んで処理してください。

### 推奨行数の目安

- **200-300行/回（推奨）**
  - 約5000-8000トークン
  - Cursorの制限（約25000トークン）内で安全
  - 処理効率と安全性のバランスが良い

- **100-200行/回（安全）**
  - 約2500-5000トークン
  - 非常に安全だが処理回数が増える
  - 小さなファイルや、確実性を重視する場合に推奨

- **300-500行/回（注意が必要）**
  - 約8000-13000トークン
  - 大きなノード（VECTORのvectorPathsなど）がある場合は必要
  - トークン制限に近づくため注意が必要

- **500行以上/回（非推奨）**
  - 約13000トークン以上
  - トークン制限を超える可能性が高い
  - エラーが発生する可能性があるため避けてください

### 読み込み方法

`read_file`ツールを使用する際は、必ず`offset`と`limit`パラメータを指定してください：

```javascript
// 良い例: 行数を明示的に指定
read_file(target_file, offset=1, limit=250)    // 1-250行
read_file(target_file, offset=251, limit=250)  // 251-500行
read_file(target_file, offset=501, limit=250)  // 501-750行

// 悪い例: 行数を指定しない（全ファイルを読み込もうとする）
read_file(target_file)  // エラーが発生する可能性
```

### ノードの完全性

各読み込みセクションで、その範囲内のノードを完全に処理してから次のセクションに進んでください。ノードが途中で切れないように、JSONの構造（`{`, `}`, `[`, `]`）を考慮してください。

## 作業の流れ

1. **分割の実施**: `split-figma-json.js` を使用してJSONファイルを分割（分割結果が1ファイルになっても問題ありません）
2. **フェーズ1**: HTML基本構造の作成
3. **フェーズ2以降**: 分割ファイルの段階的処理（複数のフェーズに分けて処理）
4. **最終フェーズ**: メインファイルの直接ノード処理
5. **ログファイルの更新**: 各フェーズ完了時に `conversion-log.json` を更新

## 詳細な手順

### ステップ1: 初期設定とディレクトリ構造の確認

**重要**: 元のJSONファイルは `figma-json-split/` ディレクトリの直下に配置されます。ファイル名はユーザーがプロンプト文（チャット）で直接メンションします。

**ディレクトリ構造：**

```
figma-json-split/
├── {ファイル名}.json (元のJSONファイル - ユーザーが指定)
├── {ファイル名}/
│   ├── {ファイル名}-split/
│   │   ├── {ファイル名}-root.json (SPLIT_ROOTタイプのメインファイル)
│   │   ├── {ファイル名}-1.json
│   │   ├── {ファイル名}-2.json
│   │   └── ... (分割されたファイルのみ)
│   ├── {ファイル名}.html (生成されるHTMLファイル)
│   └── {ファイル名}-conversion-log.json (統合ログファイル - 分割情報と処理進捗を記録)
├── split-figma-json.js (分割スクリプト - 既に存在)
└── PROMPT_FIGMA_JSON_TO_HTML.md (このプロンプトファイル)
```

### ステップ2: プロンプトの開始

以下のプロンプトをAIに送信してください：

---

**プロンプト開始**

Figma JSONファイルをHTMLに変換する作業を実施してください。

## 作業要件

**⚠️ 最重要: スクリプト作成・実行の完全禁止 ⚠️**

- **絶対に禁止**: Node.js、JavaScript、Python、その他いかなるスクリプトやプログラムコードを作成して実行してはいけません
- **絶対に禁止**: 変換ロジックや処理スクリプトを実装してはいけません
- **必須**: AIが直接`read_file`ツールを使用してJSONファイルを読み取り、その内容を理解し、手動でHTMLを生成してください
- **必須**: `search_replace`や`write`ツールを使用して、読み取ったJSONの内容を直接HTMLに変換してください
- スクリプトファイル（`.js`, `.py`, `.ts`など）を作成することは一切禁止です

1. **分割の実施**
   - **重要**: 元のJSONファイルは `figma-json-split/{ファイル名}.json` に配置されています（ファイル名はユーザーがプロンプトで指定）
   - `split-figma-json.js` を使用してJSONファイルを分割してください（これは既存の分割スクリプトです）
   - 分割結果が1ファイルになっても問題ありません
   - 分割後、以下のディレクトリ構造になります：
     - `figma-json-split/{ファイル名}/` ディレクトリが作成されます
     - `figma-json-split/{ファイル名}/{ファイル名}-split/` に分割ファイルが配置されます
     - `figma-json-split/{ファイル名}/{ファイル名}-split/{ファイル名}-root.json` にメインファイル（SPLIT_ROOT）が配置されます

2. **JSONファイルの処理（AIが直接読み取り・解釈してHTML生成）**
   - **処理方法**: 
     - `read_file`ツールを使用してJSONファイルを段階的に読み込みます
     - 読み取ったJSONの内容を理解し、各ノードのタイプとプロパティを解釈します
     - `search_replace`または`write`ツールを使用して、解釈した内容を直接HTMLに変換します
     - **スクリプトは一切作成しません**。AIが直接読み取り・解釈・変換を行います
   
   - `figma-json-split/{ファイル名}/{ファイル名}-split/` ディレクトリ内の分割ファイルをすべて処理
     - **重要: 行数ベースの段階的読み込みと処理**
       - 各分割ファイルを一度に全ノードを読み込もうとせず、**200-300行ずつ**段階的に読み込んで処理してください
       - `read_file`ツールを使用する際は、`offset`と`limit`パラメータを必ず指定してください
       - 例: `read_file(target_file, offset=1, limit=250)` のように、開始行と読み込む行数を指定
       - 読み取ったJSONの内容を理解し、各ノードの構造を把握します
       - 各ノードの`type`、`x`、`y`、`width`、`height`、`fills`、`vectorPaths`などのプロパティを確認します
       - 読み取ったノードをHTMLに変換し、`search_replace`ツールでHTMLファイルに追加します
       - 各読み込みセクションで、その範囲内のノードを完全に処理してから次のセクションに進んでください
       - ノードが途中で切れないように注意してください（JSONの構造を考慮して、ノードの開始と終了を確認）
     - 各分割ファイル（`{ファイル名}-1.json` から順番に）を段階的に読み取り、HTMLに変換
   - メインファイル（`figma-json-split/{ファイル名}/{ファイル名}-split/{ファイル名}-root.json`）の直接ノードも同様に段階的に処理
   - すべてのノードを確実に処理してください

3. **統合ログファイルの活用**
   - `figma-json-split/{ファイル名}/{ファイル名}-conversion-log.json` ファイルを作成または更新して進捗を記録
   - 分割情報（`splitDate`, `splitOptions`, `splitStatistics`, `splitFiles`）と処理進捗（`conversion`）の両方を記録
   - **重要: ログの書き込みタイミング**
     - **JSONファイルを読み込む前**: 必ずログファイルを読み込み、処理開始の記録を更新してください（フェーズの開始時刻、処理対象ファイルの記録など）
     - **HTMLに実装した後**: 必ずログファイルを更新し、処理完了の記録を更新してください（処理ステータス、処理行数、処理ノード数、完了日時など）
   - 各フェーズ処理時に以下の情報を `conversion.phases` に記録：
     - 処理ステータス（`completed`, `partial`, `incomplete`）
     - 処理行数（`processedLines`: "開始行-終了行"）
     - 総行数（`totalLines`）
     - 処理ノード数（`nodesProcessed`）
     - 処理内容のメモ（`notes`）
     - 完了日時（`completedAt`）

4. **段階的な処理**
   - 一括で読み込まず、いくつかのフェーズに分けてファイルを読み取りHTMLを作成
   - **重要: 行数ベースの読み込み制限**
     - **一度の読み込みで200-300行を上限**として処理してください
     - ファイルが大きい場合（1000行以上）、必ず`offset`と`limit`パラメータを使用して段階的に読み込んでください
     - 例: 1000行のファイルの場合
       - 1回目: `offset=1, limit=250` (1-250行)
       - 2回目: `offset=251, limit=250` (251-500行)
       - 3回目: `offset=501, limit=250` (501-750行)
       - 4回目: `offset=751, limit=250` (751-1000行)
     - 各読み込みセクションで、その範囲内のノードを完全に処理してから次のセクションに進んでください
     - ノードの完全性を保つため、JSONの構造（`{`, `}`, `[`, `]`）を考慮して、ノードが途中で切れないように注意してください
   - **重要: ログの書き込みタイミング**
     - **各フェーズ開始時（JSONファイルを読み込む前）**: 必ずログファイルを読み込み、処理開始の記録を更新してください
     - **各フェーズ完了時（HTMLに実装した後）**: 必ずログファイルを更新し、処理完了の記録を更新してください
   - ログファイルを確認して、未処理のファイルがないか確認

5. **HTMLファイルの生成（AIが直接変換）**
   - **重要**: `search_replace`または`write`ツールを使用して、読み取ったJSONの内容を直接HTMLに変換してください
   - **スクリプトは一切作成しません**。AIが直接読み取ったJSONを解釈してHTMLを生成します
   - `figma-json-split/{ファイル名}/{ファイル名}.html` を作成または更新
   - Figma JSONの各ノードタイプを適切なHTML要素に変換：
     - `FRAME` → `<div style="position: absolute; left: {x}px; top: {y}px; width: {width}px; height: {height}px;">`
     - `TEXT` → `<span style="position: absolute; left: {x}px; top: {y}px; font-size: {fontSize}px;">{characters}</span>`
     - `VECTOR` → `<svg>` または `<div>` (背景色/ボーダー)
       - `vectorPaths`がある場合: `<svg><path d="{vectorPaths[0].data}" fill="{fills[0].colorをRGB変換}" /></svg>`
       - `vectorPaths`がない場合: `<div style="background-color: {fills[0].colorをRGB変換};">`
     - `GROUP` → `<div style="position: absolute; left: {x}px; top: {y}px;">`
   - FigmaのプロパティをCSSスタイルに変換：
     - `x`, `y` → `left: {x}px; top: {y}px;`
     - `width`, `height` → `width: {width}px; height: {height}px;`
     - `fills[0].color` (RGB 0-1形式) → `rgb({r*255}, {g*255}, {b*255})`
     - `strokes` → `border: {strokeWeight}px solid rgb(...);`
     - `cornerRadius` → `border-radius: {cornerRadius}px;`
     - `fontSize` → `font-size: {fontSize}px;`
     - `fontName.family` → `font-family: {family};`
     - `textAlign` → `text-align: {textAlign.toLowerCase()};`
     - `vectorPaths[0].data` → SVGの `<path d="{data}">` 要素
   - 各ノードを読み取ったら、その場でHTMLに変換し、`search_replace`ツールでHTMLファイルに追加してください

6. **抜け漏れの防止**
   - **重要**: スクリプト実行は完全に禁止です。変換ロジックを組んではいけません。必ず`read_file`ツールでJSONを読み取り、その意味を解釈し、`search_replace`または`write`ツールで直接HTMLを生成してください
   - ログファイルを見て、足りないところがないか確認
   - 確認したところは追記し、抜け漏れをなくす

## 処理のフェーズ分け

以下のようなフェーズ分けを推奨します：

- **フェーズ1**: HTML基本構造の作成（`<html>`, `<head>`, `<body>`, 基本スタイル）
- **フェーズ2以降**: 分割ファイルの段階的処理（分割ファイル数に応じて複数のフェーズに分割）
  - 例: フェーズ2で分割ファイル1-3、フェーズ3で分割ファイル4-6など
  - **重要: 各ファイル内でも行数ベースの段階的処理**
    - 各分割ファイルが大きい場合（500行以上）、ファイル内でも200-300行ずつ段階的に読み込んで処理してください
    - 例: 1000行のファイルの場合、フェーズ2-1（1-250行）、フェーズ2-2（251-500行）、フェーズ2-3（501-750行）、フェーズ2-4（751-1000行）のように分割
- **最終フェーズ**: メインファイルの直接ノード処理
  - メインファイルも大きい場合、同様に200-300行ずつ段階的に読み込んで処理してください

**各フェーズでのログ書き込みタイミング**:
1. **フェーズ開始時（JSONファイルを読み込む前）**: ログファイルを読み込み、処理開始の記録を更新（`startedAt`、フェーズの`status: "in_progress"`など）
2. **フェーズ完了時（HTMLに実装した後）**: ログファイルを更新し、処理完了の記録を更新（`status: "completed"`、`processedLines`、`nodesProcessed`、`completedAt`など）

**行数ベースの読み込み制限について**:
- **推奨行数: 200-300行/回**
  - 200行以下: 安全だが処理回数が増える
  - 200-300行: バランスが良く推奨（約5000-8000トークン）
  - 300-500行: 大きめだが、大きなノードがある場合は必要（約8000-13000トークン）
  - 500行以上: リスクが高く非推奨（トークン制限を超える可能性）
- **JSONの構造を考慮**: ノードの途中で切れないように、JSONの構造（`{`, `}`, `[`, `]`）を確認してから次のセクションに進んでください

## 統合ログファイルの形式

`{ファイル名}-conversion-log.json` は以下の形式で記録してください（`figma-json-split/{ファイル名}/` ディレクトリに配置）。

分割情報と処理進捗を統合した形式です：

```json
{
  "originalFile": "{元のファイル名}.json",
  "splitDate": "ISO 8601形式の日時",
  "splitOptions": {
    "maxSize": 50000,
    "maxNodes": 50,
    "maxDepth": 3
  },
  "splitStatistics": {
    "originalNodes": 547,
    "originalSize": 259394,
    "splitFiles": 11
  },
  "splitFiles": [
    {
      "file": "{ファイル名}-1.json",
      "size": 42771,
      "sizeKB": "41.77"
    }
  ],
  "conversion": {
    "startedAt": "ISO 8601形式の日時",
    "phases": {
      "phase1": {
        "status": "completed",
        "description": "HTML基本構造の作成",
        "completedAt": "ISO 8601形式の日時"
      },
      "phase2": {
        "status": "completed",
        "description": "分割ファイル1-3の処理",
        "completedAt": "ISO 8601形式の日時",
        "files": {
          "{ファイル名}-1.json": {
            "status": "completed",
            "processedLines": "1-1600",
            "totalLines": 1600,
            "nodesProcessed": 25,
            "notes": "処理内容の説明"
          },
          "{ファイル名}-2.json": {
            "status": "completed",
            "processedLines": "1-1912",
            "totalLines": 1912,
            "nodesProcessed": 28,
            "notes": "処理内容の説明"
          },
          "{ファイル名}-3.json": {
            "status": "completed",
            "processedLines": "1-2055",
            "totalLines": 2055,
            "nodesProcessed": 50,
            "notes": "処理内容の説明"
          }
        }
      },
      "phase3": {
        "status": "completed",
        "description": "分割ファイル4-6の処理",
        "completedAt": "ISO 8601形式の日時",
        "files": {
          "{ファイル名}-4.json": {
            "status": "completed",
            "processedLines": "1-1935",
            "totalLines": 1935,
            "nodesProcessed": 35,
            "notes": "処理内容の説明"
          }
        }
      },
      "phase4": {
        "status": "completed",
        "description": "メインファイルの直接ノード処理",
        "completedAt": "ISO 8601形式の日時",
        "processedLines": "112-1946",
        "totalLines": 1961,
        "nodesProcessed": 46,
        "notes": "全ノードを処理完了"
      }
    },
    "completedAt": "ISO 8601形式の日時",
    "summary": {
      "totalFilesProcessed": 11,
      "totalNodesProcessed": 312,
      "totalLinesProcessed": 19460,
      "allPhasesCompleted": true
    }
  }
}
```

**注意**: 
- 分割スクリプトの実行結果から分割情報を取得し、`{ファイル名}/{ファイル名}-conversion-log.json` の分割情報セクションに記録してください
- 各フェーズ処理時には必ず `conversion.phases` に進捗を記録してください
- 統合ログファイルの完全な例は `conversion-log-example.json` を参照してください

## 重要な注意事項

1. **⚠️ スクリプト作成・実行の完全禁止 ⚠️**
   - **絶対に禁止**: Node.js、JavaScript、Python、TypeScript、その他いかなるスクリプトやプログラムコードを作成してはいけません
   - **絶対に禁止**: `.js`、`.py`、`.ts`、`.mjs`などのスクリプトファイルを作成してはいけません
   - **絶対に禁止**: `node`、`python`、`npm`などのコマンドでスクリプトを実行してはいけません
   - **必須**: AIが直接`read_file`ツールを使用してJSONファイルを読み取り、その内容を理解し、手動でHTMLを生成してください
   - **必須**: `search_replace`または`write`ツールを使用して、読み取ったJSONの内容を直接HTMLに変換してください
   - スクリプトファイルを作成することは一切禁止です。作成した場合は削除してください

2. **⚠️ 変換ロジックの完全禁止 ⚠️**
   - **必ず変換ロジックを組んではいけません**
   - Node.jsやJavaScriptなどのスクリプトで変換処理を実装するのではなく、AIが直接JSONファイルを読み取り、その内容を理解して、手動でHTMLを生成してください
   - 読み取ったJSONの各ノードを、AIが直接解釈してHTMLに変換してください
   - 例: `read_file`でJSONを読み取り → ノードの`type`が`VECTOR`で`vectorPaths`があることを確認 → `<svg><path d="..." /></svg>`を生成 → `search_replace`でHTMLファイルに追加
3. **コマンド実行のルール**: コマンドを実行する際は、1コマンドにつき1回とし、`;`や`&&`などでつなげて実行しないでください。各コマンドは個別に実行してください
4. **全ノードの処理**: 各JSONファイルのすべてのノードを処理してください。主要なノードのみの処理は不可
   - **重要: 行数ベースの読み込み制限（必須）**
     - ファイルが大きい場合（500行以上）、一度に全ノードを読み込もうとせず、**200-300行ずつ**段階的に読み込んで処理してください
     - `read_file`ツールを使用する際は、必ず`offset`と`limit`パラメータを指定してください
     - 例: `read_file(target_file, offset=1, limit=250)` のように、開始行と読み込む行数を明示的に指定
     - 各読み込みセクションで、その範囲内のノードを完全に処理してから次のセクションに進んでください
     - ノードの完全性を保つため、JSONの構造（`{`, `}`, `[`, `]`）を考慮して、ノードが途中で切れないように注意してください
     - **推奨行数: 200-300行/回**
       - 200行以下: 安全だが処理回数が増える
       - 200-300行: バランスが良く推奨（約5000-8000トークン、Cursorの制限内で安全）
       - 300-500行: 大きめだが、大きなノードがある場合は必要（約8000-13000トークン、注意が必要）
       - 500行以上: リスクが高く非推奨（トークン制限を超える可能性が高い）
5. **ログファイルの確認**: 各フェーズ開始前にログファイルを確認し、未処理のファイルがないか確認してください
6. **段階的な処理**: 一度にすべてのファイルを読み込まず、フェーズごとに処理してください
7. **ログの書き込みタイミング（必須）**: 
   - **JSONファイルを読み込む前**: 必ずログファイルを読み込み、処理開始の記録を更新してください
   - **HTMLに実装した後**: 必ずログファイルを更新し、処理完了の記録を更新してください
   - この2つのタイミングでのログ書き込みは必須です。忘れずに実施してください

作業を開始してください。

**統合ログファイルの確認と初期化**:
- まず、`figma-json-split/{ファイル名}.json` を分割してください（ファイル名はユーザーがプロンプトで指定）
- 分割後、`figma-json-split/{ファイル名}/` ディレクトリが作成されます
- 統合ログファイル（`figma-json-split/{ファイル名}/{ファイル名}-conversion-log.json`）の `splitFiles` セクションを確認して、処理すべきファイルの一覧を把握してください
- ログファイルが存在しない場合、分割スクリプトの実行結果から分割情報を取得し、`{ファイル名}/{ファイル名}-conversion-log.json` の初期構造を作成してください
- 初期構造には分割情報（`originalFile`, `splitDate`, `splitOptions`, `splitStatistics`, `splitFiles`）を含め、`conversion` セクションは空の状態で開始してください
- **重要: ログの書き込みタイミング**
  - **各フェーズ開始時（JSONファイルを読み込む前）**: 必ずログファイルを読み込み、処理開始の記録を更新してください
  - **各フェーズ完了時（HTMLに実装した後）**: 必ずログファイルを更新し、処理完了の記録を更新してください
- 各フェーズ処理時には必ず `conversion.phases` に進捗を記録してください

**プロンプト終了**

---

### ステップ3: 複数ファイル対応

複数のJSONファイルを処理する場合、すべてのファイルを `figma-json-split/` ディレクトリ直下に配置します：

```
figma-json-split/
├── file1.json
├── file1/
│   ├── file1-split/
│   │   ├── file1-root.json (SPLIT_ROOT)
│   │   ├── file1-1.json
│   │   ├── file1-2.json
│   │   └── ... (分割されたファイルのみ)
│   ├── file1.html
│   └── file1-conversion-log.json
├── file2.json
├── file2/
│   ├── file2-split/
│   │   ├── file2-root.json (SPLIT_ROOT)
│   │   ├── file2-1.json
│   │   └── ... (分割されたファイルのみ)
│   ├── file2.html
│   └── file2-conversion-log.json
├── split-figma-json.js
└── PROMPT_FIGMA_JSON_TO_HTML.md
```

**複数ファイル処理時の注意点**:
- 各ファイルごとに独立してプロンプトを実行してください（ファイル名を指定）
- 各ファイルごとに独自の `{ファイル名}/{ファイル名}-conversion-log.json` を作成してください（分割情報と処理進捗を統合）
- すべてのファイルは `figma-json-split/` ディレクトリ直下に配置されます

## 変換ルール

### Figma JSON → HTML/CSS マッピング

| Figma プロパティ | HTML/CSS 変換 |
|----------------|--------------|
| `type: "FRAME"` | `<div style="position: absolute;">` |
| `type: "TEXT"` | `<span>` または `<p>` |
| `type: "VECTOR"` | `<svg>` または `<div>` (背景色/ボーダー) |
| `type: "GROUP"` | `<g>` または `<div>` |
| `x`, `y` | `left: {x}px; top: {y}px;` |
| `width`, `height` | `width: {width}px; height: {height}px;` |
| `fills[0].color` (RGB) | `background-color: rgb({r*255}, {g*255}, {b*255});` |
| `strokes[0].color` (RGB) | `border: {strokeWeight}px solid rgb(...);` または `stroke: rgb(...);` |
| `cornerRadius` | `border-radius: {cornerRadius}px;` |
| `fontSize` | `font-size: {fontSize}px;` |
| `fontName.family` | `font-family: {family};` |
| `fontName.style` | `font-weight: {style === "Bold" ? "bold" : "normal"};` |
| `textAlign` | `text-align: {textAlign};` |
| `textDecoration` | `text-decoration: {textDecoration === "UNDERLINE" ? "underline" : "none"};` |
| `vectorPaths[0].data` | SVGの `<path d="{data}">` |

## 品質チェックポイント

処理完了後、以下を確認してください：

1. **ログファイルの確認**
   - すべてのフェーズが `"status": "completed"` になっているか
   - すべてのファイルが処理されているか
   - `allPhasesCompleted: true` になっているか

2. **HTMLファイルの確認**
   - すべてのノードがHTMLに変換されているか
   - スタイルが正しく適用されているか
   - 位置情報（`x`, `y`）が正しく変換されているか

3. **抜け漏れの確認**
   - ログファイルの `processedLines` と `totalLines` が一致しているか
   - 各ファイルの `nodesProcessed` が適切か

## トラブルシューティング

### 問題: 統合ログファイルが見つからない

**解決策**: 
1. 新規に `figma-json-split/{ファイル名}/{ファイル名}-conversion-log.json` を作成し、初期構造を設定してください
2. 分割スクリプトの実行結果から分割情報を取得し、`{ファイル名}/{ファイル名}-conversion-log.json` の分割情報セクションに記録してください

### 問題: 分割ファイルが見つからない

**解決策**: 
1. `{ファイル名}/{ファイル名}-conversion-log.json` の `splitFiles` セクションを確認して、分割ファイルの一覧を確認
2. 分割が完了していない場合は、`split-figma-json.js` を実行して分割してください

### 問題: HTMLファイルが不完全

**解決策**:
1. ログファイルを確認して、未処理のファイルやフェーズを特定
2. 該当するファイルを再度処理してください

## 使用例

### 単一ファイルの処理

1. `figma-json-split/` ディレクトリに `{ファイル名}.json` が存在することを確認（例: `work-table-screen1.json`）
2. プロンプトファイルの「プロンプト開始」から「プロンプト終了」までの内容をAIに送信し、ファイル名を指定（例: "work-table-screen1.json を処理してください"）
3. AIが処理を開始し、段階的にHTMLファイルを生成
4. `figma-json-split/{ファイル名}/{ファイル名}.html` と `figma-json-split/{ファイル名}/{ファイル名}-conversion-log.json` が生成される（または更新される）

### 複数ファイルの処理

**例: 3つのJSONファイルを処理する場合**

```
1. figma-json-split/
   ├── screen1.json
   ├── screen2.json
   ├── screen3.json
   └── PROMPT_FIGMA_JSON_TO_HTML.md

2. プロンプトを送信し、ファイル名を指定（例: "screen1.json を処理してください"）
   → screen1.html と screen1-conversion-log.json が生成

3. 再度プロンプトを送信し、別のファイル名を指定（例: "screen2.json を処理してください"）
   → screen2.html と screen2-conversion-log.json が生成

4. 再度プロンプトを送信し、別のファイル名を指定（例: "screen3.json を処理してください"）
   → screen3.html と screen3-conversion-log.json が生成
```

### 実際のプロンプト送信例

```
work-table-screen1.json をHTMLに変換してください。

（プロンプトファイルの「プロンプト開始」から「プロンプト終了」までの内容を送信）
```

または、より具体的に：

```
figma-json-split/work-table-screen1.json をHTMLに変換する作業を実施してください。

## 作業要件

0. 分割の必要性の判断
   - まず、figma-json-split/work-table-screen1.json のサイズ、行数、ノード数を確認してください
   ...

（プロンプトファイルの内容をそのまま送信）
```

## 補足情報

- **ファイル配置**: 元のJSONファイルは `figma-json-split/` ディレクトリの直下に配置されます
- **ファイル名の指定**: ファイル名はユーザーがプロンプト文（チャット）で直接メンションします（例: "work-table-screen1.json を処理してください"）
- **分割の実施**: すべてのファイルは分割を試みます。分割結果が1ファイルになっても問題ありません
- **分割スクリプト**: `split-figma-json.js` は既に存在するため、必ず使用してください
- **統合ログファイル**: `{ファイル名}/{ファイル名}-conversion-log.json` は分割情報と処理進捗の両方を記録するため、作業の再開や進捗確認に役立ちます
- **分割情報の取得**: 分割スクリプトの実行結果から分割情報を取得し、`{ファイル名}/{ファイル名}-conversion-log.json` に記録してください
- **進捗記録**: 各フェーズ処理時には必ず `conversion.phases` に進捗を記録してください

---

**このプロンプトを使用することで、誰でも分割済みJSONファイルからHTMLファイルへの変換を実施できます。**


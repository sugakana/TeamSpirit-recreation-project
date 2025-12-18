# 勤務表画面 使用ガイド

## 概要

このガイドでは、新しく作成された勤務表画面（`AttendanceSheet.vue`）の使用方法と実装の詳細を説明します。

## ファイル構成

```
frontend/
├── src/
│   ├── views/
│   │   ├── AttendanceSheet.vue        # 勤務表画面コンポーネント
│   │   └── AttendanceSheet.md         # 技術ドキュメント
│   └── router/
│       └── index.js                    # ルーター設定（更新済み）
└── ATTENDANCE_SHEET_GUIDE.md          # このファイル
```

## アクセス方法

### 開発環境での起動

```bash
cd frontend
npm run dev
```

### URL
ブラウザで以下のURLにアクセス：

```
http://localhost:5173/attendance
```

## 画面の使い方

### 1. ヘッダー情報
画面上部に表示される情報：
- **部署**: 310 TechE
- **勤務体系**: フレックスタイム制（一般）
- **社員名**: 須賀哉斗

### 2. 月の切り替え
- **前月**: 「<<前月」リンクをクリック
- **今月**: 「今月」リンクをクリック
- **次月**: 「次月>>」リンクをクリック

### 3. 勤務データの表示
テーブルには以下の情報が表示されます：
- **日付**: 日にちと曜日
- **勤務状況**: 出勤、有給などのステータス
- **出社・退社時刻**: HH:MM形式
- **勤務場所**: オフィス、在宅など
- **工数**: 勤務時間（時間単位）
- **タイムライン**: 視覚的な勤務時間バー

### 4. 申請の追加
各日付行の「申請」列にある「＋」ボタンをクリックすると、新しい申請を作成できます（現在はモック実装）。

### 5. 月次サマリー
画面下部に以下の集計情報が表示されます：
- 総勤務時間
- 実働時間
- 残業時間
- 有給取得日数

## 実装の特徴

### 🎨 デザインの実用性

#### 採用した技術
- **Flexbox**: ヘッダーやコントロールバーの柔軟な配置
- **CSS Grid**: サマリーセクションの均等配置
- **テーブルレイアウト**: データの明確な整理

#### 避けた実装
- ❌ 絶対位置（`position: absolute`）の多用
  - 理由: メンテナンス性が低く、レスポンシブ対応が困難
- ❌ 細かすぎる数値指定（例: `left: 127.6162109375px`）
  - 理由: 実用的でなく、デバッグが困難

### 📱 レスポンシブ対応

画面サイズに応じて自動的にレイアウトを調整：

- **デスクトップ（1200px以上）**: 3カラムヘッダー、横並びコントロール
- **タブレット（768px-1200px）**: 2カラムヘッダー、縦積みコントロール
- **モバイル（768px以下）**: 1カラムレイアウト、フォントサイズ縮小

### 🎨 カラースキーム

#### ヘッダー
- 背景: 青色グラデーション（#2564A0）
- テキスト: 白色

#### テーブル行
- 週末: ベージュ（#FCE8D9）
- 平日（奇数行）: 薄い青（#E8F4FF）
- 平日（偶数行）: ほぼ白（#FCFCFC）

#### タイムラインバー
- オフィス勤務: 緑色グラデーション
- 在宅勤務: 青色グラデーション
- 有給など: 黄色（半透明）

## カスタマイズ方法

### データの変更

`AttendanceSheet.vue`の`daysInMonth`配列を編集：

```javascript
const daysInMonth = ref([
  {
    date: '1 土',
    rowClass: 'weekend',
    status: '',
    checkIn: '',
    checkOut: '',
    location: '',
    hours: '',
    timeline: null,
    showAddButton: true
  },
  // ... 他の日付
]);
```

### API連携の追加

将来的にAPIからデータを取得する場合：

```javascript
import { ref, onMounted } from 'vue';

const daysInMonth = ref([]);

const fetchAttendanceData = async () => {
  try {
    const response = await fetch('/api/attendance/2025/11');
    const data = await response.json();
    daysInMonth.value = data.days;
  } catch (error) {
    console.error('データの取得に失敗しました:', error);
  }
};

onMounted(() => {
  fetchAttendanceData();
});
```

### スタイルのカスタマイズ

CSS変数を使用してテーマカラーを簡単に変更できるように拡張可能：

```css
:root {
  --header-bg: #2564A0;
  --primary-color: #007DD2;
  --accent-color: #0096FF;
  --weekend-bg: #FCE8D9;
  --weekday-bg: #E8F4FF;
}
```

## トラブルシューティング

### 画面が表示されない

1. **ルーターの確認**: `frontend/src/router/index.js`に以下が追加されているか確認

```javascript
{
  path: '/attendance',
  name: 'AttendanceSheet',
  component: () => import('../views/AttendanceSheet.vue')
}
```

2. **URLの確認**: `http://localhost:5173/attendance`にアクセスしているか確認

3. **コンソールエラーの確認**: ブラウザの開発者ツールでエラーを確認

### レイアウトが崩れる

1. **ブラウザのキャッシュをクリア**: Ctrl+Shift+R（Windows）、Cmd+Shift+R（Mac）
2. **CSSの確認**: `<style scoped>`タグが正しく閉じられているか確認
3. **ブラウザの互換性**: 最新版のChrome、Firefox、Safari、Edgeを使用

### タイムラインバーが表示されない

1. **データの確認**: `timeline`プロパティに正しいスタイル文字列が設定されているか確認

```javascript
timeline: 'left: 37.5%; width: 37.5%; background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%);'
```

2. **相対位置**: `.col-timeline`に`position: relative`が設定されているか確認

## 今後の開発予定

### フェーズ1: 基本機能の完成（現在）
- ✅ 画面レイアウトの実装
- ✅ モックデータの表示
- ✅ レスポンシブ対応

### フェーズ2: データ連携
- ⏳ バックエンドAPI接続
- ⏳ 勤務データのCRUD操作
- ⏳ 申請機能の実装

### フェーズ3: 高度な機能
- ⏳ タイムラインのドラッグ&ドロップ編集
- ⏳ PDF/CSVエクスポート
- ⏳ リアルタイム同期（WebSocket）
- ⏳ 通知機能

### フェーズ4: 最適化
- ⏳ パフォーマンス最適化
- ⏳ アクセシビリティ向上
- ⏳ 国際化対応（i18n）

## 参考資料

### 技術ドキュメント
- [AttendanceSheet.md](src/views/AttendanceSheet.md) - 詳細な技術仕様

### Vue.js公式ドキュメント
- [Vue 3 公式ドキュメント](https://ja.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Composition API](https://ja.vuejs.org/guide/extras/composition-api-faq.html)

### CSS参考資料
- [Flexbox完全ガイド](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS Grid完全ガイド](https://css-tricks.com/snippets/css/complete-guide-grid/)

## サポート

質問や問題がある場合は、プロジェクトのIssueトラッカーに投稿してください。

---

**作成日**: 2025年12月1日  
**最終更新**: 2025年12月1日  
**バージョン**: 1.0.0







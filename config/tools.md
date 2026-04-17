# ツール設定

使用するツールを `有効` / `無効` で切り替える。
オンボーディング時に自動設定されるが、手動での変更も可能。

## メール

- **状態**: 有効
- **ツール**: Gmail
- **操作方法**: Gmail MCP
- **主要動作**: search_threads, get_thread, create_draft, list_drafts, list_labels, create_label

## カレンダー

- **状態**: 有効
- **ツール**: Google Calendar
- **操作方法**: Google Calendar MCP
- **タイムゾーン**: Asia/Tokyo
- **主要動作**: list_calendars, list_events, get_event, create_event, update_event, delete_event, suggest_time, respond_to_event

## チャット

- **状態**: 有効
- **ツール**: Slack, Discord
- **操作方法**: 手動コピペ（MCP未接続）

## ドキュメント

- **状態**: 有効
- **ツール**: Google Drive
- **操作方法**: Google Drive MCP
- **主要動作**: google_drive_search, google_drive_fetch
- **備考**: 現時点では読み取り系のみ。書き込み・編集は手動で行う

## タスク管理

- **状態**: 無効
- **ツール**: （例: GitHub Issues / Linear / Todoist）
- **操作方法**: （例: gh CLI, Linear MCP）

## コード管理

- **状態**: 有効
- **ツール**: GitHub
- **操作方法**: ローカル VS Code 上の GitHub CLI（`gh`）
- **役割分担**: Cowork（Claude）は PR 本文・コミットメッセージの文案生成まで担当。`git push` および `gh pr create` の実行はユーザーが VS Code 側で行う
- **関連プロトコル**: `protocols/pr-review.md`

## 注意事項

- タイムゾーン付きAPI呼び出し時、dateTimeに"Z"（UTC）をつけない
- MCP系ツールは初回・トークン切れ時に再認証が必要な場合がある

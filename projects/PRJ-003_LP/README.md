# PRJ-003_LP: Akuboxel ポートフォリオ兼LP

## 依頼情報

| 項目 | 内容 |
|------|------|
| 番号 | PRJ-003 |
| 屋号 | Akuboxel |
| 運営者 | 大山 圭一朗 |
| 依頼内容 | VRC向け3DCGクリエイター兼デザイナー「Akuboxel」の1ペライチポートフォリオ兼LPの制作 |
| 公開ドメイン | https://akuboxel.com/ （既取得、現状は WordPress 跡地） |
| サーバー | ConoHa Wing Biz ライトプラン（既契約） |
| 依頼日 | 2026-04-23 |
| 納期 | 2026-05-30 |
| ステータス | 要件定義・法的リサーチ・運用設計完了、Antigravity 引き渡し待ち |
| 種別 | 自社ポートフォリオ兼ランディングページ |
| 参考サイト | https://studio.umeugu.com/ |

## 関連ドキュメント

| ドキュメント | パス | 更新日 |
|-------------|------|--------|
| 要件定義書 | `./requirements.md` | 2026-04-23 |
| 法的・ToSリスク調査 | `./resources/2026-04-23-legal-tos-risks.md` | 2026-04-23 |
| 景表法コンプライアンス調査 | `./resources/2026-04-23-keihyoho-compliance.md` | 2026-04-23 |
| デプロイ運用書（WP撤去・CI/CD） | `./resources/2026-04-23-deployment-runbook.md` | 2026-04-23 |
| Claude Design 運用ガイド | `./resources/2026-04-23-claude-design-guide.md` | 2026-04-23 |
| 送信完了画面本文・自動返信メール | `./content/thanks-page.md` | 2026-04-23 |
| 実装報告 | `./report.md` | 未作成（Antigravity が着手時に作成） |
| PRレビュー | `./notes/YYYY-MM-DD-pr-review.md` | 未作成 |

## 技術スタック

| レイヤ | 採用技術 |
|--------|---------|
| フロントエンド | 手書き HTML5 + CSS3 + Vanilla JavaScript（ES2022） |
| スタイリング | カスタムプロパティ（CSS変数）、PostCSS で最小化 |
| バックエンド | PHP 8.x + PHPMailer（SMTP 送信） |
| メール送信 | ConoHa 独自ドメインメール（info@akuboxel.com 経由） |
| データベース | なし（静的ポートフォリオ兼LP、フォーム送信は永続化しない） |
| ホスティング | ConoHa Wing Biz ライトプラン（akuboxel.com） |
| デプロイ | GitHub Actions → SSH/SFTP で `public_html/` 同期 |
| SSL | Let's Encrypt（ConoHa Wing 標準、自動更新） |
| リポジトリURL | 未作成（GitHub プライベートリポジトリ予定） |

## 受注チャネル設計

| チャネル | 主たる用途 | 規約上の留意点 |
|---------|-----------|--------------|
| 問い合わせフォーム | 本命窓口（ワールド制作、カスタム相談） | 特商法表記を整備 |
| ココナラ | エスクロー決済・定型プラン | プラットフォーム外誘導禁止 |
| ENRAI | 既製アセット販売 | 永続ライセンス付与 |

## 成果物

| ファイル名 | 説明 |
|-----------|------|
| requirements.md | 要件定義書（Antigravity `web-coder` 用の一次ソース） |
| resources/2026-04-23-legal-tos-risks.md | 法的・ToSリスクのリサーチレポート |
| resources/2026-04-23-keihyoho-compliance.md | 景品表示法に基づく表示要件リサーチ |
| resources/2026-04-23-deployment-runbook.md | WordPress撤去・ConoHa設定・GitHub Actions構築の運用書 |
| resources/2026-04-23-claude-design-guide.md | Claude Design を用いたフェーズ2 デザインレビューのステップバイステップガイド |
| content/thanks-page.md | 送信完了画面本文と自動返信メールテンプレート |

## 進捗

- 2026-04-23 プロジェクト作成、参考サイト情報をもとに要件定義書ドラフト完了
- 2026-04-23 未決定事項4項目をユーザー確認、要件定義書へ反映
- 2026-04-23 屋号「Akuboxel」確定、外部チャネル（ココナラ／ENRAI）追加
- 2026-04-23 法的・ToSリスクのリサーチを実施し、特商法表記・規約遵守事項を要件に反映
- 2026-04-23 参考サイト（UGUISU）の実態を検索経由で再調査、単品メニュー＋ライセンスプラン方式を把握
- 2026-04-23 料金構造を再設計: ワールドはパッケージ3区分（Indie Discount / Indie Standard / Corporate・Private）、アクセサリー・小物・ギミックは単品メニュー＋ライセンス3段階
- 2026-04-23 再販許諾プラン（-25%）＋広告掲載プラン（-20%）の二重割引（乗算で -40%）を設計
- 2026-04-23 フォーム送信完了メッセージと管理ID（タイムスタンプハッシュ由来）の採番仕様を追加
- 2026-04-23 景品表示法リサーチを実施、要件9節およびV-05（景表法表示ページ）を追加
- 2026-04-23 アクセサリー・家具を3,000〜5,000円帯に刻み直し、作業時間上限と仕様範囲前提を併記
- 2026-04-23 公開ドメイン akuboxel.com とサーバー ConoHa Wing Biz ライトプランの利用方針を確定
- 2026-04-23 技術スタックを ConoHa Wing 親和に変更（手書き HTML/CSS/JS + PHP + ConoHa SMTP）
- 2026-04-23 WordPress 撤去手順、CI/CD（GitHub Actions → SSH/SFTP）構築のデプロイ運用書を作成
- 2026-04-23 フェーズ2に Claude Design でのフロントエンドレビューを組み込み、ステップバイステップ運用ガイドを作成
- 2026-04-23 ローカルリポジトリのブートストラップ手順（Phase 1.4）を運用書に追記
- 2026-04-23 Antigravity 引き渡し時のディレクトリ役割分担（参照／作業）を要件定義書に明記
- 2026-04-23 Antigravity 引き渡し準備完了

## Antigravity への引き渡し手順

要件定義書 11節「Antigravity 引き渡し時のディレクトリ役割分担」に従い、参照ディレクトリと作業ディレクトリを分離して指示する。

事前に完了している必要があるタスク

1. WordPress 完全バックアップ（3箇所以上に保存）
2. ConoHa 独自ドメインメール（info@akuboxel.com、noreply@akuboxel.com）の発行
3. GitHub プライベートリポジトリ `akuboxel-site` の作成、Secrets 登録
4. SSH キーペア生成と ConoHa Wing への公開鍵登録
5. ローカルへのリポジトリクローンと初期スキャフォールド（運用書 Phase 1.4 を参照）

引き渡しコマンド例（Antigravity で実行）

参照: `AkuboxelHQ/ai-secretary/projects/PRJ-003_LP/`
作業: `AkuboxelHQ/akuboxel-site/`
指示: requirements.md と resources/ 配下を読み込み、フィーチャーブランチで実装 → PR を作成してください。

## 備考

- 本案件は `protocols/requirements-definition.md` の動作確認を兼ねたポートフォリオ用デモである
- 作例画像・SNS URL・外部チャネルURLはダミー値として Antigravity 側で仮置きする
- 独自ドメインおよびリポジトリホスティングは使用せず、Vercel プレビューURLで提示する想定
- Antigravity 引き渡し後、実装結果は `report.md` に記録される予定
- プライバシーポリシーは PRJ-002 の `content/privacy-policy.md` を雛形として流用する想定（屋号・連絡先差し替え前提）
- 特商法表記ページは `/legal/tokushoho` に配置し、連絡先は「請求があれば遅滞なく開示」方式を採用する

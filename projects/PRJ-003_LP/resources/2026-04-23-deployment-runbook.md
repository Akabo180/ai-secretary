# デプロイ運用書: akuboxel.com 移行と CI/CD 構築

本書は PRJ-003_LP を akuboxel.com に公開するまでの、WordPress 撤去・サーバー設定・GitHub Actions 連携を定義する手順書である。

## 0. 前提

| 項目 | 内容 |
|------|------|
| ドメイン | akuboxel.com（既取得、現在 WordPress 跡地） |
| サーバー | ConoHa Wing Biz ライトプラン |
| デプロイ方式 | GitHub Actions から SSH/SFTP で `public_html/` に同期 |
| WordPress 跡地の方針 | 完全撤去（バックアップだけ保持） |
| ドメインメール | info@akuboxel.com（新規発行） |

## 1. 事前準備（人間が実施）

### 1.1 WordPress 完全バックアップ

撤去前に、戻れる状態を必ず作る。

1. ConoHa Wing コントロールパネルにログイン
2. 「サイト管理」→「バックアップ」→ 自動バックアップが有効であることを確認（14日保持）
3. 手動バックアップを取得
   - ファイル: SFTP で `public_html/` 全体を圧縮ダウンロード（推奨ツール: WinSCP、Cyberduck、FileZilla）
   - データベース: phpMyAdmin で MySQL ダンプを取得（`.sql` 形式）
   - WordPress 管理画面からプラグイン「All-in-One WP Migration」等で `.wpress` 形式でも併行取得すると安全
4. バックアップ一式を以下に保存
   - ローカル: `~/akuboxel-backup/2026-04-23/`
   - クラウド: Google Drive / OneDrive 等の外部ストレージ
5. `2026-04-23-wordpress-backup.md` に取得日時、ファイル一覧、保存場所を記録

### 1.2 ConoHa Wing 側の事前設定

1. 独自ドメインメールを発行
   - コントロールパネル → 「メール管理」→ アカウント追加
   - アドレス: `info@akuboxel.com`、`noreply@akuboxel.com`（自動返信用）
   - SMTP/IMAP の接続情報を控える（ホスト、ポート、ユーザー名、パスワード）
2. SSH/SFTP のアクセス情報を確認
   - 「契約管理」→「サーバー情報」→ SSH ホスト、ポート、ユーザー名
   - SSH キーペアを生成し、公開鍵を ConoHa に登録（`~/.ssh/authorized_keys`）
3. PHP バージョンを 8.2 系（または最新安定版）に設定
4. `php.ini` 設定確認
   - `display_errors = Off`（本番）
   - `log_errors = On`
   - `upload_max_filesize`、`post_max_size` は本案件では大きく不要

### 1.3 GitHub リポジトリの作成

1. GitHub でプライベートリポジトリ `akuboxel-site` を作成（README、`.gitignore`、ライセンスは未追加でよい）
2. 以下を Secrets に登録（Settings → Secrets and variables → Actions）
   - `CONOHA_SSH_HOST`
   - `CONOHA_SSH_PORT`
   - `CONOHA_SSH_USER`
   - `CONOHA_SSH_PRIVATE_KEY`（秘密鍵全文）
   - `CONOHA_DEPLOY_PATH`（例: `/home/{user}/akuboxel.com/public_html`）
   - `SMTP_USER`、`SMTP_PASS`、`RECAPTCHA_SECRET`（本番用、別途 ConoHa 側 `.env` にも反映）

### 1.4 ローカルリポジトリのブートストラップ

GitHub Secrets までの設定が終わっても、ローカル作業ディレクトリと GitHub リポジトリは未接続である。Antigravity に引き渡す前に、リポジトリをローカルにクローンし、最小限の足場（`.gitignore`、`.env.example`、`README.md`、フォルダ構造）を整え、初回コミットを GitHub に反映するまでを完了させる。

#### 1.4.1 前提の確認

実行前に以下を確認する。

1. ローカル PC に Git for Windows（または同等の Git クライアント）がインストールされていること（`git --version` で確認）
2. GitHub への認証手段が用意されていること（推奨: SSH キー登録、代替: Personal Access Token）
   - SSH 接続テスト: `ssh -T git@github.com`
   - 認証成功なら「Hi `<username>`! You've successfully authenticated」が返る
3. Git のユーザー設定が済んでいること
   - `git config --global user.name "Keiichiro Oyama"`
   - `git config --global user.email "k.oyama@akabowork.com"`

注意点として、ConoHa Wing にデプロイ用に登録した SSH 鍵と、GitHub への認証用の SSH 鍵は別系統で問題ない。混同を避けるため、ファイル名で区別することを推奨する（例: `id_ed25519_github`、`id_ed25519_conoha`）。

#### 1.4.1-a GitHub 用 SSH 鍵のセットアップ手順

`ssh -T git@github.com` が `Permission denied (publickey)` を返す場合は、GitHub 側に公開鍵が登録されていない。以下の手順で GitHub 専用の SSH 鍵を生成・登録する。

```powershell
# 1. GitHub 用 SSH 鍵を生成
ssh-keygen -t ed25519 -C "k.oyama@akabowork.com" -f "$env:USERPROFILE\.ssh\id_ed25519_github"

# 2. ssh-agent を起動して鍵を登録
Get-Service ssh-agent | Set-Service -StartupType Manual ; Start-Service ssh-agent ; ssh-add "$env:USERPROFILE\.ssh\id_ed25519_github"

# 3. 公開鍵をクリップボードへ
Get-Content "$env:USERPROFILE\.ssh\id_ed25519_github.pub" | Set-Clipboard

# 4. ブラウザで https://github.com/settings/keys を開き、
#    「New SSH key」→ Title 任意 → Key にクリップボードを貼り付けて Add SSH key

# 5. ~/.ssh/config に GitHub 用エントリを追記
$configPath = "$env:USERPROFILE\.ssh\config"
@"
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes
"@ | Out-File -Encoding utf8 -Append $configPath

# 6. 再度接続テスト
ssh -T git@github.com
# 成功なら「Hi <username>! You've successfully authenticated...」が表示される
```

ssh-agent の起動コマンドで Access denied 等が出る場合は、PowerShell を「管理者として実行」で起動し直す。`ssh -vT git@github.com` で詳細ログを取得すると、どの鍵を試行しているかが debug ログで確認できる。

#### 1.4.2 配置先のフォルダ構成

`AkuboxelHQ/` 配下に、計画ドキュメントと実装コードを並置する構成を推奨する。

```
AkuboxelHQ/
├── ai-secretary/                       # 既存。要件定義・運用書・ナレッジ
│   └── projects/PRJ-003_LP/            # 本案件の要件定義・リサーチ・運用書
└── akuboxel-site/                      # 新規作成。GitHub リポジトリのローカルクローン
    ├── .git/
    ├── .gitignore
    ├── .env.example
    ├── README.md
    ├── public_html/                    # 本番デプロイ対象
    ├── src/                            # ビルド前のソース置き場
    ├── tests/                          # PHPUnit / Vitest / Playwright のテストコード
    ├── docs/                           # 実装メモ、ADR 等
    └── .github/workflows/              # CI/CD ワークフロー
```

#### 1.4.3 PowerShell 手順（Windows 想定）

ターミナルを PowerShell で開き、以下の順に実行する。

```powershell
# 1. 配置先に移動
Set-Location -Path "$env:USERPROFILE\AkuboxelHQ"

# 2. リポジトリをクローン（SSH 経由を推奨。<username> はご自身のGitHubアカウント名に置換）
git clone git@github.com:<username>/akuboxel-site.git
Set-Location -Path "akuboxel-site"

# 3. 初期フォルダを作成
New-Item -ItemType Directory -Force -Path ".github/workflows", "public_html", "src", "tests", "docs" | Out-Null

# 4. 空ディレクトリを Git で追跡できるよう .gitkeep を配置
"" | Out-File -Encoding utf8 ".github/workflows/.gitkeep"
"" | Out-File -Encoding utf8 "public_html/.gitkeep"
"" | Out-File -Encoding utf8 "src/.gitkeep"
"" | Out-File -Encoding utf8 "tests/.gitkeep"
"" | Out-File -Encoding utf8 "docs/.gitkeep"

# 5. .gitignore、.env.example、README.md を作成（次節のテンプレートを使用）
# ※ 各ファイルの内容は次節「1.4.4 初期ファイルテンプレート」を参照

# 6. 初回コミットとプッシュ
git add .
git commit -m "chore: bootstrap akuboxel-site with .gitignore, .env.example, and folder skeleton"
git branch -M main
git push -u origin main
```

ワンライナーで連結する場合はセミコロン `;` を使用する（PowerShell の流儀）。

#### 1.4.4 初期ファイルテンプレート

`.gitignore`

```gitignore
# 環境変数（本番秘密情報）
.env
.env.local
.env.production
.env.*.local

# Node.js / ビルド成果物
node_modules/
dist/
build/
.cache/
.parcel-cache/
.next/

# PHP / Composer
vendor/
composer.phar
*.log

# OS / エディタ
.DS_Store
Thumbs.db
.vscode/
.idea/
*.swp
*.swo

# テスト出力
coverage/
.nyc_output/
test-results/
playwright-report/
playwright/.cache/

# ConoHa バックアップ（誤コミット防止）
*.sql
*.sql.gz
backup/
wordpress-backup/

# Secrets / 鍵ファイル
*.pem
*.key
id_rsa*
id_ed25519*
secrets/
```

`.env.example`（実際の値を入れず、テンプレートとして扱う）

```ini
# ConoHa 独自ドメインメール（SMTP）
SMTP_HOST=smtp.akuboxel.com
SMTP_PORT=587
SMTP_USER=info@akuboxel.com
SMTP_PASS=
SMTP_FROM=noreply@akuboxel.com

# 通知先（運営者の受信用）
NOTIFY_TO=info@akuboxel.com

# reCAPTCHA v3
RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET=

# 環境識別子
APP_ENV=production
```

`README.md`

```markdown
# akuboxel-site

VRC向け3DCGクリエイター Akuboxel の公式サイト（https://akuboxel.com/）の実装リポジトリ。

## 関連ドキュメント

- 要件定義書: `../ai-secretary/projects/PRJ-003_LP/requirements.md`
- デプロイ運用書: `../ai-secretary/projects/PRJ-003_LP/resources/2026-04-23-deployment-runbook.md`

## 技術スタック

手書き HTML5 + CSS3 + Vanilla JavaScript + PHP 8.x、ConoHa Wing Biz ライトプランで稼働。

## デプロイ

main ブランチへのマージで GitHub Actions が起動し、ConoHa Wing に自動配信する。

## ローカル開発

詳細は要件定義書を参照。
```

#### 1.4.5 ブランチ保護ルールの設定（推奨）

GitHub の Web UI で `Settings → Branches → Add branch protection rule` を開き、main ブランチに対して以下を有効化する。

- Require a pull request before merging
- Require status checks to pass before merging（テストワークフロー名を選択、ワークフロー作成後に設定）
- Do not allow bypassing the above settings

これにより、`main` への直接 push を禁止し、必ず PR と CI 通過を経てマージする運用となる。

#### 1.4.6 完了確認

以下を満たしていることを確認する。

- [ ] `AkuboxelHQ/akuboxel-site/` が存在し、GitHub の `akuboxel-site` リポジトリと連携している
- [ ] `.gitignore`、`.env.example`、`README.md` が main ブランチにコミットされている
- [ ] `git remote -v` で origin が `git@github.com:<username>/akuboxel-site.git` を指している
- [ ] GitHub Web 上で初回コミットが反映されている
- [ ] `.env` 本体（実値入り）はコミット対象外であることを `git status` で確認

## 2. WordPress 撤去手順

### 2.1 撤去前チェック

- バックアップが3箇所以上に保存されていることを確認
- 復元手順を文書化済みであることを確認
- 旧 WordPress URL の Google 検索順位、被リンク状況を Search Console で確認（撤去後に 410 Gone を返す方針）

### 2.2 撤去実行

1. 一旦メンテナンスモードに切り替え（`.htaccess` で全アクセスを 503 に）
2. SFTP で `public_html/` 配下の WordPress 関連ファイルを全削除
   - `wp-admin/`、`wp-content/`、`wp-includes/`、`wp-*.php`、`index.php`、`xmlrpc.php`、`.htaccess`
3. ConoHa Wing のデータベース管理から WordPress 用 MySQL データベースを削除（または rename して退避）
4. WordPress 用の DB ユーザーを削除
5. `public_html/` を空にした状態で、暫定の `index.html`（「リニューアル準備中」）を配置

### 2.3 撤去後の検証

- ブラウザで `https://akuboxel.com/` にアクセスし、暫定ページが表示されることを確認
- 旧 WordPress の代表 URL（`/wp-admin/`、`/wp-login.php`、旧記事URL 等）が 404 または 410 を返すことを確認
- Google Search Console で旧 URL の削除リクエストを送信（任意）

## 3. 新サイトの初期デプロイ

### 3.1 GitHub Actions ワークフローの設計

`.github/workflows/deploy.yml` の構成案（実装は Antigravity が担当）。

```yaml
name: Deploy to ConoHa Wing

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - uses: shivammathur/setup-php@v2
        with: { php-version: '8.2' }
      - run: npm ci
      - run: composer install --no-dev --optimize-autoloader
      - run: npm test
      - run: ./vendor/bin/phpunit

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build  # Sharp で画像最適化、esbuild で JS 最小化、PostCSS で CSS 最小化
      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist/ }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist, path: dist/ }
      - name: Deploy via SSH/rsync
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.CONOHA_SSH_HOST }}
          port: ${{ secrets.CONOHA_SSH_PORT }}
          username: ${{ secrets.CONOHA_SSH_USER }}
          key: ${{ secrets.CONOHA_SSH_PRIVATE_KEY }}
          script: |
            # 別途、rsync またはアトミックスワップで dist を public_html に反映
```

代替として、`SamKirkland/FTP-Deploy-Action` で SFTP 経由のアップロードも可。SSH 鍵がより安全な方式のため、appleboy/ssh-action を推奨する。

### 3.2 ConoHa 側 `.env` の配置

Web から見えない位置（例: `/home/{user}/akuboxel.com/.env`）に環境変数ファイルを置く。`/api/contact.php` 内で `parse_ini_file()` で読み込む。

```ini
SMTP_HOST=smtp.akuboxel.com
SMTP_PORT=587
SMTP_USER=info@akuboxel.com
SMTP_PASS=*****
SMTP_FROM=noreply@akuboxel.com
RECAPTCHA_SECRET=*****
NOTIFY_TO=info@akuboxel.com
```

`.htaccess` で `.env` の Web 公開を禁止する。

```apache
<Files ".env">
  Require all denied
</Files>
```

### 3.3 初回デプロイの流れ

1. main ブランチにマージ → GitHub Actions が起動
2. テスト → ビルド → SSH でデプロイ
3. ConoHa Wing 上で `https://akuboxel.com/` をブラウザ確認
4. フォーム送信を実機テスト（管理ID表示、自動返信メール、運営者宛通知メール）
5. Lighthouse / axe-core / securityheaders.com で品質確認

## 4. 運用フェーズ

### 4.1 通常更新

- 機能追加・コンテンツ更新は Pull Request 経由で main にマージ
- main へのマージで自動デプロイが走る
- ロールバックは GitHub の `Revert` ボタン → 自動で前バージョンに戻る

### 4.2 監視

- ConoHa Wing 標準のアクセスログをコントロールパネルから定期確認
- PHP error_log を Web から見えない `/home/{user}/akuboxel.com/logs/` に出力
- フォーム送信失敗が一定数を超えた場合は手動調査（Phase 2 で Slack 通知連携を検討）

### 4.3 バックアップ

- ConoHa Wing 標準の自動バックアップ（14日保持）に加え、月次で手動バックアップを外部ストレージに退避
- DB は本案件ではフォーム送信を永続化しないため、永続データなし

## 5. ロールバック計画

新サイト公開後に致命的な問題が発生した場合の戻し方。

1. GitHub Actions で前回正常稼働時のコミットを `workflow_dispatch` で再デプロイ
2. それでも復旧しない場合、ConoHa Wing の自動バックアップから復元（コントロールパネル → バックアップ → 復元）
3. WordPress に戻す場合は、第1.1節で取得した `.sql` と `public_html/` 圧縮を SFTP/phpMyAdmin で書き戻し、DNS 変更は不要（同一サーバー）

## 6. チェックリスト

### 公開前チェック

- [ ] WordPress バックアップを3箇所以上に保存済み
- [ ] WordPress 関連ファイルおよび DB を完全削除済み
- [ ] ConoHa 独自ドメインメール（info@akuboxel.com、noreply@akuboxel.com）が発行済み
- [ ] GitHub Secrets に必要な値を全て登録済み
- [ ] `.env` を Web から見えない位置に配置済み
- [ ] `.htaccess` で HTTPS 強制、セキュリティヘッダ、`.env` 公開拒否を設定済み
- [ ] reCAPTCHA v3 のサイトキー・シークレットを取得・設定済み
- [ ] フォーム送信テスト（正常系、reCAPTCHA 低スコア、不正入力）成功
- [ ] Lighthouse Performance: モバイル 90 以上、デスクトップ 95 以上
- [ ] axe-core でアクセシビリティ違反ゼロ
- [ ] securityheaders.com で A 評価以上
- [ ] 主要ブラウザ（Chrome / Safari / Firefox / Edge）で表示・動作確認済み
- [ ] 主要ブレークポイント（375 / 768 / 1024 / 1440 px）で表示確認済み
- [ ] 特商法ページ（/legal/tokushoho）、景表法ページ（/legal/keihyoho）、プライバシーポリシー（/privacy）が公開済み

### 公開後チェック

- [ ] Google Search Console にプロパティ登録、サイトマップ送信
- [ ] Google Analytics 4 で初日のアクセスログを確認
- [ ] Microsoft Clarity でセッション記録の取得確認
- [ ] info@akuboxel.com の受信動作確認

# Git LFS セットアップ手順（Unity / VRChat / cluster）

Unity 系プロジェクトはバイナリ資産が多く、Git LFS なしで運用するとリポジトリが膨張し clone 時間が数分〜数十分に達する。新規プロジェクト作成時に必ず実施する。

## 前提

- Git 2.13 以上
- Git LFS のインストール

## 初回セットアップ（プロジェクト作成時）

```bash
# 1. Git LFS をグローバル有効化（初回のみ）
git lfs install

# 2. 新規リポジトリを作成
cd projects/PRJ-XXX_案件名
git init

# 3. 雛形をコピー
cp ../../resources/templates/gitattributes-unity .gitattributes
cp ../../resources/templates/gitignore-unity .gitignore

# 4. .gitattributes を先にコミット（LFSトラッキング定義を確定）
git add .gitattributes .gitignore
git commit -m "chore: configure Git LFS and gitignore"

# 5. LFSトラッキングが効いていることを確認
git lfs track
```

## 既存リポジトリへの途中導入

LFS 未導入で既にバイナリを大量にコミットしてしまった場合、履歴を書き換える必要がある。force push が発生するためチーム全員と調整する。

```bash
# 1. バックアップを取る
git clone --mirror <repo-url> backup.git

# 2. LFS に履歴を移行
git lfs migrate import --include="*.fbx,*.png,*.wav,*.blend,*.psd,*.tga,*.exr"

# 3. リモートを強制上書き
git push --force --all
git push --force --tags
```

## 動作確認

```bash
# LFS対象ファイルが正しく追跡されているか
git lfs ls-files

# 出力例:
# a1b2c3d * Assets/External/Vendor/Model.fbx
# e4f5g6h * Assets/Textures/Sky.exr
```

アスタリスク（*）が付いていれば LFS で追跡中。空欄の場合は通常のblob として扱われている。

## GitHub の容量制限

| 種別 | 制限 | 備考 |
|------|------|------|
| 通常のファイル | 100MB | 超えると push 拒否 |
| LFS 無料枠 | 1GB ストレージ / 1GB 帯域/月 | プライベートリポジトリでも同一 |
| LFS 追加容量 | $5/月 で +50GB | GitHub Marketplace から追加 |

VRChat ワールド 1 本で LFS 容量を数 GB 消費することがある。商用・長期プロジェクトでは早めに追加容量を検討する。

## 注意事項

- `.gitattributes` の変更はコミット後のファイルには遡及しない
- LFS 対象に追加したファイルをリポジトリから削除しても、LFS ストレージ上には残る。完全に消すには `git lfs prune` と GitHub 管理画面からの削除が必要
- clone 時に LFS ファイルのダウンロードが走るため、ネットワーク帯域と所要時間に注意
- CI/CD で LFS を扱う場合、Runner 側でも `git lfs install` が必要

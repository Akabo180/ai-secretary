# プロジェクト管理

PARAメソッドに基づくファイル管理ルール。

## プロジェクトの作成

新しい依頼・案件が来たら:

1. `projects/INDEX.md` を確認し、既存プロジェクトに該当するか判断
2. 該当なし → 新規作成
   - `projects/PRJ-XXX_案件名/` を作成
   - `resources/templates/project-readme.md` をコピーして README.md を作成
   - INDEX.md に追記
3. 該当あり → 既存プロジェクトに追加

### 採番ルール

INDEX.md の最大番号 + 1 で連番を振る。

### フォルダ構成（共通）

```
projects/PRJ-001_案件名/
├── README.md       ← 依頼内容・ステータス・進捗
├── output/         ← 成果物
├── resources/      ← 参考資料
└── notes/          ← 作業メモ
```

### フォルダ構成（Web開発案件）

Web開発案件の場合は、上記に加えて次を配置する。

```
projects/PRJ-001_案件名/
├── README.md
├── requirements.md   ← 要件定義書（Antigravity が参照）
├── report.md         ← Antigravity の実装報告
├── src/              ← 実装コード
├── tests/            ← テストコード
├── .github/
│   └── copilot-instructions.md  ← ルートからのコピー or シンボリックリンク
├── output/
├── resources/
└── notes/
```

requirements.md の作成手順は `protocols/requirements-definition.md` を参照する。
実装スキルは `skills/web-coder/SKILL.md` を使う。
PR作成・レビューは `protocols/pr-review.md` を使う。

### フォルダ構成（Unity / VRChatワールド案件）

```
projects/PRJ-001_案件名/
├── README.md
├── requirements-vrchat-world.md   ← 要件定義書（VRChat派生）
├── report.md                       ← 実装報告
├── .gitattributes                  ← resources/templates/gitattributes-unity からコピー
├── .gitignore                      ← resources/templates/gitignore-unity からコピー
├── Assets/
│   ├── _Project/
│   │   ├── Scripts/                ← 自プロジェクトのUdonSharp
│   │   ├── Editor/                 ← エディタ拡張
│   │   ├── Scenes/
│   │   ├── Prefabs/
│   │   ├── Materials/
│   │   └── Audio/
│   └── External/                   ← 購入/外部アセット（ベンダー別）
├── Packages/                       ← VCC 管理下の VPM パッケージ
├── ProjectSettings/
├── resources/
│   └── asset-ledger.md             ← アセット台帳（protocols/asset-pipeline.md）
└── notes/
```

初期セットアップ手順:

1. Unity Hub で要件定義書のUnityバージョンをインストールする
2. VRChat Creator Companion で新規 World Project を作成する
3. `resources/templates/git-lfs-setup.md` の手順で Git LFS を初期化する
4. `resources/templates/gitattributes-unity` と `gitignore-unity` をプロジェクトルートへコピーする
5. `resources/templates/requirements-vrchat-world.md` を `requirements-vrchat-world.md` としてプロジェクトに配置する

実装スキルは `skills/vrchat-world-coder/SKILL.md` を使う。
アセットの取り込みは `protocols/asset-pipeline.md` を通す。

## ステータス管理

| ステータス | 意味 | 場所 |
|-----------|------|------|
| 未着手 | 作成済み、未着手 | projects/ |
| 進行中 | 作業中 | projects/ |
| 完了 | 全成果物納品済み | projects/ → archive/ に移動 |

ステータス変更時は README.md と INDEX.md の両方を更新する。

## PARA ディレクトリの使い分け

| ディレクトリ | 入れるもの | 基準 |
|-------------|-----------|------|
| projects/ | ゴールと期限がある案件 | 完了条件が明確 |
| areas/ | 継続的に管理する情報 | 終わりがない |
| resources/ | 参考情報・テンプレート | 今すぐ使わないが将来参照 |
| archive/ | 完了した案件 | 非アクティブ |

## areas/ のサブディレクトリ

必要に応じて自動作成する（初期状態では空）。

| パス | 用途 |
|------|------|
| areas/daily-briefings/ | 朝ブリーフィング記録 |
| areas/email-logs/ | メールトリアージ結果 |
| areas/meeting-notes/ | 議事録 |
| areas/clients/ | 顧客・パートナー情報 |

## ファイル命名規則

- 日付付き: `YYYY-MM-DD-[名前].md`
- バージョン付き: `v1_[名前].ext`, `v2_[名前].ext`
- ルートへの直置き禁止

# 要件定義書（VRChatワールド）: [ワールド名]

> 本書は汎用の `requirements.md` の VRChatワールド向け派生版である。
> VRChat固有の制約（Unity/SDKバージョン、Performance Rank、Quest対応）を最初に固定し、後から崩れないようにする。

## 0. メタ情報

| 項目 | 内容 |
|------|------|
| プロジェクト番号 | PRJ-### |
| ワールド名 | |
| 作成日 | YYYY-MM-DD |
| 公開予定日 | YYYY-MM-DD |
| 依頼主 | |
| リポジトリURL | |
| ワールド公開範囲 | Private / Friends+ / Community Labs / Public |

## 1. バージョンマトリクス（Stage 1 で必ず固定する）

| 項目 | 採用バージョン | 確定日 | 確認URL |
|------|--------------|--------|---------|
| Unity | 例: 2022.3.22f1（VRChat 指定版） | YYYY-MM-DD | https://creators.vrchat.com/sdk/upgrade/current-unity-version |
| VRChat SDK3 (Worlds) | 例: 3.7.x | YYYY-MM-DD | https://creators.vrchat.com/sdk/ |
| VRChat Creator Companion (VCC) | 例: 2.x.x | YYYY-MM-DD | |
| UdonSharp | SDK 同梱（0.x 系の単独導入は不可） | YYYY-MM-DD | |
| ClientSim | 必要に応じて有効化 | YYYY-MM-DD | |

バージョンはプロジェクト開始時点の VRChat 推奨に合わせ、開発期間中は原則固定する。SDK 側の破壊的変更がある場合のみ、移行作業をタスク化した上で更新する。

## 2. ワールド概要

### 目的
[1〜2文で、このワールドが提供する体験を記述する]

### 想定シナリオ
- [訪問者が最初に何をするか]
- [どのような流れで何を体験するか]
- [何を持ち帰ってほしいか（記憶・気分・情報）]

### 成功条件
- [定量条件1: 例: 滞在時間の平均が 15 分以上]
- [定量条件2: 例: Performance Rank を Good 以上で維持]
- [定量条件3: 例: Questビルドでフレームレート 72fps 以上]

### スコープ外
- [今回は作らない要素]
- [今回は対応しないプラットフォーム]

## 3. ターゲットプラットフォーム

| 区分 | 対応 | 備考 |
|------|------|------|
| PCVR（Windows） | 必須 / 任意 / 非対応 | |
| Quest Standalone（Android） | 必須 / 任意 / 非対応 | |
| Desktop（非VR） | 必須 / 任意 / 非対応 | |

Quest 対応を含む場合、Android ビルド制約（Shader対応、テクスチャ容量、Reflection Probe 制限）を 7 節に明記する。

## 4. Performance Rank 目標

VRChat の World Performance Rank の目標を宣言し、以下の予算を守る。

| 項目 | PCVR 予算 | Quest 予算 |
|------|----------|----------|
| 目標ランク | Good 以上 | Good 以上 |
| 総トライアングル数 | 100k〜500k 程度 | 50k〜100k |
| Material Slot 合計 | 20 以下 | 12 以下 |
| Skinned Mesh | 16 以下 | 8 以下 |
| Audio Source | 16 以下 | 10 以下 |
| Light（Realtime） | 3 以下 | 1 以下 |
| Reflection Probe | 6 以下 | 2 以下 |
| Particle System | 16 以下 | 8 以下 |

数値は 2026 年時点の VRChat 公式ガイドを参考値として記載している。最新の公式ドキュメント（`https://creators.vrchat.com/worlds/performance-ranks-limits`）で必ず確認し、確認日を記録する。

## 5. ワールド構成

### 主要エリア一覧

| エリアID | 名称 | 目的 | 想定滞在時間 |
|---------|------|------|------------|
| A-01 | エントランス | 初期スポーン、ルール説明 | 1 分 |
| A-02 | | | |

### インタラクティブ要素

| ID | 要素 | 動作 | 同期 | Udon 使用 |
|----|------|------|------|----------|
| I-01 | ドア | プレイヤー接近で開閉 | 全員に同期 | Yes |
| I-02 | | | | |

### 音響設計

| ID | 音源 | 種別 | 3D/2D | ループ | 距離減衰 |
|----|------|------|-------|--------|---------|
| S-01 | BGM | 環境音 | 2D | Yes | — |
| S-02 | | | | | |

## 6. ライティング方針

| 項目 | 採用 |
|------|------|
| ライティングモード | Baked / Mixed / Realtime |
| Reflection Probe | 使用する / しない |
| Light Probe Group | 使用する / しない |
| Post Processing | 使用する / しない（Quest は原則不使用） |
| Skybox | Procedural / Cubemap / Custom Shader |

Quest 対応ワールドでは Baked 中心、PCVR 専用なら Mixed も選択可能。

## 7. Quest 固有制約（Quest 対応時のみ記入）

| 項目 | 制約 |
|------|------|
| Shader | VRChat/Mobile 系に限定。Standard Shader 不可 |
| テクスチャ最大解像度 | 2048px |
| Reflection Probe | 2 枚以下 |
| Post Processing | 不可 |
| Dynamic Bone | 不可（World には元々不要） |
| Video Player | AVPro 不可、Unity Video Player のみ |
| ファイルサイズ | 100MB 以下を推奨 |

## 8. Udon（UdonSharp）設計

### 主要な UdonSharpBehaviour

| クラス名 | 責務 | 同期方式 |
|---------|------|---------|
| DoorController | ドア開閉制御 | Manual（OnPreSerialization / OnDeserialization） |
| | | |

### 同期設計の方針

- 所有権（Ownership）が誰に属するかを要素ごとに決める
- `[UdonSynced]` 変数は最小限に絞り、毎フレーム変動する値は同期しない
- 物理挙動は原則同期しない（所有者のローカル計算を各クライアントに投影する）

### 禁止パターン

- `Update()` 内での毎フレーム `GetComponent`
- 毎フレーム `Instantiate`／`Destroy`
- 無限再帰・未終了ループ
- クライアント側入力の信用（他人がなりすまし可能）

## 9. セキュリティ・悪用対策

- プレイヤー名や ID を表示する場合、悪意ある長文・制御文字を想定してサニタイズする
- ワールド内の重要な状態（管理者権限、スコア等）はサーバー的ロジックを持たないため、性善説を前提にしない設計にする
- 外部URL遷移（Text Chat / ポータル）を含む場合、遷移先の正当性を明記する

## 10. パフォーマンス検証

| 検証項目 | 方法 | 合格基準 |
|---------|------|---------|
| フレームレート | In-Game の Stats パネル | PCVR: 90fps、Quest: 72fps |
| Performance Rank | VRChat SDK Build & Test | Good 以上 |
| Draw Call | Unity Frame Debugger | 目標値以下 |
| GPU Memory | Unity Profiler | Quest 1GB 以下 |

## 11. アップロード・公開フロー

1. VRChat SDK の Builder で Performance Rank を確認する
2. Build & Test でローカル検証（ClientSim または VRChat 本体）
3. Quest 対応の場合、Android ビルドで別途テスト
4. Build & Publish で Private アップロード → 関係者でプレイテスト
5. 問題なければ Community Labs または Public に昇格

## 12. アセット調達方針

| 区分 | 採用方針 |
|------|---------|
| モデル | 自作 / BOOTH購入 / Sketchfab CC0 |
| テクスチャ | 自作 / ambientCG など CC0 / 購入 |
| BGM・SE | 自作 / フリー素材 / 購入 |
| フォント | 商用可ライセンスのみ |

アセット取り込み時は `protocols/asset-pipeline.md` を必ず通す。

## 13. 法的・利用規約

- VRChat Community Guidelines への準拠
- 使用アセットのライセンス表記（ワールド内掲示またはワールド説明欄）
- 音源の著作権処理（JASRAC 管理楽曲を許可なく使用しない）
- 未成年の利用を想定する場合の配慮

## 14. 参考資料

- [VRChat Creator Docs](https://creators.vrchat.com/)
- [Performance Ranks and Limits](https://creators.vrchat.com/worlds/performance-ranks-limits)
- [UdonSharp Documentation](https://udonsharp.docs.vrchat.com/)
- [リサーチレポート: projects/PRJ-XXX/resources/]

## 15. 未決定事項

- [ ] [未決事項1]
- [ ] [未決事項2]

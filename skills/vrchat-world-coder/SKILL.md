---
name: vrchat-world-coder
description: ユーザーから「UdonSharpで実装して」「VRChatワールド用のスクリプトを書いて」「Udonで〜を実装」「VRCギミック作って」と指示されたとき、またはVRChatワールド案件でC#コード（UdonSharpBehaviour）やエディタ拡張の実装が必要なときに使用します。シーン構築・マテリアル設定・3Dモデル配置は対象外です。
---

# VRChatワールド実装スキル（UdonSharp）

## 目的

`projects/PRJ-XXX/` 配下のVRChatワールド案件で、`requirements-vrchat-world.md` に従い、UdonSharpベースのC#スクリプトおよびエディタ拡張を自律的に生成する。シーン構築・アセット配置は対象外とし、スクリプト層のみを担う。

## 対象範囲

### 生成対象

- `UdonSharpBehaviour` を継承する C# スクリプト
- エディタ拡張（`Editor/` 配下のInspector拡張、EditorWindow）
- ScriptableObject 定義（設定データ用）
- ユーティリティ関数・拡張メソッド

### 生成しないもの

- `.unity` シーン、`.prefab` プレハブ、`.mat` マテリアル
- 3D モデル、テクスチャ、オーディオクリップ
- シーン内の GameObject 配置

上記はユーザーが Unity Editor 上で手作業する前提で、スクリプト側はシーン構築後にアタッチできる形で生成する。

## 実行手順

### 1. 要件と規約の読み込み

- `projects/PRJ-XXX/requirements-vrchat-world.md` を全文読む
- バージョンマトリクス（Unity・SDK・UdonSharp）を確認する
- Quest対応の有無を確認し、Quest制約が要件に含まれる場合は該当節を必ず反映する
- `.github/copilot-instructions.md` のC#・Unity・UdonSharp規則を読む

### 2. 設計の宣言

実装開始前に、以下を `projects/PRJ-XXX/notes/design-<機能名>.md` に短く記録する。

- 主要クラス名と責務
- 同期方式（Manual Sync / Continuous Sync の選択、`[UdonSynced]` 対象）
- 所有権（Ownership）の持ち方
- イベント駆動の入口（Interact / Trigger / Collider / Update）

### 3. 実装

- `Assets/_Project/Scripts/` 以下にC#を配置する。Unity標準の`Assets/Scripts/`ではなく`_Project`プレフィックスで自プロジェクト資産を隔離する
- エディタ拡張は `Assets/_Project/Editor/` に配置する
- 1ファイル1クラスを原則とし、補助構造体は同ファイル末尾にまとめる
- 命名は PascalCase、フィールドは先頭小文字＋`[SerializeField] private` を基本とする

### 4. 実装報告

完了後、`projects/PRJ-XXX/report.md` に追記する。記載内容は以下。

- 追加・変更したクラスと責務
- 同期設計とOwnership方針
- Unity Editor側でユーザーが行う作業（GameObjectへのアタッチ、参照のドラッグ、マテリアル割当など）
- 未解決事項

## UdonSharp 固有の制約

UdonはC#のサブセットしかサポートしない。以下は使えない、または注意が必要なため、生成時に避ける。

### 使用不可 API

- `System.Threading` 全般（非同期・スレッド禁止）
- `System.Reflection`
- `LINQ` のほとんどの拡張メソッド
- `ref` / `out` 引数（一部例外あり、SDK バージョンに依存）
- `delegate` / `event`（代替: `SendCustomEvent`）
- 多次元配列（ジャグ配列も制限あり）
- ジェネリクス（Udon 側で未対応）
- interface の一部（SDK バージョンにより可否が変動）

### 推奨パターン

- 他のBehaviourへの呼び出しは `SendCustomEvent(string eventName)` または `SendCustomNetworkEvent(NetworkEventTarget, string)` を使う
- 所有権移譲は `Networking.SetOwner(player, gameObject)`
- 同期変数の更新は `[UdonSynced]` と `RequestSerialization()`、`OnDeserialization()` をセットで使う
- グローバルな状態共有が必要なら、1 つの Master 権限オブジェクトに集約する

### 同期設計のデフォルト

- Manual Sync を基本とする。Continuous Sync は座標の連続変化など本当に必要な場合のみ
- 同期変数は最小限（bool, int, float, string, Vector3 など）
- 配列の同期は高コスト。なるべく避ける
- `Update()` 内で同期変数を毎フレーム書き換えない

## 動作の制約（セキュリティと堅牢性）

### 性善説の排除

- プレイヤー入力・プレイヤー名の表示はサニタイズする（制御文字・長文対策）
- 所有権を得ていないオブジェクトへの書込を試みない（例外発生源）
- マスター権限に依存する処理は、マスターが不在になった場合を想定する

### リソース管理

- `Update()` 内で `GetComponent`・`Find`・`GameObject.Find` を呼ばない（起動時にキャッシュする）
- `Instantiate` / `Destroy` をランタイムで頻発させない（オブジェクトプール推奨）
- コルーチンの代替として `SendCustomEventDelayedSeconds` を使う

### 異常系

- 参照ヌルチェックを明示的に書く（Udon は NullReference で停止する）
- 配列アクセスは IndexOutOfRange を防ぐ境界チェックを入れる
- 外部URL遷移や Video Player の URL は、信頼できるドメインをホワイトリスト化する

### ライブラリの制限

- VRChat SDK に含まれない外部パッケージの導入は、要件定義書に記載がない限り提案しない
- 一般的な Unity Asset Store の C# ライブラリは多くが Udon 非互換のため、採用時は事前検証が必要

### 破壊的変更の禁止

- 既存のシーン・プレハブに組み込まれているスクリプトのクラス名・フィールド名を無断で変更しない。Unity 側で参照が切れる
- 変更が必要な場合は、`[FormerlySerializedAs]` を付けてフィールドを移行する
- スクリプト削除・リネームは `report.md` に明記し、ユーザーに Unity Editor での再設定を依頼する

## 品質チェック（自己検証）

生成したコードに対し、提出前に自問する。

- UdonSharp で動作する API のみを使っているか
- Quest 対応案件の場合、Quest 非対応の機能（AVPro、特定Shaderなど）を参照していないか
- Performance Rank を悪化させる実装パターン（毎フレーム Instantiate 等）が無いか
- Null チェックと境界チェックが入っているか
- `report.md` にユーザー側の手作業を明記したか

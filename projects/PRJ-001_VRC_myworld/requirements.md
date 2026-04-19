# 要件定義書（VRChatワールド）: The Backdrops - Pro Photo Studio

> 本書は `resources/templates/requirements-vrchat-world.md` に基づく VRChatワールド向け要件定義書である。
> 参照元GDD: `projects/PRJ-001_VRC_myworld/docs/the_backdrops_pro_photo_studio_gdd.md`
> 開発期間は4週間（20営業日）とする。初回スコープに含めない機能は §15 未決定事項および Phase2 候補として整理している。
> 追加仕様: マルチフィルター・スタジオシステム（本書 §5、§8 に反映）、撮影用壁面パネル（2種、本書 §5）。
> BGM は初回リリースに限り、CC0／ロイヤリティフリー音源と VRChat 同梱 Video Player による YouTube 動画再生を併用する（本書 §5、§7、§12、§13）。BGM 資産の自作・購入・整音にかかる工数を削減するための措置である。
> 作成時点で未確定の前提（バージョンマトリクス、リポジトリURL等）はユーザー回答により仮置きとし、15節にトラッキング対象として残している。

## 0. メタ情報

| 項目 | 内容 |
|------|------|
| プロジェクト番号 | PRJ-001 |
| ワールド名 | The Backdrops - Pro Photo Studio |
| 作成日 | 2026-04-18 |
| 開発期間 | 2026-04-20（Week 1 開始）〜 2026-05-15（Week 4 終了、4週間） |
| プレローンチ期間 | 2026-05-16 〜 2026-05-22（7日、アンバサダー招待とSNS準備） |
| 公開予定日 | 2026-05-23（Private → Community Labs 昇格） |
| 依頼主 | 大山 圭一朗（Akubowork） |
| リポジトリURL | TBD（Git構築後に追記。15節参照） |
| ワールド公開範囲 | Public（Community Labs 突破後に Public 昇格。プレローンチ期間は Private） |

## 1. バージョンマトリクス

本プロジェクトは 2026年4月時点の VRChat 公式推奨に合わせて仮置きし、キックオフ時に公式ドキュメントで再確認のうえ確定する。

| 項目 | 採用バージョン（仮置き） | 確定日 | 確認URL |
|------|------------------------|--------|---------|
| Unity | 2022.3.22f1（VRChat 指定版） | TBD | https://creators.vrchat.com/sdk/upgrade/current-unity-version |
| VRChat SDK3 (Worlds) | 3.7.x 系の最新安定版 | TBD | https://creators.vrchat.com/sdk/ |
| VRChat Creator Companion (VCC) | 2.x.x 系の最新版 | TBD | https://vcc.docs.vrchat.com/ |
| UdonSharp | SDK 同梱版（単独の 0.x 系は使用しない） | TBD | https://udonsharp.docs.vrchat.com/ |
| ClientSim | 有効化（PC ビルドのローカル検証に使用） | TBD | https://creators.vrchat.com/worlds/clientsim |
| Post-Processing Stack v2 | PC ビルド専用に導入 | TBD | https://docs.unity3d.com/Packages/com.unity.postprocessing@3.4/ |
| VRC Light Volumes（REDSIM） | ライブラリ最新版。Quest/iOS を含む全プラットフォームで使用 | TBD | https://github.com/REDSIM/VRCLightVolumes |

バージョンはキックオフ時点の VRChat 推奨に合わせて固定し、開発期間中は原則据え置く。SDK 側に破壊的変更が入った場合のみ、移行タスクを切ったうえで更新する。

## 2. ワールド概要

### 目的

アバターの宣材写真やグループ写真を高品質で撮影するための VRChat 専用フォトスタジオを提供する。Akuboxel の「ショーケース戦略」における最初のフラッグシップワールドとして、集客エンジン、Boothアセットのショーケース、将来的な VRChat Credits による体験販売（Phase2）の3つを段階的に担う。

### 想定シナリオ

1. エントランスの待機スペースにスポーンし、ミラーで身だしなみを整える。
2. 撮影エリアに移動し、壁埋め込み型の操作パネルから背景、壁面パネル、照明、フィルターの順に設定を行う。7（背景）× 3（壁面パネル: None + 漆喰 + コンクリ）× 3（照明）× 4（フィルター）= 最大 252 通りのシチュエーションを無料で試せる。
3. VRChat カメラを起動すると、部屋上部の「ON AIR」ランプが自動点灯し、周囲に撮影開始を伝える。
4. 撮影した写真をSNSへ共有し、ハッシュタグ `#TheBackdrops` `#TheBackdropsVRC` を通じて新たな訪問者を呼び込む。

### 成功条件

- 累計Visitsが公開後10週間以内に5,000を達成する。
- 平均滞在時間が15分以上25分以内に収まる（ワールド内テレメトリ計測）。
- VRChat World Performance Rank が PCVR ビルドで Poor 以上（Medium を努力目標）、Mobile ビルド（Quest/iOS）で Medium 以上（Good を努力目標）を維持する。
- Community Labs を公開後14日以内に突破する。
- Booth連携サイネージ経由で、公開後30日以内にBooth商品1件以上の販売が発生する。

### スコープ外（初回リリース）

- ランダム排出・ガチャ等のギャンブル的要素は実装しない（GDD §1.2 準拠）。
- Content Warnings 対象となる表現（性的暗示、暴力、ゴア、ホラー）は一切扱わない。
- JASRAC 管理楽曲を用いた BGM の使用は行わない。
- 252通りの組み合わせ（§5）はすべて無料基本機能として提供する。プレミアム照明プリセットによる差別化は行わない。
- Phase2 繰り延べ機能（VIPブース、VRChat Credits 課金導線、Instant 商品の Juice エフェクト、Seasonal Theme Pass、壁面パネルの Parallax Occlusion Mapping、色温度・光量スライダー、画角ガイドオーバーレイ、側面ミラー、壁面パネル追加2種（レンガ・岩壁））は初回リリースに含めない。

## 3. ターゲットプラットフォーム

| 区分 | 対応 | 備考 |
|------|------|------|
| PCVR（Windows） | 必須 | Post-Processing Stack v2 による高品質描写を主軸に提供 |
| Quest Standalone（Android） | 必須 | UI オーバーレイおよびライトパラメータ操作による代替表現で同等の体験を提供 |
| VRChat iOS | 必須 | Quest と同じ Mobile ビルド系列の制約に準拠。5,000 Visits 到達のための集客枠として初回から対応 |
| Desktop（非VR） | 任意 | PCVR 向けビルドが Desktop クライアントで起動できる範囲で対応。壁埋め込み型操作パネルは Desktop 用 Interact Layer を設定し、クリック操作を許可する |

Mobile（Quest/iOS）は初回リリース時点から必須対象。7節のモバイル固有制約を初期から満たす設計とする。

## 4. Performance Rank 目標

目標ランクは PCVR で Poor 以上（Medium を努力目標）、Mobile で Medium 以上（Good を努力目標）とする。内訳の数値予算は下表のとおり設定し、VRChat SDK Builder の Performance Rank 表示と Unity Profiler で監視する。

| 項目 | PCVR 予算 | Mobile 予算（Quest/iOS 共通） |
|------|----------|-----------------------------|
| 目標ランク | Poor 以上（Medium を努力目標） | Medium 以上（Good を努力目標） |
| 総トライアングル数（環境メッシュ） | 100k 以下 | 50k 以下 |
| Draw Calls（Batching後） | 50 以下 | 50 以下 |
| テクスチャメモリ合計 | 80MB 以下 | 40MB 以下 |
| Realtime Light | 4 灯以下（Shadow Casting は1灯のみ） | 1 灯以下 |
| Reflection Probe | 6 以下 | 2 以下 |
| Audio Source | 16 以下 | 10 以下 |
| Particle System | 16 以下 | 8 以下 |

数値は 2026年4月時点の VRChat 公式ガイドを参考値として記載している。最新の公式ドキュメント（https://creators.vrchat.com/worlds/performance-ranks-limits） でキックオフ時に再確認し、確認日を記録する。

## 5. ワールド構成

### 主要エリア一覧

| エリアID | 名称 | 目的 | 想定滞在時間 |
|---------|------|------|------------|
| A-01 | エントランス＆待機スペース | 初期スポーン、雑談、スタジオ状況の確認、クレジット表記 | 2〜5分 |
| A-02 | メイン・シューティングスタジオ | 背景・壁面パネル・照明・フィルター切替による撮影体験の中核 | 10〜20分 |
| A-03 | Booth導線サイネージ | Booth販売アセットのショーケース表示 | 1分以下（待機中の副次動線） |

VIPブース（GDD §1.5 A-03）は Phase2 として繰り延べる。

### マルチフィルター・スタジオシステム（システム概要）

撮影エリア（A-02）では、4種類のフィルター、7種類の背景、3種類の照明、2種類の壁面パネル（+ 非表示）を組み合わせた最大 252 通りのシチュエーションを提供する。UdonSharp の `StudioManager` がプラットフォームを自動判別し、PC ビルドでは Post-Processing Stack v2、Mobile ビルドでは UI Canvas およびライトパラメータ操作を用いて同等の視覚的変化を再現する。全組み合わせは無料基本機能として開放する。

#### 背景（7種類、GDD §1.6 に準拠）

| 背景ID | 名称 | カラーコード | 用途 |
|-------|------|------------|------|
| BG-01 | クリアホワイト | #FFFFFF | 標準ホリゾント白 |
| BG-02 | ダークブラック | #000000 | 標準ホリゾント黒 |
| BG-03 | パステルピンク | #FFD1DC | 肌色の心理補色 |
| BG-04 | コーラルグリーン | #A8E6CF | 被写体の立体感強調 |
| BG-05 | セレニティブルー | #92A8D1 | 衣装のディテール引き立て |
| BG-06 | グリーンバック（クロマキー） | #00FF00 | 動画配信・外部合成用 |
| BG-07 | ブルーバック（クロマキー） | #0000FF | 動画配信・外部合成用（緑要素を含む被写体向け） |

クロマキー背景（BG-06 / BG-07）は単色マテリアルで実装する。外部動画編集ソフトでの抽出品質は各ソフトの閾値設定に依存するため、ワールド側の保証範囲外とする。

#### 壁面パネル（2種 + 非表示、初回リリース）

背景色（BG-01〜BG-07）の手前に物理的に配置する質感パネル層。SetActive による表示/非表示で排他切替する。非表示（None）を選択した場合は背景色のみが表示される。

| パネルID | 名称 | 質感特性 | 相性の良い照明 |
|---------|------|---------|--------------|
| WP-00 | None（非表示） | 背景色をそのまま表示 | 全プリセット |
| WP-01 | 漆喰の白壁 | 光を柔らかく拡散し、微細な凹凸による繊細な影を表現。ポートレートや明るい商材写真向け | Flat / Rim Light |
| WP-04 | コンクリ壁 | 無機質でフラットな印象。微細なノイズでデジタル特有の滑らかさを打ち消す | Flat / Dramatic |

レンガ壁（WP-02）と岩壁（WP-03）は Phase2 で追加する。IDは Phase2 で追加するパネルとの整合のため WP-02 / WP-03 を空枠として予約する。

クロマキー背景（BG-06 / BG-07）と壁面パネル（WP-01 / WP-04）を同時に使用するとクロマキー機能が阻害されるため、UI 上はユーザー操作を妨げないが、パネル選択時にクロマキー目的での使用に向かない旨のツールチップを表示する。

##### 壁面パネルの質感表現仕様（PC 版）

| 項目 | 仕様 |
|------|------|
| Normal Map 解像度 | 2K |
| Height Map | 初回は使用しない（Phase2 で Parallax Occlusion Mapping とともに追加） |
| シェーダー | Unity Standard Shader または VRChat 向け高品質シェーダー |
| ライトモード | Baked（壁パネルは静的）。VRC Light Volumes の体積ベイクにより反射光を周囲に伝搬 |

##### 壁面パネルの質感表現仕様（Mobile 版、Quest / iOS 共通）

| 項目 | 仕様 |
|------|------|
| Normal Map 解像度 | 1024px 以下 |
| Height Map | 使用しない。ベースカラーテクスチャ内に陰影情報を焼き込んで立体感を補完する |
| シェーダー | `VRChat/Mobile/Standard Lite` を基本とする |
| Draw Call | パネル切替で追加される Draw Call は 1 以下（同一シェーダーによる Batching を前提） |

#### 照明プリセット（3種類、排他制御）

| 照明ID | 名称 | 特性 |
|-------|------|------|
| LT-01 | Flat | 全体を均一に照らし、素材の色味を正確に描写する |
| LT-02 | Dramatic | コントラストを強め、立体感と影を強調する |
| LT-03 | Rim Light | 被写体の背後から光を当て、背景との境界線を際立たせる |

色温度・光量スライダーによる微調整レイヤーは Phase2 で追加する。初回リリースは3プリセットの排他切替のみを提供する。

#### フィルター（4種類、プラットフォーム別挙動）

| フィルターID | 名称 | PC 実装（Post-Processing Stack v2） | Mobile 実装（UI / ライト操作） |
|------------|------|----------------------------------|------------------------------|
| FL-01 | Black Mist | Bloom の Intensity と Diffusion に加え、Color Grading の Lift で黒浮きを軽く再現する近似実装 | カメラ直前に加算合成の半透明プレーン、または UI Image を配置して疑似ハレーションを表現 |
| FL-02 | ND（減光） | Post-exposure を下方調整し画面全体の明度を落とす | 画面全体を覆う黒色 UI Image の透明度を操作して物理的な減光を再現 |
| FL-03 | CPL（偏光） | Reflection Probe の Weight とマテリアルの反射強度を抑制 | Realtime Light の Intensity を下げて被写体のテカリを抑え、色味を落ち着かせる |
| FL-04 | LB（色温度変換） | White Balance の Temperature を変更 | 青色または橙色の半透明 UI Image をオーバーレイして画面全体のトーンを補正 |

FL-01 Black Mist は実写のブラックプロミスト系フィルターに対する近似実装であり、完全な一致は目指さない。フィルターは初回リリースでは単一選択のみとし、同時適用は Phase2 で検討する。

### インタラクティブ要素

| ID | 要素 | 動作 | 同期 | Udon 使用 |
|----|------|------|------|----------|
| I-01 | 背景選択パネル | BG-01〜BG-07 からの切替。マテリアル差替またはオブジェクト表示切替で制御 | 全員に同期（Manual） | Yes |
| I-02 | 壁面パネル選択 | WP-00 / WP-01 / WP-04 の排他切替。背景色の手前に配置されたパネル群を SetActive で制御 | 全員に同期（Manual） | Yes |
| I-03 | 照明プリセット選択パネル | LT-01〜LT-03 を排他制御。Realtime Light の配置と強度を切替 | 全員に同期（Manual） | Yes |
| I-04 | フィルター選択パネル | FL-01〜FL-04 の単一選択適用。PC では Post-Processing Volume、Mobile では UI Canvas とライトパラメータを操作 | 全員に同期（Manual） | Yes |
| I-05 | リセットボタン | 背景・壁面パネル・照明・フィルターの全設定を標準状態（BG-01 / WP-00 / LT-01 / フィルターなし）に復帰 | 全員に同期（Manual、単発） | Yes |
| I-06 | ON AIR ランプ | VRChatカメラの Active 状態を検知し、Emission をオーバーライドして赤発光および通知音再生 | 全員に同期（Manual） | Yes |
| I-07 | 汎用プロップのピックアップ | スツール1種と観葉植物1種の自由移動 | VRC_Pickup 同期 | No（標準機能） |
| I-08 | ローカルミラー（正面） | 使用者単位で表示／非表示を切替。初回リリースは正面1箇所のみ | ローカルのみ（同期しない） | Yes |
| I-09 | BGM プレイヤー（エントランス設置） | VRChat 同梱 Video Player プレハブ。初期URLはキュレーション済みのフリー素材 BGM または YouTube 動画を指定。再生／一時停止／スキップを共有 UI で操作 | 全員に同期（VRChat 標準） | No（標準機能、カスタム Udon 非使用） |

操作パネルのレイアウトは、壁埋め込み型の1枚パネルに「背景 → 壁面パネル → 照明 → フィルター → リセット」の順で左から右に配置し、選択状態をボタン発光で明示する。Mobile 環境では「最適化モード有効」の表示をパネル上部に常駐させ、プラットフォーム差に対する安心感を提供する。

Phase2 繰り延べ項目: 色温度・光量スライダー、VIPブースアクセスゲート、側面ミラー、画角ガイドオーバーレイ、Instant商品トリガー（Photo Flash FX / Confetti Burst）。

### 音響設計

| ID | 音源 | 種別 | 3D/2D | ループ | 距離減衰 |
|----|------|------|-------|--------|---------|
| S-01 | 共通BGM（I-09 BGM プレイヤー経由の再生音。フリー素材音声または YouTube 動画の音声トラックを使用） | 環境音 | 2D | Yes（プレイリスト末尾で先頭に戻す運用） | — |
| S-02 | ON AIR 点灯通知音 | 効果音 | 3D | No | 10m でゼロ |
| S-03 | パネル操作フィードバック音 | UI SE | 2D | No | — |

BGM は初回リリースに限り、CC0 または商用利用可のロイヤリティフリー音源の Audio Clip 直接再生と、VRChat 同梱 Video Player（I-09）による YouTube 動画再生を併用する。Video Player ルートは BGM 用音源の自作・購入・整音・ワールド内バンドルを省略するための措置で、BGM 調達工数の削減に寄与する。エントランスとスタジオで BGM を差別化する運用、およびカスタム Udon による高度なプレイリスト制御は Phase2 で検討する。

## 6. ライティング方針

| 項目 | 採用 |
|------|------|
| ライティングモード | Mixed（静的オブジェクトは Baked、撮影用キーライトは Realtime） |
| Light Volume 代替 | VRC Light Volumes（REDSIM）を採用し、アバターに対して体積ベイクを適用する |
| Reflection Probe | 使用する（PCVR は Baked Cubemap を最大6枚、Mobile は最大2枚） |
| Light Probe Group | 使用する（アバター動線上に配置） |
| Post Processing | PC のみ使用（Post-Processing Stack v2）。Mobile は UI Canvas オーバーレイおよびライトパラメータ操作で視覚効果を再現 |
| Skybox | Cubemap（撮影の色被りを避けるため、グレースケール寄りの Cubemap を採用） |

選定理由: VRC Light Volumes を採用することで、Mobile プラットフォームでも Light Probe に近い質の陰影をアバターに適用でき、PC と Mobile の見た目の差を縮められる。Post Processing は Quest/iOS で動作しないため、Mobile ではフィルター機能を UI オーバーレイとライトパラメータ操作で置き換える二層設計を採る。

## 7. Mobile 固有制約（Quest / iOS）

Mobile は初回リリースから必須対象のため、下記制約は設計拘束条件として扱う。

| 項目 | 制約 |
|------|------|
| Shader | VRChat/Mobile 系に限定。Standard Shader は不可。壁面パネルは `VRChat/Mobile/Standard Lite` を使用 |
| テクスチャ最大解像度 | 2048px（壁面パネルの Normal Map は 1024px 以下） |
| Reflection Probe | 2 枚以下 |
| Post Processing | 不可（UI Canvas フォールバックで代替） |
| Video Player | AVPro 不可、Unity Video Player のみ。BGM プレイヤー（I-09）は VRChat 同梱の Unity Video Player ベースのプレハブを採用し、Android / iOS でも再生可能にする |
| ファイルサイズ | 100MB 以下 |
| VRC Light Volumes | Mobile 向けのモバイル対応モードで利用 |
| Parallax / Height Map | 動作しないため使用しない。壁面パネルはベースカラーに陰影を焼き込んで代替 |
| UI フィルター層 | Canvas Overlay で実装し、Draw Call 増を最小化（フィルター切替で Canvas の Enable/Disable とマテリアル切替のみ） |

iOS 版は Quest と同一の Mobile ビルド制約に準拠させ、Android と iOS で共通の StudioManager ロジックを使用する。

## 8. Udon（UdonSharp）設計

### 主要な UdonSharpBehaviour（初回リリース）

| クラス名 | 責務 | 同期方式 |
|---------|------|---------|
| StudioManager | プラットフォーム判定結果の保持、背景・壁面パネル・照明・フィルターの選択状態管理、リセット処理の統括 | Manual（選択状態をまとめて同期） |
| PlatformRouter | `Application.platform` と VRChat API でプラットフォームを判定し、PC 用 / Mobile 用の処理経路を振り分ける | ローカルのみ |
| BackdropController | BG-01〜BG-07 のマテリアル差替またはオブジェクト表示切替（I-01） | Manual |
| WallPanelController | WP-00 / WP-01 / WP-04 の排他切替。パネルオブジェクト群の SetActive 制御、Mobile 用軽量シェーダーへのマテリアル差替（I-02） | Manual |
| LightingPresetController | LT-01〜LT-03 の排他切替。Realtime Light の配置と強度を更新（I-03） | Manual |
| FilterControllerPC | Post-Processing Volume のプロファイル切替（FL-01〜FL-04） | Manual |
| FilterControllerMobile | UI Canvas オーバーレイの切替、Reflection Probe Weight、Light Intensity の動的調整 | Manual |
| OnAirSignalController | VRChatカメラ Active 状態の検知と ON AIR ランプの制御（I-06） | Manual |
| TelemetryLogger | スタジオ利用開始、照明プリセット選択、フィルター選択の3イベントを `Debug.Log` で出力する最小構成 | ローカルのみ（イベント駆動） |

Phase2 追加予定クラス: `LightTrimController`（色温度・光量スライダー）、`VipAccessGate`（VIPブースアクセス）、`JuiceEffectDispatcher`（Instant 商品）、共通基盤化された `TelemetryCollector`。

### 同期設計の方針

所有権（Ownership）はパネル操作時に操作者へ移譲する方針を仮置きとする（Manual同期中心）。`StudioManager` が保持する選択状態（背景ID、壁面パネルID、照明ID、フィルターID）は一括で `[UdonSynced]` とし、OnPreSerialization / OnDeserialization のペアで更新する。毎フレーム変動する値は同期せず、イベント駆動でのみ `RequestSerialization()` を発火する。物理挙動は所有者のローカル計算を各クライアントに投影し、同期対象としない。

複数プレイヤーが同時にパネルを操作した場合は Last-writer-wins（Ownership を最後に取得した操作が勝つ）で解決する。連続操作による通信スパイクを抑制するため、同一パネル上の連続入力は300ミリ秒のデバウンスをかけてから `RequestSerialization()` を発火する。

### プラットフォーム判定ロジック

`PlatformRouter` はワールド Join 直後に一度だけ判定を実行し、結果を `StudioManager` に引き渡す。PC ビルドでは Post-Processing Volume を有効化し、Mobile ビルドでは UI Canvas レイヤーを有効化する。同一ワールド内で PC プレイヤーと Mobile プレイヤーが同席するケースを考慮し、選択状態の同期は共通（ID ベース）とし、実装レイヤーだけをクライアント側で切り替える。

### 禁止パターン

- `Update()` 内での毎フレーム `GetComponent` 呼び出し
- 毎フレームの `Instantiate` / `Destroy`
- 無限再帰や未終了ループ
- クライアント側入力を信用する設計（なりすまし可能性を常に考慮する）

### テレメトリ実装方針（初回リリース: 最小構成）

初回リリースは `TelemetryLogger` が `Debug.Log` でローカル出力する最小構成のみを実装する。計測対象イベントは「スタジオ利用開始（撮影エリアへの進入）」「照明プリセット選択」「フィルター選択」の3種に絞る。Udon は外部サーバーへのHTTP送信を行えないため、データ収集はプレイ中の運用観察または VRChat Logs の回収に限定し、外部集計は行わない。

Basekit Engineer との共通基盤化協議、および GDD §6.2 の計測対象イベント（VIPブース利用、ON AIR 発動回数、Instant商品使用、壁面パネル選択など）への拡張は Phase2 で対応する。

## 9. セキュリティ・悪用対策

- プレイヤー名や ID を表示する場面では、制御文字および長文の流し込みを想定したサニタイズを入れる。表示長は32文字までに切り詰める。
- 外部URL遷移は Booth 連携サイネージ1箇所のみとし、遷移先URLを要件書およびワールド説明欄に明記する。その他の Text Chat 内URLはサニタイズ対象外だが、ワールド側からの自動遷移は行わない。
- カメラActive検知（I-06）は VRChat 公式 API 経由で行い、プレイヤー側のプライバシー設定を上書きする挙動を含めない。
- `StudioManager` の同期状態は正当な UI イベントからのみ更新する経路に限定し、他人からの Custom Network Event による不正更新を想定した Ownership チェックを入れる。
- フィルター Mobile 実装で使用する UI Canvas Overlay は全画面を覆うため、悪用を防ぐ目的で最大の不透明度を0.6に制限する。完全な視界遮断は行わない。

VIPブースアクセス判定および Instant商品課金トリガーに関するセキュリティ項目は、Phase2 の実装時に追加する。

## 10. パフォーマンス検証

| 検証項目 | 方法 | 合格基準 |
|---------|------|---------|
| フレームレート（PCVR） | In-Game の Stats パネル | 72fps 以上（90fps を努力目標） |
| フレームレート（Quest） | In-Game の Stats パネル | 72fps 以上 |
| フレームレート（iOS） | In-Game の Stats パネル | 60fps 以上 |
| Performance Rank（PC） | VRChat SDK Build & Test | Poor 以上（Medium を努力目標） |
| Performance Rank（Mobile） | VRChat SDK Build & Test（Android / iOS） | Medium 以上（Good を努力目標） |
| Draw Call | Unity Frame Debugger | PC 50 以下 / Mobile 50 以下 |
| テクスチャメモリ | Unity Profiler | PC 80MB 以下 / Mobile 40MB 以下 |
| GPU Memory | Unity Profiler | PC 2GB 以下 / Quest 1GB 以下 / iOS 1GB 以下 |
| Realtime Light 数 | Scene View 監視 | PC 4灯以下（Shadow Casting は1灯のみ）/ Mobile 1灯以下 |
| Udonスクリプト負荷 | Unity Profiler の UdonBehaviour セクション | パネル操作時のスパイクが PC 5ms 以下 / Mobile 8ms 以下 |
| 背景・壁面パネル・フィルター切替遅延 | ストップウォッチ計測 | 選択操作から描画反映まで 200ms 以下（PC / Mobile 共通） |

## 11. アップロード・公開フロー

VRChat では同一ワールドIDに対してプラットフォーム別ビルド（PC / Android / iOS）を順次アップロードするクロスプラットフォーム運用を行う。

1. Week 4 の終盤で VRChat SDK の Builder により PC ビルドを通し、Performance Rank を確認する。
2. 続けて Android ビルド、iOS ビルドを同一ワールドIDに対して順次アップロードし、それぞれ Performance Rank を確認する。
3. ClientSim で PC ビルドのローカル検証を行い、I-01〜I-08 のインタラクションを確認する。Mobile ビルドの検証は実機（Quest 本体および iOS クライアント）で行う。
4. Private でアップロードし、プレローンチ期間（2026-05-16 〜 2026-05-22）にアンバサダー10〜15名（GDD §5.1）でプレイテストする。PC / Quest / iOS の全プラットフォームでの参加を確保する。初回リリースはプレイテストを1巡に限定し、致命的なバグがなければフィードバックの即時反映後に Community Labs へ昇格する。
5. 2026-05-23 に Community Labs へ昇格し、公開後14日以内の Labs 突破を目指す（GDD §2.3）。
6. Labs 突破後、Public 昇格と並行して累計5,000 Visits 達成までのマーケティング施策（GDD §5）を継続する。

## 12. アセット調達方針

| 区分 | 採用方針 |
|------|---------|
| モデル（スタジオ備品・プロップ） | 4週間の制約下では CC0 Sketchfab または BOOTH 商用可アセットを第一候補とする。自作は必要最低限 |
| テクスチャ（背景・環境） | ambientCG 等の CC0 ソースを第一候補とする |
| BGM | 初回リリースは2系統を併用する。(1) CC0 または商用利用可のロイヤリティフリー音源を Audio Clip として直接再生する。(2) VRChat 同梱 Video Player（I-09）で外部配信の音声を再生する（ロイヤリティフリー素材配信ページ、または作曲者が商用利用を許諾した YouTube 動画を想定）。JASRAC 管理楽曲は使用しない。この方針は BGM 資産の自作・購入・整音・ワールド内バンドルを省略し、開発工数を削減することを目的とする |
| SE | CC0 または商用利用可のロイヤリティフリー音源を使用する（ON AIR 通知音、パネル操作音） |
| フォント | 商用利用可のライセンスに限定（サイネージ・UI 含む） |
| 壁面パネル用テクスチャ（漆喰・コンクリ） | ambientCG 等の CC0 PBR マテリアル。PC 用 Normal Map（2K）と Mobile 用 Normal Map（1024px）を同一ソースからリサイズして用意 |
| ライティング拡張 | VRC Light Volumes（REDSIM）を導入。ライセンス条項をワールド内クレジットおよびワールド説明欄に明記 |
| Post-Processing（PC ビルド） | Post-Processing Stack v2 を Unity 公式パッケージとして導入 |

アセット取り込み時は `protocols/asset-pipeline.md` を必ず通す。ライセンス表記はワールド内クレジットパネルまたはワールド説明欄に掲載する（13節参照）。

リポジトリは Git LFS を有効化して運用する。対象拡張子は `.fbx` `.png` `.jpg` `.tga` `.wav` `.ogg` `.mp3` `.asset` `.prefab` `.unity` `.exr` `.hdr` を基本とし、詳細は `resources/templates/gitattributes-unity` のテンプレートに準拠する。

## 13. 法的・利用規約

- VRChat Community Guidelines に準拠する。Content Warnings 対象の表現は一切含めない（GDD §1.2）。
- 使用アセットのライセンス表記は、エントランス壁面のクレジットパネルおよびワールド説明欄に掲載する。VRC Light Volumes（REDSIM）についても同様にクレジット表記する。
- 音源の著作権処理として、JASRAC 管理楽曲は使用しない。使用する全 BGM・SE のライセンス情報を `resources/` に一覧化する。
- I-09 BGM プレイヤーで再生する YouTube 動画は、作曲者または正規配信者が商用利用・埋め込み再生を許諾している URL に限定する。初期プレイリストは開発期間中にキュレーションし、URL 一覧とライセンス根拠を `resources/` に保存する。ユーザー入力による任意 URL 再生は初回リリースでは無効化し、運用側で事前指定した URL のみを再生可能な構成とする。
- 252通りのシチュエーション（背景・壁面パネル・照明・フィルター）は全て無料基本機能とし、初回リリースに課金導線は含めない。VRChat Credits 課金は VIPブースアクセス、Instant Juice エフェクト、Seasonal Theme Pass の3軸に集約する予定だが、実装は Phase2 で行う。
- クロマキー背景（BG-06 / BG-07）の外部動画編集ソフトでの抽出品質は、各ソフトの閾値設定に依存するためワールド側の保証範囲外とする旨をワールド説明欄に明記する。

## 14. 参考資料

- GDD本体: `projects/PRJ-001_VRC_myworld/docs/the_backdrops_pro_photo_studio_gdd.md`
- VRChat Creator Docs: https://creators.vrchat.com/
- Performance Ranks and Limits: https://creators.vrchat.com/worlds/performance-ranks-limits
- UdonSharp Documentation: https://udonsharp.docs.vrchat.com/
- VRChat Current Unity Version: https://creators.vrchat.com/sdk/upgrade/current-unity-version
- Creator Economy（Credits / Feature Parity）: https://creators.vrchat.com/economy/
- VRC Light Volumes（REDSIM）: https://github.com/REDSIM/VRCLightVolumes
- Post-Processing Stack v2: https://docs.unity3d.com/Packages/com.unity.postprocessing@3.4/
- Git LFS テンプレート: `resources/templates/gitattributes-unity`、`resources/templates/git-lfs-setup.md`
- リサーチレポート: `projects/PRJ-001_VRC_myworld/resources/`（未作成）

## 15. 未決定事項

- [ ] Unity のパッチバージョン確定（1節。キックオフ時に VRChat 公式推奨版を確認して確定する）
- [ ] VRChat SDK3 (Worlds) のマイナーバージョン確定（1節）
- [ ] VCC および Post-Processing Stack v2、VRC Light Volumes のバージョン確定（1節）
- [ ] リポジトリURLの確定（0節。Git 構築後に追記）
- [ ] Udon クラスごとの Ownership 遷移仕様の詳細化（8節。Manual同期・操作者所有権・Last-writer-wins・300msデバウンスの方針は確定、要素別の詳細は実装前協議）
- [ ] 照明プリセット LT-01〜LT-03 の具体的な Light 配置・強度・色温度プリセット値（5節、6節）
- [ ] Mobile フォールバック UI のアートワーク（FL-01〜FL-04 の UI Canvas オーバーレイ画像）
- [ ] 壁面パネル（WP-01 / WP-04）の CC0 PBR マテリアル調達元確定と、Height Map を焼き込んだ Mobile 用ベースカラーテクスチャの制作
- [ ] 壁面パネルとクロマキー背景（BG-06 / BG-07）の同時選択時のツールチップ文言
- [ ] Booth販売アセットの差別化ポイントおよび最終価格（GDD §4.3 の競合調査完了後に確定）
- [ ] ハッシュタグ戦略における既存コミュニティタグの特定（GDD §5.4）
- [ ] iOS ビルドの Build & Test 手順の整備（11節。Android と共通化できる範囲の見極め）
- [ ] I-09 BGM プレイヤー初期プレイリストのキュレーション（フリー素材音源および商用利用許諾済み YouTube 動画の URL 一覧、ライセンス根拠を `resources/` に記録）

### Phase2 候補（初回リリース後に着手）

- [ ] VIPブース（A-03）と VIPアクセスゲート（VipAccessGate）の実装
- [ ] VRChat Credits 課金導線（Permanent / Instant / Temporary / グループサブスクリプション、GDD §3）
- [ ] Instant商品トリガー（Photo Flash FX / Confetti Burst、JuiceEffectDispatcher）
- [ ] Seasonal Theme Pass（GDD §7 の季節テーマ）
- [ ] 色温度・光量スライダー（LightTrimController）
- [ ] 壁面パネル追加2種（WP-02 レンガ / WP-03 岩壁）
- [ ] 壁面パネルの Parallax Occlusion Mapping と Height Map（PC）
- [ ] 画角ガイドオーバーレイ
- [ ] 側面ローカルミラー
- [ ] フィルターの同時適用（多重掛け）
- [ ] エントランスとスタジオでのBGM差別化
- [ ] 汎用プロップの拡充（アクリル幾何オブジェクト等）
- [ ] TelemetryCollector の共通基盤化と計測対象イベントの拡張（VIPブース利用、ON AIR 発動回数、Instant商品使用、壁面パネル選択）
- [ ] VIPブース限定背景テクスチャの点数と具体的なテーマ（GDD §1.5）

## 16. 開発マイルストーン（4週間、20営業日）

開発は2026-04-20から2026-05-15の4週間で実施する。週次のデリバラブルと合格ラインを以下に定める。

### Week 1（2026-04-20 〜 2026-04-24、基盤構築）

- Unity / VRChat SDK3 / VCC / UdonSharp / Post-Processing Stack v2 / VRC Light Volumes のプロジェクトセットアップ
- Git リポジトリ構築と Git LFS 有効化、`gitattributes-unity` 適用
- エントランス（A-01）とメインスタジオ（A-02）の基礎シーン構築（カメラ動線、スポーン地点、壁面配置）
- `StudioManager` および `PlatformRouter` の骨格実装（状態管理クラスと同期フィールド定義、プラットフォーム判定）
- Week 1 完了条件: PC と Quest の両方で空のワールドが起動し、`PlatformRouter` がプラットフォームを正しく識別する

### Week 2（2026-04-27 〜 2026-05-01、背景・壁面・照明）

- 背景7種（BG-01〜BG-07）のマテリアル作成と `BackdropController` 実装
- 壁面パネル2種（WP-01 漆喰、WP-04 コンクリ）のテクスチャ調達（CC0）、PC/Mobile用の分離、`WallPanelController` 実装
- 照明プリセット3種（LT-01〜LT-03）の Realtime Light 配置と `LightingPresetController` 実装
- VRC Light Volumes のベイクと Light Probe Group 配置
- Week 2 完了条件: 背景・壁面パネル・照明の3系統をパネルから切り替えられ、PC と Mobile の両ビルドで同等に同期する

### Week 3（2026-05-04 〜 2026-05-08、フィルター・ON AIR・Telemetry）

- フィルター4種（FL-01〜FL-04）の PC 実装（`FilterControllerPC`、Post-Processing Volume プロファイル）
- フィルター4種の Mobile 実装（`FilterControllerMobile`、UI Canvas オーバーレイとライトパラメータ操作）
- ON AIR システム（I-06、`OnAirSignalController`）
- リセットボタン（I-05）の一括復帰ロジック
- `TelemetryLogger` の最小構成実装（3イベントの `Debug.Log` 出力）
- Week 3 完了条件: PC と Mobile の両ビルドでフィルター切替が200ms以下で反映され、ON AIR が正しく点灯・通知音再生する

### Week 4（2026-05-11 〜 2026-05-15、仕上げと検証）

- Booth 導線サイネージ（A-03）の設置とワールド内クレジットパネル（A-01）の整備
- 汎用プロップ（I-07、スツール1種・観葉植物1種）の配置
- 正面ミラー（I-08）の設置
- 音響組み込み: I-09 BGM プレイヤー（VRChat 同梱 Video Player プレハブ）をエントランスに設置し、フリー素材音声および商用利用許諾済み YouTube 動画の初期プレイリストを登録。S-02 ON AIR 通知音と S-03 パネル操作音を配置
- PC / Android / iOS の全ビルドで Performance Rank 目標（PC: Poor以上、Mobile: Medium以上）を達成する最適化
- 10節のパフォーマンス検証項目を全て合格させる
- クロスプラットフォームで Private アップロード、プレローンチ期間へ引き渡し
- Week 4 完了条件: 3プラットフォームの Private ビルドがアップロード済みで、10節の合格基準を満たす

### プレローンチ期間（2026-05-16 〜 2026-05-22）

- アンバサダー10〜15名でのプレイテスト1巡
- 致命的バグの修正とフィードバック即時反映
- 2026-05-23 に Community Labs へ昇格

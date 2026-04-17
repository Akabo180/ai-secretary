# コーディングおよびレビュー規則

本プロジェクトにおいてAIアシスタント（Copilot, Claude等）がコードを生成・レビューする際は、以下の原則と制約を厳格に遵守すること。

## 1. セキュリティとデータ保護（最優先事項）
- **シークレット管理**: APIキー、トークン、秘密鍵は絶対にコード内にハードコードしないこと。必ず環境変数やSecretマネージャーを使用すること。
- **認可の徹底（IDOR対策）**: データ取得・更新時は、認証だけでなく「リクエストされたデータが現在のログインユーザーに属しているか」をサーバーサイドで必ず検証すること。
- **入力の疑い**: クライアントサイドのバリデーションに依存せず、サーバーサイドで厳格な入力検証（型、サイズ、範囲など）を必ず実装すること。
- **エラーハンドリング**: 本番環境において、スタックトレースや内部情報（DBの構造、ファイルパスなど）を含むエラーメッセージをユーザーに返さないこと。詳細はサーバーのログにのみ記録し、ユーザーには抽象的なメッセージを返すこと。

## 2. ライブラリと依存関係
- **実在と安全性の確認**: パッケージやライブラリを提案・追加する際は、実在するものか、メンテナンスが継続しているかを確認すること（ハルシネーションの禁止）。
- **バージョンの固定**: `package-lock.json` や `requirements.txt` を用いて依存関係のバージョンを固定すること。

## 3. データモデリングとトランザクション
- **破壊的変更の防止**: 稼働中のデータベーススキーマを変更する場合は、影響範囲を考慮し、安全なマイグレーション手順を提案すること。
- **トランザクションと冪等性**: 決済やデータ更新処理では、「途中で処理が失敗した場合」や「複数回リクエストされた場合」を考慮し、トランザクション境界と冪等性（Idempotency）を担保した設計にすること。

## 4. テストと品質
- **意味のあるテスト**: 正常系（ハッピーパス）だけでなく、境界値や異常系のテストを必ず含めること。
- **モックの乱用禁止**: 過剰にモックを使用せず、Arrange/Act/Assertが明確で、実装の詳細に依存しない（リファクタリングで壊れない）テストを書くこと。

## 5. コストとパフォーマンス
- **スケーラビリティの考慮**: N+1問題を引き起こすクエリや、データ量増加により著しくパフォーマンスが低下するループ処理を避けること。
- **無限ループの防止**: 外部APIを呼び出す処理において、リトライが無限に発生しないよう適切なバックオフと上限を設けること。

## 6. Unity / C# 固有ルール

Unityプロジェクト（VRChatワールド、cluster、通常のUnityアプリ含む）で C# を書く際に遵守する。

- **Update内での高コストAPI禁止**: `Update()`・`LateUpdate()`・`FixedUpdate()` 内で `GetComponent`・`Find`・`GameObject.Find`・`Camera.main`・`FindObjectOfType` を呼ばないこと。`Awake()` または `Start()` でキャッシュしてフィールドに保持する。
- **コルーチンの解放**: コルーチンは GameObject が無効化・破棄されると停止するが、親オブジェクト以外で開始したコルーチンは残留する。`StartCoroutine` の戻り値を保持し、終了時に `StopCoroutine` を呼ぶこと。
- **Destroy順序**: `OnDestroy` 内で他コンポーネントへアクセスする場合、その相手も破棄済みの可能性がある。null チェックを必ず入れる。
- **Instantiate/Destroyの抑制**: ランタイムで頻繁に生成・破棄するオブジェクトはオブジェクトプールを採用する。
- **Invoke/InvokeRepeating禁止**: 文字列でメソッド名を指定する `Invoke`・`InvokeRepeating` はリファクタリング耐性がない。コルーチンまたは `async UniTask`（採用時）で代替する。
- **シリアライズ可能フィールド**: Inspectorに公開する場合は `[SerializeField] private` を基本とする。`public` で公開するのは意図的に他スクリプトから触らせる場合のみ。
- **マジックストリング**: タグ名・レイヤー名・プレハブパスを文字列リテラルで散在させない。定数クラスまたは ScriptableObject に集約する。

## 7. UdonSharp / VRChat 固有ルール

VRChatワールド案件で UdonSharp（`UdonSharpBehaviour` 継承クラス）を書く際の制約。

- **使用不可API**: `System.Threading`, `System.Reflection`, LINQ拡張メソッドの大半, `delegate`/`event`, 多次元配列, ジェネリクスはUdonで動作しない。これらを提案・生成しないこと。
- **非同期処理の代替**: `async`/`await`・`Coroutine` は使えない。遅延実行は `SendCustomEventDelayedSeconds` / `SendCustomEventDelayedFrames` を使う。
- **メソッド間通信**: 他の `UdonSharpBehaviour` への呼び出しは `SendCustomEvent(string)` または `SendCustomNetworkEvent(NetworkEventTarget, string)` を使う。
- **同期変数の最小化**: `[UdonSynced]` は本当に必要な値のみ。毎フレーム変動する値（座標など）は Continuous Sync 以外では同期しない。
- **所有権の明示**: 書込が必要なオブジェクトは `Networking.IsOwner(gameObject)` を確認してから操作する。所有権が無い場合は `Networking.SetOwner` を呼ぶ。
- **プレイヤー入力の不信**: VRChat はクライアント改変が可能なため、表示名・ID・プレイヤー位置を信頼しきらない。重要な判定は複数プレイヤーの合意を前提にしない。
- **Quest互換**: Quest対応案件では `Standard Shader`、`AVPro Video Player`、`Post Processing`、`Dynamic Bone`、`Reflection Probe 3枚以上` を使わない。

## 8. Blender Python / bpy 固有ルール

Blenderアドオン開発時に遵守する。

- **bpyバージョン互換**: 対象Blenderバージョンを `bl_info` で明示し、そのバージョンに存在するAPIのみを使う。特に Blender 3.x → 4.x で API 変更が多い。
- **Operator/Panel規約**: `bl_idname` は `category.operation_name` 形式、全て小文字＋アンダースコア。`bl_label` は人間可読な文字列。
- **undo対応**: データ変更を伴うOperatorは `bl_options = {'REGISTER', 'UNDO'}` を付与する。
- **モーダル処理の終了**: Modal Operator は必ず `{'CANCELLED'}` または `{'FINISHED'}` を返すパスを確保する。
- **例外時のリソース解放**: `try/finally` でハンドラ解除や一時ファイル削除を保証する。
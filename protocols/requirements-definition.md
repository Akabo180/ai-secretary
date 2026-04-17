# 要件定義

曖昧なアイデアを、Google Antigravity の `web-coder` スキルが読み取れる具体的な仕様に落とし込む。

## トリガー

- 「要件定義して」「requirements を作って」「仕様に落として」
- 新規Web案件の依頼を受けた直後
- `protocols/research.md` 完了後、実装前のステージ

## 実行手順

1. 受領確認
   - 案件が `projects/` 配下に存在するか確認する
   - 無ければ `protocols/project-mgmt.md` に従いプロジェクトを作成する
2. リサーチの呼び出し
   - 関連領域の調査が未実施なら、先に `protocols/research.md` を実行する
   - 調査レポートは `projects/PRJ-XXX/resources/YYYY-MM-DD-*.md` に保存する
3. テンプレートの複製
   - `resources/templates/requirements.md` を `projects/PRJ-XXX/requirements.md` にコピーする
4. 各節の埋め込み
   - 下記の「記述の質基準」に従い、各節を埋める
   - 埋められない節は「未決定事項」に集約し、空欄で残さない
5. 未決点の確認
   - 13 節「未決定事項 / 要確認」の項目をユーザーに提示し、判断を得る
   - 判断後、当該節に反映する
6. 配置の確認
   - `projects/PRJ-XXX/requirements.md` がプロジェクトルートに存在することを確認する
   - `projects/PRJ-XXX/README.md` の「成果物」欄に要件定義書を記載する

## 記述の質基準

### 定量化

曖昧な形容詞は、測定可能な値に置換する。

| 曖昧 | 具体 |
|------|------|
| 高速 | LCP < 2.5s |
| 多くの画面 | 画面5つ以上 |
| モダンなUI | Figmaファイル v1.2 に準拠 |

### 検証可能性

成功条件は、実装後にチェックできる形で書く。第三者が「この条件を満たしたか」を判定できない記述は受け付けない。

### スコープの明示

やること（In-Scope）と、やらないこと（Non-Goals）の両方を記述する。Non-Goals が空の要件定義書は、スコープ漏れの兆候である。

### 技術選定の根拠

6 節の技術スタックは、選定理由を併記する。「なんとなく」「流行っているから」は根拠として採用しない。

## アウトプット

| ファイル | 配置先 | 内容 |
|---------|--------|------|
| requirements.md | projects/PRJ-XXX/requirements.md | 本書の主成果物 |
| README.md 更新 | projects/PRJ-XXX/README.md | 要件定義書リンクを追記 |
| report 初版 | projects/PRJ-XXX/report.md | 実装前のサマリー（Antigravity が追記する） |

## Antigravity への引き渡し

要件定義書の完成後、ユーザーに次の操作を依頼する。

1. Antigravity のワークスペースでプロジェクトフォルダ（`projects/PRJ-XXX/`）を開く
2. `skills/web-coder/SKILL.md` をスキルとして有効化する
3. 「requirements.md に従って実装して」と指示する

## 品質チェック（自己検証）

提出前に以下を自問する。

- 未決定事項を見逃していないか
- 成功条件は第三者が検証できる粒度か
- セキュリティ要件（9 節）が空でないか
- 技術スタックに選定理由が記載されているか

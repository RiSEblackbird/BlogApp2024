I'll check the repo config (scripts, README, submodule settings) to confirm how the submodule is pulled and propose a precise fix for Vercel (PAT env var, URL scheme, or removing the submodule step). Then I'll suggest the minimal change required.

[4 tools called]

今のビルド失敗は、Vercel 側で `posts` サブモジュール（`https://github.com/RiSEblackbird/BlogApp2024-posts.git`）をクローンする際の認証が通っていないことが原因です。`vercel-build` スクリプトは `GH_TOKEN` を期待していますが、Vercel に未設定（または権限不足/期限切れ）です。

- これからやること: 追加のコード変更なしで、Vercel にトークンを設定する最小手順を提示します。必要ならスクリプトの簡素化案も併記します。

### 対処（最小変更）

- 確認ポイント
  - `package.json` の `vercel-build` は以下です（`GH_TOKEN` 必須）:
    ```12:12:d:\Users\mokut\Documents\GitHub\BlogApp2024\package.json
    "vercel-build": "git config --global url.\"https://${GH_TOKEN}:@github.com/\".insteadOf \"https://github.com/\" && git submodule update --init --recursive && next build"
    ```
  - `.gitmodules` は HTTPS でサブモジュールを指しています:
    ```1:3:d:\Users\mokut\Documents\GitHub\BlogApp2024\.gitmodules
    [submodule "posts"]
    	path = posts
    	url = https://github.com/RiSEblackbird/BlogApp2024-posts.git
    ```

- 手順
  1) GitHub で PAT（Personal Access Token）を発行
     - 可能なら Fine-grained PAT を推奨
       - Repository access: Only selected repositories → `BlogApp2024-posts`
       - Permissions: Contents → Read-only
     - Classic PAT の場合は `repo`（最低限 read）権限に限定
  2) Vercel プロジェクト設定 → Environment Variables に追加
     - Key: `GH_TOKEN`
     - Value: 発行した PAT
     - Target: Production と Preview（必要なら Development も）
  3) 再デプロイ（Retry / Redeploy）
     - これで `git config --global url."https://${GH_TOKEN}:@github.com/".insteadOf "https://github.com/"` が効き、サブモジュール取得が成功します。

### 代替案（より標準的でシンプル）

- Vercel 標準の変数を使う
  - 環境変数に `VERCEL_GIT_SUBMODULE_TOKEN` を設定（上記と同じ権限の PAT）
  - `package.json` の `vercel-build` を簡素化:
    - 例: `git submodule update --init --recursive && next build`
    - もしくは Vercel の自動サブモジュール取得に任せる（この場合でも `git submodule update` を残しておくとローカルと整合的）
- メリット: 独自の `git config --global url...` ハックが不要（KISS/DRY）

### うまくいかない場合のチェック

- トークンの権限が不足（Contents: Read がない）
- トークンの対象リポジトリに `BlogApp2024-posts` が含まれていない
- トークンが期限切れ/取り消し
- サブモジュール URL が SSH になっている（今回は HTTPS なのでOK）
- リポジトリ自体を公開にできるなら、公開化でトークン不要に

### まとめ
- 最小修正は Vercel に `GH_TOKEN` を設定して再デプロイ。
- 将来的には `VERCEL_GIT_SUBMODULE_TOKEN` に移行し、`vercel-build` の `git config --global ...` を削除するとシンプル。

- 問題の本質: サブモジュール取得時の認証がビルド環境に供給されていなかったため、`Authentication failed` が発生。

コミットメッセージ（提案・コード変更不要のため任意）
- 日本語: chore: Vercel 用に GH_TOKEN/サブモジュールトークンを設定してビルド失敗を修正
- 英語: chore: Configure GH_TOKEN/submodule token on Vercel to fix submodule cloning

ブランチ名（提案）
- fix/vercel-submodule-auth

新人向け解説
- Vercel のビルドはクリーン環境で走るので、ローカルで持っている GitHub 認証情報は使えません。プライベートサブモジュールを使う場合、ビルド環境に「読み取り専用トークン」を環境変数として渡す必要があります。
- `package.json` の `vercel-build` は、`GH_TOKEN` を使って「すべての https://github.com/ アクセスを https://<token>@github.com/ に置き換える」設定を先行で実行し、続けて `git submodule update --init --recursive` でコンテンツを取得、最後に `next build` しています。
- より標準的には Vercel の `VERCEL_GIT_SUBMODULE_TOKEN` を使うと、`git config` の書き換えが不要になります。どちらでも動きますが、KISS/DRY 観点では標準機能の利用を推奨します。
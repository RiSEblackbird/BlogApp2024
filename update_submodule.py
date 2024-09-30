"""
このスクリプトは、Gitリポジトリ内のサブモジュールの更新、コミット、プッシュを自動化します。

処理内容:
1. サブモジュールのリモート更新とマージ
2. サブモジュールの変更をステージング
3. サブモジュールの最後のコミットメッセージを取得し、メインリポジトリにコミット
4. リモートの master ブランチにプッシュ

使用方法:
    python update_submodule.py

前提条件:
- Gitがインストールされていること
- サブモジュールが "posts" ディレクトリにあること
"""

import subprocess

def run_command(command):
    result = subprocess.run(command, shell=True, check=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return result.stdout.strip()

def update_submodule():
    # git submodule update --remote --merge
    print("Updating submodule...")
    run_command("git submodule update --remote --merge")

def get_last_submodule_commit_message():
    # サブモジュールの最後のコミットメッセージを取得
    print("Getting last commit message from submodule...")
    return run_command("git log -1 --pretty=%B posts")

def add_submodule():
    # git add posts
    print("Adding submodule...")
    run_command("git add posts")

def commit_changes(last_commit_message):
    # git commit -m "Update submodule post reference; {last_commit_message}"
    commit_message = f"Update submodule post reference; {last_commit_message}"
    print(f"Committing changes with message: {commit_message}")
    run_command(f'git commit -m "{commit_message}"')

def push_changes():
    # git push origin master
    print("Pushing changes to remote...")
    run_command("git push origin master")

if __name__ == "__main__":
    update_submodule()
    last_commit_message = get_last_submodule_commit_message()  # サブモジュールの最後のコミットメッセージを取得
    add_submodule()
    commit_changes(last_commit_message)
    push_changes()

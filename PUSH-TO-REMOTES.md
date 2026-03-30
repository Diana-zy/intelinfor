# 推送代码到 GitHub 和阿里云

本文档说明如何将代码同时推送到 GitHub 和阿里云仓库。

## 📋 前置条件

### 1. GitHub 设置
- ✅ GitHub 账户已创建
- ✅ 仓库已创建: `https://github.com/wodeaich/intelinfor.git`
- ✅ 已生成 Personal Access Token 或配置 SSH 密钥

**获取 GitHub Token:**
1. 登录 GitHub
2. 点击右上角头像 → Settings → Developer settings → Personal access tokens
3. 生成 Fine-grained tokens，勾选 `repo` 权限
4. 复制 token（只显示一次！）

### 2. 阿里云设置
- ✅ 阿里云账户已登录
- ✅ 仓库已创建: `git@codeup.aliyun.com:6899b33b7e0dbda9ae2d0130/h5web/intelinfor.git`
- ✅ 已配置 SSH 密钥

**配置阿里云 SSH 密钥:**
```bash
# 生成 SSH 密钥（如果还没有）
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# 添加到 SSH Agent
ssh-add ~/.ssh/id_rsa

# 测试连接
ssh -T git@codeup.aliyun.com
```

## 🚀 推送方法

### 方法 1：使用自动化脚本（推荐）

```bash
# 进入项目目录
cd /path/to/intelinfor

# 赋予脚本执行权限
chmod +x push-to-remotes.sh

# 运行脚本
./push-to-remotes.sh
```

**脚本会自动：**
- ✅ 添加 GitHub 和阿里云 remotes
- ✅ 推送分支到两个仓库
- ✅ 显示推送结果

### 方法 2：手动推送（需要输入凭证）

```bash
# 1. 进入项目目录
cd /path/to/intelinfor

# 2. 添加 Remotes
git remote add github https://github.com/wodeaich/intelinfor.git
git remote add aliyun git@codeup.aliyun.com:6899b33b7e0dbda9ae2d0130/h5web/intelinfor.git

# 3. 推送到 GitHub（会提示输入用户名和密码或Token）
git push -u github claude/analyze-codebase-RAYXg

# 4. 推送到阿里云（需要 SSH 密钥）
git push -u aliyun claude/analyze-codebase-RAYXg

# 5. 验证推送
git remote -v
git branch -vv
```

### 方法 3：使用 GitHub CLI（更简单）

```bash
# 安装 GitHub CLI
# macOS:
brew install gh

# Linux:
type -p gh &> /dev/null || (
  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
  sudo apt update
  sudo apt install gh
)

# 认证
gh auth login

# 推送
git push -u github claude/analyze-codebase-RAYXg
```

## 🔐 认证方式选择

### GitHub - Token 认证（推荐新方式）

```bash
# 使用 Token 作为密码
# 当提示输入密码时，粘贴你的 Personal Access Token

git push -u github claude/analyze-codebase-RAYXg
# Username: your-github-username
# Password: ghp_xxxxxxxxxxxxxxxxxxxxxx  (你的 Token)
```

### GitHub - SSH 认证（更安全）

```bash
# 首先配置 SSH 密钥
ssh-keygen -t rsa -b 4096 -C "your-email@gmail.com"

# 添加公钥到 GitHub
# 1. 复制 ~/.ssh/id_rsa.pub 内容
# 2. 登录 GitHub → Settings → SSH and GPG keys
# 3. 点击 New SSH key，粘贴公钥

# 修改 remote URL 为 SSH
git remote set-url github git@github.com:wodeaich/intelinfor.git

# 推送
git push -u github claude/analyze-codebase-RAYXg
```

### 阿里云 - SSH 认证（必需）

```bash
# 配置 SSH 密钥（同上）
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# 添加公钥到阿里云
# 1. 复制 ~/.ssh/id_rsa.pub 内容
# 2. 登录阿里云 Codeup
# 3. 个人设置 → SSH 公钥 → 新增公钥
# 4. 粘贴公钥内容

# 测试连接
ssh -T git@codeup.aliyun.com

# 推送
git push -u aliyun claude/analyze-codebase-RAYXg
```

## 📊 查看推送结果

```bash
# 查看所有 remotes
git remote -v

# 查看分支和追踪信息
git branch -vv

# 查看提交历史
git log --oneline -10

# 验证分支是否推送到远程
git ls-remote github
git ls-remote aliyun
```

## ✅ 推送成功标志

### GitHub
```
✓ Branch pushed to github/claude/analyze-codebase-RAYXg
✓ GitHub 仓库中可以看到新分支
✓ Pull requests 页面可见
```

### 阿里云
```
✓ Branch pushed to aliyun/claude/analyze-codebase-RAYXg
✓ 阿里云 Codeup 中可以看到新分支
✓ 分支列表中显示 claude/analyze-codebase-RAYXg
```

## 🐛 故障排除

### 错误：`fatal: could not read Username`

**原因:** HTTPS 需要认证
**解决:**
```bash
# 使用 Token 重试
# 或改用 SSH

git remote set-url github git@github.com:wodeaich/intelinfor.git
```

### 错误：`Permission denied (publickey)`

**原因:** SSH 密钥未正确配置
**解决:**
```bash
# 检查 SSH 配置
ssh -T git@github.com
ssh -T git@codeup.aliyun.com

# 添加密钥到 SSH Agent
ssh-add ~/.ssh/id_rsa

# 重试
git push
```

### 错误：`The remote repository does not exist`

**原因:** 仓库 URL 错误或仓库未创建
**解决:**
```bash
# 验证 URL
git remote -v

# 确保仓库已在 GitHub/阿里云 创建
# 检查仓库是否公开（如果需要）

# 更正 URL
git remote set-url github https://github.com/wodeaich/intelinfor.git
```

### 错误：`fatal: could not create work tree dir`

**原因:** 目录权限问题
**解决:**
```bash
# 检查目录权限
ls -la

# 修复权限
chmod -R u+w .git

# 重试
git push
```

## 📚 参考文档

- [GitHub 文档](https://docs.github.com/en/get-started/using-git)
- [阿里云 Codeup 文档](https://help.aliyun.com/document_detail/82649.html)
- [Git Remote 文档](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)

## 🎯 推送完成清单

- [ ] 已配置 GitHub 仓库
- [ ] 已配置阿里云仓库
- [ ] 已生成 SSH 密钥或 Token
- [ ] 已添加 remotes
- [ ] 已成功推送到 GitHub
- [ ] 已成功推送到阿里云
- [ ] 已验证两个仓库都显示新分支
- [ ] 已更新项目文档中的仓库链接

## 💡 建议

1. **定期同步**: 之后的所有更新都推送到两个仓库
   ```bash
   git push github claude/analyze-codebase-RAYXg
   git push aliyun claude/analyze-codebase-RAYXg
   ```

2. **设置默认 remote**: 简化推送命令
   ```bash
   git push github  # 不需要指定分支
   ```

3. **使用 Alias**: 加快推送速度
   ```bash
   git config --global alias.pushall '!git push github && git push aliyun'
   git pushall
   ```

---

**下一步:** 推送完成后，可以在 GitHub 和阿里云的网页上验证代码是否已上传。

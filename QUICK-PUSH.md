# 快速推送指南（3 分钟快速版本）

## 🚀 最快的推送方式

### 第一次推送（2 分钟）

```bash
# 1. 进入项目目录
cd /path/to/intelinfor

# 2. 运行推送脚本
chmod +x push-to-remotes.sh
./push-to-remotes.sh

# 完成！
```

### 后续推送（1 分钟）

```bash
# GitHub
git push github claude/analyze-codebase-RAYXg

# 阿里云
git push aliyun claude/analyze-codebase-RAYXg
```

---

## 🔧 快速设置

### GitHub - Token 方式（推荐）

```bash
# 1. 获取 Token
# GitHub → Settings → Developer settings → Tokens → Generate token
# 权限: repo (全选)

# 2. 添加 remote
git remote add github https://github.com/wodeaich/intelinfor.git

# 3. 推送（会提示输入 Token）
git push -u github claude/analyze-codebase-RAYXg
# Username: your-username
# Password: [粘贴 Token]
```

### 阿里云 - SSH 方式（必需）

```bash
# 1. 生成 SSH 密钥（如果没有）
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# 2. 添加到阿里云
# 阿里云 Codeup → 个人设置 → SSH 公钥
# 复制 ~/.ssh/id_rsa.pub 内容，粘贴到上面

# 3. 添加 remote
git remote add aliyun git@codeup.aliyun.com:6899b33b7e0dbda9ae2d0130/h5web/intelinfor.git

# 4. 测试连接
ssh -T git@codeup.aliyun.com

# 5. 推送
git push -u aliyun claude/analyze-codebase-RAYXg
```

---

## 📋 检查清单

```bash
# 查看 remotes 配置
git remote -v

# 应该显示:
# aliyun  git@codeup.aliyun.com:... (fetch)
# aliyun  git@codeup.aliyun.com:... (push)
# github  https://github.com/wodeaich/intelinfor.git (fetch)
# github  https://github.com/wodeaich/intelinfor.git (push)
```

---

## 🆘 常见问题

| 问题 | 解决方案 |
|------|---------|
| `Permission denied` | 检查 SSH 密钥: `ssh -T git@codeup.aliyun.com` |
| `could not read Username` | GitHub 需要 Token，改用 SSH 或填入 Token |
| `Repository not found` | 检查仓库 URL 和权限 |
| `fatal: could not create work tree` | 检查目录权限: `chmod -R u+w .git` |

---

## ✨ 推送后验证

```bash
# GitHub 上查看
# https://github.com/wodeaich/intelinfor/tree/claude/analyze-codebase-RAYXg

# 阿里云上查看
# https://codeup.aliyun.com/xxx/h5web/intelinfor/-/tree/claude/analyze-codebase-RAYXg
```

---

## 💡 设置 Alias（可选）

```bash
# 一条命令同时推送到两个仓库
git config --global alias.pushall '!git push github && git push aliyun'

# 之后使用
git pushall  # 自动推送到两个仓库
```

---

**完整文档**: 查看 `PUSH-TO-REMOTES.md`

**推送脚本**: 运行 `./push-to-remotes.sh`

#!/bin/bash

# ============================================================
# Git 推送脚本 - 同时推送到 GitHub 和阿里云
# ============================================================

set -e  # 任何命令失败就退出

echo "🚀 开始推送代码到 GitHub 和阿里云..."
echo ""

# 当前分支
BRANCH="claude/analyze-codebase-RAYXg"

# ============================================================
# 第一步：添加 Remote（如果还没有的话）
# ============================================================

echo "📦 配置 Git Remotes..."

# GitHub
if ! git remote get-url github &>/dev/null; then
    git remote add github https://github.com/wodeaich/intelinfor.git
    echo "✅ 已添加 GitHub remote"
else
    echo "✓ GitHub remote 已存在"
fi

# 阿里云
if ! git remote get-url aliyun &>/dev/null; then
    git remote add aliyun git@codeup.aliyun.com:6899b33b7e0dbda9ae2d0130/h5web/intelinfor.git
    echo "✅ 已添加阿里云 remote"
else
    echo "✓ 阿里云 remote 已存在"
fi

echo ""
echo "📋 当前 Remotes 配置:"
git remote -v
echo ""

# ============================================================
# 第二步：推送到 GitHub
# ============================================================

echo "📤 推送到 GitHub..."
echo "   Branch: $BRANCH"

if git push -u github $BRANCH; then
    echo "✅ GitHub 推送成功！"
    GITHUB_SUCCESS=true
else
    echo "❌ GitHub 推送失败"
    echo "   可能原因："
    echo "   1. 需要输入 GitHub 用户名和密码/Token"
    echo "   2. 或者使用 SSH 密钥认证"
    GITHUB_SUCCESS=false
fi

echo ""

# ============================================================
# 第三步：推送到阿里云
# ============================================================

echo "📤 推送到阿里云..."
echo "   Branch: $BRANCH"

if git push -u aliyun $BRANCH; then
    echo "✅ 阿里云推送成功！"
    ALIYUN_SUCCESS=true
else
    echo "❌ 阿里云推送失败"
    echo "   可能原因："
    echo "   1. SSH 密钥未配置"
    echo "   2. 或者没有权限访问该仓库"
    ALIYUN_SUCCESS=false
fi

echo ""
echo "============================================================"
echo "📊 推送结果汇总:"
echo "============================================================"

if [ "$GITHUB_SUCCESS" = true ]; then
    echo "✅ GitHub:  成功"
else
    echo "❌ GitHub:  失败"
fi

if [ "$ALIYUN_SUCCESS" = true ]; then
    echo "✅ 阿里云:  成功"
else
    echo "❌ 阿里云:  失败"
fi

echo ""

# ============================================================
# 第四步：显示推送结果
# ============================================================

if [ "$GITHUB_SUCCESS" = true ] && [ "$ALIYUN_SUCCESS" = true ]; then
    echo "🎉 所有推送都成功了！"
    exit 0
elif [ "$GITHUB_SUCCESS" = true ] || [ "$ALIYUN_SUCCESS" = true ]; then
    echo "⚠️  部分推送成功，请检查失败的仓库"
    exit 1
else
    echo "❌ 推送失败，请检查配置"
    exit 2
fi

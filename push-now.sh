#!/bin/bash

# ============================================================
# 推送脚本 - 同时推送到 GitHub 和阿里云
# ============================================================

set -e

echo "🚀 开始推送代码到 GitHub 和阿里云..."
echo ""

BRANCH="claude/analyze-codebase-RAYXg"
GITHUB_SUCCESS=false
ALIYUN_SUCCESS=false

# ============================================================
# 推送到 GitHub
# ============================================================

echo "📤 推送到 GitHub..."
echo "   Branch: $BRANCH"
echo "   Repository: https://github.com/wodeaich/intelinfor.git"
echo ""

if git push -u github $BRANCH; then
    echo "✅ GitHub 推送成功！"
    GITHUB_SUCCESS=true
else
    echo "❌ GitHub 推送失败"
    echo "   故障排除:"
    echo "   • 检查互联网连接"
    echo "   • 确保已配置 GitHub Token 或 SSH 密钥"
    echo "   • 运行: gh auth login (如果使用 GitHub CLI)"
    echo ""
fi

echo ""

# ============================================================
# 推送到阿里云
# ============================================================

echo "📤 推送到阿里云..."
echo "   Branch: $BRANCH"
echo "   Repository: git@codeup.aliyun.com:6899b33b7e0dbda9ae2d0130/h5web/intelinfor.git"
echo ""

if git push -u aliyun $BRANCH; then
    echo "✅ 阿里云推送成功！"
    ALIYUN_SUCCESS=true
else
    echo "❌ 阿里云推送失败"
    echo "   故障排除:"
    echo "   • 确保已配置 SSH 密钥"
    echo "   • 测试连接: ssh -T git@codeup.aliyun.com"
    echo "   • 运行: ssh-add ~/.ssh/id_rsa"
    echo ""
fi

echo ""
echo "============================================================"
echo "📊 推送结果汇总:"
echo "============================================================"

if [ "$GITHUB_SUCCESS" = true ]; then
    echo "✅ GitHub:  成功"
    echo "   🔗 https://github.com/wodeaich/intelinfor/tree/claude/analyze-codebase-RAYXg"
else
    echo "❌ GitHub:  失败"
fi

if [ "$ALIYUN_SUCCESS" = true ]; then
    echo "✅ 阿里云:  成功"
    echo "   🔗 https://codeup.aliyun.com/xxx/h5web/intelinfor/-/tree/claude/analyze-codebase-RAYXg"
else
    echo "❌ 阿里云:  失败"
fi

echo ""

# ============================================================
# 结果检查
# ============================================================

if [ "$GITHUB_SUCCESS" = true ] && [ "$ALIYUN_SUCCESS" = true ]; then
    echo "🎉 所有推送都成功了！"
    echo ""
    echo "后续步骤:"
    echo "1. 在 GitHub 上创建 Pull Request"
    echo "2. 在阿里云 Codeup 上创建 Merge Request"
    echo "3. 部署到测试/生产环境"
    exit 0
elif [ "$GITHUB_SUCCESS" = true ] || [ "$ALIYUN_SUCCESS" = true ]; then
    echo "⚠️  部分推送成功，请检查失败的仓库"
    exit 1
else
    echo "❌ 推送失败，请检查配置和凭证"
    exit 2
fi

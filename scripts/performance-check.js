#!/usr/bin/env node

/**
 * 性能检查脚本
 * 在构建后检查性能预算和优化建议
 */

const fs = require('fs');
const path = require('path');
const performanceBudget = require('../config/cache-headers').performanceBudget;

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (e) {
    return 0;
  }
}

function analyzeBundle() {
  log('\n📊 性能预算检查', 'cyan');
  log('='.repeat(50), 'cyan');

  const distPath = path.join(__dirname, '../dist');
  const nuxtPath = path.join(distPath, '_nuxt');

  // 收集所有文件
  const files = {
    js: [],
    css: [],
    images: [],
    total: 0
  };

  function scanDirectory(dir, category = null) {
    try {
      const entries = fs.readdirSync(dir);

      entries.forEach(entry => {
        const fullPath = path.join(dir, entry);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          scanDirectory(fullPath, category);
        } else {
          const size = stats.size;
          files.total += size;

          if (entry.endsWith('.js')) {
            files.js.push({ name: entry, size });
          } else if (entry.endsWith('.css')) {
            files.css.push({ name: entry, size });
          } else if (entry.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
            files.images.push({ name: entry, size });
          }
        }
      });
    } catch (e) {
      log(`⚠️ 无法读取目录: ${dir}`, 'yellow');
    }
  }

  if (fs.existsSync(distPath)) {
    scanDirectory(distPath);
  } else {
    log('❌ dist目录不存在，请先运行 yarn build', 'red');
    return;
  }

  // 计算总大小
  const jsTotal = files.js.reduce((sum, f) => sum + f.size, 0);
  const cssTotal = files.css.reduce((sum, f) => sum + f.size, 0);
  const imagesTotal = files.images.reduce((sum, f) => sum + f.size, 0);

  // 检查JavaScript大小
  log('\n📦 JavaScript文件分析', 'blue');
  log('-'.repeat(50));
  const jsLimit = performanceBudget.js.maxSize * 1024;
  const jsWarning = performanceBudget.js.warning * 1024;

  files.js
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .forEach(f => {
      const sizeKB = f.size / 1024;
      let color = 'green';
      if (sizeKB > performanceBudget.js.warning) color = 'yellow';
      if (sizeKB > performanceBudget.js.maxSize) color = 'red';
      log(`  ${f.name}: ${sizeKB.toFixed(2)} KB`, color);
    });

  log(`\n总大小: ${formatBytes(jsTotal)} (${(jsTotal / 1024).toFixed(2)} KB)`);
  if (jsTotal > jsLimit) {
    log(`❌ 超过预算 (限制: ${performanceBudget.js.maxSize} KB)`, 'red');
  } else if (jsTotal > jsWarning) {
    log(`⚠️  接近预算限制 (警告: ${performanceBudget.js.warning} KB)`, 'yellow');
  } else {
    log(`✅ 在预算内`, 'green');
  }

  // 检查CSS大小
  log('\n🎨 CSS文件分析', 'blue');
  log('-'.repeat(50));
  const cssLimit = performanceBudget.css.maxSize * 1024;
  const cssWarning = performanceBudget.css.warning * 1024;

  files.css
    .sort((a, b) => b.size - a.size)
    .forEach(f => {
      const sizeKB = f.size / 1024;
      let color = 'green';
      if (sizeKB > performanceBudget.css.warning) color = 'yellow';
      if (sizeKB > performanceBudget.css.maxSize) color = 'red';
      log(`  ${f.name}: ${sizeKB.toFixed(2)} KB`, color);
    });

  log(`\n总大小: ${formatBytes(cssTotal)} (${(cssTotal / 1024).toFixed(2)} KB)`);
  if (cssTotal > cssLimit) {
    log(`❌ 超过预算 (限制: ${performanceBudget.css.maxSize} KB)`, 'red');
  } else if (cssTotal > cssWarning) {
    log(`⚠️  接近预算限制 (警告: ${performanceBudget.css.warning} KB)`, 'yellow');
  } else {
    log(`✅ 在预算内`, 'green');
  }

  // 检查图片大小
  log('\n🖼️  图片文件分析', 'blue');
  log('-'.repeat(50));

  files.images
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .forEach(f => {
      log(`  ${f.name}: ${formatBytes(f.size)}`);
    });

  log(`\n总大小: ${formatBytes(imagesTotal)}`);

  // 总体报告
  log('\n📈 总体分析', 'cyan');
  log('='.repeat(50), 'cyan');
  log(`JavaScript: ${formatBytes(jsTotal)}`);
  log(`CSS: ${formatBytes(cssTotal)}`);
  log(`Images: ${formatBytes(imagesTotal)}`);
  log(`总大小: ${formatBytes(files.total)}`);

  // 建议
  log('\n💡 优化建议', 'blue');
  log('-'.repeat(50));

  const recommendations = [];

  if (jsTotal > jsWarning) {
    recommendations.push(
      '• 考虑进一步的代码分割和懒加载'
    );
  }

  if (files.js.filter(f => f.size > 100 * 1024).length > 0) {
    recommendations.push(
      '• 某些JS文件超过100KB，可以考虑分割'
    );
  }

  if (files.images.length > 0) {
    recommendations.push(
      '• 使用WebP/AVIF格式替换PNG/JPG'
    );
    recommendations.push(
      '• 为图片实现延迟加载和响应式图片'
    );
  }

  if (recommendations.length === 0) {
    log('✅ 性能优化已达到目标！', 'green');
  } else {
    recommendations.forEach(rec => log(rec, 'yellow'));
  }

  log('\n' + '='.repeat(50) + '\n');
}

// 运行检查
analyzeBundle();

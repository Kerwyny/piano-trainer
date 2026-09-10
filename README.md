# 读谱反应训练 PWA

## 第一次发布
1. GitHub 新建 public repository，建议叫 `piano-trainer`
2. 上传本 ZIP 解压后的所有文件到 repository 根目录并 Commit
3. Repository → Settings → Pages
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `main`，Folder 选择 `/(root)`，Save
6. 用 GitHub Pages 给出的网址打开 App

## iPhone 安装
Safari 打开网址 → 分享 → 添加到主屏幕 → 作为网页 App 打开 → 添加。

## 以后更新
修改文件并 Commit 到 `main`。GitHub Pages 会重新发布。
在线时 App 会取得新版；没网时继续使用已缓存版本。

主要文件：
- index.html：页面
- styles.css：外观
- app.js：练习逻辑
- sw.js：离线缓存
- manifest.webmanifest：App 安装信息

# 飞书消息接收服务

基于 Express 的飞书事件回调服务，可接收和处理飞书消息。

## 功能

- 接收飞书消息事件
- 自动回复消息
- 支持自定义业务逻辑

## 环境变量

```bash
export FEISHU_APP_ID=你的AppID
export FEISHU_APP_SECRET=你的AppSecret
export FEISHU_VERIFICATION_TOKEN=你的VerificationToken
export FEISHU_ENCRYPT_KEY=你的EncryptKey（可选）
export PORT=3000
```

## 安装

```bash
npm install express axios
```

## 部署

### 1. NAS 部署

```bash
# 安装 Node.js（如果 NAS 没有）
# DSM (Synology) 可通过 Docker 安装

# 启动服务
node server.js
```

### 2. 配置 DDNS / 域名

确保你的 NAS 有公网访问：
- 配置 DDNS（如 no-ip、duckdns 等）
- 在路由器配置端口转发（3000 端口）
- 申请 HTTPS 证书（推荐使用 Nginx Proxy Manager）

### 3. 配置飞书回调

1. 打开飞书开放平台 → 你的应用 → 事件订阅
2. 配置回调 URL：`https://你的域名/webhook`
3. 填写 Verification Token
4. 订阅事件：
   - `im.message.message_received_v1` - 接收消息

## 使用

服务启动后，发送飞书消息给机器人即可触发处理逻辑。

## 目录结构

```
feishu-notify/
├── server.js          # 服务端代码
├── feishu-notify.js   # 发送消息模块
├── package.json       # 依赖
└── README.md
```
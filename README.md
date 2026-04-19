# 飞书通知集成 (Feishu Notify)

通过飞书 API 发送消息通知的 Node.js 集成模块。

## 功能

- 使用飞书 App Access Token 发送文本消息
- Token 自动缓存和刷新
- 支持 CLI 和代码调用两种方式

## 配置

### 1. 创建飞书应用

1. 打开 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 获取 `App ID` 和 `App Secret`

### 2. 添加权限

在应用的「权限管理」中添加以下权限：
- `im:message:send_as_bot` - 以机器人身份发送消息

### 3. 授权应用

1. 进入「版本管理与发布」
2. 创建新版本并提交审批
3. 使用管理员账号扫码授权

### 4. 获取接收者 ID

在飞书中获取接收消息用户的 `open_id`：
- 可通过飞书 API 获取用户列表

## 环境变量

```bash
export FEISHU_APP_ID=你的AppID
export FEISHU_APP_SECRET=你的AppSecret
export FEISHU_CHAT_ID=接收消息的open_id
```

## 安装

```bash
npm install
```

## 使用

### CLI 方式

```bash
node feishu-notify.js "你的消息内容"
```

### 代码调用

```js
const { notify } = require('./feishu-notify');

async function main() {
  await notify('构建完成！');
}

main().catch(console.error);
```

## 项目结构

```
feishu-notify/
├── feishu-notify.js   # 核心模块
├── package.json       # 依赖配置
└── README.md          # 说明文档
```

## 依赖

- axios ^1.6.0

## License

MIT
OpenCode 集成 Feishu
- 使用 feishu-notify 提供的发送能力，在 OpenCode 流水线触发通知。
- 方案：直接在流水线步骤中执行 opencode-feishu-action.js，或安装插件插件式接入。
- 路径：opencode-feishu-action.js（根目录）和 plugins/opencode-feishu/index.js（插件入口）

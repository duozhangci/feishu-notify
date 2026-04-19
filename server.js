const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json({ verify: (req, res, buf) => {
  req.rawBody = buf;
}});

const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;
const VERIFICATION_TOKEN = process.env.FEISHU_VERIFICATION_TOKEN;
const ENCRYPT_KEY = process.env.FEISHU_ENCRYPT_KEY;

let cachedToken = null;
let tokenExpireAt = 0;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpireAt) {
    return cachedToken;
  }

  const url = 'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal';
  const res = await axios.post(url, {
    app_id: APP_ID,
    app_secret: APP_SECRET
  }, {
    headers: { 'Content-Type': 'application/json' }
  });

  const data = res.data;
  if (data && data.code === 0) {
    const token = data.app_access_token;
    const expireSec = data.expire ?? 7200;
    cachedToken = token;
    tokenExpireAt = now + (expireSec * 1000 - 60);
    return cachedToken;
  } else {
    throw new Error(`Token 获取失败: ${data?.msg}`);
  }
}

// 验证 URL 接口（飞书首次配置回调时调用）
app.get('/webhook', (req, res) => {
  const { challenge, verification_token } = req.query;
  
  if (verification_token === VERIFICATION_TOKEN) {
    res.json({ challenge });
  } else {
    res.status(400).json({ error: 'verification token mismatch' });
  }
});

// 接收事件回调
app.post('/webhook', async (req, res) => {
  const { type, event } = req.body;

  console.log('收到飞书事件:', req.body);

  if (type === 'url_verification') {
    res.json({ challenge: req.body.challenge });
    return;
  }

  if (type === 'event_callback' && event) {
    const eventType = event.type;
    const senderId = event.sender?.sender_id?.open_id;
    const message = event.message?.message?.content;

    console.log(`事件类型: ${eventType}, 发送者: ${senderId}`);

    // 处理收到的消息
    if (eventType === 'message' && message && senderId) {
      try {
        // 解析消息内容
        let text = message;
        try {
          const content = JSON.parse(message);
          text = content.text || message;
        } catch (e) {
          text = message;
        }

        console.log(`收到消息: ${text}`);

        // 这里处理你的业务逻辑
        // 例如：自动回复、存储消息、处理命令等
        
        // 示例：回复收到消息
        // await replyMessage(senderId, '已收到你的消息: ' + text);
        
        // 示例：回复图片消息（需要图片资源）
        // const reply = await axios.post('https://open.feishu.cn/open-apis/message/v4/send/', {
        //   open_id: senderId,
        //   msg_type: 'text',
        //   content: { text: '你好，我是飞书机器人！' }
        // }, {
        //   headers: { 'Authorization': 'Bearer ' + await getAccessToken(), 'Content-Type': 'application/json' }
        // });

      } catch (err) {
        console.error('处理消息失败:', err.message);
      }
    }
  }

  res.json({ code: 0, msg: 'success' });
});

// 回复消息
async function replyMessage(openId, text) {
  const token = await getAccessToken();
  await axios.post('https://open.feishu.cn/open-apis/message/v4/send/', {
    open_id: openId,
    msg_type: 'text',
    content: { text }
  }, {
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`飞书 webhook 服务已启动，监听端口 ${PORT}`);
  console.log(`请在飞书开放平台配置回调 URL: https://你的域名/webhook`);
});
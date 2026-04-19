// feishu-notify.js
// 最小实现：通过 Feishu App Access Token 发送文本消息到指定 chat_id
// 依赖：npm install axios
const axios = require('axios');

// 从环境变量读取必要信息
const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;
const CHAT_ID = process.env.FEISHU_CHAT_ID;

if (!APP_ID || !APP_SECRET || !CHAT_ID) {
  console.error('请设置环境变量：FEISHU_APP_ID、FEISHU_APP_SECRET、FEISHU_CHAT_ID');
  process.exit(1);
}

let cachedToken = null;
let tokenExpireAt = 0;

// 获取 App Access Token（带缓存，避免频繁请求）
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
    // 兼容不同字段名，尽量覆盖常见格式
    const token = data.data?.app_access_token || data.data?.token || data.app_access_token;
    const expireSec = (data.data?.expire ?? data.data?.expire_in ?? 7200);
    cachedToken = token;
    tokenExpireAt = now + (Number(expireSec) * 1000);
    return cachedToken;
  } else {
    throw new Error(`Feishu token 获取失败: ${data?.msg ?? res.statusText}`);
  }
}

// 发送消息到指定目标
async function postMessage(token, text) {
  const url = 'https://open.feishu.cn/open-apis/message/v4/send/';
  const payload = {
    open_id: CHAT_ID,
    msg_type: 'text',
    content: { text: text }
  };
  const res = await axios.post(url, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = res.data;
  if (data && data.code === 0) {
    return data;
  } else {
    throw new Error(`Feishu 发送消息失败: ${data?.msg ?? res.statusText}`);
  }
}

// 对外暴露的通知函数
async function notify(text) {
  const token = await getAccessToken();
  return await postMessage(token, text);
}

// 直接作为脚本执行时的 CLI 支持
if (require.main === module) {
  const text = process.argv.slice(2).join(' ') || 'OpenCode: 通知';
  notify(text)
    .then(() => {
      console.log('Feishu 通知发送成功');
    })
    .catch(err => {
      console.error('Feishu 通知发送失败:', err.message);
      process.exit(1);
    });
}

module.exports = { notify };
// plugins/opencode-feishu/index.js
// OpenCode 插件入口：调用 feishu-notify 发送通知
const { notify } = require('../../feishu-notify');

module.exports = {
  name: 'feishu-notify',
  run: async (ctx) => {
    const text = (ctx && ctx.input && ctx.input.text) || process.env.OPEN_CODE_FEISHU_TEXT || 'OpenCode: 通知';
    await notify(text);
    return { ok: true };
  }
};

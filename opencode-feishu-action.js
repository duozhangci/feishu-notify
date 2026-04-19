// opencode-feishu-action.js
// OpenCode 任务入口：发送 Feishu 通知
const { notify } = require('./feishu-notify');
const text = process.env.OPEN_CODE_FEISHU_TEXT || 'OpenCode: 通知';
 (async () => {
   try {
     await notify(text);
     console.log('Feishu 通知发送成功');
   } catch (err) {
     console.error('Feishu 通知发送失败:', err.message);
     process.exit(1);
   }
})();

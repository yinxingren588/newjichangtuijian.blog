/**
 * Bing IndexNow 自动推送脚本
 * 官方协议规范：https://www.indexnow.org/
 * 运行命令: node scripts/submit-to-bing-indexnow.mjs
 */

const HOST = 'newjichangtuijian.blog';
const KEY = '9e8d7a6b5c4d3e2f1a0b9c8d7e6f5a4b';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URL_LIST = [
  `https://${HOST}/`,
  `https://${HOST}/ranking/`,
  `https://${HOST}/comparison/`,
  `https://${HOST}/isp-guide/`,
  `https://${HOST}/posts/`,
  `https://${HOST}/posts/2027-top-airport-recommendations/`,
  `https://${HOST}/posts/chatgpt-claude-airport-unlock-guide/`,
  `https://${HOST}/posts/best-clients-for-clash-singbox-2027/`,
  `https://${HOST}/posts/clash-verge-rev-tutorial/`,
  `https://${HOST}/posts/iepl-vs-transit-nodes-guide/`,
  `https://${HOST}/posts/low-cost-high-speed-airport/`,
  `https://${HOST}/about/`,
  `https://${HOST}/sitemap/`,
];

async function submitIndexNow() {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URL_LIST,
  };

  console.log(`正在向 Bing IndexNow 提交 ${URL_LIST.length} 个最新网址...`);
  try {
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 200 || res.status === 202) {
      console.log(`✅ 成功提交至 IndexNow (HTTP ${res.status})！Bing 将在极短时间内完成抓取索引。`);
    } else {
      console.warn(`⚠️ 提交返回状态码: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log('响应详情:', text);
    }
  } catch (err) {
    console.error('❌ 提交失败:', err.message);
  }
}

submitIndexNow();

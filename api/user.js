const TikTokScraper = require('../build/index.js');
const rp = require('request-promise');

module.exports = async (req, res) => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'Thiếu username!' });

    try {
        // 1. Lấy danh sách Free Proxy (HTTP)
        console.log('Đang tìm proxy...');
        const proxyListRaw = await rp({
            uri: 'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=3000&country=all&ssl=all&anonymity=all',
            json: false
        });

        // 2. Chọn bừa 1 cái
        const proxies = proxyListRaw.replace(/\r/g, '').split('\n').filter(p => p);
        if (proxies.length === 0) throw new Error("Không tìm thấy proxy nào sống!");
        
        const randomProxy = 'http://' + proxies[Math.floor(Math.random() * proxies.length)];
        console.log('Dùng Proxy:', randomProxy);

        // 3. Gọi TikTok với Proxy vừa kiếm được
        const options = {
            // Thêm proxy vào cấu hình
            proxy: randomProxy, 
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
            }
        };

        const user = await TikTokScraper.getUserProfileInfo(username, options);
        res.status(200).json({ ...user, used_proxy: randomProxy });

    } catch (error) {
        res.status(500).json({ 
            error: 'Lỗi rồi (Do proxy lởm hoặc TikTok chặn): ' + error.message,
            proxy_tip: 'Free proxy hay chết lắm, thử refresh vài lần xem sao!'
        });
    }
};

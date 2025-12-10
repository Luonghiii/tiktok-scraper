const TikTokScraper = require('../build/index.js');

module.exports = async (req, res) => {
    // 1. Lấy username và cookie từ đường link (nếu có)
    const { username, session } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Thiếu username rồi cậu ơi!' });
    }

    try {
        // 2. Cấu hình giả lập trình duyệt (Quan trọng!)
        const options = {
            // Giả làm máy tính Windows đang dùng Chrome
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
                "referer": "https://www.tiktok.com/",
            },
            // Nếu cậu truyền cookie vào thì dùng, không thì thôi
            sessionList: session ? [`sid_tt=${session}`] : []
        };

        const user = await TikTokScraper.getUserProfileInfo(username, options);
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ 
            error: 'Vẫn lỗi: ' + error.message,
            tip: 'Thử thêm &session=... vào link xem sao!'
        });
    }
};

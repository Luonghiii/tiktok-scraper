// Import thư viện từ file đã build trong repo
// Tớ trỏ vào '../build/index.js' vì trong package.json, main file nằm ở đó
const TikTokScraper = require('../build/index.js');

module.exports = async (req, res) => {
    // Lấy tên user từ đường dẫn (ví dụ: ?username=tiktok)
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Cần nhập tên username!' });
    }

    try {
        // Gọi hàm lấy thông tin profile (không cần login cho info cơ bản)
        const user = await TikTokScraper.getUserProfileInfo(username, {});
        
        // Trả về kết quả dạng JSON đẹp đẽ
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi rồi: ' + error.message });
    }
};

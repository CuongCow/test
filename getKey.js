import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { fullname, age, facebook, city, district, ward, purpose, otherPurposeText } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!fullname || !age || !facebook || !city || !district || !ward || (purpose === 'other' && !otherPurposeText)) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    // Đọc file keys.json
    const filePath = path.join(process.cwd(), '/keys.json');
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const keys = JSON.parse(data);
      const key = keys[Math.floor(Math.random() * keys.length)]; // Chọn ngẫu nhiên một key từ file

      // Ghi lại thông tin người dùng vào file logs.json
      const logsPath = path.join(process.cwd(), '/logs.json');
      const logs = fs.existsSync(logsPath) ? JSON.parse(fs.readFileSync(logsPath, 'utf-8')) : [];
      const logEntry = {
        fullname,
        age,
        facebook,
        city,
        district,
        ward,
        purpose,
        otherPurposeText,
        timestamp: new Date().toISOString(),
      };
      logs.push(logEntry);
      fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));

      res.status(200).json({ key }); // Trả về key
    } catch (error) {
      console.error('Error reading or writing files:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

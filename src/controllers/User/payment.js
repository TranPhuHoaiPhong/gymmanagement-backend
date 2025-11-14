const Package = require('../../models/Package/package');
const { createPaymentUrl } = require('./paymenturl');

exports.paymentPackage = async (req, res) => {
  try {
    const { packageId, userId, trainerId } = req.body;
    const packageData = await Package.findById(packageId);
    if (!packageData) return res.json({ status: 'ERROR', message: 'Gói không tồn tại' });

    // Tạo orderInfo chứa dữ liệu cần thiết (như JSON string hoặc query-style)
    const orderInfo = [
      `desc=Thanh toán gói ${packageData.name}`,
      `userId=${userId}`,
      `packageId=${packageId}`,
      `trainerId=${trainerId || ''}`
    ].join('&');

    // TRẢ VỀ returnUrl KHÔNG CÓ query params
    const returnUrl = 'https://abcd1234.ngrok.io/membership/result'; // chỉ path, không kèm ?...

    // lấy ip client nếu muốn (express)
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

    const paymentUrl = createPaymentUrl({
      amount: packageData.price,
      orderInfo,
      returnUrl,
      ip,
    });

    console.log('Payment URL:', paymentUrl);
    res.json({ status: 'OK', paymentUrl });
  } catch (err) {
    console.error(err);
    res.json({ status: 'ERROR', message: 'Lỗi server' });
  }
};

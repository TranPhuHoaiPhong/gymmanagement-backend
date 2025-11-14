const crypto = require('crypto');
const qs = require('qs');

function sortObject(obj) {
  const sorted = {};
  Object.keys(obj).sort().forEach(key => {
    sorted[key] = obj[key];
  });
  return sorted;
}

function createPaymentUrl({ amount, orderInfo, returnUrl, ip = '127.0.0.1' }) {
  const vnp_TmnCode = '9CYGM545';
  const vnp_HashSecret = '6ML9MMC4QVZWG9A6FMU5QP6DU6JO7BQY';
  const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

  const date = new Date();
  const pad = (n) => n.toString().padStart(2, '0');

  const createDate = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode,
    vnp_Amount: amount * 100,
    vnp_CurrCode: 'VND',
    vnp_TxnRef: Date.now(),
    vnp_OrderInfo: orderInfo,       // ❗ chỉ text đơn giản, không chứa &
    vnp_OrderType: 'other',
    vnp_Locale: 'vn',
    vnp_ReturnUrl: returnUrl,       // ❗ không encode ở đây
    vnp_IpAddr: '127.0.0.1',        // ❗ CHỈ IPv4
    vnp_CreateDate: createDate,
  };

  vnp_Params = sortObject(vnp_Params);

  // Không encode khi ký
  const signData = qs.stringify(vnp_Params, { encode: false });

  const vnp_SecureHash = crypto
    .createHmac('sha512', vnp_HashSecret)
    .update(signData)
    .digest('hex');

  vnp_Params.vnp_SecureHash = vnp_SecureHash;

  // Encode khi tạo URL
  return vnp_Url + '?' + qs.stringify(vnp_Params, { encode: true });
}

module.exports = { createPaymentUrl };

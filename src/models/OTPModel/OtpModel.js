const otpStore = {};
const RATE_LIMIT = {
  windowMs: 60 * 60 * 1000, // 1 giờ
  maxSend: 10,                // tối đa 5 OTP / giờ
};
const OTP_EXPIRE = 5 * 60 * 1000; // 5 phút
const SEND_INTERVAL = 60 * 1000; // 2 phút giữa các lần gửi

export const saveOtp = (email, otp) => {
  const now = Date.now();
  if (!otpStore[email]) {
    otpStore[email] = {
      code: otp,
      expiresAt: now + OTP_EXPIRE,
      sendHistory: [now]
    };
  } else {
    otpStore[email].code = otp;
    otpStore[email].expiresAt = now + OTP_EXPIRE;
    otpStore[email].sendHistory.push(now);
  }
};

export const verifyOtp = (email, otp) => {
  const record = otpStore[email];
  if (!record) return false;

  // OTP hết hạn
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return false;
  }

  if (record.code === otp) {
    delete otpStore[email]; // xóa OTP sau khi xác thực thành công
    return true;
  }
  return false;
};

export const canSendOtp = (email) => {
  const now = Date.now();
  const record = otpStore[email];

  if (!record) return true;

  // Kiểm tra interval 2 phút giữa các lần gửi
  const lastSend = record.sendHistory[record.sendHistory.length - 1];
  if (now - lastSend < SEND_INTERVAL) return false;

  // Kiểm tra rate limit 5 OTP / 1 giờ
  const recentSends = record.sendHistory.filter(t => now - t < RATE_LIMIT.windowMs);
  if (recentSends.length >= RATE_LIMIT.maxSend) return false;

  return true;
};

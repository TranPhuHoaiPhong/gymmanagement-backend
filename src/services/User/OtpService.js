import { sendMail } from '../utils/mailer.js';
import { saveOtp, verifyOtp, canSendOtp } from '../../models/OTPModel/OtpModel.js';
import bcrypt from 'bcryptjs';
import User from '../../models/User/User.js';

export class OtpService {
    static async sendOtp(data) {
        try {
            if( !data) {
                return {
                    success: false,
                    message: "Dữ liệu không hợp lệ",
                };
            }

            const { email } = data;

            if (!email ) {
                return {
                    success: false,
                    message: "Vui lòng điền đầy đủ thông tin",
                };
            }
            if (!canSendOtp(email)) {
            return {
                success: false,
                message: "Vượt quá giới hạn gửi OTP. Vui lòng thử lại sau.",
            };
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            await sendMail(
            email,
            'Mã xác thực OTP',
            `<p>Mã OTP của bạn là: <b>${otp}</b></p><p>Không chia sẻ mã này với người khác!</p>`
            );

            saveOtp(email, otp);
            return {
                success: true,
                message: "Gửi mã thành công",
                data: otp
                };
        } catch (error) {
           return {
            success: false,
            message: "Gửi mã thất bại: " + err.message,
            }; 
        }
    }

    static async verifyOtp(userId, data) {
        try {
            if( !data) {
                return {
                    success: false,
                    message: "Dữ liệu không hợp lệ",
                };
            }

            const { email, otp, password } = data;

            if (!email || !otp ) {
                return {
                    success: false,
                    message: "Vui lòng điền đầy đủ thông tin",
                };
            }
            if (verifyOtp(email, otp)) {
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(password, salt);

                const updateUser = await User.findByIdAndUpdate(
                    userId,
                    { passwordHash: passwordHash },
                    { new: true }
                );

                if (!updateUser) {
                    return {
                        success: false,
                        message: "Không tìm thấy tài khoản",
                    };
                }

                return {
                    success: true,
                    message: "Đổi mật khẩu thành công",
                }
            } else {
                return {
                    success: false,
                    message: "Mã OTP không đúng hoặc đã hết hạn",
                }
            }   
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: error.message });
        }
    }
}
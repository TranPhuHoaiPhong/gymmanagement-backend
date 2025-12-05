const {OtpService} = require('../../services/User/OtpService');

class OtpController {
  static async sendOtp(req, res) {
    try {
      const result = await OtpService.sendOtp(req.body);

      if (!result.success) {
        return res.status(400).json({ msg: result.message });
      }

      return res.status(200).json({ msg: result.message });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  static async verifyOtp(req, res) {
    try {
      const userId = req.userId;  
      const isValid = await OtpService.verifyOtp(userId, req.body);

      if (!isValid.success) {
        return res.status(400).json({ msg: isValid.message });
      }

      return res.status(200).json({ msg: isValid.message });

    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
    
  }
}

module.exports = OtpController;
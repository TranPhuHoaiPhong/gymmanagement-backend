const MembershipAdminService = require("../../services/Admin/MembershipAdminService");

const createMembership = async (req, res) => {
  try {
    const { userId, packageId, startDate, trainerId, autoRenew, status } =
      req.body;

    if (!userId || !packageId || !startDate) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu thông tin cần thiết",
      });
    }

    const resCreate = await MembershipAdminService.createMembership({
      userId,
      packageId,
      startDate,
      trainerId,
      autoRenew,
      status,
    });

    return res.status(200).json(resCreate);
  } catch (error) {
    console.error("Lỗi tạo membership:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const updateMembership = async (req, res) => {
  try {
    const membershipId = req.params.id;
    const data = req.body;

    if (!membershipId) {
      return res.status(400).json({
        status: "ERROR",
        message: "membershipId khong hop le",
      });
    }

    const resUpdate = await MembershipAdminService.updateMembership(
      membershipId,
      data
    );
    return res.status(200).json(resUpdate);
  } catch (error) {
    console.error("Lỗi sửa membership:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const deleteMembership = async (req, res) => {
  try {
    const membershipId = req.params.id;

    if (!membershipId) {
      return res.status(400).json({
        status: "ERROR",
        message: "membershipId khong hop le",
      });
    }

    const resDelete = await MembershipAdminService.deleteMembership(
      membershipId
    );
    return res.status(200).json(resDelete);
  } catch (error) {
    console.error("Lỗi xóa membership:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const getAllMembership = async (req, res) => {
  try {
    const resGetAll = await MembershipAdminService.getAllMembership();
    return res.status(200).json(resGetAll);
  } catch (error) {
    console.error("Lỗi lấy tất cả membership:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const getDetailsMembership = async (req, res) => {
  try {
    const membershipId = req.params.id;

    if (!membershipId) {
      return res.status(400).json({
        status: "ERROR",
        message: "membershipId khong hop le",
      });
    }

    const resGetDetails = await MembershipAdminService.getDetailsMembership(
      membershipId
    );
    return res.status(200).json(resGetDetails);
  } catch (error) {
    console.error("Lỗi lấy membership:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const paymentMembership = async (req, res) => {
  try {
    const { userId, packageId } =
      req.body;

    if (!userId || !packageId) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu thông tin cần thiết",
      });
    }

    const resCreate = await MembershipAdminService.paymentMembership(
      req.body
    );

    console.log("Response from paymentMembership:", resCreate);

    return res.status(200).json(resCreate);
  } catch (error) {
    console.error("Lỗi tạo membership:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

module.exports = {
  createMembership,
  updateMembership,
  deleteMembership,
  getAllMembership,
  getDetailsMembership,
  paymentMembership,
};

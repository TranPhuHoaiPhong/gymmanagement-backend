nếu bạn thiết kế gói tập (package) là “1 tháng”, thì người dùng có thể tham gia tất cả các buổi tập (workout) trong khoảng thời gian còn hiệu lực của gói đó, trừ khi bạn giới hạn riêng trong logic hệ thống.

Cần giới hạn số lượng mỗi buổi tập


🟢 CREATE (POST /api/transactions)
Ai	Được phép	Logic
Admin	✅	Có thể tạo giao dịch thay mặt member (ví dụ nhập dữ liệu offline).
Staff	❌	Không tạo giao dịch mới, chỉ xác nhận.
Member	✅	Khi mua gói tập, tạo giao dịch → status = "pending".
Trainer	❌	Không có quyền.



A. Mua gói (Purchase Flow)

User chọn Package trên frontend.

Tạo Transaction (status: pending).

Sau thanh toán thành công: trong 1 transaction (DB transaction):

Tạo Membership với startDate = now, endDate = now + package.durationInDays.

Nếu package.type === 'personal_trainer' → set remainingSessions = package.sessionsWithTrainer.

Update Package.registeredCount bằng $inc: { registeredCount: 1 }.

Cập nhật Transaction.status = 'completed' và gán membershipId.

Gợi ý: dùng mongoose session/transaction để đảm bảo atomic (tạo membership + cập nhật package + cập nhật transaction cùng lúc).

B. Check-in tại phòng gym

Khi member check-in thành công:

Tạo CheckInLog (gắn membershipId).

Push checkInDates vào Membership (ví dụ: { date: now, sessionId: null }).

Nếu check-in kèm tham gia TrainerSession hoặc lớp Workout, có thể giảm remainingSessions (nếu là PT session) chỉ khi buổi PT xác nhận hoàn thành.

Lưu ý concurrency: cập nhật remainingSessions nên dùng $inc: { remainingSessions: -1 } kèm kiểm tra remainingSessions > 0 trong một atomic update.

C. Hoàn thành 1 buổi PT (TrainerSession hoàn tất)

Khi trainer xác nhận user đã hoàn thành buổi:

Tạo/update TrainerSession record.

Giảm Membership.remainingSessions bằng $inc: { remainingSessions: -1 }.

D. Hết hạn / Gia hạn

Hết hạn: job chạy hàng ngày (cron) kiểm tra endDate < now và set status: "expired". Nếu autoRenew true → tự tạo Transaction gia hạn (hoặc đặt pending) và khi thanh toán thành công, extend endDate.

Thông báo trước: gửi notification (email/push) khi endDate - now < X ngày.

E. Hủy gói / Refund

Nếu admin/hệ thống hủy: set status = "cancelled", có thể tính pro-rata refund tuỳ chính sách — nếu trả tiền hoàn lại, cập nhật Transaction tương ứng.




/api/admin/....
/api/customer/...
/api/staff/...




<!-- ======== app -->
- Đổi mật khẩu: gmail => gửi mã => xác thực 
- Đăng nhập : kiểm tra khóa tài khoản /
- Token vào đăng nhập 

notification: 
- trước ngày tập
- admin thông báo 
- thông báo thanh toán/gia hạn

mua gối => membermodel, khi quét mã qr sẽ tính checkin


trainersession => khách đặt lịch vs pt, liên quan đến workout

trainersession và membership => lấy ra ngày completed and missed
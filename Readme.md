nếu bạn thiết kế gói tập (package) là “1 tháng”, thì người dùng có thể tham gia tất cả các buổi tập (workout) trong khoảng thời gian còn hiệu lực của gói đó, trừ khi bạn giới hạn riêng trong logic hệ thống.

Cần giới hạn số lượng mỗi buổi tập


FLow tạo tài khoản và đăng kí:

Admin khởi tạo ban đầu trong DB (ví dụ: tài khoản admin mặc định).

Admin đăng nhập → có quyền:

Tạo/sửa/xóa staff và trainer

Xem danh sách member

Staff đăng nhập → có quyền:

Thêm member mới khi người dùng đăng ký tại quầy

Duyệt hoặc quản lý gói tập, điểm danh

Member đăng ký qua API /api/auth/register

Chỉ tạo role "member"

Sau đó có thể chọn gói tập, đặt lịch, v.v.

| Ai                    | Được tạo bởi                   | Có thể tự đăng ký? | Ghi chú                                     |
| --------------------- | ------------------------------ | ------------------ | ------------------------------------------- |
| **Admin**             | Được khởi tạo thủ công ban đầu | ❌                  | Có toàn quyền                               |
| **Staff**             | Do Admin tạo                   | ❌                  | Quản lý phòng tập, hội viên                 |
| **Trainer**           | Do Admin hoặc Staff tạo        | ❌                  | Có thể đăng nhập sau khi được cấp tài khoản |
| **Member (hội viên)** | Tự đăng ký                     | ✅                  | Có thể đăng ký qua app/web                  |

Khi xóa tài khoản staff thì tài khoản sẽ từ "isActive": true thành false và không để đăng nhập vào hệ thống nữa các chức năng không thể dùng

















/api/admin/....
/api/customer/...
/api/staff/...




<!-- ======== app -->
- Đổi mật khẩu: gmail => gửi mã => xác thực 
- Đăng nhập : kiểm tra khóa tài khoản /
- Token vào đăng nhập 

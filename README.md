#  Hệ Thống Thi Trắc Nghiệm Trực Tuyến

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)



---

##  Nhóm Thực Hiện: Nhóm 15

| STT | Họ và Tên | Mã Sinh Viên | Lớp |
| :--- | :--- | :--- | :--- |
| 1 | [Phạm Quốc Tiến] | [DH52201559] | [D22_TH01] 
| 2 | [Nguyễn Minh Trí] | [DH52201631]  | [D22_TH02] 
| 3 | [Trần Minh Trí] | [DH52201639] | [D22_TH02] 
| 4 | [Đỗ Đồng Anh Tuấn] | [DH52201703] | [D22_TH02] 
| 5 | [Trần Thị Ngọc Trâm] | [DH52201601] | [D22_TH03] 
| 6 | [Trần Tuấn Phát] | [DH52201201] | [D22_TH03] 

---

## Tính Năng Nổi Bật

* **Kiến trúc API RESTful:** Giao tiếp mượt mà giữa Frontend (React) và Backend (Laravel).
* **Hiệu suất cao (Concurrency):** Hệ thống được thiết kế và kiểm thử để đáp ứng **300 sinh viên truy cập và thi cùng lúc**.
* **Sử dụng thuần Bootstrap 5.
* **Quản lý kỳ thi:** Admin có thể tạo đề thi, tạo câu hỏi và thời gian thi.
* **Bảo mật:** Sử dụng Laravel Sanctum để xác thực người dùng qua API Token.

---

## Yêu Cầu Cài Đặt

Để chạy dự án này trên máy tính cá nhân, bạn cần cài đặt sẵn:
* [PHP](https://windows.php.net/download/) (Phiên bản >= 8.2)
* [Composer](https://getcomposer.org/)
* [Node.js](https://nodejs.org/) (Phiên bản >= 18.x) & npm
* [MySQL](https://www.mysql.com/) (Thông qua XAMPP, Laragon, v.v.)
* Git

---

##  Hướng Dẫn Cài Đặt 

Dự án được chia thành 2 thư mục độc lập: `backend` và `frontend`. Cần mở 2 terminal riêng biệt để chạy song song.

### 1. Cài đặt Backend (Laravel)

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt các thư viện PHP
composer install

# Copy file cấu hình môi trường
cp .env.example .env

# Tạo application key
php artisan key:generate

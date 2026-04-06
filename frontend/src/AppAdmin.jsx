import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import DangNhapAdmin from "./admin/DangNhapAdmin";
import QuanLyBaiThi from "./admin/QuanLyBaiThi";
import KetQuaAdmin from "./admin/KetQuaAdmin";
import SinhVien from "./admin/SinhVien";
import ThongTinAdmin from "./admin/ThongTinAdmin";
import ThemBaiThi from "./admin/ThemBaiThi";
import ThemThiSinh from "./admin/ThemThiSinh";
import QuanLyCauHoi from "./admin/QuanLyCauHoi";

// Middleware để bảo vệ các tuyến đường Admin
const AdminProtectedRoute = () => {
  const adminToken = localStorage.getItem("adminToken");
  const adminUserStr = localStorage.getItem("adminUser");
  let isAdmin = false;

  try {
    if (adminToken && adminUserStr) {
      const adminUser = JSON.parse(adminUserStr);
      if (adminUser && adminUser.role === "admin") {
        isAdmin = true;
      }
    }
  } catch (e) {
    console.error("Lỗi khi kiểm tra dữ liệu Admin:", e);
    isAdmin = false;
  }

  // Nếu là admin thì cho phép truy cập (Outlet render các component con)
  // Nếu không thì điều hướng về trang đăng nhập
  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

function AppAdmin() {
  return (
    <Routes>

      {/* Route công khai: Login */}
      <Route path="/login" element={<DangNhapAdmin />} />

      {/* Các route được bảo vệ bởi AdminProtectedRoute */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/baithi" element={<QuanLyBaiThi />} />
        <Route path="/ketqua" element={<KetQuaAdmin />} />
        <Route path="/sinhvien" element={<SinhVien />} />
        <Route path="/thongtin" element={<ThongTinAdmin />} />
        <Route path="/thembaithi" element={<ThemBaiThi />} />
        <Route path="/themthisinh" element={<ThemThiSinh />} />
        <Route path="/cauhoi/:exam_id" element={<QuanLyCauHoi />} />
      </Route>

      {/* mặc định */}
      <Route path="/" element={<Navigate to="/admin/login" />} />

    </Routes>
  );
}

export default AppAdmin;
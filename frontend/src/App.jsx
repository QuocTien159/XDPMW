import { Routes, Route } from "react-router-dom";

import Index from "./trang/Index";
import TrangChu from "./trang/TrangChu";

import KetQua from "./trang/KetQua";
import TaiKhoan from "./trang/TaiKhoan";
import DangNhap from "./trang/DangNhap";
import LamBai from "./trang/LamBai";
import NopBai from "./trang/NopBai";

import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";

function App() {
  return (
    <Routes>

      {/* Landing Page */}
      <Route path="/" element={<Index />} />

      {/* Login */}
      <Route path="/dangnhap" element={<DangNhap />} />

      {/* Trang chính sau khi login */}
      <Route path="/trangchu" element={<TrangChu />} />

      {/* Thi */}
    
      <Route path="/lambai/:exam_id" element={<LamBai />} />
      <Route path="/nopbai" element={<NopBai />} />
      <Route path="/ketqua" element={<KetQua />} />

      {/* Tài khoản */}
      <Route path="/taikhoan" element={<TaiKhoan />} />

      {/* Test API */}
      <Route path="/users" element={<UserList />} />
      <Route path="/users/:id" element={<UserDetail />} />

    </Routes>
  );
}

export default App;
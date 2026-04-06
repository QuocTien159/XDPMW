import NavbarAdmin from "../layout/NavbarAdmin";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function ThongTinAdmin() {
  const navigate = useNavigate();

  const [adminUser, setAdminUser] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // { type: "success"|"error", text }

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) {
      const u = JSON.parse(stored);
      setAdminUser(u);
      setForm(prev => ({
        ...prev,
        first_name: u.first_name || "",
        last_name: u.last_name || "",
        email: u.email || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setMsg(null);
    if (!form.first_name || !form.last_name || !form.email) {
      return setMsg({ type: "error", text: "Vui lòng điền đầy đủ Họ, Tên và Email!" });
    }
    if (form.new_password && form.new_password !== form.confirm_password) {
      return setMsg({ type: "error", text: "Mật khẩu xác nhận không khớp!" });
    }
    if (form.new_password && form.new_password.length < 6) {
      return setMsg({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự!" });
    }

    setLoading(true);
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
      };
      if (form.new_password) payload.new_password = form.new_password;

      const res = await fetch(`${API}/users/${adminUser.uid}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        // Cập nhật localStorage
        const updated = { ...adminUser, ...data.data };
        localStorage.setItem("adminUser", JSON.stringify(updated));
        setAdminUser(updated);
        setForm(prev => ({ ...prev, new_password: "", confirm_password: "" }));
        setMsg({ type: "success", text: "Cập nhật thông tin thành công!" });
      } else {
        const errors = data.errors
          ? Object.values(data.errors).flat().join("\n")
          : (data.message || "Có lỗi xảy ra!");
        setMsg({ type: "error", text: errors });
      }
    } catch (e) {
      setMsg({ type: "error", text: "Lỗi kết nối máy chủ!" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <div>
      <NavbarAdmin />
      <div style={container}>
        <div style={box}>
          {/* Avatar + tiêu đề */}
          <div style={avatarWrap}>
            <div style={avatar}>
              {adminUser ? adminUser.last_name?.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>
                {adminUser ? `${adminUser.last_name} ${adminUser.first_name}` : "Admin"}
              </h3>
              <span style={roleBadge}>Quản trị viên</span>
            </div>
          </div>

          <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #ccc" }} />

          <h4 style={{ marginBottom: "16px", color: "#2e3f63" }}>Thông tin cá nhân</h4>

          {/* Thông báo */}
          {msg && (
            <div style={{
              padding: "10px 16px", borderRadius: "10px", marginBottom: "16px",
              background: msg.type === "success" ? "#d4f5e0" : "#fde8e8",
              color: msg.type === "success" ? "#1a7a35" : "#c0392b",
              fontWeight: "500"
            }}>
              {msg.type === "success" ? "✅ " : "❌ "}{msg.text}
            </div>
          )}

          {/* Họ */}
          <label style={lbl}>Họ *</label>
          <input name="last_name" value={form.last_name} onChange={handleChange} style={input} placeholder="Nhập họ" />

          {/* Tên */}
          <label style={lbl}>Tên *</label>
          <input name="first_name" value={form.first_name} onChange={handleChange} style={input} placeholder="Nhập tên" />

          {/* MSSV/Tài khoản - chỉ đọc */}
          <label style={lbl}>Tài khoản (MSSV)</label>
          <input value={adminUser?.studentid || ""} readOnly style={{ ...input, background: "#e9ecef", color: "#666" }} />

          {/* Email */}
          <label style={lbl}>Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} style={input} placeholder="Email" />

          <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #ccc" }} />
          <h4 style={{ marginBottom: "16px", color: "#2e3f63" }}>Đổi mật khẩu</h4>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "12px" }}>Để trống nếu không muốn thay đổi mật khẩu</p>

          {/* Mật khẩu mới */}
          <label style={lbl}>Mật khẩu mới</label>
          <input type="password" name="new_password" value={form.new_password} onChange={handleChange} style={input} placeholder="Tối thiểu 6 ký tự" />

          {/* Xác nhận mật khẩu */}
          <label style={lbl}>Xác nhận mật khẩu</label>
          <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} style={input} placeholder="Nhập lại mật khẩu mới" />

          {/* Buttons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button onClick={handleSave} disabled={loading} style={saveBtn}>
              {loading ? "Đang lưu..." : "💾 Lưu thay đổi"}
            </button>
            <button onClick={handleLogout} style={logoutBtn}>
              🚪 Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const container = {
  background: "#2e3f63",
  minHeight: "100vh",
  padding: "32px",
  display: "flex",
  justifyContent: "center",
};

const box = {
  background: "#f0f2f5",
  borderRadius: "20px",
  padding: "32px",
  width: "520px",
  height: "fit-content",
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
};

const avatarWrap = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "4px",
};

const avatar = {
  width: "64px", height: "64px", borderRadius: "50%",
  background: "#2e3f63", color: "white",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: "28px", fontWeight: "bold", flexShrink: 0,
};

const roleBadge = {
  display: "inline-block", marginTop: "4px",
  background: "#3b6fb6", color: "white",
  padding: "2px 10px", borderRadius: "12px", fontSize: "12px",
};

const lbl = {
  display: "block", fontWeight: "600", fontSize: "14px",
  color: "#444", marginBottom: "5px", marginTop: "14px",
};

const input = {
  width: "100%", padding: "10px 14px",
  borderRadius: "10px", border: "1px solid #ccc",
  fontSize: "15px", boxSizing: "border-box",
  background: "white",
};

const saveBtn = {
  flex: 1, padding: "12px", background: "#3b6fb6",
  color: "white", border: "none", borderRadius: "12px",
  cursor: "pointer", fontWeight: "bold", fontSize: "15px",
};

const logoutBtn = {
  padding: "12px 20px", background: "#e74c3c",
  color: "white", border: "none", borderRadius: "12px",
  cursor: "pointer", fontWeight: "bold", fontSize: "15px",
};

export default ThongTinAdmin;
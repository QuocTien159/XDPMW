import { useNavigate } from "react-router-dom";
import { useState } from "react";

function DangNhapAdmin() {
  const navigate = useNavigate();
  const [mssv, setMssv] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  const login = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ mssv, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        if (data.data.role === "admin") {
          localStorage.setItem("adminUser", JSON.stringify(data.data));
          localStorage.setItem("adminToken", data.token);
          navigate("/admin/baithi");
        } else {
          setError("Tài khoản của bạn không có quyền đăng nhập trang Admin!");
        }
      } else {
        setError(data.message || "Tài khoản hoặc mật khẩu không chính xác!");
      }
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "#2e3f63",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>

      <div style={{
        width: "400px",
        background: "#4a74a5",
        padding: "30px",
        borderRadius: "20px",
        color: "white"
      }}>
        <h3 style={{ textAlign: "center" }}>Admin Login</h3>

        {error && (
          <div style={{ background: "#ff4d4f", color: "white", padding: "10px", borderRadius: "5px", marginBottom: "15px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <input
          placeholder="Tài khoản"
          style={input}
          value={mssv}
          onChange={(e) => setMssv(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          style={input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          style={btn}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>

      </div>

    </div>
  )
}

const input = {
  width: "100%",
  padding: "10px",
  marginTop: "15px",
  borderRadius: "15px",
  border: "none",
  boxSizing: "border-box",
  color: "black"
}

const btn = {
  width: "100%",
  marginTop: "20px",
  padding: "10px",
  borderRadius: "15px",
  border: "none",
  background: "#1f2f50",
  color: "white",
  cursor: "pointer"
}

export default DangNhapAdmin;
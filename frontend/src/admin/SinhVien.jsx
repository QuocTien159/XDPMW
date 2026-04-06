import NavbarAdmin from "../layout/NavbarAdmin";
import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function SinhVien() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    studentid: "", first_name: "", last_name: "", email: "", password: "",
    facultyid: "", classid: ""
  });
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users`);
      const data = await res.json();
      if (data.status === "success") {
        // Chỉ hiện sinh viên, không hiện admin
        setList(data.data.filter(u => u.role !== "admin"));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = list.filter(item =>
    item.studentid?.toLowerCase().includes(search.toLowerCase()) ||
    `${item.last_name} ${item.first_name}`.toLowerCase().includes(search.toLowerCase()) ||
    item.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getSelected = () => list.find(u => u.uid === selected);

  // Thêm sinh viên
  const handleAdd = async () => {
    if (!form.studentid || !form.first_name || !form.last_name || !form.email || !form.password) {
      return alert("Vui lòng điền đủ thông tin!");
    }
    setFormLoading(true);
    try {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        alert("Thêm sinh viên thành công!");
        setShowForm(false);
        setForm({ studentid: "", first_name: "", last_name: "", email: "", password: "", facultyid: "", classid: "" });
        fetchUsers();
      } else {
        const errors = data.errors ? Object.values(data.errors).flat().join("\n") : (data.message || "Có lỗi xảy ra!");
        alert(errors);
      }
    } catch (e) {
      alert("Lỗi kết nối máy chủ");
    } finally {
      setFormLoading(false);
    }
  };

  // Chặn / Bỏ chặn
  const handleBlock = async () => {
    const item = getSelected();
    if (!item) return alert("Vui lòng chọn một sinh viên!");
    const isBlocked = item.status === "blocked";
    const msg = isBlocked
      ? `Bỏ chặn sinh viên "${item.last_name} ${item.first_name}"?`
      : `CẢNH BÁO: Chặn sinh viên "${item.last_name} ${item.first_name}"? Họ sẽ không thể đăng nhập!`;
    if (!window.confirm(msg)) return;

    try {
      const res = await fetch(`${API}/users/${item.uid}/block`, { method: "PUT" });
      const data = await res.json();
      if (data.status === "success") {
        setList(list.map(u => u.uid === item.uid ? { ...u, status: data.new_status } : u));
        alert(data.message);
      } else {
        alert(data.message || "Có lỗi xảy ra!");
      }
    } catch (e) {
      alert("Lỗi kết nối");
    }
  };

  // Xóa
  const handleDelete = async () => {
    const item = getSelected();
    if (!item) return alert("Vui lòng chọn một sinh viên!");
    if (!window.confirm(`CẢNH BÁO: Xóa vĩnh viễn sinh viên "${item.last_name} ${item.first_name}" (${item.studentid})?\nHành động này không thể hoàn tác!`)) return;

    try {
      const res = await fetch(`${API}/users/${item.uid}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        alert("Đã xóa sinh viên!");
        setList(list.filter(u => u.uid !== item.uid));
        setSelected(null);
      } else {
        alert(data.message || "Có lỗi xảy ra!");
      }
    } catch (e) {
      alert("Lỗi kết nối");
    }
  };

  const selectedItem = getSelected();
  const isBlocked = selectedItem?.status === "blocked";

  return (
    <div>
      <NavbarAdmin />
      <div style={container}>
        <div style={box}>
          {/* TOP BAR */}
          <div style={topBar}>
            <input
              placeholder=" Tìm theo MSSV, tên hoặc email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={searchInput}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowForm(true)} style={addBtn}>+ Thêm</button>
              <button
                onClick={handleBlock}
                style={{ ...blockBtn, background: isBlocked ? "#27ae60" : "#e67e22" }}
              >
                {isBlocked ? " Bỏ chặn" : " Chặn"}
              </button>
              <button onClick={handleDelete} style={delBtn}> Xóa</button>
            </div>
          </div>

          <h3 style={{ marginBottom: "8px" }}>Danh sách sinh viên
            <span style={{ fontSize: "14px", fontWeight: "normal", color: "#666", marginLeft: "10px" }}>
              ({filtered.length} sinh viên)
            </span>
          </h3>

          {loading ? <p>Đang tải...</p> : (
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead>
                  <tr style={{ background: "#2e3f63", color: "white" }}>
                    <th style={th}></th>
                    <th style={th}>STT</th>
                    <th style={th}>MSSV</th>
                    <th style={th}>Họ tên</th>
                    <th style={th}>Email</th>
                    <th style={th}>Khoa</th>
                    <th style={th}>Lớp</th>
                    <th style={th}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="8" style={{ textAlign: "center", padding: "24px", color: "#999" }}>Không tìm thấy sinh viên nào.</td></tr>
                  ) : filtered.map((item, i) => (
                    <tr
                      key={item.uid}
                      onClick={() => setSelected(item.uid)}
                      style={{
                        background: selected === item.uid ? "#c9dff7" : (i % 2 === 0 ? "white" : "#f9f9f9"),
                        cursor: "pointer",
                        opacity: item.status === "blocked" ? 0.65 : 1
                      }}
                    >
                      <td style={td}><input type="radio" checked={selected === item.uid} readOnly /></td>
                      <td style={td}>{i + 1}</td>
                      <td style={{ ...td, fontWeight: "600" }}>{item.studentid}</td>
                      <td style={td}>{item.last_name} {item.first_name}</td>
                      <td style={td}>{item.email}</td>
                      <td style={td}>{item.facultyid || "--"}</td>
                      <td style={td}>{item.classid || "--"}</td>
                      <td style={td}>
                        <span style={{
                          padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold",
                          background: item.status === "blocked" ? "#fde8e8" : "#d4f5e0",
                          color: item.status === "blocked" ? "#c0392b" : "#1a7a35"
                        }}>
                          {item.status === "blocked" ? " Bị chặn" : " Hoạt động"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL THÊM SINH VIÊN */}
      {showForm && (
        <div style={overlay}>
          <div style={modal}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h4 style={{ margin: 0 }}>Thêm sinh viên mới</h4>
              <button onClick={() => setShowForm(false)} style={closeBtn}>✕</button>
            </div>

            {[
              { label: "MSSV *", name: "studentid", placeholder: "VD: DH52200001" },
              { label: "Họ *", name: "last_name", placeholder: "VD: Nguyễn" },
              { label: "Tên *", name: "first_name", placeholder: "VD: Văn A" },
              { label: "Email *", name: "email", placeholder: "sv@stu.edu.vn", type: "email" },
              { label: "Mã số khoa", name: "facultyid", placeholder: "VD: 1", type: "number" },
              { label: "Lớp (ID)", name: "classid", placeholder: "VD: 5", type: "number" },
              { label: "Mật khẩu *", name: "password", placeholder: "Tối thiểu 6 ký tự", type: "password" },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: "14px" }}>
                <label style={lbl}>{f.label}</label>
                <input
                  type={f.type || "text"}
                  value={form[f.name]}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  placeholder={f.placeholder}
                  style={formInput}
                />
              </div>
            ))}

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={handleAdd} style={saveBtn} disabled={formLoading}>
                {formLoading ? "Đang thêm..." : "✓ Lưu"}
              </button>
              <button onClick={() => setShowForm(false)} style={cancelBtn}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const container = { background: "#2e3f63", minHeight: "100vh", padding: "24px" };
const box = { background: "#f0f2f5", borderRadius: "15px", padding: "22px" };
const topBar = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" };
const searchInput = { padding: "9px 14px", borderRadius: "10px", border: "1px solid #ccc", width: "300px" };
const table = { width: "100%", borderCollapse: "collapse" };
const th = { padding: "11px 10px", textAlign: "left", fontWeight: "600", whiteSpace: "nowrap" };
const td = { padding: "10px 10px", borderBottom: "1px solid #eee", fontSize: "14px" };
const addBtn = { background: "#3b6fb6", color: "white", padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600" };
const blockBtn = { color: "white", padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600" };
const delBtn = { background: "#e74c3c", color: "white", padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600" };
const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modal = { background: "white", borderRadius: "16px", padding: "28px", width: "440px", maxWidth: "95vw", boxShadow: "0 12px 40px rgba(0,0,0,0.2)" };
const closeBtn = { background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#666" };
const lbl = { display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "14px", color: "#333" };
const formInput = { width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", boxSizing: "border-box" };
const saveBtn = { flex: 1, padding: "10px", background: "#27ae60", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" };
const cancelBtn = { flex: 1, padding: "10px", background: "#95a5a6", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "15px" };

export default SinhVien;
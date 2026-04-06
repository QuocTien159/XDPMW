import NavbarAdmin from "../layout/NavbarAdmin";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function QuanLyBaiThi() {
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  // Format datetime 24h
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  };

  const fetchExams = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${API}/exams`);
      const data = await resp.json();
      if (data.status === 'success') {
        setList(data.data);
      }
    } catch (e) {
      console.error("Lỗi lấy danh sách bài thi", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Sắp xếp mới nhất lên đầu (STT=1), tìm kiếm theo tên
  const filtered = list
    .filter(item => item.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.id - a.id);

  const getSelectedItem = () => {
    return list.find(item => item.id === selected);
  };

  // Xóa
  const xoa = async () => {
    const item = getSelectedItem();
    if (!item) return alert("Vui lòng chọn một bài thi!");

    if (item.has_results) {
      const confirmWarning = window.confirm("CẢNH BÁO: Bài thi này ĐÃ CÓ người tham gia. Bạn có chắc chắn muốn xoá không? Hành động này có thể làm ảnh hưởng đến dữ liệu kết quả thi.");
      if (!confirmWarning) return;
    } else {
      const confirmNormal = window.confirm("Bạn có chắc chắn muốn xóa bài thi này?");
      if (!confirmNormal) return;
    }

    try {
      const response = await fetch(`${API}/exams/${selected}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        alert("Đã xóa bài thi!");
        setList(list.filter(exam => exam.id !== selected));
        setSelected(null);
      } else {
        alert(data.message || "Lỗi khi xóa bài thi.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối máy chủ");
    }
  };

  // Sửa
  const sua = async () => {
    const item = getSelectedItem();
    if (!item) return alert("Vui lòng chọn một bài thi!");

    if (item.has_results) {
      return alert("Không thể sửa bài thi vì đã có thí sinh tham gia!");
    }

    const newName = prompt("Nhập tên mới cho bài thi:", item.title);
    if (!newName || newName.trim() === "" || newName === item.title) return;

    try {
      const response = await fetch(`${API}/exams/${selected}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newName })
      });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        alert("Đã cập nhật bài thi!");
        setList(list.map(exam => exam.id === selected ? { ...exam, title: newName } : exam));
      } else {
        alert(data.message || "Lỗi khi sửa bài thi.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối máy chủ");
    }
  };

  return (
    <div>
      <NavbarAdmin />
      <div style={container}>
        <div style={box}>
          {/* 🔥 TOP BAR */}
          <div style={topBar}>
            <input
              placeholder="Tìm bài thi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={searchInput}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => navigate("/admin/thembaithi")} style={btn}>Thêm</button>
              <button onClick={() => {
                const item = getSelectedItem();
                if (!item) return alert("Vui lòng chọn một bài thi!");
                navigate(`/admin/cauhoi/${item.id}`);
              }} style={qBtn}>Câu hỏi</button>
              <button onClick={xoa} style={delBtn}>Xóa</button>
            </div>
          </div>

          <h3>Quản lý bài thi</h3>

          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}></th>
                  <th style={th}>STT</th>
                  <th style={th}>Tên</th>
                  <th style={th}>Mô tả</th>
                  <th style={th}>Điểm đỗ</th>
                  <th style={th}>Thời gian</th>
                  <th style={th}>Số lần thi</th>
                  <th style={th}>Bắt đầu</th>
                  <th style={th}>Kết thúc</th>
                  <th style={th}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, index) => (
                  <tr key={item.id}
                    onClick={() => setSelected(item.id)}
                    style={{
                      background: selected === item.id ? "#bcd" : "white",
                      cursor: "pointer"
                    }}
                  >
                    <td>
                      <input type="radio" checked={selected === item.id} readOnly />
                    </td>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.pass_percentage}%</td>
                    <td>{item.duration_minutes} phút</td>
                    <td style={{ textAlign: "center" }}>{item.max_attempts} lần</td>
                    <td>{formatDateTime(item.start_date)}</td>
                    <td>{formatDateTime(item.end_date)}</td>
                    <td>
                      {item.has_results ? (
                        <span style={{color: "green", fontWeight: "bold"}}>Đã có người tham gia</span>
                      ) : (
                        <span style={{color: "gray"}}>Chưa có người thi</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "15px" }}>Không tìm thấy bài thi nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

const container = {
  background: "#2e3f63",
  minHeight: "100vh",
  padding: "30px"
};

const box = {
  background: "#ddd",
  borderRadius: "15px",
  padding: "20px"
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px"
};

const searchInput = {
  padding: "8px",
  borderRadius: "10px",
  border: "none",
  width: "250px",
  boxSizing: "border-box"
};

const table = {
  width: "100%",
  marginTop: "15px",
  borderCollapse: "collapse"
};

const th = {
  textAlign: "left",
  padding: "8px 6px",
  borderBottom: "2px solid #aaa",
  whiteSpace: "nowrap"
};

const btn = {
  background: "#3b6fb6",
  color: "white",
  padding: "8px 15px",
  borderRadius: "15px",
  border: "none",
  cursor: "pointer"
};

const qBtn = {
  background: "#5a3e91",
  color: "white",
  padding: "8px 15px",
  borderRadius: "15px",
  border: "none",
  cursor: "pointer"
};

const editBtn = {
  background: "#f0ad4e",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "15px",
  cursor: "pointer"
};

const delBtn = {
  background: "#d9534f",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "15px",
  cursor: "pointer"
};

export default QuanLyBaiThi;
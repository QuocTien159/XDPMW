import NavbarAdmin from "../layout/NavbarAdmin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function ThemBaiThi() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryid: "",
    pass_percentage: "",
    max_attempts: "1",
    duration_minutes: "",
    num_questions: "",
    status: "Hiện",
    start_date: "",
    end_date: "",
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validate
    if (!form.title || !form.duration_minutes || !form.num_questions || !form.categoryid || !form.pass_percentage || !form.max_attempts || !form.start_date || !form.end_date) {
      alert("Vui lòng nhập đủ các trường bắt buộc!");
      return;
    }
    if (parseInt(form.max_attempts) < 1) {
      alert("Số lần thi tối thiểu là 1!");
      return;
    }
    if (new Date(form.start_date) >= new Date(form.end_date)) {
      alert("Ngày bắt đầu phải trước ngày kết thúc!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        alert("Thêm bài thi thành công!");
        navigate("/admin/baithi");
      } else {
        alert("Có lỗi xảy ra: " + (data.message || ""));
      }
    } catch (err) {
      alert("Lỗi kết nối máy chủ");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <NavbarAdmin />
      <div style={container}>
        <div style={box}>
          <h3 style={{ marginBottom: "20px" }}>Thêm bài thi</h3>

          <label>Tên bài thi *</label>
          <input name="title" value={form.title} onChange={handleChange} style={input} />

          <label>Mô tả</label>
          <input name="description" value={form.description} onChange={handleChange} style={input} />

          <label>Danh mục (ID) *</label>
          <input type="number" name="categoryid" value={form.categoryid} onChange={handleChange} style={input} placeholder="Ví dụ: 1" />

          <label>Điểm đỗ (%) *</label>
          <input type="number" name="pass_percentage" value={form.pass_percentage} onChange={handleChange} style={input} placeholder="Ví dụ: 50" />

          <label>Số lần thi tối đa *</label>
          <input type="number" name="max_attempts" value={form.max_attempts} onChange={handleChange} style={input} placeholder="Ví dụ: 1 (chỉ thi 1 lần)" min="1" />

          <label>Thời lượng (phút) *</label>
          <input type="number" name="duration_minutes" value={form.duration_minutes} onChange={handleChange} style={input} />

          <label>Số câu hỏi *</label>
          <input type="number" name="num_questions" value={form.num_questions} onChange={handleChange} style={input} />

          <label>Trạng thái</label>
          <select name="status" value={form.status} onChange={handleChange} style={input}>
            <option value="Hiện">Hiện</option>
            <option value="Ẩn">Ẩn</option>
          </select>

          <label>Ngày giờ bắt đầu *</label>
          <input
            type="datetime-local"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            style={input}
          />

          <label>Ngày giờ kết thúc *</label>
          <input
            type="datetime-local"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            style={input}
          />

          <button onClick={handleSubmit} style={btn} disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
}

const container = {
  background: "#2e3f63",
  minHeight: "100vh",
  padding: "30px"
};

const box = {
  background: "#ddd",
  borderRadius: "20px",
  padding: "30px",
  width: "500px",
  margin: "auto"
};

const input = {
  width: "100%",
  padding: "10px",
  margin: "10px 0 15px 0",
  borderRadius: "10px",
  border: "none",
  boxSizing: "border-box"
};

const btn = {
  marginTop: "15px",
  padding: "10px 20px",
  background: "#3b6fb6",
  color: "white",
  border: "none",
  borderRadius: "15px",
  cursor: "pointer",
  width: "100%"
};

export default ThemBaiThi;
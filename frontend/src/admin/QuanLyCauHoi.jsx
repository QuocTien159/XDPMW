import NavbarAdmin from "../layout/NavbarAdmin";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function QuanLyCauHoi() {
  const { exam_id } = useParams();
  const navigate = useNavigate();

  const [examTitle, setExamTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form thêm câu hỏi
  const [form, setForm] = useState({
    question_text: "",
    marks: "1",
    options: [
      { option_text: "", is_correct: 0 },
      { option_text: "", is_correct: 0 },
      { option_text: "", is_correct: 0 },
      { option_text: "", is_correct: 0 },
    ],
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/exams/${exam_id}/questions`);
      const data = await res.json();
      if (data.status === "success") {
        setExamTitle(data.exam_title);
        setQuestions(data.data);
      }
    } catch (e) {
      console.error("Lỗi tải câu hỏi", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [exam_id]);

  const handleOptionChange = (index, field, value) => {
    const updated = [...form.options];
    updated[index] = { ...updated[index], [field]: field === "is_correct" ? (value ? 1 : 0) : value };
    setForm({ ...form, options: updated });
  };

  const addOption = () => {
    setForm({ ...form, options: [...form.options, { option_text: "", is_correct: 0 }] });
  };

  const removeOption = (index) => {
    if (form.options.length <= 2) return alert("Phải có ít nhất 2 đáp án!");
    const updated = form.options.filter((_, i) => i !== index);
    setForm({ ...form, options: updated });
  };

  const handleSubmit = async () => {
    if (!form.question_text.trim()) return alert("Vui lòng nhập câu hỏi!");
    const hasContent = form.options.every(o => o.option_text.trim() !== "");
    if (!hasContent) return alert("Vui lòng nhập đầy đủ nội dung các đáp án!");
    const hasCorrect = form.options.some(o => o.is_correct === 1);
    if (!hasCorrect) return alert("Phải chọn ít nhất 1 đáp án đúng!");

    try {
      const res = await fetch(`${API}/exams/${exam_id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        alert("Thêm câu hỏi thành công!");
        setForm({
          question_text: "",
          marks: "1",
          options: [
            { option_text: "", is_correct: 0 },
            { option_text: "", is_correct: 0 },
            { option_text: "", is_correct: 0 },
            { option_text: "", is_correct: 0 },
          ],
        });
        fetchQuestions();
      } else {
        alert(data.message || "Có lỗi xảy ra!");
      }
    } catch (e) {
      alert("Lỗi kết nối máy chủ");
    }
  };

  const handleDelete = async (question_id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;
    try {
      const res = await fetch(`${API}/questions/${question_id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        setQuestions(questions.filter(q => q.id !== question_id));
      } else {
        alert(data.message || "Lỗi xóa câu hỏi");
      }
    } catch (e) {
      alert("Lỗi kết nối");
    }
  };

  return (
    <div>
      <NavbarAdmin />
      <div style={container}>
        {/* ===== FORM THÊM ===== */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0 }}>Thêm câu hỏi — <span style={{ color: "#3b6fb6" }}>{examTitle}</span></h3>
            <button onClick={() => navigate("/admin/baithi")} style={backBtn}>← Quay lại</button>
          </div>

          <label style={lbl}>Nội dung câu hỏi *</label>
          <textarea
            value={form.question_text}
            onChange={(e) => setForm({ ...form, question_text: e.target.value })}
            rows={3}
            style={textarea}
            placeholder="Nhập câu hỏi..."
          />

          <label style={lbl}>Điểm *</label>
          <input
            type="number"
            value={form.marks}
            min="0"
            onChange={(e) => setForm({ ...form, marks: e.target.value })}
            style={{ ...inputStyle, width: "120px" }}
          />

          <label style={{ ...lbl, marginTop: "16px", display: "block" }}>Các đáp án *</label>
          <p style={{ color: "#666", fontSize: "13px", margin: "4px 0 12px" }}>
            ✅ Tick vào ô vuông để đánh dấu đáp án <strong>đúng</strong>
          </p>

          {form.options.map((opt, i) => (
            <div key={i} style={optionRow}>
              <input
                type="checkbox"
                checked={opt.is_correct === 1}
                onChange={(e) => handleOptionChange(i, "is_correct", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#27ae60" }}
                title="Đáp án đúng"
              />
              <input
                type="text"
                value={opt.option_text}
                onChange={(e) => handleOptionChange(i, "option_text", e.target.value)}
                placeholder={`Đáp án ${String.fromCharCode(65 + i)}`}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button onClick={() => removeOption(i)} style={removeBtn} title="Xóa đáp án">✕</button>
            </div>
          ))}

          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button onClick={addOption} style={addOptBtn}>+ Thêm đáp án</button>
            <button onClick={handleSubmit} style={submitBtn}>✓ Lưu câu hỏi</button>
          </div>
        </div>

        {/* ===== DANH SÁCH CÂU HỎI ===== */}
        <div style={card}>
          <h3 style={{ marginBottom: "16px" }}>
            Danh sách câu hỏi ({questions.length} câu)
          </h3>

          {loading ? (
            <p>Đang tải...</p>
          ) : questions.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", padding: "30px" }}>
              Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!
            </p>
          ) : (
            questions.map((q, qi) => (
              <div key={q.id} style={qCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p style={{ margin: 0, fontWeight: "bold", flex: 1 }}>
                    <span style={{ color: "#3b6fb6" }}>Câu {qi + 1}.</span> {q.question_text}
                    <span style={{ color: "#888", fontSize: "13px", marginLeft: "10px" }}>({q.marks} điểm)</span>
                  </p>
                  <button onClick={() => handleDelete(q.id)} style={deleteBtnStyle} title="Xóa câu hỏi">🗑</button>
                </div>
                <ul style={{ margin: "10px 0 0 20px", padding: 0 }}>
                  {q.options?.map((opt, oi) => (
                    <li key={opt.id} style={{
                      padding: "4px 8px",
                      marginBottom: "4px",
                      borderRadius: "6px",
                      background: opt.is_correct ? "#d4f7dc" : "#f5f5f5",
                      color: opt.is_correct ? "#1a7a35" : "#333",
                      fontWeight: opt.is_correct ? "bold" : "normal",
                      listStyle: "none"
                    }}>
                      {opt.is_correct ? "✅ " : "○ "}{String.fromCharCode(65 + oi)}. {opt.option_text}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const container = {
  background: "#2e3f63",
  minHeight: "100vh",
  padding: "30px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const card = {
  background: "#f0f2f5",
  borderRadius: "16px",
  padding: "24px",
};

const lbl = {
  display: "block",
  fontWeight: "600",
  marginBottom: "6px",
  color: "#333",
};

const textarea = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "15px",
  resize: "vertical",
  boxSizing: "border-box",
  marginBottom: "12px",
};

const inputStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  boxSizing: "border-box",
};

const optionRow = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px",
};

const removeBtn = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: "13px",
};

const addOptBtn = {
  background: "#7f8c8d",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "10px",
  cursor: "pointer",
};

const submitBtn = {
  background: "#27ae60",
  color: "white",
  border: "none",
  padding: "8px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const backBtn = {
  background: "#95a5a6",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "10px",
  cursor: "pointer",
};

const qCard = {
  background: "white",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "12px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const deleteBtnStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "18px",
  padding: "2px 6px",
};

export default QuanLyCauHoi;

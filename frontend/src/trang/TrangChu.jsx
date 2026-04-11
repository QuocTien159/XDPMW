import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarUser from "../layout/NavbarUser";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function TrangChu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/exams`);
      const data = await res.json();
      if (data.status === "success") {
        // Chỉ hiển thị bài thi có trạng thái "Hiện"
        setExams(data.data.filter(e => e.status === "Hiện"));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatDT = (str) => {
    if (!str) return "--";
    const d = new Date(str);
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  };

  const handleThi = async (exam) => {
    if (!user) return alert("Vui lòng đăng nhập trước!");
    setChecking(exam.id);
    try {
      const res = await fetch(`${API}/exams/${exam.id}/check-attempt?uid=${user.uid}`);
      const data = await res.json();
      if (!data.can_attempt) {
        alert(data.message);
        return;
      }
      navigate(`/lambai/${exam.id}`);
    } catch (e) {
      alert("Lỗi kết nối máy chủ");
    } finally {
      setChecking(null);
    }
  };

  const now = new Date();

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh" }}>
      <NavbarUser />
      <div style={{ padding: "30px 40px" }}>
        {/* Chào mừng */}
        <div style={{
          background: "white", borderRadius: "16px", padding: "20px 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "28px"
        }}>
          <h5 style={{ marginBottom: "6px", color: "#555" }}>📢 Thông báo</h5>
          <p style={{ margin: 0, fontSize: "15px" }}>
            Chào mừng <strong>{user ? `${user.last_name} ${user.first_name}` : ""}</strong> đến hệ thống thi trắc nghiệm STUs
          </p>
        </div>

        {/* Danh sách bài thi */}
        <h4 style={{ marginBottom: "20px", color: "#2e3f63" }}>  Danh sách bài thi</h4>

        {loading ? (
          <p>Đang tải...</p>
        ) : exams.length === 0 ? (
          <p style={{ color: "#999" }}>Hiện chưa có bài thi nào.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {exams.map(exam => {
              const started = exam.start_date ? new Date(exam.start_date) <= now : true;
              const ended = exam.end_date ? new Date(exam.end_date) < now : false;
              const isActive = started && !ended;

              return (
                <div key={exam.id} style={examCard}>
                  {/* Header */}
                  <div style={{ ...cardHeader, background: isActive ? "#8aaf4e" : "#aaa" }}>
                    <strong>{exam.title}</strong>
                  </div>

                  {/* Info */}
                  <div style={cardBody}>
                    <div style={infoRow}>⏱ Thời lượng: <strong>{exam.duration_minutes} phút</strong></div>
                    <div style={infoRow}>❓ Số lượng câu hỏi: <strong>{exam.num_questions}</strong></div>
                    <div style={infoRow}>🔁 Số lần làm tối đa: <strong>{exam.max_attempts}</strong></div>
                    <div style={infoRow}>📅 Bắt đầu: <strong>{formatDT(exam.start_date)}</strong></div>
                    <div style={infoRow}>📅 Kết thúc: <strong>{formatDT(exam.end_date)}</strong></div>
                    {!isActive && (
                      <div style={{ color: ended ? "#e74c3c" : "#e67e22", fontSize: "13px", marginTop: "4px", textAlign: "center" }}>
                        {ended ? "⛔ Bài thi đã kết thúc" : "🕐 Bài thi chưa bắt đầu"}
                      </div>
                    )}
                  </div>

                  {/* Nút Thi */}
                  <button
                    onClick={() => handleThi(exam)}
                    disabled={!isActive || checking === exam.id}
                    style={{
                      ...thiBtn,
                      background: isActive ? "#4caf50" : "#aaa",
                      cursor: isActive ? "pointer" : "not-allowed"
                    }}
                  >
                    {checking === exam.id ? "Đang kiểm tra..." : "Thi"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const examCard = {
  background: "white",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  width: "280px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const cardHeader = {
  padding: "16px",
  color: "white",
  textAlign: "center",
  fontSize: "15px",
  minHeight: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardBody = {
  padding: "14px 16px",
  flex: 1,
};

const infoRow = {
  fontSize: "14px",
  padding: "5px 0",
  borderBottom: "1px solid #f0f0f0",
  color: "#444",
};

const thiBtn = {
  width: "100%",
  padding: "12px",
  border: "none",
  color: "white",
  fontWeight: "bold",
  fontSize: "16px",
  letterSpacing: "1px",
};

export default TrangChu;
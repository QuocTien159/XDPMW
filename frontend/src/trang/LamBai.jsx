import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarUser from "../layout/NavbarUser";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function LamBai() {
  const { exam_id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (!u) { navigate("/dangnhap"); return; }
    setUser(u);
    loadExam(u);
  }, [exam_id]);

  const loadExam = async (u) => {
    try {
      // Kiểm tra lượt thi
      const checkRes = await fetch(`${API}/exams/${exam_id}/check-attempt?uid=${u.uid}`);
      const checkData = await checkRes.json();
      if (!checkData.can_attempt) {
        alert(checkData.message);
        navigate("/trangchu");
        return;
      }

      // Tải câu hỏi
      const qRes = await fetch(`${API}/exams/${exam_id}/questions`);
      const qData = await qRes.json();
      if (qData.status !== "success") { navigate("/trangchu"); return; }

      // Lấy thông tin exam
      const exRes = await fetch(`${API}/exams`);
      const exData = await exRes.json();
      const examInfo = exData.data.find(e => e.id === parseInt(exam_id));
      setExam(examInfo);
      setQuestions(qData.data);

      // Bắt đầu đếm giờ
      if (examInfo) {
        const seconds = examInfo.duration_minutes * 60;
        setTimeLeft(seconds);
      }
    } catch (e) {
      alert("Lỗi tải bài thi");
      navigate("/trangchu");
    } finally {
      setLoading(false);
    }
  };

  // Đồng hồ đếm ngược
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  const fmtTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) {
      const answered = Object.keys(answers).length;
      if (answered < questions.length) {
        const go = window.confirm(`Bạn mới trả lời ${answered}/${questions.length} câu. Vẫn nộp bài?`);
        if (!go) return;
      }
    }
    clearTimeout(timerRef.current);
    setSubmitting(true);

    try {
      const res = await fetch(`${API}/exams/${exam_id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, answers })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        navigate("/ketqua", { state: { result: data, examTitle: exam?.title } });
      } else {
        alert(data.message || "Lỗi nộp bài!");
        navigate("/trangchu");
      }
    } catch (e) {
      alert("Lỗi kết nối");
    } finally {
      setSubmitting(false);
    }
  };

  const isWarning = timeLeft !== null && timeLeft <= 300; // 5 phút cuối

  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px", fontSize: "18px", color: "#555" }}>
      Đang tải bài thi...
    </div>
  );

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh" }}>
      <NavbarUser />

      {/* Thanh thông tin cố định */}
      <div style={stickyBar}>
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>📝 {exam?.title}</span>
        <span style={{ ...timerStyle, color: isWarning ? "#e74c3c" : "#2e3f63" }}>
          ⏱ {timeLeft !== null ? fmtTime(timeLeft) : "--:--"}
          {isWarning && " ⚠️ Sắp hết giờ!"}
        </span>
        <span style={{ fontSize: "14px", color: "#666" }}>
          Đã trả lời: {Object.keys(answers).length}/{questions.length}
        </span>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 20px 100px" }}>
        {questions.length === 0 ? (
          <div style={emptyBox}>
            <p>⚠️ Bài thi này chưa có câu hỏi nào!</p>
            <button onClick={() => navigate("/trangchu")} style={backBtnStyle}>Quay lại</button>
          </div>
        ) : (
          questions.map((q, qi) => (
            <div key={q.id} style={qCard}>
              <p style={qText}>
                <span style={{ color: "#3b6fb6", fontWeight: "bold" }}>Câu {qi + 1}.</span> {q.question_text}
                <span style={{ fontSize: "12px", color: "#999", marginLeft: "8px" }}>({q.marks} điểm)</span>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {q.options?.map((opt, oi) => {
                  const selected = answers[q.id] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelect(q.id, opt.id)}
                      style={{
                        ...optionBox,
                        background: selected ? "#e8f4fd" : "white",
                        border: selected ? "2px solid #3b6fb6" : "1px solid #ddd",
                      }}
                    >
                      <span style={{
                        ...optLetter,
                        background: selected ? "#3b6fb6" : "#e0e0e0",
                        color: selected ? "white" : "#555",
                      }}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span style={{ fontSize: "15px" }}>{opt.option_text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {questions.length > 0 && (
          <button
            onClick={() => handleSubmit(false)}
            style={submitBtnStyle}
            disabled={submitting}
          >
            {submitting ? "Đang nộp bài..." : "✅ Nộp bài"}
          </button>
        )}
      </div>
    </div>
  );
}

const stickyBar = {
  position: "sticky", top: 0, zIndex: 100,
  background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  padding: "12px 32px", display: "flex",
  justifyContent: "space-between", alignItems: "center",
};

const timerStyle = {
  fontSize: "20px", fontWeight: "bold", fontFamily: "monospace",
};

const qCard = {
  background: "white", borderRadius: "12px",
  padding: "20px 24px", marginBottom: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
};

const qText = {
  fontSize: "16px", marginBottom: "16px", lineHeight: "1.6", color: "#222",
};

const optionBox = {
  display: "flex", alignItems: "center", gap: "12px",
  padding: "12px 16px", borderRadius: "8px",
  cursor: "pointer", transition: "all 0.15s",
};

const optLetter = {
  width: "28px", height: "28px", borderRadius: "50%",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontWeight: "bold", fontSize: "13px", flexShrink: 0,
};

const submitBtnStyle = {
  width: "100%", padding: "16px", fontSize: "18px", fontWeight: "bold",
  background: "#27ae60", color: "white", border: "none",
  borderRadius: "12px", cursor: "pointer", marginTop: "10px",
};

const emptyBox = {
  textAlign: "center", padding: "60px", background: "white",
  borderRadius: "12px", color: "#666", fontSize: "16px",
};

const backBtnStyle = {
  marginTop: "16px", padding: "10px 24px", background: "#95a5a6",
  color: "white", border: "none", borderRadius: "8px", cursor: "pointer",
};

export default LamBai;
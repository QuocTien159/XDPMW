import NavbarUser from "../layout/NavbarUser";
import { useLocation, useNavigate } from "react-router-dom";

function KetQua() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, examTitle } = location.state || {};

  if (!result) {
    return (
      <div>
        <NavbarUser />
        <div style={{ textAlign: "center", padding: "80px" }}>
          <p>Không có dữ liệu kết quả.</p>
          <button onClick={() => navigate("/trangchu")} style={backBtn}>Về trang chủ</button>
        </div>
      </div>
    );
  }

  const isPassed = result.exam_status === "pass";

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh" }}>
      <NavbarUser />
      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>

        {/* Banner kết quả */}
        <div style={{
          background: isPassed ? "linear-gradient(135deg, #27ae60, #2ecc71)" : "linear-gradient(135deg, #e74c3c, #c0392b)",
          borderRadius: "16px", padding: "32px", textAlign: "center", color: "white",
          marginBottom: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
        }}>
          <div style={{ fontSize: "60px", marginBottom: "8px" }}>{isPassed ? "🎉" : "😔"}</div>
          <h2 style={{ margin: "0 0 8px" }}>{isPassed ? "Chúc mừng! Bạn đã đạt!" : "Bạn chưa đạt!"}</h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "15px" }}>{result.message}</p>
        </div>

        {/* Chi tiết điểm */}
        <div style={card}>
          <h4 style={{ marginBottom: "20px", color: "#2e3f63" }}>📋 {examTitle || "Kết quả bài thi"}</h4>
          <div style={scoreTable}>
            <div style={scoreRow}>
              <span>Điểm đạt được</span>
              <strong style={{ fontSize: "24px", color: isPassed ? "#27ae60" : "#e74c3c" }}>
                {result.total_score} / {result.max_score}
              </strong>
            </div>
            <div style={scoreRow}>
              <span>Phần trăm</span>
              <strong>{result.percentage}%</strong>
            </div>
            <div style={{ ...scoreRow, border: "none" }}>
              <span>Kết quả</span>
              <span style={{
                padding: "4px 14px", borderRadius: "20px", fontWeight: "bold",
                background: isPassed ? "#d4f5e0" : "#fde8e8",
                color: isPassed ? "#1a7a35" : "#c0392b"
              }}>
                {isPassed ? "✅ Đạt" : "❌ Không đạt"}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button onClick={() => navigate("/trangchu")} style={backBtn}>← Về danh sách</button>
        </div>
      </div>
    </div>
  );
}

const card = {
  background: "white", borderRadius: "12px",
  padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
};

const scoreTable = { display: "flex", flexDirection: "column", gap: 0 };

const scoreRow = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "14px 0", borderBottom: "1px solid #f0f0f0", fontSize: "15px", color: "#444"
};

const backBtn = {
  flex: 1, padding: "12px", background: "#3b6fb6", color: "white",
  border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "15px", fontWeight: "bold"
};

export default KetQua;
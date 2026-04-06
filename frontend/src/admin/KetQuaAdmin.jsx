import { useEffect, useState } from "react";
import NavbarAdmin from "../layout/NavbarAdmin";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function KetQuaAdmin() {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResults = async (exam_id = "") => {
    setLoading(true);
    try {
      const url = exam_id ? `${API}/results?exam_id=${exam_id}` : `${API}/results`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "success") setResults(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchExams = async () => {
    const res = await fetch(`${API}/exams`);
    const data = await res.json();
    if (data.status === "success") setExams(data.data);
  };

  useEffect(() => {
    fetchExams();
    fetchResults();
  }, []);

  const handleExamFilter = (e) => {
    setSelectedExam(e.target.value);
    fetchResults(e.target.value);
  };

  const filtered = results.filter(r =>
    r.studentid?.toLowerCase().includes(search.toLowerCase()) ||
    `${r.last_name} ${r.first_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const fmtDT = (str) => {
    if (!str) return "--";
    const d = new Date(str);
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  };

  const passCount = filtered.filter(r => r.status === "pass").length;
  const failCount = filtered.filter(r => r.status === "fail").length;

  return (
    <div>
      <NavbarAdmin />
      <div style={container}>
        <div style={box}>
          <h3 style={{ marginBottom: "20px" }}>  Kết quả bài thi</h3>


          {/* Bộ lọc */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
            <input
              placeholder="Tìm theo MSSV hoặc tên..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={searchInput}
            />
            <select value={selectedExam} onChange={handleExamFilter} style={selectStyle}>
              <option value="">-- Tất cả bài thi --</option>
              {exams.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
            <button onClick={() => { setSelectedExam(""); setSearch(""); fetchResults(""); }} style={resetBtn}>
               Làm mới
            </button>
          </div>

          {/* Bảng */}
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead>
                  <tr style={{ background: "#2e3f63", color: "white" }}>
                    <th style={th}>STT</th>
                    <th style={th}>MSSV</th>
                    <th style={th}>Họ tên</th>
                    <th style={th}>Bài thi</th>
                    <th style={th}>Điểm</th>
                    <th style={th}>Phần trăm</th>
                    <th style={th}>Điểm đỗ</th>
                    <th style={th}>Kết quả</th>
                    <th style={th}>Ngày nộp</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: "center", padding: "30px", color: "#999" }}>
                        Không có kết quả nào.
                      </td>
                    </tr>
                  ) : filtered.map((r, i) => (
                    <tr key={r.result_id} style={{ background: i % 2 === 0 ? "white" : "#f9f9f9" }}>
                      <td style={td}>{i + 1}</td>
                      <td style={td}>{r.studentid}</td>
                      <td style={td}>{r.last_name} {r.first_name}</td>
                      <td style={td}>{r.exam_title}</td>
                      <td style={{ ...td, textAlign: "center", fontWeight: "bold" }}>{r.total_score}</td>
                      <td style={{ ...td, textAlign: "center" }}>{r.percentage}%</td>
                      <td style={{ ...td, textAlign: "center", color: "#666" }}>{r.pass_percentage}%</td>
                      <td style={{ ...td, textAlign: "center" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: "12px", fontSize: "13px", fontWeight: "bold",
                          background: r.status === "pass" ? "#d4f5e0" : "#fde8e8",
                          color: r.status === "pass" ? "#1a7a35" : "#c0392b"
                        }}>
                          {r.status === "pass" ? "Đạt" : "Không đạt"}
                        </span>
                      </td>
                      <td style={{ ...td, fontSize: "13px", color: "#666" }}>{fmtDT(r.end_time)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const container = { background: "#2e3f63", minHeight: "100vh", padding: "24px" };
const box = { background: "#f0f2f5", borderRadius: "16px", padding: "24px" };
const table = { width: "100%", borderCollapse: "collapse" };
const th = { padding: "12px 10px", textAlign: "left", fontWeight: "600", whiteSpace: "nowrap" };
const td = { padding: "10px 10px", borderBottom: "1px solid #eee", fontSize: "14px" };
const searchInput = { padding: "8px 14px", borderRadius: "8px", border: "1px solid #ccc", minWidth: "240px" };
const selectStyle = { padding: "8px 14px", borderRadius: "8px", border: "1px solid #ccc" };
const resetBtn = { padding: "8px 14px", borderRadius: "8px", background: "#95a5a6", color: "white", border: "none", cursor: "pointer" };
const statCard = { color: "white", borderRadius: "12px", padding: "14px 24px", minWidth: "100px", textAlign: "center" };
const statNum = { fontSize: "28px", fontWeight: "bold" };
const statLabel = { fontSize: "13px", opacity: 0.9 };

export default KetQuaAdmin;
import NavbarUser from "../layout/NavbarUser";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function DeThi() {
  const navigate = useNavigate();

  const [danhSachDe, setDanhSachDe] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "https://web-thitracnghiem-nhom15.onrender.com/api";

  useEffect(() => {
    const fetchDeThi = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/exams`); // ⚠️ sửa đúng API của bạn nếu khác
        const data = await res.json();

        // tùy backend trả về
        setDanhSachDe(data.data || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeThi();
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <NavbarUser />

      <div className="container mt-4">

        <h3 className="fw-bold text-center mb-4 text-danger">
          Danh sách đề thi
        </h3>

        {loading ? (
          <div className="text-center">Đang tải...</div>
        ) : (
          <div className="row">
            {danhSachDe.map((de) => (
              <div className="col-md-4 mb-4" key={de.id}>
                <div
                  className="card shadow-sm h-100"
                  style={{
                    borderRadius: "20px",
                    border: "1px solid #ddd",
                  }}
                >
                  <div className="card-body p-4">

                    <h5 className="fw-bold text-center mb-3">
                      {de.name || de.ten}
                    </h5>

                    <p>
                      ⏱ <b>Thời gian:</b> {de.duration || "?"} phút
                    </p>

                    <p>
                      📋 <b>Số câu:</b> {de.total_questions || "?"}
                    </p>

                    <div className="text-center mt-3">
                      <button
                        className="btn btn-danger rounded-pill px-4"
                        onClick={() =>
                          navigate("/lambai", { state: { examId: de.id } })
                        }
                      >
                        Làm bài
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default DeThi;
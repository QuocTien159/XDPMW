import { useState, useEffect } from "react";
import NavbarUser from "../layout/NavbarUser";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

function KetQua() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/dangnhap"); 
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.id || user.uid; 

    const fetchResults = async () => {
      try {
        const response = await axios.get(`${API_URL}/results/user/${userId}`);
        if (response.data.status === "success") {
          setResults(response.data.data);
        } else {
          setError("Không thể tải lịch sử kết quả.");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi kết nối đến máy chủ.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]);

 
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  return (
    <div>
      <NavbarUser />
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Lịch Sử Thi Của Bạn</h2>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center mt-4">{error}</div>
        ) : results.length === 0 ? (
          <div className="alert alert-info text-center mt-4">
            Bạn chưa hoàn thành bài thi nào.
          </div>
        ) : (
          <div className="table-responsive shadow-sm rounded">
            <table className="table table-bordered table-hover mb-0">
              <thead className="table-primary text-center align-middle">
                <tr>
                  <th>STT</th>
                  <th>Tên Bài Thi</th>
                  <th>Điểm Số</th>
                  <th>Phần Trăm (%)</th>
                  <th>Trạng Thái</th>
                  <th>Thời Gian Nộp Bài</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {results.map((item, index) => {
                  // Determine passed/failed status based on percentage
                  const isPassed = item.status === "passed" || item.percentage >= 50;
                  
                  return (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td>
                      <td className="text-start fw-medium">
                        {item.exam?.title || `Bài thi #${item.exam_id}`}
                      </td>
                      <td className="fw-bold text-success fs-5">{item.total_score}</td>
                      <td>{item.percentage ? `${item.percentage}%` : "N/A"}</td>
                      <td>
                        <span className={`badge ${isPassed ? "bg-success" : "bg-danger"}`}>
                          {isPassed ? "Đạt" : "Chưa Đạt"}
                        </span>
                      </td>
                      <td>{formatDate(item.end_time)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default KetQua;
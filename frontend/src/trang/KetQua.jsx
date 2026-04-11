import React, { useEffect, useState } from "react";
import NavbarUser from "../layout/NavbarUser";
import { useNavigate } from "react-router-dom";
import config from "../config";

function KetQua() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      navigate("/dang-nhap"); 
      return;
    }

    const user = JSON.parse(storedUser);

   
    fetch(`${config.API_BASE_URL}/api/user-results/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải kết quả:", err);
        setLoading(false);
      });
  }, [navigate]);

  return (
    <>
      <NavbarUser />
      <div className="container mt-5">
        <h2 className="mb-4 text-center fw-bold text-primary">Kết quả bài thi đã làm của sinh viên</h2>
        
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className="table-responsive shadow-sm rounded">
            <table className="table table-bordered table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th scope="col" className="text-center" style={{ width: "5%" }}>#</th>
                  <th scope="col" style={{ width: "45%" }}>Tên Bài Thi</th>
                  <th scope="col" className="text-center" style={{ width: "15%" }}>Điểm Số</th>
                  <th scope="col" className="text-center" style={{ width: "15%" }}>Trạng Thái</th>
                  <th scope="col" className="text-center" style={{ width: "20%" }}>Thời Gian Nộp</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => (
                  <tr key={item.rid || index}>
                    <td className="text-center fw-bold">{index + 1}</td>
                    <td className="fw-medium">{item.exam_name}</td>
                    <td className="text-center text-success fw-bold fs-5">
                      {item.score_obtain} / {item.total_score || '10'}
                    </td>
                    <td className="text-center">
                    
                      {item.score_obtain >= 5 ? (
                         <span className="badge bg-success px-3 py-2">Đạt</span>
                      ) : (
                         <span className="badge bg-danger px-3 py-2">Chưa đạt</span>
                      )}
                    </td>
                    <td className="text-center">
                      {new Date(item.created_at).toLocaleString("vi-VN", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info text-center shadow-sm" role="alert">
           Sinh viên chưa hoàn thành bài thi nào trên hệ thống.
          </div>
        )}
      </div>
    </>
  );
}

export default KetQua;
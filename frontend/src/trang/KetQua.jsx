import React, { useEffect, useState } from "react";
import NavbarUser from "../layout/NavbarUser";
import { useNavigate } from "react-router-dom";
import config from "../config";

function KetQua() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/dang-nhap");
      return;
    }
    
    const user = JSON.parse(storedUser);
    const userId = user.uid || user.id; 

    const fetchResults = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/user-results/${userId}`);
        
        if (!response.ok) {
          throw new Error("Không thể tải kết quả thi từ máy chủ.");
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavbarUser />
      
      <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200">
            Lịch Sử Bài Thi
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-center">
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-lg font-medium">Bạn chưa hoàn thành bài thi nào.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-50 text-blue-800 uppercase text-xs font-semibold tracking-wide">
                    <th className="py-4 px-6 rounded-tl-lg">Tên Bài Thi</th>
                    <th className="py-4 px-6 text-center">Thời Gian Nộp</th>
                    <th className="py-4 px-6 text-center">Điểm Số</th>
                    <th className="py-4 px-6 text-center rounded-tr-lg">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-medium">
                  {results.map((result, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition duration-150">
                      <td className="py-4 px-6 text-gray-900">
                        {result.exam_name}
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap text-gray-500">
                        {new Date(result.created_at).toLocaleString("vi-VN")}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-bold text-blue-600 text-base">
                          {result.score}
                        </span>
                        <span className="text-gray-400 text-xs ml-1">/ 100</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {result.score >= 50 ? (
                          <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-bold">
                            Đạt
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-bold">
                            Chưa Đạt
                          </span>
                        )}
                      </td>
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

export default KetQua;
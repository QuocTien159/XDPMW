import { useEffect, useState } from "react";
import NavbarUser from "../layout/NavbarUser";
import { API_BASE_URL } from '../config';

function TaiKhoan() {
  const [user, setUser] = useState(null);
  useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("No token found. Please login.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${API_BASE_URL}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (err) {
                setError("Failed to fetch user data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);
 

  if (!user) return <div>Loading...</div>;

  return (
    <div className="bg-light min-vh-100">
      <NavbarUser />

      <div className="container mt-4">
        <div className="row">

          {/* LEFT CARD */}
          <div className="col-md-4">
            <div
              className="p-4 text-center"
              style={{
                borderRadius: "20px",
                border: "2px solid #0d3b66",
              }}
            >
              <h6 className="fw-bold mb-3">THÔNG TIN CÁ NHÂN</h6>

              {/* Avatar */}
              <div className="mb-3">
                <img
                  src="/img/avatar.png"
                  alt="avatar"
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    background: "#0d3b66",
                    padding: "10px",
                  }}
                />
              </div>

              <div
                className="p-3 text-start"
                style={{
                  background: "#0d3b66",
                  color: "#fff",
                  borderRadius: "15px",
                }}
              >
                <p>☐ Họ và tên: {user?.name}</p>
                <p>☐ MSSV: {user?.mssv}</p>
                <p>☐ Lớp: {user?.lop}</p>
                <p>☐ Email: {user?.email}</p>
                <p>☐ Khoa: {user?.khoa}</p>
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="col-md-8">
            <div
              className="p-4"
              style={{
                background: "#0d3b66",
                borderRadius: "30px",
                color: "#fff",
              }}
            >
              <h5 className="text-center mb-4 fw-bold">
                THÔNG TIN CHI TIẾT
              </h5>

              {[
                { label: "NIÊN KHÓA", value: user.nienkhoa },
                { label: "GPA", value: user.gpa },
                { label: "ĐỊA CHỈ", value: user.diachi },
                { label: "QUÊ QUÁN", value: user.quequan },
                { label: "SĐT", value: user.sdt },
              ].map((item, index) => (
                <div
                  key={index}
                  className="d-flex mb-3"
                  style={{ background: "#fff", color: "#000" }}
                >
                  <div
                    style={{
                      width: "150px",
                      fontWeight: "bold",
                      padding: "8px",
                      borderRight: "1px solid #ccc",
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ padding: "8px", flex: 1 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TaiKhoan;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarUser from "../layout/NavbarUser";
import UserDetail from "../components/UserDetail";

function TaiKhoan() {
  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      
      const id = parsedUser.uid || parsedUser.studentid;
      setCurrentUserId(id);
    } else {
      navigate("/dangnhap");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/dangnhap");
  };

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh" }}>
      <NavbarUser />

      {/* gọi API */}
      <UserDetail userId={currentUserId} onData={setUserData} />

      <div className="container mt-5">

        <h3 className="text-center fw-bold mb-5">
          Thông tin tài khoản
        </h3>

        {userData && (
          <div className="row">

            {/* LEFT */}
            <div className="col-md-4">
              <div
                className="p-4"
                style={{
                  background: "#0d3b66",
                  borderRadius: "30px",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <h5 className="mb-3">THÔNG TIN CÁ NHÂN</h5>

                
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt=""
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: "15px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background: "#fff",
                      color: "#0d3b66",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 15px",
                      fontSize: "30px",
                      fontWeight: "bold",
                    }}
                  >
                    {userData.first_name?.charAt(0)}
                  </div>
                )}

                <p>Họ tên: {userData.last_name} {userData.first_name}</p>
                <p>MSSV: {userData.studentid}</p>
                <p>Email: {userData.email}</p>
                <p>Khoa: {userData.facultyid}</p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-md-8">
              <div
                className="p-4"
                style={{
                  background: "#0d3b66",
                  borderRadius: "30px",
                  color: "white",
                }}
              >
                <h5 className="text-center mb-4">
                  THÔNG TIN CHI TIẾT
                </h5>

                <div className="mb-3 bg-light text-dark p-2 rounded">
                  Niên khóa: 2022 - 2026
                </div>

                <div className="mb-3 bg-light text-dark p-2 rounded">
                  GPA: 3.5 / 4.0
                </div>

                <div className="mb-3 bg-light text-dark p-2 rounded">
                  Địa chỉ: ---
                </div>

                <div className="mb-3 bg-light text-dark p-2 rounded">
                  Quê quán: ---
                </div>

                <div className="mb-3 bg-light text-dark p-2 rounded">
                  SĐT: {userData.contact_no || "Chưa cập nhật"}
                </div>

                <div className="text-center mt-4">
                  <button className="btn btn-warning me-2">
                    Đổi mật khẩu
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default TaiKhoan;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarUser from "../layout/NavbarUser";

function TaiKhoan() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!currentUser) {
    return <div className="text-center mt-5">Đang tải...</div>;
  }

  return (
    <div className="bg-light min-vh-100">
      <NavbarUser />

      <div className="container mt-5">
        <div className="row">

          {/* LEFT */}
          <div className="col-md-4">
            <div
              className="p-4 text-center"
              style={{
                border: "2px solid #0d3b66",
                borderRadius: "30px",
                background: "#eaf4fb",
              }}
            >
              <h5 className="fw-bold text-primary mb-3">
                THÔNG TIN CÁ NHÂN
              </h5>

              {/* Avatar */}
              <img
                src="/img/avatar.png"
                alt=""
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "#0d3b66",
                  padding: "10px",
                }}
              />

              <div
                className="mt-4 p-3 text-start"
                style={{
                  background: "#0d3b66",
                  color: "white",
                  borderRadius: "20px",
                }}
              >
                <p>☐ Họ và tên: {currentUser.holot} {currentUser.ten}</p>
                <p>☐ MSSV: {currentUser.mssv}</p>
                <p>☐ Email: {currentUser.email}</p>
                <p>☐ SĐT: {currentUser.sdt}</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-md-8">
            <div
              className="p-4"
              style={{
                background: "#0d3b66",
                borderRadius: "40px",
                color: "white",
              }}
            >
              <h5 className="text-center fw-bold mb-4">
                THÔNG TIN CHI TIẾT
              </h5>

              {[
                ["NIÊN KHÓA", currentUser.nienkhoa || "2022-2026"],
                ["GPA", currentUser.gpa || "3.5/4.0"],
                ["ĐỊA CHỈ", currentUser.diachi || "Chưa cập nhật"],
                ["QUÊ QUÁN", currentUser.quequan || "Chưa cập nhật"],
                ["SĐT", currentUser.sdt || "Chưa cập nhật"],
              ].map(([label, value], index) => (
                <div
                  key={index}
                  className="d-flex mb-3"
                  style={{
                    background: "white",
                    color: "black",
                  }}
                >
                  <div
                    style={{
                      width: "200px",
                      background: "#e0e0e0",
                      padding: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    {label}
                  </div>

                  <div style={{ padding: "8px", flex: 1 }}>
                    {value}
                  </div>
                </div>
              ))}

              {/* BUTTON */}
              <div className="text-center mt-4">
                <button className="btn btn-danger px-4" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TaiKhoan;
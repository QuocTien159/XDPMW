import { useEffect, useState } from "react";
import NavbarUser from "../layout/NavbarUser";

function TaiKhoan() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // fallback
      setUser({
        mssv: "DH12345678",
        ten: "Nguyễn Văn A",
        email: "dh12345678@stu.edu.vn",
        lop: "D22_TH00",
        khoa: "Công Nghệ Thông Tin",
        nienkhoa: "2022-2026",
        gpa: "3.5/4.0",
        diachi: "180 Cao Lỗ, TP.HCM",
        quequan: "Cần Thơ",
        sdt: "07xx xxx xxx",
      });
    }
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
                <p>☐ Họ và tên: {user.ten}</p>
                <p>☐ MSSV: {user.mssv}</p>
                <p>☐ Lớp: {user.lop}</p>
                <p>☐ Email: {user.email}</p>
                <p>☐ Khoa: {user.khoa}</p>
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
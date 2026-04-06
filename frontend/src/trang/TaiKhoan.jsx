import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarUser from "../layout/NavbarUser";
import UserDetail from "../components/UserDetail";

function TaiKhoan() {
  const navigate = useNavigate();
  
  
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser); 
      setCurrentUser(parsedUser);
      setCurrentUserId(parsedUser.id || parsedUser.uid); 
    } else {
      navigate("/");
    }
  }, [navigate]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-light vh-100">
      <NavbarUser />
      
      <div className="container mt-5">
        <div className="row justify-content-center">
          
         
          <div className="col-md-6">
            <h3 className="fw-bold mb-4 text-center">Thông tin tài khoản</h3>
            {currentUser ? (
              <div className="card shadow-sm mb-4" style={{ borderRadius: "20px", border: "1px solid #ddd" }}>
                <div className="card-body p-4">
                  <UserDetail userId={currentUserId} />
                </div>
              </div>
            ) : (
              <div className="text-center">Đang tải dữ liệu...</div>
            )}
          </div>

          
          <div>
            {currentUser && (
              <div className="card shadow-sm p-4" style={{ borderRadius: "20px" }}>
                <h5 className="mb-3 fw-bold text-center">Thong tin sinh viên</h5>
                
                
                <input name="studentid" value={currentUser.studentid || currentUser.mssv || ""} placeholder="MSSV" className="form-control mb-3" onChange={handleChange} readOnly="true" />
                <input name="email" value={currentUser.email || ""} placeholder="Email" className="form-control mb-3" onChange={handleChange} readOnly="true" />
                <input name="last_name" value={currentUser.last_name || currentUser.holot || ""} placeholder="Họ lót" className="form-control mb-3" onChange={handleChange} readOnly="true" />
                <input name="first_name" value={currentUser.first_name || currentUser.ten || ""} placeholder="Tên" className="form-control mb-3" onChange={handleChange} />
                <input name="contact_no" value={currentUser.contact_no || currentUser.sdt || ""} placeholder="SĐT" className="form-control mb-3" onChange={handleChange} />

                <div className="d-flex gap-2 justify-content-center mt-4">
                  <button className="btn btn-primary">Lưu</button>
                  <button className="btn btn-warning">Đổi mật khẩu</button>
                  
                 
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default TaiKhoan;
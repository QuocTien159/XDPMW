import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";

function NavbarUser() {
      const navigate = useNavigate();
     const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

return (

<nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">

<div className="container">

<Link className="navbar-brand fw-bold" to="/trangchu">
Phòng CTSV STU
</Link>

<button 
className="navbar-toggler" 
type="button" 
data-bs-toggle="collapse" 
data-bs-target="#navbarNav"
>
<span className="navbar-toggler-icon"></span>
</button>

<div className="collapse navbar-collapse" id="navbarNav">

<ul className="navbar-nav ms-auto">

<li className="nav-item">
<Link className="nav-link" to="/trangchu">
Trang chủ
</Link>
</li>

<li className="nav-item">
<Link className="nav-link" to="/dethi">
Đề thi
</Link>
</li>

<li className="nav-item">
<Link className="nav-link" to="/ketqua">
Kết quả
</Link>
</li>

<li className="nav-item">
<Link className="nav-link" to="/taikhoan">
Tài khoản
</Link>
</li>
<li className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleLogout} style={{ textDecoration: 'none' }}>
                    Đăng xuất
                  </button>
            </li>
</ul>

</div>

</div>

</nav>

)

}

export default NavbarUser
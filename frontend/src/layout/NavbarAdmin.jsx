import { Link, useNavigate } from "react-router-dom";

function NavbarAdmin() {

  const navigate = useNavigate();

  return (
    <div style={nav}>

      {/* Bên trái */}
      <div style={{fontWeight:"bold"}}>
        Quản trị viên STU
      </div>

      {/* Bên phải */}
      <div style={right}>

        <Link to="/admin/baithi" style={btn}>Bài Thi</Link>
        <Link to="/admin/ketqua" style={btn}>Kết quả</Link>
        <Link to="/admin/sinhvien" style={btn}>Sinh Viên</Link>

        {/* Avatar click */}
        <div style={avatar} onClick={() => navigate("/admin/thongtin")}></div>

      </div>

    </div>
  );
}

const nav = {
  background:"#000",
  color:"white",
  padding:"10px 20px",
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center"
};

const right = {
  display:"flex",
  alignItems:"center",
  gap:"15px"
};

const btn = {
  background:"#2e4a7d",
  padding:"8px 18px",
  borderRadius:"20px",
  color:"white",
  textDecoration:"none"
};

const avatar = {
  width:"35px",
  height:"35px",
  borderRadius:"50%",
  background:"#ccc",
  cursor:"pointer"
};

export default NavbarAdmin;
import NavbarAdmin from "../layout/NavbarAdmin";

function ThemThiSinh(){

return(

<div>

<NavbarAdmin/>

<div style={container}>

<div style={box}>

<h3>Thêm thí sinh</h3>

<label>MSSV</label>
<input style={input}/>

<label>Họ tên</label>
<input style={input}/>

<label>Email</label>
<input style={input}/>

<label>Số điện thoại</label>
<input style={input}/>

<label>Mật khẩu</label>
<input type="password" style={input}/>

<button style={btn}>Thêm</button>

</div>

</div>

</div>

)

}

const container = {
  background:"#2e3f63",
  minHeight:"100vh",
  padding:"30px"
};

const box = {
  background:"#ddd",
  borderRadius:"20px",
  padding:"30px",
  width:"500px",
  margin:"auto"
};

const input = {
  width:"100%",
  padding:"10px",
  margin:"10px 0",
  borderRadius:"10px",
  border:"none"
};

const btn = {
  marginTop:"15px",
  padding:"10px 20px",
  background:"#3b6fb6",
  color:"white",
  border:"none",
  borderRadius:"15px"
};

export default ThemThiSinh;
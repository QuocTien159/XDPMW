import NavbarUser from "../layout/NavbarUser"
import { useLocation, useNavigate } from "react-router-dom"

function NopBai(){

const location = useLocation()
const navigate = useNavigate()

const { score, total } = location.state || {}

return(

<div>

<NavbarUser/>

<div className="container mt-4">

<div className="card shadow rounded-4 p-4 text-center">

<h4 className="text-success">Nộp bài thành công!</h4>

<p><b>MSSV:</b> DH5220000000</p>
<p><b>Tên bài thi:</b> Demo</p>
<p><b>Số câu đúng:</b> {score}/{total}</p>

<button 
className="btn btn-primary rounded-pill px-4 mt-3"
onClick={()=>navigate("/ketqua",{state:{score,total}})}
>
Xem kết quả
</button>

</div>

</div>

</div>

)

}

export default NopBai
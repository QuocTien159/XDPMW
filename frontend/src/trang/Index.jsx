import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Index() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid bg-light min-vh-100">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3">
        <h5 className="text-danger fw-bold">STU</h5>

        <button
          className="btn btn-danger"
          onClick={() => navigate("/dangnhap")}
        >
          Đăng nhập
        </button>
      </div>

      {/* Hero */}
      <div className="row align-items-center px-5 mt-4">

        {/* Text */}
        <div className="col-md-6">
          <h1 className="fw-bold" style={{ color: "#7a0000" }}>
            Chào mừng sinh viên <br /> STU
          </h1>

          {/*<button className="btn btn-danger mt-4 px-4 py-2">
            Tham gia thi
          </button>*/}
        </div>

         
        <div className="col-md-6 text-center">
          <img
            src="/img/hinh1.jpg"
            alt=""
            className="img-fluid rounded shadow"
            style={{ maxHeight: "350px" }}
          />
        </div>

      </div>

       
      <div className="row mt-5 px-5">
        <div className="col-md-6">
          <img
            src="/img/hinh2.jpg"
            alt=""
            className="img-fluid rounded shadow"
          />
        </div>
      </div>

    </div>
  );
}

export default Index;
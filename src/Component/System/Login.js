import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Img } from "react-image";
import { mainAction } from "../../Redux/Actions";
import { Alerterror, Alertwarning, EncodeString } from "../../Utils";
import Captcha from "captcha-image";
import { useNavigate } from "react-router-dom";
import { TooltipCustom } from "../../Common";
import moment from "moment";
import { event } from "jquery";
// Import React Table

export const Login = () => {
  const dispatch = useDispatch();
  const CreateBy = localStorage.getItem("CreateBy");
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem("Token", "");
    /* document.querySelector(".main-header").classList.add("display-none");
    document.querySelector(".main-sidebar").classList.add("display-none");
    document.querySelector(".main-footer").classList.add("display-none"); */
    LoadCapCha();
  }, []);

  //#region Function load capcha
  const [CaptchaImage, setCaptchaImage] = useState("");
  const LoadCapCha = () => {
    const CaptchaImage = new Captcha(
      "25px Arial",
      "center",
      "middle",
      152,
      40,
      "white",
      "black",
      6
    ).createImage();
    setCaptchaImage(CaptchaImage);
  };
  //#endregion

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [disbtn, setdisbtn] = useState(true);
  const [CaptCha, setCaptCha] = useState("");
  const [isShow, setIsShow] = useState(false);

  const showError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        Alerterror("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        Alerterror("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        Alerterror("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        Alerterror("An unknown error occurred.");
        break;
    }
  };

  const showPosition = (position) => {
    let lat = position.coords.latitude.toString(),
      lon = position.coords.longitude.toString();

    Trl_spStaff_Login(lat, lon); // Gọi vào Loging
  };

  const Trl_spStaff_Login_Click = () => {
    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(showPosition, showError);
    // }
    // else {
    //     Alerterror("Không thể lấy vị trí của bạn, mở định vị!");
    //     return
    // }
    Trl_spStaff_Login(0, 0); // tạm thời ẩn chưa lấy vị trí
  };

  const Trl_spStaff_Login = async (lat, lon) => {
    let _now = moment(new Date()).format("dd/MM/yyyy hh:mm:ss tt");
    let _token = EncodeString(_now + Math.floor(Math.random() * 100) + 1);

    try {
      if (CaptCha === "") {
        Alertwarning("Nhập mã capcha");
        return;
      }
      if (
        CaptCha !== CaptchaImage.split('data-key="')[1].split('"')[0] &&
        CaptCha !== ""
      ) {
        Alertwarning("Xác thực capcha không đúng");
        return;
      }
      // if (lat === "") {
      //     Alertwarning("Không thể lấy vị trí");
      //     return;
      // }

      if (Email === "") {
        Alertwarning("Nhập tên đăng nhập,SDT hay email");
        return;
      }
      if (Password === "") {
        Alertwarning("Nhập mật khẩu");
        return;
      }

      //let passnew = await mainAction.EncryptString(params, dispatch);
      const pr1 = {
        Email: Email,
        Password: Password,
        Token: _token,
      };
      const params1 = {
        Json: JSON.stringify(pr1),
        func: "Trl_spStaff_Login",
      };

      setdisbtn(false);
      const result = await mainAction.API_spCallServerNoLoading(
        params1,
        dispatch
      );
      setdisbtn(true);
      if (result.length > 0) {
        if (result[0].NumberLogin < 5 && result[0].NumberLogin > 0) {
          Alertwarning(
            "Đăng nhập sai User hoặc mật khẩu : " +
              result[0].NumberLogin +
              " lần. Nếu đăng nhập sai quá 5 lần user sẽ bị khóa!"
          );
          return;
        }
        if (result[0].NumberLogin > 5) {
          Alerterror(
            "User bị khóa vì đăng nhập sai 5 lần. Vui lòng liên hệ HCNS!"
          );
          return;
        }

        if (Password === "Travel@123") {
          localStorage.setItem("UserCheckPass", result[0].StaffId);
          Alertwarning("Vui lòng đổi lại mật khẩu mới!");
          navigate("/doi-mat-khau");
          return;
        }
        if (result[0].BlockUser === 1) {
          Alertwarning("User của bạn đã bị khóa. Vui lòng liên hệ HCNS!");
          return;
        }

        localStorage.setItem("CreateBy", result[0].StaffId);
        localStorage.setItem("CreateName", result[0].StaffName);
        localStorage.setItem("Avatar", result[0].Avatar);
        localStorage.setItem("DepartmentId", result[0].DepartmentId);
        localStorage.setItem("BranchId", result[0].BranchId);
        localStorage.removeItem("DateLogin");
        localStorage.setItem("DateLogin", new Date());
        localStorage.setItem("PositionId", result[0].PositionId);
        localStorage.setItem("NickName", result[0].NickName);
        localStorage.setItem("Signature", result[0].Signature);
        localStorage.setItem("Token", _token);
        localStorage.setItem(
          "logsys",
          EncodeString(JSON.stringify(result[0] || {}))
        );
        const pr1 = {
          StaffId: result[0].StaffId,
          IPaddress: 0,
          Lat: lat,
          Lng: lon,
        };
        const params1 = {
          Json: JSON.stringify(pr1),
          func: "Trl_spStaff_LoginLog_Save",
        };
        const logoke = await mainAction.API_spCallServerNoLoading(
          params1,
          dispatch
        );
        //navigate("/trang-chu");
        window.location = "/trang-chu";
      } else {
        Alerterror("Sai tên đăng nhập hoặc mật khẩu");
      }
    } catch (error) {
      setdisbtn(true);
      Alerterror("Lỗi liên hệ IT");
    }
  };

  const handleClickLogin = (event) => {
    if (event.code === 'Enter'){
      Trl_spStaff_Login_Click()
    }
  }
  return (
    <div
      className="content-wrapper"
      style={{
        backgroundImage: `url("dist/img/chau-au-you-and-me-travel1.jpg")`,
        marginLeft: "0px",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div
        class="login-box login-page"
        style={{
          margin: "0 auto",
          width: "110%",
          marginLeft: "-6%",
          backgroundColor: "transparent",
        }}
      >
        <div class="card card-outline card-primary" style={{ width: "41%" }}>
          <div class="card-header text-center" style={{ height: "150px" }}>
            <div className="logo">
              <Img
                src="dist/img/logo.png"
                width="200"
                style={{ marginleft: "20%" }}
              />
            </div>
          </div>
          <div class="card-body">
            <div className="row">
              <div class="input-group mb-3 col-md-6">
                <input
                  type="email"
                  class="form-control"
                  placeholder="Username, email, phone"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div class="input-group-append">
                  <div class="input-group-text">
                    <span class="fas fa-user"></span>
                  </div>
                </div>
              </div>
              <div class="input-group mb-3 col-md-6 cursor-pointer">
                <input
                  type={isShow ? "text" : "password"}
                  class="form-control"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TooltipCustom content={"Ẩn hiện mật khẩu"}>
                  <div
                    class="input-group-append"
                    onClick={() => setIsShow(!isShow)}
                  >
                    {isShow ? (
                      <div class="input-group-text">
                        <span class="fas fa-eye-slash"></span>
                      </div>
                    ) : (
                      <div class="input-group-text">
                        <span class="fas fa-eye"></span>
                      </div>
                    )}
                  </div>
                </TooltipCustom>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 col-sm-12 col-sx-12">
                <div class="input-group mb-3">
                  <input
                    onKeyDown={event => handleClickLogin(event)}
                    type="text"
                    class="form-control"
                    placeholder="Nhập xác thực"
                    value={CaptCha}
                    onChange={(e) => setCaptCha(e.target.value)}
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-sx-12">
                <div class="input-group mb-3">
                  <div className="App form-control">
                    <div dangerouslySetInnerHTML={{ __html: CaptchaImage }} />
                  </div>
                  <TooltipCustom content={"Làm mới mã xác thực"}>
                    <div
                      class="input-group-append cursor-pointer"
                      onClick={LoadCapCha}
                    >
                      <div class="input-group-text">
                        <span class="fas fa-sync"></span>
                      </div>
                    </div>
                  </TooltipCustom>
                </div>
              </div>
              <div class="col-md-12">
                <div class="row">
                  <div className="col"></div>
                  <div className="col">
                    <button
                      disabled={!disbtn}
                      onClick={Trl_spStaff_Login_Click}
                      type="button"
                      class="btn color-system btn-block mt-3 btn-lg"
                    >
                      Đăng nhập
                    </button>
                  </div>
                  <div className="col"></div>
                </div>
              </div>
            </div>

            {/*  <div class="col-3">
                                <button disabled={!disbtn} onClick={Trl_spStaff_Login_Click} type="button" class="btn btn-primary btn-block">
                                    <i class="fa fa-user"></i>  Đăng nhập
                                </button>
                            </div> */}

            {/*    <div class="col-3">
                                <button disabled={!disbtn} onClick={e => Trl_spStaff_Login(10.8022524,106.6645121)} type="button" class="btn btn-primary btn-block">
                                    <i class="fa fa-user"></i>  Đăng nhập
                                </button>
                            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

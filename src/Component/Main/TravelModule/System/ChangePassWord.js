import React, { useState, useEffect, useRef } from "react";
import { IMAGES_DOMAIN } from "../../../../Services";
import { Link, useNavigate } from "react-router-dom";
import { Img } from "react-image";
import { Alertsuccess, Alertwarning } from "../../../../Utils";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";

export const ChangePassWord = () => {
  const navigate = useNavigate();
  useEffect(() => {
    let a = localStorage.getItem("CreateBy");
    if (localStorage.getItem("CreateBy") === null) {
      document.querySelector(".main-header").classList.add("display-none");
      document.querySelector(".main-sidebar").classList.add("display-none");
      document.querySelector(".main-footer").classList.add("display-none");
    } else {
      document.querySelector(".main-header").classList.remove("display-none");
      document.querySelector(".main-sidebar").classList.remove("display-none");
      document.querySelector(".main-footer").classList.remove("display-none");
    }
  }, []);
  //#region Khai báo biến
  const dispatch = useDispatch();
  let linkAvatar = IMAGES_DOMAIN;
  const UserCheckPass = localStorage.getItem("UserCheckPass");
  const [showicon, setshowicon] = useState(false);
  const PasswordNewRef = useRef();
  const PasswordNewConfirmRef = useRef();
  const PasswordOldRef = useRef();
  const [PasswordOld, setPasswordOld] = useState("");
  const [PasswordNew, setPasswordNew] = useState("");
  const [PasswordNewConfirm, setPasswordNewConfirm] = useState("");
  const [disbtn, setdisbtn] = useState(true);
  const Creater = localStorage.getItem("CreateBy");
  const bg = `url("dist/img/chau-au-you-and-me-travel1.jpg")`;
  const Change_Pass = async () => {
    if (Creater !== null && PasswordOld === "") {
      Alertwarning("Nhập mật hiện tại!");
      PasswordNewRef.current.focus();
      return;
    }
    if (Creater !== null && PasswordOld !== "") {
      const pr = {
        DepartmentId: 0,
        BranchId: 0,
        StaffSearch: "",
        StaffId: Creater,
        Creater: Creater,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spStaff_List",
      };

      const list = await mainAction.API_spCallServer(params, dispatch);
      if (list[0].Password !== PasswordOld) {
        Alertwarning("Mật khẩu hiện tại chưa đúng");
        return;
      }
    }
    if (PasswordNew === "") {
      Alertwarning("Nhập mật khẩu mới");
      PasswordNewRef.current.focus();
      return;
    }
    if (PasswordNew === "Travel@123") {
      Alertwarning("Vui lòng không sử dụng mật khẩu mặc định!");
      PasswordNewRef.current.focus();
      return;
    }
    if (PasswordNew.length < 8) {
      Alertwarning("Nhập Password >= 8");
      PasswordNewRef.current.focus();
      return;
    }
    if (PasswordNewConfirm === "") {
      Alertwarning("Nhập lại mật khẩu mới");
      PasswordNewConfirmRef.current.focus();
      return;
    }
    if (PasswordNew !== PasswordNewConfirm) {
      Alertwarning("Nhập lại mật khẩu chưa đúng");
      return;
    }

    const pr1 = {
      StaffId:
        localStorage.getItem("CreateBy") === null
          ? UserCheckPass
          : localStorage.getItem("CreateBy"),
      Password: PasswordNew,
    };
    const params1 = {
      Json: JSON.stringify(pr1),
      func: "Trl_spStaff_Update_PassWord",
    };

    setdisbtn(false);
    const result = await mainAction.API_spCallServer(params1, dispatch);
    Alertsuccess(result.ReturnMess);
    if (localStorage.getItem("CreateBy") === null) {
      navigate("/Login");
    } else {
      navigate("/thong-tin-nhan-vien");
      localStorage.removeItem("UserCheckPass");
    }
  };

  return (
    <>
      <div
        className="content-wrapper"
        style={{
          backgroundImage: Creater !== null ? "none" : bg,
          marginLeft: "0px !important",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div
          class="login-box login-page"
          style={{
            margin: Creater !== null ? "-89px 0 0 0" : " 0px auto 0px -6%",
            width: "110%",
            backgroundColor: "transparent",
          }}
        >
          <div
            class="card card-outline card-primary"
            style={{ width: Creater === null ? "41%" : "60%" }}
          >
            <div
              class="card-header text-center"
              style={{ height: Creater === null ? "150px" : "60px" }}
            >
              <div className={Creater === null ? "logo" : "display-none"}>
                <Img
                  src="dist/img/logo.png"
                  width="200"
                  style={{ marginleft: "20%" }}
                />
              </div>
              <div
                className={Creater !== null ? "display-block" : "display-none"}
              >
                <h3>ĐỔI MẬT KHẨU</h3>
              </div>
            </div>
            <div class="card-body">
              <div className="row">
                <div
                  className={
                    Creater === null
                      ? "display-none"
                      : "input-group mb-3 col-md-12"
                  }
                >
                  <input
                    type={!showicon ? "password" : "text"}
                    className="form-control"
                    placeholder="Nhập mật khẩu hiện tại"
                    ref={PasswordOldRef}
                    value={PasswordOld}
                    onChange={(e) => setPasswordOld(e.target.value)}
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">
                      <span class="fas fa-lock"></span>
                    </div>
                  </div>
                </div>
                <div class="input-group mb-3 col-md-6">
                  <input
                    type={!showicon ? "password" : "text"}
                    class="form-control"
                    placeholder="Nhập mật khẩu mới"
                    ref={PasswordNewRef}
                    value={PasswordNew}
                    onChange={(e) => setPasswordNew(e.target.value)}
                  />

                  <div class="input-group-append">
                    <div class="input-group-text">
                      {showicon == true ? (
                        <svg
                          onClick={(a) => setshowicon(!showicon)}
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon icon-tabler icon-tabler-eye iconlogin pointerIcon"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="White"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <circle cx="12" cy="12" r="2" />
                          <path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" />
                        </svg>
                      ) : (
                        <svg
                          onClick={(a) => setshowicon(!showicon)}
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon icon-tabler icon-tabler-eye-off iconlogin pointerIcon"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="White"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <line x1="3" y1="3" x2="21" y2="21" />
                          <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83" />
                          <path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <div class="input-group mb-3 col-md-6">
                  <input
                    type={!showicon ? "password" : "text"}
                    class="form-control"
                    placeholder="Nhập lại mật khẩu mới"
                    ref={PasswordNewConfirmRef}
                    value={PasswordNewConfirm}
                    onChange={(e) => setPasswordNewConfirm(e.target.value)}
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">
                      <span class="fas fa-lock"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <div class="row">
                    <div className="col"></div>
                    <div className="col">
                      <button
                        disabled={!disbtn}
                        onClick={(e) => Change_Pass()}
                        type="button"
                        class="btn btn-primary btn-block"
                      >
                        <i class="fa fa-user"></i> Đổi mật khẩu
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
    </>
  );
};

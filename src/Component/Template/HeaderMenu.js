import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Img } from "react-image";
import { mainAction } from "../../Redux/Actions";
import { Alerterror, Alertwarning, FormatDateJson } from "../../Utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IMAGES_DOMAIN } from "../../Services";

export const HeaderMenu = () => {
  const location = useLocation();
  let prm = useLocation();
  const navigate = useNavigate();
  const CreateBy = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const [Listnotification, setListnotification] = useState([]);
  const linkAvatar = IMAGES_DOMAIN;
  const [linkoke, setlinkoke] = useState(
    localStorage.getItem("Avatar") === null
      ? linkAvatar + "/Content/img/LogoNetco.png"
      : linkAvatar + localStorage.getItem("Avatar")
  );
  let nameoke =
    localStorage.getItem("CreateName") === null
      ? "Login pls"
      : localStorage.getItem("CreateName");
  let Nicknames =
    localStorage.getItem("NickName") === null
      ? nameoke
      : localStorage.getItem("NickName");

  let PositionId = +localStorage.getItem("PositionId");
  const [classNickName, setClassNickName] = useState("info ml-2");

  /* run after render */
  useEffect(() => {
    initialLanguage();
    const CreateBy = localStorage.getItem("CreateBy");
    const url = window.location.href;
    if (CreateBy === null && url.indexOf("/Login") === -1) {
      window.location = "/Login";
    }
    //setInterval(function () {Trl_spNotification_List_View(0, 0);}, 5000);
  }, []);

  useEffect(() => {
    handleClassNickName();
  }, [PositionId]);

  const handleClassNickName = () => {
    if (PositionId <= 6) {
      setClassNickName("info ml-2 text-danger text-i font-italic");
    } else if (PositionId > 6 && PositionId <= 8) {
      setClassNickName("info ml-2 text-orange text-i font-italic");
    } else if (PositionId > 8 && PositionId <= 10) {
      setClassNickName("info ml-2 text-primary text-i font-italic");
    } else if (PositionId > 10 && PositionId <= 12) {
      setClassNickName("info ml-2 text-success text-i font-italic");
    } else if (PositionId === 13) {
      setClassNickName("info ml-2 text-orange text-i font-italic");
    }
  };

  useEffect(() => {
    if (prm.search.length > 0 && prm.search.includes("dpid")) {
      let id = 0;
      let arrPr = prm.search.split("&");
      if (arrPr.length === 1) {
        id = +arrPr[0].replace(/\D/g, "");
      }
      if (arrPr.length > 1) {
        arrPr.forEach((item) => {
          if (item.includes("dpid")) {
            id = +item.replace(/\D/g, "");
          }
        });
      }
      if (+id !== 0) localStorage.setItem("Dpid", id);
    }
  }, [prm]);

  const dispatch = useDispatch();
  const initialLanguage = () => {
    dispatch(mainAction.checkLanguage(null));
  };

  useEffect(() => {
    let check = document.querySelector(".sidebar-collapse");
    if (
      (location.pathname === "/booking/tour-booking" ||
        location.pathname === "/tao-phieu-quyet-toan-tour") &&
      !check
    ) {
      document.querySelector("#hide-menubar").click();
    }
  }, [location]);

  //#region lưu log + update thông báo + kiểm tra đăng nhập

  useEffect(() => {
    let pr = new URLSearchParams(location.search);
    let currentUrl = window.location.href;
    let a = location.search;

    /*Lưu log hệ thống */
    //#region
    if (
      currentUrl.indexOf("/Login") === -1 &&
      currentUrl.indexOf("/dang-xuat") === -1 &&
      currentUrl.indexOf("/home") === -1 &&
      currentUrl.indexOf("/trang-chu") === -1 &&
      currentUrl.indexOf("/thong-tin-nhan-vien") === -1 &&
      currentUrl.indexOf("/doi-mat-khau") === -1 &&
      currentUrl.indexOf("/Dashboard") === -1 &&
      currentUrl.indexOf("/localhost") === -1 &&
      currentUrl.indexOf("/chu-ky-dien-tu") === -1 &&
      currentUrl.indexOf("/khach-hang/quan-ly-khach-hang") === -1 &&
      currentUrl.indexOf("/cms") === -1
    ) {
      if (location.search !== "" && location.search.indexOf("id=") !== -1) {
        if (pr.get("id") !== null) {
          Trl_spLogModule_Save(pr.get("id"), window.location.pathname);
        }
      } else {
        mainAction.LOADING({ IsLoading: false }, dispatch);
        Alerterror("Invalid function link !");
        setTimeout(() => {
          navigate("/news?id=56&dpid=0");
        }, 1000);
        return;
      }
    }
    //#endregion

    /* Update  đã tất cả đọc thông báo theo phòng ban */
    if (
      currentUrl.indexOf("tao-thong-bao") !== -1 &&
      currentUrl.indexOf("NoticationId") === -1
    ) {
      Trl_spNotification_Update_View(CreateBy, parseInt(pr.get("dpid")), 0);
    }
    /* Update  đã tất cả đọc thông báo nội bộ */
    if (
      currentUrl.indexOf("news") !== -1 &&
      currentUrl.indexOf("NoticationId") === -1
    ) {
      Trl_spNotification_Update_View(CreateBy, parseInt(pr.get("dpid")), 1);
    }
    /* Cập nhật dan hsachs thông báo trên chuông */
    if (a.split("NoticationId=")[1] !== null) {
      Trl_spNotification_List_View(
        parseInt(a.split("NoticationId=")[1]),
        0,
        parseInt(pr.get("dpid"))
      );
    }
    /* Kiểm tra qua ngày phải đăng nhập lại */
    if (
      FormatDateJson(localStorage.getItem("DateLogin"), 7) <
        FormatDateJson(new Date(), 7) &&
      currentUrl.indexOf("login") !== -1
    ) {
      Alertwarning("Bạn đã đăng nhập quá 24h!Vui lòng đăng nhập lại!");
      localStorage.removeItem("CreateBy");
      localStorage.removeItem("CreateName");
      localStorage.removeItem("Avatar");
      localStorage.removeItem("DepartmentId");
      localStorage.removeItem("BranchId");
      navigate("/login");
    }
    /* Kiểm tra khóa user */
    if (localStorage.getItem("BlockUser") === "1") {
      Alertwarning("User của bạn đã bị khóa.Vui lòng liên hệ HCNS!");
      navigate("/login");
    }
  }, [location.search]);
  //#endregion

  //#region thay đổi avartar
  useEffect(() => {
    setlinkoke(
      localStorage.getItem("Avatar") === null
        ? linkAvatar + "/Content/img/LogoNetco.png"
        : linkAvatar + localStorage.getItem("Avatar")
    );
    Trl_spNotification_List_View(0, 0);
  }, [localStorage.getItem("Avatar")]);

  //#endregion

  //#region  lưu log hệ thống
  const Trl_spLogModule_Save = async (MenuId, ActionName) => {
    const prl = {
      MenuId: MenuId,
      UserId: localStorage.getItem("CreateBy"),
      ActionName: ActionName,
    };
    const paramsl = {
      Json: JSON.stringify(prl),
      func: "Trl_spLogModule_Save",
    };
    const Listl = await mainAction.API_spCallServerNoLoading(paramsl, dispatch);
    if (Listl.Status === "NOK") {
      setTimeout(() => {
        window.location = "/Dashboard";
      }, 1000);
      return;
    }
  };
  //#endregion

  //#region thông báo
  const Trl_spNotification_List_View = async (
    NotificationId,
    KeyStatus,
    DepartId
  ) => {
    try {
      const pr = {
        Creater: localStorage.getItem("CreateBy"),
        CreateName: CreateName,
        KeySearch: "",
        State: 0,
        NotificationId: NotificationId,
        KeyStatus: KeyStatus,
        DepartmentId: DepartId,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spNotification_List_View",
      };
      const listview = await mainAction.API_spCallServerNoLoading(
        params,
        dispatch
      );
      await setListnotification(listview);
      setlinkoke(
        localStorage.getItem("Avatar") === null
          ? linkAvatar + "/Content/img/LogoNetco.png"
          : linkAvatar + localStorage.getItem("Avatar")
      );
    } catch (error) {
    }
  };
  const ViewAll = () => {
    navigate("/tao-thong-bao?id=32");
  };
  const View_Detail_Notification = (NotificationId) => {
    navigate("/tao-thong-bao?id=32&&NotificationId=" + NotificationId);
  };

  const Notification_Seen = (NotificationId) => {
    Trl_spNotification_List_View(NotificationId, 1);
  };

  const Trl_spNotification_Update_View = async (Creater, DeparmentId, Keys) => {
    try {
      const pr = {
        Creater: Creater,
        DeparmentId: DeparmentId,
        Keys: Keys,
      };
      const paramst = {
        Json: JSON.stringify(pr),
        func: "Trl_spNotification_Update_StaffView",
      };
      await mainAction.API_spCallServer(paramst, dispatch);
      Trl_spNotification_List_View(0, 0, DeparmentId);
    } catch (error) {
    }
  };
  //#endregion

  //#region chức năng liên quan đến nhân viên
  const StaffInfor = () => {
    navigate("/thong-tin-nhan-vien");
  };
  const ChangePassWord = () => {
    navigate("/doi-mat-khau");
  };
  const LogOut = () => {
    navigate("/dang-xuat");
  };
  //#endregion

  // #region chức năng tìm kiếm KH

  const [DataCustomer, setDataCustomer] = useState([]);
  const [ListDataCustomer, setListDataCustomer] = useState([]);
  const [SelectCustomer, setSelectCustomer] = useState("");
  const [IsAcctive, setIsAcctive] = useState(0);

  const onClickSelectCustomer = (e) => {
    setSelectCustomer(e.target.value);
    if (e.target.value.length === 0) {
      setIsAcctive(0);
    } else {
      setIsAcctive(1);
    }
    if (e.target.value.length >= 3) {
      Trl_spCustomerSearch_List(e.target.value.trim());
    }
  };

  // Search khach hàng theo điều kiện nhập
  const Trl_spCustomerSearch_List = async (e) => {
    const pr = {
      Creater: CreateBy,
      CustomerSearch: e,
    };
    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spCustomerSearch_List",
    };
    try {
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        //const List = [];
        /* result.map((e,i)=>{
          List.push({
            value:  e.CustomerId,
            label: `${e.CustomerName} - ${e.Phone}`
          })
        }) */
        setDataCustomer(result);
        //setListDataCustomer(List);
      } else {
        setIsAcctive(0);
      }
    } catch (e) {
      Alerterror("Lỗi dữ liệu tìm mã, Vui lòng liên hệ IT Netco!");
    }
  };

  // Chọn mã khách hàng đã search ra
  const onSelecteCustomer = (item) => {
    let data = ListDataCustomer.filter((a) => a.value === item.value)[0];
    setSelectCustomer(data.label);
    setIsAcctive(0);
    if (item.value !== 0) {
      navigate("/khach-hang/quan-ly-khach-hang?KH" + data.value);
    }
  };
  //#endregion

  return (
    <nav
      className="main-header navbar navbar-expand navbar-white navbar-light layout-hindden"
      style={{ height: 40 }}
    >
      <ul className="navbar-nav">
        <li className="nav-item">
          <a
            className="nav-link"
            id="hide-menubar"
            data-widget="pushmenu"
            href="#"
            role="button"
          >
            <i className="fas fa-bars"></i>
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/news?id=56&dpid=0" className="nav-link">
            Travel Management
          </Link>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        <li class="nav-item dropdown">
          <div class="form-group form-group2 mb-0 d-flex">
            <span class="fa fa-search form-control-icon"></span>
            <input
              type="text"
              class="form-control"
              placeholder="Tìm kiếm KH"
              value={SelectCustomer}
              onChange={(e) => onClickSelectCustomer(e)}
            />
          </div>
          <div
            id="div-sender-master"
            class={
              IsAcctive === 0
                ? "display-none"
                : "form-group form-group2 mb-0 d-flex"
            }
          >
            <div
              id="div-sender"
              class="col-md-12 col-sm-12 col-xs-12 div-sender"
              style={{
                maxHeight: "250px",
                height: "auto",
                overflowY: "auto",
                marginTop: 0,
                boxShadow:
                  "0 3px 6px rgba(0,0,0,.16),0 3px 6px rgba(0,0,0,.23)",
                borderBottomLeftRadius: "3px",
                borderBottomRightRadius: "3px",
              }}
            >
              {DataCustomer.length > 0 ? (
                DataCustomer.map((item, index) => {
                  return (
                    <div
                      className="block select-option-like fs-12"
                      title={item.CustomerName}
                      key={index}
                      value={item.CustomerId}
                      onClick={(e) => {
                        setSelectCustomer("");
                        setDataCustomer([]);
                        navigate(
                          "/khach-hang/quan-ly-khach-hang?KH" + item.CustomerId
                        );
                      }}
                    >{`${item.CustomerName} - ${
                      item?.Brithday ? FormatDateJson(item.Brithday, 7) : ""
                    }`}</div>
                  );
                })
              ) : (
                <div className="select-option-like" key={0}>
                  {SelectCustomer}
                </div>
              )}
            </div>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link"
            data-toggle="dropdown"
            href="#"
            aria-expanded="false"
          >
            <i
              class="fa fa-bell faa-ring animated fa-4x"
              style={{ fontSize: "24px", color: "#e91e63" }}
            ></i>

            <span class="badge badge-warning navbar-badge">
              {Listnotification?.length}
            </span>
          </a>
          <div
            class="dropdown-menu dropdown-menu-lg dropdown-menu-right" /* style="left: inherit; right: 0px;" */
          >
            <span class="dropdown-item dropdown-header">
              {Listnotification?.length} thông báo mới
            </span>
            <div class="dropdown-divider"></div>
            {Listnotification?.map((item, index) => {
              return (
                <a
                  class={index + 1 < 6 ? "dropdown-item" : "display-none"}
                  key={index + 1}
                >
                  <div class="media">
                    <img
                      src={item.Avatar}
                      alt="User Avatar"
                      onClick={(e) =>
                        View_Detail_Notification(item.NotificationId)
                      }
                      class="img-size-50 mr-3 img-circle"
                      height="50px"
                    />
                    <div class="media-body">
                      <h6 class="dropdown-item-title">
                        <p
                          style={{
                            width: "140px",
                            wordBreak: "break-word",
                            fontSize: "12px",
                            fontWeight: "bolder",
                          }}
                        >
                          {item.Title}
                        </p>
                        <span
                          class="float-right text-sm text-danger"
                          onClick={(e) =>
                            Notification_Seen(item.NotificationId)
                          }
                        >
                          <i class="fa fa-eye-slash"></i>
                        </span>
                      </h6>
                      <p
                        class="text-xs"
                        onClick={(e) =>
                          View_Detail_Notification(item.NotificationId)
                        }
                      >
                        {" "}
                        {item.CreateName}
                      </p>
                      <p class="text-xs text-muted">
                        <i class="far fa-clock mr-1"></i>{" "}
                        {FormatDateJson(item.CreateTime)}
                      </p>
                      <p
                        style={{
                          width: "180px",
                          wordBreak: "break-word",
                          fontSize: "10px",
                          cursor: "-webkit-grab",
                          cursor: "grab",
                        }}
                        onClick={(e) =>
                          View_Detail_Notification(item.NotificationId)
                        }
                      >
                        {" "}
                        {item.Contents}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
            <div class="dropdown-divider"></div>
            <a class="dropdown-item dropdown-footer" onClick={ViewAll}>
              Xem tất cả thông báo
            </a>
          </div>
        </li>

        <li class="nav-item dropdown">
          <a
            class="nav-link"
            data-toggle="dropdown"
            href="#"
            aria-expanded="false"
          >
            <span>
              <Img
                src={linkoke}
                className="img-circle elevation-2"
                alt="User Image"
                style={{ width: 35, height: 35, marginTop: "-6px" }}
              />
            </span>
            <span
              className={classNickName}
              // style={{
              //   color: "#009688",
              //   fontSize: "14px",
              //   fontStyle: "italic",
              // }}
            >
              {Nicknames}{" "}
            </span>
          </a>

          <div
            class="dropdown-menu dropdown-menu-right inf"
            style={{ minWidth: "170px !important" }}
          >
            <a class="dropdown-item bor_bot" onClick={(e) => StaffInfor()}>
              <div class="media">
                <div class="media-body">
                  <h6 class="dropdown-item-title">
                    <i class="fa fa-info-circle" aria-hidden="true"></i> Thông
                    tin
                  </h6>
                </div>
              </div>
            </a>
            <a class="dropdown-item bor_bot" onClick={(e) => ChangePassWord()}>
              <div class="media">
                <div class="media-body">
                  <h6 class="dropdown-item-title">
                    <i class="fa fa-key " aria-hidden="true"></i> Đổi mật khẩu
                  </h6>
                </div>
              </div>
            </a>
            <Link to="/chu-ky-dien-tu" class="dropdown-item bor_bot">
              <div class="media">
                <div class="media-body">
                  <h6 class="dropdown-item-title">
                    <i class="fa fa-pen" aria-hidden="true"></i> Chữ ký điện tử
                  </h6>
                </div>
              </div>
            </Link>
            <a class="dropdown-item" onClick={(e) => LogOut()}>
              <div class="media">
                <div class="media-body">
                  <h6 class="dropdown-item-title">
                    <i class="fa fa-unlock" aria-hidden="true"></i> Đăng xuất
                  </h6>
                </div>
              </div>
            </a>
          </div>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="fullscreen"
            href="#"
            role="button"
          >
            <i className="fas fa-expand-arrows-alt"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

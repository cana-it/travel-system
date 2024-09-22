import React, { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Img } from "react-image";
import { IMAGES_DOMAIN } from "../../Services";
import $ from "jquery";
import { useLocation } from "react-router-dom";
import { mainAction } from "../../Redux/Actions";
import {
  Alertwarning,
} from "../../Utils";
import I18n from "../../Language";
export const LeftMenu = ({ ModuleType = "TRAVEL" }) => {
  const dispatch = useDispatch();
  const CreateBy = localStorage.getItem("CreateBy");
  const [ListMenu, setListMenu] = useState([]);
  const location = useLocation();
  const linkAvatar = IMAGES_DOMAIN;
  const [, setlinkoke] = useState(
    localStorage.getItem("Avatar") === null
      ? linkAvatar + "/Content/img/LogoNetco.png"
      : linkAvatar + localStorage.getItem("Avatar")
  );
  let nameoke =
    localStorage.getItem("CreateName") === null
      ? "Login pls"
      : localStorage.getItem("CreateName");

  useLayoutEffect(() => {
    Trl_spMenuModule_LoadLeftMenu_Language_List("VN");
  }, []);

  useLayoutEffect(() => {
    Trl_spMenuModule_LoadLeftMenu_Language_List("VN");
  }, [ModuleType]);

  //#region load left menu
  const Trl_spMenuModule_LoadLeftMenu_Language_List = async (Key) => {
    const pr = {
      OfficerId: CreateBy,
      KeyLanguage: "VN",
      ModuleType: ModuleType,
    };
    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spMenuModule_LoadLeftMenu_Language_List",
    };

    const List = await mainAction.API_spCallServerNoLoading(params, dispatch);
    try {
      let menulevel1 = List.filter((p) => p.sLevel === 1);
      const newDatadt = menulevel1.map((item, Key1) => {
        return item.ActionName !== "" ? (
          <li className="nav-item" key={"level1" + item.MenuId}>
            <Link
              to={
                item.ActionName +
                "?id=" +
                item.MenuId +
                "&dpid=" +
                (item?.Keys || 0)
              }
              className="nav-link"
              title={item.Title}
            >
              <i style={{ marginRight: "5px" }}>{Key1 + 1 + "."}</i>
              <p>
                {item.MenuName}
                <i className="fas"></i>
              </p>
            </Link>
          </li>
        ) : (
          <li className="nav-item" key={"level1" + item.MenuId}>
            <a
              className="nav-link"
              title={item.MenuName}
              onClick={(e) =>
                Show_TotalNotification(item?.Keys || 0, item.MenuId)
              }
            >
              <i style={{ marginRight: "5px" }}>{Key1 + 1 + "."}</i>
              <p>
                {item.MenuName}
                <i className="right fas fa-angle-right"></i>
              </p>
            </a>
            {GeneralMenu(item.MenuId, List, Key1 + 1, 0, 0)}
          </li>
        );
      });

      setListMenu(newDatadt);
    } catch (er) {
      Alertwarning(I18n.t("Report.NoData"));
    }
  };
  const GeneralMenu = (MenuId, List, Stt, SttLevel, SttLevel3) => {
    setlinkoke(linkAvatar + localStorage.getItem("Avatar"));

    let child = List.filter((p) => p.ParentId === MenuId);

    return child.length > 0 ? (
      <ul className="nav nav-treeview ">
        {child.map((itm, Key) => {
          return itm.ControllerName === "" ? (
            <li
              key={"level2" + itm.MenuId}
              className={
                location.search.split("?id=")[1] === itm.ParentId
                  ? "nav-item activelmenu"
                  : "nav-item"
              }
            >
              <a
                className="nav-link"
                title={itm.MenuName}
                onClick={(e) =>
                  Show_TotalNotification(itm?.Keys || 0, itm.MenuId)
                }
              >
                <i style={{ marginRight: "5px" }}>
                  {" "}
                  {itm.sLevel === 2
                    ? Stt + "." + (Key + 1) + ". "
                    : Key + 1 + ". "}
                </i>
                <p>
                  {itm.MenuName}
                  <i
                    className={
                      itm.ControllerName === "K"
                        ? "right fas fa-angle-left"
                        : "right fas fa-angle-left  display-none"
                    }
                  ></i>
                </p>
              </a>
              {itm.sLevel === 2
                ? GeneralMenu(itm.MenuId, List, Stt, Key + 1, 0)
                : GeneralMenu(itm.MenuId, List, Stt, SttLevel, Key + 1)}
            </li>
          ) : itm.ActionName !== "" ? (
            <li
              key={"level2" + itm.MenuId}
              className={
                location.pathname === itm.ActionName
                  ? "nav-item activelmenu"
                  : "nav-item"
              }
            >
              <Link
                to={
                  itm.ActionName !== ""
                    ? itm.ActionName +
                      "?id=" +
                      itm.MenuId +
                      "&dpid=" +
                      (itm?.Keys || 0)
                    : ""
                }
                className="nav-link"
                title={itm.Title}
              >
                <i class="font13" style={{ marginRight: "5px" }}>
                  {" "}
                  {itm.sLevel === 2
                    ? Stt + "." + (Key + 1) + ". "
                    : Key + 1 + ". "}
                </i>
                <p class="font13"> {itm.MenuName}</p>
                {itm.MenuName === "THÔNG BÁO" ||
                itm.MenuName.indexOf("GIAO") !== -1 ||
                itm.MenuName.indexOf("PHÉP") !== -1 ? (
                  <sup
                    style={{ right: "15px" }}
                    className="badge badge-danger navbar-badge"
                  >
                    {" "}
                    <p
                      className={
                        itm.MenuName.indexOf("THÔNG") !== -1
                          ? (itm?.Keys || 0) + "TB"
                          : itm.MenuName.indexOf("GIAO") !== -1
                          ? (itm?.Keys || 0) + "GV"
                          : itm.MenuName.indexOf("PHÉP") !== -1
                          ? (itm?.Keys || 0) + "NP"
                          : ""
                      }
                    ></p>
                  </sup>
                ) : (
                  ""
                )}
                <i
                  className={
                    itm.ControllerName === "K"
                      ? "right fas fa-angle-left"
                      : "right fas fa-angle-left  display-none"
                  }
                ></i>
              </Link>
              {itm.sLevel === 2
                ? GeneralMenu(itm.MenuId, List, Stt, Key + 1, 0)
                : GeneralMenu(itm.MenuId, List, Stt, SttLevel, Key + 1)}
            </li>
          ) : (
            <li
              key={"level2" + itm.MenuId}
              className={
                location.pathname === itm.ActionName
                  ? "nav-item activelmenu"
                  : "nav-item"
              }
            >
              <a
                className="nav-link"
                onClick={(e) =>
                  Show_TotalNotification(itm?.Keys || 0, itm.MenuId)
                }
              >
                <i style={{ marginRight: "5px" }}>
                  {" "}
                  {itm.sLevel === 2
                    ? Stt + "." + (Key + 1) + ". "
                    : Key + 1 + ". "}
                </i>
                <p> {itm.MenuName}</p>

                <i
                  className={
                    itm.ControllerName === "K"
                      ? "right fas fa-angle-left"
                      : "right fas fa-angle-left  display-none"
                  }
                ></i>
              </a>
              {itm.sLevel === 2
                ? GeneralMenu(itm.MenuId, List, Stt, Key + 1, 0)
                : GeneralMenu(itm.MenuId, List, Stt, SttLevel, Key + 1)}
            </li>
          );
        })}
      </ul>
    ) : (
      <></>
    );
  };
  //#endregion

  //#region show thoong baos
  const Show_TotalNotification = async (DepartmentId, MenuId) => {
    const prt = {
      DepartmentId: DepartmentId,
      MenuId: MenuId,
    };
    const paramst = {
      Json: JSON.stringify(prt),
      func: "Trl_spNotification_List_ByDepartmentId",
    };
    const List = await mainAction.API_spCallServerNoLoading(paramst, dispatch);
    let a = DepartmentId + "TB";
    let b = DepartmentId + "GV";
    let c = DepartmentId + "NP";
    $("." + a).html(JSON.parse(List[0].Notification_Total)[0].Total);
    $("." + b).html(JSON.parse(List[0].Task_Total)[0].Total);
    $("." + c).html(JSON.parse(List[0].Leave_Total)[0].Total);
  };
  //#endregion

  return (
    <aside
      className="main-sidebar sidebar-dark-primary elevation-4 layout-hindden"
      style={{ backgroundColor: "#009688" }}
    >
      <div className="sidebar">
        <div
          className="mt-3 pb-3 mb-3 text-center"
          style={{ borderBottom: "1px solid #9e9e9e7d" }}
        >
          <Link to="/trang-chu" title="Trang chủ">
            <Img src="/dist/img/logo.png" style={{ width: "130px" }} />
          </Link>
        </div>
        <nav class="mt-2">
          <ul
            class="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {ListMenu}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

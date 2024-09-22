import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import I18n from "../../../../Language";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";
import { TrackingGoogleMaps, SelectStaff } from "../../../../Common";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  FormatDateJson,
  FirstOrLastDayinMonth,
} from "../../../../Utils";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "react-google-maps";
import { StaffMap } from "./StaffMap";

export const Staff_LoginLogInMap = () => {
  const dispatch = useDispatch();
  // run befor render the layout

  const [Fromdate, setFromdate] = useState(
    FirstOrLastDayinMonth(new Date(), 1)
  );
  const [Todate, setTodate] = useState(new Date());
  const [MenuId, setMenuId] = useState(0);
  const [AccountId, setAccountId] = useState(0);
  const [Zoom, setZoom] = useState(6);
  const [Center, setCenter] = useState({
    lat: 16.45545209151914,
    lng: 107.55564680631976,
  });
  const [HiddenTable, setHiddenTable] = useState(true);
  const [disable, setdisable] = useState(false);
  const [fdate, setfdate] = useState(FirstOrLastDayinMonth(new Date(), 1));
  const [tdate, settdate] = useState(new Date());
  const arrService = [
    "#9B8354",
    "#1aadce",
    "#f28f43",
    "#43f2da",
    "#9B5454",
    "#54849B",
    "#2f7ed8",
    "#492970",
    "#9B8354",
    "#1aadce",
    "#f28f43",
    "#43f2da",
    "#9B5454",
    "#54849B",
    "#2f7ed8",
    "#492970",
  ];
  const [AreaId, setAreaId] = useState({
    value: -1,
    label: I18n.t("System.Select"),
  });
  const [PostId, setPostId] = useState({
    value: -1,
    label: I18n.t("System.Select"),
  });
  const [OfficerIdS, setOfficerIdS] = useState({
    value: -1,
    label: I18n.t("System.Select"),
  });
  const [hidden, sethidden] = useState(false);
  const [dataOfficer, setdataOfficer] = useState([]);
  const [ToTalOff, setToTalOff] = useState(0);
  const [TotalOn, setTotalOn] = useState(0);
  const UserId = localStorage.getItem("CreateBy");
  const UserName = localStorage.getItem("CreateName");
  const [ShowMaps, setShowMaps] = useState(false);
  const PreviewWithMap = withScriptjs(withGoogleMap(StaffMap));
  const [TypeRun, setTypeRun] = useState(1);
  const [PostIdMap, setPostIdMap] = useState(0);
  const [OfficerIdMap, setOfficerIdMap] = useState(0);

  const [DataPostOffice, setDataPostOffice] = useState([]);
  useEffect(() => {
    if (TypeRun !== 1) setShowMaps(true);
  }, [TypeRun]);

  //#region Danh sach xe co lo trinh
  const Trl_spStaff_LoginLog_List = async () => {
    const pr = {
      FromDate: FormatDateJson(Fromdate),
      ToDate: FormatDateJson(Todate),
      AccountId: AccountId,
    };

    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spStaff_LoginLog_List",
    };

    try {
      const result = await mainAction.API_spCallServer(params, dispatch);

      if (result.length > 0) {
        setdataOfficer(result);
        setHiddenTable(false);
        setTypeRun(TypeRun + 1);
      } else {
        Alertwarning("Không có lịch sử nhân viên đăng nhập");
        setShowMaps(false);
        setdataOfficer([]);
        setToTalOff(0);
        setTotalOn(0);
        return;
      }
    } catch (error) {
      Alertwarning("Đã có lỗi xảy ra, vui lòng liên hệ IT");
    }
  };
  const ShowHide = async (Keys) => {
    if (Keys === 0) {
      document.querySelector(".main-header").classList.add("display-none");
      document.querySelector(".main-sidebar").classList.add("display-none");
      document.querySelector(".main-footer").classList.add("display-none");
      document.querySelector(".searchs").classList.add("display-none");
      document.querySelector(".mapoff").classList.add("OfficerMaps");
      document.querySelector(".main-header").classList.add("marginleft0");
    } else {
      document.querySelector(".main-header").classList.remove("display-none");
      document.querySelector(".main-sidebar").classList.remove("display-none");
      document.querySelector(".main-footer").classList.remove("display-none");
      document.querySelector(".searchs").classList.remove("display-none");
      document.querySelector(".mapoff").classList.remove("OfficerMaps");
      document.querySelector(".main-header").classList.remove("marginleft0");
    }
  };
  const onselectPostId = async (e) => {
    setPostId(e);
    setOfficerIdS({ value: -1, label: I18n.t("System.Select") });
  };

  //#endregion
  return (
    <>
      <div className="content-wrapper pt-2">
        <section className="content">
          <div className="container-fluid">
            <div className="card card-primary">
              {/* Header */}
              <div className="card-header border-left-red">
                <div className="row">
                  <div className="col-md-6">
                    <h3 className="card-title">
                      <i class="fa-chart-column" />
                      Lịch sử đăng nhập trên map
                    </h3>
                  </div>
                  <div className="col-md-6 card-header-btn">
                    <a
                      className="btn btn-primary btn-sm float-right btn-header"
                      onClick={(e) => {
                        Trl_spStaff_LoginLog_List();
                      }}
                    >
                      <i className="fa fa-eye mr-2" />
                      {I18n.t("System.View")}
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-body-form col-md-12">
                <div className="row mt-3">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form__title">Từ ngày </label>
                      <DateTimePicker
                        className="form-control"
                        onChange={(date) => setFromdate(date)}
                        value={Fromdate}
                        format="MM/dd/yyyy HH:mm:ss"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form__title">Đến ngày</label>
                      <DateTimePicker
                        className="form-control"
                        onChange={(date) => setTodate(date)}
                        value={Todate}
                        format="MM/dd/yyyy HH:mm:ss"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form__title">Nhân viên </label>
                      <SelectStaff
                        onSelected={(e) => setAccountId(e.value)}
                        onAccountId={AccountId}
                        items={AccountId}
                        BranchId={0}
                        DepartmentId={0}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  HiddenTable === true
                    ? "card display-none"
                    : "card display-block mapoff"
                }
              >
                <div class="card-header">
                  <div class="row">
                    <div className="col-md-6">
                      {I18n.t("Report.Noted")} :
                      <span
                        className=" text-success ml-3"
                        title="Đang di chuyển"
                        style={{ cursor: "pointer", fontSize: "11px" }}
                      >
                        <img
                          src="./assets/img/icon-On.png"
                          alt=""
                          width="25px"
                        />
                        Đăng nhập gần nhất <strong> </strong>
                      </span>
                      <span
                        className="ml-3"
                        title="Đứng yên"
                        style={{ cursor: "pointer", fontSize: "12px" }}
                      >
                        <img
                          src="./assets/img/icon-Of.png"
                          alt=""
                          width="25px"
                        />
                        Đã từng đăng nhập<strong> </strong>
                      </span>
                      <span
                        className="ml-3"
                        title="Đứng yên"
                        style={{ cursor: "pointer", fontSize: "12px" }}
                      >
                        Tổng <strong> ({dataOfficer.length}) </strong>
                      </span>
                    </div>

                    <div className="col-md-6">
                      <button
                        type="button"
                        class="btn btn-xs btn-danger pull-right margin-left-5"
                        onClick={(e) => ShowHide(1)}
                      >
                        <i class="fa fa-compress" aria-hidden="true"></i> Thu
                        nhỏ
                      </button>
                      <button
                        type="button"
                        class="btn btn-xs btn-warning pull-right margin-left-5"
                        onClick={(e) => ShowHide(0)}
                      >
                        <i class="fa fa-expand" aria-hidden="true"></i> Phóng to
                      </button>
                    </div>
                  </div>
                </div>
                <div></div>
                <div class="">
                  {ShowMaps && (
                    <TrackingGoogleMaps
                      dataof={dataOfficer}
                      Typerunset={TypeRun}
                      OfficerId={OfficerIdMap}
                      ShowMaps={ShowMaps}
                    ></TrackingGoogleMaps>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

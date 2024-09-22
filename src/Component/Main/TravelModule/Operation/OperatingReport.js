import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  FormatDateJson,
  ExportExcel,
  ConfirmAlert,
  HandleTextArea,
} from "../../../../Utils";
import {
  DataTable,
  SelectServiceSale,
  SelectTourGuider,
} from "../../../../Common";
import { IMAGES_DOMAIN } from "../../../../Services";
import "react-confirm-alert/src/react-confirm-alert.css";
import moment from "moment";


export const OperatingReport = () => {
  const dispatch = useDispatch();
  const Creater = +localStorage.getItem("CreateBy");

  const [serviceSale, setServiceSale] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [landTour, setLandTour] = useState(0);
  const [booking, setBooking] = useState(null);
  const [listOperatingReport, setListOperatingReport] = useState([]);
  const [OperatingReportId, setOperatingReportId] = useState(0);
  const [isEdit, setIsEdit] = useState(true);
  const [tourGuide, setTourGuide] = useState(0);
  const [isClone, setIsClone] = useState(false);
  const [overallReview, setOverallReview] = useState("");
  const [sampleDay, setSampleDay] = useState({
    Day: 1,
    GeneralReview: "",
    Journey: "",
    Vehicle: "",
    Hotel: "",
    Restaurant: "",
  });

  const [dayData, setDayData] = useState([sampleDay]);

  useEffect(() => {
    Trl_spOperatingReport_List();
  }, []);

  const Trl_spBooking_CustomerPlane_View = async (sv) => {
    try {
      const pr = {
        BookingId: sv.BookingId || 0,
        CreateName: +Creater,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBooking_CustomerPlane_View",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      setBooking(sv);
      // setDataBookingStatus(res)
    } catch (error) {
      ;
    }
  };

  const Trl_spOperatingReport_Cancer = () => {
    setDayData([sampleDay]);
    setOperatingReportId(0);
    setQuantity("");
    setServiceSale(0);
    setBooking(null);
    setIsEdit(true);
    setTourGuide(0);
    setIsClone(false);
  };

  const Trl_spOperatingReport_Save = async () => {
    if (booking === null) {
      Alertwarning("Vui lòng chọn Tour");
      return;
    }

    try {
      const dt = dayData.map((item, index) => {
        return {
          OperatingReportDetailId: item.OperatingReportDetailId || 0,
          OperatingReportId: OperatingReportId,
          Day: index + 1,
          Journey: HandleTextArea(item.Journey),
          GeneralReview: HandleTextArea(item.GeneralReview),
          Vehicle: HandleTextArea(item.Vehicle),
          Hotel: HandleTextArea(item.Hotel),
          Restaurant: HandleTextArea(item.Restaurant),
          Creater: +Creater,
        };
      });
      const pr = {
        OperatingReportId: +OperatingReportId,
        BookingId: +serviceSale.BookingId || 0,
        TourGuideId: +tourGuide.value || 0,
        Quantity: +quantity || "",
        OverallReview: HandleTextArea(overallReview),
        Creater: +Creater,
        detail: dt,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperatingReport_Save",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Lưu thành công");
      }
    } catch (error) {
      ;
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const Trl_spOperatingReport_List = async (OperatingReportId) => {
    setIsEdit(true);
    try {
      const pr = {
        OperatingReportId: 0,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperatingReport_List",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.length > 0) {
        setListOperatingReport(res);
        setIsClone(false);
        // Alertsuccess("Lưu thành công");
      } else {
        Alertwarning("Không có dữ liệu");
        setListOperatingReport([]);
      }
    } catch (error) {
      ;
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const Trl_spOperatingReport_Delete = async (id) => {
    setIsClone(false);
    try {
      const pr = {
        OperatingReportId: id,
        Creater: +Creater,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperatingReport_Delete",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Lưu thành công");
        await Trl_spOperatingReport_List();
      } else {
        Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
        setListOperatingReport([]);
      }
    } catch (error) {
      ;
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const Trl_spOperatingReport_Edit = (dataEdit, type = 0) => {
    
    type === 1 ? setIsEdit(false) : setIsEdit(true);
    setIsClone(false);
    let service = {
      value: dataEdit.ServiceSaleId,
      BookingId: dataEdit.BookingId,
      ServiceSaleCode: dataEdit.ServiceSaleCode,
      ServiceSaleName: dataEdit.ServiceSaleName,
      DateSaleFrom: dataEdit.DateSaleFrom,
      DateSaleTo: dataEdit.DateSaleTo,
    };
    setTourGuide({ value: dataEdit.TourGuideId });
    setQuantity(dataEdit.Quantity);
    setOverallReview(HandleTextArea(dataEdit.OverallReview, 1));
    setDayData(
      dataEdit.Detail.map((item) => ({
        ...item,
        Journey: HandleTextArea(item.Journey, 1),
        GeneralReview: HandleTextArea(item.GeneralReview, 1),
        Vehicle: HandleTextArea(item.Vehicle, 1),
        Hotel: HandleTextArea(item.Hotel, 1),
        Restaurant: HandleTextArea(item.Restaurant, 1),
      }))
    );
    setOperatingReportId(dataEdit.OperatingReportId);
    setServiceSale(service);
    Trl_spBooking_CustomerPlane_View(service);
    setQuantity(dataEdit.Quantity);
    document.getElementById("tab_1").click();
  };

  const columns = [
    {
      Header: "Options",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-xs btn-warning"
            onClick={() => Trl_spOperatingReport_Edit(row._original)}
          >
            {" "}
            <i class="fa fa-eye"></i> Xem
          </button>{" "}
          <button
            className="btn btn-xs btn-danger"
            onClick={() =>
              ConfirmAlert("Xác nhận", "Bạn có chắc chắn muốn xóa không?", () =>
                Trl_spOperatingReport_Delete(row._original.OperatingReportId)
              )
            }
          >
            {" "}
            <i class="fa fa-trash"></i> Xóa
          </button>{" "}
          <button
            className="btn btn-xs btn-success"
            onClick={() => Trl_spOperatingReport_Excel(row._original)}
          >
            {" "}
            <i class="fa fa-download"></i> Excel
          </button>{" "}
        </div>
      ),
      minWidth: 300,
      fixed: "left",
    },
    {
      Header: "Mã Tour",
      accessor: "ServiceSaleCode",
      minWidth: 250,
      fixed: "left",
    },
    {
      Header: "Tên Tour",
      accessor: "ServiceSaleName",
      minWidth: 250,
      fixed: "left",
    },
    {
      Header: "Người tạo",
      accessor: "CreateName",
      minWidth: 150,
    },
    {
      Header: "Thời gian",
      accessor: "CreateTime",
      minWidth: 150,
      Cell: (obj) => FormatDateJson(obj.value, 10),
    },
    {
      Header: "Người Sửa",
      accessor: "EditName",
      minWidth: 150,
    },
    {
      Header: "Thời gian sửa",
      accessor: "EditTime",
      minWidth: 150,
      Cell: (obj) => {
        return obj?.value ? FormatDateJson(obj.value, 10) : "";
      },
    },
  ];

  const EditableCell = ({
    ivalue = "",
    index = "",
    updateMyData,
    property = "",
    type = 0,
    edit = true,
  }) => {
    const [value, setValue] = useState(ivalue);
    const onChange = (e) => {
      // setValue(e.currentTarget.textContent);
      setValue(e.target.value);
    };

    const onBlur = (e) => {
      // setValue(value);
      updateMyData(index, value, property, type);
    };

    useEffect(() => {
      setValue(ivalue);
    }, [ivalue]);

    return (
      <>
        <textarea
          type="text"
          class="form-control2 "
          rows="10"
          value={value}
          onInput={onChange}
          onBlur={onBlur}
        />
      </>
      // <div
      //   contentEditable={edit}
      //   suppressContentEditableWarning="true"
      //   onInput={onChange}
      //   onBlur={onBlur}
      //   className="padding-td w-100"
      // >
      //   <span className=""> {value2}</span>
      // </div>
    );
  };

  const updateMyData = (index, value, property, type = 0) => {
    if (type === 0) {
      // setSkipPageReset(true);
      setDayData((old) =>
        old.map((row, i) => {
          if (i === index) {
            return {
              ...old[index],
              [property]: value,
            };
          }
          return row;
        })
      );
    }
    if (type === 1) {
      setOverallReview(value);
    }
  };

  const RenderRowTable = useMemo(() => {
    return dayData.map((item, index) => {
      if (index === 0) {
        return (
          <div class="card p-0" key={index}>
            <div>
              <div class="d-flex align-items-center padding-td pl-1 border-bottom-1">
                <div className="align-middle font-weight-bold">
                  Ngày: {index + 1}
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-bordered  table-request-tour  mb-0 ">
                <thead>
                  <tr className="title-guider">
                    <th style={{ minWidth: 100 }} className="align-middle">
                      NGÀY KHỞI HÀNH - ĐÁNH GIÁ CHUNG
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dayData.length > 0 ? (
                    <tr>
                      <td className="text-center align-middle">
                        <div class="input-group ">
                          <EditableCell
                            ivalue={item.GeneralReview}
                            index={index}
                            updateMyData={updateMyData}
                            property="GeneralReview"
                          />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <td className="text-center align-middle" colSpan={9}>
                      Không có dữ liệu
                    </td>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      return (
        <div class="card p-0" key={index}>
          <div>
            <div class="d-flex align-items-center padding-td pl-1 border-bottom-1">
              <div className="align-middle font-weight-bold">
                Ngày: {index + 1}
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered  table-request-tour   mb-0 ">
              <thead>
                <tr className="title-guider">
                  <th style={{ minWidth: 100 }} className="align-middle">
                    HÀNH TRÌNH
                  </th>
                  <th
                    style={{
                      minWidth: 100,
                    }}
                    className="align-middle"
                  >
                    XE DI CHUYỂN
                  </th>

                  <th style={{ minWidth: 100 }} className="align-middle">
                    NHÀ HÀNG
                  </th>
                  <th style={{ minWidth: 100 }} className="align-middle">
                    KHÁCH SẠN
                  </th>
                  <th style={{ minWidth: 100 }} className="align-middle">
                    ĐÁNH GIÁ CHUNG
                  </th>
                </tr>
              </thead>
              <tbody>
                {dayData.length > 0 ? (
                  <tr>
                    <td className="text-center align-middle">
                      <div class="input-group ">
                        <EditableCell
                          ivalue={item.Journey}
                          index={index}
                          updateMyData={updateMyData}
                          property="Journey"
                        />
                      </div>
                    </td>
                    <td className="text-center align-middle">
                      <div class="input-group ">
                        <EditableCell
                          ivalue={item.Vehicle}
                          index={index}
                          updateMyData={updateMyData}
                          property="Vehicle"
                        />
                      </div>
                    </td>
                    <td className="text-center align-middle">
                      <div class="input-group ">
                        <EditableCell
                          ivalue={item.Restaurant}
                          index={index}
                          updateMyData={updateMyData}
                          property="Restaurant"
                        />
                      </div>
                    </td>
                    <td className="text-center align-middle">
                      <div class="input-group ">
                        <EditableCell
                          ivalue={item.Hotel}
                          index={index}
                          updateMyData={updateMyData}
                          property="Hotel"
                        />
                      </div>
                    </td>
                    <td className="text-center align-middle">
                      <div class="input-group ">
                        <EditableCell
                          ivalue={item.GeneralReview}
                          index={index}
                          updateMyData={updateMyData}
                          property="GeneralReview"
                        />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <td className="text-center align-middle" colSpan={9}>
                    Không có dữ liệu
                  </td>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    });
  }, [dayData]);

  const addNewDay = () => {
    let newDay = [...dayData, sampleDay];
    setDayData(newDay);
  };

  const Trl_spOperatingReport_Excel = async (dataEx) => {
    try {
      const prP = {
        OperatingReportId: dataEx.OperatingReportId || 0,
        CreateName: +Creater,
        BookingId: dataEx.BookingId,
      };
      const paramsP = {
        Json: JSON.stringify(prP),
        func: "Trl_spOperatingReport_Excel",
      };
      const res = await mainAction.API_spCallServer(paramsP, dispatch);
      let dataExport = {
        ...res[0],
        FileName:
          "EUROTRAVEL - BÁO CÁO TOUR DÀNH CHO HƯỚNG DẪN VIÊN " +
          dataEx.ServiceSaleCode,
      };
      const params = {
        Json: JSON.stringify(dataExport),
        func: "Trl_spOperatingReport_Excel",
      };

      const result = await mainAction.API_spCallExportExcel(params, dispatch);
      if (result.resultCode === 0) {
        const link = document.createElement("a");
        link.href = IMAGES_DOMAIN + result.Message;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="card card-primary">
          <ul className="nav float-left">
            <li className="nav-item">
              <a
                id="tab_1"
                className="nav-link active"
                href="#tab_1add"
                data-toggle="tab"
              >
                KHỞI TẠO PHIẾU
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link " href="#tab_2" data-toggle="tab">
                DANH SÁCH
              </a>
            </li>
          </ul>
          <div className="body-padding">
            <div className="tab-content" id="custom-tabs-two-tabContent">
              <div
                className="tab-pane fade show active"
                id="tab_1add"
                role="tabpanel"
                aria-labelledby="custom-tabs-two-home-tab"
              >
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-4">
                      <h3 className="card-title">
                        <i className="fas fa-plus" />
                        <span className="font-weight-bold">
                          Khởi tạo phiếu yêu cầu
                        </span>
                      </h3>
                    </div>
                    <div class="col-sm-12 col-md-8 margin-top-5s">
                      <button
                        type="button"
                        class="btn btn-sm btn-danger pull-right margin-left-10"
                        onClick={Trl_spOperatingReport_Cancer}
                      >
                        <i class="fa fa-trash pr-2"></i>
                        Hủy bỏ
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-success pull-right margin-left-10"
                        onClick={() => {
                          ConfirmAlert(
                            "Xác nhận",
                            "Bạn có chắc chắn muốn lưu không?",
                            () => Trl_spOperatingReport_Save()
                          );
                        }}
                      >
                        <i class="fa fa-plus pr-2"></i>
                        {OperatingReportId !== 0 ? "Cập nhật" : "Lưu"}
                      </button>

                      <button
                        type="button"
                        class="btn btn-sm btn-primary pull-right margin-left-10"
                        onClick={() =>
                          Trl_spBooking_CustomerPlane_View(serviceSale)
                        }
                      >
                        <i class="fa fa-search pr-2"></i>
                        Tìm kiếm
                      </button>

                      <div
                        class="form-group pull-right"
                        style={{ marginTop: "-4px", width: "30%" }}
                      >
                        <div
                          class="input-group index-select"
                          style={{ width: "100%" }}
                        >
                          <SelectServiceSale
                            onSelected={(e) => {
                              if (!isClone) {
                                setServiceSale(e);
                                setBooking(null);
                                setOperatingReportId(0);
                                setIsEdit(true);
                              }
                              setServiceSale(e);
                              setIsEdit(true);
                            }}
                            items={serviceSale?.value || 0}
                            className={"w-100 select-custom z-maxx"}
                            type={1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={booking ? "card-body tour-request" : "d-none"}>
                  <div className="center-item mb-2">
                    <h3 class=" font-weight-bold text-dark fs-18">
                      BÁO CÁO TOUR DÀNH CHO HƯỚNG DẪN VIÊN
                    </h3>
                  </div>
                  <div className="row">
                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-3 font-weight-bold d-flex align-items-center">
                          THÔNG TIN TOUR:
                        </div>
                        <div className="col-9">
                          {serviceSale.ServiceSaleCode}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-3 font-weight-bold d-flex align-items-center">
                          NGÀY KHỞI HÀNH:
                        </div>

                        <div className="col-9">
                          {" "}
                          {FormatDateJson(serviceSale.DateSaleFrom, 7)}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-3 font-weight-bold d-flex align-items-center">
                          SỐ LƯỢNG KHÁCH:
                        </div>
                        <div className="col-9">
                          <div class="input-group">
                            <input
                              type="text"
                              class="form-control-none"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-3 font-weight-bold d-flex align-items-center">
                          HƯỚNG DẪN VIÊN
                        </div>
                        <div className="col-9">
                          <div class="input-group">
                            <SelectTourGuider
                              onSelected={(e) => setTourGuide(e)}
                              className={"w-100 select-custom2 z-max "}
                              TourGuiderId={tourGuide.value}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12 p-0 mt-3">{RenderRowTable}</div>
                    <div className="col-md-12 p-0 mt-3 center-item">
                      <button className="btn btn-info " onClick={addNewDay}>
                        <i className="fa fa-plus mr-2" />
                        Thêm ngày
                      </button>
                    </div>
                    <div className="col-md-12 p-0 mt-3">
                      <div class="card p-0">
                        <div class="table-responsive">
                          <table class="table table-bordered  table-request-tour    mb-0  ">
                            <thead>
                              <tr className="title-guider">
                                <th
                                  style={{ minWidth: 100 }}
                                  className="align-middle"
                                >
                                  ĐÁNH GIÁ TỔNG QUAN
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-center align-middle">
                                  <div class="input-group ">
                                    <EditableCell
                                      ivalue={overallReview}
                                      index={0}
                                      updateMyData={updateMyData}
                                      property="overallReview"
                                      type={1}
                                    />
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="tab_2"
                role="tabpanel"
                aria-labelledby="custom-tabs-two-profile-tab"
              >
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-6">
                      <h3 className="card-title">
                        <i className="fas fa-plus" />
                        <span className="font-weight-bold">
                          Quản lý phiếu điều tour
                        </span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      <button
                        className="btn btn-danger btn-sm float-right btn-header"
                        type="button"
                        onClick={Trl_spOperatingReport_List}
                      >
                        <i className="fa fa-search mr-2 " />
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body ">
                  <div className="row">
                    <DataTable data={listOperatingReport} columns={columns} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

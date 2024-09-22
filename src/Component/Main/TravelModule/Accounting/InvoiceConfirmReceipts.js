import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertsuccess,
  Alerterror,
  FormatDateJson,
  FormatMoney,
  ConfirmAlert,
  ExportExcel,
} from "../../../../Utils";
import { DataTable, ShowFiles } from "../../../../Common";
//import Modal from 'react-modal';
import Modal from "react-bootstrap/Modal";
import { MoneyToText } from "../../../../Utils/MoneyToText";
import moment from "moment";
import { Button } from "react-bootstrap";
import { Img } from "react-image";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { InvoiceConfirmReceiptTemp } from "./InvoiceConfirmReceiptTemp";

export const InvoiceConfirmReceipts = () => {
  //Phiếu đề thu
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");

  const [state, setState] = useState({
    data: [],
    dataThu: [],
    dataDxTour: [],
    dataDxNb: [],
    isShow: 0, //0 là show main page, 1 show ds thu, 2 show ds chi tour, 3 show ds chi nội bộ,
    StatusShow: 1,
  });

  const [InvoiceSearch, setInvoiceSearch] = useState("");
  const [TimeSearch, setTimeSearch] = useState([
    new Date(
      moment(new Date().setDate(new Date().getDate() - 7)).startOf("date")
    ),
    new Date(moment(new Date()).endOf("date")),
  ]);

  const Trl_spInvoice_List = async () => {
    try {
      const pr = {
        Creater: Creater,
        InvoiceType: "A",
        InvoiceSearch: InvoiceSearch,
        FromDate:
          TimeSearch !== undefined
            ? FormatDateJson(TimeSearch[0])
            : "01/01/2000",
        ToDate:
          TimeSearch !== undefined
            ? FormatDateJson(TimeSearch[1])
            : "01/01/2000",
        CheckDate: TimeSearch !== undefined ? "A" : "B",
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_List_V1",
      };

      const list = await mainAction.API_spCallServer(params, dispatch);
      setState({
        ...state,
        data: list,
        dataThu: list.filter((p) => p.TypeOfReceipt !== "PHIEUTHUNHOMAC"),
        isShow: 0,
      });
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };

  const Trl_spInvoice_Excel = () => {
    ConfirmAlert("Xác nhận", "Bạn có chắc muốn xuất?", () => {
      let dataexcel = state.data.map((item, index) => {
        return {
          "Hóa đơn": item.InvoiceType === "A" ? "Thu" : "Chi",
          "Loại Hóa đơn": item.StyleName,
          "Ngày thanh toán": FormatDateJson(item.DatePayment),
          "Mã hóa đơn": item.InvoiceCode,
          "Trạng thái": item.StatusName,
          "Booking/Tour": item.BookingCode + "/" + item.BookingName,
          "Khách hàng/Đối tác": item.ObName,
          "Đối tượng": item.ObjectName,
          "Loại Tiền": item.TypeMoneyName,
          "Tỷ giá": item.ExchangeRate,
          "Tổng giá trị": item.TotalMoney,
          "Giá trị ước tính": item.Money,
          "Lấy hóa đơn": item.VAT > 0 ? "Có" : "Không",
          "Giá trị VAT": item.MoneyVAT,
          "Giá trị thanh toán": item.MoneyPayment,
          "Phương thức thanh toán": item.PaymentName,
          "Ghi chú thanh toán": item.NotePayment,
          "Nội dung thanh toán": item.Decscription,
          "Người đề nghị": item.CreateName,
          "Ngày đề nghị": FormatDateJson(item.CreateTime),
        };
      });
      ExportExcel(dataexcel, "Danh sách hóa đơn thanh toán_" + CreateName);
    });
  };

  const [invoiceView, setInvoiceView] = useState({});
  const Trl_spInvoice_View = (row) => {
    if ((row._original.GroupId || 0) === 0) {
      let PrinterData = row._original;
      PrinterData.TotalInvoiceGroup = 1;
      PrinterData.PriceNL = PrinterData.PriceTourNL;
      PrinterData.PriceTE = PrinterData.PriceTourTE;
      PrinterData.PriceTN = PrinterData.PriceTourTN;
      setInvoiceView(PrinterData);
    } else {
      let PrinterData = state.data.find(
        (p) => p.InvoiceId === row._original.GroupId
      );
      let GroupPrint =
        state.dataThu.filter((p) => p.GroupId === row._original.GroupId) || [];
      PrinterData.TotalInvoiceGroup = GroupPrint.length;
      ;
      let arrNL = GroupPrint.map((a, v) => {
        return a.PriceTourNL;
      });
      let maxPriceNL = Math.max(...arrNL);
      let arrTE = GroupPrint.map((a, v) => {
        return a.PriceTourTE;
      });
      let maxPriceTE = Math.max(...arrTE);

      let arrTN = GroupPrint.map((a, v) => {
        return a.PriceTourTN;
      });
      let maxPriceTN = Math.max(...arrTN);
      PrinterData.PriceNL = maxPriceNL;
      PrinterData.PriceTE = maxPriceTE;
      PrinterData.PriceTN = maxPriceTN;
      /* PrinterData.PriceNL = GroupPrint[0].Price1;
      PrinterData.PriceTE = GroupPrint[0].Price2;
      PrinterData.PriceTN = GroupPrint[0].Price3; */
      PrinterData.Payment1 =
        GroupPrint?.reduce((a, v) => (a = a + (v.Payment1 || 0)), 0) || 0;
      PrinterData.Payment2 =
        GroupPrint?.reduce((a, v) => (a = a + (v.Payment2 || 0)), 0) || 0;
      PrinterData.Payment3 =
        GroupPrint?.reduce((a, v) => (a = a + (v.Payment3 || 0)), 0) || 0;
      PrinterData.Payment4 =
        GroupPrint?.reduce((a, v) => (a = a + (v.Payment4 || 0)), 0) || 0;
      PrinterData.Payment5 =
        GroupPrint?.reduce((a, v) => (a = a + (v.Payment5 || 0)), 0) || 0;
      PrinterData.Payment6 =
        GroupPrint?.reduce((a, v) => (a = a + (v.Payment6 || 0)), 0) || 0;
      PrinterData.TotalNL =
        GroupPrint?.reduce((a, v) => (a = a + (v.TotalNL || 0)), 0) || 0;
      PrinterData.TotalTE =
        GroupPrint?.reduce((a, v) => (a = a + (v.TotalTE || 0)), 0) || 0;
      PrinterData.TotalTN =
        GroupPrint?.reduce((a, v) => (a = a + (v.TotalTN || 0)), 0) || 0;
      PrinterData.TotalPrice =
        GroupPrint?.reduce((a, v) => (a = a + (v.TotalPrice || 0)), 0) || 0;
      PrinterData.TotalRemain =
        GroupPrint?.reduce((a, v) => (a = a + (v.TotalRemain || 0)), 0) || 0;
      PrinterData.ObName = PrinterData.ObName || GroupPrint[0].ObName;
      PrinterData.Brithday = PrinterData.Brithday || GroupPrint[0].Brithday;
      PrinterData.Phone = PrinterData.Phone || GroupPrint[0].Phone;
      PrinterData.AttackFile =
        GroupPrint?.reduce(
          (a, v) =>
            (a = a + ((v.AttackFile || "") !== "" ? v.AttackFile + "," : "")),
          ""
        ) || "";
      PrinterData.AttackImage =
        GroupPrint?.reduce(
          (a, v) =>
            (a = a + ((v.AttackImage || "") !== "" ? v.AttackImage + "," : "")),
          ""
        ) || "";
      setInvoiceView(PrinterData);
    }
    openModal();
  };
  const Trl_spInvoice_Delete = async (row) => {
    try {
      let pr = {
        InvoiceId: row._original.InvoiceId,
        Creater: Creater,
        CreateName: CreateName,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_Delete_V1",
      };

      const respone = await mainAction.API_spCallServer(params, dispatch);

      if (respone.Status === "OK") {
        Alertsuccess(respone.ReturnMess);
        Trl_spInvoice_List();
      } else {
        Alerterror(respone.ReturnMess);
      }
    } catch (error) {
      ;
    }
  };

  const columns = [
    {
      Header: "XÁC NHẬN",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            className={
              FormatDateJson(new Date(), 7) ===
              FormatDateJson(row._original.CreateTime, 7)
                ? "btn btn-sm btn-success"
                : "btn btn-sm btn-danger"
            }
            onClick={(e) => Trl_spInvoice_View(row)}
          >
            {" "}
            <i class="fa fa-edit"></i>
          </button>
          <button
            type="button"
            className={
              row._original.AllowDelete === 1
                ? "btn btn-sm btn-warning ml-2"
                : "btn btn-sm btn-danger disabled d-none ml-2"
            }
            onClick={(e) =>
              ConfirmAlert("Bạn có chắc chắn muốn xóa không?", "", () =>
                Trl_spInvoice_Delete(row)
              )
            }
          >
            {" "}
            <i class="fa fa-trash "></i>
          </button>
        </div>
      ),
      width: 100,
      fixed: "left",
    },
    {
      Header: "Thời gian tạo",
      accessor: "CreateTime",
      Cell: ({ row }) => <>{FormatDateJson(row._original.CreateTime, 7)}</>,
      width: 130,
      fixed: "left",
    },
    {
      Header: "Mã PHIẾU",
      accessor: "InvoiceCode",
      width: 180,
      fixed: "left",
      Cell: ({ row }) => (
        <>
          <span>
            {row._original.InvoiceCode}
            <span
              class={
                row._original.StatusColor === 3
                  ? "badge badge-success"
                  : row._original.StatusColor === 4
                  ? "badge badge-danger"
                  : "badge badge-warning"
              }
            >
              {" "}
              {row._original.Step}
            </span>
          </span>
        </>
      ),
    },
    {
      Header: "Mã Tour",
      accessor: "BookingCode",
      width: 250,
      fixed: "left",
      Cell: ({ row }) => (
        <>
          <span className="uppercase">
            {" "}
            {row._original?.BookingCode?.length > 0
              ? row._original.BookingCode
              : "DỊCH VỤ KHÁC"}
          </span>
        </>
      ),
    },
    {
      Header: "Khách hàng",
      accessor: "ObName",
      width: 200,
      fixed: "left",
      Cell: ({ row }) => (
        <>
          {row._original.ObName === "TOUR LEADER" ||
          row._original.ObName === "tour leader" ? (
            <span className="uppercase text-red">{row._original.ObName}</span>
          ) : (
            <span className="uppercase">{row._original.ObName}</span>
          )}
        </>
      ),
    },
    {
      Header: "Tổng tiền",
      accessor: "TotalMoney",
      width: 120,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.StatusId;
        let kcheck = "badge badge-success";
        if (fls === 1) kcheck = "badge badge-danger";
        if (fls === 3) kcheck = "badge badge-warning";
        return (
          <span className={kcheck}>
            {FormatMoney(row._original.TotalMoney)}
          </span>
        );
      },
      fixed: "left",
    },
    {
      Header: "Payment1",
      accessor: "Payment1",
      width: 120,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.StatusId;
        let kcheck = "badge badge-success";
        if (fls === 1) kcheck = "badge badge-danger";
        if (fls === 3) kcheck = "badge badge-warning";
        return (
          <span className={kcheck}>{FormatMoney(row._original.Payment1)}</span>
        );
      },
    },
    {
      Header: "Payment2",
      accessor: "Payment2",
      width: 120,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.StatusId;
        let kcheck = "badge badge-success";
        if (fls === 1) kcheck = "badge badge-danger";
        if (fls === 3) kcheck = "badge badge-warning";
        return (
          <span className={kcheck}>{FormatMoney(row._original.Payment2)}</span>
        );
      },
    },
    {
      Header: "Payment3",
      accessor: "Payment3",
      width: 120,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.StatusId;
        let kcheck = "badge badge-success";
        if (fls === 1) kcheck = "badge badge-danger";
        if (fls === 3) kcheck = "badge badge-warning";
        return (
          <span className={kcheck}>{FormatMoney(row._original.Payment3)}</span>
        );
      },
    },
    {
      Header: "Đối tượng",
      accessor: "ObjectName",
      width: 150,
    },
    {
      Header: "Trạng thái",
      accessor: "StatusId",
      width: 200,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.StatusId;
        let kcheck = "badge badge-default";
        let _title = " ";
        if (fls === 2) kcheck = "badge badge-success"; //Đủ màu xanh
        else if (fls === 1)
          kcheck = "badge badge-warning bg-orange"; //Đề nghị màu cam
        else if (fls === 4) kcheck = "badge badge-warning";
        else if (fls === 3 || fls === 5 || fls === 6) {
          kcheck = "badge badge-danger";
          _title = "Thanh toán " + row._original.MoneyReceive;
        }
        return (
          <span className={kcheck} title={_title}>
            {row._original.StatusName}
          </span>
        );
      },
    },
    {
      Header: "Loại chi phí",
      accessor: "StyleName",
      width: 200,
    },
    {
      Header: "Số tiền đề nghị",
      accessor: "Money",
      width: 350,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.StatusId;
        let kcheck = "badge badge-success";
        if (fls === 1) kcheck = "badge badge-danger";
        if (fls === 3) kcheck = "badge badge-warning";
        return (
          <span className={kcheck}>
            {FormatMoney(row._original?.Money || 0)}
          </span>
        );
      },
    },
    {
      Header: "Lấy hóa đơn",
      accessor: "VAT",
      width: 350,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.VAT;
        let kcheck = "badge badge-warning";
        if (fls !== 0) kcheck = "badge badge-success";
        return (
          <span className={kcheck}>
            {row._original.VAT || 0 ? "Không" : "Có"}
          </span>
        );
      },
    },
    {
      Header: "Tiền đã thu",
      accessor: "MoneyPayment",
      width: 350,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.StatusId;
        let kcheck = "badge badge-success";
        if (fls === 1) kcheck = "badge badge-danger";
        if (fls === 3) kcheck = "badge badge-warning";
        return (
          <span className={kcheck}>
            {FormatMoney(row._original?.MoneyPayment || 0)}
          </span>
        );
      },
    },
    {
      Header: "Loại Tiền",
      accessor: "TypeMoneyName",
      width: 200,
    },
    {
      Header: "Hình thức",
      accessor: "PaymentName",
      width: 200,
    },
    {
      Header: "Người đề nghị",
      accessor: "CreateName",
      width: 200,
    },
    {
      Header: "Ghi chú",
      accessor: "Notes",
    },
    {
      Header: "Người xác nhận",
      accessor: "CreateConfirmName",
    },
    {
      Header: "Thời gian XN",
      accessor: "CreateConfirmTime",
      Cell: ({ row }) => (
        <>
          {row._original.CreateConfirmTime !== "1900-01-01T00:00:00"
            ? FormatDateJson(row._original.CreateConfirmTime, 7)
            : "N/A"}
        </>
      ),
      width: 200,
    },
  ];

  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = (title = "Bạn có chắc chắn muốn tắt form không?") => {
    ConfirmAlert(title, "", async () => {
      setIsOpen(false);
    });
  };

  const [titleShow, setTitleShow] = useState("TẤT CẢ PHIẾU THU");

  useEffect(() => {
    Trl_spInvoice_List();
  }, []);

  return (
    <>
      <div className="content-wrapper">
        <div class="card p-1 PrintInvoiceHide">
          <div class="card-header border-left-red">
            <div class="row">
              <div class="col-sm-12 col-md-3 margin-top-5s">
                <a
                  style={{ padding: "4px 10px" }}
                  class="nav-link active"
                  href="#tab_1"
                  data-toggle="tab"
                  onClick={(e) => {
                    setState({ ...state, isShow: 0 });
                  }}
                >
                  PHIẾU THU
                </a>
              </div>
              <div class="col-sm-12 col-md-9 margin-top-5s">
                <button
                  disabled={state.dataThu.length > 0 ? false : true}
                  onClick={Trl_spInvoice_Excel}
                  type="button"
                  class="btn btn-sm btn-success pull-right margin-left-5"
                >
                  <i class="fa fa-download pr-2"></i>
                  Excel
                </button>
                {state.isShow !== 0 && (
                  <button
                    onClick={(e) => {
                      setState({ ...state, isShow: 0 });
                    }}
                    type="button"
                    class="btn btn-sm btn-danger pull-right margin-left-5"
                  >
                    <i class="fa fa-undo pr-2"></i>
                    Trở về
                  </button>
                )}
                <button
                  onClick={(e) => {
                    Trl_spInvoice_List();
                  }}
                  type="button"
                  class="btn btn-sm btn-danger pull-right margin-left-5"
                >
                  <i class="fa fa-search pr-2"></i>
                  Tìm kiếm
                </button>
                <div
                  class="form-group pull-right"
                  style={{ marginTop: "-4px" }}
                >
                  <div class="input-group" style={{ width: "100%" }}>
                    <input
                      type="text"
                      maxLength="500"
                      placeholder="Mã phiếu thu,Mã KH..."
                      class="form-control"
                      value={InvoiceSearch}
                      onChange={(e) => setInvoiceSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div
                  class="form-group pull-right"
                  style={{ marginTop: "-4px", marginRight: "5px" }}
                >
                  <div class="input-group ">
                    <DateTimeRangePicker
                      className="form-control2 px-1 pb-2px zIndex-300"
                      value={TimeSearch}
                      format="dd/MM/yyyy"
                      onChange={(date) => setTimeSearch(date)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body border-left-red">
            <div className="row">
              <div
                className="col-12 col-sm-6 col-md-3 cursor"
                onClick={(e) => {
                  setTitleShow(
                    "TỔNG PHIẾU THU (" +
                      state.dataThu.filter((p) => p.StatusFilter === 1).length +
                      ")"
                  );
                  setState({ ...state, StatusShow: 1 });
                }}
              >
                <div className="info-box">
                  <span className="info-box-icon bg-info elevation-1">
                    <i className="fas fa-th-list"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">TỔNG PT CHỜ</span>
                    <span className="info-box-number float-left">
                      {state.dataThu.filter((p) => p.StatusFilter === 1).length}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="col-12 col-sm-6 col-md-3 cursor"
                onClick={(e) => {
                  setTitleShow(
                    "PHIẾU THU ĐƯỢC DUYỆT (" +
                      state.dataThu.filter((p) => p.StatusFilter === 3).length +
                      ")"
                  );
                  setState({ ...state, StatusShow: 3 });
                }}
              >
                <div className="info-box mb-3">
                  <span className="info-box-icon bg-success elevation-1">
                    <i className="fas fa-check"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">ĐÃ DUYỆT</span>
                    <span className="info-box-number">
                      {state.dataThu.filter((p) => p.StatusFilter === 3).length}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="col-12 col-sm-6 col-md-3 cursor"
                onClick={(e) => {
                  setTitleShow(
                    "PHIẾU THU ĐANG TREO (" +
                      state.dataThu.filter((p) => p.StatusFilter === 2).length +
                      ")"
                  );
                  setState({ ...state, StatusShow: 2 });
                }}
              >
                <div className="info-box mb-3">
                  <span className="info-box-icon bg-warning elevation-1">
                    <i className="fas fa-file"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">ĐANG TREO</span>
                    <span className="info-box-number">
                      {state.dataThu.filter((p) => p.StatusFilter === 2).length}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="col-12 col-sm-6 col-md-3 cursor"
                onClick={(e) => {
                  setTitleShow(
                    "PHIẾU THU TRẢ LẠI (" +
                      state.dataThu.filter((p) => p.StatusFilter === 4).length +
                      ")"
                  );
                  setState({ ...state, StatusShow: 4 });
                }}
              >
                <div className="info-box mb-3">
                  <span className="info-box-icon bg-danger elevation-1">
                    <i className="fas fa-undo"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">TRẢ LẠI</span>
                    <span className="info-box-number">
                      {state.dataThu.filter((p) => p.StatusFilter === 4).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div className="card">
                <div class="card-header d-flex">
                  <div class="d-flex">
                    <div class="font-weight-bold text-muted">{titleShow}</div>
                  </div>
                </div>
                <div className="card-body p-1 pl-0">
                  <div className="col-md-12">
                    <div class="table-responsive">
                      <DataTable
                        data={state.dataThu.filter(
                          (p) => p.StatusFilter === state.StatusShow
                        )}
                        columns={columns}
                        IsSearch={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={modalIsOpen}
          onHide={closeModal}
          aria-labelledby="example-custom-modal-styling-title"
          className=" custom-modal-w-90"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              <div class="text-center"></div>
            </Modal.Title>
            <Button
              type="button"
              className="close"
              aria-label="Đóng"
              onClick={() => {
                closeModal();
              }}
            >
              <span aria-hidden="true">&times;</span>
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div
              className="row booking portrait"
              style={{ backgroundColor: "#fff", fontFamily: "TimeNewRoman" }}
            >
              <div class="col-sm-12 text-center header">
                <Img
                  src="../dist/img/logo-invoice.png"
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-sm-12">
                <div className="row">
                  <div class="col-sm-6 text-center">
                    <span style={{ fontWeight: "bold" }}>
                      CÔNG TY TNHH ĐT TM DV DU LỊCH CHÂU ÂU
                    </span>
                    <br />
                    352-354-356 Lê Văn Sỹ, P2, Q Tân Bình
                  </div>
                  <div
                    class="col-sm-5"
                    style={{
                      textAlign: "right",
                      verticalAlign: "bottom",
                      paddingTop: "5px",
                    }}
                  >
                    <span>Mã phiếu:</span> {invoiceView?.InvoiceCode}
                  </div>
                  <div class="col-sm-1"></div>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="row">
                  <div class="col-sm-12 text-center">
                    <span style={{ fontSize: "25px", fontWeight: 700 }}>
                      PHIẾU THU
                    </span>
                    <div class="form-group mt-1">
                      {FormatDateJson(invoiceView?.CreateTime, 12)}
                    </div>
                  </div>
                  <div class="col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-sm-6">
                        Khách hàng:{" "}
                        <span style={{ textTransform: "uppercase" }}>
                          {invoiceView?.ObName}
                        </span>
                      </div>
                      <div className="col-sm-6">
                        {/* Ngày, tháng, năm sinh:{" "}
                        <span>
                          {FormatDateJson(invoiceView?.Brithday, 7) || ""}
                        </span> */}
                      </div>
                      <div className="col-sm-12 mt-1">
                        Số điện thoại: {invoiceView?.Phone}
                      </div>
                      <div className="col-sm-12 mt-1">
                        Mã tour đăng ký:{" "}
                        {invoiceView?.BookingCode || "DỊCH VỤ KHÁC"}
                      </div>
                      {invoiceView?.StyleId !== 6 && (
                        <>
                          <div className="col-sm-6 mt-1">
                            Chi tiết tour: {invoiceView?.ServiceName || ""}
                          </div>
                          <div className="col-sm-6 mt-1">
                            Số ngày tour: {invoiceView?.TotalDate}
                          </div>
                          <div className="col-sm-12 mt-1">
                            Ngày khởi hành:{" "}
                            {FormatDateJson(invoiceView?.TimeStart, 7)} đến{" "}
                            {FormatDateJson(invoiceView?.TimeEnd, 7)}
                          </div>
                        </>
                      )}
                      <div className="col-sm-12 mt-1">
                        Số thành viên: {invoiceView?.TotalInvoiceGroup || 1}{" "}
                        người
                      </div>
                      {invoiceView?.TotalNL > 0 && (
                        <>
                          <div className="col-sm-6 mt-1">
                            Người lớn: {invoiceView?.TotalNL || 0} người
                          </div>
                          <div className="col-sm-6 mt-1">
                            Giá: {FormatMoney(invoiceView?.PriceNL || 0)}
                            /người
                          </div>
                        </>
                      )}
                      {invoiceView?.TotalTE > 0 && (
                        <>
                          <div className="col-sm-6 mt-1">
                            Trẻ em: {invoiceView?.TotalTE || 0} người
                          </div>
                          <div className="col-sm-6 mt-1">
                            Giá: {FormatMoney(invoiceView?.PriceTE || 0)}
                            /người
                          </div>
                        </>
                      )}
                      {invoiceView?.TotalTN > 0 && (
                        <>
                          <div className="col-sm-6 mt-1">
                            Infant: {invoiceView?.TotalTN || 0} người
                          </div>
                          <div className="col-sm-6 mt-1">
                            Giá: {FormatMoney(invoiceView?.PriceTN || 0)}
                            /người
                          </div>
                        </>
                      )}
                      <div className="col-sm-12 mt-1">
                        Tổng tiền tour:{" "}
                        {FormatMoney(invoiceView?.TotalPrice || 0)} (Bằng chữ:{" "}
                        {MoneyToText(
                          invoiceView?.TotalPrice || 0,
                          invoiceView?.TypeMoneyName || ""
                        )}
                        )
                      </div>
                      <div className="col-sm-3 mt-1">Cọc tour: x</div>
                      <div className="col-sm-3 mt-1">
                        <input
                          style={{ width: "20px", height: "20px" }}
                          type="checkbox"
                          checked={(invoiceView?.Payment1 || 0) > 0}
                        />{" "}
                        Lần 1
                      </div>
                      <div className="col-sm-3 mt-1">
                        <input
                          style={{ width: "20px", height: "20px" }}
                          type="checkbox"
                          checked={(invoiceView?.Payment2 || 0) > 0}
                        />{" "}
                        Lần 2
                      </div>
                      <div className="col-sm-3 mt-1">
                        <input
                          style={{ width: "20px", height: "20px" }}
                          type="checkbox"
                          checked={(invoiceView?.Payment3 || 0) > 0}
                        />{" "}
                        Lần 3
                      </div>
                      <div className="col-sm-3 mt-1">Số tiền:</div>
                      <div className="col-sm-3 mt-1">
                        {FormatMoney(invoiceView?.Payment1 || 0)}
                      </div>
                      <div className="col-sm-3 mt-1">
                        {FormatMoney(invoiceView?.Payment2 || 0)}
                      </div>
                      <div className="col-sm-3 mt-1">
                        {FormatMoney(invoiceView?.Payment3 || 0)}
                      </div>
                      <div className="col-sm-3 mt-1">Bằng chữ:</div>
                      <div className="col-sm-3 mt-1">
                        {MoneyToText(invoiceView?.Payment1 || 0)}
                      </div>
                      <div className="col-sm-3 mt-1">
                        {MoneyToText(invoiceView?.Payment2 || 0)}
                      </div>
                      <div className="col-sm-3 mt-1">
                        {MoneyToText(invoiceView?.Payment3 || 0)}
                      </div>
                      <div className="clearfix"></div>
                      {(invoiceView?.Payment4 || 0) > 0 && (
                        <>
                          <div className="col-sm-3 mt-1">
                            <input
                              style={{ width: "20px", height: "20px" }}
                              type="checkbox"
                              checked={(invoiceView?.Payment4 || 0) > 0}
                            />{" "}
                            Lần 4
                          </div>
                        </>
                      )}

                      {(invoiceView?.Payment5 || 0) > 0 && (
                        <>
                          <div className="col-sm-3 mt-1">
                            <input
                              style={{ width: "20px", height: "20px" }}
                              type="checkbox"
                              checked={(invoiceView?.Payment5 || 0) > 0}
                            />{" "}
                            Lần 5
                          </div>
                        </>
                      )}

                      {(invoiceView?.Payment6 || 0) > 0 && (
                        <>
                          <div className="col-sm-3 mt-1">
                            <input
                              style={{ width: "20px", height: "20px" }}
                              type="checkbox"
                              checked={(invoiceView?.Payment6 || 0) > 0}
                            />{" "}
                            Lần 6
                          </div>
                        </>
                      )}
                      <div className="clearfix"></div>
                      {(invoiceView?.Payment4 || 0) > 0 && (
                        <>
                          <div className="col-sm-3 mt-1">Số tiền:</div>
                          <div className="col-sm-3 mt-1">
                            {FormatMoney(invoiceView?.Payment4 || 0)}
                          </div>
                        </>
                      )}
                      {(invoiceView?.Payment5 || 0) > 0 && (
                        <>
                          <div className="col-sm-3 mt-1">
                            {FormatMoney(invoiceView?.Payment5 || 0)}
                          </div>
                        </>
                      )}
                      {(invoiceView?.Payment6 || 0) > 0 && (
                        <>
                          <div className="col-sm-3 mt-1">
                            {FormatMoney(invoiceView?.Payment6 || 0)}
                          </div>
                        </>
                      )}
                      <div className="clearfix"></div>
                      {(invoiceView?.Payment4 || 0) > 0 && (
                        <>
                          <div className="col-sm-3 mt-1">Bằng chữ:</div>
                          <div className="col-sm-3 mt-1">
                            {MoneyToText(invoiceView?.Payment4 || 0)}
                          </div>
                        </>
                      )}
                      {(invoiceView?.Payment5 || 0) > 0 && (
                        <>
                          <div className="col-sm-3 mt-1">
                            {MoneyToText(invoiceView?.Payment5 || 0)}
                          </div>
                        </>
                      )}
                      {(invoiceView?.Payment6 || 0) > 0 && (
                        <>
                          <div className="col-sm-3 mt-1">
                            {MoneyToText(invoiceView?.Payment6 || 0)}
                          </div>
                        </>
                      )}
                      <div className="clearfix"></div>
                      <div className="col-sm-12 mt-1">
                        Còn lại: {FormatMoney(invoiceView?.TotalRemain || 0)}{" "}
                        (Bằng chữ: {MoneyToText(invoiceView?.TotalRemain || 0)})
                      </div>
                      <div className="col-sm-6 mt-1">
                        Phương thức thanh toán: {invoiceView?.PaymentName || ""}
                      </div>
                      <div className="col-sm-6 mt-1">
                        Số tài khoản chuyển tiền:{" "}
                        {invoiceView?.BankAccount ||
                          ".........................................."}
                      </div>
                      <div className="col-sm-12 mt-1">
                        Nội dung thanh toán:{" "}
                        {invoiceView?.Decscription ||
                          ".........................................."}
                      </div>
                      <div className="col-sm-12 mt-1">
                        Ghi chú:{" "}
                        {invoiceView?.NotePayment ||
                          ".........................................."}
                      </div>
                      <div className="col-sm-6 mt-1">
                        Người đóng tiền: {invoiceView?.ObName}
                      </div>
                      <div className="col-sm-6 mt-1">
                        Khác: ..........................................
                      </div>
                      <div className="col-sm-12 mt-1">
                        Người đề xuất: {invoiceView?.CreateName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ShowFiles
                fileData={{
                  fileShow: invoiceView?.AttackFile || "",
                  imageShow: invoiceView?.AttackImage || "",
                }}
              />
              <div className="col-md-12 col-sm-12">
                <InvoiceConfirmReceiptTemp
                  reloadS={(e) => {
                    Trl_spInvoice_List();
                    closeModal();
                  }}
                  onInvoice={invoiceView}
                />
              </div>

              <div className="clearfix"></div>
              <div class="col-sm-12 text-center footer mt-2">
                <Img
                  src="../dist/img/logo-invoice-footer.png"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Img } from "react-image";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { DataTable, ShowFiles, TooltipCustom } from "../../../../Common";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  ConfirmAlert,
  ExportExcel,
  FormatDateJson,
  FormatMoney,
  MoneyToText,
} from "../../../../Utils";
import { InvoiceInternal } from "../Booking";
import { InvoiceConfirmTemp } from "./InvoiceConfirmTemp";

export const InvoicePaymentInternal = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const positionId = +localStorage.getItem("PositionId");

  //#region Tạo pdxnb
  let prm = useLocation();
  useEffect(() => {
    if (prm.search.length > 0 && prm.search.includes("dpid")) {
      let id;
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
      if (id === 30) {
        setTypeOfReceipt("PĐXHCN");
      }
      if (id === 33) {
        setTypeOfReceipt("PĐXKDN");
      }
      if (id === 34) {
        setTypeOfReceipt("PĐXDHN");
      }
      if (id === 32) {
        setTypeOfReceipt("PĐXVSN");
      }
      if (id === 31) {
        setTypeOfReceipt("PĐXKTN");
      }
      if (id === 37) {
        setTypeOfReceipt("PĐXMARN");
      }
      if (id === 1) {
        setTypeOfReceipt("PĐXITN");
      }
      if (id === 38) {
        setTypeOfReceipt("PĐXCSN");
      }
      if (id === 14) {
        setTypeOfReceipt("PĐXVEN");
      }
      if (id === 39) {
        setTypeOfReceipt("PĐXSPN");
      }
      if (id === 35) {
        setTypeOfReceipt("PĐXHDVN");
      }
      if (id === 13) {
        setTypeOfReceipt("PĐXHNN");
      }
      if (id === 40) {
        setTypeOfReceipt("PĐXTLN");
      }
      if (id === 36) {
        setTypeOfReceipt("PĐXBLDN");
      }
    }
  }, [prm.search]);
  const [DataObject, setDataObject] = useState({
    ObjectId: 5,
    ObjectName: "Nhân viên",
  });
  const [invoiceStyle, setInvoiceStyle] = useState({
    StyleId: 7,
    StyleName: "Chi",
    TypeInvoice: 6,
  });
  const [typeOfReceipt, setTypeOfReceipt] = useState("");

  const [modalIsOpenCreate, setIsOpenCreate] = useState(false);
  const openModalCreate = () => {
    setIsOpenCreate(true);
  };

  const closeModalCreate = (
    title = "Bạn có chắc chắn muốn tắt form không?"
  ) => {
    ConfirmAlert(title, "", async () => {
      setIsOpenCreate(false);
    });
  };
  //#endregion

  //#region Danh sách phiếu nội bộ

  const [state, setState] = useState({
    data: [],
    TimeSearch: [
      new Date(
        moment(new Date().setDate(new Date().getDate() - 7)).startOf("date")
      ),
      new Date(moment(new Date()).endOf("date")),
    ],
    InvoiceSearch: "",
    StatusShow: [1, 2, 3],
    onCloseModal: 0,
    IsRefresh: 0,
  });

  const [titleShow, setTitleShow] = useState("TẤT CẢ PHIẾU PNB");
  const Trl_spInvoice_List = async () => {
    try {
      const pr = {
        Creater: Creater,
        InvoiceType: "C",
        InvoiceSearch: state.InvoiceSearch,
        FromDate:
          state.TimeSearch !== undefined
            ? FormatDateJson(state.TimeSearch[0], 1)
            : "01/01/2000",
        ToDate:
          state.TimeSearch !== undefined
            ? FormatDateJson(state.TimeSearch[1], 2)
            : "01/01/2000",
        CheckDate: "A",
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_List_V1",
      };

      const params2 = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_List_Wait",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      const list2 = await mainAction.API_spCallServer(params2, dispatch);

      let newList = list.filter(
        (x) => x.StatusFilter !== 1 && x.StatusFilter !== 2
      );

      setState({
        ...state,
        data: [...newList, ...list2],
      });
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
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
        let newList = state.data.filter(
          (x) => x.InvoiceId !== row._original.InvoiceId
        );
        setState({
          ...state,
          data: [...newList],
        });
        Trl_spInvoice_List();
      } else {
        Alerterror(respone.ReturnMess);
      }
    } catch (error) {
      ;
    }
  };

  const Trl_spInvoice_Delete_Mutil = async () => {
    let idList = state.data
      .filter((x) => x.Checked)
      .map((x) => x.InvoiceId)
      .join(",");
    if (idList.length === 0 || idList.length === "") {
      Alertwarning("Vui lòng chọn phiếu");
      return;
    }
    try {
      let pr = {
        InvoiceId: idList,
        Creater: Creater,
        CreateName: CreateName,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_Delete_Mutil",
      };

      const respone = await mainAction.API_spCallServer(params, dispatch);

      if (respone.Status === "OK") {
        Alertsuccess(respone.ReturnMess);
        let newVal = state.data.filter((x) => !x.Checked);
        setState({
          ...state,
          data: [...newVal],
        });
      } else {
        Alerterror(respone.ReturnMess);
      }
    } catch (error) {
      ;
    }
  };

  const handleChecked = (row) => {
    let newData = state.data.map((x) => {
      if (x.InvoiceId === row.InvoiceId) {
        let check = row?.Checked || false;
        return { ...x, Checked: !check };
      }
      return x;
    });
    setState({
      ...state,
      data: newData,
    });
  };

  const columns = [
    {
      Header: (
        <div>
          <button
            type="button"
            className={"btn btn-sm btn-danger"}
            onClick={(e) => Trl_spInvoice_Delete_Mutil()}
          >
            Xóa check <i class="fa fa-trash"></i>
          </button>
        </div>
      ),
      sortable: false,
      accessor: "Edit",
      Cell: ({ row }) => (
        <div
          style={{ textAlign: "center" }}
          className="d-flex justify-content-center "
        >
          <button
            type="button"
            className={
              FormatDateJson(new Date(), 7) ===
              FormatDateJson(row._original.CreateTime, 7)
                ? "btn btn-sm btn-success"
                : "btn btn-sm btn-info"
            }
            onClick={(e) => Trl_spInvoice_View(row)}
          >
            <i class="fa fa-edit"></i>
          </button>
          {row._original.Creater === +Creater &&
            (row._original.StatusFilter === 2 ||
              row._original.StepConfirm < 2 ||
              (row._original.StepConfirm < 3 && positionId < 9)) && (
              <TooltipCustom content="Cập nhật phiếu">
                <button
                  type="button"
                  className="btn btn-sm btn-info ml-2"
                  onClick={(e) => Trl_spInvoice_Update(row)}
                >
                  {" "}
                  <i class="fa fa-cog "></i>
                </button>
              </TooltipCustom>
            )}
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
          <label
            class={
              row._original.AllowDelete === 1
                ? "container-checkbox ml-2 mt-1"
                : " disabled d-none"
            }
          >
            <input
              type="checkbox"
              checked={row._original?.Checked || false}
              onChange={() => {
                handleChecked(row._original);
              }}
            />
            <span class="checkmark"></span>
          </label>
        </div>
      ),
      width: 200,
      fixed: "left",
    },
    {
      Header: "Mã PHIẾU",
      accessor: "InvoiceCode",
      width: 200,
      fixed: "left",
      Cell: ({ row }) => (
        <>
          <span>
            {row._original.InvoiceCode}
            {row._original.Step > 0 && (
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
            )}
          </span>
        </>
      ),
    },
    {
      Header: "Người đề xuất",
      accessor: "CreateName",
      width: 200,
      fixed: "left",
      Cell: ({ row }) => (
        <>
          {row._original.CreateName === "TOUR LEADER" ||
          row._original.CreateName === "tour leader" ? (
            <span className="uppercase text-red">
              {row._original.CreateName}
            </span>
          ) : (
            <span className="uppercase">{row._original.CreateName}</span>
          )}
        </>
      ),
    },
    {
      Header: "Phòng ban",
      accessor: "DepartmentName",
      width: 200,
      fixed: "left",
    },
    {
      Header: "Nội dung",
      accessor: "Decscription",
      fixed: "left",
    },
    {
      Header: "Đối tượng thụ hưởng",
      accessor: "ObName",
      width: 250,
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
      Header: "Phương thức thanh toán",
      accessor: "PaymentName",
      width: 200,
    },
    {
      Header: "Số tiền",
      accessor: "TotalMoney",
      width: 200,
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
    },
    {
      Header: "Đối tượng thanh toán",
      accessor: "ObjectName",
      width: 200,
      Cell: ({ row }) => (
        <>
          {row._original.ObjectName === "TOUR LEADER" ||
          row._original.ObjectName === "tour leader" ? (
            <span className="uppercase text-red">
              {row._original.ObjectName}
            </span>
          ) : (
            <span className="uppercase">{row._original.ObjectName}</span>
          )}
        </>
      ),
    },
    {
      Header: "Số tài khoản",
      accessor: "BankAccount",
      width: 200,
    },
    {
      Header: "Ghi chú",
      accessor: "Notes",
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
      Header: "Thời gian tạo",
      accessor: "CreateTime",
      Cell: ({ row }) => <>{FormatDateJson(row._original.CreateTime, 7)}</>,
      width: 200,
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

  const Trl_spInvoice_Excel = () => {
    ConfirmAlert("Xác nhận", "Bạn có chắc muốn xuất excel?", () => {
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

  useEffect(() => {
    Trl_spInvoice_List();
  }, []);

  //#endregion

  //#region Form Tạo phiếu
  const Trl_spInvoice_Update = async (row) => {
    setDataObject({ ...DataObject, InvoiceId: row._original.InvoiceId });
    openModalCreate();
  };

  useEffect(() => {
    if (state.IsRefresh !== 0) Trl_spInvoice_List();
  }, [state.IsRefresh]);
  //#endregion

  //#region Modal xác nhận PHIẾU PNB

  const [invoiceView, setInvoiceView] = useState({});
  const Trl_spInvoice_View = async (row) => {
    setInvoiceView(row._original);
    setState({ ...state, onCloseModal: 2 });
    //openModal();
  };

  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = (title = "Bạn có chắc chắn muốn tắt form không?") => {
    ConfirmAlert(title, "", async () => {
      setIsOpen(false);
      setState({ ...state, onCloseModal: 0 });
    });
  };

  useEffect(() => {
    if (state.onCloseModal === 0) {
      setIsOpen(false);
      return;
    } else if (state.onCloseModal === 1) {
      Trl_spInvoice_List();
      setIsOpen(false);
      return;
    } else if (state.onCloseModal === 2) {
      openModal();
    }
  }, [state.onCloseModal]);

  //#endregion
  const [page, setPage] = useState(0);

  return (
    <>
      <div className="content-wrapper pt-1 px-2 pb-2">
        <div class="card p-1 PrintInvoiceHide">
          <div class="card-header border-left-red">
            <div class="row">
              <div class="col-sm-12 col-md-3 margin-top-5s">PHIẾU PNB</div>
              <div class="col-sm-12 col-md-9 margin-top-5s">
                <button
                  disabled={state.data.length > 0 ? false : true}
                  onClick={Trl_spInvoice_Excel}
                  type="button"
                  class="btn btn-sm btn-success pull-right margin-left-5"
                >
                  <i class="fa fa-download pr-2"></i>
                  Excel
                </button>
                <button
                  onClick={(e) => {
                    setDataObject({
                      ObjectId: 5,
                      ObjectName: "Nhân viên",
                    });
                    openModalCreate();
                  }}
                  type="button"
                  class="btn btn-sm btn-success pull-right margin-left-5"
                >
                  <i class="fa fa-plus pr-2"></i>
                  Thêm mới
                </button>
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
                      placeholder="Mã phiếu"
                      class="form-control"
                      value={state.InvoiceSearch}
                      onChange={(e) =>
                        setState({ ...state, InvoiceSearch: e.target.value })
                      }
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
                      value={state.TimeSearch}
                      format="dd/MM/yyyy"
                      onChange={(date) =>
                        setState({ ...state, TimeSearch: date })
                      }
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
                    "TỔNG PNB (" +
                      state.data.filter((p) => p.StatusFilter === 1).length +
                      ")"
                  );
                  setState({ ...state, StatusShow: [1] });
                }}
              >
                <div className="info-box">
                  <span className="info-box-icon bg-info elevation-1">
                    <i className="fas fa-th-list"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">TỔNG PHIẾU PNB CHỜ</span>
                    <span className="info-box-number float-left">
                      {state.data.filter((p) => p.StatusFilter === 1).length}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="col-12 col-sm-6 col-md-3 cursor"
                onClick={(e) => {
                  setTitleShow(
                    "PHIẾU PNB ĐƯỢC DUYỆT (" +
                      state.data.filter((p) => p.StatusFilter === 3).length +
                      ")"
                  );
                  setState({ ...state, StatusShow: [3] });
                }}
              >
                <div className="info-box mb-3">
                  <span className="info-box-icon bg-success elevation-1">
                    <i className="fas fa-check"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">ĐÃ DUYỆT</span>
                    <span className="info-box-number">
                      {state.data.filter((p) => p.StatusFilter === 3).length}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="col-12 col-sm-6 col-md-3 cursor"
                onClick={(e) => {
                  setTitleShow(
                    "PHIẾU PNB ĐANG TREO (" +
                      state.data.filter((p) => p.StatusFilter === 2).length +
                      ")"
                  );
                  setState({ ...state, StatusShow: [2] });
                }}
              >
                <div className="info-box mb-3">
                  <span className="info-box-icon bg-warning elevation-1">
                    <i className="fas fa-file"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">ĐANG TREO</span>
                    <span className="info-box-number">
                      {state.data.filter((p) => p.StatusFilter === 2).length}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="col-12 col-sm-6 col-md-3 cursor"
                onClick={(e) => {
                  setTitleShow(
                    "PHIẾU PNB TRẢ LẠI (" +
                      state.data.filter((p) => p.StatusFilter === 4).length +
                      ")"
                  );
                  setState({ ...state, StatusShow: [4] });
                }}
              >
                <div className="info-box mb-3">
                  <span className="info-box-icon bg-danger elevation-1">
                    <i className="fas fa-undo"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">TRẢ LẠI</span>
                    <span className="info-box-number">
                      {state.data.filter((p) => p.StatusFilter === 4).length}
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
                        data={state.data.filter(
                          (p) => state.StatusShow.indexOf(p.StatusFilter) !== -1
                        )}
                        page={page}
                        onPageChange={(e) => setPage(e)}
                        columns={columns}
                        IsSearch={true}
                        isFixPage={true}
                      />
                    </div>
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
                <div class="col-sm-12 text-center mt-2">
                  <span style={{ fontSize: "25px", fontWeight: 700 }}>PNB</span>
                  <div class="form-group mt-1">
                    {FormatDateJson(invoiceView?.CreateTime, 12)}
                  </div>
                </div>
                <div class="col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-sm-12">
                      Người đề xuất:{" "}
                      <span style={{ textTransform: "uppercase" }}>
                        {invoiceView?.CreateName || ""}
                      </span>
                    </div>
                    <div className="col-sm-12">
                      Phòng ban: {invoiceView?.DepartmentName || ""}
                    </div>
                    <div className="col-sm-12">
                      Nội dung: {invoiceView?.Decscription || ""}
                    </div>
                    <div className="col-sm-12">
                      Đối tượng thụ hưởng: {invoiceView?.ObName}
                    </div>
                    <div className="col-sm-12">
                      Phương thức thanh toán {invoiceView?.PaymentName || ""}
                    </div>
                    <div className="col-sm-12">
                      Số tiền: {FormatMoney(invoiceView?.TotalMoney || 0)}
                      {invoiceView?.TypeMoneyName || ""} (Bằng chữ:{" "}
                      {MoneyToText(
                        invoiceView?.TotalMoney || 0,
                        invoiceView?.TypeMoneyName || ""
                      )}
                      )
                    </div>
                    <div className="col-sm-6">
                      Đối tượng thanh toán: {invoiceView?.ObName || ""}
                    </div>
                    <div className="col-sm-6">
                      Số tài khoản: {invoiceView?.BankAccount || ""}
                    </div>
                    <div className="col-sm-12">
                      Ghi chú:{" "}
                      {invoiceView?.NotePayment ||
                        ".........................................."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="clearfix"></div>
            <ShowFiles
              fileData={{
                fileShow: invoiceView?.AttackFile || "",
                imageShow: invoiceView?.AttackImage || "",
              }}
            />
            <div className="col-md-12 col-sm-12">
              <InvoiceConfirmTemp
                onInvoice={invoiceView}
                onClose={(e) => setState({ ...state, onCloseModal: e })}
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
      <Modal
        show={modalIsOpenCreate}
        onHide={closeModalCreate}
        aria-labelledby="example-custom-modal-styling-title"
        className=" custom-modal-w-90"
      >
        <Modal.Header>
          <Modal.Title id="example-custom-modal-styling-title">
            <div class="text-center">Tạo phiếu PNB</div>
          </Modal.Title>
          <Button
            type="button"
            className="close"
            aria-label="Đóng"
            onClick={() => {
              closeModalCreate();
            }}
          >
            <span aria-hidden="true">&times;</span>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <InvoiceInternal
            Booking={{}}
            DataObject={DataObject}
            // handleShow={() => handleShow(14)}
            IsActive={Math.random()}
            invoiceStyle={invoiceStyle}
            onInvoiceInfor={(e) => {}}
            reloadS={Trl_spInvoice_List}
            data={[]}
            TypeOfReceipt={typeOfReceipt}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

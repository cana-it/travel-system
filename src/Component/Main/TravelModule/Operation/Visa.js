import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  FormatDateJson,
  FormatMoney,
  ConfirmAlert,
  ExportExcel,
} from "../../../../Utils";
import {
  DataTable,
  SelectService,
  SelectServiceSale,
  TableShowDataBooking,
} from "../../../../Common";
import "react-confirm-alert/src/react-confirm-alert.css";
import Modal from "react-bootstrap/Modal";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { VisaForm } from "../Booking/VisaForm";
import moment from "moment";
import { InvoiceVisa } from "../Booking/InvoiceVisa";

import { InvoiceCustomerMain } from "../Booking";

export const Visa = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");

  const [data, setData] = useState([]);
  const [VisaSearch, setVisaSearch] = useState("");
  const [TimeSearch, setTimeSearch] = useState();
  const [serviceSaleSearch, setServiceSaleSearch] = useState({});
  const [serviceSearch, setServiceSearch] = useState(0);
  const [showInvoiceVisa, setShowInvoiceVisa] = useState(false);
  const [invoiceStyleList, setInvoiceStyleList] = useState([]);
  const [invoiceStyle, setInvoiceStyle] = useState(0);
  const [DataObject, setDataObject] = useState({
    Notes: "",
    dataDetail: [],
  });
  const [booking, setBooking] = useState({});

  const startOfMonth = moment().startOf("month").format("MM-DD-YYYY 00:00:00");
  const endOfMonth = moment().endOf("month").format("MM-DD-YYYY 23:59:59");

  useEffect(() => {
    setTimeSearch([new Date(startOfMonth), new Date(endOfMonth)]);
    Trl_spInvoiceStyle_List();
  }, []);

  //#region Call API
  const Trl_spInvoiceStyle_List = async (bookingId) => {
    try {
      const pr = {
        BookingId: +bookingId,
        CreateName: +Creater,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoiceStyle_List",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      setInvoiceStyleList(res);
    } catch (error) {
      ;
    }
  };

  const Trl_spBookingVisa_List = async () => {
    setData([]);
    // if (TimeSearch === undefined) {
    //   Alertwarning("Vui lòng chọn thời gian");
    //   return;
    // }

    try {
      const pr = {
        Creater: Creater,
        CreateName: CreateName,
        VisaSearch: VisaSearch,
        FromDate: FormatDateJson(TimeSearch[0], 1),
        ToDate: FormatDateJson(TimeSearch[1], 2),
        CheckDate: TimeSearch !== undefined ? "A" : "B",
        BookingId: 0,
        ServiceId: serviceSearch || 0,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBookingVisa_List",
      };

      const list = await mainAction.API_spCallServer(params, dispatch);

      if (list.length === 0) {
        Alertwarning("Không có dữ liệu");
        return;
      }
      let res = list.map((item) => {
        let code = "";
        if (item?.Brithday) {
          let name = item.CustomerName.split(" ");
          let lastName = name[name.length - 1];
          let firstName = name[0];

          let formatDate = moment(item.Brithday).format("DDMMYY");
          code = `${firstName}${lastName}${formatDate}`;
        }
        return {
          ...item,
          PassportTimeFrom: FormatDateJson(item.PassportTimeFrom, 7),
          PassportTimeTo: FormatDateJson(item.PassportTimeTo, 7),
          CreateTime: item?.CreateTime
            ? FormatDateJson(item.CreateTime, 10)
            : "",
          CustomerCode:
            item?.CustomerCode && item?.CustomerCode !== ""
              ? item.CustomerCode
              : code,
        };
      });
      setData(res);
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spBookingVisa_Excel = () => {
    ConfirmAlert("Xác nhận", "Bạn có chắc muốn xuất?", () => {
      let dataexcel = data.map((item, index) => {
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

  const [invoice, setinvoice] = useState({
    InvoiceType: "A",
    DatePayment: new Date(),
    ExchangeRate: "1.0",
    TotalMoney: 0,
    Money: 0,
    VAT: 0,
    Decscription: "",
    NotePayment: "",
    InvoiceId: 0,
    StatusId: 0,
    StatusName: "",
    Files: "",
    CreateConfirmName: "",
    CreateConfirmTime: "",
    ObjectName: "",
    BookingCode: "",
    BookingName: "",
    TypeMoneyName: "",
  });
  const [dataVisa, setdataVisa] = useState({});
  const [rowVisa, setRowVisa] = useState({});
  const [opacity, setOpacity] = useState("opacity-1");

  const Trl_spBookingVisa_View = async (row) => {
    let viewdata = row._original;
    await setdataVisa(viewdata);
    setRowVisa(viewdata);
    setBooking({
      BookingId: viewdata.BookingId,
      BookingCode: viewdata.BookingCode,
      BookingName: viewdata.BookingName,
      ServiceSaleCode: viewdata.ServiceSaleCode,
    });
    setDataObject({
      ...viewdata,
      ObjectId: 1,
      ObjectName: "Khách hàng",
    });
    openModal();
  };

  const changeDayvsMonth = (date) => {
    let arr = date.split("/");
    return `${arr[1]}/${arr[0]}/${arr[2]}`;
  };

  const handleSuccessVisa = (res) => {
    try {
      let arr = data.map((item, index) => {
        if (item.BookingDetailId === +rowVisa.BookingDetailId) {
          return {
            ...item,
            VisaName: res.VisaName,
            VisaStatus: res.StatusVisaId,
            StatusVisaId: res.StatusVisaId,
            PassportTimeFrom: changeDayvsMonth(res.DOI.split(" ")[0]),
            PassportTimeTo: changeDayvsMonth(res.DOE.split(" ")[0]),
            FingerprintDate: res.FingerprintDate,
            NoteOfVisa: res.NoteOfVisa,
            FilesVisa: res.FilesVisa,
            ImagesVisa: res.ImagesVisa,
          };
        }
        return item;
      });
      setData(arr);
      Trl_spBookingVisa_List();
    } catch (error) {
      Alertwarning("Có lỗi xẫy ra vui lòng F5");
    }
  };

  const columns = [
    {
      Header: "Lựa chọn",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-sm btn-success"
            onClick={(e) => Trl_spBookingVisa_View(row)}
          >
            {" "}
            <i class="fa fa-edit"></i>Cập nhật
          </button>
        </div>
      ),
      width: 200,
      fixed: "left",
    },
    {
      Header: "Trạng thái",
      accessor: "StatusVisaId",
      width: 150,
      Cell: ({ row }) => {
        let visaId = row._original.StatusVisaId;
        let bg;
        if (visaId === 1) {
          bg = "badge badge-light";
        } else if (visaId === 2) {
          bg = "badge badge-warning";
        } else if (visaId === 3) {
          bg = "badge badge-success";
        } else if (visaId === 4) {
          bg = "badge badge-danger";
        } else if (visaId === 5) {
          bg = "badge text-danger font-weight-bold";
        }

        return (
          <span className={bg}>
            {row._original?.StatusVisaId ? row._original.VisaName : ""}
          </span>
        );
      },
    },
    // {
    //   Header: "Booking/Tour",
    //   accessor: "BookingName",
    //   width: 250,
    //   Cell: ({ row }) => {
    //     return (
    //       <span>
    //         <a
    //           href={`/booking/tour-booking?bookingId=${row._original?.BookingId}&id=18`}
    //           target="_blank"
    //         >
    //           {row._original?.ServiceSaleCode}
    //         </a>
    //       </span>
    //     );
    //   },
    // },
    {
      Header: "Deadline Visa",
      accessor: "DeadlineVisa",
      width: 150,
      Cell: ({ row }) => {
        //spread the props
        return (
          <span className="badge badge-warning">
            {row._original?.DeadlineVisa
              ? changeDayvsMonth(FormatDateJson(row._original?.DeadlineVisa, 3))
              : null}
          </span>
        );
      },
    },
    {
      Header: "Thị trường",
      accessor: "ServiceName",
      width: 200,
    },
    {
      Header: "Khách hàng",
      accessor: "CustomerName",
      width: 200,
    },
    {
      Header: "SĐT",
      accessor: "Phone",
      width: 200,
    },
    {
      Header: "Passport Code",
      accessor: "PassportCode",
      width: 200,
    },
    {
      Header: "DOI",
      accessor: "PassportTimeFrom",
      width: 200,
    },
    {
      Header: "DOE",
      accessor: "PassportTimeTo",
      width: 200,
    },
    {
      Header: "THANH TOÁN",
      accessor: "StatusName",
      width: 150,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.StatusId;
        let kcheck = "badge badge-success";
        if (fls === 1) kcheck = "badge badge-danger";
        else if (fls === 3) kcheck = "badge badge-warning";
        else kcheck = "badge badge-danger";
        return (
          <span className={kcheck}>{row._original?.StatusName || ""}</span>
        );
      },
    },

    {
      Header: "TIẾN ĐỘ",
      accessor: "StatusName theo cấp",
      width: 150,
      Cell: ({ row }) => {
        return <span>{row._original?.Process || "Đang cập nhật"}</span>;
      },
    },
    {
      Header: "Số tiền HĐ",
      accessor: "Money",
      width: 350,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.StatusId;
        let kcheck = "badge badge-success";
        if (fls === 1) kcheck = "badge badge-danger";
        else if (fls === 3) kcheck = "badge badge-warning";
        else kcheck = "badge badge-danger";
        return (
          <span className={kcheck}>
            {FormatMoney(row._original?.Money || 0)}
          </span>
        );
      },
    },
    {
      Header: "Người tạo",
      accessor: "CreateName",
      width: 200,
    },
    {
      Header: "Thời gian",
      accessor: "CreateTime",
      width: 200,
    },
    {
      Header: "Ghi chú",
      accessor: "VisaNote",
    },
  ];

  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleUpdateInvoice = (d, type) => {
    if (type === 1) {
      setdataVisa({ ...dataVisa, InvoiceVisaId: d.InvoiceId });
      setRowVisa({ ...rowVisa, InvoiceVisaId: d.InvoiceId });
      setDataObject({ ...DataObject, InvoiceVisaId: d.InvoiceId });
      let newData = data.map((item) => {
        if (item.VisaId === rowVisa.VisaId) {
          return { ...item, InvoiceVisaId: d.InvoiceId };
        }
        return item;
      });
      setData(newData);
    }
  };

  const [bookingId, setBookingId] = useState(-1);

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
                THEO TOUR
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link " href="#tab_2" data-toggle="tab">
                THEO THỊ TRƯỜNG
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
                    <div className="col-md-6">
                      <h3 className="card-title">
                        <i className="fas fa-plus" />
                        <span className="font-weight-bold">
                          Quản lý visa theo tour
                        </span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      {/* <button
                        className="btn btn-danger btn-sm float-right btn-header"
                        disabled={data.length > 0 ? false : true}
                        onClick={Trl_spBookingVisa_Excel}
                      >
                        <i className="fa fa-download mr-2 " />
                        Excel
                      </button> */}
                      <button
                        className="btn btn-success btn-sm float-right btn-header"
                        onClick={() =>
                          setBookingId(serviceSaleSearch?.BookingId || 0)
                        }
                        type="button"
                      >
                        <i className="fa fa-search mr-2 " />
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body ">
                  <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-4 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Tour
                        </span>
                        <div class="input-group">
                          <SelectServiceSale
                            onSelected={(e) => setServiceSaleSearch(e)}
                            items={serviceSaleSearch?.value || 0}
                            className={"w-100 select-custom z-maxx"}
                            type={1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <TableShowDataBooking bookingId={bookingId} />
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
                        <i className="fa fa-bars" />
                        <span className="font-weight-bold">
                          Quản lý visa theo thị trường
                        </span>
                        <div className="col-md-4"></div>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      <button
                        className="btn btn-danger btn-sm float-right btn-header"
                        disabled={data.length > 0 ? false : true}
                        onClick={Trl_spBookingVisa_Excel}
                      >
                        <i className="fa fa-download mr-2 " />
                        Excel
                      </button>
                      <button
                        className="btn btn-success btn-sm float-right btn-header"
                        onClick={Trl_spBookingVisa_List}
                        type="button"
                      >
                        <i className="fa fa-search mr-2 " />
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-4">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Thị trường
                        </span>
                        <div class="input-group">
                          <SelectService
                            type={2}
                            key={"s3"}
                            onSelected={(item) => {
                              setServiceSearch(item.value);
                            }}
                            items={serviceSearch}
                            IsLoad={serviceSearch}
                            className={"w-100 select-custom"}
                          ></SelectService>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-4">
                      <div class="form-group ">
                        <span class="small font-weight-bold text-muted">
                          Thời gian
                        </span>
                        <div class="input-group ">
                          <DateTimeRangePicker
                            className="form-control2 px-1 pb-2px zIndex-300"
                            value={TimeSearch}
                            onChange={(date) => setTimeSearch(date)}
                            format="dd/MM/yyyy"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-4">
                      <div class="form-group ">
                        <span class="small font-weight-bold text-muted">
                          Tên khách hàng
                        </span>
                        <div class="input-group">
                          <input
                            type="text"
                            maxLength="500"
                            placeholder="..."
                            class="form-control2"
                            value={VisaSearch}
                            onChange={(e) => setVisaSearch(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={data.length > 0 ? "row" : "d-none"}>
                    <div className="col-12 col-sm-6 col-md-2">
                      <div className="info-box">
                        <span className="info-box-icon bg-info elevation-1">
                          <i className="fas fa-th-list"></i>
                        </span>

                        <div className="info-box-content">
                          <span className="info-box-text">Visa</span>
                          <span className="info-box-number float-left">
                            {data.length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-2">
                      <div className="info-box mb-3">
                        <span className="info-box-icon elevation-1">
                          <i class="fas fa-satellite-dish"></i>
                        </span>

                        <div className="info-box-content">
                          <span className="info-box-text">RECEIVED</span>
                          <span className="info-box-number">
                            {data.filter((p) => p.StatusVisaId === 1).length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-2">
                      <div className="info-box mb-3">
                        <span className="info-box-icon elevation-1">
                          <i class="fab fa-get-pocket text-danger"></i>
                        </span>

                        <div className="info-box-content">
                          <span className="info-box-text text-danger">
                            COLLECTING
                          </span>
                          <span className="info-box-number">
                            {data.filter((p) => p.StatusVisaId === 5).length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="clearfix hidden-md-up"></div>
                    <div className="col-12 col-sm-6 col-md-2">
                      <div className="info-box mb-3">
                        <span className="info-box-icon bg-warning elevation-1">
                          <i className="fas fa-check"></i>
                        </span>

                        <div className="info-box-content">
                          <span className="info-box-text">PROCESSING</span>
                          <span className="info-box-number">
                            {data.filter((p) => p.StatusVisaId === 2).length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="clearfix hidden-md-up"></div>

                    <div className="col-12 col-sm-6 col-md-2">
                      <div className="info-box mb-3">
                        <span className="info-box-icon bg-success elevation-1">
                          <i className="fas fa-file"></i>
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">APPROVED</span>
                          <span className="info-box-number">
                            {data.filter((p) => p.StatusVisaId === 3).length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="clearfix hidden-md-up"></div>
                    <div className="col-12 col-sm-6 col-md-2">
                      <div className="info-box mb-3">
                        <span className="info-box-icon bg-danger elevation-1">
                          <i className="fas fa-undo"></i>
                        </span>

                        <div className="info-box-content">
                          <span className="info-box-text">REFUSED</span>
                          <span className="info-box-number">
                            {data.filter((p) => p.StatusVisaId === 4).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={data.length > 0 ? "row z-10" : "d-none"}>
                    <DataTable data={data} columns={columns} IsSearch={true} />
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
          <Modal.Header className="p-2">
            <Modal.Title id="example-custom-modal-styling-title">
              <div class="text-center">Cập nhật visa</div>
            </Modal.Title>
            <button
              type="button"
              class="close"
              aria-label="Close"
              onClick={closeModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body class="p-1">
            <VisaForm
              data={rowVisa}
              onVisa={handleSuccessVisa}
              handleShow={() => {
                setShowInvoiceVisa(true);
                setInvoiceStyle({
                  ...invoiceStyleList.find((item) => item.StyleId === 4),
                  TypeInvoice: 1,
                });
              }}
              setOpacity={setOpacity}
            />
          </Modal.Body>
        </Modal>

        {/* Modal hoa don cho visa */}
        <Modal
          show={showInvoiceVisa}
          onHide={() => setShowInvoiceVisa(false)}
          backdrop="static"
          keyboard={false}
          size="xl"
          className={`custom-modal-w-90   z-maxxx`}
        >
          <Modal.Header className="py-2 border-bottom-0">
            <Modal.Title className="ml-auto">PHIẾU PĐX</Modal.Title>
            <button
              type="button"
              class="close"
              aria-label="Close"
              onClick={() => {
                setShowInvoiceVisa(false);
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body class="p-1">
            <InvoiceCustomerMain
              Booking={booking}
              DataObject={DataObject}
              handleShow={() => setShowInvoiceVisa(true)}
              IsActive={Math.random()}
              setOpacity={setOpacity}
              invoiceStyle={invoiceStyle}
              onInvoiceInfor={handleUpdateInvoice}
              TypeOfReceipt={"PĐXVS"}
            />
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

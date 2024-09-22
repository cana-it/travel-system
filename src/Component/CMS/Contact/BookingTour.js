import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { confirmAlert } from "react-confirm-alert";
import { DataTable } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  FirstOrLastDayinMonth,
  FormatDateJson,
} from "../../../Utils";
import "react-datetime-picker/dist/DateTimePicker.css";
import DateTimePicker from "react-datetime-picker";
import { useDispatch } from "react-redux";
import { SelectBookingStatus } from "../../../Common/CMS/SelectBookingStatus";
import { SelectTour } from "../../../Common/CMS/SelectTour";
import moment from "moment";
export const BookingTour = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const [Data, setData] = useState([]);
  const [SearchValue, setSearchValue] = useState({
    FromDate: FirstOrLastDayinMonth(new Date(), 1),
    ToDate: new Date(moment().endOf("day")),
  });
  const [IsDateStart, setIsDateStart] = useState();
  const [DateStart, setDateStart] = useState("");
  const onDateStart = (item) => {
    setIsDateStart(item);
    setDateStart(FormatDateJson(item));
  };
  const [BookingStatus, setBookingStatus] = useState(0);
  const [FromValue, setFromValue] = useState({
    BookingTourId: 0,
    BookingStatus: "",
    TourId: "",
    BookingOn: 1,
    CustomerName: "",
    CustomerPhone: "",
    CustomerEmail: "",
    CustomerAddress: "",
    AdultNumber: "",
    ChildNumber: "",
    Note: "",
    DateStart: new Date(),
  });

  const ClearForm = () => {
    setFromValue({
      TourId: "",
      CustomerName: "",
      CustomerPhone: "",
      CustomerEmail: "",
      CustomerAddress: "",
      AdultNumber: "",
      ChildNumber: "",
      Note: "",
      DateStart: "",
    });
  };
  useEffect(() => {
    CMS_spBookingTour_List();
  }, []);

  const CMS_spBookingTour_List = async () => {
    try {
      setData([]);
      const pr = {
        BookingTourId: 0,
        FromDate: SearchValue.FromDate,
        ToDate: SearchValue.ToDate,
        BookingStatus: BookingStatus,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "CMS_spBookingTour_List",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      if (list.length > 0) {
        setData(list);
        return;
      }
      Alertwarning("Không có dữ liệu");
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };

  const CMS_spBookingTour_Save = async (type = 0) => {
    try {
      let params;
      if (type === 0) {
        if (DateStart === undefined || DateStart === "") {
          Alertwarning("Vui lòng chọn ngày bắt đầu");
          return;
        }
        params = {
          Json: JSON.stringify({
            BookingTourId: FromValue.BookingTourId,
            BookingStatus: FromValue.BookingStatus,
            TourId: FromValue.TourId,
            BookingOn: FromValue.BookingOn,
            CustomerName: FromValue.CustomerName,
            CustomerPhone: FromValue.CustomerPhone,
            CustomerEmail: FromValue.CustomerEmail,
            CustomerAddress: FromValue.CustomerAddress,
            AdultNumber: FromValue.AdultNumber,
            ChildNumber: FromValue.ChildNumber,
            DateStart: DateStart,
            Note: FromValue.Note,
            Creater: Creater,
          }),
          func: "CMS_spBookingTour_Save",
        };
      } else {
        params = {
          Json: JSON.stringify({
            BookingTourId: FromValue.BookingTourId,
            BookingStatus: FromValue.BookingStatus,
            Creater: Creater,
          }),
          func: "CMS_spBookingTour_Save",
        };
      }

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        setIsOpen(false);
        setIsOpenSave(false);
        CMS_spBookingTour_List();
        ClearForm();
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.ReturnMess);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };

  const CMS_spBookingTour_Edit = async (item) => {
    setIsOpen(true);
    try {
      let Data = item.row._original;
      setFromValue({
        BookingTourId: Data.BookingTourId,
        BookingStatus: Data.BookingStatus,
      });
    } catch (er) {
      Alerterror("Lỗi dữ liệu");
    }
  };

  const CMS_spBookingTour_Delete = (item) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return <ConfirmAlertUi onClose={onClose} item={item} />;
      },
    });
  };

  const CMS_spBookingTour_Delete_Action = async (item) => {
    try {
      const pr = {
        BookingTourId: item._original.BookingTourId,
        IsDelete: 1,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: " CMS_spBookingTour_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        CMS_spBookingTour_List();
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.ReturnMess);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const ConfirmAlertUi = (props) => {
    return (
      <div className="card-body border-left-red">
        <h3>Xác nhận xóa dữ liệu!</h3>
        <p>
          Bạn có chắc chắn muốn xóa{" "}
          <strong>{props.item._original.MenuName}</strong>{" "}
        </p>
        <button className="btn btn-small btn-warning" onClick={props.onClose}>
          {" "}
          <i className="fa fa-undo"> </i> Hủy
        </button>
        <button
          className="btn btn-small btn-danger margin-left-5"
          onClick={() => {
            props.onClose();
            CMS_spBookingTour_Delete_Action(props.item);
          }}
        >
          <i className="fa fa-trash"> </i> Xóa
        </button>
      </div>
    );
  };

  const [modalIsOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  const [isOpenSave, setIsOpenSave] = useState(false);
  const openModalSave = () => {
    setIsOpenSave(true);
  };
  const closeModalSave = () => {
    setIsOpenSave(false);
  };
  const viewAdd = () => {
    ;
    openModalSave();
  };
  const columns = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 40,
      filterable: false,
      special: true,
      show: true,
      className: "text-center",
    },
    {
      Header: "Tùy chọn",
      accessor: "Edit",
      className: "text-center",
      Cell: ({ row }) => (
        <div>
          <button
            type="button"
            title="Sửa"
            className="btn btn-success btn-sm m-1 btn-add"
            onClick={(e) => {
              CMS_spBookingTour_Edit({ row });
            }}
          >
            <i className="fa fa-edit"></i>
          </button>

          <button
            type="button"
            title="Xóa"
            className="btn btn-danger btn-sm m-1 btn-add"
            onClick={(e) => CMS_spBookingTour_Delete(row)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </div>
      ),
    },
    {
      Header: "Trạng thái",
      accessor: "BookingStatus",
      Cell: ({ row }) => (
        <span>
          {row._original.BookingStatus === 1 ? (
            <span>
              <button type="button" className="btn btn-sm bg-danger">
                <i className="fas fa-exclamation pr-2"></i> Chưa xử lý
              </button>
            </span>
          ) : (
            ""
          )}
          {row._original.BookingStatus === 2 ? (
            <span>
              <button type="button" className="btn btn-sm bg-warning">
                <i className="fas fa-spinner pr-2"></i> Đang xử lý
              </button>
            </span>
          ) : (
            ""
          )}
          {row._original.BookingStatus === 3 ? (
            <span>
              <button type="button" className="btn btn-sm bg-success">
                <i className="fas fa-check pr-2"></i> Đã xử lý
              </button>
            </span>
          ) : (
            ""
          )}
        </span>
      ),
      width: 200,
      className: "text-center",
    },
    {
      Header: "Tên tour",
      accessor: "NameTour",
      className: "text-center",
      width: 300,
    },
    {
      Header: "Tên khách hàng",
      accessor: "CustomerName",
      className: "text-center",
      width: 300,
    },

    {
      Header: "Số điện thoại",
      accessor: "CustomerPhone",
      className: "text-center",
      width: 200,
    },
    {
      Header: "Email",
      accessor: "CustomerEmail",
      className: "text-center",
      width: 200,
    },
    {
      Header: "Địa chỉ",
      accessor: "CustomerAddress",
      className: "text-center",
      width: 300,
    },
    {
      Header: "Số lượng người lớn",
      accessor: "AdultNumber",
      className: "text-center",
    },
    {
      Header: "Số lượng trẻ em",
      accessor: "ChildNumber",
      className: "text-center",
    },
    {
      Header: "Nội dung",
      accessor: "Note",
      className: "text-center",
    },
    {
      Header: "Hình thức thanh toán",
      accessor: "TypePayment",
      className: "text-center",
    },
    {
      Header: "Ngày bắt khởi hành",
      accessor: "DateStart",
      className: "text-center",
      Cell: (item) => <span>{FormatDateJson(item.value, 10)}</span>,
    },

    {
      Header: "Thời gian đăng ký",
      accessor: "CreateTime",
      className: "text-center",
      Cell: (item) => <span>{FormatDateJson(item.value, 10)}</span>,
    },
  ];

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header">
          <span className="HomeTitle">Quản lý đặt tour </span>
          <div className="float-right">
            <button
              onClick={(e) => {
                viewAdd();
                setFromValue({ BookingTourId: 0, BookingOn: 1 });
                setDateStart(new Date());
              }}
              type="button"
              className="btn btn-sm btn-success pull-right margin-left-5"
              style={{ marginTop: "-7px" }}
            >
              <i className="fas fa-plus pr-2"></i>
              Thêm đặt tour
            </button>
            <button
              onClick={CMS_spBookingTour_List}
              type="button"
              className="btn btn-sm btn-success pull-right margin-left-5"
              style={{ marginTop: "-7px" }}
            >
              <i className="fas fa-search pr-2"></i>
              Tìm kiếm
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row" style={{ marginTop: "-15px" }}>
            <div className="col-md-4">
              <div className="form-group">
                <span className="small">
                  Từ ngày <span className="red">(*)</span>
                </span>
                <DateTimePicker
                  className={"form-control2"}
                  format="dd/MM/yyyy"
                  value={SearchValue.FromDate}
                  onChange={(e) =>
                    setSearchValue({ ...SearchValue, FromDate: e })
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <span className="small">
                  Đến ngày <span className="red">(*)</span>
                </span>
                <DateTimePicker
                  className={"form-control2"}
                  format="dd/MM/yyyy"
                  value={SearchValue.ToDate}
                  onChange={(e) =>
                    setSearchValue({ ...SearchValue, ToDate: e })
                  }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <span className="small">Trạng thái</span>
                <SelectBookingStatus
                  onSelected={(e) => setBookingStatus(e?.value)}
                  items={BookingStatus}
                />
              </div>
            </div>
          </div>
          <div className="col-md-12 mb-3">
            <DataTable data={Data} columns={columns} fixedColumns="true" />
          </div>
        </div>
      </div>

      {/* Module save */}
      <Modal
        show={isOpenSave}
        onHide={closeModalSave}
        className=" custom-modal-w-90"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header className="p-2">
          <Modal.Title id="example-custom-modal-styling-title">
            <div className="">
              {FromValue.BookingTourId === 0
                ? "Thêm mới BookingTour"
                : "Chỉnh sửa BookingTour"}
            </div>
          </Modal.Title>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={closeModalSave}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="card-body p-0">
            <div className="row">
              <div className="col-md-6 mt-2">
                <div className="form-group">
                  <label className="no-absolute">
                    Chọn Tour <span className="text-danger">(*)</span>
                  </label>
                  <SelectTour
                    Id={FromValue.TourId}
                    onSelected={(e) => {
                      setFromValue({
                        ...FromValue,
                        TourId: e?.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <div className="form-group">
                  <label className="no-absolute">
                    Ngày bắt đầu <span className="text-danger">(*)</span>
                  </label>
                  <DateTimePicker
                    onChange={onDateStart}
                    value={IsDateStart}
                    format="dd/MM/yyyy"
                    className={"form-control2"}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="no-absolute">
                    Tên khách hàng <span className="text-danger">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={FromValue.CustomerName}
                    onChange={(e) =>
                      setFromValue({
                        ...FromValue,
                        CustomerName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="no-absolute">
                    Số điện thoại khách hàng{" "}
                    <span className="text-danger">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={FromValue.CustomerPhone}
                    onChange={(e) =>
                      setFromValue({
                        ...FromValue,
                        CustomerPhone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="no-absolute">
                    Địa chỉ khách hàng <span className="text-danger">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={FromValue.CustomerAddress}
                    onChange={(e) =>
                      setFromValue({
                        ...FromValue,
                        CustomerAddress: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="no-absolute">
                    Email khách hàng <span className="text-danger">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={FromValue.CustomerEmail}
                    onChange={(e) =>
                      setFromValue({
                        ...FromValue,
                        CustomerEmail: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="no-absolute">
                    Số lượng người lớn <span className="text-danger">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={FromValue.AdultNumber}
                    onChange={(e) =>
                      setFromValue({
                        ...FromValue,
                        AdultNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="no-absolute">
                    Số lượng trẻ em <span className="text-danger">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={FromValue.ChildNumber}
                    onChange={(e) =>
                      setFromValue({
                        ...FromValue,
                        ChildNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="no-absolute">Thông tin thêm</label>
                  <textarea
                    rows={5}
                    className="form-control"
                    value={FromValue.Note}
                    onChange={(e) =>
                      setFromValue({ ...FromValue, Note: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="col-sm-12 col-md-12 mt-2">
                <button
                  onClick={() => {
                    ClearForm();
                  }}
                  type="button"
                  className="btn btn-sm btn-danger pull-right margin-left-5"
                >
                  <i className="fa fa-trash pr-2"></i>
                  Clear form
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-success pull-right"
                  onClick={CMS_spBookingTour_Save}
                >
                  <i className="fa fa-save pr-2"></i>
                  {FromValue.BookingTourId === 0 ? "Lưu" : "Chỉnh sửa"}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Module Change Status */}
      <Modal
        show={modalIsOpen}
        onHide={closeModal}
        className=" custom-modal-w-75"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header className="p-2">
          <Modal.Title id="example-custom-modal-styling-title">
            <div className="">Sửa trạng thái</div>
          </Modal.Title>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={closeModal}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="card-body p-0">
            <div className="row">
              <div className="col-md-12 m-auto">
                <div className="form-group">
                  <span className="small font-weight-bold text-muted">
                    Trạng thái
                    <strong className="check-point">(*)</strong>
                  </span>
                  <SelectBookingStatus
                    Id={FromValue.BookingStatus}
                    onSelected={(e) => {
                      setFromValue({
                        ...FromValue,
                        BookingStatus: e?.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-sm-12 col-md-12 mt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-success pull-right"
                  onClick={() => CMS_spBookingTour_Save(1)}
                >
                  <i className="fa fa-edit pr-2"></i>
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

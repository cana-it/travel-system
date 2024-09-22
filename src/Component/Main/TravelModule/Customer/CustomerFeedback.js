import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertsuccess,
  Alerterror,
  FormatDateJson,
  ConfirmAlert,
  HandleTextArea,
} from "../../../../Utils";
import { Img } from "react-image";
import {
  DataTable,
  DataTableBooking,
  SelectService,
  SelectServiceSale,
} from "../../../../Common";
import Modal from "react-bootstrap/Modal";
import "react-confirm-alert/src/react-confirm-alert.css";
import moment from "moment";
import Select from "react-select";
import { useMemo } from "react";

export const CustomerFeedback = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");

  const [ServiceId, setServiceId] = useState({ value: 0 });
  const [serviceSale, setServiceSale] = useState({ value: 0 });
  const [timeSearch, setTimeSearch] = useState(moment().format("YYYY-MM"));
  const [dataBooking, setDataBooking] = useState([]);
  const [DataTableList, setDataTableList] = useState([]);
  const [bookingCode, setBookingCode] = useState("");
  const [groupFamilyList, setGroupFamilyList] = useState([]);
  const [noteList, setNoteList] = useState([]);

  const [HiddenTable, setHiddenTable] = useState(true);
  const [TotalCusY, setTotalCusY] = useState(0);
  const [TotalCusN, setTotalCusN] = useState(0);
  const [TotalVisa, setTotalVisa] = useState(0);
  const [Total, setTotal] = useState(0);
  const [IsOpen, setIsOpen] = useState(false);
  const [IsOpenFeedBack, setIsOpenFeedBack] = useState(false);
  const [CustomerView, setCustomerView] = useState([]);
  const [showDetail, setShowDetail] = useState(false);

  // Feedback

  const [dataDetailReview, setdataDetailReview] = useState({
    Food: "",
    Hotel: "",
    Service: "",
    TourGuide: "",
    Schedule: "",
    Sales: "",
    HotelReviewId: { value: 1, label: "Tuyệt vời", color: "violet" },
    FoodReviewId: { value: 1, label: "Tuyệt vời", color: "violet" },
    ServiceReviewId: { value: 1, label: "Tuyệt vời", color: "violet" },
    TourGuideReviewId: { value: 1, label: "Tuyệt vời", color: "violet" },
    ScheduleReviewId: { value: 1, label: "Tuyệt vời", color: "violet" },
    SalesReviewId: { value: 1, label: "Tuyệt vời", color: "violet" },
    Notes: "",
  });

  const [reviewList, setReviewList] = useState([
    { value: 1, label: "Tuyệt vời", color: "violet" },
    { value: 2, label: "Tốt", color: "success" },
    { value: 3, label: "Khá", color: "info" },
    { value: 4, label: "Trung bình", color: "orange" },
    { value: 5, label: "Kém, Khách complain", color: "danger" },
    { value: 6, label: "Không liên hệ được khách hàng", color: "warning" },
  ]);

  const CloseModal = () => {
    setIsOpen(false);
    setIsOpenFeedBack(false);
    setNoteList([]);
    setGroupFamilyList([]);

    setdataDetailReview({
      Food: "",
      Hotel: "",
      Service: "",
      TourGuide: "",
      Schedule: "",
      Sales: "",
      HotelReviewId: { value: 1, label: "Tuyệt vời" },
      FoodReviewId: { value: 1, label: "Tuyệt vời" },
      ServiceReviewId: { value: 1, label: "Tuyệt vời" },
      TourGuideReviewId: { value: 1, label: "Tuyệt vời" },
      ScheduleReviewId: { value: 1, label: "Tuyệt vời" },
      SalesReviewId: { value: 1, label: "Tuyệt vời" },
      Notes: "",
    });
  };

  const Trl_spCustomer_Feedback_List = async () => {
    try {
      const pr = {
        ToDate: moment(timeSearch).format("MM/01/YYYY 00:00:00"),
        FromDate: moment(timeSearch)
          .endOf("month")
          .format("MM/DD/YYYY 23:59:59"),
        ServiceId: ServiceId.value,
        BookingId: serviceSale?.BooKingId || 0,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomer_Feedback_List",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length !== 0) {
        setDataBooking(result);
      }
    } catch (error) {
      ;
    }
  };

  const FeedBack = (e) => {
    let gr = DataTableList.filter((x) => x.Key === e.original.Key);
    setGroupFamilyList(gr);
    if (gr.length > 1) {
      setNoteList(
        gr.map((x) => {
          return {
            Notes: HandleTextArea(x?.Notes, 1) || "",
            CustomerName: x.CustomerName,
            CustomerId: x.CustomerId,
            BookingId: x.BookingId,
            CustomerFeedbackId: x?.CustomerFeedbackId || 0,
          };
        })
      );
    } else {
      setNoteList([
        {
          Notes: HandleTextArea(e.original?.Notes, 1) || "",
          CustomerName: e.original.CustomerName,
          CustomerId: e.original.CustomerId,
          BookingId: e.original.BookingId,
          CustomerFeedbackId: e.original?.CustomerFeedbackId || 0,
        },
      ]);
    }
    e.original.CustomerFeedbackId !== 0 &&
      e.original?.CustomerFeedbackId &&
      setdataDetailReview({
        Food: HandleTextArea(e.original?.Food, 1) || "",
        Hotel: HandleTextArea(e.original?.Hotel, 1) || "",
        Service: HandleTextArea(e.original?.Service, 1) || "",
        TourGuide: HandleTextArea(e.original?.TourGuide, 1) || "",
        Schedule: HandleTextArea(e.original?.Schedule, 1) || "",
        Sales: HandleTextArea(e.original?.Sales, 1) || "",
        HotelReviewId: reviewList.find(
          (x) => x.value === e.original?.HotelReviewId
        ),
        FoodReviewId: reviewList.find(
          (x) => x.value === e.original?.FoodReviewId
        ),
        ServiceReviewId: reviewList.find(
          (x) => x.value === e.original?.ServiceReviewId
        ),
        TourGuideReviewId: reviewList.find(
          (x) => x.value === e.original?.TourGuideReviewId
        ),
        ScheduleReviewId: reviewList.find(
          (x) => x.value === e.original?.ScheduleReviewId
        ),
        SalesReviewId: reviewList.find(
          (x) => x.value === e.original?.SalesReviewId
        ),
      });

    setIsOpenFeedBack(true);
  };

  const Trl_spCustomer_Feedback_Save = async () => {
    try {
      const pr = noteList.map((x) => {
        return {
          CustomerFeedbackId: x.CustomerFeedbackId,
          CustomerId: x.CustomerId,
          BookingId: x.BookingId,
          Food: HandleTextArea(dataDetailReview.Food),
          Hotel: HandleTextArea(dataDetailReview.Hotel),
          Sales: HandleTextArea(dataDetailReview.Sales),
          Schedule: HandleTextArea(dataDetailReview.Schedule),
          TourGuide: HandleTextArea(dataDetailReview.TourGuide),
          Service: HandleTextArea(dataDetailReview.Service),
          FoodReviewId: dataDetailReview.FoodReviewId.value,
          HotelReviewId: dataDetailReview.HotelReviewId.value,
          SalesReviewId: dataDetailReview.SalesReviewId.value,
          ScheduleReviewId: dataDetailReview.ScheduleReviewId.value,
          TourGuideReviewId: dataDetailReview.TourGuideReviewId.value,
          ServiceReviewId: dataDetailReview.ServiceReviewId.value,
          Notes: HandleTextArea(x.Notes),
          Creater: +Creater,
        };
      });

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomer_Feedback_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        CloseModal();
        Trl_spCustomer_FeedbackDetail_List(noteList[0].BookingId, 1);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spCustomer_Feedback_Delete = async (e) => {
    let Ojb = e.original;
    try {
      const pr = {
        FeedbackId: Ojb.CustomerFeedbackId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomer_Feedback_Delete",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spCustomer_FeedbackDetail_List(e.original.BookingId, 1);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spCustomer_FeedbackDetail_List = async (bookingId, type = 0) => {
    try {
      setDataTableList([]);
      const pr = {
        BookingId: type === 0 ? bookingId._original.BookingId : bookingId,
      };
      type === 0 && setBookingCode(bookingId._original.ServiceSaleCode);
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomer_FeedbackDetail_List",
      };
      const respone = await mainAction.API_spCallServer(params, dispatch);

      let checkSale = true,
        saleId = 0,
        groupFamily = 0;

      let newRes = respone.map((item, index) => {
        let isVAT = false;
        if (item?.VAT1 > 0 || item?.VAT2 > 0 || item?.VAT3 > 0) {
          isVAT = true;
        }

        let code = "";
        if (item?.Brithday) {
          let name = item.CustomerName.split(" ").filter((e) =>
            String(e).trim()
          );
          let lastName = name[name.length - 1];
          let firstName = name[0];
          let formatDate = moment(item.Brithday).format("DDMMYY");
          code = `${firstName}${lastName}${formatDate}`;
        }
        return {
          ...item,
          DOB: item?.Brithday ? FormatDateJson(item.Brithday, 7) : null,
          DOI: item?.PassportTimeFrom
            ? FormatDateJson(item.PassportTimeFrom, 7)
            : null,
          DOE: item?.PassportTimeTo
            ? FormatDateJson(item.PassportTimeTo, 7)
            : null,
          Room: item.RoomCode,
          PassportStatus: item.PassportScan,
          Passport: item.PassportCode,
          Tel: item.Phone,
          Name: item.CustomerName?.toUpperCase(),
          From: item.GoFrom,
          TourPrice: item.PriceTour,
          Discount: item.PriceTour_Discount,
          Surcharge: item.PriceTour_Surcharge,
          Deposit1: item.InvoiceId1,
          Deposit2: item.InvoiceId2,
          Deposit3: item.InvoiceId3,
          Note: item.Note,
          Visa: item.Visa,
          PlaneTicket: item.PlaneCode,
          Bag: item.Bag,
          RegisterDate: item?.RegisterDate
            ? FormatDateJson(item.RegisterDate, 7)
            : null,
          Sale: item.SaleStaffId,
          Checked: false,
          StatusCustomer: item?.StatusCustomer || "OK",
          ObjectId: 1,
          ObjectName: "Khách hàng",
          isVAT: isVAT,
          No: index + 1,
          GroupFamily: item.GroupFamily || 0,
          CustomerCode: code,
        };
      });
      let key = 0;
      let bkid = type === 0 ? bookingId._original.BookingId : bookingId;
      let tempArr = [
        ...newRes
          .filter((item) => {
            return (
              (item.StatusCustomer === "OK" ||
                (item?.BookingId === bkid && item.StatusCustomer === "JOIN")) &&
              item?.BookingDetailId &&
              !item.IsTourLeader &&
              item.Name !== "TOUR LEADER"
            );
          })
          .map((iem, index) => {
            if (index === 0) {
              key = 0;
              saleId = iem.Sale_StaffId;
              groupFamily = iem?.GroupFamily || 0;
            } else {
              if (saleId !== iem.Sale_StaffId) {
                checkSale = !checkSale;
                key++;
                saleId = iem.Sale_StaffId;
              }
              if (
                saleId === iem.Sale_StaffId &&
                groupFamily !== iem?.GroupFamily
              ) {
                key++;
                checkSale = !checkSale;
                groupFamily = iem?.GroupFamily;
              }
            }
            let isRed = false;
            if (
              iem?.FoodReviewId === 5 ||
              iem?.HotelReviewId === 5 ||
              iem?.TourGuideReviewId === 5 ||
              iem?.SalesReviewId === 5 ||
              iem?.ServiceReviewId === 5 ||
              iem?.ScheduleReviewId === 5
            ) {
              isRed = true;
            }
            return {
              ...iem,
              No: index + 1,
              checkSale: checkSale,
              isRed: isRed,
              Key: key,
            };
          }),
      ];
      setDataTableList(tempArr);
      // setHiddenTable(false);

      // setBookingDetails(tempArr);
    } catch (error) {
      ;
    }
  };

  const columns = [
    {
      Header: "Tùy Chọn",
      accessor: "[row identifier to be passed to button]",
      width: 200,
      filterable: false,
      sortable: false,
      Cell: ({ row }) => (
        <div>
          <span>
            {/* <button
              className="btn btn-xs btn-success mr-1"
              onClick={(e) => See(row)}
            >
              <i class="fa fa-eye"></i> Xem
            </button> */}
            <button
              className={
                row.original?.CustomerFeedbackId
                  ? "btn btn-xs btn-success mr-1"
                  : "btn btn-xs btn-outline-info mr-1"
              }
              onClick={(e) => FeedBack(row)}
            >
              <i class="far fa-edit pr-1"></i>
              {!row.original?.CustomerFeedbackId ? "Feedback" : "Đã Feedback"}
            </button>

            {!row.original?.CustomerFeedbackId ? (
              ""
            ) : (
              <button
                className="btn btn-xs btn-danger"
                onClick={(e) => {
                  ConfirmAlert("Xác nhận", "Bạn có muốn xóa không?", () => {
                    Trl_spCustomer_Feedback_Delete(row);
                  });
                }}
              >
                <i class="fas fa-eraser"></i> Xóa
              </button>
            )}
          </span>
        </div>
      ),
    },
    {
      Header: "STT",
      width: 50,
      textAlign: "center",
      filterable: false,
      sortable: false,
      accessor: "No",
    },
    {
      Header: "Full Name",
      accessor: "Name",
      minWidth: 250,
      Cell: ({ row }) => {
        return (
          <div>
            {row.original?.Notes?.length > 0 ? (
              <span className="text-dark">
                {row.original?.CustomerName} (*)
              </span>
            ) : (
              <span className="text-dark">{row.original?.CustomerName}</span>
            )}
          </div>
        );
      },
      disableResizing: true,
    },
    {
      Header: "Sex",
      accessor: "Sex",
      disableResizing: true,
      width: 130,
    },
    {
      Header: "DOB",
      accessor: "DOB",
      disableResizing: true,
      width: 110,
    },
    {
      Header: "Tel",
      accessor: "Tel",
      disableResizing: true,
      width: 110,
    },
    {
      Header: "PassPort No",
      accessor: "PassportCode",
      width: 110,
    },
    {
      Header: "DOI",
      accessor: "DOI",
      width: 110,
      disableResizing: true,
    },
    {
      Header: "DOE",
      accessor: "DOE",
      disableResizing: true,
      width: 110,
    },
    {
      Header: "Visa Status",
      accessor: "Visa",
      disableResizing: true,
      width: 110,
      Cell: ({ row }) => {
        let bg;
        if (row.original?.StatusVisaId === 1 && row.original?.CustomerId) {
          bg = "badge badge-light";
        } else if (
          row.original?.StatusVisaId === 2 &&
          row.original?.CustomerId
        ) {
          bg = "badge badge-warning";
        } else if (
          row.original?.StatusVisaId === 3 &&
          row.original?.CustomerId
        ) {
          bg = "badge badge-success";
        } else if (
          row.original?.StatusVisaId === 4 &&
          row.original?.CustomerId
        ) {
          bg = "badge badge-danger";
        } else if (
          row.original?.StatusVisaId === 5 &&
          row.original?.CustomerId
        ) {
          bg = "badge text-danger font-weight-bold";
        } else if (
          row.original?.StatusVisaId === 6 &&
          row.original?.CustomerId
        ) {
          bg = "badge text-violet font-weight-bold";
        }
        return (
          <div
            className={`w-100 cursor-pointer h-100 table-open__cell center-item ${bg} fs-12`}
          >
            {" "}
            {row.original?.CustomerId
              ? row.original?.VisaName
                ? row.original?.VisaName
                : ""
              : ""}{" "}
          </div>
        );
      },
    },
    {
      Header: "From",
      accessor: "GoFrom",
      width: 150,
    },
    {
      Header: "Sales",
      accessor: "StaffName",
      width: 250,
    },
    // {
    //   Header: "Feedback Ăn Uống",
    //   accessor: "FoodService",
    //   width: 300,
    // },
    // {
    //   Header: "Feedback Khách Sạn",
    //   accessor: "HotelService",
    //   width: 300,
    // },
    // {
    //   Header: "Feedback Dịch Vụ Phục Vụ",
    //   accessor: "WaitressService",
    //   width: 300,
    // },
    // {
    //   Header: "Feedback Lịch Trình",
    //   accessor: "Schedule",
    //   width: 300,
    // },
    // {
    //   Header: "Feedback Hướng Dẫn Viên",
    //   accessor: "TourGuide",
    //   width: 300,
    // },
    // {
    //   Header: "Feedback Tư Vấn Viên",
    //   accessor: "Counselor",
    //   width: 300,
    // },
    {
      Header: "Ghi Chú",
      accessor: "Notes",
      width: 300,
    },
  ];

  const columnsBooking = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 40,
      textAlign: "center",
      filterable: false,
      sortable: false,
    },
    {
      Header: "Tùy Chọn",
      accessor: "[row identifier to be passed to button]",
      width: 100,
      filterable: false,
      sortable: false,
      Cell: ({ row }) => (
        <div>
          <span>
            <button
              className="btn btn-sm btn-success"
              onClick={(e) => {
                Trl_spCustomer_FeedbackDetail_List(row);
                setShowDetail(true);
              }}
            >
              <i class="fa fa-eye"></i> Xem
            </button>
          </span>
        </div>
      ),
    },
    {
      Header: "Thị trường",
      accessor: "ServiceName",
      width: 150,
    },
    {
      Header: "Mã tour",
      accessor: "ServiceSaleCode",
      width: 300,
    },
    {
      Header: "Ngày khởi hành",
      accessor: "DateSaleFrom",
      Cell: ({ row }) => {
        return (
          <div>
            {row._original?.DateSaleFrom
              ? moment(row._original?.DateSaleFrom).format("DD/MM/YYYY")
              : ""}
          </div>
        );
      },
      width: 200,
    },
    {
      Header: "Ngày kết thúc",
      accessor: "DateSaleTo",
      Cell: ({ row }) => {
        return (
          <div>
            {row._original?.DateSaleTo
              ? moment(row._original?.DateSaleTo).format("DD/MM/YYYY")
              : ""}
          </div>
        );
      },
      width: 200,
    },
  ];

  const updateMyData = (index, value, property, type) => {
    if (type === 0) {
      setdataDetailReview({
        ...dataDetailReview,
        [property]: value,
      });
    }
    if (type === 1) {
      setNoteList((old) =>
        old.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              [property]: value,
            };
          }
          return item;
        })
      );
    }
  };

  const EditableCell = ({
    ivalue = "",
    index = "",
    property = "",
    type = 0,
    edit = true,
  }) => {
    const [value, setValue] = useState(ivalue);
    const onChange = (e) => {
      setValue(e.target.value);
    };

    const onBlur = (e) => {
      updateMyData(index, value, property, type);
    };

    useEffect(() => {
      setValue(ivalue);
    }, [ivalue]);

    return (
      <textarea
        type="text"
        rows="5"
        class="form-control2"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    );
  };

  const RenderReview = useMemo(() => {
    return (
      <div class="row">
        <div class="col-sm-12 col-md-6 m-auto">
          <div className="card">
            <div className="card-header ">
              <h3 className="card-title">Khách sạn</h3>
            </div>
            <div className="card-body">
              <div class="form-group m-0">
                <Select
                  className={`select-custom mb-3 select-custom-text-${dataDetailReview?.HotelReviewId.color}`}
                  value={dataDetailReview.HotelReviewId}
                  onChange={(e) =>
                    setdataDetailReview({
                      ...dataDetailReview,
                      HotelReviewId: e,
                    })
                  }
                  options={reviewList}
                />
                <div class="input-group">
                  <EditableCell
                    ivalue={dataDetailReview.Hotel}
                    index={0}
                    property={"Hotel"}
                    type={0}
                    edit={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-6 m-auto">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Ăn uống</h3>
            </div>
            <div className="card-body">
              <div class="form-group m-0">
                <Select
                  className={`select-custom mb-3 select-custom-text-${dataDetailReview?.FoodReviewId.color}`}
                  value={dataDetailReview.FoodReviewId}
                  onChange={(e) =>
                    setdataDetailReview({
                      ...dataDetailReview,
                      FoodReviewId: e,
                    })
                  }
                  options={reviewList}
                />
                <div class="input-group">
                  <EditableCell
                    ivalue={dataDetailReview.Food}
                    index={0}
                    property={"Food"}
                    type={0}
                    edit={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-6 m-auto">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Dịch vụ phục vụ</h3>
            </div>
            <div className="card-body">
              <div class="form-group m-0">
                <Select
                  className={`select-custom mb-3 select-custom-text-${dataDetailReview?.ServiceReviewId.color}`}
                  value={dataDetailReview.ServiceReviewId}
                  onChange={(e) =>
                    setdataDetailReview({
                      ...dataDetailReview,
                      ServiceReviewId: e,
                    })
                  }
                  options={reviewList}
                />
                <div class="input-group">
                  <EditableCell
                    ivalue={dataDetailReview.Service}
                    index={0}
                    property={"Service"}
                    type={0}
                    edit={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-6 m-auto">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Lịch trình</h3>
            </div>
            <div className="card-body">
              <div class="form-group m-0">
                <Select
                  className={`select-custom mb-3 select-custom-text-${dataDetailReview?.ScheduleReviewId.color}`}
                  value={dataDetailReview.ScheduleReviewId}
                  onChange={(e) =>
                    setdataDetailReview({
                      ...dataDetailReview,
                      ScheduleReviewId: e,
                    })
                  }
                  options={reviewList}
                />
                <div class="input-group">
                  <EditableCell
                    ivalue={dataDetailReview.Schedule}
                    index={0}
                    property={"Schedule"}
                    type={0}
                    edit={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-6 m-auto">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Hướng dẫn viên</h3>
            </div>
            <div className="card-body">
              <div class="form-group m-0">
                <Select
                  className={`select-custom mb-3 select-custom-text-${dataDetailReview?.TourGuideReviewId.color}`}
                  value={dataDetailReview.TourGuideReviewId}
                  onChange={(e) =>
                    setdataDetailReview({
                      ...dataDetailReview,
                      TourGuideReviewId: e,
                    })
                  }
                  options={reviewList}
                />
                <div class="input-group">
                  <EditableCell
                    ivalue={dataDetailReview.TourGuide}
                    index={0}
                    property={"TourGuide"}
                    type={0}
                    edit={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-6 m-auto">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tư vấn viên</h3>
            </div>
            <div className="card-body">
              <div class="form-group m-0">
                <Select
                  className={`select-custom mb-3 select-custom-text-${dataDetailReview?.SalesReviewId.color}`}
                  value={dataDetailReview.SalesReviewId}
                  onChange={(e) =>
                    setdataDetailReview({
                      ...dataDetailReview,
                      SalesReviewId: e,
                    })
                  }
                  options={reviewList}
                />
                <div class="input-group">
                  <EditableCell
                    ivalue={dataDetailReview.Sales}
                    index={0}
                    property={"Sales"}
                    type={0}
                    edit={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [dataDetailReview]);

  const RenderNote = useMemo(() => {
    return groupFamilyList.length > 0 ? (
      groupFamilyList.map((item, index) => {
        return (
          <div class="col-sm-12 col-md-12 m-auto pb-3">
            <div class="form-group m-0">
              <span class="label">Ghi Chú khách hàng {item.CustomerName}</span>
              <div class="input-group">
                <EditableCell
                  ivalue={noteList[index]?.Notes}
                  index={index}
                  property={"Notes"}
                  type={1}
                  edit={true}
                />
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <div class="col-sm-12 col-md-12 m-auto">
        <div class="form-group m-0">
          <span class="label">Ghi Chú</span>
          <div class="input-group">
            <EditableCell
              ivalue={noteList[0]?.Notes}
              index={0}
              property={"Notes"}
              type={1}
              edit={true}
            />
          </div>
        </div>
      </div>
    );
  }, [groupFamilyList, noteList]);

  return (
    <>
      <div className="content-wrapper">
        <div class="card p-1 PrintInvoiceHide">
          <div class="card-header border-left-red">
            <div class="row">
              <div class="col-sm-12 col-md-4">
                <h3 class="card-title font-weight-bold">FEEDBACK KHÁCH HÀNG</h3>
              </div>
              <div class="col-sm-12 col-md-8 margin-top-5s">
                <button
                  onClick={() => {
                    Trl_spCustomer_Feedback_List();
                    setShowDetail(false);
                  }}
                  type="button"
                  class="btn btn-sm btn-danger pull-right margin-left-5"
                >
                  <i class="fa fa-search pr-2"></i>
                  Tìm kiếm
                </button>
                <button
                  onClick={() => setShowDetail(false)}
                  type="button"
                  class={
                    showDetail
                      ? "btn btn-sm btn-info pull-right margin-left-5"
                      : "d-none"
                  }
                >
                  <i class="fa fa-undo pr-2"></i>
                  Trở về danh sách tour
                </button>
              </div>
            </div>
          </div>
          <div className="card-body ">
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-4 m-auto">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">Tháng</span>
                  <div class="input-group">
                    <input
                      type="month"
                      class="form-control2"
                      value={timeSearch}
                      onChange={(e) => setTimeSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-4 m-auto">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    Thị Trường
                  </span>
                  <div class="input-group">
                    <SelectService
                      className={"w-100 select-custom"}
                      onSelected={(e) => {
                        setServiceId(e);
                      }}
                      items={ServiceId?.value || 0}
                      type={2}
                    />
                  </div>
                </div>
              </div>

              <div className="col-xs-12 col-sm-6 col-md-4 m-auto">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">Mã Tour</span>
                  <div class="input-group">
                    <SelectServiceSale
                      className={"w-100 select-custom"}
                      onSelected={(e) => {
                        setServiceSale(e);
                      }}
                      items={serviceSale?.value || 0}
                      ServiceId={ServiceId?.value || 0}
                      type={3}
                      fromDate={moment(timeSearch).format(
                        "MM/01/YYYY 00:00:00"
                      )}
                      toDate={moment(timeSearch)
                        .endOf("month")
                        .format("MM/DD/YYYY 23:59:59")}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                HiddenTable ? "card display-none" : "card display-block"
              }
            >
              <div class="row margin-top-20 margin-left-5">
                <div class="col-md-3 col-sm-6 col-12">
                  <div class="info-box">
                    <span class="info-box-icon bg-success">
                      <i class="fas fa-user-tie"></i>
                    </span>

                    <div class="info-box-content">
                      <span class="info-box-text">Tổng Đã ĐK</span>
                      <span class="info-box-number">{TotalCusY}</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6 col-12">
                  <div class="info-box">
                    <span class="info-box-icon bg-danger">
                      <i class="fas fa-eraser"></i>
                    </span>

                    <div class="info-box-content">
                      <span class="info-box-text">Tổng Hủy Tour</span>
                      <span class="info-box-number">{TotalCusN}</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6 col-12">
                  <div class="info-box">
                    <span class="info-box-icon bg-warning">
                      <i class="fas fa-passport"></i>
                    </span>

                    <div class="info-box-content">
                      <span class="info-box-text">Tổng Rớt VISA</span>
                      <span class="info-box-number">{TotalVisa}</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6 col-12">
                  <div class="info-box">
                    <span class="info-box-icon bg-info">
                      <i class="fas fa-user-alt"></i>
                    </span>

                    <div class="info-box-content">
                      <span class="info-box-text">Tổng Số Khác</span>
                      <span class="info-box-number">{Total}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div class="form-group">
                  <DataTable data={DataTableList} columns={columns} />
                </div>
              </div>
            </div>
            <div className={showDetail ? "d-none" : "card"}>
              <div className="card-header">
                <h3 className="card-title">DANH SÁCH TOUR</h3>
              </div>

              <div className="card-body p-0">
                <DataTable data={dataBooking} columns={columnsBooking} />
              </div>
            </div>
            <div className={!showDetail ? "d-none" : "card"}>
              <div className="card-header p-0 d-flex align-items-center px-2 w-100">
                <h3 className="card-title">
                  DANH SÁCH KHÁCH HÀNG TRONG TOUR <b>{bookingCode}</b>
                </h3>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive shadow-sm col-12 p-0">
                  {DataTableList.length > 0 && (
                    <DataTableBooking
                      columns={columns}
                      data={DataTableList}
                      updateMyData={() => {}}
                      skipPageReset={true}
                      size={DataTableList.length}
                      className="resize-table-custom"
                      info={new Date()}
                      isEdit={false}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={IsOpen}
        onHide={CloseModal}
        aria-labelledby="example-custom-modal-styling-title"
        className=" custom-modal-w-90"
      >
        <Modal.Header>
          <Modal.Title id="example-custom-modal-styling-title">
            <div class="">
              {"Thông Tin Khách Hàng " + CustomerView.CustomerName}
            </div>
          </Modal.Title>
          <button
            type="button"
            class="btn btn-xs btn-danger pull-right margin-left-5 close"
            aria-label="Close"
            onClick={CloseModal}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div class="card-body p-0">
            <div className="row">
              <div className="col-lg-4">
                <div className="card mb-4">
                  <div className="card-body text-center">
                    <img
                      src="/assets/img/avt.png"
                      alt="avatar"
                      className="rounded-circle img-fluid"
                      style={{ width: "150px" }}
                    />
                    <h5 className="my-3">{CustomerView.CustomerName}</h5>
                    <p className="text-muted mb-1">From: {CustomerView.From}</p>
                    <p className="text-muted mb-4">{bookingCode}</p>
                  </div>
                </div>
                <div className="card mb-4 mb-lg-0">
                  <div className="card-body p-0">
                    <ul className="list-group list-group-flush rounded-3">
                      <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <i className="fas fa-globe fa-lg text-warning" />
                        <p className="mb-0">https://mdbootstrap.com</p>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <i
                          className="fab fa-github fa-lg"
                          style={{ color: "#333333" }}
                        />
                        <p className="mb-0">mdbootstrap</p>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <i
                          className="fab fa-twitter fa-lg"
                          style={{ color: "#55acee" }}
                        />
                        <p className="mb-0">@mdbootstrap</p>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <i
                          className="fab fa-instagram fa-lg"
                          style={{ color: "#ac2bac" }}
                        />
                        <p className="mb-0">mdbootstrap</p>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <i
                          className="fab fa-facebook-f fa-lg"
                          style={{ color: "#3b5998" }}
                        />
                        <p className="mb-0">mdbootstrap</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Full Name</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">
                          {CustomerView.CustomerName}
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">DOB</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{CustomerView.DOB}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Phone</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{CustomerView.Phone}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Passport Code</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">
                          {CustomerView.PassportCode}
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">DOI</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{CustomerView.DOI}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">DOE</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{CustomerView.DOE}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card mb-4 mb-md-0">
                      <div className="card-body">
                        <p className="mb-4">
                          <span className="text-primary font-italic me-1">
                            assigment
                          </span>{" "}
                          Project Status
                        </p>
                        <p className="mb-1" style={{ fontSize: ".77rem" }}>
                          Web Design
                        </p>
                        <div
                          className="progress rounded"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "80%" }}
                            aria-valuenow={80}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                          Website Markup
                        </p>
                        <div
                          className="progress rounded"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "72%" }}
                            aria-valuenow={72}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                          One Page
                        </p>
                        <div
                          className="progress rounded"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "89%" }}
                            aria-valuenow={89}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                          Mobile Template
                        </p>
                        <div
                          className="progress rounded"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "55%" }}
                            aria-valuenow={55}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                          Backend API
                        </p>
                        <div
                          className="progress rounded mb-2"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "66%" }}
                            aria-valuenow={66}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card mb-4 mb-md-0">
                      <div className="card-body">
                        <p className="mb-4">
                          <span className="text-primary font-italic me-1">
                            assigment
                          </span>{" "}
                          Project Status
                        </p>
                        <p className="mb-1" style={{ fontSize: ".77rem" }}>
                          Web Design
                        </p>
                        <div
                          className="progress rounded"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "80%" }}
                            aria-valuenow={80}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                          Website Markup
                        </p>
                        <div
                          className="progress rounded"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "72%" }}
                            aria-valuenow={72}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                          One Page
                        </p>
                        <div
                          className="progress rounded"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "89%" }}
                            aria-valuenow={89}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                          Mobile Template
                        </p>
                        <div
                          className="progress rounded"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "55%" }}
                            aria-valuenow={55}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <p className="mt-4 mb-1" style={{ fontSize: ".77rem" }}>
                          Backend API
                        </p>
                        <div
                          className="progress rounded mb-2"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "66%" }}
                            aria-valuenow={66}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={IsOpenFeedBack}
        onHide={CloseModal}
        aria-labelledby="example-custom-modal-styling-title"
        className=" custom-modal-w-90"
      >
        <Modal.Header>
          <Modal.Title id="example-custom-modal-styling-title"></Modal.Title>
          <div>
            <button
              type="button"
              class="btn btn-xs btn-danger pull-right margin-left-5 close"
              aria-label="Close"
              onClick={CloseModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <button
              style={{ marginRight: "5px" }}
              type="button"
              class="btn btn-sm btn-success pull-right"
              onClick={() => {
                ConfirmAlert("Xác nhận", "Bạn có muốn lưu không?", () => {
                  Trl_spCustomer_Feedback_Save();
                });
              }}
            >
              <i class="fa fa-edit pr-2"></i>
              Lưu
            </button>
          </div>
        </Modal.Header>
        <Modal.Body class="p-2">
          <div class="card-body p-0">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body py-1 px-2 font-weight-bold">
                    {groupFamilyList.length > 0 && `Danh sách nhóm khách hàng:`}
                    {groupFamilyList.length > 0 &&
                      groupFamilyList.map((item, index) => {
                        return <div>{item.CustomerName}</div>;
                      })}
                    {groupFamilyList.length === 0 && `Khách hàng: `}
                    {
                      <span>
                        {groupFamilyList.length === 0 &&
                          noteList[0]?.CustomerName}
                      </span>
                    }
                  </div>
                </div>
              </div>
            </div>
            {RenderReview}
            {RenderNote}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

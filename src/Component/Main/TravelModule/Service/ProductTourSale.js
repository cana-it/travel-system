import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  FormatDateJson,
  FormatMoney,
  ConfirmAlert,
} from "../../../../Utils";
import {
  DataTable,
  SelectService,
  SelectServiceSaleStatus,
  SelectTypeSearch,
} from "../../../../Common";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DateTimePicker from "react-datetime-picker";
import DateRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { confirmAlert } from "react-confirm-alert";
import { Link } from "react-router-dom";
import Select from "react-select";
import moment from "moment";
import { useLocation } from "react-router-dom";
import {
  FNC_UPDATE_LIST_SERVICES,
  FNC_UPDATE_MONTH_FROM_SEARCH,
  FNC_UPDATE_MONTH_TO_SEARCH,
  FNC_UPDATE_MONTH_SEARCH,
  FNC_UPDATE_TYPE_SEARCH,
  FNC_UPDATE_IS_LOG,
  FNC_UPDATE_CALENDAR,
  FNC_UPDATE_DATA,
  FNC_UPDATE_CALENDAR_SERVICE,
} from "../../../../Redux/Actions/CustomAction";


export const ProductTourSale = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  let selector = useSelector((state) => state.CustomAction);

  //#region For search

  const CreateBy = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const PositionId = +localStorage.getItem("PositionId");
  const DepartmentId = +localStorage.getItem("DepartmentId");
  const [DpId, setDpId] = useState(0);
  const [_now, setNow] = useState(new Date());
  const _cYear = _now.getFullYear(),
    _cMonth = _now.getMonth();

  const [ParamsSearch, setParamsSearch] = useState({
    TypeSearch: selector.TypeSearch || 1,
    Status: selector.Status || 0,
    Service: selector.TypeSearch === 3 ? selector.Service || 0 : 0,
    Month: selector.Month || _cYear + "-" + (_cMonth + 1),
    MonthFrom: selector.MonthFrom || _cYear + "-" + (_cMonth + 1),
    MonthTo: selector.MonthTo || _cYear + "-" + (_cMonth + 1),
    FromDate:
      new Date(moment(new Date(selector.Month)).startOf("months")) ||
      FormatDateJson(new Date(moment(new Date(_now)).startOf("months"))),
    ToDate:
      new Date(moment(new Date(selector.Month)).endOf("months")) ||
      FormatDateJson(new Date(moment(new Date(_now)).startOf("months"))),
    FromDateService:
      new Date(moment(new Date(selector.MonthFrom)).startOf("months")) ||
      FormatDateJson(new Date(moment(new Date(_now)).startOf("months"))),
    ToDateService:
      new Date(moment(new Date(selector.MonthTo)).endOf("months")) ||
      FormatDateJson(new Date(moment(new Date(_now)).startOf("months"))),
    StrSearch: "",
    ShowCalendar: false,
  });

  const [SearchResult, setSearchResult] = useState({
    Calendars: selector.Calendars || [],
    CalendarService: selector.CalendarService || [],
    Data: selector.Data || [],
    ShowSummary: false,
    TimeActiveFrom: "",
    TimeActiveTo: "",
    ShowDetail: false,
  });

  const [dataStatus, setDataStatus] = useState([
    { value: 0, label: "Chọn trạng thái" },
    { value: 1, label: "Ngày dự kiến" },
    { value: 2, label: "Chưa confirm" },
    { value: 3, label: "Đã cọc booking" },
    { value: 4, label: "Ngày đã cancel" },
    { value: 5, label: "Đóng tour" },
  ]);

  useLayoutEffect(() => {
    Trl_spService_List();
  }, []);

  useEffect(() => {
    let pr = new URLSearchParams(location.search);
    setDpId(pr.get("dpid"));
  }, []);

  //#endregion

  //#region Permission

  const [permission, setPermission] = useState({ edit: false, add: false });

  const handlePermission = () => {
    if (
      (DepartmentId === 33 && +PositionId < 9) ||
      (DepartmentId === 29 && +PositionId < 9) ||
      DepartmentId === 36 ||
      DepartmentId === 34
    ) {
      setPermission({ add: true, edit: true });
    } else {
      if (+CreateBy === 1) setPermission({ add: true, edit: true });
      else setPermission({ add: false, edit: false });
    }
  };

  useEffect(() => {
    handlePermission();
  }, []);
  //#endregion

  //#region For form save

  const [_service2, setService2] = useState(0);
  const [_serviceSaleId, setServiceSaleId] = useState(0);
  const [_dateSale, setDateSale] = useState([]);
  const [_numberofseats, setNumberofseats] = useState(0);
  const [_serviceSaleCode, setServiceSaleCode] = useState("");
  const [_serviceSaleName, setServiceSaleName] = useState("");

  const ServiceSaleCodeRef = useRef();
  const ServiceSaleNameRef = useRef();
  const NumberofseatsRef = useRef();

  const Price1Ref = useRef();
  const Price2Ref = useRef();
  const Price3Ref = useRef();

  const [BookingInfo, setBookingInfo] = useState({
    Deadline1: [null, null],
    Deadline2: [null, null],
    Deadline3: [null, null],
    DeadlineFinish: null,
    DeadlineVisa: null,
    Price1: 0,
    Price2: 0,
    Price3: 0,
    BookingId: 0,
  });

  const [_statusUpdate, setStatusUpdate] = useState({
    value: 1,
    label: "Ngày dự kiến",
  });

  //#endregion

  //#region Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [_titleModalList, setTitleModalList] = useState(
    "Danh sách mở bán ngày "
  );

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const [show2, setShow2] = useState(false);
  const handleClose2 = (props) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return <ConfirmAlertUi2 onClose={onClose} />;
      },
    });
  };

  const ConfirmAlertUi2 = (props) => {
    return (
      <div className="card-body border-left-red">
        <h3>Xác nhận đóng </h3>
        <button className="btn btn-small btn-warning" onClick={props.onClose}>
          {" "}
          Hủy
        </button>
        <button
          className="btn btn-small btn-success margin-left-5"
          onClick={() => {
            props.onClose();
            setShow2(false);
          }}
        >
          Xác nhận
        </button>
      </div>
    );
  };

  const handleShow2 = () => setShow2(true);

  const [_sizeModal, setSizeModal] = useState("md");
  const [_titleModal, setTitleModal] = useState("");
  const [showList, setShowList] = useState(false);

  const [TimeActiveFrom, setTimeActiveFrom] = useState("");
  const [TimeActiveTo, setTimeActiveTo] = useState("");

  //#endregion

  //#region Load Calendar

  useEffect(() => {
    dispatch(
      FNC_UPDATE_MONTH_SEARCH(FormatDateJson(new Date(ParamsSearch.Month), 9))
    );
    dispatch(
      FNC_UPDATE_MONTH_FROM_SEARCH(
        FormatDateJson(new Date(ParamsSearch.MonthFrom), 9)
      )
    );
    dispatch(
      FNC_UPDATE_MONTH_TO_SEARCH(
        FormatDateJson(new Date(ParamsSearch.MonthTo), 9)
      )
    );
    onGetCalendar();
  }, [ParamsSearch.Month, ParamsSearch.MonthFrom, ParamsSearch.MonthTo]);

  useEffect(() => {
    if (selector.IsLog) {
      Trl_spServiceSale_List();
      dispatch(FNC_UPDATE_IS_LOG(false));
    }
  }, [SearchResult.Calendars, ParamsSearch.CalendarService]);

  const ChangeMonth = (key) => {
    ;
    let date = new Date(ParamsSearch.Month);
    let month = new Date(ParamsSearch.Month).getMonth();
    if (key === 1) {
      //xem tháng trước
      let prevMonth = FormatDateJson(date.setMonth(month - 1), 9);
      //let formatPrevMonth = new Date(date.setMonth(month - 1));
      setParamsSearch({ ...ParamsSearch, Month: prevMonth });
    } else {
      let nextMonth = FormatDateJson(date.setMonth(month + 1), 9);
      //let formatPrevMonth = new Date(date.setMonth(month + 1));
      setParamsSearch({ ...ParamsSearch, Month: nextMonth });
    }
  };

  const Trl_spService_List = async () => {
    try {
      const params = {
        Json: JSON.stringify({
          TextSearch: "",
          UserId: +CreateBy,
          Type: 0,
        }),
        func: "Trl_spService_List",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      dispatch(FNC_UPDATE_LIST_SERVICES(list));
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };

  const onGetCalendar = () => {
    let selectmonth = new Date(moment(ParamsSearch.Month).startOf("months")),
      frommonth = new Date(moment(ParamsSearch.MonthFrom).startOf("months")),
      tomonth = new Date(moment(ParamsSearch.MonthTo).endOf("months"));

    setParamsSearch({
      ...ParamsSearch,
      FromDate: FormatDateJson(
        new Date(moment(ParamsSearch.Month).startOf("months"))
      ),
      ToDate: FormatDateJson(
        new Date(moment(ParamsSearch.Month).endOf("months"))
      ),
      FromDateService: FormatDateJson(
        new Date(moment(ParamsSearch.MonthFrom).startOf("months"))
      ),
      ToDateService: FormatDateJson(
        new Date(moment(ParamsSearch.MonthTo).endOf("months"))
      ),
    });

    //#region Load calendar tháng

    let arr = [];
    let monthItem = FormatDateJson(selectmonth, 6);
    let _totalDateOfMonth = new Date(
      monthItem.year,
      +monthItem.month,
      0
    ).getDate();
    let _col = 1;
    let arrTr = [];
    let arrTd = [];
    for (let i = 1; i <= _totalDateOfMonth; i++) {
      if (_col === 1) arrTd = [];
      let tmpDate = new Date(monthItem.year, monthItem.month - 1, i);
      let _indexDate = tmpDate.getDay();
      if (_indexDate === 0) _indexDate = 7;
      let isAdd = tmpDate > _now;
      if (i === 1) {
        for (let j = 1; j < _indexDate; j++) {
          arrTd.push({
            Day: "",
          });
          _col = j + 1;
        }
        arrTd.push({
          Day: i,
          DayFull: FormatDateJson(tmpDate, 4),
          IsAdd: isAdd,
        });
      } else {
        arrTd.push({
          Day: i,
          DayFull: FormatDateJson(tmpDate, 4),
          IsAdd: isAdd,
        });
      }
      if (_col === 7 || i === _totalDateOfMonth) {
        arrTr.push(arrTd);
        if (i === _totalDateOfMonth && _col < 8) {
          for (let h = _col; h < 7; h++) {
            arrTd.push({
              Day: "",
            });
            _col++;
          }
        }
        _col = 0;
      }
      _col++;
    }

    arr.push({
      month: monthItem.month + "-" + monthItem.year,
      monthAdd: monthItem.year + "-" + monthItem.month,
      DataTr: arrTr,
    });

    //#endregion

    //#region Load calendar service

    const startDate = moment(frommonth);
    const timeEnd = moment(tomonth);
    const diff = timeEnd.diff(startDate);
    const diffDuration = moment.duration(diff);
    let totalMonth = diffDuration.months() + 1;

    let arrListMonth = [];
    for (let i = 1; i <= totalMonth; i++) {
      arrListMonth.push(FormatDateJson(frommonth, 6));
      frommonth = new Date(frommonth.setMonth(frommonth.getMonth() + 1));
    }

    //#endregion

    dispatch(FNC_UPDATE_CALENDAR(arr));
    dispatch(FNC_UPDATE_CALENDAR_SERVICE(arrListMonth));
    setSearchResult({
      ...SearchResult,
      Calendars: arr,
      CalendarService: arrListMonth,
    });
  };

  const onTimeActive = (timeFrom, timeTo) => {
    if (
      TimeActiveFrom !== timeFrom &&
      timeFrom !== undefined &&
      timeTo !== undefined
    ) {
      setTimeActiveFrom(timeFrom);
      setTimeActiveTo(timeTo);
    } else {
      setTimeActiveFrom("");
      setTimeActiveTo("");
    }
  };

  //#endregion

  //#region Show Form Modal

  const ShowFormAdd = (month, e) => {
    handleShow2();
    setDateSale([new Date(month + "-" + e.Day), new Date(month + "-" + e.Day)]);
    setNumberofseats(0);
    setServiceSaleId(0);
    setService2(0);
    setServiceSaleCode("");
    setServiceSaleName("");
    setBookingInfo({
      Deadline1: [null, null],
      Deadline2: [null, null],
      Deadline3: [null, null],
      DeadlineFinish: null,
      DeadlineVisa: null,
      Price1: 0,
      Price2: 0,
      Price3: 0,
      BookingId: 0,
    });
    setSizeModal("md");
    setTitleModal("Mở bán tour");
    setIsBooking(false);
    setShowList(false);
  };

  const ShowFormEdit = async (row) => {
    await setService2(row._original.ServiceId);
    await handleShow2();
    setDateSale([
      new Date(row._original.DateSaleFrom),
      new Date(row._original.DateSaleTo),
    ]);
    setNumberofseats(row._original.Numberofseats);
    setServiceSaleCode(row._original.ServiceSaleCode);
    setServiceSaleName(row._original.ServiceSaleName);
    setServiceSaleId(row._original.ServiceSaleId);
    setBookingInfo({
      Deadline1: [
        new Date(row._original.Deadline1From),
        new Date(row._original.Deadline1To),
      ],
      Deadline2: [
        new Date(row._original.Deadline2From),
        new Date(row._original.Deadline2To),
      ],
      Deadline3: [
        new Date(row._original.Deadline3From),
        new Date(row._original.Deadline3To),
      ],
      DeadlineFinish: new Date(row._original.DeadlineFinish),
      DeadlineVisa: new Date(row._original.DeadlineVisa),
      Price1: row._original.Price1,
      Price2: row._original.Price2,
      Price3: row._original.Price3,
      BookingId: row._original.BookingIdm,
    });
    setSizeModal("md");
    setTitleModal("Cập nhật mở bán");
    setIsBooking(false);
    setShowList(false);
  };

  const UpdateStatus = (row) => {
    handleShow1();
    setServiceSaleId(row._original.ServiceSaleId);
    setStatusUpdate(dataStatus.find((p) => p.value === row._original.StatusId));
  };

  useEffect(() => {
    //PTSY11N-24122022-QR1955
    let strCode = "",
      strName = "",
      totalDate = "",
      strDateFrom = "",
      strDateTo = "";
    if (_dateSale.length > 0) {
      //tính tổng số ngày
      const startDate = moment(_dateSale[0]);
      const timeEnd = moment(_dateSale[1]);
      const diff = timeEnd.diff(startDate);
      const diffDuration = moment.duration(diff);
      totalDate = diffDuration.days() + 1;

      //format date
      strDateFrom = FormatDateJson(_dateSale[0], 7);
      strDateTo = FormatDateJson(_dateSale[1], 7);

      //gán dữ liệu cho servicesalecode
      strCode += totalDate + "N-" + strDateFrom.replaceAll("/", "");
    }
    if (_service2 !== 0) {
      let serviceInfo = selector.ListServices.find(
        (p) => p.ServiceId === _service2
      );
      strCode += "-" + serviceInfo?.ServiceCode;
      strName =
        serviceInfo?.ServiceName +
        " (" +
        totalDate +
        " ngày) từ " +
        strDateFrom +
        " đến " +
        strDateTo;
    }
    if (strCode !== "") {
      setTimeActiveFrom("");
      setTimeActiveTo("");
      // setServiceSaleCode(strCode);
      setServiceSaleName(strName);
    }
  }, [_service2, _numberofseats, _dateSale]);

  //#endregion

  //#region Load data

  const [data, setData] = useState([]);
  const [_isBooking, setIsBooking] = useState(false);

  const Trl_spServiceSale_List = async () => {
    if (ParamsSearch.TypeSearch === 0) {
      Alerterror("Vui lòng chọn xem theo thời gian hoặc thị trường!");
      return;
    }
    if (ParamsSearch.TypeSearch === 1 && ParamsSearch.Month === "") {
      Alerterror("Vui lòng chọn tháng!");
      return;
    }
    if (
      ParamsSearch.TypeSearch === 3 &&
      (ParamsSearch.MonthFrom === "" || ParamsSearch.MonthTo == "")
    ) {
      Alerterror("Vui lòng chọn tháng!");
      return;
    }
    try {
      const params = {
        Json: JSON.stringify({
          DpId: DpId,
          ServiceId: ParamsSearch.TypeSearch === 1 ? 0 : ParamsSearch.Service,
          FromDate:
            ParamsSearch.TypeSearch === 1
              ? ParamsSearch.FromDate
              : ParamsSearch.FromDateService,
          Todate:
            ParamsSearch.TypeSearch === 1
              ? ParamsSearch.ToDate
              : ParamsSearch.ToDateService,
          TextSearch: ParamsSearch.TextSearch,
          TypeReport: ParamsSearch.TypeSearch,
        }),
        func: "Trl_spServiceSale_List",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      setSearchResult({ ...SearchResult, Data: list, ShowSummary: true });
      setTimeActiveFrom("");
      setTimeActiveTo("");
      dispatch(FNC_UPDATE_DATA(list));
      dispatch(FNC_UPDATE_IS_LOG(true));
    } catch (ex) {
      setSearchResult({ ...SearchResult, Data: [], ShowSummary: false });
      setTimeActiveFrom("");
      setTimeActiveTo("");
    }
  };

  //#endregion

  //#region Table

  const columns = [
    {
      Header: "Lựa chọn",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div>
          {(row._original.Creater === +CreateBy || permission.edit) && (
            <>
              <button
                type="button"
                title="Cập nhật thông tin mở bán"
                className="btn btn-warning btn-sm m-1 btn-add"
                onClick={(e) => {
                  ShowFormEdit(row);
                }}
              >
                <i className="fa fa-cog"></i>
              </button>
              <button
                type="button"
                title="Cập nhật trạng thái mở bán"
                className="btn btn-success btn-sm m-1 btn-add"
                onClick={(x) => {
                  UpdateStatus(row);
                }}
              >
                <i className="fa fa-flag"></i>
              </button>
            </>
          )}
          {row._original.BookingId !== undefined && (
            <Link
              to={
                row._original.ServiceId === 60
                  ? "/booking/service-other?bookingId=" +
                    row._original.BookingId +
                    "&id=18"
                  : "/booking/tour-booking?bookingId=" +
                    row._original.BookingId +
                    "&id=18"
              }
              className="btn btn-info btn-sm m-1 btn-add"
              onClick={(eventClick) => dispatch(FNC_UPDATE_IS_LOG(true))}
              title="Chi tiết booking"
            >
              <i className="fa fa-edit"></i>
            </Link>
          )}
          {(row._original.Creater === +CreateBy || permission.edit) && (
            <>
              <button
                type="button"
                title="Xóa mở bán"
                className="btn btn-danger btn-sm m-1 btn-add"
                onClick={(x) => {
                  Trl_spServiceSale_Delete_Action(row);
                }}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          )}
        </div>
      ),
      width: 170,
      style: { textAlign: "center" },
    },
    {
      Header: "Trạng thái tour",
      width: 140,
      style: { textAlign: "center" },
      Cell: ({ row }) => {
        let stt = dataStatus.find((p) => p.value === row._original.StatusId);

        return (
          <span
            className={
              row._original.StatusId === 5 ? "badge bg-danger fs-18" : ""
            }
          >
            {stt?.label || ""}
          </span>
        );
      },
    },
    {
      Header: "Mã tuyến điểm",
      accessor: "ServiceCode",
      width: 140,
      style: { textAlign: "center" },
    },
    {
      Header: "Mã tour",
      accessor: "ServiceSaleCode",
      width: 240,
      style: { textAlign: "center" },
    },
    {
      Header: "Ngày KH",
      accessor: "DateSaleFrom",
      Cell: ({ row }) => (
        <span>{FormatDateJson(new Date(row._original.DateSaleFrom), 7)}</span>
      ),
      style: { textAlign: "center" },
    },
    {
      Header: "Ngày KT",
      accessor: "DateSaleTo",
      Cell: ({ row }) => (
        <span>{FormatDateJson(new Date(row._original.DateSaleTo), 7)}</span>
      ),
      style: { textAlign: "center" },
    },
    {
      Header: "Tổng chỗ",
      accessor: "Numberofseats",
      //Cell: (row) => (<span className={row._original.TotalSlot === 0 ? "text-red" : ""}>{row._original.Numberofseats - row._original.TotalSlot}</span>)
      style: { textAlign: "center" },
      width: 90,
    },
    {
      Header: "Giữ chỗ",
      accessor: "TotalSold",
      Cell: ({ row }) => (
        <span className={row._original.TotalSlot === 0 ? "text-red" : ""}>
          {row._original.TotalSold}
        </span>
      ),
      style: { textAlign: "center" },
      width: 80,
    },
    {
      Header: "Đã bán",
      accessor: "TotalSlot",
      Cell: ({ row }) => (
        <span className={row._original.TotalSlot === 0 ? "text-red" : ""}>
          {row._original.TotalSlot}
        </span>
      ),
      style: { textAlign: "center" },
      width: 80,
    },
    {
      Header: "Còn lại",
      accessor: "TotalPending",
      style: { textAlign: "center" },
      width: 80,
      //Cell: ({row}) => (<span className={(row._original.Numberofseats - row._original.TotalSlot) === 0 ? "text-red" : ""}>{row._original.Numberofseats - row._original.TotalSlot}</span>)
    },
    {
      Header: "Người tạo",
      accessor: "StaffName",
      width: 200,
      style: { textAlign: "center" },
    },
    {
      Header: "Ngày tạo",
      accessor: "CreateTime",
      Cell: ({ row }) => (
        <span>{FormatDateJson(new Date(row._original.CreateTime), 7)}</span>
      ),
      style: { textAlign: "center" },
    },
  ];
  //#endregion

  //#region  Data tuyến điểm theo thị trường
  const [ActiveService, setActiveService] = useState({});

  //#endregion

  //#region Save data
  const [disable, setdisable] = useState(true);
  const Trl_spServiceSale_Save = async () => {
    try {
      if (_numberofseats === "" || _numberofseats === 0) {
        Alertwarning("Nhập số chổ mở bán");
        return;
      }
      if (_dateSale === undefined) {
        Alertwarning("Chọn ngày khởi hành");
        return;
      }
      if (_service2 === 0) {
        Alertwarning("Chọn tuyến dịch vụ mở bán");
        return;
      }
      if (+_service2 !== 60) {
        if (
          BookingInfo?.Deadline1[0] === null ||
          BookingInfo?.Deadline1[1] === null
        ) {
          Alertwarning("Chọn ngày deadline 1");
          return;
        }
        if (
          BookingInfo?.Deadline2[0] === null ||
          BookingInfo?.Deadline2[1] === null
        ) {
          Alertwarning("Chọn ngày deadline 2");
          return;
        }
        if (
          BookingInfo?.Deadline3[0] === null ||
          BookingInfo?.Deadline3[1] === null
        ) {
          Alertwarning("Chọn ngày deadline 3");
          return;
        }
        if (
          BookingInfo?.DeadlineFinish === undefined ||
          BookingInfo?.DeadlineFinish === null
        ) {
          Alertwarning("Chọn ngày hoàn tất hồ sơ");
          return;
        }
        if (
          BookingInfo?.DeadlineVisa === undefined ||
          BookingInfo?.DeadlineVisa === null
        ) {
          Alertwarning("Chọn ngày hoàn tất visa");
          return;
        }
        if (BookingInfo.Price1 === 0) {
          Alertwarning("Chưa nhập giá người lớn");
          return;
        }
        if (BookingInfo.Price2 === 0) {
          Alertwarning("Chưa nhập giá trẻ em");
          return;
        }
        if (BookingInfo.Price3 === 0) {
          Alertwarning("Chưa nhập giá Infant");
          return;
        }
      }
      const params = {
        Json: JSON.stringify({
          ServiceSaleId: _serviceSaleId,
          ServiceSaleCode: _serviceSaleCode,
          ServiceSaleName: _serviceSaleName,
          ServiceId: _service2,
          Creater: CreateBy,
          DateSaleFrom: FormatDateJson(_dateSale[0], 4),
          DateSaleTo: FormatDateJson(_dateSale[1], 4),
          Numberofseats: _numberofseats,
          IsAddBooking: 1, //Luôn luôn tạo booking
          DpId: DpId,
          //Thêm các thông tin riêng của bảng booking
          BookingId: BookingInfo.BookingId,
          Deadline1From: BookingInfo?.Deadline1[0]
            ? FormatDateJson(BookingInfo.Deadline1[0], 4)
            : FormatDateJson(new Date(), 4),
          Deadline1To: BookingInfo?.Deadline1[1]
            ? FormatDateJson(BookingInfo.Deadline1[1], 4)
            : FormatDateJson(new Date(), 4),
          Deadline2From: BookingInfo?.Deadline2[0]
            ? FormatDateJson(BookingInfo.Deadline2[0], 4)
            : FormatDateJson(new Date(), 4),
          Deadline2To: BookingInfo?.Deadline2[1]
            ? FormatDateJson(BookingInfo.Deadline2[1], 4)
            : FormatDateJson(new Date(), 4),
          Deadline3From: BookingInfo?.Deadline3[0]
            ? FormatDateJson(BookingInfo.Deadline3[0], 4)
            : FormatDateJson(new Date(), 4),
          Deadline3To: BookingInfo?.Deadline3[1]
            ? FormatDateJson(BookingInfo.Deadline3[1], 4)
            : FormatDateJson(new Date(), 4),
          DeadlineFinish: BookingInfo?.DeadlineFinish
            ? FormatDateJson(BookingInfo.DeadlineFinish, 4)
            : FormatDateJson(new Date(), 4),
          DeadlineVisa: BookingInfo?.DeadlineVisa
            ? FormatDateJson(BookingInfo.DeadlineVisa, 4)
            : FormatDateJson(new Date(), 4),
          Price1: BookingInfo?.Price1 || 0,
          Price2: BookingInfo.Price2 || 0,
          Price3: BookingInfo.Price3 || 0,
        }),
        func: "Trl_spServiceSale_Save",
      };
      setdisable(false); //block action
      const result = await mainAction.API_spCallServer(params, dispatch);
      setdisable(true); //block action
      if (result.Status === "OK") {
        Alertsuccess(result.Result);
        Trl_spServiceSale_List();
        handleClose2();
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.Result);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      setdisable(true); //block action
      
    }
  };

  const Trl_spServiceSaleStatus_Update = async () => {
    try {
      if (_statusUpdate.value === 0) {
        Alertwarning("Chọn status để update !");
        return;
      }
      const params = {
        Json: JSON.stringify({
          ServiceSaleId: _serviceSaleId,
          StatusId: _statusUpdate.value,
          StatusName: _statusUpdate.label,
          DpId: DpId,
        }),
        func: "Trl_spServiceSaleStatus_Update",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.Result);
        Trl_spServiceSale_List();
        let c = [...data];
        let d = c.map((item, index) => {
          if (item.ServiceSaleId === _serviceSaleId) {
            item.StatusId = _statusUpdate.value;
            item.StatusName = _statusUpdate.label;
          }
          return item;
        });
        setData(d);
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.Result);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      
    }
  };

  //#endregion

  //#region  Xóa
  const Trl_spServiceSale_Delete_Action = (item) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return <ConfirmAlertUi onClose={onClose} item={item} />;
      },
    });
  };

  const Trl_spServiceSale_Delete = async (Id) => {
    try {
      const params = {
        Json: JSON.stringify({
          ServiceSaleId: Id,
          UserId: CreateBy,
          DpId: DpId,
        }),
        func: "Trl_spServiceSale_Delete",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.Result);
        let newList = [...SearchResult.Data];
        setSearchResult({
          ...SearchResult,
          Data: newList.filter((p) => p.ServiceSaleId !== Id),
        });
        setData(data.filter((p) => p.ServiceSaleId !== Id));
        return;
      } else if (result.Status === "NOTOK") {
        Alerterror(result.Result);
        return;
      }
    } catch (ex) {
      Alerterror("Lỗi! Liên hệ IT");
    }
  };

  const ConfirmAlertUi = (props) => {
    return (
      <div className="card-body border-left-red">
        <h3>Xác nhận xóa dữ liệu!</h3>
        <p>
          Bạn có chắc chắn muốn xóa{" "}
          <strong>
            {props.item._original.ServiceName} mở bán từ ngày{" "}
            {props.item._original.DateSaleFrom} đến ngày{" "}
            {props.item._original.DateSaleTo}
          </strong>{" "}
        </p>
        <button className="btn btn-small btn-warning" onClick={props.onClose}>
          {" "}
          <i className="fa fa-undo"> </i> Hủy
        </button>
        <button
          className="btn btn-small btn-danger margin-left-5"
          onClick={() => {
            props.onClose();
            Trl_spServiceSale_Delete(props.item._original.ServiceSaleId);
          }}
        >
          <i className="fa fa-trash"> </i> Xóa
        </button>
      </div>
    );
  };
  //#endregion

  return (
    <>
      <div className="content-wrapper">
        <div className="card-header border-left-red card-header2">
          <div className="row">
            <div className="col-sm-12 col-md-2">
              <h3 className="card-title font-weight-bold">Tour mở bán</h3>
            </div>
            <div className="col-sm-12 col-md-10 margin-top-5s">
              <button
                type="button"
                className="btn btn-sm btn-danger pull-right margin-left-5 mt-1"
                onClick={(e) => Trl_spServiceSale_List()}
              >
                <i className="fa fa-search pr-2"></i>
                Tìm kiếm
              </button>
              {ParamsSearch.TypeSearch === 3 &&
                SearchResult.ShowSummary &&
                SearchResult.Data.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) =>
                      setSearchResult({ ...SearchResult, ShowSummary: false })
                    }
                    class="btn btn-info pull-right btn-sm margin-left-5 mt-1"
                    data-toggle="collapse"
                    href="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                  >
                    <i class="fas fa-angle-up"></i> Ẩn thống kê
                  </button>
                )}
              {ParamsSearch.TypeSearch === 3 &&
                !SearchResult.ShowSummary &&
                SearchResult.Data.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) =>
                      setSearchResult({ ...SearchResult, ShowSummary: true })
                    }
                    class="btn btn-info pull-right btn-sm margin-left-5 mt-1"
                    data-toggle="collapse"
                    href="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                  >
                    <i class="fas fa-angle-down"></i> Hiện thống kê
                  </button>
                )}

              <div
                title="Chọn tháng"
                className={
                  "form-group pull-right ml-1 mt-0 " +
                  (ParamsSearch.TypeSearch === 1 ||
                  ParamsSearch.TypeSearch === 0
                    ? ""
                    : "display-none")
                }
              >
                <input
                  type="month"
                  className="form-control"
                  id="start"
                  name="start"
                  value={ParamsSearch.Month}
                  onChange={(month) => {
                    setParamsSearch({
                      ...ParamsSearch,
                      Month: month.target.value,
                    });
                  }}
                />
              </div>

              <div
                title="Đến tháng"
                className={
                  "form-group pull-right ml-1 " +
                  (ParamsSearch.TypeSearch === 3 ? "" : "display-none")
                }
              >
                <input
                  type="month"
                  className="form-control"
                  id="start"
                  name="start"
                  value={ParamsSearch.MonthTo}
                  onChange={(month) => {
                    setParamsSearch({
                      ...ParamsSearch,
                      MonthTo: month.target.value,
                    });
                  }}
                />
              </div>
              <div
                title="Từ tháng"
                className={
                  "form-group pull-right ml-1 " +
                  (ParamsSearch.TypeSearch === 3 ? "" : "display-none")
                }
              >
                <input
                  type="month"
                  className="form-control"
                  id="start"
                  name="start"
                  value={ParamsSearch.MonthFrom}
                  onChange={(month) => {
                    setParamsSearch({
                      ...ParamsSearch,
                      MonthFrom: month.target.value,
                    });
                  }}
                />
              </div>

              {/* <div title='Tuyến điểm' className={"form-group pull-right " + (ParamsSearch.TypeSearch === 3 ? "" : "display-none")}>
                                <SelectService key={"s1"}
                                    items={ParamsSearch.Service}
                                    onSelected={(item) => {
                                        setParamsSearch({ ...ParamsSearch, Service: item.value });
                                        dispatch(FNC_UPDATE_SERVICE_SEARCH(item.value));
                                    }}
                                    className="w-200px"
                                />
                            </div> */}
              <div className="form-group pull-right mr-1" title="Xem theo">
                <SelectTypeSearch
                  items={ParamsSearch.TypeSearch}
                  onSelected={(item) => {
                    setParamsSearch({
                      ...ParamsSearch,
                      TypeSearch: item.value,
                      ShowSummary: false,
                    });
                    dispatch(FNC_UPDATE_TYPE_SEARCH(item.value));
                  }}
                  className="w-200px"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card-body border-left-red">
          {ParamsSearch.TypeSearch === 1 && (
            <div className="row">
              <div className="col-md-12">
                {SearchResult.Calendars.length > 0 &&
                  SearchResult.Calendars.map((monthItem, indexMonth) => {
                    return (
                      <table
                        key={"monthtable" + indexMonth}
                        width="100%"
                        className="table table-bordered table-hover text-sm text-gray-700 calendar-table"
                      >
                        <thead>
                          <tr>
                            <td
                              className="text-center font-weight-bold calendar-month-name"
                              colSpan={7}
                            >
                              Tháng: {monthItem.month}
                              <span
                                onClick={(e) => ChangeMonth(0)}
                                className="pull-right calendar-button"
                              >
                                <i className="fas fa-angle-right"></i>
                              </span>
                              <span
                                onClick={(e) => ChangeMonth(1)}
                                className="pull-right calendar-button"
                              >
                                <i className="left fas fa-angle-left"></i>
                              </span>
                            </td>
                          </tr>
                          <tr className="text-center font-weight-bold">
                            <td>T2</td>
                            <td>T3</td>
                            <td>T4</td>
                            <td>T5</td>
                            <td>T6</td>
                            <td>T7</td>
                            <td>CN</td>
                          </tr>
                        </thead>
                        <tbody>
                          {monthItem.DataTr.map((rows, index) => {
                            return (
                              <tr key={"rows" + index}>
                                {rows.map((e, k) => {
                                  let dataOfDate = SearchResult.Data.filter(
                                    (p) => p.DateSaleFrom === e.DayFull
                                  );
                                  let fillColor = "",
                                    totalSlot = dataOfDate.reduce(
                                      (a, v) => (a = a + (v.TotalSlot ?? 0)),
                                      0
                                    );
                                  if (
                                    dataOfDate.length > 0 &&
                                    dataOfDate[0].StatusId === 1
                                  )
                                    fillColor = "bg-primary";
                                  if (
                                    dataOfDate.length > 0 &&
                                    dataOfDate[0].StatusId === 2
                                  )
                                    fillColor = "bg-yellow";
                                  if (
                                    dataOfDate.length > 0 &&
                                    dataOfDate[0].StatusId === 3
                                  )
                                    fillColor = "bg-green";
                                  if (
                                    dataOfDate.length > 0 &&
                                    dataOfDate[0].StatusId === 4
                                  )
                                    fillColor = "bg-red";
                                  if (
                                    dataOfDate.length > 0 &&
                                    dataOfDate[0].StatusId === 5
                                  )
                                    fillColor = "bg-pink";
                                  if (
                                    TimeActiveFrom !== "" &&
                                    TimeActiveFrom <= e.DayFull &&
                                    TimeActiveTo >= e.DayFull
                                  )
                                    fillColor = fillColor + " bg-light-blue";
                                  if (dataOfDate[0]?.ServiceId === 60) {
                                    fillColor = "bg-service";
                                  }
                                  return (
                                    <td
                                      key={"column" + k}
                                      style={{ backgroundColor: "#fff" }}
                                      className="date-hover date-fixed-col"
                                    >
                                      <div
                                        className={"card mb-0 " + fillColor}
                                        title={dataOfDate.reduce(
                                          (a, v) =>
                                            (a = v.ServiceSaleName + ", " + a),
                                          ""
                                        )}
                                      >
                                        <div className="card-body p-0 text-left">
                                          <div className="text-right card-head">
                                            {e.Day}
                                          </div>
                                          {(TimeActiveFrom === "" ||
                                            TimeActiveFrom === e.DayFull) &&
                                            dataOfDate.length > 0 &&
                                            dataOfDate[0].BookingId !==
                                              undefined && (
                                              <>
                                                {(TimeActiveFrom === "" ||
                                                  TimeActiveFrom ===
                                                    e.DayFull) &&
                                                  dataOfDate.length > 0 &&
                                                  dataOfDate.length < 2 &&
                                                  dataOfDate[0].BookingId !==
                                                    undefined && (
                                                    <div className=" pb-2 fs-11 center-item font-weight-bold">
                                                      {
                                                        dataOfDate[0]
                                                          ?.ServiceSaleCode
                                                      }
                                                    </div>
                                                  )}
                                                {dataOfDate.length > 1 && (
                                                  <div className="card-row bg-purple">
                                                    Tổng tour
                                                    <div className="pull-right">
                                                      {dataOfDate.length}
                                                    </div>
                                                  </div>
                                                )}
                                                <div className="card-row text-primary">
                                                  <span className=""></span>
                                                  Tổng số chỗ
                                                  <div className="pull-right">
                                                    {dataOfDate.reduce(
                                                      (a, v) =>
                                                        (a =
                                                          a + v.Numberofseats),
                                                      0
                                                    )}
                                                  </div>
                                                </div>
                                                <div className="card-row text-green Thị trường Mỹ">
                                                  Đã bán
                                                  <div className="pull-right">
                                                    {dataOfDate.reduce(
                                                      (a, v) =>
                                                        (a = a + v.TotalSlot),
                                                      0
                                                    )}
                                                  </div>
                                                </div>
                                                <div className="card-row text-orange">
                                                  Giữ chỗ
                                                  <div className="pull-right">
                                                    {dataOfDate.reduce(
                                                      (a, v) =>
                                                        (a = a + v.TotalSold),
                                                      0
                                                    )}
                                                  </div>
                                                </div>
                                                <div className="card-row text-red">
                                                  Còn lại
                                                  <div className="pull-right">
                                                    {dataOfDate.reduce(
                                                      (a, v) =>
                                                        (a =
                                                          a + v.TotalPending),
                                                      0
                                                    )}
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                        </div>
                                        <div
                                          className="card-hover p-0"
                                          onClick={(t) =>
                                            onTimeActive(
                                              dataOfDate[0]?.DateSaleFrom,
                                              dataOfDate[0]?.DateSaleTo
                                            )
                                          }
                                        >
                                          <div style={{ marginTop: "30px" }}>
                                            {e.Day !== "" &&
                                              e.IsAdd &&
                                              permission.add && (
                                                <>
                                                  <button
                                                    type="button"
                                                    title="Thêm mở bán"
                                                    className="btn btn-success btn-sm m-1"
                                                    onClick={(z) => {
                                                      ShowFormAdd(
                                                        monthItem.monthAdd,
                                                        e
                                                      );
                                                    }}
                                                  >
                                                    <i className="fa fa-plus"></i>
                                                  </button>
                                                </>
                                              )}{" "}
                                            <br />
                                            {dataOfDate.length > 0 && (
                                              <>
                                                {/* <button type='button' title='Lịch trình tour' onClick={(t) => onTimeActive(dataOfDate[0].DateSaleFrom, dataOfDate[0].DateSaleTo)}
                                                                                                    className='btn btn-success btn-sm m-1'><i class="fas fa-expand-arrows-alt"></i>
                                                                                                </button> */}
                                                <button
                                                  type="button"
                                                  title="Danh sách mở bán"
                                                  onClick={(z) => {
                                                    setData(dataOfDate);
                                                    handleShow();
                                                    setShowList(true);
                                                    setTitleModalList(
                                                      "Danh sách mở bán " +
                                                        FormatDateJson(
                                                          dataOfDate[0]
                                                            ?.DateSaleFrom,
                                                          12
                                                        )
                                                    );
                                                  }}
                                                  className="btn btn-success btn-sm m-1"
                                                >
                                                  <i className="fa fa-eye"></i>
                                                </button>
                                              </>
                                            )}
                                            {dataOfDate.length === 1 &&
                                              dataOfDate[0].BookingId !==
                                                undefined && (
                                                <Link
                                                  to={
                                                    dataOfDate[0].ServiceId ===
                                                    60
                                                      ? "/booking/service-other?bookingId=" +
                                                        dataOfDate[0]
                                                          .BookingId +
                                                        "&id=18"
                                                      : "/booking/tour-booking?bookingId=" +
                                                        dataOfDate[0]
                                                          .BookingId +
                                                        "&id=18"
                                                  }
                                                  className="btn btn-info btn-sm m-1"
                                                  onClick={(eventClick) =>
                                                    dispatch(
                                                      FNC_UPDATE_IS_LOG(true)
                                                    )
                                                  }
                                                  title="Chi tiết booking"
                                                >
                                                  <i className="fa fa-edit"></i>
                                                </Link>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    );
                  })}
              </div>
            </div>
          )}
          <div className="clearfix"></div>
          {ParamsSearch.TypeSearch === 3 && (
            <>
              {SearchResult.ShowSummary && (
                <>
                  <div className="row collapse show" id="collapseExample">
                    <div class="col-sm-4 col-12" key={"summaryService"}>
                      <div class="card card-success shadow-sm">
                        <div class="card-body p-2">
                          <label class="w-100 uppercase">
                            TẤT CẢ TOUR
                            {/* <i className="fas fa-calendar cursor-pointer pull-right ml-1"
                                          onClick={(e) => {
                                            setParamsSearch({
                                              ...ParamsSearch,
                                              ShowCalendar: true,
                                            });
                                          }}
                                          title="Xem lịch"
                                        ></i> */}
                          </label>
                          <br />
                          <span
                            className="calendar-bg-blue w-45 p-1 m-1 radius cursor-pointer"
                            title={"Xem danh sách mở bán (Dự kiến)"}
                            onClick={(e) => {
                              setData(
                                SearchResult.Data.filter(
                                  (p) => p.StatusId === 1
                                )
                              );
                              handleShow();
                              setShowList(true);
                              setTitleModalList("Danh sách mở bán (Dự kiến)");
                            }}
                          >
                            Dự kiến:{" "}
                            {SearchResult.Data.filter((p) => p.StatusId === 1)
                              .length || 0}
                          </span>
                          <span
                            className="calendar-bg-yellow w-45 p-1 m-1 radius cursor-pointer"
                            title={"Xem danh sách mở bán (Chưa confirm)"}
                            onClick={(e) => {
                              setData(
                                SearchResult.Data.filter(
                                  (p) => p.StatusId === 2
                                )
                              );
                              handleShow();
                              setShowList(true);
                              setTitleModalList(
                                "Danh sách mở bán (Chưa confirm)"
                              );
                            }}
                          >
                            Chưa confirm:{" "}
                            {SearchResult.Data.filter((p) => p.StatusId === 2)
                              .length || 0}
                          </span>
                          <br />
                          <span
                            className="calendar-bg-green w-45 p-1 m-1 radius cursor-pointer"
                            title={"Xem danh sách mở bán (Đã cọc)"}
                            onClick={(e) => {
                              setData(
                                SearchResult.Data.filter(
                                  (p) => p.StatusId === 3
                                )
                              );
                              handleShow();
                              setShowList(true);
                              setTitleModalList("Danh sách mở bán (Đã cọc)");
                            }}
                          >
                            Đã cọc:{" "}
                            {SearchResult.Data.filter((p) => p.StatusId === 3)
                              .length || 0}
                          </span>
                          <span
                            className="calendar-bg-red w-45 p-1 m-1 radius cursor-pointer"
                            title={"Xem danh sách mở bán (Đã hủy)"}
                            onClick={(e) => {
                              setData(
                                SearchResult.Data.filter(
                                  (p) => p.StatusId === 4
                                )
                              );
                              handleShow();
                              setShowList(true);
                              setTitleModalList("Danh sách mở bán (Đã hủy)");
                            }}
                          >
                            Đã hủy:{" "}
                            {SearchResult.Data.filter((p) => p.StatusId === 4)
                              .length || 0}
                          </span>
                          <div className="text-center"></div>
                        </div>
                      </div>
                    </div>
                    {(ActiveService?.ServiceId || 0) === 0 && (
                      <>
                        {selector.ListServices.filter((p) => p.Type === 2).map(
                          (serviceItem, serviceIndex) => {
                            let dataByService = SearchResult.Data.filter(
                              (p) => p.ParentId === serviceItem.ServiceId
                            );
                            return (
                              <div
                                class="col-sm-4 col-12"
                                key={
                                  "summaryService" +
                                  serviceItem?.ServiceId +
                                  "-" +
                                  serviceIndex
                                }
                              >
                                <div class="card card-success shadow-sm">
                                  <div class="card-body p-2">
                                    <label class="w-100 uppercase">
                                      {serviceItem?.ServiceName}
                                      <i
                                        className="fas fa-list cursor-pointer pull-right ml-2"
                                        onClick={(e) => {
                                          setActiveService(serviceItem);
                                        }}
                                        title="Xem tuyến điểm"
                                      ></i>
                                      {/* <i className='fas fa-calendar cursor-pointer pull-right ml-1' onClick={(e) => { setParamsSearch({ ...ParamsSearch, ShowCalendar: true }) }} title="Xem lịch"></i> */}
                                    </label>
                                    <br />
                                    <span
                                      className="calendar-bg-blue w-45 p-1 m-1 radius cursor-pointer"
                                      title={
                                        "Xem danh sách mở bán tour: " +
                                        serviceItem?.ServiceName +
                                        " (Dự kiến)"
                                      }
                                      onClick={(e) => {
                                        setData(
                                          SearchResult.Data.filter(
                                            (p) =>
                                              p.ParentId ===
                                                serviceItem?.ServiceId &&
                                              p.StatusId === 1
                                          )
                                        );
                                        handleShow();
                                        setShowList(true);
                                        setTitleModalList(
                                          "Danh sách mở bán " +
                                            serviceItem?.ServiceName +
                                            " (Dự kiến)"
                                        );
                                      }}
                                    >
                                      Dự kiến:{" "}
                                      {dataByService?.filter(
                                        (p) => p.StatusId === 1
                                      ).length || 0}
                                    </span>
                                    <span
                                      className="calendar-bg-yellow w-45 p-1 m-1 radius cursor-pointer"
                                      title={
                                        "Xem danh sách mở bán tour: " +
                                        serviceItem?.ServiceName +
                                        " (Chưa confirm)"
                                      }
                                      onClick={(e) => {
                                        setData(
                                          SearchResult.Data.filter(
                                            (p) =>
                                              p.ParentId ===
                                                serviceItem?.ServiceId &&
                                              p.StatusId === 2
                                          )
                                        );
                                        handleShow();
                                        setShowList(true);
                                        setTitleModalList(
                                          "Danh sách mở bán " +
                                            serviceItem?.ServiceName +
                                            " (Chưa confirm)"
                                        );
                                      }}
                                    >
                                      Chưa confirm:{" "}
                                      {dataByService?.filter(
                                        (p) => p.StatusId === 2
                                      ).length || 0}
                                    </span>
                                    <br />
                                    <span
                                      className="calendar-bg-green w-45 p-1 m-1 radius cursor-pointer"
                                      title={
                                        "Xem danh sách mở bán tour: " +
                                        serviceItem?.ServiceName +
                                        " (Đã cọc)"
                                      }
                                      onClick={(e) => {
                                        setData(
                                          SearchResult.Data.filter(
                                            (p) =>
                                              p.ParentId ===
                                                serviceItem?.ServiceId &&
                                              p.StatusId === 3
                                          )
                                        );
                                        handleShow();
                                        setShowList(true);
                                        setTitleModalList(
                                          "Danh sách mở bán " +
                                            serviceItem?.ServiceName +
                                            " (Đã cọc)"
                                        );
                                      }}
                                    >
                                      Đã cọc:{" "}
                                      {dataByService?.filter(
                                        (p) => p.StatusId === 3
                                      ).length || 0}
                                    </span>
                                    <span
                                      className="calendar-bg-red w-45 p-1 m-1 radius cursor-pointer"
                                      title={
                                        "Xem danh sách mở bán tour: " +
                                        serviceItem?.ServiceName +
                                        " (Đã hủy)"
                                      }
                                      onClick={(e) => {
                                        setData(
                                          SearchResult.Data.filter(
                                            (p) =>
                                              p.ParentId ===
                                                serviceItem?.ServiceId &&
                                              p.StatusId === 4
                                          )
                                        );
                                        handleShow();
                                        setShowList(true);
                                        setTitleModalList(
                                          "Danh sách mở bán " +
                                            serviceItem?.ServiceName +
                                            " (Đã hủy)"
                                        );
                                      }}
                                    >
                                      Đã hủy:{" "}
                                      {dataByService?.filter(
                                        (p) => p.StatusId === 4
                                      ).length || 0}
                                    </span>
                                    <div className="text-center"></div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </>
                    )}
                    {(ActiveService?.ServiceId || 0) !== 0 && (
                      <>
                        <div class="col-sm-12">
                          <div className="card card-primary card-outline">
                            <div class="card-header">
                              <h3 class="card-title">
                                <i class="fas fa-edit"></i>
                                {ActiveService?.ServiceName || ""}
                              </h3>
                              <div class="card-tools">
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    setActiveService({ ServiceId: 0 })
                                  }
                                  class="btn btn-info pull-right btn-sm  margin-top-5s"
                                >
                                  <i class="fas fa-angle-left"></i> Trở về
                                </button>
                              </div>
                            </div>
                            <div
                              class="card-body"
                              style={{ backgroundColor: "#f4f6f9" }}
                            >
                              <div className="row">
                                {selector.ListServices.filter(
                                  (p) =>
                                    p.Type === 1 &&
                                    p.ParentId === ActiveService.ServiceId
                                ).map((serviceItem, serviceIndex) => {
                                  let dataByService = SearchResult.Data.filter(
                                    (p) => p.ServiceId === serviceItem.ServiceId
                                  );
                                  return (
                                    <div
                                      class="col-sm-4 col-12"
                                      key={
                                        "summaryService" +
                                        serviceItem?.ServiceId +
                                        "-" +
                                        serviceIndex
                                      }
                                    >
                                      <div class="card card-success shadow-sm">
                                        <div class="card-body p-2">
                                          <label class="w-100 uppercase">
                                            {serviceItem?.ServiceName}
                                            <i
                                              className="fas fa-calendar cursor-pointer pull-right ml-1"
                                              onClick={(e) => {
                                                setParamsSearch({
                                                  ...ParamsSearch,
                                                  ShowCalendar: true,
                                                });
                                              }}
                                              title="Xem lịch"
                                            ></i>
                                          </label>
                                          <br />
                                          <span
                                            className="calendar-bg-blue w-45 p-1 m-1 radius cursor-pointer"
                                            title={
                                              "Xem danh sách mở bán tour: " +
                                              serviceItem?.ServiceName +
                                              " (Dự kiến)"
                                            }
                                            onClick={(e) => {
                                              setData(
                                                SearchResult.Data.filter(
                                                  (p) =>
                                                    p.ParentId ===
                                                      serviceItem?.ServiceId &&
                                                    p.StatusId === 1
                                                )
                                              );
                                              handleShow();
                                              setShowList(true);
                                              setTitleModalList(
                                                "Danh sách mở bán " +
                                                  serviceItem?.ServiceName +
                                                  " (Dự kiến)"
                                              );
                                            }}
                                          >
                                            Dự kiến:{" "}
                                            {dataByService?.filter(
                                              (p) => p.StatusId === 1
                                            ).length || 0}
                                          </span>
                                          <span
                                            className="calendar-bg-yellow w-45 p-1 m-1 radius cursor-pointer"
                                            title={
                                              "Xem danh sách mở bán tour: " +
                                              serviceItem?.ServiceName +
                                              " (Chưa confirm)"
                                            }
                                            onClick={(e) => {
                                              setData(
                                                SearchResult.Data.filter(
                                                  (p) =>
                                                    p.ParentId ===
                                                      serviceItem?.ServiceId &&
                                                    p.StatusId === 2
                                                )
                                              );
                                              handleShow();
                                              setShowList(true);
                                              setTitleModalList(
                                                "Danh sách mở bán " +
                                                  serviceItem?.ServiceName +
                                                  " (Chưa confirm)"
                                              );
                                            }}
                                          >
                                            Chưa confirm:{" "}
                                            {dataByService?.filter(
                                              (p) => p.StatusId === 2
                                            ).length || 0}
                                          </span>
                                          <br />
                                          <span
                                            className="calendar-bg-green w-45 p-1 m-1 radius cursor-pointer"
                                            title={
                                              "Xem danh sách mở bán tour: " +
                                              serviceItem?.ServiceName +
                                              " (Đã cọc)"
                                            }
                                            onClick={(e) => {
                                              setData(
                                                SearchResult.Data.filter(
                                                  (p) =>
                                                    p.ParentId ===
                                                      serviceItem?.ServiceId &&
                                                    p.StatusId === 3
                                                )
                                              );
                                              handleShow();
                                              setShowList(true);
                                              setTitleModalList(
                                                "Danh sách mở bán " +
                                                  serviceItem?.ServiceName +
                                                  " (Đã cọc)"
                                              );
                                            }}
                                          >
                                            Đã cọc:{" "}
                                            {dataByService?.filter(
                                              (p) => p.StatusId === 3
                                            ).length || 0}
                                          </span>
                                          <span
                                            className="calendar-bg-red w-45 p-1 m-1 radius cursor-pointer"
                                            title={
                                              "Xem danh sách mở bán tour: " +
                                              serviceItem?.ServiceName +
                                              " (Đã hủy)"
                                            }
                                            onClick={(e) => {
                                              setData(
                                                SearchResult.Data.filter(
                                                  (p) =>
                                                    p.ParentId ===
                                                      serviceItem?.ServiceId &&
                                                    p.StatusId === 4
                                                )
                                              );
                                              handleShow();
                                              setShowList(true);
                                              setTitleModalList(
                                                "Danh sách mở bán " +
                                                  serviceItem?.ServiceName +
                                                  " (Đã hủy)"
                                              );
                                            }}
                                          >
                                            Đã hủy:{" "}
                                            {dataByService?.filter(
                                              (p) => p.StatusId === 4
                                            ).length || 0}
                                          </span>
                                          <div className="text-center"></div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
              <div className="row table-scrollable">
                <table
                  width="100%"
                  className="table table-hover text-sm text-gray-700 table-fixed-left calendar-table"
                >
                  <tbody>
                    {SearchResult.CalendarService?.map((item, index) => {
                      let arrDay = [];
                      let _totalDateOfMonth = new Date(
                        item.year,
                        item.month,
                        0
                      ).getDate();
                      for (let _days = 1; _days <= _totalDateOfMonth; _days++) {
                        let tmpDate = new Date(
                          item.year,
                          item.month - 1,
                          _days
                        );
                        arrDay.push({
                          DayFull: FormatDateJson(tmpDate, 4),
                          Day: _days,
                          IsAdd: tmpDate > _now,
                        });
                      }
                      return (
                        <tr key={"longrow" + index}>
                          <td
                            className="bg-light-blue"
                            style={{
                              minWidth: "90px",
                              verticalAlign: "middle",
                              fontWeight: 500,
                              fontSize: "15px",
                            }}
                          >
                            {item.year + "-" + item.month}
                          </td>
                          {arrDay.map((i, k) => {
                            let dataOfDate = SearchResult.Data.filter(
                              (p) =>
                                p.DateSaleFrom === i.DayFull &&
                                ((ActiveService?.ServiceId || 0) === 0 ||
                                  p.ParentId === ActiveService.ServiceId)
                            );
                            let fillColor = "",
                              totalSlot = dataOfDate.reduce(
                                (a, v) => (a = a + (v.TotalSlot ?? 0)),
                                0
                              );
                            if (
                              dataOfDate.length > 0 &&
                              dataOfDate[0].StatusId === 1
                            )
                              fillColor = "bg-primary";
                            if (
                              dataOfDate.length > 0 &&
                              dataOfDate[0].StatusId === 2
                            )
                              fillColor = "bg-yellow";
                            if (
                              dataOfDate.length > 0 &&
                              dataOfDate[0].StatusId === 3
                            )
                              fillColor = "bg-green";
                            if (
                              dataOfDate.length > 0 &&
                              dataOfDate[0].StatusId === 4
                            )
                              fillColor = "bg-red";
                            if (
                              dataOfDate.length > 0 &&
                              dataOfDate[0].StatusId === 5
                            )
                              fillColor = "bg-pink";
                            if (
                              TimeActiveFrom !== "" &&
                              TimeActiveFrom <= i.DayFull &&
                              TimeActiveTo >= i.DayFull
                            )
                              fillColor = fillColor + " bg-light-blue";

                            return (
                              <td>
                                <div
                                  className={
                                    "card mb-0 " +
                                    (TimeActiveFrom !== "" &&
                                    TimeActiveFrom <= i.DayFull &&
                                    TimeActiveTo >= i.DayFull
                                      ? " bg-light-blue"
                                      : fillColor)
                                  }
                                  title={dataOfDate.reduce(
                                    (a, v) =>
                                      (a = v.ServiceSaleName + ", " + a),
                                    ""
                                  )}
                                >
                                  <div
                                    className="card-body p-0"
                                    style={{ minWidth: "120px" }}
                                    onClick={(t) =>
                                      onTimeActive(
                                        dataOfDate[0]?.DateSaleFrom,
                                        dataOfDate[0]?.DateSaleTo
                                      )
                                    }
                                  >
                                    <div className="text-right card-head">
                                      {i.Day}
                                    </div>
                                    {(TimeActiveFrom === "" ||
                                      TimeActiveFrom === i.DayFull) &&
                                      dataOfDate.length > 0 &&
                                      dataOfDate[0]?.BookingId !==
                                        undefined && (
                                        <>
                                          {(TimeActiveFrom === "" ||
                                            TimeActiveFrom === i.DayFull) &&
                                            dataOfDate.length > 0 &&
                                            dataOfDate.length < 2 &&
                                            dataOfDate[0].BookingId !==
                                              undefined && (
                                              <div className="  pb-2 fs-11 center-item font-weight-bold">
                                                {dataOfDate[0]?.ServiceSaleCode}
                                              </div>
                                            )}
                                          {dataOfDate.length > 1 && (
                                            <div className="card-row text-primary">
                                              Tổng tour
                                              <div className="pull-right">
                                                {dataOfDate.length}
                                              </div>
                                            </div>
                                          )}
                                          <div className="card-row text-primary">
                                            <span className=""></span>
                                            Tổng số chỗ
                                            <div className="pull-right">
                                              {dataOfDate.reduce(
                                                (a, v) =>
                                                  (a = a + v.Numberofseats),
                                                0
                                              )}
                                            </div>
                                          </div>
                                          <div className="card-row text-green Thị trường Mỹ">
                                            Đã bán
                                            <div className="pull-right">
                                              {dataOfDate.reduce(
                                                (a, v) => (a = a + v.TotalSlot),
                                                0
                                              )}
                                            </div>
                                          </div>
                                          <div className="card-row text-orange">
                                            Giữ chỗ
                                            <div className="pull-right">
                                              {dataOfDate.reduce(
                                                (a, v) => (a = a + v.TotalSold),
                                                0
                                              )}
                                            </div>
                                          </div>
                                          <div className="card-row text-red">
                                            Còn lại
                                            <div className="pull-right">
                                              {dataOfDate.reduce(
                                                (a, v) =>
                                                  (a = a + v.TotalPending),
                                                0
                                              )}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                  </div>
                                  <div
                                    className="card-hover"
                                    style={{ minWidth: "120px" }}
                                  >
                                    <div style={{ marginTop: "30px" }}>
                                      {i.Day !== "" &&
                                        i.IsAdd &&
                                        permission.add && (
                                          <>
                                            <button
                                              type="button"
                                              title="Thêm mở bán"
                                              className="btn btn-success btn-sm m-1 btn-add"
                                              onClick={(z) => {
                                                ShowFormAdd(i);
                                              }}
                                            >
                                              <i className="fa fa-plus"></i>
                                            </button>
                                          </>
                                        )}{" "}
                                      <br />
                                      {dataOfDate.length > 0 && (
                                        <>
                                          <button
                                            type="button"
                                            title="View"
                                            onClick={(z) => {
                                              setData(dataOfDate);
                                              handleShow();
                                              setShowList(true);
                                              setTitleModalList(
                                                "Danh sách mở bán " + i.DayFull
                                              );
                                            }}
                                            className="btn btn-info btn-sm m-1 btn-add"
                                          >
                                            <i className="fa fa-eye"></i>
                                          </button>
                                        </>
                                      )}
                                      {dataOfDate.length === 1 &&
                                        dataOfDate[0]?.BookingId !==
                                          undefined && (
                                          <Link
                                            to={
                                              dataOfDate[0].ServiceId === 60
                                                ? "/booking/service-other?bookingId=" +
                                                  dataOfDate[0].BookingId +
                                                  "&id=18"
                                                : "/booking/tour-booking?bookingId=" +
                                                  dataOfDate[0].BookingId +
                                                  "&id=18"
                                            }
                                            className="btn btn-info btn-sm m-1 btn-add"
                                            onClick={(eventClick) =>
                                              dispatch(FNC_UPDATE_IS_LOG(true))
                                            }
                                            title="Chi tiết booking"
                                          >
                                            <i className="fa fa-edit"></i>
                                          </Link>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header>
          <Modal.Title>{_titleModalList}</Modal.Title>
          <button
            type="button"
            className="close"
            aria-label="Đóng"
            onClick={() => {
              handleClose();
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <DataTable data={data} columns={columns} fixedColumns="true" />
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer> */}
      </Modal>
      <Modal show={show1} onHide={handleClose1} size="md">
        <Modal.Header>
          <Modal.Title>Cập nhật trạng thái mở bán</Modal.Title>
          <button
            type="button"
            className="close"
            aria-label="Đóng"
            onClick={() => {
              handleClose1();
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <label className="form__title">Trạng thái</label>
              <div className="form-group">
                <Select
                  value={_statusUpdate}
                  onChange={(e) => setStatusUpdate(e)}
                  options={dataStatus}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={(e) => {
              ConfirmAlert("Xác nhận", "Cập nhật trạng thái tour ?", () => {
                handleClose1();
                Trl_spServiceSaleStatus_Update();
              });
            }}
          >
            Lưu & đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show2} onHide={handleClose2} size="xl">
        <Modal.Header>
          <Modal.Title>{_titleModal}</Modal.Title>
          <button
            type="button"
            className="close"
            aria-label="Đóng"
            onClick={() => {
              handleClose2();
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <>
            <div className="row service-sale">
              <div className="col-sm-4">
                <div className="form-group">
                  <span>Ngày khởi hành</span>
                  <DateRangePicker
                    className="form-control2"
                    onChange={(e) => setDateSale(e)}
                    value={_dateSale}
                    minDate={new Date()}
                    format={"dd/MM/yyyy"}
                  />
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <span>Chọn tuyến điểm</span>
                  <SelectService
                    key={"s2"}
                    onSelected={(item) => {
                      setService2(item.value);
                      item?.TourCode
                        ? setServiceSaleCode(item.TourCode)
                        : setServiceSaleCode("");
                    }}
                    items={_service2}
                    type={1}
                    className={"w-100 select-custom"}
                  />
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <span>Tổng số chỗ</span>
                  <input
                    type="number"
                    value={_numberofseats}
                    ref={NumberofseatsRef}
                    onChange={(e) => setNumberofseats(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              {/*  <div className="col-sm-8">
                                <div className="form-group">
                                    <span>Tên mở bán</span>
                                    <input type="text" maxLength="150" value={_serviceSaleName} ref={ServiceSaleNameRef} onChange={(e) => setServiceSaleName(e.target.value)} className="form-control" />
                                </div>
                            </div> */}
              <div className="col-sm-4">
                <div className="form-group">
                  <span>Giá người lớn</span>
                  <input
                    type="text"
                    maxLength="150"
                    value={FormatMoney(BookingInfo?.Price1 || 0)}
                    onChange={(e) =>
                      setBookingInfo({
                        ...BookingInfo,
                        Price1: FormatMoney(e.target.value, 1),
                      })
                    }
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <span>Giá trẻ em</span>
                  <input
                    type="text"
                    maxLength="150"
                    value={FormatMoney(BookingInfo?.Price2 || 0)}
                    onChange={(e) =>
                      setBookingInfo({
                        ...BookingInfo,
                        Price2: FormatMoney(e.target.value, 1),
                      })
                    }
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <span>Giá Infant</span>
                  <input
                    type="text"
                    maxLength="150"
                    value={FormatMoney(+BookingInfo?.Price3 || 0)}
                    onChange={(e) =>
                      setBookingInfo({
                        ...BookingInfo,
                        Price3: FormatMoney(e.target.value, 1),
                      })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-sm-4">
                <div className="form-group">
                  <span>Dealine 1</span>
                  <DateRangePicker
                    className="form-control3 bg-success deadline"
                    value={BookingInfo.Deadline1}
                    onChange={(e) =>
                      setBookingInfo({ ...BookingInfo, Deadline1: e })
                    }
                    format={"dd/MM/yyyy"}
                  />
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <span>Dealine 2</span>
                  <DateRangePicker
                    className="form-control3 bg-warning deadline2"
                    value={BookingInfo.Deadline2}
                    onChange={(e) =>
                      setBookingInfo({ ...BookingInfo, Deadline2: e })
                    }
                    format={"dd/MM/yyyy"}
                  />
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <span>Dealine 3</span>
                  <DateRangePicker
                    className="form-control3 bg-danger deadline"
                    value={BookingInfo.Deadline3}
                    onChange={(e) =>
                      setBookingInfo({ ...BookingInfo, Deadline3: e })
                    }
                    format={"dd/MM/yyyy"}
                  />
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <span>Mã tour</span>
                  <input
                    type="text"
                    maxLength="150"
                    value={_serviceSaleCode}
                    ref={ServiceSaleCodeRef}
                    onChange={(e) => setServiceSaleCode(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <span>Dealine hoàn tất hồ sơ</span>
                  <DateTimePicker
                    className="form-control3"
                    value={BookingInfo.DeadlineFinish}
                    onChange={(e) =>
                      setBookingInfo({ ...BookingInfo, DeadlineFinish: e })
                    }
                    format={"dd/MM/yyyy"}
                    minDate={new Date()}
                    maxDate={_dateSale[0] || null}
                  />
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <span>Dealine hoàn tất visa</span>
                  <DateTimePicker
                    className="form-control3"
                    value={BookingInfo.DeadlineVisa}
                    onChange={(e) =>
                      setBookingInfo({ ...BookingInfo, DeadlineVisa: e })
                    }
                    format={"dd/MM/yyyy"}
                    minDate={new Date()}
                    maxDate={_dateSale[0] || null}
                  />
                </div>
              </div>
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleClose2}>
                        <i className='fas fa-undo'></i>   Close
                    </Button> */}
          {!_isBooking && !showList && (
            <Button
              disabled={!disable}
              variant="success"
              onClick={(e) => {
                Trl_spServiceSale_Save();
              }}
            >
              <i className="fas fa-fa fa-save pr-2"></i> Lưu
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

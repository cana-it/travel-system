import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  FormatDateJson,
  FormatMoney,
  ConfirmAlert,
  HandleTextArea,
} from "../../../../Utils";
import {
  SelectServiceSale,
  DataTableBooking,
  TooltipCustom,
} from "../../../../Common";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { DataTable2 } from "../../../../Common/DataTable2";
import DateTimePicker from "react-datetime-picker";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { DropdownButton } from "react-bootstrap";
import { HotelForm } from "./HotelForm";
import { PlaneTicketForm } from "./PlaneTicketForm";
import { LandTourForm } from "./LandTour";
import { TourGuiderForm } from "./TourGuider";
import { VisaForm } from "./VisaForm";
import { BookingPrint } from "./BookingPrint";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { InvoiceDefault } from "./InvoiceDefault";
import { IMAGES_DOMAIN } from "../../../../Services";
import moment from "moment";
import ReactInputMask from "react-input-mask";
import { InvoicePayment } from "./InvoicePayment";
import { InvoiceCustomerMain } from "./InvoiceCustomerMain";
export const CreateBooking = React.forwardRef((props, ref) => {
  let prm = useLocation();
  useEffect(() => {
    if (prm.search.length > 0 && prm.search.includes("bookingId")) {
      let id;
      let arrPr = prm.search.split("&");
      if (arrPr.length === 1) {
        id = +arrPr[0].replace(/\D/g, "");
      }
      if (arrPr.length > 1) {
        arrPr.forEach((item) => {
          if (item.includes("bookingId")) {
            id = +item.replace(/\D/g, "");
          }
        });
      }
      Trl_spBooking_Get(id);
    }
  }, []);

  const dispatch = useDispatch();
  const CreateBy = +localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const DepartmentId = +localStorage.getItem("DepartmentId");
  const positionId = +localStorage.getItem("PositionId");

  // tour

  const [deadlineFinish, setDeadlineFinish] = useState(null);
  const [deadlineVisa, setDeadlineVisa] = useState(null);
  const [notes, setNotes] = useState("");
  const [dataTableError, setDataTableError] = useState([]);
  const [inforRoom, setInforRoom] = useState("");
  const [totalKindOfPeople, setTotalKindOfPeople] = useState({});
  const [totalKindOfTicket, setTotalKindOfTicket] = useState({});
  // end tour

  //tour details
  const [bookingHeadInfo, setBookingHeadInfo] = useState({
    serviceSale: { value: "0", label: "Vui lòng chọn tour" },
    Deadline1: [null, null],
    Deadline2: [null, null],
    Deadline3: [null, null],
  });
  const [bookingDetails, setBookingDetails] = useState([]);
  const [dataSumBookingDetails, setDataSumBookingDetails] = useState({
    TourPrice: 0,
    Discount: 0,
    Surcharge: 0,
    TotalPrice: 0,
    Payment1: 0,
    Payment2: 0,
    Payment3: 0,
    Payment4: 0,
    Payment5: 0,
    Payment6: 0,
    Remain: 0,
  });
  const [showHotel, setShowHotel] = useState(false);
  const [showFlight, setShowFlight] = useState(false);
  const [showLandTour, setShowLandTour] = useState(false);
  const [showTourGuider, setShowTourGuider] = useState(false);
  const [skipPageReset, setSkipPageReset] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
  const [showInvoiceRefund, setShowInvoiceRefund] = useState(false);
  const [showVisa, setShowVisa] = useState(false);
  const [showJoinTour, setShowJoinTour] = useState(false);
  const [showInvoiceVisa, setShowInvoiceVisa] = useState(false);
  const [opacity, setOpacity] = useState("opacity-1");
  const [serviceSaleMerger, setServiceSaleMerger] = useState({ value: 0 });
  const [noteSpecial, setNoteSpecial] = useState("");

  const [hotelList, setHotelList] = useState([]);
  const [flightList, setFlightList] = useState([]);
  const [tourLeader, setTourLeader] = useState({});
  const [landTourList, setLandTourList] = useState([]);
  const [rowVisa, setRowVisa] = useState({});
  const [invoiceStyleList, setinvoiceStyleList] = useState([]);
  const [invoiceStyle, setInvoiceStyle] = useState({
    StyleId: 5,
    StyleName: "Thu Phí Tour",
    TypeInvoice: 100, // Visa
  });
  const [typeMerger, setTypeMerger] = useState(0);
  const [permission, setPermission] = useState(0);
  const [idPlane, setidPlane] = useState();

  const [check, setCheck] = useState(false);

  const typeValues = [
    { value: 1, label: "Male" },
    { value: 2, label: "Female" },
    { value: 3, label: "Male (Child)" },
    { value: 4, label: "Female (Child)" },
    { value: 5, label: "Male (Infant)" },
    { value: 6, label: "Female (Infant)" },
  ];

  const planeTicketValues = [
    { value: 1, label: "Vé Đoàn" },
    { value: 2, label: "Vé Lẻ" },
    { value: 3, label: "Land" },
  ];

  let sampleDataDetail = {
    Name: "",
    Sex: { value: 0, label: "" },
    DOB: null,
    Passport: "",
    DOI: null,
    DOE: null,
    Room: "",
    Tel: "",
    From: "",
    To: "",
    Bag: "",
    PassportStatus: "",
    RegisterDate: "",
    Visa: "",
    PlaneTicket: { value: 1, label: "Vé Đoàn" },
    TourPrice: "",
    Sale: "",
    Surcharge: "",
    Deposit1: "",
    Deposit2: "",
    Deposit3: "",
    Note: "",
    Endow: "",
    Agency: "",
    Payment1: 0,
    Payment2: 0,
    Payment3: 0,
    Payment4: 0,
    Payment5: 0,
    Payment6: 0,
    PlaneTicketValue: { value: 1, label: "Vé Đoàn" },
  };

  useEffect(() => {
    let arr = [];

    for (var i = 0; i < (bookingHeadInfo?.Numberofseats || 40); i++) {
      arr.push(sampleDataDetail);
    }
    setBookingDetails(arr);
  }, [bookingHeadInfo.Numberofseats]);

  useEffect(() => {
    Trl_spInvoiceStyle_List();
    handlePermission();
  }, []);

  useEffect(() => {
    bookingHeadInfo?.Deadline1 && handleChangeDeadline();
  }, [
    bookingHeadInfo.Deadline1,
    bookingHeadInfo.Deadline2,
    bookingHeadInfo.Deadline3,
  ]);

  const handlePermission = () => {
    //1: kinh doanh, 2: Dieu hanh, 3: huong dan vien, 0: full quyen
    if (DepartmentId === 29 || DepartmentId === 33) {
      setPermission(1);
    } else if (DepartmentId === 34) {
      setPermission(2);
    } else if (DepartmentId === 35) {
      setPermission(3);
    } else {
      setPermission(0);
    }
  };

  const handleSuccessVisa = (data) => {
    try {
      let arr = bookingDetails.map((item, index) => {
        if (item.BookingDetailId === +rowVisa.BookingDetailId) {
          return {
            ...item,
            VisaId: data.VisaId,
            VisaName: data.VisaName,
            VisaStatus: data.StatusVisaId,
            StatusVisaId: data.StatusVisaId,
            DOI: changeDayvsMonth(data.DOI.split(" ")[0]),
            DOE: changeDayvsMonth(data.DOE.split(" ")[0]),
            FingerprintDate: data.FingerprintDate,
            NoteOfVisa: data.NoteOfVisa,
            FilesVisa: data.FilesVisa,
            ImagesVisa: data.ImagesVisa,
          };
        }
        return item;
      });
      setDataObject({ ...DataObject, random: Math.random() });
      setBookingDetails(arr);
    } catch (error) {
      Alertwarning("Có lỗi xẫy ra vui lòng F5");
    }
  };

  const handleUpdateInvoice = (data, type) => {
    if (type === 1) {
      let arr = bookingDetails.map((item, index) => {
        if (item.BookingDetailId === +data.BookingDetailId) {
          if (data?.StatusId && data?.StatusName) {
            return {
              ...item,
              InvoiceVisaId: data.InvoiceId,
              StatusVisaId: data.StatusId,
              StatusVisaName: data.StatusName,
            };
          }
          return {
            ...item,
            InvoiceVisaId: data.InvoiceId,
          };
        }
        return item;
      });
      setBookingDetails(arr);
      setDataObject({ ...DataObject, InvoiceVisaId: data.InvoiceId });
    }
    if (type === 2) {
      if (data?.StatusId && data?.StatusName) {
        setBookingHeadInfo({
          ...bookingHeadInfo,
          LandTourInvoiceId: data.InvoiceId,
          StatusLandTourId: data.StatusId,
          StatusLandTourName: data.StatusName,
        });
      } else {
        setBookingHeadInfo({
          ...bookingHeadInfo,
          LandTourInvoiceId: data.InvoiceId,
        });
      }
    }
    if (type === 3) {
      setFlightList(
        flightList.map((item) => {
          if (item.BookingPlaneId === idPlane.BookingPlaneId) {
            return {
              ...item,
              InvoiceId: data.InvoiceId,
            };
          }
          return item;
        })
      );
    }
    if (type === 4) {
      setTourLeader([
        {
          ...tourLeader[0],
          InvoiceId: data.InvoiceId,
          StatusId: data.StatusId,
          StatusName: data.StatusName,
        },
      ]);
    }
    if (type === 5) {
      let arr = bookingDetails.map((item, index) => {
        if (item.BookingDetailId === +data.BookingDetailId) {
          return {
            ...item,
            InvoiceIdRefund: data.InvoiceId,
            StatusIdRefund: data.StatusId,
            StatusNameRefund: data.StatusName,
            PaymentRefund: data.Money,
          };
        }
        return item;
      });
      setBookingDetails(arr);
      setDataObject({ ...DataObject, StatusIdRefund: data.InvoiceId });
    }
  };

  const handleGetInvoicePayment = (data) => {
    let arr = bookingDetails.map((item, index) => {
      if (item.BookingDetailId === +data.BookingDetailId) {
        if (data.TypePm === "V1") {
          if (data?.StatusId && data?.StatusName) {
            return {
              ...item,
              InvoiceId1: data.InvoiceId,
              StatusId1: data.StatusId,
              StatusName1: data.StatusName,
              isVAT: data.isVAT,
              IsConfirm1: data.IsConfirm,
            };
          }
          setDataObject({ ...DataObject, InvoiceId1: 0 });
          return {
            ...item,
            InvoiceId1: data.InvoiceId,
            Payment1: data.Money,
            IsConfirm1: data.IsConfirm,
          };
        }
        if (data.TypePm === "V2") {
          if (data?.StatusId && data?.StatusName) {
            return {
              ...item,
              InvoiceId2: data.InvoiceId,
              StatusId2: data.StatusId,
              StatusName2: data.StatusName,
              isVAT: data.isVAT,
              IsConfirm2: data.IsConfirm,
            };
          }
          setDataObject({ ...DataObject, InvoiceId2: 0 });
          return {
            ...item,
            InvoiceId2: data.InvoiceId,
            Payment2: data.Money,
            IsConfirm2: data.IsConfirm,
          };
        }
        if (data.TypePm === "V3") {
          if (data?.StatusId && data?.StatusName) {
            return {
              ...item,
              InvoiceId3: data.InvoiceId,
              StatusId3: data.StatusId,
              StatusName3: data.StatusName,
              isVAT: data.isVAT,
              IsConfirm3: data.IsConfirm,
            };
          }
          setDataObject({ ...DataObject, InvoiceId3: 0 });
          return {
            ...item,
            InvoiceId3: data.InvoiceId,
            Payment3: data.Money,
            IsConfirm3: data.IsConfirm,
          };
        }
        if (data.TypePm === "V4") {
          if (data?.StatusId && data?.StatusName) {
            return {
              ...item,
              InvoiceId4: data.InvoiceId,
              StatusId4: data.StatusId,
              StatusName4: data.StatusName,
              isVAT: data.isVAT,
              IsConfirm4: data.IsConfirm,
            };
          }
          setDataObject({ ...DataObject, InvoiceId4: 0 });
          return {
            ...item,
            InvoiceId4: data.InvoiceId,
            Payment4: data.Money,
            IsConfirm4: data.IsConfirm,
          };
        }
        if (data.TypePm === "V5") {
          if (data?.StatusId && data?.StatusName) {
            return {
              ...item,
              InvoiceId5: data.InvoiceId,
              StatusId5: data.StatusId,
              StatusName5: data.StatusName,
              isVAT: data.isVAT,
              IsConfirm5: data.IsConfirm,
            };
          }
          setDataObject({ ...DataObject, InvoiceId5: 0 });
          return {
            ...item,
            InvoiceId5: data.InvoiceId,
            Payment5: data.Money,
            IsConfirm5: data.IsConfirm,
          };
        }
        if (data.TypePm === "V6") {
          if (data?.StatusId && data?.StatusName) {
            return {
              ...item,
              InvoiceId6: data.InvoiceId,
              StatusId6: data.StatusId,
              StatusName6: data.StatusName,
              isVAT: data.isVAT,
              IsConfirm6: data.IsConfirm,
            };
          }
          setDataObject({ ...DataObject, InvoiceId6: 0 });
          return {
            ...item,
            InvoiceId6: data.InvoiceId,
            Payment6: data.Money,
            IsConfirm6: data.IsConfirm,
          };
        }
      }
      return item;
    });
    setBookingDetails(arr);
  };

  const handleClose = (type, tM = 0) => {
    //0: booking, 1: hotel, 2: flight, 3: landtour, 4: fee, 5: invoice, 6: tourguider, 7: visa, 8: join tour

    if (type === 1) {
      setShowHotel(false);
    } else if (type === 2) {
      setShowFlight(false);
    } else if (type === 3) {
      setShowLandTour(false);
    } else if (type === 5) {
      setShowInvoice(false);
    } else if (type === 6) {
      setShowTourGuider(false);
    } else if (type === 7) {
      setShowVisa(false);
    } else if (type === 8) {
      setShowJoinTour(false);
      setTypeMerger(tM);
    } else if (type === 9) {
      setShowInvoiceDetail(false);
    } else if (type === 11) {
      setShowDiscountSurcharge(false);
    } else if (type === 12) {
      setShowDiscountSurcharge1(false);
    } else if (type === 13) {
      setShowInvoiceVisa(false);
    } else if (type === 14) {
      setShowInvoiceRefund(false);
    }
  };

  const handleShow = (type, tM) => {
    //0: booking, 1: hotel, 2: flight, 3: landtour, 4: fee, 5: invoice, 6: tourguider, 7: visa 8: join tour
    if (type === 1) {
      setShowHotel(true);
    } else if (type === 2) {
      setShowFlight(true);
    } else if (type === 3) {
      setShowLandTour(true);
    } else if (type === 5) {
      setShowInvoice(true);
    } else if (type === 6) {
      setShowTourGuider(true);
    } else if (type === 7) {
      setShowVisa(true);
    } else if (type === 8) {
      setShowJoinTour(true);
      setTypeMerger(tM);
    } else if (type === 9) {
      setShowInvoiceDetail(true);
    } else if (type === 11) {
      setShowDiscountSurcharge(true);
    } else if (type === 12) {
      setShowDiscountSurcharge1(true);
    } else if (type === 13) {
      setShowInvoiceVisa(true);
    } else if (type === 14) {
      setShowInvoiceRefund(true);
    }
  };

  const handleChangeDeadline = () => {
    let newArr = bookingDetails.map((item) => {
      let bg = handleDeadlineTime(item.RegisterDate, bookingHeadInfo);
      return {
        ...item,
        RegisterDateBg: bg,
      };
    });
    setBookingDetails(newArr);
  };

  const handleDeadlineTime = (d, bk) => {
    let registerDate = new Date(d).getTime();
    let bg = "";
    if (
      bk?.Deadline1[0] &&
      bk?.Deadline1[1] &&
      bk?.Deadline2[0] &&
      bk?.Deadline2[1] &&
      bk?.Deadline3[0] &&
      bk?.Deadline3[1]
    ) {
      let deadline1From = new Date(bk?.Deadline1[0]).getTime();
      let deadline1To = new Date(bk?.Deadline1[1]).getTime();
      let deadline2From = new Date(bk?.Deadline2[0]).getTime();
      let deadline2To = new Date(bk?.Deadline2[1]).getTime();
      let deadline3From = new Date(bk?.Deadline3[0]).getTime();
      let deadline3To = new Date(bk?.Deadline3[1]).getTime();
      if (registerDate >= deadline1From && registerDate <= deadline1To) {
        bg = "bg-success";
      }
      if (registerDate >= deadline2From && registerDate <= deadline2To) {
        bg = "bg-warning";
      }
      if (registerDate >= deadline3From && registerDate <= deadline3To) {
        bg = "bg-danger";
      }
      if (registerDate < deadline1From) {
        bg = "bg-success";
      }
      if (registerDate > deadline3To) {
        bg = "bg-success";
      }
    }
    return bg;
  };

  //#region Call API
  const Trl_spInvoiceStyle_List = async (bookingId) => {
    try {
      const pr = {
        BookingId: +bookingId,
        CreateName: +CreateBy,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoiceStyle_List",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      setinvoiceStyleList(res);
    } catch (error) {
      ;
    }
  };

  const Trl_spBooking_Get = async (bookingId) => {
    try {
      const pr = {
        BookingId: +bookingId,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBooking_Get",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);

      let bk = {
        ...res[0],
        BookingId: bookingId,
        serviceSale: {
          value: res[0].ServiceSaleId,
          label: res[0].ServiceSaleCode + "-" + res[0].ServiceSaleName,
          ServiceSaleCode: res[0].ServiceSaleCode,
        },
        Price1: res[0].Price1,
        Price2: res[0].Price2,
        Price3: res[0].Price3,
        Deadline1: [
          res[0]?.Deadline1From ? new Date(res[0]?.Deadline1From) : null,
          res[0]?.Deadline1To ? new Date(res[0]?.Deadline1To) : null,
        ],
        Deadline2: [
          res[0]?.Deadline2From ? new Date(res[0]?.Deadline2From) : null,
          res[0]?.Deadline2To ? new Date(res[0]?.Deadline2To) : null,
        ],
        Deadline3: [
          res[0]?.Deadline3From ? new Date(res[0]?.Deadline3From) : null,
          res[0]?.Deadline3To ? new Date(res[0]?.Deadline3To) : null,
        ],
        StatusId: res[0].StatusId,
        StatusName: res[0].StatusName,
        Creater: res[0].CreaterA,
        CreateName: res[0].CreateNameA,
        CreateTime: res[0].CreateTimeA,
        PlaneCode: res[0].PlaneCodeA,
        VisaWarning: res[0].VisaWarning || "success",
      };
      await setBookingHeadInfo(bk);
      localStorage.setItem("CreateBooking", bk.CreateA);
      setNotes(HandleTextArea(res[0].Notes, 1));
      setInforRoom(res[0].RoomInfo);
      setNoteSpecial(HandleTextArea(res[0]?.NoteSpecial || "", 1));
      res[0]?.DeadlineFinish &&
        setDeadlineFinish(new Date(res[0].DeadlineFinish));
      res[0]?.DeadlineVisa && setDeadlineVisa(new Date(res[0].DeadlineVisa));
      await Trl_spBookingDetail_List(bookingId, bk, bk.Numberofseats);
      // await Trl_spBooking_CustomerRoomHotel_View(res[0].BookingId)
      await Trl_spBooking_CustomerPlane_View(bookingId);
      await Trl_spBooking_TourGuide_View(bookingId);
      await Trl_spBooking_ServiceLandTour_View(bookingId);
    } catch (error) {
      ;
    }
  };

  const Trl_spBooking_CustomerPlane_View = async (bookingId) => {
    try {
      const pr = {
        BookingId: +bookingId,
        CreateName: +CreateBy,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBooking_CustomerPlane_View",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      setFlightList(res);
      // setDataBookingStatus(res)
    } catch (error) {
      ;
    }
  };

  const Trl_spBooking_ServiceLandTour_View = async (bookingId) => {
    try {
      const pr = {
        BookingId: +bookingId,
        CreateName: +CreateBy,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBooking_ServiceLandTour_View",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      setLandTourList(res);
      // setDataBookingStatus(res)
    } catch (error) {
      ;
    }
  };

  const Trl_spBooking_TourGuide_View = async (bookingId) => {
    try {
      const pr = {
        BookingId: +bookingId,
        CreateName: +CreateBy,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBooking_TourGuide_View",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      setTourLeader(res);
      // setDataBookingStatus(res)
    } catch (error) {
      ;
    }
  };

  const Trl_spBooking_Save = async (data) => {
    try {
      const pr = {
        BookingId: bookingHeadInfo?.BookingId || 0,
        BookingCode: bookingHeadInfo.BookingCode || "",
        BookingName: bookingHeadInfo.BookingName || "",
        ServiceSaleId: bookingHeadInfo.serviceSale.value,
        TimeStart: bookingHeadInfo?.TimeStart
          ? FormatDateJson(bookingHeadInfo.TimeStart)
          : FormatDateJson(bookingHeadInfo?.serviceSale.TimeStart),
        TimeEnd: bookingHeadInfo?.TimeEnd
          ? FormatDateJson(bookingHeadInfo.TimeEnd)
          : bookingHeadInfo(bookingHeadInfo?.serviceSale.TimeEnd),
        Creater: bookingHeadInfo.Creater,
        CreateName: bookingHeadInfo.CreateName,
        Deadline1From: FormatDateJson(bookingHeadInfo.Deadline1[0]),
        Deadline1To: FormatDateJson(bookingHeadInfo.Deadline1[1]),
        Deadline2From: FormatDateJson(bookingHeadInfo.Deadline2[0]),
        Deadline2To: FormatDateJson(bookingHeadInfo.Deadline2[1]),
        Deadline3From: FormatDateJson(bookingHeadInfo.Deadline3[0]),
        Deadline3To: FormatDateJson(bookingHeadInfo.Deadline3[1]),
        Operation1Id: 0,
        Operation2Id: 0,
        Price1: +bookingHeadInfo?.Price1 || 0,
        Price2: +bookingHeadInfo?.Price2 || 0,
        Price3: +bookingHeadInfo?.Price3 || 0,
        StatusId: +bookingHeadInfo.StatusId,
        StatusName: bookingHeadInfo.StatusName,
        Notes: HandleTextArea(notes),
        DeadlineFinish:
          FormatDateJson(deadlineFinish) || FormatDateJson(new Date()),
        DeadlineVisa:
          FormatDateJson(deadlineVisa) || FormatDateJson(new Date()),
        RoomInfo: inforRoom,
        NoteSpecial: HandleTextArea(noteSpecial),
        VisaWarning: bookingHeadInfo.VisaWarning || "success",
        DepartmentId: +DepartmentId,
        PositionId: +positionId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBooking_Save",
      };
      const respone = await mainAction.API_spCallServer(params, dispatch);
    } catch (error) {
      ;
    }
  };

  const changeDayvsMonth = (date) => {
    let arr = date.split("/");
    return `${arr[1]}/${arr[0]}/${arr[2]}`;
  };

  const handleValidate = (date) => {
    if (date === null || date === undefined || date === "") {
      return 2;
    }
    let checkNullDate = date.replaceAll("/", "").replaceAll("_", "");
    if (checkNullDate === "") {
      return 2;
    }
    let checkValid = date.replaceAll("_", "").split("/");
    if (
      checkValid[0] > 31 ||
      checkValid[1] > 12 ||
      checkValid[2] > 9999 ||
      checkValid[1] <= 0 ||
      checkValid[0] <= 0 ||
      checkValid[2] <= 0
    ) {
      return 3;
    }
    return 1;
  };

  const Trl_spBookingDetail_Save = async (data) => {
    try {
      let check = 0,
        check1 = 0,
        check2 = 0;
      const pr = bookingDetails
        .filter((item) => item.Name.trim().length > 0)
        .map((item) => {
          if (!item?.No || item?.No === "") {
            check = 1;
          }
          if (item?.No && +item?.No > bookingDetails.length) {
            check1 = 1;
          }
          let birthday = "",
            doi = "",
            doe = "",
            resgiter = "";
          if (handleValidate(item.DOB) === 1)
            birthday = FormatDateJson(
              changeDayvsMonth(item.DOB.replaceAll("_", "")),
              1
            );
          if (handleValidate(item.DOI) === 1)
            doi = FormatDateJson(
              changeDayvsMonth(item.DOI.replaceAll("_", "")),
              1
            );
          if (handleValidate(item.DOE) === 1)
            doe = FormatDateJson(
              changeDayvsMonth(item.DOE.replaceAll("_", "")),
              1
            );
          if (handleValidate(item.RegisterDate) === 1)
            resgiter = FormatDateJson(
              changeDayvsMonth(item.RegisterDate.replaceAll("_", "")),
              0
            );
          if (handleValidate(item.DOB) === 2) birthday = null;
          if (handleValidate(item.DOI) === 2) doi = null;
          if (handleValidate(item.DOE) === 2) doe = null;
          if (handleValidate(item.RegisterDate) === 2)
            resgiter = FormatDateJson(new Date(), 1);
          if (handleValidate(item.DOB) === 3) {
            Alertwarning(`Ngày sinh của ${item.Name} không hợp lệ`);
            check2++;
          }
          if (handleValidate(item.DOI) === 3) {
            Alertwarning(`Ngày cấp của ${item.Name} không hợp lệ`);
            check2++;
          }
          if (handleValidate(item.DOE) === 3) {
            Alertwarning(`Ngày hết hạn của ${item.Name} không hợp lệ`);
            check2++;
          }
          if (handleValidate(item.RegisterDate) === 3) {
            Alertwarning(`Ngày đăng ký của ${item.Name} không hợp lệ`);
            check2++;
          }

          return {
            BookingId: bookingHeadInfo.BookingId,
            BookingDetailId: item?.BookingDetailId || 0,
            CustomerId: item.CustomerId || 0,
            CustomerCode: item.CustomerCode,
            CustomerName: item.Name,
            Sex: item.Sex?.label || "",
            Brithday: birthday,
            Address: "",
            Phone: item.Tel,
            PassportCode: item.Passport,
            PassportTimeFrom: doi,
            PassportTimeTo: doe,
            PassportScan: item.PassportStatus,
            Creater: +CreateBy,
            CreateName: CreateName,
            GoFrom: item.From,
            RoomCode: item.Room,
            RoomUpdateTime: FormatDateJson(new Date()),
            PriceTour: +item.TourPrice,
            PriceTour_Discount: +item.Discount,
            PriceTour_Surcharge: +item.Surcharge,
            Deposit1: +item?.Deposit1 || 0,
            Deposit2: +item?.Deposit2 || 0,
            Deposit3: +item?.Deposit3 || 0,
            RegisterDate: resgiter,
            Note: item.Note,
            Visa: item.Visa,
            PlaneTicket: item.PlaneTicketValue?.label || "Vé Đoàn",
            Bag: item.Bag,
            SaleId: item?.StaffId || +CreateBy,
            StatusCustomer: item?.StatusCustomer || "OK",
            Agency: item.Agency,
            IsSold: item?.IsSold || 0,
            DiscountDescription: item?.DiscountDescription || "",
            SurchargeDescription: item?.SurchargeDescription || "",
            No: item?.No,
            GroupFamily: item?.GroupFamily || 0,
            FingerprintDate: item?.FingerprintDate || "",
          };
        });
      if (check === 1) {
        Alerterror("Vui lòng nhập số thứ tự");
        return;
      }
      if (check1 === 1) {
        Alerterror("Số thứ tự không được lớn hơn số lượng khách");
        return;
      }
      if (check2 > 0) {
        return;
      }
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBookingDetail_Save_V1",
      };
      const respone = await mainAction.API_spCallServer(params, dispatch);
      if (respone.Status === "OK") {
        await Trl_spBookingDetail_List(
          bookingHeadInfo.BookingId,
          bookingHeadInfo,
          bookingHeadInfo.Numberofseats
        );
        Alertsuccess("Cập nhật booking thành công");
      }
    } catch (error) {
      ;
    }
  };

  const Trl_spBookingDetail_List = async (bookingId, booking, totalBooking) => {
    try {
      const pr = {
        BookingId: bookingId,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBookingDetail_List",
      };
      const respone = await mainAction.API_spCallServer(params, dispatch);
      let inf = 0,
        chd = 0,
        adt = 0,
        checkSale = true,
        saleId = 0,
        group = 0,
        alone = 0,
        land = 0,
        groupFamily = 0;

      let newRes = respone.map((item, index) => {
        let s = typeValues.filter((i) => i.label === item.Sex);
        let sf = s.length > 0 ? s[0] : { value: 0, label: "" };
        let pl = item?.PlaneCode
          ? planeTicketValues.filter((i) => i.label === item.PlaneCode)
          : [];
        let plf = pl.length > 0 ? pl[0] : planeTicketValues[0];

        let bg = handleDeadlineTime(item.RegisterDate, booking);
        let isVAT = false;
        if (item?.VAT1 > 0 || item?.VAT2 > 0 || item?.VAT3 > 0) {
          isVAT = true;
        }
        let totalPrice = 0;
        if (item?.Brithday) {
          let start = moment(item.Brithday);
          let end = moment(booking.TimeEnd);
          const diff = end.diff(start);
          const diffDuration = moment.duration(diff);
          let years = diffDuration.years();
          if (years < 2) {
            totalPrice = +booking.Price3;
            item.IsSold === 0 && inf++;
          } else if (years >= 2 && years < 11) {
            totalPrice = +booking.Price2;
            item.IsSold === 0 && chd++;
          } else {
            totalPrice = +booking.Price1;
            item.IsSold === 0 && adt++;
          }
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

        if (item?.IsTourLeader) {
          totalPrice = 0;
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
          TourPrice: totalPrice,
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
          RegisterDateBg: bg,
          Sale: item.SaleStaffId,
          Checked: false,
          Sex: sf,
          StatusCustomer: item?.StatusCustomer || "OK",
          ObjectId: 1,
          ObjectName: "Khách hàng",
          isVAT: isVAT,
          No: index + 1,
          PlaneTicketValue: plf,
          GroupFamily: item.GroupFamily || 0,
          CustomerCode: code,
        };
      });
      setTotalKindOfPeople({ inf: inf, chd: chd, adt: adt });
      let tourPriceSum = 0,
        discountSum = 0,
        surchageSum = 0,
        totalPriceSum = 0,
        payment1Sum = 0,
        payment2Sum = 0,
        payment3Sum = 0,
        payment4Sum = 0,
        payment5Sum = 0,
        payment6Sum = 0,
        remainSum = 0;
      let tempArr = [
        ...newRes
          .filter((item) => {
            return (
              (item.StatusCustomer === "OK" ||
                (item?.BookingId === bookingId &&
                  item.StatusCustomer === "JOIN")) &&
              item?.BookingDetailId
            );
          })
          .map((iem, index) => {
            if (iem?.IsTourLeader) {
              iem.PriceTour = 0;
              iem.PriceTour_Discount = 0;
              iem.PriceTour_Surcharge = 0;
            }
            tourPriceSum += +iem?.PriceTour || 0;
            discountSum += +iem?.PriceTour_Discount || 0;
            surchageSum += +iem?.PriceTour_Surcharge || 0;
            totalPriceSum +=
              +(iem?.PriceTour || 0) -
              +(iem?.PriceTour_Discount || 0) +
              (+iem?.PriceTour_Surcharge || 0);
            payment1Sum += +iem?.Payment1 || 0;
            payment2Sum += +iem?.Payment2 || 0;
            payment3Sum += +iem?.Payment3 || 0;
            payment4Sum += +iem?.Payment4 || 0;
            payment5Sum += +iem?.Payment5 || 0;
            payment6Sum += +iem?.Payment6 || 0;

            remainSum +=
              (+iem?.PriceTour || 0) -
              (+iem?.PriceTour_Discount || 0) +
              (+iem?.PriceTour_Surcharge || 0) -
              (+iem?.Payment1 || 0) -
              (+iem?.Payment2 || 0) -
              (+iem?.Payment3 || 0) -
              (+iem?.Payment4 || 0) -
              (+iem?.Payment5 || 0) -
              (+iem?.Payment6 || 0);
            let pl = iem?.PlaneCode
              ? planeTicketValues.filter((i) => i.label === iem.PlaneCode)
              : [];
            let plf = pl.length > 0 ? pl[0] : planeTicketValues[0];

            if (plf.label === "Vé Đoàn") {
              iem.IsSold === 0 && group++;
            } else if (plf.label === "Vé Lẻ") {
              iem.IsSold === 0 && alone++;
            } else {
              iem.IsSold === 0 && land++;
            }

            if (index === 0) {
              saleId = iem.Sale_StaffId;
              groupFamily = iem?.GroupFamily || 0;
            } else {
              if (saleId !== iem.Sale_StaffId) {
                checkSale = !checkSale;
                saleId = iem.Sale_StaffId;
              }
              if (
                saleId === iem.Sale_StaffId &&
                groupFamily !== iem?.GroupFamily &&
                iem?.GroupFamily
              ) {
                checkSale = !checkSale;
                groupFamily = iem?.GroupFamily;
              }
            }
            return { ...iem, No: index + 1, checkSale: checkSale };
          }),
      ];
      setTotalKindOfTicket({ group: group, alone: alone, land: land });
      setDataSumBookingDetails({
        TourPrice: tourPriceSum,
        Discount: discountSum,
        Surcharge: surchageSum,
        TotalPrice: totalPriceSum,
        Payment1: payment1Sum,
        Payment2: payment2Sum,
        Payment3: payment3Sum,
        Payment4: payment4Sum,
        Payment5: payment5Sum,
        Payment6: payment6Sum,
        Remain: remainSum,
      });

      if (tempArr.length < totalBooking + 10) {
        for (
          let index = newRes.length - tempArr.length - 1;
          index < +totalBooking + 10;
          index++
        ) {
          tempArr.push({ ...sampleDataDetail, No: tempArr.length + 1 });
        }
      }
      setBookingDetails(tempArr);

      let data2 = newRes
        .filter(
          (item) =>
            item.StatusCustomer !== "OK" &&
            item.StatusCustomer !== "B" &&
            item.StatusCustomer !== "JOIN"
        )
        .map((item) => {
          return {
            ...item,
            Name: item.Name,
            Sex: item.Sex.label,
            DOB: item?.DOB ? FormatDateJson(changeDayvsMonth(item.DOB), 7) : "",
            Passport: item.Passport,
            Tel: item.Phone,
            StatusCustomer: item.StatusCustomer,
            Note: item.Note,
            ObjectId: 1,
            ObjectName: "Khách hàng",
            Checked: false,
          };
        });
      setCheck(!check);
      setDataTableError(data2);
    } catch (error) {
      ;
    }
  };

  const Trl_spBookingDetailDetail_Join = async (
    data,
    bookingIdNew,
    type = 0
  ) => {
    try {
      const pr = data.map((item) => {
        return {
          Creater: +CreateBy,
          CreateName: CreateName,
          BookingIdNew: bookingIdNew,
          BookingId: item.BookingId,
          CustomerId: item.CustomerId,
          BookingDetailId: item.BookingDetailId,
          StatusCustomer: "JOIN",
          Note: `Chuyển từ tour ${bookingHeadInfo.BookingCode} sang ${serviceSaleMerger.ServiceSaleCode}`,
        };
      });

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBookingDetailDetail_Join",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Cập nhật booking thành công");
        type !== 0 &&
          (await Trl_spBookingDetail_List(
            bookingHeadInfo.BookingId,
            bookingHeadInfo,
            bookingHeadInfo.Numberofseats
          ));
      }
    } catch (error) {
      ;
    }
  };
  const Trl_spBookingDetailDetail_Delete = async (data) => {
    try {
      const pr = {
        Creater: +CreateBy,
        CreateName: CreateName,
        BookingId: data.BookingId,
        BookingDetailId: data.BookingDetailId,
        CustomerId: data.CustomerId,
      };
      const params = {
        Json: JSON.stringify([pr]),
        func: "Trl_spBookingDetailDetail_Delete",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Cập nhật booking thành công");
        let dataTableN = dataTableError?.filter(
          (x) => x.CustomerId !== data.CustomerId
        );
        setDataTableError(dataTableN);
      }
    } catch (error) {
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau");
      ;
    }
  };

  const Trl_spBookingDetailDetail_Cancer = async (data, type = 0) => {
    // if (type === 1) {
    //   let join = data.some((item) => item.StatusCustomer === "JOIN");
    //   if (join) {
    //     Alertwarning("Không thuể hoàn hủy khách hàng đã ghép tour");
    //     return;
    //   }
    // }

    try {
      const pr = data.map((item) => {
        return {
          Creater: +CreateBy,
          CreateName: CreateName,
          BookingId: item.BookingId,
          BookingDetailId: item.BookingDetailId,
          CustomerId: item.CustomerId,
          StatusCustomer: type === 0 ? "CANCEL" : "OK",
          Note:
            type === 0
              ? "Hủy tour " + bookingHeadInfo.BookingCode
              : "Hoàn " + item.Note,
          Type: type,
        };
      });
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBookingDetailDetail_Cancer",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Cập nhật booking thành công");
        type !== 0 &&
          (await Trl_spBookingDetail_List(
            bookingHeadInfo.BookingId,
            bookingHeadInfo,
            bookingHeadInfo.Numberofseats
          ));
      }
    } catch (error) {
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau");
      ;
    }
  };

  const Trl_spBookingDetail_ChangeNote = async () => {
    try {
      const pr = dataTableError.map((item) => {
        return {
          Creater: +CreateBy,
          BookingDetailId: item.BookingDetailId,
          Note: item.Note,
        };
      });

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBookingDetail_ChangeNote",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Cập nhật booking thành công");
      }
    } catch (error) {
      ;
    }
  };
  //#endregion

  //#region  Table
  const updateMyData = (rowIndex, columnId, value) => {
    setSkipPageReset(true);
    setBookingDetails((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const updateMyDataError = (rowIndex, columnId, value) => {
    setSkipPageReset(true);
    setDataTableError((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const EditableCell = (
    {
      value: initialValue,
      row: { index },
      column: { id },
      updateMyData,
      // This is a custom function that we supplied to our table instance
    },
    readOnly = false,
    type = 0
  ) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
      setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      if (type === 0) {
        updateMyData(index, id, value);
      } else {
        updateMyDataError(index, id, value);
      }
    };

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="booking-input"
        readOnly={readOnly}
      />
    );
  };

  const EditableCellMoney = ({
    value: initialValue,
    row: { index },
    column: { id },
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
      setValue(FormatMoney(e.target.value, 1));
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        value={FormatMoney(value)}
        onChange={onChange}
        onBlur={onBlur}
        className="booking-input"
      />
    );
  };

  const EditableCellWithSelect = (
    {
      value: initialValue,
      row: { index },
      column: { id },
      updateMyData, // This is a custom function that we supplied to our table instance
    },
    data
  ) => {
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
      setValue(e);
      updateMyData(index, id, e);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <Select
        className={"select-custom2"}
        value={initialValue}
        onChange={onChange}
        options={data}
        style={{ zIndex: 300 }}
      />
    );
  };

  const EditableCellWithDate = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
  }) => {
    const [value, setValue] = useState(initialValue);
    const onChange = (e) => {
      setValue(e.target.value);
    };
    const onBlur = (e) => {
      if (id === "DOB") {
        // ngày sinh
        let DOB = moment(changeDayvsMonth(e.target.value));
        let TimeEnd = moment(FormatDateJson(bookingHeadInfo?.TimeStart, 4));
        let check = TimeEnd.diff(DOB, "days"); // =1
        if (check >= 0 && check <= 730) {
          updateMyData(index, "TourPrice", bookingHeadInfo?.Price3);
        } else if (check > 730 && check <= 4015) {
          updateMyData(index, "TourPrice", bookingHeadInfo?.Price2);
        } else if (check > 4015) {
          updateMyData(index, "TourPrice", bookingHeadInfo?.Price1);
        }
      }
      updateMyData(index, id, value);
    };

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <ReactInputMask
        mask="99/99/9999"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`booking-input`}
        alwaysShowMask={true}
      />
    );
  };

  const EditableCellWithCheckBox = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
      setValue(e.target.checked);
      updateMyData(index, id, e.target.checked);
      setCheck(!check);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return <input type="checkbox" checked={value} onChange={onChange} />;
  };

  const handleCustomerCancelTour = (e) => {
    let data = bookingDetails
      .filter((item) => item.Checked === true)
      .map((item) => {
        return {
          ...item,
          DOB: FormatDateJson(item.DOB, 3),
          Sex: item.Sex.label,
          StatusCustomer: "CANCEL",
          Note: "Hủy tour " + bookingHeadInfo.BookingCode,
          Checked: false,
        };
      });

    if (data.length === 0) {
      Alertwarning("Bạn chưa chọn khách hàng");
      return;
    }

    ConfirmAlert(
      "Bạn có chắc chắn muốn hủy tour cho khách hàng này không?",
      "",
      async () => {
        let newData = bookingDetails
          .filter((item) => !item.Checked)
          .map((item, index) => {
            return { ...item, No: index + 1 };
          });
        setBookingDetails(newData);
        setDataTableError([...dataTableError, ...data]);
        await Trl_spBookingDetailDetail_Cancer(data, 0);
      }
    );
  };

  const handleMergerTour = (type = 0) => {
    if (type === 0) {
      let data = bookingDetails.filter((item) => item.Checked === true);
      if (data.length === 0) {
        Alertwarning("Bạn chưa chọn khách hàng");
        return;
      }
      handleShow(8, type);
    }
    handleShow(8, type);
  };

  const handleConfirmMergerTour = (e) => {
    if (typeMerger === 0) {
      setOpacity("opacity-0");
      let BookingIdNew = serviceSaleMerger.BookingId;
      let data = bookingDetails
        .filter((item) => item.Checked === true)
        .map((item) => {
          return {
            ...item,
            DOB: FormatDateJson(item.DOB, 3),
            Sex: item.Sex.label,
            StatusCustomer: "JOIN",
            Note: `Chuyển từ tour ${bookingHeadInfo.BookingCode} sang ${serviceSaleMerger.ServiceSaleCode}`,
            Checked: false,
          };
        });

      ConfirmAlert(
        "Bạn có chắc chắn muốn ghép tour cho khách hàng này không?",
        "",
        async () => {
          let newData = bookingDetails
            .filter((item) => !item.Checked)
            .map((item, index) => {
              return { ...item, No: index + 1 };
            });
          setBookingDetails(newData);
          setDataTableError([...dataTableError, ...data]);
          handleClose(8);
          await Trl_spBookingDetailDetail_Join(data, BookingIdNew, 0);
          setOpacity("opacity-1");
        }
      );
    } else {
      setOpacity("opacity-0");
      let BookingIdNew = serviceSaleMerger.BookingId;
      ConfirmAlert(
        "Bạn có chắc chắn muốn ghép tour cho khách hàng này không?",
        "",
        async () => {
          let data = dataTableError.filter((item) => item.Checked);

          await Trl_spBookingDetailDetail_Join(data, BookingIdNew, 1);
          setOpacity("opacity-1");
        }
      );
    }
  };

  const handleChangeStatusIsSoldTour = (value) => {
    let data = bookingDetails
      .filter((item) => item.Checked === true)
      .map((item) => {
        return {
          ...item,
          DOB: FormatDateJson(item.DOB, 3),
          Sex: item.Sex.label,
        };
      });
    if (data.length === 0) {
      Alertwarning("Bạn chưa chọn khách hàng");
      return;
    }
    ConfirmAlert(
      "Bạn có chắc chắn muốn đổi trạng thái cho khách hàng không?",
      "",
      async () => {
        let newVal = bookingDetails.map((item) => {
          let sold = 0;
          if (item.Checked === true) {
            value === 1 ? (sold = 1) : (sold = 0);
            return { ...item, IsSold: sold, Checked: false };
          }
          return { ...item, Checked: false };
        });
        setBookingDetails(newVal);
      },
      "Tôi đồng ý"
    );
  };

  const handleGourpFamily = (
    value,
    title = "Bạn có chắc chắn muốn gộp khách hàng không?"
  ) => {
    let data = bookingDetails
      .filter((item) => item.Checked === true)
      .map((item) => {
        return {
          ...item,
          DOB: FormatDateJson(item.DOB, 3),
          Sex: item.Sex.label,
        };
      });
    if (data.length === 0) {
      Alertwarning("Bạn chưa chọn khách hàng");
      return;
    }
    if (data.length < 2) {
      Alertwarning("Nhóm khách hàng phải nhiều hơn 2");
      return;
    }
    let saleId = data[0].Sale_StaffId;
    let check = data.every((item) => item.Sale_StaffId === saleId);
    if (!check) {
      Alertwarning("Khách hàng không cùng Sales");
      return;
    }

    let owner = +CreateBy;
    let checkOwner = data.every((item) => item.Sale_StaffId === owner);
    if (!checkOwner) {
      if (+positionId > 8) {
        Alertwarning("Bạn không phải là Sales của khách hàng");
        return;
      }
    }

    ConfirmAlert(
      title,
      "",
      async () => {
        let rd = Math.floor(Math.random() * 100000);
        let newVal = bookingDetails.map((item) => {
          if (item.Checked === true) {
            let gr = value === 1 ? rd : 0;
            return { ...item, GroupFamily: gr, Checked: false };
          }
          return { ...item, Checked: false };
        });

        setBookingDetails(newVal);
      },
      "Tôi đồng ý"
    );
  };

  const columnsDetail = useMemo(
    () => [
      {
        Header: () => (
          <div>
            <DropdownButton
              className="fs-14 pl-0 z-30 "
              align="end"
              title=""
              id="dropdown-menu-align-end"
              variant="success"
            >
              <div class="row px-2 w-200px z-30">
                {(positionId < 9 &&
                  (DepartmentId === 29 || DepartmentId === 33)) ||
                DepartmentId === 42 ||
                DepartmentId === 36 ||
                CreateBy === 36 ||
                CreateBy === 59 ? (
                  <>
                    <div class="col-md-12 my-1">
                      <button
                        className="btn btn-danger btn-sm  mr-1 px-3 w-100"
                        onClick={() => handleCustomerCancelTour(bookingDetails)}
                      >
                        <i class="fas fa-user-slash pr-2"></i>
                        Hủy dịch vụ
                      </button>
                    </div>
                    <div class="col-md-12 my-1">
                      <button
                        className="btn bg-info btn-sm  mr-1 px-3 w-100"
                        onClick={() => handleMergerTour(0)}
                      >
                        <i class="fas fa-clone pr-2"></i>
                        Ghép tour
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}

                <div class="col-md-12 my-1">
                  <button
                    className="btn bg-warning btn-sm  mr-1 px-3 w-100"
                    onClick={() => handleChangeStatusIsSoldTour(1)}
                  >
                    <i class="fas fa-clone pr-2"></i>
                    Giữ chỗ
                  </button>
                </div>
                <div class="col-md-12 my-1">
                  <button
                    className="btn bg-success btn-sm  mr-1 px-3 w-100"
                    onClick={() => handleChangeStatusIsSoldTour(0)}
                  >
                    <i class="fas fa-clone pr-2"></i>
                    Đã bán
                  </button>
                </div>
                <div class="col-md-12 my-1">
                  <button
                    className="btn bg-sky btn-sm  mr-1 px-3 w-100 text-white"
                    onClick={() => handleGourpFamily(1)}
                  >
                    <i class="fas fa-clone pr-2"></i>
                    Nhóm khách
                  </button>
                </div>
                <div class="col-md-12 my-1">
                  <button
                    className="btn btn-outline-danger btn-sm  mr-1 px-3 w-100"
                    onClick={() =>
                      handleGourpFamily(
                        0,
                        "Bạn có chắc chắn muốn hủy gộp khách hàng không?"
                      )
                    }
                  >
                    <i class="fas fa-clone pr-2"></i>
                    Hủy nhóm khách
                  </button>
                </div>
              </div>
            </DropdownButton>
          </div>
        ),
        accessor: "Checked",
        textAlign: "center",
        disableResizing: true,
        width: 50,
        Cell: EditableCellWithCheckBox,
        sticky: "left",
      },
      {
        Header: "No",
        accessor: "No",
        textAlign: "center",
        disableResizing: true,
        width: 50,
        sticky: "left",
        EditableCell,
      },
      {
        Header: "Full Name",
        accessor: "Name",
        minWidth: 250,
        disableResizing: true,
        sticky: "left",
      },
      {
        Header: "Sex",
        accessor: "Sex",
        disableResizing: true,
        Cell: (obj) => EditableCellWithSelect(obj, typeValues),
        width: 110,
      },
      {
        Header: "DOB",
        accessor: "DOB",
        disableResizing: true,
        Cell: EditableCellWithDate,
        width: 110,
      },
      {
        Header: "Tel",
        accessor: "Tel",
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
          if (row.original.StatusVisaId === 1 && row.original?.CustomerId) {
            bg = "badge badge-light";
          } else if (
            row.original.StatusVisaId === 2 &&
            row.original?.CustomerId
          ) {
            bg = "badge badge-warning";
          } else if (
            row.original.StatusVisaId === 3 &&
            row.original?.CustomerId
          ) {
            bg = "badge badge-success";
          } else if (
            row.original.StatusVisaId === 4 &&
            row.original?.CustomerId
          ) {
            bg = "badge badge-danger";
          } else if (
            row.original.StatusVisaId === 5 &&
            row.original?.CustomerId
          ) {
            bg = "badge text-danger font-weight-bold";
          } else if (
            row.original.StatusVisaId === 6 &&
            row.original?.CustomerId
          ) {
            bg = "badge text-violet font-weight-bold";
          }
          return (
            <div
              onClick={() => {
                if (!row.original?.CustomerId) {
                  Alertwarning("Vui lòng thêm khách hàng vào tour");
                  return;
                }
                setRowVisa(row.original);
                setDataObject({
                  ...row.original,
                  ObjectId: 1,
                  ObjectName: "Khách hàng",
                });
                if (
                  DepartmentId === 32 ||
                  DepartmentId === 42 ||
                  DepartmentId === 29 ||
                  DepartmentId === 33
                ) {
                  handleShow(7);
                } else {
                  Alerterror("Bạn không có quyền chỉnh sửa chức năng này");
                }
              }}
              className={`w-100 cursor-pointer h-100 table-open__cell center-item ${bg} fs-12`}
            >
              {" "}
              {row.original?.CustomerId
                ? row.original?.VisaName
                  ? row.original.VisaName
                  : ""
                : ""}{" "}
            </div>
          );
        },
      },
      {
        Header: "Fingerprint Date",
        accessor: "FingerprintDate",
        disableResizing: true,
        width: 120,
        Cell: (obj) => EditableCell(obj, true),
      },
      {
        Header: "Passport No",
        accessor: "Passport",
        disableResizing: true,
        width: 110,
      },
      {
        Header: "DOI",
        accessor: "DOI",
        width: 110,
        disableResizing: true,
        Cell: EditableCellWithDate,
      },
      {
        Header: "DOE",
        accessor: "DOE",
        disableResizing: true,
        Cell: EditableCellWithDate,
        width: 110,
      },
      {
        Header: "Passport Status",
        accessor: "PassportStatus",
        disableResizing: true,
        width: 150,
      },
      {
        Header: "Room",
        accessor: "Room",
        disableResizing: true,
        width: 80,
      },
      {
        Header: "From",
        accessor: "From",
        disableResizing: true,
        width: 80,
      },
      {
        Header: "Register Date",
        accessor: "RegisterDate",
        width: 110,
        Cell: EditableCellWithDate,
      },
      {
        Header: "PlaneTicket",
        accessor: "PlaneTicketValue",
        disableResizing: true,
        Cell: (obj) => EditableCellWithSelect(obj, planeTicketValues),
        width: 95,
        Footer: (columnProps) => {
          return (
            <span className="bold center-item">
              {CreateBy === 15 ||
              CreateBy === 18 ||
              CreateBy === 40 ||
              CreateBy === 61 ||
              CreateBy === 24 ||
              CreateBy === 1
                ? "Tổng:"
                : ""}
            </span>
          );
        },
      },
      {
        Header: "Tour Price",
        accessor: "TourPrice",
        disableResizing: true,
        width: 110,
        Cell: ({ row }) => {
          return (
            <input
              className={`booking-input cursor-not-allowed`}
              value={FormatMoney(row.original.TourPrice || 0)}
              readOnly
            />
          );
        },
        // Cell: EditableCellMoney,
        Footer: (columnProps) => {
          return (
            <span className="bold center-item">
              {CreateBy === 15 ||
              CreateBy === 18 ||
              CreateBy === 24 ||
              CreateBy === 40 ||
              CreateBy === 61 ||
              CreateBy === 1
                ? FormatMoney(dataSumBookingDetails.TourPrice, 0)
                : ""}
            </span>
          );
        },
      },
      {
        Header: "Discount",
        accessor: "Endow",
        disableResizing: true,
        width: 110,
        Cell: ({ row }) => {
          return (
            <TooltipCustom content={row.original?.DiscountDescription || ""}>
              <input
                onClick={() => {
                  handleDiscountSurcharge({
                    ...row.original,
                    key: "Discount",
                    rowIndex: row.index,
                  });
                }}
                className={` w-100 cursor-pointer h-100 table-open__cell center-item booking-input`}
                value={FormatMoney(row?.original?.Discount || 0)}
                readOnly
              />
            </TooltipCustom>
          );
        },
        Footer: (columnProps) => {
          return (
            <span className="bold center-item">
              {CreateBy === 15 ||
              CreateBy === 18 ||
              CreateBy === 40 ||
              CreateBy === 61 ||
              CreateBy === 24 ||
              CreateBy === 1
                ? FormatMoney(dataSumBookingDetails.Discount, 0)
                : ""}
            </span>
          );
        },
      },

      {
        Header: "Total Price",
        accessor: "TotalPrice",
        disableResizing: true,
        width: 110,
        Cell: ({ row }) => {
          let value =
            (row.original.TourPrice || 0) -
            (row.original.Discount || 0) +
            (row.original.Surcharge || 0);
          return (
            <input
              className={`booking-input cursor-not-allowed`}
              value={FormatMoney(value || 0)}
              readOnly
            />
          );
        },
        Footer: (columnProps) => {
          return (
            <span className="bold center-item">
              {CreateBy === 15 ||
              CreateBy === 18 ||
              CreateBy === 24 ||
              CreateBy === 40 ||
              CreateBy === 61 ||
              CreateBy === 1
                ? FormatMoney(dataSumBookingDetails.TotalPrice, 0)
                : ""}
            </span>
          );
        },
      },
      {
        Header: "Payment 1",
        accessor: "Payment1",
        disableResizing: true,
        width: 110,
        Cell: ({ row }) => {
          let bg;
          if (
            row.original.StatusId1 === 2 ||
            row.original.StatusId1 === 9 ||
            row.original.StatusId1 === 11
          ) {
            bg = "badge badge-warning";
          }
          if (
            row.original.StatusId1 === 4 ||
            row.original.StatusId1 === 8 ||
            row.original.StatusId1 === 14
          ) {
            bg = "badge badge-warning";
          }
          if (
            row.original.StatusId1 === 5 ||
            row.original.StatusId1 === 6 ||
            row.original.StatusId1 === 3 ||
            row.original.StatusId1 === 12 ||
            row.original.StatusId1 === 10
          ) {
            bg = "badge badge-danger";
          }
          if (row.original.StatusId1 === 1) {
            bg = "badge bg-orange";
          }

          if (row.original.IsConfirm1) {
            bg = "badge bg-success";
          }
          return (
            <TooltipCustom content={row.original.NotePayment1 || ""}>
              <input
                onClick={() => {
                  if (!row.original?.CustomerId) {
                    Alertwarning(
                      "Vui lòng thêm khách hàng vào tour, trước khi nhập thanh toán"
                    );
                    return;
                  }
                  handleClickInvoice({ ...row.original, TypePm: "V1" });
                }}
                className={` w-100 cursor-pointer h-100 table-open__cell center-item ${bg} booking-input`}
                value={FormatMoney(row.original.Payment1)}
                readOnly
              />
            </TooltipCustom>
          );
        },
        Footer: (columnProps) => {
          return (
            <span className="bold center-item">
              {CreateBy === 15 ||
              CreateBy === 18 ||
              CreateBy === 40 ||
              CreateBy === 61 ||
              CreateBy === 24 ||
              CreateBy === 1
                ? FormatMoney(dataSumBookingDetails.Payment1, 0)
                : ""}
            </span>
          );
        },
      },
      {
        Header: "Payment 2",
        accessor: "Payment2",
        disableResizing: true,
        width: 110,
        Cell: ({ row }) => {
          let bg;
          if (
            row.original.StatusId2 === 2 ||
            row.original.StatusId2 === 9 ||
            row.original.StatusId2 === 11
          ) {
            bg = "badge badge-warning";
          }
          if (
            row.original.StatusId2 === 4 ||
            row.original.StatusId2 === 8 ||
            row.original.StatusId2 === 14
          ) {
            bg = "badge badge-warning";
          }
          if (
            row.original.StatusId2 === 5 ||
            row.original.StatusId2 === 6 ||
            row.original.StatusId2 === 3 ||
            row.original.StatusId2 === 12 ||
            row.original.StatusId2 === 10
          ) {
            bg = "badge badge-danger";
          }
          if (row.original.StatusId2 === 1) {
            bg = "badge bg-orange";
          }
          if (row.original.IsConfirm2) {
            bg = "badge bg-success";
          }
          return (
            <TooltipCustom content={row.original.NotePayment2 || ""}>
              <input
                onClick={() => {
                  if (!row.original?.CustomerId) {
                    Alertwarning(
                      "Vui lòng thêm khách hàng vào tour, trước khi nhập thanh toán"
                    );
                    return;
                  }
                  handleClickInvoice({ ...row.original, TypePm: "V2" });
                }}
                className={` w-100 cursor-pointer h-100 table-open__cell center-item ${bg} booking-input`}
                value={FormatMoney(row.original.Payment2)}
                readOnly
              />
            </TooltipCustom>
          );
        },
        Footer: (columnProps) => {
          return (
            <span className="bold center-item">
              {CreateBy === 15 ||
              CreateBy === 18 ||
              CreateBy === 40 ||
              CreateBy === 61 ||
              CreateBy === 24 ||
              CreateBy === 1
                ? FormatMoney(dataSumBookingDetails.Payment2, 0)
                : ""}
            </span>
          );
        },
      },
      {
        Header: "Payment 3",
        accessor: "Payment3",
        disableResizing: true,
        width: 110,
        Cell: ({ row }) => {
          let bg;
          if (
            row.original.StatusId3 === 2 ||
            row.original.StatusId3 === 9 ||
            row.original.StatusId3 === 11
          ) {
            bg = "badge badge-warning";
          }
          if (
            row.original.StatusId3 === 4 ||
            row.original.StatusId3 === 8 ||
            row.original.StatusId3 === 14
          ) {
            bg = "badge badge-warning";
          }
          if (
            row.original.StatusId3 === 5 ||
            row.original.StatusId3 === 6 ||
            row.original.StatusId3 === 3 ||
            row.original.StatusId3 === 12 ||
            row.original.StatusId3 === 10
          ) {
            bg = "badge badge-danger";
          }
          if (row.original.StatusId3 === 1) {
            bg = "badge bg-orange";
          }
          if (row.original.IsConfirm3) {
            bg = "badge bg-success";
          }
          return (
            <TooltipCustom content={row.original.NotePayment3 || ""}>
              <input
                onClick={() => {
                  if (!row.original?.CustomerId) {
                    Alertwarning(
                      "Vui lòng thêm khách hàng vào tour, trước khi nhập thanh toán"
                    );
                    return;
                  }
                  handleClickInvoice({ ...row.original, TypePm: "V3" });
                }}
                className={` w-100 cursor-pointer h-100 table-open__cell center-item ${bg} booking-input`}
                value={FormatMoney(row.original.Payment3)}
                readOnly
              />
            </TooltipCustom>
          );
        },
        Footer: (columnProps) => {
          return (
            <span className="bold center-item">
              {CreateBy === 15 ||
              CreateBy === 18 ||
              CreateBy === 40 ||
              CreateBy === 61 ||
              CreateBy === 24 ||
              CreateBy === 1
                ? FormatMoney(dataSumBookingDetails.Payment3, 0)
                : ""}
            </span>
          );
        },
      },

      {
        Header: "Payment 4",
        accessor: "Payment4",
        disableResizing: true,
        width: 110,
        Cell: ({ row }) => {
          let bg;
          if (
            row.original.StatusId4 === 2 ||
            row.original.StatusId4 === 9 ||
            row.original.StatusId4 === 11
          ) {
            bg = "badge badge-warning";
          }
          if (
            row.original.StatusId4 === 4 ||
            row.original.StatusId4 === 8 ||
            row.original.StatusId4 === 14
          ) {
            bg = "badge badge-warning";
          }
          if (
            row.original.StatusId4 === 5 ||
            row.original.StatusId4 === 6 ||
            row.original.StatusId4 === 3 ||
            row.original.StatusId4 === 12 ||
            row.original.StatusId4 === 10
          ) {
            bg = "badge badge-danger";
          }
          if (row.original.StatusId4 === 1) {
            bg = "badge bg-orange";
          }
          if (row.original.IsConfirm4) {
            bg = "badge bg-success";
          }
          return (
            <TooltipCustom content={row.original.NotePayment4 || ""}>
              <input
                onClick={() => {
                  if (!row.original?.CustomerId) {
                    Alertwarning(
                      "Vui lòng thêm khách hàng vào tour, trước khi nhập thanh toán"
                    );
                    return;
                  }
                  handleClickInvoice({ ...row.original, TypePm: "V4" });
                }}
                className={` w-100 cursor-pointer h-100 table-open__cell center-item ${bg} booking-input`}
                value={FormatMoney(row.original.Payment4)}
                readOnly
              />
            </TooltipCustom>
          );
        },
        Footer: (columnProps) => {
          return (
            <span className="bold center-item">
              {CreateBy === 15 ||
              CreateBy === 18 ||
              CreateBy === 40 ||
              CreateBy === 61 ||
              CreateBy === 24 ||
              CreateBy === 1
                ? FormatMoney(dataSumBookingDetails.Payment4, 0)
                : ""}
            </span>
          );
        },
      },

      {
        Header: "Payment 5",
        accessor: "Payment5",
        disableResizing: true,
        width: 110,
        Cell: ({ row }) => {
          let bg;
          if (
            row.original.StatusId5 === 2 ||
            row.original.StatusId5 === 9 ||
            row.original.StatusId5 === 11
          ) {
            bg = "badge badge-warning";
          }
          if (
            row.original.StatusId5 === 4 ||
            row.original.StatusId5 === 8 ||
            row.original.StatusId5 === 14
          ) {
            bg = "badge badge-warning";
          }
          if (
            row.original.StatusId5 === 5 ||
            row.original.StatusId5 === 6 ||
            row.original.StatusId5 === 3 ||
            row.original.StatusId5 === 12 ||
            row.original.StatusId5 === 10
          ) {
            bg = "badge badge-danger";
          }
          if (row.original.StatusId5 === 1) {
            bg = "badge bg-orange";
          }
          if (row.original.IsConfirm5) {
            bg = "badge bg-success";
          }
          return (
            <TooltipCustom content={row.original.NotePayment5 || ""}>
              <input
                onClick={() => {
                  if (!row.original?.CustomerId) {
                    Alertwarning(
                      "Vui lòng thêm khách hàng vào tour, trước khi nhập thanh toán"
                    );
                    return;
                  }
                  handleClickInvoice({ ...row.original, TypePm: "V5" });
                }}
                className={` w-100 cursor-pointer h-100 table-open__cell center-item ${bg} booking-input`}
                value={FormatMoney(row.original.Payment5)}
                readOnly
              />
            </TooltipCustom>
          );
        },
        Footer: (columnProps) => {
          return (
            <span className="bold center-item">
              {CreateBy === 15 ||
              CreateBy === 18 ||
              CreateBy === 40 ||
              CreateBy === 61 ||
              CreateBy === 24 ||
              CreateBy === 1
                ? FormatMoney(dataSumBookingDetails.Payment5, 0)
                : ""}
            </span>
          );
        },
      },

      {
        Header: "Payment 6",
        accessor: "Payment6",
        disableResizing: true,
        width: 110,
        Cell: ({ row }) => {
          let bg;
          if (
            row.original.StatusId6 === 2 ||
            row.original.StatusId6 === 9 ||
            row.original.StatusId6 === 11
          ) {
            bg = "badge badge-warning";
          }
          if (
            row.original.StatusId6 === 4 ||
            row.original.StatusId6 === 8 ||
            row.original.StatusId6 === 14
          ) {
            bg = "badge badge-warning";
          }
          if (
            row.original.StatusId6 === 5 ||
            row.original.StatusId6 === 6 ||
            row.original.StatusId6 === 3 ||
            row.original.StatusId6 === 12 ||
            row.original.StatusId6 === 10
          ) {
            bg = "badge badge-danger";
          }
          if (row.original.StatusId6 === 1) {
            bg = "badge bg-orange";
          }
          if (row.original.IsConfirm6) {
            bg = "badge bg-success";
          }
          return (
            <TooltipCustom content={row.original.NotePayment6 || ""}>
              <input
                onClick={() => {
                  if (!row.original?.CustomerId) {
                    Alertwarning(
                      "Vui lòng thêm khách hàng vào tour, trước khi nhập thanh toán"
                    );
                    return;
                  }
                  handleClickInvoice({ ...row.original, TypePm: "V6" });
                }}
                className={` w-100 cursor-pointer h-100 table-open__cell center-item ${bg} booking-input`}
                value={FormatMoney(row.original.Payment6)}
                readOnly
              />
            </TooltipCustom>
          );
        },
        Footer: (columnProps) => {
          return (
            <span className="bold center-item">
              {CreateBy === 15 ||
              CreateBy === 18 ||
              CreateBy === 40 ||
              CreateBy === 61 ||
              CreateBy === 24 ||
              CreateBy === 1
                ? FormatMoney(dataSumBookingDetails.Payment6, 0)
                : ""}
            </span>
          );
        },
      },
      {
        Header: "Remain",
        accessor: "Remain",
        disableResizing: true,
        width: 110,
        Cell: ({ row }) => {
          let value =
            row.original.TourPrice +
            (row.original?.Surcharge || 0) -
            (row.original?.Discount || 0) -
            (row.original.Payment1 +
              row.original.Payment2 +
              row.original.Payment3 +
              row.original.Payment4 +
              row.original.Payment5 +
              row.original.Payment6);
          return (
            <input
              className={`booking-input cursor-not-allowed`}
              value={FormatMoney(value || 0)}
              readOnly
            />
          );
        },
        Footer: (columnProps) => {
          return (
            <span className="center-item text-danger font-weight-bold">
              {CreateBy === 15 ||
              CreateBy === 18 ||
              CreateBy === 40 ||
              CreateBy === 61 ||
              CreateBy === 24 ||
              CreateBy === 1
                ? FormatMoney(dataSumBookingDetails.Remain, 0)
                : ""}
            </span>
          );
        },
      },
      {
        Header: "Surcharge",
        accessor: "Surcharge",
        disableResizing: true,
        width: 110,
        Cell: ({ row }) => {
          return (
            <TooltipCustom content={row.original.SurchargeDescription || ""}>
              <input
                onClick={() => {
                  handleDiscountSurcharge({
                    ...row.original,
                    key: "SurchargeDescription",
                    rowIndex: row.index,
                  });
                }}
                className={` w-100 cursor-pointer h-100 table-open__cell center-item booking-input`}
                value={FormatMoney(row?.original?.Surcharge || 0)}
                readOnly
              />
            </TooltipCustom>
          );
        },
        Footer: (columnProps) => {
          return (
            <span className="bold center-item">
              {CreateBy === 15 ||
              CreateBy === 18 ||
              CreateBy === 24 ||
              CreateBy === 40 ||
              CreateBy === 61 ||
              CreateBy === 1
                ? FormatMoney(dataSumBookingDetails.Surcharge, 0)
                : ""}
            </span>
          );
        },
      },
      {
        Header: "Vali/Balo",
        accessor: "Bag",
        disableResizing: true,
        width: 75,
      },
      {
        Header: "Sale",
        accessor: "Sale",
        disableResizing: true,
        Cell: ({ row }) => {
          return (
            <div className="center-item mt-2 ">
              {row.original?.CustomerId && (
                <>
                  <span className="small text-muted font-weight-bold ml-2">
                    {row.original.StaffName}
                  </span>
                </>
              )}
            </div>
          );
        },
        width: 180,
      },
      {
        Header: "Agency",
        accessor: "Agency",
        disableResizing: true,
        width: 80,
      },
      {
        Header: "Note",
        accessor: "Note",
        disableResizing: true,
        minWidth: 500,
      },
      {
        Header: "Refund",
        accessor: "Refund",
        disableResizing: true,
        width: 110,
        Cell: ({ row }) => {
          return (
            <TooltipCustom content={""}>
              <input
                onClick={() => {
                  if (!row.original?.CustomerId) {
                    Alertwarning(
                      "Vui lòng thêm khách hàng vào tour, trước khi nhập thanh toán"
                    );
                    return;
                  }
                  setDataObject({
                    ...row.original,
                    ObjectId: 1,
                    ObjectName: "Khách hàng",
                  });
                  handleShow(14);
                  setInvoiceStyle({
                    StyleId: 6,
                    StyleName: "Thu ",
                    TypeInvoice: 5, // Visa
                  });
                }}
                className={` w-100 cursor-pointer h-100 table-open__cell center-item booking-input`}
                value={FormatMoney(row.original?.PaymentRefund || 0)}
                readOnly
              />
            </TooltipCustom>
          );
        },
      },
    ],
    [check]
  );

  const SumError = (key) => {
    if (key === "TotalPrice") {
      let sumB = dataTableError
        .filter((x) => x.StatusCustomer !== "JOIN")
        .reduce((accumulator, currentValue) => {
          return (
            accumulator +
            +(currentValue?.PriceTour || 0) -
            +(currentValue?.PriceTour_Discount || 0) +
            (+currentValue?.PriceTour_Surcharge || 0)
          );
        }, 0);
      return sumB;
    }
    let sumB = dataTableError
      .filter((x) => x.StatusCustomer !== "JOIN")
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue[key];
      }, 0);
    return sumB;
  };

  const columsError = [
    {
      Header: "No",
      Cell: (row) => <span>{row.index + 1}</span>,
      textAlign: "center",
      width: 50,
    },
    {
      Header: "",
      textAlign: "center",
      accessor: "Checked",
      width: 50,
      Cell: (row) => {
        return (
          <div>
            {dataTableError[row.row.index].StatusCustomer !== "JOIN" ? (
              <input
                type="checkbox"
                defaultChecked={row.value}
                onChange={(event) =>
                  updateMyDataError(
                    parseInt(row.row.id),
                    row.column.id,
                    event.target.checked
                  )
                }
              />
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      Header: "Del",
      accessor: "Options",
      textAlign: "center",
      width: 50,
      Cell: ({ row }) => {
        let arr = [1, 15, 18, 24];
        if (arr.includes(CreateBy)) {
          return (
            <div className=" text-secondary my-auto h-100">
              <i
                className="fas fa-trash pointer cursor-pointer"
                onClick={() => {
                  ConfirmAlert(
                    "Bạn có chắc chắn muốn xóa khách hàng này không?",
                    "",
                    async () => {
                      await Trl_spBookingDetailDetail_Delete(row.original);
                    }
                  );
                }}
              ></i>
            </div>
          );
        }
        return <></>;
      },
    },
    {
      Header: "Full Name",
      accessor: "Name",
      minWidth: 300,
      textAlign: "center",
      Cell: (obj) => (
        <div className="mt-2 text-dark">
          <span>{obj.value}</span>
        </div>
      ),
    },
    {
      Header: "Sex",
      accessor: "Sex",
      minWidth: 150,
      Cell: (obj) => (
        <div className="mt-2 text-dark">
          <span>{obj.value}</span>
        </div>
      ),
    },
    {
      Header: "DOB",
      accessor: "DOB",
      minWidth: 200,
      textAlign: "center",
      Cell: (obj) => (
        <div className="mt-2 text-dark">
          <span>{obj.value}</span>
        </div>
      ),
    },
    {
      Header: "Passport No",
      accessor: "Passport",
      disableResizing: true,
      minWidth: 150,
      maxWidth: 500,
      Cell: (obj) => (
        <div className="mt-2 text-dark">
          <span>{obj.value}</span>
        </div>
      ),
    },
    {
      Header: "Tel",
      accessor: "Tel",
      disableResizing: true,
      minWidth: 150,
      maxWidth: 500,
      Cell: (obj) => (
        <div className="mt-2 text-dark">
          <span>{obj.value}</span>
        </div>
      ),
    },
    {
      Header: "Payment 1",
      accessor: "Payment1",
      disableResizing: true,
      width: 110,
      Cell: ({ row }) => {
        let bg;
        if (
          row.original.StatusId1 === 2 ||
          row.original.StatusId1 === 9 ||
          row.original.StatusId1 === 11
        ) {
          bg = "badge badge-warning";
        }
        if (
          row.original.StatusId1 === 4 ||
          row.original.StatusId1 === 8 ||
          row.original.StatusId1 === 14
        ) {
          bg = "badge badge-warning";
        }
        if (
          row.original.StatusId1 === 5 ||
          row.original.StatusId1 === 6 ||
          row.original.StatusId1 === 3 ||
          row.original.StatusId1 === 12 ||
          row.original.StatusId1 === 10
        ) {
          bg = "badge badge-danger";
        }
        if (row.original.StatusId1 === 1) {
          bg = "badge bg-orange";
        }
        return (
          <TooltipCustom content={row.original.NotePayment1 || ""}>
            <input
              onClick={() => {
                if (!row.original?.Payment1 || row.original?.Payment1 === 0) {
                  Alertwarning(
                    "Chưa có phiếu thu nào được tạo, vui lòng kiểm tra lại"
                  );
                  return;
                }
                handleClickInvoice({ ...row.original, TypePm: "V1" });
              }}
              className={` w-100 cursor-pointer h-100 table-open__cell center-item ${bg} booking-input`}
              value={FormatMoney(row.original.Payment1)}
              readOnly
            />
          </TooltipCustom>
        );
      },
      Footer: (columnProps) => {
        return (
          <span className="bold center-item">
            {CreateBy === 15 ||
            CreateBy === 18 ||
            CreateBy === 24 ||
            CreateBy === 40 ||
            CreateBy === 61 ||
            CreateBy === 1
              ? FormatMoney(SumError("Payment1"), 0)
              : ""}
          </span>
        );
      },
    },
    {
      Header: "Payment 2",
      accessor: "Payment2",
      disableResizing: true,
      width: 110,
      Cell: ({ row }) => {
        let bg;
        if (
          row.original.StatusId2 === 2 ||
          row.original.StatusId2 === 9 ||
          row.original.StatusId2 === 11
        ) {
          bg = "badge badge-warning";
        }
        if (
          row.original.StatusId2 === 4 ||
          row.original.StatusId2 === 8 ||
          row.original.StatusId2 === 14
        ) {
          bg = "badge badge-warning";
        }
        if (
          row.original.StatusId2 === 5 ||
          row.original.StatusId2 === 6 ||
          row.original.StatusId2 === 3 ||
          row.original.StatusId2 === 12 ||
          row.original.StatusId2 === 10
        ) {
          bg = "badge badge-danger";
        }
        if (row.original.StatusId2 === 1) {
          bg = "badge bg-orange";
        }
        return (
          <TooltipCustom content={row.original.NotePayment2 || ""}>
            <input
              onClick={() => {
                if (!row.original?.Payment2 || row.original?.Payment2 === 0) {
                  Alertwarning(
                    "Chưa có phiếu thu nào được tạo, vui lòng kiểm tra lại"
                  );
                  return;
                }
                handleClickInvoice({ ...row.original, TypePm: "V2" });
              }}
              className={` w-100 cursor-pointer h-100 table-open__cell center-item ${bg} booking-input`}
              value={FormatMoney(row.original.Payment2)}
              readOnly
            />
          </TooltipCustom>
        );
      },
      Footer: (columnProps) => {
        return (
          <span className="bold center-item">
            {CreateBy === 15 ||
            CreateBy === 18 ||
            CreateBy === 24 ||
            CreateBy === 40 ||
            CreateBy === 61 ||
            CreateBy === 1
              ? FormatMoney(SumError("Payment2"), 0)
              : ""}
          </span>
        );
      },
    },
    {
      Header: "Payment 3",
      accessor: "Payment3",
      disableResizing: true,
      width: 110,
      Cell: ({ row }) => {
        let bg;
        if (
          row.original.StatusId3 === 2 ||
          row.original.StatusId3 === 9 ||
          row.original.StatusId3 === 11
        ) {
          bg = "badge badge-warning";
        }
        if (
          row.original.StatusId3 === 4 ||
          row.original.StatusId3 === 8 ||
          row.original.StatusId3 === 14
        ) {
          bg = "badge badge-warning";
        }
        if (
          row.original.StatusId3 === 5 ||
          row.original.StatusId3 === 6 ||
          row.original.StatusId3 === 3 ||
          row.original.StatusId3 === 12 ||
          row.original.StatusId3 === 10
        ) {
          bg = "badge badge-danger";
        }
        if (row.original.StatusId3 === 1) {
          bg = "badge bg-orange";
        }
        return (
          <TooltipCustom content={row.original.NotePayment3 || ""}>
            <input
              onClick={() => {
                if (!row.original?.Payment3 || row.original?.Payment3 === 0) {
                  Alertwarning(
                    "Chưa có phiếu thu nào được tạo, vui lòng kiểm tra lại"
                  );
                  return;
                }
                handleClickInvoice({ ...row.original, TypePm: "V3" });
              }}
              className={` w-100 cursor-pointer h-100 table-open__cell center-item ${bg} booking-input`}
              value={FormatMoney(row.original.Payment3)}
              readOnly
            />
          </TooltipCustom>
        );
      },
      Footer: (columnProps) => {
        return (
          <span className="bold center-item">
            {CreateBy === 15 ||
            CreateBy === 18 ||
            CreateBy === 24 ||
            CreateBy === 40 ||
            CreateBy === 61 ||
            CreateBy === 1
              ? FormatMoney(SumError("Payment3"), 0)
              : ""}
          </span>
        );
      },
    },
    {
      Header: "Payment 4",
      accessor: "Payment4",
      disableResizing: true,
      width: 110,
      Cell: ({ row }) => {
        let bg;
        if (
          row.original.StatusId4 === 2 ||
          row.original.StatusId4 === 9 ||
          row.original.StatusId4 === 11
        ) {
          bg = "badge badge-warning";
        }
        if (
          row.original.StatusId4 === 4 ||
          row.original.StatusId4 === 8 ||
          row.original.StatusId4 === 14
        ) {
          bg = "badge badge-warning";
        }
        if (
          row.original.StatusId4 === 5 ||
          row.original.StatusId4 === 6 ||
          row.original.StatusId4 === 3 ||
          row.original.StatusId4 === 12 ||
          row.original.StatusId4 === 10
        ) {
          bg = "badge badge-danger";
        }
        if (row.original.StatusId4 === 1) {
          bg = "badge bg-orange";
        }
        return (
          <TooltipCustom content={row.original.NotePayment4 || ""}>
            <input
              onClick={() => {
                if (!row.original?.Payment4 || row.original?.Payment4 === 0) {
                  Alertwarning(
                    "Chưa có phiếu thu nào được tạo, vui lòng kiểm tra lại"
                  );
                  return;
                }
                handleClickInvoice({ ...row.original, TypePm: "V4" });
              }}
              className={` w-100 cursor-pointer h-100 table-open__cell center-item ${bg} booking-input`}
              value={FormatMoney(row.original.Payment4)}
              readOnly
            />
          </TooltipCustom>
        );
      },
      Footer: (columnProps) => {
        return (
          <span className="bold center-item">
            {CreateBy === 15 ||
            CreateBy === 18 ||
            CreateBy === 24 ||
            CreateBy === 40 ||
            CreateBy === 61 ||
            CreateBy === 1
              ? FormatMoney(SumError("Payment4"), 0)
              : ""}
          </span>
        );
      },
    },
    {
      Header: "Payment 5",
      accessor: "Payment5",
      disableResizing: true,
      width: 110,
      Cell: ({ row }) => {
        let bg;
        if (
          row.original.StatusId5 === 2 ||
          row.original.StatusId5 === 9 ||
          row.original.StatusId5 === 11
        ) {
          bg = "badge badge-warning";
        }
        if (
          row.original.StatusId5 === 4 ||
          row.original.StatusId5 === 8 ||
          row.original.StatusId5 === 14
        ) {
          bg = "badge badge-warning";
        }
        if (
          row.original.StatusId5 === 5 ||
          row.original.StatusId5 === 6 ||
          row.original.StatusId5 === 3 ||
          row.original.StatusId5 === 12 ||
          row.original.StatusId5 === 10
        ) {
          bg = "badge badge-danger";
        }
        if (row.original.StatusId5 === 1) {
          bg = "badge bg-orange";
        }
        return (
          <TooltipCustom content={row.original.NotePayment5 || ""}>
            <input
              onClick={() => {
                if (!row.original?.Payment5 || row.original?.Payment5 === 0) {
                  Alertwarning(
                    "Chưa có phiếu thu nào được tạo, vui lòng kiểm tra lại"
                  );
                  return;
                }
                handleClickInvoice({ ...row.original, TypePm: "V5" });
              }}
              className={` w-100 cursor-pointer h-100 table-open__cell center-item ${bg} booking-input`}
              value={FormatMoney(row.original.Payment5)}
              readOnly
            />
          </TooltipCustom>
        );
      },
      Footer: (columnProps) => {
        return (
          <span className="bold center-item">
            {CreateBy === 15 ||
            CreateBy === 18 ||
            CreateBy === 24 ||
            CreateBy === 40 ||
            CreateBy === 61 ||
            CreateBy === 1
              ? FormatMoney(SumError("Payment5"), 0)
              : ""}
          </span>
        );
      },
    },

    {
      Header: "Total Price",
      accessor: "TotalPrice",
      disableResizing: true,
      width: 110,
      Cell: ({ row }) => {
        let value =
          (row.original.TourPrice || 0) -
          (row.original.Discount || 0) +
          (row.original.Surcharge || 0);
        return (
          <input
            className={`booking-input cursor-not-allowed`}
            value={FormatMoney(value || 0)}
            readOnly
          />
        );
      },
      Footer: (columnProps) => {
        return (
          <span className="bold center-item">
            {CreateBy === 15 ||
            CreateBy === 18 ||
            CreateBy === 24 ||
            CreateBy === 40 ||
            CreateBy === 61 ||
            CreateBy === 1
              ? FormatMoney(SumError("TotalPrice"), 0)
              : ""}
          </span>
        );
      },
    },
    {
      Header: "Surcharge",
      accessor: "Surcharge",
      disableResizing: true,
      width: 110,
      Cell: ({ row }) => {
        return (
          <TooltipCustom content={row.original.SurchargeDescription || ""}>
            <input
              className={` w-100 cursor-pointer h-100 table-open__cell center-item booking-input`}
              value={FormatMoney(row?.original?.Surcharge || 0)}
              readOnly
            />
          </TooltipCustom>
        );
      },
      Footer: (columnProps) => {
        return (
          <span className="bold center-item">
            {CreateBy === 15 ||
            CreateBy === 18 ||
            CreateBy === 24 ||
            CreateBy === 40 ||
            CreateBy === 61 ||
            CreateBy === 1
              ? FormatMoney(SumError("Surcharge"), 0)
              : ""}
          </span>
        );
      },
    },
    {
      Header: "Refund",
      accessor: "Refund",
      disableResizing: true,
      width: 110,
      Cell: ({ row }) => {
        return (
          <TooltipCustom content={""}>
            <input
              onClick={() => {
                if (!row.original?.CustomerId) {
                  Alertwarning(
                    "Vui lòng thêm khách hàng vào tour, trước khi nhập thanh toán"
                  );
                  return;
                }
                setDataObject({
                  ...row.original,
                  ObjectId: 1,
                  ObjectName: "Khách hàng",
                });
                handleShow(14);
                setInvoiceStyle({
                  StyleId: 6,
                  StyleName: "Thu ",
                  TypeInvoice: 5, // Visa
                });
              }}
              className={` w-100 cursor-pointer h-100 table-open__cell center-item booking-input`}
              value={FormatMoney(row.original?.PaymentRefund || 0)}
              readOnly
            />
          </TooltipCustom>
        );
      },
      Footer: (columnProps) => {
        return (
          <span className="bold center-item">
            {CreateBy === 15 ||
            CreateBy === 18 ||
            CreateBy === 24 ||
            CreateBy === 40 ||
            CreateBy === 61 ||
            CreateBy === 1
              ? FormatMoney(SumError("PaymentRefund"), 0)
              : ""}
          </span>
        );
      },
    },
    {
      Header: "Note",
      accessor: "Note",
      minWidth: 200,
      width: 800,
      maxWidth: 1000,
      textAlign: "center",
      Cell: (obj) => EditableCell(obj, false, 1),
    },
  ];

  const [DiscountSurcharge, setDiscountSurcharge] = useState();
  const [ShowDiscountSurcharge, setShowDiscountSurcharge] = useState(false);
  const [ShowDiscountSurcharge1, setShowDiscountSurcharge1] = useState(false);
  const handleDiscountSurcharge = (data) => {
    setDiscountSurcharge(data);
    handleShow(data?.key === "Discount" ? 11 : 12);
  };

  const handleClickDiscountSurcharge = (cl1, cl2) => {
    setBookingDetails((old) =>
      old.map((row, index) => {
        if (index === DiscountSurcharge?.rowIndex) {
          return {
            ...old[DiscountSurcharge?.rowIndex],
            [cl1]:
              cl1 === "Discount"
                ? DiscountSurcharge?.Discount
                : DiscountSurcharge?.Surcharge,
            [cl2]:
              cl1 === "Discount"
                ? DiscountSurcharge?.DiscountDescription
                : DiscountSurcharge?.SurchargeDescription,
          };
        }
        return row;
      })
    );
    DiscountSurcharge?.key === "Discount"
      ? setShowDiscountSurcharge(false)
      : setShowDiscountSurcharge1(false);
  };

  const [DataObject, setDataObject] = useState({
    Notes: "",
    dataDetail: [],
  });
  const handleClickInvoice = (row) => {
    setDataObject({ ...row, ObjectId: 1, ObjectName: "Khách hàng" });
    handleShow(5);
  };

  //#endregion

  const [DataBookingPrint, setDataBookingPrint] = useState({});
  const Trl_spBooking_Print = () => {
    ConfirmAlert(
      "Xác nhận in",
      "Bạn có chắc muốn in Booking này?",
      async () => {
        let databooking = {
          ...bookingHeadInfo,
          dataDetail: [...bookingDetails],
        };
        await setDataBookingPrint(databooking);
      },
      "Xác nhận"
    );
  };

  const onExportExcel = async () => {
    let details = [];
    bookingDetails
      ?.filter((p) => p.StatusCustomer === "OK" || p.StatusCustomer === "JOIN")
      .forEach((item, index) => {
        details.push({
          NO: index + 1,
          FULLNAME: item?.Name || "",
          SEX: item?.Sex.label || "",
          DOB: item?.DOB || "",
          PASSPORT_NO: item.Passport,
          DOI: item?.DOI || "",
          DOE: item?.DOE || "",
          ROOM: item?.Room || "",
          TEL: item?.Tel || "",
          FROM: item?.From || "",
          VALI_BALO: item?.Bag || "",
          PASSPORT_STATUS: item?.PassportStatus || "",
          REGISTER_DATE: item?.RegisterDate || "",
          VISA: item?.VisaName || "",
          PLANE_TICKET: item?.PlaneTicket || "",
          PRICE_TOUR: item?.TourPrice || 0,
          DISCOUNT: item?.Discount || 0,
          SURCHAGE: item?.Surcharge || 0,
          PAYMENT1: item?.Payment1 || 0,
          PAYMENT2: item?.Payment2 || 0,
          PAYMENT3: item?.Payment3 || 0,
          SALE: item?.StaffName || "",
          NOTE: item?.Note || "",
          GROUP_FAMILY: item?.GroupFamily || 0,
          FINGERPRINT_DATE: item?.FingerprintDate,
          TOTAL_PRICE:
            item?.TourPrice - (item?.Discount || 0) + (item?.Surcharge || 0),
          REMAIN:
            item?.TourPrice +
            (item?.Surcharge || 0) -
            (item?.Discount || 0) -
            (item?.Payment1 +
              item?.Payment2 +
              item?.Payment3 +
              item?.Payment4 +
              item?.Payment5 +
              item?.Payment6),
          AGENCY: item?.Agency,
        });
      });
    const params = {
      Json: JSON.stringify({
        FileName: bookingHeadInfo?.BookingCode || "Booking",
        Title1:
          "ROOMING LIST OF GROUP " +
            FormatDateJson(bookingHeadInfo?.TimeStart, 7) || "",
        Title2: bookingHeadInfo?.BookingName.replaceAll("/", "-") || "",
        Numberofseats:
          "Booking: " + (bookingHeadInfo?.Numberofseats || "0") + " seats",
        FlightList:
          flightList?.reduce((a, v) => (a = a + v.PlaneCodeEnd + " \n"), "") ||
          "",
        Details: details,
        Dealine1:
          FormatDateJson(bookingHeadInfo?.Deadline1From || "", 11) +
          " - " +
          FormatDateJson(bookingHeadInfo?.Deadline1To || "", 11),
        Dealine2:
          FormatDateJson(bookingHeadInfo?.Deadline2From || "", 11) +
          " - " +
          FormatDateJson(bookingHeadInfo?.Deadline2To || "", 11),
        Dealine3:
          FormatDateJson(bookingHeadInfo?.Deadline3From || "", 11) +
          " - " +
          FormatDateJson(bookingHeadInfo?.Deadline3To || "", 11),
        DealineFinish:
          "DEADLINE HOÀN TẤT HỒ SƠ: " +
          FormatDateJson(bookingHeadInfo?.DeadlineFinish || "", 7),
        DealineVisa:
          "DEADLINE VISA: " +
          FormatDateJson(bookingHeadInfo?.DeadlineVisa || "", 7),
        TOTAL_TICKET_GROUP: "Vé đoàn: " + (totalKindOfTicket.group || 0),
        TOTAL_TICKET_ALONE: "Vé đơn: " + (totalKindOfTicket.alone || 0),
        TOTAL_TICKET_LAND: "Land: " + (totalKindOfTicket.land || 0),
        TOTAL_ADT: "Người lớn: " + (totalKindOfTicket.adt || 0),
        TOTAL_CHD: "Trẻ em: " + (totalKindOfTicket.chd || 0),
        TOTAL_INF: "Infant: " + (totalKindOfTicket.inf || 0),
        TOTAL_SALE:
          "Đã bán: " +
          (bookingDetails.filter(
            (item) => item?.CustomerId && item?.IsSold === 0
          ).length || 0),
        TOTAL_SOLD:
          "Giữ chỗ: " +
          (bookingDetails.filter(
            (item) => item?.CustomerId && item?.IsSold === 1
          ).length || 0),
        TOTAL_WAITING:
          "Còn lại: " +
          ((bookingHeadInfo?.Numberofseats || 0) -
            (bookingDetails.filter(
              (item) => item?.CustomerId && item?.IsSold === 0
            ).length || 0)),
      }),
      func: "ExportExcelForBooking",
    };

    const list = await mainAction.API_spCallExportExcel(params, dispatch);
    if (list.resultCode === 0) {
      const link = document.createElement("a");
      link.href = IMAGES_DOMAIN + list.Message;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const RenderProgressLine = useMemo(() => {
    let totalDetail = bookingDetails.filter(
      (item) => item?.CustomerId && item.IsSold === 0
    );

    if (totalDetail.length > 0) {
      let success = 0,
        warning = 0,
        danger = 0;
      totalDetail.forEach((item) => {
        if (item.RegisterDateBg === "bg-success") {
          success++;
        }
        if (item.RegisterDateBg === "bg-warning") {
          warning++;
        }
        if (item.RegisterDateBg === "bg-danger") {
          danger++;
        }
      });
      let percentSuccess = (success / totalDetail.length) * 100;
      let percentWarning = (warning / totalDetail.length) * 100;
      let percentDanger = (danger / totalDetail.length) * 100;

      return (
        <div class="progress" style={{ height: "20px" }}>
          <div
            class="progress-bar progress-bar-success bg-success"
            role="progressbar"
            style={{ width: `${percentSuccess}%` }}
          >
            {success}
          </div>
          <div
            class="progress-bar progress-bar-warning bg-warning"
            role="progressbar"
            style={{ width: `${percentWarning}%` }}
          >
            {warning}
          </div>
          <div
            class="progress-bar progress-bar-danger bg-danger"
            role="progressbar"
            style={{ width: `${percentDanger}%` }}
          >
            {danger}
          </div>
        </div>
      );
    }
    return <></>;
  }, [bookingDetails]);

  //#region RenderSumary
  const RenderSumary = useMemo(() => {
    return (
      <>
        <div
          class={
            permission === 0 || permission === 1
              ? permission === 0
                ? "col-12 col-sm-6  col-md-6 col-lg-3"
                : "col-12 col-sm-6  col-md-6 col-lg-4"
              : "col-12 col-sm-6  col-md-6 col-lg-4 d-none"
          }
        >
          <div class={`info-box shadow  small-box  position-relative `}>
            <span class="info-box-icon bg-orange elevation-1">
              <i class="fas fa-users"></i>
            </span>

            <div class="info-box-content lh-0">
              {
                <div class="info-box-content__item  row">
                  <div className="row">
                    <div className="col-12 center-item">
                      <div className="font-weight-bold text-cl text-wrap fs-14 col-6  w-100">
                        Tổng số chỗ: {bookingHeadInfo?.Numberofseats || 0}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="font-weight-bold text-cl text-wrap fs-14 col-6 pt-1">
                        <span className="w-c p-0 m-0"> Vé đoàn</span>:{" "}
                        {totalKindOfTicket.group}
                      </div>
                      <div className="font-weight-bold text-cl text-wrap fs-14 col-6 pt-1">
                        <span className="w-c p-0 m-0"> Vé lẻ</span>:{" "}
                        {totalKindOfTicket.alone}
                      </div>
                      <div className="font-weight-bold text-cl text-wrap fs-14 col-6 pt-1">
                        <span className="w-c p-0 m-0">Land</span>:{" "}
                        {totalKindOfTicket.land}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="font-weight-bold text-cl text-wrap fs-14 col-6 pt-1">
                        <span className="w-c p-0 m-0">Đã Bán</span>:{" "}
                        {bookingDetails.filter(
                          (item) => item?.CustomerId && item?.IsSold === 0
                        ).length || 0}
                      </div>
                      <div className="font-weight-bold text-cl text-wrap fs-14 col-6 pt-1">
                        <span className="w-c p-0 m-0">Giữ chỗ</span>:{" "}
                        {bookingDetails.filter(
                          (item) => item?.CustomerId && item?.IsSold === 1
                        ).length || 0}
                      </div>
                      <div className="font-weight-bold text-cl text-wrap fs-14 col-6 pt-1">
                        <span className="w-c p-0 m-0">Còn lại</span>:{" "}
                        {(bookingHeadInfo?.Numberofseats || 0) -
                          (bookingDetails.filter(
                            (item) => item?.CustomerId && item?.IsSold === 0
                          ).length || 0)}
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </>
    );
  }, [bookingHeadInfo, totalKindOfTicket, bookingDetails, permission]);
  //#endregion

  const PriceBooking = useMemo(() => {
    return (
      <>
        <div class="col-12 col-sm-12 col-md-6 col-lg-4">
          <div class="info-box mb-3 shadow">
            <div class="info-box-content">
              <div className="row">
                <div className="col-md-12 mx-2 mb-1 mt-2">
                  <div class="form-group mb-0">
                    <div class=" input-group center-item">
                      <span class="small font-weight-bold text-muted fs-12 w-50 ">
                        GIÁ NGƯỜI LỚN
                      </span>
                      <input
                        type="text"
                        class="form-control2"
                        value={FormatMoney(+bookingHeadInfo?.Price1 || 0)}
                        onChange={(e) =>
                          setBookingHeadInfo({
                            ...bookingHeadInfo,
                            Price1: FormatMoney(e.target.value, 1),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12 m-2">
                  <div class="form-group mb-0">
                    <div class=" input-group center-item">
                      <span class="small font-weight-bold text-muted  fs-12 w-50 ">
                        GIÁ TRẺ EM
                      </span>
                      <input
                        type="text"
                        class="form-control2"
                        value={FormatMoney(+bookingHeadInfo?.Price2 || 0)}
                        onChange={(e) =>
                          setBookingHeadInfo({
                            ...bookingHeadInfo,
                            Price2: FormatMoney(e.target.value, 1),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mx-2 my-1">
                  <div class="form-group mb-0">
                    <div class=" input-group center-item">
                      <span class="small font-weight-bold text-muted  fs-12 w-50">
                        GIÁ INFANT
                      </span>
                      <input
                        type="text"
                        class="form-control2"
                        value={FormatMoney(+bookingHeadInfo?.Price3 || 0)}
                        onChange={(e) =>
                          setBookingHeadInfo({
                            ...bookingHeadInfo,
                            Price3: FormatMoney(e.target.value, 1),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mx-2 my-1">
                  <div className="d-flex align-items-center justify-content-around">
                    <div className="">
                      <span class="small font-weight-bold text-muted  fs-12  badge badge-info p-2 text-white ">
                        Người lớn:{" "}
                        <span className="fs-14">
                          {totalKindOfPeople?.adt || 0}
                        </span>
                      </span>
                    </div>
                    <div className="">
                      <span class="small font-weight-bold text-muted  fs-12 badge bg-child2 p-2 text-white">
                        Trẻ em:{" "}
                        <span className="fs-14">
                          {totalKindOfPeople?.chd || 0}
                        </span>
                      </span>
                    </div>
                    <div className="">
                      <span class="small font-weight-bold text-muted  fs-12 badge bg-infant text-white p-2 ">
                        Infant:{" "}
                        <span className="fs-14">
                          {totalKindOfPeople?.inf || 0}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }, [bookingHeadInfo, totalKindOfPeople]);

  const TableBooking = useMemo(() => {
    return (
      <>
        <div className="table-responsive shadow-sm col-12">
          {bookingDetails.length > 0 && bookingHeadInfo?.Numberofseats && (
            <DataTableBooking
              columns={columnsDetail}
              data={bookingDetails}
              updateMyData={updateMyData}
              skipPageReset={skipPageReset}
              size={
                bookingHeadInfo.Numberofseats +
                bookingDetails.filter((item) => item?.IsSold === 1).length
              }
              className="resize-table-custom"
              info={bookingHeadInfo}
            />
          )}
        </div>
      </>
    );
  }, [bookingDetails, bookingHeadInfo, skipPageReset, columnsDetail]);

  const handleChangeVisaStatus = (e) => {
    let vs = bookingHeadInfo.VisaWarning;
    if (vs === "success") {
      vs = "warning";
    } else if (vs === "warning") {
      vs = "danger";
    } else if (vs === "danger") {
      vs = "success";
    }
    setBookingHeadInfo({
      ...bookingHeadInfo,
      VisaWarning: vs,
    });
  };

  const RenderDeadlineTime = useMemo(() => {
    return (
      <>
        <div className="row">
          <div class="col-sm-12 col-md-4 ">
            <div class="form-group mb-2">
              <span class="small font-weight-bold text-muted">DEADLINE 1</span>
              <div class="input-group ">
                <DateTimeRangePicker
                  className="form-control2 bg-success deadline"
                  value={bookingHeadInfo?.Deadline1 || null}
                  onChange={(date) =>
                    setBookingHeadInfo({
                      ...bookingHeadInfo,
                      Deadline1: date,
                    })
                  }
                  format={"dd/MM/yyyy"}
                />
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-md-4 ">
            <div class="form-group mb-2">
              <span class="small font-weight-bold text-muted">DEADLINE 2</span>
              <div class="input-group ">
                <DateTimeRangePicker
                  className="form-control2 bg-warning  deadline2"
                  value={bookingHeadInfo?.Deadline2 || null}
                  onChange={(date) =>
                    setBookingHeadInfo({
                      ...bookingHeadInfo,
                      Deadline2: date,
                    })
                  }
                  format={"dd/MM/yyyy"}
                />
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-md-4 ">
            <div class="form-group mb-2">
              <span class="small font-weight-bold text-muted">DEADLINE 3</span>
              <div class="input-group ">
                <DateTimeRangePicker
                  className="form-control2 bg-danger deadline"
                  value={bookingHeadInfo?.Deadline3 || null}
                  onChange={(date) => ({
                    ...bookingHeadInfo,
                    Deadline3: date,
                  })}
                  format={"dd/MM/yyyy"}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }, [bookingHeadInfo]);

  const RenderDeadlineDocumentAndVisa = useMemo(() => {
    return (
      <>
        <div class="col-sm-12 col-md-3">
          <div class="form-group">
            <span class="small font-weight-bold text-muted">
              DEADLINE HOÀN TẤT HỒ SƠ
            </span>
            <div class="input-group ">
              <DateTimePicker
                className="form-control2 z-date"
                value={deadlineFinish}
                onChange={(date) => setDeadlineFinish(date)}
                format={"dd/MM/yyyy"}
              />
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-3">
          <div class="form-group">
            <span class="small font-weight-bold text-muted">DEADLINE VISA</span>
            <div class="input-group ">
              <DateTimePicker
                className="form-control2 z-date"
                value={deadlineVisa}
                onChange={(date) => setDeadlineVisa(date)}
                format={"dd/MM/yyyy"}
              />
            </div>
          </div>
        </div>
      </>
    );
  }, [deadlineFinish, deadlineVisa]);

  return (
    <div className="content-wrapper position-relative booking-display">
      <div className="card m-2 booking PrintBookingNone">
        <div class="card-header d-flex justify-content-center align-items-center ">
          <div class="d-flex justify-content-center align-items-center">
            <div class="font-weight-bold text-muted pull-right">
              {bookingHeadInfo.serviceSale.ServiceSaleCode}
            </div>
          </div>
          <div class="ml-auto">
            <div className="d-flex flex-row-reverse ">
              <button
                onClick={Trl_spBooking_Print}
                type="button"
                class="btn btn-sm btn-warning pull-right mr-1 py-0 "
              >
                <i class="fa fa-print pr-2"></i>
                In Booking
              </button>
              <button
                onClick={() => {
                  ConfirmAlert(
                    "Bạn có chắc muốn lưu thông tin booking này không?",
                    "Xác nhận",
                    () => {
                      Trl_spBooking_Save();
                      Trl_spBookingDetail_Save();
                    },
                    "Đồng ý",
                    "Hủy bỏ"
                  );
                }}
                type="button"
                class="btn btn-sm btn-success pull-right mr-1 ml-1 fs-14"
              >
                <i class="fa fa-save pr-2"></i>
                Update Tour
              </button>
              <button
                type="button"
                class="btn btn-sm btn-success pull-right mr-1 ml-1 fs-14"
                onClick={(e) => {
                  onExportExcel();
                }}
              >
                <i class="fa fa-print pr-2"></i>
                Export Excel
              </button>
            </div>
          </div>
        </div>
        <div class="card-body p-2" ref={ref}>
          <div class="row">
            <div class="col-12 col-sm-12 col-md-12 col-lg-8">
              <div class="info-box shadow p-0">
                <div class="info-box-content">
                  {RenderDeadlineTime}
                  <div class="row">
                    <div className="col-12">{RenderProgressLine}</div>
                  </div>
                  <div className="row">
                    {RenderDeadlineDocumentAndVisa}
                    <div className="col-sm-12 col-md-6">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          GHI CHÚ ĐẶC BIỆT
                        </span>
                        <div class=" input-group">
                          <textarea
                            type="text"
                            class="form-control2 w-80"
                            rows="2"
                            cols="50"
                            value={noteSpecial}
                            onChange={(e) => setNoteSpecial(e.target.value)}
                          />
                          <TooltipCustom
                            content={`Tình trạng visa hiện tại. Xanh (An toàn) - Đỏ (Không an toàn) - Vàng (Cảnh báo)`}
                          >
                            <span
                              class={`info-box-icon bg-${bookingHeadInfo.VisaWarning} elevation-1 mx-auto my-0 fs-18 cursor-pointer`}
                              onClick={handleChangeVisaStatus}
                            >
                              Visa
                            </span>
                          </TooltipCustom>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {PriceBooking}
            <div
              class={
                permission === 1 || permission === 3
                  ? "col-12 col-sm-6  col-md-6 col-lg-4"
                  : "col-12 col-sm-6  col-md-6 col-lg-4"
              }
            >
              <div
                class={`info-box shadow  small-box  position-relative ${
                  flightList.length > 0 ? "list-booking" : ""
                } `}
              >
                <span class="info-box-icon bg-info elevation-1">
                  <i class="fas fa-plane"></i>
                </span>

                <div class="info-box-content lh-0">
                  {flightList.length > 0 &&
                    flightList.map((item, index) => {
                      return (
                        <div
                          class="info-box-content__item mb-2"
                          key={index + "flight"}
                        >
                          <div className="font-weight-bold text-cl text-wrap fs-14">
                            {item.PlaneCodeEnd}
                          </div>
                        </div>
                      );
                    })}
                  {flightList.length <= 0 && (
                    <Button
                      variant="light"
                      onClick={() => {
                        setDataObject({
                          ObjectId: 2,
                          ObjectName: "Nhà cung cấp",
                        });
                        handleShow(2);
                      }}
                      className="fs-14"
                    >
                      Nhập thông tin vé
                    </Button>
                  )}
                </div>
                <div className="position-absolute w-100  bottom-0 left-0 right-0 center-item overlay-booking">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setDataObject({
                        ObjectId: 2,
                        ObjectName: "Nhà cung cấp",
                      });
                      handleShow(2);
                    }}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
            <div
              class={
                permission === 1 || permission === 3
                  ? "col-12 col-sm-6  col-md-6 col-lg-4"
                  : "col-12 col-sm-6  col-md-6 col-lg-3"
              }
            >
              <div class={`info-box shadow  small-box  position-relative `}>
                <span class="info-box-icon bg-danger elevation-1 mr-2 fs-18">
                  Room
                </span>

                <div class="info-box-content lh-0 p-0">
                  <div class="form-group mb-0">
                    <div class=" input-group">
                      <textarea
                        type="text"
                        class="form-control2 fs-14"
                        rows="2"
                        cols="50"
                        value={inforRoom}
                        placeholder="Nhập thông tin room "
                        onChange={(e) => setInforRoom(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class={
                permission === 1 || permission === 3
                  ? "col-12 col-sm-6  col-md-6 col-lg-3 d-none"
                  : "col-12 col-sm-6  col-md-6 col-lg-2"
              }
            >
              <div
                class={`info-box shadow  position-relative ${
                  landTourList.length > 0 ? "list-booking" : ""
                } `}
              >
                <span class="info-box-icon bg-success elevation-1">
                  <i class="fas fa-map-marked"></i>
                </span>
                <div class="info-box-content lh-0">
                  {landTourList.length > 0 && (
                    <div class="info-box-content__item mb-2">
                      <div className="font-weight-bold text-cl text-wrap fs-14">
                        {landTourList[0].LandTourCode} -{" "}
                        {landTourList[0].LandTourName}
                      </div>

                      <div className="fs-12 font-weight-bold text-muted">
                        {FormatDateJson(landTourList[0].LandTourTime, 5)}
                      </div>
                    </div>
                  )}
                  {landTourList.length <= 0 && (
                    <Button
                      variant="light"
                      onClick={() => {
                        handleShow(3);
                        setDataObject({
                          ObjectId: 2,
                          ObjectName: "Nhà cung cấp",
                        });
                      }}
                      className="fs-14"
                    >
                      Nhập land tour
                    </Button>
                  )}
                </div>
                <div className="position-absolute w-100  bottom-0 left-0 right-0 center-item overlay-booking">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      handleShow(3);
                      setDataObject({
                        ObjectId: 2,
                        ObjectName: "Nhà cung cấp",
                      });
                    }}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>

            {RenderSumary}
          </div>
          <div class="row">
            {TableBooking}
            <div class="col-12 mt-2">
              <button
                onClick={() => {
                  ConfirmAlert(
                    "Bạn có chắc muốn lưu thông tin booking này không?",
                    "Xác nhận",
                    () => {
                      Trl_spBooking_Save();
                      Trl_spBookingDetail_Save();
                    },
                    "Đồng ý",
                    "Hủy bỏ"
                  );
                }}
                type="button"
                class="btn btn-lg btn-success pull-right mr-1 ml-1 fs-14"
              >
                <i class="fa fa-save pr-2"></i>
                Save
              </button>
            </div>
            <div className="col-12 mt-2">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">GHI CHÚ</span>
                <div class=" input-group">
                  <textarea
                    type="text"
                    class="form-control2"
                    rows="5"
                    cols="50"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-12">
              <div class="table-responsive">
                {dataTableError.length > 0 && (
                  <DataTable2
                    data={dataTableError}
                    columns={columsError}
                    size={dataTableError.length}
                  />
                )}
              </div>
              <div className={`justify-content-end mt-2 d-flex `}>
                <button
                  className={`btn btn-info mr-2 ${
                    dataTableError.some((item) => item.Checked) ? "" : "d-none"
                  }`}
                  onClick={() => handleMergerTour(1)}
                >
                  Ghép tour
                </button>
                <button
                  className={`btn btn-danger mr-2 ${
                    dataTableError.some((item) => item.Checked) ? "" : "d-none"
                  }`}
                  onClick={() => {
                    ConfirmAlert(
                      "Bạn có chắc chắn muốn hủy tour cho khách hàng này không?",
                      "",
                      async () => {
                        await Trl_spBookingDetailDetail_Cancer(
                          dataTableError.filter((item) => item.Checked),
                          1
                        );
                      }
                    );
                  }}
                >
                  Hoàn hủy tour
                </button>
                <button
                  className="btn btn-success mr-2"
                  onClick={() => Trl_spBookingDetail_ChangeNote()}
                >
                  Save Note{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal hotel */}
      <Modal
        show={showHotel}
        onHide={() => handleClose(1)}
        backdrop="static"
        keyboard={false}
        size="xl"
        className={`custom-modal-w-90 ${opacity}  z-max`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">Thông tin khách sạn</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => handleClose(1)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-1">
          <HotelForm
            setOpacity={setOpacity}
            handleShow={() => handleShow(5)}
            bookingId={bookingHeadInfo?.BookingId || 0}
            data={hotelList}
            setData={setHotelList}
          />
        </Modal.Body>
      </Modal>
      {/* end modal */}

      {/* modal plane ticket */}
      <Modal
        show={showFlight}
        onHide={() => handleClose(2)}
        backdrop="static"
        keyboard={false}
        size="xl"
        className={`custom-modal-w-90 ${opacity}  z-max`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">Thông tin vé máy bay</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => handleClose(2)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-1">
          <PlaneTicketForm
            setOpacity={setOpacity}
            handleShow={() => {
              setInvoiceStyle({
                ...invoiceStyleList.find((item) => item.StyleId === 2),
                TypeInvoice: 3,
              });
              handleShow(9);
            }}
            bookingId={bookingHeadInfo?.BookingId || 0}
            data={flightList}
            setData={setFlightList}
            Booking={bookingHeadInfo}
            DataObject={DataObject}
            onPlaneId={setidPlane}
          />
        </Modal.Body>
      </Modal>
      {/* end modal */}

      {/* modal land tour */}
      <Modal
        show={showLandTour}
        onHide={() => handleClose(3)}
        backdrop="static"
        keyboard={false}
        size="xl"
        className={`custom-modal-w-90 ${opacity}  z-max`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">Thông tin land tour</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => handleClose(3)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-1">
          <LandTourForm
            setOpacity={setOpacity}
            Booking={bookingHeadInfo}
            IsActive={Math.random()}
            handleShow={() => {
              setInvoiceStyle({
                ...invoiceStyleList.find((item) => item.StyleId === 1),
                TypeInvoice: 2,
              });
              handleShow(9);
            }}
            DataObject={DataObject}
          />
        </Modal.Body>
      </Modal>
      {/* end modal */}

      {/* modal tour guider */}
      <Modal
        show={showTourGuider}
        onHide={() => handleClose(6)}
        backdrop="static"
        keyboard={false}
        size="xl"
        className={` ${opacity}  z-max`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">Thông tin tour leader</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => handleClose(6)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-1">
          <TourGuiderForm
            setOpacity={setOpacity}
            handleShow={() => {
              setInvoiceStyle({
                ...invoiceStyleList.find((item) => item.StyleId === 3),
                TypeInvoice: 4,
              });
              handleShow(9);
            }}
            data={tourLeader}
            setData={setTourLeader}
            bookingId={bookingHeadInfo?.BookingId || 0}
            DataObject={DataObject}
          />
        </Modal.Body>
      </Modal>
      {/* end modal */}

      <Modal
        show={showInvoice}
        onHide={() => handleClose(5)}
        backdrop="static"
        keyboard={false}
        size="xl"
        className={`custom-modal-w-90   z-max`}
      >
        <Modal.Header className="py-2 border-bottom-0 ">
          <Modal.Title className="ml-auto">PHIẾU THU</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => {
              handleClose(5);
              setOpacity("opacity-1");
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-1">
          <InvoicePayment
            Booking={bookingHeadInfo}
            DataObject={DataObject}
            handleShow={() => handleShow(5)}
            IsActive={Math.random()}
            setOpacity={setOpacity}
            invoiceStyle={invoiceStyle}
            onInvoiceInfor={handleGetInvoicePayment}
            data={bookingDetails}
          />
        </Modal.Body>
      </Modal>

      <Modal
        show={showInvoiceDetail}
        onHide={() => handleClose(9)}
        backdrop="static"
        keyboard={false}
        size="xl"
        className={`custom-modal-w-90   z-max`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">PHIẾU THU KHÁCH HÀNG</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => {
              handleClose(9);
              setOpacity("opacity-1");
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-1">
          <InvoiceDefault
            Booking={bookingHeadInfo}
            DataObject={DataObject}
            handleShow={() => handleShow(9)}
            IsActive={Math.random()}
            setOpacity={setOpacity}
            invoiceStyle={invoiceStyle}
            onInvoiceInfor={handleUpdateInvoice}
            idPlane={idPlane}
            flightList={flightList}
            idTourLeader={tourLeader}
          />
        </Modal.Body>
      </Modal>

      {/* end modal */}

      {/* modal visa */}
      <Modal
        show={showVisa}
        onHide={() => handleClose(7)}
        backdrop="static"
        keyboard={false}
        size="xl"
        className={`custom-modal-w-90 ${opacity}  z-max`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">THÔNG TIN VISA</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => {
              handleClose(7);
              setOpacity("opacity-1");
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-1">
          <VisaForm
            data={rowVisa}
            setOpacity={setOpacity}
            handleShow={() => {
              setInvoiceStyle({
                ...invoiceStyleList.find((item) => item.StyleId === 4),
                TypeInvoice: 1,
              });

              handleShow(13);
            }}
            onVisa={handleSuccessVisa}
          />
        </Modal.Body>
      </Modal>

      {/* Modal hoa don cho visa */}
      <Modal
        show={showInvoiceVisa}
        onHide={() => handleClose(13)}
        backdrop="static"
        keyboard={false}
        size="xl"
        className={`custom-modal-w-90   z-max`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">PHIẾU PĐX</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => {
              handleClose(13);
              setOpacity("opacity-1");
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-1">
          <InvoiceCustomerMain
            Booking={bookingHeadInfo}
            DataObject={DataObject}
            handleShow={() => handleShow(14)}
            IsActive={Math.random()}
            setOpacity={setOpacity}
            invoiceStyle={invoiceStyle}
            onInvoiceInfor={handleUpdateInvoice}
            data={bookingDetails}
            TypeOfReceipt={"PĐXVS"}
          />
        </Modal.Body>
      </Modal>
      {/* end modal */}

      <Modal
        show={showInvoiceRefund}
        onHide={() => handleClose(14)}
        backdrop="static"
        keyboard={false}
        size="xl"
        className={`custom-modal-w-90   z-max`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">PHIẾU PĐX</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => {
              handleClose(14);
              setOpacity("opacity-1");
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-1">
          <InvoiceCustomerMain
            Booking={bookingHeadInfo}
            DataObject={DataObject}
            handleShow={() => handleShow(14)}
            IsActive={Math.random()}
            setOpacity={setOpacity}
            invoiceStyle={invoiceStyle}
            onInvoiceInfor={handleUpdateInvoice}
            data={bookingDetails}
            TypeOfReceipt={"PĐXKD"}
          />
        </Modal.Body>
      </Modal>

      {/* modal GHEP TOUR */}
      <Modal
        show={showJoinTour}
        onHide={() => handleClose(8)}
        backdrop="static"
        keyboard={false}
        size="sx"
        className={`${opacity}`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">Ghép Tour</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => handleClose(8)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-1">
          <div class="row p-2 w-500px">
            <div class="col-md-12">
              <div class=" mb-2">
                <div class="form-group mb-1">
                  <span class="small font-weight-bold text-muted">
                    TOUR HIỆN TẠI
                  </span>
                  <div class=" input-group">
                    <input
                      type="text"
                      class="form-control2"
                      value={bookingHeadInfo.serviceSale.label}
                      disabled
                    />
                  </div>
                </div>

                <div class="form-group  ">
                  <span class="small font-weight-bold text-muted">
                    GHÉP SANG TOUR
                  </span>
                  <div class="input-group">
                    <SelectServiceSale
                      onSelected={(e) => setServiceSaleMerger(e)}
                      items={serviceSaleMerger?.value || 0}
                      className={"w-100 select-custom z-max"}
                    />
                  </div>
                </div>
              </div>
              <button
                className="btn btn-success btn-sm pull-right mr-1 px-3"
                onClick={handleConfirmMergerTour}
              >
                Xác nhận ghép tour
                <i class="fas fa-arrow-right pl-2"></i>
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* end modal */}

      {/* discount srurechar */}

      <Modal
        show={ShowDiscountSurcharge}
        onHide={() => handleClose(11)}
        backdrop="static"
        keyboard={false}
        size="sx"
        className={`${opacity}`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">Discount</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => handleClose(11)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-1">
          <div class="row p-2 w-500px">
            <div class="col-sm-12 col-md-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">Discount</span>
                <div class=" input-group">
                  <input
                    type="text"
                    class="form-control2"
                    value={FormatMoney(+DiscountSurcharge?.Discount || 0)}
                    onChange={(e) =>
                      setDiscountSurcharge({
                        ...DiscountSurcharge,
                        Discount: FormatMoney(e.target.value, 1),
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  Desciption
                </span>
                <div class=" input-group">
                  <input
                    type="text"
                    class="form-control2"
                    value={DiscountSurcharge?.DiscountDescription || ""}
                    onChange={(e) =>
                      setDiscountSurcharge({
                        ...DiscountSurcharge,
                        DiscountDescription: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <button
                className="btn btn-success btn-sm pull-right mr-1 px-3"
                onClick={(e) =>
                  handleClickDiscountSurcharge(
                    "Discount",
                    "DiscountDescription"
                  )
                }
              >
                Lưu Discount
                <i class="fas fa-arrow-right pl-2"></i>
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={ShowDiscountSurcharge1}
        onHide={() => handleClose(12)}
        backdrop="static"
        keyboard={false}
        size="sx"
        className={`${opacity}`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">Surcharge</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => handleClose(12)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-1">
          <div class="row p-2 w-500px">
            <div class="col-sm-12 col-md-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">Surcharge</span>
                <div class=" input-group">
                  <input
                    type="text"
                    class="form-control2"
                    value={FormatMoney(+DiscountSurcharge?.Surcharge || 0)}
                    onChange={(e) =>
                      setDiscountSurcharge({
                        ...DiscountSurcharge,
                        Surcharge: FormatMoney(e.target.value, 1),
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  Desciption
                </span>
                <div class=" input-group">
                  <input
                    type="text"
                    class="form-control2"
                    value={DiscountSurcharge?.SurchargeDescription || ""}
                    onChange={(e) =>
                      setDiscountSurcharge({
                        ...DiscountSurcharge,
                        SurchargeDescription: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <button
                className="btn btn-success btn-sm pull-right mr-1 px-3"
                onClick={(e) =>
                  handleClickDiscountSurcharge(
                    "Surcharge",
                    "SurchargeDescription"
                  )
                }
              >
                Lưu Surcharge
                <i class="fas fa-arrow-right pl-2"></i>
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* end discount srurechar */}

      <div className="PrintBooking" style={{ display: "none" }}>
        <BookingPrint
          onDataBooking={DataBookingPrint}
          onFlightList={flightList}
          onInfoRoom={inforRoom}
        />
      </div>
    </div>
  );
});

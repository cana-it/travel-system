import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import { useDispatch } from "react-redux";
import { InvoiceCustomerMain } from "../Component/Main/TravelModule/Booking/InvoiceCustomerMain";
import { VisaForm } from "../Component/Main/TravelModule/Booking/VisaForm";
import { mainAction } from "../Redux/Actions";
import { IMAGES_DOMAIN } from "../Services";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  FormatDateJson,
  FormatMoney,
} from "../Utils";
import { DataTableBooking } from "./DataTableBooking";
import { SelectTourGuider } from "./SelectTourGuider";
import { TooltipCustom } from "./TooltipCustom";

export const TableShowDataBooking = ({ bookingId = -1, type = 0 }) => {
  const dispatch = useDispatch();
  const [bookingHeadInfo, setBookingHeadInfo] = useState({});
  const [noteSpecial, setNoteSpecial] = useState("");
  const [deadlineFinish, setDeadlineFinish] = useState(null);
  const [deadlineVisa, setDeadlineVisa] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);
  const DepartmentId = +localStorage.getItem("DepartmentId");
  const Creater = +localStorage.getItem("CreateBy");
  const [opacity, setOpacity] = useState("opacity-1");
  const [skipPageReset, setSkipPageReset] = useState(false);
  const [rowVisa, setRowVisa] = useState({});
  const [showVisa, setShowVisa] = useState(false);
  const [showInvoiceVisa, setShowInvoiceVisa] = useState(false);
  const [invoiceStyleList, setInvoiceStyleList] = useState([]);
  const [invoiceStyle, setInvoiceStyle] = useState({});
  const [flightList, setFlightList] = useState([]);
  const [totalKindOfPeople, setTotalKindOfPeople] = useState({});
  const [totalKindOfTicket, setTotalKindOfTicket] = useState({});
  const [showHdv, setShowHdv] = useState(false);
  const [hdv, setHdv] = useState({ value: 0 });
  const [isTourLead, setIsTourLead] = useState(false);
  const [DataObject, setDataObject] = useState({
    Notes: "",
    dataDetail: [],
  });
  useEffect(() => {
    if (bookingId === 0) {
      return;
    } else {
      Trl_spBooking_Get(bookingId);
      Trl_spBooking_CustomerPlane_View(bookingId);
    }
  }, [bookingId]);

  const Trl_spBooking_Visa_Save = async () => {
    try {
      const pr = {
        BookingId: bookingHeadInfo?.BookingId || 0,

        NoteSpecial: noteSpecial,
        VisaWarning: bookingHeadInfo.VisaWarning || "success",
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBooking_Visa_Save",
      };
      const respone = await mainAction.API_spCallServer(params, dispatch);
      Alertsuccess("Lưu thành công");
    } catch (error) {
      ;
    }
  };

  const handleChangeVisaStatus = (e) => {
    if (type === 1) {
      return;
    }
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

  const Trl_spBooking_CustomerPlane_View = async (bookingId) => {
    try {
      const pr = {
        BookingId: +bookingId,
        CreateName: +Creater,
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
  };
  //#region Call API

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
      setNoteSpecial(res[0]?.NoteSpecial || "");
      res[0]?.DeadlineFinish &&
        setDeadlineFinish(new Date(res[0].DeadlineFinish));
      res[0]?.DeadlineVisa && setDeadlineVisa(new Date(res[0].DeadlineVisa));
      await Trl_spBookingDetail_List(bookingId, bk, bk.Numberofseats);
    } catch (error) {
      ;
    }
  };

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
    Sex: "",
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
    Payment1: "",
    Payment2: "",
    Payment3: "",
    PlaneTicketValue: { value: 1, label: "Vé Đoàn" },
  };

  const Trl_spBookingDetail_List = async (bookingId, booking, totalBooking) => {
    await setBookingDetails([]);
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
        if (index === 0) {
          saleId = item.Sale_StaffId;
          groupFamily = item?.GroupFamily || 0;
        } else {
          if (saleId !== item.Sale_StaffId) {
            checkSale = !checkSale;
            saleId = item.Sale_StaffId;
          }
          if (
            saleId === item.Sale_StaffId &&
            groupFamily !== item?.GroupFamily &&
            item?.GroupFamily
          ) {
            checkSale = !checkSale;
            groupFamily = item?.GroupFamily;
          }
        }

        let s = typeValues.filter((i) => i.label === item.Sex);
        let sf = s.length > 0 ? s[0] : { value: 0, label: "" };
        let pl = item?.PlaneCode
          ? planeTicketValues.filter((i) => i.label === item.PlaneCode)
          : [];
        let plf = pl.length > 0 ? pl[0] : planeTicketValues[0];

        if (plf.label === "Vé Đoàn") {
          item.IsSold === 0 && group++;
        } else if (plf.label === "Vé Lẻ") {
          item.IsSold === 0 && alone++;
        } else {
          item.IsSold === 0 && land++;
        }

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
          let name = item.CustomerName.split(" ");
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
          Name: item.CustomerName,
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
          RegisterDateBg: bg,
          Sale: item.SaleStaffId,
          Checked: false,
          Sex: sf.label,
          StatusCustomer: item?.StatusCustomer || "OK",
          ObjectId: 1,
          ObjectName: "Khách hàng",
          isVAT: isVAT,
          No: item?.No ? item.No : index,
          checkSale: checkSale,
          PlaneTicketValue: plf,
          GroupFamily: item.GroupFamily || 0,
          CustomerCode:
            item?.CustomerCode && item?.CustomerCode !== ""
              ? item.CustomerCode
              : code,
        };
      });
      setTotalKindOfPeople({ inf: inf, chd: chd, adt: adt });
      setTotalKindOfTicket({ group: group, alone: alone, land: land });
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
            return { ...iem, No: index + 1 };
          }),
      ];
      if (tempArr.length < totalBooking + 10) {
        for (
          let index = newRes.length - tempArr.length - 1;
          index < +totalBooking + 10;
          index++
        ) {
          tempArr.push({ ...sampleDataDetail, No: tempArr.length + 1 });
        }
      }
      setIsTourLead(tempArr.some((item) => item.IsTourLeader));
      setBookingDetails(tempArr);
    } catch (error) {
      ;
    }
  };

  const columnsDetail = useMemo(
    () => [
      {
        Header: () => <div></div>,
        accessor: "Checked",
        textAlign: "center",
        disableResizing: true,
        width: 0,
        sticky: "left",
      },
      {
        Header: "No",
        accessor: "No",
        textAlign: "center",
        disableResizing: true,
        width: 50,
        sticky: "left",
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
                  type === 0 && setShowVisa(true);
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
      },
      {
        Header: "DOE",
        accessor: "DOE",
        disableResizing: true,
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
      },
      {
        Header: "PlaneTicket",
        accessor: "PlaneCode",
        disableResizing: true,
        width: 95,
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
    ],
    []
  );

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

  const onExportExcel = async () => {
    let details = [];
    bookingDetails
      ?.filter((p) => p.StatusCustomer === "OK")
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
          PRICE_TOUR: FormatMoney(item?.TourPrice || 0),
          DISCOUNT: FormatMoney(item?.Endow || 0),
          SURCHAGE: FormatMoney(item?.Surchage || 0),
          PAYMENT1: FormatMoney(item?.Payment1 || 0),
          PAYMENT2: FormatMoney(item?.Payment2 || 0),
          PAYMENT3: FormatMoney(item?.Payment3 || 0),
          SALE: item?.StaffName || "",
          NOTE: item?.Note || "",
          GROUP_FAMILY: item?.GroupFamily || 0,
          FINGERPRINT_DATE: item?.FingerprintDate,
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
          flightList?.reduce((a, v) => (a = a + v.PlaneCodeNew + " \n"), "") ||
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
        TOTAL_ADT: "Người lớn: " + (totalKindOfPeople.adt || 0),
        TOTAL_CHD: "Trẻ em: " + (totalKindOfPeople.chd || 0),
        TOTAL_INF: "Infant: " + (totalKindOfPeople.inf || 0),
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
      func: "ExportExcelForVisa",
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

  const TableBooking = useMemo(() => {
    return (
      <>
        <div className="table-responsive shadow-sm col-12 p-0">
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
              isEdit={false}
            />
          )}
        </div>
      </>
    );
  }, [bookingDetails, bookingHeadInfo, skipPageReset, columnsDetail]);

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

  const changeDayvsMonth = (date) => {
    let arr = date.split("/");
    return `${arr[1]}/${arr[0]}/${arr[2]}`;
  };

  const handleSuccessVisa = (res) => {
    try {
      let arr = bookingDetails.map((item, index) => {
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
      setBookingDetails(arr);
    } catch (error) {
      Alertwarning("Có lỗi xẫy ra vui lòng F5");
    }
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
    if (hdv.value === 0) {
      Alertwarning("Vui lòng chọn HDV");
      return;
    }
    try {
      let check = 0,
        check1 = 0,
        check2 = 0;
      let pr = bookingDetails
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
            Brithday: birthday,
            Address: "",
            Phone: item.Tel,
            PassportCode: item.Passport,
            PassportTimeFrom: doi,
            PassportTimeTo: doe,
            PassportScan: item.PassportStatus,
            Creater: +Creater,
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
            SaleId: item?.StaffId || +Creater,
            StatusCustomer: item?.StatusCustomer || "OK",
            Agency: item.Agency,
            IsSold: item?.IsSold || 0,
            DiscountDescription: item?.DiscountDescription || "",
            SurchargeDescription: item?.SurchargeDescription || "",
            No: item?.No,
            GroupFamily: item?.GroupFamily || 0,
            IsTourLeader: item?.IsTourLeader || false,
          };
        });

      let code = "";
      if (hdv?.YearOfBirth) {
        let name = hdv.TourGuiderName.split(" ");
        let lastName = name[name.length - 1];
        let firstName = name[0];

        let formatDate = moment(hdv?.YearOfBirth).format("DDMMYY");
        code = `${firstName}${lastName}${formatDate}`;
      }
      let end = {};
      let guide = {
        BookingId: bookingHeadInfo.BookingId,
        BookingDetailId: 0,
        CustomerId: 0,
        CustomerCode: code,
        CustomerName: hdv.TourGuiderName,
        Sex: "Male",
        Brithday: FormatDateJson(hdv.YearOfBirth, 1),
        Address: hdv.TourGuiderAddress,
        Phone: hdv.Phone,
        PassportCode: hdv.Passport,
        PassportTimeFrom: FormatDateJson(hdv.IssueDate),
        PassportTimeTo: FormatDateJson(hdv.ExpirationDate),
        PassportScan: "",
        Creater: +Creater,
        GoFrom: "",
        RoomCode: "",
        RoomUpdateTime: FormatDateJson(new Date()),
        PriceTour: 0,
        PriceTour_Discount: 0,
        PriceTour_Surcharge: 0,
        RegisterDate: FormatDateJson(new Date()),
        Note: "",
        Visa: "",
        PlaneTicket: "Vé Đoàn",
        Bag: "",
        SaleId: +Creater,
        StatusCustomer: "OK",
        Agency: "",
        IsSold: 0,
        DiscountDescription: "",
        SurchargeDescription: "",
        No: pr.length + 1,
        GroupFamily: 0,
        FingerprintDate: "",
        IsTourLeader: true,
      };
      if (isTourLead) {
        let guide2 = pr.find((x) => x.IsTourLeader === true);
        guide = {
          ...guide,
          BookingDetailId: guide2?.BookingDetailId || 0,
          CustomerId: guide2?.CustomerId || 0,
          No: pr.length,
        };
        pr = pr.filter((x) => x.IsTourLeader !== true).concat(guide);
        end = guide;
      } else {
        pr.push(guide);
        end = guide;
      }

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
        Json: JSON.stringify([end]),
        func: "Trl_spBookingDetail_Save_V1",
      };

      const respone = await mainAction.API_spCallServer(params, dispatch);
      if (respone.Status === "OK") {
        await Trl_spBookingDetail_List(
          bookingHeadInfo.BookingId,
          bookingHeadInfo,
          bookingHeadInfo.Numberofseats
        );
        setHdv({ value: 0 });
        setShowHdv(false);
        Alertsuccess("Cập nhật booking thành công");
      }
    } catch (error) {
      ;
    }
  };
  return (
    <>
      <div class={bookingDetails.length > 0 ? "row" : "d-none"}>
        <div className="col-12">
          <button
            type="button"
            class="btn btn-sm btn-info  fs-14 float-right mb-2 ml-2"
            onClick={(e) => {
              onExportExcel();
            }}
          >
            <i class="fa fa-print pr-2"></i>
            Export Excel
          </button>
          <button
            type="button"
            class="btn btn-sm btn-success  fs-14 float-right mb-2"
            onClick={(e) => {
              Trl_spBooking_Visa_Save();
            }}
          >
            <i class="fa fa-download pr-2"></i>
            Lưu
          </button>
          <button
            type="button"
            class="btn btn-sm btn-warning text-dark fs-14 float-right mb-2 mr-2"
            onClick={(e) => {
              setShowHdv(true);
            }}
          >
            <i class="fa fa-plus pr-2"></i>
            {isTourLead ? "Cập Nhật HDV" : "Thêm HDV vào Tour"}
          </button>
        </div>
        <div class="col-8 ">
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
        <div class="col-4">
          <div class="info-box shadow p-0">
            <div class="info-box-content">
              <div class="row">
                <div className="col-12">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      VÉ MÁY BAY
                    </span>
                    {flightList.length > 0 &&
                      flightList.map((item, index) => {
                        return (
                          <div class="input-group-prepend mb-2 ">
                            <span class="input-group-text mr-2">
                              <i class="fa fa-plane"></i>
                            </span>
                            <div class="font-weight-bold">
                              {item.PlaneCodeEnd}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={bookingDetails.length > 0 ? "row" : "d-none"}>
        {TableBooking}
      </div>

      <Modal
        show={showVisa}
        onHide={() => setShowVisa(false)}
        aria-labelledby="example-custom-modal-styling-title"
        className={` custom-modal-w-90 z-maxx`}
      >
        <Modal.Header className="p-2">
          <Modal.Title id="example-custom-modal-styling-title">
            <div class="text-center">Cập nhật visa</div>
          </Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => {
              setShowVisa(false);
            }}
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
          <Modal.Title className="ml-auto">PHIẾU ĐỀ XUẤT</Modal.Title>
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
            Booking={bookingHeadInfo}
            DataObject={DataObject}
            handleShow={() => setShowInvoiceVisa(true)}
            IsActive={Math.random()}
            setOpacity={setOpacity}
            invoiceStyle={invoiceStyle}
            onInvoiceInfor={handleUpdateInvoice}
            data={bookingDetails}
            TypeOfReceipt={"PĐXVS"}
          />
        </Modal.Body>
      </Modal>

      <Modal
        show={showHdv}
        onHide={() => setShowHdv(false)}
        aria-labelledby="example-modal-sizes-title-lg"
        size="lg"
        className={` z-maxx`}
      >
        <Modal.Header className="p-2">
          <Modal.Title id="example-custom-modal-styling-title">
            <div class="text-center">
              {" "}
              {isTourLead ? "Cập Nhật" : "Thêm"} Hướng Dẫn Viên Vào Tour
            </div>
          </Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => {
              setShowHdv(false);
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-3">
          <div className="row">
            <div className="col-6 m-auto">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  Hướng Dẫn Viên
                </span>
                <SelectTourGuider
                  onSelected={(e) => setHdv(e)}
                  className={"w-100 select-custom z-maxxx"}
                  TourGuiderId={hdv.value || 0}
                />
              </div>
            </div>
            <div class="col-12 center-item ">
              <button
                className="btn btn-success "
                onClick={Trl_spBookingDetail_Save}
              >
                <i class="fa fa-plus mr-2"></i>
                {isTourLead ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

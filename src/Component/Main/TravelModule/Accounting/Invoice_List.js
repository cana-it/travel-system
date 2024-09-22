import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alerterror,
  FormatDateJson,
  ConfirmAlert,
  ExportExcel,
  FormatMoney,
  Alertsuccess,
} from "../../../../Utils";
import { DataTable, ShowFiles, TooltipCustom } from "../../../../Common";
import Modal from "react-bootstrap/Modal";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { MoneyToText } from "../../../../Utils/MoneyToText";
import { InvoiceGroupAc } from "./InvoiceGroupAc";
import moment from "moment";
import { Button, ListGroup } from "react-bootstrap";
import { Img } from "react-image";
import { InvoicePrint } from "./InvoicePrint";
import { InvoiceConfirmTemp } from "./InvoiceConfirmTemp";
import { format } from "date-fns";
import { InvoiceConfirmReceiptTemp } from "./InvoiceConfirmReceiptTemp";
export const Invoice_List = () => {
  const dispatch = useDispatch();
  const Creater = +localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const [isEmpty, setIsEmpty] = useState(false);
  //#region Khai báo biến
  const [state, setState] = useState({
    dataNew: [], // Dữ liệu show ở 3 bảng đầu tiên lúc mới vào trang
    data: [],
    dataThu: [],
    dataDxTour: [],
    dataDxNb: [],
    isShow: 0, //0 là show main page, 1 show ds thu, 2 show ds chi tour, 3 show ds chi nội bộ
    statusFilterA: 1,
    statusFilterB: 1,
    statusFilterC: 1,
  });

  const [isPrint, setIsPrint] = useState(0);
  const [statusShow, setStatusShow] = useState([0, 1, 2, 3, 4]);
  const [InvoiceSearch, setInvoiceSearch] = useState("");
  const [TimeSearch, setTimeSearch] = useState([
    new Date(
      moment(new Date().setDate(new Date().getDate() - 7)).startOf("date")
    ),
    new Date(moment(new Date()).endOf("date")),
  ]);
  const [titleShow, setTitleShow] = useState("TẤT CẢ HÓA ĐƠN");
  //#endregion

  const Trl_spInvoice_Visa_Get = async (id) => {
    try {
      const pr = {
        InvoiceId: id,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_Visa_Get",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      return res;
    } catch (error) {
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau");
      ;
    }
  };

  //#region Search data
  const Trl_spInvoice_List = async (TypeSearch = "D") => {
    if (TimeSearch === undefined) {
      Alertwarning("Vui lòng chọn thời gian");
      return;
    }

    try {
      const pr = {
        InvoiceId: 0,
        ObjectId: 0,
        ObId: 0,
        Creater: Creater,
        CreateName: CreateName,
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
        InvoiceType: TypeSearch,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_List_V1",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      if (TypeSearch === "D") {
        setState({
          ...state,
          dataNew: list,
          isShow: 0,
          statusFilter: [1],
        });
        return;
      } else if (TypeSearch === "A") {
        let hanlde = await list.map(async (i, index) => {
          if (i.StyleId === 6) {
            let newobj = await Trl_spInvoice_Visa_Get(i.InvoiceId);
            return { ...i, ...newobj[0] };
          }
          return i;
        });
        let dataFinal = await Promise.all(hanlde);
        await setState({
          ...state,
          dataThu: dataFinal,
          isShow: 1,
        });
        setIsStrCheck("");
        return;
      } else if (TypeSearch === "B") {
        setState({
          ...state,
          dataDxTour: list,
          isShow: 2,
        });
        return;
      } else if (TypeSearch === "C") {
        setState({
          ...state,
          dataDxNb: list,
          isShow: 3,
        });
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };
  //#endregion

  //#region Xuất excel

  const Trl_spInvoice_Excel = () => {
    ConfirmAlert("Xác nhận", "Bạn có chắc muốn xuất?", () => {
      let dataexcel = state.dataNew.map((item, index) => {
        return {
          "Hóa đơn": item.InvoiceType === "A" ? "Thu" : "Đề xuất",
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

  //#endregion

  //#region Load data Xác nhận

  const [invoiceView, setInvoiceView] = useState({});
  const Trl_spInvoice_View = (row) => {
    if ((row._original.GroupId || 0) === 0) {
      let PrinterData = row._original;
      PrinterData.TotalInvoiceGroup = 1;
      PrinterData.PriceNL = PrinterData.PriceTourNL;
      PrinterData.PriceTE = PrinterData.PriceTourTE;
      PrinterData.PriceTN = PrinterData.PriceTourTN;
      /* PrinterData.PriceNL = PrinterData.Price1;
      PrinterData.PriceTE = PrinterData.Price2;
      PrinterData.PriceTN = PrinterData.Price3; */

      setInvoiceView(PrinterData);
    } else {
      let PrinterData = state.dataThu.find(
        (p) => p.InvoiceId === row._original.GroupId
      );

      let GroupPrint =
        state.dataThu.filter((p) => p.GroupId === row._original.GroupId) || [];
      PrinterData.TotalInvoiceGroup = GroupPrint.length;

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

      PrinterData.BookingCode = GroupPrint[0].BookingCode;
      PrinterData.ServiceName = GroupPrint[0].ServiceName;
      PrinterData.TotalDate = GroupPrint[0].TotalDate;
      PrinterData.TimeStart = GroupPrint[0].TimeStart;
      PrinterData.TimeEnd = GroupPrint[0].TimeEnd;
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

  //#endregion

  //#region Load data in

  const [invoicePrint, setInvoicePrint] = useState({});
  const Trl_spInvoice_Print = async (row) => {
    let statusID = [2, 9, 11];
    setIsEmpty(false);
    if ((row._original.GroupId || 0) === 0) {
      let PrinterData = row._original;
      PrinterData.TotalInvoiceGroup = 1;
      PrinterData.PriceNL = PrinterData.PriceTourNL;
      PrinterData.PriceTE = PrinterData.PriceTourTE;
      PrinterData.PriceTN = PrinterData.PriceTourTN;
      /* PrinterData.Payment3 =
        PrinterData.Payment3 +
        PrinterData.Payment4 +
        PrinterData.Payment5 +
        PrinterData.Payment6; */

      //đếm số lần thu, titlepay 1, titlepay 2
      let _countPayment = 0,
        _sumPayment1 = 0,
        _sumPayment2 = 0,
        _titlePay1 = "",
        _titlePay2 = "";
      if ((PrinterData.Payment6 || 0) > 0) {
        _countPayment = 6;
        _titlePay1 = "Lần 1-5";
        _sumPayment1 =
          PrinterData.Payment1 +
          PrinterData.Payment2 +
          PrinterData.Payment3 +
          PrinterData.Payment4 +
          PrinterData.Payment5;
        _titlePay2 = "Lần 6";
        _sumPayment2 = PrinterData.Payment6;
      } else if ((PrinterData.Payment5 || 0) > 0) {
        _countPayment = 5;
        _titlePay1 = "Lần 1-4";
        _sumPayment1 =
          PrinterData.Payment1 +
          PrinterData.Payment2 +
          PrinterData.Payment3 +
          PrinterData.Payment4;
        _titlePay2 = "Lần 5";
        _sumPayment2 = PrinterData.Payment5;
      } else if ((PrinterData.Payment4 || 0) > 0) {
        _countPayment = 4;
        _titlePay1 = "Lần 1-3";
        _sumPayment1 =
          PrinterData.Payment1 + PrinterData.Payment2 + PrinterData.Payment3;
        _titlePay2 = "Lần 4";
        _sumPayment2 = PrinterData.Payment4;
      } else if ((PrinterData.Payment3 || 0) > 0) {
        _countPayment = 3;
        _titlePay1 = "Lần 1-2";
        _sumPayment1 = PrinterData.Payment1 + PrinterData.Payment2;
        _titlePay2 = "Lần 3";
        _sumPayment2 = PrinterData.Payment3;
      } else if ((PrinterData.Payment2 || 0) > 0) {
        _countPayment = 2;
        _titlePay1 = "Lần 1";
        _sumPayment1 = PrinterData.Payment1;
        _titlePay2 = "Lần 2";
        _sumPayment2 = PrinterData.Payment2;
      } else if ((PrinterData.Payment1 || 0) > 0) {
        _countPayment = 1;
        _titlePay1 = "Lần 1";
        _sumPayment1 = PrinterData.Payment1;
        _titlePay2 = "";
        _sumPayment2 = 0;
      } else _countPayment = 0;

      PrinterData.CountPayment = _countPayment;
      PrinterData.SumPayment1 = _sumPayment1;
      PrinterData.TitlePayment1 = _titlePay1;
      PrinterData.SumPayment2 = _sumPayment2;
      PrinterData.TitlePayment2 = _titlePay2;
      PrinterData.StatusId1 = row._original?.StatusId1 || 0;
      PrinterData.StatusId2 = row._original?.StatusId2 || 0;
      PrinterData.StatusId3 = row._original?.StatusId3 || 0;
      PrinterData.StatusId4 = row._original?.StatusId4 || 0;
      PrinterData.StatusId5 = row._original?.StatusId5 || 0;
      PrinterData.StatusId6 = row._original?.StatusId6 || 0;
      if (!statusID.includes(PrinterData.StatusId1)) {
        PrinterData.Payment1 = 0;
      }
      if (!statusID.includes(PrinterData.StatusId2)) {
        PrinterData.Payment2 = 0;
      }
      if (!statusID.includes(PrinterData.StatusId3)) {
        PrinterData.Payment3 = 0;
      }
      if (!statusID.includes(PrinterData.StatusId4)) {
        PrinterData.Payment4 = 0;
      }
      if (!statusID.includes(PrinterData.StatusId5)) {
        PrinterData.Payment5 = 0;
      }
      if (!statusID.includes(PrinterData.StatusId6)) {
        PrinterData.Payment6 = 0;
      }
      PrinterData.Phone = PrinterData.Phone || row._original.Phone;
      await setInvoicePrint(PrinterData);
      setIsPrint(moment(new Date()).seconds());
    } else {
      let PrinterData = state.dataThu.find(
        (p) => p.InvoiceId === row._original.GroupId
      );

      let GroupPrint =
        state.dataThu.filter((p) => p.GroupId === row._original.GroupId) || [];
      PrinterData.TotalInvoiceGroup = GroupPrint.length;

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
      PrinterData.BookingCode = GroupPrint[0].BookingCode;
      PrinterData.ServiceName = GroupPrint[0].ServiceName;
      PrinterData.TotalDate = GroupPrint[0].TotalDate;
      PrinterData.TimeStart = GroupPrint[0].TimeStart;
      PrinterData.TimeEnd = GroupPrint[0].TimeEnd;
      PrinterData.Brithday = PrinterData.Brithday || GroupPrint[0].Brithday;
      PrinterData.Phone = PrinterData.Phone || row._original.Phone;
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

      //đếm số lần thu, titlepay 1, titlepay 2
      let _countPayment = 0,
        _sumPayment1 = 0,
        _sumPayment2 = 0,
        _titlePay1 = "",
        _titlePay2 = "";
      if ((PrinterData.Payment6 || 0) > 0) {
        _countPayment = 6;
        _titlePay1 = "Lần 1-5";
        _sumPayment1 =
          PrinterData.Payment1 +
          PrinterData.Payment2 +
          PrinterData.Payment3 +
          PrinterData.Payment4 +
          PrinterData.Payment5;
        _titlePay2 = "Lần 6";
        _sumPayment2 = PrinterData.Payment6;
      } else if (
        (PrinterData.Payment5 || 0) > 0 &&
        (PrinterData.Payment6 || 0) === 0
      ) {
        _countPayment = 5;
        _titlePay1 = "Lần 1-4";
        _sumPayment1 =
          PrinterData.Payment1 +
          PrinterData.Payment2 +
          PrinterData.Payment3 +
          PrinterData.Payment4;
        _titlePay2 = "Lần 5";
        _sumPayment2 = PrinterData.Payment5;
      } else if (
        (PrinterData.Payment4 || 0) > 0 &&
        (PrinterData.Payment5 || 0) === 0
      ) {
        _countPayment = 4;
        _titlePay1 = "Lần 1-3";
        _sumPayment1 =
          PrinterData.Payment1 + PrinterData.Payment2 + PrinterData.Payment3;
        _titlePay2 = "Lần 4";
        _sumPayment2 = PrinterData.Payment4;
      } else if (
        (PrinterData.Payment3 || 0) > 0 &&
        (PrinterData.Payment4 || 0) === 0
      ) {
        _countPayment = 3;
        _titlePay1 = "Lần 1-2";
        _sumPayment1 = PrinterData.Payment1 + PrinterData.Payment2;
        _titlePay2 = "Lần 3";
        _sumPayment2 = PrinterData.Payment3;
      } else if (
        (PrinterData.Payment2 || 0) > 0 &&
        (PrinterData.Payment3 || 0) === 0
      ) {
        //TT lần 2
        _countPayment = 2;
        _titlePay1 = "Lần 1";
        _sumPayment1 = PrinterData.Payment1;
        _titlePay2 = "Lần 2";
        _sumPayment2 = PrinterData.Payment2;
      } else if (
        (PrinterData.Payment1 || 0) > 0 &&
        (PrinterData.Payment2 || 0) === 0
      ) {
        //TT lần 1
        _countPayment = 1;
        _titlePay1 = "Lần 1";
        _sumPayment1 = PrinterData.Payment1;
        _titlePay2 = "";
        _sumPayment2 = 0;
      } else _countPayment = 0;
      PrinterData.CountPayment = _countPayment;
      PrinterData.SumPayment1 = _sumPayment1;
      PrinterData.TitlePayment1 = _titlePay1;
      PrinterData.SumPayment2 = _sumPayment2;
      PrinterData.TitlePayment2 = _titlePay2;
      PrinterData.StatusId1 = row._original?.StatusId1 || 0;
      PrinterData.StatusId2 = row._original?.StatusId2 || 0;
      PrinterData.StatusId3 = row._original?.StatusId3 || 0;
      PrinterData.StatusId4 = row._original?.StatusId4 || 0;
      PrinterData.StatusId5 = row._original?.StatusId5 || 0;
      PrinterData.StatusId6 = row._original?.StatusId6 || 0;
      if (!statusID.includes(PrinterData.StatusId1)) {
        PrinterData.Payment1 = 0;
      }
      if (!statusID.includes(PrinterData.StatusId2)) {
        PrinterData.Payment2 = 0;
      }
      if (!statusID.includes(PrinterData.StatusId3)) {
        PrinterData.Payment3 = 0;
      }
      if (!statusID.includes(PrinterData.StatusId4)) {
        PrinterData.Payment4 = 0;
      }
      if (!statusID.includes(PrinterData.StatusId5)) {
        PrinterData.Payment5 = 0;
      }
      if (!statusID.includes(PrinterData.StatusId6)) {
        PrinterData.Payment6 = 0;
      }
      PrinterData.Phone = PrinterData.Phone || GroupPrint[0].Phone;

      await setInvoicePrint(PrinterData);
      setIsPrint(moment(new Date()).seconds());
    }
  };
  const Trl_spInvoice_Print_Empty = async () => {
    setIsEmpty(true);
    await setInvoicePrint({ empty: "" });
    setIsPrint(moment(new Date()).seconds());
  };

  //#endregion

  //#region Table Phiếu thu

  const [activeGroupModal, setActiveGroupModal] = useState(0);
  const handleShowGroup = (e) => setActiveGroupModal(Math.random());

  const [GroupInvoice, setGroupInvoice] = useState({
    Invoices: [],
    ExpenseId: 0,
    ExpenseCode: "",
    GroupCode: "",
    GroupId: 0,
  });

  const handleGroupFamily = (t) => {
    if (t === 1) {
      let datas = state.dataThu.filter((item) => item.isChecked === true);
      if (datas.length === 0) {
        Alertwarning("Bạn chưa chọn phiếu thu");
        return;
      } else if (datas.length === 1) {
        Alertwarning("Bạn cần chọn ít nhất 2 phiếu thu để tạo nhóm");
        return;
      } else {
        let rd = Math.floor(Math.random() * 100000);
        let newVal = datas.map((item) => {
          if (item.isChecked === true) {
            return { ...item, isChecked: false }; //, GroupFamily: gr
          }
          return { ...item, isChecked: false };
        });
        let strcode = "";
        if (datas.length > 3) {
          strcode =
            datas[0].InvoiceCode.substring(9, 11) +
            "->" +
            datas[datas.length - 1].InvoiceCode.substring(9, 11);
        } else {
          strcode =
            datas?.reduce(
              (a, v) => (a = a + v.InvoiceCode.substring(9, 11)),
              ""
            ) || "";
        }
        let s = "PT" + format(new Date(), "ddMMyy") + "-" + strcode + "-F";
        //setData(newVal);
        setGroupInvoice({ ...GroupInvoice, GroupCode: s, Invoices: newVal });
        handleShowGroup(true);
        setActiveGroupModal(rd);
      }
    }
    if (t === 2) {
      let datas = state.dataDxTour.filter((item) => item.isChecked === true);
      if (datas.length === 0) {
        Alertwarning("Bạn chưa chọn phiếu đề xuất");
        return;
      } else if (datas.length === 1) {
        Alertwarning("Bạn cần chọn ít nhất 2 phiếu đề xuất để tạo nhóm");
        return;
      } else {
        let rd = Math.floor(Math.random() * 100000);
        let newVal = datas.map((item) => {
          if (item.isChecked === true) {
            //let gr = item.value === 1 ? rd : 0;
            return { ...item, isChecked: false }; //, GroupFamily: gr
          }
          return { ...item, isChecked: false };
        });
        //setData(newVal);
        setGroupInvoice({ ...GroupInvoice, Invoices: newVal });
        handleShowGroup(true);
        setActiveGroupModal(rd);
      }
    }
    if (t === 3) {
      let datas = state.dataDxNb.filter((item) => item.isChecked === true);
      if (datas.length === 0) {
        Alertwarning("Bạn chưa chọn PNB");
        return;
      } else if (datas.length === 1) {
        Alertwarning("Bạn cần chọn ít nhất 2 PNB để tạo nhóm");
        return;
      } else {
        let rd = Math.floor(Math.random() * 100000);
        let newVal = datas.map((item) => {
          if (item.isChecked === true) {
            //let gr = item.value === 1 ? rd : 0;
            return { ...item, isChecked: false }; //, GroupFamily: gr
          }
          return { ...item, isChecked: false };
        });
        //setData(newVal);
        setGroupInvoice({ ...GroupInvoice, Invoices: newVal });
        handleShowGroup(true);
        setActiveGroupModal(rd);
      }
    }
  };

  const [IsStrCheck, setIsStrCheck] = useState("");
  const onCheckData = (row, e, t) => {
    if (t === 1) {
      let countcheck = state.dataThu.filter(
        (p) => p.StrCheck === IsStrCheck && p.InvoiceId !== row.InvoiceId
      ).length;
      if (e === true) {
        setIsStrCheck(row.StrCheck);
      } else {
        if (countcheck === 0) setIsStrCheck("");
      }
      let temp = state.dataThu.map((item) => {
        if (item.InvoiceId === row.InvoiceId) return { ...item, isChecked: e };
        return item;
      });
      //setDataShow(temp);
      setState({ ...state, dataThu: temp });
    }
    if (t === 2) {
      let countcheck = state.dataDxTour.filter(
        (p) => p.StrCheck === IsStrCheck && p.InvoiceId !== row.InvoiceId
      ).length;
      if (e === true) {
        setIsStrCheck(row.StrCheck);
      } else {
        if (countcheck === 0) setIsStrCheck("");
      }
      let temp = state.dataDxTour.map((item) => {
        if (item.InvoiceId === row.InvoiceId) return { ...item, isChecked: e };
        return item;
      });
      setState({ ...state, dataDxTour: temp });
    }
    if (t === 3) {
      let countcheck = state.dataDxNb.filter(
        (p) => p.StrCheck === IsStrCheck && p.InvoiceId !== row.InvoiceId
      ).length;
      if (e === true) {
        setIsStrCheck(row.StrCheck);
      } else {
        if (countcheck === 0) setIsStrCheck("");
      }
      let temp = state.dataDxNb.map((item) => {
        if (item.InvoiceId === row.InvoiceId) return { ...item, isChecked: e };
        return item;
      });
      setState({ ...state, dataDxNb: temp });
    }
  };

  const Trl_spInvoice_ChangeStatus = async (row) => {
    try {
      let pr = {
        InvoiceId: row._original.InvoiceId,
        Creater: Creater,
        IsConfirm: !row._original.IsConfirm,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_ChangeStatus",
      };

      const respone = await mainAction.API_spCallServer(params, dispatch);

      if (respone.Status === "OK") {
        Alertsuccess(respone.ReturnMess);
        let newData = state.dataThu.map((item) => {
          if (item.InvoiceId === row._original.InvoiceId) {
            if (item.InvoiceId1 === row._original.InvoiceId)
              return {
                ...item,
                IsConfirm: !row._original.IsConfirm,
                IsConfirm1: !row._original.IsConfirm,
              };
            if (item.InvoiceId2 === row._original.InvoiceId)
              return {
                ...item,
                IsConfirm: !row._original.IsConfirm,
                IsConfirm2: !row._original.IsConfirm,
              };
            if (item.InvoiceId3 === row._original.InvoiceId)
              return {
                ...item,
                IsConfirm: !row._original.IsConfirm,
                IsConfirm3: !row._original.IsConfirm,
              };
          }
          return item;
        });
        setState({ ...state, dataThu: newData });
      } else {
        Alertwarning(respone.ReturnMess);
      }
    } catch (error) {
      ;
    }
  };

  const columns = [
    {
      Header: () => (
        <div>
          <button
            title="Xuất hóa đơn tổng"
            className="btn bg-sky btn-sm w-100 text-white"
            onClick={(e) => handleGroupFamily(1)}
          >
            <i class="fas fa-clone"></i>
          </button>
        </div>
      ),
      sortable: false,
      accessor: "Checked",
      textAlign: "center",
      disableResizing: true,
      width: 50,
      Cell: ({ row }) =>
        row._original.hideCheckBox === 0 &&
        (IsStrCheck === "" || row._original.StrCheck === IsStrCheck) && (
          <>
            <input
              type="checkbox"
              checked={row._original.isChecked || false}
              onChange={(e) => onCheckData(row._original, e.target.checked, 1)}
            />
          </>
        ),
      getResizerProps: () => {},
      sticky: "left",
      fixed: "left",
    },
    {
      Header: "XÁC NHẬN",
      accessor: "Edit",
      sortable: false,
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
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
          {(row._original.AllowPrint || 0) === 1 && (
            <button
              className="btn btn-sm btn-warning margin-left-5"
              onClick={(e) => Trl_spInvoice_Print(row)}
            >
              {" "}
              <i class="fa fa-print"></i>
            </button>
          )}
        </div>
      ),
      minWidth: 140,
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
      Header: "Mã Tour",
      accessor: "BookingCode",
      width: 250,
      Cell: ({ row }) => (
        <>
          <span className="uppercase">
            {row._original?.BookingCode?.length > 0
              ? row._original?.BookingCode
              : "Dịch vụ khác"}
          </span>
        </>
      ),
    },
    {
      Header: "Khách hàng",
      accessor: "ObName",
      width: 250,
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
      width: 200,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.IsConfirm;
        let kcheck = "badge badge-warning p-2 cursor-pointer";
        if (fls) kcheck = "badge badge-success  p-2 cursor-pointer";
        // if (fls === 3) kcheck = "badge badge-warning";
        return (
          <span
            className={kcheck}
            onClick={(e) => Trl_spInvoice_ChangeStatus(row)}
          >
            {FormatMoney(row._original.TotalMoney)}
          </span>
        );
      },
      Footer: (columnProps) => {
        let data = state.dataThu.filter(
          (p) =>
            p.StatusFilter === state.statusFilterA &&
            p.TypeOfReceipt !== "PHIEUTHUNHOMAC"
        );
        const sumWithInitial = data.reduce(
          (accumulator, currentValue) => accumulator + currentValue.TotalMoney,
          0
        );
        return (
          <span className="bold">
            {" "}
            {Creater === 15 ||
            Creater === 18 ||
            Creater === 24 ||
            Creater === 40 ||
            Creater === 61 ||
            Creater === 1
              ? FormatMoney(sumWithInitial, 0)
              : ""}
          </span>
        );
      },
    },
    {
      Header: "Payment1",
      accessor: "Payment1",
      width: 200,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.IsConfirm1;
        let kcheck = "badge badge-warning";
        if (fls) kcheck = "badge badge-success";
        return (
          <span className={kcheck}>{FormatMoney(row._original.Payment1)}</span>
        );
      },
    },
    {
      Header: "Payment2",
      accessor: "Payment2",
      width: 200,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.IsConfirm2;
        let kcheck = "badge badge-warning";
        if (fls) kcheck = "badge badge-success";
        return (
          <span className={kcheck}>{FormatMoney(row._original.Payment2)}</span>
        );
      },
    },
    {
      Header: "Payment3",
      accessor: "Payment3",
      width: 200,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.IsConfirm3;
        let kcheck = "badge badge-warning";
        if (fls) kcheck = "badge badge-success";
        return (
          <span className={kcheck}>{FormatMoney(row._original.Payment3)}</span>
        );
      },
    },
    {
      Header: "Payment4",
      accessor: "Payment4",
      width: 200,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.IsConfirm4;
        let kcheck = "badge badge-warning";
        if (fls) kcheck = "badge badge-success";
        return (
          <span className={kcheck}>{FormatMoney(row._original.Payment4)}</span>
        );
      },
    },
    {
      Header: "Payment5",
      accessor: "Payment5",
      width: 200,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.IsConfirm5;
        let kcheck = "badge badge-warning";
        if (fls) kcheck = "badge badge-success";
        return (
          <span className={kcheck}>{FormatMoney(row._original.Payment5)}</span>
        );
      },
    },
    {
      Header: "Payment6",
      accessor: "Payment6",
      width: 200,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.IsConfirm6;
        let kcheck = "badge badge-warning";
        if (fls) kcheck = "badge badge-success";
        return (
          <span className={kcheck}>{FormatMoney(row._original.Payment6)}</span>
        );
      },
    },
    {
      Header: "Đối tượng",
      accessor: "ObjectName",
      with: 200,
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

  //#endregion

  //#region Table Phiếu đề xuất

  const columns2 = [
    {
      Header: "XÁC NHẬN",
      accessor: "Edit",
      sortable: false,
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
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
          {(row._original.AllowPrint || 0) === 1 && (
            <button
              className="btn btn-sm btn-warning margin-left-5"
              onClick={(e) => Trl_spInvoice_Print(row)}
            >
              {" "}
              <i class="fa fa-print"></i>
            </button>
          )}
        </div>
      ),
      width: 100,
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
            {row._original.InvoiceCode}{" "}
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
    },
    {
      Header: "Phòng ban",
      accessor: "DepartmentName",
      width: 200,
    },
    {
      Header: "Nội dung",
      accessor: "Decscription",
      fixed: "left",
      width: 300,
    },
    {
      Header: "Đối tượng thụ hưởng",
      accessor: "ObName",
      width: 250,
    },

    {
      Header: "Mã Tour",
      accessor: "BookingCode",
      width: 250,
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

  //#endregion

  //#region Table Phiếu nội bộ

  const columns3 = [
    /* {
      Header: () => (
        <div>
          <button
            title="Xuất hóa đơn tổng"
            className="btn bg-sky btn-sm w-100 text-white"
            onClick={(e) => handleGroupFamily(3)}
          >
            <i class="fas fa-clone"></i>
          </button>
        </div>
      ),
      sortable: false,
      accessor: "Checked",
      textAlign: "center",
      disableResizing: true,
      width: 50,
      Cell: ({ row }) =>
        row._original.hideCheckBox === 0 &&
        (IsStrCheck === "" || row._original.StrCheck === IsStrCheck) && (
          <>
            <input
              type="checkbox"
              checked={row._original.isChecked || false}
              onChange={(e) => onCheckData(row._original, e.target.checked, 3)}
            />
          </>
        ),
      getResizerProps: () => {},
      sticky: "left",
      fixed: "left",
    }, */
    {
      Header: "XÁC NHẬN",
      accessor: "Edit",
      sortable: false,
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
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
          {(row._original.AllowPrint || 0) === 1 && (
            <button
              className="btn btn-sm btn-warning margin-left-5"
              onClick={(e) => Trl_spInvoice_Print(row)}
            >
              {" "}
              <i class="fa fa-print"></i>
            </button>
          )}
        </div>
      ),
      width: 100,
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
            {row._original.InvoiceCode}{" "}
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
      width: 300,
    },
    {
      Header: "Đối tượng thụ hưởng",
      accessor: "ObName",
      width: 250,
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
    },
    {
      Header: "Số tài khoản",
      accessor: "BankAccount",
      width: 200,
    },
    {
      Header: "Ghi chú",
      accessor: "Notes",
      width: 300,
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

  //#endregion

  //#region Form xác nhận

  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = (title = "Bạn có chắc chắn muốn tắt form không?") => {
    ConfirmAlert(title, "", async () => {
      setIsOpen(false);
    });
  };

  //#endregion
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
                    setIsStrCheck("");
                  }}
                >
                  TRA SOÁT TỔNG
                </a>
              </div>
              <div class="col-sm-12 col-md-9 margin-top-5s">
                <button
                  disabled={
                    (state.dataThu.length > 0 && state.isShow === 1) ||
                    (state.dataDxTour.length > 0 && state.isShow === 2) ||
                    (state.dataDxNb.length > 0 && state.isShow === 3)
                      ? false
                      : true
                  }
                  onClick={Trl_spInvoice_Excel}
                  type="button"
                  class="btn btn-sm btn-success pull-right margin-left-5"
                >
                  <i class="fa fa-download pr-2"></i>
                  Excel
                </button>
                <button
                  onClick={(e) => {
                    Trl_spInvoice_List("D");
                    setIsStrCheck("");
                    setTitleShow("Tất cả phiếu thu");
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
            {state.isShow === 0 && (
              <>
                <div className="row">
                  <div className="col-md-4 col-sm-4">
                    <div class="table-responsive">
                      <DataTable
                        data={state.dataNew.filter(
                          (p) => p.InvoiceType === "A"
                        )}
                        columns={[
                          {
                            Header: (
                              <>
                                <span
                                  onClick={(e) => {
                                    Trl_spInvoice_List("A");
                                  }}
                                  className="cursor-pointer"
                                >
                                  {"PHIẾU THU (" +
                                    state.dataNew.filter(
                                      (p) => p.InvoiceType === "A"
                                    ).length +
                                    ")"}
                                </span>
                              </>
                            ),
                            accessor: "InvoiceCode",
                            sortable: false,
                          },
                        ]}
                        IsSearch={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <div class="table-responsive">
                      <DataTable
                        data={state.dataNew.filter(
                          (p) => p.InvoiceType === "B"
                        )}
                        columns={[
                          {
                            Header: (
                              <>
                                <span
                                  onClick={(e) => {
                                    Trl_spInvoice_List("B");
                                  }}
                                  className="cursor-pointer"
                                >
                                  {"PHIẾU PĐX (" +
                                    state.dataNew.filter(
                                      (p) => p.InvoiceType === "B"
                                    ).length +
                                    ")"}
                                </span>
                              </>
                            ),
                            accessor: "InvoiceCode",
                            sortable: false,
                          },
                        ]}
                        IsSearch={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <div class="table-responsive">
                      <DataTable
                        data={state.dataNew.filter(
                          (p) => p.InvoiceType === "C"
                        )}
                        columns={[
                          {
                            Header: (
                              <>
                                <span
                                  onClick={(e) => {
                                    Trl_spInvoice_List("C");
                                  }}
                                  className="cursor-pointer"
                                >
                                  {"PHIẾU PNB (" +
                                    state.dataNew.filter(
                                      (p) => p.InvoiceType === "C"
                                    ).length +
                                    ")"}
                                </span>
                              </>
                            ),
                            accessor: "InvoiceCode",
                            sortable: false,
                          },
                        ]}
                        IsSearch={true}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {state.isShow === 1 && (
              <>
                <div className="row">
                  <div
                    className="col-12 col-sm-6 col-md-3 cursor"
                    onClick={(e) => {
                      setState({ ...state, statusFilterA: 1 });
                    }}
                  >
                    <div className="info-box">
                      <span className="info-box-icon bg-info elevation-1">
                        <i className="fas fa-th-list"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">TỔNG PT CHỜ</span>
                        <span className="info-box-number float-left">
                          {
                            state.dataThu.filter(
                              (p) =>
                                p.StatusFilter === 1 &&
                                p.TypeOfReceipt !== "PHIEUTHUNHOMAC"
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12 col-sm-6 col-md-3 cursor"
                    onClick={(e) => {
                      setState({ ...state, statusFilterA: 3 });
                    }}
                  >
                    <div className="info-box mb-3">
                      <span className="info-box-icon bg-success elevation-1">
                        <i className="fas fa-check"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">ĐÃ DUYỆT</span>
                        <span className="info-box-number">
                          {
                            state.dataThu.filter(
                              (p) =>
                                p.StatusFilter === 3 &&
                                p.TypeOfReceipt !== "PHIEUTHUNHOMAC"
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12 col-sm-6 col-md-3 cursor"
                    onClick={(e) => {
                      setState({ ...state, statusFilterA: 2 });
                    }}
                  >
                    <div className="info-box mb-3">
                      <span className="info-box-icon bg-warning elevation-1">
                        <i className="fas fa-file"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">ĐANG TREO</span>
                        <span className="info-box-number">
                          {
                            state.dataThu.filter(
                              (p) =>
                                p.StatusFilter === 2 &&
                                p.TypeOfReceipt !== "PHIEUTHUNHOMAC"
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12 col-sm-6 col-md-3 cursor"
                    onClick={(e) => {
                      setState({ ...state, statusFilterA: 4 });
                    }}
                  >
                    <div className="info-box mb-3">
                      <span className="info-box-icon bg-danger elevation-1">
                        <i className="fas fa-undo"></i>
                      </span>

                      <div className="info-box-content">
                        <span className="info-box-text">TRẢ LẠI</span>
                        <span className="info-box-number">
                          {
                            state.dataThu.filter(
                              (p) =>
                                p.StatusFilter === 4 &&
                                p.TypeOfReceipt !== "PHIEUTHUNHOMAC"
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div className="card">
                    <div class="card-header d-flex">
                      <div class="d-flex">
                        <div class="font-weight-bold text-muted">
                          PHIẾU THU {state.statusFilterA === 1 && " - CHỜ "}
                          {state.statusFilterA === 2 && " - ĐANG TREO "}
                          {state.statusFilterA === 3 && " - ĐÃ DUYỆT "}
                          {state.statusFilterA === 4 && " - TRẢ LẠI "}(
                          {
                            state.dataThu.filter(
                              (p) =>
                                p.StatusFilter === state.statusFilterA &&
                                p.TypeOfReceipt !== "PHIEUTHUNHOMAC"
                            ).length
                          }
                          )
                          <TooltipCustom content={"In phiếu thu trắng"}>
                            <i
                              class="fa fa-print text-primary ml-3 cursor-pointer"
                              onClick={(e) => Trl_spInvoice_Print_Empty()}
                            ></i>
                          </TooltipCustom>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-1 pl-0">
                      <div className="col-md-12">
                        <div class="table-responsive">
                          <DataTable
                            data={state.dataThu.filter(
                              (p) =>
                                p.StatusFilter === state.statusFilterA &&
                                p.TypeOfReceipt !== "PHIEUTHUNHOMAC"
                            )}
                            columns={columns}
                            IsSearch={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {state.isShow === 2 && (
              <>
                <div className="row">
                  <div
                    className="col-12 col-sm-6 col-md-3 cursor"
                    onClick={(e) => {
                      setState({ ...state, statusFilterB: 1 });
                    }}
                  >
                    <div className="info-box">
                      <span className="info-box-icon bg-info elevation-1">
                        <i className="fas fa-th-list"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">
                          TỔNG PHIẾU PĐX CHỜ
                        </span>
                        <span className="info-box-number float-left">
                          {
                            state.dataDxTour.filter((p) => p.StatusFilter === 1)
                              .length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12 col-sm-6 col-md-3 cursor"
                    onClick={(e) => {
                      setState({ ...state, statusFilterB: 3 });
                    }}
                  >
                    <div className="info-box mb-3">
                      <span className="info-box-icon bg-success elevation-1">
                        <i className="fas fa-check"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">ĐÃ DUYỆT</span>
                        <span className="info-box-number">
                          {
                            state.dataDxTour.filter((p) => p.StatusFilter === 3)
                              .length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12 col-sm-6 col-md-3 cursor"
                    onClick={(e) => {
                      setState({ ...state, statusFilterB: 2 });
                    }}
                  >
                    <div className="info-box mb-3">
                      <span className="info-box-icon bg-warning elevation-1">
                        <i className="fas fa-file"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">ĐANG TREO</span>
                        <span className="info-box-number">
                          {
                            state.dataDxTour.filter((p) => p.StatusFilter === 2)
                              .length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12 col-sm-6 col-md-3 cursor"
                    onClick={(e) => {
                      setState({ ...state, statusFilterB: 4 });
                    }}
                  >
                    <div className="info-box mb-3">
                      <span className="info-box-icon bg-danger elevation-1">
                        <i className="fas fa-undo"></i>
                      </span>

                      <div className="info-box-content">
                        <span className="info-box-text">TRẢ LẠI</span>
                        <span className="info-box-number">
                          {
                            state.dataDxTour.filter((p) => p.StatusFilter === 4)
                              .length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div className="card">
                    <div class="card-header d-flex">
                      <div class="d-flex">
                        <div class="font-weight-bold text-muted">
                          PHIẾU PĐX {state.statusFilterB === 1 && " - CHỜ "}
                          {state.statusFilterB === 2 && " - ĐANG TREO "}
                          {state.statusFilterB === 3 && " - ĐÃ DUYỆT "}
                          {state.statusFilterB === 4 && " - TRẢ LẠI "}(
                          {
                            state.dataDxTour.filter(
                              (p) => p.StatusFilter === state.statusFilterB
                            ).length
                          }
                          )
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-1 pl-0">
                      <div className="col-md-12">
                        <div class="table-responsive">
                          <DataTable
                            data={state.dataDxTour.filter(
                              (p) => p.StatusFilter === state.statusFilterB
                            )}
                            columns={columns2}
                            IsSearch={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {state.isShow === 3 && (
              <>
                <div className="row">
                  <div
                    className="col-12 col-sm-6 col-md-3 cursor"
                    onClick={(e) => {
                      setState({ ...state, statusFilterC: 1 });
                    }}
                  >
                    <div className="info-box">
                      <span className="info-box-icon bg-info elevation-1">
                        <i className="fas fa-th-list"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">
                          TỔNG PHIẾU PNB CHỜ
                        </span>
                        <span className="info-box-number float-left">
                          {
                            state.dataDxNb.filter((p) => p.StatusFilter === 1)
                              .length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12 col-sm-6 col-md-3 cursor"
                    onClick={(e) => {
                      setState({ ...state, statusFilterC: 3 });
                    }}
                  >
                    <div className="info-box mb-3">
                      <span className="info-box-icon bg-success elevation-1">
                        <i className="fas fa-check"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">ĐÃ DUYỆT</span>
                        <span className="info-box-number">
                          {
                            state.dataDxNb.filter((p) => p.StatusFilter === 3)
                              .length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12 col-sm-6 col-md-3 cursor"
                    onClick={(e) => {
                      setState({ ...state, statusFilterC: 2 });
                    }}
                  >
                    <div className="info-box mb-3">
                      <span className="info-box-icon bg-warning elevation-1">
                        <i className="fas fa-file"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">ĐANG TREO</span>
                        <span className="info-box-number">
                          {
                            state.dataDxNb.filter((p) => p.StatusFilter === 2)
                              .length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12 col-sm-6 col-md-3 cursor"
                    onClick={(e) => {
                      setState({ ...state, statusFilterC: 4 });
                    }}
                  >
                    <div className="info-box mb-3">
                      <span className="info-box-icon bg-danger elevation-1">
                        <i className="fas fa-undo"></i>
                      </span>

                      <div className="info-box-content">
                        <span className="info-box-text">TRẢ LẠI</span>
                        <span className="info-box-number">
                          {
                            state.dataDxNb.filter((p) => p.StatusFilter === 4)
                              .length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div className="card">
                    <div class="card-header d-flex">
                      <div class="d-flex">
                        <div class="font-weight-bold text-muted">
                          PHIẾU PNB {state.statusFilterC === 1 && " - CHỜ "}
                          {state.statusFilterC === 2 && " - ĐANG TREO "}
                          {state.statusFilterC === 3 && " - ĐÃ DUYỆT "}
                          {state.statusFilterC === 4 && " - TRẢ LẠI "}(
                          {
                            state.dataDxNb.filter(
                              (p) => p.StatusFilter === state.statusFilterC
                            ).length
                          }
                          )
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-1 pl-0">
                      <div className="col-md-12">
                        <div class="table-responsive">
                          <DataTable
                            data={state.dataDxNb.filter(
                              (p) => p.StatusFilter === state.statusFilterC
                            )}
                            columns={columns3}
                            IsSearch={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
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
              {invoiceView?.InvoiceType === "A" && (
                <>
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
                            {/* Ngày sinh:{" "}
                            <span>
                              {FormatDateJson(invoiceView?.Brithday, 7) || ""}
                            </span> */}
                          </div>
                          <div className="col-sm-12 mt-1">
                            Điện thoại: {invoiceView?.Phone}
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
                            {FormatMoney(invoiceView?.TotalPrice || 0)} (Bằng
                            chữ:{" "}
                            {MoneyToText(
                              invoiceView?.TotalPrice || 0,
                              invoiceView?.TypeMoneyName || ""
                            )}
                            )
                          </div>
                          <div className="col-sm-12 mt-1">
                            <i>
                              Ghi chú: Sau khi đã áp dụng ưu đãi và phụ thu (nếu
                              có).
                            </i>
                          </div>
                          <div className="col-sm-3 mt-1">Cọc tour: x</div>
                          <div className="col-sm-3 mt-1 pl-0">
                            <input
                              style={{ width: "20px", height: "20px" }}
                              type="checkbox"
                              checked={(invoiceView?.Payment1 || 0) > 0}
                            />{" "}
                            Lần 1
                          </div>
                          <div className="col-sm-3 mt-1  pl-0">
                            <input
                              style={{ width: "20px", height: "20px" }}
                              type="checkbox"
                              checked={(invoiceView?.Payment2 || 0) > 0}
                            />{" "}
                            Lần 2
                          </div>
                          <div className="col-sm-3 mt-1  pl-0">
                            <input
                              style={{ width: "20px", height: "20px" }}
                              type="checkbox"
                              checked={(invoiceView?.Payment3 || 0) > 0}
                            />{" "}
                            Lần 3
                          </div>
                          <div className="col-sm-3 mt-1">Số tiền:</div>
                          <div className="col-sm-3 mt-1  pl-0">
                            {FormatMoney(invoiceView?.Payment1 || 0)}
                          </div>
                          <div className="col-sm-3 mt-1  pl-0">
                            {FormatMoney(invoiceView?.Payment2 || 0)}
                          </div>
                          <div className="col-sm-3 mt-1  pl-0">
                            {FormatMoney(invoiceView?.Payment3 || 0)}
                          </div>

                          <div className="clearfix"></div>
                          <div className="col-sm-12 row">
                            <div className="col-sm-3 mt-1"></div>
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
                          </div>
                          <div className="clearfix"></div>
                          <div className="col-sm-12 row ">
                            <div className="col-sm-3 mt-1"></div>
                            {(invoiceView?.Payment4 || 0) > 0 && (
                              <>
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
                          </div>
                          <div className="clearfix"></div>
                          <div className="col-sm-12 mt-1">
                            Còn lại: {FormatMoney(invoiceView?.TotalRemain)}
                            (Bằng chữ: {MoneyToText(invoiceView?.TotalRemain)})
                          </div>
                          <div className="col-sm-6 mt-1">
                            Phương thức thanh toán:{" "}
                            {invoiceView?.PaymentName || ""}
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
                        Trl_spInvoice_List("A");
                        setIsOpen(false);
                      }}
                      onInvoice={invoiceView}
                    />
                  </div>
                </>
              )}
              {invoiceView?.InvoiceType === "B" && (
                <>
                  <div className="col-sm-12">
                    <div className="row">
                      <div class="col-sm-12 text-center mt-2">
                        <span style={{ fontSize: "25px", fontWeight: 700 }}>
                          PĐX
                        </span>
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
                            Mã tour: {invoiceView?.BookingCode || ""}
                          </div>
                          <div className="col-sm-12">
                            Phương thức thanh toán{" "}
                            {invoiceView?.PaymentName || ""}
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
                            Đối tượng thanh toán:{" "}
                            {invoiceView?.NotePayment || ""}
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
                      reloadS={(e) => {
                        Trl_spInvoice_List("B");
                        setIsOpen(false);
                      }}
                      onInvoice={invoiceView}
                    />
                  </div>
                </>
              )}
              {invoiceView?.InvoiceType === "C" && (
                <>
                  <div className="col-sm-12">
                    <div className="row">
                      <div class="col-sm-12 text-center mt-2">
                        <span style={{ fontSize: "25px", fontWeight: 700 }}>
                          PNB
                        </span>
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
                            Phương thức thanh toán{" "}
                            {invoiceView?.PaymentName || ""}
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
                            Đối tượng thanh toán:{" "}
                            {invoiceView?.NotePayment || ""}
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
                      reloadS={(e) => {
                        Trl_spInvoice_List("C");
                        setIsOpen(false);
                      }}
                      onInvoice={invoiceView}
                      typeConfirm={"2"}
                    />
                  </div>
                </>
              )}
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

        <InvoiceGroupAc
          GroupInvoice={GroupInvoice.Invoices}
          GroupCode={GroupInvoice.GroupCode}
          isActive={activeGroupModal}
          reloadS={(e) => Trl_spInvoice_List("A")}
        />

        <div className="PrintInvoice" style={{ display: "none" }}>
          <InvoicePrint
            onInvoice={invoicePrint}
            onPrint={isPrint}
            isEmpty={isEmpty}
          />
        </div>
      </div>
    </>
  );
};

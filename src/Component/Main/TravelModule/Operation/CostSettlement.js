import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import Modal from "react-bootstrap/Modal";
import { DataTable, SelectServiceSale, UploadFile } from "../../../../Common";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  ConfirmAlert,
  ConvertFileName,
  FormatDateJson,
} from "../../../../Utils";
import Select from "react-select";
import moment from "moment";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { Button } from "react-bootstrap";
import { CostSettlementDetailTableComp } from "./CostSettlementDetailTableComp";
import { IMAGES_DOMAIN } from "../../../../Services";
import { CostSettlementDetailTableResComp } from "./CostSettlementDetailTableResComp";
import { CostSettlementDetailNoteComp } from "./CostSettlementDetailNoteTable";

export const CostSettlement = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");

  //#region Danh sách quyết toán chi phí

  useEffect(() => {
    Trl_spOperating_CostSettlement_List();
  }, []);

  const [data, setData] = useState([]);
  const [TimeSearch, setTimeSearch] = useState([
    new Date(
      moment(new Date().setDate(new Date().getDate() - 30)).startOf("date")
    ),
    new Date(moment(new Date()).endOf("date")),
  ]);
  const [TextSearch, setTextSearch] = useState("");

  const columns = [
    {
      Header: "Lựa chọn",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-sm btn-warning"
            onClick={(e) => {
              onDetail(row._original, false);
            }}
          >
            {" "}
            <i className="fa fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-success ml-1"
            onClick={(e) => {
              onDetail(row._original, true);
            }}
          >
            {" "}
            <i className="fa fa-copy"></i>
          </button>
          {row._original.AllowExport === 1 && (
            <button
              type="button"
              className="btn btn-sm btn-success ml-1"
              onClick={(e) => {
                Trl_spOperating_CostSettlement_Excel(row._original);
              }}
            >
              <i className="fa fa-download"></i>
            </button>
          )}
          {row._original.AllowDelete === 1 && (
            <button
              className="btn btn-sm btn-danger ml-1"
              onClick={(e) => {
                ConfirmAlert(
                  "Bạn có chắc chắn muốn xóa không ?",
                  "",
                  async () => {
                    Trl_spOperating_CostSettlement_Delete(row._original.CostId);
                  }
                );
              }}
            >
              {" "}
              <i className="fa fa-trash"></i>
            </button>
          )}
        </div>
      ),
      width: 150,
      fixed: "left",
    },
    {
      Header: "Thời gian tạo",
      accessor: "CreateTime",
      width: 160,
      fixed: "left",
      Cell: ({ row }) => {
        //spread the props
        return (
          <span>{FormatDateJson(row._original.CreateTime || "", 10)}</span>
        );
      },
    },
    {
      Header: "Hành trình",
      accessor: "ServiceSaleCode",
      width: 240,
      fixed: "left",
    },
    {
      Header: "Ngày khởi hành",
      accessor: "DateSaleFrom",
      width: 150,
      Cell: ({ row }) => {
        //spread the props
        return (
          <span>{FormatDateJson(row._original.DateSaleFrom || "", 3)}</span>
        );
      },
    },
    {
      Header: "Số lượng KH",
      accessor: "TotalCustomer",
      width: 150,
    },
    {
      Header: "Hướng dẫn viên",
      accessor: "TourGuide",
      width: 200,
    },
    {
      Header: "CP Tạm ứng",
      accessor: "AdvanceMoney",
      width: 200,
    },
    {
      Header: "Tips HDV",
      accessor: "TourGuideTip",
      width: 200,
    },
    {
      Header: "CTP HDV:",
      accessor: "TourGuideCTP",
      width: 200,
    },
    {
      Header: "TIPS Tài Xế",
      accessor: "DriverTip",
      width: 200,
    },
    {
      Header: "Người tạo",
      accessor: "CreateName",
      width: 200,
    },
  ];

  const Trl_spOperating_CostSettlement_List = async () => {
    if (TimeSearch === undefined) {
      Alertwarning("Vui lòng chọn thời gian");
      return;
    }
    try {
      const pr = {
        Creater: Creater,
        CreateName: CreateName,
        TextSearch: TextSearch,
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
        func: "Trl_spOperating_CostSettlement_List",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      setData(list);
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  //#endregion

  //#region Xóa quyết toán cp
  const Trl_spOperating_CostSettlement_Delete = async (CostId) => {
    try {
      const pr = {
        Creater: Creater,
        CreateName: CreateName,
        CostId: CostId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_CostSettlement_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Trl_spOperating_CostSettlement_List();
        Alertsuccess("Thành công");
        closeModal();
      } else Alerterror(result.Result);
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };
  //#endregion

  //#region Xuất excel danh sách quyết toán

  const Trl_spOperating_CostSettlement_Excel = async (dataExport) => {
    try {
      const pr = {
        Creater: Creater,
        CostId: dataExport.CostId,
      };
      const paramDetails = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_CostSettlement_Detail",
      };
      const list = await mainAction.API_spCallServer(paramDetails, dispatch);
      
      //#region Xử lý block Restaurant

      dataExport.Restaurant = list?.Restaurant || [];
      let restaurantSplit = onRestaurantSplit(list?.Restaurant || []);
      let _dataSummary = [...restaurantSplit, ...(list?.Details || [])];

      dataExport.RestaurantIncurred =
        _dataSummary.filter((p) => p.CostTypeId === 6) || [];

      //#endregion

      //#region Xử lý block Tourism

      dataExport.Tourism = onMerge(
        _dataSummary.filter((p) => p.CostTypeId === 2) || []
      );

      dataExport.TourismIncurred =
        _dataSummary.filter((p) => p.CostTypeId === 7) || [];

      //#endregion

      //#region Xử lý block Hotel

      dataExport.Hotel = onMerge(
        _dataSummary.filter((p) => p.CostTypeId === 3) || []
      );
      dataExport.HotelIncurred =
        _dataSummary.filter((p) => p.CostTypeId === 8) || [];

      //#endregion

      //#region Xử lý block Another

      dataExport.Another = _dataSummary.filter((p) => p.CostTypeId === 4) || [];

      //#endregion

      //#region Xử lý block TourGuideCost

      dataExport.TourGuideCost =
        _dataSummary.filter((p) => p.CostTypeId === 5) || [];

      //#endregion

      //#region Xử lý block Wrongs

      dataExport.Wrongs = _dataSummary.filter(
        (p) => p.Status === 2 || p.StatusDifferent === 2
      );

      //#endregion

      dataExport.FileName =
        "Eurotravel - Bảng quyết toán chi phí đi tour " +
        dataExport.ServiceSaleCode;

      const params = {
        Json: JSON.stringify(dataExport),
        func: "Trl_spOperating_CostSettlement_Excel",
      };

      const result = await mainAction.API_spCallExportExcel(params, dispatch);
      if (result.resultCode === 0) {
        const link = document.createElement("a");
        link.href = IMAGES_DOMAIN + result.Message;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  //#region Xử lý merge data to rows
  const onMerge = (tmp) => {
    let final = [];
    // for (let i = 0; i < tmp.length; i++) {}
    let i = 0;
    tmp.map((item, index) => {
      let check = final?.find(
        (p) => p.Date === item.DateCostNoFormat && p.Address === item.DateNotes
      );
      if (check === undefined) {
        final.push({
          Date: item.DateCostNoFormat,
          Address: item.DateNotes,
          Data: [item],
          indexCol: i,
        });
        i++;
      } else {
        ;
        let a = [...check.Data, item];
        final[check.indexCol].Data = a;
      }
    });
    return final;
  };
  //#endregion

  //#endregion

  //#region Detail

  const [dataDetail, setDataDetail] = useState({ ServiceSaleId: 0 });
  const [Restaurant, setRestaurant] = useState([]);
  const [Tourism, setTourism] = useState([]);
  const [Hotel, setHotel] = useState([]);
  const [Another, setAnother] = useState([]);
  const [Incurred1, setIncurred1] = useState([]);
  const [Incurred2, setIncurred2] = useState([]);
  const [Incurred3, setIncurred3] = useState([]);
  const [TourGuideCost, setTourGuideCost] = useState([]);
  const [Wrongs, setWrongs] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [Suspend, setSuspend] = useState([]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setDataDetail({ ApplicableCurrency: "USD", ExchangeCurrency: "USD" });
    setRestaurant([]);
    setTourism([]);
    setHotel([]);
    setAnother([]);
    setTourGuideCost([]);
    setIncurred1([]);
    setIncurred2([]);
    setIncurred3([]);
    setIsOpen(false);
  };

  const onDetail = async (item, isReplication = false) => {
    try {
      const pr = {
        Creater: Creater,
        CostId: item.CostId,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_CostSettlement_Detail",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      setRestaurant(list?.Restaurant || []);
      setTourism(list?.Details?.filter((p) => p.CostTypeId === 2) || []);
      setHotel(list?.Details?.filter((p) => p.CostTypeId === 3) || []);
      setAnother(list?.Details?.filter((p) => p.CostTypeId === 4) || []);
      setTourGuideCost(list?.Details?.filter((p) => p.CostTypeId === 5) || []);
      setIncurred1(list?.Details?.filter((p) => p.CostTypeId === 6) || []);
      setIncurred2(list?.Details?.filter((p) => p.CostTypeId === 7) || []);
      setIncurred3(list?.Details?.filter((p) => p.CostTypeId === 8) || []);

      let _dataSummary = [
        ...onRestaurantSplit(list?.Restaurant || []),
        ...(list?.Details || []),
      ];

      setSuspend(
        _dataSummary.filter((p) => p.Status === 1 && (p.RealCost || 0) !== 0)
      );

      let wr = _dataSummary.filter(
        (p) => p.Status === 2 || p.StatusDifferent === 2
      );
      setWrongs(wr);

      let ApplicableCurrency = TypeOfMoney.find(
        (i) => i.value === item.ApplicableCurrency
      );
      setDataDetail({
        ...item,
        CostId: isReplication ? 0 : item.CostId,
        ApplicableCurrency: ApplicableCurrency,
      });
      openModal();
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const onSumary = () => {
    let _dataSummary = [
      ...onRestaurantSplit(Restaurant),
      ...Tourism.filter((p) => p.IsDelete === "A"),
      ...Hotel.filter((p) => p.IsDelete === "A"),
      ...Another.filter((p) => p.IsDelete === "A"),
      ...Incurred1.filter((p) => p.IsDelete === "A"),
      ...Incurred2.filter((p) => p.IsDelete === "A"),
      ...Incurred3.filter((p) => p.IsDelete === "A"),
      ...TourGuideCost.filter((p) => p.IsDelete === "A"),
    ];

    //Treo
    setSuspend(_dataSummary.filter((p) => p.Status === 1));

    // K duyệt
    let wr = _dataSummary.filter(
      (p) => p.Status === 2 || p.StatusDifferent === 2
    );
    setWrongs(wr);
    let _totalWr = wr.reduce(
      (a, v) =>
        (a =
          a +
          (v.StatusDifferent === 2 ? v.MoneyDifferent || 0 : +v.RealCost || 0)),
      0
    );

    //CTP
    let _totalTCP =
      (+dataDetail.TourGuideCTP || 0) *
      ((+dataDetail?.TotalDayAdd || 0) + (+dataDetail.TotalDays || 0));

    //Tips
    let _totalTips =
      (+dataDetail.TourGuideTip || 0) *
      (+dataDetail?.TotalDayTips || 0) *
      (+dataDetail.TotalCustomerTips || 0);

    //hdv pay
    let _totalHDVPay = _dataSummary
      .filter(
        (p) => p.Status === 0 && (p.CostTypeId === 4 || p.CostTypeId === 5)
      )
      .reduce((a, v) => (a = a + (+v.RealCost || 0)), 0);

    let _totalPayment =
      _totalHDVPay +
      _totalTCP +
      _totalTips -
      dataDetail.AdvanceMoney -
      _totalWr;

    setDataDetail({
      ...dataDetail,
      TotalCTP: _totalTCP?.toFixed(2),
      TotalTips: _totalTips?.toFixed(2),
      TotalPayment: _totalPayment?.toFixed(2),
    });
  };

  //#region Xử lý data nhà hàng
  const onRestaurantSplit = (res) => {
    let _tmpRestaurant = res.filter((p) => p.IsDelete === "A");
    let finalRestaurant = [];
    _tmpRestaurant.map((item, index) => {
      finalRestaurant.push({
        DateCostNoFormat: item.DateCostNoFormat,
        DateCost: item.DateCost,
        CostTypeId: 1,
        CostTypeName: "NHÀ HÀNG",
        RealCost: item.RealCost1,
        RealNotes: item.DateNotes + " | SÁNG (ĂN)",
        Status: item.Status1,
        StatusDifferent: item.StatusDifferent1 || 0,
        MoneyDifferent:
          item.StatusDifferent1 === 2 && item.RealCost1 > item.EstCost1
            ? item.RealCost1 - item.EstCost1
            : 0,
        IsDelete: "A",
        TypePay: item.TypePay1,
        EstCost: item.EstCost1,
      });
      finalRestaurant.push({
        DateCostNoFormat: item.DateCostNoFormat,
        DateCost: item.DateCost,
        CostTypeId: 1,
        CostTypeName: "NHÀ HÀNG",
        RealCost: item.RealCost2,
        RealNotes: item.DateNotes + " | SÁNG (UỐNG)",
        Status: item.Status2,
        StatusDifferent: item.StatusDifferent2 || 0,
        MoneyDifferent:
          item.StatusDifferent2 === 2 && item.RealCost2 > item.EstCost2
            ? item.RealCost2 - item.EstCost2
            : 0,
        IsDelete: "A",
        TypePay: item.TypePay2,
        EstCost: item.EstCost2,
      });
      finalRestaurant.push({
        DateCostNoFormat: item.DateCostNoFormat,
        DateCost: item.DateCost,
        CostTypeId: 1,
        CostTypeName: "NHÀ HÀNG",
        RealCost: item.RealCost3,
        RealNotes: item.DateNotes + " | TỐI (ĂN)",
        Status: item.Status3,
        StatusDifferent: item.StatusDifferent3 || 0,
        MoneyDifferent:
          item.StatusDifferent3 === 2 && item.RealCost3 > item.EstCost3
            ? item.RealCost3 - item.EstCost3
            : 0,
        IsDelete: item.IsDelete,
        TypePay: item.TypePay3,
        EstCost: item.EstCost3,
      });
      finalRestaurant.push({
        DateCostNoFormat: item.DateCostNoFormat,
        DateCost: item.DateCost,
        CostTypeId: 1,
        CostTypeName: "NHÀ HÀNG",
        RealCost: item.RealCost4,
        RealNotes: item.DateNotes + " | TỐI (UỐNG)",
        Status: item.Status4,
        StatusDifferent: item.StatusDifferent4 || 0,
        MoneyDifferent:
          item.StatusDifferent4 === 2 && item.RealCost4 > item.EstCost4
            ? item.RealCost4 - item.EstCost4
            : 0,
        IsDelete: item.IsDelete,
        TypePay: item.TypePay4,
        EstCost: item.EstCost4,
      });
    });
    return finalRestaurant;
  };
  //#endregion

  //#endregion

  //#region Đính kèm file
  const [flagResetFile, setFlagResetFile] = useState(0);
  const [ImageUpload, setImageUpload] = useState([]);
  const [FileUpload, setFileUpload] = useState([]);

  const onChangeFileOrImage = (e, type) => {
    if (type === 0) setFileUpload(e);
    else setImageUpload(e);
  };

  //#endregion

  //#region Save data

  const Trl_spOperating_CostSettlement_Save = async () => {
    ConfirmAlert(
      "Bạn có chắc chắn muốn lưu BẢNG QUYẾT TOÁN CHI PHÍ ĐI TOUR ",
      "",
      async () => {
        try {
          /* if (Suspend?.length > 0) {
            Alertwarning("Không thể lưu vì có chi phí bị treo !");
            return;
          } */
          let listfile = "";
          if (FileUpload !== "" && FileUpload.length > 0) {
            const formData = new FormData();
            formData.append("Key", "Files1");
            for (let i = 0; i < FileUpload.length; i++) {
              let f = FileUpload[i];
              let renamedFile = new File([f], ConvertFileName(f.name), {
                type: f.type,
              });

              formData.append("myFile" + i, renamedFile);
            }
            const data = await mainAction.API_spCallPostFile(
              formData,
              dispatch
            );
            let _img = data.Message.replaceAll('"', "");
            listfile = _img.replace("[", "").replace("]", "");
          }
          let listimage = "";
          if (ImageUpload !== "" && ImageUpload.length > 0) {
            const formData = new FormData();
            formData.append("Key", "Files2");
            for (let i = 0; i < ImageUpload.length; i++) {
              formData.append("myFile" + i, ImageUpload[i]);
            }
            const data = await mainAction.API_spCallPostFile(
              formData,
              dispatch
            );
            let _img = data.Message.replaceAll('"', "");
            listimage = _img.replace("[", "").replace("]", "");
          }
          let newListFile = [dataDetail.AttackFile, listfile]
            .filter((p) => p !== "" && p !== undefined && p !== "undefined")
            .join(",");
          let newListImage = [dataDetail.AttackImage, listimage]
            .filter((p) => p !== "" && p !== undefined && p !== "undefined")
            .join(",");
          const pr = {
            Creater: Creater,
            CreateName: CreateName,
            TourGuide: dataDetail.TourGuide,
            TotalCustomer: dataDetail?.TotalCustomer || 0,
            TourGuideTip: dataDetail.TourGuideTip,
            TourGuideCTP: dataDetail.TourGuideCTP,
            DriverTip: dataDetail.DriverTip,
            AdvanceMoney: dataDetail.AdvanceMoney,
            //PayByCard: dataDetail.PayByCard,
            //PayByCash: dataDetail.PayByCash,
            //TotalSuspend: dataDetail.TotalSuspend,
            TotalPayment: dataDetail.TotalPayment,
            CostId: dataDetail.CostId || 0,
            ServiceSaleId: dataDetail.ServiceSaleId,
            TotalDayAdd: dataDetail?.TotalDayAdd || 0,
            TotalDays: dataDetail.TotalDays,
            TotalCTP: dataDetail.TotalCTP,
            TotalDayTips: dataDetail.TotalDayTips,
            TotalCustomerTips: dataDetail.TotalCustomerTips,
            TotalTips: dataDetail.TotalTips,
            ApplicableCurrency: dataDetail.ApplicableCurrency.value,
            //ExchangeCurrency: dataDetail.ExchangeCurrency.value,
            //ExchangeRate: dataDetail.ExchangeRate,
            List: [
              ...Tourism,
              ...Hotel,
              ...Another,
              ...TourGuideCost,
              ...Incurred1,
              ...Incurred2,
              ...Incurred3,
            ],
            ListRestaurant: Restaurant,
            AttackFile: newListFile,
            AttackImage: newListImage,
          };
          const params = {
            Json: JSON.stringify(pr),
            func: "Trl_spOperating_CostSettlement_Save_V1",
          };

          const result = await mainAction.API_spCallServer(params, dispatch);
          if (result.Status === "OK") {
            Trl_spOperating_CostSettlement_List();
            Alertsuccess("Thành công");
            closeModal();
          } else Alerterror(result.Result);
        } catch (error) {
          Alerterror("Lỗi, liên hệ IT");
          ;
        }
      }
    );
  };

  //#endregion

  //#region Quy đổi tiền tệ
  const TypeOfMoney = [
    { value: "VNĐ", label: "VNĐ", icon: "₫", idx: 2 },
    { value: "USD", label: "Đô la Mỹ - USD", icon: "$", idx: 1 },
    { value: "AUD", label: "Đô la Úc - AUD", icon: "AUD", idx: 1 },
    { value: "CAD", label: "Đô la Canada - CAD", icon: "CAD", idx: 1 },
    { value: "CHF", label: "Đồng Frank Thụy Sĩ - CHF", icon: "CHF", idx: 1 },
    { value: "EUR", label: "Đồng Euro - EUR", icon: "€", idx: 1 },
    { value: "NZD", label: "Đô la New Zealand - NZD", icon: "NZD", idx: 1 },
    { value: "GBP", label: "Bảng Anh - GBP", icon: "£", idx: 1 },
    { value: "SEK", label: "Đồng Thụy Điển - SEK", icon: "SEK", idx: 1 },
    { value: "DKK", label: "Đồng Đan Mạch - DKK", icon: "DKK", idx: 1 },
    { value: "NOK", label: "Krone Na Uy - NOK", icon: "NOK", idx: 1 },
    { value: "CZK", label: "Cron Séc - CZK", icon: "	Kč", idx: 1 },
    { value: "MXN", label: "Peso Mehico - MXN", icon: "	MXN", idx: 1 },
    { value: "RUB", label: "Zloto Ba Lan - RUB", icon: "zł", idx: 1 },
    { value: "RUB", label: "Rúp Nga - RUB", icon: "₽", idx: 1 },
    { value: "TRY", label: "Lir Thổ Nhĩ Kỳ - TRY", icon: "₺", idx: 1 },
    { value: "ZAR", label: "Rand của Nam Phi - ZAR", icon: "R", idx: 1 },
    /* { value: "CNY", label: "Nhân dân tệ TQ - CNY", icon:"	¥" },
    { value: "SGD", label: "Đồng đô la Singapore - SGD", icon:"SGD" },
    { value: "HKD", label: "Đô la Hồng Công - HKD", icon:"HKD" },
    { value: "CNH", label: "CNH - CNH", icon:"" },
    { value: "INR", label: "INDIAN RUPEE - INR", icon:"" },
    { value: "KWD", label: "UWAITI DINAR - KWD", icon:"" },
    { value: "MYR", label: "MALAYSIAN RINGGIT - MYR", icon:"" },
    { value: "SAR", label: "SAUDI RIAL - SAR", icon:"" },
    { value: "THB", label: "THAI BAHT - THB", icon:"" },
    { value: "KRW", label: "SOUTH KOREAN WON - KRW", icon:"" },
    { value: "JPY", label: "Đồng Yên Nhật - JPY", icon:"¥" }, */
  ];
  const [Currency, setCurrency] = useState({});
  const handleChangeCurrency = (event) => {
    setCurrency({
      currencyCode: event.target.value,
      encode: true,
      money: "",
    });
  };

  //#endregion

  return (
    <>
      <div className="content-wrapper">
        <div class="card-header border-left-red PrintInvoiceHide">
          <div class="row">
            <div class="col-sm-12 col-md-3">
              <h3 class="card-title font-weight-bold">
                Bảng quyết toán chi phí({data.length})
              </h3>
            </div>
            <div class="col-sm-12 col-md-9 margin-top-5s">
              <button
                onClick={(e) => {
                  openModal();
                }}
                type="button"
                class="btn btn-sm btn-success pull-right margin-left-5"
              >
                <i class="fa fa-plus pr-2"></i>
                Tạo mới
              </button>
              <button
                onClick={Trl_spOperating_CostSettlement_List}
                type="button"
                class="btn btn-sm btn-danger pull-right margin-left-5"
              >
                <i class="fa fa-search pr-2"></i>
                Tìm kiếm
              </button>
              <div class="form-group pull-right" style={{ marginTop: "-4px" }}>
                <div class="input-group" style={{ width: "100%" }}>
                  <input
                    type="text"
                    maxLength="500"
                    placeholder="Status Plane,Booking..."
                    class="form-control2"
                    value={TextSearch}
                    onChange={(e) => setTextSearch(e.target.value)}
                  />
                </div>
              </div>
              <div
                class="form-group pull-right"
                style={{ marginTop: "-4px", width: "50%", marginRight: "5px" }}
              >
                <div class="input-group ">
                  <DateTimeRangePicker
                    className="form-control2 px-1 pb-2px zIndex-300"
                    value={TimeSearch}
                    onChange={(date) => setTimeSearch(date)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body border-left-red PrintInvoiceHide">
          <div class="row">
            <DataTable data={data} columns={columns} IsSearch={true} />
          </div>
        </div>
      </div>
      <Modal
        show={modalIsOpen}
        onHide={(e) => {
          ConfirmAlert(
            "Bạn có chắc chắn muốn tắt form không ?",
            "",
            async () => {
              closeModal();
            }
          );
        }}
        size="xl"
        animation="false"
        className=" custom-modal-w-100"
      >
        <Modal.Header>
          <Modal.Title id="example-custom-modal-styling-title text-center">
            <div class="text-center">
              BẢNG QUYẾT TOÁN CHI PHÍ ĐI TOUR{" "}
              <a
                type="button"
                className="btn btn-info btn-sm ml-2"
                data-toggle="collapse"
                href={"#collapseCost"}
                role="button"
                aria-expanded="false"
                aria-controls={"collapseCost"}
              >
                <i className="fas fa-info"></i>
              </a>
            </div>
          </Modal.Title>
          <Button
            type="button"
            className="close"
            aria-label="Đóng"
            onClick={(e) => {
              ConfirmAlert(
                "Bạn có chắc chắn muốn tắt form không ?",
                "",
                async () => {
                  closeModal();
                }
              );
            }}
          >
            <span aria-hidden="true">&times;</span>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className=" col-xs-12 col-md-12">
              <div
                className="collapse mb-3 alert alert-light"
                id={"collapseCost"}
              >
                DOUBLE CLICK vào chi phí thực tế để thay đổi các trạng thái bên
                dưới:
                <br />
                <span className="pl-5 bg-green mr-2"></span>
                Là các chi phí đầy đủ chứng từ hóa đơn và được thông qua
                <br />
                <span className="pl-5 bg-yellow mr-2"></span>
                Là các chi phí bị treo lại do thiếu hóa đơn hoặc phải giải trình{" "}
                <br />
                <span className="pl-5 bg-red mr-2"></span>
                Là các chi phí không được thông qua
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-4">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  Hành trình
                </span>
                <SelectServiceSale
                  items={dataDetail.ServiceSaleId || 0}
                  onSelected={(e) =>
                    setDataDetail({
                      ...dataDetail,
                      ServiceSaleId: e.value,
                      DateSaleFrom: e.DateSaleFrom,
                      DateSaleTo: e.DateSaleTo,
                    })
                  }
                  type={1}
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-3">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  Ngày khởi hành
                </span>
                <input
                  type="text"
                  value={FormatDateJson(dataDetail?.DateSaleFrom || "", 7)}
                  className="form-control2"
                  disabled
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-3">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  Ngày kết thúc
                </span>
                <input
                  type="text"
                  value={FormatDateJson(dataDetail?.DateSaleTo || "", 7)}
                  className="form-control2"
                  disabled
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-2">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  Số lượng KH:
                </span>
                <input
                  type="text"
                  value={dataDetail?.TotalCustomer || 0}
                  onChange={(e) => {
                    setDataDetail({
                      ...dataDetail,
                      TotalCustomer: e.target.value,
                    });
                  }}
                  className="form-control2"
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-4">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  Họ & tên HDV:
                </span>
                <input
                  type="text"
                  value={dataDetail.TourGuide}
                  onChange={(e) => {
                    setDataDetail({
                      ...dataDetail,
                      TourGuide: e.target.value,
                    });
                  }}
                  className="form-control2"
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-2">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  TIPS HDV:
                </span>
                <input
                  type="text"
                  value={dataDetail.TourGuideTip}
                  onChange={(e) => {
                    setDataDetail({
                      ...dataDetail,
                      TourGuideTip: e.target.value,
                    });
                  }}
                  className="form-control2"
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-2">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  TIPS Tài Xế:
                </span>
                <input
                  type="text"
                  value={dataDetail.DriverTip}
                  onChange={(e) => {
                    setDataDetail({
                      ...dataDetail,
                      DriverTip: e.target.value,
                    });
                  }}
                  className="form-control2"
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-2">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  CTP HDV:
                </span>
                <input
                  type="text"
                  value={dataDetail.TourGuideCTP}
                  onChange={(e) => {
                    setDataDetail({
                      ...dataDetail,
                      TourGuideCTP: e.target.value,
                    });
                  }}
                  className="form-control2"
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-2">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  Loại tiền áp dụng
                </span>
                <div class="input-group">
                  <Select
                    className={"w-100 select-custom"}
                    value={dataDetail.ApplicableCurrency || "VND"}
                    onChange={(e) =>
                      setDataDetail({
                        ...dataDetail,
                        ApplicableCurrency: e,
                      })
                    }
                    options={TypeOfMoney}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* I. CTY TẠM ỨNG CHO HDV */}
          <div className="row">
            <div className="col-xs-12 col-md-12" style={customStyles.mainTitle}>
              I. CTY TẠM ỨNG CHO HDV
            </div>
            <div className="col-xs-12 col-md-4">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  TOTAL:
                </span>
                <input
                  type="text"
                  value={dataDetail.AdvanceMoney}
                  onChange={(e) => {
                    setDataDetail({
                      ...dataDetail,
                      AdvanceMoney: e.target.value,
                    });
                  }}
                  onBlur={onSumary}
                  className="form-control2"
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-8">
              <div className="row">
                <UploadFile
                  onImageUpload={(e) => {
                    onChangeFileOrImage(e, 1);
                  }}
                  onFileUpload={(e) => {
                    onChangeFileOrImage(e, 0);
                  }}
                  fileData={{
                    fileShow: dataDetail?.AttackFile || "",
                    imageShow: dataDetail?.AttackImage || "",
                  }}
                  flag={flagResetFile}
                />
              </div>
            </div>
          </div>
          {/* NHÀ HÀNG */}
          <div className="row">
            <div className="col-xs-12 col-md-12" style={customStyles.mainTitle}>
              II. CHI PHÍ TRÊN TOUR
            </div>
            <div className="col-xs-12 col-md-12">
              <CostSettlementDetailTableResComp
                key="Restaurant"
                ListData={Restaurant}
                onData={(e) => {
                  setRestaurant(e);
                  onSumary();
                }}
                CostTypeId="1"
                CostTypeName="NHÀ HÀNG - THẺ CÔNG TY ONLY"
              />
            </div>
            <div className="col-xs-12 col-md-12">
              <CostSettlementDetailNoteComp
                key="INCURED1"
                ListData={Incurred1}
                onData={(e) => {
                  setIncurred1(e);
                  onSumary();
                }}
                CostTypeId="6"
                CostTypeName="INCURED1"
              />
            </div>
            <div className="col-xs-12 col-md-4 mb-3"></div>
            <div className="col-xs-12 col-md-4 text-center mb-3">
              <div style={customStyles.totalBox1}>
                TOTAL:{" "}
                {(
                  (Restaurant.reduce(
                    (a, v) =>
                      (a =
                        a +
                        (v.Status1 === 0 ? +v.RealCost1 || 0 : 0) +
                        (v.Status2 === 0 ? +v.RealCost2 || 0 : 0) +
                        (v.Status3 === 0 ? +v.RealCost3 || 0 : 0) +
                        (v.Status4 === 0 ? +v.RealCost4 || 0 : 0)),
                    0
                  ) || 0) +
                  (Incurred1.reduce(
                    (a, v) => (a = a + (v.Status === 0 ? +v.RealCost || 0 : 0)),
                    0
                  ) || 0)
                ).toFixed(2)}
              </div>
            </div>
            <div className="col-xs-12 col-md-4 mb-3"></div>
          </div>
          {/* 2. THAM QUAN */}
          <div className="row">
            <div className="col-xs-12 col-md-12">
              <CostSettlementDetailTableComp
                key="Tourism"
                ListData={Tourism}
                onData={(e) => {
                  setTourism(e);
                  onSumary();
                }}
                CostTypeId="2"
                CostTypeName="THAM QUAN - THẺ CÔNG TY ONLY"
              />
            </div>
            <div className="col-xs-12 col-md-12">
              <CostSettlementDetailNoteComp
                key="INCURED2"
                ListData={Incurred2}
                onData={(e) => {
                  setIncurred2(e);
                  onSumary();
                }}
                CostTypeId="7"
                CostTypeName="INCURED2"
              />
            </div>
            <div className="col-xs-12 col-md-4 mb-3"></div>
            <div className="col-xs-12 col-md-4 text-center mb-3">
              <div style={customStyles.totalBox1}>
                TOTAL:{" "}
                {(
                  (Tourism.reduce(
                    (a, v) => (a = a + (v.Status === 0 ? +v.RealCost || 0 : 0)),
                    0
                  ) || 0) +
                  (Incurred2.reduce(
                    (a, v) => (a = a + (v.Status === 0 ? +v.RealCost || 0 : 0)),
                    0
                  ) || 0)
                ).toFixed(2)}
              </div>
            </div>
            <div className="col-xs-12 col-md-4 mb-3"></div>
          </div>
          {/* 3. KHÁCH SẠN */}
          <div className="row">
            <div className="col-xs-12 col-md-12">
              <CostSettlementDetailTableComp
                key="Hotel"
                ListData={Hotel}
                onData={(e) => {
                  setHotel(e);
                  onSumary();
                }}
                CostTypeId="3"
                CostTypeName="KHÁCH SẠN - THẺ CÔNG TY ONLY"
              />
            </div>
            <div className="col-xs-12 col-md-12">
              <CostSettlementDetailNoteComp
                key="INCURED3"
                ListData={Incurred3}
                onData={(e) => {
                  setIncurred3(e);
                  onSumary();
                }}
                CostTypeId="8"
                CostTypeName="INCURED3"
              />
            </div>
            <div className="col-xs-12 col-md-4 mb-3"></div>
            <div className="col-xs-12 col-md-4 text-center mb-3">
              <div style={customStyles.totalBox1}>
                TOTAL:{" "}
                {(
                  (Hotel.reduce(
                    (a, v) => (a = a + (v.Status === 0 ? +v.RealCost || 0 : 0)),
                    0
                  ) || 0) +
                  (Incurred3.reduce(
                    (a, v) => (a = a + (v.Status === 0 ? +v.RealCost || 0 : 0)),
                    0
                  ) || 0)
                ).toFixed(2)}
              </div>
            </div>
            <div className="col-xs-12 col-md-4 mb-3"></div>
          </div>
          {/* 4. CHI TIỀN NƯỚC + TIPS + OVERTIME */}
          <div className="row">
            <div className="col-xs-12 col-md-12">
              <CostSettlementDetailTableComp
                key="Another"
                ListData={Another}
                onData={(e) => {
                  setAnother(e);
                  onSumary();
                }}
                CostTypeId="4"
                CostTypeName="CHI TIỀN NƯỚC + TIPS + OVERTIME"
              />
            </div>
            <div className="col-xs-12 col-md-4 mb-3"></div>
            <div className="col-xs-12 col-md-4 text-center mb-3">
              <div style={customStyles.totalBox2}>
                TOTAL:{" "}
                {Another.reduce(
                  (a, v) => (a = a + (v.Status === 0 ? +v.RealCost || 0 : 0)),
                  0
                ).toFixed(2) || 0}
              </div>
            </div>
            <div className="col-xs-12 col-md-4 mb-3"></div>
          </div>
          {/* 5.CHI PHÍ HDV CHI */}
          <div className="row">
            <div className="col-xs-12 col-md-12">
              <CostSettlementDetailTableComp
                key="TourGuideCost"
                ListData={TourGuideCost}
                onData={(e) => {
                  setTourGuideCost(e);
                  onSumary();
                }}
                CostTypeId="5"
                CostTypeName="CHI PHÍ HDV CHI"
              />
            </div>
            <div className="col-xs-12 col-md-4 mb-3"></div>
            <div className="col-xs-12 col-md-4 text-center mb-3">
              <div style={customStyles.totalBox2}>
                TOTAL:{" "}
                {TourGuideCost.reduce(
                  (a, v) => (a = a + (v.Status === 0 ? +v.RealCost || 0 : 0)),
                  0
                ).toFixed(2) || 0}
              </div>
            </div>
            <div className="col-xs-12 col-md-4 mb-3"></div>
          </div>
          {/*Tổng chi phí HDV mục II*/}
          <div className="row">
            <div className="col-xs-12 col-md-12 text-center mb-3">
              <div style={customStyles.totalBoxBold2}>
                TỔNG CHI PHÍ HDV CHI (4+5){": "}
                {(
                  (Another.reduce(
                    (a, v) => (a = a + (v.Status === 0 ? +v.RealCost || 0 : 0)),
                    0
                  ) || 0) +
                  (TourGuideCost.reduce(
                    (a, v) => (a = a + (v.Status === 0 ? +v.RealCost || 0 : 0)),
                    0
                  ) || 0)
                ).toFixed(2)}
              </div>
            </div>
          </div>
          {/* III. CTP HDV: */}
          <div className="row">
            <div className="col-xs-12 col-md-12" style={customStyles.mainTitle}>
              III. CTP HDV:
            </div>
            <div className="col-xs-12 col-md-3">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">CTP</span>
                <input
                  type="text"
                  value={dataDetail.TourGuideCTP}
                  className="form-control2"
                  disabled
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-3">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  SỐ NGÀY
                </span>
                <input
                  type="text"
                  value={dataDetail.TotalDays}
                  onChange={(e) => {
                    setDataDetail({
                      ...dataDetail,
                      TotalDays: e.target.value,
                    });
                  }}
                  className="form-control2"
                  onBlur={onSumary}
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-3">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">THÊM</span>
                <input
                  type="text"
                  value={dataDetail?.TotalDayAdd || 0}
                  className="form-control2"
                  onChange={(e) => {
                    setDataDetail({
                      ...dataDetail,
                      TotalDayAdd: e.target.value,
                    });
                  }}
                  onBlur={onSumary}
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-3">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  TỔNG CTP
                </span>
                <input
                  type="text"
                  value={dataDetail.TotalCTP}
                  className="form-control2"
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-3">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">TIPS</span>
                <input
                  type="text"
                  value={dataDetail.TourGuideTip}
                  className="form-control2"
                  disabled
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-3">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  SỐ NGÀY
                </span>
                <input
                  type="text"
                  value={dataDetail.TotalDayTips}
                  onChange={(e) => {
                    setDataDetail({
                      ...dataDetail,
                      TotalDayTips: e.target.value,
                    });
                  }}
                  className="form-control2"
                  onBlur={onSumary}
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-3">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  SỐ KHÁCH
                </span>
                <input
                  type="text"
                  value={dataDetail?.TotalCustomerTips || 0}
                  className="form-control2"
                  onChange={(e) => {
                    setDataDetail({
                      ...dataDetail,
                      TotalCustomerTips: e.target.value,
                    });
                  }}
                  onBlur={onSumary}
                />
              </div>
            </div>
            <div className="col-xs-12 col-md-3">
              <div className="form-group">
                <span className="small font-weight-bold text-muted">
                  TỔNG TIPS
                </span>
                <input
                  type="text"
                  value={dataDetail.TotalTips}
                  className="form-control2"
                />
              </div>
            </div>
          </div>
          <div className="row"></div>
          {/* IV. CÁC KHOẢN KHÔNG ĐƯỢC DUYỆT */}
          <div className="row">
            <div className="col-xs-12 col-md-12" style={customStyles.mainTitle}>
              IV. CÁC KHOẢN KHÔNG ĐƯỢC DUYỆT
            </div>
            <div className="col-xs-12 col-md-12">
              <table
                className="table table-bordered table-striped"
                cellPadding={5}
              >
                <thead>
                  <tr>
                    <th style={customStyles.th100}>NGÀY</th>
                    <th style={customStyles.th}>KHOẢN MỤC</th>
                    <th style={customStyles.th150}>SỐ TIỀN</th>
                  </tr>
                </thead>
                <tbody>
                  {Wrongs?.map((item, index) => {
                    return (
                      <tr key={"suspend" + index} style={customStyles.tr}>
                        <td className="p-1" style={customStyles.specialTd}>
                          {item.DateCostNoFormat}
                        </td>
                        <td
                          style={customStyles.specialTd}
                          className="text-left p-1"
                        >
                          {item.CostTypeName} | {item.RealNotes}
                        </td>
                        <td className="p-1" style={customStyles.specialTd}>
                          {item.StatusDifferent === 2
                            ? item.MoneyDifferent.toFixed(2)
                            : item.RealCost.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="col-xs-12 col-md-4 mb-3"></div>
            <div className="col-xs-12 col-md-4 text-center mb-3">
              <div style={customStyles.totalBox3}>
                TOTAL:{" "}
                {Wrongs.reduce(
                  (a, v) =>
                    (a =
                      a +
                      (v.StatusDifferent === 2
                        ? v.MoneyDifferent || 0
                        : +v.RealCost || 0)),
                  0
                ).toFixed(2) || 0}
              </div>
            </div>
            <div className="col-xs-12 col-md-4 mb-3"></div>
          </div>
          {/* V. TỔNG THANH TOÁN : II+III-I-IV */}
          <div className="row">
            <div className="col-xs-12 col-md-12" style={customStyles.mainTitle}>
              V. TỔNG THANH TOÁN (II(4 + 5) + III - I - IV):
            </div>
            <div className="col-xs-12 col-md-12 text-center mb-3 mt-2">
              <div style={customStyles.totalBoxBold3}>
                {dataDetail.TotalPayment || 0}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={(e) => {
              Trl_spOperating_CostSettlement_Save();
            }}
          >
            <i className="fas fa-save pr-2"></i> Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const customStyles = {
  mainTitle: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  tableTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
  },
  pink: {
    backgroundColor: "rgb(252,228,214)",
  },
  yellow: {
    backgroundColor: "rgb(252,230,153)",
  },
  th: {
    fontSize: "13px",
    padding: "5px",
    backgroundColor: "#eaf1fb",
    verticalAlign: "middle",
    fontWeight: 500,
  },
  th150: {
    fontSize: "13px",
    padding: "0",
    backgroundColor: "#eaf1fb",
    width: "150px",
    verticalAlign: "middle",
    fontWeight: 500,
  },
  th100: {
    fontSize: "13px",
    padding: "0",
    backgroundColor: "#eaf1fb",
    width: "100px",
    verticalAlign: "middle",
    fontWeight: 500,
  },
  th80: {
    fontSize: "13px",
    padding: "0",
    backgroundColor: "#eaf1fb",
    width: "80px",
    verticalAlign: "middle",
    fontWeight: 500,
  },
  th40: {
    fontSize: "13px",
    padding: "0",
    backgroundColor: "#eaf1fb",
    width: "40px",
    fontWeight: 500,
  },
  date_input: {
    outline: "none",
    border: "none",
    padding: "8px",
    background: "#fff",
    margin: "0px",
    fontSize: "0.9em",
    fontWeight: 400,
    width: "100px",
    maxWidth: "100px",
    textAlign: "center",
    textTransform: "uppercase",
  },
  form_control3: {
    display: "block",
    width: "100%",
    padding: "8px",
    fontWeight: 400,
    lineWeight: 1.5,
    color: "#495057",
    backgroundColor: "#fff",
    backgroundClip: "padding-box",
    outline: 0,
    border: 0,
    borderRadius: 0,
    boxShadow: "unset",
    transition: "unset",
  },
  form_control3_bold: {
    display: "block",
    width: "100%",
    padding: "8px",
    lineWeight: 1.5,
    color: "#495057",
    backgroundColor: "#fff",
    backgroundClip: "padding-box",
    outline: 0,
    border: 0,
    borderRadius: 0,
    boxShadow: "unset",
    transition: "unset",
    fontWeight: "500",
  },
  specialTd: {
    padding: "8px  !important",
    fontWeight: 400,
    lineWeight: 1.5,
    color: "#495057",
    backgroundColor: "#fff",
  },
  TdFooter: {
    padding: "8px",
    fontWeight: 500,
    lineWeight: 1.5,
    color: "#000",
    backgroundColor: "#ffc10761",
    textAlign: "center",
  },
  totalBox1: {
    backgroundColor: "#FEF9A7",
    borderRadius: "5px",
    padding: "8px 20px",
    border: "1px solod #ddd",
  },
  totalBox2: {
    backgroundColor: "RGB(248,203,173)",
    borderRadius: "5px",
    padding: "8px 20px",
    border: "1px solod #ddd",
  },
  totalBox3: {
    backgroundColor: "#ddd",
    borderRadius: "5px",
    padding: "8px 20px",
    border: "1px solod #CD1818",
  },
  totalBoxBold1: {
    backgroundColor: "#FEF9A7",
    borderRadius: "5px",
    padding: "10px 20px",
    border: "1px solod #ddd",
    fontWeight: "bold",
  },
  totalBoxBold2: {
    backgroundColor: "RGB(248,203,173)",
    borderRadius: "5px",
    padding: "10px 20px",
    border: "1px solod #ddd",
    fontWeight: "bold",
  },
  totalBoxBold3: {
    backgroundColor: "#FEF9A7",
    borderRadius: "5px",
    padding: "10px 20px",
    border: "1px solod #ddd",
    fontWeight: "bold",
  },
};

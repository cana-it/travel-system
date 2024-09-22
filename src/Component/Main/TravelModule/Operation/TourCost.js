import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import Select from "react-select";
import {
  DataTable,
  TooltipCustom,
  SelectServiceSale,
  SelectLandData,
} from "../../../../Common";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  ExportExcel,
  FormatDateJson,
  FormatMoney,
  FormatNumber,
  ConfirmAlert,
  ConvertFileName,
} from "../../../../Utils";
import { IMAGES_DOMAIN } from "../../../../Services";
import { Button, Modal } from "react-bootstrap";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Img } from "react-image";
import $ from "jquery";

import { useDownloadExcel } from "react-export-table-to-excel";

export const TourCost = () => {
  useEffect(() => {
    Trl_spTourCost_List();
  }, []);

  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const onClickTitle = () => {
    setIsHidden(false);
  };
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const dispatch = useDispatch();

  const [TourCostId, setTourCostId] = useState(0);
  const [TitleTourCost, setTitleTourCost] = useState(
    "Chiết Tính Chi Phí Đi Tour"
  );
  const [serviceSale, setServiceSale] = useState(0);
  const [DateTime, setDateTime] = useState("");
  const [ClockUpSave, setClockUpSave] = useState(0);
  const [HiddenValue, setHiddenValue] = useState(true);
  const [HiddenFix, setHiddenFix] = useState(true);
  const [TourCostName, setTourCostName] = useState("");
  const [TourCostCode, setTourCostCode] = useState("");
  const [FlightTime, setFlightTime] = useState("");
  const [DataTableList, setDataTableList] = useState([]);

  // Chi tiết dịch vụ
  const [DetailVMB1, setDetailVMB1] = useState("Đoàn");
  const [DetailVMB2, setDetailVMB2] = useState("HDV");
  const [DetailVMB3, setDetailVMB3] = useState("Phí Phòng Vé");
  const [DetailVMB4, setDetailVMB4] = useState("");
  const [DetailVMB5, setDetailVMB5] = useState("");
  const [DetailLT1, setDetailLT1] = useState("LandTour");
  const [DetailLT2, setDetailLT2] = useState("");
  const [DetailLT3, setDetailLT3] = useState("");
  const [DetailHotel1, setDetailHotel1] = useState("Upgrade 4*");
  const [DetailHotel2, setDetailHotel2] = useState("Ungrade 2 đêm Timesquare");
  const [DetailHotel3, setDetailHotel3] = useState("");
  const [DetailHotel4, setDetailHotel4] = useState("");
  const [DetailRS1, setDetailRS1] = useState("Up bữa ăn từ 20 lên 30 USD");
  const [DetailRS2, setDetailRS2] = useState("");
  const [DetailRS3, setDetailRS3] = useState("");
  const [DetailSS1, setDetailSS1] = useState("Tham Quan Extra");
  const [DetailSS2, setDetailSS2] = useState("");
  const [DetailSS3, setDetailSS3] = useState("");
  const [DetailVisa1, setDetailVisa1] = useState("Visa Khách");
  const [DetailVisa2, setDetailVisa2] = useState("Phí Hande Visa Khách");
  const [DetailVisa3, setDetailVisa3] = useState("Visa HDV");
  const [DetailVisa4, setDetailVisa4] = useState("");
  const [DetailVisa5, setDetailVisa5] = useState("");
  const [DetailGT1, setDetailGT1] = useState("HDV");
  const [DetailGT2, setDetailGT2] = useState("");
  const [DetailGT3, setDetailGT3] = useState("");
  const [DetailIR1, setDetailIR1] = useState("Bảo Hiểm");
  const [DetailIR2, setDetailIR2] = useState("");
  const [DetailIR3, setDetailIR3] = useState("");
  const [DetailTIP1, setDetailTIP1] = useState("TIP Tài Xế");
  const [DetailTIP2, setDetailTIP2] = useState("TIP HDV");
  const [DetailTIP3, setDetailTIP3] = useState("");
  const [DetailTIP4, setDetailTIP4] = useState("");
  const [DetailW1, setDetailW1] = useState("Nước");
  const [DetailW2, setDetailW2] = useState("");
  const [DetailW3, setDetailW3] = useState("");
  const [DetailPS1, setDetailPS1] = useState("Balo,Vali");
  const [DetailPS2, setDetailPS2] = useState("Sim4G(400K)");
  const [DetailPS3, setDetailPS3] = useState("");
  const [DetailPS4, setDetailPS4] = useState("");
  const [DetailOC1, setDetailOC1] = useState("Họp Đoàn");
  const [DetailOC2, setDetailOC2] = useState("Hoa Hồng");
  const [DetailOC3, setDetailOC3] = useState("Giảm Giá Nhóm");
  const [DetailOC4, setDetailOC4] = useState("Dự Kiến Phát Sinh");
  const [DetailOC5, setDetailOC5] = useState("");
  const [DetailOC6, setDetailOC6] = useState("");

  // giá nhập
  const [ExchangeRate, setExchangeRate] = useState(0);
  const [Price, setPrice] = useState(0);
  const [Quantity, setQuantity] = useState(0);
  const [QuantityBH, setQuantityBH] = useState(0);
  //
  const [PriceVMB1, setPriceVMB1] = useState(0);
  const [PriceVMB2, setPriceVMB2] = useState(0);
  const [PriceVMB3, setPriceVMB3] = useState(0);
  const [PriceVMB4, setPriceVMB4] = useState(0);
  const [PriceVMB5, setPriceVMB5] = useState(0);
  const [PriceLT1, setPriceLT1] = useState(0);
  const [PriceLT2, setPriceLT2] = useState(0);
  const [PriceLT3, setPriceLT3] = useState(0);
  const [PriceHotel1, setPriceHotel1] = useState(0);
  const [PriceHotel2, setPriceHotel2] = useState(0);
  const [PriceHotel3, setPriceHotel3] = useState(0);
  const [PriceHotel4, setPriceHotel4] = useState(0);
  const [PriceRS1, setPriceRS1] = useState(0);
  const [PriceRS2, setPriceRS2] = useState(0);
  const [PriceRS3, setPriceRS3] = useState(0);
  const [PriceSS1, setPriceSS1] = useState(0);
  const [PriceSS2, setPriceSS2] = useState(0);
  const [PriceSS3, setPriceSS3] = useState(0);
  const [PriceVisa1, setPriceVisa1] = useState(0);
  const [PriceVisa2, setPriceVisa2] = useState(0);
  const [PriceVisa3, setPriceVisa3] = useState(0);
  const [PriceVisa4, setPriceVisa4] = useState(0);
  const [PriceVisa5, setPriceVisa5] = useState(0);
  const [PriceGT1, setPriceGT1] = useState(0);
  const [PriceGT2, setPriceGT2] = useState(0);
  const [PriceGT3, setPriceGT3] = useState(0);
  const [PriceIR1, setPriceIR1] = useState(0);
  const [PriceIR2, setPriceIR2] = useState(0);
  const [PriceIR3, setPriceIR3] = useState(0);
  const [PriceTIP1, setPriceTIP1] = useState(0);
  const [PriceTIP2, setPriceTIP2] = useState(0);
  const [PriceTIP3, setPriceTIP3] = useState(0);
  const [PriceTIP4, setPriceTIP4] = useState(0);
  const [PriceW1, setPriceW1] = useState(0);
  const [PriceW2, setPriceW2] = useState(0);
  const [PriceW3, setPriceW3] = useState(0);
  const [PricePS1, setPricePS1] = useState(0);
  const [PricePS2, setPricePS2] = useState(0);
  const [PricePS3, setPricePS3] = useState(0);
  const [PricePS4, setPricePS4] = useState(0);
  const [PriceOC1, setPriceOC1] = useState(0);
  const [PriceOC2, setPriceOC2] = useState(0);
  const [PriceOC3, setPriceOC3] = useState(0);
  const [PriceOC4, setPriceOC4] = useState(0);
  const [PriceOC5, setPriceOC5] = useState(0);
  const [PriceOC6, setPriceOC6] = useState(0);
  // Ghi chú

  const [NotesVMB1, setNotesVMB1] = useState("");
  const [NotesVMB2, setNotesVMB2] = useState("");
  const [NotesVMB3, setNotesVMB3] = useState("");
  const [NotesVMB4, setNotesVMB4] = useState("");
  const [NotesVMB5, setNotesVMB5] = useState("");
  const [NotesLT1, setNotesLT1] = useState("");
  const [NotesLT2, setNotesLT2] = useState("");
  const [NotesLT3, setNotesLT3] = useState("");
  const [NotesHotel1, setNotesHotel1] = useState("");
  const [NotesHotel2, setNotesHotel2] = useState("");
  const [NotesHotel3, setNotesHotel3] = useState("");
  const [NotesHotel4, setNotesHotel4] = useState("");
  const [NotesRS1, setNotesRS1] = useState("");
  const [NotesRS2, setNotesRS2] = useState("");
  const [NotesRS3, setNotesRS3] = useState("");
  const [NotesSS1, setNotesSS1] = useState("");
  const [NotesSS2, setNotesSS2] = useState("");
  const [NotesSS3, setNotesSS3] = useState("");
  const [NotesVisa1, setNotesVisa1] = useState("");
  const [NotesVisa2, setNotesVisa2] = useState("");
  const [NotesVisa3, setNotesVisa3] = useState("");
  const [NotesVisa4, setNotesVisa4] = useState("");
  const [NotesVisa5, setNotesVisa5] = useState("");
  const [NotesGT1, setNotesGT1] = useState("");
  const [NotesGT2, setNotesGT2] = useState("");
  const [NotesGT3, setNotesGT3] = useState("");
  const [NotesIR1, setNotesIR1] = useState("");
  const [NotesIR2, setNotesIR2] = useState("");
  const [NotesIR3, setNotesIR3] = useState("");
  const [NotesTIP1, setNotesTIP1] = useState("");
  const [NotesTIP2, setNotesTIP2] = useState("");
  const [NotesTIP3, setNotesTIP3] = useState("");
  const [NotesTIP4, setNotesTIP4] = useState("");
  const [NotesW1, setNotesW1] = useState("");
  const [NotesW2, setNotesW2] = useState("");
  const [NotesW3, setNotesW3] = useState("");
  const [NotesPS1, setNotesPS1] = useState("");
  const [NotesPS2, setNotesPS2] = useState("");
  const [NotesPS3, setNotesPS3] = useState("");
  const [NotesPS4, setNotesPS4] = useState("");
  const [NotesOC1, setNotesOC1] = useState("");
  const [NotesOC2, setNotesOC2] = useState("");
  const [NotesOC3, setNotesOC3] = useState("");
  const [NotesOC4, setNotesOC4] = useState("");
  const [NotesOC5, setNotesOC5] = useState("");
  const [NotesOC6, setNotesOC6] = useState("");

  //File
  const [FileShow, setFileShow] = useState([]);
  const [FileUpload, setFileUpload] = useState([]);
  const [docs, setDocs] = useState("");
  const [isPreviewFile, setIsPreviewFile] = useState(false);

  const checkExtentionFile = (value, type) => {
    let check = 0;
    let exName = value.slice(
      (Math.max(0, value.lastIndexOf(".")) || Infinity) + 1
    );

    if (
      exName === "doc" ||
      exName === "docx" ||
      exName === "xls" ||
      exName === "xlsx"
    ) {
      check = 0;
    } else {
      check = 1;
    }
    return check;
  };

  const handleChangeFileAndImage = (e, type = 0) => {
    ;
    let f = e.target.files;
    let check = true;
    if (type === 0) {
      for (let i = 0; i < f.length; i++) {
        let exName = f[i].name.slice(
          (Math.max(0, f[i].name.lastIndexOf(".")) || Infinity) + 1
        );
        if (
          exName === "pdf" ||
          exName === "doc" ||
          exName === "docx" ||
          exName === "xls" ||
          exName === "xlsx"
        ) {
          check = true;
        } else {
          check = false;
        }
        if (check === false) break;
      }
      check
        ? setFileUpload([...FileUpload, ...e.target.files])
        : Alertwarning(
            'File không đúng định dạng! Vui lòng chọn lại file có định dạng "pdf", "doc", "docx", "xls", "xlsx"'
          );
    }
  };

  const [CostList, setCostList] = useState({ value: 1, label: "USD" });
  const [CostName, setCostName] = useState("USD");
  const CostValue = [
    { value: 1, label: "USD" },
    { value: 2, label: "EUR" },
    { value: 3, label: "GBP" },
    { value: 4, label: "JPY" },
    { value: 5, label: "WON" },
  ];

  const onSelecteCost = (e) => {
    setCostList({ value: e.value, label: e.label });
    setCostName(e.label);
  };

  const onClickQuantity = (e) => {
    let NB = FormatNumber(e),
      NB1 = 0;
    setQuantity(NB);
    NB1 = +NB + 1;
    setQuantityBH(NB1);
  };

  const onSelectServiceSale = (e) => {
    setServiceSale(e);
    setHiddenFix(true);
    setHiddenValue(true);
  };

  const [FlightList, setFlightList] = useState([]);
  const Trl_spBooking_CustomerPlane_View = async (bookingId) => {
    setHiddenFix(true);
    try {
      const pr = {
        BookingId: serviceSale.BookingId || 0,
        CreateName: +Creater,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBooking_CustomerPlane_View",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      setFlightList(result);
      setHiddenValue(false);
    } catch (error) {
      ;
    }
  };

  const Trl_spTourCost_Save = async (e) => {
    let Total = 0,
      FlightTimes = [],
      ListFiles = "";
    try {
      if (FileUpload.length > 0) {
        const formData = new FormData();
        formData.append("Key", "Files");
        for (let i = 0; i < FileUpload.length; i++) {
          let f = FileUpload[i];
          let renamedFile = new File([f], ConvertFileName(f.name), {
            type: f.type,
          });

          formData.append("myFile" + i, renamedFile);
        }
        const res = await mainAction.API_spCallPostFile(formData, dispatch);
        ListFiles = res.Message.replaceAll('"', "")
          .replace("[", "")
          .replace("]", "");
      }
      if (ClockUpSave === 1 && TourCostId != 0) {
        Alerterror("Phiếu Chiết Tính Này Đã Clock Không Được Sửa!");
        return;
      }
      if (TitleTourCost == "") {
        Alertwarning("Vui Lòng Nhập Tên Tiêu Đề!");
        return;
      }
      if (serviceSale === 0 || serviceSale === -1) {
        Alertwarning("Vui Lòng Chọn Tour!");
        return;
      }
      if (ExchangeRate == "0") {
        Alertwarning("Vui Lòng Nhập Tỷ Giá!");
        return;
      }
      if (Price == "0") {
        Alertwarning("Vui Lòng Nhập Giá Bán!");
        return;
      }
      if (Quantity == "0") {
        Alertwarning("Vui Lòng Nhập Số Lượng!");
        return;
      }
      if (DateTime == "") {
        Alertwarning("Vui Lòng Nhập Thời Gian!");
        return;
      }
      if (FlightList.length == 0) {
        Alertwarning("Vui Lòng Chọn Giờ Bay!");
        return;
      }

      Total =
        (parseFloat(PriceVMB1) +
          parseFloat(PriceVMB3) +
          parseFloat(PriceVMB4) +
          parseFloat(PriceVMB5) +
          parseFloat(PriceLT1) +
          parseFloat(PriceLT2) +
          parseFloat(PriceLT3) +
          parseFloat(PriceHotel1) +
          parseFloat(PriceHotel2) +
          parseFloat(PriceHotel3) +
          parseFloat(PriceHotel4) +
          parseFloat(PriceRS1) +
          parseFloat(PriceRS2) +
          parseFloat(PriceRS3) +
          parseFloat(PriceSS1) +
          parseFloat(PriceSS2) +
          parseFloat(PriceSS3) +
          parseFloat(PriceVisa1) +
          parseFloat(PriceVisa2) +
          parseFloat(PriceVisa4) +
          parseFloat(PriceVisa5) +
          parseFloat(PriceTIP2) +
          parseFloat(PriceTIP3) +
          parseFloat(PriceTIP4) +
          parseFloat(PriceW1) +
          parseFloat(PriceW2) +
          parseFloat(PriceW3) +
          parseFloat(PricePS1) +
          parseFloat(PricePS2) +
          parseFloat(PricePS3) +
          parseFloat(PricePS4) +
          parseFloat(PriceOC1) +
          parseFloat(PriceOC2) +
          parseFloat(PriceOC3) +
          parseFloat(PriceOC4) +
          parseFloat(PriceOC5) +
          parseFloat(PriceOC6)) *
          Quantity +
        parseFloat(PriceVMB2) +
        parseFloat(PriceVisa3) +
        parseFloat(PriceGT1) +
        parseFloat(PriceGT2) +
        parseFloat(PriceGT3) +
        parseFloat(PriceIR1) * QuantityBH +
        parseFloat(PriceIR2) * QuantityBH +
        parseFloat(PriceIR3) * QuantityBH +
        parseFloat(PriceTIP1);

      FlightList.length > 0 &&
        FlightList.forEach((item, index) => {
          FlightTimes.push(item.PlaneCodeEnd);
        });

      let f = ListFiles.length > 0 ? "," + ListFiles : ListFiles;

      const pr = {
        TourCostId: TourCostId,
        TitleTourCost: TitleTourCost,
        ServiceSaleId: serviceSale.value,
        TourCostTime: DateTime,
        ExchangeRate: parseFloat(ExchangeRate),
        Currency: CostName,
        Price: parseFloat(Price),
        Quantity: Quantity,
        TotalMPrice: parseFloat(Price) * Quantity,
        TotalPrice: parseFloat(Total),
        PriceOnePax: parseFloat(Total / Quantity),
        PriceOnePaxVND: parseFloat(
          (Total / Quantity) * parseFloat(ExchangeRate)
        ),
        InterestRateOnePax: parseFloat(Total / Quantity) - parseFloat(Price),
        InterestRateOnePaxVND:
          (parseFloat(Total / Quantity) - parseFloat(Price)) *
          parseFloat(ExchangeRate),
        PercentCost:
          ((parseFloat(Total / Quantity) - parseFloat(Price)) * Quantity) /
          (parseFloat(Price) * Quantity),
        GrossProfit:
          (parseFloat(Total / Quantity) - parseFloat(Price)) * Quantity,
        GrossProfitVND:
          (parseFloat(Total / Quantity) - parseFloat(Price)) *
          Quantity *
          parseFloat(ExchangeRate),
        FlightTime: FlightTimes.join(" "),
        Creater: parseInt(Creater),
        IsClock: e,
        Files: FileShow.length > 0 ? FileShow.join(",") + f : ListFiles,
        DetailVMB1: DetailVMB1,
        DetailVMB2: DetailVMB2,
        DetailVMB3: DetailVMB3,
        DetailVMB4: DetailVMB4,
        DetailVMB5: DetailVMB5,
        DetailLT1: DetailLT1,
        DetailLT2: DetailLT2,
        DetailLT3: DetailLT3,
        DetailHotel1: DetailHotel1,
        DetailHotel2: DetailHotel2,
        DetailHotel3: DetailHotel3,
        DetailHotel4: DetailHotel4,
        DetailRS1: DetailRS1,
        DetailRS2: DetailRS2,
        DetailRS3: DetailRS3,
        DetailSS1: DetailSS1,
        DetailSS2: DetailSS2,
        DetailSS3: DetailSS3,
        DetailVisa1: DetailVisa1,
        DetailVisa2: DetailVisa2,
        DetailVisa3: DetailVisa3,
        DetailVisa4: DetailVisa4,
        DetailVisa5: DetailVisa5,
        DetailGT1: DetailGT1,
        DetailGT2: DetailGT2,
        DetailGT3: DetailGT3,
        DetailIR1: DetailIR1,
        DetailIR2: DetailIR2,
        DetailIR3: DetailIR3,
        DetailTIP1: DetailTIP1,
        DetailTIP2: DetailTIP2,
        DetailTIP3: DetailTIP3,
        DetailTIP4: DetailTIP4,
        DetailW1: DetailW1,
        DetailW2: DetailW2,
        DetailW3: DetailW3,
        DetailPS1: DetailPS1,
        DetailPS2: DetailPS2,
        DetailPS3: DetailPS3,
        DetailPS4: DetailPS4,
        DetailOC1: DetailOC1,
        DetailOC2: DetailOC2,
        DetailOC3: DetailOC3,
        DetailOC4: DetailOC4,
        DetailOC5: DetailOC5,
        DetailOC6: DetailOC6,
        PriceVMB1: parseFloat(PriceVMB1),
        PriceVMB2: parseFloat(PriceVMB2),
        PriceVMB3: parseFloat(PriceVMB3),
        PriceVMB4: parseFloat(PriceVMB4),
        PriceVMB5: parseFloat(PriceVMB5),
        PriceLT1: parseFloat(PriceLT1),
        PriceLT2: parseFloat(PriceLT2),
        PriceLT3: parseFloat(PriceLT3),
        PriceHotel1: parseFloat(PriceHotel1),
        PriceHotel2: parseFloat(PriceHotel2),
        PriceHotel3: parseFloat(PriceHotel3),
        PriceHotel4: parseFloat(PriceHotel4),
        PriceRS1: parseFloat(PriceRS1),
        PriceRS2: parseFloat(PriceRS2),
        PriceRS3: parseFloat(PriceRS3),
        PriceSS1: parseFloat(PriceSS1),
        PriceSS2: parseFloat(PriceSS2),
        PriceSS3: parseFloat(PriceSS3),
        PriceVisa1: parseFloat(PriceVisa1),
        PriceVisa2: parseFloat(PriceVisa2),
        PriceVisa3: parseFloat(PriceVisa3),
        PriceVisa4: parseFloat(PriceVisa4),
        PriceVisa5: parseFloat(PriceVisa5),
        PriceGT1: parseFloat(PriceGT1),
        PriceGT2: parseFloat(PriceGT2),
        PriceGT3: parseFloat(PriceGT3),
        PriceIR1: parseFloat(PriceIR1),
        PriceIR2: parseFloat(PriceIR2),
        PriceIR3: parseFloat(PriceIR3),
        PriceTIP1: parseFloat(PriceTIP1),
        PriceTIP2: parseFloat(PriceTIP2),
        PriceTIP3: parseFloat(PriceTIP3),
        PriceTIP4: parseFloat(PriceTIP4),
        PriceW1: parseFloat(PriceW1),
        PriceW2: parseFloat(PriceW2),
        PriceW3: parseFloat(PriceW3),
        PricePS1: parseFloat(PricePS1),
        PricePS2: parseFloat(PricePS2),
        PricePS3: parseFloat(PricePS3),
        PricePS4: parseFloat(PricePS4),
        PriceOC1: parseFloat(PriceOC1),
        PriceOC2: parseFloat(PriceOC2),
        PriceOC3: parseFloat(PriceOC3),
        PriceOC4: parseFloat(PriceOC4),
        PriceOC5: parseFloat(PriceOC5),
        PriceOC6: parseFloat(PriceOC6),
        NotesVMB:
          NotesVMB1 +
          ";" +
          NotesVMB2 +
          ";" +
          NotesVMB3 +
          ";" +
          NotesVMB4 +
          ";" +
          NotesVMB5,
        NotesHotel:
          NotesHotel1 +
          ";" +
          NotesHotel2 +
          ";" +
          NotesHotel3 +
          ";" +
          NotesHotel4,
        NotesLT: NotesLT1 + ";" + NotesLT2 + ";" + NotesLT3,
        NotesRS: NotesRS1 + ";" + NotesRS2 + ";" + NotesRS3,
        NotesSS: NotesSS1 + ";" + NotesSS2 + ";" + NotesSS3,
        NotesVisa:
          NotesVisa1 +
          ";" +
          NotesVisa2 +
          ";" +
          NotesVisa3 +
          ";" +
          NotesVisa4 +
          ";" +
          NotesVisa5,
        NotesGT: NotesGT1 + ";" + NotesGT2 + ";" + NotesGT3,
        NotesIR: NotesIR1 + ";" + NotesIR2 + ";" + NotesIR3,
        NotesTip:
          NotesTIP1 + ";" + NotesTIP2 + ";" + NotesTIP3 + ";" + NotesTIP4,
        NotesW: NotesW1 + ";" + NotesW2 + ";" + NotesW3,
        NotesPS: NotesPS1 + ";" + NotesPS2 + ";" + NotesPS3 + ";" + NotesPS4,
        NotesOC:
          NotesOC1 +
          ";" +
          NotesOC2 +
          ";" +
          NotesOC3 +
          ";" +
          NotesOC4 +
          ";" +
          NotesOC5 +
          ";" +
          NotesOC6,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTourCost_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spTourCost_List();
        ClearFrom();
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const ClearFrom = () => {
    setTourCostId(0);
    setTitleTourCost("Chiết Tính Chi Phí Đi Tour");
    setServiceSale(0);
    setDateTime("");
    setHiddenValue(true);
    setIsHidden(true);
    setExchangeRate(0);
    setQuantity(0);
    setCostList({ value: 1, label: "USD" });
    setCostName("USD");
    setQuantityBH(0);
    setPrice(0);
    setFileUpload([]);
    setFileShow([]);
    setClockUpSave(0);
    setPriceVMB1(0);
    setPriceVMB2(0);
    setPriceVMB3(0);
    setPriceVMB4(0);
    setPriceVMB5(0);
    setPriceLT1(0);
    setPriceLT2(0);
    setPriceLT3(0);
    setPriceHotel1(0);
    setPriceHotel2(0);
    setPriceHotel3(0);
    setPriceHotel4(0);
    setPriceRS1(0);
    setPriceRS2(0);
    setPriceRS3(0);
    setPriceSS1(0);
    setPriceSS2(0);
    setPriceSS3(0);
    setPriceVisa1(0);
    setPriceVisa2(0);
    setPriceVisa3(0);
    setPriceVisa4(0);
    setPriceVisa5(0);
    setPriceGT1(0);
    setPriceGT2(0);
    setPriceGT3(0);
    setPriceIR1(0);
    setPriceIR2(0);
    setPriceIR3(0);
    setPriceTIP1(0);
    setPriceTIP2(0);
    setPriceTIP3(0);
    setPriceTIP4(0);
    setPriceW1(0);
    setPriceW2(0);
    setPriceW3(0);
    setPricePS1(0);
    setPricePS2(0);
    setPricePS3(0);
    setPricePS4(0);
    setPriceOC1(0);
    setPriceOC2(0);
    setPriceOC3(0);
    setPriceOC4(0);
    setPriceOC5(0);
    setPriceOC6(0);
    setDetailVMB1("Đoàn");
    setDetailVMB2("HDV");
    setDetailVMB3("Phí Phòng Vé");
    setDetailVMB4("");
    setDetailVMB5("");
    setDetailLT1("LandTour");
    setDetailLT2("");
    setDetailLT3("");
    setDetailHotel1("Upgrade 4*");
    setDetailHotel2("Ungrade 2 đêm Timesquare");
    setDetailHotel3("");
    setDetailHotel4("");
    setDetailRS1("Up bữa ăn từ 20 lên 30 USD");
    setDetailRS2("");
    setDetailRS3("");
    setDetailSS1("Tham Quan Extra");
    setDetailSS2("");
    setDetailSS3("");
    setDetailVisa1("Visa Khách");
    setDetailVisa2("Phí Hande Visa Khách");
    setDetailVisa3("Visa HDV");
    setDetailVisa4("");
    setDetailVisa5("");
    setDetailGT1("HDV");
    setDetailGT2("");
    setDetailGT3("");
    setDetailIR1("Bảo Hiểm");
    setDetailIR2("");
    setDetailIR3("");
    setDetailTIP1("TIP Tài Xế");
    setDetailTIP2("TIP HDV");
    setDetailTIP3("");
    setDetailTIP4("");
    setDetailW1("Nước");
    setDetailW2("");
    setDetailW3("");
    setDetailPS1("Balo,Vali");
    setDetailPS2("Sim4G(400K)");
    setDetailPS3("");
    setDetailPS4("");
    setDetailOC1("Họp Đoàn");
    setDetailOC2("Hoa Hồng");
    setDetailOC3("Giảm Giá Nhóm");
    setDetailOC4("Dự Kiến Phát Sinh");
    setDetailOC5("");
    setDetailOC6("");
    setNotesVMB1("");
    setNotesVMB2("");
    setNotesVMB3("");
    setNotesVMB4("");
    setNotesVMB5("");
    setNotesVMB1("");
    setNotesVMB2("");
    setNotesVMB3("");
    setNotesVMB4("");
    setNotesVMB5("");
    setNotesLT1("");
    setNotesLT2("");
    setNotesLT3("");
    setNotesHotel1("");
    setNotesHotel2("");
    setNotesHotel3("");
    setNotesHotel4("");
    setNotesRS1("");
    setNotesRS2("");
    setNotesRS3("");
    setNotesSS1("");
    setNotesSS2("");
    setNotesSS3("");
    setNotesVisa1("");
    setNotesVisa2("");
    setNotesVisa3("");
    setNotesVisa4("");
    setNotesVisa5("");
    setNotesGT1("");
    setNotesGT2("");
    setNotesGT3("");
    setNotesIR1("");
    setNotesIR2("");
    setNotesIR3("");
    setNotesTIP1("");
    setNotesTIP2("");
    setNotesTIP3("");
    setNotesTIP4("");
    setNotesW1("");
    setNotesW2("");
    setNotesW3("");
    setNotesPS1("");
    setNotesPS2("");
    setNotesPS3("");
    setNotesPS4("");
    setNotesOC1("");
    setNotesOC2("");
    setNotesOC3("");
    setNotesOC4("");
    setNotesOC5("");
    setNotesOC6("");
  };

  const Trl_spTourCost_List = async () => {
    try {
      const pr = {
        Officer: parseInt(Creater),
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTourCost_List",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length != 0) {
        setDataTableList(result);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Edit = (e) => {
    let Ojb = e.row.original;
    document.querySelector("#tab_1").click();
    if (Ojb.TitleTourCost === "Chiết Tính Chi Phí Đi Tour") {
      setIsHidden(true);
      setTitleTourCost(Ojb.TitleTourCost);
    } else {
      setIsHidden(false);
      setTitleTourCost(Ojb.TitleTourCost);
    }
    setTourCostId(Ojb.TourCostId);
    setServiceSale({ value: Ojb.ServiceSaleId });
    setDateTime(Ojb.TourCostTime);
    setHiddenValue(true);
    setHiddenFix(false);
    setTourCostName(Ojb.TourCostName);
    setTourCostCode(Ojb.TourCostCode);
    setFlightTime(Ojb.FlightTime);
    setExchangeRate(parseFloat(Ojb.ExchangeRate));
    setQuantity(Ojb.Quantity);
    setPrice(Ojb.Price);
    const x = CostValue.find((x) => x.label == Ojb.Currency);
    setCostList(x);
    setCostName(Ojb.Currency);
    const QT = Ojb.Quantity + 1;
    setQuantityBH(QT);
    if (Ojb.IsClock === true) {
      setClockUpSave(1);
    } else {
      setClockUpSave(0);
    }

    let arr = e.row.original?.Files?.replaceAll('"', ""),
      FilesArr = [];
    FilesArr = arr.split(",");
    setFileShow(FilesArr);
    setPriceVMB1(Ojb.PriceVMB1);
    setPriceVMB2(Ojb.PriceVMB2);
    setPriceVMB3(Ojb.PriceVMB3);
    setPriceVMB4(Ojb.PriceVMB4);
    setPriceVMB5(Ojb.PriceVMB5);
    setPriceLT1(Ojb.PriceLT1);
    setPriceLT2(Ojb.PriceLT2);
    setPriceLT3(Ojb.PriceLT3);
    setPriceHotel1(Ojb.PriceHotel1);
    setPriceHotel2(Ojb.PriceHotel2);
    setPriceHotel3(Ojb.PriceHotel3);
    setPriceHotel4(Ojb.PriceHotel4);
    setPriceRS1(Ojb.PriceRS1);
    setPriceRS2(Ojb.PriceRS2);
    setPriceRS3(Ojb.PriceRS3);
    setPriceSS1(Ojb.PriceSS1);
    setPriceSS2(Ojb.PriceSS2);
    setPriceSS3(Ojb.PriceSS3);
    setPriceVisa1(Ojb.PriceVisa1);
    setPriceVisa2(Ojb.PriceVisa2);
    setPriceVisa3(Ojb.PriceVisa3);
    setPriceVisa4(Ojb.PriceVisa4);
    setPriceVisa5(Ojb.PriceVisa5);
    setPriceGT1(Ojb.PriceGT1);
    setPriceGT2(Ojb.PriceGT2);
    setPriceGT3(Ojb.PriceGT3);
    setPriceIR1(Ojb.PriceIR1);
    setPriceIR2(Ojb.PriceIR2);
    setPriceIR3(Ojb.PriceIR3);
    setPriceTIP1(Ojb.PriceTIP1);
    setPriceTIP2(Ojb.PriceTIP2);
    setPriceTIP3(Ojb.PriceTIP3);
    setPriceTIP4(Ojb.PriceTIP4);
    setPriceW1(Ojb.PriceW1);
    setPriceW2(Ojb.PriceW2);
    setPriceW3(Ojb.PriceW3);
    setPricePS1(Ojb.PricePS1);
    setPricePS2(Ojb.PricePS2);
    setPricePS3(Ojb.PricePS3);
    setPricePS4(Ojb.PricePS4);
    setPriceOC1(Ojb.PriceOC1);
    setPriceOC2(Ojb.PriceOC2);
    setPriceOC3(Ojb.PriceOC3);
    setPriceOC4(Ojb.PriceOC4);
    setPriceOC5(Ojb.PriceOC5);
    setPriceOC6(Ojb.PriceOC6);
    setDetailVMB1(Ojb.DetailVMB1);
    setDetailVMB2(Ojb.DetailVMB2);
    setDetailVMB3(Ojb.DetailVMB3);
    setDetailVMB4(Ojb.DetailVMB4);
    setDetailVMB5(Ojb.DetailVMB5);
    setDetailLT1(Ojb.DetailLT1);
    setDetailLT2(Ojb.DetailLT2);
    setDetailLT3(Ojb.DetailLT3);
    setDetailHotel1(Ojb.DetailHotel1);
    setDetailHotel2(Ojb.DetailHotel2);
    setDetailHotel3(Ojb.DetailHotel3);
    setDetailHotel4(Ojb.DetailHotel4);
    setDetailRS1(Ojb.DetailRS1);
    setDetailRS2(Ojb.DetailRS2);
    setDetailRS3(Ojb.DetailRS3);
    setDetailSS1(Ojb.DetailSS1);
    setDetailSS2(Ojb.DetailSS2);
    setDetailSS3(Ojb.DetailSS3);
    setDetailVisa1(Ojb.DetailVisa1);
    setDetailVisa2(Ojb.DetailVisa2);
    setDetailVisa3(Ojb.DetailVisa3);
    setDetailVisa4(Ojb.DetailVisa4);
    setDetailVisa5(Ojb.DetailVisa5);
    setDetailGT1(Ojb.DetailGT1);
    setDetailGT2(Ojb.DetailGT2);
    setDetailGT3(Ojb.DetailGT3);
    setDetailIR1(Ojb.DetailIR1);
    setDetailIR2(Ojb.DetailIR2);
    setDetailIR3(Ojb.DetailIR3);
    setDetailTIP1(Ojb.DetailTIP1);
    setDetailTIP2(Ojb.DetailTIP2);
    setDetailTIP3(Ojb.DetailTIP3);
    setDetailTIP4(Ojb.DetailTIP4);
    setDetailW1(Ojb.DetailW1);
    setDetailW2(Ojb.DetailW2);
    setDetailW3(Ojb.DetailW3);
    setDetailPS1(Ojb.DetailPS1);
    setDetailPS2(Ojb.DetailPS2);
    setDetailPS3(Ojb.DetailPS3);
    setDetailPS4(Ojb.DetailPS4);
    setDetailOC1(Ojb.DetailOC1);
    setDetailOC2(Ojb.DetailOC2);
    setDetailOC3(Ojb.DetailOC3);
    setDetailOC4(Ojb.DetailOC4);
    setDetailOC5(Ojb.DetailOC5);
    setDetailOC6(Ojb.DetailOC6);
    let NotesVMB = Ojb.NotesVMB.split(";"),
      NotesHotel = Ojb.NotesHotel.split(";"),
      NotNotesLT = Ojb.NotNotesLT.split(";"),
      NotesRS = Ojb.NotesRS.split(";"),
      NotesSS = Ojb.NotesSS.split(";"),
      NotesVisa = Ojb.NotesSS.split(";"),
      NotesGT = Ojb.NotesGT.split(";"),
      NotesIR = Ojb.NotesIR.split(";"),
      NotesTip = Ojb.NotesTip.split(";"),
      NotesW = Ojb.NotesW.split(";"),
      NotesPS = Ojb.NotesPS.split(";"),
      NotesOC = Ojb.NotesOC.split(";");
    setNotesVMB1(NotesVMB[0]);
    setNotesVMB2(NotesVMB[1]);
    setNotesVMB3(NotesVMB[2]);
    setNotesVMB4(NotesVMB[3]);
    setNotesVMB5(NotesVMB[4]);
    setNotesLT1(NotNotesLT[0]);
    setNotesLT2(NotNotesLT[1]);
    setNotesLT3(NotNotesLT[2]);
    setNotesHotel1(NotesHotel[0]);
    setNotesHotel2(NotesHotel[1]);
    setNotesHotel3(NotesHotel[2]);
    setNotesHotel4(NotesHotel[3]);
    setNotesRS1(NotesRS[0]);
    setNotesRS2(NotesRS[1]);
    setNotesRS3(NotesRS[2]);
    setNotesSS1(NotesSS[0]);
    setNotesSS2(NotesSS[1]);
    setNotesSS3(NotesSS[2]);
    setNotesVisa1(NotesVisa[0]);
    setNotesVisa2(NotesVisa[1]);
    setNotesVisa3(NotesVisa[2]);
    setNotesVisa4(NotesVisa[3]);
    setNotesVisa5(NotesVisa[4]);
    setNotesGT1(NotesGT[0]);
    setNotesGT2(NotesGT[1]);
    setNotesGT3(NotesGT[2]);
    setNotesIR1(NotesIR[0]);
    setNotesIR2(NotesIR[1]);
    setNotesIR3(NotesIR[2]);
    setNotesTIP1(NotesTip[0]);
    setNotesTIP2(NotesTip[1]);
    setNotesTIP3(NotesTip[2]);
    setNotesTIP4(NotesTip[3]);
    setNotesW1(NotesW[0]);
    setNotesW2(NotesW[1]);
    setNotesW3(NotesW[2]);
    setNotesPS1(NotesPS[0]);
    setNotesPS2(NotesPS[1]);
    setNotesPS3(NotesPS[2]);
    setNotesPS4(NotesPS[3]);
    setNotesOC1(NotesOC[0]);
    setNotesOC2(NotesOC[1]);
    setNotesOC3(NotesOC[2]);
    setNotesOC4(NotesOC[3]);
    setNotesOC5(NotesOC[4]);
    setNotesOC6(NotesOC[5]);
  };

  const Delete = async (e) => {
    let Ojb = e.row._original;
    try {
      const pr = {
        TourCostId: Ojb.TourCostId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTourCost_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        const newArr = [...DataTableList];
        setDataTableList(
          newArr.filter((item) => item.TourCostId !== Ojb.TourCostId)
        );
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const tableRef = useRef(null);
  const [ArrayTable, setArrayTable] = useState([]);
  const [HiddenTabExcel, setHiddenTabExcel] = useState(true);
  const Excel = (e) => {
    setArrayTable(e.row.original);
    setHiddenTabExcel(false);
    document.querySelector("#tab_3").click();
  };

  const LoseTabExcel = () => {
    setHiddenTabExcel(true);
    document.querySelector("#tab_1").click();
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Users table",
    sheet: "Users",
  });

  const columns = [
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
      width: 250,
      filterable: false,
      sortable: false,
      Cell: (row) => (
        <div>
          <span>
            <button
              className="btn btn-sm btn-info"
              onClick={(e) => Edit({ row })}
            >
              <i class="fa fa-eye"></i> Sửa
            </button>
            |
            <button
              className="btn btn-sm btn-danger"
              onClick={(e) => {
                ConfirmAlert("Xác nhận", "Bạn có muốn lưu không?", () => {
                  Delete(row);
                });
              }}
            >
              <i class="fas fa-eraser"></i> Xóa
            </button>
            |
            <button
              className="btn btn-sm btn-success"
              onClick={(e) => Excel({ row })}
            >
              <i class="fa fa-download pr-2"></i>Excel
            </button>
          </span>
        </div>
      ),
    },
    {
      Header: "Tiêu Đề Tour",
      accessor: "TitleTourCost",
      width: 250,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {row._original.TitleTourCost}
        </span>
      ),
    },
    {
      Header: "Tên Tour",
      accessor: "TourCostName",
      width: 250,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {row._original.TourCostName}
        </span>
      ),
    },
    {
      Header: "Mã Tour",
      accessor: "TourCostCode",
      width: 250,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {row._original.TourCostCode}
        </span>
      ),
    },
    {
      Header: "Thời Gian",
      accessor: "TourCostTime",
      width: 150,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {row._original.TourCostTime}
        </span>
      ),
    },
    {
      Header: "Giờ Bay",
      accessor: "FlightTime",
      width: 350,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {row._original.FlightTime}
        </span>
      ),
    },
    {
      Header: "Giá Bán",
      accessor: "Price",
      width: 100,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {parseFloat(row._original.Price)}
        </span>
      ),
    },
    {
      Header: "Số Lượng",
      accessor: "Quantity",
      width: 100,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {row._original.Quantity}
        </span>
      ),
    },
    {
      Header: "Tổng Tiền",
      width: 250,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {parseFloat(row._original.Price) * row._original.Quantity}
        </span>
      ),
    },
    {
      Header: "Tỷ Giá",
      accessor: "ExchangeRate",
      width: 150,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {parseFloat(row._original.ExchangeRate)}
        </span>
      ),
    },
    {
      Header: "Loại Tiền",
      accessor: "Currency",
      width: 100,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {row._original.Currency}
        </span>
      ),
    },
    {
      Header: "Tổng Cộng Chi Phí",
      accessor: "TotalPrice",
      width: 250,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {parseFloat(row._original.TotalPrice)}
        </span>
      ),
    },
    {
      Header: "Giá NET 1 Pax",
      accessor: "PriceOnePax",
      width: 250,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {parseFloat(row._original.PriceOnePax)}
        </span>
      ),
    },
    {
      Header: "Giá NET 1 Pax VNĐ",
      accessor: "PriceOnePaxVND",
      width: 350,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {parseFloat(row._original.PriceOnePaxVND)}
        </span>
      ),
    },
    {
      Header: "Lãi 1 Pax",
      accessor: "InterestRateOnePax",
      width: 250,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {parseFloat(row._original.InterestRateOnePax)}
        </span>
      ),
    },
    {
      Header: "Lãi 1 Pax VNĐ",
      accessor: "InterestRateOnePaxVND",
      width: 250,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {parseFloat(row._original.InterestRateOnePaxVND)}
        </span>
      ),
    },
    {
      Header: "Phần Trăm (%)",
      accessor: "PercentCost",
      width: 150,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {parseFloat(row._original.PercentCost)}
        </span>
      ),
    },
    {
      Header: "Lãi Gộp",
      accessor: "GrossProfit",
      width: 250,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {parseFloat(row._original.GrossProfit)}
        </span>
      ),
    },
    {
      Header: "Lãi Gộp VNĐ",
      accessor: "GrossProfitVND",
      width: 350,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {parseFloat(row._original.GrossProfitVND)}
        </span>
      ),
    },
    {
      Header: "Người Tạo",
      accessor: "Creater",
      width: 200,
    },
    {
      Header: "Thời Gian Tạo",
      accessor: "CreateTime",
      width: 200,
      Cell: ({ row }) => (
        <span style={{ color: row._original.Colour }}>
          {FormatDateJson(row._original.CreateTime, 10)}
        </span>
      ),
    },
  ];

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
                aria-labelledby="custom-tabs-two-home-tab"
              >
                KHỞI TẠO PHIẾU
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link "
                href="#tab_2"
                data-toggle="tab"
                aria-labelledby="custom-tabs-two-profile-tab"
              >
                DANH SÁCH
              </a>
            </li>
            {HiddenTabExcel === false ? (
              <li className="nav-item">
                <a
                  className="nav-link "
                  href="#tab_3"
                  data-toggle="tab"
                  aria-labelledby="custom-tabs-two-Excel-tab"
                >
                  DownLoadExcel
                </a>
              </li>
            ) : (
              ""
            )}
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
                          Khởi Tạo Phiếu Chiết Tính
                        </span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn margin-top-5s">
                      <button
                        className="btn btn-sm btn-success pull-right margin-left-10"
                        onClick={() => {
                          ConfirmAlert(
                            "Xác nhận",
                            "Bạn có muốn lưu không?",
                            () => {
                              Trl_spTourCost_Save(0);
                            }
                          );
                        }}
                        type="button"
                      >
                        <i className="fa fa-plus pr-2" />
                        Thêm Mới
                      </button>
                      <button
                        className="btn btn-sm btn-danger pull-right margin-left-10"
                        onClick={() => {
                          ConfirmAlert(
                            "Xác nhận",
                            "Bạn có muốn lưu không?",
                            () => {
                              Trl_spTourCost_Save(1);
                            }
                          );
                        }}
                        type="button"
                      >
                        <i className="fa fa-plus pr-2" />
                        Lưu & Lock
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-danger pull-right margin-left-10"
                        onClick={Trl_spBooking_CustomerPlane_View}
                      >
                        <i class="fa fa-search pr-2"></i>
                        Tìm kiếm
                      </button>
                      <div
                        class="form-group pull-right"
                        style={{ marginTop: "-4px", width: "30%" }}
                      >
                        <div
                          class="input-group index-select"
                          style={{ width: "100%" }}
                        >
                          <SelectServiceSale
                            onSelected={(e) => onSelectServiceSale(e)}
                            items={serviceSale?.value || 0}
                            className={"w-100 select-custom z-maxx"}
                            type={1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body tour-request">
                  <div className="center-item">
                    {isHidden ? (
                      <h3
                        class="card-title uppercase font-size-lg text-capitalize font-weight-normal"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        Chiết Tính Chi Phí Đi Tour
                        {isHovering ? (
                          <button
                            className="btn btn-sm btn-success pull-right margin-left-10"
                            onClick={onClickTitle}
                          >
                            <i className="far fa-edit" />
                          </button>
                        ) : (
                          ""
                        )}
                      </h3>
                    ) : (
                      <h3 class="card-title uppercase font-size-lg text-capitalize font-weight-normal">
                        <div className="col-xs-12 col-sm-12 col-md-12">
                          <div class="input-group">
                            <input
                              type="text"
                              class="form-control2"
                              value={TitleTourCost}
                              onChange={(e) => setTitleTourCost(e.target.value)}
                            />
                          </div>
                        </div>
                      </h3>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-2 font-weight-bold">Tên Tour:</div>
                        {HiddenFix === true ? (
                          <div className="col-10 ">
                            {HiddenValue === false
                              ? serviceSale.ServiceSaleName
                              : ""}
                          </div>
                        ) : (
                          <div class="col-10">
                            <input
                              type="text"
                              class="form-control-none "
                              readOnly
                              value={TourCostName}
                              onChange={(e) => setTourCostName(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-2 font-weight-bold">Mã Tour:</div>
                        {HiddenFix === true ? (
                          <div className="col-10 ">
                            {HiddenValue === false
                              ? serviceSale.ServiceSaleCode
                              : ""}
                          </div>
                        ) : (
                          <div class="col-10">
                            <input
                              type="text"
                              class="form-control-none "
                              readOnly
                              value={TourCostCode}
                              onChange={(e) => setTourCostCode(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-2 font-weight-bold">Thời Gian:</div>
                        <div className="col-8">
                          <div class="input-group">
                            <input
                              type="text"
                              class="form-control2"
                              value={DateTime}
                              onChange={(e) => setDateTime(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 border-bottom">
                      {HiddenFix === true ? (
                        <div className="row">
                          <div className="col-2 font-weight-bold">Giờ Bay:</div>
                          {HiddenValue === true ? (
                            <div className="col-10"></div>
                          ) : (
                            <div className="col-10">
                              {FlightList.length > 0 &&
                                FlightList.map((item, index) => {
                                  return <div>{item.PlaneCodeEnd}</div>;
                                })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="row">
                          <div className="col-2 font-weight-bold">Giờ Bay:</div>
                          <div class="col-10">
                            <input
                              type="text"
                              class="form-control-none "
                              readOnly
                              value={FlightTime}
                              onChange={(e) => setFlightTime(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-12 p-0 mt-3">
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <div class="row col-12">
                          <div class="row margin-top-20 col-12">
                            <div className="col-2">
                              <i
                                class="titlecenter"
                                style={{ fontSize: "13px", paddingTop: "5px" }}
                              >
                                Loại Tiền
                              </i>
                              <div className="text-center">
                                <div class="input-group">
                                  <Select
                                    className="SelectMeno"
                                    value={CostList}
                                    onChange={onSelecteCost}
                                    options={CostValue}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-2">
                              <i
                                class="titlecenter"
                                style={{ fontSize: "13px", paddingTop: "5px" }}
                              >
                                Tỷ Giá
                              </i>
                              <div className="text-center">
                                <div class="input-group">
                                  <input
                                    type="text"
                                    class="form-control2"
                                    value={ExchangeRate}
                                    onChange={(e) =>
                                      setExchangeRate(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-3">
                              <i
                                class="titlecenter"
                                style={{ fontSize: "13px", paddingTop: "5px" }}
                              >
                                Giá Bán
                              </i>
                              <div className="text-center">
                                <div class="input-group">
                                  <input
                                    type="text"
                                    class="form-control2"
                                    value={Price}
                                    onChange={(e) => setPrice(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-3">
                              <i
                                class="titlecenter"
                                style={{ fontSize: "13px", paddingTop: "5px" }}
                              >
                                Số Lượng
                              </i>
                              <div className="text-center">
                                <div class="input-group">
                                  <input
                                    type="text"
                                    class="form-control2"
                                    value={Quantity}
                                    onChange={(e) =>
                                      onClickQuantity(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-2">
                              <i
                                class="titlecenter"
                                style={{ fontSize: "13px", paddingTop: "5px" }}
                              >
                                Tổng Tiền
                              </i>
                              <div className="text-center">
                                <div class="input-group">
                                  <input
                                    type="text"
                                    class="form-control2"
                                    readOnly
                                    value={parseFloat(Price) * Quantity}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <table
                            class="table table-bordered table-request-tour table-hover margin-top-20  text-center"
                            id="dataTable"
                          >
                            <tbody className=" text-dark">
                              <tr className="title-guider text-center">
                                <th>Dịch vụ</th>
                                <th>Chi Tiết</th>
                                <th>Giá Thành</th>
                                <th>Số Lượng</th>
                                <th>Thành Tiền</th>
                                <th>Ghi Chú</th>
                              </tr>
                              <tr className="text-center">
                                <th rowspan="5">VMB</th>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailVMB1}
                                      onChange={(e) =>
                                        setDetailVMB1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceVMB1}
                                      onChange={(e) =>
                                        setPriceVMB1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceVMB1) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesVMB1}
                                      onChange={(e) =>
                                        setNotesVMB1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailVMB2}
                                      onChange={(e) =>
                                        setDetailVMB2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceVMB2}
                                      onChange={(e) =>
                                        setPriceVMB2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{1}</td>
                                <td>{parseFloat(PriceVMB2) * 1}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesVMB2}
                                      onChange={(e) =>
                                        setNotesVMB2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailVMB3}
                                      onChange={(e) =>
                                        setDetailVMB3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceVMB3}
                                      onChange={(e) =>
                                        setPriceVMB3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceVMB3) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesVMB3}
                                      onChange={(e) =>
                                        setNotesVMB3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailVMB4}
                                      onChange={(e) =>
                                        setDetailVMB4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceVMB4}
                                      onChange={(e) =>
                                        setPriceVMB4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceVMB4) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesVMB4}
                                      onChange={(e) =>
                                        setNotesVMB4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailVMB5}
                                      onChange={(e) =>
                                        setDetailVMB5(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceVMB5}
                                      onChange={(e) =>
                                        setPriceVMB5(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceVMB5) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesVMB5}
                                      onChange={(e) =>
                                        setNotesVMB5(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <th rowspan="3">LANDTOUR</th>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailLT1}
                                      onChange={(e) =>
                                        setDetailLT1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceLT1}
                                      onChange={(e) =>
                                        setPriceLT1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceLT1) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesLT1}
                                      onChange={(e) =>
                                        setNotesLT1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailLT2}
                                      onChange={(e) =>
                                        setDetailLT2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceLT2}
                                      onChange={(e) =>
                                        setPriceLT2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceLT2) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesLT2}
                                      onChange={(e) =>
                                        setNotesLT2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailLT3}
                                      onChange={(e) =>
                                        setDetailLT3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceLT3}
                                      onChange={(e) =>
                                        setPriceLT3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceLT3) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesLT3}
                                      onChange={(e) =>
                                        setNotesLT3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <th rowSpan="4">Khách Sạn</th>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailHotel1}
                                      onChange={(e) =>
                                        setDetailHotel1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceHotel1}
                                      onChange={(e) =>
                                        setPriceHotel1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceHotel1) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesHotel1}
                                      onChange={(e) =>
                                        setNotesHotel1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailHotel2}
                                      onChange={(e) =>
                                        setDetailHotel2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceHotel2}
                                      onChange={(e) =>
                                        setPriceHotel2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceHotel2) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesHotel2}
                                      onChange={(e) =>
                                        setNotesHotel2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailHotel3}
                                      onChange={(e) =>
                                        setDetailHotel3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceHotel3}
                                      onChange={(e) =>
                                        setPriceHotel3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceHotel3) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesHotel3}
                                      onChange={(e) =>
                                        setNotesHotel3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailHotel4}
                                      onChange={(e) =>
                                        setDetailHotel4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceHotel4}
                                      onChange={(e) =>
                                        setPriceHotel4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceHotel4) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesHotel4}
                                      onChange={(e) =>
                                        setNotesHotel4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <th rowSpan="3">Nhà Hàng</th>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailRS1}
                                      onChange={(e) =>
                                        setDetailRS1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceRS1}
                                      onChange={(e) =>
                                        setPriceRS1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceRS1) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesRS1}
                                      onChange={(e) =>
                                        setNotesRS1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailRS2}
                                      onChange={(e) =>
                                        setDetailRS2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceRS2}
                                      onChange={(e) =>
                                        setPriceRS2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceRS2) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesRS2}
                                      onChange={(e) =>
                                        setNotesRS2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailRS3}
                                      onChange={(e) =>
                                        setDetailRS3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceRS3}
                                      onChange={(e) =>
                                        setPriceRS3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceRS3) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesRS3}
                                      onChange={(e) =>
                                        setNotesRS3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <th rowSpan="3">Tham Quan</th>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailSS1}
                                      onChange={(e) =>
                                        setDetailSS1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceSS1}
                                      onChange={(e) =>
                                        setPriceSS1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceSS1) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesSS1}
                                      onChange={(e) =>
                                        setNotesSS1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailSS2}
                                      onChange={(e) =>
                                        setDetailSS2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceSS2}
                                      onChange={(e) =>
                                        setPriceSS2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceSS2) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesSS2}
                                      onChange={(e) =>
                                        setNotesSS2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailSS3}
                                      onChange={(e) =>
                                        setDetailSS3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceSS3}
                                      onChange={(e) =>
                                        setPriceSS3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceSS3) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesSS3}
                                      onChange={(e) =>
                                        setNotesSS3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <th rowSpan="5">VISA</th>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailVisa1}
                                      onChange={(e) =>
                                        setDetailVisa1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceVisa1}
                                      onChange={(e) =>
                                        setPriceVisa1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceVisa1) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesVisa1}
                                      onChange={(e) =>
                                        setNotesVisa1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailVisa2}
                                      onChange={(e) =>
                                        setDetailVisa2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceVisa2}
                                      onChange={(e) =>
                                        setPriceVisa2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceVisa2) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesVisa2}
                                      onChange={(e) =>
                                        setNotesVisa2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailVisa3}
                                      onChange={(e) =>
                                        setDetailVisa3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceVisa3}
                                      onChange={(e) =>
                                        setPriceVisa3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{1}</td>
                                <td>{parseFloat(PriceVisa3) * 1}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesVisa3}
                                      onChange={(e) =>
                                        setNotesVisa3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailVisa4}
                                      onChange={(e) =>
                                        setDetailVisa4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceVisa4}
                                      onChange={(e) =>
                                        setPriceVisa4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceVisa4) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesVisa4}
                                      onChange={(e) =>
                                        setNotesVisa4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailVisa5}
                                      onChange={(e) =>
                                        setDetailVisa5(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceVisa5}
                                      onChange={(e) =>
                                        setPriceVisa5(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceVisa5) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesVisa5}
                                      onChange={(e) =>
                                        setNotesVisa5(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <th rowSpan="3">Hướng Dẫn Viên</th>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailGT1}
                                      onChange={(e) =>
                                        setDetailGT1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceGT1}
                                      onChange={(e) =>
                                        setPriceGT1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{1}</td>
                                <td>{parseFloat(PriceGT1) * 1}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesGT1}
                                      onChange={(e) =>
                                        setNotesGT1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailGT2}
                                      onChange={(e) =>
                                        setDetailGT2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceGT2}
                                      onChange={(e) =>
                                        setPriceGT2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{1}</td>
                                <td>{parseFloat(PriceGT2) * 1}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesGT2}
                                      onChange={(e) =>
                                        setNotesGT2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailGT3}
                                      onChange={(e) =>
                                        setDetailGT3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceGT3}
                                      onChange={(e) =>
                                        setPriceGT3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{1}</td>
                                <td>{parseFloat(PriceGT3) * 1}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesGT3}
                                      onChange={(e) =>
                                        setNotesGT3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <th rowSpan="3">Bảo Hiểm</th>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailIR1}
                                      onChange={(e) =>
                                        setDetailIR1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceIR1}
                                      onChange={(e) =>
                                        setPriceIR1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{QuantityBH}</td>
                                <td>{parseFloat(PriceIR1) * QuantityBH}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesIR1}
                                      onChange={(e) =>
                                        setNotesIR1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailIR2}
                                      onChange={(e) =>
                                        setDetailIR2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceIR2}
                                      onChange={(e) =>
                                        setPriceIR2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{QuantityBH}</td>
                                <td>{parseFloat(PriceIR2) * QuantityBH}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesIR2}
                                      onChange={(e) =>
                                        setNotesIR2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailIR3}
                                      onChange={(e) =>
                                        setDetailIR3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceIR3}
                                      onChange={(e) =>
                                        setPriceIR3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{QuantityBH}</td>
                                <td>{parseFloat(PriceIR3) * QuantityBH}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesIR3}
                                      onChange={(e) =>
                                        setNotesIR3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <th rowSpan="4">TIP</th>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailTIP1}
                                      onChange={(e) =>
                                        setDetailTIP1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceTIP1}
                                      onChange={(e) =>
                                        setPriceTIP1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{FormatNumber(Quantity)}</td>
                                <td>{parseFloat(PriceTIP1) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesTIP1}
                                      onChange={(e) =>
                                        setNotesTIP1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailTIP2}
                                      onChange={(e) =>
                                        setDetailTIP2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceTIP2}
                                      onChange={(e) =>
                                        setPriceTIP2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PriceTIP2) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesTIP2}
                                      onChange={(e) =>
                                        setNotesTIP2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailTIP3}
                                      onChange={(e) =>
                                        setDetailTIP3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceTIP3}
                                      onChange={(e) =>
                                        setPriceTIP3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PriceTIP3) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesTIP3}
                                      onChange={(e) =>
                                        setNotesTIP3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailTIP4}
                                      onChange={(e) =>
                                        setDetailTIP4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceTIP4}
                                      onChange={(e) =>
                                        setPriceTIP4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PriceTIP4) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesTIP4}
                                      onChange={(e) =>
                                        setNotesTIP4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <th rowSpan="3">Nước</th>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailW1}
                                      onChange={(e) =>
                                        setDetailW1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceW1}
                                      onChange={(e) =>
                                        setPriceW1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PriceW1) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesW1}
                                      onChange={(e) =>
                                        setNotesW1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailW2}
                                      onChange={(e) =>
                                        setDetailW2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceW2}
                                      onChange={(e) =>
                                        setPriceW2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PriceW2) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesW2}
                                      onChange={(e) =>
                                        setNotesW2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailW3}
                                      onChange={(e) =>
                                        setDetailW3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceW3}
                                      onChange={(e) =>
                                        setPriceW3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PriceW3) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesW3}
                                      onChange={(e) =>
                                        setNotesW3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <th rowSpan="4">Quà Tặng</th>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailPS1}
                                      onChange={(e) =>
                                        setDetailPS1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PricePS1}
                                      onChange={(e) =>
                                        setPricePS1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PricePS1) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesPS1}
                                      onChange={(e) =>
                                        setNotesPS1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailPS2}
                                      onChange={(e) =>
                                        setDetailPS2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PricePS2}
                                      onChange={(e) =>
                                        setPricePS2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PricePS2) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesPS2}
                                      onChange={(e) =>
                                        setNotesPS2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailPS3}
                                      onChange={(e) =>
                                        setDetailPS3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PricePS3}
                                      onChange={(e) =>
                                        setPricePS3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PricePS3) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesPS3}
                                      onChange={(e) =>
                                        setNotesPS3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailPS4}
                                      onChange={(e) =>
                                        setDetailPS4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PricePS4}
                                      onChange={(e) =>
                                        setPricePS4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PricePS4) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesPS4}
                                      onChange={(e) =>
                                        setNotesPS4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <th rowSpan="6">Chi Phí Khác</th>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailOC1}
                                      onChange={(e) =>
                                        setDetailOC1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceOC1}
                                      onChange={(e) =>
                                        setPriceOC1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PriceOC1) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesOC1}
                                      onChange={(e) =>
                                        setNotesOC1(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailOC2}
                                      onChange={(e) =>
                                        setDetailOC2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceOC2}
                                      onChange={(e) =>
                                        setPriceOC2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PriceOC2) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesOC2}
                                      onChange={(e) =>
                                        setNotesOC2(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailOC3}
                                      onChange={(e) =>
                                        setDetailOC3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceOC3}
                                      onChange={(e) =>
                                        setPriceOC3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PriceOC3) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesOC3}
                                      onChange={(e) =>
                                        setNotesOC3(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailOC4}
                                      onChange={(e) =>
                                        setDetailOC4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceOC4}
                                      onChange={(e) =>
                                        setPriceOC4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PriceOC4) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesOC4}
                                      onChange={(e) =>
                                        setNotesOC4(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailOC5}
                                      onChange={(e) =>
                                        setDetailOC5(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceOC5}
                                      onChange={(e) =>
                                        setPriceOC5(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PriceOC5) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesOC5}
                                      onChange={(e) =>
                                        setNotesOC5(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="text-center">
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={DetailOC6}
                                      onChange={(e) =>
                                        setDetailOC6(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={PriceOC6}
                                      onChange={(e) =>
                                        setPriceOC6(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{Quantity}</td>
                                <td>{parseFloat(PriceOC6) * Quantity}</td>
                                <td>
                                  <div class="input-group my-1 ">
                                    <input
                                      type="text"
                                      class="form-control-none "
                                      value={NotesOC6}
                                      onChange={(e) =>
                                        setNotesOC6(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan="2">Tổng Cộng Chi Phí</td>
                                <td></td>
                                <td></td>
                                <td>
                                  {(parseFloat(PriceVMB1) +
                                    parseFloat(PriceVMB3) +
                                    parseFloat(PriceVMB4) +
                                    parseFloat(PriceVMB5) +
                                    parseFloat(PriceLT1) +
                                    parseFloat(PriceLT2) +
                                    parseFloat(PriceLT3) +
                                    parseFloat(PriceHotel1) +
                                    parseFloat(PriceHotel2) +
                                    parseFloat(PriceHotel3) +
                                    parseFloat(PriceHotel4) +
                                    parseFloat(PriceRS1) +
                                    parseFloat(PriceRS2) +
                                    parseFloat(PriceRS3) +
                                    parseFloat(PriceSS1) +
                                    parseFloat(PriceSS2) +
                                    parseFloat(PriceSS3) +
                                    parseFloat(PriceVisa1) +
                                    parseFloat(PriceVisa2) +
                                    parseFloat(PriceVisa4) +
                                    parseFloat(PriceVisa5) +
                                    parseFloat(PriceTIP2) +
                                    parseFloat(PriceTIP3) +
                                    parseFloat(PriceTIP4) +
                                    parseFloat(PriceW1) +
                                    parseFloat(PriceW2) +
                                    parseFloat(PriceW3) +
                                    parseFloat(PricePS1) +
                                    parseFloat(PricePS2) +
                                    parseFloat(PricePS3) +
                                    parseFloat(PricePS4) +
                                    parseFloat(PriceOC1) +
                                    parseFloat(PriceOC2) +
                                    parseFloat(PriceOC3) +
                                    parseFloat(PriceOC4) +
                                    parseFloat(PriceOC5) +
                                    parseFloat(PriceOC6)) *
                                    Quantity +
                                    parseFloat(PriceVMB2) +
                                    parseFloat(PriceVisa3) +
                                    parseFloat(PriceGT1) +
                                    parseFloat(PriceGT2) +
                                    parseFloat(PriceGT3) +
                                    parseFloat(PriceIR1) * QuantityBH +
                                    parseFloat(PriceIR2) * QuantityBH +
                                    parseFloat(PriceIR3) * QuantityBH +
                                    parseFloat(PriceTIP1)}
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td colSpan="2">Giá NET 1 pax {CostName}</td>
                                <td></td>
                                <td></td>
                                <td>
                                  {((parseFloat(PriceVMB1) +
                                    parseFloat(PriceVMB3) +
                                    parseFloat(PriceVMB4) +
                                    parseFloat(PriceVMB5) +
                                    parseFloat(PriceLT1) +
                                    parseFloat(PriceLT2) +
                                    parseFloat(PriceLT3) +
                                    parseFloat(PriceHotel1) +
                                    parseFloat(PriceHotel2) +
                                    parseFloat(PriceHotel3) +
                                    parseFloat(PriceHotel4) +
                                    parseFloat(PriceRS1) +
                                    parseFloat(PriceRS2) +
                                    parseFloat(PriceRS3) +
                                    parseFloat(PriceSS1) +
                                    parseFloat(PriceSS2) +
                                    parseFloat(PriceSS3) +
                                    parseFloat(PriceVisa1) +
                                    parseFloat(PriceVisa2) +
                                    parseFloat(PriceVisa4) +
                                    parseFloat(PriceVisa5) +
                                    parseFloat(PriceTIP2) +
                                    parseFloat(PriceTIP3) +
                                    parseFloat(PriceTIP4) +
                                    parseFloat(PriceW1) +
                                    parseFloat(PriceW2) +
                                    parseFloat(PriceW3) +
                                    parseFloat(PricePS1) +
                                    parseFloat(PricePS2) +
                                    parseFloat(PricePS3) +
                                    parseFloat(PricePS4) +
                                    parseFloat(PriceOC1) +
                                    parseFloat(PriceOC2) +
                                    parseFloat(PriceOC3) +
                                    parseFloat(PriceOC4) +
                                    parseFloat(PriceOC5) +
                                    parseFloat(PriceOC6)) *
                                    Quantity +
                                    parseFloat(PriceVMB2) +
                                    parseFloat(PriceVisa3) +
                                    parseFloat(PriceGT1) +
                                    parseFloat(PriceGT2) +
                                    parseFloat(PriceGT3) +
                                    parseFloat(PriceIR1) * QuantityBH +
                                    parseFloat(PriceIR2) * QuantityBH +
                                    parseFloat(PriceIR3) * QuantityBH +
                                    parseFloat(PriceTIP1)) /
                                    Quantity}
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td colSpan="2">Giá NET 1 pax VND</td>
                                <td></td>
                                <td></td>
                                <td>
                                  {(((parseFloat(PriceVMB1) +
                                    parseFloat(PriceVMB3) +
                                    parseFloat(PriceVMB4) +
                                    parseFloat(PriceVMB5) +
                                    parseFloat(PriceLT1) +
                                    parseFloat(PriceLT2) +
                                    parseFloat(PriceLT3) +
                                    parseFloat(PriceHotel1) +
                                    parseFloat(PriceHotel2) +
                                    parseFloat(PriceHotel3) +
                                    parseFloat(PriceHotel4) +
                                    parseFloat(PriceRS1) +
                                    parseFloat(PriceRS2) +
                                    parseFloat(PriceRS3) +
                                    parseFloat(PriceSS1) +
                                    parseFloat(PriceSS2) +
                                    parseFloat(PriceSS3) +
                                    parseFloat(PriceVisa1) +
                                    parseFloat(PriceVisa2) +
                                    parseFloat(PriceVisa4) +
                                    parseFloat(PriceVisa5) +
                                    parseFloat(PriceTIP2) +
                                    parseFloat(PriceTIP3) +
                                    parseFloat(PriceTIP4) +
                                    parseFloat(PriceW1) +
                                    parseFloat(PriceW2) +
                                    parseFloat(PriceW3) +
                                    parseFloat(PricePS1) +
                                    parseFloat(PricePS2) +
                                    parseFloat(PricePS3) +
                                    parseFloat(PricePS4) +
                                    parseFloat(PriceOC1) +
                                    parseFloat(PriceOC2) +
                                    parseFloat(PriceOC3) +
                                    parseFloat(PriceOC4) +
                                    parseFloat(PriceOC5) +
                                    parseFloat(PriceOC6)) *
                                    Quantity +
                                    parseFloat(PriceVMB2) +
                                    parseFloat(PriceVisa3) +
                                    parseFloat(PriceGT1) +
                                    parseFloat(PriceGT2) +
                                    parseFloat(PriceGT3) +
                                    parseFloat(PriceIR1) * QuantityBH +
                                    parseFloat(PriceIR2) * QuantityBH +
                                    parseFloat(PriceIR3) * QuantityBH +
                                    parseFloat(PriceTIP1)) /
                                    Quantity) *
                                    parseFloat(ExchangeRate)}
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td colSpan="2">Lãi 1 pax {CostName}</td>
                                <td></td>
                                <td></td>
                                <td>
                                  {((parseFloat(PriceVMB1) +
                                    parseFloat(PriceVMB3) +
                                    parseFloat(PriceVMB4) +
                                    parseFloat(PriceVMB5) +
                                    parseFloat(PriceLT1) +
                                    parseFloat(PriceLT2) +
                                    parseFloat(PriceLT3) +
                                    parseFloat(PriceHotel1) +
                                    parseFloat(PriceHotel2) +
                                    parseFloat(PriceHotel3) +
                                    parseFloat(PriceHotel4) +
                                    parseFloat(PriceRS1) +
                                    parseFloat(PriceRS2) +
                                    parseFloat(PriceRS3) +
                                    parseFloat(PriceSS1) +
                                    parseFloat(PriceSS2) +
                                    parseFloat(PriceSS3) +
                                    parseFloat(PriceVisa1) +
                                    parseFloat(PriceVisa2) +
                                    parseFloat(PriceVisa4) +
                                    parseFloat(PriceVisa5) +
                                    parseFloat(PriceTIP2) +
                                    parseFloat(PriceTIP3) +
                                    parseFloat(PriceTIP4) +
                                    parseFloat(PriceW1) +
                                    parseFloat(PriceW2) +
                                    parseFloat(PriceW3) +
                                    parseFloat(PricePS1) +
                                    parseFloat(PricePS2) +
                                    parseFloat(PricePS3) +
                                    parseFloat(PricePS4) +
                                    parseFloat(PriceOC1) +
                                    parseFloat(PriceOC2) +
                                    parseFloat(PriceOC3) +
                                    parseFloat(PriceOC4) +
                                    parseFloat(PriceOC5) +
                                    parseFloat(PriceOC6)) *
                                    Quantity +
                                    parseFloat(PriceVMB2) +
                                    parseFloat(PriceVisa3) +
                                    parseFloat(PriceGT1) +
                                    parseFloat(PriceGT2) +
                                    parseFloat(PriceGT3) +
                                    parseFloat(PriceIR1) * QuantityBH +
                                    parseFloat(PriceIR2) * QuantityBH +
                                    parseFloat(PriceIR3) * QuantityBH +
                                    parseFloat(PriceTIP1)) /
                                    Quantity -
                                    parseFloat(Price)}
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td colSpan="2">Lãi 1 pax VND</td>
                                <td></td>
                                <td></td>
                                <td>
                                  {(((parseFloat(PriceVMB1) +
                                    parseFloat(PriceVMB3) +
                                    parseFloat(PriceVMB4) +
                                    parseFloat(PriceVMB5) +
                                    parseFloat(PriceLT1) +
                                    parseFloat(PriceLT2) +
                                    parseFloat(PriceLT3) +
                                    parseFloat(PriceHotel1) +
                                    parseFloat(PriceHotel2) +
                                    parseFloat(PriceHotel3) +
                                    parseFloat(PriceHotel4) +
                                    parseFloat(PriceRS1) +
                                    parseFloat(PriceRS2) +
                                    parseFloat(PriceRS3) +
                                    parseFloat(PriceSS1) +
                                    parseFloat(PriceSS2) +
                                    parseFloat(PriceSS3) +
                                    parseFloat(PriceVisa1) +
                                    parseFloat(PriceVisa2) +
                                    parseFloat(PriceVisa4) +
                                    parseFloat(PriceVisa5) +
                                    parseFloat(PriceTIP2) +
                                    parseFloat(PriceTIP3) +
                                    parseFloat(PriceTIP4) +
                                    parseFloat(PriceW1) +
                                    parseFloat(PriceW2) +
                                    parseFloat(PriceW3) +
                                    parseFloat(PricePS1) +
                                    parseFloat(PricePS2) +
                                    parseFloat(PricePS3) +
                                    parseFloat(PricePS4) +
                                    parseFloat(PriceOC1) +
                                    parseFloat(PriceOC2) +
                                    parseFloat(PriceOC3) +
                                    parseFloat(PriceOC4) +
                                    parseFloat(PriceOC5) +
                                    parseFloat(PriceOC6)) *
                                    Quantity +
                                    parseFloat(PriceVMB2) +
                                    parseFloat(PriceVisa3) +
                                    parseFloat(PriceGT1) +
                                    parseFloat(PriceGT2) +
                                    parseFloat(PriceGT3) +
                                    parseFloat(PriceIR1) * QuantityBH +
                                    parseFloat(PriceIR2) * QuantityBH +
                                    parseFloat(PriceIR3) * QuantityBH +
                                    parseFloat(PriceTIP1)) /
                                    Quantity -
                                    parseFloat(Price)) *
                                    parseFloat(ExchangeRate)}
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td colSpan="2">Phần Trăm</td>
                                <td></td>
                                <td></td>
                                <td>
                                  {((((parseFloat(PriceVMB1) +
                                    parseFloat(PriceVMB3) +
                                    parseFloat(PriceVMB4) +
                                    parseFloat(PriceVMB5) +
                                    parseFloat(PriceLT1) +
                                    parseFloat(PriceLT2) +
                                    parseFloat(PriceLT3) +
                                    parseFloat(PriceHotel1) +
                                    parseFloat(PriceHotel2) +
                                    parseFloat(PriceHotel3) +
                                    parseFloat(PriceHotel4) +
                                    parseFloat(PriceRS1) +
                                    parseFloat(PriceRS2) +
                                    parseFloat(PriceRS3) +
                                    parseFloat(PriceSS1) +
                                    parseFloat(PriceSS2) +
                                    parseFloat(PriceSS3) +
                                    parseFloat(PriceVisa1) +
                                    parseFloat(PriceVisa2) +
                                    parseFloat(PriceVisa4) +
                                    parseFloat(PriceVisa5) +
                                    parseFloat(PriceTIP2) +
                                    parseFloat(PriceTIP3) +
                                    parseFloat(PriceTIP4) +
                                    parseFloat(PriceW1) +
                                    parseFloat(PriceW2) +
                                    parseFloat(PriceW3) +
                                    parseFloat(PricePS1) +
                                    parseFloat(PricePS2) +
                                    parseFloat(PricePS3) +
                                    parseFloat(PricePS4) +
                                    parseFloat(PriceOC1) +
                                    parseFloat(PriceOC2) +
                                    parseFloat(PriceOC3) +
                                    parseFloat(PriceOC4) +
                                    parseFloat(PriceOC5) +
                                    parseFloat(PriceOC6)) *
                                    Quantity +
                                    parseFloat(PriceVMB2) +
                                    parseFloat(PriceVisa3) +
                                    parseFloat(PriceGT1) +
                                    parseFloat(PriceGT2) +
                                    parseFloat(PriceGT3) +
                                    parseFloat(PriceIR1) * QuantityBH +
                                    parseFloat(PriceIR2) * QuantityBH +
                                    parseFloat(PriceIR3) * QuantityBH +
                                    parseFloat(PriceTIP1)) /
                                    Quantity -
                                    parseFloat(Price)) *
                                    Quantity) /
                                    (Quantity * parseFloat(Price))}{" "}
                                  %
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td colSpan="2">Lãi Gộp {CostName}</td>
                                <td></td>
                                <td></td>
                                <td>
                                  {(((parseFloat(PriceVMB1) +
                                    parseFloat(PriceVMB3) +
                                    parseFloat(PriceVMB4) +
                                    parseFloat(PriceVMB5) +
                                    parseFloat(PriceLT1) +
                                    parseFloat(PriceLT2) +
                                    parseFloat(PriceLT3) +
                                    parseFloat(PriceHotel1) +
                                    parseFloat(PriceHotel2) +
                                    parseFloat(PriceHotel3) +
                                    parseFloat(PriceHotel4) +
                                    parseFloat(PriceRS1) +
                                    parseFloat(PriceRS2) +
                                    parseFloat(PriceRS3) +
                                    parseFloat(PriceSS1) +
                                    parseFloat(PriceSS2) +
                                    parseFloat(PriceSS3) +
                                    parseFloat(PriceVisa1) +
                                    parseFloat(PriceVisa2) +
                                    parseFloat(PriceVisa4) +
                                    parseFloat(PriceVisa5) +
                                    parseFloat(PriceTIP2) +
                                    parseFloat(PriceTIP3) +
                                    parseFloat(PriceTIP4) +
                                    parseFloat(PriceW1) +
                                    parseFloat(PriceW2) +
                                    parseFloat(PriceW3) +
                                    parseFloat(PricePS1) +
                                    parseFloat(PricePS2) +
                                    parseFloat(PricePS3) +
                                    parseFloat(PricePS4) +
                                    parseFloat(PriceOC1) +
                                    parseFloat(PriceOC2) +
                                    parseFloat(PriceOC3) +
                                    parseFloat(PriceOC4) +
                                    parseFloat(PriceOC5) +
                                    parseFloat(PriceOC6)) *
                                    Quantity +
                                    parseFloat(PriceVMB2) +
                                    parseFloat(PriceVisa3) +
                                    parseFloat(PriceGT1) +
                                    parseFloat(PriceGT2) +
                                    parseFloat(PriceGT3) +
                                    parseFloat(PriceIR1) * QuantityBH +
                                    parseFloat(PriceIR2) * QuantityBH +
                                    parseFloat(PriceIR3) * QuantityBH +
                                    parseFloat(PriceTIP1)) /
                                    Quantity -
                                    parseFloat(Price)) *
                                    Quantity}
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td colSpan="2">Lãi Gộp VND</td>
                                <td></td>
                                <td></td>
                                <td>
                                  {(((parseFloat(PriceVMB1) +
                                    parseFloat(PriceVMB3) +
                                    parseFloat(PriceVMB4) +
                                    parseFloat(PriceVMB5) +
                                    parseFloat(PriceLT1) +
                                    parseFloat(PriceLT2) +
                                    parseFloat(PriceLT3) +
                                    parseFloat(PriceHotel1) +
                                    parseFloat(PriceHotel2) +
                                    parseFloat(PriceHotel3) +
                                    parseFloat(PriceHotel4) +
                                    parseFloat(PriceRS1) +
                                    parseFloat(PriceRS2) +
                                    parseFloat(PriceRS3) +
                                    parseFloat(PriceSS1) +
                                    parseFloat(PriceSS2) +
                                    parseFloat(PriceSS3) +
                                    parseFloat(PriceVisa1) +
                                    parseFloat(PriceVisa2) +
                                    parseFloat(PriceVisa4) +
                                    parseFloat(PriceVisa5) +
                                    parseFloat(PriceTIP2) +
                                    parseFloat(PriceTIP3) +
                                    parseFloat(PriceTIP4) +
                                    parseFloat(PriceW1) +
                                    parseFloat(PriceW2) +
                                    parseFloat(PriceW3) +
                                    parseFloat(PricePS1) +
                                    parseFloat(PricePS2) +
                                    parseFloat(PricePS3) +
                                    parseFloat(PricePS4) +
                                    parseFloat(PriceOC1) +
                                    parseFloat(PriceOC2) +
                                    parseFloat(PriceOC3) +
                                    parseFloat(PriceOC4) +
                                    parseFloat(PriceOC5) +
                                    parseFloat(PriceOC6)) *
                                    Quantity +
                                    parseFloat(PriceVMB2) +
                                    parseFloat(PriceVisa3) +
                                    parseFloat(PriceGT1) +
                                    parseFloat(PriceGT2) +
                                    parseFloat(PriceGT3) +
                                    parseFloat(PriceIR1) * QuantityBH +
                                    parseFloat(PriceIR2) * QuantityBH +
                                    parseFloat(PriceIR3) * QuantityBH +
                                    parseFloat(PriceTIP1)) /
                                    Quantity -
                                    parseFloat(Price)) *
                                    Quantity *
                                    parseFloat(ExchangeRate)}
                                </td>
                                <td></td>
                              </tr>
                            </tfoot>
                          </table>
                          <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                              <span class="small font-weight-bold text-muted">
                                UPLOAD FILES{" "}
                                <span class="text-danger">
                                  (pdf, xls, xlsx, doc, docx)
                                </span>
                              </span>
                              <label class="image-collapse-label2 ">
                                <input
                                  type="file"
                                  className="image-collapse-file cursor-pointer"
                                  onChange={(e) =>
                                    handleChangeFileAndImage(e, 0)
                                  }
                                  accept=".pdf, .xls, .xlsx, .doc, .docx"
                                  multiple
                                />
                                <i className="fa fa-file upload-file-btn"></i>
                              </label>
                              <div className="">
                                {FileUpload.map((item, ix) => {
                                  return (
                                    <div
                                      className="upload-file-item py-1 my-2 shadow-sm "
                                      key={"asdsad" + ix}
                                    >
                                      <i className="fa fa-file px-2"></i>
                                      <span>{item.name}</span>
                                      <i
                                        className="fa fa-times pl-2 text-danger cursor-pointer"
                                        onClick={(e) =>
                                          setFileUpload(
                                            FileUpload.filter(
                                              (_, i) => i !== ix
                                            )
                                          )
                                        }
                                      ></i>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="">
                                {FileShow.length > 0 &&
                                  FileShow.map((item, ix) => {
                                    return (
                                      <div
                                        className="upload-file-item py-1 my-2 shadow-sm d-flex justify-content-between"
                                        download
                                        key={"aaa" + ix}
                                      >
                                        <div>
                                          <i className="fa fa-file px-2"></i>
                                          <span>{item.split("/")[6]}</span>
                                        </div>
                                        <div className="">
                                          <TooltipCustom content={"Xoá"}>
                                            <i
                                              className="fa fa-times pl-2 text-danger cursor-pointer px-2"
                                              onClick={(e) =>
                                                setFileShow(
                                                  FileShow.filter(
                                                    (_, i) => i !== ix
                                                  )
                                                )
                                              }
                                            ></i>
                                          </TooltipCustom>
                                          <TooltipCustom content={"Tải xuống"}>
                                            <a
                                              href={IMAGES_DOMAIN + item}
                                              download
                                              target={"_blank"}
                                              className="px-3"
                                            >
                                              <i class="fa fa-download"></i>
                                            </a>
                                          </TooltipCustom>
                                          <TooltipCustom
                                            content={"Xem file trực tiếp"}
                                          >
                                            <i
                                              className="fa fa-eye pl-2 text-success cursor-pointer px-2"
                                              onClick={(e) => {
                                                setDocs(IMAGES_DOMAIN + item);
                                                setIsPreviewFile(true);
                                              }}
                                            ></i>
                                          </TooltipCustom>
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
                </div>
                <Modal
                  show={isPreviewFile}
                  onHide={() => setIsPreviewFile(false)}
                  aria-labelledby="example-custom-modal-styling-title"
                  className="custom-modal-w-100 z-maxx"
                >
                  <Modal.Header className="p-2">
                    <Modal.Title id="example-custom-modal-styling-title">
                      <div class="text-center">Preview Document</div>
                    </Modal.Title>
                    <button
                      type="button"
                      class="close"
                      aria-label="Close"
                      onClick={() => setIsPreviewFile(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </Modal.Header>
                  <Modal.Body>
                    {checkExtentionFile(docs) === 0 ? (
                      <iframe
                        className={"docs"}
                        width="100%"
                        height="800"
                        frameBorder="0"
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${docs}`}
                        title="preview file"
                      ></iframe>
                    ) : (
                      <iframe
                        className={"docs"}
                        width="100%"
                        height="800"
                        frameBorder="0"
                        src={`https://drive.google.com/viewerng/viewer?url=${docs}&embedded=true&hl=vi`}
                        title="preview file"
                      ></iframe>
                    )}{" "}
                  </Modal.Body>
                </Modal>
              </div>
              <div
                className="tab-pane fade"
                id="tab_2"
                role="tabpanel"
                aria-labelledby="custom-tabs-two-profile-tab"
              >
                <div className="card">
                  <div className="card-body">
                    <div class="form-group">
                      <DataTable data={DataTableList} columns={columns} />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="tab_3"
                role="tabpanel"
                aria-labelledby="custom-tabs-two-Excel-tab"
              >
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-6">
                      <h3 className="card-title">
                        <i className="fas fa-plus" />
                        <span className="font-weight-bold">DownLoadExcel</span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn margin-top-5s">
                      <button
                        type="button"
                        class="btn btn-sm btn-danger pull-right margin-left-10"
                        onClick={LoseTabExcel}
                      >
                        <i class="fas fa-eraser"></i>
                        Đóng
                      </button>
                      <button
                        className="btn btn-sm btn-success pull-right margin-left-10"
                        onClick={onDownload}
                        type="button"
                      >
                        <i class="fa fa-download pr-2"></i>Export excel
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body tour-request">
                  <div className="center-item">
                    <div class="row">
                      <div
                        className="row booking portrait"
                        style={{
                          backgroundColor: "#fff",
                          fontFamily: "TimeNewRoman",
                        }}
                      >
                        <div class="col-sm-12 text-center header">
                          <Img
                            src="../dist/img/logo-invoice.png"
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>
                      <table
                        ref={tableRef}
                        class="table table-bordered table-request-tour margin-top-20  text-center"
                      >
                        <tbody className=" text-dark">
                          <tr>
                            <th></th>
                            <th colSpan="4">{ArrayTable.TitleTourCost}</th>
                          </tr>
                          <tr>
                            <th>Tên Tuor</th>
                            <th colSpan="4">{ArrayTable.TourCostName}</th>
                          </tr>
                          <tr>
                            <th>Mã Tour</th>
                            <th colSpan="4">{ArrayTable.TourCostCode}</th>
                          </tr>
                          <tr>
                            <th>Thời Gian</th>
                            <th colSpan="4">{ArrayTable.TourCostTime}</th>
                          </tr>
                          <tr>
                            <th>Giờ Bay</th>
                            <th colSpan="4">{ArrayTable.FlightTime}</th>
                          </tr>
                          <tr>
                            <th>Loại Tiền</th>
                            <th colSpan="4">{ArrayTable.Currency}</th>
                          </tr>
                          <tr>
                            <th>Tỉ Giá</th>
                            <th colSpan="4">{ArrayTable.ExchangeRate}</th>
                          </tr>
                          <tr>
                            <th>Giá Bán</th>
                            <th colSpan="4">{ArrayTable.Price}</th>
                          </tr>
                          <tr>
                            <th>Số Lượng</th>
                            <th colSpan="4">{ArrayTable.Quantity}</th>
                          </tr>
                          <tr>
                            <th>Tổng Tiền</th>
                            <th colSpan="4">{ArrayTable.TotalMPrice}</th>
                          </tr>
                          <tr className="title-guider text-center">
                            <th>Dịch vụ</th>
                            <th>Chi Tiết</th>
                            <th>Giá Thành</th>
                            <th>Số Lượng</th>
                            <th>Thành Tiền</th>
                          </tr>
                          <tr className="text-center">
                            <th rowspan="5">VMB</th>
                            <td>{ArrayTable.DetailVMB1}</td>
                            <td>{ArrayTable.PriceVMB1}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceVMB1) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailVMB2}</td>
                            <td>{ArrayTable.PriceVMB2}</td>
                            <td>{1}</td>
                            <td>{parseFloat(ArrayTable.PriceVMB2) * 1}</td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailVMB3}</td>
                            <td>{ArrayTable.PriceVMB3}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceVMB3) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailVMB4}</td>
                            <td>{ArrayTable.PriceVMB4}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceVMB4) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailVMB5}</td>
                            <td>{ArrayTable.PriceVMB5}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceVMB5) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <th rowspan="3">LANDTOUR</th>
                            <td>{ArrayTable.DetailLT1}</td>
                            <td>{ArrayTable.PriceLT1}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceLT1) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailLT2}</td>
                            <td>{ArrayTable.PriceLT2}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceLT2) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailLT3}</td>
                            <td>{ArrayTable.PriceLT3}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceLT3) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <th rowSpan="4">Khách Sạn</th>
                            <td>{ArrayTable.DetailHotel1}</td>
                            <td>{ArrayTable.PriceHotel1}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceHotel1) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailHotel2}</td>
                            <td>{ArrayTable.PriceHotel2}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceHotel2) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailHotel3}</td>
                            <td>{ArrayTable.PriceHotel3}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceHotel3) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailHotel4}</td>
                            <td>{ArrayTable.PriceHotel4}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceHotel4) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <th rowSpan="3">Nhà Hàng</th>
                            <td>{ArrayTable.DetailRS1}</td>
                            <td>{ArrayTable.PriceRS1}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceRS1) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailRS2}</td>
                            <td>{ArrayTable.PriceRS2}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceRS2) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailRS3}</td>
                            <td>{ArrayTable.PriceRS3}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceRS3) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <th rowSpan="3">Tham Quan</th>
                            <td>{ArrayTable.DetailSS1}</td>
                            <td>{ArrayTable.PriceSS1}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceSS1) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailSS2}</td>
                            <td>{ArrayTable.PriceSS2}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceSS2) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailSS3}</td>
                            <td>{ArrayTable.PriceSS3}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceSS3) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <th rowSpan="5">VISA</th>
                            <td>{ArrayTable.DetailVisa1}</td>
                            <td>{ArrayTable.PriceVisa1}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceVisa1) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailVisa2}</td>
                            <td>{ArrayTable.PriceVisa2}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceVisa2) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailVisa3}</td>
                            <td>{ArrayTable.PriceVisa3}</td>
                            <td>{1}</td>
                            <td>{parseFloat(ArrayTable.PriceVisa3) * 1}</td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailVisa4}</td>
                            <td>{ArrayTable.PriceVisa4}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceVisa4) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailVisa5}</td>
                            <td>{ArrayTable.PriceVisa5}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceVisa5) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <th rowSpan="3">Hướng Dẫn Viên</th>
                            <td>{ArrayTable.DetailGT1}</td>
                            <td>{ArrayTable.PriceGT1}</td>
                            <td>{1}</td>
                            <td>{parseFloat(ArrayTable.PriceGT1) * 1}</td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailGT2}</td>
                            <td>{ArrayTable.PriceGT2}</td>
                            <td>{1}</td>
                            <td>{parseFloat(ArrayTable.PriceGT2) * 1}</td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailGT3}</td>
                            <td>{ArrayTable.PriceGT3}</td>
                            <td>{1}</td>
                            <td>{parseFloat(ArrayTable.PriceGT3) * 1}</td>
                          </tr>
                          <tr className="text-center">
                            <th rowSpan="3">Bảo Hiểm</th>
                            <td>{ArrayTable.DetailIR1}</td>
                            <td>{ArrayTable.PriceIR1}</td>
                            <td>{parseInt(ArrayTable.Quantity) + 1}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceIR1) *
                                (parseInt(ArrayTable.Quantity) + 1)}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailIR2}</td>
                            <td>{ArrayTable.PriceIR2}</td>
                            <td>{parseInt(ArrayTable.Quantity) + 1}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceIR2) *
                                (parseInt(ArrayTable.Quantity) + 1)}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailIR3}</td>
                            <td>{ArrayTable.PriceIR3}</td>
                            <td>{parseInt(ArrayTable.Quantity) + 1}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceIR3) *
                                (parseInt(ArrayTable.Quantity) + 1)}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <th rowSpan="4">TIP</th>
                            <td>{ArrayTable.DetailTIP1}</td>
                            <td>{ArrayTable.PriceTIP1}</td>
                            <td>{1}</td>
                            <td>{parseFloat(ArrayTable.PriceTIP1) * 1}</td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailTIP2}</td>
                            <td>{ArrayTable.PriceTIP2}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceTIP2) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailTIP3}</td>
                            <td>{ArrayTable.PriceTIP3}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceTIP3) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailTIP4}</td>
                            <td>{ArrayTable.PriceTIP4}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceTIP4) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <th rowSpan="3">Nước</th>
                            <td>{ArrayTable.DetailW1}</td>
                            <td>{ArrayTable.PriceW1}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceW1) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailW2}</td>
                            <td>{ArrayTable.PriceW2}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceW2) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailW3}</td>
                            <td>{ArrayTable.PriceW3}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceW3) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <th rowSpan="4">Quà Tặng</th>
                            <td>{ArrayTable.DetailPS1}</td>
                            <td>{ArrayTable.PricePS1}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PricePS1) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailPS2}</td>
                            <td>{ArrayTable.PricePS2}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PricePS2) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailPS3}</td>
                            <td>{ArrayTable.PricePS3}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PricePS3) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailPS4}</td>
                            <td>{ArrayTable.PricePS4}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PricePS4) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <th rowSpan="6">Chi Phí Khác</th>
                            <td>{ArrayTable.DetailOC1}</td>
                            <td>{ArrayTable.PriceOC1}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceOC1) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailOC2}</td>
                            <td>{ArrayTable.PriceOC2}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceOC2) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailOC3}</td>
                            <td>{ArrayTable.PriceOC3}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceOC3) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailOC4}</td>
                            <td>{ArrayTable.PriceOC4}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceOC4) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailOC5}</td>
                            <td>{ArrayTable.PriceOC5}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceOC5) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                          <tr className="text-center">
                            <td>{ArrayTable.DetailOC6}</td>
                            <td>{ArrayTable.PriceOC6}</td>
                            <td>{ArrayTable.Quantity}</td>
                            <td>
                              {parseFloat(ArrayTable.PriceOC6) *
                                ArrayTable.Quantity}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="2">Tổng Cộng Chi Phí</td>
                            <td></td>
                            <td></td>
                            <td>{ArrayTable.TotalPrice}</td>
                          </tr>
                          <tr>
                            <td colSpan="2">
                              Giá NET 1 pax {ArrayTable.Currency}
                            </td>
                            <td></td>
                            <td></td>
                            <td>{ArrayTable.PriceOnePax}</td>
                          </tr>
                          <tr>
                            <td colSpan="2">Giá NET 1 pax VND</td>
                            <td></td>
                            <td></td>
                            <td>{ArrayTable.PriceOnePaxVND}</td>
                          </tr>
                          <tr>
                            <td colSpan="2">Lãi 1 pax {ArrayTable.Currency}</td>
                            <td></td>
                            <td></td>
                            <td>{ArrayTable.InterestRateOnePax}</td>
                          </tr>
                          <tr>
                            <td colSpan="2">Lãi 1 pax VND</td>
                            <td></td>
                            <td></td>
                            <td>{ArrayTable.InterestRateOnePaxVND}</td>
                          </tr>
                          <tr>
                            <td colSpan="2">Phần Trăm</td>
                            <td></td>
                            <td></td>
                            <td>{ArrayTable.PercentCost} %</td>
                          </tr>
                          <tr>
                            <td colSpan="2">Lãi Gộp {ArrayTable.Currency}</td>
                            <td></td>
                            <td></td>
                            <td>{ArrayTable.GrossProfit}</td>
                          </tr>
                          <tr>
                            <td colSpan="2">Lãi Gộp VND</td>
                            <td></td>
                            <td></td>
                            <td>{ArrayTable.GrossProfitVND}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

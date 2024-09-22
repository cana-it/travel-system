import { useEffect } from "react";
import { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  DataTable,
  SelectServiceSale,
  SelectTourGuider,
} from "../../../../Common";

import { mainAction } from "../../../../Redux/Actions";
import { IMAGES_DOMAIN } from "../../../../Services";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  ConfirmAlert,
  FormatDateJson,
  FormatMoney,
  FormatNumber,
} from "../../../../Utils";
import { SettlementTourForm } from "./SettlementTourForm";

export const SettlementTour = () => {
  const dispatch = useDispatch();
  const Creater = +localStorage.getItem("CreateBy");
  const [random, setRandom] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [serviceSale, setServiceSale] = useState(0);
  const [flightList, setFlightList] = useState([]);
  const [quantity, setQuantity] = useState({
    AdultQuantity: 0,
    ChildQuantity: 0,
    InfantQuantity: 0,
  });
  const [booking, setBooking] = useState(null);
  const [tourLeader, setTourLeader] = useState({});
  const [settlementList, setSettlementList] = useState([]);
  const [settlementTourId, setSettlementTourId] = useState(0);
  const [isClone, setIsClone] = useState(false);
  const [price, setPrice] = useState({
    TotalPrice: 0,
    Profit: 0,
    TotalRevenue: 0,
    AdvanceMoney: 0,
  });

  const [sample, setSample] = useState({
    settlementTourDetailId: 0,
    partner: "",
    serviceContent: "",
    quantity: 0,
    unit: "",
    quantity2: 0,
    unit2: "",
    price: 0,
    totalPrice: 0,
    typePaymentTM: false,
    typePaymentCK: false,
    typePaymentCard: false,
    note: "",
  });

  const [planeTicketData, setPlaneTicketData] = useState([
    { ...sample, service: "Vé máy bay" },
  ]);
  const [landTourData, setLandTourData] = useState([
    { ...sample, service: "LandTour" },
  ]);
  const [visaData, setVisaData] = useState([{ ...sample, service: "Visa" }]);
  const [tourLeaderData, setTourLeaderData] = useState([
    { ...sample, service: "TourLeader" },
  ]);
  const [securityData, setSecurityData] = useState([
    { ...sample, service: "Bảo hiểm" },
  ]);
  const [tipData, setTipData] = useState([{ ...sample, service: "Tip" }]);
  const [waterData, setWaterData] = useState([{ ...sample, service: "Nước" }]);
  const [giftData, setGiftData] = useState([
    { ...sample, service: "Quà tặng" },
  ]);
  const [anotherData, setAnotherData] = useState([
    { ...sample, service: "Chi phí khác" },
  ]);
  const [surchangeData, setSurchangeData] = useState([
    { ...sample, service: "Phát sinh" },
  ]);
  const [hdvData, setHdvData] = useState([{ ...sample, service: "HDV" }]);

  //#region call api

  useEffect(() => {
    Trl_spSettlementTour_List();
  }, []);

  const Trl_spBooking_CustomerPlane_View = async (sv) => {
    try {
      const pr = {
        BookingId: sv.BookingId || 0,
        CreateName: +Creater,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBooking_CustomerPlane_View",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      setFlightList(res);
      setBooking(sv);
      // setDataBookingStatus(res)
    } catch (error) {
      ;
    }
  };

  const renamePropertyObject = (obj, type = 0) => {
    if (type === 0) {
      for (let prop in obj) {
        const capitalizedProp = prop.charAt(0).toUpperCase() + prop.slice(1);
        obj[capitalizedProp] = obj[prop];
        delete obj[prop];
      }
      return obj;
    } else {
      for (let prop in obj) {
        const capitalizedProp = prop.charAt(0).toLowerCase() + prop.slice(1);
        obj[capitalizedProp] = obj[prop];
        delete obj[prop];
      }
      return obj;
    }
  };

  const Trl_spSettlementTour_Save = async () => {
    try {
      let dt = [
        ...planeTicketData,
        ...landTourData,
        ...visaData,
        ...tourLeaderData,
        ...securityData,
        ...tipData,
        ...waterData,
        ...giftData,
        ...anotherData,
        ...surchangeData,
        ...hdvData,
      ].map((item, index) => {
        if (item.typePaymentTM === true) {
          let obj = {
            ...item,
            typePayment: "TM",
            creater: +Creater,
          };
          return renamePropertyObject(obj);
        }
        if (item.typePaymentCK === true) {
          let obj = {
            ...item,
            typePayment: "CK",
            creater: +Creater,
          };
          return renamePropertyObject(obj);
        }
        if (item.typePaymentCard === true) {
          let obj = {
            ...item,
            typePayment: "Card",
            creater: +Creater,
          };
          return renamePropertyObject(obj);
        }
        return renamePropertyObject({
          ...item,
          typePayment: "",
          creater: +Creater,
        });
      });

      const pr = {
        SettlementTourId: settlementTourId,
        SettlementTourName: "",
        BookingId: +serviceSale.BookingId || 0,
        TourLeaderId: tourLeader.value,
        AdultQuantity: quantity.AdultQuantity,
        ChildQuantity: quantity.ChildQuantity,
        InfantQuantity: quantity.InfantQuantity,
        TotalPrice: price.TotalPrice,
        Profit: price.Profit,
        TotalRevenue: price.TotalRevenue,
        AdvanceMoney: price.AdvanceMoney,
        Creater: +Creater,
        detail: dt,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spSettlementTour_Save",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      setIsClone(false);
      if (res.Status === "OK") {
        Alertsuccess("Lưu thành công");
        setSettlementTourId(res.SettlementTourId);
        Trl_spSettlementTour_List(1);
      } else {
        Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
      }

      // setDataBookingStatus(res)
    } catch (error) {
      ;
    }
  };

  const Trl_spSettlementTour_List = async (type = 0) => {
    try {
      const pr = {
        SettlementTourId: 0,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spSettlementTour_List",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.length > 0) {
        setSettlementList(res);
        setIsClone(false);
        if (settlementTourId !== 0 && type === 1) {
          const data = res.find(
            (item) => item.SettlementTourId === settlementTourId
          );
          if (data) {
            Trl_spSettlementTour_Edit(data);
          }
        } else {
          setSettlementTourId(0);
          type === 0 && setServiceSale(0);
          setFlightList([]);
          setBooking(null);
          setQuantity({
            AdultQuantity: 0,
            ChildQuantity: 0,
            InfantQuantity: 0,
          });
          setTourLeader(0);
        }
        // Alertsuccess("Lưu thành công");
      } else {
        Alertwarning("Không có dữ liệu");
        setSettlementList([]);
      }
    } catch (error) {
      ;
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const Trl_spSettlement_Delete = async (id) => {
    setIsClone(false);
    try {
      const pr = {
        SettlementTourId: id,
        Creater: +Creater,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spSettlement_Delete",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Lưu thành công");
        await Trl_spSettlementTour_List();
      } else {
        Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
        setSettlementList([]);
      }
    } catch (error) {
      ;
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const checkTypePayment = (item, type = 0) => {
    if (item.TypePayment === "TM") {
      return {
        ...item,
        TypePaymentTM: true,
        TypePaymentCK: false,
        TypePaymentCard: false,
        SettlementTourDetailId: type === 0 ? item.SettlementTourDetailId : 0,
      };
    }
    if (item.TypePayment === "CK") {
      return {
        ...item,
        TypePaymentTM: false,
        TypePaymentCK: true,
        TypePaymentCard: false,
        SettlementTourDetailId: type === 0 ? item.SettlementTourDetailId : 0,
      };
    }
    if (item.TypePayment === "Card") {
      return {
        ...item,
        TypePaymentTM: false,
        TypePaymentCK: false,
        TypePaymentCard: true,
        SettlementTourDetailId: type === 0 ? item.SettlementTourDetailId : 0,
      };
    }
    return {
      ...item,
      TypePaymentTM: false,
      TypePaymentCK: false,
      TypePaymentCard: false,
      SettlementTourDetailId: type === 0 ? item.SettlementTourDetailId : 0,
    };
  };

  const Trl_spSettlementTour_Edit = (dataEdit, type = 0) => {
    setIsClone(false);
    let service = {
      value: dataEdit.ServiceSaleId,
      BookingId: dataEdit.BookingId,
      ServiceSaleCode: dataEdit.ServiceSaleCode,
      ServiceSaleName: dataEdit.ServiceSaleName,
      DateSaleFrom: dataEdit.DateSaleFrom,
      DateSaleTo: dataEdit.DateSaleTo,
    };
    setSettlementTourId(dataEdit.SettlementTourId);
    setServiceSale(service);
    Trl_spBooking_CustomerPlane_View(service);
    setQuantity({
      AdultQuantity: dataEdit.AdultQuantity,
      ChildQuantity: dataEdit.ChildQuantity,
      InfantQuantity: dataEdit.InfantQuantity,
    });
    setTourLeader({ value: dataEdit.TourLeaderId });
    if (dataEdit?.Detail.length > 0) {
      let planeTicket = dataEdit.Detail.filter(
        (item) => item.Service === "Vé máy bay"
      ).map((item) => renamePropertyObject(checkTypePayment(item), 1));
      let landTour = dataEdit.Detail.filter(
        (item) => item.Service === "LandTour"
      ).map((item) => renamePropertyObject(checkTypePayment(item), 1));
      let visa = dataEdit.Detail.filter((item) => item.Service === "Visa").map(
        (item) => renamePropertyObject(checkTypePayment(item), 1)
      );
      let tourLeader = dataEdit.Detail.filter(
        (item) => item.Service === "TourLeader"
      ).map((item) => renamePropertyObject(checkTypePayment(item), 1));
      let security = dataEdit.Detail.filter(
        (item) => item.Service === "Bảo hiểm"
      ).map((item) => renamePropertyObject(checkTypePayment(item), 1));
      let tip = dataEdit.Detail.filter((item) => item.Service === "Tip").map(
        (item) => renamePropertyObject(checkTypePayment(item), 1)
      );
      let water = dataEdit.Detail.filter((item) => item.Service === "Nước").map(
        (item) => renamePropertyObject(checkTypePayment(item), 1)
      );
      let gift = dataEdit.Detail.filter(
        (item) => item.Service === "Quà tặng"
      ).map((item) => renamePropertyObject(checkTypePayment(item), 1));
      let another = dataEdit.Detail.filter(
        (item) => item.Service === "Chi phí khác"
      ).map((item) => renamePropertyObject(checkTypePayment(item), 1));
      let surchage = dataEdit.Detail.filter(
        (item) => item.Service === "Phát sinh"
      ).map((item) => renamePropertyObject(checkTypePayment(item), 1));
      let hvd = dataEdit.Detail.filter((item) => item.Service === "HDV").map(
        (item) => renamePropertyObject(checkTypePayment(item), 1)
      );
      setPlaneTicketData(planeTicket);
      setLandTourData(landTour);
      setVisaData(visa);
      setTourLeaderData(tourLeader);
      setSecurityData(security);
      setTipData(tip);
      setWaterData(water);
      setGiftData(gift);
      setAnotherData(another);
      setSurchangeData(surchage);
      setHdvData(hvd);
      setPrice({
        ...price,
        TotalPrice: dataEdit.TotalPrice,
        TotalRevenue: dataEdit.TotalRevenue,
        Profit: dataEdit.Profit,
        AdvanceMoney: dataEdit.AdvanceMoney,
      });
      document.getElementById("tab_1").click();
    }
  };

  const Trl_spSettlementTour_Clone = (dataEdit, type = 0) => {
    setIsClone(true);
    let service = {
      value: dataEdit.ServiceSaleId,
      BookingId: dataEdit.BookingId,
      ServiceSaleCode: dataEdit.ServiceSaleCode,
      ServiceSaleName: dataEdit.ServiceSaleName,
      DateSaleFrom: dataEdit.DateSaleFrom,
      DateSaleTo: dataEdit.DateSaleTo,
    };
    setSettlementTourId(0);
    setServiceSale(service);
    Trl_spBooking_CustomerPlane_View(service);
    setQuantity({
      AdultQuantity: dataEdit.AdultQuantity,
      ChildQuantity: dataEdit.ChildQuantity,
      InfantQuantity: dataEdit.InfantQuantity,
    });
    setTourLeader({ value: dataEdit.TourLeaderId });
    if (dataEdit?.Detail.length > 0) {
      let planeTicket = dataEdit.Detail.filter(
        (item) => item.Service === "Vé máy bay"
      ).map((item) => renamePropertyObject(checkTypePayment(item, 1), 1));
      let landTour = dataEdit.Detail.filter(
        (item) => item.Service === "LandTour"
      ).map((item) => renamePropertyObject(checkTypePayment(item, 1), 1));
      let visa = dataEdit.Detail.filter((item) => item.Service === "Visa").map(
        (item) => renamePropertyObject(checkTypePayment(item, 1), 1)
      );
      let tourLeader = dataEdit.Detail.filter(
        (item) => item.Service === "TourLeader"
      ).map((item) => renamePropertyObject(checkTypePayment(item, 1), 1));
      let security = dataEdit.Detail.filter(
        (item) => item.Service === "Bảo hiểm"
      ).map((item) => renamePropertyObject(checkTypePayment(item, 1), 1));
      let tip = dataEdit.Detail.filter((item) => item.Service === "Tip").map(
        (item) => renamePropertyObject(checkTypePayment(item, 1), 1)
      );
      let water = dataEdit.Detail.filter((item) => item.Service === "Nước").map(
        (item) => renamePropertyObject(checkTypePayment(item, 1), 1)
      );
      let gift = dataEdit.Detail.filter(
        (item) => item.Service === "Quà tặng"
      ).map((item) => renamePropertyObject(checkTypePayment(item, 1), 1));
      let another = dataEdit.Detail.filter(
        (item) => item.Service === "Chi phí khác"
      ).map((item) => renamePropertyObject(checkTypePayment(item, 1), 1));
      let surchage = dataEdit.Detail.filter(
        (item) => item.Service === "Phát sinh"
      ).map((item) => renamePropertyObject(checkTypePayment(item, 1), 1));
      let hvd = dataEdit.Detail.filter((item) => item.Service === "HDV").map(
        (item) => renamePropertyObject(checkTypePayment(item, 1), 1)
      );
      setPlaneTicketData(planeTicket);
      setLandTourData(landTour);
      setVisaData(visa);
      setTourLeaderData(tourLeader);
      setSecurityData(security);
      setTipData(tip);
      setWaterData(water);
      setGiftData(gift);
      setAnotherData(another);
      setSurchangeData(surchage);
      setHdvData(hvd);
      setPrice({
        ...price,
        TotalPrice: dataEdit.TotalPrice,
        TotalRevenue: dataEdit.TotalRevenue,
        Profit: dataEdit.Profit,
        AdvanceMoney: dataEdit.AdvanceMoney,
      });
      document.getElementById("tab_1").click();
    }
  };

  const Trl_spSettlementTour_Cancer = (type = 0) => {
    setIsClone(false);
    setSettlementTourId(0);
    type === 0 && setServiceSale(0);
    setFlightList([]);
    setBooking(null);
    setQuantity({
      AdultQuantity: 0,
      ChildQuantity: 0,
      InfantQuantity: 0,
    });
    setTourLeader(0);
    setPlaneTicketData([{ ...sample, service: "Vé máy bay" }]);
    setLandTourData([{ ...sample, service: "LandTour" }]);
    setVisaData([{ ...sample, service: "Visa" }]);
    setTourLeaderData([{ ...sample, service: "TourLeader" }]);
    setSecurityData([{ ...sample, service: "Bảo hiểm" }]);
    setTipData([{ ...sample, service: "Tip" }]);
    setWaterData([{ ...sample, service: "Nước" }]);
    setGiftData([{ ...sample, service: "Quà tặng" }]);
    setAnotherData([{ ...sample, service: "Chi phí khác" }]);
    setSurchangeData([{ ...sample, service: "Phát sinh" }]);
    setHdvData([{ ...sample, service: "HDV" }]);
    setPrice({
      TotalPrice: 0,
      TotalRevenue: 0,
      Profit: 0,
      AdvanceMoney: 0,
    });
  };

  //#endregion

  const Trl_spSettlementTour_Excel = async (dataEx) => {
    try {
      const prP = {
        SettlementTourId: dataEx.SettlementTourId || 0,
        CreateName: +Creater,
      };
      const paramsP = {
        Json: JSON.stringify(prP),
        func: "Trl_spSettlementTour_Excel",
      };
      const res = await mainAction.API_spCallServer(paramsP, dispatch);
      let dataExport = {
        ...res[0],
        FileName:
          "EUROTRAVEL - BẢNG QUYẾT TOÁN TOUR " + dataEx.ServiceSaleCode,
      };
      const params = {
        Json: JSON.stringify(dataExport),
        func: "Trl_spSettlementTour_Excel",
      };
      const result = await mainAction.API_spCallExportExcel(params, dispatch);
      if (result.resultCode === 0) {
        const link = document.createElement("a");
        link.href = IMAGES_DOMAIN + result.Message;
        //link.target="_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const columns = [
    {
      Header: "Options",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-xs btn-info"
            onClick={() => Trl_spSettlementTour_Clone(row._original)}
          >
            {" "}
            <i class="fa fa-clone"></i> Nhân bản
          </button>{" "}
          <button
            className="btn btn-xs btn-warning"
            onClick={() => Trl_spSettlementTour_Edit(row._original)}
          >
            {" "}
            <i class="fa fa-eye"></i> Sửa
          </button>{" "}
          <button
            className="btn btn-xs btn-success"
            onClick={() => Trl_spSettlementTour_Excel(row._original)}
          >
            {" "}
            <i class="fa fa-download"></i> Excel
          </button>{" "}
          <button
            className="btn btn-xs btn-danger"
            onClick={() =>
              ConfirmAlert("Xác nhận", "Bạn có chắc chắn muốn xóa không?", () =>
                Trl_spSettlement_Delete(row._original.SettlementTourId)
              )
            }
          >
            {" "}
            <i class="fa fa-trash"></i> Xóa
          </button>{" "}
        </div>
      ),
      minWidth: 150,
      fixed: "left",
    },
    {
      Header: "Mã Tour",
      accessor: "ServiceSaleCode",
      minWidth: 250,
      fixed: "left",
    },
    {
      Header: "Tên Tour",
      accessor: "ServiceSaleName",
      minWidth: 250,
      fixed: "left",
    },
    {
      Header: "Người tạo",
      accessor: "CreateName",
      minWidth: 150,
    },
    {
      Header: "Thời gian",
      accessor: "CreateTime",
      minWidth: 150,
      Cell: (obj) => FormatDateJson(obj.value, 10),
    },
    {
      Header: "Người Sửa",
      accessor: "EditName",
      minWidth: 150,
    },
    {
      Header: "Thời gian sửa",
      accessor: "EditTime",
      minWidth: 150,
      Cell: (obj) => {
        return obj?.value ? FormatDateJson(obj.value, 10) : "";
      },
    },
  ];

  //#region handle data table edit

  const EditableCell = ({
    ivalue = "",
    index = "",
    updateMyData,
    property = "",
    type = 0,
    edit = true,
  }) => {
    const [value, setValue] = useState(ivalue);
    const [value2, setValue2] = useState(ivalue);
    const onChange = (e) => {
      setValue(e.currentTarget.textContent);
    };

    const onBlur = (e) => {
      setValue2(value);
      updateMyData(index, value, property, type);
    };

    useEffect(() => {
      setValue(ivalue);
    }, [ivalue]);

    return (
      <div
        contentEditable={edit}
        suppressContentEditableWarning="true"
        onInput={onChange}
        onBlur={onBlur}
        className="padding-td"
      >
        <span className=" "> {value2}</span>
      </div>
    );
  };

  const EditableCellNumber = ({
    ivalue = "",
    index = "",
    updateMyData,
    property = "",
    type = 0,
    edit = true,
  }) => {
    const [value, setValue] = useState(ivalue);
    const [value2, setValue2] = useState(ivalue);

    const handleChange = (event) => {
      const inputNumber = event.currentTarget.textContent.replace(
        /[^\d.-]+/g,
        ""
      );
      if (inputNumber !== "") {
        const parsedNumber = parseFloat(inputNumber);
        if (!isNaN(parsedNumber)) {
          setValue(Number(inputNumber));
        }
      } else {
        setValue(0);
      }
    };
    const onBlur = (e) => {
      setValue2(value);
      updateMyData(index, value, property, type);
    };

    useEffect(() => {
      setValue(ivalue);
    }, [ivalue]);

    return (
      <div
        contentEditable={edit}
        suppressContentEditableWarning="true"
        onInput={handleChange}
        onBlur={onBlur}
        className="padding-td"
      >
        <span className=" "> {FormatMoney(value2)}</span>
      </div>
    );
  };

  const EditableCellChecked = ({
    ivalue = "",
    index = "",
    updateMyData,
    property = "",
    type = 0,
    edit = true,
  }) => {
    const [value, setValue] = useState(ivalue);

    const handleChange = (event) => {
      setValue(event.target.checked);
      updateMyData(index, event.target.checked, property, type);
    };

    useEffect(() => {
      setValue(ivalue);
    }, [ivalue]);

    return (
      <div class="icheck-primary d-inline">
        <input
          type="checkbox"
          id={`checkboxPrimary1 ${property + index + type}`}
          checked={value}
          onChange={handleChange}
        />
        <label for={`checkboxPrimary1 ${property + index + type}`}></label>
      </div>
    );
  };

  const updateSpecial = (sp, index, value, property, type) => {
    return sp.map((row, i) => {
      if (i === index) {
        if (property === "typePaymentTM") {
          return {
            ...sp[index],
            [property]: value,
            typePaymentCK: value ? false : sp[index].typePaymentCK,
            typePaymentCard: value ? false : sp[index].typePaymentCard,
          };
        } else if (property === "typePaymentCK") {
          return {
            ...sp[index],
            [property]: value,
            typePaymentTM: value ? false : sp[index].typePaymentTM,
            typePaymentCard: value ? false : sp[index].typePaymentCard,
          };
        } else if (property === "typePaymentCard") {
          return {
            ...sp[index],
            [property]: value,
            typePaymentTM: value ? false : sp[index].typePaymentTM,
            typePaymentCK: value ? false : sp[index].typePaymentCK,
          };
        } else {
          return {
            ...sp[index],
            [property]: value,
          };
        }
      }
      return row;
    });
  };

  const updateMyData = (index, value, property, type) => {
    if (type === 0) {
      setPlaneTicketData((old) =>
        updateSpecial(old, index, value, property, type)
      );
    }
    if (type === 1) {
      setLandTourData((old) =>
        updateSpecial(old, index, value, property, type)
      );
    }
    if (type === 2) {
      setVisaData((old) => updateSpecial(old, index, value, property, type));
    }
    if (type === 3) {
      setTourLeaderData((old) =>
        updateSpecial(old, index, value, property, type)
      );
    }
    if (type === 4) {
      setSecurityData((old) =>
        updateSpecial(old, index, value, property, type)
      );
    }
    if (type === 5) {
      setTipData((old) => updateSpecial(old, index, value, property, type));
    }
    if (type === 6) {
      setWaterData((old) => updateSpecial(old, index, value, property, type));
    }
    if (type === 7) {
      setGiftData((old) => updateSpecial(old, index, value, property, type));
    }
    if (type === 8) {
      setAnotherData((old) => updateSpecial(old, index, value, property, type));
    }
    if (type === 9) {
      setSurchangeData((old) =>
        updateSpecial(old, index, value, property, type)
      );
    }
    if (type === 10) {
      setHdvData((old) => updateSpecial(old, index, value, property, type));
    }
    if (type === 100) {
      if (property === "AdvanceMoney") {
        setPrice({ ...price, AdvanceMoney: value });
      }
      if (property === "TotalRevenue") {
        setPrice({ ...price, TotalRevenue: value });
      }
    }
  };

  useEffect(() => {
    let arr = [
      ...planeTicketData,
      ...landTourData,
      ...visaData,
      ...tourLeaderData,
      ...securityData,
      ...tipData,
      ...waterData,
      ...giftData,
      ...anotherData,
      ...surchangeData,
      ...hdvData,
    ];
    const totalPrice = arr.reduce(
      (acc, curr) => acc + Math.round(curr.price * curr.quantity * 100) / 100,
      0
    );
    setPrice({ ...price, TotalPrice: totalPrice });
  }, [
    planeTicketData,
    landTourData,
    visaData,
    tourLeaderData,
    securityData,
    tipData,
    waterData,
    giftData,
    anotherData,
    surchangeData,
    hdvData,
  ]);

  useEffect(() => {
    setPrice({
      ...price,
      Profit: price.TotalRevenue - (price.TotalPrice + price.AdvanceMoney),
    });
  }, [price.AdvanceMoney, price.TotalRevenue, price.TotalPrice]);

  const ComTd = ({ sv, index, type }) => {
    return (
      <>
        <td className="text-center align-middle">
          <div class="input-group ">
            <EditableCell
              ivalue={sv.partner}
              index={index}
              updateMyData={updateMyData}
              property="partner"
              type={type}
            />
          </div>
        </td>
        <td className="text-center align-middle">
          <div class="input-group ">
            <EditableCell
              ivalue={sv.serviceContent}
              index={index}
              updateMyData={updateMyData}
              property="serviceContent"
              type={type}
            />
          </div>
        </td>
        <td className="text-center align-middle">
          {" "}
          <div class="input-group ">
            <EditableCellNumber
              ivalue={sv.quantity}
              index={index}
              updateMyData={updateMyData}
              property="quantity"
              type={type}
            />
          </div>
        </td>
        <td className="text-center align-middle">
          <div class="input-group ">
            <EditableCell
              ivalue={sv.unit}
              index={index}
              updateMyData={updateMyData}
              property="unit"
              type={type}
            />
          </div>
        </td>
        <td className="text-center align-middle">
          <div class="input-group ">
            <EditableCellNumber
              ivalue={sv.quantity2}
              index={index}
              updateMyData={updateMyData}
              property="quantity2"
              type={type}
            />
          </div>
        </td>
        <td className="text-center align-middle">
          <div class="input-group ">
            <EditableCell
              ivalue={sv.unit2}
              index={index}
              updateMyData={updateMyData}
              property="unit2"
              type={type}
            />
          </div>
        </td>
        <td className="text-center align-middle">
          <div class="input-group ">
            <EditableCellNumber
              ivalue={+sv.price}
              index={index}
              updateMyData={updateMyData}
              property="price"
              type={type}
            />
          </div>
        </td>
        <td className="text-center align-middle">
          <div class="input-group ">
            <div className="padding-td">
              <span className=" ">
                {" "}
                {Math.round(sv.price * sv.quantity * 100) / 100}
              </span>
            </div>
          </div>
        </td>
        <td className="text-center align-middle">
          <EditableCellChecked
            ivalue={sv.typePaymentTM}
            index={index}
            updateMyData={updateMyData}
            property="typePaymentTM"
            type={type}
          />
        </td>
        <td className="text-center align-middle">
          <EditableCellChecked
            ivalue={sv.typePaymentCK}
            index={index}
            updateMyData={updateMyData}
            property="typePaymentCK"
            type={type}
          />
        </td>
        <td className="text-center align-middle">
          <EditableCellChecked
            ivalue={sv.typePaymentCard}
            index={index}
            updateMyData={updateMyData}
            property="typePaymentCard"
            type={type}
          />
        </td>
        <td className="text-center align-middle">
          <div class="input-group ">
            <EditableCell
              ivalue={sv.note}
              index={index}
              updateMyData={updateMyData}
              property="note"
              type={type}
            />
          </div>
        </td>
      </>
    );
  };

  const PlanTicketService = useMemo(() => {
    return (
      <>
        {planeTicketData.map((sv, index) => {
          return (
            <>
              <tr>
                {index === 0 && (
                  <th
                    className="text-center align-middle"
                    rowSpan={planeTicketData.length}
                  >
                    Vé máy bay
                    <button
                      className=" ml-1 btn btn-light py-1 px-2"
                      onClick={() => {
                        setPlaneTicketData([
                          ...planeTicketData,
                          { ...sample, service: "Vé máy bay" },
                        ]);
                      }}
                    >
                      <i class="text-success fas fa-plus-circle"></i>
                    </button>
                  </th>
                )}
                <ComTd sv={sv} index={index} type={0} />
                {planeTicketData.length > 1 && (
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-light py-1 px-2"
                      onClick={() => {
                        setPlaneTicketData(
                          planeTicketData.filter((sv, i) => i !== index)
                        );
                      }}
                    >
                      <i class="text-danger fas fa-trash-alt"></i>
                    </button>
                  </td>
                )}
              </tr>
            </>
          );
        })}
      </>
    );
  }, [planeTicketData]);

  const LandTourService = useMemo(() => {
    return (
      <>
        {landTourData.map((sv, index) => {
          return (
            <>
              <tr className={index === 0 ? "border-tb-top" : ""}>
                {index === 0 && (
                  <th
                    className="text-center align-middle"
                    rowSpan={landTourData.length}
                  >
                    LandTour
                    <button
                      className=" ml-1 btn btn-light py-1 px-2"
                      onClick={() => {
                        setLandTourData([
                          ...landTourData,
                          { ...sample, service: "LandTour" },
                        ]);
                      }}
                    >
                      <i class="text-success fas fa-plus-circle"></i>
                    </button>
                  </th>
                )}
                <ComTd sv={sv} index={index} type={1} />
                {landTourData.length > 1 && (
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-light py-1 px-2"
                      onClick={() => {
                        setLandTourData(
                          landTourData.filter((sv, i) => i !== index)
                        );
                      }}
                    >
                      <i class="text-danger fas fa-trash-alt"></i>
                    </button>
                  </td>
                )}
              </tr>
            </>
          );
        })}
      </>
    );
  }, [landTourData]);

  const VisaService = useMemo(() => {
    return (
      <>
        {visaData.map((sv, index) => {
          return (
            <>
              <tr className={index === 0 ? "border-tb-top" : ""}>
                {index === 0 && (
                  <th
                    className="text-center align-middle"
                    rowSpan={visaData.length}
                  >
                    Visa khách
                    <button
                      className=" ml-1 btn btn-light py-1 px-2"
                      onClick={() => {
                        setVisaData([
                          ...visaData,
                          { ...sample, service: "Visa" },
                        ]);
                      }}
                    >
                      <i class="text-success fas fa-plus-circle"></i>
                    </button>
                  </th>
                )}
                <ComTd sv={sv} index={index} type={2} />
                {visaData.length > 1 && (
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-light py-1 px-2"
                      onClick={() => {
                        setVisaData(visaData.filter((sv, i) => i !== index));
                      }}
                    >
                      <i class="text-danger fas fa-trash-alt"></i>
                    </button>
                  </td>
                )}
              </tr>
            </>
          );
        })}
      </>
    );
  }, [visaData]);

  const TourLeaderService = useMemo(() => {
    return (
      <>
        {tourLeaderData.map((sv, index) => {
          return (
            <>
              <tr className={index === 0 ? "border-tb-top" : ""}>
                {index === 0 && (
                  <th
                    className="text-center align-middle"
                    rowSpan={tourLeaderData.length}
                  >
                    Hướng dẫn viên
                    <button
                      className=" ml-1 btn btn-light py-1 px-2"
                      onClick={() => {
                        setTourLeaderData([
                          ...tourLeaderData,
                          { ...sample, service: "TourLeader" },
                        ]);
                      }}
                    >
                      <i class="text-success fas fa-plus-circle"></i>
                    </button>
                  </th>
                )}
                <ComTd sv={sv} index={index} type={3} />
                {tourLeaderData.length > 1 && (
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-light py-1 px-2"
                      onClick={() => {
                        setTourLeaderData(
                          tourLeaderData.filter((sv, i) => i !== index)
                        );
                      }}
                    >
                      <i class="text-danger fas fa-trash-alt"></i>
                    </button>
                  </td>
                )}
              </tr>
            </>
          );
        })}
      </>
    );
  }, [tourLeaderData]);

  const SecurityService = useMemo(() => {
    return (
      <>
        {securityData.map((sv, index) => {
          return (
            <>
              <tr className={index === 0 ? "border-tb-top" : ""}>
                {index === 0 && (
                  <th
                    className="text-center align-middle"
                    rowSpan={securityData.length}
                  >
                    Bảo hiểm
                    <button
                      className=" ml-1 btn btn-light py-1 px-2"
                      onClick={() => {
                        setSecurityData([
                          ...securityData,
                          { ...sample, service: "Bảo hiểm" },
                        ]);
                      }}
                    >
                      <i class="text-success fas fa-plus-circle"></i>
                    </button>
                  </th>
                )}
                <ComTd sv={sv} index={index} type={4} />
                {securityData.length > 1 && (
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-light py-1 px-2"
                      onClick={() => {
                        setSecurityData(
                          securityData.filter((sv, i) => i !== index)
                        );
                      }}
                    >
                      <i class="text-danger fas fa-trash-alt"></i>
                    </button>
                  </td>
                )}
              </tr>
            </>
          );
        })}
      </>
    );
  }, [securityData]);

  const TipService = useMemo(() => {
    return (
      <>
        {tipData.map((sv, index) => {
          return (
            <>
              <tr className={index === 0 ? "border-tb-top" : ""}>
                {index === 0 && (
                  <th
                    className="text-center align-middle"
                    rowSpan={tipData.length}
                  >
                    TIP
                    <button
                      className=" ml-1 btn btn-light py-1 px-2"
                      onClick={() => {
                        setTipData([...tipData, { ...sample, service: "Tip" }]);
                      }}
                    >
                      <i class="text-success fas fa-plus-circle"></i>
                    </button>
                  </th>
                )}
                <ComTd sv={sv} index={index} type={5} />
                {tipData.length > 1 && (
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-light py-1 px-2"
                      onClick={() => {
                        setTipData(tipData.filter((sv, i) => i !== index));
                      }}
                    >
                      <i class="text-danger fas fa-trash-alt"></i>
                    </button>
                  </td>
                )}
              </tr>
            </>
          );
        })}
      </>
    );
  }, [tipData]);

  const WaterService = useMemo(() => {
    return (
      <>
        {waterData.map((sv, index) => {
          return (
            <>
              <tr className={index === 0 ? "border-tb-top" : ""}>
                {index === 0 && (
                  <th
                    className="text-center align-middle"
                    rowSpan={waterData.length}
                  >
                    Nước
                    <button
                      className=" ml-1 btn btn-light py-1 px-2"
                      onClick={() => {
                        setWaterData([
                          ...waterData,
                          { ...sample, service: "Nước" },
                        ]);
                      }}
                    >
                      <i class="text-success fas fa-plus-circle"></i>
                    </button>
                  </th>
                )}
                <ComTd sv={sv} index={index} type={6} />
                {waterData.length > 1 && (
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-light py-1 px-2"
                      onClick={() => {
                        setWaterData(waterData.filter((sv, i) => i !== index));
                      }}
                    >
                      <i class="text-danger fas fa-trash-alt"></i>
                    </button>
                  </td>
                )}
              </tr>
            </>
          );
        })}
      </>
    );
  }, [waterData]);

  const GiftService = useMemo(() => {
    return (
      <>
        {giftData.map((sv, index) => {
          return (
            <>
              <tr className={index === 0 ? "border-tb-top" : ""}>
                {index === 0 && (
                  <th
                    className="text-center align-middle"
                    rowSpan={giftData.length}
                  >
                    Quà tặng
                    <button
                      className=" ml-1 btn btn-light py-1 px-2"
                      onClick={() => {
                        setGiftData([
                          ...giftData,
                          { ...sample, service: "Quà tặng" },
                        ]);
                      }}
                    >
                      <i class="text-success fas fa-plus-circle"></i>
                    </button>
                  </th>
                )}
                <ComTd sv={sv} index={index} type={7} />
                {giftData.length > 1 && (
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-light py-1 px-2"
                      onClick={() => {
                        setGiftData(giftData.filter((sv, i) => i !== index));
                      }}
                    >
                      <i class="text-danger fas fa-trash-alt"></i>
                    </button>
                  </td>
                )}
              </tr>
            </>
          );
        })}
      </>
    );
  }, [giftData]);

  const AnotherService = useMemo(() => {
    return (
      <>
        {anotherData.map((sv, index) => {
          return (
            <>
              <tr className={index === 0 ? "border-tb-top" : ""}>
                {index === 0 && (
                  <th
                    className="text-center align-middle"
                    rowSpan={anotherData.length}
                  >
                    Chi phí khác
                    <button
                      className=" ml-1 btn btn-light py-1 px-2"
                      onClick={() => {
                        setAnotherData([
                          ...anotherData,
                          { ...sample, service: "Chi phí khác" },
                        ]);
                      }}
                    >
                      <i class="text-success fas fa-plus-circle"></i>
                    </button>
                  </th>
                )}
                <ComTd sv={sv} index={index} type={8} />
                {anotherData.length > 1 && (
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-light py-1 px-2"
                      onClick={() => {
                        setAnotherData(
                          anotherData.filter((sv, i) => i !== index)
                        );
                      }}
                    >
                      <i class="text-danger fas fa-trash-alt"></i>
                    </button>
                  </td>
                )}
              </tr>
            </>
          );
        })}
      </>
    );
  }, [anotherData]);

  const SurchangeService = useMemo(() => {
    return (
      <>
        {surchangeData.map((sv, index) => {
          return (
            <>
              <tr className={index === 0 ? "border-tb-top" : ""}>
                {index === 0 && (
                  <th
                    className="text-center align-middle"
                    rowSpan={surchangeData.length}
                  >
                    Phát sinh trên tour
                    <button
                      className=" ml-1 btn btn-light py-1 px-2"
                      onClick={() => {
                        setSurchangeData([
                          ...surchangeData,
                          { ...sample, service: "Phát sinh" },
                        ]);
                      }}
                    >
                      <i class="text-success fas fa-plus-circle"></i>
                    </button>
                  </th>
                )}
                <ComTd sv={sv} index={index} type={9} />
                {surchangeData.length > 1 && (
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-light py-1 px-2"
                      onClick={() => {
                        setSurchangeData(
                          surchangeData.filter((sv, i) => i !== index)
                        );
                      }}
                    >
                      <i class="text-danger fas fa-trash-alt"></i>
                    </button>
                  </td>
                )}
              </tr>
            </>
          );
        })}
      </>
    );
  }, [surchangeData]);

  const HdvService = useMemo(() => {
    return (
      <>
        {hdvData.map((sv, index) => {
          return (
            <>
              <tr className={index === 0 ? "border-tb-top" : ""}>
                {index === 0 && (
                  <th
                    className="text-center align-middle"
                    rowSpan={hdvData.length}
                  >
                    Bàn giao HDV
                    <button
                      className=" ml-1 btn btn-light py-1 px-2"
                      onClick={() => {
                        setHdvData([...hdvData, { ...sample, service: "HDV" }]);
                      }}
                    >
                      <i class="text-success fas fa-plus-circle"></i>
                    </button>
                  </th>
                )}
                <ComTd sv={sv} index={index} type={10} />
                {hdvData.length > 1 && (
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-light py-1 px-2"
                      onClick={() => {
                        setHdvData(hdvData.filter((sv, i) => i !== index));
                      }}
                    >
                      <i class="text-danger fas fa-trash-alt"></i>
                    </button>
                  </td>
                )}
              </tr>
            </>
          );
        })}
      </>
    );
  }, [hdvData]);

  //#endregion

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
                KHỞI TẠO PHIẾU
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link " href="#tab_2" data-toggle="tab">
                DANH SÁCH
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
                    <div className="col-md-4">
                      <h3 className="card-title">
                        <i className="fas fa-plus" />
                        <span className="font-weight-bold">
                          Khởi tạo phiếu yêu cầu
                        </span>
                      </h3>
                    </div>
                    <div class="col-sm-12 col-md-8 margin-top-5s">
                      <button
                        type="button"
                        class="btn btn-sm btn-danger pull-right margin-left-10"
                        onClick={Trl_spSettlementTour_Cancer}
                      >
                        <i class="fa fa-trash pr-2"></i>
                        Hủy bỏ
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-success pull-right margin-left-10"
                        onClick={() => {
                          ConfirmAlert(
                            "Xác nhận",
                            "Bạn có chắc chắn muốn lưu không?",
                            () => Trl_spSettlementTour_Save()
                          );
                        }}
                      >
                        <i class="fa fa-plus pr-2"></i>
                        {settlementTourId !== 0 ? "Cập nhật" : "Lưu"}
                      </button>

                      <button
                        type="button"
                        class="btn btn-sm btn-primary pull-right margin-left-10"
                        onClick={() =>
                          Trl_spBooking_CustomerPlane_View(serviceSale)
                        }
                      >
                        <i class="fa fa-search pr-2"></i>
                        Tìm kiếm
                      </button>

                      {settlementTourId !== 0 && (
                        <button
                          type="button"
                          class="btn btn-sm btn-info pull-right margin-left-10"
                          onClick={() => setShowForm(true)}
                        >
                          <i class="fas fa-tasks pr-2"></i>
                          Bàn giao HDV
                        </button>
                      )}

                      <div
                        class="form-group pull-right"
                        style={{ marginTop: "-4px", width: "30%" }}
                      >
                        <div
                          class="input-group index-select"
                          style={{ width: "100%" }}
                        >
                          <SelectServiceSale
                            onSelected={(e) => {
                              if (!isClone) {
                                setServiceSale(e);
                                setBooking(null);
                                Trl_spSettlementTour_Cancer(1);
                              }
                              setServiceSale(e);
                            }}
                            items={serviceSale?.value || 0}
                            className={"w-100 select-custom "}
                            type={0}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={booking ? "card-body tour-request" : "d-none"}>
                  <div className="center-item mb-2">
                    <h3 class=" font-weight-bold text-dark fs-18">
                      BẢNG QUYẾT TOÁN TOUR
                    </h3>
                  </div>
                  <div className="row">
                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-3 font-weight-bold">Tên tour:</div>
                        <div className="col-9 ">
                          {serviceSale.ServiceSaleName}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-3 font-weight-bold ">Mã tour:</div>
                        <div className="col-9">
                          {serviceSale.ServiceSaleCode}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-3 font-weight-bold">
                          Ngày khởi hành:
                        </div>

                        <div className="col-9">
                          {" "}
                          {FormatDateJson(serviceSale.DateSaleFrom, 7)}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-3 font-weight-bold">
                          Ngày kết thúc:
                        </div>
                        <div className="col-9">
                          {FormatDateJson(serviceSale.DateSaleTo, 7)}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-3 font-weight-bold">
                          {" "}
                          Booking vé máy bay đoàn:
                        </div>
                        <div className="col-9">
                          {flightList.length > 0 &&
                            flightList.map((item, index) => {
                              return <div>{item.PlaneCodeEnd}</div>;
                            })}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-3 font-weight-bold">Số lượng:</div>
                        <div className="col-9">
                          <div className="row">
                            <div className="col-4 pr-3">
                              <div class="input-group">
                                <div class="input-group-append">
                                  <span class="input-group-text  bg-light border-0">
                                    Người lớn{" "}
                                  </span>
                                </div>

                                <input
                                  type="number"
                                  class="form-control2"
                                  value={quantity.AdultQuantity}
                                  onChange={(e) =>
                                    setQuantity({
                                      ...quantity,
                                      AdultQuantity: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-4 pr-3">
                              <div class="input-group">
                                <div class="input-group-append">
                                  <span class="input-group-text  bg-light border-0">
                                    Trẻ em{" "}
                                  </span>
                                </div>

                                <input
                                  type="number"
                                  class="form-control2"
                                  value={quantity.ChildQuantity}
                                  onChange={(e) =>
                                    setQuantity({
                                      ...quantity,
                                      ChildQuantity: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-4 pr-3">
                              <div class="input-group">
                                <div class="input-group-append">
                                  <span class="input-group-text  bg-light border-0">
                                    Infant{" "}
                                  </span>
                                </div>

                                <input
                                  type="number"
                                  class="form-control2"
                                  value={quantity.InfantQuantity}
                                  onChange={(e) =>
                                    setQuantity({
                                      ...quantity,
                                      InfantQuantity: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-3 font-weight-bold">
                          Hướng dẫn viên:
                        </div>
                        <div className="col-9">
                          <div class="input-group">
                            <SelectTourGuider
                              onSelected={(e) => setTourLeader(e)}
                              className={"w-100 select-custom "}
                              TourGuiderId={tourLeader.value}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 p-0 mt-4">
                      <div className="table-responsive">
                        <table class="table table-bordered table-request-tour">
                          <tbody className=" text-dark">
                            <tr className="title-guider">
                              <th
                                style={{ minWidth: 180 }}
                                rowSpan={2}
                                className="align-middle"
                              >
                                Dịch vụ
                              </th>

                              <th
                                style={{ minWidth: 300 }}
                                rowSpan={2}
                                className="align-middle"
                              >
                                Đối tác
                              </th>
                              <th
                                style={{ minWidth: 200 }}
                                rowSpan={2}
                                className="align-middle"
                              >
                                Nội dung
                              </th>
                              <th
                                style={{
                                  width: 50,
                                }}
                                className="align-middle"
                                rowSpan={2}
                              >
                                Số lượng
                              </th>
                              <th
                                style={{ minWidth: 100 }}
                                rowSpan={2}
                                className="align-middle"
                              >
                                Đơn vị tính
                              </th>
                              <th
                                style={{ minWidth: 50 }}
                                rowSpan={2}
                                className="align-middle"
                              >
                                Hệ số
                              </th>
                              <th
                                style={{ minWidth: 100 }}
                                rowSpan={2}
                                className="align-middle"
                              >
                                Đơn vị
                              </th>
                              <th
                                style={{ minWidth: 110 }}
                                rowSpan={2}
                                className="align-middle"
                              >
                                Giá
                              </th>
                              <th
                                style={{ minWidth: 100 }}
                                rowSpan={2}
                                className="align-middle"
                              >
                                Thành tiền
                              </th>
                              <th
                                style={{ minWidth: 150 }}
                                colspan={3}
                                rowSpan={1}
                              >
                                Thanh toán
                              </th>

                              <th
                                style={{ minWidth: 300 }}
                                rowSpan={2}
                                className="align-middle"
                              >
                                Ghi chú
                              </th>
                              <th
                                style={{ minWidth: 40 }}
                                rowSpan={2}
                                className="align-middle"
                              ></th>
                            </tr>
                            <tr className="title-guider">
                              <th style={{ minWidth: 50 }}>TM</th>
                              <th style={{ minWidth: 50 }}>CK</th>
                              <th style={{ minWidth: 100 }}>Cà thẻ</th>
                            </tr>
                            {PlanTicketService}
                            {LandTourService}
                            {VisaService}
                            {TourLeaderService}
                            {SecurityService}
                            {TipService}
                            {WaterService}
                            {GiftService}
                            {AnotherService}
                            {SurchangeService}
                            {HdvService}
                            <tr>
                              <th
                                colSpan={8}
                                className=" align-middle text-left"
                              >
                                Tổng cộng
                              </th>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.TotalPrice}
                                    updateMyData={updateMyData}
                                    property="quantity"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <th
                                colSpan={8}
                                className=" align-middle text-left"
                              >
                                Ứng hướng dẫn viên
                              </th>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.AdvanceMoney}
                                    updateMyData={updateMyData}
                                    property="AdvanceMoney"
                                    type={100}
                                    edit={true}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <th
                                colSpan={8}
                                className=" align-middle text-left"
                              >
                                Tổng thu
                              </th>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.TotalRevenue}
                                    updateMyData={updateMyData}
                                    property="TotalRevenue"
                                    type={100}
                                    edit={true}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <th
                                colSpan={8}
                                className=" align-middle text-left"
                              >
                                Lợi nhuận
                              </th>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Profit}
                                    updateMyData={updateMyData}
                                    property="Profit"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
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
                        <i className="fas fa-plus" />
                        <span className="font-weight-bold">
                          Quản lý bảng quyết toán Tour
                        </span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      <button
                        className="btn btn-danger btn-sm float-right btn-header"
                        type="button"
                        onClick={Trl_spSettlementTour_List}
                      >
                        <i className="fa fa-search mr-2 " />
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body ">
                  <div className="row">
                    <DataTable data={settlementList} columns={columns} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showForm}
        onHide={() => setShowForm(false)}
        aria-labelledby="example-custom-modal-styling-title"
        className=" custom-modal-w-90"
      >
        <Modal.Header className="p-2">
          <Modal.Title id="example-custom-modal-styling-title">
            <div class="text-center"></div>
          </Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => {
              let random = Math.random();
              setRandom(random);
            }}
          >
            <span aria-hidden="true">In</span>
          </button>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => setShowForm(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-2">
          <SettlementTourForm
            data={[
              planeTicketData,
              landTourData,
              visaData,
              securityData,
              waterData,
              giftData,
              hdvData,
            ]}
            service={serviceSale}
            random={random}
            quantity={quantity}
            tourLeader={tourLeader}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

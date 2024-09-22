import moment from "moment";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  DataTable,
  SelectServiceSale,
  TooltipCustom,
} from "../../../../Common";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  ConfirmAlert,
  ConvertFileName,
  FormatDateJson,
  FormatMoney,
  FormatMoneyFloat,
} from "../../../../Utils";
import Select from "react-select";
import { IMAGES_DOMAIN } from "../../../../Services";

export const CostTourV2 = () => {
  const dispatch = useDispatch();
  const Creater = +localStorage.getItem("CreateBy");
  const [serviceSale, setServiceSale] = useState(0);
  const [flightList, setFlightList] = useState([]);
  const TypeOfMoneyList = [
    { value: 1, label: "USD" },
    { value: 2, label: "EUR" },
    { value: 3, label: "GBP" },
    { value: 4, label: "JPY" },
    { value: 5, label: "WON" },
  ];
  const [TypeOfMoney, setTypeOfMoney] = useState({ value: 1, label: "USD" });
  const [booking, setBooking] = useState(null);
  const [CostList, setCostList] = useState([]);
  const [CostTourId, setCostTourId] = useState(0);
  const [isLock, setIsLock] = useState(false);
  const [isClone, setIsClone] = useState(false);
  const [CostTourName, setCostTourName] = useState("PHIẾU CHIẾT TÍNH TOUR");
  const [hover, setHover] = useState(false);
  const [editName, setEditName] = useState(false);
  const [price, setPrice] = useState({
    TotalCost10: 0,
    NET1paxUSD10: 0,
    NET1paxVND10: 0,
    Interest1paxUSD10: 0,
    Interest1paxVND10: 0,
    Percent10: 0,
    InterestUSD10: 0,
    InterestVND10: 0,
    TotalCost15: 0,
    NET1paxUSD15: 0,
    NET1paxVND15: 0,
    Interest1paxUSD15: 0,
    Interest1paxVND15: 0,
    Percent15: 0,
    InterestUSD15: 0,
    InterestVND15: 0,
    TotalCost20: 0,
    NET1paxUSD20: 0,
    NET1paxVND20: 0,
    Interest1paxUSD20: 0,
    Interest1paxVND20: 0,
    Percent20: 0,
    InterestUSD20: 0,
    InterestVND20: 0,
    TotalCost25: 0,
    NET1paxUSD25: 0,
    NET1paxVND25: 0,
    Interest1paxUSD25: 0,
    Interest1paxVND25: 0,
    Percent25: 0,
    InterestUSD25: 0,
    InterestVND25: 0,
    TotalCost30: 0,
    NET1paxUSD30: 0,
    NET1paxVND30: 0,
    Interest1paxUSD30: 0,
    Interest1paxVND30: 0,
    Percent30: 0,
    InterestUSD30: 0,
    InterestVND30: 0,
    TotalCostBQ: 0,
    NET1paxUSDBQ: 0,
    NET1paxVNDBQ: 0,
    Interest1paxUSDBQ: 0,
    Interest1paxVNDBQ: 0,
    PercentBQ: 0,
    InterestUSDBQ: 0,
    InterestVNDBQ: 0,
  });

  const [money, setMoney] = useState({
    ExChangeRate: "",
    Price: "",
    Quantity: 0,
    TotalPrice10: "",
    TotalPrice15: "",
    TotalPrice20: "",
    TotalPrice25: "",
    TotalPrice30: "",
  });

  const [sample, setSample] = useState({
    CostTourDetailId: 0,
    ServiceContent: "",
    Quantity10: 0,
    Price: 0,
    TotalPrice10: 0,
    Quantity15: 0,
    TotalPrice15: 0,
    Quantity20: 0,
    TotalPrice20: 0,
    Quantity25: 0,
    TotalPrice25: 0,
    Quantity30: 0,
    TotalPrice30: 0,
    BQ1Pax: 0,
    Note: "",
  });

  const [planeTicketData, setPlaneTicketData] = useState([
    { ...sample, Service: "Vé máy bay" },
  ]);
  const [landTourData, setLandTourData] = useState([
    { ...sample, Service: "LandTour" },
  ]);
  const [hotelData, setHotelData] = useState([{ ...sample, Service: "Hotel" }]);
  const [RestaurantData, setRestaurantData] = useState([
    { ...sample, Service: "Restaurant" },
  ]);
  const [tourismData, setTourismData] = useState([
    { ...sample, Service: "Tourism" },
  ]);
  const [visaData, setVisaData] = useState([{ ...sample, Service: "Visa" }]);
  const [tourLeaderData, setTourLeaderData] = useState([
    { ...sample, Service: "TourLeader" },
  ]);
  const [securityData, setSecurityData] = useState([
    { ...sample, Service: "Bảo hiểm" },
  ]);
  const [tipData, setTipData] = useState([{ ...sample, Service: "Tip" }]);
  const [waterData, setWaterData] = useState([{ ...sample, Service: "Nước" }]);
  const [giftData, setGiftData] = useState([
    { ...sample, Service: "Quà tặng" },
  ]);
  const [anotherData, setAnotherData] = useState([
    { ...sample, Service: "Chi phí khác" },
  ]);

  //#region call api

  useEffect(() => {
    Trl_spCostTour_List();
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

  const Trl_spCostTour_Save = async (lock) => {
    if (
      booking?.BookingId === 0 ||
      !booking?.BookingId ||
      serviceSale.BookingId === 0 ||
      !serviceSale.BookingId
    ) {
      Alertwarning("Vui lòng chọn Tour.");
      return;
    }
    if (isLock) {
      Alertwarning("Phiếu đã bị khóa.");
      return;
    }

    try {
      let ListFiles = "";

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
      let f = ListFiles.length > 0 ? "," + ListFiles : ListFiles;
      let dt = [
        ...planeTicketData,
        ...landTourData,
        ...hotelData,
        ...RestaurantData,
        ...tourismData,
        ...visaData,
        ...tourLeaderData,
        ...securityData,
        ...tipData,
        ...waterData,
        ...giftData,
        ...anotherData,
      ].map((item, index) => {
        return {
          ...item,
          Creater: +Creater,
          TotalPrice10: +FormatMoney(
            Math.round(item.Price * item.Quantity10 * 100) / 100
          ).replaceAll(",", ""),
          TotalPrice15: +FormatMoney(
            Math.round(item.Price * item.Quantity15 * 100) / 100
          ).replaceAll(",", ""),
          TotalPrice20: +FormatMoney(
            Math.round(item.Price * item.Quantity20 * 100) / 100
          ).replaceAll(",", ""),
          TotalPrice25: +FormatMoney(
            Math.round(item.Price * item.Quantity25 * 100) / 100
          ).replaceAll(",", ""),
          TotalPrice30: +FormatMoney(
            Math.round(item.Price * item.Quantity30 * 100) / 100
          ).replaceAll(",", ""),
        };
      });

      const pr = {
        CostTourId: CostTourId,
        CostTourName: CostTourName,
        BookingId: +serviceSale.BookingId || 0,
        TypeOfMoney: TypeOfMoney.label,
        ExChangeRate: FormatMoney(money.ExChangeRate, 1),
        Price: +money.Price.replaceAll(",", ""),
        Quantity: +money.Quantity,
        TotalPrice: +money.TotalPrice,
        TotalPrice10: +money.TotalPrice10,
        TotalPrice15: +money.TotalPrice15,
        TotalPrice20: +money.TotalPrice20,
        TotalPrice25: +money.TotalPrice25,
        TotalPrice30: +money.TotalPrice30,
        TotalCost: +price.TotalCost,
        Creater: +Creater,
        detail: dt,
        Files:
          FileShow.length > 0
            ? FileShow.join(",") + f
            : ListFiles.length > 0
            ? ListFiles
            : null,
        IsLock: lock,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCostTour_Save",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Lưu thành công");
        setCostTourId(res.CostTourId);
        Trl_spCostTour_List(1, res.CostTourId);
        setFileUpload([]);
        setEditName(false);
        setIsClone(false);
      } else {
        Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
      }

      // setDataBookingStatus(res)
    } catch (error) {
      ;
    }
  };

  const Trl_spCostTour_List = async (type = 0, id) => {
    try {
      const pr = {
        CostTourId: 0,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCostTour_List",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);

      if (res.length > 0) {
        setCostList(res);

        if (id !== 0 && type === 1) {
          const data = res.find((item) => item.CostTourId === id);
          ;
          if (data) {
            Trl_spCostTour_Edit(data);
          }
        } else {
          setCostTourId(0);
          type === 0 && setServiceSale(0);
          setFlightList([]);
          setIsClone(false);
          setBooking(null);
        }
        // Alertsuccess("Lưu thành công");
      } else {
        Alertwarning("Không có dữ liệu");
        setCostList([]);
      }
    } catch (error) {
      ;
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const Trl_spCostTour_Delete = async (id) => {
    try {
      const pr = {
        CostTourId: id,
        Creater: +Creater,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCostTour_Delete",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Lưu thành công");
        await Trl_spCostTour_List();
      } else {
        Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
        setCostList([]);
      }
    } catch (error) {
      ;
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const Trl_spCostTour_Edit = (dataEdit, type = 0) => {
    type === 0 ? setIsClone(false) : setIsClone(true);
    let service = {
      value: dataEdit.ServiceSaleId,
      BookingId: dataEdit.BookingId,
      ServiceSaleCode: dataEdit.ServiceSaleCode,
      ServiceSaleName: dataEdit.ServiceSaleName,
      DateSaleFrom: dataEdit.DateSaleFrom,
      DateSaleTo: dataEdit.DateSaleTo,
    };
    const startDate = moment(dataEdit.DateSaleFrom).format("YYYY-MM-DD");
    const endDate = moment(dataEdit.DateSaleTo).format("YYYY-MM-DD");
    const diff = moment(endDate).diff(startDate, "days");
    dataEdit.CostTourName.length > 0
      ? setCostTourName(dataEdit.CostTourName)
      : setCostTourName("PHIẾU CHIẾT TÍNH TOUR");
    type === 0 ? setCostTourId(dataEdit.CostTourId) : setCostTourId(0);
    type === 0
      ? setServiceSale({ ...service, totalDay: diff + 1 })
      : setServiceSale(0);
    Trl_spBooking_CustomerPlane_View(service);
    setMoney({
      ...money,
      TypeOfMoney: { value: dataEdit.TypeOfMoney, label: dataEdit.TypeOfMoney },
      ExChangeRate: FormatMoney(dataEdit.ExChangeRate),
      Price: FormatMoney(dataEdit.Price),
      Quantity: dataEdit.Quantity,
    });
    let data =
      type === 0
        ? [...dataEdit.Detail]
        : [...dataEdit.Detail].map((item, index) => {
            return {
              ...item,
              CostTourDetailId: 0,
              CostTourId: 0,
            };
          });

    if (data.length > 0) {
      let planeTicket = data.filter((item) => item.Service === "Vé máy bay");
      let landTour = data.filter((item) => item.Service === "LandTour");
      let hotel = data.filter((item) => item.Service === "Hotel");
      let restaurant = data.filter((item) => item.Service === "Restaurant");
      let tourism = data.filter((item) => item.Service === "Tourism");
      let visa = data.filter((item) => item.Service === "Visa");
      let tourLeader = data.filter((item) => item.Service === "TourLeader");
      let security = data.filter((item) => item.Service === "Bảo hiểm");
      let tip = data.filter((item) => item.Service === "Tip");
      let water = data.filter((item) => item.Service === "Nước");
      let gift = data.filter((item) => item.Service === "Quà tặng");
      let another = data.filter((item) => item.Service === "Chi phí khác");

      setPlaneTicketData(planeTicket);
      setLandTourData(landTour);
      setHotelData(hotel);
      setRestaurantData(restaurant);
      setTourismData(tourism);
      setVisaData(visa);
      setTourLeaderData(tourLeader);
      setSecurityData(security);
      setTipData(tip);
      setWaterData(water);
      setGiftData(gift);
      setAnotherData(another);

      let arr = dataEdit.Files?.replaceAll('"', "");
      if (arr?.length > 0) {
        let FilesArr = [];
        FilesArr = arr.split(",");
        setFileShow(FilesArr);
      }
      document.getElementById("tab_1").click();
      type === 0 ? setIsLock(dataEdit.IsLock) : setIsLock(false);
    }
  };

  const Trl_spCostTour_Cancer = (type = 0) => {
    setIsLock(false);
    setIsClone(false);
    setCostTourId(0);
    type === 0 && setServiceSale(0);
    setFlightList([]);
    setBooking(null);
    setPlaneTicketData([{ ...sample, Service: "Vé máy bay" }]);
    setLandTourData([{ ...sample, Service: "LandTour" }]);
    setHotelData([{ ...sample, Service: "Hotel" }]);
    setRestaurantData([{ ...sample, Service: "Restaurant" }]);
    setTourismData([{ ...sample, Service: "Tourism" }]);
    setVisaData([{ ...sample, Service: "Visa" }]);
    setTourLeaderData([{ ...sample, Service: "TourLeader" }]);
    setSecurityData([{ ...sample, Service: "Bảo hiểm" }]);
    setTipData([{ ...sample, Service: "Tip" }]);
    setWaterData([{ ...sample, Service: "Nước" }]);
    setGiftData([{ ...sample, Service: "Quà tặng" }]);
    setAnotherData([{ ...sample, Service: "Chi phí khác" }]);
    setCostTourName("PHIẾU CHIẾT TÍNH TOUR");
    setPrice({
      TotalCost: 0,
      NET1paxUSD: 0,
      NET1paxVND: 0,
      Interest1paxUSD: 0,
      Interest1paxVND: 0,
      Percent: 0,
      InterestUSD: 0,
      InterestVND: 0,
    });
    setMoney({
      ExChangeRate: "",
      Price: "",
      Quantity: 0,
      TotalPrice: "",
    });
    setFileShow([]);
    setFileUpload([]);
  };
  //#endregion

  const columns = [
    {
      Header: "Options",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-xs btn-info"
            onClick={() => Trl_spCostTour_Edit(row._original, 1)}
          >
            {" "}
            <i class="fa fa-clone"></i> Nhân bản
          </button>{" "}
          <button
            className="btn btn-xs btn-warning"
            onClick={() => Trl_spCostTour_Edit(row._original)}
          >
            {" "}
            <i class="fa fa-eye"></i> Sửa
          </button>{" "}
          <button
            className="btn btn-xs btn-danger"
            onClick={() =>
              ConfirmAlert("Xác nhận", "Bạn có chắc chắn muốn xóa không?", () =>
                Trl_spCostTour_Delete(row._original.CostTourId)
              )
            }
          >
            {" "}
            <i class="fa fa-trash"></i> Xóa
          </button>{" "}
        </div>
      ),
      minWidth: 200,
      fixed: "left",
    },
    {
      Header: "Tên Phiếu",
      accessor: "CostTourName",
      minWidth: 250,
      fixed: "left",
    },
    {
      Header: "Mã Tour",
      accessor: "ServiceSaleCode",
      minWidth: 250,
    },
    {
      Header: "Tên Tour",
      accessor: "ServiceSaleName",
      minWidth: 250,
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

  const updateSpecial = (sp, index, value, property, type) => {
    return sp.map((row, i) => {
      if (i === index) {
        return {
          ...sp[index],
          [property]: value,
        };
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
    if (type === 20) {
      setHotelData((old) => updateSpecial(old, index, value, property, type));
    }
    if (type === 21) {
      setRestaurantData((old) =>
        updateSpecial(old, index, value, property, type)
      );
    }
    if (type === 22) {
      setTourismData((old) => updateSpecial(old, index, value, property, type));
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
      ...hotelData,
      ...RestaurantData,
      ...tourismData,
      ...visaData,
      ...tourLeaderData,
      ...securityData,
      ...tipData,
      ...waterData,
      ...giftData,
      ...anotherData,
    ];
    const totalPrice10 = arr.reduce(
      (acc, curr) => acc + Math.round(curr.Price * curr.Quantity10 * 100) / 100,
      0
    );
    const TotalPrice15 = arr.reduce(
      (acc, curr) => acc + Math.round(curr.Price * curr.Quantity15 * 100) / 100,
      0
    );
    const TotalPrice20 = arr.reduce(
      (acc, curr) => acc + Math.round(curr.Price * curr.Quantity20 * 100) / 100,
      0
    );
    const TotalPrice25 = arr.reduce(
      (acc, curr) => acc + Math.round(curr.Price * curr.Quantity25 * 100) / 100,
      0
    );
    const TotalPrice30 = arr.reduce(
      (acc, curr) => acc + Math.round(curr.Price * curr.Quantity30 * 100) / 100,
      0
    );

    const TotalPriceBQ = arr.reduce(
      (acc, curr) => acc + Math.round((curr.BQ1Pax || 0) * 100) / 100,
      0
    );

    setPrice({
      ...price,
      TotalCost10: totalPrice10,
      TotalCost15: TotalPrice15,
      TotalCost20: TotalPrice20,
      TotalCost25: TotalPrice25,
      TotalCost30: TotalPrice30,
      TotalCostBQ: TotalPriceBQ,
    });
  }, [
    planeTicketData,
    landTourData,
    hotelData,
    RestaurantData,
    tourismData,
    visaData,
    tourLeaderData,
    securityData,
    tipData,
    waterData,
    giftData,
    anotherData,
    money,
  ]);

  useEffect(() => {
    caculatorPrice();
  }, [
    price.TotalCost10,
    price.TotalCost20,
    price.TotalCost15,
    price.TotalCost25,
    price.TotalCost30,
    price.TotalCostBQ,
    money.Quantity,
    money.ExChangeRate,
    money.Price,
  ]);

  const caculatorPrice = () => {
    const Net1paxUSD10 = price.TotalCost10 / 10 || 0;
    const Net1paxVND10 = Net1paxUSD10 * FormatMoney(money.ExChangeRate, 1) || 0;
    const Interest1paxUSD10 = +money.Price.replaceAll(",", "") - Net1paxUSD10;
    const Interest1paxVND10 =
      Interest1paxUSD10 * +money.ExChangeRate.replaceAll(",", "");
    const Percent10 =
      ((Interest1paxUSD10 / +money.Price.replaceAll(",", "")) * 100)?.toFixed(
        2
      ) || 0;
    const InterestUSD10 = Interest1paxUSD10 * 10 || 0;
    const InterestVND10 = Interest1paxVND10 * 10 || 0;

    const Net1paxUSD15 = price.TotalCost15 / 15 || 0;
    const Net1paxVND15 = Net1paxUSD15 * FormatMoney(money.ExChangeRate, 1) || 0;
    const Interest1paxUSD15 = +money.Price.replaceAll(",", "") - Net1paxUSD15;
    const Interest1paxVND15 =
      Interest1paxUSD15 * +money.ExChangeRate.replaceAll(",", "");
    const Percent15 =
      ((Interest1paxUSD15 / +money.Price.replaceAll(",", "")) * 100)?.toFixed(
        2
      ) || 0;
    const InterestUSD15 = Interest1paxUSD15 * 15 || 0;
    const InterestVND15 = Interest1paxVND15 * 15 || 0;

    const Net1paxUSD20 = price.TotalCost20 / 20 || 0;
    const Net1paxVND20 = Net1paxUSD20 * FormatMoney(money.ExChangeRate, 1) || 0;
    const Interest1paxUSD20 = +money.Price.replaceAll(",", "") - Net1paxUSD20;
    const Interest1paxVND20 =
      Interest1paxUSD20 * +money.ExChangeRate.replaceAll(",", "");
    const Percent20 =
      ((Interest1paxUSD20 / +money.Price.replaceAll(",", "")) * 100)?.toFixed(
        2
      ) || 0;
    const InterestUSD20 = Interest1paxUSD20 * 20 || 0;
    const InterestVND20 = Interest1paxVND20 * 20 || 0;

    const Net1paxUSD25 = price.TotalCost25 / 25 || 0;
    const Net1paxVND25 = Net1paxUSD25 * FormatMoney(money.ExChangeRate, 1) || 0;
    const Interest1paxUSD25 = +money.Price.replaceAll(",", "") - Net1paxUSD25;
    const Interest1paxVND25 =
      Interest1paxUSD25 * +money.ExChangeRate.replaceAll(",", "");
    const Percent25 =
      ((Interest1paxUSD25 / +money.Price.replaceAll(",", "")) * 100)?.toFixed(
        2
      ) || 0;
    const InterestUSD25 = Interest1paxUSD25 * 25 || 0;
    const InterestVND25 = Interest1paxVND25 * 25 || 0;

    const Net1paxUSD30 = price.TotalCost30 / 30 || 0;
    const Net1paxVND30 = Net1paxUSD30 * FormatMoney(money.ExChangeRate, 1) || 0;
    const Interest1paxUSD30 = +money.Price.replaceAll(",", "") - Net1paxUSD30;
    const Interest1paxVND30 =
      Interest1paxUSD30 * +money.ExChangeRate.replaceAll(",", "");
    const Percent30 =
      ((Interest1paxUSD30 / +money.Price.replaceAll(",", "")) * 100)?.toFixed(
        2
      ) || 0;
    const InterestUSD30 = Interest1paxUSD30 * 30 || 0;
    const InterestVND30 = Interest1paxVND30 * 30 || 0;

    const Net1paxUSDBQ = price.TotalCostBQ || 0;
    const Net1paxVNDBQ = Net1paxUSDBQ * FormatMoney(money.ExChangeRate, 1) || 0;
    const Interest1paxUSDBQ = +money.Price.replaceAll(",", "") - Net1paxUSDBQ;
    const Interest1paxVNDBQ =
      Interest1paxUSDBQ * +money.ExChangeRate.replaceAll(",", "");
    const PercentBQ =
      ((Interest1paxUSDBQ / +money.Price.replaceAll(",", "")) * 100)?.toFixed(
        2
      ) || 0;
    const InterestUSDBQ = Interest1paxUSDBQ || 0;
    const InterestVNDBQ = Interest1paxVNDBQ || 0;

    setPrice({
      ...price,
      NET1paxUSD10: Net1paxUSD10,
      NET1paxVND10: Net1paxVND10,
      Interest1paxUSD10: Interest1paxUSD10,
      Interest1paxVND10: Interest1paxVND10,
      Percent10: Percent10,
      InterestUSD10: InterestUSD10,
      InterestVND10: InterestVND10,
      NET1paxUSD15: Net1paxUSD15,
      NET1paxVND15: Net1paxVND15,
      Interest1paxUSD15: Interest1paxUSD15,
      Interest1paxVND15: Interest1paxVND15,
      Percent15: Percent15,
      InterestUSD15: InterestUSD15,
      InterestVND15: InterestVND15,
      NET1paxUSD20: Net1paxUSD20,
      NET1paxVND20: Net1paxVND20,
      Interest1paxUSD20: Interest1paxUSD20,
      Interest1paxVND20: Interest1paxVND20,
      Percent20: Percent20,
      InterestUSD20: InterestUSD20,
      InterestVND20: InterestVND20,
      NET1paxUSD25: Net1paxUSD25,
      NET1paxVND25: Net1paxVND25,
      Interest1paxUSD25: Interest1paxUSD25,
      Interest1paxVND25: Interest1paxVND25,
      Percent25: Percent25,
      InterestUSD25: InterestUSD25,
      InterestVND25: InterestVND25,
      NET1paxUSD30: Net1paxUSD30,
      NET1paxVND30: Net1paxVND30,
      Interest1paxUSD30: Interest1paxUSD30,
      Interest1paxVND30: Interest1paxVND30,
      Percent30: Percent30,
      InterestUSD30: InterestUSD30,
      InterestVND30: InterestVND30,
      NET1paxUSDBQ: Net1paxUSDBQ,
      NET1paxVNDBQ: Net1paxVNDBQ,
      Interest1paxUSDBQ: Interest1paxUSDBQ,
      Interest1paxVNDBQ: Interest1paxVNDBQ,
      PercentBQ: PercentBQ,
      InterestUSDBQ: InterestUSDBQ,
      InterestVNDBQ: InterestVNDBQ,
    });
  };

  useEffect(() => {
    const TotalPrice10 = +money.Price.replaceAll(",", "") * 10;
    const TotalPrice15 = +money.Price.replaceAll(",", "") * 15;
    const TotalPrice20 = +money.Price.replaceAll(",", "") * 20;
    const TotalPrice25 = +money.Price.replaceAll(",", "") * 25;
    const TotalPrice30 = +money.Price.replaceAll(",", "") * 30;

    setMoney({
      ...money,
      TotalPrice10: TotalPrice10,
      TotalPrice15: TotalPrice15,
      TotalPrice20: TotalPrice20,
      TotalPrice25: TotalPrice25,
      TotalPrice30: TotalPrice30,
    });
  }, [money.Price, money.Quantity]);

  const ComTd = ({ sv, index, type }) => {
    return (
      <>
        <td className="text-center align-middle">
          <div class="input-group ">
            <EditableCell
              ivalue={sv.ServiceContent}
              index={index}
              updateMyData={updateMyData}
              property="ServiceContent"
              type={type}
            />
          </div>
        </td>

        <td className="text-center align-middle">
          <div class="input-group ">
            <EditableCellNumber
              ivalue={+sv.Price}
              index={index}
              updateMyData={updateMyData}
              property="Price"
              type={type}
            />
          </div>
        </td>
        <td className="text-center align-middle">
          <div class="input-group ">
            <EditableCellNumber
              ivalue={+sv.BQ1Pax}
              index={index}
              updateMyData={updateMyData}
              property="BQ1Pax"
              type={type}
            />
          </div>
        </td>
        <td
          className="text-center align-middle"
          style={{ backgroundColor: "#fee2e2" }}
        >
          {" "}
          <div class="input-group ">
            <EditableCellNumber
              ivalue={sv.Quantity10}
              index={index}
              updateMyData={updateMyData}
              property="Quantity10"
              type={type}
            />
          </div>
        </td>

        <td
          className="text-center align-middle"
          style={{ backgroundColor: "#fee2e2" }}
        >
          <div class="input-group ">
            <div className="padding-td">
              <span className=" ">
                {" "}
                {FormatMoney(Math.round(sv.Price * sv.Quantity10 * 100) / 100)}
              </span>
            </div>
          </div>
        </td>
        <td
          className="text-center align-middle"
          style={{ backgroundColor: "#ffedd5" }}
        >
          {" "}
          <div class="input-group ">
            <EditableCellNumber
              ivalue={sv.Quantity15}
              index={index}
              updateMyData={updateMyData}
              property="Quantity15"
              type={type}
            />
          </div>
        </td>

        <td
          className="text-center align-middle"
          style={{ backgroundColor: "#ffedd5" }}
        >
          <div class="input-group ">
            <div className="padding-td">
              <span className=" ">
                {" "}
                {FormatMoney(Math.round(sv.Price * sv.Quantity15 * 100) / 100)}
              </span>
            </div>
          </div>
        </td>
        <td
          className="text-center align-middle"
          style={{ backgroundColor: "#dcfce7" }}
        >
          {" "}
          <div class="input-group ">
            <EditableCellNumber
              ivalue={sv.Quantity20}
              index={index}
              updateMyData={updateMyData}
              property="Quantity20"
              type={type}
            />
          </div>
        </td>

        <td
          className="text-center align-middle"
          style={{ backgroundColor: "#dcfce7" }}
        >
          <div class="input-group ">
            <div className="padding-td">
              <span className=" ">
                {" "}
                {FormatMoney(Math.round(sv.Price * sv.Quantity20 * 100) / 100)}
              </span>
            </div>
          </div>
        </td>
        <td
          className="text-center align-middle"
          style={{ backgroundColor: "#cffafe" }}
        >
          {" "}
          <div class="input-group ">
            <EditableCellNumber
              ivalue={sv.Quantity25}
              index={index}
              updateMyData={updateMyData}
              property="Quantity25"
              type={type}
            />
          </div>
        </td>

        <td
          className="text-center align-middle"
          style={{ backgroundColor: "#cffafe" }}
        >
          <div class="input-group ">
            <div className="padding-td">
              <span className=" ">
                {" "}
                {FormatMoney(Math.round(sv.Price * sv.Quantity25 * 100) / 100)}
              </span>
            </div>
          </div>
        </td>
        <td
          className="text-center align-middle"
          style={{ backgroundColor: "#e0e7ff" }}
        >
          {" "}
          <div class="input-group ">
            <EditableCellNumber
              ivalue={sv.Quantity30}
              index={index}
              updateMyData={updateMyData}
              property="Quantity30"
              type={type}
            />
          </div>
        </td>

        <td
          className="text-center align-middle"
          style={{ backgroundColor: "#e0e7ff" }}
        >
          <div class="input-group ">
            <div className="padding-td">
              <span className=" ">
                {" "}
                {FormatMoney(Math.round(sv.Price * sv.Quantity30 * 100) / 100)}
              </span>
            </div>
          </div>
        </td>

        <td className="text-center align-middle">
          <div class="input-group ">
            <EditableCell
              ivalue={sv.Note}
              index={index}
              updateMyData={updateMyData}
              property="Note"
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
                          { ...sample, Service: "Vé máy bay" },
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

  const HotelService = useMemo(() => {
    return (
      <>
        {hotelData.map((sv, index) => {
          return (
            <>
              <tr className={index === 0 ? "border-tb-top" : ""}>
                {index === 0 && (
                  <th
                    className="text-center align-middle"
                    rowSpan={hotelData.length}
                  >
                    Khách sạn
                    <button
                      className=" ml-1 btn btn-light py-1 px-2"
                      onClick={() => {
                        setHotelData([
                          ...hotelData,
                          { ...sample, Service: "Hotel" },
                        ]);
                      }}
                    >
                      <i class="text-success fas fa-plus-circle"></i>
                    </button>
                  </th>
                )}
                <ComTd sv={sv} index={index} type={20} />
                {hotelData.length > 1 && (
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-light py-1 px-2"
                      onClick={() => {
                        setHotelData(hotelData.filter((sv, i) => i !== index));
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
  }, [hotelData]);

  const RestaurantService = useMemo(() => {
    return (
      <>
        {RestaurantData.map((sv, index) => {
          return (
            <>
              <tr className={index === 0 ? "border-tb-top" : ""}>
                {index === 0 && (
                  <th
                    className="text-center align-middle"
                    rowSpan={RestaurantData.length}
                  >
                    Nhà hàng
                    <button
                      className=" ml-1 btn btn-light py-1 px-2"
                      onClick={() => {
                        setRestaurantData([
                          ...RestaurantData,
                          { ...sample, Service: "Restaurant" },
                        ]);
                      }}
                    >
                      <i class="text-success fas fa-plus-circle"></i>
                    </button>
                  </th>
                )}
                <ComTd sv={sv} index={index} type={21} />
                {RestaurantData.length > 1 && (
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-light py-1 px-2"
                      onClick={() => {
                        setRestaurantData(
                          RestaurantData.filter((sv, i) => i !== index)
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
  }, [RestaurantData]);

  const TourismService = useMemo(() => {
    return (
      <>
        {tourismData.map((sv, index) => {
          return (
            <>
              <tr className={index === 0 ? "border-tb-top" : ""}>
                {index === 0 && (
                  <th
                    className="text-center align-middle"
                    rowSpan={tourismData.length}
                  >
                    Tham quan
                    <button
                      className=" ml-1 btn btn-light py-1 px-2"
                      onClick={() => {
                        setTourismData([
                          ...tourismData,
                          { ...sample, Service: "Tourism" },
                        ]);
                      }}
                    >
                      <i class="text-success fas fa-plus-circle"></i>
                    </button>
                  </th>
                )}
                <ComTd sv={sv} index={index} type={22} />
                {tourismData.length > 1 && (
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-light py-1 px-2"
                      onClick={() => {
                        setTourismData(
                          tourismData.filter((sv, i) => i !== index)
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
  }, [tourismData]);

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
                          { ...sample, Service: "LandTour" },
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
                          { ...sample, Service: "Visa" },
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
                          { ...sample, Service: "TourLeader" },
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
                          { ...sample, Service: "Bảo hiểm" },
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
                        setTipData([...tipData, { ...sample, Service: "Tip" }]);
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
                          { ...sample, Service: "Nước" },
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
                          { ...sample, Service: "Quà tặng" },
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
                          { ...sample, Service: "Chi phí khác" },
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

  //#endregion

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
                        onClick={Trl_spCostTour_Cancer}
                      >
                        <i class="fa fa-trash pr-2"></i>
                        Hủy bỏ
                      </button>
                      <button
                        type="button"
                        class={
                          isLock
                            ? "d-none"
                            : "btn btn-sm btn-success pull-right margin-left-10"
                        }
                        onClick={() => {
                          ConfirmAlert(
                            "Xác nhận",
                            "Bạn có chắc chắn muốn lưu không?",
                            () => Trl_spCostTour_Save(false)
                          );
                        }}
                      >
                        <i class="fa fa-plus pr-2"></i>
                        {CostTourId !== 0 ? "Cập nhật" : "Lưu"}
                      </button>

                      <button
                        type="button"
                        disabled={isLock}
                        class={
                          CostTourId === 0
                            ? "d-none"
                            : "btn btn-sm btn-warning pull-right margin-left-10"
                        }
                        onClick={() => {
                          ConfirmAlert(
                            "Xác nhận",
                            "Bạn có chắc chắn muốn lưu và khóa không?",
                            () => Trl_spCostTour_Save(true)
                          );
                        }}
                      >
                        <i class="fa fa-lock pr-2"></i>
                        {isLock ? "Locked" : "Lock"}
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
                              const startDate = moment(e.DateSaleFrom).format(
                                "YYYY-MM-DD"
                              );
                              const endDate = moment(e.DateSaleTo).format(
                                "YYYY-MM-DD"
                              );
                              const diff = moment(endDate).diff(
                                startDate,
                                "days"
                              );
                              if (!isClone) {
                                setServiceSale({ ...e, totalDay: diff + 1 });
                                setBooking(null);
                                Trl_spCostTour_Cancer(1);
                              }

                              setServiceSale({ ...e, totalDay: diff + 1 });
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
                  <div className="center-item mb-2 ">
                    <h3
                      class=" font-weight-bold text-dark fs-18 d-flex justify-content-center align-items-center"
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                    >
                      {editName ? (
                        <input
                          type="text"
                          value={CostTourName}
                          onChange={(e) => setCostTourName(e.target.value)}
                          className="form-control2 "
                          style={{ minWidth: "300px" }}
                        />
                      ) : (
                        CostTourName
                      )}{" "}
                      {hover && !editName && (
                        <i
                          className="fas fa-edit text-muted ml-2 cursor-pointer"
                          onClick={() => setEditName(true)}
                        />
                      )}
                      {editName && (
                        <i
                          className="fas fa-check text-success ml-2 cursor-pointer"
                          onClick={() => setEditName(false)}
                        />
                      )}
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
                        <div className="col-3 font-weight-bold">Thời gian:</div>

                        <div className="col-9"> {serviceSale.totalDay}N </div>
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
                    <div className="col-6  m-auto">
                      <div className="row d-flex justify-content-around">
                        <div className="col-4">
                          <div class="form-group">
                            <span class="small font-weight-bold text-muted">
                              Loại tiền
                            </span>
                            <Select
                              className="select-custom"
                              value={TypeOfMoney}
                              onChange={(e) => {
                                setTypeOfMoney(e);
                              }}
                              options={TypeOfMoneyList}
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <div class="form-group">
                            <span class="small font-weight-bold text-muted">
                              Tỉ giá
                            </span>
                            <div class=" input-group">
                              <input
                                type="text"
                                class="form-control2"
                                value={money.ExChangeRate}
                                onChange={(e) =>
                                  setMoney({
                                    ...money,
                                    ExChangeRate: FormatMoneyFloat(
                                      e.target.value,
                                      1
                                    ),
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-4">
                          <div class="form-group">
                            <span class="small font-weight-bold text-muted">
                              Giá bán
                            </span>
                            <div class=" input-group">
                              <input
                                type="text"
                                class="form-control2"
                                value={money.Price}
                                onChange={(e) =>
                                  setMoney({
                                    ...money,
                                    Price: FormatMoneyFloat(e.target.value, 1),
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 p-0">
                      <div className="table-responsive">
                        <table class="table table-bordered table-request-tour">
                          <tbody className=" text-dark">
                            <tr className="title-group-table">
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th
                                style={{
                                  width: 100,
                                  backgroundColor: "#fee2e2",
                                }}
                                className="align-middle"
                                colSpan={2}
                              >
                                10 Pax: {FormatMoney(money?.TotalPrice10 || 0)}
                              </th>

                              <th
                                style={{
                                  width: 100,
                                  backgroundColor: "#ffedd5",
                                }}
                                className="align-middle"
                                colSpan={2}
                              >
                                15 Pax: {FormatMoney(money.TotalPrice15 || 0)}
                              </th>

                              <th
                                style={{
                                  width: 100,
                                  backgroundColor: "#dcfce7",
                                }}
                                className="align-middle"
                                colSpan={2}
                              >
                                20 Pax: {FormatMoney(money.TotalPrice20 || 0)}
                              </th>

                              <th
                                style={{
                                  width: 100,
                                  backgroundColor: "#cffafe",
                                }}
                                className="align-middle"
                                colSpan={2}
                              >
                                25 Pax: {FormatMoney(money.TotalPrice25 || 0)}
                              </th>

                              <th
                                style={{
                                  width: 100,
                                  backgroundColor: "#e0e7ff",
                                }}
                                className="align-middle"
                                colSpan={2}
                              >
                                30 Pax: {FormatMoney(money.TotalPrice30 || 0)}
                              </th>

                              <td></td>
                              <td></td>
                            </tr>
                            <tr className="title-guider">
                              <th
                                style={{ minWidth: 180 }}
                                className="align-middle"
                              >
                                Dịch vụ
                              </th>

                              <th
                                style={{ minWidth: 200 }}
                                className="align-middle"
                              >
                                Chi tiết
                              </th>
                              <th
                                style={{ width: 110 }}
                                className="align-middle"
                              >
                                Giá thành
                              </th>
                              <th
                                style={{ width: 110 }}
                                className="align-middle"
                              >
                                BQ 1 Pax
                              </th>
                              <th
                                style={{
                                  width: 100,
                                }}
                                className="align-middle"
                              >
                                Số lượng
                              </th>

                              <th
                                style={{ width: 100 }}
                                className="align-middle"
                              >
                                Thành tiền
                              </th>
                              <th
                                style={{
                                  width: 100,
                                }}
                                className="align-middle"
                              >
                                Số lượng
                              </th>

                              <th
                                style={{ width: 100 }}
                                className="align-middle"
                              >
                                Thành tiền
                              </th>
                              <th
                                style={{
                                  width: 100,
                                }}
                                className="align-middle"
                              >
                                Số lượng
                              </th>

                              <th
                                style={{ width: 100 }}
                                className="align-middle"
                              >
                                Thành tiền
                              </th>
                              <th
                                style={{
                                  width: 100,
                                }}
                                className="align-middle"
                              >
                                Số lượng
                              </th>

                              <th
                                style={{ width: 100 }}
                                className="align-middle"
                              >
                                Thành tiền
                              </th>
                              <th
                                style={{
                                  width: 100,
                                }}
                                className="align-middle"
                              >
                                Số lượng
                              </th>

                              <th
                                style={{ width: 100 }}
                                className="align-middle"
                              >
                                Thành tiền
                              </th>

                              <th
                                style={{ minWidth: 300 }}
                                className="align-middle"
                              >
                                Ghi chú
                              </th>
                              <th
                                style={{ minWidth: 40 }}
                                className="align-middle"
                              ></th>
                            </tr>

                            {PlanTicketService}
                            {LandTourService}
                            {HotelService}
                            {RestaurantService}
                            {TourismService}
                            {VisaService}
                            {TourLeaderService}
                            {SecurityService}
                            {TipService}
                            {WaterService}
                            {GiftService}
                            {AnotherService}
                            <tr>
                              <th
                                colSpan={3}
                                className=" align-middle text-left"
                              >
                                Tổng cộng chi phí
                              </th>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.TotalCostBQ}
                                    updateMyData={updateMyData}
                                    property="TotalCostBQ"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td style={{ backgroundColor: "#fee2e2" }}></td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fee2e2" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.TotalCost10}
                                    updateMyData={updateMyData}
                                    property="TotalCost10"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td style={{ backgroundColor: "#ffedd5" }}></td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#ffedd5" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.TotalCost15}
                                    updateMyData={updateMyData}
                                    property="TotalCost15"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td style={{ backgroundColor: "#dcfce7" }}></td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#dcfce7" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.TotalCost20}
                                    updateMyData={updateMyData}
                                    property="TotalCost20"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td style={{ backgroundColor: "#cffafe" }}></td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#cffafe" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.TotalCost25}
                                    updateMyData={updateMyData}
                                    property="TotalCost25"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td style={{ backgroundColor: "#e0e7ff" }}></td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#e0e7ff" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.TotalCost30}
                                    updateMyData={updateMyData}
                                    property="TotalCost30"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <th
                                colSpan={3}
                                className=" align-middle text-left"
                              >
                                Giá NET 1 pax {TypeOfMoney.label}
                              </th>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.NET1paxUSDBQ}
                                    updateMyData={updateMyData}
                                    property="NET1paxUSDBQ"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td> </td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.NET1paxUSD10}
                                    updateMyData={updateMyData}
                                    property="NET1paxUSD10"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td> </td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.NET1paxUSD15}
                                    updateMyData={updateMyData}
                                    property="NET1paxUSD"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td> </td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.NET1paxUSD20}
                                    updateMyData={updateMyData}
                                    property="NET1paxUSD"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td> </td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.NET1paxUSD25}
                                    updateMyData={updateMyData}
                                    property="NET1paxUSD"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td> </td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.NET1paxUSD30}
                                    updateMyData={updateMyData}
                                    property="NET1paxUSD"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <th
                                colSpan={3}
                                className=" align-middle text-left"
                              >
                                Giá NET 1 pax VND
                              </th>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.NET1paxVNDBQ}
                                    updateMyData={updateMyData}
                                    property="NET1paxVNDBQ"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td> </td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.NET1paxVND10}
                                    updateMyData={updateMyData}
                                    property="NET1paxVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td> </td>

                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.NET1paxVND15}
                                    updateMyData={updateMyData}
                                    property="NET1paxVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td> </td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.NET1paxVND20}
                                    updateMyData={updateMyData}
                                    property="NET1paxVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td> </td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.NET1paxVND25}
                                    updateMyData={updateMyData}
                                    property="NET1paxVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td> </td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.NET1paxVND30}
                                    updateMyData={updateMyData}
                                    property="NET1paxVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <th
                                colSpan={3}
                                className=" align-middle text-left"
                              >
                                Lãi 1 pax {TypeOfMoney.label}
                              </th>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Interest1paxUSDBQ}
                                    updateMyData={updateMyData}
                                    property="Interest1paxUSDBQ"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Interest1paxUSD10}
                                    updateMyData={updateMyData}
                                    property="Interest1paxUSD"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Interest1paxUSD15}
                                    updateMyData={updateMyData}
                                    property="Interest1paxUSD"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Interest1paxUSD20}
                                    updateMyData={updateMyData}
                                    property="Interest1paxUSD"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Interest1paxUSD25}
                                    updateMyData={updateMyData}
                                    property="Interest1paxUSD"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Interest1paxUSD30}
                                    updateMyData={updateMyData}
                                    property="Interest1paxUSD"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <th
                                colSpan={3}
                                className=" align-middle text-left"
                              >
                                Lãi 1 pax VND
                              </th>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Interest1paxVNDBQ}
                                    updateMyData={updateMyData}
                                    property="Interest1paxVNDBQ"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Interest1paxVND10}
                                    updateMyData={updateMyData}
                                    property="Interest1paxVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Interest1paxVND15}
                                    updateMyData={updateMyData}
                                    property="Interest1paxVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Interest1paxVND20}
                                    updateMyData={updateMyData}
                                    property="Interest1paxVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Interest1paxVND25}
                                    updateMyData={updateMyData}
                                    property="Interest1paxVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Interest1paxVND30}
                                    updateMyData={updateMyData}
                                    property="Interest1paxVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <th
                                colSpan={3}
                                className=" align-middle text-left"
                              >
                                Phần trăm
                              </th>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.PercentBQ}
                                    updateMyData={updateMyData}
                                    property="PercentBQ"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Percent10}
                                    updateMyData={updateMyData}
                                    property="Percent"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Percent15}
                                    updateMyData={updateMyData}
                                    property="Percent"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Percent20}
                                    updateMyData={updateMyData}
                                    property="Percent"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Percent25}
                                    updateMyData={updateMyData}
                                    property="Percent"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td
                                className="text-center align-middle"
                                style={{ backgroundColor: "#fef08a" }}
                              >
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.Percent30}
                                    updateMyData={updateMyData}
                                    property="Percent"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <th
                                colSpan={3}
                                className=" align-middle text-left"
                              >
                                Lãi gộp lý thuyết {TypeOfMoney.label}
                              </th>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.InterestUSDBQ}
                                    updateMyData={updateMyData}
                                    property="InterestUSDBQ"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.InterestUSD10}
                                    updateMyData={updateMyData}
                                    property="InterestUSD"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.InterestUSD15}
                                    updateMyData={updateMyData}
                                    property="InterestUSD"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.InterestUSD20}
                                    updateMyData={updateMyData}
                                    property="InterestUSD"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.InterestUSD25}
                                    updateMyData={updateMyData}
                                    property="InterestUSD"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.InterestUSD30}
                                    updateMyData={updateMyData}
                                    property="InterestUSD"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <th
                                colSpan={3}
                                className=" align-middle text-left"
                              >
                                Lãi gộp lý thuyết VND
                              </th>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.InterestVNDBQ}
                                    updateMyData={updateMyData}
                                    property="InterestVNDBQ"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.InterestVND10}
                                    updateMyData={updateMyData}
                                    property="InterestVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.InterestVND15}
                                    updateMyData={updateMyData}
                                    property="InterestVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.InterestVND20}
                                    updateMyData={updateMyData}
                                    property="InterestVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.InterestVND25}
                                    updateMyData={updateMyData}
                                    property="InterestVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <EditableCellNumber
                                    ivalue={price.InterestVND30}
                                    updateMyData={updateMyData}
                                    property="InterestVND"
                                    type={100}
                                    edit={false}
                                  />
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div class="col-12">
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
                            onChange={(e) => handleChangeFileAndImage(e, 0)}
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
                                      FileUpload.filter((_, i) => i !== ix)
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
                                            FileShow.filter((_, i) => i !== ix)
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
                        onClick={Trl_spCostTour_List}
                      >
                        <i className="fa fa-search mr-2 " />
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body ">
                  <div className="row">
                    <DataTable data={CostList} columns={columns} />
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
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${docs}`}
              title="preview file"
            ></iframe>
          ) : (
            <iframe
              className={"docs"}
              width="100%"
              height="800"
              src={`https://drive.google.com/viewerng/viewer?url=${docs}&embedded=true&hl=vi`}
              title="preview file"
            ></iframe>
          )}{" "}
        </Modal.Body>
      </Modal>
    </>
  );
};

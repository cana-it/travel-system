import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  FormatDateJson,
  ExportExcel,
  ConfirmAlert,
} from "../../../../Utils";
import {
  DataTable,
  SelectCity,
  SelectContinent,
  SelectCountry,
  SelectLandData,
  SelectOperatingData,
  SelectService,
  SelectServiceSale,
  SelectTourGuider,
  TableShowDataBooking,
  TooltipCustom,
} from "../../../../Common";
import { IMAGES_DOMAIN } from "../../../../Services";
import "react-confirm-alert/src/react-confirm-alert.css";
import Modal from "react-bootstrap/Modal";
import moment from "moment";


export const TourRequest = () => {
  const dispatch = useDispatch();
  const Creater = +localStorage.getItem("CreateBy");

  const [serviceSale, setServiceSale] = useState(0);
  const [flightList, setFlightList] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [landTour, setLandTour] = useState(0);
  const [booking, setBooking] = useState(null);
  const [listTourRequest, setListTourRequest] = useState([]);
  const [tourRequestId, setTourRequestId] = useState(0);
  const [isEdit, setIsEdit] = useState(true);
  const [isClone, setIsClone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sampleDay, setSampleDay] = useState({
    day: 1,
    journey: "",
    vContinentId: 0,
    vCountryId: 0,
    vCityId: 0,
    vehicleId: {},
    vPrice: 0,
    vNote: "",
    hContinetId: 0,
    hCountryId: 0,
    hCityId: 0,
    hotelId: {},
    hPrice: 0,
    hNote: "",
    bContinetId: 0,
    bCountryId: 0,
    bCityId: 0,
    bRestaurantId: {},
    bPrice: 0,
    bNote: "",
    lContinentId: 0,
    lCountryId: 0,
    lCityId: 0,
    lRestaurantId: {},
    lPrice: 0,
    lNote: "",
    dContinentId: 0,
    dCountryId: 0,
    dCityId: 0,
    dRestaurantId: {},
    dPrice: 0,
    dNote: "",
    tickets: "",
    notes: "",
    sContinentId: 0,
    sCountryId: 0,
    sCityId: 0,
    SightseeingId: {},
    sNote: "",
  });

  const [dayData, setDayData] = useState([sampleDay]);

  useEffect(() => {
    Trl_spTourRequest_List();
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

  const Trl_spTourRequest_Cancer = () => {
    setDayData([sampleDay]);
    setTourRequestId(0);
    setQuantity(0);
    setLandTour(0);
    setServiceSale(0);
    setFlightList([]);
    setBooking(null);
    setIsEdit(true);
    setIsClone(false);
  };

  const Trl_spTourRequest_Save = async () => {
    if (booking === null) {
      Alertwarning("Vui lòng chọn Tour");
      return;
    }

    try {
      const pr = {
        TourRequestId: +tourRequestId,
        BookingId: +serviceSale.BookingId || 0,
        LandId: +landTour || 0,
        Quantity: +quantity || 0,
        Creater: +Creater,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTourRequest_Save",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        await Trl_spTourRequestDetail_Save(res.TourRequestId);
      }
    } catch (error) {
      ;
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const Trl_spTourRequestDetail_Save = async (TourRequestId) => {
    try {
      const pr = dayData.map((item, index) => {
        return {
          TourRequestDetailId: item.TourRequestDetailId || 0,
          TourRequestId: TourRequestId,
          Day: index + 1,
          Journey: item.journey,
          VehicleId: item.vehicleId.VehicleId,
          vContinentId: item.vContinentId,
          vCountryId: item.vCountryId,
          vCityId: item.vCityId,
          vPrice: item.vehicleId.Price,
          vNote: item.vehicleId.vNote,
          vMenu: item.vehicleId.Menu,
          vStatus: item.vehicleId?.vStatus || null,
          HotelId: item.hotelId.HotelId,
          hContinentId: item.hContinentId,
          hCountryId: item.hCountryId,
          hCityId: item.hCityId,
          hPrice: item.hotelId.Price,
          hNote: item.hotelId.hNote,
          hMenu: item.hotelId.Menu,
          hStatus: item.hotelId?.hStatus || null,
          bRestaurantId: item.bRestaurantId.RestaurantId,
          bContinentId: item.bContinentId,
          bCountryId: item.bCountryId,
          bCityId: item.bCityId,
          bPrice: item.bRestaurantId.Price,
          bNote: item.bRestaurantId.bNote,
          bMenu: item.bRestaurantId.Menu,
          bStatus: item.bRestaurantId?.bStatus || null,
          lRestaurantId: item.lRestaurantId.RestaurantId,
          lContinentId: item.lContinentId,
          lCountryId: item.lCountryId,
          lCityId: item.lCityId,
          lPrice: item.lRestaurantId.Price,
          lNote: item.lRestaurantId.lNote,
          lMenu: item.lRestaurantId.Menu,
          lStatus: item.lRestaurantId?.lStatus || null,
          dRestaurantId: item.dRestaurantId.RestaurantId,
          dContinentId: item.dContinentId,
          dCountryId: item.dCountryId,
          dCityId: item.dCityId,
          dPrice: item.dRestaurantId.Price,
          dNote: item.dRestaurantId.dNote,
          dMenu: item.dRestaurantId.Menu,
          dStatus: item.dRestaurantId?.dStatus || null,
          SightseeingId: item.SightseeingId.SightseeingId,
          sContinentId: item.sContinentId,
          sCountryId: item.sCountryId,
          sCityId: item.sCityId,
          sNote: item.SightseeingId.sNote,
          sStatus: item.SightseeingId?.sStatus || null,
          Tickets: item.tickets,
          Notes: item.notes,
          Creater: +Creater,
        };
      });
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTourRequestDetail_Save",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Lưu thành công");
        await Trl_spTourRequest_List();
        setIsClone(false);
      }
    } catch (error) {
      ;
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const Trl_spTourRequest_List = async (TourRequestId) => {
    setIsEdit(true);
    try {
      const pr = {
        TourRequestId: 0,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTourRequest_List",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.length > 0) {
        let newRes = res.map((item) => {
          const start = moment(FormatDateJson(new Date(), 1));
          const end = moment(item.DateSaleFrom);
          const duration = moment.duration(end.diff(start));
          const days = duration.asDays();
          return {
            ...item,
            days: days,
          };
        });
        setListTourRequest(newRes);
        setIsClone(false);
        // Alertsuccess("Lưu thành công");
      } else {
        Alertwarning("Không có dữ liệu");
        setListTourRequest([]);
      }
    } catch (error) {
      ;
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const Trl_spTourRequest_Delete = async (id) => {
    setIsClone(false);
    try {
      const pr = {
        TourRequestId: id,
        Creater: +Creater,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTourRequest_Delete",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Lưu thành công");
        await Trl_spTourRequest_List();
      } else {
        Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
        setListTourRequest([]);
      }
    } catch (error) {
      ;
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const Trl_spTourRequest_Edit = (dataEdit, type = 0) => {
    type === 1 ? setIsEdit(false) : setIsEdit(true);
    setIsClone(false);
    let service = {
      value: dataEdit.ServiceSaleId,
      BookingId: dataEdit.BookingId,
      ServiceSaleCode: dataEdit.ServiceSaleCode,
      ServiceSaleName: dataEdit.ServiceSaleName,
      DateSaleFrom: dataEdit.DateSaleFrom,
      DateSaleTo: dataEdit.DateSaleTo,
    };
    setTourRequestId(dataEdit.TourRequestId);
    setServiceSale(service);
    Trl_spBooking_CustomerPlane_View(service);
    setQuantity(dataEdit.Quantity);
    setLandTour(dataEdit.LandId);
    dataEdit?.Detail.length > 0 &&
      setDayData(
        dataEdit.Detail.map((item) => {
          return {
            ...item,
            TourRequestDetailId: item.TourRequestDetailId,
            day: item.Day,
            journey: item.Journey,
            vehicleId: {
              VehicleId: item.VehicleId,
              VehicleName: item.VehicleName,
              Price: item.vPrice,
              vNote: item.vNote,
              Menu: item.vMenu,
              value: item.VehicleId,
              VehicleAddress: item.VehicleAddress,
              VehicleStar: item.VehicleStar,
              Suburban: item.vSuburban,
              Downtown: item.vDowntown,
              vStatus: item?.vStatus || null,
            },
            vContinentId: item.vContinentId,
            vCountryId: item.vCountryId,
            vCityId: item.vCityId,
            hotelId: {
              HotelId: item.HotelId,
              Price: item.hPrice,
              hNote: item.hNote,
              Menu: item.hMenu,
              value: item.HotelId,
              HotelAddress: item.HotelAddress,
              HotelStar: item.HotelStar,
              Suburban: item.hSuburban,
              Downtown: item.hDowntown,
              hStatus: item?.hStatus || null,
            },
            hContinentId: item.hContinentId,
            hCountryId: item.hCountryId,
            hCityId: item.hCityId,
            bRestaurantId: {
              RestaurantId: item.BreakfastId,
              RestaurantName: item.bRestaurantName,
              Price: item.bPrice,
              bNote: item.bNote,
              Menu: item.bMenu,
              value: item.BreakfastId,
              RestaurantAddress: item.bRestaurantAddress,
              RestaurantStar: item.bRestaurantStar,
              Suburban: item.bSuburban,
              Downtown: item.bDowntown,
              bStatus: item?.bStatus || null,
            },
            bContinentId: item.bContinentId,
            bCountryId: item.bCountryId,
            bCityId: item.bCityId,
            lRestaurantId: {
              RestaurantId: item.LunchId,
              Price: item.lPrice,
              lNote: item.lNote,
              Menu: item.lMenu,
              value: item.LunchId,
              RestaurantAddress: item.lRestaurantAddress,
              RestaurantStar: item.lRestaurantStar,
              Suburban: item.lSuburban,
              Downtown: item.lDowntown,
              lStatus: item?.lStatus || null,
            },
            lContinentId: item.lContinentId,
            lCountryId: item.lCountryId,
            lCityId: item.lCityId,
            dRestaurantId: {
              RestaurantId: item.DinnerId,
              Price: item.dPrice,
              dNote: item.dNote,
              Menu: item.dMenu,
              value: item.DinnerId,
              RestaurantAddress: item.dRestaurantAddress,
              RestaurantStar: item.dRestaurantStar,
              Suburban: item.dSuburban,
              Downtown: item.dDowntown,
              dStatus: item?.dStatus || null,
            },
            dContinentId: item.dContinentId,
            dCountryId: item.dCountryId,
            dCityId: item.dCityId,
            SightseeingId: {
              SightseeingId: item.SightseeingId,
              SightseeingName: item.SightseeingName,
              sNote: item.sNote,
              value: item.SightseeingId,
              SightseeingAddress: item.SightseeingAddress,
              GIT: item.GIT,
              FIT: item.FIT,
              Company: item.Company,
              Partner: item.Partner,
              Other: item.Other,
              sStatus: item?.sStatus || null,
            },
            sContinentId: item.sContinentId,
            sCountryId: item.sCountryId,
            sCityId: item.sCityId,
            tickets: item.Tickets,
            notes: item.Notes,
          };
        })
      );
    document.getElementById("tab_1").click();
  };

  const Trl_spTourRequest_Clone = (dataEdit) => {
    setIsEdit(true);
    setIsClone(true);
    let service = {
      value: dataEdit.ServiceSaleId,
      BookingId: dataEdit.BookingId,
      ServiceSaleCode: dataEdit.ServiceSaleCode,
      ServiceSaleName: dataEdit.ServiceSaleName,
      DateSaleFrom: dataEdit.DateSaleFrom,
      DateSaleTo: dataEdit.DateSaleTo,
    };
    setTourRequestId(0);
    setServiceSale(service);
    setBooking(service);
    Trl_spBooking_CustomerPlane_View(service);
    setQuantity(dataEdit.Quantity);
    setLandTour(dataEdit.LandId);
    dataEdit?.Detail.length > 0 &&
      setDayData(
        dataEdit.Detail.map((item) => {
          return {
            ...item,
            TourRequestDetailId: 0,
            day: item.Day,
            journey: item.Journey,
            vehicleId: {
              VehicleId: item.VehicleId,
              VehicleName: item.VehicleName,
              Price: item.vPrice,
              vNote: item.vNote,
              Menu: item.vMenu,
              value: item.VehicleId,
              VehicleAddress: item.VehicleAddress,
              VehicleStar: item.VehicleStar,
              Suburban: item.vSuburban,
              Downtown: item.vDowntown,
              vStatus: item?.vStatus || null,
            },
            vContinentId: item.vContinentId,
            vCountryId: item.vCountryId,
            vCityId: item.vCityId,
            hotelId: {
              HotelId: item.HotelId,
              Price: item.hPrice,
              hNote: item.hNote,
              Menu: item.hMenu,
              value: item.HotelId,
              HotelAddress: item.HotelAddress,
              HotelStar: item.HotelStar,
              Suburban: item.hSuburban,
              Downtown: item.hDowntown,
              hStatus: item?.hStatus || null,
            },
            hContinentId: item.hContinentId,
            hCountryId: item.hCountryId,
            hCityId: item.hCityId,
            bRestaurantId: {
              RestaurantId: item.BreakfastId,
              RestaurantName: item.bRestaurantName,
              Price: item.bPrice,
              bNote: item.bNote,
              Menu: item.bMenu,
              value: item.BreakfastId,
              RestaurantAddress: item.bRestaurantAddress,
              RestaurantStar: item.bRestaurantStar,
              Suburban: item.bSuburban,
              Downtown: item.bDowntown,
              bStatus: item?.bStatus || null,
            },
            bContinentId: item.bContinentId,
            bCountryId: item.bCountryId,
            bCityId: item.bCityId,
            lRestaurantId: {
              RestaurantId: item.LunchId,
              Price: item.lPrice,
              lNote: item.lNote,
              Menu: item.lMenu,
              value: item.LunchId,
              RestaurantAddress: item.lRestaurantAddress,
              RestaurantStar: item.lRestaurantStar,
              Suburban: item.lSuburban,
              Downtown: item.lDowntown,
              lStatus: item?.lStatus || null,
            },
            lContinentId: item.lContinentId,
            lCountryId: item.lCountryId,
            lCityId: item.lCityId,
            dRestaurantId: {
              RestaurantId: item.DinnerId,
              Price: item.dPrice,
              dNote: item.dNote,
              Menu: item.dMenu,
              value: item.DinnerId,
              RestaurantAddress: item.dRestaurantAddress,
              RestaurantStar: item.dRestaurantStar,
              Suburban: item.dSuburban,
              Downtown: item.dDowntown,
              dStatus: item?.dStatus || null,
            },
            dContinentId: item.dContinentId,
            dCountryId: item.dCountryId,
            dCityId: item.dCityId,
            SightseeingId: {
              SightseeingId: item.SightseeingId,
              SightseeingName: item.SightseeingName,
              sNote: item.sNote,
              value: item.SightseeingId,
              SightseeingAddress: item.SightseeingAddress,
              GIT: item.GIT,
              FIT: item.FIT,
              Company: item.Company,
              Partner: item.Partner,
              Other: item.Other,
              sStatus: item?.sStatus || null,
            },
            sContinentId: item.sContinentId,
            sCountryId: item.sCountryId,
            sCityId: item.sCityId,
            tickets: item.Tickets,
            notes: item.Notes,
          };
        })
      );
    document.getElementById("tab_1").click();
  };

  const Trl_spTourRequest_Status = async (id, status) => {
    try {
      const pr = {
        TourRequestId: id,
        Status: status,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTourRequest_Status",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
      } else {
        Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
        setListTourRequest([]);
      }
    } catch (error) {
      ;
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const handleChangeStatus = async (e) => {
    if (isLoading) {
      return;
    }

    let status = e?.Status;
    let cStatus = "default";
    if (status === "success") {
      cStatus = "warning";
    } else if (status === "warning") {
      cStatus = "danger";
    } else if (status === "danger") {
      cStatus = "default";
    } else if (status === "default" || !status) {
      cStatus = "success";
    }
    await setIsLoading(true);
    await Trl_spTourRequest_Status(e.TourRequestId, cStatus);
    await setIsLoading(false);
    setListTourRequest((old) =>
      old.map((row, i) => {
        if (row.TourRequestId === e.TourRequestId) {
          return {
            ...row,
            Status: cStatus,
          };
        }
        return row;
      })
    );
  };

  const columns = [
    {
      Header: "Options",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-xs btn-success"
            onClick={() => Trl_spTourRequest_Edit(row._original, 1)}
          >
            {" "}
            <i class="fas fa-tasks"></i> Tiến trình
          </button>{" "}
          <button
            className="btn btn-xs btn-info"
            onClick={() => Trl_spTourRequest_Clone(row._original)}
          >
            {" "}
            <i class="fa fa-clone"></i> Nhân bản
          </button>{" "}
          <button
            className="btn btn-xs btn-warning"
            onClick={() => Trl_spTourRequest_Edit(row._original)}
          >
            {" "}
            <i class="fa fa-eye"></i> Sửa
          </button>{" "}
          <button
            className="btn btn-xs btn-danger"
            onClick={() =>
              ConfirmAlert("Xác nhận", "Bạn có chắc chắn muốn xóa không?", () =>
                Trl_spTourRequest_Delete(row._original.TourRequestId)
              )
            }
          >
            {" "}
            <i class="fa fa-trash"></i> Xóa
          </button>{" "}
          <button
            className="btn btn-xs btn-success"
            onClick={() => Trl_spTourRequest_Excel(row._original)}
          >
            {" "}
            <i class="fa fa-download"></i> Excel
          </button>{" "}
        </div>
      ),
      minWidth: 300,
      fixed: "left",
    },
    {
      Header: "Mã Tour",
      accessor: "ServiceSaleCode",
      Cell: ({ row }) => {
        let check = "default";
        let days = row._original.days;
        if (days <= 72 && days >= 47) {
          check = "success";
        } else if (days < 47 && days >= 35) {
          check = "warning";
        } else if (days > 72) {
          check = "default";
        } else if (days < 35 && days > 0) {
          check = "danger";
        } else {
          check = "default";
        }

        return (
          <div style={{ textAlign: "center", position: "relative" }}>
            <TooltipCustom content={"Click để đổi màu"}>
              <span
                className={`text-${row._original?.Status} cursor-pointer`}
                onClick={() => handleChangeStatus(row._original)}
              >
                {row._original.ServiceSaleCode}
              </span>
            </TooltipCustom>
            <span
              className="ml-2"
              style={{ position: "absolute", right: 0, top: "-8px" }}
            >
              {check !== "default" && (
                <span class={`bg-${check} fs-12 p-1 rounded-circle`}>
                  {days}
                </span>
              )}
            </span>
          </div>
        );
      },

      minWidth: 270,
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

  const updateMyData = (index, value, property, type) => {
    if (type === 0) {
      // setSkipPageReset(true);
      setDayData((old) =>
        old.map((row, i) => {
          if (i === index) {
            return {
              ...old[index],
              [property]: value,
            };
          }
          return row;
        })
      );
    } else if (type === 1) {
      setDayData((old) =>
        old.map((row, i) => {
          if (i === index) {
            let vehicleId = row.vehicleId;
            vehicleId[property] = value;
            return {
              ...row,
              vehicleId,
            };
          }
          return row;
        })
      );
    } else if (type === 2) {
      setDayData((old) =>
        old.map((row, i) => {
          if (i === index) {
            let hotelId = row.hotelId;
            hotelId[property] = value;
            return {
              ...row,
              hotelId,
            };
          }
          return row;
        })
      );
    } else if (type === 3) {
      setDayData((old) =>
        old.map((row, i) => {
          if (i === index) {
            let bRestaurantId = row.bRestaurantId;
            bRestaurantId[property] = value;
            return {
              ...row,
              bRestaurantId,
            };
          }
          return row;
        })
      );
    } else if (type === 4) {
      setDayData((old) =>
        old.map((row, i) => {
          if (i === index) {
            let lRestaurantId = row.lRestaurantId;
            lRestaurantId[property] = value;
            return {
              ...row,
              lRestaurantId,
            };
          }
          return row;
        })
      );
    } else if (type === 5) {
      setDayData((old) =>
        old.map((row, i) => {
          if (i === index) {
            let dRestaurantId = row.dRestaurantId;
            dRestaurantId[property] = value;
            return {
              ...row,
              dRestaurantId,
            };
          }
          return row;
        })
      );
    } else if (type === 6) {
      setDayData((old) =>
        old.map((row, i) => {
          if (i === index) {
            let SightseeingId = row.SightseeingId;
            SightseeingId[property] = value;
            return {
              ...row,
              SightseeingId,
            };
          }
          return row;
        })
      );
    }
  };

  const HandleStatusProgress = ({ status, index, property, type }) => {
    if (status === 1) {
      return (
        <div className="m-auto">
          <TooltipCustom content="Click để đổi status">
            <button
              className="btn"
              onClick={() => updateMyData(index, 2, property, type)}
            >
              <i class="fas fa-check-circle text-success fs-22"></i>
            </button>
          </TooltipCustom>
        </div>
      );
    } else if (status === 2) {
      return (
        <div className="m-auto">
          <TooltipCustom content="Click để đổi status">
            <button
              className="btn"
              onClick={() => updateMyData(index, 3, property, type)}
            >
              <i class="fas fa-sync-alt text-warning fs-22"></i>
            </button>
          </TooltipCustom>
        </div>
      );
    } else if (status === 3) {
      return (
        <div className="m-auto">
          <TooltipCustom content="Click để đổi status">
            <button
              className="btn"
              onClick={() => updateMyData(index, 1, property, type)}
            >
              <i class="fas fa-times-circle text-danger fs-22"></i>
            </button>
          </TooltipCustom>
        </div>
      );
    } else {
      return (
        <div className="m-auto">
          <TooltipCustom content="Click để đổi status">
            <button
              className="btn"
              onClick={() => updateMyData(index, 1, property, type)}
            >
              <i class="fas fa-mouse text-light fs-22 text-light-hover"></i>
            </button>
          </TooltipCustom>
        </div>
      );
    }
  };

  const CardDayDetail = useMemo(() => {
    return (
      <>
        {dayData.map((day, index) => {
          return (
            <div className="card" key={index + "card"}>
              <div className="card-header pl-1 d-flex align-items-center ">
                <span className="font-weight-bold">Ngày {index + 1}</span>

                <div className="ml-auto">
                  {dayData.length > 1 && isEdit && (
                    <button
                      className="btn btn-xs btn-danger"
                      onClick={() => {
                        let newDayData = [...dayData];
                        newDayData.splice(index, 1);
                        setDayData(newDayData);
                      }}
                    >
                      <i class="fa fa-trash"></i> Xóa
                    </button>
                  )}
                </div>
              </div>
              <div className="card-body p-0 ">
                <div className="table-responsive">
                  <table class="table table-bordered table-request-tour">
                    <tbody className=" text-dark">
                      <tr>
                        {!isEdit && <th></th>}
                        <th className="">Hành trình</th>
                        <td colspan="12" className="">
                          {" "}
                          <div class="input-group my-1 ">
                            <EditableCell
                              ivalue={day.journey}
                              index={index}
                              updateMyData={updateMyData}
                              property="journey"
                              type={0}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="title-guider">
                        {!isEdit && <th style={{ minWidth: 100 }}>Progress</th>}

                        <th style={{ minWidth: 160 }}>Dịch vụ</th>

                        <th style={{ minWidth: 90 }}>#</th>
                        <th style={{ minWidth: 100 }}>Châu lục</th>
                        <th
                          style={{ minWidth: 120, width: 130, maxWidth: 250 }}
                        >
                          Nước
                        </th>
                        <th style={{ minWidth: 150 }}>Thành phố</th>
                        <th style={{ minWidth: 180 }}>Tên</th>
                        <th style={{ minWidth: 200 }}>Địa chỉ</th>
                        <th style={{ minWidth: 110 }}>Trung tâm</th>
                        <th style={{ minWidth: 100 }}>Ngoại ô</th>
                        <th style={{ minWidth: 50 }}>Sao</th>
                        <th style={{ minWidth: 120, maxWidth: 200 }}>Giá</th>
                        <th
                          style={{ minWidth: 200, width: 230, maxWidth: 500 }}
                        >
                          Thực đơn
                        </th>
                        <th style={{ minWidth: 300 }}>Ghi chú</th>
                      </tr>
                      <tr>
                        {!isEdit && (
                          <th className="p-0 ">
                            <HandleStatusProgress
                              status={day.vehicleId?.vStatus}
                              index={index}
                              property="vStatus"
                              type={1}
                            />
                          </th>
                        )}
                        <th>Xe</th>
                        <td></td>
                        <td>
                          <div class="input-group">
                            <SelectContinent
                              onSelected={(e) =>
                                handleChangeSelect(e, index, "vContinentId")
                              }
                              className={"w-100 select-custom2 "}
                              LocationId={day.vContinentId || 0}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <div class="input-group">
                            <SelectCountry
                              onSelected={(e) =>
                                handleChangeSelect(e, index, "vCountryId")
                              }
                              className={"w-100 select-custom2 "}
                              LocationId={day.vCountryId || 0}
                              ContinentId={day.vContinentId}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <div class="input-group">
                            <SelectCity
                              className={"w-100 select-custom2 "}
                              onSelected={(e) => {
                                handleChangeSelect(e, index, "vCityId");
                              }}
                              CountryId={day.vCountryId}
                              LocationId={day.vCityId}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <SelectOperatingData
                            className={"w-100 select-custom2 "}
                            onSelected={(e) => {
                              handleChangeSelect(e, index, "vehicleId", 1);
                            }}
                            CityId={day.vCityId}
                            Type={0}
                            operatingId={day.vehicleId?.VehicleId}
                            isFront={true}
                          />
                        </td>
                        <td>
                          <div className="padding-td cursor-not-allowed">
                            {day.vehicleId?.VehicleAddress}
                          </div>
                        </td>
                        <td>
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.vehicleId?.Downtown ? "X" : ""}
                          </div>
                        </td>
                        <td>
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.vehicleId?.Suburban ? "X" : ""}
                          </div>
                        </td>
                        <td>
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.vehicleId?.VehicleStar}
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div class="input-group ">
                            <EditableCell
                              ivalue={day.vehicleId?.Price}
                              index={index}
                              updateMyData={updateMyData}
                              property="Price"
                              type={1}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div class="input-group ">
                            <EditableCell
                              ivalue={day.vehicleId?.Menu}
                              index={index}
                              updateMyData={updateMyData}
                              property="Menu"
                              type={1}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div class="input-group ">
                            <EditableCell
                              ivalue={day.vehicleId?.vNote}
                              index={index}
                              updateMyData={updateMyData}
                              property="vNote"
                              type={1}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        {!isEdit && (
                          <th className="p-0 ">
                            <HandleStatusProgress
                              status={day.hotelId?.hStatus}
                              index={index}
                              property="hStatus"
                              type={2}
                            />
                          </th>
                        )}
                        <th>Khách sạn</th>
                        <td></td>
                        <td>
                          <div class="input-group">
                            <SelectContinent
                              onSelected={(e) =>
                                handleChangeSelect(e, index, "hContinentId")
                              }
                              className={"w-100 select-custom2 "}
                              LocationId={day.hContinentId || 0}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <div class="input-group">
                            <SelectCountry
                              onSelected={(e) =>
                                handleChangeSelect(e, index, "hCountryId")
                              }
                              className={"w-100 select-custom2 "}
                              LocationId={day.hCountryId || 0}
                              ContinentId={day.hContinentId}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <div class="input-group">
                            <SelectCity
                              className={"w-100 select-custom2 "}
                              onSelected={(e) => {
                                handleChangeSelect(e, index, "hCityId");
                              }}
                              CountryId={day.hCountryId}
                              LocationId={day.hCityId}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <SelectOperatingData
                            className={"w-100 select-custom2 "}
                            onSelected={(e) => {
                              handleChangeSelect(e, index, "hotelId", 1);
                            }}
                            CityId={day.hCityId}
                            Type={1}
                            operatingId={day.hotelId?.HotelId}
                            isFront={true}
                          />
                        </td>
                        <td>
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.hotelId?.HotelAddress}
                          </div>
                        </td>
                        <td>
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.hotelId?.Downtown ? "X" : ""}
                          </div>
                        </td>
                        <td>
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.hotelId?.Suburban ? "X" : ""}
                          </div>
                        </td>
                        <td>
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.hotelId?.HotelStar}
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div class="input-group">
                            <EditableCell
                              ivalue={day.hotelId?.Price}
                              index={index}
                              updateMyData={updateMyData}
                              property="Price"
                              type={2}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div class="input-group ">
                            <EditableCell
                              ivalue={day.hotelId?.Menu}
                              index={index}
                              updateMyData={updateMyData}
                              property="Menu"
                              type={2}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                        <td>
                          <div class="input-group ">
                            <EditableCell
                              ivalue={day.hotelId?.hNote}
                              index={index}
                              updateMyData={updateMyData}
                              property="hNote"
                              type={2}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                      </tr>

                      <tr>
                        {!isEdit && (
                          <th className="p-0 ">
                            <HandleStatusProgress
                              status={day.bRestaurantId?.bStatus}
                              index={index}
                              property="bStatus"
                              type={3}
                            />
                          </th>
                        )}
                        <th rowspan="3">Nhà hàng</th>
                        <td>Ăn sáng</td>
                        <td>
                          <div class="input-group">
                            <SelectContinent
                              onSelected={(e) =>
                                handleChangeSelect(e, index, "bContinentId")
                              }
                              className={"w-100 select-custom2 "}
                              LocationId={day.bContinentId || 0}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <div class="input-group">
                            <SelectCountry
                              onSelected={(e) =>
                                handleChangeSelect(e, index, "bCountryId")
                              }
                              className={"w-100 select-custom2 "}
                              LocationId={day.bCountryId || 0}
                              ContinentId={day.bContinentId}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <div class="input-group">
                            <SelectCity
                              className={"w-100 select-custom2 "}
                              onSelected={(e) => {
                                handleChangeSelect(e, index, "bCityId");
                              }}
                              CountryId={day.bCountryId}
                              LocationId={day.bCityId}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <SelectOperatingData
                            className={"w-100 select-custom2 "}
                            onSelected={(e) => {
                              handleChangeSelect(e, index, "bRestaurantId", 1);
                            }}
                            CityId={day.bCityId}
                            Type={21}
                            operatingId={day.bRestaurantId?.RestaurantId}
                            isFront={true}
                          />
                        </td>
                        <td>
                          {" "}
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.bRestaurantId?.RestaurantAddress}
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.bRestaurantId?.Downtown ? "X" : ""}
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.bRestaurantId?.Suburban ? "X" : ""}
                          </div>
                        </td>{" "}
                        <td>
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.bRestaurantId?.RestaurantStar}
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div class="input-group">
                            <EditableCell
                              ivalue={day.bRestaurantId?.Price}
                              index={index}
                              updateMyData={updateMyData}
                              property="Price"
                              type={3}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div class="input-group ">
                            <EditableCell
                              ivalue={day.bRestaurantId?.Menu}
                              index={index}
                              updateMyData={updateMyData}
                              property="Menu"
                              type={3}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div class="input-group ">
                            <EditableCell
                              ivalue={day.bRestaurantId?.bNote}
                              index={index}
                              updateMyData={updateMyData}
                              property="bNote"
                              type={3}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        {!isEdit && (
                          <th className="p-0 ">
                            <HandleStatusProgress
                              status={day.lRestaurantId?.lStatus}
                              index={index}
                              property="lStatus"
                              type={4}
                              edit={isEdit}
                            />
                          </th>
                        )}
                        <td>Ăn trưa</td>

                        <td>
                          <div class="input-group">
                            <SelectContinent
                              onSelected={(e) =>
                                handleChangeSelect(e, index, "lContinentId")
                              }
                              className={"w-100 select-custom2 "}
                              LocationId={day.lContinentId || 0}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <div class="input-group">
                            <SelectCountry
                              onSelected={(e) =>
                                handleChangeSelect(e, index, "lCountryId")
                              }
                              className={"w-100 select-custom2 "}
                              LocationId={day.lCountryId || 0}
                              ContinentId={day.lContinentId}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <div class="input-group">
                            <SelectCity
                              className={"w-100 select-custom2 "}
                              onSelected={(e) => {
                                handleChangeSelect(e, index, "lCityId");
                              }}
                              CountryId={day.lCountryId}
                              LocationId={day.lCityId}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <SelectOperatingData
                            className={"w-100 select-custom2 "}
                            onSelected={(e) => {
                              handleChangeSelect(e, index, "lRestaurantId", 1);
                            }}
                            CityId={day.lCityId}
                            Type={22}
                            operatingId={day.lRestaurantId?.RestaurantId}
                            isFront={true}
                          />
                        </td>
                        <td>
                          {" "}
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.lRestaurantId?.RestaurantAddress}
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.lRestaurantId?.Downtown ? "X" : ""}
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.lRestaurantId?.Suburban ? "X" : ""}
                          </div>
                        </td>
                        <td>
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.lRestaurantId?.RestaurantStar}
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div class="input-group">
                            <EditableCell
                              ivalue={day.lRestaurantId?.Price}
                              index={index}
                              updateMyData={updateMyData}
                              property="Price"
                              type={4}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div class="input-group ">
                            <EditableCell
                              ivalue={day.lRestaurantId?.Menu}
                              index={index}
                              updateMyData={updateMyData}
                              property="Menu"
                              type={4}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div class="input-group ">
                            <EditableCell
                              ivalue={day.lRestaurantId?.lNote}
                              index={index}
                              updateMyData={updateMyData}
                              property="lNote"
                              type={4}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        {" "}
                        {!isEdit && (
                          <th className="p-0 ">
                            <HandleStatusProgress
                              status={day.dRestaurantId?.dStatus}
                              index={index}
                              property="dStatus"
                              type={5}
                            />
                          </th>
                        )}
                        <td>Ăn tối</td>
                        <td>
                          <div class="input-group">
                            <SelectContinent
                              onSelected={(e) =>
                                handleChangeSelect(e, index, "dContinentId")
                              }
                              className={"w-100 select-custom2 "}
                              LocationId={day.dContinentId || 0}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <div class="input-group">
                            <SelectCountry
                              onSelected={(e) =>
                                handleChangeSelect(e, index, "dCountryId")
                              }
                              className={"w-100 select-custom2 "}
                              LocationId={day.dCountryId || 0}
                              ContinentId={day.dContinentId}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <div class="input-group">
                            <SelectCity
                              className={"w-100 select-custom2 "}
                              onSelected={(e) => {
                                handleChangeSelect(e, index, "dCityId");
                              }}
                              CountryId={day.dCountryId}
                              LocationId={day.dCityId}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <SelectOperatingData
                            className={"w-100 select-custom2 "}
                            onSelected={(e) => {
                              handleChangeSelect(e, index, "dRestaurantId", 1);
                            }}
                            CityId={day.dCityId}
                            Type={23}
                            operatingId={day.dRestaurantId?.RestaurantId}
                            isFront={true}
                          />
                        </td>
                        <td>
                          {" "}
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.dRestaurantId?.RestaurantAddress}
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.dRestaurantId?.Downtown ? "X" : ""}
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.dRestaurantId?.Suburban ? "X" : ""}
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div className="padding-td cursor-not-allowed">
                            {dayData[index]?.dRestaurantId?.RestaurantStar}
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div class="input-group">
                            <EditableCell
                              ivalue={day.dRestaurantId?.Price}
                              index={index}
                              updateMyData={updateMyData}
                              property="Price"
                              type={5}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                        <td>
                          {" "}
                          <div class="input-group ">
                            <EditableCell
                              ivalue={day.dRestaurantId?.Menu}
                              index={index}
                              updateMyData={updateMyData}
                              property="Menu"
                              type={5}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                        <td>
                          <div class="input-group ">
                            <EditableCell
                              ivalue={day.dRestaurantId?.dNote}
                              index={index}
                              updateMyData={updateMyData}
                              property="dNote"
                              type={5}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                      </tr>

                      <tr>
                        {!isEdit && (
                          <th className="p-0 ">
                            <HandleStatusProgress
                              status={day.SightseeingId?.sStatus}
                              index={index}
                              property="sStatus"
                              type={6}
                            />
                          </th>
                        )}
                        <th>Vé tham quan</th>
                        <td></td>
                        <td>
                          <div class="input-group">
                            <SelectContinent
                              onSelected={(e) =>
                                handleChangeSelect(e, index, "sContinentId")
                              }
                              className={"w-100 select-custom2 "}
                              LocationId={day.sContinentId || 0}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <div class="input-group">
                            <SelectCountry
                              onSelected={(e) =>
                                handleChangeSelect(e, index, "sCountryId")
                              }
                              className={"w-100 select-custom2 "}
                              LocationId={day.sCountryId || 0}
                              ContinentId={day.sContinentId}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <div class="input-group">
                            <SelectCity
                              className={"w-100 select-custom2 "}
                              onSelected={(e) => {
                                handleChangeSelect(e, index, "sCityId");
                              }}
                              CountryId={day.sCountryId}
                              LocationId={day.sCityId}
                              isFront={true}
                            />
                          </div>
                        </td>
                        <td>
                          <SelectOperatingData
                            className={"w-100 select-custom2 "}
                            onSelected={(e) => {
                              handleChangeSelect(e, index, "SightseeingId", 1);
                            }}
                            CityId={day.sCityId}
                            Type={4}
                            operatingId={day.SightseeingId?.SightseeingId}
                            isFront={true}
                          />
                        </td>
                        <td>
                          <div className="padding-td cursor-not-allowed">
                            {day.SightseeingId?.SightseeingAddress}
                          </div>
                        </td>
                        <td colSpan={5}>
                          <div className="padding-td cursor-not-allowed">
                            {day?.SightseeingId?.FIT
                              ? "Vé FIT"
                              : day?.SightseeingId?.GIT
                              ? "Vé GIT"
                              : ""}
                            {" - "}
                            {day.SightseeingId?.Company
                              ? "Thanh toán: Công ty"
                              : day.SightseeingId?.Partner
                              ? "Thanh toán: Đối tác"
                              : day.SightseeingId?.Other
                              ? "Thanh toán: Khác"
                              : ""}
                          </div>
                        </td>
                        <td>
                          <div class="input-group ">
                            <EditableCell
                              ivalue={day.SightseeingId?.sNote}
                              index={index}
                              updateMyData={updateMyData}
                              property="sNote"
                              type={6}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        {!isEdit && <th></th>}
                        <th>Yêu cầu khác</th>
                        <td colSpan={12}>
                          <div class="input-group">
                            <EditableCell
                              ivalue={day.notes}
                              index={index}
                              updateMyData={updateMyData}
                              property="notes"
                              edit={isEdit}
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }, [dayData]);

  const handleChangeSelect = (e, index, value, type = 0) => {
    let newData = dayData.map((item, i) => {
      if (i === index) {
        return type === 0
          ? {
              ...item,
              [value]: e.value,
            }
          : {
              ...item,
              [value]: e,
            };
      }
      return item;
    });
    setDayData(newData);
  };

  const addNewDay = () => {
    let newDay = [...dayData, sampleDay];
    setDayData(newDay);
  };

  const Trl_spTourRequest_Excel = async (dataEx) => {
    try {
      ;
      const prP = {
        TourRequestId: dataEx.TourRequestId || 0,
        CreateName: +Creater,
      };
      const paramsP = {
        Json: JSON.stringify(prP),
        func: "Trl_spTourRequest_Excel",
      };
      const res = await mainAction.API_spCallServer(paramsP, dispatch);
      ;
      let dataExport = {
        ...res[0],
        FileName:
          "Eurotravel - Phiếu yêu cầu dịch vụ tour " + dataEx.ServiceSaleCode,
      };

      const params = {
        Json: JSON.stringify(dataExport),
        func: "Trl_spTourRequest_Excel",
      };

      const result = await mainAction.API_spCallExportExcel(params, dispatch);
      if (result.resultCode === 0) {
        const link = document.createElement("a");
        link.href = IMAGES_DOMAIN + result.Message;
        //link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
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
                        onClick={Trl_spTourRequest_Cancer}
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
                            () => Trl_spTourRequest_Save()
                          );
                        }}
                      >
                        <i class="fa fa-plus pr-2"></i>
                        {tourRequestId !== 0 ? "Cập nhật" : "Lưu"}
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
                              if (!isClone) {
                                setServiceSale(e);
                                setBooking(null);
                                setTourRequestId(0);
                                setIsEdit(true);
                              }
                              setServiceSale(e);
                              setIsEdit(true);
                            }}
                            items={serviceSale?.value || 0}
                            className={"w-100 select-custom z-maxx"}
                            type={1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={booking ? "card-body tour-request" : "d-none"}>
                  <div className="center-item mb-2">
                    <h3 class=" font-weight-bold text-dark fs-18">
                      PHIẾU YÊU CẦU DỊCH VỤ TOUR
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
                              return (
                                <div key={index + "rer"}>
                                  {item.PlaneCodeEnd}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-3 font-weight-bold">Số lượng:</div>
                        <div className="col-9">
                          <div class="input-group">
                            <input
                              type="number"
                              class="form-control2"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              readOnly={!isEdit}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 border-bottom">
                      <div className="row">
                        <div className="col-3 font-weight-bold">LANDTOUR:</div>
                        <div className="col-9">
                          <div class="input-group">
                            <SelectLandData
                              className="w-100 h-100 select-custom"
                              onSelected={(e) => {
                                setLandTour(e.value);
                              }}
                              LandId={landTour}
                              isDisabled={!isEdit}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12 p-0 mt-3">{CardDayDetail}</div>
                    <div className="col-md-12 p-0 mt-3 center-item">
                      <button className="btn btn-info " onClick={addNewDay}>
                        <i className="fa fa-plus mr-2" />
                        Thêm ngày
                      </button>
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
                          Quản lý phiếu điều tour
                        </span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      <button
                        className="btn btn-danger btn-sm float-right btn-header"
                        type="button"
                        onClick={Trl_spTourRequest_List}
                      >
                        <i className="fa fa-search mr-2 " />
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body ">
                  <div className="row">
                    <DataTable data={listTourRequest} columns={columns} />
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

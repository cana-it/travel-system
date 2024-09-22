import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { DataTable } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import { IMAGES_DOMAIN } from "../../../Services";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  ConvertToUrl,
  FormatDateJson,
  FormatNumber,
} from "../../../Utils";
import FormImageUpload from "../../../Common/CMS/FormImageUpload";
import { ImgMutilUpload } from "../../../Common/CMS/ImgMutilUpload";
import { MyEditor } from "../../../Common/CMS/MyEditor";
import { confirmAlert } from "react-confirm-alert";
import { SelectStartPoint } from "../../../Common/CMS/SelectStartPoint";
import { SelectCountry } from "../../../Common/CMS/SelectCountry";
export const TourManagement = () => {
  const dispatch = useDispatch();
  const CreateBy = localStorage.getItem("CreateBy");
  useEffect((e) => {
    Trl_spTourManagementAdmin_List();
  }, []);
  const [ListDataTour, setListDataTour] = useState([]);
  const [FileUpload, setFileUpload] = useState([]);
  const [FileUploadImgReview, setFileUploadImgReview] = useState([]);
  const [FileUploadBanner, setFileUploadBanner] = useState([]);
  const [FileUploadBackgound, setFileUploadBackgound] = useState([]);
  const [Description, setDescription] = useState("");
  const [RulesTour, setRulesTour] = useState("");
  const [DescriptionPrice, setDescriptionPrice] = useState("");
  const [countryIdSearch, setCountryIdSearch] = useState(0);
  const [ValueImage, setValueImage] = useState({
    Image: "",
  });
  const [ValueImageReview, setValueImageReview] = useState({
    TourImageReview: "",
  });
  const [ValueImageBanner, setValueImageBanner] = useState({
    ImageBanner: "",
  });
  const [ValueImageSchedule, setValueImageSchedule] = useState({
    ImageSchedule: "",
  });
  const [FromValueTour, setFromValueTour] = useState({
    Id: 0,
    NameTour: "",
    DeparturePoint: "",
    Destination: "",
    Timeline: "",
    Price: "",
    DateStart: "",
    Image: "",
    DeparturePointId: "",
    DestinationId: "",
    TourImageReview: "",
    ImageBanner: "",
    NameTourPrice: "",
    PriceAdult: "",
    PriceInfant: "",
    PriceChild: "",
    IsDelete: 0,
    day: 1,
    schedule: "",
    scheduleId: {},
    CountryFrom: "",
    CountryTo: "",
    QuantityCountry: "",
    Hotel: "",
    Flight: "",
    Notes: "",
    Promotion: "",
    ImageSchedule: "",
  });
  const ClearForm = () => {
    setFromValueTour({
      Id: 0,
      NameTour: "",
      DeparturePoint: "",
      Destination: "",
      Timeline: "",
      DeparturePointId: "",
      DestinationId: "",
      Price: "",
      NameTourPrice: "",
      PriceAdult: "",
      PriceInfant: "",
      PriceChild: "",
      DateStart: "",
      IsDelete: 0,
      CountryFrom: "",
      CountryTo: "",
      QuantityCountry: "",
      Flight: "",
      Hotel: "",
      Notes: "",
      Promotion: "",
    });
    setValueImage({
      Image: "",
    });
    setValueImageReview({
      TourImageReview: "",
    });
    setValueImageBanner({
      ImageBanner: "",
    });
    setValueImageSchedule({
      ImageSchedule: "",
    });
    setFileUpload([]);
    setFileUploadImgReview([]);
    setFileUploadBanner([]);
    setFileUploadBackgound([]);
    setCategorisChoose([]);
    setDayData([dayDataTemp]);
  };

  // Select Điểm khởi hành
  const onSelectStartPoint = (dataitem) => {
    let ListDataStartPoint = "";
    let ListDataStartPointId = "",
      DataStartPoint = [];
    dataitem.forEach((item, index) => {
      if (item.value !== undefined && item.value !== 0) {
        ListDataStartPointId += item?.value + ";";
        ListDataStartPoint += item?.label + "; ";
        DataStartPoint.push(item.value);
      }
    });
    setFromValueTour({
      ...FromValueTour,
      DeparturePoint: ListDataStartPoint,
      DeparturePointId: ListDataStartPointId,
      Data: DataStartPoint,
    });
  };

  // Select các quốc gia
  const onSelectCity = (dataitem) => {
    let ListDestinationId = "";
    let ListDestination = "",
      DataDestination = [];
    dataitem.forEach((item, index) => {
      if (item.value !== undefined && item.value !== 0) {
        ListDestinationId += item?.value + ";";
        ListDestination += item?.label + "; ";
        DataDestination.push(item.value);
      }
    });
    setFromValueTour({
      ...FromValueTour,
      Destination: ListDestination,
      DestinationId: ListDestinationId,
      Data_City: DataDestination,
    });
  };

  //#region quản lý tour
  const Trl_spTourManagement_Save = async () => {
    try {
      if (
        FromValueTour?.NameTour === "" ||
        FromValueTour?.NameTour === undefined
      ) {
        Alertwarning("Vui lòng nhập tên tour");
        return;
      }
      if (
        FromValueTour?.CountryFrom === "" ||
        FromValueTour?.CountryFrom === 0
      ) {
        Alertwarning("Vui lòng chọn quốc gia bắt đầu");
        return;
      }
      if (
        FromValueTour?.QuantityCountry === "" ||
        FromValueTour?.QuantityCountry === undefined
      ) {
        Alertwarning("Vui lòng nhập số lượng quốc gia đi");
        return;
      }
      if (FromValueTour?.CountryTo === "" || FromValueTour?.CountryTo === 0) {
        Alertwarning("Vui lòng chọn quốc gia kết thúc");
        return;
      }
      if (
        FromValueTour?.Timeline === "" ||
        FromValueTour?.Timeline === undefined
      ) {
        Alertwarning("Vui lòng nhập số ngày đi");
        return;
      }
      if (
        FromValueTour?.DateStart === "" ||
        FromValueTour?.DateStart === undefined
      ) {
        Alertwarning("Vui lòng nhập ngày khởi hành");
        return;
      }
      if (FromValueTour?.Hotel === "" || FromValueTour?.Hotel === undefined) {
        Alertwarning("Vui lòng nhập khách sạn");
        return;
      }
      if (FromValueTour?.Flight === "" || FromValueTour?.Flight === undefined) {
        Alertwarning("Vui lòng nhập chuyến bay");
        return;
      }

      // Hình ảnh Banner
      let _newListImageBanner = "";
      if (FileUploadBanner.length > 0) {
        //addFormImageUpload
        const newListImageBanner = await FormImageUpload(
          FileUploadBanner,
          "Tour",
          dispatch
        );
        _newListImageBanner = [
          newListImageBanner,
          ValueImageBanner?.ImageBanner || "",
        ].join(",");
      } else if (
        typeof FileUploadBanner === "string" ||
        FileUploadBanner.length === 0
      ) {
        _newListImageBanner = ValueImageBanner.ImageBanner;
      } else if (!_newListImageBanner) {
        Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
        return;
      }
      if (_newListImageBanner === undefined) {
        Alertwarning("Vui lòng nhập hình ảnh banner tour");
        return;
      }

      // Hình ảnh tour
      let _newListImage = "";
      if (FileUpload.length > 0) {
        //addFormImageUpload
        const newListImage = await FormImageUpload(
          FileUpload,
          "Tour",
          dispatch
        );
        _newListImage = [newListImage, ValueImage?.Image || ""].join(",");
      } else if (typeof FileUpload === "string" || FileUpload.length === 0) {
        _newListImage = ValueImage.Image;
      } else if (!_newListImage) {
        Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
        return;
      }
      if (_newListImage === undefined) {
        Alertwarning("Vui lòng nhập hình ảnh tour");
        return;
      }

      // Hình ảnh thực tế
      let _newListImageReview = "";
      if (FileUploadImgReview.length > 0) {
        //addFormImageUpload
        const newListImageReview = await FormImageUpload(
          FileUploadImgReview,
          "Tour",
          dispatch
        );
        _newListImageReview = [
          newListImageReview,
          ValueImageReview?.TourImageReview || "",
        ].join(",");
      } else if (
        typeof FileUploadImgReview === "string" ||
        FileUploadImgReview.length === 0
      ) {
        _newListImageReview = ValueImageReview.TourImageReview;
      } else if (!_newListImageReview) {
        Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
        return;
      }

      // hình ảnh lịch trình tour
      let _newListImageBackground = "";
      if (FileUploadBackgound.length > 0) {
        //addFormImageUpload
        const newListImageBackground = await FormImageUpload(
          FileUploadBackgound,
          "Tour",
          dispatch
        );
        _newListImageBackground = [
          newListImageBackground,
          ValueImageSchedule?.ImageSchedule || "",
        ].join(",");
      } else if (
        typeof FileUploadBackgound === "string" ||
        FileUploadBackgound.length === 0
      ) {
        _newListImageBackground = ValueImageSchedule.ImageSchedule;
      } else if (!_newListImageBackground) {
        Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
        return;
      }
      if (_newListImageBackground === undefined) {
        Alertwarning("Vui lòng nhập hình ảnh lịch trình tour");
        return;
      }
      let cateName = "",
        cateId = "";
      categorisChoose.map((item) => {
        cateName += item.MenuName + ";";
        cateId += item.MenuId + ";";
      });
      const params = {
        Json: JSON.stringify({
          Id: FromValueTour.Id,
          NameTour: FromValueTour?.NameTour,
          DeparturePointId: FromValueTour?.DeparturePointId,
          DestinationId: FromValueTour?.DestinationId,
          DeparturePoint: FromValueTour?.DeparturePoint,
          Destination: FromValueTour?.Destination,
          CountryFrom: FromValueTour?.CountryFrom,
          CountryTo: FromValueTour?.CountryTo,
          Timeline: FromValueTour?.Timeline,
          Flight: FromValueTour?.Flight,
          Hotel: FromValueTour?.Hotel,
          Notes: FromValueTour?.Notes,
          Promotion: FromValueTour?.Promotion,
          QuantityCountry: FromValueTour?.QuantityCountry,
          Price: FromValueTour?.Price.replaceAll(",", ""),
          Description: Description,
          RulesTour: RulesTour,
          Image: _newListImage?.trim(),
          TourImageReview: _newListImageReview?.trim(),
          ImageBanner: _newListImageBanner?.trim(),
          ImageSchedule: _newListImageBackground?.trim(),
          DateStart: FromValueTour.DateStart,
          NameTourPrice: FromValueTour?.NameTourPrice,
          PriceAdult: FromValueTour?.PriceAdult,
          PriceInfant: FromValueTour?.PriceInfant,
          PriceChild: FromValueTour?.PriceChild,
          DescriptionPrice: DescriptionPrice,
          Creater: CreateBy,
          CategoriesName: cateName,
          CategoriesId: cateId,
          Color: FromValueTour?.Color,
          Slug: ConvertToUrl(FromValueTour?.NameTour),
        }),
        func: "Trl_spTourManagement_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        await Trl_spTourSchedule_Details(result.Id);
        Trl_spTourManagementAdmin_List();
        setIsOpenSave(false);
        ClearForm();
      }
      if (result.Status === "NO") {
        Alertwarning(result.ReturnMess);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
    }
  };

  const Trl_spTourSchedule_Details = async (Id) => {
    try {
      const pr = dayData.map((item, index) => {
        return {
          TourScheduleId: item.TourScheduleId || 0,
          TourId: Id,
          Day: index + 1,
          Schedule: item.Schedule,
          Description: item.Description,
        };
      });
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTourSchedule_Details",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Lưu thành công");
      }
    } catch (error) {
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const Trl_spTourManagementAdmin_List = async () => {
    try {
      setListDataTour([]);
      const pr = {
        Id: 0,
        CountryId: countryIdSearch,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTourManagementAdmin_List",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        setListDataTour(result);
        return;
      }
      Alertwarning("Không có dữ liệu");
    } catch (err) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
    }
  };

  const Trl_spTourManagement_Delete = (item) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return <ConfirmAlertUi onClose={onClose} item={item} />;
      },
    });
  };

  const ConfirmAlertUi = (props) => {
    return (
      <div className="card-body border-left-red">
        <h3>Xác nhận xóa dữ liệu!</h3>
        <p>
          Bạn có chắc chắn muốn xóa{" "}
          <strong>{props.item._original.NameTour}</strong>{" "}
        </p>
        <button className="btn btn-small btn-warning" onClick={props.onClose}>
          {" "}
          <i className="fa fa-undo"> </i> Hủy
        </button>
        <button
          className="btn btn-small btn-danger margin-left-5"
          onClick={() => {
            props.onClose();
            Trl_spTourManagement_Delete_Action(props.item);
          }}
        >
          <i className="fa fa-trash"> </i> Xóa
        </button>
      </div>
    );
  };

  const Trl_spTourManagement_Delete_Action = async (item) => {
    try {
      const pr = {
        Id: item._original.Id,
        IsDelete: 1,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: " Trl_spTourManagement_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spTourManagementAdmin_List();
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.ReturnMess);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const CMS_spIsHot_Save = async (item) => {
    try {
      const pr = {
        Id: item.Id,
        IsHot: item.IsHot ? 0 : 1,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "CMS_spIsHot_Save",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.ReturnMess);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const CMS_spIsHide_Save = async (item) => {
    
    try {
      const pr = {
        Id: item.Id,
        IsHide: item.IsHide ? 0 : 1,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "CMS_spIsHide_Save",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.ReturnMess);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spTourManagement_Edit = (item, dataEdit) => {
    setIsOpenSave(true);
    let Data = item._original;
    let listIdStartPlace = Data?.DeparturePointId
      ? Data.DeparturePointId.split(";")
          .filter((item) => item)
          .map(Number)
      : [];
    let listIdEndPlace = Data?.DestinationId
      ? Data.DestinationId.split(";")
          .filter((item) => item)
          .map(Number)
      : [];

    setFromValueTour({
      Id: Data.Id,
      NameTour: Data.NameTour,
      DeparturePoint: Data.DeparturePoint,
      Destination: Data.Destination,
      CountryFrom: Data.CountryFrom,
      CountryTo: Data.CountryTo,
      Timeline: Data.Timeline,
      Flight: Data.Flight,
      Hotel: Data.Hotel,
      Notes: Data.Notes,
      QuantityCountry: Data.QuantityCountry,
      Price: FormatNumber(Data.Price),
      IsDelete: Data.IsDelete ? 1 : 0,
      Description: Data.Description,
      RulesTour: Data.RulesTour,
      DateStart: Data.DateStart,
      NameTourPrice: Data.NameTourPrice,
      PriceAdult: Data.PriceAdult,
      PriceInfant: Data.PriceInfant,
      PriceChild: Data.PriceChild,
      Promotion: Data.Promotion,
      Data: listIdStartPlace,
      Data_City: listIdEndPlace,
      DeparturePointId: Data?.DeparturePointId,
      DestinationId: Data?.DestinationId,
      Color: Data?.Color,
      Image: Data?.Image,
      TourImageReview: Data?.TourImageReview,
      ImageBanner: Data?.ImageBanner,
      ImageSchedule: Data?.ImageSchedule,
    });
    handleSetCategory(Data);
    setDescription(Data.Description);
    setDescriptionPrice(Data.DescriptionPrice);
    setRulesTour(Data.RulesTour);
    Data?.Tour_Schedule.length > 0 &&
      setDayData(
        Data?.Tour_Schedule.map((item) => {
          return {
            ...item,
            TourScheduleId: item.TourScheduleId,
            Day: item.Day,
            Schedule: item.Schedule,
            Description: item.Description,
          };
        })
      );
  };
  const handleSetCategory = (cate) => {
    let cId = cate.CategoriesId.split(";")
      .filter((item) => item)
      .map(Number);
    let cName = cate.CategoriesName.split(";").filter((item) => item);
    let caChoose = cId.map((item, index) => {
      return { MenuId: item, MenuName: cName[index] };
    });
    setCategorisChoose(caChoose);
  };

  const columns = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 40,
      filterable: false,
      special: true,
      show: true,
      className: "text-center",
    },
    {
      Header: "Tùy chọn",
      Cell: ({ row }) => (
        <>
          <button
            type="button"
            title="Sửa"
            className="btn btn-secondary btn-sm m-1 btn-add"
            onClick={(e) => {
              setValueImage({
                ...ValueImage,
                Image: row._original.Image,
              });
              setValueImageReview({
                ...ValueImageReview,
                TourImageReview: row._original.TourImageReview,
              });
              setValueImageBanner({
                ...ValueImageBanner,
                ImageBanner: row._original.ImageBanner,
              });
              setValueImageSchedule({
                ...ValueImageSchedule,
                ImageSchedule: row._original.ImageSchedule,
              });
              Trl_spTourManagement_Edit(row);
            }}
          >
            <i className="fa fa-edit"></i>
          </button>
          <button
            type="button"
            title="Xóa"
            className="btn btn-danger btn-sm m-1 btn-add"
            onClick={(e) => Trl_spTourManagement_Delete(row)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </>
      ),
      width: 150,
      filterable: false,
      className: "text-center",
    },
    {
      Header: "Hot",
      accessor: "IsHot",
      filterable: false,
      className: "text-center",
      width: 50,
      Cell: ({ row }) => {
        return (
          <div
            class="custom-control custom-switch"
            onClick={(e) => {
              const index = ListDataTour.findIndex(
                (item) => item.Id === row._original.Id
              );
              const newData = [...ListDataTour];
              newData[index] = {
                ...newData[index],
                IsHot: newData[index].IsHot === 1 ? 0 : 1,
              };
              setListDataTour(newData);
              CMS_spIsHot_Save(row._original);
            }}
          >
            <input
              class="custom-control-input"
              type="checkbox"
              id={"customSwitchHot" + row._original.Id}
              checked={
                ListDataTour.find((item) => item.Id === row._original.Id)
                  .IsHot === 1
              }
            />
            <label
              class="custom-control-label"
              for={"customSwitchHot" + row._original.BlogsId}
            ></label>
          </div>
        );
      },
    },
    {
      Header: "Ẩn/Hiện",
      accessor: "IsHide",
      filterable: false,
      className: "text-center",
      width: 50,
      Cell: ({ row }) => {
        return (
          <div
            class="custom-control custom-switch"
            onClick={(e) => {
              const index = ListDataTour.findIndex(
                (item) => item.Id === row._original.Id
              );
              const newData = [...ListDataTour];
              newData[index] = {
                ...newData[index],
                IsHide: newData[index].IsHide === 1 ? 0 : 1,
              };
              setListDataTour(newData);
              CMS_spIsHide_Save(row._original);
            }}
          >
            <input
              class="custom-control-input"
              type="checkbox"
              id={"customSwitchHide" + row._original.Id}
              checked={
                ListDataTour.find((item) => item.Id === row._original.Id)
                  .IsHide === 0
              }
            />
            <label
              class="custom-control-label"
              for={"customSwitchHide" + row._original.BlogsId}
            ></label>
          </div>
        );
      },
    },
    {
      Header: "Hình ảnh Tour",
      accessor: "Image",
      filterable: false,
      className: "text-center",
      Cell: ({ row }) => {
        return (
          <>
            {row.Image !== undefined && row.Image !== "" && row.Image !== null
              ? row._original.Image.split(",").map((img, index) => {
                  return (
                    <>
                      {img !== "" && (
                        <span
                          className="cursor"
                          data-toggle="modal"
                          data-target="#modalImg"
                          key={index} // Add key prop to resolve the unique key warning
                        >
                          <img src={IMAGES_DOMAIN + img} width="30" alt="" />{" "}
                          {/* Add alt attribute */}
                        </span>
                      )}
                    </>
                  );
                })
              : null}
          </>
        );
      },
    },
    {
      Header: "Tên tour",
      accessor: "NameTour",
      className: "text-center",
    },
    {
      Header: "Mã tour",
      accessor: "CodeTour",
      className: "text-center",
    },
    {
      Header: "Giá",
      accessor: "Price",
      className: "text-center",
      Cell: (item) => <span>{FormatNumber(item.value)}</span>,
    },
    {
      Header: "Nơi khởi hành",
      accessor: "DeparturePoint",
      className: "text-center",
    },
    {
      Header: "Điểm đến",
      accessor: "Destination",
      className: "text-center",
    },
    {
      Header: "Quốc gia bắt đầu",
      accessor: "Country_From",
      className: "text-center",
    },
    {
      Header: "Quốc gia kết thúc",
      accessor: "Country_To",
      className: "text-center",
    },
    {
      Header: "Số lượng quốc gia đi",
      accessor: "QuantityCountry",
      className: "text-center",
    },
    {
      Header: "Khách sạn",
      accessor: "Hotel",
      className: "text-center",
    },
    {
      Header: "Chuyến bay",
      accessor: "Flight",
      className: "text-center",
    },
    {
      Header: "Thời gian chuyến đi",
      accessor: "Timeline",
      className: "text-center",
    },
    {
      Header: "Ngày khởi hành",
      accessor: "DateStart",
      className: "text-center",
    },
    {
      Header: "Parent Menu",
      accessor: "CategoriesName",
      className: "text-center",
    },
    {
      Header: "Người tạo",
      accessor: "CreateName",
      className: "text-center",
    },
    {
      Header: "Ngày tạo",
      accessor: "CreateOn",
      Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
      className: "text-center",
    },
  ];
  //#endregion quản lý tour

  //#region addnewday chi tiết tour
  const [isEdit, setIsEdit] = useState(true);
  let dayDataTemp = {
    TourScheduleId: 0,
    Day: 0,
    Schedule: "",
    Description: "",
  };
  const [dayData, setDayData] = useState([dayDataTemp]);
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
        className=" "
        style={{
          width: "100%",
          padding: "8px",
        }}
      >
        <input
          className="padding-td inputTour"
          style={{
            outline: "none",
            border: "none",
            width: "100%",
          }}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          placeholder={`Nhập lịch trình tour !`}
          onBlur={onBlur}
        />
      </div>
    );
  };

  const EditEditor = ({
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
      setValue(e);
      updateMyData(index, e, property, type);
    };

    const onBlur = (e) => {
      setValue2(value);
    };

    useEffect(() => {
      setValue(ivalue);
    }, [ivalue]);

    return <MyEditor values={value} onChange={onChange} />;
  };

  const updateMyData = (index, value, property, type) => {
    if (type === 0) {
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
                        <th className="">Lịch trình</th>
                        <td colspan="12" className="">
                          {" "}
                          <div class="input-group my-1 ">
                            <EditableCell
                              ivalue={day.Schedule}
                              index={index}
                              updateMyData={updateMyData}
                              property="Schedule"
                              type={0}
                              edit={isEdit}
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="title-guider">
                        {!isEdit && <th style={{ minWidth: 50 }}>Progress</th>}
                        <th></th>
                        <th style={{ minWidth: 150 }}>Chi tiết</th>
                      </tr>
                      <tr>
                        <td>
                          {" "}
                          <div className="text-center">Content</div>
                        </td>
                        <td>
                          <EditEditor
                            ivalue={day.Description}
                            index={index}
                            updateMyData={updateMyData}
                            property="Description"
                            type={0}
                            edit={isEdit}
                          />
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

  const addNewDay = () => {
    let newDay = [...dayData, dayDataTemp];
    setDayData(newDay);
  };
  //#endregion addnewday chi tiết tour

  //#region popup Lưu
  const [modalIsOpenSave, setIsOpenSave] = useState(false);
  const openModalSave = () => {
    setIsOpenSave(true);
  };
  const closeModalSave = () => {
    setIsOpenSave(false);
    ClearForm();
  };
  const viewAdd = () => {
    openModalSave();
  };
  //#endregion popup Lưu

  //#region Categories
  const [categories, setCategories] = useState({
    MenuId: "",
  });
  const [categorisChoose, setCategorisChoose] = useState([]);

  const CMS_spMenu_List = async () => {
    try {
      let pr = {
        Id: 0,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "CMS_spMenu_List",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      setCategories(createNestedArray(res));
    } catch (error) {}
  };

  function createNestedArray(arr) {
    const map = new Map();
    const result = [];
    for (const item of arr) {
      if (!map.has(item.Id)) {
        const key = item.MenuUrl.substring(1);
        map.set(item.Id, {
          key: key,
          MenuId: item.Id,
          children: [],
          MenuImage: item.MenuImage,
          MenuName: item.MenuName,
          isShow: false,
          // MenuName: lang === "vi" ? item.MenuName : item.MenuNameEn,
        });
      }
    }
    for (const item of arr) {
      if (item.ParentId === undefined) {
        result.push(map.get(item.Id));
      } else {
        const parentItem = map.get(item.ParentId);
        if (parentItem) {
          parentItem.children.push(map.get(item.Id));
        }
      }
    }
    const filteredArr = result.map((item) => removeEmptyChildren(item));
    return filteredArr;
  }

  function removeEmptyChildren(node) {
    if (node.children && node.children.length === 0) {
      delete node.children;
    } else if (node.children && node.children.length > 0) {
      node.children = node.children.map((childNode) =>
        removeEmptyChildren(childNode)
      );
    }
    return node;
  }

  const handleShowCategories = (id) => {
    let newCategories = categories.map((item) => {
      if (item.MenuId === id) return { ...item, isShow: !item.isShow };
      return { ...item, isShow: false };
    });
    setCategories(newCategories);
  };

  const handleChooseCategories = (item) => {
    let index = categorisChoose.findIndex((x) => x.MenuId === item.MenuId);
    if (index !== -1) {
      categorisChoose.splice(index, 1);
    } else {
      categorisChoose.push(item);
    }
    setCategorisChoose([...categorisChoose]);
  };

  const handleChangePrice = (e) => {
    const inputValue = e.target.value;

    // Kiểm tra nếu input chỉ chứa ký tự số
    const validInput = /^[0-9,]*$/.test(inputValue);
    if (!validInput) return;

    const formattedValue = FormatNumber(inputValue);
    setFromValueTour({
      ...FromValueTour,
      Price: formattedValue
    });
  }

  const RenderCategories = () => {
    return (
      <div class="accordion" id="accordionExample">
        <div class="card">
          {categories?.map((item, index) => {
            return (
              <>
                <div class="" id={item.MenuName}>
                  <h5 class="mb-0 w-100">
                    <button
                      class="btn btn-link text-dark fs-14 bold w-100 d-flex justify-content-between align-items-center"
                      type="button"
                      onClick={(e) => {
                        handleChooseCategories(item);
                        handleShowCategories(item.MenuId);
                      }}
                      data-toggle="collapse"
                      data-target={`#${item.MenuName}${index}`}
                      aria-expanded={item.isShow ? "true" : "false"}
                      aria-controls={`${item.MenuName}${index}`}
                    >
                      {item.MenuName}
                      {item.isShow ? (
                        <i class="fas fa-chevron-up fs-12"></i>
                      ) : (
                        <i class="fas fa-chevron-down fs-12"></i>
                      )}
                    </button>
                  </h5>
                </div>
                <div
                  id={`${item.MenuName}${index}`}
                  class={`collapse ${item.isShow ? "show" : ""}`}
                  aria-labelledby={item.MenuName}
                  data-parent="#accordionExample"
                >
                  {item.children &&
                    item.children.length > 0 &&
                    item.children.map((child, index2) => {
                      return (
                        <div
                          class="card-body px-4 py-1 fs-14 cursor-pointer"
                          key={index2}
                          onClick={(e) => handleChooseCategories(child)}
                        >
                          {child.MenuName}
                        </div>
                      );
                    })}
                </div>
              </>
            );
          })}
        </div>
      </div>
    );
  };

  const RenderCategoriesChoose = () => {
    return (
      <div class="d-flex flex-row flex-wrap fs-12 ">
        {categorisChoose?.map((item, index) => {
          return (
            <span
              class="mx-1 px-2 py-1 rounded-lg my-1 bg-secondary "
              key={index}
              id={item.MenuName}
            >
              {item.MenuName}
              <i
                class="fas fa-times ml-2 cursor-pointer"
                onClick={() => handleChooseCategories(item)}
              ></i>
            </span>
          );
        })}
      </div>
    );
  };
  //#endregion
  useEffect(() => {
    CMS_spMenu_List();
  }, []);

  return (
    <div className="content-wrapper tour">
      <div className="card p-1">
        <div className="card-header">
          <span className="HomeTitle">Quản lý tour</span>
          <div className="float-right">
            <button
              onClick={(e) => {
                viewAdd();
                ClearForm();
                setDescription([]);
                setRulesTour([]);
                setDescriptionPrice([]);
              }}
              type="button"
              class="btn btn-sm btn-success pull-right margin-left-5"
              style={{ marginTop: "-7px" }}
            >
              <i class="fa fa-plus pr-2"></i>
              Thêm tour
            </button>
            <button
              onClick={(e) => {
                Trl_spTourManagementAdmin_List();
              }}
              type="button"
              class="btn btn-sm btn-primary pull-right margin-left-5"
              style={{ marginTop: "-7px" }}
            >
              <i class="fa fa-search pr-2"></i>
              Tìm kiếm
            </button>
          </div>
        </div>
        <div className="card-body row">
          <div className="col-8"></div>
          <div className="col-md-4 mr-auto">
            <div className="form-group">
              <label className="no-absolute custom-label">Điểm đến</label>
              <SelectCountry
                LocationId={countryIdSearch}
                onSelected={(e) => {
                  setCountryIdSearch(e.value);
                }}
                type={1}
              />
            </div>
          </div>
          <div className="col-md-12  card p-2">
            <DataTable
              data={ListDataTour}
              columns={columns}
              fixedColumns="true"
            />
          </div>
        </div>
      </div>
      {/* Module ADD */}
      <Modal
        show={modalIsOpenSave}
        onHide={closeModalSave}
        className=" custom-modal-w-90"
        aria-labelledby="example-custom-modal-styling-title"
        backdrop="static"
      >
        <Modal.Header className="p-2">
          <Modal.Title id="example-custom-modal-styling-title">
            <div className="">
              {FromValueTour.Id === 0 ? "Thêm tour" : "Chỉnh sửa"}
            </div>
          </Modal.Title>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={closeModalSave}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div id="accordion">
            <div class="card">
              <div class="p-0 shadow-sm" id="headingOne">
                <div class="mb-0">
                  <button
                    class="btn btn-link text-danger"
                    data-toggle="collapse"
                    data-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    <h5 className="font-weight-bold mt-2  ">Thông tin tour </h5>
                  </button>
                </div>
              </div>

              <div
                id="collapseOne"
                class="collapse show"
                aria-labelledby="headingOne"
                data-parent="#accordion"
              >
                <div class="card-body">
                  <div class="row">
                    <div className="col-9">
                      <div className="row">
                        <div className="col-md-9">
                          <div className="form-group">
                            <label className="no-absolute custom-label">
                              Tên Tour <span className="text-danger">(*)</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={FromValueTour.NameTour}
                              onChange={(e) =>
                                setFromValueTour({
                                  ...FromValueTour,
                                  NameTour: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label className="no-absolute custom-label">
                              Màu sắc (định dạng #xxxxxx){" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={FromValueTour.Color}
                              onChange={(e) =>
                                setFromValueTour({
                                  ...FromValueTour,
                                  Color: e.target.value,
                                })
                              }
                              placeholder="Ví dụ: #000000"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="no-absolute custom-label">
                              Nơi khởi hành{" "}
                              <span className="text-danger">(*)</span>
                            </label>
                            <SelectStartPoint
                              onSelected={(e) => onSelectStartPoint(e)}
                              isMulti={true}
                              activer={FromValueTour?.Data || []}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="no-absolute custom-label">
                              Điểm đến <span className="text-danger">(*)</span>
                            </label>
                            <SelectCountry
                              onSelected={(e) => onSelectCity(e)}
                              isMulti={true}
                              activer={FromValueTour?.Data_City}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="no-absolute custom-label">
                              Quốc gia bắt đầu{" "}
                              <span className="text-danger">(*)</span>
                            </label>
                            <SelectCountry
                              LocationId={FromValueTour.CountryFrom}
                              onSelected={(e) => {
                                setFromValueTour({
                                  ...FromValueTour,
                                  CountryFrom: e?.value,
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="no-absolute custom-label">
                              Số lượng quốc gia đi{" "}
                              <span className="text-danger">(*)</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={FromValueTour.QuantityCountry}
                              onChange={(e) =>
                                setFromValueTour({
                                  ...FromValueTour,
                                  QuantityCountry: e.target.value,
                                })
                              }
                              placeholder="Ex: 3 quốc gia"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="no-absolute custom-label">
                              Giá <span className="text-danger">(*)</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={FromValueTour.Price}
                              onChange={handleChangePrice
                              }
                              placeholder="Ex: 1.000.000"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="no-absolute custom-label">
                              Quốc gia kết thúc{" "}
                              <span className="text-danger">(*)</span>
                            </label>
                            <SelectCountry
                              LocationId={FromValueTour.CountryTo}
                              onSelected={(e) => {
                                setFromValueTour({
                                  ...FromValueTour,
                                  CountryTo: e?.value,
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="no-absolute custom-label">
                              Số ngày đi{" "}
                              <span className="text-danger">(*)</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={FromValueTour.Timeline}
                              onChange={(e) =>
                                setFromValueTour({
                                  ...FromValueTour,
                                  Timeline: e.target.value,
                                })
                              }
                              placeholder="Ví dụ: 2 Ngày 3 Đêm"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="no-absolute custom-label">
                              Ngày khởi hành{" "}
                              <span className="text-danger">(*)</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={FromValueTour.DateStart}
                              onChange={(e) =>
                                setFromValueTour({
                                  ...FromValueTour,
                                  DateStart: e.target.value,
                                })
                              }
                              placeholder="Ví dụ: 01-04, 05-04, 07-05, 15-05"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="no-absolute custom-label">
                              Khách sạn <span className="text-danger">(*)</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={FromValueTour.Hotel}
                              onChange={(e) =>
                                setFromValueTour({
                                  ...FromValueTour,
                                  Hotel: e.target.value,
                                })
                              }
                              placeholder="Ex: 5*"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="no-absolute custom-label">
                              Máy bay <span className="text-danger">(*)</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={FromValueTour.Flight}
                              onChange={(e) =>
                                setFromValueTour({
                                  ...FromValueTour,
                                  Flight: e.target.value,
                                })
                              }
                              placeholder="Ex: QR"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="no-absolute custom-label">
                              Khuyến mãi{" "}
                              <span className="text-danger">(*)</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={FromValueTour.Promotion}
                              onChange={(e) =>
                                setFromValueTour({
                                  ...FromValueTour,
                                  Promotion: e.target.value,
                                })
                              }
                              placeholder="Ex: Tặng Sim 4G"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-3 card w-100 px-0">
                      <p className="p-2 mx-0 mb-0 shadow-sm">Danh mục tour</p>
                      <div className="">
                        <RenderCategoriesChoose />
                      </div>
                      <div className="box p-2">
                        <RenderCategories />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="no-absolute custom-label">
                          Ghi chú <span className="text-danger">(*)</span>
                        </label>
                        <textarea
                          rows="3"
                          className="form-control"
                          value={FromValueTour.Notes}
                          onChange={(e) =>
                            setFromValueTour({
                              ...FromValueTour,
                              Notes: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <span className="small font-weight-bold text-muted">
                        Hình ảnh banner tour -{" "}
                        <span className="text-danger">Size dưới 1MB</span>
                        <span className="text-danger"> (jpg, jpeg, png)</span>
                      </span>
                      <ImgMutilUpload
                        onImageUpload={(e) => setFileUploadBanner(e)}
                        onData={(e) =>
                          setValueImageBanner({
                            ...ValueImageBanner,
                            ImageBanner: e,
                          })
                        }
                        data={ValueImageBanner.ImageBanner}
                        isMutil={false}
                      />
                    </div>
                    <div className="col-md-12">
                      <span className="small font-weight-bold text-muted">
                        Hình ảnh tour
                        <span className="text-danger"> (jpg, jpeg, png)</span>
                      </span>
                      <ImgMutilUpload
                        onImageUpload={(e) => setFileUpload(e)}
                        onData={(e) =>
                          setValueImage({ ...ValueImage, Image: e })
                        }
                        data={ValueImage.Image}
                        isMutil={true}
                      />
                    </div>
                    <div className="col-md-12 mt-2">
                      <label className="no-absolute custom-label">
                        Giới thiệu Tour <span className="text-danger">(*)</span>
                      </label>
                      <MyEditor
                        values={Description}
                        onChange={(e) => {
                          setDescription(e);
                        }}
                      />
                    </div>
                    <div className="col-md-12 mt-4">
                      <label className="no-absolute custom-label">
                        Điều khoản <span className="text-danger">(*)</span>
                      </label>
                      <MyEditor
                        values={RulesTour}
                        onChange={(e) => {
                          setRulesTour(e);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="p-0 shadow-sm" id="headingTwo">
                <div class="mb-0">
                  <button
                    class="btn btn-link collapsed text-danger"
                    data-toggle="collapse"
                    data-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    <h5 className="font-weight-bold mt-2">Hình ảnh thực tế </h5>
                  </button>
                </div>
              </div>
              <div
                id="collapseTwo"
                class="collapse"
                aria-labelledby="headingTwo"
                data-parent="#accordion"
              >
                <div class="card-body">
                  <div className="col-md-12 mt-4">
                    <span className="small font-weight-bold text-muted">
                      Upload Hình Ảnh Thực Tế
                      <span className="text-danger">
                        (jpg, jpeg, png || Có thể thêm nhiều ảnh)
                      </span>
                    </span>
                    <ImgMutilUpload
                      onImageUpload={(e) => setFileUploadImgReview(e)}
                      onData={(e) =>
                        setValueImageReview({
                          ...ValueImageReview,
                          TourImageReview: e,
                        })
                      }
                      data={ValueImageReview.TourImageReview}
                      isMutil={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="p-0 shadow-sm" id="headingThree">
                <div class="mb-0">
                  <button
                    class="btn btn-link collapsed text-danger"
                    data-toggle="collapse"
                    data-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    <h5 className="font-weight-bold mt-2">
                      Quản lý lịch trình tour{" "}
                    </h5>
                  </button>
                </div>
              </div>
              <div
                id="collapseThree"
                class="collapse"
                aria-labelledby="headingThree"
                data-parent="#accordion"
              >
                <div class="card-body">
                  <div className="col-md-12">
                    <span className="small font-weight-bold text-muted">
                      Hình ảnh lịch trình tour
                      <span className="text-danger"> (jpg, jpeg, png)</span>
                    </span>
                    <ImgMutilUpload
                      onImageUpload={(e) => setFileUploadBackgound(e)}
                      onData={(e) =>
                        setValueImageSchedule({
                          ...ValueImageSchedule,
                          ImageSchedule: e,
                        })
                      }
                      data={ValueImageSchedule.ImageSchedule}
                      // isMutil={true}
                    />
                  </div>
                  <div className="col-md-12 p-0 mt-3">{CardDayDetail}</div>
                  <div className="col-md-12 p-0 mt-3 center-item">
                    <button
                      className="btn btn-info "
                      onClick={(e) => {
                        addNewDay();
                      }}
                    >
                      <i className="fa fa-plus mr-2" />
                      Thêm ngày
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="p-0 shadow-sm" id="headingFour">
                <div class="mb-0">
                  <button
                    class="btn btn-link collapsed text-danger"
                    data-toggle="collapse"
                    data-target="#collapseFour"
                    aria-expanded="false"
                    aria-controls="collapseFour"
                  >
                    <h5 className="font-weight-bold mt-2">Quản lý giá tour </h5>
                  </button>
                </div>
              </div>
              <div
                id="collapseFour"
                class="collapse"
                aria-labelledby="headingFour"
                data-parent="#accordion"
              >
                <div class="card-body">
                  <div className="row">
                    {/* <div className="col-md-6">
                      <div className="form-group">
                        <label className="no-absolute custom-label">
                          Tên bảng giá <span className="text-danger">(*)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={FromValueTour.NameTourPrice}
                          onChange={(e) =>
                            setFromValueTour({
                              ...FromValueTour,
                              NameTourPrice: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="no-absolute custom-label">
                          Ngày khởi hành{" "}
                          <span className="text-danger">(*)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={FromValueTour.DateStart}
                          onChange={(e) =>
                            setFromValueTour({
                              ...FromValueTour,
                              DateStart: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                        */}

                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="no-absolute custom-label">
                          Giá người lớn <span className="text-danger">(*)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={FromValueTour.PriceAdult}
                          onChange={(e) =>
                            setFromValueTour({
                              ...FromValueTour,
                              PriceAdult: e.target.value,
                            })
                          }
                          placeholder="Ex: 2.000.000"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="no-absolute custom-label">
                          Giá Infant
                          <span className="text-danger">(*)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={FromValueTour.PriceInfant}
                          onChange={(e) =>
                            setFromValueTour({
                              ...FromValueTour,
                              PriceInfant: e.target.value,
                            })
                          }
                          placeholder="Ex: 30% giá tour"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="no-absolute custom-label">
                          Giá trẻ em
                          <span className="text-danger">(*)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={FromValueTour.PriceChild}
                          onChange={(e) =>
                            setFromValueTour({
                              ...FromValueTour,
                              PriceChild: e.target.value,
                            })
                          }
                          placeholder="Ex: 85% giá tour"
                        />
                      </div>
                    </div>
                    <div className="col-md-12 mt-2">
                      <label className="no-absolute custom-label">
                        Ghi chú bảng giá{" "}
                        <span className="text-danger">(*)</span>
                      </label>
                      <MyEditor
                        values={DescriptionPrice}
                        onChange={(e) => {
                          setDescriptionPrice(e);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="row">
              {/* Lưu */}
              <div className="col-sm-12 col-md-12">
                <button
                  onClick={() => {
                    ClearForm();
                    setFileUpload([]);
                    setDescriptionPrice([]);
                    setRulesTour([]);
                  }}
                  type="button"
                  className="btn btn-sm btn-danger pull-right margin-left-5"
                >
                  <i className="fa fa-trash pr-2"></i>
                  Clear form
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-success pull-right"
                  onClick={(e) => {
                    Trl_spTourManagement_Save();
                    // closeModalSave()
                  }}
                >
                  <i className="fa fa-save pr-2"></i>
                  {FromValueTour.Id === 0 ? "Lưu" : "Chỉnh sửa"}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

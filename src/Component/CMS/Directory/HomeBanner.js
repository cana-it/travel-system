import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { confirmAlert } from "react-confirm-alert";
import { DataTable } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import { IMAGES_DOMAIN } from "../../../Services";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  FormatDateJson,
} from "../../../Utils";
import Select from "react-select";
import FormImageUpload from "../../../Common/CMS/FormImageUpload";
import { ImgMutilUpload } from "../../../Common/CMS/ImgMutilUpload";
import { SelectBannerGroup } from "../../../Common/CMS/SelectBannerGroup";
export const HomeBanner = () => {
  const dispatch = useDispatch();
  const [Show, setShow] = useState("management_banner"); //show tabs
  const Creater = localStorage.getItem("CreateBy");
  const CreaterName = localStorage.getItem("CreaterName");
  const [Data, setData] = useState([]);
  const [SlideId, setSlideId] = useState(0);
  const [SlideName, setSlideName] = useState("");
  const [Content, setContent] = useState("");
  const [UrlSlide, setUrlSlide] = useState("");
  const [type, settype] = useState("Type");
  const [FileUpload, setFileUpload] = useState("");
  const [ListData, setListData] = useState([]);
  const [TypeBannerGroup, setTypeBannerGroup] = useState(0);
  const [Status, setStatus] = useState();
  const [Disable, setDisable] = useState(true);
  const [Disable2, setDisable2] = useState(true);
  const [FromValue, setFromValue] = useState({
    SlideId: 0,
    SlideName: "",
    Content: "",
    UrlSlide: "",
    type: "",
    IndexNumber: 0,
    IsHide: 0,
    IsDelete: 0,
    Image: "",
    TypeBannerGroup: "",
  });

  const [FromValueGroup, setFromValueGroup] = useState({
    BannerGroupId: 0,
    BannerName: "",
    KeySelect: "",
    IsDelete: 0,
  });
  const [listDataGroup, setListDataGroup] = useState([]);

  const [valueType, setValueType] = useState({
    value: "img",
    label: "Hình ảnh",
  });

  const [valuetype, setvaluetype] = useState({ value: "Type", label: "Type" });
  const onSelecttype = (item) => {
    settype(item.value);
    setvaluetype(item);
  };

  useEffect(() => {
    CMS_spSlide_List();
    Trl_spBanner_Group_List();
  }, []);

  const ClearForm = () => {
    setFromValue({
      SlideId: 0,
      SlideName: "",
      Content: "",
      UrlSlide: "",
      type: "",
      IndexNumber: 0,
      IsHide: 0,
      IsDelete: 0,
      Image: "",
      TypeBannerGroup: "",
    });
    setFileUpload([]);
    setFromValueGroup({
      BannerGroupId: 0,
      BannerName: "",
      KeySelect: "",
    });
  };

  const Cancel = () => {
    setSlideId(0);
    setSlideName("");
    setContent("");
    setUrlSlide("");
    settype("");
    setFileUpload("");
  };

  //#region quản lý banner
  const CMS_spSlide_List = async () => {
    try {
      setListData([]);
      setDisable2(false);
      const pr = {
        SlideId: 0,
        TypeBannerGroup: TypeBannerGroup,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "CMS_spSlide_List",
      };

      const list = await mainAction.API_spCallServer(params, dispatch);
      if (list.length > 0) {
        setData(list);
        setListData(list);
        setDisable2(true);
        return;
      }
      Alertwarning("Không có dữ liệu");
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
      setDisable2(true);
    }
  };

  const CMS_spSlide_Save = async () => {
    try {
      if (SlideName === "") {
        Alertwarning("Nhập Tên Slide");
        return;
      }
      if (Content === "") {
        Alertwarning("Nhập Nội Dung");
        return;
      }
      if (UrlSlide === "") {
        Alertwarning("Nhập Url Slide");
        return;
      }
      if (type === "Type") {
        Alertwarning("Chọn loại banner");
        return;
      }
      if (FromValue.TypeBannerGroup === "" || FromValue.TypeBannerGroup === 0) {
        Alertwarning("Chọn nhóm banner");
        return;
      }
      setDisable(false);

      let _newListImage = "";
      if (FileUpload.length > 0) {
        const newListImage = await FormImageUpload(
          FileUpload,
          "Main",
          dispatch
        );
        _newListImage = [newListImage, FromValue?.Image || ""].join(",");
      } else if (typeof FileUpload === "string" || FileUpload.length === 0) {
        _newListImage = FromValue.Image;
      } else if (!_newListImage) {
        Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
        setDisable(true);
        return;
      }

      let Image = "";
      if (valueType.value === "img") {
        Image = _newListImage;
      }

      const pr = {
        SlideId: SlideId,
        SlideName: SlideName,
        Content: Content,
        UrlSlide: UrlSlide,
        type: type,
        Image: _newListImage,
        TypeBannerGroup: FromValue.TypeBannerGroup,
        Creater: Creater,
        CreaterName: CreaterName,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "CMS_spSlide_Save",
      };
      setDisable2(true);
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Cancel();
        setIsOpen(false);
        setListData(ListData);
        CMS_spSlide_List();
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.ReturnMess);
        setDisable2(true);
        return;
      } else {
        const timeConfirm = new Date();
        ListData.map((e) => {
          if (e.SlideId === FromValue.SlideId) {
            e.SlideName = FromValue.SlideName;
            e.Content = FromValue.Content;
            e.UrlSlide = FromValue.UrlSlide;
            e.type = FromValue.type;
            e.Image = _newListImage;
            e.IsHide = FromValue.IsHide;
            e.IsDelete = FromValue.IsDelete;
            e.EditOn = FormatDateJson(timeConfirm);
            e.TypeBannerGroup = FromValue.TypeBannerGroup;
          }
          return e;
        });
        setListData(ListData);
        Alertsuccess(result.ReturnMess);
        ClearForm();
        setDisable2(true);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
      setDisable2(true);
    }
  };

  const Banner_View = (item) => {
    setIsOpen(true);
    const obView = item._original;
    setSlideName(obView.SlideName);
    setContent(obView.Content);
    setUrlSlide(obView.UrlSlide);
    setSlideId(obView.SlideId);
    settype(obView.type);
    setFromValue({
      SlideId: obView.SlideId,
      SlideName: obView.SlideName,
      Content: obView.Content,
      UrlSlide: obView.UrlSlide,
      type: obView.type,
      IndexNumber: obView.IndexNumber,
      IsHide: obView.IsHide ? 1 : 0,
      IsDelete: obView.IsDelete ? 1 : 0,
      Image: obView.Image,
      TypeBannerGroup: obView.TypeBannerGroup,
      Creater: Creater,
    });
  };

  const CMS_spSlide_Delete = (item) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return <ConfirmAlertUi onClose={onClose} item={item} />;
      },
    });
  };

  const CMS_spSlide_Delete_Action = async (item) => {
    try {
      const pr = {
        Creater: Creater,
        CreaterName: CreaterName,
        SlideId: item._original.SlideId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: " CMS_spSlide_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        CMS_spSlide_List();
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

  const ConfirmAlertUi = (props) => {
    return (
      <div className="card-body border-left-red">
        <h3>Xác nhận xóa dữ liệu!</h3>
        <p>
          Bạn có chắc chắn muốn xóa{" "}
          <strong>{props.item._original.MenuName}</strong>{" "}
        </p>
        <button className="btn btn-small btn-warning" onClick={props.onClose}>
          {" "}
          <i className="fa fa-undo"> </i> Hủy
        </button>
        <button
          className="btn btn-small btn-danger margin-left-5"
          onClick={() => {
            props.onClose();
            CMS_spSlide_Delete_Action(props.item);
          }}
        >
          <i className="fa fa-trash"> </i> Xóa
        </button>
      </div>
    );
  };

  const CMS_spSlide_Hide = async (item) => {
    const pr = {
      Creater: Creater,
      CreaterName: CreaterName,
      SlideId: item._original.SlideId,
    };

    const params = {
      Json: JSON.stringify(pr),
      func: "CMS_spSlide_Hide",
    };
    const result = await mainAction.API_spCallServer(params, dispatch);
    Alertsuccess(result.ReturnMess);
    let newData = Data.map((x) => {
      if (x.SlideId === item._original.SlideId) {
        return { ...x, IsHide: !x.IsHide };
      }
      return x;
    });
    setData(newData);
  };
  //#endregion quản lý banner

  //#region change Index
  const [timer, setTimer] = useState(null);
  let delayTime = 1000;
  const handleChange = () => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      Call_Api();
    }, delayTime);
    setTimer(newTimer);
  };
  const CMS_spSlide_ChangeIndex = async (item, key) => {
    try {
      let Data = item.row._original,
        _IndexNumber = 0;
      if (key === "down") {
        _IndexNumber = Data.IndexNumber - 1;
      } else {
        _IndexNumber = Data.IndexNumber + 1;
      }

      let datatmp = ListData.find((e) => e.SlideId === Data.SlideId);
      datatmp.IndexNumber = _IndexNumber;
      setStatus({ list: ListData });
      datatmp.IsCheck = true;
      handleChange();
    } catch (error) {
      setDisable2(true);
      Alerterror("Lỗi, liên hệ IT");
    }
  };
  const Call_Api = async () => {
    let data_tmp = ListData.filter((e) => e.IsCheck === true);
    const extractedData = data_tmp.map((item) => ({
      SlideId: item.SlideId,
      IndexNumber: item.IndexNumber,
    }));
    const params = {
      Json: JSON.stringify(extractedData),
      func: "CMS_spSlide_ChangeIndex",
    };
    const result = await mainAction.API_spCallServer(params, dispatch);
  };
  //#endregion change Index

  //#region Nhóm Banner
  const Trl_spBanner_Group_Save = async () => {
    try {
      if (
        FromValueGroup?.KeySelect === "" ||
        FromValueGroup?.KeySelect === undefined
      ) {
        Alertwarning("Vui lòng nhập cài đặt hiển thị");
        return;
      }
      if (
        FromValueGroup?.BannerName === "" ||
        FromValueGroup?.BannerName === undefined
      ) {
        Alertwarning("Vui lòng nhập tên nhóm banner");
        return;
      }
      const params = {
        Json: JSON.stringify({
          BannerGroupId: FromValueGroup.BannerGroupId,
          BannerName: FromValueGroup?.BannerName,
          KeySelect: FromValueGroup?.KeySelect,
          Creater: Creater,
        }),
        func: "Trl_spBanner_Group_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "NO") {
        Alertwarning(result.ReturnMess);
      }
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spBanner_Group_List();
        ClearForm();
        setIsOpen(false);
      }
    } catch (err) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT");
    }
  };

  const Trl_spBanner_Group_List = async () => {
    try {
      setListDataGroup([]);
      let pr = {
        BannerGroupId: 0,
        UserId: +Creater,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBanner_Group_List",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      if (list.length > 0) {
        setListDataGroup(list);
        return;
      }
      Alertwarning("Không có dữ liệu");
    } catch (err) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT");
    }
  };

  //delete
  const Trl_spBanner_Group_Delete = (item) => {
    if (item._original?.PermissonDelete === 0) {
      return;
    }
    confirmAlert({
      customUI: ({ onClose }) => {
        return <ConfirmAlertDeleteGr onClose={onClose} item={item} />;
      },
    });
  };
  const ConfirmAlertDeleteGr = (props) => {
    return (
      <div className="card-body border-left-red">
        <h3>Xác nhận xóa dữ liệu!</h3>
        <p>
          Bạn có chắc chắn muốn xóa{" "}
          <strong>{props.item._original.MenuName}</strong>{" "}
        </p>
        <button className="btn btn-small btn-warning" onClick={props.onClose}>
          {" "}
          <i className="fa fa-undo"> </i> Hủy
        </button>
        <button
          className="btn btn-small btn-danger margin-left-5 "
          onClick={() => {
            props.onClose();
            Trl_spBanner_Group_Delete_Action(props.item);
          }}
        >
          <i className="fa fa-trash"> </i> Xóa
        </button>
      </div>
    );
  };
  const Trl_spBanner_Group_Delete_Action = async (item) => {
    try {
      const pr = {
        BannerGroupId: item._original.BannerGroupId,
        IsDelete: 1,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: " Trl_spBanner_Group_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spBanner_Group_List();
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
  //delete

  const Trl_spBanner_Group_Edit = (item) => {
    setIsOpen(true);
    let Data = item._original;
    setFromValueGroup({
      BannerGroupId: Data.BannerGroupId,
      BannerName: Data.BannerName,
      KeySelect: Data.KeySelect,
    });
  };
  //#endregion Nhóm Banner

  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const VideAdd = () => {
    openModal();
  };
  const columns = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 70,
      className: "text-center",
      filterable: false,
      special: true,
      show: true,
    },
    {
      Header: "Tùy chọn",
      className: "text-center",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div>
          <button
            type="button"
            title="Sửa"
            className="btn btn-secondary btn-sm m-1 btn-add"
            onClick={(e) => Banner_View(row)}
          >
            <i className="fa fa-edit"></i>
          </button>

          <button
            type="button"
            title="Xóa"
            className="btn btn-danger btn-sm m-1 btn-add "
            onClick={(e) => CMS_spSlide_Delete(row)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </div>
      ),
    },
    {
      Header: "Ẩn Hiện",
      className: "text-center",
      accessor: "IsHide",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <>
            <button
              className={
                row._original.IsHide
                  ? "btn btn-xs btn-primary pr-2"
                  : " btn btn-xs btn-warning pr-2"
              }
              onClick={(e) => CMS_spSlide_Hide(row)}
            >
              {" "}
              <i
                className={
                  row._original.IsHide ? "fa fa-eye" : "fas fa-eye-slash"
                }
              ></i>{" "}
              {row._original.IsHide ? "Ẩn" : " Bỏ Ẩn"}
            </button>{" "}
          </>
        </div>
      ),
    },
    {
      Header: "Image",
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
                          title="Click để xem hình lớn"
                          key={index}
                        >
                          <img src={IMAGES_DOMAIN + img} width="30" />
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
      Header: "Thứ tự",
      accessor: "IndexNumber",
      filterable: false,
      className: "text-center",
      Cell: ({ row }) => {
        return (
          <>
            <div className="d-flex justify-content-center ">
              <div>
                <button
                  className="border-0"
                  type="button"
                  onClick={(e) => CMS_spSlide_ChangeIndex({ row }, "up")}
                >
                  <i className="fas fa-chevron-circle-up text-info"></i>
                </button>
              </div>
              <span className="px-3">{row._original.IndexNumber} </span>
              <div>
                <button
                  className="border-0"
                  type="button"
                  onClick={(e) => CMS_spSlide_ChangeIndex({ row }, "down")}
                >
                  <i className="fas fa-chevron-circle-down text-info"></i>
                </button>
              </div>
            </div>
          </>
        );
      },
    },
    {
      Header: "Tên slide",
      accessor: "SlideName",
      className: "text-center",
    },
    {
      Header: "Loại",
      accessor: "type",
      className: "text-center",
    },
    {
      Header: "Nhóm banner",
      accessor: "BannerGroup_Name",
      className: "text-center",
    },
    {
      Header: "Nội dung",
      accessor: "Content",
      className: "text-center",
    },
    {
      Header: "Url Slide",
      accessor: "UrlSlide",
      className: "text-center",
    },
    {
      Header: "Người tạo",
      accessor: "CreaterName",
      className: "text-center",
    },
    {
      Header: "Ngày tạo",
      accessor: "CreateOn",
      className: "text-center",
      Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
    },
    {
      Header: "Người sửa",
      accessor: "EditerName",
      className: "text-center",
    },
    {
      Header: "Ngày sửa",
      accessor: "EditOn",
      className: "text-center",
      Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
    },
  ];

  const columnsGroupBanner = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 70,
      filterable: false,
      special: true,
      show: true,
      className: "text-center",
    },
    {
      Header: "Tùy chọn",
      accessor: "Edit",
      className: "text-center",
      Cell: ({ row }) => (
        <div>
          <button
            type="button"
            title="Sửa"
            className="btn btn-secondary btn-sm m-1 btn-add"
            onClick={(e) => Trl_spBanner_Group_Edit(row)}
          >
            <i className="fa fa-edit"></i>
          </button>

          <button
            type="button"
            title="Xóa"
            className={
              row._original?.PermissonDelete === 1
                ? "btn btn-danger btn-sm m-1 btn-add "
                : "btn btn-danger btn-sm m-1 btn-add d-none"
            }
            onClick={(e) => Trl_spBanner_Group_Delete(row)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </div>
      ),
    },
    {
      Header: "Cài đặt hiển thị",
      accessor: "KeySelect",
      className: "text-center",
      filterable: true,
      special: true,
      show: true,
    },
    {
      Header: "Tên nhóm",
      accessor: "BannerName",
      className: "text-center",
      filterable: true,
      special: true,
      show: true,
    },
    {
      Header: "Người tạo",
      accessor: "CreateName",
      className: "text-center",
      filterable: true,
      special: true,
      show: true,
    },
    {
      Header: "Ngày tạo",
      accessor: "CreateDate",
      className: "text-center",
      filterable: true,
      special: true,
      show: true,
    },
    {
      Header: "Người sửa",
      accessor: "EditName",
      className: "text-center",
      filterable: true,
      special: true,
      show: true,
    },
    {
      Header: "Ngày sửa",
      accessor: "EditDate",
      className: "text-center",
      filterable: true,
      special: true,
      show: true,
    },
  ];

  return (
    <>
      {Show === "group_banner" && (
        <div className="content-wrapper">
          <div className="card">
            <div className="card-header">
              <span className="HomeTitle">Quản lý nhóm banner</span>
              <div className="float-right">
                <button
                  onClick={(e) => {
                    VideAdd();
                    ClearForm();
                  }}
                  type="button"
                  class="btn btn-sm btn-success pull-right margin-left-5"
                  style={{ marginTop: "-7px" }}
                >
                  <i class="fa fa-plus pr-2"></i>
                  Thêm nhóm banner
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                  <div className="flex items-center gap-2 px-4">
                    <ul className="nav nav-pills nav-fill rounded bg-light">
                      <li className="nav-item" value={Show}>
                        <a
                          className="nav-link  cursor cursor-pointer"
                          key={"management_banner"}
                          value={"management_banner"}
                          onClick={() => setShow("management_banner")}
                        >
                          Quản lý banner
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className=" nav-link text-black active cursor cursor-pointer hover:bg-"
                          aria-current="page"
                          key={"group_banner"}
                          value={"group_banner"}
                          onClick={() => setShow("group_banner")}
                        >
                          Quản lý nhóm banner
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-3"></div>
              </div>
              <div className="col-md-12 mb-3 mt-4">
                <DataTable
                  data={listDataGroup}
                  columns={columnsGroupBanner}
                  fixedColumns="true"
                />
              </div>
            </div>
          </div>

          {/* Module Add */}
          <Modal
            show={modalIsOpen}
            onHide={closeModal}
            className=" custom-modal-w-90"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header className="p-2">
              <Modal.Title id="example-custom-modal-styling-title">
                <div className="">
                  {FromValueGroup.BannerGroupId === 0
                    ? "Thêm nhóm Banner"
                    : "Chỉnh sửa nhóm Banner"}
                </div>
              </Modal.Title>
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={closeModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </Modal.Header>
            <Modal.Body>
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-md-6 m-auto">
                    <div className="form-group">
                      <span className="small font-weight-bold text-muted">
                        Cài đặt hiển thị
                        <strong className="check-point">(*)</strong>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={FromValueGroup.KeySelect}
                        onChange={(e) =>
                          setFromValueGroup({
                            ...FromValueGroup,
                            KeySelect: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6 m-auto">
                    <div className="form-group">
                      <span className="small font-weight-bold text-muted">
                        Tên nhóm banner
                        <strong className="check-point">(*)</strong>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={FromValueGroup.BannerName}
                        onChange={(e) =>
                          setFromValueGroup({
                            ...FromValueGroup,
                            BannerName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 mt-2">
                    <button
                      onClick={() => {
                        ClearForm();
                        setFileUpload([]);
                        Cancel();
                      }}
                      type="button"
                      className="btn btn-sm btn-danger pull-right margin-left-5"
                    >
                      <i className="fa fa-trash pr-2"></i>
                      Clear Form
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-success pull-right"
                      onClick={Trl_spBanner_Group_Save}
                    >
                      <i className="fa fa-edit pr-2"></i>
                      {FromValueGroup.BannerGroupId === 0
                        ? " Thêm mới"
                        : "Chỉnh sửa"}
                    </button>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
      {Show === "management_banner" && (
        <div className="content-wrapper">
          <div className="card">
            <div className="card-header">
              <span className="HomeTitle">Quản lý banner</span>
              <div className="float-right">
                <button
                  onClick={(e) => {
                    VideAdd();
                    ClearForm();
                  }}
                  type="button"
                  class="btn btn-sm btn-success pull-right margin-left-5"
                  style={{ marginTop: "-7px" }}
                >
                  <i class="fa fa-plus pr-2"></i>
                  Thêm banner
                </button>
                <button
                  onClick={(e) => {
                    CMS_spSlide_List();
                  }}
                  type="button"
                  class="btn btn-sm btn-success pull-right margin-left-5"
                  style={{ marginTop: "-7px" }}
                >
                  <i class="fa fa-search pr-2"></i>
                  Tìm kiếm
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                  <div className="flex items-center gap-2 px-4">
                    <ul
                      className="nav nav-pills nav-fill rounded bg-light"
                      value={Show}
                    >
                      <li className="nav-item">
                        <a
                          className="nav-link active cursor cursor-pointer"
                          aria-current="page"
                          key={"management_banner"}
                          value={"management_banner"}
                          onClick={() => setShow("management_banner")}
                        >
                          Quản lý banner
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link text-black cursor cursor-pointer"
                          aria-current="page"
                          key={"group_banner"}
                          value={"group_banner"}
                          onClick={() => setShow("group_banner")}
                        >
                          Quản lý nhóm banner
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-3"></div>
              </div>
              <div className="row mt-4">
                <div className="col-md-8"></div>
                <div className="col-md-4">
                  <div className="form-group">
                    <span className="small font-weight-bold text-muted">
                      Nhóm banner
                      <strong className="check-point">(*)</strong>
                    </span>
                    <SelectBannerGroup
                      onSelected={(e) => setTypeBannerGroup(e.value)}
                      items={TypeBannerGroup}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12 mb-3">
                <DataTable data={Data} columns={columns} fixedColumns="true" />
              </div>
            </div>
          </div>

          {/* Module add */}
          <Modal
            show={modalIsOpen}
            onHide={closeModal}
            className=" custom-modal-w-90"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header className="p-2">
              <Modal.Title id="example-custom-modal-styling-title">
                <div className="">
                  {FromValue.SlideId === 0
                    ? "Thêm mới Banner"
                    : "Chỉnh sửa Banner"}
                </div>
              </Modal.Title>
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={closeModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </Modal.Header>
            <Modal.Body>
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-xs-12 col-md-4 m-auto">
                    <div className="form-group">
                      <span className="small font-weight-bold text-muted">
                        Tên silde
                        <strong className="check-point">(*)</strong>
                      </span>
                      <input
                        type="text"
                        className="form-control2"
                        value={SlideName}
                        onChange={(e) => setSlideName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-4 m-auto">
                    <div className="form-group">
                      <span className="small font-weight-bold text-muted">
                        Nội dung<strong className="check-point">(*)</strong>
                      </span>
                      <input
                        type="text"
                        className="form-control2"
                        value={Content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-4 m-10">
                    <div className="form-group">
                      <span className="small font-weight-bold text-muted">
                        Url Slide
                        <strong className="check-point">(*)</strong>
                      </span>
                      <input
                        type="text"
                        className="form-control2"
                        value={UrlSlide}
                        onChange={(e) => setUrlSlide(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 m-auto">
                    <div className="form-group">
                      <span className="small font-weight-bold text-muted">
                        Loại Banner
                        <strong className="check-point">(*)</strong>
                      </span>
                      <Select
                        className="select-custom"
                        onChange={(e) => onSelecttype(e)}
                        value={valuetype}
                        options={[
                          { value: "Web PC", label: "Web PC" },
                          { value: "Mobile", label: "Mobile" },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 m-auto">
                    <div className="form-group">
                      <span className="small font-weight-bold text-muted">
                        Nhóm banner
                        <strong className="check-point">(*)</strong>
                      </span>
                      <SelectBannerGroup
                        BannerGroupId={FromValue.TypeBannerGroup}
                        onSelected={(e) => {
                          setFromValue({
                            ...FromValue,
                            TypeBannerGroup: e?.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mt-2">
                    <span className="small font-weight-bold text-muted"></span>
                    <ImgMutilUpload
                      onImageUpload={(e) => setFileUpload(e)}
                      onData={(e) => setFromValue({ ...FromValue, Image: e })}
                      data={FromValue.Image}
                      isMutil={true}
                    />
                  </div>
                  <div className="col-sm-12 col-md-12 mt-2">
                    <button
                      onClick={() => {
                        ClearForm();
                        setFileUpload([]);
                        Cancel();
                      }}
                      type="button"
                      className="btn btn-sm btn-danger pull-right margin-left-5"
                    >
                      <i className="fa fa-trash pr-2"></i>
                      Clear Form
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-success pull-right"
                      onClick={CMS_spSlide_Save}
                    >
                      <i className="fa fa-edit pr-2"></i>
                      {FromValue.SlideId === 0 ? " Thêm mới" : "Chỉnh sửa"}
                    </button>
                  </div>
                  <div className="col-sm-12 col-md-12">
                    <div className="form-group">
                      <h5 style={{ color: "red" }}>
                        Ghi chú: các ô có dấu sao màu đỏ là bắt buộc nhập
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  );
};

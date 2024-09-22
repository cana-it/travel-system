import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { confirmAlert } from "react-confirm-alert";
import { DataTable } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import { IMAGES_DOMAIN } from "../../../Services";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  ConvertToUrl,
} from "../../../Utils";
import Select from "react-select";
import { ImgMutilUpload } from "../../../Common/CMS/ImgMutilUpload";
import FormImageUpload from "../../../Common/CMS/FormImageUpload";
import { useDispatch } from "react-redux";
import { SelectMenu } from "../../../Common/CMS/SelectMenu";
const MenuManagement = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const IsHide = localStorage.getItem("IsHide");
  const [Data, setData] = useState([]);
  const [Id, setId] = useState(0);
  const [MenuName, setMenuName] = useState("");
  const [MenuNameEn, setMenuNameEn] = useState("");
  const [IconClass, setIconClass] = useState("");
  const [MenuUrl, setMenuUrl] = useState("");
  const [ParentId, setParentId] = useState(0);
  const [Files, setFiles] = useState();
  const [FileUpload, setFileUpload] = useState("");
  const [ListData, setListData] = useState([]);
  const [Status, setStatus] = useState([]);
  const [ParentMenuId, setParentMenuId] = useState(0);
  // const [timer, setTimer] = useState(null);
  // let delayTime = 1000;
  const [modalIsOpenPass, setmodalIsOpenPass] = useState(false);
  const [Disable, setDisable] = useState(true);
  const [Disable2, setDisable2] = useState(true);
  const [FromValue, setFromValue] = useState({
    Id: 0,
    MenuName: "",
    MenuNameEn: "",
    MenuUrl: "",
    IconClass: "",
    IndexNumber: 0,
    ParentId: { value: 0, label: "Vui lòng chọn" },
    IsHide: 0,
    IsDelete: 0,
    ChangeParentId: 0,
    MenuImage: "",
  });
  const [SearchValue, setSearchValue] = useState({
    MenuName: "",
  });
  const replaceList = ListData.map((elem) => ({
    value: elem.Id,
    label: elem.MenuName,
  }));
  const parentMenu = [{ value: 0, label: "Vui lòng chọn" }, ...replaceList];

  const [Value, setValue] = useState({
    MenuImage: "",
  });
  const [valueType, setValueType] = useState({
    value: "img",
    label: "Hình ảnh",
  });
  const optionSelect = [{ value: "img", label: "Hình ảnh" }];
  const [TypeSetting, setTypeSetting] = useState("img");
  const onTypeRecept = (item) => {
    setValueType(item);
    setTypeSetting(item.value);
  };

  useEffect(() => {
    CMS_spMenu_List();
  }, []);

  const ClearForm = () => {
    setTypeSetting("img");
    setValueType({ value: "img", label: "Hình ảnh" });
    setFromValue({
      Id: 0,
      MenuName: "",
      MenuNameEn: "",
      MenuUrl: "",
      IconClass: "",
      IndexNumber: 0,
      ParentId: { value: 0, label: "Vui lòng chọn" },
      IsHide: 0,
      IsDelete: 0,
      ChangeParentId: 0,
      MenuImage: "",
    });
    setMenuName("");
    setMenuNameEn("");
    setMenuUrl("");
    setIconClass("");
    setValue({
      MenuImage: "",
    });
    setFileUpload([]);
  };

  const Cancel = () => {
    setId(0);
    setMenuName("");
    setMenuNameEn("");
    setIconClass("");
    setMenuUrl("");
    setParentId(0);
    setFiles("");
    setFileUpload("");
  };

  //#region Regex menu
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  //#endregion Regex menu

  const CMS_spMenu_List = async () => {
    ;
    try {
      setData([]);
      setDisable2(false);
      const pr = {
        MenuName: SearchValue.MenuName?.trim(),
        Id: 0,
        Creater: Creater,
        ParentId: ParentMenuId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "CMS_spMenu_List",
      };

      const list = await mainAction.API_spCallServer(params, dispatch);
      if (list.length > 0) {
        setData(list);
        setListData(list);
        setDisable2(true);
        return;
      }
      Alertwarning("Không có dữ liệu");
      ;
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
      setDisable2(true);
    }
  };

  const CMS_spMenu_Save = async () => {
    try {
      if (MenuName.trim() === "") {
        Alertwarning("Nhập Tên Menu(Tiếng Việt)");
        return;
      }

      if (MenuNameEn.trim() === "") {
        Alertwarning("Nhập Tên Menu(Tiếng Anh)");
        return;
      }

      if (
        specialCharRegex.test(MenuName) ||
        specialCharRegex.test(MenuNameEn)
      ) {
        Alertwarning("Tên không được có ký tự đặc biệt");
        return;
      }

      if (MenuUrl.trim() === "") {
        Alertwarning("MenuUrl không được để trống");
        return;
      }

      if (specialCharRegex.test(MenuUrl)) {
        Alertwarning("MenuUrl không được có ký tự đặc biệt");
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
        _newListImage = [newListImage, FromValue?.MenuImage || ""].join(",");
      } else if (typeof FileUpload === "string" || FileUpload.length === 0) {
        _newListImage = FromValue.MenuImage;
      } else if (!_newListImage) {
        Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
        setDisable(true);
        return;
      }

      let MenuImage = "";
      if (valueType.value === "img") {
        MenuImage = _newListImage;
      }

      const pr = {
        Id: Id,
        MenuName: MenuName,
        MenuNameEn: MenuNameEn,
        ParentId: FromValue.ParentId,
        ParentName: FromValue.ParentName,
        MenuUrl: ConvertToUrl(MenuUrl),
        IconClass: IconClass,
        MenuImage: _newListImage,
        TypeSetting: TypeSetting,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "CMS_spMenu_Save",
      };
      setDisable2(true);
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Cancel();
        setIsOpen(false);
        setListData(ListData);
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.ReturnMess);
        setDisable2(true);
        return;
      } else {
        ListData.map((e) => {
          if (e.Id === FromValue.Id) {
            e.MenuName = FromValue.MenuName;
            e.MenuNameEn = FromValue.MenuNameEn;
            e.ParentId = FromValue.ParentId;
            e.ParentName = FromValue.ParentName;
            e.MenuUrl = FromValue.MenuUrl;
            e.IconClass = FromValue.IconClass;
            e.MenuImage = _newListImage;
            e.TypeSetting = TypeSetting;
            e.IsHide = FromValue.IsHide;
            e.IsDelete = FromValue.IsDelete;
            e.TypeSettingName = valueType?.label;
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

  const Menu_View = (item) => {
    setIsOpen(true);
    const obView = item._original;
    setMenuName(obView.MenuName);
    setMenuNameEn(obView.MenuNameEn);
    setIconClass(obView.IconClass);
    setMenuUrl(obView.MenuUrl);
    setParentId(obView.ParentId);
    setId(obView.Id);
    setFromValue({
      Id: obView.Id,
      MenuName: obView.MenuName,
      MenuUrl: obView.MenuUrl,
      IconClass: obView.IconClass,
      IndexNumber: obView.IndexNumber,
      ParentId: obView.ParentId,
      ParentName: obView.ParentName,
      IsHide: obView.IsHide ? 1 : 0,
      IsDelete: obView.IsDelete ? 1 : 0,
      TypeSetting: obView.TypeSetting,
      MenuImage: obView.MenuImage,
    });
    setValue({
      MenuImage: obView.MenuImage,
    });
    if (obView.TypeSetting === "img") {
      setTypeSetting("img");
    }
    setValueType({
      value: item._original.TypeSetting,
      label: item._original.TypeSettingName,
    });
  };

  const CMS_spMenu_Delete = (item) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return <ConfirmAlertUi onClose={onClose} item={item} />;
      },
    });
  };

  const CMS_spMenu_Delete_Action = async (item) => {
    try {
      const pr = {
        Creater: Creater,
        CreateName: CreateName,
        Id: item._original.Id,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: " CMS_spMenu_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        CMS_spMenu_List();
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
          <i class="fa fa-undo"> </i> Hủy
        </button>
        <button
          className="btn btn-small btn-danger margin-left-5"
          onClick={() => {
            props.onClose();
            CMS_spMenu_Delete_Action(props.item);
          }}
        >
          <i class="fa fa-trash"> </i> Xóa
        </button>
      </div>
    );
  };

  const CMS_spMenu_Hide = async (item) => {
    const pr = {
      Creater: Creater,
      CreateName: CreateName,
      Id: item._original.Id,
    };

    const params = {
      Json: JSON.stringify(pr),
      func: "CMS_spMenu_Hide",
    };
    const result = await mainAction.API_spCallServer(params, dispatch);
    Alertsuccess(result.ReturnMess);
    let newData = Data.map((x) => {
      if (x.Id === item._original.Id) {
        return { ...x, IsHide: !x.IsHide };
      }
      return x;
    });
    setData(newData);
  };

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
  const CMS_spMenu_ChangeIndex = async (item, key) => {
    try {
      let Data = item.row._original,
        _IndexNumber = 0;
      if (key === "down") {
        _IndexNumber = Data.IndexNumber - 1;
      } else {
        _IndexNumber = Data.IndexNumber + 1;
      }

      let datatmp = ListData.find((e) => e.Id === Data.Id);
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
      Id: item.Id,
      IndexNumber: item.IndexNumber,
    }));
    const params = {
      Json: JSON.stringify(extractedData),
      func: "CMS_spMenu_ChangeIndex",
    };
    const result = await mainAction.API_spCallServer(params, dispatch);
  };

  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setmodalIsOpenPass(false);
  };
  const VideAdd = () => {
    openModal();
  };
  const columns = [
    {
      Header: "Tùy chọn",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div>
          <button
            type="button"
            title="Sửa"
            className="btn btn-secondary btn-sm m-1 btn-add"
            onClick={(e) => Menu_View(row)}
          >
            <i className="fa fa-edit"></i>
          </button>

          <button
            type="button"
            title="Xóa"
            className="btn btn-danger btn-sm m-1 btn-add"
            onClick={(e) => CMS_spMenu_Delete(row)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </div>
      ),
    },
    {
      Header: "Thứ tự",
      accessor: "IndexNumber",
      filterable: false,
      width: 120,
      Cell: ({ row }) => {
        return (
          <>
            <div className="d-flex justify-content-center ">
              <div>
                <button
                  className="border-0"
                  type="button"
                  onClick={(e) => CMS_spMenu_ChangeIndex({ row }, "up")}
                >
                  <i class="fas fa-chevron-circle-up text-info"></i>
                </button>
              </div>
              <span className="px-3">{row._original.IndexNumber} </span>
              <div>
                <button
                  className="border-0"
                  type="button"
                  onClick={(e) => CMS_spMenu_ChangeIndex({ row }, "down")}
                >
                  <i class="fas fa-chevron-circle-down text-info"></i>
                </button>
              </div>
            </div>
          </>
        );
      },
    },
    {
      Header: "Ẩn Hiện",
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
              onClick={(e) => CMS_spMenu_Hide(row)}
            >
              {" "}
              <i
                class={row._original.IsHide ? "fa fa-eye" : "fas fa-eye-slash"}
              ></i>{" "}
              {row._original.IsHide ? "Ẩn" : " Bỏ Ẩn"}
            </button>{" "}
          </>
        </div>
      ),
    },
    {
      Header: "Image",
      accessor: "MenuImage",
      filterable: false,
      className: "text-center",
      Cell: ({ row }) => {
        return (
          <>
            {row.MenuImage !== undefined &&
            row.MenuImage !== "" &&
            row.MenuImage !== null
              ? row._original.MenuImage.split(",").map((img, index) => {
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
      Header: "Tên Menu",
      accessor: "MenuName",
    },
    {
      Header: "Menu tiếng anh",
      accessor: "MenuNameEn",
    },
    {
      Header: "Url",
      accessor: "MenuUrl",
    },
    {
      Header: "Parent Menu",
      accessor: "ParentName",
    },
    {
      Header: "ClassIcon",
      accessor: "IconClass",
    },
  ];

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header">
          <span className="HomeTitle">Quản lý menu</span>
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
              Thêm menu
            </button>
            <button
              onClick={(e) => {
                CMS_spMenu_List();
                setParentMenuId([]);
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
          <div className="row" style={{ marginTop: "-15px" }}>
            <div className="col-md-8"></div>
            <div className="col-md-4">
              <div className="form-group">
                <span className="small">
                  Danh mục <span className="red"> (*)</span>
                </span>
                <SelectMenu
                  onSelected={(e) => setParentMenuId(e.value)}
                  items={ParentMenuId}
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
            <div class="">
              {FromValue.Id === 0 ? "Thêm mới menu" : "Chỉnh sửa menu "}
            </div>
          </Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={closeModal}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div class="card-body p-0">
            <div class="row">
              <div className="col-xs-12 col-md-6 m-auto">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    Tên menu(Tiếng Việt)
                    <strong className="check-point">(*)</strong>
                  </span>
                  <input
                    type="text"
                    class="form-control2"
                    value={MenuName}
                    onChange={(e) => setMenuName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-xs-12 col-md-6 m-auto">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    Tên menu(Tiếng Anh)
                    <strong className="check-point">(*)</strong>
                  </span>
                  <input
                    type="text"
                    class="form-control2"
                    value={MenuNameEn}
                    onChange={(e) => setMenuNameEn(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-xs-12 col-md-6 m-10">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    Url<strong className="check-point">(*)</strong>
                  </span>
                  <input
                    type="text"
                    class="form-control2"
                    value={MenuUrl}
                    placeholder="ex: gioi-thieu"
                    onChange={(e) => setMenuUrl(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-xs-12 col-md-6 m-auto">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    Parent Menu<strong className="check-point">(*)</strong>
                  </span>
                  <Select
                    onChange={(e) => {
                      setFromValue({
                        ...FromValue,
                        ParentId: e.value,
                        ParentName: e.label,
                      });
                    }}
                    placeholder=""
                    options={parentMenu}
                    value={{
                      value: FromValue?.ParentId,
                      label: FromValue?.ParentName,
                    }}
                  />
                </div>
              </div>
              <div className="col-xs-12 col-md-6 m-auto">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    ClassIcon
                  </span>
                  <input
                    type="text"
                    class="form-control2"
                    value={IconClass}
                    onChange={(e) => setIconClass(e.target.value)}
                  />
                </div>
              </div>
              {TypeSetting === "img" && (
                <div className="col-xs-12 col-md-6 m-auto">
                  <span className="small font-weight-bold text-muted">
                    Upload Hình Ảnh || Logo
                    <span className="text-danger">
                      (jpg, jpeg, png || Có thể thêm nhiều ảnh)
                    </span>
                  </span>
                  <ImgMutilUpload
                    onImageUpload={(e) => setFileUpload(e)}
                    onData={(e) => setFromValue({ ...FromValue, MenuImage: e })}
                    data={FromValue.MenuImage}
                    isMutil={true}
                  />
                </div>
              )}
              <div class="col-sm-12 col-md-12 mt-2">
                <button
                  onClick={() => {
                    ClearForm();
                    setFileUpload([]);
                    Cancel();
                  }}
                  type="button"
                  class="btn btn-sm btn-danger pull-right margin-left-5"
                >
                  <i class="fa fa-trash pr-2"></i>
                  Hủy
                </button>

                <button
                  type="button"
                  class="btn btn-sm btn-success pull-right"
                  onClick={CMS_spMenu_Save}
                >
                  <i class="fa fa-edit pr-2"></i>
                  {FromValue.Id === 0 ? " Thêm mới" : "Chỉnh sửa"}
                </button>
              </div>
              <div class="col-sm-12 col-md-12">
                <div class="form-group">
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
  );
};

export default MenuManagement;

import React, { useState, useEffect } from "react";
import I18n from "../../../../Language";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  GetDataFromLogin,
  FormatDateJson,
  ConfirmAlert,
} from "../../../../Utils";
import {
  SelectParent,
  SelectsLevel,
  DataTable,
  SelectModule,
} from "../../../../Common";

export const MenuModule = () => {
  //#regon begin using the effect hook
  useEffect(() => {}, []);
  ///tab hiện thị sửa trên table
  const [tittle, setTitle] = useState(I18n.t("MenuModule.MANAGEMENUMODULE"));
  const [LoadMenu, setLoadMenu] = useState(0);
  //transmission CreateName,EditName

  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  let datapermisstion = localStorage.getItem("Permissioninfor"); //check quyền

  //LoadMenu
  const onSelectMenuu = (ParentId) => {
    setParentId(ParentId);
  };
  //LoadsLevell
  const [sLevell, setsLevell] = useState(-1);
  const onSelectsLevell = (sLevell) => {
    setsLevell(sLevell);
  };
  //Save
  const dispatch = useDispatch();
  const [MenuId, setMenuId] = useState(0);
  const [MenuName, setMenuName] = useState("");
  const [MenuName_en, setMenuName_en] = useState("");
  const [ControllerName, setControllerName] = useState("");
  const [ActionName, setActionName] = useState("");
  const [ClassName, setClassName] = useState("");
  const [IconLink, setIconLink] = useState("");
  const [ModuleType, setModuleType] = useState("");
  const [sLevel, setsLevel] = useState("");
  const [ParentId, setParentId] = useState("");
  const [Numbers, setNumbers] = useState("");
  //const[Creater,setCreater] = useState('');
  const [Keys, setKeys] = useState("");
  const Accountinfor = JSON.parse(
    localStorage.getItem("Accountinfor") === ""
      ? "{}"
      : localStorage.getItem("Accountinfor")
  );

  // save
  const Trl_spMenuModule_Save = async () => {
    // if (MenuName === "") {
    //     Alertwarning(I18n.t("validate.PleaseSelectMenumodule!"));
    //     return;
    // }
    if (MenuName === "") {
      Alertwarning(I18n.t("validate.PleaseEnterMenuName!"));
      return;
    }
    if (MenuName_en === "") {
      Alertwarning(I18n.t("validate.PleaseEnterMenuName_en!"));
      return;
    }
    // if (sLevell === "") {
    //     Alertwarning(I18n.t("validate.PleaseSelectsLevelName!"));
    //     return;
    // }
    if (Numbers === "") {
      Alertwarning(I18n.t("validate.PleaseEnterNumbers!"));
      return;
    }
    const pr = {
      MenuId: MenuId,
      MenuName: MenuName,
      MenuName_en: MenuName_en,
      ControllerName: ControllerName,
      ActionName: ActionName,
      ClassName: ClassName,
      IconLink: IconLink,
      ModuleType: ModuleType,
      sLevel: sLevell,
      ParentId: ParentId,
      Numbers: Numbers,
      Creater: Creater,
      CreaterName: CreateName,
      Keys: Keys,
    };
    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spMenuModule_Save",
    };
    //khóa nút

    try {
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
      } else {
        Alerterror(result.ReturnMess);
      }
    } catch (error) {
      //setdisbtn(false);
      Alerterror(I18n.t("validate.Dataerror,pleasecontactIT!"));
    }
  };
  //LIST
  const [DataMenuModule, setDataMenuModule] = useState([]);
  const Trl_spMenuModule_List = async () => {
    //kiem tra quyen xem

    const pr = {
      Json: JSON.stringify({
        MenuId: MenuId,
        AccountId: Creater,
        Creater: Creater,
      }),

      func: "Trl_spMenuModule_List",
    };
    //  //khóa nút
    //setdisbtn(true);
    try {
      const result = await mainAction.API_spCallServer(pr, dispatch);
      setDataMenuModule(result);
    } catch (error) {
      Alerterror(I18n.t("validate.apierror!"));
    }
  };
  // ///edit
  const clickEdit = (data) => {
    setTitle(I18n.t("MenuModule.EDITMENUMODULE"));
    const editobj = data.row.original; //ĐỐI tượng
    setMenuId(editobj.MenuId);
    setMenuName(editobj.MenuName);
    setMenuName_en(editobj.MenuName_en);
    setActionName(editobj.ActionName);
    setClassName(editobj.ClassName);
    setIconLink(editobj.IconLink);
    setModuleType(editobj.ModuleType);
    setsLevell(editobj.sLevel);
    setParentId(editobj.ParentId);
    setNumbers(editobj.Numbers);
    setControllerName(editobj.ControllerName);
    document.querySelector("#tab_1").click();
  };
  // Begin cancel
  const Trl_spMenuModule_Cancel = () => {
    setMenuName("");
    setMenuId(0);
    setMenuName_en("");
    setControllerName("");
    setActionName("");
    setClassName("");
    setIconLink("");
    setModuleType("");
    setsLevell("");
    setParentId("");
    setNumbers("");
    setKeys("");
    setTitle(I18n.t("MenuModule.ADDNEWMANAGEMENUMODULE"));
  };

  //delete Item xóa từng dòng
  const [IsDelete, setIsDelete] = useState();
  useEffect(() => {
    if (IsDelete === undefined) return;
    const row = IsDelete.Item;
    const dataold = [...DataMenuModule];
    clickDelete(row, dataold);
  }, [IsDelete]);

  //numberrandom xóa khi cancel
  const clickDeleteSmall = (item) => {
    const numberrandom = Math.random();
    setIsDelete({ IsActive: numberrandom, Item: item });
  };

  //delete .row
  const clickDelete = (data, dataold) => {
    if (data === undefined) return;
    const editobj = data.row.original;

    ConfirmAlert(
      "Hide Show Menu",
      "Are you sure you want to change?",
      async () => {
        const pr = {
          MenuId: editobj.MenuId,
          CreateId: Creater,
        };
        //hàm delete
        const params = {
          JSON: JSON.stringify(pr),
          func: "Trl_spMenuModule_Delete",
        };
        try {
          const result = await mainAction.API_spCallServer(params, dispatch);
          if (result.Status === "OK") {
            //Status,OK SQL save,để xóa đc hàm
            Alertsuccess(result.ReturnMess);
            //xóa đối tựng trong mảng
            const datadelete = dataold.find((p) => p.MenuId === editobj.MenuId);
            datadelete.State = datadelete.State === 0 ? 2 : 0;

            const datanew = dataold.filter((p) => p.MenuId !== editobj.MenuId);
            datanew.push(datadelete);
            setDataMenuModule(datanew);
          } else {
            Alerterror(result.ReturnMess);
          }
        } catch (error) {
          Alerterror(I18n.t("validate.apierror!"));
        }
      }
    );
  };

  ///coloums
  const columns = [
    {
      Header: I18n.t("System.Option"),
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 100,
      filterable: false,
      special: true,
      show: true,
      accessor: "MenuId",
      Cell: (row) => (
        // <div>
        <span>
          <button
            data-tooltip={I18n.t("AccountGroup.Edit")}
            className="btn btn-sm btn-success mr-2 show__tip__left"
            onClick={(e) => clickEdit({ row })}
          >
            <i className="fas fa-wrench"></i>
          </button>
          <button
            data-tooltip={I18n.t("MenuModule.Hide/Show")}
            className={
              row.original.State === 0
                ? "btn btn-sm btn-warning show__tip__right"
                : "btn btn-sm btn-danger  show__tip__right"
            }
            onClick={(e) => clickDeleteSmall({ row })} ////xóa từng dòng
          >
            <i className="fa fa-eye"></i>
          </button>
        </span>

        // </div>
      ),
    },
    {
      Header: I18n.t("Report.STT"),
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 50,
      //filterable: false,
      special: true, ///loại bỏ checkbox ra khi chọn nút cài đăt
      show: true, //
    },

    {
      Header: I18n.t("MenuModule.MenuId"),
      accessor: "MenuId",
      width: 80,
      //filterable: false,
      //sortable: false,
    },
    {
      Header: I18n.t("MenuModule.sLevelName"),
      accessor: "sLevelName",
      width: 120,
      // filterable: false,
      //sortable: false,
    },
    {
      Header: I18n.t("MenuModule.Numbers"),
      accessor: "Numbers",
      //filterable: false,
      //sortable: false,
    },
    {
      Header: I18n.t("MenuModule.ParentName"),
      accessor: "ParentName",
      width: 140,
      //filterable: false,
      //sortable: false,
    },
    {
      Header: I18n.t("MenuModule.MenuName"),
      accessor: "MenuName",
      //filterable: false,
      //sortable: false,
    },
    {
      Header: I18n.t("MenuModule.MenuName_en"),
      accessor: "MenuName_en",
      //filterable: false,
      //sortable: false,
    },
    {
      Header: I18n.t("MenuModule.ControllerName"),
      accessor: "ControllerName",
      //filterable: false,
      //sortable: false,
    },
    {
      Header: I18n.t("MenuModule.ActionName"),
      accessor: "ActionName",
      //filterable: false,
      //sortable: false,
    },
    {
      Header: I18n.t("MenuModule.IconLink"),
      accessor: "IconLink",
      //filterable: false,
      //sortable: false,
    },
    {
      Header: I18n.t("MenuModule.ClassName"),
      accessor: "ClassName",
      //filterable: false,
      //sortable: false,
    },
    {
      Header: I18n.t("MenuModule.Keys"),
      accessor: "Keys",
      //filterable: false,
      //sortable: false,
    },

    {
      Header: I18n.t("MenuModule.EditName"),
      accessor: "EditerName",
      //filterable: false,
      //sortable: false,
    },
    {
      Header: I18n.t("MenuModule.EditTime"),
      accessor: "EditTime",
      Cell: (obj) => FormatDateJson(obj.value),
      //filterable: false,
      //sortable: false,
    },
    {
      Header: I18n.t("MenuModule.Create"),
      accessor: "CreaterName",
      //filterable: false,
      // sortable: false,
    },
    {
      Header: I18n.t("MenuModule.CreateTime"),
      accessor: "CreateTime",
      Cell: (obj) => FormatDateJson(obj.value),
      width: 180,
      // filterable: false,
      //sortable: false,
    },
  ];
  //#end region

  return (
    <>
      <div className="content-wrapper pt-2">
        <section className="content">
          <div className="container-fluid">
            <div className="card card-primary">
              {/* Navbar */}
              <ul className="nav float-left">
                <li className="nav-item">
                  <a
                    id="tab_1"
                    className="nav-link active"
                    href="#tab_1add"
                    data-toggle="tab"
                  >
                    {I18n.t("System.Add")}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link " href="#tab_2" data-toggle="tab">
                    {I18n.t("System.List")}
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
                    {/* Header */}
                    <div className="card-header">
                      <div className="row">
                        <div className="col-md-6">
                          <h3 className="card-title">
                            <i className="fas fa-plus" />
                            <span className="font-weight-bold">{tittle}</span>
                          </h3>
                        </div>
                        <div className="col-md-6 card-header-btn">
                          <a
                            className="btn btn-danger btn-sm float-right btn-header"
                            onClick={(a) => Trl_spMenuModule_Cancel(a)} ///function k lỗi
                          >
                            <i className="fa fa-trash mr-2 " />
                            {I18n.t("System.Cancel")}
                          </a>
                          <a
                            className="btn btn-success btn-sm float-right btn-header"
                            onClick={(a) => Trl_spMenuModule_Save(a)}
                            //disbtn={!disbtn}
                          >
                            <i className="fa fa-folder mr-2 " />
                            {I18n.t("System.Save")}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="card-body-form col-md-12">
                      <div className="row pb-3  mt-3">
                        <div className="col-md-3 col-sm-6">
                          <div className="form-group">
                            <label className="form__title">
                              {I18n.t("MenuModule.SelectModuleType")}{" "}
                              <span className="form__title__note"></span>
                            </label>
                            <SelectModule
                              onSelected={(e) => setModuleType(e.value)}
                              val={ModuleType}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="form-group">
                            <label className="form__title">
                              {I18n.t("MenuModule.SelectMenuModule")}{" "}
                              <span className="form__title__note"></span>
                            </label>
                            <SelectParent
                              onSelected={(e) => onSelectMenuu(e.value)}
                              onMenuId={ParentId}
                              items={ParentId}
                              MenuId={LoadMenu}
                              ModuleType={ModuleType}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="form-group">
                            <label className="form__title">
                              {I18n.t("MenuModule.SLevelName")}{" "}
                              <span className="form__title__note">(*)</span>
                            </label>
                            <SelectsLevel
                              onSelected={(e) => onSelectsLevell(e.value)}
                              onMenuId={sLevell}
                              items={sLevell}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="form-group">
                            <label className="form__title">
                              {I18n.t("MenuModule.MenuName")}
                              <span className="form__title__note">(*)</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => setMenuName(e.target.value)}
                              value={MenuName}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="form-group">
                            <label className="form__title">
                              {I18n.t("MenuModule.MenuName_en")}
                              <span className="form__title__note">(*)</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => setMenuName_en(e.target.value)}
                              value={MenuName_en}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="form-group">
                            <label className="form__title">
                              {I18n.t("MenuModule.Numbers")}
                              <span className="form__title__note">(*)</span>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => setNumbers(e.target.value)}
                              value={Numbers}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="form-group">
                            <label className="form__title">
                              {I18n.t("MenuModule.ControllerName")}
                              <span className="form__title__note"></span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) =>
                                setControllerName(e.target.value)
                              }
                              value={ControllerName}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="form-group">
                            <label className="form__title">
                              {I18n.t("MenuModule.ActionName")}
                              <span className="form__title__note"></span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => setActionName(e.target.value)}
                              value={ActionName}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="form-group">
                            <label className="form__title">
                              {I18n.t("MenuModule.ClassName")}
                              <span className="form__title__note"></span>
                            </label>
                            <input
                              type="text"
                              //disabled
                              className="form-control"
                              placeholder=""
                              onChange={(e) => setClassName(e.target.value)}
                              value={ClassName} //nhận kq ở ô này
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="form-group">
                            <label className="form__title">
                              {I18n.t("MenuModule.IconLink")}
                              <span className="form__title__note"></span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => setIconLink(e.target.value)}
                              value={IconLink}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-9">
                          <div className="form-group">
                            <label className="form__title">
                              {I18n.t("MenuModule.Keys")}
                              <span className="form__title__note"></span>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="To check permissions in controller instead of MenuId"
                              onChange={(e) => setKeys(e.target.value)}
                              value={Keys}
                            />
                          </div>
                        </div>
                      </div>
                      <div></div>
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
                        <div className="col-md-8">
                          <h3 className="card-title">
                            <i className="fa fa-bars" />
                            <span className="font-weight-bold">
                              {I18n.t("MenuModule.MENUMODULELIST")} (
                              {DataMenuModule.length})
                            </span>
                            <div className="col-md-4"></div>
                          </h3>
                        </div>
                        <div className="col-md-4 card-header-btn">
                          <a
                            className="btn btn-primary btn-sm float-right btn-header"
                            onClick={(a) => Trl_spMenuModule_List(a)}
                          >
                            <i className="fa fa-eye mr-2" />
                            {I18n.t("System.View")}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="row" style={{ margin: "10px" }}>
                      <div className="col-md-2">
                        <span
                          className="float:left"
                          style={{ fontSize: "14px" }}
                        >
                          {" "}
                          <i className="fa fa-sticky-note icon-E16769"></i>{" "}
                          {I18n.t("MenuModule.NOTE")}:
                        </span>
                      </div>
                      <div className="col-md-5">
                        <span
                          className="float:left"
                          style={{ fontSize: "14px" }}
                        >
                          {" "}
                          <i
                            className="fa fa-circle icon-16ACBB"
                            style={{ color: "#ffc107" }}
                          ></i>{" "}
                          {I18n.t(
                            "MenuModule.Yellowistoshowthemenu(Notyethidden)"
                          )}
                        </span>
                      </div>
                      <div className="col-md-5">
                        <span
                          className="float:left"
                          style={{ fontSize: "14px" }}
                        >
                          {" "}
                          <i
                            className="fa fa-circle icon-16ACBB"
                            style={{ color: "#ffcbcb " }}
                          ></i>{" "}
                          {I18n.t("MenuModule.Redhashiddenmenu(Hidedone)")}
                        </span>
                      </div>
                    </div>

                    <div
                      className={
                        DataMenuModule.length > 0 ? "mt-5" : "display-none"
                      }
                    >
                      <DataTable data={DataMenuModule} columns={columns} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

import React, { useState, useEffect } from "react";
import I18n from "../../../../Language";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import { DataTable } from "../../../../Common/DataTable";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  FormatDateJson,
} from "../../../../Utils";
import { SelectStaff } from "../../../../Common";
import { ConfirmAlert } from "../../../../Utils";
import { data } from "jquery";

export const MenuModulePermission = () => {
  //#regon begin using the effect hook
  let IsEffect = 1;
  let keyLang = localStorage.getItem("keyLang");
  if (keyLang === "EN") {
    IsEffect++;
    I18n.defaultLocale = "vn";
    I18n.locale = "en";
    I18n.fallbacks = true;
  } else {
    I18n.defaultLocale = "en";
    I18n.locale = "vn";
    I18n.fallbacks = true;
  }
  useEffect(() => {
    WH_spMenuModule_Permission_List(0, "VN");
  }, [IsEffect]);

  let datapermisstion = localStorage.getItem("Permissioninfor");
  const Creater = localStorage.getItem("CreateBy");
  const CreaterName = localStorage.getItem("CreateName"); //check quyền
  //LoadMenu
  const [MenuId, setMenuId] = useState(-1);
  const [KeyLanguage, setKeyLanguage] = useState("VN");
  //load Account
  const onSelectStaff = (AccountId) => {
    setAccountId(AccountId);
    WH_spMenuModule_Permission_List(AccountId);
  };

  //load Parent
  const [ParentId, setParentId] = useState("");

  //load Account
  const onSelectStafft = (AccountIdd) => {
    setAccountIdd(AccountIdd);
    WH_spMenuModule_Permission_List(AccountIdd, "VN");
  };

  ///SAVE
  //Save
  const dispatch = useDispatch();
  const [Id, setId] = useState(0);
  const [WH_tblMenuModuleId, setWH_tblMenuModuleId] = useState("");
  const [Edits, setEdits] = useState("");
  const [Adds, setAdds] = useState("");
  const [Deletes, setDeletes] = useState("");
  const [Views, setViews] = useState("");
  const [Excel, setExcel] = useState("");
  const [UpExcel, setUpExcel] = useState("");
  const [Special, setSpecial] = useState("");
  const [AccountId, setAccountId] = useState("");
  const [AccountIdd, setAccountIdd] = useState("");
  const [State, setState] = useState("");
  const [dataarray, setdataarray] = useState("");
  const [DepartmentID, setDepartmentID] = useState(0);

  // save
  const Trl_spMenuModule_Permission_Save = async () => {
    //kiem tra quyen luu

    if (AccountId === "" || AccountId === 0) {
      Alertwarning(I18n.t("validate.Pleasechooseauthorizedaccount!"));
      return;
    }
    const pr = {
      AccountId: AccountId,
      CreateId: Creater,
      CreaterName: CreaterName,
      ListMenu: DataMenuModule.map((item, index) => {
        return {
          MenuId: item.MenuId,
          Adds: item.Adds,
          Edits: item.Edits,
          Deletes: item.Deletes,
          Views: item.Views,
          Excel: item.Excel,
          UpExcel: item.UpExcel,
          Special: item.Special,
        };
      }),
    };

    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spMenuModule_Permission_Save",
    };

    try {
      const result = await mainAction.API_spCallServer(params, dispatch);

      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Tr_spMenuModule_Permission_Cancel();
      } else {
        Alerterror(result.ReturnMess);
      }
    } catch (error) {
      Alerterror(I18n.t("validate.Dataerror,pleasecontactIT!"));
    }
  };
  //LIST
  const [DataMenuModule, setDataMenuModule] = useState([]);
  const WH_spMenuModule_Permission_List = async (AccountId, KeyLanguage) => {
    ;
    const pr = {
      Json: JSON.stringify({
        Id: Id,
        MenuId: 0,
        AccountId: AccountId,
        Creater: Creater,
        KeyLanguage: KeyLanguage,
      }),

      func: "Trl_spMenuModule_Permission_List",
    };
    //  //khóa nút
    //setdisbtn(true);
    try {
      const result = await mainAction.API_spCallServer(pr, dispatch);
      //setdisbtn(false);
      setDataMenuModule(result);
    } catch (error) {
      //setdisbtn(false);
      Alerterror(I18n.t("validate.apierror!"));
    }
  };
  // Begin cancel
  const Tr_spMenuModule_Permission_Cancel = () => {
    setMenuId(0);
    setId(0);
    setAccountIdd(0);
    onSelectStaff(0);
    setAccountId(0);
    setParentId("");
  };

  //adds
  const [mnAdds, setmnAdds] = useState();
  const MenuAdds = (item) => {
    const Add = item.Adds === "C" ? "K" : "C";
    const datanew = [...DataMenuModule];
    datanew.find((p) => p.MenuId === item.MenuId).Adds = Add;
    setDataMenuModule(datanew);
  };
  useEffect(() => {}, [mnAdds]);

  //edit
  const [mnEdits, setmnEdits] = useState();
  const MenuEdits = (item) => {
    const Edits = item.Edits === "C" ? "K" : "C";
    const datanew = [...DataMenuModule];
    datanew.find((p) => p.MenuId === item.MenuId).Edits = Edits;
    setDataMenuModule(datanew);
  };
  useEffect(() => {}, [mnEdits]);

  //delete
  const [MnDeletes, setMnDeletes] = useState();
  const MenuDeletes = (item) => {
    const Deletes = item.Deletes === "C" ? "K" : "C";
    const datanew = [...DataMenuModule];
    datanew.find((p) => p.MenuId === item.MenuId).Deletes = Deletes;
    setDataMenuModule(datanew);
  };
  useEffect(() => {}, [MnDeletes]);
  //Views
  const [MnViews, setMnViews] = useState();
  const MenuViews = (item) => {
    const Views = item.Views === "C" ? "K" : "C";
    const datanew = [...DataMenuModule];
    datanew.find((p) => p.MenuId === item.MenuId).Views = Views;
    setDataMenuModule(datanew);
  };
  useEffect(() => {}, [MnViews]);
  //Excel
  const [MnExcel, setMnExcel] = useState();
  const MenuExcel = (item) => {
    const Excel = item.Excel === "C" ? "K" : "C";
    const datanew = [...DataMenuModule];
    datanew.find((p) => p.MenuId === item.MenuId).Excel = Excel;
    setDataMenuModule(datanew);
  };
  useEffect(() => {}, [MnExcel]);

  //UpExcel
  const [MnUpExcel, setMnUpExcel] = useState();
  const MenuUpExcel = (item) => {
    const UpExcel = item.UpExcel === "C" ? "K" : "C";
    const datanew = [...DataMenuModule];
    datanew.find((p) => p.MenuId === item.MenuId).UpExcel = UpExcel;
    setDataMenuModule(datanew);
  };
  useEffect(() => {}, [MnUpExcel]);

  //Special
  const [MnSpecial, setMnSpecial] = useState();
  const MenuSpecial = (item) => {
    const Special = item.Special === "C" ? "K" : "C";
    const datanew = [...DataMenuModule];
    datanew.find((p) => p.MenuId === item.MenuId).Special = Special;
    setDataMenuModule(datanew);
  };

  return (
    <>
      <div className="content-wrapper pt-2">
        <section className="content">
          <div className="container-fluid">
            <div className="card card-primary">
              <div className="card-header">
                <div className="row">
                  <div className="col-md-6">
                    <h3 className="card-title">
                      <i className="fa fa-bars" />
                      <span className="font-weight-bold">
                        {I18n.t("MenuModulePermission.Decentralization")} (
                        {DataMenuModule.length})
                      </span>
                    </h3>
                  </div>
                  <div className="col-md-6 card-header-btn">
                    <a
                      className="btn btn-danger btn-sm float-right btn-header"
                      onClick={(a) => Trl_spMenuModule_Permission_Save(a)}
                    >
                      <i className="fa fa-key" />{" "}
                      {I18n.t("MenuModulePermission.Decentralization")}
                    </a>
                  </div>
                </div>
              </div>
              {/* Begin Account Group Card */}
              <div className="body-padding">
                <div className="tab-content" id="custom-tabs-two-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="tab_1add"
                    role="tabpanel"
                    aria-labelledby="custom-tabs-two-home-tab"
                  >
                    {/* Header */}
                    <div className="card-body-form col-md-22">
                      <div className="row pb-12 mt-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form__title">
                              Chọn nhân viên{" "}
                              <span className="form__title__note"></span>
                            </label>
                            <SelectStaff
                              onSelected={(e) => onSelectStaff(e.value)}
                              onAccountId={AccountId}
                              items={AccountId}
                              BranchId={0}
                              DepartmentId={0}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form__title">
                              Chọn nhân vien coppy quyền{" "}
                              <span className="form__title__note"></span>
                            </label>
                            <SelectStaff
                              onSelected={(e) => onSelectStafft(e.value)}
                              onAccountId={AccountIdd}
                              items={AccountIdd}
                              BranchId={0}
                              DepartmentId={DepartmentID}
                            />
                          </div>
                        </div>
                      </div>
                      <div></div>
                    </div>
                    <div>
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <h3 style={{ fontSize: "20px", color: "darkgreen" }}>
                            {" "}
                          </h3>
                        </div>
                        <div className="col-md-6">
                          <div className="row" style={{ fontSize: "13px" }}>
                            <div className="col-md-2 text-center">
                              <div>1</div>
                              <div>Thêm</div>
                            </div>

                            <div className="col-md-2 text-center">
                              <div>2</div>
                              <div>Sửa</div>
                            </div>
                            <div className="col-md-2 text-center">
                              <div>3</div>
                              <div>Xóa</div>
                            </div>
                            <div className="col-md-2 text-center">
                              <div>4</div>
                              <div>Xem</div>
                            </div>

                            <div className="col-md-2 text-center">
                              <div>5</div>
                              <div>XuấtExecl</div>
                            </div>
                            {/*   <div className="col-md-2 text-center">
                                                        <div>5</div>
                                                        <div>UpExcel</div>

                                                    </div> */}
                            {/*  <div className="col-md-2 text-center">
                                                        <div>7</div>
                                                        <div>Đặc biệt</div>
                                                    </div> */}
                          </div>
                        </div>
                      </div>
                      {
                        //cha
                        DataMenuModule.filter((p) => p.sLevel === 1).map(
                          (item, index) => {
                            return (
                              <div>
                                <div
                                  className="row Perrow"
                                  key={"Parent" + index}
                                >
                                  <div className="col-md-6">
                                    <h3
                                      style={{
                                        color:
                                          item.ActionName === ""
                                            ? "red"
                                            : "#009688",
                                        fontSize: "16px",
                                        marginLeft: "15px",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {index + 1}. {item.MenuName}
                                    </h3>
                                  </div>
                                  {item.ActionName !== "" ? (
                                    <div className="col-md-6">
                                      <div className="row">
                                        <div className="col-md-2 text-center">
                                          <div
                                            onClick={(e) => MenuAdds(item)}
                                            className="icheck-success d-inline"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={
                                                item.Adds === "C" ? true : false
                                              }
                                              class="Permition"
                                              onChange={(e) => MenuAdds(item)}
                                              title="Thêm"
                                            />
                                            <label className="label checkbox icheck-success d-inline"></label>
                                          </div>
                                        </div>

                                        <div className="col-md-2 margin-bottom:20px text-center">
                                          <div
                                            onClick={(e) => MenuEdits(item)}
                                            className="icheck-success d-inline"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={
                                                item.Edits === "C"
                                                  ? true
                                                  : false
                                              }
                                              class="Permition"
                                              onChange={(e) => MenuEdits(item)}
                                              title="Sửa"
                                            />
                                            <label className="label checkbox icheck-success d-inline"></label>
                                          </div>
                                        </div>
                                        <div className="col-md-2 margin-bottom:20px text-center">
                                          <div
                                            onClick={(e) => MenuDeletes(item)}
                                            className="icheck-success d-inline"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={
                                                item.Deletes === "C"
                                                  ? true
                                                  : false
                                              }
                                              class="Permition"
                                              onChange={(e) =>
                                                MenuDeletes(item)
                                              }
                                              title="Xóa"
                                            />
                                            <label className="label checkbox icheck-success d-inline"></label>
                                          </div>
                                        </div>
                                        <div className="col-md-2  text-center">
                                          <div
                                            onClick={(e) => MenuViews(item)}
                                            className="icheck-success d-inline"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={
                                                item.Views === "C"
                                                  ? true
                                                  : false
                                              }
                                              class="Permition"
                                              onChange={(e) => MenuViews(item)}
                                              title="Xem"
                                            />
                                            <label className="label checkbox icheck-success d-inline"></label>
                                          </div>
                                        </div>
                                        <div className="col-md-2  d-inline text-center">
                                          <div
                                            onClick={(e) => MenuExcel(item)}
                                            className="icheck-success d-inline"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={
                                                item.Excel === "C"
                                                  ? true
                                                  : false
                                              }
                                              class="Permition"
                                              onChange={(e) => MenuExcel(item)}
                                              title="Up"
                                            />
                                            <label className="label checkbox icheck-success d-inline"></label>
                                          </div>
                                        </div>
                                        {/*   <div className="col-md-2  text-center">
                                                                            <div onClick={e => MenuUpExcel(item)} className="icheck-success d-inline">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={item.UpExcel === 'C' ? true : false}
                                                                                    class="Permition"
                                                                                    onChange={e => MenuUpExcel(item)}
                                                                                    title='Xuất Excel'
                                                                                />
                                                                                <label className="label checkbox icheck-success d-inline"></label>
                                                                            </div>
                                                                        </div> */}
                                        {/*  <div className="col-md-2 i text-center">
                                                                            <div onClick={e => MenuSpecial(item)} className="icheck-success d-inline">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={item.Special === 'C' ? true : false}
                                                                                    class="Permition"
                                                                                    onChange={e => MenuSpecial(item)}
                                                                                    title='Đặc biệt'
                                                                                />
                                                                                <label className="label checkbox icheck-success d-inline"></label>
                                                                            </div>
                                                                        </div> */}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="col-md-6">
                                      <div className="row">
                                        <div className=" col-md-2 icheck-success d-inline text-center"></div>
                                        <div className="col-md-2 icheck-success d-inline text-center"></div>
                                        <div className="col-md-2 icheck-success d-inline text-center"></div>
                                        <div className="col-md-2 icheck-success d-inline text-center"></div>

                                        <div className="col-md-2 icheck-success d-inline text-center"></div>
                                        {/*  <div className="col-md-2 icheck-success d-inline text-center">

                                                                        </div> */}
                                        {/*  <div className="col-md-2 icheck-success d-inline text-center">

                                                                        </div> */}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  {
                                    ///con
                                    DataMenuModule.filter(
                                      (p) =>
                                        p.ParentId === item.MenuId &&
                                        p.sLevel !== 1
                                    ).map((itemmenu, indexmenu) => {
                                      return (
                                        <>
                                          <div
                                            className="row Perrow"
                                            key={"MenuModule" + indexmenu}
                                            style={{ paddingBottom: "8px" }}
                                          >
                                            <div className="col-md-6">
                                              <h3
                                                style={{
                                                  marginLeft: "5%",
                                                  color: "blue",
                                                  fontSize: "14px",
                                                }}
                                              >
                                                {" "}
                                                - {itemmenu.MenuName}
                                              </h3>
                                            </div>
                                            <div className="col-md-6">
                                              <div className="row">
                                                <div className="col-md-2 text-center">
                                                  <div
                                                    onClick={(e) =>
                                                      MenuAdds(itemmenu)
                                                    }
                                                    className="icheck-success d-inline"
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={
                                                        itemmenu.Adds === "C"
                                                          ? true
                                                          : false
                                                      }
                                                      class="Permition"
                                                      onChange={(e) =>
                                                        MenuAdds(itemmenu)
                                                      }
                                                      title="Thêm"
                                                    />
                                                    <label className="label checkbox icheck-success d-inline"></label>
                                                  </div>
                                                </div>

                                                <div className="col-md-2 margin-bottom:20px text-center">
                                                  <div
                                                    onClick={(e) =>
                                                      MenuEdits(itemmenu)
                                                    }
                                                    className="icheck-success d-inline"
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={
                                                        itemmenu.Edits === "C"
                                                          ? true
                                                          : false
                                                      }
                                                      class="Permition"
                                                      onChange={(e) =>
                                                        MenuEdits(itemmenu)
                                                      }
                                                    />
                                                    <label className="label checkbox icheck-success d-inline"></label>
                                                  </div>
                                                </div>
                                                <div className="col-md-2 margin-bottom:20px text-center">
                                                  <div
                                                    onClick={(e) =>
                                                      MenuDeletes(itemmenu)
                                                    }
                                                    className="icheck-success d-inline"
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={
                                                        itemmenu.Deletes === "C"
                                                          ? true
                                                          : false
                                                      }
                                                      class="Permition"
                                                      onChange={(e) =>
                                                        MenuDeletes(itemmenu)
                                                      }
                                                    />
                                                    <label className="label checkbox icheck-success d-inline"></label>
                                                  </div>
                                                </div>
                                                <div className="col-md-2  text-center">
                                                  <div
                                                    onClick={(e) =>
                                                      MenuViews(itemmenu)
                                                    }
                                                    className="icheck-success d-inline"
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={
                                                        itemmenu.Views === "C"
                                                          ? true
                                                          : false
                                                      }
                                                      class="Permition"
                                                      onChange={(e) =>
                                                        MenuViews(itemmenu)
                                                      }
                                                    />
                                                    <label className="label checkbox icheck-success d-inline"></label>
                                                  </div>
                                                </div>
                                                <div className="col-md-2  d-inline text-center">
                                                  <div
                                                    onClick={(e) =>
                                                      MenuExcel(itemmenu)
                                                    }
                                                    className="icheck-success d-inline"
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={
                                                        itemmenu.Excel === "C"
                                                          ? true
                                                          : false
                                                      }
                                                      class="Permition"
                                                      onChange={(e) =>
                                                        MenuExcel(itemmenu)
                                                      }
                                                    />
                                                    <label className="label checkbox icheck-success d-inline"></label>
                                                  </div>
                                                </div>
                                                {/*  <div className="col-md-2  text-center">
                                                                                            <div onClick={e => MenuUpExcel(itemmenu)} className="icheck-success d-inline">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    checked={itemmenu.UpExcel === 'C' ? true : false}
                                                                                                    class="Permition"
                                                                                                    onChange={e => MenuUpExcel(itemmenu)}
                                                                                                />
                                                                                                <label className="label checkbox icheck-success d-inline"></label>
                                                                                            </div>
                                                                                        </div> */}
                                                {/*  <div className="col-md-2 i text-center">
                                                                                            <div onClick={e => MenuSpecial(itemmenu)} className="icheck-success d-inline">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    checked={itemmenu.Special === 'C' ? true : false}
                                                                                                    class="Permition"
                                                                                                    onChange={e => MenuSpecial(itemmenu)}
                                                                                                />
                                                                                                <label className="label checkbox icheck-success d-inline"></label>
                                                                                            </div>
                                                                                        </div> */}
                                              </div>
                                            </div>
                                          </div>
                                          <div>
                                            {
                                              ///con
                                              DataMenuModule.filter(
                                                (p) =>
                                                  p.ParentId ===
                                                    itemmenu.MenuId &&
                                                  p.sLevel !== 2
                                              ).map((itemmenu2, indexmenu2) => {
                                                return (
                                                  <>
                                                    <div
                                                      className="row Perrow"
                                                      key={
                                                        "MenuModule" +
                                                        indexmenu2
                                                      }
                                                      style={{
                                                        paddingBottom: "8px",
                                                      }}
                                                    >
                                                      <div className="col-md-6">
                                                        <h3
                                                          style={{
                                                            marginLeft: "8%",
                                                            color: "black",
                                                            fontSize: "12px",
                                                          }}
                                                        >
                                                          {" "}
                                                          * {itemmenu2.MenuName}
                                                        </h3>
                                                      </div>
                                                      <div className="col-md-6">
                                                        <div className="row">
                                                          <div className="col-md-2 text-center">
                                                            <div
                                                              onClick={(e) =>
                                                                MenuAdds(
                                                                  itemmenu2
                                                                )
                                                              }
                                                              className="icheck-success d-inline"
                                                            >
                                                              <input
                                                                type="checkbox"
                                                                checked={
                                                                  itemmenu2.Adds ===
                                                                  "C"
                                                                    ? true
                                                                    : false
                                                                }
                                                                class="Permition"
                                                                onChange={(e) =>
                                                                  MenuAdds(
                                                                    itemmenu2
                                                                  )
                                                                }
                                                                title="Thêm"
                                                              />
                                                              <label className="label checkbox icheck-success d-inline"></label>
                                                            </div>
                                                          </div>

                                                          <div className="col-md-2 margin-bottom:20px text-center">
                                                            <div
                                                              onClick={(e) =>
                                                                MenuEdits(
                                                                  itemmenu2
                                                                )
                                                              }
                                                              className="icheck-success d-inline"
                                                            >
                                                              <input
                                                                type="checkbox"
                                                                checked={
                                                                  itemmenu2.Edits ===
                                                                  "C"
                                                                    ? true
                                                                    : false
                                                                }
                                                                class="Permition"
                                                                onChange={(e) =>
                                                                  MenuEdits(
                                                                    itemmenu2
                                                                  )
                                                                }
                                                              />
                                                              <label className="label checkbox icheck-success d-inline"></label>
                                                            </div>
                                                          </div>
                                                          <div className="col-md-2 margin-bottom:20px text-center">
                                                            <div
                                                              onClick={(e) =>
                                                                MenuDeletes(
                                                                  itemmenu2
                                                                )
                                                              }
                                                              className="icheck-success d-inline"
                                                            >
                                                              <input
                                                                type="checkbox"
                                                                checked={
                                                                  itemmenu2.Deletes ===
                                                                  "C"
                                                                    ? true
                                                                    : false
                                                                }
                                                                class="Permition"
                                                                onChange={(e) =>
                                                                  MenuDeletes(
                                                                    itemmenu2
                                                                  )
                                                                }
                                                              />
                                                              <label className="label checkbox icheck-success d-inline"></label>
                                                            </div>
                                                          </div>
                                                          <div className="col-md-2  text-center">
                                                            <div
                                                              onClick={(e) =>
                                                                MenuViews(
                                                                  itemmenu2
                                                                )
                                                              }
                                                              className="icheck-success d-inline"
                                                            >
                                                              <input
                                                                type="checkbox"
                                                                checked={
                                                                  itemmenu2.Views ===
                                                                  "C"
                                                                    ? true
                                                                    : false
                                                                }
                                                                class="Permition"
                                                                onChange={(e) =>
                                                                  MenuViews(
                                                                    itemmenu2
                                                                  )
                                                                }
                                                              />
                                                              <label className="label checkbox icheck-success d-inline"></label>
                                                            </div>
                                                          </div>
                                                          <div className="col-md-2  d-inline text-center">
                                                            <div
                                                              onClick={(e) =>
                                                                MenuExcel(
                                                                  itemmenu2
                                                                )
                                                              }
                                                              className="icheck-success d-inline"
                                                            >
                                                              <input
                                                                type="checkbox"
                                                                checked={
                                                                  itemmenu2.Excel ===
                                                                  "C"
                                                                    ? true
                                                                    : false
                                                                }
                                                                class="Permition"
                                                                onChange={(e) =>
                                                                  MenuExcel(
                                                                    itemmenu2
                                                                  )
                                                                }
                                                              />
                                                              <label className="label checkbox icheck-success d-inline"></label>
                                                            </div>
                                                          </div>
                                                          {/*  <div className="col-md-2  text-center">
                                                                                                                <div onClick={e => MenuUpExcel(itemmenu2)} className="icheck-success d-inline">
                                                                                                                    <input
                                                                                                                        type="checkbox"
                                                                                                                        checked={itemmenu2.UpExcel === 'C' ? true : false}
                                                                                                                        class="Permition"
                                                                                                                        onChange={e => MenuUpExcel(itemmenu2)}
                                                                                                                    />
                                                                                                                    <label className="label checkbox icheck-success d-inline"></label>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-md-2 i text-center">
                                                                                                                <div onClick={e => MenuSpecial(itemmenu2)} className="icheck-success d-inline">
                                                                                                                    <input
                                                                                                                        type="checkbox"
                                                                                                                        checked={itemmenu2.Special === 'C' ? true : false}
                                                                                                                        class="Permition"
                                                                                                                        onChange={e => MenuSpecial(itemmenu2)}
                                                                                                                    />
                                                                                                                    <label className="label checkbox icheck-success d-inline"></label>
                                                                                                                </div>
                                                                                                            </div> */}
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div>
                                                      {
                                                        ///con
                                                        DataMenuModule.filter(
                                                          (p) =>
                                                            p.ParentId ===
                                                              itemmenu2.MenuId &&
                                                            p.sLevel !== 3
                                                        ).map(
                                                          (
                                                            itemmenu3,
                                                            indexmenu3
                                                          ) => {
                                                            return (
                                                              <>
                                                                <div
                                                                  className="row Perrow"
                                                                  key={
                                                                    "MenuModule" +
                                                                    itemmenu3
                                                                  }
                                                                  style={{
                                                                    paddingBottom:
                                                                      "8px",
                                                                  }}
                                                                >
                                                                  <div className="col-md-6">
                                                                    <h3
                                                                      style={{
                                                                        marginLeft:
                                                                          "13%",
                                                                        color:
                                                                          "green",
                                                                        fontSize:
                                                                          "12px",
                                                                      }}
                                                                    >
                                                                      {" "}
                                                                      +{" "}
                                                                      {
                                                                        itemmenu3.MenuName
                                                                      }
                                                                    </h3>
                                                                  </div>
                                                                  <div className="col-md-6">
                                                                    <div className="row">
                                                                      <div className="col-md-2 text-center">
                                                                        <div
                                                                          onClick={(
                                                                            e
                                                                          ) =>
                                                                            MenuAdds(
                                                                              itemmenu3
                                                                            )
                                                                          }
                                                                          className="icheck-success d-inline"
                                                                        >
                                                                          <input
                                                                            type="checkbox"
                                                                            checked={
                                                                              itemmenu3.Adds ===
                                                                              "C"
                                                                                ? true
                                                                                : false
                                                                            }
                                                                            class="Permition"
                                                                            onChange={(
                                                                              e
                                                                            ) =>
                                                                              MenuAdds(
                                                                                itemmenu3
                                                                              )
                                                                            }
                                                                            title="Thêm"
                                                                          />
                                                                          <label className="label checkbox icheck-success d-inline"></label>
                                                                        </div>
                                                                      </div>

                                                                      <div className="col-md-2 margin-bottom:20px text-center">
                                                                        <div
                                                                          onClick={(
                                                                            e
                                                                          ) =>
                                                                            MenuEdits(
                                                                              itemmenu3
                                                                            )
                                                                          }
                                                                          className="icheck-success d-inline"
                                                                        >
                                                                          <input
                                                                            type="checkbox"
                                                                            checked={
                                                                              itemmenu3.Edits ===
                                                                              "C"
                                                                                ? true
                                                                                : false
                                                                            }
                                                                            class="Permition"
                                                                            onChange={(
                                                                              e
                                                                            ) =>
                                                                              MenuEdits(
                                                                                itemmenu3
                                                                              )
                                                                            }
                                                                          />
                                                                          <label className="label checkbox icheck-success d-inline"></label>
                                                                        </div>
                                                                      </div>
                                                                      <div className="col-md-2 margin-bottom:20px text-center">
                                                                        <div
                                                                          onClick={(
                                                                            e
                                                                          ) =>
                                                                            MenuDeletes(
                                                                              itemmenu3
                                                                            )
                                                                          }
                                                                          className="icheck-success d-inline"
                                                                        >
                                                                          <input
                                                                            type="checkbox"
                                                                            checked={
                                                                              itemmenu3.Deletes ===
                                                                              "C"
                                                                                ? true
                                                                                : false
                                                                            }
                                                                            class="Permition"
                                                                            onChange={(
                                                                              e
                                                                            ) =>
                                                                              MenuDeletes(
                                                                                itemmenu3
                                                                              )
                                                                            }
                                                                          />
                                                                          <label className="label checkbox icheck-success d-inline"></label>
                                                                        </div>
                                                                      </div>
                                                                      <div className="col-md-2  text-center">
                                                                        <div
                                                                          onClick={(
                                                                            e
                                                                          ) =>
                                                                            MenuViews(
                                                                              itemmenu3
                                                                            )
                                                                          }
                                                                          className="icheck-success d-inline"
                                                                        >
                                                                          <input
                                                                            type="checkbox"
                                                                            checked={
                                                                              itemmenu3.Views ===
                                                                              "C"
                                                                                ? true
                                                                                : false
                                                                            }
                                                                            class="Permition"
                                                                            onChange={(
                                                                              e
                                                                            ) =>
                                                                              MenuViews(
                                                                                itemmenu3
                                                                              )
                                                                            }
                                                                          />
                                                                          <label className="label checkbox icheck-success d-inline"></label>
                                                                        </div>
                                                                      </div>
                                                                      <div className="col-md-2  d-inline text-center">
                                                                        <div
                                                                          onClick={(
                                                                            e
                                                                          ) =>
                                                                            MenuExcel(
                                                                              itemmenu3
                                                                            )
                                                                          }
                                                                          className="icheck-success d-inline"
                                                                        >
                                                                          <input
                                                                            type="checkbox"
                                                                            checked={
                                                                              itemmenu3.Excel ===
                                                                              "C"
                                                                                ? true
                                                                                : false
                                                                            }
                                                                            class="Permition"
                                                                            onChange={(
                                                                              e
                                                                            ) =>
                                                                              MenuExcel(
                                                                                itemmenu3
                                                                              )
                                                                            }
                                                                          />
                                                                          <label className="label checkbox icheck-success d-inline"></label>
                                                                        </div>
                                                                      </div>
                                                                      {/*  <div className="col-md-2  text-center">
                                                                                                                                    <div onClick={e => MenuUpExcel(itemmenu3)} className="icheck-success d-inline">
                                                                                                                                        <input
                                                                                                                                            type="checkbox"
                                                                                                                                            checked={itemmenu3.UpExcel === 'C' ? true : false}
                                                                                                                                            class="Permition"
                                                                                                                                            onChange={e => MenuUpExcel(itemmenu3)}
                                                                                                                                        />
                                                                                                                                        <label className="label checkbox icheck-success d-inline"></label>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div className="col-md-2 i text-center">
                                                                                                                                    <div onClick={e => MenuSpecial(itemmenu3)} className="icheck-success d-inline">
                                                                                                                                        <input
                                                                                                                                            type="checkbox"
                                                                                                                                            checked={itemmenu3.Special === 'C' ? true : false}
                                                                                                                                            class="Permition"
                                                                                                                                            onChange={e => MenuSpecial(itemmenu3)}
                                                                                                                                        />
                                                                                                                                        <label className="label checkbox icheck-success d-inline"></label>
                                                                                                                                    </div>
                                                                                                                                </div> */}
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  {
                                                                    ///con
                                                                    DataMenuModule.filter(
                                                                      (p) =>
                                                                        p.ParentId ===
                                                                          itemmenu3.MenuId &&
                                                                        p.sLevel !==
                                                                          4
                                                                    ).map(
                                                                      (
                                                                        itemmenu4,
                                                                        indexmenu4
                                                                      ) => {
                                                                        return (
                                                                          <>
                                                                            <div
                                                                              className="row Perrow"
                                                                              key={
                                                                                "MenuModule" +
                                                                                itemmenu4
                                                                              }
                                                                              style={{
                                                                                paddingBottom:
                                                                                  "8px",
                                                                              }}
                                                                            >
                                                                              <div className="col-md-6">
                                                                                <h3
                                                                                  style={{
                                                                                    marginLeft:
                                                                                      "13%",
                                                                                    color:
                                                                                      "green",
                                                                                    fontSize:
                                                                                      "12px",
                                                                                  }}
                                                                                >
                                                                                  {" "}
                                                                                  +{" "}
                                                                                  {
                                                                                    itemmenu4.MenuName
                                                                                  }
                                                                                </h3>
                                                                              </div>
                                                                              <div className="col-md-6">
                                                                                <div className="row">
                                                                                  <div className="col-md-2 text-center">
                                                                                    <div
                                                                                      onClick={(
                                                                                        e
                                                                                      ) =>
                                                                                        MenuAdds(
                                                                                          itemmenu4
                                                                                        )
                                                                                      }
                                                                                      className="icheck-success d-inline"
                                                                                    >
                                                                                      <input
                                                                                        type="checkbox"
                                                                                        checked={
                                                                                          itemmenu4.Adds ===
                                                                                          "C"
                                                                                            ? true
                                                                                            : false
                                                                                        }
                                                                                        class="Permition"
                                                                                        onChange={(
                                                                                          e
                                                                                        ) =>
                                                                                          MenuAdds(
                                                                                            itemmenu4
                                                                                          )
                                                                                        }
                                                                                        title="Thêm"
                                                                                      />
                                                                                      <label className="label checkbox icheck-success d-inline"></label>
                                                                                    </div>
                                                                                  </div>

                                                                                  <div className="col-md-2 margin-bottom:20px text-center">
                                                                                    <div
                                                                                      onClick={(
                                                                                        e
                                                                                      ) =>
                                                                                        MenuEdits(
                                                                                          itemmenu4
                                                                                        )
                                                                                      }
                                                                                      className="icheck-success d-inline"
                                                                                    >
                                                                                      <input
                                                                                        type="checkbox"
                                                                                        checked={
                                                                                          itemmenu4.Edits ===
                                                                                          "C"
                                                                                            ? true
                                                                                            : false
                                                                                        }
                                                                                        class="Permition"
                                                                                        onChange={(
                                                                                          e
                                                                                        ) =>
                                                                                          MenuEdits(
                                                                                            itemmenu4
                                                                                          )
                                                                                        }
                                                                                      />
                                                                                      <label className="label checkbox icheck-success d-inline"></label>
                                                                                    </div>
                                                                                  </div>
                                                                                  <div className="col-md-2 margin-bottom:20px text-center">
                                                                                    <div
                                                                                      onClick={(
                                                                                        e
                                                                                      ) =>
                                                                                        MenuDeletes(
                                                                                          itemmenu4
                                                                                        )
                                                                                      }
                                                                                      className="icheck-success d-inline"
                                                                                    >
                                                                                      <input
                                                                                        type="checkbox"
                                                                                        checked={
                                                                                          itemmenu4.Deletes ===
                                                                                          "C"
                                                                                            ? true
                                                                                            : false
                                                                                        }
                                                                                        class="Permition"
                                                                                        onChange={(
                                                                                          e
                                                                                        ) =>
                                                                                          MenuDeletes(
                                                                                            itemmenu4
                                                                                          )
                                                                                        }
                                                                                      />
                                                                                      <label className="label checkbox icheck-success d-inline"></label>
                                                                                    </div>
                                                                                  </div>
                                                                                  <div className="col-md-2  text-center">
                                                                                    <div
                                                                                      onClick={(
                                                                                        e
                                                                                      ) =>
                                                                                        MenuViews(
                                                                                          itemmenu4
                                                                                        )
                                                                                      }
                                                                                      className="icheck-success d-inline"
                                                                                    >
                                                                                      <input
                                                                                        type="checkbox"
                                                                                        checked={
                                                                                          itemmenu4.Views ===
                                                                                          "C"
                                                                                            ? true
                                                                                            : false
                                                                                        }
                                                                                        class="Permition"
                                                                                        onChange={(
                                                                                          e
                                                                                        ) =>
                                                                                          MenuViews(
                                                                                            itemmenu4
                                                                                          )
                                                                                        }
                                                                                      />
                                                                                      <label className="label checkbox icheck-success d-inline"></label>
                                                                                    </div>
                                                                                  </div>
                                                                                  <div className="col-md-2  d-inline text-center">
                                                                                    <div
                                                                                      onClick={(
                                                                                        e
                                                                                      ) =>
                                                                                        MenuExcel(
                                                                                          itemmenu4
                                                                                        )
                                                                                      }
                                                                                      className="icheck-success d-inline"
                                                                                    >
                                                                                      <input
                                                                                        type="checkbox"
                                                                                        checked={
                                                                                          itemmenu4.Excel ===
                                                                                          "C"
                                                                                            ? true
                                                                                            : false
                                                                                        }
                                                                                        class="Permition"
                                                                                        onChange={(
                                                                                          e
                                                                                        ) =>
                                                                                          MenuExcel(
                                                                                            itemmenu4
                                                                                          )
                                                                                        }
                                                                                      />
                                                                                      <label className="label checkbox icheck-success d-inline"></label>
                                                                                    </div>
                                                                                  </div>
                                                                                  {/*  <div className="col-md-2  text-center">
                                                                                                                                    <div onClick={e => MenuUpExcel(itemmenu3)} className="icheck-success d-inline">
                                                                                                                                        <input
                                                                                                                                            type="checkbox"
                                                                                                                                            checked={itemmenu3.UpExcel === 'C' ? true : false}
                                                                                                                                            class="Permition"
                                                                                                                                            onChange={e => MenuUpExcel(itemmenu3)}
                                                                                                                                        />
                                                                                                                                        <label className="label checkbox icheck-success d-inline"></label>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div className="col-md-2 i text-center">
                                                                                                                                    <div onClick={e => MenuSpecial(itemmenu3)} className="icheck-success d-inline">
                                                                                                                                        <input
                                                                                                                                            type="checkbox"
                                                                                                                                            checked={itemmenu3.Special === 'C' ? true : false}
                                                                                                                                            class="Permition"
                                                                                                                                            onChange={e => MenuSpecial(itemmenu3)}
                                                                                                                                        />
                                                                                                                                        <label className="label checkbox icheck-success d-inline"></label>
                                                                                                                                    </div>
                                                                                                                                </div> */}
                                                                                </div>
                                                                              </div>
                                                                            </div>
                                                                            <div></div>
                                                                          </>
                                                                        );
                                                                      }
                                                                    )
                                                                  }
                                                                </div>
                                                              </>
                                                            );
                                                          }
                                                        )
                                                      }
                                                    </div>
                                                  </>
                                                );
                                              })
                                            }
                                          </div>
                                        </>
                                      );
                                    })
                                  }
                                </div>
                              </div>
                            );
                          }
                        )
                      }
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

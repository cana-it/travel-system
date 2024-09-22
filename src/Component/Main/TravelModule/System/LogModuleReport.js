import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import I18n from "../../../../Language";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";
import {
  DataTable,
  FormReport,
  ChartTemp,
  SelectAccount,
  SelectParent,
  SelectStaff,
} from "../../../../Common";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  FormatDateJson,
  FirstOrLastDayinMonth,
} from "../../../../Utils";
import { UncontrolledDropdown } from "reactstrap";


export const LogModuleReport = () => {
  //#region Khai báo biến
  const dispatch = useDispatch();

  const [Dataatable, setDataatable] = useState([]);
  const [DatatableTotal, setDatatableTotal] = useState([]);
  const [DatatableTotaldt, setDatatableTotaldt] = useState([]);
  const AccountIdRef = useRef();
  const [Fromdate, setFromdate] = useState(
    FirstOrLastDayinMonth(new Date(), 1)
  );
  const [Todate, setTodate] = useState(FirstOrLastDayinMonth(new Date()));
  const [MenuId, setMenuId] = useState(0);
  const [AccountId, setAccountId] = useState(0);
  const [Hiddentable, setHiddentable] = useState(false);
  const [Hiddentabledt, setHiddentabledt] = useState(false);
  const [Hiddentablebutton, setHiddentablebutton] = useState(false);
  const [DataExcel, setDataExcel] = useState([]);
  const [DataExceldt, setDataExceldt] = useState([]);
  const [State, setState] = useState();

  const Trl_spLogModule_Report = async () => {
    const pr = {
      FromDate: FormatDateJson(Fromdate),
      ToDate: FormatDateJson(Todate),
      AccountId: AccountId,
      MenuId: MenuId,
      UserId: localStorage.getItem("CreateBy"),
    };

    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spLogModule_Report",
    };

    try {
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        const resultA = Object.values(
          result.reduce(
            (
              c,
              {
                MenuId,
                MenuName,
                MenuName_en,
                AccountName,
                CreateTime,
                Creater,
              }
            ) => {
              c[MenuId] = c[MenuId] || {
                MenuId: MenuId,
                MenuName: MenuName,
                MenuName_en: MenuName_en,
                Creater: Creater,
                Count: 0,
              };
              c[MenuId].Count++;
              return c;
            },
            {}
          )
        );
        setDatatableTotal(resultA);
        const empty = (arr) => (arr.length = 0);
        empty(Dataatable);
        Dataatable.push(result);

        setHiddentable(true);
      } else {
        Alertwarning("No data");
        const empty = (arr) => (arr.length = 0);
        empty(Dataatable);
        setDatatableTotal([]);
        setHiddentable(false);
      }
    } catch (error) {
      //setdisbtn(false);
      Alerterror(I18n.t("validate.Dataerror,pleasecontactIT!"));
    }
  };

  const clickDetail = (row) => {
    ;
    let b = Dataatable;
    setDatatableTotaldt(
      Dataatable[0].filter((p) => p.MenuId === row.original.MenuId)
    );
    setHiddentabledt(true);
    setHiddentable(false);
    setHiddentablebutton(true);
  };

  const Undo = () => {
    setHiddentablebutton(false);
    setHiddentabledt(false);
    setHiddentable(true);
  };
  const [columns] = useState([
    {
      Header: "Tùy chọn",
      width: 100,
      filterable: false,
      special: true,
      show: true,
      accessor: "MenuId",
      Cell: (row) => (
        <span>
          <button
            data-tooltip="Detail"
            className={
              row.original.State === 0
                ? "btn btn-sm btn-warning mr-2 show__tip__right"
                : "btn btn-sm btn-danger  show__tip__right"
            }
            onClick={(e) => clickDetail(row)}
          >
            <i className="fa fa-eye mr-2"></i>
          </button>
        </span>
      ),
    },
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 80,
      special: true,
      show: true, //
    },

    {
      Header: "Chức năng (VN)",
      accessor: "MenuName",
    },
    {
      Header: "Chức năng (EN)",
      accessor: "MenuName_en",
    },
    {
      Header: "Tổng truy cập",
      accessor: "Count",
      Cell: (obj) => (
        <span
          style={{
            padding: "5px 15px",
            background: "green",
            borderRadius: "29px",
            color: "white",
          }}
        >
          {obj.value}
        </span>
      ),
    },
  ]);

  const [columnsdt] = useState([
    {
      Header: "No.",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 100,

      special: true,
      show: true,
    },

    {
      Header: "Menu Name (VN)",
      accessor: "MenuName",
    },
    {
      Header: "Menu Name (EN)",
      accessor: "MenuName_en",
    },
    {
      Header: "Nhân viên",
      accessor: "AccountName",
    },
    {
      Header: "Thời gian",
      accessor: "CreateTime",
      Cell: (obj) => FormatDateJson(obj.value),
    },
  ]);
  return (
    <>
      <div className="content-wrapper pt-2">
        <section className="content">
          <div className="container-fluid">
            <div className="card card-primary">
              {/* Header */}
              <div className="card-header border-left-red">
                <div className="row">
                  <div className="col-md-6">
                    <h3 className="card-title">
                      <i class="fa-chart-column" />
                      Lịch sử truy cập hệ thống
                    </h3>
                  </div>
                  <div className="col-md-6 card-header-btn">
                    <a
                      className={
                        Hiddentablebutton === true
                          ? "display-none"
                          : "btn btn-primary btn-sm float-right btn-header"
                      }
                      onClick={(e) => {
                        Trl_spLogModule_Report();
                      }}
                    >
                      <i className="fa fa-eye mr-2" />
                      {I18n.t("System.View")}
                    </a>
                    <a
                      className={
                        Hiddentablebutton === false
                          ? "display-none"
                          : "btn btn-primary btn-sm float-right btn-header"
                      }
                      onClick={(e) => {
                        Undo();
                      }}
                    >
                      <i class="fa-solid fas fa-undo-alt pr-1" />
                      {I18n.t("Order.Undo")}
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-body-form col-md-12">
                <div className="row mt-3">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form__title">Từ ngày </label>
                      <DateTimePicker
                        className="form-control"
                        onChange={(date) => setFromdate(date)}
                        value={Fromdate}
                        format="MM/dd/yyyy"
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form__title">Đến ngày</label>
                      <DateTimePicker
                        className="form-control"
                        onChange={(date) => setTodate(date)}
                        value={Todate}
                        format="MM/dd/yyyy"
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form__title">Nhân viên </label>
                      <SelectStaff
                        onSelected={(e) => setAccountId(e.value)}
                        onAccountId={AccountId}
                        items={AccountId}
                        BranchId={0}
                        DepartmentId={0}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="form-group">
                      <label className="form__title">
                        Chức năng<span className="form__title__note"></span>
                      </label>
                      <SelectParent onSelected={(e) => setMenuId(e.value)} />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  Hiddentable === false
                    ? "display-none"
                    : "card-body-form mt-5 display-block"
                }
              >
                <DataTable data={DatatableTotal} columns={columns} />
              </div>
              <div
                className={
                  Hiddentabledt === false
                    ? "display-none"
                    : "card-body-form mt-5 display-block"
                }
              >
                <DataTable data={DatatableTotaldt} columns={columnsdt} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import Select from "react-select";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import moment from "moment";
import { DataTable, SelectServiceSale } from "../../../../Common";
import {
  Alerterror,
  Alertwarning,
  ConfirmAlert,
  ExportExcel,
  FormatDateJson,
  FormatMoney,
  FormatNumber,
} from "../../../../Utils";
import { IMAGES_DOMAIN } from "../../../../Services";

export const InvoiceReport = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");

  //#region Khai báo biến
  const [state, setState] = useState({
    data: [],
    ReportType: { value: "A", label: "Phiếu thu" },
    ServiceSaleId: 0,
    InvoiceCode: "",
    CurrentColumn: [],
    TitleShow: "",
    CurrentTypeShow: "A",
  });
  const [TimeSearch, setTimeSearch] = useState([
    new Date(
      moment(new Date().setDate(new Date().getDate() - 7)).startOf("date")
    ),
    new Date(moment(new Date()).endOf("date")),
  ]);

  const ReportType = [
    { value: "A", label: "Phiếu thu" },
    { value: "B", label: "Phiếu PĐX" },
    { value: "C", label: "Phiếu PNB" },
    /* { value: "E", label: "Tất cả phiếu đề xuất" }, */
  ];

  const onChangeType = (e) => {
    setState({
      ...state,
      ReportType: e,
    });
  };

  //#region Search data

  const Trl_spInvoice_Report = async () => {
    if (TimeSearch === undefined) {
      Alertwarning("Vui lòng chọn thời gian");
      return;
    }
    try {
      const pr = {
        Creater: Creater,
        CreateName: CreateName,
        InvoiceCode: state.InvoiceCode,
        FromDate:
          TimeSearch !== undefined
            ? FormatDateJson(TimeSearch[0])
            : "01/01/2000",
        ToDate:
          TimeSearch !== undefined
            ? FormatDateJson(TimeSearch[1])
            : "01/01/2000",
        InvoiceType: state.ReportType.value,
        ServiceSaleId: state.ServiceSaleId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_Report",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      let TotalMoney = onMerge(list);
      setState({
        ...state,
        data: list,
        CurrentColumn:
          state.ReportType.value === "A"
            ? columnsA
            : state.ReportType.value === "B"
            ? columnsB
            : columnsC,
        TitleShow:
          state.ReportType.value === "A"
            ? "TỔNG HỢP PHIẾU THU"
            : state.ReportType.value === "B"
            ? "TỔNG HỢP PHIẾU PĐX"
            : "TỔNG HỢP PHIẾU  NỘI BỘ",
        CurrentTypeShow: state.ReportType.value,
        TotalMoney: TotalMoney,
      });
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };

  const onMerge = (tmp) => {
    let final = [];
    let i = 0;
    tmp.map((item, index) => {
      let check = final?.find((p) => p.TypeMoneyName === item.TypeMoneyName);
      if (check === undefined) {
        final.push({
          TypeMoneyName: item.TypeMoneyName,
          Money: +item.MoneyPayment,
          indexCol: i,
        });
        i++;
      } else {
        final[check.indexCol].Money = final[check.indexCol].Money + item.Money;
      }
    });
    return final;
  };

  //#endregion

  //#region Table Columns

  const columnsA = [
    {
      Header: "STT",
      Cell: ({ index }) => <>{index + 1}</>,
      width: 50,
      fixed: "left",
    },
    {
      Header: "Ngày Tháng Năm",
      accessor: "CreateTime",
      Cell: ({ row }) => <>{FormatDateJson(row._original.CreateTime, 7)}</>,
      width: 150,
      fixed: "left",
    },
    {
      Header: "Mã Phiếu",
      accessor: "InvoiceCode",
      width: 200,
      fixed: "left",
      Cell: ({ row }) => (
        <>
          <span>
            {row._original.InvoiceCode}
            {row._original.Step > 0 && (
              <span
                class={
                  row._original.StatusColor === 3
                    ? "badge badge-success"
                    : row._original.StatusColor === 4
                    ? "badge badge-danger"
                    : "badge badge-warning"
                }
              >
                {" "}
                {row._original.Step}
              </span>
            )}
          </span>
        </>
      ),
    },
    {
      Header: "Mã Tour",
      accessor: "ServiceSaleCode",
      width: 250,
      fixed: "left",
    },
    {
      Header: "Tên Tour",
      accessor: "ServiceSaleName",
      width: 250,
    },
    {
      Header: "Khách hàng",
      accessor: "ObName",
      width: 250,
      Cell: ({ row }) => (
        <>
          {row._original.ObName === "TOUR LEADER" ||
          row._original.ObName === "tour leader" ? (
            <span className="uppercase text-red">{row._original.ObName}</span>
          ) : (
            <span className="uppercase">{row._original.ObName}</span>
          )}
        </>
      ),
    },
    {
      Header: "Ngày Khởi Hành",
      accessor: "TimeStart",
      width: 180,
      Cell: ({ row }) => <>{FormatDateJson(row._original.TimeStart, 7)}</>,
    },
    {
      Header: "Số Lượng Khách",
      accessor: "Numberofseats",
      width: 180,
      Cell: ({ row }) => <>{row._original.Numberofseats}</>,
    },
    {
      Header: "Số Tiền",
      accessor: "TotalMoney",
      width: 100,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.StatusId;
        let kcheck = "badge badge-success";
        if (fls === 1) kcheck = "badge badge-danger";
        if (fls === 3) kcheck = "badge badge-warning";
        return (
          <span className={kcheck}>
            {FormatMoney(row._original.TotalMoney)}{" "}
            {row._original.TypeMoneyName}
          </span>
        );
      },
    },
    {
      Header: "Phương Thức TT",
      accessor: "PaymentName",
      width: 200,
    },
    {
      Header: "Nội Dung TT",
      accessor: "Decscription",
      width: 200,
    },
    {
      Header: "Ghi Chú",
      accessor: "Notes",
    },
  ];

  const columnsB = [
    {
      Header: "STT",
      Cell: ({ index }) => <>{index + 1}</>,
      width: 50,
      fixed: "left",
    },
    {
      Header: "Ngày tháng năm",
      accessor: "CreateTime",
      Cell: ({ row }) => <>{FormatDateJson(row._original.CreateTime, 7)}</>,
      width: 150,
      fixed: "left",
    },
    {
      Header: "Mã Phiếu",
      accessor: "InvoiceCode",
      width: 200,
      fixed: "left",
      Cell: ({ row }) => (
        <>
          <span>
            {row._original.InvoiceCode}
            {row._original.Step > 0 && (
              <span
                class={
                  row._original.StatusColor === 3
                    ? "badge badge-success"
                    : row._original.StatusColor === 4
                    ? "badge badge-danger"
                    : "badge badge-warning"
                }
              >
                {" "}
                {row._original.Step}
              </span>
            )}
          </span>
        </>
      ),
    },
    {
      Header: "Mã Tour",
      accessor: "ServiceSaleCode",
      width: 250,
      fixed: "left",
    },
    {
      Header: "Nội Dung TT",
      accessor: "Decscription",
      width: 200,
    },
    {
      Header: "Số tiền",
      accessor: "TotalMoney",
      width: 100,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.StatusId;
        let kcheck = "badge badge-success";
        if (fls === 1) kcheck = "badge badge-danger";
        if (fls === 3) kcheck = "badge badge-warning";
        return (
          <span className={kcheck}>
            {FormatMoney(row._original.TotalMoney)}{" "}
            {row._original.TypeMoneyName}
          </span>
        );
      },
    },
    {
      Header: "Phương thức TT",
      accessor: "PaymentName",
      width: 200,
    },
    {
      Header: "Người Thụ Hưởng",
      accessor: "ObName",
      width: 250,
    },
    {
      Header: "Số Tài Khoản",
      accessor: "BankAccount",
      width: 250,
    },
    {
      Header: "Người Đề Xuất",
      accessor: "CreateName",
      width: 200,
    },
    {
      Header: "Ghi Chú",
      accessor: "Notes",
    },
  ];

  const columnsC = [
    {
      Header: "STT",
      Cell: ({ index }) => <>{index + 1}</>,
      width: 50,
      fixed: "left",
    },
    {
      Header: "Ngày tháng năm",
      accessor: "CreateTime",
      Cell: ({ row }) => <>{FormatDateJson(row._original.CreateTime, 7)}</>,
      width: 150,
      fixed: "left",
    },
    {
      Header: "Mã Phiếu",
      accessor: "InvoiceCode",
      width: 200,
      fixed: "left",
      Cell: ({ row }) => (
        <>
          <span>
            {row._original.InvoiceCode}
            {row._original.Step > 0 && (
              <span
                class={
                  row._original.StatusColor === 3
                    ? "badge badge-success"
                    : row._original.StatusColor === 4
                    ? "badge badge-danger"
                    : "badge badge-warning"
                }
              >
                {" "}
                {row._original.Step}
              </span>
            )}
          </span>
        </>
      ),
    },
    {
      Header: "Nội Dung TT",
      accessor: "Decscription",
      width: 200,
    },
    {
      Header: "Số tiền",
      accessor: "TotalMoney",
      width: 130,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.StatusId;
        let kcheck = "badge badge-success";
        if (fls === 1) kcheck = "badge badge-danger";
        if (fls === 3) kcheck = "badge badge-warning";
        return (
          <span className={kcheck}>
            {FormatMoney(row._original.TotalMoney)}{" "}
            {row._original.TypeMoneyName}
          </span>
        );
      },
    },
    {
      Header: "Phương thức TT",
      accessor: "PaymentName",
      width: 200,
    },
    {
      Header: "Người Thụ Hưởng",
      accessor: "ObName",
      width: 250,
    },
    {
      Header: "Số Tài Khoản",
      accessor: "BankAccount",
      width: 250,
    },
    {
      Header: "Người Đề Xuất",
      accessor: "CreateName",
      width: 200,
    },
    {
      Header: "Ghi Chú",
      accessor: "Notes",
    },
  ];

  //#endregion

  //#region Xuất excel

  const Trl_spInvoice_Report_Excel = async () => {
    try {
      let dataExport = {
        FileName:
          state.TitleShow +
          " từ " +
          FormatDateJson(TimeSearch[0], 7) +
          " đến " +
          FormatDateJson(TimeSearch[1], 7),
        Invoices: state.data,
        ReportType: state.CurrentTypeShow,
        TitleShow: state.TitleShow,
      };

      const params = {
        Json: JSON.stringify(dataExport),
        func: "Trl_spInvoice_Report_Excel",
      };

      const result = await mainAction.API_spCallExportExcel(params, dispatch);
      if (result.resultCode === 0) {
        const link = document.createElement("a");
        link.href = IMAGES_DOMAIN + result.Message;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  //#endregion

  return (
    <>
      <div className="content-wrapper">
        <div class="card p-1 PrintInvoiceHide">
          <div class="card-header border-left-red">BÁO CÁO THU / ĐỀ XUẤT</div>
          <div class="card-body border-left-red">
            <div class="row">
              <div class="col-sm-12 col-md-3">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    Chọn thời gian <span className="text-red">(*)</span>
                  </span>
                  <DateTimeRangePicker
                    className="form-control2 px-1 pb-2px zIndex-300"
                    value={TimeSearch}
                    format="dd/MM/yyyy"
                    onChange={(date) => setTimeSearch(date)}
                  />
                </div>
              </div>
              <div class="col-sm-12 col-md-3">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    Loại báo cáo <span className="text-red">(*)</span>
                  </span>
                  <Select
                    className={"w-100 select-custom"}
                    value={state?.ReportType}
                    onChange={(e) => onChangeType(e)}
                    options={ReportType}
                  />
                </div>
              </div>
              {(state?.ReportType.value === "A" ||
                state?.ReportType.value === "B") && (
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Chọn tour
                    </span>
                    <SelectServiceSale
                      items={state.ServiceSaleId || 0}
                      onSelected={(e) =>
                        setState({
                          ...state,
                          ServiceSaleId: e.value,
                        })
                      }
                      type={1}
                      init="Chọn tất cả"
                    />
                  </div>
                </div>
              )}
              <div class="col-sm-12 col-md-3">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    Mã phiếu
                  </span>
                  <input
                    type="text"
                    maxLength="500"
                    class="form-control"
                    value={state.InvoiceCode}
                    onChange={(e) =>
                      setState({ ...state, InvoiceCode: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="col-sm-12 col-md-12 text-center mb-2">
                <button
                  onClick={(e) => {
                    Trl_spInvoice_Report();
                  }}
                  type="button"
                  class="btn btn-sm btn-danger"
                >
                  <i class="fa fa-search pr-2"></i>
                  Tìm kiếm
                </button>
              </div>
            </div>
            {state.data.length > 0 && (
              <>
                <div class="row">
                  <div className="col-sm-12 col-md-12">
                    <div class="card-header border-left-red mb-3">
                      {state.TitleShow} ({state.data.length} phiếu)
                      <div className="pull-right" style={{ marginTop: "-7px" }}>
                        <button
                          disabled={state.data.length > 0 ? false : true}
                          onClick={Trl_spInvoice_Report_Excel}
                          type="button"
                          class="btn btn-sm btn-success pull-right"
                        >
                          <i class="fa fa-download pr-2"></i>
                          Excel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  {state.TotalMoney.map((item, index) => {
                    return (
                      <div className="col-sm-12 col-md-3">
                        <div className="info-box">
                          <span className="info-box-icon bg-success elevation-1">
                            <i className="fas fa-th-list"></i>
                          </span>
                          <div className="info-box-content">
                            <span className="info-box-text">
                              TỔNG TIỀN ({item.TypeMoneyName})
                            </span>
                            <span className="info-box-number float-left">
                              {FormatNumber(item.Money || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div class="row">
                  <div className="col-sm-12 col-md-12">
                    <div class="table-responsive">
                      <DataTable
                        data={state.data}
                        columns={state.CurrentColumn}
                        IsSearch={true}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

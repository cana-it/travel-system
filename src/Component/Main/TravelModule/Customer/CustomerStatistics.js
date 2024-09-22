import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alerterror,
  FormatDateJson,
  ExportExcel,
  ConfirmAlert,
} from "../../../../Utils";
import {
  DataTable,
  SelectServiceSale,
} from "../../../../Common";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";

export const CustomerStatistics = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");

  const [MonthBD, setMonthBD] = useState(0);
  const [HiddenTable, setHiddenTable] = useState(true);
  const [TitleShow, setTitleShow] = useState("");
  const [DataExcel, setDataExcel] = useState([]);
  const [DataTableList, setDataTableList] = useState([]);

  const Trl_spCustomer_ListBrithDay = async () => {
    let Monthstring = MonthBD.toString().trim(),
      Mt = "";
    Mt = Monthstring.split("-");
    try {
      if (MonthBD === 0) {
        Alertwarning("Vui lòng chọn tháng để xem!");
        return;
      }
      const pr = {
        MonthCus: parseFloat(Mt[1]),
        Officer: Creater,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomer_ListBrithDay",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length !== 0) {
        setDataTableList(result);
        setTitleShow(
          `Khách hàng có ngày sinh trong tháng ${parseFloat(Mt[1])} : ${
            result.length
          } người`
        );
        setHiddenTable(false);

        const newData = result.map((item) => {
          return {
            "Tên KH": item.CustomerName,
            "Mã KH": item.CustomerCode,
            "Mã Tour": item.BookingCode,
            "Số ĐT": item.Phone,
            "Giới Tính": item.Sex,
            "Ngày Sinh": FormatDateJson(item.Brithday, 7),
            PassPort: item.PassportCode,
            "Ngày cấp":
              item.PassportTimeFrom === ""
                ? item.PassportTimeFrom
                : FormatDateJson(item.PassportTimeFrom, 7),
            "Ngày hết":
              item.PassportTimeTo === ""
                ? item.PassportTimeTo
                : FormatDateJson(item.PassportTimeTo, 7),
            Sales: item.StaffName,
            "Địa Chỉ KH": item.Address,
          };
        });
        setDataExcel(newData);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      setHiddenTable(true);
      ;
    }
  };

  const columns = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 40,
      textAlign: "center",
      filterable: false,
      sortable: false,
    },
    {
      Header: "Tên Khách Hàng",
      accessor: "CustomerName",
      width: 250,
    },
    {
      Header: "Mã Khách Hàng",
      accessor: "CustomerCode",
      width: 250,
    },
    {
      Header: "Mã Tour",
      accessor: "BookingCode",
      width: 250,
    },
    {
      Header: "Số ĐT",
      accessor: "Phone",
      width: 150,
    },
    {
      Header: "Giới Tính",
      accessor: "Sex",
      width: 100,
    },
    {
      Header: "Sinh Nhật",
      accessor: "Brithday",
      width: 200,
      Cell: ({ row }) => (
        <span>{FormatDateJson(row._original.Brithday, 7)}</span>
      ),
    },
    {
      Header: "PassPort",
      accessor: "PassportCode",
      width: 200,
    },
    {
      Header: "Ngày Cấp",
      accessor: "PassportTimeFrom",
      width: 200,
      Cell: ({ row }) =>
        row._original.PassportTimeFrom === "" ? (
          <span></span>
        ) : (
          <span>{FormatDateJson(row._original.PassportTimeFrom, 7)}</span>
        ),
    },
    {
      Header: "Ngày Hết",
      accessor: "PassportTimeTo",
      width: 200,
      Cell: ({ row }) =>
        row._original.PassportTimeTo === "" ? (
          <span></span>
        ) : (
          <span>{FormatDateJson(row._original.PassportTimeTo, 7)}</span>
        ),
    },
    {
      Header: "Sales",
      accessor: "StaffName",
      width: 250,
    },
    {
      Header: "Địa Chỉ",
      accessor: "Address",
      width: 350,
    },
  ];

  // tab 2

  const [ToDate, setToDate] = useState("");
  const [FromDate, setFromDate] = useState(new Date());
  const [SexSearch, setSexSearch] = useState([]);
  const [ServiceSearch, setServiceSearch] = useState(0);
  const [DataTableList2, setDataTableList2] = useState([]);
  const [HiddenTable2, setHiddenTable2] = useState(true);
  const [TotalCus, setTotalCus] = useState(0);
  const [TotalCusMale, setTotalCusMale] = useState(0);
  const [TotalCusFemale, setTotalCusFemale] = useState(0);
  const [DataExcel2, setDataExcel2] = useState([]);

  const [TypeList, setTypeList] = useState({ value: 0, label: "Tất Cả" });
  const TypeSearch = [
    { value: 1, label: "Male" },
    { value: 2, label: "Female" },
    { value: 3, label: "Male (Child)" },
    { value: 4, label: "Female (Child)" },
    { value: 5, label: "Male (Infant)" },
    { value: 6, label: "Female (Infant)" },
  ];

  const onSelecteType = (e) => {
    let arr = [];
    setTypeList(e);
    if (e.length !== 0) {
      for (const item of e) {
        const a = TypeSearch.filter((a) => a.value == item.value);
        arr.push(...a);
      }
    }
    setSexSearch(arr);
  };

  const onSelectServiceSale = (e) => {
    setServiceSearch(e);
  };

  const Trl_spSelectCustomer_FromBooking = async () => {
    ;
    let ArraySex = [];
    try {
      if (ToDate === "") {
        Alertwarning("Vui lòng chọn ngày bắt đầu tìm kiếm!");
        return;
      }

      if (SexSearch.length == 0) {
        TypeSearch.map((e, index) => {
          ArraySex.push({
            Sex: e.label,
          });
        });
      } else {
        SexSearch.map((e, index) => {
          ArraySex.push({
            Sex: e.label,
          });
        });
      }
      const pr = {
        ToDate: FormatDateJson(ToDate, 0),
        FromDate: FormatDateJson(FromDate, 0),
        ServiceSaleId:
          ServiceSearch === 0 ? ServiceSearch : ServiceSearch.value,
        tblSex: ArraySex,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spSelectCustomer_FromBooking",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length !== 0) {
        setDataTableList2(result);
        setHiddenTable2(false);
        let M = 0,
          F = 0,
          K = 0;
        result.forEach((e) => {
          if (
            e.Sex === "Male" ||
            e.Sex === "Male (Child)" ||
            e.Sex === "Male (Infant)"
          ) {
            M = M + 1;
          } else if (
            e.Sex === "Female" ||
            e.Sex === "Female (Child)" ||
            e.Sex === "Female (Infant)"
          ) {
            F = F + 1;
          } else {
            K = K + 1;
          }
        });
        setTotalCus(result.length);
        setTotalCusMale(M);
        setTotalCusFemale(F);
        let Excel = result.map((e) => {
          return {
            "Tên KH": e.CustomerName,
            "Mã KH": e.CustomerCode,
            "Tên Việt": e.CustomerNameVn,
            "Mã Tour": e.ServiceSaleCode,
            "Số ĐT": e.Phone,
            "Giới Tính": e.Sex,
            "Sinh Nhật": e.Brithday,
            "PASSPORT No": e.PassportCode,
            "Ngày Cấp": e.PassportTimeTo,
            "Ngày Hết": e.PassportTimeFrom,
            "Địa Chỉ": e.Address,
            From: e.GoFrom,
            Sales: e.StaffName,
          };
        });
        setDataExcel2(Excel);
      }
    } catch (error) {
      ;
    }
  };

  const columnTab2 = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 40,
      textAlign: "center",
      filterable: false,
      sortable: false,
    },
    {
      Header: "Tên Khách Hàng",
      accessor: "CustomerName",
      width: 250,
    },
    {
      Header: "Mã Khách hàng",
      accessor: "CustomerCode",
      width: 250,
    },
    {
      Header: "Mã Tour",
      accessor: "ServiceSaleCode",
      width: 250,
    },
    {
      Header: "Số Điện Thoại",
      accessor: "Phone",
      width: 200,
    },
    {
      Header: "Giới Tính",
      accessor: "Sex",
      width: 150,
    },
    {
      Header: "Sinh Nhật",
      accessor: "Brithday",
      Cell: ({ row }) => (
        <span>{FormatDateJson(row._original.Brithday, 7)}</span>
      ),
      width: 200,
    },
    {
      Header: "PassPort No",
      accessor: "PassportCode",
      width: 200,
    },
    {
      Header: "Ngày Cấp PassPort",
      accessor: "PassportTimeTo",
      Cell: ({ row }) => (
        <span>
          {row._original.PassportTimeTo === ""
            ? ""
            : FormatDateJson(row._original.PassportTimeTo, 7)}
        </span>
      ),
      width: 250,
    },
    {
      Header: "Ngày Hết PassPort",
      accessor: "PassportTimeFrom",
      width: 200,
      Cell: ({ row }) => (
        <span>
          {row._original.PassportTimeFrom === ""
            ? ""
            : FormatDateJson(row._original.PassportTimeFrom, 7)}
        </span>
      ),
    },
    {
      Header: "Địa Chỉ",
      accessor: "Address",
      width: 450,
    },
    {
      Header: "From",
      accessor: "GoFrom",
      width: 150,
    },
    {
      Header: "Sales",
      accessor: "StaffName",
      width: 250,
    },
  ];

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
                THEO SINH NHẬT
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link " href="#tab_2" data-toggle="tab">
                THEO GIỚI TÍNH
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
                <div className="card-header border-left-red">
                  <div className="row">
                    <div class="col-sm-12 col-md-3 ">
                      <h3 className="card-title">
                        <span className="font-weight-bold">
                          Tìm Kiếm Khách Hàng
                        </span>
                      </h3>
                    </div>
                    <div class="col-sm-12 col-md-9 margin-top-5s">
                      <button
                        onClick={() => {
                          ConfirmAlert(
                            "Xác nhận",
                            "Bạn có muốn xuất Excel không?",
                            () => {
                              ExportExcel(DataExcel, TitleShow);
                            }
                          );
                        }}
                        type="button"
                        class="btn btn-sm btn-success pull-right margin-left-5"
                      >
                        <i class="fa fa-download pr-2"></i>
                        Excel
                      </button>
                      <button
                        onClick={(e) => {
                          Trl_spCustomer_ListBrithDay();
                        }}
                        type="button"
                        class="btn btn-sm btn-danger pull-right margin-left-5"
                      >
                        <i class="fa fa-search pr-2"></i>
                        Tìm kiếm
                      </button>
                      <div
                        class="form-group pull-right"
                        style={{ marginTop: "-4px", marginRight: "5px" }}
                      >
                        <div class="input-group ">
                          <input
                            type="month"
                            className="form-control"
                            key="start"
                            id="start"
                            name="start"
                            value={MonthBD}
                            onChange={(e) => setMonthBD(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-body border-left-red">
                  <div className="row">
                    <div
                      className={
                        HiddenTable === true
                          ? "card display-none"
                          : "card display-block"
                      }
                    >
                      <div class="card-header d-flex">
                        <div class="d-flex">
                          <div class="font-weight-bold text-muted">
                            {TitleShow}
                          </div>
                        </div>
                      </div>
                      <div className="card-body p-1 pl-0">
                        <div className="col-md-12">
                          <div class="table-responsive">
                            <DataTable data={DataTableList} columns={columns} />
                          </div>
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
                <div className="card-header border-left-red">
                  <div className="row">
                    <div class="col-sm-12 col-md-3 d-flex align-items-center">
                      <h3 className="card-title">
                        <span className="font-weight-bold">
                          Tìm Kiếm Khách Hàng
                        </span>
                      </h3>
                    </div>
                    <div class="col-sm-12 col-md-9 margin-top-5s">
                      <button
                        onClick={(e) => {
                          ConfirmAlert(
                            "Xác nhận",
                            "Bạn có muốn xuất Excel?",
                            () => {
                              if (DataExcel2.length > 0) {
                                ExportExcel(DataExcel2, "Danh Sách Khách Hàng");
                              } else {
                                Alertwarning("Không có dữ liệu Excel!");
                                return;
                              }
                            }
                          );
                        }}
                        type="button"
                        class="btn btn-sm btn-success pull-right margin-left-5"
                      >
                        <i class="fa fa-download pr-2"></i>
                        Xuất Excel
                      </button>
                      <button
                        onClick={() => Trl_spSelectCustomer_FromBooking()}
                        type="button"
                        class="btn btn-sm btn-danger pull-right margin-left-5"
                      >
                        <i class="fa fa-search pr-2"></i>
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body ">
                  <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Từ Ngày
                        </span>
                        <div class="input-group ">
                          <DateTimePicker
                            className="form-control2 px-1 pb-2px"
                            value={ToDate}
                            onChange={(date) => setToDate(date)}
                            format={"dd/MM/yyyy"}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Đến Ngày
                        </span>
                        <div class="input-group ">
                          <DateTimePicker
                            className="form-control2 px-1 pb-2px"
                            value={FromDate}
                            onChange={(date) => setFromDate(date)}
                            format={"dd/MM/yyyy"}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Theo Giới Tính
                        </span>
                        <div class="input-group">
                          <Select
                            className="select-custom w-100"
                            value={TypeList}
                            onChange={onSelecteType}
                            options={TypeSearch}
                            isMulti
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Theo Tour
                        </span>
                        <div class="input-group">
                          <SelectServiceSale
                            onSelected={(e) => onSelectServiceSale(e)}
                            items={ServiceSearch?.value || 0}
                            className={"w-100 select-custom z-maxx"}
                            type={1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    HiddenTable2 ? "card display-none" : "card display-block"
                  }
                >
                  <div class="row margin-top-20 margin-left-5">
                    <div class="col-md-4 col-sm-6 col-12">
                      <div class="info-box">
                        <span class="info-box-icon bg-info">
                          <i class="fas fa-user-tie"></i>
                        </span>

                        <div class="info-box-content">
                          <span class="info-box-text font-weight-bold text-muted">
                            Tổng Số KH
                          </span>
                          <span class="info-box-number">{TotalCus}</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 col-sm-6 col-12">
                      <div class="info-box">
                        <span class="info-box-icon bg-success">
                          <i class="fas fa-address-card"></i>
                        </span>

                        <div class="info-box-content">
                          <span class="info-box-tex  font-weight-bold text-muted">
                            Male, Male(Child), Male(Infant)
                          </span>
                          <span class="info-box-number">{TotalCusMale}</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 col-sm-6 col-12">
                      <div class="info-box">
                        <span class="info-box-icon bg-warning">
                          <i class="far fa-address-card"></i>
                        </span>

                        <div class="info-box-content">
                          <span class="info-box-text  font-weight-bold text-muted">
                            Female, Female(Child), Female(Infant)
                          </span>
                          <span class="info-box-number">{TotalCusFemale}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div class="form-group">
                      <DataTable data={DataTableList2} columns={columnTab2} />
                    </div>
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

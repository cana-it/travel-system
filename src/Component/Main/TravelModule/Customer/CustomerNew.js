import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  FormatDateJson,
  ConvertUTCDateToLocalDate,
  CheckTypeFile,
  FormatMoney,
  ConfirmAlert,
  ExportExcel,
} from "../../../../Utils";
import {
  DataTable,
  SelectBranch,
  SelectContinent,
  SelectTourFromService,
  SelectService,
} from "../../../../Common";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";
import { IMAGES_DOMAIN } from "../../../../Services";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Modal from "react-bootstrap/Modal";
import { useLocation } from "react-router-dom";
import $ from "jquery";

export const CustomerNew = () => {
  useEffect(() => {
    Trl_spStaff_Select();
  }, []);

  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");

  const [CustomerSearch, setCustomerSearch] = useState("");
  const [ToDate, setToDate] = useState("");
  const [FromDate, setFromDate] = useState(new Date());
  const [ServiceSearch, setServiceSearch] = useState(0);

  const [IsOpen, setIsOpen] = useState(false);
  const [CustomerId, setCustomerId] = useState(0);
  const [CustomerName, setCustomerName] = useState("");
  const [CustomerPhone, setCustomerPhone] = useState("");
  const [ServiceCus, setServiceCus] = useState(0);
  const [ServiceCusId, setServiceCusId] = useState(0);
  const [TourCode, setTourCode] = useState("");
  const [LinkFB, setLinkFB] = useState("");
  const [InformationCus, setInformationCus] = useState(0);
  const [StatusCus, setStatusCus] = useState(1);
  const [SalesId, setSalesId] = useState(0);
  const [Notes, setNotes] = useState("");
  const [DataTableList, setDataTableList] = useState([]);
  const [HiddenTable, setHiddenTable] = useState(true);
  const [TotalF, setTotalF] = useState(0);
  const [TotalH, setTotalH] = useState(0);
  const [TotalZ, setTotalZ] = useState(0);
  const [TotalO, setTotalO] = useState(0);
  const [TotalHandelY, setTotalHandelY] = useState(0);
  const [TotalHandelN, setTotalHandelN] = useState(0);
  const [TourId, setTourId] = useState(0);
  const [HiddenInput, setHiddenInput] = useState(true);
  const [dataTable2, setDataTable2] = useState([]);
  const [showModal2, setShowModal2] = useState(false);
  const [notesViews, setNotesViews] = useState("");
  const [StarList, setStarList] = useState({
    value: 0,
    label: "Vui Lòng Chọn Sales",
  });

  useEffect(() => {
    Trl_spCustomerSales_Search(1);
  }, []);
  const [DataStarList, setDataStarList] = useState([]);

  const closeModal = () => {
    setIsOpen(false);
    setCustomerId(0);
    setCustomerName("");
    setCustomerPhone("");
    setServiceCus(0);
    setServiceCusId(0);
    setTourId(0);
    setTourCode("");
    setInformationCus(0);
    setLinkFB("");
    setHiddenInput(true);
    setStatusCus(1);
    setSalesId(0);
    setNotes("");
    setInformationList({ value: 0, label: "Vui Lòng Chọn Kênh" });
    setStatusList({
      value: 1,
      label: "Chưa chuyển bộ phận kinh doanh",
      color: "danger",
    });
    setStarList({ value: 0, label: "Vui Lòng Chọn Sales" });
  };

  const openModalCreate = () => {
    setIsOpen(true);
  };

  const onSelectServiceCus = (e) => {
    setServiceCus(e);
    setServiceCusId(e.value);
  };

  const Trl_spStaff_Select = async () => {
    try {
      const pr = {
        StaffId: 0,
        Officer: parseInt(Creater),
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spStaff_Select2",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length != 0) {
        const List = [];
        result.map((e, i) => {
          List.push({
            value: e.StaffId,
            label: e.StaffName,
          });
        });
        setDataStarList(List);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const onSelecteStar = (e) => {
    setSalesId(e.value);
    setStarList(e);
  };

  const [InformationList, setInformationList] = useState({
    value: 0,
    label: "Vui Lòng Chọn Kênh",
  });
  const Information = [
    { value: 1, label: "Facebook (link)" },
    { value: 2, label: "Hotline" },
    { value: 3, label: "Tổng đài" },
    { value: 4, label: "Zalo" },
    { value: 5, label: "Zalo OA" },
    { value: 6, label: "Khách đến công ty" },
    { value: 7, label: "Khách cũ quay lại" },
    { value: 8, label: "Giới thiệu" },
    { value: 9, label: "Đại lý" },
    { value: 10, label: "Nguồn khác" },
  ];

  const onSelecteInformation = (e) => {
    setInformationList({ value: e.value, label: e.label });
    setInformationCus(e.value);
    if (e.value === 1) {
      setHiddenInput(false);
    } else {
      setHiddenInput(true);
    }
  };

  const [StatusList, setStatusList] = useState({
    value: 1,
    label: "Chưa chuyển bộ phận kinh doanh",
    color: "danger",
  });
  const Status = [
    { value: 1, label: "Chưa chuyển bộ phận kinh doanh", color: "danger" },
    { value: 2, label: "Đã chuyển bộ phận kinh doanh", color: "success" },
  ];

  const onSelecteStatus = (e) => {
    setStatusList(e);
    setStatusCus(e.value);
  };

  const [contactStatus, setContactStatus] = useState({
    value: 1,
    label: "Đã liên hệ",
    color: "success",
  });

  const contactStatusList = [
    { value: 1, label: "Đã liên hệ", color: "success" },
    {
      value: 2,
      label: "Đang liên hệ",
      color: "warning",
    },
    { value: 3, label: "Chưa liên hệ", color: "danger" },
  ];

  const Trl_spCustomerSales_Save = async () => {
    try {
      if (CustomerName === "") {
        Alertwarning("Vui lòng nhập tên khách hàng!");
        return;
      }
      if (ServiceCus === 0 || ServiceCus === -1) {
        Alertwarning("Vui lòng chọn thị trường!");
        return;
      }
      if (InformationCus === 0) {
        Alertwarning("Vui lòng chọn kênh thông tin!");
        return;
      }
      const pr = {
        CustomerId: CustomerId,
        CustomerName: CustomerName,
        CustomerPhone: CustomerPhone,
        ServiceId: ServiceCus.value,
        TourCode: TourCode,
        InformationCus: InformationCus,
        LinkFB: LinkFB,
        Status: StatusCus,
        SalesId: SalesId,
        ContactStatus: contactStatus?.value || 0,
        Notes: Notes,
        Creater: parseInt(Creater),
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomerSales_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        closeModal();
        Trl_spCustomerSales_Search();
        Trl_spCustomerSales_Search(1);
        return;
      } else {
        Alertwarning(result.ReturnMess);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spCustomerSales_Search = async (type = 0) => {
    setHiddenTable(true);
    try {
      if (type === 0) {
        if (ToDate === "") {
          Alertwarning("Vui lòng chọn ngày bắt đầu tìm kiếm!");
          return;
        }
        if (CustomerSearch !== "" && CustomerSearch.length <= 2) {
          Alertwarning("Vui lòng nhập tìm kiếm nhiều hơn 3 ký tự!");
          return;
        }
      }
      const pr = {
        ToDate: FormatDateJson(ToDate, 0),
        FromDate: FormatDateJson(FromDate, 0),
        ServiceId: ServiceSearch === 0 ? ServiceSearch : ServiceSearch.value,
        CustomerSearch: CustomerSearch,
        Type: type,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomerSales_Search",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length != 0) {
        if (type === 0) {
          setDataTableList(result);
          setHiddenTable(false);
          let F = 0,
            H = 0,
            Z = 0,
            O = 0,
            TotalY = 0,
            TotalN = 0;
          result.forEach((e) => {
            if (e.InformationCus === 1) {
              F = F + 1;
            } else if (e.InformationCus === 2 || e.InformationCus === 3) {
              H = H + 1;
            } else if (e.InformationCus === 4 || e.InformationCus === 5) {
              Z = Z + 1;
            } else {
              O = O + 1;
            }
            if (e.ContactStatus === 2 || e.ContactStatus === 3) {
              TotalN = TotalN + 1;
            } else {
              TotalY = TotalY + 1;
            }
          });
          setTotalF(F);
          setTotalH(H);
          setTotalZ(Z);
          setTotalO(O);
          setTotalHandelY(TotalY);
          setTotalHandelN(TotalN);
        } else {
          setDataTable2(result);
        }
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Edit = async (e) => {
    let Ojb = e.row.original;
    await setCustomerId(Ojb.CustomerId);
    setCustomerName(Ojb.CustomerName);
    setCustomerPhone(Ojb.CustomerPhone);
    setServiceCus({ value: Ojb.ServiceId });
    setServiceCusId(Ojb.ServiceId);
    setTourId(Ojb.TourId);
    setTourCode(Ojb.TourCode);
    const x = Information.find((x) => x.value == Ojb.InformationCus);
    setInformationList(x);
    setInformationCus(Ojb.InformationCus);
    if (Ojb.InformationCus == 1) {
      setHiddenInput(false);
      setLinkFB(Ojb.LinkFB);
    } else {
      setHiddenInput(true);
      setLinkFB("");
    }
    const y = Status.find((y) => y.value == Ojb.Status);
    setStatusList(y);
    setStatusCus(Ojb.Status);

    const ct = contactStatusList.find((ctl) => ctl.value === Ojb.ContactStatus);
    setContactStatus(ct);

    const j = DataStarList.filter((j) => j.value == Ojb.SalesId)[0];
    setStarList(j);
    setSalesId(Ojb.SalesId);

    setSalesId(Ojb.SalesId);
    setNotes(Ojb.Notes);
    setIsOpen(true);
  };

  const Delete = async (e) => {
    let Ojb = e.row._original;
    try {
      const pr = {
        CustomerId: Ojb.CustomerId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomerSales_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        const newArr = [...DataTableList];
        setDataTableList(
          newArr.filter((item) => item.CustomerId !== Ojb.CustomerId)
        );
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
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
      Header: "Tùy Chọn",
      accessor: "[row identifier to be passed to button]",
      width: 150,
      filterable: false,
      sortable: false,
      Cell: (row) => (
        <div>
          <span>
            <button
              className="btn btn-sm btn-success"
              onClick={(e) => Edit({ row })}
            >
              <i class="fa fa-eye"></i> Sửa
            </button>
            |
            <button
              className="btn btn-sm btn-danger"
              onClick={(e) => {
                ConfirmAlert("Xác nhận", "Bạn có muốn lưu không?", () => {
                  Delete(row);
                });
              }}
            >
              <i class="fas fa-eraser"></i> Xóa
            </button>
          </span>
        </div>
      ),
    },
    {
      Header: "Tên Khách Hàng",
      accessor: "CustomerName",
      Cell: ({ row }) => (
        <span>
          {row._original.CustomerName}
          <span
            className={`badge badge-${row._original.ColorName} p-2`}
          >{` `}</span>
        </span>
      ),
      width: 200,
    },
    {
      Header: "Số Điện Thoại",
      accessor: "CustomerPhone",
      width: 150,
    },
    {
      Header: "Thị Trường",
      accessor: "ServiceName",
      width: 150,
    },
    {
      Header: "Yêu Cầu Tour",
      accessor: "TourCode",
      width: 150,
    },
    {
      Header: "Ghi chú",
      accessor: "Notes",
      width: 450,
      Cell: ({ row }) => (
        <span>
          {row._original.Notes == "" ? (
            ""
          ) : (
            <div>
              <span
                className="badge badge-warning p-1 mr-1"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  setNotesViews(row._original.Notes);
                  setShowModal2(true);
                }}
              >
                <i class="fas fa-eye"></i>
              </span>
              {row._original.Notes}
            </div>
          )}
        </span>
      ),
    },
    {
      Header: "Kênh Tiếp Nhận",
      accessor: "Information",
      Cell: ({ row }) => (
        <span>
          {row._original.LinkFB == ""
            ? row._original.Information
            : `${row._original.Information} (${row._original.LinkFB})`}
        </span>
      ),
      width: 150,
    },
    {
      Header: "Tình Trạng",
      accessor: "StatusName",
      Cell: ({ row }) => (
        <span
          className={
            row._original.Status === 1
              ? "custom-bg-danger p-2 "
              : "custom-bg-success p-2 "
          }
        >
          {row._original.StatusName}
        </span>
      ),
      width: 260,
    },

    {
      Header: "Tình Trạng Liên Hệ",
      accessor: "ContactStatusName",
      Cell: ({ row }) => (
        <span
          className={
            row._original.ContactStatus === 1
              ? "custom-bg-success p-2"
              : row._original.ContactStatus === 2
              ? "custom-bg-warning p-2"
              : row._original.ContactStatus === 3
              ? "custom-bg-danger p-2"
              : ""
          }
        >
          {row._original.ContactStatusName}
        </span>
      ),
      width: 200,
    },
    {
      Header: "Sales",
      accessor: "SalesName",
      width: 200,
    },
    {
      Header: "Người Tạo",
      accessor: "CreateName",
      width: 250,
    },
    {
      Header: "Thời Gian Tạo",
      accessor: "CreateTime",
      width: 200,
      Cell: ({ row }) => (
        <span>{FormatDateJson(row._original.CreateTime, 10)}</span>
      ),
    },
  ];

  const columns2 = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 40,
      textAlign: "center",
      filterable: false,
      sortable: false,
    },
    {
      Header: "Tùy Chọn",
      accessor: "[row identifier to be passed to button]",
      width: 100,
      filterable: false,
      sortable: false,
      Cell: (row) => (
        <div>
          <span>
            <button
              className="btn btn-sm btn-success"
              onClick={(e) => Edit({ row })}
            >
              <i class="fa fa-eye"></i> Sửa
            </button>
          </span>
        </div>
      ),
    },
    {
      Header: "Tên Khách Hàng",
      accessor: "CustomerName",
      Cell: ({ row }) => (
        <span>
          {row._original.CustomerName}
          <span
            className={`badge badge-${row._original.ColorName} p-2`}
          >{` `}</span>
        </span>
      ),
      width: 200,
    },
    {
      Header: "Số Điện Thoại",
      accessor: "CustomerPhone",
      width: 150,
    },
    {
      Header: "Thị Trường",
      accessor: "ServiceName",
      width: 150,
    },
    {
      Header: "Yêu Cầu Tour",
      accessor: "TourCode",
      width: 150,
    },
    {
      Header: "Ghi Chú",
      accessor: "Notes",
      width: 450,
      Cell: ({ row }) => (
        <span>
          {row._original.Notes == "" ? (
            ""
          ) : (
            <div>
              <span
                className="badge badge-warning p-1 mr-1"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  setNotesViews(row._original.Notes);
                  setShowModal2(true);
                }}
              >
                <i class="fas fa-eye"></i>
              </span>
              {row._original.Notes}
            </div>
          )}
        </span>
      ),
    },
    {
      Header: "Kênh Tiếp Nhận",
      accessor: "Information",
      Cell: ({ row }) => (
        <span>
          {row._original.LinkFB == ""
            ? row._original.Information
            : `${row._original.Information} (${row._original.LinkFB})`}
        </span>
      ),
      width: 150,
    },
    {
      Header: "Tình Trạng",
      accessor: "StatusName",
      Cell: ({ row }) => (
        <span
          className={
            row._original.Status === 1
              ? "custom-bg-danger p-2 "
              : "custom-bg-success p-2 "
          }
        >
          {row._original.StatusName}
        </span>
      ),
      width: 260,
    },

    {
      Header: "Tình Trạng Liên Hệ",
      accessor: "ContactStatusName",
      Cell: ({ row }) => (
        <span
          className={
            row._original.ContactStatus === 1
              ? "custom-bg-success p-2"
              : row._original.ContactStatus === 2
              ? "custom-bg-warning p-2"
              : row._original.ContactStatus === 3
              ? "custom-bg-danger p-2"
              : ""
          }
        >
          {row._original.ContactStatusName}
        </span>
      ),
      width: 200,
    },
    {
      Header: "Sales",
      accessor: "SalesName",
      width: 200,
    },
    {
      Header: "Người Tạo",
      accessor: "CreateName",
      width: 250,
    },
    {
      Header: "Thời Gian Tạo",
      accessor: "CreateTime",
      width: 200,
      Cell: ({ row }) => (
        <span>{FormatDateJson(row._original.CreateTime, 10)}</span>
      ),
    },
  ];

  const onExportExcel = (data, type = 0) => {
    if (data.length > 0) {
      let res = data.map((item) => {
        return {
          "Tên Khách Hàng": item.CustomerName,
          "Số Điện Thoại": item.CustomerPhone,
          "Thị Trường": item.ServiceName,
          "Yêu Cầu Tour": item.TourCode,
          "Kênh Tiếp Nhận": item.Information + " " + item?.LinkFB,
          "Tình Trạng": item.StatusName,
          "Tình Trạng Liên Hệ": item.ContactStatusName,
          Sales: item.SalesName,
          "Yêu Cầu": item.Notes,
          "Người Tạo": item.CreateName,
        };
      });
      type = 0
        ? ExportExcel(res, "Danh sách khách hàng chưa xử lý")
        : ExportExcel(res, "Danh sách khách hàng");
    } else {
      Alertwarning("Không có dữ liệu");
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
                THÊM MỚI THÔNG TIN
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link " href="#tab_2" data-toggle="tab">
                DANH SÁCH KH CHƯA XỬ LÝ
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
                          THÔNG TIN KHÁCH HÀNG
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
                              onExportExcel(DataTableList, 1);
                            }
                          );
                        }}
                        type="button"
                        class="btn btn-sm btn-primary pull-right margin-left-5"
                      >
                        <i class="fa fa-download pr-2"></i>
                        Xuất Excel
                      </button>
                      <button
                        onClick={(e) => {
                          openModalCreate();
                        }}
                        type="button"
                        class="btn btn-sm btn-success pull-right margin-left-5"
                      >
                        <i class="fa fa-plus pr-2"></i>
                        Thêm mới
                      </button>
                      <button
                        onClick={() => Trl_spCustomerSales_Search()}
                        type="button"
                        class="btn btn-sm btn-danger pull-right margin-left-5"
                      >
                        <i class="fa fa-search pr-2"></i>
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>
                <div class="card-body ">
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
                          Theo Tên KH, SĐT
                        </span>
                        <div class="input-group">
                          <input
                            type="text"
                            maxLength="50"
                            placeholder="SĐT,Tên KH..."
                            class="form-control"
                            value={CustomerSearch}
                            onChange={(e) => setCustomerSearch(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Theo Thị Trường
                        </span>
                        <div class="input-group">
                          <SelectService
                            className={"w-100 select-custom"}
                            onSelected={(e) => {
                              setServiceSearch(e);
                            }}
                            items={ServiceSearch?.value || 0}
                            type={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      HiddenTable ? "card display-none" : "card display-block"
                    }
                  >
                    <div class="row margin-top-20 margin-left-5">
                      <div className="col-md-2">
                        <i
                          class="titlecenter"
                          style={{ fontSize: "13px", paddingTop: "5px" }}
                        >
                          Tổng FB
                        </i>
                        <div
                          className="text-center"
                          style={{ border: "1px solid grey", padding: "3px" }}
                        >
                          {TotalF}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <i
                          class="titlecenter"
                          style={{ fontSize: "13px", paddingTop: "5px" }}
                        >
                          Tổng Hotline/Tổng Đài
                        </i>
                        <div
                          className="text-center"
                          style={{ border: "1px solid grey", padding: "3px" }}
                        >
                          {TotalH}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <i
                          class="titlecenter"
                          style={{ fontSize: "13px", paddingTop: "5px" }}
                        >
                          Tổng Zalo/Zalo OA
                        </i>
                        <div
                          className="text-center"
                          style={{ border: "1px solid grey", padding: "3px" }}
                        >
                          {TotalZ}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <i
                          class="titlecenter"
                          style={{ fontSize: "13px", paddingTop: "5px" }}
                        >
                          Tổng Offline
                        </i>
                        <div
                          className="text-center"
                          style={{ border: "1px solid grey", padding: "3px" }}
                        >
                          {TotalO}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <i
                          class="titlecenter"
                          style={{ fontSize: "13px", paddingTop: "5px" }}
                        >
                          Tổng Đã Liên Hệ KH
                        </i>
                        <div
                          className="text-center"
                          style={{ border: "1px solid grey", padding: "3px" }}
                        >
                          {TotalHandelY}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <i
                          class="titlecenter"
                          style={{ fontSize: "13px", paddingTop: "5px" }}
                        >
                          Tổng Chưa Liên Hệ KH
                        </i>
                        <div
                          className="text-center"
                          style={{ border: "1px solid grey", padding: "3px" }}
                        >
                          {TotalHandelN}
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div class="form-group">
                        <DataTable data={DataTableList} columns={columns} />
                      </div>
                    </div>
                  </div>
                  <Modal
                    show={IsOpen}
                    onHide={closeModal}
                    aria-labelledby="example-custom-modal-styling-title"
                    className=" custom-modal-w-90"
                  >
                    <Modal.Header>
                      <Modal.Title id="example-custom-modal-styling-title">
                        <div class="">
                          {CustomerId === 0
                            ? "Thêm mới khách hàng"
                            : "Chỉnh sửa thông tin khách hàng " + CustomerName}
                        </div>
                      </Modal.Title>
                      <div>
                        <button
                          type="button"
                          class="btn btn-sm btn-danger pull-right margin-left-5 close"
                          aria-label="Close"
                          onClick={() => {
                            ConfirmAlert(
                              "Xác nhận",
                              "Bạn có muốn lưu trước khi thoát không?",
                              () => {
                                closeModal();
                                Trl_spCustomerSales_Save();
                              },
                              "Đồng Ý",
                              "Không Đồng Ý",
                              true,
                              () => {
                                closeModal();
                              }
                            );
                          }}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                        <button
                          style={{ marginRight: "5px" }}
                          type="button"
                          class="btn btn-sm btn-success pull-right"
                          onClick={() => {
                            ConfirmAlert(
                              "Xác nhận",
                              "Bạn có muốn lưu không?",
                              () => {
                                Trl_spCustomerSales_Save();
                              }
                            );
                          }}
                        >
                          <i class="fa fa-edit pr-2"></i>
                          {CustomerId === 0 ? " Thêm mới" : "Chỉnh sửa"}
                        </button>
                      </div>
                    </Modal.Header>
                    <Modal.Body>
                      <div class="card-body">
                        <div class="row">
                          <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                              <span class="label">
                                Tên Khách Hàng
                                <sup style={{ color: "#dc3545" }}>(*)</sup>
                              </span>
                              <div class="input-group">
                                <input
                                  type="text"
                                  maxLength="50"
                                  class="form-control"
                                  value={CustomerName}
                                  onChange={(e) =>
                                    setCustomerName(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                              <span class="label">
                                Số ĐT
                                <sup style={{ color: "#dc3545" }}>(*)</sup>
                              </span>
                              <div class="input-group">
                                <input
                                  type="text"
                                  maxLength="50"
                                  class="form-control"
                                  value={CustomerPhone}
                                  onChange={(e) =>
                                    setCustomerPhone(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                              <span class="label">
                                Thị Trường
                                <sup style={{ color: "#dc3545" }}>(*)</sup>
                              </span>
                              <div class="input-group">
                                <SelectService
                                  className={"w-100 select-custom z-maxx"}
                                  onSelected={(e) => {
                                    onSelectServiceCus(e);
                                  }}
                                  items={ServiceCus?.value || 0}
                                  type={2}
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                              <span class="label">Yêu cầu Tour</span>
                              <div class="input-group">
                                <input
                                  type="text"
                                  maxLength="50"
                                  class="form-control"
                                  value={TourCode}
                                  onChange={(e) => setTourCode(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                              <span class="label">Ghi Chú</span>
                              <div class="input-group">
                                <input
                                  type="text"
                                  class="form-control"
                                  value={Notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                              <span class="label">
                                Kênh nhận TT
                                <sup style={{ color: "#dc3545" }}>(*)</sup>
                              </span>
                              <div class="input-group">
                                <Select
                                  className="select-custom w-100 z-maxx"
                                  value={InformationList}
                                  onChange={onSelecteInformation}
                                  options={Information}
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            class={
                              HiddenInput
                                ? "display-none"
                                : "col-sm-12 col-md-4 display-block"
                            }
                          >
                            <div class="form-group">
                              <span class="label">Link Facebook</span>
                              <div class="input-group">
                                <input
                                  type="text"
                                  class="form-control"
                                  value={LinkFB}
                                  onChange={(e) => setLinkFB(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                              <span class="label">Tình Trạng</span>
                              <div class="input-group">
                                <Select
                                  className={`select-custom w-100 select-custom-text-${StatusList?.color}`}
                                  value={StatusList}
                                  onChange={onSelecteStatus}
                                  options={Status}
                                />
                              </div>
                            </div>
                          </div>

                          <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                              <span class="label">Tình trạng liên hệ</span>
                              <div class="input-group">
                                <Select
                                  className={`select-custom w-100 select-custom-text-${contactStatus?.color}`}
                                  value={contactStatus}
                                  onChange={(e) => setContactStatus(e)}
                                  options={contactStatusList}
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                              <span class="label">Sales</span>
                              <div class="input-group">
                                <Select
                                  className="select-custom w-100"
                                  value={StarList}
                                  onChange={onSelecteStar}
                                  options={DataStarList}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
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
                        <span className="font-weight-bold">Danh sách</span>
                      </h3>
                    </div>
                    <div class="col-sm-12 col-md-9 margin-top-5s">
                      <button
                        onClick={(e) => {
                          ConfirmAlert(
                            "Xác nhận",
                            "Bạn có muốn xuất Excel?",
                            () => {
                              onExportExcel(dataTable2);
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
                        type="button"
                        class="btn btn-sm btn-danger pull-right margin-left-5"
                        onClick={(e) => Trl_spCustomerSales_Search(1)}
                      >
                        <i class="fa fa-search pr-2"></i>
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body ">
                  <DataTable data={dataTable2} columns={columns2} />
                </div>
              </div>
            </div>
            <Modal
              show={showModal2}
              onHide={() => {
                setShowModal2(false);
              }}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header>
                <Modal.Title className="ml-auto">Ghi chú</Modal.Title>
                <button
                  type="button"
                  class="close"
                  aria-label="Close"
                  onClick={() => setShowModal2(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </Modal.Header>
              <Modal.Body>
                <div className="card-body p-1">
                  <div className="row">{notesViews}</div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

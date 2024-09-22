import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";

import moment from "moment";
import { DataTable } from "../../../../Common";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
} from "../../../../Utils";
import * as XLSX from "xlsx";

export const TimeKeepingData = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");

  const [items, setItems] = useState([]);
  const [totalDay, setTotalDay] = useState([]);
  const [month, setMonth] = useState(moment().format("YYYY-MM"));
  const [dataReport, setDataReport] = useState([]);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      const jsonOpts = {
        raw: false,
        dateNF: 'd"/"m"/"yyyy', // <--- need dateNF in sheet_to_json options (note the escape chars)
      };
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.readFile(bufferArray, {
          type: "buffer",
          cellDates: true,
          cellText: false,
        });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws, jsonOpts);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      let newD = d?.map((item) => {
        return {
          StaffName: item["Tên N.Viên"],
          StaffCode: item["Mã N.Viên"],
          Date: item["Ngày"],
          Position: item["Chức vụ"],
          Day: item["Thứ"],
          TotalHour: item["Tổng giờ"],
          Key: item["K.hiệu"],
        };
      });
      let a = newD?.reduce((acc, curr) => {
        acc[curr.StaffCode] = [...(acc[curr.StaffCode] || []), curr];
        return acc;
      }, {});
      let arr = Object.values(a);
      if (arr[0][0].StaffName === undefined) {
        setItems([]);
        setTotalDay([]);
        return Alerterror("File không đúng định dạng");
      }

      handleDataTimeKeeping(arr);
      setItems(newD);
    });
  };

  const handleFile = (e) => {
    const files = e.target?.files[0];
    if (files) {
      readExcel(files);
    }
  };

  const handleDataTimeKeeping = (data) => {
    let newArr = [];
    data?.forEach((item) => {
      let total = 0;
      item.forEach((i) => {
        let date = moment(i.Date, "DD/MM/YYYY").format("MM/DD/YYYY");
        let day = moment(date).format("dddd");
        if (day === "Saturday" && (i.Key === "X" || i.Key === "KR")) {
          total = total + 0.5;
        }
        if (
          day !== "Saturday" &&
          day !== "Sunday" &&
          (i.Key === "X" || i.Key === "KR")
        ) {
          total = total + 1;
        }
      });
      newArr.push({
        ...item[0],
        Total: total,
        Month: `Tháng ${moment(item[0].Date, "DD/MM/YYYY").format("MM")}`,
        DateReport: moment(item[0].Date, "DD/MM/YYYY").format(
          "MM/DD/YYYY 00:00:00"
        ),
      });
    });
    setTotalDay(newArr);
  };

  const Trl_spTimeKeeping_Save = async () => {
    if (totalDay.length === 0) return Alerterror("Chưa có dữ liệu");
    try {
      const pr = totalDay;
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTimeKeeping_Save",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Thành công");
      } else {
        Alerterror("Tháng chấm công đã được tạo");
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spTimeKeeping_List = async () => {
    try {
      const pr = {
        DateReport: moment(month, "YYYY-MM").format("MM/01/YYYY 00:00:00"),
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTimeKeeping_List",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.length > 0) {
        setDataReport(res);
      } else {
        Alertwarning("Không có dữ liệu");
        setDataReport([]);
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
    // {
    //   Header: "Tùy Chọn",
    //   accessor: "[row identifier to be passed to button]",
    //   width: 150,
    //   filterable: false,
    //   sortable: false,
    //   Cell: (row) => (
    //     <div>
    //       <span>
    //         <button className="btn btn-sm btn-success mr-2">
    //           <i class="far fa-edit"></i> Sửa
    //         </button>
    //       </span>
    //     </div>
    //   ),
    // },
    {
      Header: "Mã NV",
      accessor: "StaffCode",
      width: 100,
    },
    {
      Header: "Tên Nhân Viên",
      accessor: "StaffName",
      minWidth: 150,
    },
    {
      Header: "Ngày Chấm Công",
      accessor: "Date",
      textAlign: "center",
      minWidth: 150,
    },
    {
      Header: "Thứ",
      accessor: "Day",
      minWidth: 150,
    },
    {
      Header: "Tổng Giờ",
      accessor: "TotalHour",
      minWidth: 150,
    },
    {
      Header: "Ký Hiệu",
      accessor: "Key",
      minWidth: 150,
    },
  ];

  const columnsTotal = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 40,
      textAlign: "center",
      filterable: false,
      sortable: false,
    },
    {
      Header: "Mã NV",
      accessor: "StaffCode",
      width: 100,
    },
    {
      Header: "Tên Nhân Viên",
      accessor: "StaffName",
      minWidth: 150,
    },
    {
      Header: "Công Tháng",
      accessor: "Month",
      textAlign: "center",
      minWidth: 150,
    },
    {
      Header: "Tổng Công Trong tháng",
      accessor: "Total",
      minWidth: 150,
    },
  ];

  return (
    <>
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
                  THÊM MỚI
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
                  <div className="card-header border-left-red">
                    <div className="row">
                      <div class="col-sm-12 col-md-3 ">
                        <h3 className="card-title">
                          <span className="font-weight-bold">
                            UPLOAD FILE CHẤM CÔNG
                          </span>
                        </h3>
                      </div>
                      <div class="col-sm-12 col-md-9 margin-top-5s">
                        <button
                          type="button"
                          class="btn btn-sm btn-danger pull-right margin-left-5"
                          onClick={() => {
                            setItems([]);
                            setTotalDay([]);
                          }}
                        >
                          <i class="fa fa-trash pr-2"></i>
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="card-body ">
                    <div>
                      <div className="col-6 m-auto  d-flex ">
                        <input
                          type="file"
                          className="form-control2 w-80 mr-3"
                          onChange={(e) => handleFile(e)}
                          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        />
                        <button
                          className="btn btn-success pull-right"
                          onClick={Trl_spTimeKeeping_Save}
                        >
                          <i class="fas fa-file-upload mr-1"></i> Tải lên
                        </button>
                      </div>
                    </div>
                    {items.length > 0 && (
                      <>
                        <div class="card mt-4">
                          <div className="card-header">
                            <h3 className="card-title">
                              <span className="font-weight-bold">
                                TỔNG HỢP CÔNG TRONG THÁNG
                              </span>
                            </h3>
                          </div>
                          <div className="card-body p-0">
                            <DataTable data={totalDay} columns={columnsTotal} />
                          </div>
                        </div>
                        <div class="card">
                          <div className="card-header">
                            <h3 className="card-title">
                              <span className="font-weight-bold">
                                CHI TIẾT CÔNG TRONG THÁNG
                              </span>
                            </h3>
                          </div>
                          <div className="card-body p-0">
                            <DataTable data={items} columns={columns} />
                          </div>
                        </div>
                      </>
                    )}
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
                      <div class="col-sm-12 col-md-3 d-flex align-items-center"></div>
                      <div class="col-sm-12 col-md-9 margin-top-5s">
                        <button
                          type="button"
                          class="btn btn-sm btn-danger pull-right margin-left-5"
                          onClick={Trl_spTimeKeeping_List}
                        >
                          <i class="fa fa-search pr-2"></i>
                          Tìm kiếm
                        </button>
                        <div
                          class="form-group pull-right"
                          style={{ marginTop: "-2px", marginRight: "5px" }}
                        >
                          <div class="input-group ">
                            <input
                              className="form-control2"
                              type="month"
                              value={month}
                              onChange={(date) => {
                                setMonth(date.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-body ">
                    <DataTable data={dataReport} columns={columnsTotal} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

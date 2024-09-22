import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alerterror,
  ConfirmAlert,
  HandleTextArea,
  Alertsuccess,
} from "../../../../Utils";
import { DataTable, SelectStaff } from "../../../../Common";
import Modal from "react-bootstrap/Modal";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import moment from "moment";

export const KPIManagerment = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");

  const [showFormCreateKPI, setShowFormCreateKPI] = useState();
  const [timeReport, setTimeReport] = useState();
  const [staff, setStaff] = useState([]);
  const [kpiList, setKpiList] = useState([]);
  const [kpiTotalList, setKpiTotalList] = useState([]);

  const [kpiTl, setTl] = useState({
    KpiContent: "",
    Frequency: "",
    Requirement: "",
    Regulation: "",
    Creater: +Creater,
    Percent: 0,
  });

  const [kpiTitle, setKpiTitle] = useState([
    { Percent: 0 },
    { Percent: 0 },
    { Percent: 0 },
    { Percent: 0 },
    { Percent: 0 },
  ]);
  const [kpiFixed, setKpiFixed] = useState([]);
  const [kpiAdd, setKpiAdd] = useState([]);
  const [kpi3, setKpi3] = useState([]);
  const [kpi4, setKpi4] = useState([]);

  const updateMyData = (index, value, property, type = 0) => {
    if (type === 1) {
      setKpiTitle((old) => {
        let abc = old.map((row, i) => {
          if (i === index) {
            return {
              ...old[index],
              [property]: value,
            };
          }
          return row;
        });
        return abc;
      });
    }
    if (type === 3) {
      setKpiFixed((old) => {
        let abc = old.map((row, i) => {
          if (i === index) {
            return {
              ...old[index],
              [property]: value,
            };
          }
          return row;
        });
        return abc;
      });
    }
    if (type === 12) {
      setKpiAdd((old) => {
        let abc = old.map((row, i) => {
          if (i === index) {
            return {
              ...old[index],
              [property]: value,
            };
          }
          return row;
        });
        return abc;
      });
    }
    if (type === 13) {
      setKpi3((old) => {
        let abc = old.map((row, i) => {
          if (i === index) {
            return {
              ...old[index],
              [property]: value,
            };
          }
          return row;
        });
        return abc;
      });
    }
    if (type === 14) {
      setKpi4((old) => {
        let abc = old.map((row, i) => {
          if (i === index) {
            return {
              ...old[index],
              [property]: value,
            };
          }
          return row;
        });
        return abc;
      });
    }
  };

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
        contentEditable={edit}
        suppressContentEditableWarning="true"
        onInput={onChange}
        onBlur={onBlur}
        className="padding-td3 w-100"
      >
        <span className=" "> {value2}</span>
      </div>
    );
  };

  useEffect(() => {
    Trl_spKPI_Template_Staff_List();
  }, []);

  const Trl_spKPI_Template_Staff_List = async (type = 0) => {
    try {
      const pr = {
        StaffId: 0,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spKPI_Template_Staff_List",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);

      const result2 = res.reduce((acc, obj) => {
        const { StaffId } = obj;
        if (!acc[StaffId]) {
          acc[StaffId] = [];
        }
        acc[StaffId].push(obj);
        return acc;
      }, {});
      let rs = Object.values(result2).map((item) => {
        return item[0];
      });
      setKpiList(rs);
      setKpiTotalList(Object.values(result2));
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spKPI_Template_Staff_Delete = async (staffid) => {
    try {
      const pr = {
        StaffId: staffid,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spKPI_Template_Staff_Delete",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Xóa thành công");
        Trl_spKPI_Template_Staff_List();
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spKPI_Template_Staff_Save = async (id) => {
    try {
      let kpiValue = kpiTitle.map((item) => {
        return item.Percent;
      });

      let kpi = [...kpiFixed, ...kpiAdd, ...kpi3, ...kpi4].map((item) => {
        return {
          ...item,
          KpiId: item.KpiId === undefined ? 0 : item.KpiId,
          Percent: +item.Percent,
          KpiContent: HandleTextArea(item.KpiContent),
          Frequency: HandleTextArea(item.Frequency),
          Requirement: HandleTextArea(item.Requirement),
          Regulation: HandleTextArea(item.Regulation),
          KpiValue: kpiValue.join(","),
          StaffId: staff.value,
        };
      });
      const pr = kpi;

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spKPI_Template_Staff_Save",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess("Lưu thành công");
      }
      Trl_spKPI_Template_Staff_List();
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
      Cell: ({ row }) => (
        <div>
          <span>
            <button
              className="btn btn-sm btn-success mr-2"
              onClick={() => kpiStaff_edit(row)}
            >
              <i class="far fa-edit"></i> Sửa
            </button>

            <button
              className="btn btn-sm btn-danger"
              onClick={(e) => {
                ConfirmAlert("Xác nhận", "Bạn có muốn xóa không?", () => {
                  Trl_spKPI_Template_Staff_Delete(row._original.StaffId);
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
      Header: "Nhân viên",
      accessor: "StaffName",
      minWidth: 150,
    },
    {
      Header: "Người tạo",
      accessor: "CreateName",
      minWidth: 150,
    },
    {
      Header: "Thời gian tạo",
      accessor: "CreateTime",
      Cell: (row) => (
        <span>{moment(row.value).format("DD/MM/YYYY hh:mm:ss")}</span>
      ),
      textAlign: "center",
      minWidth: 150,
    },
    {
      Header: "Người sửa",
      accessor: "EditName",
      minWidth: 150,
    },
    {
      Header: "Thời gian sửa",
      accessor: "EditTime",
      Cell: (row) => (
        <span>{moment(row.value).format("DD/MM/YYYY hh:mm:ss")}</span>
      ),
      textAlign: "center",
      minWidth: 150,
    },
  ];

  const kpiStaff_edit = (data) => {
    let newa = [];
    kpiTotalList.forEach((item) => {
      if (item[0].StaffId === data._original.StaffId) {
        newa = item;
      }
    });
    let tl = data._original.KpiValue.split(",").map((item) => {
      return { Percent: +item };
    });

    setKpiTitle(tl);
    setKpiFixed(newa.filter((item) => item.Type === 1));
    setKpiAdd(newa.filter((item) => item.Type === 2));
    setKpi3(newa.filter((item) => item.Type === 3));
    setKpi4(newa.filter((item) => item.Type === 4));
    setStaff({
      value: data._original.StaffId,
      label: data._original.StaffName,
      StaffId: data._original.StaffId,
      PositionName: data._original.PositionName,
      DepartmentName: data._original.DepartmentName,
    });
    document.querySelector("#tab_1").click();
  };

  const kpiStaff_cancel = () => {
    setKpiTitle([
      { Percent: 0 },
      { Percent: 0 },
      { Percent: 0 },
      { Percent: 0 },
      { Percent: 0 },
    ]);
    setKpiFixed([]);
    setKpiAdd([]);
    setKpi3([]);
    setKpi4([]);
    setStaff([]);
  };

  const EditableCellArea = ({
    ivalue = "",
    index = "",
    property = "",
    type = 0,
    edit = true,
    row = 10,
  }) => {
    const textareaRef = useRef(null);

    const adjustTextareaHeight = () => {
      const element = textareaRef.current;
      element.style.height = "auto";
      element.style.height = `${
        element.scrollHeight < 50 ? 50 : element.scrollHeight
      }px`;
    };
    useEffect(() => {
      adjustTextareaHeight();
    }, []);

    const [value, setValue] = useState(ivalue);
    const onChange = (e) => {
      setValue(e.target.value);
      adjustTextareaHeight();
    };

    const onBlur = (e) => {
      updateMyData(index, value, property, type);
    };

    useEffect(() => {
      setValue(ivalue);
    }, [ivalue]);

    return (
      <textarea
        type="text"
        class="text-area-hind form-control-none"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={` `}
        ref={textareaRef}
      />
    );
  };

  const KPIStaff = useMemo(() => {
    return (
      <>
        <div className="table-responsive">
          <table class="table table-bordered table-request-tour">
            <tbody className=" text-dark">
              <tr className="">
                <th
                  className="align-middle title-report-blue"
                  style={{ width: 50 }}
                >
                  STT
                </th>
                <th
                  className="align-middle title-report-blue"
                  style={{ width: 210 }}
                >
                  NỘI DUNG THỰC HIỆN <br />
                  (CHỈ TIÊU/MỤC TIÊU CẦN ĐẠT ĐƯỢC)
                </th>

                <th
                  className="align-middle title-report-blue"
                  style={{ width: 80 }}
                >
                  TẦN SUẤT
                </th>
                <th
                  className="align-middle title-report-blue"
                  style={{ width: 210 }}
                >
                  YÊU CẦU THỰC HIỆN
                </th>
                <th
                  className="align-middle title-report-blue"
                  style={{ width: "50px" }}
                >
                  TRỌNG SỐ (%)
                </th>

                <th
                  className="align-middle title-report-blue"
                  style={{ width: 210 }}
                >
                  CÁCH TÍNH VÀ CHẾ TÀI ĐÁNH GIÁ
                </th>
              </tr>
              <tr>
                <td className="text-center align-middle padding-td bold">A</td>
                <td className="text-center align-middle padding-td bold">
                  NHIỆM VỤ TRỌNG TÂM
                </td>
                <td className="text-center align-middle padding-td"></td>
                <td className="text-center align-middle padding-td"></td>
                <td className="text-center align-middle padding-td">
                  <EditableCell
                    updateMyData={updateMyData}
                    property="Percent"
                    type={1}
                    index={0}
                    ivalue={kpiTitle[0].Percent}
                  />
                </td>

                <td className="text-center align-middle padding-td"></td>
              </tr>
              <tr>
                <td className="text-center align-middle padding-td  bold">
                  I
                  <button
                    className=" ml-1 btn btn-light py-1 px-2"
                    onClick={() => {
                      setKpiFixed([...kpiFixed, { ...kpiTl, Type: 1 }]);
                    }}
                  >
                    <i class="text-success fas fa-plus-circle"></i>
                  </button>
                </td>
                <td className="text-center align-middle padding-td  bold">
                  KPI CỐ ĐỊNH
                </td>
                <td className="text-center align-middle padding-td"></td>
                <td className="text-center align-middle padding-td"></td>
                <td className="text-center align-middle padding-td">
                  <EditableCell
                    updateMyData={updateMyData}
                    property="Percent"
                    type={1}
                    index={1}
                    ivalue={kpiTitle[1].Percent}
                  />
                </td>
                <td className="text-center align-middle padding-td"></td>
              </tr>
              {kpiFixed.length > 0 &&
                kpiFixed.map((item, index) => {
                  return (
                    <tr key={index + "124"}>
                      <td className="text-center align-middle padding-td">
                        {index + 1}
                      </td>
                      <td className="text-center align-middle padding-td">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.KpiContent, 1)}
                          type={3}
                          index={index}
                          property={"KpiContent"}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Frequency, 1)}
                          type={3}
                          index={index}
                          property={"Frequency"}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        {" "}
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Requirement, 1)}
                          type={3}
                          index={index}
                          property={"Requirement"}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        <EditableCell
                          updateMyData={updateMyData}
                          property="Percent"
                          type={3}
                          index={index}
                          ivalue={item.Percent}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Regulation, 1)}
                          type={3}
                          index={index}
                          property={"Regulation"}
                        />
                      </td>
                    </tr>
                  );
                })}
              <tr>
                <td className="text-center align-middle padding-td  bold">
                  II
                  <button
                    className=" ml-1 btn btn-light py-1 px-2"
                    onClick={() => {
                      setKpiAdd([...kpiAdd, { ...kpiTl, Type: 2 }]);
                    }}
                  >
                    <i class="text-success fas fa-plus-circle"></i>
                  </button>
                </td>
                <td className="text-center align-middle padding-td  bold">
                  KPI BỔ SUNG (CÔNG VIỆC PHÁT SINH)
                </td>
                <td className="text-center align-middle padding-td"></td>
                <td className="text-center align-middle padding-td"></td>
                <td className="text-center align-middle padding-td">
                  <EditableCell
                    updateMyData={updateMyData}
                    property="Percent"
                    type={1}
                    index={2}
                    ivalue={kpiTitle[2].Percent}
                  />
                </td>
                <td className="text-center align-middle padding-td"></td>
              </tr>
              {kpiAdd.length > 0 &&
                kpiAdd.map((item, index) => {
                  return (
                    <tr key={index + "154"}>
                      <td className="text-center align-middle padding-td">
                        {index + 1}
                      </td>
                      <td className="text-center align-middle padding-td">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.KpiContent, 1)}
                          type={12}
                          index={index}
                          property={"KpiContent"}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Frequency, 1)}
                          type={12}
                          index={index}
                          property={"Frequency"}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        {" "}
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Requirement, 1)}
                          type={12}
                          index={index}
                          property={"Requirement"}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        {" "}
                        <EditableCell
                          updateMyData={updateMyData}
                          property="Percent"
                          type={12}
                          index={index}
                          ivalue={item.Percent}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Regulation, 1)}
                          type={12}
                          index={index}
                          property={"Regulation"}
                        />
                      </td>
                    </tr>
                  );
                })}
              <tr>
                <td className="text-center align-middle padding-td  bold">
                  B
                  <button
                    className=" ml-1 btn btn-light py-1 px-2"
                    onClick={() => {
                      setKpi3([...kpi3, { ...kpiTl, Type: 3 }]);
                    }}
                  >
                    <i class="text-success fas fa-plus-circle"></i>
                  </button>
                </td>
                <td className="text-center align-middle padding-td  bold">
                  KỶ LUẬT LAO ĐỘNG
                </td>
                <td className="text-center align-middle padding-td"></td>
                <td className="text-center align-middle padding-td"></td>
                <td className="text-center align-middle padding-td">
                  {" "}
                  <EditableCell
                    updateMyData={updateMyData}
                    property="Percent"
                    type={1}
                    index={3}
                    ivalue={kpiTitle[3].Percent}
                  />
                </td>
                <td className="text-center align-middle padding-td"></td>
              </tr>
              {kpi3.length > 0 &&
                kpi3.map((item, index) => {
                  return (
                    <tr key={index + "1324"}>
                      <td className="text-center align-middle padding-td">
                        {index + 1}
                      </td>
                      <td className="text-center align-middle padding-td">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.KpiContent, 1)}
                          type={13}
                          index={index}
                          property={"KpiContent"}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Frequency, 1)}
                          type={13}
                          index={index}
                          property={"Frequency"}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        {" "}
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Requirement, 1)}
                          type={13}
                          index={index}
                          property={"Requirement"}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        {" "}
                        <EditableCell
                          updateMyData={updateMyData}
                          property="Percent"
                          type={13}
                          index={index}
                          ivalue={item.Percent}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Regulation, 1)}
                          type={13}
                          index={index}
                          property={"Regulation"}
                        />
                      </td>
                    </tr>
                  );
                })}
              <tr>
                <td className="text-center align-middle padding-td  bold">
                  C
                  <button
                    className=" ml-1 btn btn-light py-1 px-2"
                    onClick={() => {
                      setKpi4([...kpi4, { ...kpiTl, Type: 4 }]);
                    }}
                  >
                    <i class="text-success fas fa-plus-circle"></i>
                  </button>
                </td>
                <td className="text-center align-middle padding-td  bold">
                  PHÁT HUY SÁNG KIẾN
                </td>
                <td className="text-center align-middle padding-td"></td>
                <td className="text-center align-middle padding-td"></td>
                <td className="text-center align-middle padding-td">
                  {" "}
                  <EditableCell
                    updateMyData={updateMyData}
                    property="Percent"
                    type={1}
                    index={4}
                    ivalue={kpiTitle[4].Percent}
                  />
                </td>
                <td className="text-center align-middle padding-td"></td>
              </tr>
              {kpi4.length > 0 &&
                kpi4.map((item, index) => {
                  return (
                    <tr key={index + "1124"}>
                      <td className="text-center align-middle padding-td">
                        {index + 1}
                      </td>
                      <td className="text-center align-middle padding-td">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.KpiContent, 1)}
                          type={14}
                          index={index}
                          property={"KpiContent"}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Frequency, 1)}
                          type={14}
                          index={index}
                          property={"Frequency"}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        {" "}
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Requirement, 1)}
                          type={14}
                          index={index}
                          property={"Requirement"}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        {" "}
                        <EditableCell
                          updateMyData={updateMyData}
                          property="Percent"
                          type={14}
                          index={index}
                          ivalue={item.Percent}
                        />
                      </td>
                      <td className="text-center align-middle padding-td">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Regulation, 1)}
                          type={14}
                          index={index}
                          property={"Regulation"}
                        />
                      </td>
                    </tr>
                  );
                })}
              <tr>
                <td
                  className="text-center align-middle padding-td  bold "
                  colSpan={2}
                >
                  Tổng cộng = A + B + C
                </td>
                <td className="text-center align-middle padding-td"></td>
                <td className="text-center align-middle padding-td"></td>
                <td className="text-center align-middle padding-td">
                  {+kpiTitle[0].Percent +
                    +kpiTitle[3].Percent +
                    +kpiTitle[4].Percent}
                  %
                </td>
                <td className="text-center align-middle padding-td"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }, [kpiFixed, kpiAdd, kpi3, kpi4, kpiTitle]);

  return (
    <>
      <div className="content-wrapper">
        <div className="card card-primary">
          <ul className="nav float-left">
            <li className="nav-item ">
              <a
                id="tab_1"
                className="nav-link  active"
                href="#tab_1add"
                data-toggle="tab"
              >
                KPI NHÂN VIÊN
              </a>
            </li>
            <li className="nav-item">
              <a
                id="tab_3"
                className="nav-link "
                href="#tab_3add"
                data-toggle="tab"
              >
                DANH SÁCH KPI
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
                          TẠO KPI NHÂN VIÊN
                        </span>
                      </h3>
                    </div>
                    <div class="col-sm-12 col-md-9 margin-top-5s">
                      <button
                        className="btn btn-sm btn-danger pull-right ml-2"
                        onClick={() => {
                          kpiStaff_cancel();
                        }}
                      >
                        <i class="fa fa-trash pr-2"></i>
                        Hủy
                      </button>
                      <button
                        className="btn btn-sm btn-success pull-right ml-2"
                        onClick={() => {
                          ConfirmAlert(
                            "Xác nhận",
                            "Bạn có muốn lưu không?",
                            () => {
                              Trl_spKPI_Template_Staff_Save();
                            }
                          );
                        }}
                      >
                        <i class="fa fa-plus pr-2"></i>
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>
                <div class="card-body ">
                  <div class="card-body p-0 tour-request">
                    <div className="center-item mb-2 ">
                      <h3 class=" font-weight-bold text-dark fs-18 d-flex justify-content-center align-items-center">
                        KPI NHÂN VIÊN
                      </h3>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12 border-bottom">
                            <div className="row">
                              <div className="col-2 font-weight-bold d-flex align-items-center">
                                Tên Nhân Viên:
                              </div>
                              <div className="col-3 ">
                                <div class="input-group">
                                  <SelectStaff
                                    className="w-100 h-100 select-custom z-maxx"
                                    onSelected={(e) => {
                                      setStaff(e);
                                    }}
                                    onStaffId={staff.value}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 border-bottom">
                            <div className="row">
                              <div className="col-2 font-weight-bold ">
                                Phòng ban:
                              </div>
                              <div className="col-10 text-uppercase">
                                {staff?.DepartmentName}
                              </div>
                            </div>
                          </div>
                          <div className="col-12 border-bottom">
                            <div className="row">
                              <div className="col-2 font-weight-bold ">
                                Chức vụ:
                              </div>
                              <div className="col-10 text-uppercase">
                                {staff?.PositionName}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-12 py-3 px-0">{KPIStaff}</div>
                    </div>
                  </div>
                  {/* <DataTable data={reportList} columns={columns} /> */}

                  <Modal
                    show={showFormCreateKPI}
                    onHide={() => {
                      setShowFormCreateKPI(false);
                    }}
                    aria-labelledby="example-custom-modal-styling-title"
                    className=" custom-modal-w-100"
                  >
                    <Modal.Header>
                      <Modal.Title id="example-custom-modal-styling-title">
                        <div class=""></div>
                      </Modal.Title>
                      <div class="col-sm-12 col-md-6 margin-top-5s">
                        <button
                          type="button"
                          class="btn btn-sm pull-right close"
                          aria-label="Close"
                          onClick={() => {
                            ConfirmAlert(
                              "Xác nhận",
                              "Bạn có muốn lưu trước khi thoát không?",
                              () => {
                                setShowFormCreateKPI(false);
                              },
                              "Đồng Ý",
                              "Không Đồng Ý",
                              true,
                              () => {
                                setShowFormCreateKPI(false);
                              }
                            );
                          }}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                        <button
                          type="button"
                          class="btn btn-sm btn-success pull-right "
                        >
                          <i class="fa fa-edit pr-2"></i>
                          Thêm mới
                        </button>
                      </div>
                    </Modal.Header>
                    <Modal.Body id="excell">
                      <div class="card-body p-0 tour-request">
                        <div className="center-item mb-2 ">
                          <h3 class=" font-weight-bold text-dark fs-18 d-flex justify-content-center align-items-center">
                            KPI NHÂN VIÊN
                          </h3>
                        </div>

                        <div className="row">
                          <div className="col-12">
                            <div className="row">
                              <div className="col-12 border-bottom">
                                <div className="row">
                                  <div className="col-2 font-weight-bold d-flex align-items-center">
                                    Tên Nhân Viên:
                                  </div>
                                  <div className="col-3 ">
                                    <div class="input-group">
                                      <SelectStaff
                                        className="w-100 h-100 select-custom z-maxx"
                                        onSelected={(e) => {
                                          setStaff(e);
                                        }}
                                        onStaffId={staff.value}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 border-bottom">
                                <div className="row">
                                  <div className="col-2 font-weight-bold ">
                                    Phòng ban:
                                  </div>
                                  <div className="col-10 text-uppercase">
                                    {staff?.DepartmentName}
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 border-bottom">
                                <div className="row">
                                  <div className="col-2 font-weight-bold ">
                                    Chức vụ:
                                  </div>
                                  <div className="col-10 text-uppercase">
                                    {staff?.PositionName}
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 border-bottom">
                                <div className="row">
                                  <div className="col-2 font-weight-bold d-flex align-items-center">
                                    Từ ngày:
                                  </div>
                                  <div className="col-3">
                                    <div class="input-group ">
                                      <DateTimeRangePicker
                                        className="form-control2"
                                        value={timeReport}
                                        onChange={(date) => setTimeReport(date)}
                                        format={"dd/MM/yyyy"}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-12 py-3 px-0">
                            <div className="table-responsive">
                              <table class="table table-bordered table-request-tour">
                                <tbody className=" text-dark">
                                  <tr className="">
                                    <th
                                      className="align-middle title-report-blue"
                                      style={{ width: 50 }}
                                    >
                                      STT
                                    </th>
                                    <th
                                      className="align-middle title-report-blue"
                                      style={{ width: 210 }}
                                    >
                                      NỘI DUNG THỰC HIỆN <br />
                                      (CHỈ TIÊU/MỤC TIÊU CẦN ĐẠT ĐƯỢC)
                                    </th>
                                    <th
                                      className="align-middle title-report-blue"
                                      style={{ width: 80 }}
                                    >
                                      NGÀY GIAO
                                    </th>
                                    <th
                                      className="align-middle title-report-blue"
                                      style={{ width: 80 }}
                                    >
                                      TẦN SUẤT
                                    </th>
                                    <th
                                      className="align-middle title-report-blue"
                                      style={{ width: 210 }}
                                    >
                                      YÊU CẦU THỰC HIỆN
                                    </th>
                                    <th
                                      className="align-middle title-report-blue"
                                      style={{ width: "50px" }}
                                    >
                                      TRỌNG SỐ
                                    </th>
                                    <th
                                      className="align-middle title-report-blue"
                                      style={{ width: 50 }}
                                    >
                                      N.VIÊN ĐÁNH GIÁ
                                    </th>
                                    <th
                                      className="align-middle title-report-blue"
                                      style={{ width: 50 }}
                                    >
                                      Q.LÝ ĐÁNH GIÁ
                                    </th>
                                    <th
                                      className="align-middle title-report-blue"
                                      style={{ width: 210 }}
                                    >
                                      CÁCH TÍNH VÀ CHẾ TÀI ĐÁNH GIÁ
                                    </th>
                                  </tr>
                                  {KPIStaff}
                                  {/* {RenderKpiFixed} */}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
              <div
                className="tab-pane fade show "
                id="tab_3add"
                role="tabpanel"
                aria-labelledby="custom-tabs-two-home-tab"
              >
                <div className="card-header border-left-red">
                  <div className="row">
                    <div class="col-sm-12 col-md-3 ">
                      <h3 className="card-title">
                        <span className="font-weight-bold">
                          ĐÁNH GIÁ KPI NHÂN VIÊN
                        </span>
                      </h3>
                    </div>
                    <div class="col-sm-12 col-md-9 margin-top-5s">
                      <button
                        type="button"
                        class="btn btn-sm btn-danger pull-right margin-left-5"
                        onClick={(e) => {
                          Trl_spKPI_Template_Staff_List();
                        }}
                      >
                        <i class="fa fa-search pr-2"></i>
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>
                <div class="card-body ">
                  <DataTable data={kpiList} columns={columns} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

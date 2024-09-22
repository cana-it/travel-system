import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alerterror,
  ConfirmAlert,
  HandleTextArea,
  Alertsuccess,
  Alertwarning,
} from "../../../../Utils";
import { DataTable, SelectStaff } from "../../../../Common";
import moment from "moment";
export const InitKPI = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");

  const [showFormCreateKPI, setShowFormCreateKPI] = useState();
  const [timeReport, setTimeReport] = useState();
  const [staff, setStaff] = useState([]);
  const [kpiStaffList, setKpiStaffList] = useState([]);
  const [kpiList, setKpiList] = useState([]);
  const [kpiTotalList, setKpiTotalList] = useState([]);
  const [monthKpi, setmonthKpi] = useState(moment().format("YYYY-MM"));
  const [monthKpiSearch, setmonthKpiSearch] = useState(
    moment().format("YYYY-MM")
  );

  const [kpiTl, setTl] = useState({
    KpiContent: "",
    Frequency: "",
    Requirement: "",
    Regulation: "",
    Creater: +Creater,
    Percent: 0,
  });

  const [kpiTitle, setKpiTitle] = useState([
    { Percent: 0, PercentStaff: 0, PercentManager: 0 },
    { Percent: 0, PercentStaff: 0, PercentManager: 0 },
    { Percent: 0, PercentStaff: 0, PercentManager: 0 },
    { Percent: 0, PercentStaff: 0, PercentManager: 0 },
    { Percent: 0, PercentStaff: 0, PercentManager: 0 },
  ]);
  const [kpiSum, setKpiSum] = useState({
    Percent: 0,
    PercentStaff: 0,
    PercentManager: 0,
  });

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
        className=" padding-td4 w-100 my-1"
      >
        <span className=" "> {value2}</span>
      </div>
    );
  };

  const Trl_spKPI_Template_Staff_List = async (staffId) => {
    try {
      const pr = {
        StaffId: staffId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spKPI_Template_Staff_List",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.length > 0) {
        let newRest = res.map((item) => {
          return { ...item, KpiId: 0 };
        });
        kpiStaff_init(newRest);
        setKpiStaffList(newRest);
      } else {
        Alertwarning("Nhân viên chưa được gán KPI");
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };
  useEffect(() => {
    Trl_spKPI_Staff_List();
  }, []);

  const Trl_spKPI_Staff_List = async (type = 0) => {
    try {
      const pr = {
        StaffId: 0,
        MonthKpi: moment(monthKpiSearch).format("MM-01-YYYY 00:00:00"),
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spKPI_Staff_List",
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
        let kpi1 =
          +item[0].KpiValue.split(",")[0] +
          +item[0].KpiValue.split(",")[3] +
          +item[0].KpiValue.split(",")[4];
        let kpi2 = item.reduce((a, b) => a + +b.PercentStaff, 0);
        let kpi3 = item.reduce((a, b) => a + +b.PercentManager, 0);
        return { ...item[0], kpi1, kpi2, kpi3 };
      });
      setKpiList(rs);
      setKpiTotalList(Object.values(result2));
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spKPI_Staff_Delete = async (staffid) => {
    try {
      const pr = {
        StaffId: staffid,
        MonthKpi: moment(monthKpiSearch).format("MM-01-YYYY 00:00:00"),
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spKPI_Staff_Delete",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Xóa thành công");
        Trl_spKPI_Staff_List();
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spKPI_Staff_Save = async (id) => {
    try {
      let kpiValue = kpiTitle.map((item) => {
        return item.Percent;
      });

      let kpi = [...kpiFixed, ...kpiAdd, ...kpi3, ...kpi4].map((item) => {
        return {
          ...item,
          KpiId: item.KpiId === undefined ? 0 : item.KpiId,
          Percent: +item.Percent,
          PercentStaff: +item?.PercentStaff || 0,
          PercentManager: +item?.PercentManager || 0,
          KpiContent: HandleTextArea(item.KpiContent),
          Frequency: HandleTextArea(item.Frequency),
          Requirement: HandleTextArea(item.Requirement),
          Regulation: HandleTextArea(item.Regulation),
          KpiValue: kpiValue.join(","),
          StaffId: staff.value,
          MonthKpi: moment(monthKpi).format("MM-01-YYYY 00:00:00"),
          DayCreate: moment(monthKpi).format("01-MM-YYYY"),
        };
      });
      if (kpi[0].StaffId === 0) {
        Alertwarning("Vui lòng chọn nhân viên");
        return;
      }

      const params = {
        Json: JSON.stringify(kpi),
        func: "Trl_spKPI_Staff_Save",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess("Lưu thành công");
        Trl_spKPI_Staff_List();
      } else {
        Alerterror(result.ReturnMess);
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
                  Trl_spKPI_Staff_Delete(row._original.StaffId);
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
      Header: "Tổng KPI",
      accessor: "kpi1",
      minWidth: 150,
    },
    {
      Header: "KPI n.viên đánh giá",
      accessor: "kpi2",
      minWidth: 150,
    },

    {
      Header: "KPI q.lý đánh giá",
      accessor: "kpi3",
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
  const kpiStaff_init = (dataI) => {
    setKpiFixed(dataI.filter((item) => item.Type === 1));
    setKpiAdd(dataI.filter((item) => item.Type === 2));
    setKpi3(dataI.filter((item) => item.Type === 3));
    setKpi4(dataI.filter((item) => item.Type === 4));
    setStaff({
      value: dataI[0].StaffId,
      label: dataI[0].StaffName,
      StaffId: dataI[0].StaffId,
      PositionName: dataI[0].PositionName,
      DepartmentName: dataI[0].DepartmentName,
    });
    let tl = dataI[0].KpiValue.split(",").map((item) => {
      return { Percent: +item, PercentStaff: +item, PercentManager: +item };
    });

    setKpiTitle(tl);
    document.querySelector("#tab_1").click();
  };

  const kpiStaff_cancel = () => {
    setKpiTitle([
      { Percent: 0, PercentStaff: 0, PercentManager: 0 },
      { Percent: 0, PercentStaff: 0, PercentManager: 0 },
      { Percent: 0, PercentStaff: 0, PercentManager: 0 },
      { Percent: 0, PercentStaff: 0, PercentManager: 0 },
      { Percent: 0, PercentStaff: 0, PercentManager: 0 },
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

    useEffect(() => {
      setValue(ivalue);
    }, [ivalue]);

    return (
      <textarea
        type="text"
        class="text-area-hind2 form-control-none"
        defaultValue={value}
        ref={textareaRef}
      />
    );
  };

  const handleKPIPercent = () => {
    let arrKPI = [...kpiFixed, ...kpiAdd, ...kpi3, ...kpi4];
    if (arrKPI.length === 0) {
      setKpiSum({ ...kpiSum, PercentStaff: 0, PercentManager: 0 });
    }
    let sum = 0,
      sum2 = 0;
    arrKPI.forEach((item) => {
      sum += +item?.PercentStaff || 0;
      sum2 += +item?.PercentManager || 0;
    });
    setKpiSum({ ...kpiSum, PercentStaff: sum, PercentManager: sum2 });
  };

  useEffect(() => {
    handleKPIPercent();
  }, [kpiFixed, kpiAdd, kpi3, kpi4]);

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
                  TRỌNG SỐ (%)
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
              <tr>
                <td className="text-center align-middle   bold">A</td>
                <td className="text-center align-middle   bold">
                  NHIỆM VỤ TRỌNG TÂM
                </td>
                <td className="text-center align-middle  "></td>
                <td className="text-center align-middle  "></td>
                <td className="text-center align-middle  "></td>
                <td className="text-center align-middle   bold">
                  {kpiTitle[0].Percent}
                </td>
                <td className="text-center align-middle  p-1 bold">
                  {kpiTitle[0].Percent}
                </td>
                <td className="text-center align-middle  p-1  bold">
                  {/* <EditableCell
                    updateMyData={updateMyData}
                    property="PercentManager"
                    type={1}
                    index={0}
                    ivalue={kpiTitle[0].PercentManager}
                  /> */}
                  {kpiTitle[0].Percent}
                </td>
                <td className="text-center align-middle   p-1  "></td>
              </tr>
              <tr>
                <td className="text-center align-middle    bold">I</td>
                <td className="text-center align-middle    bold">
                  KPI CỐ ĐỊNH
                </td>
                <td className="text-center align-middle   p-1  "></td>
                <td className="text-center align-middle   p-1  "></td>
                <td className="text-center align-middle   p-1  "></td>
                <td className="text-center align-middle  p-1  padding-td bold">
                  {kpiTitle[1].Percent}
                </td>
                <td className="text-center align-middle  p-1  padding-td bold">
                  {kpiTitle[1].Percent}
                </td>
                <td className="text-center align-middle  p-1 padding-td bold">
                  {kpiTitle[1].Percent}
                </td>
                <td className="text-center align-middle   p-1 padding-td  bold"></td>
              </tr>
              {kpiFixed.length > 0 &&
                kpiFixed.map((item, index) => {
                  return (
                    <tr key={index + "124"}>
                      <td className="text-center align-middle  ">
                        {index + 1}
                      </td>
                      <td className="text-center align-middle   p-1  ">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.KpiContent, 1)}
                          type={3}
                          index={index}
                          property={"KpiContent"}
                        />
                      </td>
                      <td className="text-center align-middle   p-1  ">
                        {moment(monthKpi).format("01-MM-YYYY")}
                      </td>
                      <td className="text-center align-middle   p-1  ">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Frequency, 1)}
                          type={3}
                          index={index}
                          property={"Frequency"}
                        />
                      </td>
                      <td className="text-center align-middle   p-1  ">
                        {" "}
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Requirement, 1)}
                          type={3}
                          index={index}
                          property={"Requirement"}
                        />
                      </td>
                      <td className="text-center align-middle   p-1 ">
                        {item.Percent}
                      </td>
                      <td className="text-center align-middle   p-1 ">
                        <EditableCell
                          updateMyData={updateMyData}
                          property="PercentStaff"
                          type={3}
                          index={index}
                          ivalue={item.PercentStaff}
                        />
                      </td>
                      <td className="text-center align-middle   p-1 ">
                        <EditableCell
                          updateMyData={updateMyData}
                          property="PercentManager"
                          type={3}
                          index={index}
                          ivalue={item.PercentManager}
                        />
                      </td>
                      <td className="text-center align-middle    p-1 ">
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
                <td className="text-center align-middle    bold">II</td>
                <td className="text-center align-middle    bold">
                  KPI BỔ SUNG (CÔNG VIỆC PHÁT SINH)
                </td>
                <td className="text-center align-middle   p-1  "></td>
                <td className="text-center align-middle   p-1  "></td>
                <td className="text-center align-middle   p-1  "></td>
                <td className="text-center align-middle  p-1 padding-td  bold">
                  {kpiTitle[2].Percent}
                </td>
                <td className="text-center align-middle  p-1 padding-td  bold">
                  {kpiTitle[2].Percent}
                </td>
                <td className="text-center align-middle p-1 padding-td   bold">
                  {kpiTitle[2].Percent}
                </td>
                <td className="text-center align-middle  "></td>
              </tr>
              {kpiAdd.length > 0 &&
                kpiAdd.map((item, index) => {
                  return (
                    <tr key={index + "154"}>
                      <td className="text-center align-middle  ">
                        {index + 1}
                      </td>
                      <td className="text-center align-middle    p-1 ">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.KpiContent, 1)}
                          type={12}
                          index={index}
                          property={"KpiContent"}
                        />
                      </td>
                      <td className="text-center align-middle    p-1 ">
                        {" "}
                        {moment(monthKpi).format("01-MM-YYYY")}
                      </td>
                      <td className="text-center align-middle    p-1 ">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Frequency, 1)}
                          type={12}
                          index={index}
                          property={"Frequency"}
                        />
                      </td>
                      <td className="text-center align-middle   p-1  ">
                        {" "}
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Requirement, 1)}
                          type={12}
                          index={index}
                          property={"Requirement"}
                        />
                      </td>
                      <td className="text-center align-middle  p-1  ">
                        {item.Percent}
                      </td>
                      <td className="text-center align-middle  p-1  ">
                        <EditableCell
                          updateMyData={updateMyData}
                          property="PercentStaff"
                          type={12}
                          index={index}
                          ivalue={item.PercentStaff}
                        />
                      </td>
                      <td className="text-center align-middle  p-1  ">
                        {" "}
                        <EditableCell
                          updateMyData={updateMyData}
                          property="PercentManager"
                          type={12}
                          index={index}
                          ivalue={item.PercentManager}
                        />
                      </td>
                      <td className="text-center align-middle   p-1  ">
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
                <td className="text-center align-middle    bold">B</td>
                <td className="text-center align-middle    bold">
                  KỶ LUẬT LAO ĐỘNG
                </td>
                <td className="text-center align-middle  "></td>
                <td className="text-center align-middle  "></td>
                <td className="text-center align-middle  "></td>
                <td className="text-center align-middle  p-1 padding-td  bold">
                  {kpiTitle[3].Percent}
                </td>
                <td className="text-center align-middle  p-1 padding-td  bold">
                  {" "}
                  {kpiTitle[3].Percent}
                </td>
                <td className="text-center align-middle   p-1 padding-td bold">
                  {" "}
                  {kpiTitle[3].Percent}
                </td>
                <td className="text-center align-middle   p-1  "></td>
              </tr>
              {kpi3.length > 0 &&
                kpi3.map((item, index) => {
                  return (
                    <tr key={index + "1324"}>
                      <td className="text-center align-middle   p-1  ">
                        {index + 1}
                      </td>

                      <td className="text-center align-middle  p-1  ">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.KpiContent, 1)}
                          type={13}
                          index={index}
                          property={"KpiContent"}
                        />
                      </td>
                      <td className="text-center align-middle    p-1 ">
                        {" "}
                        {moment(monthKpi).format("01-MM-YYYY")}
                      </td>
                      <td className="text-center align-middle  ">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Frequency, 1)}
                          type={13}
                          index={index}
                          property={"Frequency"}
                        />
                      </td>
                      <td className="text-center align-middle    p-1 ">
                        {" "}
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Requirement, 1)}
                          type={13}
                          index={index}
                          property={"Requirement"}
                        />
                      </td>
                      <td className="text-center align-middle   p-1 ">
                        {item.Percent}
                      </td>
                      <td className="text-center align-middle   p-1 ">
                        {" "}
                        <EditableCell
                          updateMyData={updateMyData}
                          property="PercentStaff"
                          type={13}
                          index={index}
                          ivalue={item.PercentStaff}
                        />
                      </td>
                      <td className="text-center align-middle   p-1 ">
                        {" "}
                        <EditableCell
                          updateMyData={updateMyData}
                          property="PercentManager"
                          type={13}
                          index={index}
                          ivalue={item.PercentManager}
                        />
                      </td>
                      <td className="text-center align-middle  p-1   ">
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
                <td className="text-center align-middle    bold">C</td>
                <td className="text-center align-middle    bold">
                  PHÁT HUY SÁNG KIẾN
                </td>
                <td className="text-center align-middle  "></td>
                <td className="text-center align-middle  "></td>
                <td className="text-center align-middle  "></td>
                <td className="text-center align-middle   p-1 bold ">
                  {kpiTitle[4].Percent}
                </td>
                <td className="text-center align-middle  p-1  padding-td bold">
                  {" "}
                  {kpiTitle[4].Percent}
                </td>
                <td className="text-center align-middle  p-1 padding-td bold">
                  {" "}
                  {kpiTitle[4].Percent}
                </td>
                <td className="text-center align-middle    p-1 "></td>
              </tr>
              {kpi4.length > 0 &&
                kpi4.map((item, index) => {
                  return (
                    <tr key={index + "1124"}>
                      <td className="text-center align-middle  ">
                        {index + 1}
                      </td>
                      <td className="text-center align-middle   p-1  ">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.KpiContent, 1)}
                          type={14}
                          index={index}
                          property={"KpiContent"}
                        />
                      </td>
                      <td className="text-center align-middle    p-1 ">
                        {" "}
                        {moment(monthKpi).format("01-MM-YYYY")}
                      </td>
                      <td className="text-center align-middle   p-1  ">
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Frequency, 1)}
                          type={14}
                          index={index}
                          property={"Frequency"}
                        />
                      </td>
                      <td className="text-center align-middle    p-1 ">
                        {" "}
                        <EditableCellArea
                          ivalue={HandleTextArea(item.Requirement, 1)}
                          type={14}
                          index={index}
                          property={"Requirement"}
                        />
                      </td>
                      <td className="text-center align-middle   p-1 ">
                        {item.Percent}
                      </td>
                      <td className="text-center align-middle   p-1 ">
                        {" "}
                        <EditableCell
                          updateMyData={updateMyData}
                          property="PercentStaff"
                          type={14}
                          index={index}
                          ivalue={item.PercentStaff}
                        />
                      </td>
                      <td className="text-center align-middle  p-1  ">
                        {" "}
                        <EditableCell
                          updateMyData={updateMyData}
                          property="PercentManager"
                          type={14}
                          index={index}
                          ivalue={item.PercentManager}
                        />
                      </td>

                      <td className="text-center align-middle  p-1   ">
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
                <td className="text-center align-middle    bold " colSpan={2}>
                  Tổng cộng = A + B + C
                </td>
                <td className="text-center align-middle  "></td>
                <td className="text-center align-middle  "></td>
                <td className="text-center align-middle  "></td>
                <td className="text-center align-middle   p-1  bold">
                  {+kpiTitle[0].Percent +
                    +kpiTitle[3].Percent +
                    +kpiTitle[4].Percent}
                  %
                </td>
                <td className="text-center align-middle   p-1 bold ">
                  {kpiSum.PercentStaff}%
                </td>
                <td className="text-center align-middle  p-1  bold ">
                  {kpiSum.PercentManager}%
                </td>
                <td className="text-center align-middle  "></td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }, [kpiFixed, kpiAdd, kpi3, kpi4, kpiTitle, kpiSum, monthKpi]);

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
                              Trl_spKPI_Staff_Save();
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
                        ĐÁNH GIÁ CHỈ TIÊU KPI HÀNG THÁNG
                      </h3>
                    </div>

                    <div className="row">
                      <div className="col-12 ">
                        <div className="row">
                          <div className="col-md-6 col-12 border-bottom">
                            <div className="row">
                              <div className="col-3 font-weight-bold d-flex align-items-center">
                                Tên Nhân Viên:
                              </div>
                              <div className="col-6 ">
                                <div class="input-group">
                                  <SelectStaff
                                    className="w-100 h-100 select-custom z-maxx"
                                    onSelected={(e) => {
                                      setStaff(e);
                                      Trl_spKPI_Template_Staff_List(e.value);
                                    }}
                                    onStaffId={staff.value}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12 border-bottom">
                            <div className="row">
                              <div className="col-3 font-weight-bold d-flex align-items-center">
                                Tháng đánh giá:
                              </div>
                              <div className="col-6 ">
                                <div class="input-group">
                                  <input
                                    type="month"
                                    id="start"
                                    name="start"
                                    className="form-control2"
                                    value={monthKpi}
                                    onChange={(e) => {
                                      setmonthKpi(e.target.value);
                                    }}
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
                </div>
              </div>
              <div
                className="tab-pane fade show "
                id="tab_3add"
                role="tabpanel"
                aria-labelledby="custom-tabs-two-home-tab"
              >
                <div className="card-header p-0">
                  <div className="row px-3">
                    <div class="col-sm-12 col-md-3 d-flex align-items-center">
                      <h3 className="card-title">
                        <span className="font-weight-bold">
                          ĐÁNH GIÁ KPI NHÂN VIÊN
                        </span>
                      </h3>
                    </div>
                    <div class="col-sm-12 col-md-9 d-flex align-items-center flex-row-reverse">
                      <button
                        type="button"
                        class="btn btn-sm btn-danger pull-right margin-left-5"
                        onClick={(e) => {
                          Trl_spKPI_Staff_List();
                        }}
                      >
                        <i class="fa fa-search pr-2"></i>
                        Tìm kiếm
                      </button>
                      <div
                        class="form-group pull-right m-0"
                        style={{ marginTop: "0px", width: "20%" }}
                      >
                        <div class="input-group" style={{ width: "100%" }}>
                          <input
                            type="month"
                            id="start"
                            name="start"
                            className="form-control2"
                            value={monthKpiSearch}
                            onChange={(e) => {
                              setmonthKpiSearch(e.target.value);
                            }}
                          />
                        </div>
                      </div>
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

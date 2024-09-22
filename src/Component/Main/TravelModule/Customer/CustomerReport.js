import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  ConfirmAlert,
  HandleTextArea,
} from "../../../../Utils";
import { DataTable, SelectStaff, ApexchartsPie } from "../../../../Common";
import Modal from "react-bootstrap/Modal";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import moment from "moment";
import { useMemo } from "react";
import { IMAGES_DOMAIN } from "../../../../Services";
import * as htmlToImage from "html-to-image";
import Select from "react-select";
import { jsPDF } from "jspdf";
import { Img } from "react-image";

export const CustomerReport = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const [showFormAdd, setShowFormAdd] = useState();
  const [timeReport, setTimeReport] = useState();
  const [reportList, setReportList] = useState([]);
  const [reportId, setReportId] = useState(0);
  const [reportGeneralId, setReportGeneralId] = useState(0);
  const [reportName, setReportName] = useState("BÁO CÁO TUẦN");
  const [dataReportAreaWithMonth, setdataReportAreaWithMonth] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [hover, setHover] = useState(false);
  const [note, setNote] = useState("");
  const [note2, setNote2] = useState("");
  const [noteTotal, setNoteTotal] = useState("");
  const [editName, setEditName] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  const [dataOfYear, setDataOfYear] = useState({});
  const [template, setTemplate] = useState({
    ZlHavePhone: "",
    ZlNoHavePhone: "",
    Other: "",
    Hotline: "",
    Switchboard: "",
    FbHavePhoneAuUc: "",
    FbHavePhoneMy: "",
    FbNoHaveInfo: "",
    Price: "",
    TotalCustomerZlFb: "",
    NoMatching: "",
    Spam: "",
    NoNeed: "",
    TotalCustomerNoNeed: "",
  });
  const [totalSumInReport, setTotalSumInReport] = useState({});

  const [templateReportWithArea, setTemplateReportWithArea] = useState([
    { Area: "CHÂU ÂU" },
    { Area: "CHÂU ÚC" },
    { Area: "CHÂU MỸ" },
    { Area: "CHÂU PHI" },
    { Area: "CHÂU Á" },
    { Area: "KHÁC" },
  ]);
  const [reportWithArea, setReportWithArea] = useState([
    { Area: "CHÂU ÂU" },
    { Area: "CHÂU ÚC" },
    { Area: "CHÂU MỸ" },
    { Area: "CHÂU PHI" },
    { Area: "CHÂU Á" },
    { Area: "KHÁC" },
  ]);

  const [yearSearch, setYearSearch] = useState({
    value: moment().year(),
    label: moment().year(),
  });
  const [yearValue, setYearValue] = useState([
    { value: 2023, label: 2023 },
    { value: 2024, label: 2024 },
    { value: 2025, label: 2025 },
    { value: 2026, label: 2026 },
    { value: 2027, label: 2027 },
    { value: 2028, label: 2028 },
    { value: 2029, label: 2029 },
    { value: 2030, label: 2030 },
  ]);

  const [dataReportTable, setDataReportTable] = useState([]);
  const [staff, setStaff] = useState({ value: 0, label: "Vui lòng chọn" });

  useEffect(() => {
    if (timeReport && timeReport.length > 0 && !isEdit) {
      const startDate = timeReport[0] ? moment(timeReport[0]) : moment();
      const endDate = timeReport[1] ? moment(timeReport[1]) : moment();
      let arr = [];

      while (startDate.isBefore(endDate)) {
        let day = startDate.format("DD-MM-YYYY");

        arr.push({ Date: day, ...template });
        startDate.add(1, "day");
      }
      setDataReportTable(arr);
    }
  }, [timeReport]);

  const exxcel = async () => {
    await setIsPdf(true);
    await htmlToImage
      .toPng(document.getElementById("excell"), { quality: 0.95 })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "my-image-name.jpeg";
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("bao-cao-tuan.pdf");
      });
    await setIsPdf(false);
  };
  const exportDpfYear = async () => {
    await setIsPdf(true);
    await htmlToImage
      .toPng(document.getElementById("report-year"), { quality: 0.95 })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "my-image-name2.jpeg";
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("bao-cao-nam.pdf");
      });
    await setIsPdf(false);
  };

  useEffect(() => {
    let abc = dataReportTable.reduce(
      (acc, cur) => {
        acc.ZlHavePhone += +handlePercent(cur.ZlHavePhone) || 0;
        acc.ZlNoHavePhone += +handlePercent(cur.ZlNoHavePhone);
        acc.Other += +handlePercent(cur.Other);
        acc.Hotline += +handlePercent(cur.Hotline);
        acc.Switchboard += +handlePercent(cur.Switchboard);
        acc.FbHavePhoneAuUc += +handlePercent(cur.FbHavePhoneAuUc);
        acc.FbHavePhoneMy += +handlePercent(cur.FbHavePhoneMy);
        acc.FbNoHaveInfo += +handlePercent(cur.FbNoHaveInfo);
        acc.Price += +handlePercent(cur.Price);
        acc.TotalCustomerZlFb += +handlePercent(cur.TotalCustomerZlFb);

        return acc;
      },
      {
        ZlHavePhone: 0,
        ZlNoHavePhone: 0,
        Other: 0,
        Hotline: 0,
        Switchboard: 0,
        FbHavePhoneAuUc: 0,
        FbHavePhoneMy: 0,
        FbNoHaveInfo: 0,
        Price: 0,
        TotalCustomerZlFb: 0,
      }
    );
    setTotalSumInReport(handleAddPercent([abc])[0]);
  }, [dataReportTable]);

  const EditableCellNonPercent = ({
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
        className="padding-td2 w-100"
      >
        <span className=" "> {value2}</span>
      </div>
    );
  };

  const handleAddPercent = (value) => {
    return value.map((item, index) => {
      let TotalCustomerZlFb =
        +(handlePercent(item.ZlHavePhone) || 0) +
        +(handlePercent(item.ZlNoHavePhone) || 0) +
        +(handlePercent(item.Other) || 0) +
        +(handlePercent(item.Hotline) || 0) +
        +(handlePercent(item.Switchboard) || 0) +
        +(handlePercent(item.FbHavePhoneAuUc) || 0) +
        +(handlePercent(item.FbHavePhoneMy) || 0) +
        +(handlePercent(item.FbNoHaveInfo) || 0) +
        +(handlePercent(item.Price) || 0);

      let ZlHavePhone =
        handlePercent(item.ZlHavePhone) !== ""
          ? (
              (handlePercent(item.ZlHavePhone) / TotalCustomerZlFb) *
              100
            ).toFixed(2)
          : "";
      let ZlNoHavePhone =
        (handlePercent(item.ZlNoHavePhone) || 0) !== ""
          ? (
              ((handlePercent(item.ZlNoHavePhone) || 0) / TotalCustomerZlFb) *
              100
            ).toFixed(2)
          : "";

      let Other =
        (handlePercent(item.Other) || 0) !== ""
          ? (
              ((handlePercent(item.Other) || 0) / TotalCustomerZlFb) *
              100
            ).toFixed(2)
          : "";
      let Hotline =
        (handlePercent(item.Hotline) || 0) !== ""
          ? (
              ((handlePercent(item.Hotline) || 0) / TotalCustomerZlFb) *
              100
            ).toFixed(2)
          : "";
      let Switchboard =
        (handlePercent(item.Switchboard) || 0) !== ""
          ? (
              ((handlePercent(item.Switchboard) || 0) / TotalCustomerZlFb) *
              100
            ).toFixed(2)
          : "";
      let FbHavePhoneAuUc =
        (handlePercent(item.FbHavePhoneAuUc) || 0) !== ""
          ? (
              ((handlePercent(item.FbHavePhoneAuUc) || 0) / TotalCustomerZlFb) *
              100
            ).toFixed(2)
          : "";
      let FbHavePhoneMy =
        (handlePercent(item.FbHavePhoneMy) || 0) !== ""
          ? (
              ((handlePercent(item.FbHavePhoneMy) || 0) / TotalCustomerZlFb) *
              100
            ).toFixed(2)
          : "";
      let FbNoHaveInfo =
        (handlePercent(item.FbNoHaveInfo) || 0) !== ""
          ? (
              ((handlePercent(item.FbNoHaveInfo) || 0) / TotalCustomerZlFb) *
              100
            ).toFixed(2)
          : "";
      let Price =
        (handlePercent(item.Price) || 0) !== ""
          ? (
              ((handlePercent(item.Price) || 0) / TotalCustomerZlFb) *
              100
            ).toFixed(2)
          : "";
      ZlHavePhone = ZlHavePhone === "NaN" ? "0.00" : ZlHavePhone;
      ZlNoHavePhone = ZlNoHavePhone === "NaN" ? "0.00" : ZlNoHavePhone;
      Other = Other === "NaN" ? "0.00" : Other;
      Hotline = Hotline === "NaN" ? "0.00" : Hotline;
      Switchboard = Switchboard === "NaN" ? "0.00" : Switchboard;
      FbHavePhoneAuUc = FbHavePhoneAuUc === "NaN" ? "0.00" : FbHavePhoneAuUc;
      FbHavePhoneMy = FbHavePhoneMy === "NaN" ? "0.00" : FbHavePhoneMy;
      FbNoHaveInfo = FbNoHaveInfo === "NaN" ? "0.00" : FbNoHaveInfo;
      Price = Price === "NaN" ? "0.00" : Price;

      return {
        ...item,
        TotalCustomerZlFb,
        ZlHavePhone:
          handlePercent(item.ZlHavePhone) !== ""
            ? `${handlePercent(item.ZlHavePhone) || 0} (${ZlHavePhone}%)`
            : "",
        ZlNoHavePhone:
          handlePercent(item.ZlNoHavePhone) !== ""
            ? `${handlePercent(item.ZlNoHavePhone) || 0} (${ZlNoHavePhone}%)`
            : "",
        Other:
          handlePercent(item.Other) !== ""
            ? `${handlePercent(item.Other) || 0} (${Other}%)`
            : "",
        Hotline:
          handlePercent(item.Hotline) !== ""
            ? `${handlePercent(item.Hotline) || 0} (${Hotline}%)`
            : "",
        Switchboard:
          handlePercent(item.Switchboard) !== ""
            ? `${handlePercent(item.Switchboard) || 0} (${Switchboard}%)`
            : "",
        FbHavePhoneAuUc:
          handlePercent(item.FbHavePhoneAuUc) !== ""
            ? `${
                handlePercent(item.FbHavePhoneAuUc) || 0
              } (${FbHavePhoneAuUc}%)`
            : "",
        FbHavePhoneMy:
          handlePercent(item.FbHavePhoneMy) !== ""
            ? `${handlePercent(item.FbHavePhoneMy) || 0} (${FbHavePhoneMy}%)`
            : "",
        FbNoHaveInfo:
          handlePercent(item.FbNoHaveInfo) !== ""
            ? `${handlePercent(item.FbNoHaveInfo) || 0} (${FbNoHaveInfo}%)`
            : "",
        Price:
          handlePercent(item.Price) !== ""
            ? `${handlePercent(item.Price) || 0} (${Price}%)`
            : "",
      };
    });
  };

  const updateMyData = (index, value, property, type = 0) => {
    if (type === 0) {
      setDataReportTable((old) => {
        let abc = old.map((row, i) => {
          if (i === index) {
            return {
              ...old[index],
              [property]: value,
            };
          }
          return row;
        });
        return handleAddPercent(abc);
      });
    }
    if (type === 2) {
      setReportWithArea((old) => {
        return old.map((row, i) => {
          if (i === index) {
            return {
              ...old[index],
              [property]: +value,
            };
          }
          return row;
        });
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
    const [value, setValue] = useState(handlePercent(ivalue));
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
        className="padding-td2 w-100"
      >
        <span className=" "> {value2}</span>
      </div>
    );
  };

  const handlePercent = (value) => {
    try {
      if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        value !== 0
      ) {
        let number = value.toString().split("(")[0];
        return number;
      }
      return value;
    } catch (error) {
      ;
    }
  };

  const RenderTrTableReport = useMemo(() => {
    return dataReportTable.map((item, index) => {
      return (
        <>
          <tr key={index + "bbb"}>
            <td className="text-center align-middle">
              <div class="input-group d-flex justify-content-center">
                <div className="padding-td2 ">
                  <span className=" ">{item.Date}</span>
                </div>
              </div>
            </td>
            <td className="align-middle">
              <div class="input-group ">
                <EditableCell
                  ivalue={item.ZlHavePhone}
                  index={index}
                  updateMyData={updateMyData}
                  property="ZlHavePhone"
                />
              </div>
            </td>
            <td className="align-middle">
              <div class="input-group ">
                <EditableCell
                  ivalue={item.ZlNoHavePhone}
                  index={index}
                  updateMyData={updateMyData}
                  property="ZlNoHavePhone"
                />
              </div>
            </td>

            <td className="align-middle">
              <div class="input-group ">
                <EditableCell
                  ivalue={item.Hotline}
                  index={index}
                  updateMyData={updateMyData}
                  property="Hotline"
                />
              </div>
            </td>
            <td className="align-middle">
              <div class="input-group ">
                <EditableCell
                  ivalue={item.Switchboard}
                  index={index}
                  updateMyData={updateMyData}
                  property="Switchboard"
                />
              </div>
            </td>
            <td className="align-middle">
              <div class="input-group ">
                <EditableCell
                  ivalue={item.FbHavePhoneAuUc}
                  index={index}
                  updateMyData={updateMyData}
                  property="FbHavePhoneAuUc"
                />
              </div>
            </td>
            <td className="align-middle">
              <div class="input-group ">
                <EditableCell
                  ivalue={item.FbHavePhoneMy}
                  index={index}
                  updateMyData={updateMyData}
                  property="FbHavePhoneMy"
                />
              </div>
            </td>
            <td className="align-middle">
              <div class="input-group ">
                <EditableCell
                  ivalue={item.FbNoHaveInfo}
                  index={index}
                  updateMyData={updateMyData}
                  property="FbNoHaveInfo"
                />
              </div>
            </td>
            <td className="align-middle">
              <div class="input-group ">
                <EditableCell
                  ivalue={item.Price}
                  index={index}
                  updateMyData={updateMyData}
                  property="Price"
                />
              </div>
            </td>
            <td className="align-middle title-report-yellow2">
              <div class="input-group ">
                <EditableCell
                  ivalue={item.Other}
                  index={index}
                  updateMyData={updateMyData}
                  property="Other"
                />
              </div>
            </td>

            <td className="padding-td2 title-report-orange">
              <span className=" ">{item.TotalCustomerZlFb}</span>
            </td>
          </tr>
        </>
      );
    });
  }, [dataReportTable]);

  const RenderTrTableReportSum = useMemo(() => {
    return (
      <tr>
        <td className="padding-td2  title-report-orange">
          <span className=" ">TỔNG</span>
        </td>
        <td className="padding-td2 title-report-orange">
          <span className=" ">{totalSumInReport.ZlHavePhone}</span>
        </td>
        <td className="padding-td2 title-report-orange">
          <span className=" ">{totalSumInReport.ZlNoHavePhone}</span>
        </td>
        <td className="padding-td2 title-report-orange">
          <span className=" ">{totalSumInReport.Hotline}</span>
        </td>
        <td className="padding-td2 title-report-orange">
          <span className=" ">{totalSumInReport.Switchboard}</span>
        </td>
        <td className="padding-td2 title-report-orange">
          <span className=" ">{totalSumInReport.FbHavePhoneAuUc}</span>
        </td>
        <td className="padding-td2 title-report-orange">
          <span className=" ">{totalSumInReport.FbHavePhoneMy}</span>
        </td>
        <td className="padding-td2 title-report-orange">
          <span className=" ">{totalSumInReport.FbNoHaveInfo}</span>
        </td>
        <td className="padding-td2 title-report-orange">
          <span className=" ">{totalSumInReport.Price}</span>
        </td>
        <td className="padding-td2 title-report-orange">
          <span className=" ">{totalSumInReport.Other}</span>
        </td>
        <td className="padding-td2 title-report-orange">
          <span className=" ">{totalSumInReport.TotalCustomerZlFb}</span>
        </td>
      </tr>
    );
  }, [totalSumInReport]);

  const RenderTrTableReportWithArea = useMemo(() => {
    return reportWithArea.map((item, index) => {
      let bg = "";
      if (index === 0) {
        bg = "title-report-pink";
      } else if (index === 1) {
        bg = "title-report-red";
      } else if (index === 2) {
        bg = "title-report-orange3";
      } else if (index === 3) {
        bg = "title-report-gray";
      } else if (index === 4) {
        bg = "title-report-green2";
      } else {
        bg = "title-report-blue2";
      }

      return (
        <tr key={index + "aaa"}>
          <td className={`padding-td2 ${bg}`} style={{ minWidth: 100 }}>
            <span className="">{item.Area}</span>
          </td>

          <td className="align-middle" style={{ minWidth: 100 }}>
            <div class="input-group ">
              <EditableCellNonPercent
                ivalue={item.Zalo}
                index={index}
                updateMyData={updateMyData}
                property="Zalo"
                type={2}
              />
            </div>
          </td>
          <td className="align-middle" style={{ minWidth: 100 }}>
            <div class="input-group ">
              <EditableCellNonPercent
                ivalue={item.Info}
                index={index}
                updateMyData={updateMyData}
                property="Info"
                type={2}
              />
            </div>
          </td>
          <td className="align-middle" style={{ minWidth: 100 }}>
            <div class="input-group ">
              <EditableCellNonPercent
                ivalue={item.Facebook}
                index={index}
                updateMyData={updateMyData}
                property="Facebook"
                type={2}
              />
            </div>
          </td>
          <td className="align-middle" style={{ minWidth: 100 }}>
            <div class="input-group ">
              <EditableCellNonPercent
                ivalue={item.Other}
                index={index}
                updateMyData={updateMyData}
                property="Other"
                type={2}
              />
            </div>
          </td>
          <td className="padding-td2 ">
            <span className=" ">
              {(item?.Zalo || 0) +
                (item?.Info || 0) +
                (item?.Facebook || 0) +
                (item?.Other || 0)}
            </span>
          </td>
        </tr>
      );
    });
  }, [reportWithArea]);

  const Trl_spCustomerReport_Save = async () => {
    if (staff.value === 0) {
      Alertwarning("Vui lòng chọn nhân viên");
      return;
    }
    if (!timeReport) {
      Alertwarning("Vui lòng chọn thời gian");
      return;
    }
    try {
      const area = reportWithArea.map((item) => {
        return {
          ReportWithAreaId: item?.ReportWithAreaId || 0,
          Area: item?.Area,
          Zalo: +item?.Zalo || 0,
          Info: +item?.Info || 0,
          Facebook: +item?.Facebook || 0,
          Other: +item?.Other || 0,
          Creater: +Creater,
        };
      });

      let general = dataReportTable.map((item) => {
        let TotalCustomerZlFb =
          +(handlePercent(item.ZlHavePhone) || 0) +
          +(handlePercent(item.ZlNoHavePhone) || 0) +
          +(handlePercent(item.Other) || 0) +
          +(handlePercent(item.Hotline) || 0) +
          +(handlePercent(item.Switchboard) || 0) +
          +(handlePercent(item.FbHavePhoneAuUc) || 0) +
          +(handlePercent(item.FbHavePhoneMy) || 0) +
          +(handlePercent(item.FbNoHaveInfo) || 0) +
          +(handlePercent(item.Price) || 0);

        return {
          Date: item?.Date,
          ReportGeneralId: item?.ReportGeneralId || 0,
          ZlHavePhone: +(handlePercent(item.ZlHavePhone) || 0),
          ZlNoHavePhone: +(handlePercent(item.ZlNoHavePhone) || 0),
          Other: +(handlePercent(item.Other) || 0),
          Hotline: +(handlePercent(item.Hotline) || 0),
          Switchboard: +(handlePercent(item.Switchboard) || 0),
          FbHavePhoneAuUc: +(handlePercent(item.FbHavePhoneAuUc) || 0),
          FbHavePhoneMy: +(handlePercent(item.FbHavePhoneMy) || 0),
          FbNoHaveInfo: +(handlePercent(item.FbNoHaveInfo) || 0),
          Price: +(handlePercent(item.Price) || 0),
          TotalCustomerZlFb: TotalCustomerZlFb,

          IsTotal: false,
          Creater: +Creater,
        };
      });
      let newTotalSumReport = {
        ZlHavePhone: +handlePercent(totalSumInReport.ZlHavePhone) || 0,
        ZlNoHavePhone: +handlePercent(totalSumInReport.ZlNoHavePhone) || 0,
        Other: +handlePercent(totalSumInReport.Other) || 0,
        Hotline: +handlePercent(totalSumInReport.Hotline) || 0,
        Switchboard: +handlePercent(totalSumInReport.Switchboard) || 0,
        FbHavePhoneAuUc: +handlePercent(totalSumInReport.FbHavePhoneAuUc) || 0,
        FbHavePhoneMy: +handlePercent(totalSumInReport.FbHavePhoneMy) || 0,
        FbNoHaveInfo: +handlePercent(totalSumInReport.FbNoHaveInfo) || 0,
        Price: +handlePercent(totalSumInReport.Price) || 0,
        TotalCustomerZlFb:
          +handlePercent(totalSumInReport.TotalCustomerZlFb) || 0,
      };

      general.push({
        ReportGeneralId: reportGeneralId,
        ...newTotalSumReport,
        IsTotal: true,
        Creater: +Creater,
      });

      const pr = {
        ReportId: reportId,
        StaffId: staff.value,
        ReportName: reportName,
        TimeFrom: moment(timeReport[0]).format("MM/DD/YYYY 00:00:00"),
        TimeTo: moment(timeReport[1]).format("MM/DD/YYYY 23:59:59"),
        Note: HandleTextArea(note),
        Note2: HandleTextArea(note2),
        Creater: +Creater,
        general: general,
        area: area,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomerReport_Save",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess("Lưu thành công");
        Trl_spCustomerReport_List();
        Trl_spCustomerReport_SumTotalWithMonth();
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  useEffect(() => {
    Trl_spCustomerReport_List();
  }, []);

  const Trl_spCustomerReport_List = async () => {
    try {
      const pr = {
        ReportId: 0,
        Year: yearSearch.value,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomerReport_List",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        let res = result.map((item) => {
          let name = item.ReportName;
          let date = moment(item.TimeFrom).format("DD/MM");
          let date2 = moment(item.TimeTo).format("DD/MM");
          return {
            ...item,
            Name: `${name} (${date} - ${date2})`,
          };
        });
        setReportList(res);
        res[0]?.note && res[0]?.note.length > 0
          ? setNoteTotal(res[0]?.note[0])
          : setNoteTotal("");
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spCustomerReport_SumTotalWithMonth = async (id) => {
    try {
      const pr = {
        Creater: Creater,
        Year: yearSearch.value,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomerReport_SumTotalWithMonth",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      const result2 = result.reduce((acc, obj) => {
        let obj2 = {};
        const { Month } = obj;
        if (Month === 1) {
          obj2 = { ...obj, MonthName: "JanuaryNote" };
        } else if (Month === 2) {
          obj2 = { ...obj, MonthName: "FebruaryNote" };
        } else if (Month === 3) {
          obj2 = { ...obj, MonthName: "MarchNote" };
        } else if (Month === 4) {
          obj2 = { ...obj, MonthName: "AprilNote" };
        } else if (Month === 5) {
          obj2 = { ...obj, MonthName: "MayNote" };
        } else if (Month === 6) {
          obj2 = { ...obj, MonthName: "JuneNote" };
        } else if (Month === 7) {
          obj2 = { ...obj, MonthName: "JulyNote" };
        } else if (Month === 8) {
          obj2 = { ...obj, MonthName: "AugustNote" };
        } else if (Month === 9) {
          obj2 = { ...obj, MonthName: "SeptemberNote" };
        } else if (Month === 10) {
          obj2 = { ...obj, MonthName: "OctoberNote" };
        } else if (Month === 11) {
          obj2 = { ...obj, MonthName: "NovemberNote" };
        } else if (Month === 12) {
          obj2 = { ...obj, MonthName: "DecemberNote" };
        }
        if (!acc[Month]) {
          acc[Month] = [];
        }
        acc[Month].push(obj2);
        return acc;
      }, {});
      let newArr = Object.values(result2).map((item) => {
        const order = [
          "CHÂU ÂU",
          "CHÂU ÚC",
          "CHÂU MỸ",
          "CHÂU PHI",
          "CHÂU Á",
          "KHÁC",
        ];

        return item.sort(
          (a, b) => order.indexOf(a.Area) - order.indexOf(b.Area)
        );
      });
      const areaTotals = {};

      //Tinh tong cac thang
      newArr.forEach((subArray) => {
        subArray.forEach((obj) => {
          const area = obj.Area;
          const total = obj.Total;

          if (areaTotals.hasOwnProperty(area)) {
            areaTotals[area] += total;
          } else {
            areaTotals[area] = total;
          }
        });
      });
      setDataOfYear(areaTotals);
      setdataReportAreaWithMonth(newArr);

      // Trl_spCustomerReport_SumTotalWithMonth(result);
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  useEffect(() => {
    Trl_spCustomerReport_SumTotalWithMonth();
  }, []);

  const Trl_spCustomerReport_Delete = async (id) => {
    try {
      const pr = {
        ReportId: id.row._original.ReportId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomerReport_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);

      Alertsuccess("Xoá thành công");
      Trl_spCustomerReport_List();
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spCustomer_ReportNote_Save = async (id) => {
    try {
      const pr = {
        ...noteTotal,
        NoteId: noteTotal?.NoteId ? noteTotal.NoteId : 0,
        Creater: +Creater,
        Year: yearSearch.value,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomer_ReportNote_Save",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess("Lưu thành công");
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const [DataExcel, setDateExcel] = useState();
  const Trl_spCustomerReport_Edit = async (data) => {
    setIsEdit(true);
    let db = data.row._original;
    setReportId(db.ReportId);
    setStaff({
      value: db.StaffId,
      label: db.StaffName,
      DepartmentName: db.DepartmentName,
      PositionName: db.PositionName,
    });
    setTimeReport([
      new Date(data.original.TimeFrom),
      new Date(data.original.TimeTo),
    ]);
    setReportName(db.ReportName);
    db?.Note && setNote(HandleTextArea(db.Note, 1));
    db?.Note2 && setNote2(HandleTextArea(db.Note2, 1));
    setDataReportTable(
      handleAddPercent(db.general.filter((item) => !item.IsTotal))
    );
    setTotalSumInReport(db.general.find((item) => item.IsTotal));
    setReportGeneralId(db.general.find((item) => item.IsTotal).ReportGeneralId);
    setReportWithArea(db.area);
    setShowFormAdd(true);
    setDateExcel({
      ...db,
      FileName: "EUROTRAVEL - " + db.ReportName,
      TimeFrom: data.original.TimeFrom,
      TimeTo: data.original.TimeTo,
    });
  };

  const Trl_spCustomerReport_Cancel = () => {
    setShowFormAdd(false);
    setIsEdit(false);
    setReportId(0);
    setStaff({ value: 0 });
    setTimeReport();
    setDataReportTable([]);
    setTotalSumInReport({});
    setReportGeneralId(0);
    setReportWithArea(templateReportWithArea);
    setNote("");
    setNote2("");
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
              className="btn btn-sm btn-success mr-2"
              onClick={(e) => Trl_spCustomerReport_Edit(row)}
            >
              <i class="far fa-edit"></i> Sửa
            </button>

            <button
              className="btn btn-sm btn-danger"
              onClick={(e) => {
                ConfirmAlert("Xác nhận", "Bạn có muốn xóa không?", () => {
                  Trl_spCustomerReport_Delete(row);
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
      Header: "Báo cáo",
      accessor: "Name",
      minWidth: 250,
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

  const Trl_spCustomerReport_Excel = async () => {
    try {
      const params = {
        Json: JSON.stringify(DataExcel),
        func: "Trl_spCustomerReport_Excel",
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

  const [sumReportWithArea, setSumReportWithArea] = useState([]);
  const [sumReportWithKenh, setSumReportWithKenh] = useState([]);
  useEffect(() => {
    let Au = 0,
      Uc = 0,
      My = 0,
      Phi = 0,
      A = 0,
      Other = 0,
      Zalo = 0,
      Facebook = 0,
      Info = 0,
      Other2 = 0;
    if (reportWithArea.length > 0) {
      reportWithArea.forEach((item) => {
        if (item.Area === "CHÂU ÂU") {
          Au =
            (item?.Zalo || 0) +
            (item?.Facebook || 0) +
            (item?.Info || 0) +
            (item?.Other || 0);
        }
        if (item.Area === "CHÂU ÚC") {
          Uc =
            (item?.Zalo || 0) +
            (item?.Facebook || 0) +
            (item?.Info || 0) +
            (item?.Other || 0);
        }
        if (item.Area === "CHÂU MỸ") {
          My =
            (item?.Zalo || 0) +
            (item?.Facebook || 0) +
            (item?.Info || 0) +
            (item?.Other || 0);
        }
        if (item.Area === "CHÂU PHI") {
          Phi =
            (item?.Zalo || 0) +
            (item?.Facebook || 0) +
            (item?.Info || 0) +
            (item?.Other || 0);
        }
        if (item.Area === "CHÂU Á") {
          A =
            (item?.Zalo || 0) +
            (item?.Facebook || 0) +
            (item?.Info || 0) +
            (item?.Other || 0);
        }
        if (item.Area === "KHÁC") {
          Other =
            (item?.Zalo || 0) +
            (item?.Facebook || 0) +
            (item?.Info || 0) +
            (item?.Other || 0);
        }
        Zalo += item?.Zalo || 0;
        Facebook += item?.Facebook || 0;
        Info += item?.Info || 0;
        Other2 += item?.Other || 0;
      });

      setSumReportWithArea([Au, Uc, My, Phi, A, Other]);
      setSumReportWithKenh([Zalo, Info, Facebook, Other2]);
    }
  }, [reportWithArea]);

  const EditableCellArea = ({
    ivalue = "",
    index = "",
    property = "",
    type = 0,
    edit = true,
  }) => {
    const textareaRef = useRef(null);

    const adjustTextareaHeight = () => {
      const element = textareaRef.current;
      element.style.height = "auto";
      element.style.height = `${
        element.scrollHeight < 200 ? 200 : element.scrollHeight
      }px`;
    };
    useEffect(() => {
      adjustTextareaHeight();
    }, [ivalue]);

    const [value, setValue] = useState(ivalue);
    const onChange = (e) => {
      setValue(e.target.value);
      adjustTextareaHeight();
    };

    const onBlur = (e) => {
      if (type === 1) {
        setNote(value);
      }
      if (type === 2) {
        setNote2(value);
      }
      if (type === 3) {
        setNoteTotal({ ...noteTotal, [property]: HandleTextArea(value) });
      }
    };

    useEffect(() => {
      setValue(ivalue);
    }, [ivalue]);

    return (
      <textarea
        type="text"
        class="form-control2"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={` `}
        ref={textareaRef}
      />
    );
  };

  const RenderDataReportAreaWithMonth = useMemo(() => {
    return dataReportAreaWithMonth.length > 0
      ? dataReportAreaWithMonth.map((item, index) => {
          return (
            <>
              <div className="col-12 col-md-6" key={index + "asd"}>
                <div className="card">
                  <ApexchartsPie
                    data={[
                      item[0].Total,
                      item[1].Total,
                      item[2].Total,
                      item[3].Total,
                      item[4].Total,
                      item[5].Total,
                    ]}
                    label={[
                      "CHÂU ÂU",
                      "CHÂU ÚC",
                      "CHÂU MỸ",
                      "CHÂU PHI",
                      "CHÂU Á",
                      "KHÁC",
                    ]}
                    color={[
                      "#f472b6",
                      "#f87171",
                      "#fdba74",
                      "#9ca3af",
                      "#22c55e",
                      "#67e8f9",
                    ]}
                  />
                  <div className="d-flex justify-content-center font-weight-bold py-2">
                    Tháng {item[0].Month}
                  </div>
                </div>
              </div>
              <div className="col-6 ">
                {!isPdf ? (
                  <EditableCellArea
                    ivalue={HandleTextArea(
                      noteTotal[`${item[0].MonthName}`],
                      1
                    )}
                    type={3}
                    property={item[0].MonthName}
                  />
                ) : (
                  <span
                    className="card p-2"
                    dangerouslySetInnerHTML={{
                      __html: HandleTextArea(
                        noteTotal[`${item[0].MonthName}`],
                        1
                      ).replace(/\n/g, "<br>"),
                    }}
                  ></span>
                )}
              </div>
            </>
          );
        })
      : "";
  }, [dataReportAreaWithMonth, noteTotal]);

  const RenderTotalNoteOfYear = useMemo(() => {
    return (
      <>
        <div className="col-12 col-md-6">
          <div className="card">
            <ApexchartsPie
              data={[
                dataOfYear["CHÂU ÂU"],
                dataOfYear["CHÂU ÚC"],
                dataOfYear["CHÂU MỸ"],
                dataOfYear["CHÂU PHI"],
                dataOfYear["CHÂU Á"],
                dataOfYear["KHÁC"],
              ]}
              label={[
                "CHÂU ÂU",
                "CHÂU ÚC",
                "CHÂU MỸ",
                "CHÂU PHI",
                "CHÂU Á",
                "KHÁC",
              ]}
              color={[
                "#f472b6",
                "#f87171",
                "#fdba74",
                "#9ca3af",
                "#22c55e",
                "#67e8f9",
              ]}
            />
            <div className="d-flex justify-content-center font-weight-bold py-2">
              Năm {yearSearch.value}
            </div>
          </div>
        </div>
        <div className="col-md-6 ">
          {!isPdf ? (
            <EditableCellArea
              ivalue={HandleTextArea(noteTotal[`TotalNote`], 1)}
              type={3}
              property={"TotalNote"}
            />
          ) : (
            <span
              className="card p-2"
              dangerouslySetInnerHTML={{
                __html: HandleTextArea(noteTotal[`TotalNote`], 1).replace(
                  /\n/g,
                  "<br>"
                ),
              }}
            ></span>
          )}
        </div>
      </>
    );
  }, [dataOfYear, noteTotal]);

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
                THÊM BÁO CÁO
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link " href="#tab_2" data-toggle="tab">
                BÁO CÁO THEO THỊ TRƯỜNG
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
                        <span className="font-weight-bold">BÁO CÁO TUẦN</span>
                      </h3>
                    </div>
                    <div class="col-sm-12 col-md-9 margin-top-5s">
                      <button
                        onClick={(e) => {
                          setShowFormAdd(true);
                        }}
                        type="button"
                        class="btn btn-sm btn-success pull-right margin-left-5"
                      >
                        <i class="fa fa-plus pr-2"></i>
                        Thêm mới
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-danger pull-right margin-left-5"
                        onClick={(e) => {
                          Trl_spCustomerReport_List();
                          Trl_spCustomerReport_SumTotalWithMonth();
                        }}
                      >
                        <i class="fa fa-search pr-2"></i>
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>
                <div class="card-body ">
                  <DataTable data={reportList} columns={columns} />
                  <Modal
                    show={showFormAdd}
                    onHide={() => {
                      setShowFormAdd(false);
                      Trl_spCustomerReport_Cancel();
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
                                setShowFormAdd(false);
                                Trl_spCustomerReport_Save();
                                Trl_spCustomerReport_Cancel();
                              },
                              "Đồng Ý",
                              "Không Đồng Ý",
                              true,
                              () => {
                                setShowFormAdd(false);
                                Trl_spCustomerReport_Cancel();
                              }
                            );
                          }}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                        <button
                          type="button"
                          class="btn btn-sm btn-success pull-right "
                          onClick={() => {
                            ConfirmAlert(
                              "Xác nhận",
                              "Bạn có muốn lưu không?",
                              () => {
                                Trl_spCustomerReport_Save();
                              }
                            );
                          }}
                        >
                          <i class="fa fa-edit pr-2"></i>
                          {reportId === 0 ? "Thêm mới" : "Câp nhật"}
                        </button>
                        {reportId !== 0 && (
                          <button
                            type="button"
                            class="btn btn-sm btn-success pull-right mr-1 ml-1"
                            onClick={() => {
                              exxcel();
                              // Trl_spCustomerReport_Excel();
                            }}
                          >
                            <i class="fa fa-download pr-2"></i>
                            Export PDF
                          </button>
                        )}
                      </div>
                    </Modal.Header>
                    <Modal.Body id="excell">
                      <div class="card-body p-0 tour-request">
                        <div class="row">
                          <div class="col-sm-12 text-center header mb-3">
                            <Img
                              src="../dist/img/logo-invoice.png"
                              style={{ width: "100%" }}
                            />
                          </div>
                        </div>
                        <div className="center-item mb-2 ">
                          <h3
                            class=" font-weight-bold text-dark fs-18 d-flex justify-content-center align-items-center"
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                          >
                            {editName ? (
                              <input
                                type="text"
                                value={reportName}
                                onChange={(e) => setReportName(e.target.value)}
                                className="form-control2 "
                                style={{ minWidth: "600px" }}
                              />
                            ) : (
                              reportName
                            )}{" "}
                            {hover && !editName && (
                              <i
                                className="fas fa-edit text-muted ml-2 cursor-pointer"
                                onClick={() => setEditName(true)}
                              />
                            )}
                            {editName && (
                              <i
                                className="fas fa-check text-success ml-2 cursor-pointer"
                                onClick={() => setEditName(false)}
                              />
                            )}
                          </h3>
                        </div>

                        <div className="row">
                          <div className={isPdf ? "d-none" : "col-12"}>
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
                          <div className={!isPdf ? "d-none" : "col-12"}>
                            <div className="row">
                              <div className="col-12 border-bottom">
                                <div className="row">
                                  <div className="col-2 font-weight-bold d-flex align-items-center">
                                    Tên Nhân Viên:
                                  </div>
                                  <div className="col-10 text-uppercase">
                                    {staff?.label || ""}
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 border-bottom">
                                <div className="row">
                                  <div className="col-2 font-weight-bold ">
                                    Phòng ban:
                                  </div>
                                  <div className="col-10 text-uppercase">
                                    {staff?.DepartmentName || ""}
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 border-bottom">
                                <div className="row">
                                  <div className="col-2 font-weight-bold ">
                                    Chức vụ:
                                  </div>
                                  <div className="col-10 text-uppercase">
                                    {staff?.PositionName || ""}
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 border-bottom">
                                <div className="row">
                                  <div className="col-2 font-weight-bold d-flex align-items-center">
                                    Từ ngày:
                                  </div>
                                  <div className="col-10">
                                    {timeReport &&
                                      timeReport.length > 0 &&
                                      moment(timeReport[0]).format(
                                        "DD/MM/YYYY"
                                      )}{" "}
                                    -
                                    {timeReport &&
                                      timeReport.length > 0 &&
                                      moment(timeReport[1]).format(
                                        "DD/MM/YYYY"
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              timeReport ? "col-12 mt-4 px-0" : "d-none"
                            }
                          >
                            <div className="">
                              <table class="table table-bordered table-request-tour">
                                <tbody className=" text-dark">
                                  <tr className="title-guider">
                                    <th
                                      className="align-middle  bg-light"
                                      style={{ width: 100 }}
                                    >
                                      NGÀY
                                    </th>
                                    <th
                                      colSpan={2}
                                      className="align-middle title-report-orange2"
                                    >
                                      KÊNH ZALO, WEBSITE
                                    </th>

                                    <th
                                      colSpan={2}
                                      className="align-middle title-report-green"
                                    >
                                      KÊNH HOTLINE/TỔNG ĐÀI
                                    </th>
                                    <th
                                      colSpan={4}
                                      className="align-middle title-report-blue"
                                    >
                                      KÊNH FACEBOOK
                                    </th>
                                    <th className="align-middle title-report-yellow2">
                                      KÊNH KHÁC
                                    </th>
                                    <th className="align-middle title-report-orange">
                                      TỔNG SỐ LƯỢNG KHÁCH
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className=" bg-light"></td>
                                    <td
                                      className="text-center align-middle p-2  title-report-orange2"
                                      style={{ width: 100 }}
                                    >
                                      ĐÃ CHO TT SĐT
                                    </td>
                                    <td
                                      className="text-center align-middle p-2 title-report-orange2"
                                      style={{ width: 100 }}
                                    >
                                      CHƯA CHO TT SĐT
                                    </td>

                                    <td
                                      className="text-center align-middle p-2 title-report-green"
                                      style={{ width: 100 }}
                                    >
                                      HOTLINE
                                    </td>
                                    <td
                                      className="text-center align-middle p-2 title-report-green"
                                      style={{ width: 100 }}
                                    >
                                      TỔNG ĐÀI
                                    </td>
                                    <td
                                      className="text-center align-middle p-2 title-report-blue"
                                      style={{ width: 100 }}
                                    >
                                      ĐÃ CHO TT SĐT TOUR ÂU, ÚC
                                    </td>
                                    <td
                                      className="text-center align-middle p-2 title-report-blue"
                                      style={{ width: 100 }}
                                    >
                                      ĐÃ CHO TT SĐT TOUR MỸ
                                    </td>
                                    <td
                                      className="text-center align-middle p-2 title-report-blue"
                                      style={{ width: 100 }}
                                    >
                                      CHƯA CHO TT
                                    </td>
                                    <td
                                      className="text-center align-middle p-2 title-report-blue"
                                      style={{ width: 100 }}
                                    >
                                      GIÁ
                                    </td>
                                    <td
                                      className="text-center align-middle p-2 title-report-yellow2"
                                      style={{ width: 100 }}
                                    >
                                      ĐÃ CHO TT SĐT
                                    </td>
                                    <td
                                      className="text-center align-middle p-2 title-report-orange"
                                      style={{ width: 100 }}
                                    ></td>
                                  </tr>
                                  {RenderTrTableReport}
                                  {RenderTrTableReportSum}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div
                            className={
                              timeReport ? "col-12 mt-4 px-0" : "d-none"
                            }
                          >
                            <div className="row">
                              <div className="col-6">
                                <div className="">
                                  <table class="table table-bordered table-request-tour">
                                    <tbody className=" text-dark">
                                      <tr className=" bg-light">
                                        <th
                                          className="align-middle"
                                          style={{ width: 210 }}
                                          colSpan={6}
                                        >
                                          BÁO CÁO THEO KÊNH TIỆP CẬN
                                        </th>
                                      </tr>
                                      <tr className="">
                                        <th
                                          className="align-middle"
                                          style={{ width: 210 }}
                                        >
                                          THỊ TRƯỜNG
                                        </th>
                                        <th
                                          className="align-middle title-report-orange2"
                                          style={{ width: 210 }}
                                        >
                                          KÊNH ZALO, WEBSITE
                                        </th>
                                        <th
                                          className="align-middle title-report-green"
                                          style={{ width: 210 }}
                                        >
                                          KÊNH HOTLINE/TỔNG ĐÀI
                                        </th>
                                        <th
                                          className="align-middle title-report-blue"
                                          style={{ width: 210 }}
                                        >
                                          KÊNH FACEBOOK
                                        </th>
                                        <th
                                          className="align-middle title-report-yellow2"
                                          style={{ width: 210 }}
                                        >
                                          KÊNH KHÁC
                                        </th>
                                        <th
                                          className="align-middle "
                                          style={{ width: 210 }}
                                        >
                                          TỔNG
                                        </th>
                                      </tr>
                                      {RenderTrTableReportWithArea}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="card">
                                  <div className="d-flex justify-content-center font-weight-bold py-2 fs-20">
                                    Biểu đồ theo thị trường
                                  </div>
                                  <ApexchartsPie
                                    label={[
                                      "CHÂU ÂU",
                                      "CHÂU ÚC",
                                      "CHÂU MỸ",
                                      "CHÂU PHI",
                                      "CHÂU Á",
                                      "KHÁC",
                                    ]}
                                    data={sumReportWithArea}
                                    color={[
                                      "#f472b6",
                                      "#f87171",
                                      "#fdba74",
                                      "#9ca3af",
                                      "#22c55e",
                                      "#67e8f9",
                                    ]}
                                  />
                                </div>
                                <div class="row">
                                  <div className="col-12 ">
                                    {!isPdf ? (
                                      <EditableCellArea
                                        ivalue={note}
                                        type={1}
                                        row={20}
                                      />
                                    ) : (
                                      <span
                                        className="card p-2"
                                        dangerouslySetInnerHTML={{
                                          __html: HandleTextArea(
                                            note,
                                            1
                                          ).replace(/\n/g, "<br>"),
                                        }}
                                      ></span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="card">
                                  <div className="d-flex justify-content-center font-weight-bold py-2 fs-20">
                                    Biểu đồ theo kênh tiệp cận
                                  </div>
                                  <ApexchartsPie
                                    label={[
                                      "KÊNH ZALO, WEBSITE",
                                      "KÊNH HOTLINE/TỔNG ĐÀI",
                                      "KÊNH FACEBOOK",
                                      "KÊNH KHÁC",
                                    ]}
                                    data={sumReportWithKenh}
                                    color={[
                                      "#d8b4fe",
                                      "#6ee7b7",
                                      "#38bdf8",
                                      "#fde047",
                                    ]}
                                  />
                                </div>
                                <div class="row">
                                  <div className="col-12 ">
                                    {!isPdf ? (
                                      <EditableCellArea
                                        ivalue={note2}
                                        type={2}
                                        row={20}
                                      />
                                    ) : (
                                      <span
                                        className="card p-2"
                                        dangerouslySetInnerHTML={{
                                          __html: HandleTextArea(
                                            note2,
                                            1
                                          ).replace(/\n/g, "<br>"),
                                        }}
                                      ></span>
                                    )}
                                  </div>
                                </div>
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
                <div className="card-header p-0">
                  <div className="row">
                    <div class="col-sm-12 col-md-3 d-flex align-items-center">
                      <h3 className="card-title">
                        <span className="font-weight-bold pl-2">Danh sách</span>
                      </h3>
                    </div>
                    <div class="col-sm-12 col-md-9 d-flex align-items-center flex-row-reverse">
                      <button
                        className="btn btn-sm btn-success mr-2"
                        onClick={Trl_spCustomer_ReportNote_Save}
                      >
                        <i class="fa fa-save pr-2"></i>
                        Lưu ghi chú
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-primary pull-right mr-1 ml-1"
                        onClick={() => {
                          exportDpfYear();
                          // Trl_spCustomerReport_Excel();
                        }}
                      >
                        <i class="fa fa-download pr-2"></i>
                        Export PDF
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-danger  mr-3 ml-1"
                        onClick={(e) => {
                          Trl_spCustomerReport_List();
                          Trl_spCustomerReport_SumTotalWithMonth();
                        }}
                      >
                        <i class="fa fa-search pr-2"></i>
                        Tìm kiếm
                      </button>

                      <Select
                        className="select-custom min-w-100"
                        value={yearSearch}
                        options={yearValue}
                        onChange={(e) => setYearSearch(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body px-1 py-0" id="report-year">
                  <div class="row">
                    <div class="col-sm-12 text-center header mb-3">
                      <Img
                        src="../dist/img/logo-invoice.png"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                  <div class="row">
                    {RenderDataReportAreaWithMonth}
                    {RenderTotalNoteOfYear}
                    {!isPdf && (
                      <div className="m-auto pb-2">
                        <button
                          className="btn btn-sm btn-success mt-2 mx-auto"
                          onClick={Trl_spCustomer_ReportNote_Save}
                        >
                          <i class="fa fa-save pr-2"></i>
                          Lưu ghi chú
                        </button>
                      </div>
                    )}
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

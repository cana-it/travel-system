
import React, { useEffect, useMemo, useState } from "react";
import { mainAction } from "../../../../Redux/Actions";
import { useDispatch } from "react-redux";
import moment from "moment";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  FormatDateJson,
} from "../../../../Utils";
import { SelectTourGuider } from "../../../../Common";
import Select from "react-select";
import { IMAGES_DOMAIN } from "../../../../Services";

const options = [];
const currentYear = new Date().getFullYear();

for (let i = currentYear - 5; i <= currentYear + 5; i++) {
  options.push({ value: i, label: i });
}

const arrColor = [
  "#a5f3fc",
  "#fecaca",
  "#99f6e4",
  "#fed7aa",
  "#bae6fd",
  "#bbf7d0",
  "#fde68a",
  "#c7d2fe",
  "#e0c5fc",
  "#fbb6ce",
  "#fcd34d",
  "#fecdd3",
  "#10b981",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f87171",
  "#f59e0b",
  "#059669",
  "#2563eb",
  "#4f46e5",
  "#7c3aed",
];

export const TourGuideSchedule = () => {
  const dispatch = useDispatch();
  const Creater = +localStorage.getItem("CreateBy");
  const [tourGuiderScheduleList, setTourGuiderScheduleList] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    value: currentYear,
    label: currentYear,
  });
  const [tourGuiderList, setTourGuiderList] = useState([]);

  function handleChange(selectedOption) {
    setSelectedOption(selectedOption);
  }

  useEffect(() => {
    Trl_spTourGuideSchedule_List(selectedOption.value);
    Trl_spTouGuider_List();
  }, [selectedOption]);

  const Trl_spTourGuideSchedule_List = async (year) => {
    try {
      setTourGuiderScheduleList([]);
      const firstDayOfYear = new Date(year, 0, 1);
      const lastDayOfYear = new Date(year, 11, 31);

      const pr = {
        TourGuideScheduleId: 0,
        FromDate: FormatDateJson(firstDayOfYear, 1),
        ToDate: FormatDateJson(lastDayOfYear, 2),
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTourGuideSchedule_List",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);

      if (res.length > 0) {
        setExcelData(res);
        let newRes = res.map((item) => {
          return {
            ...item,
            TourGuideId: {
              value: item.TourGuideId,
            },
          };
        });
        setTourGuiderScheduleList(newRes);
      }

      // setDataBookingStatus(res)
    } catch (error) {
      ;
    }
  };

  const Trl_spTouGuider_List = async (year) => {
    try {
      const pr = {
        TourGuiderId: 0,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTouGuider_List",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);

      if (res.length > 0) {
        let resp = res.map((item, index) => {
          return {
            ...item,
            Color: arrColor[index],
          };
        });
        setTourGuiderList(resp);
      }
    } catch (error) {
      ;
    }
  };

  const Trl_spTourGuideSchedule_Save = async (sv) => {
    if (tourGuiderScheduleList.length === 0) {
      Alertwarning("Không có dữ liệu");
      return;
    }
    try {
      let newArr = tourGuiderScheduleList.map((item) => {
        return {
          ...item,
          Creater: +Creater,
          TourGuideId: +item?.TourGuideId?.value || 0,
          TotalCustomer: +item?.TotalCustomer || 0,
        };
      });
      const pr = newArr;
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTourGuideSchedule_Save",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess(res.Message);
      }

      // setDataBookingStatus(res)
    } catch (error) {
      ;
    }
  };

  const updateMyData = (index, value, property, type) => {
    setTourGuiderScheduleList((old) => {
      return old.map((row, i) => {
        if (i === index) {
          return {
            ...old[index],
            [property]: value,
          };
        }
        return row;
      });
    });
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
        className="padding-td"
      >
        <span className=" "> {value2}</span>
      </div>
    );
  };

  const handleChangeSelect = (e, index, value, type = 0) => {
    let newData = tourGuiderScheduleList.map((item, i) => {
      if (i === index) {
        return type === 0
          ? {
              ...item,
              [value]: e.value,
            }
          : {
              ...item,
              [value]: e,
            };
      }
      return item;
    });
    setTourGuiderScheduleList(newData);
  };

  const Trl_TourGuideSchedule_Excel = async (dataEx) => {
    try {
      const params = {
        Json: JSON.stringify(excelData),
        func: "Trl_TourGuideSchedule_Excel",
      };
      const result = await mainAction.API_spCallExportExcel(params, dispatch);
      if (result.resultCode === 0) {
        const link = document.createElement("a");
        link.href = IMAGES_DOMAIN + result.Message;
        //link.target="_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const RenderRowTable = useMemo(() => {
    return tourGuiderScheduleList.map((item, index) => {
      const month = moment(item.DateSaleFrom).format("MMM");
      const from = moment(item.DateSaleFrom).format("DD/MM/YYYY");
      const to = moment(item.DateSaleTo).format("DD/MM/YYYY");

      let color = tourGuiderList.find(
        (x) => x.TourGuiderId === item?.TourGuideId?.value || 0
      )?.Color;

      return (
        <tr key={index}>
          <td className="text-center align-middle">
            <div class="input-group ">
              <div className="padding-td">
                <span className=" ">{index + 1}</span>
              </div>
            </div>
          </td>
          <td className="text-center align-middle">
            <div class="input-group ">
              <div className="padding-td">
                <span className=" ">{month}</span>
              </div>
            </div>
          </td>
          <td className="text-center align-middle">
            <div class="input-group ">
              <div className="padding-td">
                <span className=" ">{item.ServiceSaleCode}</span>
              </div>
            </div>
          </td>{" "}
          <td className="text-center align-middle">
            <div class="input-group ">
              <div className="padding-td">
                <span className=" ">{from}</span>
              </div>
            </div>
          </td>{" "}
          <td className="text-center align-middle">
            <div class="input-group ">
              <div className="padding-td">
                <span className=" ">{to}</span>
              </div>
            </div>
          </td>{" "}
          <td className="text-center align-middle">
            <div class="input-group ">
              <EditableCell
                ivalue={item.TotalCustomer}
                index={index}
                updateMyData={updateMyData}
                property="TotalCustomer"
              />
            </div>
          </td>
          <td className="text-center align-middle">
            <div class="input-group " style={{ backgroundColor: color }}>
              <SelectTourGuider
                onSelected={(e) =>
                  handleChangeSelect(e, index, "TourGuideId", 1)
                }
                className={"w-100  select-none-bg"}
                TourGuiderId={item?.TourGuideId?.value || 0}
                isFront={true}
              />
            </div>
          </td>
          <td className="text-center align-middle">
            <div class="input-group ">
              <EditableCell
                ivalue={item.VisaName}
                index={index}
                updateMyData={updateMyData}
                property="VisaName"
              />
            </div>
          </td>
          <td className="text-center align-middle">
            <div class="input-group ">
              <EditableCell
                ivalue={item.VisaDate}
                index={index}
                updateMyData={updateMyData}
                property="VisaDate"
              />
            </div>
          </td>
          <td className="text-center align-middle">
            <div class="input-group ">
              <EditableCell
                ivalue={item.Status}
                index={index}
                updateMyData={updateMyData}
                property="Status"
              />
            </div>
          </td>
        </tr>
      );
    });
  }, [tourGuiderScheduleList]);

  return (
    <>
      <div className="content-wrapper">
        <div className="card">
          <div class="card-header">
            <div class="row">
              <div class="col-sm-12 col-md-4">
                <h3 class="card-title font-weight-bold">
                  Lịch Hướng Dẫn Viên Đi Tour
                </h3>
              </div>
              <div
                class="col-sm-12 col-md-8 text-right"
                style={{ marginTop: "-10px" }}
              >
                <div
                  class="w-100px inline-block mr-2"
                  style={{ display: "inline-block" }}
                >
                  <Select
                    value={selectedOption}
                    onChange={handleChange}
                    options={options}
                    className={"select-custom z-maxx"}
                  />
                </div>
                <button
                  type="button"
                  class="btn btn-sm btn-success mr-2"
                  onClick={() => Trl_spTourGuideSchedule_Save()}
                >
                  <i class="fa fa-save pr-2"></i>
                  Lưu
                </button>
                {excelData.length > 0 && (
                  <button
                    type="button"
                    class="btn btn-sm btn-success mr-2"
                    onClick={() => Trl_TourGuideSchedule_Excel()}
                  >
                    <i class="fa fa-download pr-2"></i>
                    Excel
                  </button>
                )}
              </div>
            </div>
          </div>
          <div class="card-body  mt-0">
            <div className="center-item mb-2">
              <h3 class=" font-weight-bold text-dark fs-18">
                LỊCH HƯỚNG DẪN VIÊN ĐI TOUR {selectedOption.label}
              </h3>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12">
                <div class="table-responsive resize-table-custom2">
                  <table class="table table-bordered  table-request-tour  sticky ">
                    <thead>
                      <tr className="title-guider">
                        <th style={{ minWidth: 30 }} className="align-middle">
                          STT
                        </th>

                        <th style={{ minWidth: 100 }} className="align-middle">
                          THÁNG
                        </th>
                        <th style={{ minWidth: 300 }} className="align-middle">
                          HÀNH TRÌNH
                        </th>
                        <th
                          style={{
                            minWidth: 150,
                          }}
                          className="align-middle"
                        >
                          NGÀY KHỞI HÀNH
                        </th>
                        <th
                          style={{
                            minWidth: 150,
                          }}
                          className="align-middle"
                        >
                          NGÀY KẾT THÚC
                        </th>
                        <th style={{ minWidth: 100 }} className="align-middle">
                          SỐ KHÁCH
                        </th>
                        <th style={{ minWidth: 250 }} className="align-middle">
                          HƯỚNG DẪN VIÊN
                        </th>
                        <th style={{ minWidth: 100 }} className="align-middle">
                          VISA
                        </th>
                        <th style={{ minWidth: 100 }} className="align-middle ">
                          NGÀY HẾT HẠN
                        </th>
                        <th style={{ minWidth: 100 }} className="align-middle">
                          TRẠNG THÁI
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tourGuiderScheduleList.length > 0 ? (
                        RenderRowTable
                      ) : (
                        <td className="text-center align-middle" colSpan={9}>
                          Không có dữ liệu
                        </td>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

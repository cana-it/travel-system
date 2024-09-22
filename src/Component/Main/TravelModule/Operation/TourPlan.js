
import React, { useEffect, useState } from "react";
import { mainAction } from "../../../../Redux/Actions";
import { useDispatch } from "react-redux";
import moment from "moment";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  FormatDateJson,
} from "../../../../Utils";
import Select from "react-select";
import { IMAGES_DOMAIN } from "../../../../Services";

const options = [];
const currentYear = new Date().getFullYear();

for (let i = currentYear - 5; i <= currentYear + 5; i++) {
  options.push({ value: i, label: i });
}

export const TourPlan = () => {
  const dispatch = useDispatch();
  const Creater = +localStorage.getItem("CreateBy");
  const [planList, setPlanList] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    value: currentYear,
    label: currentYear,
  });

  function handleChange(selectedOption) {
    setSelectedOption(selectedOption);
  }
  useEffect(() => {
    Trl_spPlanTour_List(selectedOption.value);
  }, [selectedOption]);

  const Trl_spPlanTour_List = async (year) => {
    try {
      setPlanList([]);
      const firstDayOfYear = new Date(year, 0, 1);
      const lastDayOfYear = new Date(year, 11, 31);

      const pr = {
        PlanTourId: 0,
        FromDate: FormatDateJson(firstDayOfYear, 1),
        ToDate: FormatDateJson(lastDayOfYear, 2),
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spPlanTour_List",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.length > 0) {
        setPlanList(res);
        setExcelData(res);
      }

      // setDataBookingStatus(res)
    } catch (error) {
      ;
    }
  };

  const Trl_TourPlan_Excel = async (dataEx) => {
    try {
      const params = {
        Json: JSON.stringify(excelData),
        func: "Trl_TourPlan_Excel",
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

  const Trl_spPlanTour_Save = async (sv) => {
    if (planList.length === 0) {
      Alertwarning("Không có dữ liệu");
      return;
    }
    try {
      let newArr = planList.map((item) => {
        return { ...item, Creater: +Creater };
      });
      const pr = newArr;
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spPlanTour_Save",
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
    setPlanList((old) => {
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

  const handleChangeStatus = (vs, index) => {
    if (vs === "success") {
      vs = "warning";
    } else if (vs === "warning") {
      vs = "danger";
    } else if (vs === "danger") {
      vs = "success";
    }
    updateMyData(index, vs, "Status");
  };

  const RenderRowTable = () => {
    return planList.map((item, index) => {
      const month = moment(item.DateSaleFrom).format("MMM");
      let departureDate = moment(item.DateSaleFrom).format("DD/MM/YYYY");
      let deadline1 = moment(item.DateSaleFrom)
        .subtract(72, "days")
        .format("DD/MM/YYYY");
      let deadline2 = moment(item.DateSaleFrom)
        .subtract(47, "days")
        .format("DD/MM/YYYY");
      let deadline3 = moment(item.DateSaleFrom)
        .subtract(35, "days")
        .format("DD/MM/YYYY");
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
              <EditableCell
                ivalue={item.TourCode}
                index={index}
                updateMyData={updateMyData}
                property="TourCode"
              />
            </div>
          </td>
          <td className="text-center align-middle">
            <div class="input-group ">
              <div className="padding-td">
                <span className=" ">
                  {item.B.length > 0 &&
                    item.B.filter((item) => item.IsDelete === "A").map(
                      (item, index) => {
                        return <div>{item.PlaneCodeEnd}</div>;
                      }
                    )}
                </span>
              </div>
            </div>
          </td>
          <td className="text-center align-middle">
            <div class="input-group ">
              <div className="padding-td">
                <span className=" ">{departureDate}</span>
              </div>
            </div>
          </td>{" "}
          <td className="text-center align-middle">
            <div class="input-group ">
              <div className="padding-td">
                <span className=" ">{deadline1}</span>
              </div>
            </div>
          </td>{" "}
          <td className="text-center align-middle">
            <div class="input-group ">
              <div className="padding-td">
                <span className=" ">{deadline2}</span>
              </div>
            </div>
          </td>{" "}
          <td className="text-center align-middle">
            <div class="input-group ">
              <div className="padding-td">
                <span className=" ">{deadline3}</span>
              </div>
            </div>
          </td>{" "}
          <td
            className={`text-center align-middle bg-${item.Status} cursor-pointer`}
            onClick={() => handleChangeStatus(item.Status, index)}
          >
            <div class="input-group ">
              {/* <EditableCell
                ivalue={item.Status}
                index={index}
                updateMyData={updateMyData}
                property="Status"
              /> */}
            </div>
          </td>{" "}
          <td className="text-center align-middle">
            <div class="input-group ">
              <EditableCell
                ivalue={item.Note}
                index={index}
                updateMyData={updateMyData}
                property="Note"
              />
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="card ">
          <div class="card-header">
            <div class="row">
              <div class="col-sm-12 col-md-4">
                <h3 class="card-title font-weight-bold">Kế Hoạch Tour</h3>
              </div>
              <div class="col-sm-12 col-md-8 margin-top-5s">
                {excelData.length > 0 && (
                  <button
                    type="button"
                    class="btn btn-sm btn-success mr-2 pull-right ml-2"
                    onClick={() => Trl_TourPlan_Excel()}
                  >
                    <i class="fa fa-download pr-2"></i>
                    Excel
                  </button>
                )}
                <button
                  type="button"
                  class="btn btn-sm btn-success pull-right margin-left-5"
                  onClick={() => Trl_spPlanTour_Save()}
                >
                  <i class="fa fa-save pr-2"></i>
                  Lưu
                </button>
                <div
                  class="form-group pull-right"
                  style={{ marginTop: "-3px" }}
                >
                  {" "}
                  <div class="input-group w-100px">
                    <Select
                      value={selectedOption}
                      onChange={handleChange}
                      options={options}
                      className={"w-100 select-custom z-maxx w-200px"}
                    />
                  </div>
                </div>
                <div
                  class="form-group pull-right mr-2"
                  style={{ marginTop: "-3px" }}
                >
                  {/* <div class="input-group ">
                    <input
                      type="text"
                      maxLength="100"
                      placeholder="Nhập tên khách hàng"
                      class="form-control2 fs-14"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div class="card-body  mt-0">
            <div className="center-item mb-2">
              <h3 class=" font-weight-bold text-dark fs-18">
                KẾ HOẠCH TOUR {selectedOption.label}
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
                          MÃ TOUR
                        </th>

                        <th style={{ minWidth: 350 }} className="align-middle">
                          BOOKING BAY
                        </th>

                        <th style={{ minWidth: 100 }} className="align-middle">
                          DEPARTURE DATE
                        </th>
                        <th
                          style={{ minWidth: 100 }}
                          className="align-middle bg-success"
                        >
                          DEADLINE 1 (70+2)
                        </th>
                        <th
                          style={{ minWidth: 100 }}
                          className="align-middle bg-warning"
                        >
                          DEADLINE 2 (45+2)
                        </th>
                        <th
                          style={{ minWidth: 100 }}
                          className="align-middle bg-danger"
                        >
                          DEADLINE 3 (30+5)
                        </th>
                        <th style={{ minWidth: 50 }} className="align-middle">
                          TRẠNG THÁI
                        </th>
                        <th style={{ minWidth: 300 }} className="align-middle">
                          GHI CHÚ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <RenderRowTable />
                      {planList.length > 0 ? (
                        <RenderRowTable />
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

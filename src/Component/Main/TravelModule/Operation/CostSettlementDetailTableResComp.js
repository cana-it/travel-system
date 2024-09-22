import { useState, useEffect, useRef } from "react";
import ReactInputMask from "react-input-mask";

export const CostSettlementDetailTableResComp = ({
  ListData = [],
  CostTypeId = "",
  CostTypeName = "",
  onData = () => {},
}) => {
  const [Data, setData] = useState([]);
  const [Flag, setFlag] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    setData(ListData);
  }, [ListData]);

  useEffect(() => {
    if (Flag) {
      onData(Data);
      setFlag(false);
    }
  }, [Flag]);

  //#region Update Table Data

  const updateTableData = (rowIndex, columnId, value) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  //#endregion

  //#region Add thêm dòng
  const onAddRow = () => {
    setData([
      ...Data,
      {
        IsDelete: "A",
        DetailId: 0,
        Status1: 0,
        Status2: 0,
        Status3: 0,
        Status4: 0,
        TypePay1: false,
        TypePay2: false,
        TypePay3: false,
        TypePay4: false,
        StatusDifferent1: 0,
        StatusDifferent2: 0,
        StatusDifferent3: 0,
        StatusDifferent4: 0,
      },
    ]);
  };

  const onAddSameRow = () => {
    ;
    let _data = Data;
    let _dataTrue = _data.filter((p) => p.IsDelete === "A");
    let _lastItem = _dataTrue[_dataTrue.length - 1];
    setData([
      ..._data,
      {
        IsDelete: "A",
        DetailId: 0,
        Status: 0, // = 0 là k treo, = 1 là treo
        DateCostNoFormat: _lastItem.DateCostNoFormat,
        DateCost: _lastItem.DateCost,
        DateNotes: _lastItem.DateNotes,
        TypePay1: false,
        TypePay2: false,
        TypePay3: false,
        TypePay4: false,
      },
    ]);
  };

  const onKeyDown = (event, rowIndex) => {
    if (
      (event.metaKey || event.ctrlKey) &&
      event.altKey &&
      event.code === "KeyN"
    ) {
      onAddRow();
      inputs.current[rowIndex + 100000 - 1].focus();
    }
  };

  const onParseDate = (date) => {
    //key=1, key=2
    if (date.length === 10) {
      let arr = date.split("/");
      return [arr[1], arr[0], arr[2]].join("/");
    } else return "";
  };
  //#endregion

  return (
    <>
      <>
        <h5 style={customStyles.tableTitle}>
          {CostTypeId}. {CostTypeName}
        </h5>
        <table
          width={"100%"}
          className="table table-bordered table-striped"
          cellPadding={5}
        >
          <thead>
            <tr>
              <th rowSpan={3} style={customStyles.th40}></th>
              <th rowSpan={3} style={customStyles.th100}>
                NGÀY
              </th>
              <th rowSpan={3} style={customStyles.th}>
                ĐỊA ĐIỂM
              </th>
              <th colSpan={6} style={customStyles.th}>
                TRƯA
              </th>
              <th colSpan={6} style={customStyles.th}>
                CHIỀU
              </th>
              <th rowSpan={3} style={customStyles.th}>
                Ghi chú
              </th>
            </tr>
            <tr>
              <th colSpan={3} style={customStyles.th}>
                ĂN
              </th>
              <th colSpan={3} style={customStyles.th}>
                UỐNG
              </th>
              <th colSpan={3} style={customStyles.th}>
                ĂN
              </th>
              <th colSpan={3} style={customStyles.th}>
                UỐNG
              </th>
            </tr>
            <tr>
              <th style={customStyles.th}>Dự kiến</th>
              <th style={customStyles.th}>Thực tế</th>
              <th style={customStyles.th}>Chênh lệch</th>
              <th style={customStyles.th}>Dự kiến</th>
              <th style={customStyles.th}>Thực tế</th>
              <th style={customStyles.th}>Chênh lệch</th>
              <th style={customStyles.th}>Dự kiến</th>
              <th style={customStyles.th}>Thực tế</th>
              <th style={customStyles.th}>Chênh lệch</th>
              <th style={customStyles.th}>Dự kiến</th>
              <th style={customStyles.th}>Thực tế</th>
              <th style={customStyles.th}>Chênh lệch</th>
            </tr>
          </thead>
          <tbody>
            {Data?.filter((p) => p.IsDelete === "A").map((item, index) => {
              return (
                <tr key={index}>
                  <td className="p-1">
                    <button
                      type="button"
                      className="btn btn-xs btn-danger"
                      onClick={(e) => {
                        updateTableData(index, "IsDelete", "B");
                        setFlag(!Flag);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                  <td>
                    <ReactInputMask
                      mask="99/99/9999"
                      value={item.DateCostNoFormat || ""}
                      onChange={(e) =>
                        updateTableData(
                          index,
                          "DateCostNoFormat",
                          e.target.value
                        )
                      }
                      onBlur={(e) => {
                        updateTableData(
                          index,
                          "DateCost",
                          onParseDate(e.target.value)
                        );
                        setFlag(!Flag);
                      }}
                      style={customStyles.date_input}
                      alwaysShowMask={true}
                      ref={(el) => (inputs.current[index + 100000] = el)}
                    />
                  </td>
                  <td>
                    <input
                      value={item.DateNotes || ""}
                      onChange={(e) =>
                        updateTableData(index, "DateNotes", e.target.value)
                      }
                      type="text"
                      style={customStyles.form_control3}
                      onBlur={(e) => setFlag(!Flag)}
                      ref={(el) => (inputs.current[index + 200000] = el)}
                    />
                  </td>
                  <td>
                    <input
                      value={item.EstCost1 || ""}
                      onChange={(e) =>
                        updateTableData(index, "EstCost1", e.target.value)
                      }
                      type="text"
                      style={customStyles.form_control3}
                      onBlur={(e) => setFlag(!Flag)}
                      ref={(el) => (inputs.current[index + 300000] = el)}
                    />
                  </td>
                  <td>
                    <input
                      value={item.RealCost1 || ""}
                      onChange={(e) =>
                        updateTableData(index, "RealCost1", e.target.value)
                      }
                      type="text"
                      className={
                        (item.RealCost1 || 0) === 0
                          ? ""
                          : item.Status1 === 0
                          ? "bg-green"
                          : item.Status1 === 1
                          ? "bg-yellow"
                          : "bg-red"
                      }
                      style={customStyles.form_control3}
                      onDoubleClick={(e) => {
                        updateTableData(
                          index,
                          "Status1",
                          item.Status1 === 0 ? 1 : item.Status1 === 1 ? 2 : 0
                        );
                        inputs.current[index + 300000].focus();
                        inputs.current[index + 400000].focus();
                      }}
                      onBlur={(e) => setFlag(!Flag)}
                      ref={(el) => (inputs.current[index + 400000] = el)}
                    />
                  </td>
                  <td>
                    <input
                      value={
                        (item.RealCost1 || 0) > (item.EstCost1 || 0)
                          ? ((item.RealCost1 || 0) - (item.EstCost1 || 0)).toFixed(2)
                          : ""
                      }
                      type="text"
                      style={customStyles.form_control3}
                      onDoubleClick={(e) => {
                        updateTableData(
                          index,
                          "StatusDifferent1",
                          item.StatusDifferent1 === 0
                            ? 1
                            : item.StatusDifferent1 === 1
                            ? 2
                            : 0
                        );
                        inputs.current[index + 300000].focus();
                        inputs.current[index + 800000].focus();
                      }}
                      className={
                        item.StatusDifferent1 === 0
                          ? "bg-green"
                          : item.StatusDifferent1 === 1
                          ? "bg-yellow"
                          : "bg-red"
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={item.EstCost2 || ""}
                      onChange={(e) =>
                        updateTableData(index, "EstCost2", e.target.value)
                      }
                      type="text"
                      style={customStyles.form_control3}
                      onBlur={(e) => setFlag(!Flag)}
                      ref={(el) => (inputs.current[index + 500000] = el)}
                    />
                  </td>
                  <td>
                    <input
                      value={item.RealCost2 || ""}
                      onChange={(e) =>
                        updateTableData(index, "RealCost2", e.target.value)
                      }
                      type="text"
                      className={
                        (item.RealCost2 || 0) === 0
                          ? ""
                          : item.Status2 === 0
                          ? "bg-green"
                          : item.Status2 === 1
                          ? "bg-yellow"
                          : "bg-red"
                      }
                      style={customStyles.form_control3}
                      onBlur={(e) => setFlag(!Flag)}
                      ref={(el) => (inputs.current[index + 600000] = el)}
                      onDoubleClick={(e) => {
                        updateTableData(
                          index,
                          "Status2",
                          item.Status2 === 0 ? 1 : item.Status2 === 1 ? 2 : 0
                        );
                        inputs.current[index + 300000].focus();
                        inputs.current[index + 600000].focus();
                      }}
                    />
                  </td>
                  <td>
                    <input
                      value={
                        (item.RealCost2 || 0) > (item.EstCost2 || 0)
                          ? ((item.RealCost2 || 0) - (item.EstCost2 || 0)).toFixed(2)
                          : ""
                      }
                      type="text"
                      style={customStyles.form_control3}
                      onDoubleClick={(e) => {
                        updateTableData(
                          index,
                          "StatusDifferent2",
                          item.StatusDifferent2 === 0
                            ? 1
                            : item.StatusDifferent2 === 1
                            ? 2
                            : 0
                        );
                        inputs.current[index + 300000].focus();
                        inputs.current[index + 800000].focus();
                      }}
                      className={
                        item.StatusDifferent2 === 0
                          ? "bg-green"
                          : item.StatusDifferent2 === 1
                          ? "bg-yellow"
                          : "bg-red"
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={item.EstCost3 || ""}
                      onChange={(e) =>
                        updateTableData(index, "EstCost3", e.target.value)
                      }
                      type="text"
                      style={customStyles.form_control3}
                      onBlur={(e) => setFlag(!Flag)}
                      ref={(el) => (inputs.current[index + 700000] = el)}
                    />
                  </td>
                  <td>
                    <input
                      value={item.RealCost3 || ""}
                      onChange={(e) =>
                        updateTableData(index, "RealCost3", e.target.value)
                      }
                      type="text"
                      className={
                        (item.RealCost3 || 0) === 0
                          ? ""
                          : item.Status3 === 0
                          ? "bg-green"
                          : item.Status3 === 1
                          ? "bg-yellow"
                          : "bg-red"
                      }
                      style={customStyles.form_control3}
                      onDoubleClick={(e) => {
                        updateTableData(
                          index,
                          "Status3",
                          item.Status3 === 0 ? 1 : item.Status3 === 1 ? 2 : 0
                        );
                        inputs.current[index + 300000].focus();
                        inputs.current[index + 800000].focus();
                      }}
                      onBlur={(e) => setFlag(!Flag)}
                      ref={(el) => (inputs.current[index + 800000] = el)}
                    />
                  </td>
                  <td>
                    <input
                      value={
                        (item.RealCost3 || 0) > (item.EstCost3 || 0)
                          ? ((item.RealCost3 || 0) - (item.EstCost3 || 0)).toFixed(2)
                          : ""
                      }
                      type="text"
                      style={customStyles.form_control3}
                      onDoubleClick={(e) => {
                        updateTableData(
                          index,
                          "StatusDifferent3",
                          item.StatusDifferent3 === 0
                            ? 1
                            : item.StatusDifferent3 === 1
                            ? 2
                            : 0
                        );
                        inputs.current[index + 300000].focus();
                        inputs.current[index + 800000].focus();
                      }}
                      className={
                        item.StatusDifferent3 === 0
                          ? "bg-green"
                          : item.StatusDifferent3 === 1
                          ? "bg-yellow"
                          : "bg-red"
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={item.EstCost4 || ""}
                      onChange={(e) =>
                        updateTableData(index, "EstCost4", e.target.value)
                      }
                      type="text"
                      style={customStyles.form_control3}
                      onBlur={(e) => setFlag(!Flag)}
                      ref={(el) => (inputs.current[index + 900000] = el)}
                    />
                  </td>
                  <td>
                    <input
                      value={item.RealCost4 || ""}
                      onChange={(e) =>
                        updateTableData(index, "RealCost4", e.target.value)
                      }
                      type="text"
                      className={
                        (item.RealCost4 || 0) === 0
                          ? ""
                          : item.Status4 === 0
                          ? "bg-green"
                          : item.Status4 === 1
                          ? "bg-yellow"
                          : "bg-red"
                      }
                      style={customStyles.form_control3}
                      onDoubleClick={(e) => {
                        updateTableData(
                          index,
                          "Status4",
                          item.Status4 === 0 ? 1 : item.Status4 === 1 ? 2 : 0
                        );
                        inputs.current[index + 300000].focus();
                        inputs.current[index + 1000000].focus();
                      }}
                      onBlur={(e) => setFlag(!Flag)}
                      ref={(el) => (inputs.current[index + 1000000] = el)}
                    />
                  </td>
                  <td>
                    <input
                      value={
                        (item.RealCost4 || 0) > (item.EstCost4 || 0)
                          ? ((item.RealCost4 || 0) - (item.EstCost4 || 0)).toFixed(2)
                          : ""
                      }
                      type="text"
                      style={customStyles.form_control3}
                      onDoubleClick={(e) => {
                        updateTableData(
                          index,
                          "StatusDifferent4",
                          item.StatusDifferent4 === 0
                            ? 1
                            : item.StatusDifferent4 === 1
                            ? 2
                            : 0
                        );
                        inputs.current[index + 300000].focus();
                        inputs.current[index + 800000].focus();
                      }}
                      className={
                        item.StatusDifferent4 === 0
                          ? "bg-green"
                          : item.StatusDifferent4 === 1
                          ? "bg-yellow"
                          : "bg-red"
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={item.Notes || ""}
                      onChange={(e) =>
                        updateTableData(index, "Notes", e.target.value)
                      }
                      type="text"
                      style={customStyles.form_control3}
                      onBlur={(e) => setFlag(!Flag)}
                      ref={(el) => (inputs.current[index + 1100000] = el)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={12} className="text-center p-1">
                <button
                  type="button"
                  className="btn btn-xs btn-default"
                  onClick={onAddRow}
                  title="Ctrl + Alt + N"
                >
                  <i className="fas fa-plus"></i> Thêm dòng
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-default ml-1"
                  onClick={onAddSameRow}
                  title="Ctrl + Alt + N"
                >
                  <i className="fas fa-plus"></i> Sao chép dòng cuối
                </button>
              </td>
            </tr>
            <tr>
              <td className="p-1 text-center bold" colSpan={3}>
                TOTAL
              </td>
              <td className="p-1 bold text-left">
                {(
                  Data?.filter((p) => p.IsDelete === "A").reduce(
                    (a, v) => (a = a + (+v.EstCost1 || 0)),
                    0
                  ) || 0
                ).toFixed(2)}
              </td>
              <td className="p-1 bold text-left bg-light-yellow">
                {(
                  Data?.filter((p) => p.IsDelete === "A" && p.StatusDifferent1!==2).reduce(
                    (a, v) => (a = a + (+v.RealCost1 || 0)),
                    0
                  ) || 0
                ).toFixed(2)}
              </td>
              <td></td>
              <td className="p-1 bold text-left">
                {(
                  Data?.filter((p) => p.IsDelete === "A").reduce(
                    (a, v) => (a = a + (+v.EstCost2 || 0)),
                    0
                  ) || 0
                ).toFixed(2)}
              </td>
              <td className="p-1 bold text-left bg-light-yellow">
                {(
                  Data?.filter((p) => p.IsDelete === "A" && p.StatusDifferent2!==2).reduce(
                    (a, v) => (a = a + (+v.RealCost2 || 0)),
                    0
                  ) || 0
                ).toFixed(2)}
              </td>
              <td></td>
              <td className="p-1 bold text-left">
                {(
                  Data?.filter((p) => p.IsDelete === "A").reduce(
                    (a, v) => (a = a + (+v.EstCost3 || 0)),
                    0
                  ) || 0
                ).toFixed(2)}
              </td>
              <td className="p-1 bold text-left bg-light-yellow">
                {(
                  Data?.filter((p) => p.IsDelete === "A" && p.StatusDifferent3!==2).reduce(
                    (a, v) => (a = a + (+v.RealCost3 || 0)),
                    0
                  ) || 0
                ).toFixed(2)}
              </td>
              <td></td>
              <td className="p-1 bold text-left">
                {(
                  Data?.filter((p) => p.IsDelete === "A").reduce(
                    (a, v) => (a = a + (+v.EstCost4 || 0)),
                    0
                  ) || 0
                ).toFixed(2)}
              </td>
              <td className="p-1 bold text-left bg-light-yellow">
                {(
                  Data?.filter((p) => p.IsDelete === "A" && p.StatusDifferent4!==2).reduce(
                    (a, v) => (a = a + (+v.RealCost4 || 0)),
                    0
                  ) || 0
                ).toFixed(2)}
              </td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </>
    </>
  );
};

const customStyles = {
  tableTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
  },
  pink: {
    backgroundColor: "rgb(252,228,214)",
  },
  yellow: {
    backgroundColor: "rgb(252,230,153)",
  },
  th: {
    fontSize: "13px",
    padding: "5px",
    backgroundColor: "#eaf1fb",
    verticalAlign: "middle",
    fontWeight: 500,
  },
  th150: {
    fontSize: "13px",
    padding: "0",
    backgroundColor: "#eaf1fb",
    width: "150px",
    verticalAlign: "middle",
    fontWeight: 500,
  },
  th100: {
    fontSize: "13px",
    padding: "0",
    backgroundColor: "#eaf1fb",
    width: "100px",
    verticalAlign: "middle",
    fontWeight: 500,
  },
  th80: {
    fontSize: "13px",
    padding: "0",
    backgroundColor: "#eaf1fb",
    width: "80px",
    verticalAlign: "middle",
    fontWeight: 500,
  },
  th40: {
    fontSize: "13px",
    padding: "0",
    backgroundColor: "#eaf1fb",
    width: "40px",
    fontWeight: 500,
  },
  date_input: {
    outline: "none",
    border: "none",
    padding: "8px",
    background: "#fff",
    margin: "0px",
    fontSize: "0.9em",
    fontWeight: 400,
    width: "100px",
    maxWidth: "100px",
    textAlign: "center",
    textTransform: "uppercase",
  },
  form_control3: {
    display: "block",
    width: "100%",
    padding: "8px",
    fontWeight: 400,
    lineWeight: 1.5,
    color: "#495057",
    backgroundColor: "#fff",
    backgroundClip: "padding-box",
    outline: 0,
    border: 0,
    borderRadius: 0,
    boxShadow: "unset",
    transition: "unset",
  },
  form_control3_bold: {
    display: "block",
    width: "100%",
    padding: "7px",
    lineWeight: 1.5,
    color: "#495057",
    backgroundColor: "#fff",
    backgroundClip: "padding-box",
    outline: 0,
    borderRadius: 0,
    boxShadow: "unset",
    transition: "unset",
    fontWeight: "500",
    border: "2px solid #2563eb",
  },
  specialTd: {
    padding: "8px  !important",
    fontWeight: 400,
    lineWeight: 1.5,
    color: "#495057",
    backgroundColor: "#fff",
  },
  TdFooter: {
    padding: "8px  !important",
    fontWeight: 500,
    lineWeight: 1.5,
    color: "#000",
    backgroundColor: "#ffc10761",
    textAlign: "center",
  },
};

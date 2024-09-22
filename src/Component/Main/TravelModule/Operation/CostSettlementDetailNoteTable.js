import { useState, useEffect, useRef } from "react";
import ReactInputMask from "react-input-mask";

export const CostSettlementDetailNoteComp = ({
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
        CostTypeId: CostTypeId,
        CostTypeName: CostTypeName,
        IsDelete: "A",
        DetailId: 0,
        Status: 0, // = 0 là k treo, = 1 là treo
        TypePay: "C",
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
        CostTypeId: CostTypeId,
        CostTypeName: CostTypeName,
        IsDelete: "A",
        DetailId: 0,
        Status: 0, // = 0 là k treo, = 1 là treo
        DateCostNoFormat: _lastItem.DateCostNoFormat,
        DateCost: _lastItem.DateCost,
        DateNotes: _lastItem.DateNotes,
        TypePay: "C",
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
      //Alerterror(rowIndex+100000+1);
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
        <table
          width={"100%"}
          className="table table-bordered table-striped"
          cellPadding={5}
        >
          <thead>
            <tr>
              <th style={customStyles.th40}></th>
              <th style={customStyles.th100}>GHI CHÚ</th>
              <th style={customStyles.th100}>NGÀY</th>
              <th style={customStyles.th}>NỘI DUNG</th>
              <th style={customStyles.th150}>SỐ TIỀN</th>
            </tr>
          </thead>
          <tbody>
            {Data?.filter((p) => p.IsDelete === "A").map((item, index) => {
              return (
                <tr key={CostTypeId + "-" + index}>
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
                    <input
                      value={index+1}
                      onChange={(e) =>
                        updateTableData(
                          index,
                          "DateNotes",
                          e.target.value
                        )
                      }
                      type="text"
                      style={customStyles.form_control3}
                      onBlur={(e) => setFlag(!Flag)}
                      ref={(el) => (inputs.current[index + 200000] = el)}
                      disabled
                    />
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
                      value={item.RealNotes || ""}
                      onChange={(e) =>
                        updateTableData(
                          index,
                          "RealNotes",
                          e.target.value
                        )
                      }
                      type="text"
                      style={customStyles.form_control3}
                      onBlur={(e) => setFlag(!Flag)}
                      ref={(el) => (inputs.current[index + 300000] = el)}
                    />
                  </td>
                  <td>
                    <input
                      value={item.RealCost || ""}
                      onChange={(e) =>
                        updateTableData(index, "RealCost", e.target.value)
                      }
                      type="text"
                      onBlur={(e) => setFlag(!Flag)}
                      ref={(el) => (inputs.current[index + 400000] = el)}
                      onKeyDown={(e) => onKeyDown(e, index)}
                      className={
                        (item.RealCost || 0) === 0
                          ? ""
                          : item.Status === 0
                          ? "bg-green"
                          : item.Status === 1
                          ? "bg-yellow"
                          : "bg-red"
                      }
                      style={customStyles.form_control3}
                      onDoubleClick={(e) => {
                        updateTableData(
                          index,
                          "Status",
                          item.Status === 0 ? 1 : item.Status === 1 ? 2 : 0
                        );
                        inputs.current[index + 300000].focus();
                        inputs.current[index + 400000].focus();
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} className="text-center p-1">
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
            {/* <tr>
              <td colSpan={5} style={customStyles.TdFooter}>
                TỔNG CHI PHÍ THỰC TẾ:{" "}
                {Data?.filter((p) => p.IsDelete === "A").reduce(
                  (a, v) => (a = a + (+v.RealCost || 0)),
                  0
                ) || 0}
              </td>
            </tr>
            <tr>
              <td colSpan={5} style={customStyles.TdFooter}>
                HDV ĐÃ CHI:{" "}
                {Data?.filter((p) => p.IsDelete === "A").reduce(
                  (a, v) =>
                    (a = a + (v.TypePay === "T" ? +v.RealCost || 0 : 0)),
                  0
                ) || 0}
              </td>
            </tr> */}
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
    padding: "8px",
    lineWeight: 1.5,
    color: "#495057",
    backgroundColor: "#fff",
    backgroundClip: "padding-box",
    outline: 0,
    borderRadius: 0,
    boxShadow: "unset",
    transition: "unset",
    fontWeight: "500",
    border: "2px solid #2563eb"
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

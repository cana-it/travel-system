import React, { useEffect, useState } from "react";
import "react-table-6/react-table.css";
import "react-table-hoc-fixed-columns/lib/styles.css";
import {
  useTable,
  usePagination,
  useBlockLayout,
  useResizeColumns,
} from "react-table";
import { useSticky } from "react-table-sticky";
import { TooltipCustom } from "./TooltipCustom";

const DataTableBookingComp = ({
  columns,
  data,
  updateMyData,
  skipPageReset,
  size = 40,
  className = "",
  info = {},
  isEdit = true,
  initialState = {},
}) => {
  useEffect(() => {
    setPageSize(size);
  }, [size]);

  const defaultColumns = {
    Cell: EditableCell,
  };
  const defaultColumnNonEdit = {
    Cell: CellNonEdit,
  };

  const defaultColumn = isEdit ? defaultColumns : defaultColumnNonEdit;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    prepareRow,
    page,
    setPageSize,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateMyData,
      initialState,
    },
    useBlockLayout,
    useResizeColumns,
    usePagination,
    useSticky
  );

  const BgRegisDate = (row, cell) => {
    let bgRegisDate = "bg-white";
    if (row.original.RegisterDateBg && cell.column.Header === "Register Date") {
      if (row.original.RegisterDateBg === "bg-success") {
        bgRegisDate = "date-success cl ";
      }
      if (row.original.RegisterDateBg === "bg-danger") {
        bgRegisDate = "date-danger cl";
      }
      if (row.original.RegisterDateBg === "bg-warning") {
        bgRegisDate = "date-warning cl";
      }
      if (row.original.RegisterDateBg === "bg-secondary") {
        bgRegisDate = "date-secondary cl";
      }
    }
    return bgRegisDate;
  };

  const WarningVisa = (row, cell) => {
    let warningVisa = "bg-white";
    if (row.original?.DOE && cell.column.Header === "DOE") {
      !checkValidVisa(row.original)
        ? (warningVisa = "date-danger")
        : (warningVisa = "bg-white");
    }
    return warningVisa;
  };
  const changeDayvsMonth = (date) => {
    let arr = date.split("/");
    return `${arr[1]}/${arr[0]}/${arr[2]}`;
  };

  const checkValidVisa = (row) => {
    if (!row?.DOE) {
      return true;
    }
    let now = new Date(info.TimeStart);
    let timeCheck = new Date(changeDayvsMonth(row.DOE));
    let noww = now.getTime();
    let timeCheckk = timeCheck.getTime();
    let totalDayCheck = 1000 * 60 * 60 * 24 * 200; //200 ngày
    if (timeCheckk - noww < totalDayCheck) {
      return false;
    }
    return true;
  };

  return (
    <div className={className}>
      <table {...getTableProps()} class="table bg-white booking-table sticky ">
        <thead className="header">
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="booking-table__head fs-14"
            >
              {headerGroup.headers.map((column, id) => {
                return (
                  <th
                    className={id === 0 ? "p-0" : ""}
                    {...column.getHeaderProps()}
                  >
                    {column.render("Header")}
                    {/* <div
                      {...column.getResizerProps()}
                      className={`resizer ${
                        column.isResizing ? 'isResizing' : ''
                      }`}
                    /> */}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} class="booking-table__body body">
          {page.map((row, i) => {
            let bg = "";
            if (row.original.StatusCustomer === "OK") {
              bg = "bg-white";
            } else if (row.original.StatusCustomer === "CANCEL") {
              bg = "bg-danger";
            } else if (row.original.StatusCustomer === "JOIN") {
              bg = "bg-orange";
            } else {
              bg = "bg-white";
            }
            let bgRow =
              row.original.IsSold === 0 || !row.original?.IsSold
                ? ""
                : "bg-yellow-400";

            let bgNo = row.original.isVAT ? "bg-violet bg-no" : "bg-white";

            let bgGroup =
              row.original.checkSale && row.original.GroupFamily === 0
                ? "bg-row"
                : "";
            let bgGroup2 = row.original.GroupFamily > 0 ? "bg-child" : "";
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className={`tr`}>
                {row.cells.map((cell, ix) => {
                  let bgFaile = row.original?.isRed ? "bg-red-300" : "";

                  let bgRegisDate = BgRegisDate(row, cell);
                  let bgVisa = WarningVisa(row, cell);
                  let cl = ix === 2 ? `${bg} cl` : "bg-white";
                  bgGroup = bgFaile === "bg-red-300" ? "bg-red-300" : bgGroup;
                  let p =
                    ix === 2 || ix === 3 || ix === 4 || ix === 5
                      ? ` ${bgGroup2} ${bgGroup} cl ${bgFaile} `
                      : "bg-white";
                  let bgName =
                    row.original?.Name?.toUpperCase() === "TOUR LEADER" ||
                    (row.original.IsTourLeader && ix < 9 && ix !== 3)
                      ? "bgName"
                      : "";

                  return ix === 1 ? (
                    <td
                      className={`text-center cell-custom ${bgNo}`} // ${bg}
                      {...cell.getCellProps({
                        style: {
                          minWidth: cell.column.minWidth,
                          width: cell.column.width,
                          maxWidth: cell.column.maxWidth,
                        },
                      })}
                    >
                      {cell.render("Cell")}
                    </td>
                  ) : ix === 2 && row.original?.OldBookingCode ? (
                    <TooltipCustom content={row.original.OldBookingCode}>
                      <td
                        class={
                          ix !== 0
                            ? `text-center cell-custom   ${bgRegisDate}  ${bgVisa} ${p} ${bgName} ${bgFaile} ${cl} `
                            : `text-center cell-custom center-item  ${bgRegisDate}  ${bgVisa} ${bgRow} ${cl}`
                        }
                        {...cell.getCellProps({
                          style: {
                            minWidth: cell.column.minWidth,
                            width: cell.column.width,
                            maxWidth: cell.column.maxWidth,
                          },
                        })}
                      >
                        {" "}
                        {cell.render("Cell")}
                      </td>
                    </TooltipCustom>
                  ) : (
                    <td
                      class={
                        ix !== 0
                          ? `text-center cell-custom   ${bgRegisDate}  ${bgVisa} ${p} ${bgName} ${bgFaile} ${cl} `
                          : `text-center cell-custom center-item  ${bgRegisDate}  ${bgVisa} ${bgRow} ${cl}`
                      }
                      {...cell.getCellProps({
                        style: {
                          minWidth: cell.column.minWidth,
                          width: cell.column.width,
                          maxWidth: cell.column.maxWidth,
                        },
                      })}
                    >
                      {" "}
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          {footerGroups.map((group) => (
            <tr {...group.getFooterGroupProps()}>
              {group.headers.map((column) => (
                <td
                  className={`text-center cell-custom `}
                  {...column.getFooterProps()}
                >
                  {column.render("Footer")}
                </td>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};

export const DataTableBooking = React.memo(DataTableBookingComp);

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    updateMyData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="booking-input"
    />
  );
};

const CellNonEdit = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <div className="booking-input">{value}</div>;
};

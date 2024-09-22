import React, { useEffect, useState } from "react";
import "react-table-6/react-table.css";
import "react-table-hoc-fixed-columns/lib/styles.css";
import {
  useTable,
  usePagination,
  useBlockLayout,
  useResizeColumns,
  useRowSelect,
} from "react-table";

const DataTableComp = ({
  columns,
  data,
  updateMyData,
  skipPageReset,
  size = 20,
  className = "",
}) => {
  useEffect(() => {
    setPageSize(size);
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    prepareRow,
    page,
    setPageSize,

    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
    },
    useBlockLayout,
    useResizeColumns,
    usePagination
  );

  // Render the UI for your table
  return (
    <div className={className}>
      <table {...getTableProps()} class="table bg-white booking-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="booking-table__head fs-14 "
            >
              {headerGroup.headers.map((column, id) => {
                return (
                  <th {...column.getHeaderProps()}>
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
        <tbody {...getTableBodyProps()} class="booking-table__body">
          {page.map((row, i) => {
            let bg = "";
            if (row.original.StatusCustomer === "OK") {
              bg = "bg-white";
            } else if (row.original.StatusCustomer === "CANCEL") {
              bg = "bg-red-300";
            } else if (row.original.StatusCustomer === "JOIN") {
              bg = "bg-cyan-300";
            } else {
              bg = "bg-white";
            }
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className={bg}>
                {row.cells.map((cell, ix) => {
                  return ix === 0 ? (
                    <td
                      className="text-center p-2"
                      {...cell.getCellProps({
                        style: {
                          minWidth: cell.column.minWidth,
                          width: cell.column.width,
                          maxWidth: cell.column.maxWidth,
                        },
                      })}
                    >
                      {+cell.row.id + 1}
                    </td>
                  ) : (
                    <td
                      class={"text-center cell-custom"}
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

export const DataTable2 = React.memo(DataTableComp);

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
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
const defaultColumn = {
  Cell: EditableCell,
};

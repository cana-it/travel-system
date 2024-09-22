import React, { useEffect } from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
/*
David Note: please instal this package: npm install react-table-hoc-fixed-columns --save
*/
const DataTableComp = ({
  data = () => { },
  columns = () => { },
  isFixPage = false,
  IsSearch = true,
  showPagination = true,
  showPageSizeOptions = true,
  pageSize = 10,
  className = "",
  page = 0,
  onPageChange = () => { },
}) => {
  const ReactTableFixedColumns = withFixedColumns(ReactTable);

  useEffect(() => { }, []);
  if (isFixPage) {
    return (
      <ReactTableFixedColumns
        data={data}
        columns={columns}
        defaultPageSize={pageSize}
        className={`-striped -highlight  ${className} z-0`}
        defaultFilterMethod={(filter, row, column) => {
          const id = filter.pivotId || filter.id;
          const filterValue =
            typeof filter.value === "object"
              ? filter.value.toLowerCase()
              : filter.value.toLowerCase();

          if (typeof filter.value === "object") {
            return row[id] !== undefined
              ? filterValue.indexOf(row[id].toLowerCase()) > -1
              : true;
          } else {
            return row[id] !== undefined
              ? String(row[id]).toLowerCase().indexOf(filterValue) > -1
              : true;
          }
        }}
        filterable={IsSearch}
        showPagination={showPagination}
        showPageSizeOptions={showPageSizeOptions}
        pageSize={pageSize}
        page={page}
        onPageChange={(pageIndex) => onPageChange(pageIndex)}
        resizable={true}
      />
    );
  } else {
    return (
      <ReactTable
        data={data}
        columns={columns}
        defaultPageSize={pageSize}
        className={`-striped -highlight  ${className} z-0`}
        // SubComponent={row => {
        //     return(
        //         <input type="button" value="Edit"/>
        //     )
        //     }}
        defaultFilterMethod={(filter, row, column) => {
          const id = filter.pivotId || filter.id;
          const filterValue =
            typeof filter.value === "object"
              ? filter.value.toLowerCase()
              : filter.value.toLowerCase();

          if (typeof filter.value === "object") {
            return row[id] !== undefined
              ? filterValue.indexOf(row[id].toLowerCase()) > -1
              : true;
          } else {
            return row[id] !== undefined
              ? String(row[id]).toLowerCase().indexOf(filterValue) > -1
              : true;
          }
        }}
        filterable={IsSearch}
        showPagination={showPagination}
        showPageSizeOptions={showPageSizeOptions}
        pageSize={pageSize}
        resizable={true}
      />
    );
  }
};

export const DataTable = React.memo(DataTableComp);

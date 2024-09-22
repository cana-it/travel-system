import React, { useEffect, useRef, useState } from "react";
import { MyEditor } from "../../../Common/CMS/MyEditor";
import { DataTable } from "../../../Common";

export const TourGroupDetail = ({
  data,
  setData,
  onlyRead,
  dataTourList,
  setDataTourList,
  tourGroupList,
  setTourGroupList,
}) => {
  //#region Select
  const [rowSelectedTour, setRowSelectedTour] = useState([]);
  const [rowSelectedTourGroup, setRowSelectedTourGroup] = useState([]);
  const handleCheckedAll = ({ checked, data, setRowSelected }) => {
    checked
      ? setRowSelected(data.map((item) => item._original))
      : setRowSelected([]);
  };
  const checkedAllRefTour = useRef();
  const checkedAllRefTourGroup = useRef();

  useEffect(() => {
    if (rowSelectedTour.length === 0 && checkedAllRefTour.current) {
      checkedAllRefTour.current.checked = false;
    } else if (
      rowSelectedTourGroup.length === 0 &&
      checkedAllRefTourGroup.current
    ) {
      checkedAllRefTourGroup.current.checked = false;
    }
  }, [rowSelectedTour, rowSelectedTourGroup]);
  //#endregion Select

  const handleCheckedItem = ({
    checked,
    dataList,
    data,
    checkedAllRef,
    rowSelected,
    setRowSelected,
  }) => {
    if (checked) {
      const newData = [...rowSelected, data];
      if (newData.length === dataList.length) {
        checkedAllRef.current.checked = true;
      }
      setRowSelected(newData);
    } else {
      const newData = rowSelected.filter((item) => item.Id !== data.Id);
      if (newData.length === 0 || dataList.length !== newData.length) {
        checkedAllRef.current.checked = false;
      }
      setRowSelected(newData);
    }
  };

  //#region addgroup
  const hasSelected = rowSelectedTour.length > 0;
  const hasSelectedGroup = rowSelectedTourGroup.length > 0;

  const handleAddToGroup = () => {
    const newData = [
      ...tourGroupList,
      ...dataTourList.filter((item) => rowSelectedTour.includes(item)),
    ];
    setTourGroupList(newData);
    setData({
      ...data,
      TourList: newData,
    });
    // delete selected item list selected
    setDataTourList(
      dataTourList.filter((item) => !rowSelectedTour.includes(item))
    );
    setRowSelectedTour([]);
    setRowSelectedTourGroup([]);
  };
  //#endregion addgroup

  //#region delete
  const handleDeleteToGroup = () => {
    const newData = tourGroupList.filter(
      (item) => !rowSelectedTourGroup.includes(item)
    );
    setTourGroupList(newData);
    setData({
      ...data,
      TourList: newData,
    });
    setDataTourList([...dataTourList, ...rowSelectedTourGroup]);
    setRowSelectedTour([]);
    setRowSelectedTourGroup([]);
  };
  //#endregion delete

  //columns tour
  const columnTour = [
    {
      id: "selection",
      Header: ({ data }) => {
        return (
          <div class="inline-flex items-center">
            <label
              class="relative flex items-center p-3 rounded-full cursor-pointer"
              htmlFor="checkbox"
            >
              <input
                type="checkbox"
                class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                id="checkbox"
                onChange={(e) =>
                  handleCheckedAll({
                    checked: e.target.checked,
                    data,
                    setRowSelected: setRowSelectedTour,
                  })
                }
                ref={checkedAllRefTour}
                disabled={dataTourList.length === 0 || onlyRead}
              />
            </label>
          </div>
        );
      },

      width: 100,
      Cell: ({ row }) => {
        return (
          <input
            type="checkbox"
            checked={rowSelectedTour.some((e) => e.Id === row._original.Id)}
            onChange={(e) =>
              handleCheckedItem({
                checked: e.target.checked,
                data: row._original,
                rowSelected: rowSelectedTour,
                checkedAllRef: checkedAllRefTour,
                dataList: dataTourList,
                setRowSelected: setRowSelectedTour,
              })
            }
            disabled={onlyRead}
          />
        );
      },
      filterable: false,
      sortable: false,
      className: "text-center",
    },
    {
      Header: "Tên tour",
      className: "text-center",
      accessor: "NameTour",
      Cell: (item) => <span className="text-center">{item.value}</span>,
    },
  ];

  //columns tour group
  const columnTourGroup = [
    {
      id: "selection",
      Header: ({ data }) => {
        return (
          <div class="inline-flex items-center">
            <label
              class="relative flex items-center p-3 rounded-full cursor-pointer"
              htmlFor="checkbox"
            >
              <input
                type="checkbox"
                class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                id="checkbox"
                onChange={(e) =>
                  handleCheckedAll({
                    checked: e.target.checked,
                    data,
                    setRowSelected: setRowSelectedTourGroup,
                  })
                }
                ref={checkedAllRefTourGroup}
              />
              <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </label>
          </div>
        );
      },
      width: 100,
      Cell: ({ row }) => {
        return (
          <input
            type="checkbox"
            checked={rowSelectedTourGroup.some(
              (e) => e.Id === row._original.Id
            )}
            onChange={(e) =>
              handleCheckedItem({
                checked: e.target.checked,
                data: row._original,
                rowSelected: rowSelectedTourGroup,
                setRowSelected: setRowSelectedTourGroup,
                dataList: tourGroupList,
                checkedAllRef: checkedAllRefTourGroup,
              })
            }
          />
        );
      },
      filterable: false,
      sortable: false,
      className: "text-center",
    },

    {
      Header: "Tên tour",
      className: "text-center",
      accessor: "NameTour",
      Cell: (item) => <span className="text-center">{item.value}</span>,
    },
  ];
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="body col-md-12">
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="no-absolute">
                  Tên Tour Tiếng Việt <span className="text-danger">(*)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={data.NameVN}
                  onChange={(e) => setData({ ...data, NameVN: e.target.value })}
                  placeholder="Ví dụ: Tour nổi bật"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="no-absolute">
                  Tên tour Tiếng Anh <span className="text-danger">(*)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={data.NameEN}
                  onChange={(e) => setData({ ...data, NameEN: e.target.value })}
                  placeholder="Ví dụ: Outstanding tour"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="no-absolute">
                  Đường dẫn <span className="text-danger">(*)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={data.Slug}
                  onChange={(e) => setData({ ...data, Slug: e.target.value })}
                  placeholder="Ví dụ: /tour-noi-bat"
                />
              </div>
            </div>
            <div className="col-md-12 mt-2">
              <label className="no-absolute">
                Mô tả tiếng Việt <span className="text-danger">(*)</span>
              </label>
              <MyEditor
                values={data.ContentVN}
                onChange={(e) => {
                  setData({ ...data, ContentVN: e });
                }}
              />
            </div>
            <div className="col-md-12 mt-4">
              <label className="no-absolute">
                Mô tả tiếng Anh <span className="text-danger">(*)</span>
              </label>
              <MyEditor
                values={data.ContentEN}
                onChange={(e) => {
                  setData({ ...data, ContentEN: e });
                }}
              />
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6">
              <div className="row">
                <div className="headerlink col-md-6">
                  <p className="bold">Tất cả tour ({dataTourList.length})</p>
                </div>
                <div className="headerbutton col-md-6">
                  <button
                    onClick={handleAddToGroup}
                    disabled={!hasSelected || onlyRead}
                    type="button"
                    className="button btn btn-sm btn-success float-right mr-2"
                  >
                    <i className="fa fa-plus pr-2"></i>
                    Thêm vào nhóm
                  </button>
                </div>
              </div>
              {dataTourList.length > 0 ? (
                <DataTable columns={columnTour} data={dataTourList} />
              ) : (
                <>
                  <div className="col-md-4"></div>
                  <div
                    className="col-md-4 text-center text-danger"
                    style={{ border: "2px dashed #000" }}
                  >
                    <i className="fa fa-database mt-3"></i>
                    <p className="text-center">Không có dữ liệu</p>
                  </div>
                  <div className="col-md-4"></div>
                </>
              )}
            </div>

            <div className="col-md-6 ">
              <div className="row">
                <div className="headerlink col-md-6 ">
                  <p className="bold">Nhóm tour ({tourGroupList.length})</p>
                </div>
                <div className="headerbutton col-md-6 ">
                  <button
                    onClick={handleDeleteToGroup}
                    disabled={!hasSelectedGroup || onlyRead}
                    type="button"
                    className="button btn btn-sm btn-danger float-right mr-2"
                  >
                    <i className="fa fa-trash pr-2"></i>
                    Xoá
                  </button>
                </div>
              </div>
              {tourGroupList.length > 0 ? (
                <DataTable columns={columnTourGroup} data={tourGroupList} />
              ) : (
                <>
                  <div className="col-md-4"></div>
                  <div
                    className="col-md-4 text-center text-danger"
                    style={{ border: "2px dashed #000" }}
                  >
                    <i className="fa fa-database mt-3"></i>
                    <p className="text-center">Không có dữ liệu</p>
                  </div>
                  <div className="col-md-4"></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

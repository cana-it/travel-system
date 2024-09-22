import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { Modal, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { useDispatch } from "react-redux";
import { DataTable2 } from "../../../../Common/DataTable2";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  FormatDateJson,
  FormatMoney,
} from "../../../../Utils";
import moment from "moment";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { VisaForm } from "../Booking/VisaForm";
import { TooltipCustom } from "../../../../Common";

import { InvoicePayment } from "../Booking/InvoicePayment";
import { InvoiceCustomerMain } from "../Booking";

export const RetailVisa = () => {
  const dispatch = useDispatch();
  const CreateBy = localStorage.getItem("CreateBy");

  const DepartmentId = +localStorage.getItem("DepartmentId");

  const [skipPageReset, setSkipPageReset] = useState(false);
  const [retailVisaList, setRetailVisaList] = useState([]);
  const [timeSearch, setTimeSearch] = useState([
    new Date(moment().startOf("month").format("MM-DD-YYYY 00:00:00")),
    new Date(moment().endOf("month").format("MM-DD-YYYY 23:59:59")),
  ]);
  const [invoiceStyle, setInvoiceStyle] = useState({
    value: 4,
    label: "Chi Visa",
  });
  const [customerSearch, setCustomerSearch] = useState("");
  const [showVisa, setShowVisa] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [rowNote, setRowNote] = useState({});
  const [note, setNote] = useState("");
  const [check, setCheck] = useState(false);

  useEffect(() => {
    Trl_spRetailVisa_List();
    Trl_spInvoiceStyle_List();
  }, []);

  let sampleDataDetail = {
    Name: "",
    Sex: "",
    DOB: "",
    PassportNo: "",
    DOI: "",
    DOE: "",
    Tel: "",
    FromCode: "",
    RegisterCountry: "",
    RegisterDate: "",
    Schedule: "",
    Visa: "",
    Price: "",
    Discount: "",
    Surcharge: "",
    Note: "",
    Payment1: "",
    Payment2: "",
    Payment3: "",
    FollowedBy: "",
  };
  //#region Call API

  const handleSuccessVisa = (res) => {
    try {
      let arr = retailVisaList.map((item, index) => {
        if (item.RetailVisaId === +rowVisa.RetailVisaId) {
          return {
            ...item,
            VisaName: res.VisaName,
            VisaStatus: res.StatusVisaId,
            StatusVisaId: res.StatusVisaId,
            DOI: changeDayvsMonth(res.DOI.split(" ")[0]),
            DOE: changeDayvsMonth(res.DOE.split(" ")[0]),
            FingerprintDate: res.FingerprintDate,
            NoteOfVisa: res.NoteOfVisa,
            FilesVisa: res.FilesVisa,
            ImagesVisa: res.ImagesVisa,
          };
        }
        return item;
      });
      setRetailVisaList(arr);
    } catch (error) {
      Alertwarning("Có lỗi xẫy ra vui lòng thử lại saud");
    }
  };

  const Trl_spRetailVisa_List = async (data) => {
    try {
      const pr = {
        FromDate: timeSearch[0],
        ToDate: timeSearch[1],
        CustomerSearch: customerSearch,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spRetailVisa_List",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.length > 0) {
        let tempArr = res.map((item) => {
          let code = "";
          if (item?.DOB) {
            let name = item.Name.split(" ");
            let lastName = name[name.length - 1];
            let firstName = name[0];

            let formatDate = moment(item.Brithday).format("DDMMYY");
            code = `${firstName}${lastName}${formatDate}`;
          }
          return {
            ...item,
            DOB: item.DOB ? moment(item.DOB).format("DD/MM/YYYY") : null,
            DOI: item.DOI ? moment(item.DOI).format("DD/MM/YYYY") : null,
            DOE: item.DOE ? moment(item.DOE).format("DD/MM/YYYY") : null,
            RegisterDate: item.RegisterDate
              ? moment(item.RegisterDate).format("DD/MM/YYYY")
              : null,
            Schedule: item.Schedule
              ? moment(item.Schedule).format("DD/MM/YYYY HH:mm")
              : null,
            Tel: item.TEL,
            CustomerName: item.Name,
            CustomerCode: item?.Code && item?.Code !== "" ? item.Code : code,
          };
        });
        for (let index = res.length - 1; index < 20; index++) {
          tempArr.push(sampleDataDetail);
        }
        setRetailVisaList(tempArr);
        await setCheck(!check);
      } else {
        let tempArr = [];
        for (let index = 0; index < 20; index++) {
          tempArr.push(sampleDataDetail);
        }

        await setRetailVisaList(tempArr);
        await setCheck(!check);
      }
    } catch (error) {
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau");
      ;
    }
  };

  const Trl_spRetailVisa_Delete = async (id, dl) => {
    if (+CreateBy !== dl.Creater) {
      Alertwarning(`Bạn không phải là người tạo nên không thao tác được`);
      return;
    }
    try {
      const pr = {
        RetailVisaId: id,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spRetailVisa_Delete",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess("Xóa thành công");
        Trl_spRetailVisa_List();
      }
    } catch (error) {
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau");
      ;
    }
  };

  const changeDayvsMonth = (date, type = 0) => {
    if (type === 0) {
      let arr = date.split("/");
      return `${arr[1]}/${arr[0]}/${arr[2]}`;
    } else {
      let time = date.split(" ");
      let arr = time[0].split("/");
      return `${arr[1]}/${arr[0]}/${arr[2]} ${time[1]}`;
    }
  };

  const handleValidate = (date, type = 0) => {
    if (date === null || date === undefined || date === "") {
      return 2;
    }

    let checkNullDate = date
      .replaceAll("/", "")
      .replaceAll("_", "")
      .replaceAll(":", "");

    if (checkNullDate === "") {
      return 2;
    }

    if (type === 0) {
      let checkValid = date.replaceAll("_", "").split("/");
      if (
        +checkValid[0] > 31 ||
        +checkValid[1] > 12 ||
        +checkValid[2] > 9999 ||
        +checkValid[1] <= 0 ||
        +checkValid[0] <= 0 ||
        +checkValid[2] <= 0
      ) {
        return 3;
      }
    } else {
      let time = date.split(" ");
      if (!time[0] || !time[1]) return 3;

      let checkValid = time[0].replaceAll("_", "").split("/");
      if (
        !checkValid[0] ||
        !checkValid[1] ||
        !checkValid[2] ||
        +checkValid[0] > 31 ||
        +checkValid[1] > 12 ||
        +checkValid[2] > 9999 ||
        +checkValid[1] <= 0 ||
        +checkValid[0] <= 0 ||
        +checkValid[2] <= 0
      ) {
        return 3;
      }
      let checkValidTime = time[1].replaceAll("_", "").split(":");
      if (
        !checkValidTime[0] ||
        !checkValidTime[1] ||
        +checkValidTime[0] > 23 ||
        +checkValidTime[1] > 59 ||
        +checkValidTime[0] < 0 ||
        +checkValidTime[1] < 0
      ) {
        return 3;
      }
    }

    return 1;
  };

  const Trl_spRetailVisa_Save = async (data) => {
    try {
      let check = 0;
      const pr = retailVisaList
        .filter((item) => item.Name.trim().length > 0)
        .map((item) => {
          let birthday = "",
            doi = "",
            doe = "",
            resgiter = "",
            schedule = "";
          if (handleValidate(item.DOB) === 1)
            birthday = FormatDateJson(
              changeDayvsMonth(item.DOB.replaceAll("_", "")),
              3
            );
          if (handleValidate(item.DOI) === 1)
            doi = FormatDateJson(
              changeDayvsMonth(item.DOI.replaceAll("_", "")),
              3
            );
          if (handleValidate(item.DOE) === 1)
            doe = FormatDateJson(
              changeDayvsMonth(item.DOE.replaceAll("_", "")),
              3
            );
          if (handleValidate(item.RegisterDate) === 1)
            resgiter = FormatDateJson(
              changeDayvsMonth(item.RegisterDate.replaceAll("_", "")),
              3
            );
          if (handleValidate(item.Schedule, 1) === 1)
            schedule = FormatDateJson(
              changeDayvsMonth(item.Schedule.replaceAll("_", ""), 1),
              0
            );
          if (handleValidate(item.DOB) === 2) birthday = null;
          if (handleValidate(item.DOI) === 2) doi = null;
          if (handleValidate(item.DOE) === 2) doe = null;
          if (handleValidate(item.Schedule, 1) === 2) schedule = null;
          if (handleValidate(item.RegisterDate) === 2)
            resgiter = FormatDateJson(new Date(), 3);
          if (handleValidate(item.DOB) === 3) {
            Alertwarning(`Ngày sinh của ${item.Name} không hợp lệ`);
            check++;
          }
          if (handleValidate(item.DOI) === 3) {
            Alertwarning(`Ngày cấp của ${item.Name} không hợp lệ`);
            check++;
          }
          if (handleValidate(item.DOE) === 3) {
            Alertwarning(`Ngày hết hạn của ${item.Name} không hợp lệ`);
            check++;
          }
          if (handleValidate(item.RegisterDate) === 3) {
            Alertwarning(`Ngày đăng ký của ${item.Name} không hợp lệ`);
            check++;
          }
          if (handleValidate(item.Schedule, 1) === 3) {
            Alertwarning(`Lịch hẹn của ${item.Name} không hợp lệ`);
            check++;
          }

          return {
            RetailVisaId: item?.RetailVisaId || 0,
            Name: item.Name || 0,
            Sex: item.Sex,
            DOI: doi,
            DOB: birthday,
            DOE: doe,
            Tel: item.Tel,
            PassportNo: item.PassportNo,
            FromCode: item.FromCode,
            RegisterCountry: item.RegisterCountry,
            Schedule: schedule,
            Creater: +CreateBy,
            Price: +item.Price,
            Discount: +item.Discount,
            Surcharge: +item.Surcharge,
            RegisterDate: resgiter,
            Note: item.Note,
            Payment1: item.Payment1,
            Payment2: item.Payment2,
            FollowedBy: item.FollowedBy,
            Code: item.CustomerCode,
          };
        });

      if (check > 0) {
        return;
      }
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spRetailVisa_Save",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        Alertsuccess(res.ReturnMess);
        Trl_spRetailVisa_List();
      }
    } catch (error) {
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau");
      ;
    }
  };

  const [DataObject, setDataObject] = useState({
    Notes: "",
    dataDetail: [],
  });
  const [showInvoice, setShowInvoice] = useState(false);
  const handleClickInvoice = (row) => {
    setDataObject({ ...row, ObjectId: 1, ObjectName: "Khách hàng" });
    setInvoiceStyle({
      ...invoiceStyleList.find((item) => item.StyleId === 6),
      TypeInvoice: 50,
    });
    setShowInvoice(true);
  };

  const handleGetInvoicePayment = (data) => {
    let arr = retailVisaList.map((item, index) => {
      if (item.RetailVisaId === +data.RetailVisaId) {
        if (data.TypePm === "VS1") {
          if (data?.StatusId && data?.StatusName) {
            return {
              ...item,
              Payment1: data.InvoiceId,
              StatusId1: data.StatusId,
              StatusName1: data.StatusName,
            };
          }
          return {
            ...item,
            Payment1: data.InvoiceId,
            Money1: data?.Money ? +data?.Money : item.Money1,
          };
        }
        if (data.TypePm === "VS2") {
          if (data?.StatusId && data?.StatusName) {
            return {
              ...item,
              Payment2: data.InvoiceId,
              StatusId2: data.StatusId,
              StatusName2: data.StatusName,
            };
          }
          return {
            ...item,
            Payment2: data.InvoiceId,
            Money2: data?.Money ? +data?.Money : item.Money2,
          };
        }
      }
      return item;
    });
    setRetailVisaList(arr);
  };

  //#region  EDIT TABLE
  const updateMyData = (rowIndex, columnId, value) => {
    setSkipPageReset(true);
    setRetailVisaList((old) =>
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
      <OverlayTrigger
        trigger={"focus"}
        key={"top"}
        placement={"top"}
        overlay={
          <Popover id={`popover-positioned-top`}>
            {retailVisaList[index]?.Note && (
              <>
                <Popover.Header as="h3" className="bg-primary">
                  Note
                </Popover.Header>
                <Popover.Body>{retailVisaList[index]?.Note}</Popover.Body>
              </>
            )}
          </Popover>
        }
      >
        <input
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="booking-input"
          onDoubleClick={(e) => {
            if (
              retailVisaList[index]?.RetailVisaId &&
              retailVisaList[index]?.RetailVisaId !== 0
            ) {
              setRowNote(retailVisaList[index]);
              setShowNote(true);
            } else {
              Alertwarning(
                "Vui lòng lưu lại thông tin visa, khách hàng này trước khi ghi chú"
              );
            }
          }}
        />
      </OverlayTrigger>
    );
  };

  const EditableCellWithDate = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);
    const onChange = (e) => {
      setValue(e.target.value);

      // if (HandleZeroCalendar(e))
      //     $("." + id).eq(index).find(".react-datetime-picker__inputGroup__leadingZero").html("");
    };
    const onBlur = (e) => {
      updateMyData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <ReactInputMask
        mask="99/99/9999"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`booking-input`}
        alwaysShowMask={true}
      />
    );
  };

  const EditableCellWithDateTime = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData,
  }) => {
    const [value, setValue] = useState(initialValue);
    const onChange = (e) => {
      setValue(e.target.value);
    };
    const onBlur = (e) => {
      updateMyData(index, id, value);
    };

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <ReactInputMask
        mask="99/99/9999 99:99"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`booking-input`}
        alwaysShowMask={true}
      />
    );
  };

  const EditableCellMoney = ({
    value: initialValue,
    row: { index },
    column: { id },
  }) => {
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
      setValue(FormatMoney(e.target.value, 1));
    };

    const onBlur = () => {
      updateMyData(index, id, value);
    };

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        value={FormatMoney(value)}
        onChange={onChange}
        onBlur={onBlur}
        className="booking-input"
      />
    );
  };

  //#endregion
  const [DiscountSurcharge, setDiscountSurcharge] = useState();
  const [ShowDiscountSurcharge, setShowDiscountSurcharge] = useState(false);
  const [ShowDiscountSurcharge1, setShowDiscountSurcharge1] = useState(false);
  const handleDiscountSurcharge = (data) => {
    setDiscountSurcharge(data);
    data?.key === "Discount"
      ? setShowDiscountSurcharge(true)
      : setShowDiscountSurcharge1(true);
  };
  const handleClickDiscountSurcharge = (cl1, cl2) => {
    setRetailVisaList((old) =>
      old.map((row, index) => {
        if (index === DiscountSurcharge?.rowIndex) {
          return {
            ...old[DiscountSurcharge?.rowIndex],
            [cl1]:
              cl1 === "Discount"
                ? DiscountSurcharge?.Discount
                : DiscountSurcharge?.Surcharge,
            [cl2]:
              cl1 === "Discount"
                ? DiscountSurcharge?.DiscountDescription
                : DiscountSurcharge?.SurchargeDescription,
          };
        }
        return row;
      })
    );
    DiscountSurcharge?.key === "Discount"
      ? setShowDiscountSurcharge(false)
      : setShowDiscountSurcharge1(false);
  };
  const [rowVisa, setRowVisa] = useState({});

  const columns = useMemo(
    () => [
      {
        Header: "No",
        accessor: "No",
        textAlign: "center",
        disableResizing: true,
        width: 50,
        getResizerProps: () => {},
        sticky: "left",
      },
      {
        Header: "Options",
        accessor: "Edit",
        Cell: ({ row }) => (
          <div style={{ textAlign: "center" }} className="mt-2">
            {row.original?.RetailVisaId && row.original?.RetailVisaId !== 0 && (
              <button
                className="btn btn-xs btn-danger"
                onClick={(e) =>
                  Trl_spRetailVisa_Delete(
                    row.original.RetailVisaId,
                    row.original
                  )
                }
              >
                {" "}
                <i class="fa fa-trash pr-2"></i>Xóa
              </button>
            )}
          </div>
        ),
        width: 100,
      },
      {
        Header: "Full Name",
        accessor: "Name",
        minWidth: 250,
        disableResizing: true,
        sticky: "left",
        Cell: EditableCell,
      },
      {
        Header: "Sex",
        accessor: "Sex",
        disableResizing: true,
        width: 80,
      },
      {
        Header: "DOB",
        accessor: "DOB",
        disableResizing: true,
        Cell: EditableCellWithDate,
        minWidth: 100,
      },
      {
        Header: "Visa Status",
        accessor: "Visa",
        disableResizing: true,
        Cell: ({ row }) => {
          let bg;
          let visaId = row.original?.StatusVisaId;
          if (visaId === 1) {
            bg = "badge badge-light";
          } else if (visaId === 2) {
            bg = "badge badge-warning";
          } else if (visaId === 3) {
            bg = "badge badge-success";
          } else if (visaId === 4) {
            bg = "badge badge-danger";
          } else if (visaId === 5) {
            bg = "badge text-danger font-weight-bold";
          }
          return (
            <div
              onClick={() => {
                if (!row.original?.RetailVisaId) {
                  Alertwarning(
                    "Vui lòng lưu dữ liệu khách hàng trước khi thêm Visa"
                  );
                  return;
                }
                if (DepartmentId !== 32) {
                  Alertwarning(
                    "Chỉ bộ phận Visa mới được thao tác chức năng này"
                  );
                  return;
                }
                setRowVisa(row.original);
                setDataObject({
                  ...row.original,
                  ObjectId: 1,
                  ObjectName: "Khách hàng",
                });
                setShowVisa(true);
                // setIdRowEdit(obj.row.id);
              }}
              className={`w-100 cursor-pointer h-100 table-open__cell center-item ${bg} fs-12`}
              // disabled={row.original?.CustomerId && row.original?.CustomerId !== 0 ? false : true}
            >
              {" "}
              {row.original?.RetailVisaId
                ? row.original?.VisaName
                  ? row.original.VisaName
                  : ""
                : ""}{" "}
            </div>
          );
        },
        //Cell: renderEditable
      },
      {
        Header: "Passport No",
        accessor: "PassportNo",
        disableResizing: true,
        minWidth: 150,
        maxWidth: 500,
        //Cell: renderEditable,
      },
      {
        Header: "DOI",
        accessor: "DOI",
        minWidth: 100,
        disableResizing: true,
        Cell: EditableCellWithDate,
      },
      {
        Header: "DOE",
        accessor: "DOE",
        disableResizing: true,
        Cell: EditableCellWithDate,
        minWidth: 100,
      },
      {
        Header: "Tel",
        accessor: "Tel",
        disableResizing: true,
        minWidth: 150,
      },
      {
        Header: "From",
        accessor: "FromCode",
        disableResizing: true,
        width: 150,
      },
      {
        Header: "Nation Application",
        accessor: "RegisterCountry",
        disableResizing: true,
        minWidth: 100,
      },
      {
        Header: "Fingerprint Date",
        accessor: "Schedule",
        disableResizing: true,
        minWidth: 150,
        Cell: EditableCellWithDateTime,
      },
      {
        Header: "Register Date",
        accessor: "RegisterDate",
        minWidth: 100,
        Cell: EditableCellWithDate,
      },
      {
        Header: "Price",
        accessor: "Price",
        disableResizing: true,
        minWidth: 100,
        Cell: EditableCellMoney,
      },
      {
        Header: "Discount",
        accessor: "Endow",
        disableResizing: true,
        minWidth: 100,
        Cell: ({ row }) => {
          return (
            <TooltipCustom content={row.original?.DiscountDescription || ""}>
              <input
                onClick={() => {
                  handleDiscountSurcharge({
                    ...row.original,
                    key: "Discount",
                    rowIndex: row.index,
                  });
                }}
                className={` w-100 cursor-pointer h-100 table-open__cell center-item booking-input`}
                value={FormatMoney(row?.original?.Discount || 0)}
                readOnly
                // disabled={row.original?.CustomerId && row.original?.CustomerId !== 0 ? false : true}
              />
            </TooltipCustom>
          );
        },
        //Cell: EditableCellMoney
        //Cell: renderEditable
      },
      {
        Header: "Surcharge",
        accessor: "Surcharge",
        disableResizing: true,
        minWidth: 100,
        Cell: ({ row }) => {
          return (
            <TooltipCustom content={row.original.SurchargeDescription || ""}>
              <input
                onClick={() => {
                  handleDiscountSurcharge({
                    ...row.original,
                    key: "SurchargeDescription",
                    rowIndex: row.index,
                  });
                }}
                className={` w-100 cursor-pointer h-100 table-open__cell center-item booking-input`}
                value={FormatMoney(row?.original?.Surcharge || 0)}
                readOnly
                // disabled={row.original?.CustomerId && row.original?.CustomerId !== 0 ? false : true}
              />
            </TooltipCustom>
          );
        },
        //Cell: EditableCellMoney
        //Cell: renderEditable
      },
      {
        Header: "Total Price",
        accessor: "TotalPrice",
        disableResizing: true,
        minWidth: 100,
        Cell: ({ row }) => {
          let value =
            row.original.Price - row.original.Discount + row.original.Surcharge;
          return (
            <input
              className={`booking-input cursor-not-allowed`}
              value={FormatMoney(value || 0)}
              readOnly
              // disabled={row.original?.CustomerId && row.original?.CustomerId !== 0 ? false : true}
            />
          );
        },
        //Cell: renderEditable
      },
      {
        Header: "Payment1",
        accessor: "Payment1",
        disableResizing: true,
        minWidth: 180,
        Cell: ({ row }) => {
          let bg;
          if (row.original.StatusId1 === 2) {
            bg = "badge badge-success";
          }
          if (row.original.StatusId1 === 4) {
            bg = "badge badge-warning";
          }
          if (row.original.StatusId1 === 5 || row.original.StatusId1 === 6) {
            bg = "badge badge-danger";
          }
          return (
            <div
              onClick={() => {
                if (
                  !row.original?.RetailVisaId ||
                  row.original?.RetailVisaId === 0
                ) {
                  Alertwarning(
                    "Vui lòng lưu thông tin visa trước khi nhập thanh toán"
                  );
                  return;
                }
                handleClickInvoice({ ...row.original, TypePm: "VS1" });
              }}
              className={` w-100 cursor-pointer h-100 table-open__cell center-item ${bg}`}
              // disabled={row.original?.CustomerId && row.original?.CustomerId !== 0 ? false : true}
            >
              {FormatMoney(row.original?.Money1 || 0)}
            </div>
          );
        },
      },
      {
        Header: "Payment2",
        accessor: "Payment2",
        disableResizing: true,
        minWidth: 180,
        Cell: ({ row }) => {
          let bg;
          if (row.original.StatusId2 === 2) {
            bg = "badge badge-success";
          }
          if (row.original.StatusId2 === 4) {
            bg = "badge badge-warning";
          }
          if (row.original.StatusId2 === 5 || row.original.StatusId2 === 6) {
            bg = "badge badge-danger";
          }
          return (
            <div
              onClick={() => {
                if (
                  !row.original?.RetailVisaId ||
                  row.original?.RetailVisaId === 0
                ) {
                  Alertwarning(
                    "Vui lòng lưu thông tin visa trước khi nhập thanh toán"
                  );
                  return;
                }
                handleClickInvoice({ ...row.original, TypePm: "VS2" });
              }}
              className={` w-100 cursor-pointer h-100 table-open__cell center-item ${bg}`}
              // disabled={row.original?.CustomerId && row.original?.CustomerId !== 0 ? false : true}
            >
              {FormatMoney(row.original?.Money2 || 0)}
            </div>
          );
        },
      },
      {
        Header: "Remain",
        accessor: "Remain",
        disableResizing: true,
        minWidth: 100,
        Cell: ({ row }) => {
          let value =
            row.original.Price -
            row.original.Discount +
            row.original.Surcharge -
            (row.original.Money1 + row.original.Money2);
          return (
            <input
              className={`booking-input cursor-not-allowed`}
              value={FormatMoney(value || 0)}
              readOnly
              // disabled={row.original?.CustomerId && row.original?.CustomerId !== 0 ? false : true}
            />
          );
        },
      },
      {
        Header: "Sales",
        accessor: "FollowedBy",
        disableResizing: true,
        minWidth: 100,
      },
    ],
    [check]
  );

  const handleChangeNote = (e) => {
    let newData = retailVisaList.map((item) => {
      if (item.RetailVisaId === rowNote.RetailVisaId) {
        return { ...item, Note: note };
      }
      return item;
    });
    setRetailVisaList(newData);
    setNote("");
    setRowNote({});
    setShowNote(false);
    setCheck(!check);
  };

  const [showInvoiceVisa, setShowInvoiceVisa] = useState(false);
  const [invoiceStyleList, setInvoiceStyleList] = useState([]);
  const handleShow = (value) => {
    if (value === 13) {
      setShowInvoiceVisa(true);
      setInvoiceStyle({
        ...invoiceStyleList.find((item) => item.StyleId === 4),
        TypeInvoice: 1,
      });
    }
  };

  //#region Call API
  const Trl_spInvoiceStyle_List = async (bookingId) => {
    try {
      const pr = {
        BookingId: +bookingId,
        CreateName: +CreateBy,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoiceStyle_List",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      setInvoiceStyleList(res);
    } catch (error) {
      ;
    }
  };

  const handleUpdateInvoice = (d, type) => {
    if (type === 1) {
      setRowVisa({ ...rowVisa, InvoiceVisaId: d.InvoiceId });
      setDataObject({ ...DataObject, InvoiceVisaId: d.InvoiceId });
      let newData = retailVisaList.map((item) => {
        if (item.VisaId === rowVisa.VisaId) {
          return { ...item, InvoiceVisaId: d.InvoiceId };
        }
        return item;
      });
      setRetailVisaList(newData);
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="card p-1">
          <div class="card-header">
            <div class="row">
              <div class="col-sm-12 col-md-4">
                <h3 class="card-title font-weight-bold">Thông tin visa lẻ</h3>
              </div>
              <div class="col-sm-12 col-md-8 margin-top-5s">
                <button
                  onClick={Trl_spRetailVisa_List}
                  type="button"
                  class="btn btn-sm btn-danger pull-right margin-left-5"
                >
                  <i class="fa fa-search pr-2"></i>
                  Tìm kiếm
                </button>

                <div
                  class="form-group pull-right"
                  style={{ marginTop: "-3px" }}
                >
                  <div class="input-group ">
                    <DateTimeRangePicker
                      className="form-control2 px-1 pb-2px w-100"
                      value={timeSearch}
                      onChange={(date) => setTimeSearch(date)}
                      format={"dd/MM/yyyy"}
                    />
                  </div>
                </div>
                <div
                  class="form-group pull-right mr-2"
                  style={{ marginTop: "-3px" }}
                >
                  <div class="input-group ">
                    <input
                      type="text"
                      maxLength="100"
                      placeholder="Nhập tên khách hàng"
                      class="form-control2 fs-14"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body p-2">
            <div className="table-responsive">
              <DataTable2
                columns={columns}
                data={retailVisaList}
                updateMyData={updateMyData}
                skipPageReset={skipPageReset}
                size={20}
                className="resize-table-custom-2"
              />
            </div>
            <div className="row">
              <div class="col-12 mt-2">
                <button
                  onClick={() => {
                    Trl_spRetailVisa_Save();
                  }}
                  type="button"
                  class="btn btn-lg btn-success pull-right mr-1 ml-1 fs-14"
                >
                  <i class="fa fa-save pr-2"></i>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <Modal
          show={showInvoice}
          onHide={() => setShowInvoice(false)}
          backdrop="static"
          keyboard={false}
          size="xl"
          className={`custom-modal-w-90   z-max`}
        >
          <Modal.Header className="py-2 border-bottom-0 ">
            <Modal.Title className="ml-auto">PHIẾU THU</Modal.Title>
            <button
              type="button"
              class="close"
              aria-label="Close"
              onClick={() => {
                setShowInvoice(false);
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body class="p-1">
            <InvoicePayment
              Booking={null}
              DataObject={DataObject}
              handleShow={() => handleShow(5)}
              IsActive={Math.random()}
              invoiceStyle={invoiceStyle}
              onInvoiceInfor={handleGetInvoicePayment}
            />
          </Modal.Body>
        </Modal>

        <Modal
          show={showVisa}
          onHide={() => setShowVisa(false)}
          aria-labelledby="example-custom-modal-styling-title"
          className=" custom-modal-w-90"
        >
          <Modal.Header className="p-2">
            <Modal.Title id="example-custom-modal-styling-title">
              <div class="text-center">Cập nhật visa</div>
            </Modal.Title>
            <button
              type="button"
              class="close"
              aria-label="Close"
              onClick={() => setShowVisa(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body class="p-0">
            <VisaForm
              data={rowVisa}
              onVisa={handleSuccessVisa}
              type={2}
              handleShow={handleShow}
            />
          </Modal.Body>
        </Modal>

        {/* Modal hoa don cho visa */}
        <Modal
          show={showInvoiceVisa}
          onHide={() => setShowInvoiceVisa(false)}
          backdrop="static"
          keyboard={false}
          size="xl"
          className={`custom-modal-w-90   z-max`}
        >
          <Modal.Header className="py-2 border-bottom-0">
            <Modal.Title className="ml-auto">PHIẾU PĐX</Modal.Title>
            <button
              type="button"
              class="close"
              aria-label="Close"
              onClick={() => {
                setShowInvoiceVisa(false);
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body class="p-1">
            <InvoiceCustomerMain
              Booking={{}}
              DataObject={DataObject}
              handleShow={() => setShowInvoiceVisa(true)}
              IsActive={Math.random()}
              invoiceStyle={invoiceStyle}
              onInvoiceInfor={handleUpdateInvoice}
              TypeOfReceipt={"PĐXVS"}
            />
          </Modal.Body>
        </Modal>
        {/* end modal */}

        {/* #region Modal Note  */}
        <Modal
          show={showNote}
          onHide={() => setShowNote(false)}
          aria-labelledby="example-custom-modal-styling-title"
          size="lg"
          className={showNote ? "" : "d-none"}
        >
          <Modal.Header className="p-2">
            <Modal.Title id="example-custom-modal-styling-title">
              <div class="text-center">Thêm ghi chú</div>
            </Modal.Title>
            <button
              type="button"
              class="close"
              aria-label="Close"
              onClick={() => setShowNote(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body class="p-4">
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <span class="small font-weight-bold text-muted">GHI CHÚ</span>
                  <div class=" input-group">
                    <textarea
                      type="text"
                      class="form-control2"
                      rows="4"
                      cols="50"
                      defaultValue={rowNote?.Note}
                      // onChange={(e) => setNote(e.target.value)}
                      onBlur={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  class="btn btn-success pull-right ml-1 mr-1"
                  onClick={handleChangeNote}
                >
                  <i class="fa fa-save pr-2"></i>
                  Save
                </button>
              </div>
            </div>
            {/* <VisaForm data={rowVisa} onVisa={handleSuccessVisa} type={2} /> */}
          </Modal.Body>
        </Modal>
        {/* #endregion */}

        {/* discount srurechar */}

        <Modal
          show={ShowDiscountSurcharge}
          onHide={() => setShowDiscountSurcharge(false)}
          backdrop="static"
          keyboard={false}
          size="sx"
          // className={`${opacity}`}
        >
          <Modal.Header className="py-2 border-bottom-0">
            <Modal.Title className="ml-auto">Discount</Modal.Title>
            <button
              type="button"
              class="close"
              aria-label="Close"
              onClick={() => setShowDiscountSurcharge(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body class="p-1">
            <div class="row p-2 w-500px">
              <div class="col-sm-12 col-md-12">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    Discount
                  </span>
                  <div class=" input-group">
                    <input
                      type="text"
                      class="form-control2"
                      value={FormatMoney(+DiscountSurcharge?.Discount || 0)}
                      onChange={(e) =>
                        setDiscountSurcharge({
                          ...DiscountSurcharge,
                          Discount: FormatMoney(e.target.value, 1),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-md-12">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    Desciption
                  </span>
                  <div class=" input-group">
                    <input
                      type="text"
                      class="form-control2"
                      value={DiscountSurcharge?.DiscountDescription || ""}
                      onChange={(e) =>
                        setDiscountSurcharge({
                          ...DiscountSurcharge,
                          DiscountDescription: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <button
                  className="btn btn-success btn-sm pull-right mr-1 px-3"
                  onClick={(e) =>
                    handleClickDiscountSurcharge(
                      "Discount",
                      "DiscountDescription"
                    )
                  }
                >
                  Lưu Discount
                  <i class="fas fa-arrow-right pl-2"></i>
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={ShowDiscountSurcharge1}
          onHide={() => setShowDiscountSurcharge1(false)}
          backdrop="static"
          keyboard={false}
          size="sx"
          // className={`${opacity}`}
        >
          <Modal.Header className="py-2 border-bottom-0">
            <Modal.Title className="ml-auto">Surcharge</Modal.Title>
            <button
              type="button"
              class="close"
              aria-label="Close"
              onClick={() => setShowDiscountSurcharge1(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body class="p-1">
            <div class="row p-2 w-500px">
              <div class="col-sm-12 col-md-12">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    Surcharge
                  </span>
                  <div class=" input-group">
                    <input
                      type="text"
                      class="form-control2"
                      value={FormatMoney(+DiscountSurcharge?.Surcharge || 0)}
                      onChange={(e) =>
                        setDiscountSurcharge({
                          ...DiscountSurcharge,
                          Surcharge: FormatMoney(e.target.value, 1),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-md-12">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    Desciption
                  </span>
                  <div class=" input-group">
                    <input
                      type="text"
                      class="form-control2"
                      value={DiscountSurcharge?.SurchargeDescription || ""}
                      onChange={(e) =>
                        setDiscountSurcharge({
                          ...DiscountSurcharge,
                          SurchargeDescription: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <button
                  className="btn btn-success btn-sm pull-right mr-1 px-3"
                  onClick={(e) =>
                    handleClickDiscountSurcharge(
                      "Surcharge",
                      "SurchargeDescription"
                    )
                  }
                >
                  Lưu Surcharge
                  <i class="fas fa-arrow-right pl-2"></i>
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {/* end discount srurechar */}
      </div>
    </>
  );
};

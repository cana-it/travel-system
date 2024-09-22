import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import { Alertwarning, Alertsuccess, Alerterror } from "../../../../Utils";
import { DataTable, SelectService, SelectTourCode } from "../../../../Common";
import { confirmAlert } from "react-confirm-alert"; // Import

import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import Modal from "react-bootstrap/Modal";
import moment from "moment";

export const ExpenseItems = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");

  const VideAdd = () => {
    Cancel();
    openModal();
  };

  const Cancel = () => {
    setExpenseId(0);
    setExpenseCode("");
    setExpenseName("");
  };

  const [data, setData] = useState([]);
  useEffect(() => {
    Trl_spExpenseItems_List();
  }, []);

  const [TextSearch, setTextSearch] = useState("");
  const Trl_spExpenseItems_List = async () => {
    try {
      const pr = {
        TextSearch: TextSearch,
        UserId: Creater,
        Type: 0,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spExpenseItems_List",
      };

      const list = await mainAction.API_spCallServer(params, dispatch);
      setData(list);
      
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const [ExpenseId, setExpenseId] = useState(0);
  const [ExpenseCode, setExpenseCode] = useState("");
  const [ExpenseName, setExpenseName] = useState("");
  const Trl_spExpenseItems_Save = async () => {
    try {
      if (ExpenseCode === "") {
        Alertwarning("Nhập mã khoản mục");
        return;
      }
      if (ExpenseCode.length <= 0) {
        Alertwarning("Nhập mã khoản mục > 0 kí tự");
        return;
      }
      if (ExpenseName === "") {
        Alertwarning("Nhập tên khoản mục");
        return;
      }
      if (ExpenseName.length <= 0) {
        Alertwarning("Nhập tên khoản mục > 0 kí tự");
        return;
      }

      const pr = {
        ExpenseId: ExpenseId,
        ExpenseCode: ExpenseCode.trim(),
        ExpenseName: ExpenseName.trim(),
        Creater: Creater,
        CreateName: CreateName,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spExpenseItems_Save",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Cancel();
        Trl_spExpenseItems_List();
        setIsOpen(false); // close popup
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.ReturnMess);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spExpenseItems_View = (item) => {
    const obView = item._original;
    setExpenseId(obView.ExpenseId);
    setExpenseCode(obView.ExpenseCode);
    setExpenseName(obView.ExpenseName);
    setIsOpen(true);
  };

  const Trl_spExpenseItems_Delete = (item) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return <ConfirmAlertUi onClose={onClose} item={item} />;
      },
    });
  };

  const Trl_spExpenseItems_Delete_Action = async (item) => {
    try {
      const pr = {
        Creater: Creater,
        CreateName: CreateName,
        ExpenseId: item._original.ExpenseId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spExpenseItems_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spExpenseItems_List();
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.ReturnMess);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const ConfirmAlertUi = (props) => {
    return (
      <div className="card-body border-left-red">
        <h3>
          Xác nhận {props.item._original.IsDelete ? "Xóa" : "Mở"} dữ liệu!
        </h3>
        <p>
          Bạn có chắc chắn muốn {props.item._original.IsDelete ? "Xóa" : "Mở"}{" "}
          <strong>{props.item._original.ExpenseName}</strong>{" "}
        </p>
        <button className="btn btn-small btn-warning" onClick={props.onClose}>
          {" "}
          <i class="fa fa-undo"> </i> Hủy
        </button>
        <button
          className="btn btn-small btn-danger margin-left-5"
          onClick={() => {
            props.onClose();
            Trl_spExpenseItems_Delete_Action(props.item);
          }}
        >
          <i class="fa fa-trash"> </i>{" "}
          {props.item._original.IsDelete ? "Xóa" : "Mở"}
        </button>
      </div>
    );
  };

  const columns = [
    {
      Header: "Lựa chọn",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-xs btn-warning"
            onClick={(e) => Trl_spExpenseItems_View(row)}
          >
            {" "}
            <i class="fa fa-eye"></i> Sửa
          </button>{" "}
          |
          <button
            className={
              row._original.IsDelete
                ? "btn btn-xs btn-danger"
                : "btn btn-xs btn-success"
            }
            onClick={(e) => Trl_spExpenseItems_Delete(row)}
          >
            {" "}
            <i class="fa fa-undo"></i> {row._original.IsDelete ? "Xóa" : "Mở"}
          </button>
        </div>
      ),
      width: 140,
      fixed: "left",
    },
    {
      Header: "Mã khoản mục",
      accessor: "ExpenseCode",
      fixed: "left",
      width: 160,
    },
    {
      Header: "Tên khoản mục",
      accessor: "ExpenseName",
      width: 220,
      fixed: "left",
    },
    {
      Header: "Trạng thái",
      accessor: "Status",
      Cell: ({ row }) => (
        <span
          className={
            row._original.IsDelete === "A"
              ? "badge badge-success"
              : "badge badge-danger"
          }
        >
          {row._original.Status}
        </span>
      ),
      width: 120,
      fixed: "left",
    },
    {
      Header: "Người tạo",
      accessor: "CreateName",
    },
    {
      Header: "Thời gian",
      accessor: "CreateTime",
    },
    {
      Header: "Người Sửa",
      accessor: "EditName",
    },
    {
      Header: "Thời gian sửa",
      accessor: "EditTime",
    },
  ];

  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="content-wrapper">
        <div class="card">
          <div class="card-header  border-left-red card-header2">
            <div class="row">
              <div className="col-sm-12 col-md-2">
                <h3 className="card-title font-weight-bold">
                  KHOẢN MỤC ({data.length})
                </h3>
              </div>
              <div class="col-sm-12 col-md-10 margin-top-5s">
                <button
                  onClick={VideAdd}
                  type="button"
                  class="btn btn-sm btn-success pull-right margin-left-5"
                >
                  <i class="fa fa-plus pr-2"></i>
                  Thêm mới
                </button>
                <button
                  onClick={Trl_spExpenseItems_List}
                  type="button"
                  class="btn btn-sm btn-danger pull-right margin-left-5"
                >
                  <i class="fa fa-search pr-2"></i>
                  Tìm kiếm
                </button>
                <div
                  class="form-group pull-right"
                  style={{ marginTop: "-4px" }}
                >
                  <div class="input-group" style={{ width: "100%" }}>
                    <input
                      type="text"
                      maxLength="500"
                      placeholder="SĐT,Email,Tên KH..."
                      class="form-control"
                      value={TextSearch}
                      onChange={(e) => setTextSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body border-left-red">
            <div class="row">
              <div className="col-md-12">
                <DataTable
                  data={data}
                  columns={columns}
                  IsSearch={true}
                  style={{ zIndex: 500 }}
                />
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={modalIsOpen}
          onHide={closeModal}
          className=" custom-modal-w-90"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              <div class="">
                {ExpenseId === 0 ? "Thêm mới khoản mục" : "Chỉnh sửa thông tin"}
              </div>
            </Modal.Title>
            <button
              type="button"
              className="close"
              aria-label="Đóng"
              onClick={() => {
                closeModal();
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            <div class="card-body">
              <div class="row">
                <div class="col-sm-12 col-md-6">
                  <div class="form-group">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          Mã khoản mục(
                          <strong className="check-point">*</strong>)
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength="50"
                        class="form-control"
                        value={ExpenseCode}
                        onChange={(e) => setExpenseCode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-6">
                  <div class="form-group">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          Tên khoản mục(
                          <strong className="check-point">*</strong>)
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength="50"
                        class="form-control"
                        value={ExpenseName}
                        onChange={(e) => setExpenseName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div class="col-sm-12 col-md-12">
                  <button
                    onClick={(e) => setIsOpen(false)}
                    type="button"
                    class="btn btn-sm btn-default pull-right margin-left-5"
                  >
                    <i class="fa fa-undo pr-2"></i>
                    Đóng
                  </button>
                  <button
                    onClick={Cancel}
                    type="button"
                    class="btn btn-sm btn-warning pull-right margin-left-5"
                  >
                    <i class="fa fa-trash pr-2"></i>
                    Hủy
                  </button>

                  <button
                    type="button"
                    class="btn btn-sm btn-danger pull-right"
                    onClick={(e) => {
                      Trl_spExpenseItems_Save();
                    }}
                  >
                    <i class="fa fa-edit pr-2"></i>
                    {ExpenseId === 0 ? " Thêm mới" : "Chỉnh sửa"}
                  </button>
                </div>
                <div class="col-sm-12 col-md-12">
                  <div class="form-group">
                    <h5 style={{ color: "red" }}>
                      Ghi chú: các ô có dấu sao màu đỏ là bắt buộc nhập
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

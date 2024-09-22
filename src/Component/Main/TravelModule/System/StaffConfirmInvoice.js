import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  FormatDateJson,
  ConfirmAlert,
} from "../../../../Utils";
import { DataTable, SelectStaff, SelectDepartment } from "../../../../Common";
import Modal from "react-bootstrap/Modal";
import $ from "jquery";


export const StaffConfirmInvoice = () => {
  useEffect(() => {
    Trl_spStaffConfirmInvoice_List();
  }, []);

  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");

  const [StaffSearch, setStaffSearch] = useState("");
  const [HiddenTable, setHiddenTable] = useState(true);
  const [TitleShow, setTitleShow] = useState("");
  const [DataTableList, setDataTableList] = useState([]);
  const [StaffView, setStaffView] = useState([]);
  const [ConfirmId, setConfirmId] = useState(0);
  const [Confirm1, setConfirm1] = useState(0);
  const [Confirm2, setConfirm2] = useState(0);
  const [ConfirmName1, setConfirmName1] = useState("");
  const [ConfirmName2, setConfirmName2] = useState("");

  const [IsOpen, setIsOpen] = useState(false);

  const CloseModal = () => {
    setIsOpen(false);
    setConfirmId(0);
    setConfirm1(0);
    setConfirm2(0);
    setConfirmName1("");
    setConfirmName2("");
  };

  const onSelectStaff1 = (e) => {
    setConfirm1(e.value);
    setConfirmName1(e.label);
  };

  const onSelectStaff2 = (e) => {
    setConfirm2(e.value);
    setConfirmName2(e.label);
  };

  const Trl_spStaffConfirmInvoice_List = async () => {
    try {
      const pr = {
        Officer: Creater,
        StaffSearch: StaffSearch,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spStaffConfirmInvoice_List",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length != 0) {
        setDataTableList(result);
        setHiddenTable(false);
        setTitleShow(`Tổng Số Nhân Viên: ${result.length}`);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      setHiddenTable(true);
    }
  };

  const Edit = (e) => {
    let Ojb = e.row.original;
    setStaffView(Ojb);
    setIsOpen(true);
    setConfirmId(Ojb.ConfirmId);
    setConfirm1(Ojb.Confirm1);
    setConfirmName1(Ojb.ConfirmName1);
    setConfirm2(Ojb.Confirm2);
    setConfirmName2(Ojb.ConfirmName2);
  };

  const Trl_spStaffConfirmInvoice_Save = async () => {
    try {
      const pr = {
        ConfirmId: ConfirmId,
        Confirm1: Confirm1,
        ConfirmName1: ConfirmName1,
        Confirm2: Confirm2,
        ConfirmName2: ConfirmName2,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spStaffConfirmInvoice_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        CloseModal();
        Trl_spStaffConfirmInvoice_List();
        return;
      } else {
        Alertwarning(result.ReturnMess);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };


    const columns = [
        {
            Header: "STT",
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 40,
            textAlign: "center",
            filterable: false,
            sortable: false,
        },
        {
            Header: "Tùy Chọn",
            accessor: '[row identifier to be passed to button]',
            width: 150,
            filterable: false,
            sortable: false,
            Cell: (row) => (
                <div>
                    <span>
                    <button className="btn btn-sm btn-success" onClick={e => Edit({ row })}><i class="fa fa-eye"></i> Phân Quyền</button>
                    </span>
                </div>  
            ),
        },
        {
            Header: 'Tên Nhân Viên',
            accessor: 'StaffName',
            width: 350,
        },
        {
            Header: 'Người Xác Nhận 1',
            accessor: 'ConfirmName1',
            width: 400,
        },
        {
            Header: 'Người Xác Nhận 2',
            accessor: 'ConfirmName2',
            width: 400,
        }
    ];

  return (
    <>
      <div className="content-wrapper pt-1 px-2 pb-2">
        <div class="card p-1 PrintInvoiceHide">
          <div class="card-header border-left-red">
            <div class="row">
              <div class="col-sm-12 col-md-3 margin-top-5s">
                TÌM KIẾM NHÂN VIÊN
              </div>
              <div class="col-sm-12 col-md-9 margin-top-5s">
                <button
                  onClick={(e) => {
                    Trl_spStaffConfirmInvoice_List();
                  }}
                  type="button"
                  class="btn btn-sm btn-danger pull-right margin-left-5"
                >
                  <i class="fa fa-search pr-2"></i>
                  Tìm kiếm
                </button>
                <div
                  class="form-group pull-right"
                  style={{ marginTop: "-4px", marginRight: "5px" }}
                >
                  <div class="input-group ">
                    <input
                      type="text"
                      maxLength="50"
                      placeholder="Tên NV ..."
                      class="form-control2"
                      value={StaffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body border-left-red">
            <div className="row">
              <div className="col-sm-12 col-md-12">
                <div
                  className={
                    HiddenTable === true
                      ? "card display-none"
                      : "card display-block"
                  }
                >
                  <div class="card-header d-flex">
                    <div class="d-flex">
                      <div class="font-weight-bold text-muted">{TitleShow}</div>
                    </div>
                  </div>
                  <div className="card-body p-1 pl-0">
                    <div className="col-md-12">
                      <div class="table-responsive">
                        <DataTable data={DataTableList} columns={columns} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={IsOpen}
        onHide={CloseModal}
        aria-labelledby="example-custom-modal-styling-title"
        className=" custom-modal-w-90"
      >
        <Modal.Header>
          <Modal.Title id="example-custom-modal-styling-title">
            <div class="">
              {"Thông Tin Nhân Viên Cần Phân Quyền: " + StaffView.StaffName}
            </div>
          </Modal.Title>
          <div>
            <button
              type="button"
              class="btn btn-xs btn-danger pull-right margin-left-5 close"
              aria-label="Close"
              onClick={CloseModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <button
              style={{ marginRight: "5px" }}
              type="button"
              class="btn btn-sm btn-success pull-right"
              onClick={() => {
                ConfirmAlert("Xác nhận", "Bạn có muốn lưu không?", () => {
                  Trl_spStaffConfirmInvoice_Save();
                });
              }}
            >
              <i class="fa fa-edit pr-2"></i>
              {ConfirmId === 0 ? " Thêm mới" : "Chỉnh sửa"}
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div class="card-body">
            <div class="row">
              <div class="col-sm-12 col-md-4 m-auto">
                <div class="form-group">
                  <span class="label">Tên Nhân Viên</span>
                  <div class="input-group">
                    <input
                      type="text"
                      maxLength="50"
                      class="form-control2"
                      readOnly
                      value={StaffView.StaffName}
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-md-4 m-auto">
                <div class="form-group">
                  <span class="label">Người Xác Nhận 1</span>
                  <div class="input-group">
                    <SelectStaff
                      className={"w-100 select-custom z-maxx"}
                      onSelected={(e) => {
                        onSelectStaff1(e);
                      }}
                      onStaffId={Confirm1}
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-md-4 m-auto">
                <div class="form-group">
                  <span class="label">Người Xác Nhận 2</span>
                  <div class="input-group">
                    <SelectStaff
                      className={"w-100 select-custom z-maxx"}
                      onSelected={(e) => {
                        onSelectStaff2(e);
                      }}
                      onStaffId={Confirm2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

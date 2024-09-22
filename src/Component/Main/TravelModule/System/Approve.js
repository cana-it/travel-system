import { IMAGES_DOMAIN } from "../../../../Services";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import { Alertsuccess, FormatDateJson, Alerterror } from "../../../../Utils";
import { SelectStaff, SelectTypeApprove, DataTable } from "../../../../Common";
import { Alert } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert"; // Import
import Modal from "react-bootstrap/Modal";


export const Approve = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const [StaffIdLv1, setStaffIdLv1] = useState(0);
  const [StaffNameLv1, setStaffNameLV1] = useState("");
  const [StaffIdLv2, setStaffIdLv2] = useState(0);
  const [StaffNameLv2, setStaffNameLV2] = useState("");
  const [StaffIdLv3, setStaffIdLv3] = useState(0);
  const [StaffNameLv3, setStaffNameLV3] = useState("");
  const [StaffIdLv4, setStaffIdLv4] = useState(0);
  const [StaffNameLv4, setStaffNameLV4] = useState("");

  const [TypeApproveID, setTypeApproveID] = useState(0);
  const [TypeApproveName, setTypeApproveName] = useState("");
  const [ApproveId, setApproveId] = useState(0);
  const [ApproveSearch, setApproveSearch] = useState("");

  const [ApproveData, setApproveData] = useState([]);
  const ApproveType = (item) => {
    setTypeApproveID(item.value);
    setTypeApproveName(item.label);
  };

  useEffect(() => {
    Trl_spApproveProgress_List();
  }, []);
  const VideAdd = () => {
    openModal();
  };
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const Lv1 = (item) => {
    setStaffIdLv1(item.value);
    setStaffNameLV1(item.label);
  };
  const Lv2 = (item) => {
    setStaffIdLv2(item.value);
    setStaffNameLV2(item.label);
  };
  const Lv3 = (item) => {
    setStaffIdLv3(item.value);
    setStaffNameLV3(item.label);
  };
  const Lv4 = (item) => {
    setStaffIdLv4(item.value);
    setStaffNameLV4(item.label);
  };
  const Trl_spApproveProgress_List = async () => {
    let pr = {
      ApproveId: 0,
      Keysearch: "",
    };
    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spApproveProgress_List",
    };

    const result = await mainAction.API_spCallServer(params, dispatch);
    setApproveData(result);
  };

  const Trl_spApproveProgress_Save = async () => {
    let pr = {
      ApproveId: ApproveId,
      TypeApprove: TypeApproveID,
      TypeApproveName: TypeApproveName,
      Level1: StaffIdLv1,
      LevelName1: StaffNameLv1,
      Level2: StaffIdLv2,
      LevelName2: StaffNameLv2,
      Level3: StaffIdLv3,
      LevelName3: StaffNameLv3,
      Level4: StaffIdLv4,
      LevelName4: StaffNameLv4,
      Creater: Creater,
      Creatime: "",
      IsDelete: "A",
    };

    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spApproveProgress_Save",
    };

    const result = await mainAction.API_spCallServer(params, dispatch);
    Trl_spApproveProgress_List();
    if (result.Key === "Pass") {
      Alertsuccess(result.Result);
    }

    setApproveId(0);
    setTypeApproveID(0);
    setTypeApproveName("");
    setStaffIdLv1(0);
    setStaffIdLv2(0);
    setStaffIdLv3(0);
    setStaffIdLv4(0);
    setStaffNameLV1("");
    setStaffNameLV2("");
    setStaffNameLV3("");
    setStaffNameLV4("");
  };

  const Trl_spApproveProgress_View = (item) => {
    const obView = item._original;
    setApproveId(obView.ApproveId);
    setTypeApproveID(obView.TypeApprove);
    setTypeApproveName(item.TypeApproveName);
    setStaffIdLv1(obView.Level1);
    setStaffIdLv2(obView.Level2);
    setStaffIdLv3(obView.Level3);
    setStaffIdLv4(obView.Level4);
    setStaffNameLV1(item.LevelName1);
    setStaffNameLV2(item.LevelName2);
    setStaffNameLV3(item.LevelName3);
    setStaffNameLV4(item.LevelName4);
    setIsOpen(true);
  };
  const Cancel = () => {
    setApproveId(0);
    setTypeApproveID(0);
    setTypeApproveName("");
    setStaffIdLv1(0);
    setStaffIdLv2(0);
    setStaffIdLv3(0);
    setStaffIdLv4(0);
    setStaffNameLV1("");
    setStaffNameLV2("");
    setStaffNameLV3("");
    setStaffNameLV4("");
    setIsOpen(false);
  };
  const Trl_spStaff_Delete = (item) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return <ConfirmAlertUi onClose={onClose} item={item} />;
      },
    });
  };

  const Trl_spApprove_Delete_Action = async (item) => {
    try {
      const pr = {
        Creater: Creater,
        ApproveId: item._original.ApproveId,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spApproveProgress_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spApproveProgress_List();
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.ReturnMess);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };

  const ConfirmAlertUi = (props) => {
    return (
      <div className="card-body border-left-red">
        <h3>Xác nhận xóa dữ liệu!</h3>
        <p>
          Bạn có chắc chắn muốn xóa{" "}
          <strong>{props.item._original.TypeApproveName}</strong>{" "}
        </p>
        <button className="btn btn-small btn-warning" onClick={props.onClose}>
          {" "}
          <i class="fa fa-undo"> </i> Hủy
        </button>
        <button
          className="btn btn-small btn-danger margin-left-5"
          onClick={() => {
            props.onClose();
            Trl_spApprove_Delete_Action(props.item);
          }}
        >
          <i class="fa fa-trash"> </i> Xóa
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
            className="btn btn-xs btn-success"
            onClick={(e) => Trl_spApproveProgress_View(row)}
          >
            <i class="fa fa-eye"></i> Sửa
          </button>{" "}
          |
          <button
            className="btn btn-xs btn-danger pr-2 margin-left-5"
            onClick={(e) => Trl_spStaff_Delete(row)}
          >
            {" "}
            <i class="fa fa-trash"></i> Xóa
          </button>
        </div>
      ),
      width: 140,
      fixed: "left",
    },
    {
      Header: "Loại Phê duyệt",
      accessor: "TypeApproveName",
      fixed: "left",
    },
    {
      Header: "Người duyệt cấp 1",
      accessor: "LevelName1",
      width: 200,
    },

    {
      Header: "Người duyệt cấp 2",
      accessor: "LevelName2",
    },
    {
      Header: "Người duyệt cấp 3",
      accessor: "LevelName3",
      width: 200,
    },
    {
      Header: "Người duyệt cấp 4",
      accessor: "LevelName4",
      // Cell: (obj) => FormatDateJson(obj.value),
      with: 250,
    },
  ];
  return (
    <>
    <div className="content-wrapper">
      <div class="card-header border-left-red">
        <div class="row">
          <div class="col-sm-12 col-md-3">
            <h3 class="card-title font-weight-bold">
              Thiết lập phê duyệt quy trình
            </h3>
          </div>
          <div class="col-sm-12 col-md-9 margin-top-5s">
            <button
              onClick={VideAdd}
              type="button"
              class="btn btn-sm btn-success pull-right margin-left-5"
            >
              <i class="fa fa-plus pr-2"></i>
              Thêm mới
            </button>

            <button
              onClick={Trl_spApproveProgress_List}
              type="button"
              class="btn btn-sm btn-danger pull-right margin-left-5"
            >
              <i class="fa fa-search pr-2"></i>
              Tìm kiếm
            </button>

            <div
              class="form-group pull-right margin-top-20"
              style={{ marginTop: "-4px", width: "20%", marginLeft: "5px" }}
            >
              <div class="input-group" style={{ width: "100%" }}>
                <input
                  type="text"
                  maxLength="500"
                  placeholder="Loại phê duyệt ..."
                  class="form-control"
                  value={ApproveSearch}
                  onChange={(e) => setApproveSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body border-left-red">
        <div className="row">
          <DataTable
            data={ApproveData}
            columns={columns}
            // style={{ zIndex: 500 }}
          />
        </div>

        <Modal
          show={modalIsOpen}
          onHide={closeModal}
          className=" custom-modal-w-90"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header className="p-2">
            <Modal.Title id="example-custom-modal-styling-title">
              <div class="">
                {ApproveId === 0
                  ? "Thêm phê duyệt mới"
                  : "Chỉnh sửa thông tin " + TypeApproveName.toLowerCase()}
              </div>
            </Modal.Title>
            <button
              type="button"
              class="close"
              aria-label="Close"
              onClick={closeModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            <div class="col-md-12 margin-top-20">
              <div class="row">
                <div class="col-md-4 col-sm-12">
                  <div class="form-group">
                    <div class="input-group">
                      <span class="input-group-text">
                        Loại phê duyệt(
                        <strong className="check-point">*</strong>)
                      </span>
                      <SelectTypeApprove
                        onSelected={(item) => ApproveType(item)}
                        TypeApproveId={-1}
                        onTypeApproveId={TypeApproveID}
                        className="select-custom w-100"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md-4 col-sm-12">
                  <div class="form-group">
                    <div class="input-group">
                      <span class="input-group-text">
                        Cấp 1(<strong className="check-point">*</strong>)
                      </span>
                      <SelectStaff
                        onSelected={(item) => Lv1(item)}
                        StaffId={StaffIdLv1}
                        onStaffId={StaffIdLv1}
                        BranchId={0}
                        className="select-custom w-100"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md-4 col-sm-12">
                  <div class="form-group">
                    <div class="input-group">
                      <span class="input-group-text">Cấp 2</span>
                      <SelectStaff
                        onSelected={(item) => Lv2(item)}
                        StaffId={StaffIdLv2}
                        onStaffId={StaffIdLv2}
                        BranchId={0}
                        className="select-custom w-100"
                      />
                    </div>
                  </div>
                </div>

                <div class="col-md-4 col-sm-12 margin-top-20">
                  <div class="form-group">
                    <div class="input-group">
                      <span class="input-group-text">Cấp 3</span>
                      <SelectStaff
                        onSelected={(item) => Lv3(item)}
                        StaffId={StaffIdLv3}
                        onStaffId={StaffIdLv3}
                        BranchId={0}
                        className="select-custom z-1 w-100"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md-4 col-sm-12 margin-top-20">
                  <div class="form-group">
                    <div class="input-group">
                      <span class="input-group-text">Cấp 4</span>
                      <SelectStaff
                        onSelected={(item) => Lv4(item)}
                        StaffId={StaffIdLv4}
                        onStaffId={StaffIdLv4}
                        BranchId={0}
                        className="select-custom z-1 w-100"
                      />
                    </div>
                  </div>
                </div>

                {/* <div class="col-md-4 col-sm-12 margin-top-20 pull-right">
                                    <button class='btn sm-btn bg-success pull-right'
                                        onClick={Trl_spApproveProgress_Save}>Save</button>

                                    <button onClick={e => setIsOpen(false)} type="button" class="btn btn-sm btn-default pull-right margin-left-5">
                                        <i class="fa fa-undo pr-2"></i>
                                        Đóng
                                    </button>
                                    <button onClick={Cancel} type="button" class="btn btn-sm btn-warning pull-right margin-left-5">
                                        <i class="fa fa-trash pr-2"></i>
                                        Hủy
                                    </button>

                                </div> */}

                <div class="col-sm-12 col-md-6">
                  <div class="form-group">
                    <h5 style={{ color: "red" }}>
                      Ghi chú: các ô có dấu sao màu đỏ là bắt buộc nhập
                    </h5>
                  </div>
                </div>
                <div class="col-sm-12 col-md-6">
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
                    class="btn btn-sm btn-success pull-right"
                    onClick={Trl_spApproveProgress_Save}
                  >
                    <i class="fa fa-edit pr-2"></i>
                    {ApproveId === 0 ? " Thêm mới" : "Chỉnh sửa"}
                  </button>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
    </>
  );
};

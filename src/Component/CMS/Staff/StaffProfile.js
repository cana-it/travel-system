import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { confirmAlert } from "react-confirm-alert";
import { DataTable, SelectStaff } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import {
    Alerterror,
    Alertsuccess,
    FormatDateJson,
} from "../../../Utils";
import { MyEditor } from "../../../Common/CMS/MyEditor";
export const StaffProfile = () => {
    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const IsHide = localStorage.getItem("IsHide");
    const [Data, setData] = useState([]);
    const [DepartmentId_List, setDepartmentId_List] = useState(0);
    const [StaffSearch, setStaffSearch] = useState("");
    const [StaffId, setStaffId] = useState(0);
    const [StaffName, setStaffName] = useState("");
    const [Profile, setProfile] = useState("");
    const [ListData, setListData] = useState([]);
    const [Status, setStatus] = useState([]);
    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const [FromValue, setFromValue] = useState({
        StaffId: 0,
        StaffName: "",
        Profile: "",
    });

    useEffect(() => {
        Trl_spStaff_List();
    }, []);

    const ClearForm = () => {
        setFromValue({
            StaffId: 0,
            StaffName: "",
            Profile: "",

        });
    };

    const Cancel = () => {
        setStaffId(0);
        setStaffName("");
        setProfile("");
    };

    const Trl_spStaff_List = async (BrandId, DepartmentId, Keys) => {
        try {
            const pr = {
                DepartmentId: Keys === 1 ? DepartmentId : DepartmentId_List,
                BranchId: 0,
                StaffSearch: StaffSearch,
                StaffId: 0,
                Creater: Creater,
            };

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spStaff_List",
            };

            const list = await mainAction.API_spCallServer(params, dispatch);
            setData(list);
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
            ;
        }
    };

    const Trl_spStaff_Save = async () => {
        try {
            setDisable(false);
            const params = {
                Json: JSON.stringify({
                    StaffId: FromValue.StaffId,
                    StaffName: FromValue.StaffName,
                    Profile: Profile?.trim(),
                    Creater: Creater,
                    CreateName: CreateName,
                }),
                func: "Trl_spStaff_Save",
            };
            setDisable(true);
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Cancel();
                // setListData(ListData);
                setIsOpen(false);
                ClearForm();
                return;
            }
            if (result.Status === "NOTOK") {
                Alerterror(result.ReturnMess);
                setDisable2(true);
                return;
            } else {
                ListData.map((e) => {
                    if (e.StaffId === FromValue.StaffId) {
                        e.StaffName = FromValue.StaffName;
                        e.Profile = Profile;
                    }
                    return e;
                });
                setListData(ListData);
                Alertsuccess(result.ReturnMess);
                ClearForm();
                setDisable2(true);
            }
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
            setDisable2(true);
        }
    };

    const Trl_spStaffProfile_Update = async (item) => {
        let obView = item._original;
        setStaffId(obView.StaffId);
        setStaffName(obView.StaffName);
        setProfile(obView.Profile);
        setFromValue({
            StaffId: obView.StaffId,
            StaffName: obView.StaffName,
            Profile: obView.Profile,
        });
        setIsOpen(true);

        // try {
        //     const params = {
        //         Json: JSON.stringify({
        //             StaffId: StaffId,
        //             Profile: Profile,
        //             Creater: Creater,
        //         }),
        //         func: "Trl_spStaffProfile_Update",
        //     };
        //     const result = await mainAction.API_spCallServer(params, dispatch);
        //     if (result.Status === "OK") {
        //         Alertsuccess(result.Message);
        //         setDisable2(true);
        //         return;
        //     }
        //     setDisable2(true);
        // } catch (error) {
        //     setDisable2(true);
        //     Alerterror("Vui lòng liên hệ IT!");
        // }
    };

    // const Trl_spStaff_View = (item) => {
    //     setChangeStyle(true);
    //     let obView = item._original;
    //     setStaffId(obView.StaffId);
    //     setStaffName(obView.StaffName);
    //     setProfile(obView.Profile);
    //     setFromValue({
    //         StaffId: obView.StaffId,
    //         StaffName: obView.StaffName,
    //         Profile: obView.Profile,
    //         Document: obView.Document,
    //         IsHide: obView.IsHide ? 1 : 0,
    //         IsDelete: obView.IsDelete ? 1 : 0,
    //         TypeSetting: obView.TypeSetting,
    //     });
    //     setValue({
    //         Document: obView.Document
    //     })
    //     if (obView.TypeSetting === 'Document') {
    //         setTypeSetting('Document');
    //     }
    //     setValueType({ value: item._original.TypeSetting, label: item._original.TypeSettingName })
    //     setIsOpen(true);
    // };

    const Trl_spStaff_Delete = (item) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return <ConfirmAlertUi onClose={onClose} item={item} />;
            },
        });
    };

    const Trl_spStaff_Delete_Action = async (item) => {
        try {
            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                StaffId: item._original.StaffId,
            };

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spStaff_Delete",
            };

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spStaff_List();
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
                <h3>Xác nhận xóa dữ liệu!</h3>
                <p>
                    Bạn có chắc chắn muốn xóa{" "}
                    <strong>{props.item._original.StaffName}</strong>{" "}
                </p>
                <button className="btn btn-small btn-warning" onClick={props.onClose}>
                    {" "}
                    <i class="fa fa-undo"> </i> Hủy
                </button>
                <button
                    className="btn btn-small btn-danger margin-left-5"
                    onClick={() => {
                        props.onClose();
                        Trl_spStaff_Delete_Action(props.item);
                    }}
                >
                    <i class="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    };

    const Trl_spStaff_BlockUser = async (item) => {
        const pr = {
            Creater: Creater,
            StaffId: item._original.StaffId,
        };

        const params = {
            Json: JSON.stringify(pr),
            func: "Trl_spStaff_BlockUser",
        };
        const result = await mainAction.API_spCallServer(params, dispatch);
        Alertsuccess(result.ReturnMess);
        let rows = Data.find((e) => e.StaffId === item._original.StaffId);
        rows.BlockUser = rows.BlockUser === 1 ? 0 : 1;
    };

    const [modalIsOpen, setIsOpen] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    };
    const closeModal = () => {
        setIsOpen(false);
    };
    const VideAdd = () => {
        openModal();
    };
    const columns = [
        {
            Header: "STT",
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 40,
            filterable: false,
            special: true,
            show: true,
        },
        {
            Header: "Lựa chọn",
            accessor: "Edit",
            Cell: ({ row }) => (
                <div style={{ textAlign: "center" }}>
                    {/* <button
                        className="btn btn-xs btn-success"
                        onClick={(e) => Trl_spStaff_View(row)}
                    >
                        {" "}
                        <i class="fa fa-eye"></i> Chi tiết
                    </button>{" "} */}
                    <button
                        className="btn btn-xs btn-success"
                        onClick={(e) => Trl_spStaffProfile_Update(row)}
                    >
                        {" "}
                        <i class="fas fa-pen-square"></i> Sửa
                    </button>{" "}

                    <button
                        className="btn btn-xs btn-danger pr-2"
                        onClick={(e) => Trl_spStaff_Delete(row)}
                    >
                        {" "}
                        <i class="fa fa-trash"></i> Xóa
                    </button>{" "}
                    {row._original.IsBlockUser === 1 ? (
                        <>
                            <button
                                className={
                                    row._original.BlockUser === 1
                                        ? "btn btn-xs btn-primary pr-2"
                                        : " btn btn-xs btn-warning pr-2"
                                }
                                onClick={(e) => Trl_spStaff_BlockUser(row)}
                            >
                                {" "}
                                <i
                                    class={
                                        row._original.BlockUser === 1 ? "fa fa-unlock" : "fa fa-ban"
                                    }
                                ></i>{" "}
                                {row._original.BlockUser === 1 ? "Mở khóa" : " Khóa User"}
                            </button>{" "}
                        </>
                    ) : (
                        ""
                    )}
                </div>
            ),
            width: 300,
            fixed: "left",
        },
        {
            Header: "Nhân viên",
            accessor: "StaffName",
        },
        {
            Header: "Người tạo",
            accessor: "CreateName",
        },
        {
            Header: "Ngày tạo",
            accessor: "CreateTime",
            Cell: (obj) => (obj?.value ? FormatDateJson(obj.value, 10) : ""),
        },
        {
            Header: "Người sửa",
            accessor: "EditName",
        },
        {
            Header: "Ngày sửa",
            accessor: "EditTime",
            Cell: (obj) => (obj?.value ? FormatDateJson(obj.value, 10) : ""),
        },
    ];

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="header col-md-12">
                    <div className="row">
                        <div className="col-md-2"></div>

                        <div className="headerlink col-md-4">
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item">
                                        <a href="#">Trang chủ</a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">
                                        Quản Lý Thông Tin
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        <div className="flex items-center gap-2 col-md-6">
                            <button
                                onClick={() => {
                                    VideAdd();
                                    ClearForm();
                                }}
                                type="button"
                                class="button btn btn-sm btn-primary float-right"
                            >
                                <i class="fa fa-plus pr-2"></i>
                                Thêm mới thông tin
                            </button>
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
                                        {StaffId === 0 ? "Thêm mới thông tin" : "Chỉnh sửa thông tin"}
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
                                <div class="card-body p-0">
                                    <div class="row">
                                        <div className="col-md-12 m-auto">
                                            <div class="form-group">
                                                <label className="no-absolute">
                                                    Nhân viên <span className="text-danger">(*)</span>
                                                </label>
                                                <SelectStaff
                                                    onSelected={e => setFromValue({ ...FromValue, StaffId: e.value, StaffName: e.label, ...e })}
                                                    onStaffId={FromValue?.StaffId}
                                                    className={'w-100 select-custom'}
                                                />
                                                {/* <Select
                                                    onChange={(e) => {
                                                        setFromValue({ ...FromValue, StaffCode: e.value, StaffName: e.label });
                                                    }}
                                                    placeholder=""
                                                    options={StaffMenu}
                                                    value={{ value: FromValue?.StaffCode, label: FromValue?.StaffName }}
                                                /> */}
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="no-absolute">
                                                Vui lòng nhập thông tin<span className="text-danger">(*)</span>
                                            </label>
                                            <MyEditor
                                                onChange={(e) => setProfile(e)}
                                                values={Profile}
                                                height={400}
                                                Folder="StaffProfile"
                                            />
                                        </div>
                                        <div class="col-sm-12 col-md-12 mt-2">
                                            <button
                                                onClick={() => {
                                                    ClearForm();
                                                    Cancel();
                                                }}
                                                type="button"
                                                class="btn btn-sm btn-danger pull-right margin-left-5"
                                            >
                                                <i class="fa fa-trash pr-2"></i>
                                                Hủy
                                            </button>

                                            <button
                                                type="button"
                                                class="btn btn-sm btn-success pull-right"
                                                onClick={Trl_spStaff_Save}
                                            >
                                                <i class="fa fa-edit pr-2"></i>
                                                {StaffId === 0 ? " Thêm mới" : "Chỉnh sửa"}
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
                </div>

                <div className="body col-md-12">
                    <div className="row">
                        <div className="col-md-2"></div>

                        <div className="bodytable col-md-10">
                            <DataTable data={Data} columns={columns} fixedColumns="true" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
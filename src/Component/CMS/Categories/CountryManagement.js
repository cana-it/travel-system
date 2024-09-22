import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { DataTable } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import { Alerterror, Alertsuccess, Alertwarning } from "../../../Utils";
import { confirmAlert } from "react-confirm-alert";
export const CountryManagement = () => {
    const CreateBy = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    useEffect((e) => {
        Trl_spCountry_List()
    }, []);
    const dispatch = useDispatch();
    const [FromValue, setFromValue] = useState({
        Id: 0,
        Name: "",
        IsDelete: 0
    });

    const [ListData, setListData] = useState([]);
    const ClearForm = () => {
        setFromValue({
            Id: 0,
            Name: "",
        });
    };

    //#region Save
    const Trl_spCountry_Save = async () => {
        
        try {
            const params = {
                Json: JSON.stringify({
                    Id: FromValue.Id,
                    Name: FromValue?.Name,
                    CreaterBy: CreateBy,
                    CreateName: CreateName
                }),
                func: "Trl_spCountry_Save",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                setIsOpen(false);
                Trl_spCountry_List();
                return;
            }
            if (result.Status === "NOTOK") {
                Alertwarning(result.ReturnMess);
                return;
            } else {
                ListData.map((e) => {
                    if (e.Id === FromValue.Id) {
                        e.Name = FromValue.Name;
                        e.IsDelete = FromValue.IsDelete;
                        e.CreaterBy = CreateBy;
                        e.CreateName = CreateName
                    }
                    return e;
                });
                setListData(ListData);
                Alertsuccess(result.ReturnMess);
                ClearForm();
            }
        } catch (error) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
        }
    };
    //#endregion

    //#region List
    const Trl_spCountry_List = async () => {
        try {
            setListData([]);
            const pr = {
                Id: 0
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spCountry_List",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setListData(result);
                return;
            }
            Alertwarning("Không có dữ liệu")
        } catch (err) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
        }
    };
    //#endregion

    //#region delete
    const Trl_spCountry_Delete = (item) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return <ConfirmAlertUi onClose={onClose} item={item} />;
            },
        });
    };
    const ConfirmAlertUi = (props) => {
        return (
            <div className="card-body border-left-red">
                <h3>Xác nhận xóa dữ liệu!</h3>
                <p>
                    Bạn có chắc chắn muốn xóa{" "}
                    <strong>{props.item._original.Name}</strong>{" "}
                </p>
                <button className="btn btn-small btn-warning" onClick={props.onClose}>
                    {" "}
                    <i className="fa fa-undo"> </i> Hủy
                </button>
                <button
                    className="btn btn-small btn-danger margin-left-5"
                    onClick={() => {
                        props.onClose();
                        Trl_spCountry_Delete_Action(props.item);
                    }}
                >
                    <i className="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    };
    const Trl_spCountry_Delete_Action = async (item) => {
        try {
            const pr = {
                Id: item._original.Id,
                IsDelete: 1,
            };

            const params = {
                Json: JSON.stringify(pr),
                func: " Trl_spCountry_Delete",
            };

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spCountry_List();
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
    //#endregion

    //#region edit
    const Trl_spSetting_Edit = (item, key) => {
        setIsOpen(true);
        let Data = item._original;
        setFromValue({
            Id: Data.Id,
            Name: Data.Name,
            EditBy: CreateBy,
            EditName: CreateName,
            IsDelete: Data.IsDelete ? 1 : 0
        });
    };
    //#endregion

    const columns = [
        {
            Header: "STT",
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 40,
            filterable: false,
            special: true,
            show: true,
            className: "text-center"
        },
        {
            Header: "Tùy chọn",
            Cell: ({ row }) => (
                <>
                    <button
                        type="button"
                        title="Sửa"
                        className="btn btn-secondary btn-sm m-1 btn-add"
                        onClick={(e) => Trl_spSetting_Edit(row)}
                    >
                        <i className="fa fa-edit"></i>
                    </button>
                    <button
                        type="button"
                        title="Xóa"
                        className="btn btn-danger btn-sm m-1 btn-add"
                        onClick={(e) => Trl_spCountry_Delete(row)}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </>
            ),
            width: 150,
            filterable: false,
            className: "text-center"
        },
        {
            Header: "Tên quốc gia",
            accessor: "Name",
            className: "text-center"
        },
        {
            Header: "Người tạo",
            accessor: "CreateName",
            className: "text-center"
        },
        {
            Header: "Người sửa",
            accessor: "EditName",
            className: "text-center"
        },
    ];
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
    return (
        <div className="content-wrapper">
            <div className="card">
                <div className="card-header">
                    <span className="HomeTitle">
                        Quản lý quốc gia
                    </span>
                    <div className="float-right">
                        <button
                            onClick={(e) => {
                                VideAdd();
                                ClearForm();
                            }}
                            type="button"
                            class="btn btn-sm btn-success pull-right margin-left-5"
                            style={{ marginTop: "-7px" }}
                        >
                            <i class="fa fa-plus pr-2"></i>
                            Thêm quốc gia
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="col-md-12 mb-3">
                        <DataTable data={ListData} columns={columns} fixedColumns="true" />
                    </div>
                </div>
            </div>

            {/* Module add */}
            <Modal
                show={modalIsOpen}
                onHide={closeModal}
                className=" custom-modal-w-90"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header className="p-2">
                    <Modal.Title id="example-custom-modal-styling-title">
                        <div className="">
                            {FromValue.Id === 0
                                ? "Thêm mới quốc gia"
                                : "Chỉnh sửa quốc gia"}
                        </div>
                    </Modal.Title>
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={closeModal}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className="card-body p-0">
                        <div className="row">
                            <div className="col-md-6 mt-2">
                                <div className="form-group">
                                    <label className="no-absolute custom-label">
                                        Tên quốc gia <span className="text-danger">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.Name}
                                        onChange={(e) =>
                                            setFromValue({
                                                ...FromValue,
                                                Name: e.target.value,
                                            })
                                        }
                                        placeholder="Ex: Việt Nam"
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12 mt-2">
                                <button
                                    onClick={() => {
                                        ClearForm();
                                    }}
                                    type="button"
                                    className="btn btn-sm btn-danger pull-right margin-left-5"
                                >
                                    <i className="fa fa-trash pr-2"></i>
                                    Clear form
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success pull-right"
                                    onClick={Trl_spCountry_Save}
                                >
                                    <i className="fa fa-save pr-2"></i>
                                    {FromValue.Id === 0 ? "Lưu" : "Chỉnh sửa"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
};
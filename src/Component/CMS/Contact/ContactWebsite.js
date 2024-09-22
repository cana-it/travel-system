import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { confirmAlert } from "react-confirm-alert";
import { DataTable } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import { Alerterror, Alertsuccess, Alertwarning, FirstOrLastDayinMonth, FormatDateJson } from "../../../Utils";
import "react-datetime-picker/dist/DateTimePicker.css";
import DateTimePicker from "react-datetime-picker";
import Select from "react-select";
import { useDispatch } from "react-redux";
export const ContactWebsite = () => {
    const [Disable2, setDisable2] = useState(true);
    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const [Data, setData] = useState([]);
    const CreateBy = localStorage.getItem("CreateBy");
    // Search
    const [Status, setStatus] = useState(0);
    const [valueType, setValueType] = useState({ value: 0, label: "Select" });
    const optionSelect = [
        { value: 0, label: "Select" },
        { value: 1, label: "Chưa xử lý" },
        { value: 2, label: "Đang xử lý" },
        { value: 3, label: "Đã xử lý" },
    ];
    const onTypeRecept = (item) => {
        setValueType(item);
        setStatus(item.value);
    };
    // End search

    // Edit
    const [StatusS, setStatusS] = useState(0);
    const [valueTypeS, setValueTypeS] = useState({ value: 0, label: "Select" });
    const optionSelectS = [
        { value: 0, label: "Select" },
        { value: 1, label: "Chưa xử lý" },
        { value: 2, label: "Đang xử lý" },
        { value: 3, label: "Đã xử lý" },
    ];
    const onTypeReceptS = (item) => {
        setValueTypeS(item);
        setStatusS(item.value);
    };
    // End Edit
    const [SearchValue, setSearchValue] = useState({
        FromDate: FirstOrLastDayinMonth(new Date(), 1),
        ToDate: new Date(),
    });
    useEffect(() => {
        CMS_spContact_List();
    }, []);

    const CMS_spContact_List = async () => {
        
        try {
            setData([]);
            setDisable2(false);
            const pr = {
                Id: 0,
                FromDate: SearchValue.FromDate,
                ToDate: SearchValue.ToDate,
                Status: Status,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "CMS_spContact_List",
            };
            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.length > 0) {
                setData(list);
                setDisable2(true);
                return;
            }
            Alertwarning("Không có dữ liệu");
            setDisable2(true);
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
            setDisable2(true);
        }
    };

    const [dataChange, setDataChange] = useState({
        Id: 1,
        Status: ""
    })
    const CMS_spContact_Save = async () => {
        try {
            const pr = {
                Id: dataChange.Id,
                Status: StatusS,
                Processing: CreateBy
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "CMS_spContact_Save",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                setIsOpen(false);
                CMS_spContact_List();
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

    const CMS_spContact_Edit = async (item) => {
        setIsOpen(true);
        try {
            let Data = item.row._original;
            setDataChange({
                Id: Data.Id,
            });
            setValueType({
                value: Data.StatusS, label: Data.TypesName
            })
        } catch (er) {
            Alerterror("Lỗi dữ liệu");
        }

    }

    const CMS_spContact_Delete = (item) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return <ConfirmAlertUi onClose={onClose} item={item} />;
            },
        });
    };

    const CMS_spContact_Delete_Action = async (item) => {
        try {
            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                Id: item._original.Id,
            };

            const params = {
                Json: JSON.stringify(pr),
                func: " CMS_spContact_Delete",
            };

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                CMS_spContact_List();
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
                    <strong>{props.item._original.MenuName}</strong>{" "}
                </p>
                <button className="btn btn-small btn-warning" onClick={props.onClose}>
                    {" "}
                    <i class="fa fa-undo"> </i> Hủy
                </button>
                <button
                    className="btn btn-small btn-danger margin-left-5"
                    onClick={() => {
                        props.onClose();
                        CMS_spContact_Delete_Action(props.item);
                    }}
                >
                    <i class="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    };

    const [modalIsOpen, setIsOpen] = useState(false);
    const closeModal = () => {
        setIsOpen(false);
    };
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
            accessor: "Edit",
            className: "text-center",
            Cell: ({ row }) => (
                <div>
                    <button
                        type="button"
                        title="Sửa"
                        className="btn btn-success btn-sm m-1 btn-add"
                        onClick={(e) => {
                            CMS_spContact_Edit({ row });
                        }}
                    >
                        <i className="fa fa-edit"></i>
                    </button>

                    <button
                        type="button"
                        title="Xóa"
                        className="btn btn-danger btn-sm m-1 btn-add"
                        onClick={(e) => CMS_spContact_Delete(row)}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            ),
        },
        {
            Header: "Trạng thái",
            accessor: "Status",
            Cell: ({ row }) => (
                <span>
                    {row._original.Status === 1 ? (
                        <span>
                            <button
                                type="button"
                                className="btn btn-sm bg-danger">
                                <i className="fas fa-exclamation pr-2"></i> Chưa xử lý
                            </button>
                        </span>
                    ) : (
                        ""
                    )}
                    {row._original.Status === 2 ? (
                        <span>
                            <button
                                type="button"
                                className="btn btn-sm bg-warning">
                                <i className="fas fa-spinner pr-2"></i> Đang xử lý
                            </button>
                        </span>
                    ) : (
                        ""
                    )}
                    {row._original.Status === 3 ? (
                        <span>
                            <button
                                type="button"
                                className="btn btn-sm bg-success">
                                <i className="fas fa-check pr-2"></i> Đã xử lý
                            </button>
                        </span>
                    ) : (
                        ""
                    )}
                </span>
            ),
            width: 200,
            className: "text-center"
        },
        {
            Header: "Tên tour",
            accessor: "NameTour",
            className: "text-center"
        },
        {
            Header: "Tên khách hàng",
            accessor: "Name",
            className: "text-center"
        },
        {
            Header: "Số điện thoại",
            accessor: "PhoneNumber",
            className: "text-center"
        },
        {
            Header: "Email",
            accessor: "Email",
            className: "text-center"
        },
        {
            Header: "Nội dung",
            accessor: "Content",
            className: "text-center"
        },
        {
            Header: "Ngày bắt đầu",
            accessor: "DataStart",
            className: "text-center",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
        {
            Header: "Nhân viên xử lý",
            accessor: "ProcessingName",
            className: "text-center"
        },
        {
            Header: "Thời gian xử lý",
            accessor: "ProcessingTimes",
            className: "text-center",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
    ];

    return (
        <div className="content-wrapper">
            <div className="card">
                <div className="card-header">
                    <span className="HomeTitle">
                        Quản lý đăng ký tour
                    </span>
                    <div className="float-right">
                        <button
                            onClick={CMS_spContact_List}
                            type="button"
                            disabled={!Disable2}
                            class="btn btn-sm btn-success pull-right margin-left-5"
                            style={{ marginTop: "-7px" }}
                        >
                            <i class="fas fa-search pr-2"></i>
                            Tìm kiếm
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div class="row" style={{ marginTop: "-15px" }}>
                        <div className="col-md-4">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">
                                    Từ ngày <span className="red">(*)</span>
                                </span>
                                <DateTimePicker
                                    className={"form-control2"}
                                    format="MM/dd/yyyy"
                                    value={SearchValue.FromDate}
                                    onChange={(e) => setSearchValue({ ...SearchValue, FromDate: e })}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">
                                    Từ ngày <span className="red">(*)</span>
                                </span>
                                <DateTimePicker
                                    className={"form-control2"}
                                    format="MM/dd/yyyy"
                                    value={SearchValue.ToDate}
                                    onChange={(e) => setSearchValue({ ...SearchValue, ToDate: e })}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">
                                    Trạng thái <span className="red">(*)</span>
                                </span>
                                <Select
                                    onChange={(e) => onTypeRecept(e)}
                                    value={valueType}
                                    options={optionSelect}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 mb-3">
                        <DataTable data={Data} columns={columns} fixedColumns="true" />
                    </div>
                </div>
            </div>
            <Modal
                show={modalIsOpen}
                onHide={closeModal}
                className=" custom-modal-w-75"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header className="p-2">
                    <Modal.Title id="example-custom-modal-styling-title">
                        <div class="">
                            Sửa trạng thái
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
                                    <span class="small font-weight-bold text-muted">
                                        Trạng thái
                                        <strong className="check-point">(*)</strong>
                                    </span>
                                    <Select
                                        onChange={(e) => onTypeReceptS(e)}
                                        value={valueTypeS}
                                        options={optionSelectS}
                                    />
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12 mt-2">
                                <button
                                    type="button"
                                    class="btn btn-sm btn-success pull-right"
                                    onClick={CMS_spContact_Save}
                                >
                                    <i class="fa fa-edit pr-2"></i>
                                    Chỉnh sửa
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alertwarning, Alertsuccess,
    Alerterror
} from '../../../../Utils';
import { DataTable, SelectService, SelectTourCode } from '../../../../Common';
import { confirmAlert } from 'react-confirm-alert'; // Import

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';


export const Service = () => {

    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const [TourCode, setTourCode] = useState({ value: 0, label: "" });
    const [tourCodeInput, setTourCodeInput] = useState('');
    const [tourCodeList, setTourCodeList] = useState([]);

    const VideAdd = () => {
        Cancel();
        openModal()
    }

    const Cancel = () => {
        setServiceId(0);
        setServiceCode("");
        setServiceName("");
        setNotes("");
        setTourCode({ value: 0, label: "" });

    }


    const [data, setData] = useState([])
    useEffect(() => {
        Trl_spService_List();
        Trl_spTourCode_List()
    }, [])

    const [TextSearch, setTextSearch] = useState("")
    const Trl_spService_List = async () => {
        try {

            const pr = {
                TextSearch: TextSearch,
                UserId: Creater,
                Type: 0
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spService_List"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            setData(list);
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }


    const [ServiceId, setServiceId] = useState(0)
    const [ServiceCode, setServiceCode] = useState("")
    const [ServiceName, setServiceName] = useState("")
    const [Notes, setNotes] = useState("");
    const [ParentId, setParentId] = useState(0);
    const [Type, setType] = useState(2);
    const Trl_spService_Save = async () => {

        try {
            if (ServiceCode === "") {
                Alertwarning("Nhập mã tour");
                return;
            }
            if (ServiceCode.length <= 0) {
                Alertwarning("Nhập mã tour > 0 kí tự");
                return;
            }
            if (ServiceName === "") {
                Alertwarning("Nhập tên tour");
                return;
            }
            if (ServiceName.length <= 0) {
                Alertwarning("Nhập tên tour > 0 kí tự");
                return;
            }
            if (Type === 1 && ParentId === 0) {
                Alertwarning("Nhập tên tour > 1 kí tự");
                return;
            }
            if (Type === 1 && TourCode.value === 0) {
                Alertwarning("Vui lòng chọn mã tour");
                return;
            }
            const pr = {
                ServiceId: ServiceId,
                ServiceCode: ServiceCode.trim(),
                ServiceName: ServiceName.trim(),
                Notes: Notes,
                Creater: Creater,
                CreateName: CreateName,
                Type: Type,
                ParentId: (Type === 2 ? 0 : ParentId),
                TourCode: Type === 1 ? TourCode.label : ''
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spService_Save"
            }

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Cancel();
                Trl_spService_List();
                setIsOpen(false); // close popup
                return;
            }
            if (result.Status === "NOTOK") {
                Alerterror(result.ReturnMess);
                return;
            }
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }

    const Trl_spService_View = (item) => {
        const obView = item._original;
        setServiceId(obView.ServiceId);
        setServiceCode(obView.ServiceCode);
        setServiceName(obView.ServiceName);
        setNotes(obView.Notes);
        setParentId(obView.ParentId);
        obView?.TourCodeId ? setTourCode({ value: +obView.TourCodeId, label: obView.TourCode })
            : setTourCode({ value: 0, label: '' });
        // open popup
        setIsOpen(true);
    }

    const Trl_spService_Delete = (item) => {

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ConfirmAlertUi onClose={onClose} item={item} />
                );
            }
        });
    }

    const Trl_spService_Delete_Action = async (item) => {
        try {
            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                ServiceId: item._original.ServiceId
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spService_Delete"
            }

            const result = await mainAction.API_spCallServer(params, dispatch)
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spService_List();
                return;
            }
            if (result.Status === "NOTOK") {
                Alerterror(result.ReturnMess);
                return;
            }
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }

    const ConfirmAlertUi = (props) => {
        return (
            <div className="card-body border-left-red">
                <h3>Xác nhận {props.item._original.IsDelete ? "Đóng" : "Mở"}  dữ liệu!</h3>
                <p>Bạn có chắc chắn muốn {props.item._original.IsDelete ? "Đóng" : "Mở"} <strong>{props.item._original.ServiceName}</strong> </p>
                <button className='btn btn-small btn-warning' onClick={props.onClose}> <i class="fa fa-undo"> </i> Hủy</button>
                <button className='btn btn-small btn-danger margin-left-5'
                    onClick={() => {
                        props.onClose();
                        Trl_spService_Delete_Action(props.item);
                    }}
                >
                    <i class="fa fa-trash"> </i> {props.item._original.IsDelete ? "Đóng" : "Mở"}
                </button>
            </div>
        );
    }

    const Trl_spTourCode_List = async () => {
        try {

            const pr = {
                Creater: +Creater,
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spTourCode_List"
            }

            const res = await mainAction.API_spCallServer(params, dispatch);
            let newRes = res.map((item, index) => {
                return {
                    ...item,
                    CreateTime: moment(item.CreateTime).format("DD/MM/YYYY HH:mm:ss"),
                }
            })
            setTourCodeList(newRes);
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }

    const Trl_spTourCode_Save = async () => {

        try {
            if (tourCodeInput === "") {
                Alertwarning("Nhập mã tour");
                return;
            }

            const pr = {
                TourCodeName: tourCodeInput.trim(),
                Creater: Creater,
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spTourCode_Save"
            }

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spTourCode_List();
                setTourCodeInput("");
                return;
            }

        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }

    const Trl_spTourCode_Delete = async (id) => {

        try {
            const pr = {
                TourCodeId: id,
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spTourCode_Delete"
            }

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spTourCode_List();
                return;
            }

        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }

    const columns = [
        {
            Header: 'Lựa chọn',
            accessor: 'Edit',
            Cell: ({ row }) => (
                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-xs btn-warning" onClick={e => Trl_spService_View(row)}> <i class="fa fa-eye"></i> Sửa</button> |
                    <button className={row._original.IsDelete ? "btn btn-xs btn-danger" : "btn btn-xs btn-success"} onClick={e => Trl_spService_Delete(row)}> <i class="fa fa-undo"></i> {row._original.IsDelete ? "Đóng" : "Mở"}</button>
                </div>
            ),
            width: 140,
            fixed: "left"
        },
        {
            Header: 'Mã thị trường',
            accessor: 'ServiceCode',
            fixed: "left",
            width: 160,
        }
        ,
        {
            Header: 'Trạng thái',
            accessor: 'Status',
            Cell: ({ row }) => (
                <span className={row._original.IsDelete === "A" ? "badge badge-success" : "badge badge-danger"}>{row._original.Status}</span>
            ),
            width: 120,
            fixed: "left"
        },
        // {
        //     Header: "Tên thị trường",
        //     accessor: "ServiceName",
        //     width: 220,
        //     fixed: "left"
        // },
        {
            Header: "Ghi chú",
            accessor: "Notes"
        },
        {
            Header: "Người tạo",
            accessor: "CreateName"
        },
        {
            Header: "Thời gian",
            accessor: "CreateTime"
        },
        {
            Header: "Người Sửa",
            accessor: "EditName"
        },
        {
            Header: "Thời gian sửa",
            accessor: "EditTime"
        }
    ];

    const columns1 = [
        {
            Header: 'Lựa chọn',
            accessor: 'Edit',
            Cell: ({ row }) => (
                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-xs btn-warning" onClick={e => Trl_spService_View(row)}> <i class="fa fa-eye"></i> Sửa</button> |
                    <button className={row._original.IsDelete ? "btn btn-xs btn-danger" : "btn btn-xs btn-success"} onClick={e => Trl_spService_Delete(row)}> <i class="fa fa-undo"></i> {row._original.IsDelete ? "Đóng" : "Mở"}</button>
                </div>
            ),
            width: 140,
            fixed: "left"
        },
        {
            Header: 'Mã tuyến điểm',
            accessor: 'ServiceCode',
            fixed: "left",
            width: 220,
        }
        ,
        {
            Header: 'Trạng thái',
            accessor: 'Status',
            Cell: ({ row }) => (
                <span className={row._original.IsDelete === "A" ? "badge badge-success" : "badge badge-danger"}>{row._original.Status}</span>
            ),
            width: 120,
            fixed: "left"
        },
        {
            Header: "Tên tuyến điểm",
            accessor: "ServiceName",
            width: 250,
            fixed: "left"
        },
        // {
        //     Header: "Tên thị trường",
        //     accessor: "ParentName",
        //     width: 250,
        // },
        {
            Header: "Ghi chú",
            accessor: "Notes"
        },
        {
            Header: "Người tạo",
            accessor: "CreateName"
        },
        {
            Header: "Thời gian",
            accessor: "CreateTime"
        },
        {
            Header: "Người Sửa",
            accessor: "EditName"
        },
        {
            Header: "Thời gian sửa",
            accessor: "EditTime"
        }
    ];

    const columnsTourCode = [
        {
            Header: 'No',
            Cell: (row) => <span>{row.index + 1}</span>,
            textAlign: "center",
            width: 40,

        }, {
            Header: 'Options',
            accessor: 'Edit',
            Cell: ({ row }) => (
                <div style={{ textAlign: 'center' }}>
                    <button
                        className="btn btn-xs btn-danger"
                        onClick={e => Trl_spTourCode_Delete(row._original.TourCodeId)}
                    > <i class="fa fa-trash pr-2"></i>Xóa</button>
                </div>
            ),
            width: 100,
        },
        {
            Header: "Mã tour",
            accessor: "TourCodeName",
            minWidth: 250,
        },
        {
            Header: "Người tạo",
            accessor: "CreaterName",
            width: 250,
        },
        {
            Header: "Thời gian",
            accessor: "CreateTime",
            width: 250,
        }

    ];

    const [modalIsOpen, setIsOpen] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    return (
        <>
        <div className="content-wrapper">
            <div class="card card-tabs">
                <div class="card-header border-left-red">
                    <div class="row">
                        <div class="col-sm-12 col-md-6 margin-top-5s" >
                            <ul class="nav nav-pills">
                                <li class="nav-item">
                                    <a
                                        style={{ padding: "4px 10px" }}
                                        class="nav-link active"
                                        href="#tab_1"
                                        data-toggle="tab"
                                        onClick={(e) => { setType(2) }}
                                    >
                                        THỊ TRƯỜNG ({data.filter(p => p.Type === 2).length})
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        style={{ padding: "4px 10px" }}
                                        class="nav-link"
                                        href="#tab_2"
                                        data-toggle="tab"
                                        onClick={(e) => { setType(1) }}
                                    >
                                        TUYẾN ĐIỂM ({data.filter(p => p.Type === 1).length})
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        style={{ padding: "4px 10px" }}
                                        class="nav-link"
                                        href="#tab_3"
                                        data-toggle="tab"
                                    >
                                        THÊM MÃ TOUR
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="col-sm-12 col-md-6 margin-top-5s">
                            <button onClick={VideAdd} type="button" class="btn btn-sm btn-success pull-right margin-left-5">
                                <i class="fa fa-plus pr-2"></i>
                                Thêm mới
                            </button>
                            <button onClick={Trl_spService_List} type="button" class="btn btn-sm btn-danger pull-right margin-left-5">
                                <i class="fa fa-search pr-2"></i>
                                Tìm kiếm
                            </button>
                            <div class="form-group pull-right" style={{ marginTop: '-4px' }}>
                                <div class="input-group" style={{ width: '100%' }}>
                                    <input type="text" maxLength="500" placeholder="SĐT,Email,Tên KH..." class="form-control" value={TextSearch} onChange={e => setTextSearch(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body border-left-red">
                    <div class="tab-content">
                        <div class="tab-pane active" id="tab_1">
                            <div class="row" >
                                <DataTable
                                    data={data.filter(p => p.Type === 2)}
                                    columns={columns}
                                    IsSearch={true}
                                    style={{ zIndex: 500 }}
                                />
                            </div>
                        </div>
                        <div class="tab-pane" id="tab_2">
                            <div class="row" >
                                <DataTable
                                    data={data.filter(p => p.Type === 1)}
                                    columns={columns1}
                                    IsSearch={true}
                                    style={{ zIndex: 500 }}
                                />
                            </div>
                        </div>

                        <div class="tab-pane" id="tab_3">
                            <div class="row" >
                                <div className="col-6 m-auto">
                                    <div class="form-group">
                                        <div class="input-group  d-flex">
                                            <input
                                                type="text"
                                                maxLength="50"
                                                class="form-control2 w-80 mr-3"
                                                value={tourCodeInput}
                                                onChange={e => setTourCodeInput(e.target.value)}
                                                placeholder="Nhập mã tour"
                                            />
                                            <button
                                                className="btn btn-success pull-right"
                                                onClick={Trl_spTourCode_Save}
                                            >
                                                <i class="fas fa-file-upload mr-1"></i>  Lưu
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <DataTable
                                        data={tourCodeList}
                                        columns={columnsTourCode}
                                        IsSearch={true}
                                        style={{ zIndex: 500 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={modalIsOpen}
                onHide={closeModal}
                className=' custom-modal-w-90'
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header>
                    <Modal.Title id="example-custom-modal-styling-title">
                        <div class="">
                            {ServiceId === 0 ? "Thêm mới dịch vụ" : "Chỉnh sửa thông tin"}
                            {Type === 1 ? " tuyến điểm: " : "  thị trường: "} {ServiceName}
                        </div>
                    </Modal.Title>
                    <button type="button" className="close" aria-label="Đóng" onClick={() => {
                        closeModal()
                    }}>
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
                                            <span class="input-group-text">{Type === 1 ? "Mã tuyến điểm" : "Mã thị trường"}(<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={ServiceCode} onChange={e => setServiceCode(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">{Type === 1 ? "Tên tuyến điểm" : "Tên thị trường"}(<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={ServiceName} onChange={e => setServiceName(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            {Type === 1 && <>
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Chọn thị trường(<strong className='check-point'>*</strong>)</span>
                                            </div>
                                            <SelectService
                                                type={2}
                                                key={"s3"}
                                                onSelected={(item) => { setParentId(item.value) }}
                                                items={ParentId}
                                                IsLoad={ParentId}
                                            ></SelectService>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Chọn mã tour(<strong className='check-point'>*</strong>)</span>
                                            </div>
                                            <SelectTourCode
                                                onSelected={(item) => { setTourCode(item) }}
                                                TourCodeId={TourCode.value}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                            }
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Ghi chú</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={Notes} onChange={e => setNotes(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-12">
                                <button onClick={e => setIsOpen(false)} type="button" class="btn btn-sm btn-default pull-right margin-left-5">
                                    <i class="fa fa-undo pr-2"></i>
                                    Đóng
                                </button>
                                <button onClick={Cancel} type="button" class="btn btn-sm btn-warning pull-right margin-left-5">
                                    <i class="fa fa-trash pr-2"></i>
                                    Hủy
                                </button>

                                <button type="button" class="btn btn-sm btn-danger pull-right" onClick={(e) => { Trl_spService_Save() }}>
                                    <i class="fa fa-edit pr-2"></i>
                                    {ServiceId === 0 ? " Thêm mới" : "Chỉnh sửa"}
                                </button>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <h5 style={{ color: 'red' }}>Ghi chú: các ô có dấu sao màu đỏ là bắt buộc nhập</h5>
                                </div>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
        </>
    )
}

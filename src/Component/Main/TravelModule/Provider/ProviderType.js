import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alertwarning, Alertsuccess,
    Alerterror, FormatDateJson,
    ConvertUTCDateToLocalDate,
    CheckTypeFile
} from '../../../../Utils';
import { DataTable, SelectBranch, SelectProviderTypeType } from '../../../../Common';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import { IMAGES_DOMAIN } from '../../../../Services'
//import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert'; // Import

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery'


export const ProviderType = () => {

    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const VideAdd = () => {

        openModal()
    }

    const Cancel = () => {
        setProviderTypeId(0);
        setProviderTypeCode("");
        setProviderTypeName("");
        setNotes("");
    }


    const [data, setData] = useState([])
    useEffect(() => {
        Trl_spProviderType_List();
    }, [])

    const [ProviderTypeSearch, setProviderTypeSearch] = useState("")
    const Trl_spProviderType_List = async () => {

        try {

            const pr = {
                ProviderTypeId: 0,
                ProviderTypeSearch: ProviderTypeSearch,
                Creater: Creater,
                CreateName: CreateName
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spProviderType_List"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            setData(list);
            
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
            
        }
    }

    const [ProviderTypeId, setProviderTypeId] = useState(0)
    const [ProviderTypeCode, setProviderTypeCode] = useState("")
    const [ProviderTypeName, setProviderTypeName] = useState("")
    const [Notes, setNotes] = useState("")
    const Trl_spProviderType_Save = async () => {

        try {
            if (ProviderTypeCode === "") {
                Alertwarning("Nhập mã khách hàng");
                return;
            }

            if (ProviderTypeCode.length <= 4) {
                Alertwarning("Nhập mã khách hàng > 4 kí tự");
                return;
            }
            if (ProviderTypeName === "") {
                Alertwarning("Nhập tên khách hàng");
                return;
            }
            if (ProviderTypeName.length <= 5) {
                Alertwarning("Nhập tên khách hàng > 5 kí tự");
                return;
            }

            const pr = {
                ProviderTypeId: ProviderTypeId,
                ProviderTypeCode: ProviderTypeCode.trim(),
                ProviderTypeName: ProviderTypeName.trim(),
                Notes: Notes,
                Creater: Creater,
                CreateName: CreateName
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spProviderType_Save"
            }

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Cancel();
                Trl_spProviderType_List();
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

    const Trl_spProviderType_View = (item) => {
        
        const obView = item._original;
        setProviderTypeId(obView.ProviderTypeId);
        setProviderTypeCode(obView.ProviderTypeCode);
        setProviderTypeName(obView.ProviderTypeName);
        setNotes(obView.Notes);
        // open popup
        setIsOpen(true);
    }

    const Trl_spProviderType_Delete = (item) => {

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ConfirmAlertUi onClose={onClose} item={item} />
                );
            }
        });


    }

    const Trl_spProviderType_Delete_Action = async (item) => {
        try {
            
            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                ProviderTypeId: item._original.ProviderTypeId
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spProviderType_Delete"
            }

            const result = await mainAction.API_spCallServer(params, dispatch)
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spProviderType_List();
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
                <h3>Xác nhận xóa dữ liệu!</h3>
                <p>Bạn có chắc chắn muốn xóa <strong>{props.item._original.ProviderTypeName}</strong> </p>
                <button className='btn btn-small btn-warning' onClick={props.onClose}> <i class="fa fa-undo"> </i> Hủy</button>
                <button className='btn btn-small btn-danger margin-left-5'
                    onClick={() => {
                        props.onClose();
                        Trl_spProviderType_Delete_Action(props.item);
                    }}
                >
                    <i class="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    }


    const columns = [
        {
            Header: 'Lựa chọn',
            accessor: 'Edit',
            Cell: ({ row }) => (
                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-sm btn-success" onClick={e => Trl_spProviderType_View(row)}> <i class="fa fa-eye"></i> Sửa</button> |
                    <button className="btn btn-sm btn-danger" onClick={e => Trl_spProviderType_Delete(row)}> <i class="fa fa-trash"></i> Xóa</button>
                </div>
            ),
            width: 200,
            fixed: "left"
        },
        {
            Header: 'Mã loại KH',
            accessor: 'ProviderTypeCode',
            fixed: "left"
        },
        {
            Header: "Tên loại KH",
            accessor: "ProviderTypeName",
            width: 250,
            fixed: "left"
        }
        ,
        {
            Header: "Tổng số NCC",
            accessor: "TotalProvider",
            width: 250,
            fixed: "left"
        },
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
            <div class="card-header border-left-red">
                <div class="row">
                    <div class="col-sm-12 col-md-6" >
                        <h3 class="card-title font-weight-bold">Loại nhà cung cấp({data.length})</h3>
                    </div>
                    <div class="col-sm-12 col-md-6 margin-top-5s">
                        <button onClick={VideAdd} type="button" class="btn btn-sm btn-success pull-right margin-left-5">
                            <i class="fa fa-plus pr-2"></i>
                            Thêm mới
                        </button>
                        <button onClick={Trl_spProviderType_List} type="button" class="btn btn-sm btn-danger pull-right margin-left-5">
                            <i class="fa fa-search pr-2"></i>
                            Tìm kiếm
                        </button>
                        <div class="form-group pull-right" style={{ marginTop: '-4px' }}>
                            <div class="input-group" style={{ width: '100%' }}>
                                <input type="text" maxLength="500" placeholder="SĐT,Email,Tên KH..." class="form-control" value={ProviderTypeSearch} onChange={e => setProviderTypeSearch(e.target.value)} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="card-body border-left-red">

                <div class="row" >
                    <DataTable
                        data={data}
                        columns={columns}
                        IsSearch={true}
                        style={{ zIndex: 500 }}
                    />
                </div>
            </div>

            <Modal
                show={modalIsOpen}
                onHide={closeModal}
                className=' custom-modal-w-90'
                aria-labelledby="example-custom-modal-styling-title"
            >

                <Modal.Header closeButton >

                    <Modal.Title id="example-custom-modal-styling-title">
                        <div class="">
                            {ProviderTypeId === 0 ? "Thêm mới loại NCC" : "Chỉnh sửa thông tin loại NCC " + ProviderTypeName}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="card-body">

                        <div class="row">
                            <div class="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Mã loại NCC(<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={ProviderTypeCode} onChange={e => setProviderTypeCode(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Tên loại NCC(<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={ProviderTypeName} onChange={e => setProviderTypeName(e.target.value)} />
                                    </div>
                                </div>
                            </div>

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

                                <button type="button" class="btn btn-sm btn-danger pull-right" onClick={Trl_spProviderType_Save}>
                                    <i class="fa fa-edit pr-2"></i>
                                    {ProviderTypeId === 0 ? " Thêm mới" : "Chỉnh sửa"}
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

const customStyles = {
    content: {
        top: '25%',
        left: '55%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        zIndex: '4'
    }
};
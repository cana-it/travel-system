import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alertwarning, Alertsuccess,
    Alerterror, FormatDateJson,
    ConvertUTCDateToLocalDate,
    CheckTypeFile
} from '../../../../Utils';
import { DataTable, SelectBranch, SelectProvider } from '../../../../Common';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import { IMAGES_DOMAIN } from '../../../../Services'
//import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert'; // Import

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery'
import {ServiceLandTourForm} from './ServiceLandTourForm'


export const ServiceLandTour = () => {

    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const VideAdd = () => {

        openModal()
        const obnull = {
        }
        setOnItem(obnull);
    }

    const [onItem, setOnItem] = useState({})
    const [data, setData] = useState([])
    useEffect(() => {
        Trl_spServiceLandTour_List();
    }, [])

    const [ProviderId_List, setProviderId_List] = useState(0)
    const [LandTourId_List, setLandTourId_List] = useState(0)
    const [LandTourSearch, setLandTourSearch] = useState("")
    
    const Trl_spServiceLandTour_List = async () => {

        try {

            const pr = {
                LandTourId: LandTourId_List,
                LandTourSearch: LandTourSearch,
                ProviderId: ProviderId_List,
                Creater: Creater,
                CreateName: CreateName
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spServiceLandTour_List"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            setData(list);
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }


    const Trl_spServiceLandTour_Delete = (item) => {

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ConfirmAlertUi onClose={onClose} item={item} />
                );
            }
        });


    }

    const Trl_spServiceLandTour_Delete_Action = async (item) => {
        try {
            
            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                LandTourId: item._original.LandTourId
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spServiceLandTour_Delete"
            }

            const result = await mainAction.API_spCallServer(params, dispatch)
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spServiceLandTour_List();
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
                <p>Bạn có chắc chắn muốn xóa <strong>{props.item._original.LandTourName}</strong> </p>
                <button className='btn btn-small btn-warning' onClick={props.onClose}> <i class="fa fa-undo"> </i> Hủy</button>
                <button className='btn btn-small btn-danger margin-left-5'
                    onClick={() => {
                        props.onClose();
                        Trl_spServiceLandTour_Delete_Action(props.item);
                    }}
                >
                    <i class="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    }

    const Trl_spServiceLandTour_View = (row) => {
        setIsOpen(true);
        setOnItem(row._original)
    }

    const columns = [
        {
            Header: 'Lựa chọn',
            accessor: 'Edit',
            Cell: ({ row }) => (
                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-sm btn-success" onClick={e => Trl_spServiceLandTour_View(row)}> <i class="fa fa-eye"></i> Sửa</button> |
                    <button className="btn btn-sm btn-danger" onClick={e => Trl_spServiceLandTour_Delete(row)}> <i class="fa fa-trash"></i> Xóa</button>
                </div>
            ),
            width: 200,
            fixed: "left"
        },
        {
            Header: 'Mã LandTour',
            accessor: 'LandTourCode',
            fixed: "left"
        },
        {
            Header: "Tên LandTour",
            accessor: "LandTourName",
            width: 250,
            fixed: "left"
        },
        {
            Header: "NCC",
            accessor: "ProviderName",
            with: 100
        }
        ,
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
                        <h3 class="card-title font-weight-bold">Danh sách LandTour({data.length})</h3>
                    </div>
                    <div class="col-sm-12 col-md-6 margin-top-5s">
                        <button onClick={VideAdd} type="button" class="btn btn-sm btn-success pull-right margin-left-5">
                            <i class="fa fa-plus pr-2"></i>
                            Thêm mới
                        </button>
                        <button onClick={Trl_spServiceLandTour_List} type="button" class="btn btn-sm btn-danger pull-right margin-left-5">
                            <i class="fa fa-search pr-2"></i>
                            Tìm kiếm
                        </button>
                        <div class="form-group pull-right" style={{ marginTop: '-4px' }}>
                            <div class="input-group" style={{ width: '100%' }}>
                                <input type="text" maxLength="500" placeholder="SĐT,Email,Tên KH..." class="form-control" value={LandTourSearch} onChange={e => setLandTourSearch(e.target.value)} />
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
                className='custom-modal-w-90'
                aria-labelledby="example-custom-modal-styling-title"
            >
               
            <ServiceLandTourForm 
              onItem={onItem}  
            
            />


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
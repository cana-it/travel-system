import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alerterror, FormatDateJson,
} from '../../../../Utils';
import { DataTable } from '../../../../Common';
import { IMAGES_DOMAIN } from '../../../../Services'
//import Modal from 'react-modal';
import { useLocation } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';

export const StaffInfor = () => {

    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const DepartmentId = localStorage.getItem("Dpid");
    const [data, setData] = useState([])
    let prm = useLocation()
    useEffect(() => {
        Trl_spStaff_List();

    }, [DepartmentId,prm])

    //#region DANH SÁCH
    const Trl_spStaff_List = async () => {
        try {
            const pr = {

                DepartmentId: DepartmentId,
                BranchId: 0,
                StaffSearch: "",
                StaffId: 0,
                Creater: Creater
            }
            if(DepartmentId === "0") return

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spStaff_List"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            setData(list);
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }
    const [infor,setinfor] = useState({});

    const Trl_spStaff_View = (row) => {
        setinfor(row);
        Trl_spLeave_List(row?.StaffId || 0)
    }
    //#endregion

    const [modalIsOpen, setIsOpen] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }
    const [dataLeave,setdataLeave] = useState([])
    const Trl_spLeave_List = async (StaffId) => {
        try {
            const pr = {
                BranchId: 0,
                DepartId: DepartmentId,
                FromDate: '1/1/1990',
                Todate: '1/1/1990',
                CheckDate:'B',
                StaffId:StaffId,
                Creater: Creater,
                CreateName: CreateName
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spLeave_List"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            setdataLeave(list);
            openModal();
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }
    const columns = [
        {
            Header: "Ngày đăng kí",
            accessor: "TimeLeave",
            Cell: (obj) => FormatDateJson(obj.value, 4),
            width: 150
        },
        {
            Header: "Loại",
            accessor: "TypeLeaveName",
            width: 150
        },
        {
            Header: "Trạng thái",
            accessor: "StatusApprove",
            width: 150
        },
        {
            Header: "Lý do",
            accessor: "Reason",
            width: 100
        },
        {
            Header: "Ghi chú",
            accessor: "Note",
            width: 100
        },

        {
            Header: "Files",
            accessor: "Files",
            with: 300,
            Cell: ({ row }) => { //spread the props
                const fls = row._original?.Files?.split(",").filter(e => e !== "");
                return fls.map((fn, id) => {
                    //let keyc = CheckTypeFile(fn);
                    const splitfn = fls[id].split("/");
                    const fname = splitfn[splitfn.length - 1];
                    return (
                        <a href={IMAGES_DOMAIN + fn} target='_blank' style={{ float: 'left', marginleft: '5px' }} >
                            {fname}
                        </a>
                    )
                })

            }
        },
        {
            Header: "Ngày tạo",
            accessor: "CreateTime",
            Cell: (obj) => FormatDateJson(obj.value),
        },
        {
            Header: "Ngày chỉnh sửa",
            accessor: "EditTime",
            Cell: (obj) => FormatDateJson(obj.value),
        },
        {
            Header: "Người xác nhận",
            accessor: "ConfirmName"
        },
        {
            Header: "Thời.gian xác nhận",
            accessor: "ConfirmTime",
            Cell: (obj) => FormatDateJson(obj.value),
        }
    ];

    return (
        <>
        <div className="content-wrapper">
            <div class="card-header border-left-red">
                <div class="row">
                    <div class="col-sm-12 col-md-3" >
                        <h3 class="card-title font-weight-bold">Thông tin nhân sự</h3>
                    </div>
                    <div class="col-sm-12 col-md-9 margin-top-5s">

                    </div>
                </div>
            </div>

            <div class="card-body border-left-red">
                <div className="row text-center">
                    {
                        data?.filter(p => p.PositionId !== 11 && p.PositionId !== 12).map((item, index) => {
                            return (
                                <div onClick={e => Trl_spStaff_View(item)} class="card card-primary card-outline cardstaff" key={"staft" + index} style={{ marginLeft: data.length === 1 ? "45%" : "40%", width: data.length === 1 ? "15%" : "20%" }}>
                                    <div class="card-body box-profile">
                                        <div class="text-center">
                                            <img  class="profile-user-img img-fluid img-circle" src={IMAGES_DOMAIN + item.Avatar} alt={item?.StaffName || ""} style={{width:'100px', height:'100px'}}/>
                                        </div>
                                        <h3 class="profile-username text-center">{item?.StaffName}</h3>
                                        <p class="text-muted text-center">{item?.PositionName}</p>
                                    </div>
                                </div>
                            )

                        })
                    }
                </div>
                <div class="row margin-top-10">
                    {
                        data?.filter(p => p.PositionId === 11 || p.PositionId === 12).map((item, index) => {
                            return (
                                <div className='col-md-3 col-sm-12' onClick={e => Trl_spStaff_View(item)} >
                                    <div class="card card-primary card-outline cardstaff" key={"staft" + index}>
                                        <div class="card-body box-profile">
                                            <div class="text-center">
                                                <img  class="profile-user-img img-fluid img-circle" src={IMAGES_DOMAIN + item.Avatar} alt={item?.StaffName || ""}  style={{width:'100px', height:'100px'}}/>
                                            </div>
                                            <h3 class="profile-username text-center">{item?.StaffName}</h3>
                                            <p class="text-muted text-center">{item?.PositionName}</p>
                                        </div>
                                    </div>
                                </div>
                            )

                        })
                    }
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
                            Thông tin nhân sự : {infor?.StaffName || ""}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="card m-1 card-shadow shadow">
                        <div class="card-body pt-3">

                            <div className="row booking">
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">Mã nhân viên : {infor?.StaffCode || ""}</span>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">Tên nhân viên : {infor?.StaffName || ""}</span>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">Điện thoại : {infor?.Phone || ""}</span>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">Địa chỉ: {infor?.Address || ""}</span>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">Email : {infor?.Email || ""}</span>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">Giới tính : {infor?.Sex || ""}</span>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">Ngày sinh : {FormatDateJson(infor?.Brithday ? infor?.Brithday : null,3)}</span>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">Ngày làm việc : {FormatDateJson(infor?.Timestartwork ? infor?.Timestartwork : null,3)}</span>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">CCCD: {infor?.IdentityCode}</span>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">Chi nhánh : {infor?.BranchName}</span>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">Phòng ban: {infor?.DepartmentName}</span>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">Chức vụ : {infor?.PositionName || ""}</span>
                                    </div>
                                </div>
                               
                            </div>

                        </div>
                        <div className="card-body pt-3">
                            <h4>Lịch sử nghỉ phép</h4>
                            <div className="row">
                            <DataTable
                                data={dataLeave}
                                columns={columns}
                                IsSearch={true}
                                style={{ zIndex: 500 }}
                            />
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
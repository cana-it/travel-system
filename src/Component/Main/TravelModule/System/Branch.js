import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import { Alertwarning, Alertsuccess, Alerterror, FormatDateJson } from '../../../../Utils';
import { SelectOfficer, DataTable } from '../../../../Common';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';


export const Branch = () => {
    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const navigate = useNavigate();
    const [BranchId, setBranchId] = useState(0);
    const [BranchCode, setBranchCode] = useState("");
    const [BranchName, setBranchName] = useState("");
    const [BranchPhone, setBranchPhone] = useState("");
    const [BranchAddress, setBranchAddress] = useState("");
    const [Author, setAuthor] = useState("");
    const [Notes, setNotes] = useState("");
    const [data, setData] = useState([]);

    useEffect(() => {
        Trl_spBranch_List();
    }, [])
    const [modalIsOpen, setIsOpen] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }


    //#region thêm
    const VideAdd = () => {
        setBranchId(0);
        setBranchCode("");
        setBranchName("");
        setBranchPhone("");
        setBranchAddress("");
        setAuthor("");
        setNotes("");
        openModal()
    }
    const Trl_spBranch_Save = async () => {

        try {

            if (BranchCode === "") {
                Alertwarning("Nhập mã chi nhánh");
                return;
            }

            if (BranchCode.length <= 4) {
                Alertwarning("Nhập mã chi nhánh > 4 kí tự");
                return;
            }
            if (BranchName === "") {
                Alertwarning("Nhập tên chi nhánh");
                return;
            }
            if (BranchName.length <= 10) {
                Alertwarning("Nhập tên chi nhánh > 10 kí tự");
                return;
            }

            const pr = {
                BranchId: BranchId,
                BranchCode: BranchCode,
                BranchName: BranchName,
                BranchPhone: BranchPhone,
                BranchAddress: BranchAddress,
                Author: Author,
                Notes: Notes,
                Creater: Creater,
                CreateName: CreateName
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spBranch_Save"
            }

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spBranch_List();
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
    //#endregion

    //#region sửa
    const Trl_spBranch_View = (item) => {
        const obView = item._original;
        setBranchId(obView.BranchId);
        setBranchCode(obView.BranchCode);
        setBranchName(obView.BranchName);
        setBranchPhone(obView.BranchPhone);
        setBranchAddress(obView.BranchAddress);
        setAuthor(obView.Author);
        setNotes(obView.Notes);

        // open popup
        setIsOpen(true);
    }
    //#endregion

    //#region danh sách
    const Trl_spBranch_List = async () => {

        try {

            const pr = {
                Creater: Creater,
                BranchId: -1
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spBranch_List"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            setData(list);
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

                    <button className="btn btn-xs btn-success" onClick={e => Trl_spBranch_View(row)}> <i class="fa fa-edit"></i> Sửa</button> |
                    <button className="btn btn-xs btn-danger pr-2" onClick={e => Trl_spBranch_Delete(row)}> <i class="fa fa-trash"></i> Xóa</button> |
                    <button className="btn btn-xs btn-info pr-2" onClick={e => Trl_spBranch_Detail(row)}> <i class="fa fa-eye"></i> Chi tiết</button>

                </div>
            ),
            width: 220,
            fixed: "left"
        },
        {
            Header: 'Mã chi nhánh',
            accessor: 'BranchCode',
            fixed: "left",
            width: 130,
        },
        {
            Header: "Tên chi nhánh",
            accessor: "BranchName",
            width: 200,
            fixed: "left"
        },

        {
            Header: "Số Phòng ban",
            accessor: "TotalDepartment",
            width: 130
        },
        {
            Header: "SĐT",
            accessor: "BranchPhone",
            width: 120
        },
        {
            Header: "Địa chỉ",
            accessor: "BranchAddress",
            width: 250
        },
        {
            Header: "Người đại diện",
            accessor: "Author",
            width: 100
        }
        ,

        {
            Header: "Người tạo",
            accessor: "Creater"
        },
        {
            Header: "Thời gian",
            accessor: "CreateTime",
            Cell: (obj) => FormatDateJson(obj.value),
        },
        {
            Header: "Người Sửa",
            accessor: "Editer"
        },
        {
            Header: "Thời gian sửa",
            accessor: "EditTime",
            Cell: (obj) => FormatDateJson(obj.value),
        }
    ];

    //#endregion

    //#region chi tiết
    const Trl_spBranch_Detail = (item) => {
        navigate("/he-thong/phong-ban?id=5&&BrandId=" + item._original.BranchId);
    }

    //#endregion

    //#region xóa
    const Trl_spBranch_Delete = (item) => {

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ConfirmAlertUi onClose={onClose} item={item} />
                );
            }
        });
    }

    const Trl_spBranch_Delete_Action = async (item) => {
        try {
            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                BranchId: item._original.BranchId
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spBranch_Delete"
            }

            const result = await mainAction.API_spCallServer(params, dispatch)
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spBranch_List();
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
                <p>Bạn có chắc chắn muốn xóa <strong>{props.item._original.BranchName}</strong> </p>
                <button className='btn btn-small btn-warning' onClick={props.onClose}> <i class="fa fa-undo"> </i> Hủy</button>
                <button className='btn btn-small btn-danger margin-left-5'
                    onClick={() => {
                        props.onClose();
                        Trl_spBranch_Delete_Action(props.item);
                    }}
                >
                    <i class="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    }
    //#endregion


    return (
        <>
        <div className="content-wrapper">
            <div class="card-header border-left-red">
                <div class="row">
                    <div class="col-sm-12 col-md-6" >
                        <h3 class="card-title font-weight-bold">Chi nhánh ({data.length})</h3>
                    </div>
                    <div class="col-sm-12 col-md-6 margin-top-5s">
                        <button onClick={Trl_spBranch_List} type="button" class="btn btn-sm btn-danger pull-right margin-left-5">
                            <i class="fa fa-search pr-2"></i>
                            Tìm kiếm
                        </button>
                        <button onClick={VideAdd} type="button" class="btn btn-sm btn-success pull-right">
                            <i class="fa fa-plus pr-2"></i>
                            Thêm mới
                        </button>
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
                            Thêm mới chi nhánh
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="card-body">

                        <div class="row">
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Mã chi nhánh(<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={BranchCode} onChange={e => setBranchCode(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Tên chi nhánh(<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={BranchName} onChange={e => setBranchName(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">SĐT</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={BranchPhone} onChange={e => setBranchPhone(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-8">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Địa chỉ</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={BranchAddress} onChange={e => setBranchAddress(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Người đại diện</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={Author} onChange={e => setAuthor(e.target.value)} />
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
                            <div class="col-sm-12 col-md-6">
                                <button onClick={closeModal} type="button" class="btn btn-sm btn-default pull-right margin-left-5">
                                    <i class="fa fa-undo pr-2"></i>
                                    Hủy
                                </button>

                                <button type="button" class="btn btn-sm btn-danger pull-right" onClick={Trl_spBranch_Save}>
                                    <i class="fa fa-edit pr-2"></i>
                                    Lưu & đóng
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
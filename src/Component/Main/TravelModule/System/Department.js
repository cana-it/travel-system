import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alertwarning, Alertsuccess,
    Alerterror, FormatDateJson,
    ConvertUTCDateToLocalDate,
    CheckTypeFile
} from '../../../../Utils';
import { DataTable, SelectBranch, SelectDepartmentType, SelectStaff } from '../../../../Common';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';
import { IMAGES_DOMAIN } from '../../../../Services'
import { useLocation, useNavigate } from 'react-router-dom';

export const Department = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const location = useLocation();
    const [data, setData] = useState([])
    const [DepartmentSearch, setDepartmentSearch] = useState("")
    const [BranchIdSearch, setBranchIdSearch] = useState(0);
    const [BranchId, setBranchId] = useState(0);
    const [DepartmentId, setDepartmentId] = useState(0)
    const [DepartmentCode, setDepartmentCode] = useState("")
    const [DepartmentName, setDepartmentName] = useState("")
    const [Notes, setNotes] = useState("")

    useEffect(async () => {
        const pr = new URLSearchParams(location.search);
        if (pr.get("BrandId") !== null) {
            setBranchIdSearch(parseInt(pr.get("BrandId")));
            Trl_spDepartment_List(pr.get("BrandId"), 1);
        }
        else {
            Trl_spDepartment_List(0, 0);
        }
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
        openModal()
    }

    const Cancel = () => {
        setDepartmentId(0);
        setDepartmentCode("");
        setDepartmentName("");
        setBranchId(0);
        setNotes("");
    }
    const [StaffId, setStaffId] = useState(0)
    const [Routermap, setRoutermap] = useState("")
    const Trl_spDepartment_Save = async () => {

        try {
            if (DepartmentCode === "") {
                Alertwarning("Nhập mã Phòng ban");
                return;
            }

            if (DepartmentCode !== undefined && DepartmentCode.length <= 4) {
                Alertwarning("Nhập mã Phòng ban > 4 kí tự");
                return;
            }
            if (DepartmentName === "") {
                Alertwarning("Nhập tên Phòng ban");
                return;
            }
            if (DepartmentName !== undefined && DepartmentName.length <= 5) {
                Alertwarning("Nhập tên Phòng ban > 5 kí tự");
                return;
            }
            if (BranchId === 0) {
                Alertwarning("Chọn chi nhánh");
                return;
            }
            if (StaffId === 0) {
                Alertwarning("Chọn nhân viên quản lí");
                return;
            }

            let avt = "";
            if (FileUpload !== "" && FileUpload.name !== undefined) {
                const formData = new FormData();
                formData.append("myFile", FileUpload);
                formData.append("Key", "RouteMapDepartment");
                const data = await mainAction.API_spCallPostFile(formData, dispatch);
                let _imgavt = data.Message.replaceAll('"', '')
                avt = _imgavt.replace("[", "").replace("]", "");
            }

            const pr = {
                DepartmentId: DepartmentId,
                DepartmentCode: DepartmentCode.trim(),
                DepartmentName: DepartmentName.trim(),
                BranchId: BranchId,
                StaffId: StaffId,
                Notes: Notes,
                Routermap: avt,
                Creater: Creater,
                CreateName: CreateName
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spDepartment_Save"
            }

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Cancel();
                Trl_spDepartment_List(0, 0);
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


    //#region  Danh sách
    const Trl_spDepartment_List = async (brid, Keys) => {
        try {
            const pr = {
                DepartmentId: 0,
                DepartmentSearch: DepartmentSearch,
                BranchId: 0,
                Creater: Creater,
                CreateName: CreateName
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spDepartment_List"
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
                    <button className="btn btn-xs btn-success" onClick={e => Trl_spDepartment_View(row)}> <i class="fa fa-edit"></i> Xem</button>
                    {/* <button className="btn btn-xs btn-danger pr-2" onClick={e => Trl_spDepartment_Delete(row)}> <i class="fa fa-trash"></i> Xóa</button> */}
                    {/* <button className="btn btn-xs btn-info pr-2" onClick={e => Trl_spDepartment_Detail(row)}> <i class="fa fa-eye"></i> Chi tiết</button> */}
                </div>
            ),
            width: 230,
            fixed: "left"
        },
        {
            Header: 'Mã phòng ban',
            accessor: 'DepartmentCode',
            width: 140,
            fixed: "left"
        },
        {
            Header: "Tên phòng ban",
            accessor: "DepartmentName",
            width: 160,
            fixed: "left"
        },
        {
            Header: "Sơ đồ",
            accessor: "Routermap",
            Cell: obj => (
                <div className="direct-chat-msg">
                    <img className="direct-chat-img" src={IMAGES_DOMAIN + obj.value} alt="message user image" />
                </div>
            ),
            width: 80,
            fixed: "left"
        },
        {
            Header: 'Chi nhánh',
            accessor: 'BranchName',
            fixed: "left",
            width: 180,
        },
        {
            Header: "Số nhân viên",
            accessor: "TotalStaff",
            width: 160,

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
            accessor: "CreateTime",
            Cell: (obj) => FormatDateJson(obj.value),
        },
        {
            Header: "Người Sửa",
            accessor: "EditName"
        },
        {
            Header: "Thời gian sửa",
            accessor: "EditTime",
            Cell: (obj) => FormatDateJson(obj.value),
        }
    ];

    //#endregion

    //#region sửa
    const Trl_spDepartment_View = (item) => {
        const obView = item._original;
        setDepartmentId(obView.DepartmentId);
        setDepartmentCode(obView.DepartmentCode);
        setDepartmentName(obView.DepartmentName);
        setNotes(obView.Notes);
        setBranchId(obView.BranchId);
        setStaffId(obView.StaffId);
        // open popup
        setIsOpen(true);
    }
    //#endregion

    //#region  chi tiết
    const Trl_spDepartment_Detail = (item) => {
        const obView = item._original;
        navigate("/he-thong/nhan-vien?id=6&&BrandId=" + item._original.BranchId + "&&DepartmentId=" + item._original.DepartmentId);
    }
    //#endregion

    //#region xóa
    const Trl_spDepartment_Delete = (item) => {

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ConfirmAlertUi onClose={onClose} item={item} />
                );
            }
        });


    }

    const Trl_spDepartment_Delete_Action = async (item) => {
        try {
            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                DepartmentId: item._original.DepartmentId
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spDepartment_Delete"
            }

            const result = await mainAction.API_spCallServer(params, dispatch)
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spDepartment_List();
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
                <p>Bạn có chắc chắn muốn xóa <strong>{props.item._original.DepartmentName}</strong> </p>
                <button className='btn btn-small btn-warning' onClick={props.onClose}> <i class="fa fa-undo"> </i> Hủy</button>
                <button className='btn btn-small btn-danger margin-left-5'
                    onClick={() => {
                        props.onClose();
                        Trl_spDepartment_Delete_Action(props.item);
                    }}
                >
                    <i class="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    }
    //#endregion
    const [Files, setFiles] = useState();
    const [ViewFiles, setViewFiles] = useState([])
    const [FileUpload, setFileUpload] = useState("")
    const onFileChange = (event) => {
        setFileUpload(event.target.files[0]);
        setRoutermap(URL.createObjectURL(event.target.files[0]));
    };

    const Trl_spDepartment_FileDelete = (filename) => {
        if (window.confirm("Bạn có chắc muốn xóa file?")) {
            let fileold = Files, // list file gốc
                listfileok = "", // file sau khi đã xóa
                showdata = [...ViewFiles]; // list file đang hiển thị
            if (fileold !== undefined && fileold !== "") {
                let checkfile = fileold.split(",").filter(e => e !== "");
                for (let i = 0; i < checkfile.length; i++) {
                    const splitfn = checkfile[i].split("/").filter(e => e !== "");
                    if (splitfn[splitfn.length - 1] !== filename) {
                        listfileok += checkfile[i] + ',';
                    }
                    if (splitfn[splitfn.length - 1] === filename) {
                        const dbnew = showdata.filter(p => p !== filename);
                        setViewFiles(dbnew);
                    }
                }
                setFiles(listfileok);
            }
        }

    }


    return (
        <>
        <div className="content-wrapper">
            <div class="card-header border-left-red">
                <div class="row">
                    <div class="col-sm-12 col-md-4" >
                        <h3 class="card-title font-weight-bold">Phòng ban ({data.length})</h3>
                    </div>
                    <div class="col-sm-12 col-md-8 margin-top-5s">
                        <button onClick={VideAdd} type="button" class="btn btn-sm btn-success pull-right margin-left-5">
                            <i class="fa fa-plus pr-2"></i>
                            Thêm mới
                        </button>
                        <button onClick={Trl_spDepartment_List} type="button" class="btn btn-sm btn-danger pull-right margin-left-5">
                            <i class="fa fa-search pr-2"></i>
                            Tìm kiếm
                        </button>
                        <div class="form-group pull-right" style={{ marginTop: '-4px' }}>
                            <div class="input-group" style={{ width: '100%' }}>
                                <input type="text" maxLength="500" placeholder="SĐT,Email,Tên KH..." class="form-control" value={DepartmentSearch} onChange={e => setDepartmentSearch(e.target.value)} />
                            </div>
                        </div>
                        <div class="form-group pull-right" style={{ marginTop: '-4px', width: '25%' }}>
                            {/* <div class="input-group" style={{ width: '100%' }}>
                                <SelectBranch
                                    onSelected={item => setBranchIdSearch(item.value)}
                                    BranchId={BranchIdSearch}
                                    onBranchId={BranchIdSearch}
                                    key="brsearch"
                                />


                            </div> */}
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
                            {DepartmentId === 0 ? "Thêm mới loại Phòng ban" : "Chỉnh sửa thông tin loại Phòng ban " + DepartmentName}
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
                                            <span class="input-group-text">Mã Phòng ban(<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={DepartmentCode} onChange={e => setDepartmentCode(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Tên Phòng ban(<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={DepartmentName} onChange={e => setDepartmentName(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-6">
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
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-text">Chi nhánh(<strong className='check-point'>*</strong>)</span>
                                        <SelectBranch
                                            onSelected={item => setBranchId(item.value)}
                                            BranchId={-1}
                                            onBranchId={BranchId}
                                            key="bradd"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-text">Người Quản Lý(<strong className='check-point'>*</strong>)</span>
                                        <SelectStaff
                                            onSelected={item => setStaffId(item.value)}
                                            BranchId={0}
                                            DepartmentId={0}
                                            StaffId={0}
                                            onStaffId={StaffId}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-6">
                                <div className="form-collapse-default mt-4">
                                    <div className="row">
                                        <a className="form-collapse-link text-uppercase">
                                            Sơ đồ tổ chức
                                            <span className="form__title__note"> (*)</span>
                                        </a>
                                    </div>
                                    <div className="row pb-3">
                                        <div className="col-md-12 pb-3">
                                            {Routermap ? (
                                                <label class="image-collapse-label">
                                                    <input
                                                        type="file"
                                                        className="image-collapse-file"
                                                        onChange={onFileChange}
                                                        accept="image/*"
                                                    />
                                                    <img
                                                        src={Routermap === "" ? "" : Routermap}
                                                        className="image-collapse-image"
                                                        onChange={onFileChange}
                                                    />
                                                </label>
                                            ) : (
                                                <label class="image-collapse-label">
                                                    <input
                                                        type="file"
                                                        className="image-collapse-file"
                                                        onChange={onFileChange}
                                                        accept="image/*"
                                                    />
                                                    <i className="fa fa-camera upload-file-btn"></i>
                                                    <span className="image-collapse-span">
                                                        Hình sơ đồ
                                                    </span>
                                                </label>
                                            )}
                                        </div>
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

                                <button type="button" class="btn btn-sm btn-danger pull-right" onClick={Trl_spDepartment_Save}>
                                    <i class="fa fa-edit pr-2"></i>
                                    {DepartmentId === 0 ? " Thêm mới" : "Chỉnh sửa"}
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
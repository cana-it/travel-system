import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alertwarning, Alertsuccess,
    Alerterror, FormatDateJson,
    ConvertUTCDateToLocalDate,
    CheckTypeFile
} from '../../../../Utils';
import { DataTable, SelectBranch, SelectProviderType } from '../../../../Common';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import { IMAGES_DOMAIN } from '../../../../Services'
//import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert'; // Import

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery'


export const Provider = () => {

    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const VideAdd = () => {

        openModal()
    }

    const Cancel = () => {
        setProviderId(0);
        setProviderCode("");
        setProviderName("");

       
        setPhone("");
        setAddress("");
        setEmail("");
       
        setNotes("");
        setFiles("");

        setFileUpload1("");
        setViewFiles([]);

        setProviderTypeId(0)
    }


    const [data, setData] = useState([])
    useEffect(() => {
        Trl_spProvider_List();
    }, [])

    const [ProviderTypeId_List, setProviderTypeId_List] = useState(0)
    const [ProviderId_List, setProviderId_List] = useState(0)
    const [ProviderSearch, setProviderSearch] = useState("")
    const Trl_spProvider_List = async () => {

        try {

            const pr = {
                ProviderId: ProviderId_List,
                ProviderSearch: ProviderSearch,
                ProviderTypeId: ProviderTypeId_List,
                Creater: Creater,
                CreateName: CreateName
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spProvider_List"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            setData(list);
            
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
            
        }
    }


    const [ProviderId, setProviderId] = useState(0)
    const [ProviderCode, setProviderCode] = useState("")
    const [ProviderName, setProviderName] = useState("")
    const [Phone, setPhone] = useState("")
    const [Address, setAddress] = useState("")
    const [Email, setEmail] = useState("")
    const [Notes, setNotes] = useState("")
    const [ProviderTypeId, setProviderTypeId] = useState(0)
    const [Files, setFiles] = useState();
    const [ViewFiles, setViewFiles] = useState([])
    const [FileUpload1, setFileUpload1] = useState("")

    const Trl_spProvider_Save = async () => {

        try {
            
            if (ProviderCode === "") {
                Alertwarning("Nhập mã khách hàng");
                return;
            }

            if (ProviderCode !== undefined && ProviderCode.length <= 0) {
                Alertwarning("Nhập mã khách hàng > 0 kí tự");
                return;
            }
            if (ProviderName === "") {
                Alertwarning("Nhập tên khách hàng");
                return;
            }
            if (ProviderName !== undefined && ProviderName.length <= 0) {
                Alertwarning("Nhập tên khách hàng > 0 kí tự");
                return;
            }
            
            if (Phone !== undefined && Phone !== "" && Phone.length <= 9) {
                Alertwarning("SĐT phải 10 số trở lên");
                return;
            }
            
            if (ProviderTypeId === 0 || ProviderTypeId === undefined) {
                Alertwarning("Chọn loại khách hàng");
                return;
            }


            let listfile = ""

            if (FileUpload1 !== "" && FileUpload1.length > 0) {
                const formData = new FormData();
                formData.append("Key", "FilesProvider");
                for (let i = 0; i < FileUpload1.length; i++) {
                    formData.append("myFile" + i, FileUpload1[i]);

                }
                const data = await mainAction.API_spCallPostFile(formData, dispatch);
                let _img = data.Message.replaceAll('"', '')
                listfile = _img.replace("[", "").replace("]", "");
            }

            const pr = {
                ProviderId: ProviderId,
                ProviderCode: ProviderCode.trim(),
                ProviderName: ProviderName.trim(),
                Phone: Phone,
                Address: Address,
                Email: Email,
                Files: ProviderId === 0 ? listfile : (listfile === "" ? Files : listfile + "," + Files),
                Notes: Notes,
                ProviderTypeId: ProviderTypeId,
                Creater: Creater,
                CreateName: CreateName
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spProvider_Save"
            }

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Cancel();
                Trl_spProvider_List();
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


    const [IsAcctive1, setIsAcctive1] = useState(false);
    const [IsAcctive2, setIsAcctive2] = useState(false);

    const onFileChange1 = (event) => {
        let fileok = event.target.files;
        setFileUpload1(fileok);
        let filename = [...ViewFiles];
        for (let i = 0; i < fileok.length; i++) {
            filename.push(fileok[i].name);
        }
        setViewFiles(filename);
    };

    const Trl_spProvider_FileDelete = (filename) => {
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


    const Trl_spProvider_View = (item) => {
        
        
        const obView = item._original;
        setProviderId(obView.ProviderId);
        setProviderCode(obView.ProviderCode);
        setProviderName(obView.ProviderName);
        setPhone(obView.Phone);
        setAddress(obView.Address);
        setEmail(obView.Email);
        if (obView.Files !== undefined && obView.Files !== "") {
            
            let checkfile = obView.Files.split(",").filter(e => e !== "");
            let ListFileName = [];
            for (let i = 0; i < checkfile.length; i++) {
                const splitfn = checkfile[i].split("/");
                ListFileName.push(splitfn[splitfn.length - 1]);
            }
            setViewFiles(ListFileName);

        }
        else {
            setViewFiles([]);
        }
        setFiles(obView.Files);

        setProviderTypeId(obView.ProviderTypeId);

        // open popup
        setIsOpen(true);
    }

    const Trl_spProvider_Delete = (item) => {

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ConfirmAlertUi onClose={onClose} item={item} />
                );
            }
        });


    }

    const Trl_spProvider_Delete_Action = async (item) => {
        try {
            
            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                ProviderId: item._original.ProviderId
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spProvider_Delete"
            }

            const result = await mainAction.API_spCallServer(params, dispatch)
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spProvider_List();
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
                <p>Bạn có chắc chắn muốn xóa <strong>{props.item._original.ProviderName}</strong> </p>
                <button className='btn btn-small btn-warning' onClick={props.onClose}> <i class="fa fa-undo"> </i> Hủy</button>
                <button className='btn btn-small btn-danger margin-left-5'
                    onClick={() => {
                        props.onClose();
                        Trl_spProvider_Delete_Action(props.item);
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
                    <button className="btn btn-sm btn-success" onClick={e => Trl_spProvider_View(row)}> <i class="fa fa-eye"></i> Sửa</button> |
                    <button className="btn btn-sm btn-danger" onClick={e => Trl_spProvider_Delete(row)}> <i class="fa fa-trash"></i> Xóa</button>
                </div>
            ),
            width: 200,
            fixed: "left"
        },
        {
            Header: 'Mã NCC',
            accessor: 'ProviderCode',
            fixed: "left"
        },
        {
            Header: "Tên NCC",
            accessor: "ProviderName",
            width: 250,
            fixed: "left"
        },
        {
            Header: "Loại NCC",
            accessor: "ProviderTypeName",
            with: 100
        },
        {
            Header: "SĐT",
            accessor: "Phone",
            with: 100
        },
        {
            Header: "Email",
            accessor: "Email",
            with: 100
        },
        {
            Header: "Địa chỉ",
            accessor: "Address",
            width: 250
        }
        ,
        {
            Header: "Files",
            accessor: "Files",
            with: 300,
            Cell: ({ row }) => { //spread the props
                const fls = row._original.Files.split(",").filter(e => e !== "");
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
                        <h3 class="card-title font-weight-bold">Nhà cung cấp({data.length})</h3>
                    </div>

                    <div class="col-sm-12 col-md-6 margin-top-5s">
                        <button onClick={VideAdd} type="button" class="btn btn-sm btn-success pull-right margin-left-5">
                            <i class="fa fa-plus pr-2"></i>
                            Thêm mới
                        </button>
                        <button onClick={Trl_spProvider_List} type="button" class="btn btn-sm btn-danger pull-right margin-left-5">
                            <i class="fa fa-search pr-2"></i>
                            Tìm kiếm
                        </button>
                        <div class="form-group pull-right" style={{ marginTop: '-4px' }}>
                            <div class="input-group" style={{ width: '100%' }}>
                                <input type="text" maxLength="500" placeholder="SĐT,Email,Tên KH..." class="form-control" value={ProviderSearch} onChange={e => setProviderSearch(e.target.value)} />
                            </div>
                        </div>
                        <div class="form-group pull-right" style={{ marginTop: '-4px', width: '25%' }}>
                            <div class="input-group" style={{ width: '100%' }}>
                                <SelectProviderType
                                    onSelected={item => setProviderTypeId_List(item.value)}
                                    ProviderTypeId={ProviderTypeId_List}
                                    onProviderTypeId={ProviderTypeId_List}
                                />
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
                            {ProviderId === 0 ? "Thêm mới nhà cung cấp" : "Chỉnh sửa thông tin nhà cung cấp: " + ProviderName}
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
                                            <span class="input-group-text">Mã NCC(<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={ProviderCode} onChange={e => setProviderCode(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Tên NCC(<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={ProviderName} onChange={e => setProviderName(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">SĐT</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={Phone} onChange={e => setPhone(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Địa chỉ</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={Address} onChange={e => setAddress(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Email</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={Email} onChange={e => setEmail(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                           
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-text">Loại NCC(<strong className='check-point'>*</strong>)</span>
                                        <SelectProviderType
                                            onSelected={item => setProviderTypeId(item.value)}
                                            ProviderTypeId={ProviderTypeId}
                                            onProviderTypeId={ProviderTypeId}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-8">
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
                                <div className="form-collapse-default mt-4">
                                    <div className="row">
                                        <a className="form-collapse-link text-uppercase">
                                            Files
                                            <span className="form__title__note"> (*)</span>
                                        </a>
                                    </div>
                                    <div className="row pb-3">
                                        <div className="col-sm-12 col-md-4">
                                            <label class="image-collapse-label">
                                                <input
                                                    type="file"
                                                    className="image-collapse-file"
                                                    onChange={onFileChange1}
                                                    accept="*"
                                                    multiple
                                                />
                                                <i className="fa fa-file upload-file-btn"></i>
                                                <span className="image-collapse-span">
                                                    Upload  Excel, PDF, Work...
                                                </span>
                                            </label>
                                        </div>
                                        <div className="col-sm-12 col-md-8">
                                            {
                                                ViewFiles.map((filename, index) => {
                                                    return (
                                                        <div className='margin-top-5 hover-deletefile'>
                                                            <i className='fa fa-trash' onClick={e => Trl_spProvider_FileDelete(filename)}></i> {filename}
                                                        </div>
                                                    )
                                                })
                                            }
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

                                <button type="button" class="btn btn-sm btn-danger pull-right" onClick={Trl_spProvider_Save}>
                                    <i class="fa fa-edit pr-2"></i>
                                    {ProviderId === 0 ? " Thêm mới" : "Chỉnh sửa"}
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
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alertwarning, Alertsuccess,
    Alerterror, FormatDateJson,
} from '../../../../Utils';
import { DataTable } from '../../../../Common';
import DateTimePicker from 'react-datetime-picker';
import { IMAGES_DOMAIN } from '../../../../Services'
//import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert'; // Import

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery'

export const UploadDoccument = () => {
    useEffect(() => {
        Trl_spDocument_List();
    }, [])


    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const [IsTodate, setIsTodate] = useState();
    const onTodate = (item) => {
        
        setIsTodate(item)
        setTodate(FormatDateJson(item))
    }

    const [IsFromDate, setIsFromDate] = useState();
    const onFromDate = (item) => {
        setIsFromDate(item)
        setFromDate(FormatDateJson(item))
    }

    const VideAdd = () => {

        openModal()
    }
    const [data, setData] = useState([])
    const [ConfirmName, setConfirmName] = useState('');
    const [DocumentId, setDocumentId] = useState(0)
    const [CodeDoc, setCodeDoc] = useState("")
    const [Subject, setSubject] = useState("")
    const [Sex, setSex] = useState("")
    const [Notes, setNotes] = useState("")
    const [Avatar, setAvatar] = useState("")
    const [FromDate, setFromDate] = useState("")
    const [Todate, setTodate] = useState("")
    const [Files, setFiles] = useState();
    const [ViewFiles, setViewFiles] = useState([])
    const [FileUpload, setFileUpload] = useState("")
    const [FileUpload1, setFileUpload1] = useState("")
    const [DocumentSearch, setDocumentSearch] = useState("")
    const [IsAcctive1, setIsAcctive1] = useState(false);
    const [IsAcctive2, setIsAcctive2] = useState(false);

    //#region THÊM
    const Trl_spDocument_Save = async () => {

        try {
            
            if (CodeDoc === "") {
                Alertwarning("Nhập mã tài liệu");
                return;
            }

            if (Subject === "") {
                Alertwarning("Nhập tiêu đề");
                return;
            }

            if (FromDate === "") {
                Alertwarning("Nhập hiệu lực từ ngày");
                return;
            }
            if (Todate === "") {
                Alertwarning("Nhập hiệu lực đến ngày");
                return;
            }
            if (ConfirmName === '') {
                Alertwarning("Chọn nhân viên xác nhận");
                return;
            }



            let listfile = ""

            if (FileUpload1 !== "" && FileUpload1.length > 0) {
                const formData = new FormData();
                formData.append("Key", "Files");
                for (let i = 0; i < FileUpload1.length; i++) {
                    formData.append("myFile" + i, FileUpload1[i]);

                }
                const data = await mainAction.API_spCallPostFile(formData, dispatch);
                let _img = data.Message.replaceAll('"', '')
                listfile = _img.replace("[", "").replace("]", "");
            }
            if (listfile === '' && DocumentId === 0) {
                Alertwarning("Vui lòng chọn file");
                return;
            }
            const pr = {
                DocumentId: DocumentId,
                CodeDoc: CodeDoc.trim(),
                Subject: Subject.trim(),
                FromDate: FromDate,
                Todate: Todate,
                Files: DocumentId === 0 ? listfile : (listfile === "" ? Files : listfile + "," + Files),
                ConfirmName: ConfirmName,
                Creater: Creater,
                CreateName: CreateName,
                Notes: Notes
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spDocument_Save"
            }

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Cancel();
                Trl_spDocument_List();
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
    const Cancel = () => {
        setDocumentId(0);
        setCodeDoc("");
        setSubject("");
        setNotes("");
        setConfirmName("");
        setFiles("");
        setFileUpload("");
        setFileUpload1("");
        setViewFiles([]);
        setFromDate("");
        setTodate("");
        $(".react-datetime-picker__clear-button").click();
    }
    //#endregion

    //#region DANH SÁCH
    const Trl_spDocument_List = async () => {

        try {

            const pr = {

                DocumentId: DocumentId,
                DocumentSearch: DocumentSearch,
                DocumentSearch: DocumentSearch,
                DocumentId: 0,
                Creater: Creater
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spDocument_List"
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
                    <button className="btn btn-xs btn-success" onClick={e => Trl_spDocument_View(row)}> <i class="fa fa-eye"></i> Sửa</button> |
                    <button className="btn btn-xs btn-danger" onClick={e => Trl_spDocument_Delete(row)}> <i class="fa fa-trash"></i> Xóa</button>
                </div>
            ),
            width: 200,
            fixed: "left"
        },

        {
            Header: 'Mã tài liệu',
            accessor: 'CodeDoc',
            fixed: "left",
            width: 150,
        },
        {
            Header: "Tên tiêu đề",
            accessor: "Subject",
            width: 250,
            fixed: "left"
        },
        {
            Header: "Hiệu lực từ",
            accessor: "FromDate",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 150
        },
        {
            Header: "Hiệu lực đến",
            accessor: "Todate",
            width: 150,
            Cell: (obj) => FormatDateJson(obj.value),
        },


        {
            Header: "Người xác nhận",
            accessor: "ConfirmName",
            width: 100
        },
        {
            Header: "Ghi chú",
            accessor: "Notes",
            with: 100
        },

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


    const onFileChange1 = (event) => {
        let fileok = event.target.files;
        setFileUpload1(fileok);
        let filename = [...ViewFiles];
        for (let i = 0; i < fileok.length; i++) {
            filename.push(fileok[i].name);
        }
        setViewFiles(filename);
    };

    const Trl_spDocument_FileDelete = (filename) => {
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


    const Trl_spDocument_View = (item) => {
        
        const obView = item._original;
        setDocumentId(obView.DocumentId);
        setCodeDoc(obView.CodeDoc);
        setSubject(obView.Subject);
        setNotes(obView.Notes);
        setConfirmName(obView.ConfirmName);
        if (obView.FromDate !== undefined) {
            
            let bri = new Date(obView.FromDate);
            setFromDate(FormatDateJson(bri));
            setIsFromDate(bri);
        }

        if (obView.Todate !== undefined) {
            let ttw = new Date(obView.Todate);
            setTodate(FormatDateJson(ttw));
            setIsTodate(ttw);
        }

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

        // open popup
        setIsOpen(true);
    }

    const Trl_spDocument_Delete = (item) => {

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ConfirmAlertUi onClose={onClose} item={item} />
                );
            }
        });


    }

    const Trl_spDocument_Delete_Action = async (item) => {
        try {
            
            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                DocumentId: item._original.DocumentId
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spDocument_Delete"
            }

            const result = await mainAction.API_spCallServer(params, dispatch)
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spDocument_List();
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
                <p>Bạn có chắc chắn muốn xóa <strong>{props.item._original.Subject}</strong> </p>
                <button className='btn btn-small btn-warning' onClick={props.onClose}> <i class="fa fa-undo"> </i> Hủy</button>
                <button className='btn btn-small btn-danger margin-left-5'
                    onClick={() => {
                        props.onClose();
                        Trl_spDocument_Delete_Action(props.item);
                    }}
                >
                    <i class="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    }

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
                    <div class="col-sm-12 col-md-4" >
                        <h3 class="card-title font-weight-bold">Tài liệu ({data.length})</h3>
                    </div>
                    <div class="col-sm-12 col-md-8 margin-top-5s">

                        <button onClick={VideAdd} type="button" class="btn btn-sm btn-success pull-right margin-left-10">
                            <i class="fa fa-plus pr-2"></i>
                            Thêm mới
                        </button>

                        <button onClick={Trl_spDocument_List} type="button" class="btn btn-sm btn-danger pull-right margin-left-10">
                            <i class="fa fa-search pr-2"></i>
                            Tìm kiếm
                        </button>
                        <div class="form-group pull-right" style={{ marginTop: '-4px' }}>
                            <div class="input-group" style={{ width: '100%' }}>
                                <input type="text" maxLength="500" placeholder="Mã, tiêu để,NV xác nhận ..." class="form-control" value={DocumentSearch} onChange={e => setDocumentSearch(e.target.value)} />
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
                            {DocumentId === 0 ? "Upload tài liệu" : "Chỉnh sửa Upload tài liệu " + Subject}
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
                                            <span class="input-group-text">Mã tài liệu (<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={CodeDoc} onChange={e => setCodeDoc(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-8">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Tiêu đề (<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={Subject} onChange={e => setSubject(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Từ ngày (<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <DateTimePicker className="z-index-1k"
                                            onChange={onFromDate}
                                            value={IsFromDate}
                                            format='MM/dd/yyyy HH:mm:ss'
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Đến ngày (<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <DateTimePicker className="z-index-1k"
                                            onChange={onTodate}
                                            value={IsTodate}
                                            format='MM/dd/yyyy HH:mm:ss'
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">NV xác nhận (<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={ConfirmName} onChange={e => setConfirmName(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Notes </span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={Notes} onChange={e => setNotes(e.target.value)} />
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
                                                            <i className='fa fa-trash' onClick={e => Trl_spDocument_FileDelete(filename)}></i> {filename}
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

                                <button type="button" class="btn btn-sm btn-danger pull-right" onClick={Trl_spDocument_Save}>
                                    <i class="fa fa-edit pr-2"></i>
                                    {DocumentId === 0 ? " Thêm mới" : "Chỉnh sửa"}
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
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alertwarning, Alertsuccess,
    Alerterror, FormatDateJson,
    ConfirmAlert,
} from '../../../../Utils';
import { SelectStaff } from '../../../../Common';
import Select from 'react-select';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import DateTimePicker from 'react-datetime-picker';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery'
import { useLocation, useNavigate } from 'react-router-dom';
import { addHours } from 'date-fns';
export const Leave = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const Dpid = localStorage.getItem("Dpid");
    const PositionId = localStorage.getItem("PositionId");
    const [AccountId, setAccountId] = useState({ value: 0, label: 'Chọn nhân viên' });
    const [data, setData] = useState([])
    const [LeaveId, setLeaveId] = useState(0)
    const [Notes, setNotes] = useState("")
    const [FromDate, setFromDate] = useState("")
    const [Files, setFiles] = useState();
    const [ViewFiles, setViewFiles] = useState([])
    const [FileUpload, setFileUpload] = useState("")
    const [FileUpload1, setFileUpload1] = useState("")
    const [Reason, setReason] = useState('');
    const [SignatureApprove, setSignatureApprove] = useState();
    const [Dataview,setDataview] = useState([])

    

    useEffect(() => {
        Trl_spLeave_List();
    }, [location, Dpid])

    let Datfirst = new Date()
    const [TimeSearch, setTimeSearch] = useState([new Date(Datfirst.getFullYear(), Datfirst.getMonth(), 1),new Date()]);
    const onchangeTimeSearch =(e)=>{
        setTimeSearch(e)
    }

    const [IsFromDate, setIsFromDate] = useState();
    const [NumberLeave,setNumberLeave] = useState("")
    const [TypeLeave,setTypeLeave] = useState("")

    const [LeaveList, setLeaveList] = useState({
        value: 0,
        label: "0.5 ngày",
    });
    const ListLeave = [
        { value: 0, label: "0.5 ngày" },
        { value: 1, label: "1 ngày" },
        { value: 2, label: "2 ngày" },
        { value: 3, label: "3 ngày" },
        { value: 4, label: "4 ngày" },
        { value: 5, label: "5 ngày" },
        { value: 6, label: "6 ngày" },
        { value: 7, label: "7 ngày" },
    ];

    const [TypeLeaveList, setTypeLeaveList] = useState({
        value: "A",
        label: "Nghỉ phép thường",
    });
    const ListTypeLeave = [
        { value: "A", label: "Nghỉ phép thường" },
        { value: "B", label: "Nghỉ phép năm" },
    ];

    const onSelecteLeave = (e)=>{
        setLeaveList({value: e.value, label: e.label});
        setNumberLeave(e.label);
    }

    const onSelecteTypeLeave = (e)=>{
        setTypeLeaveList({value: e.value, label: e.label});
        setTypeLeave(e.value);
    }

    const VideAdd = () => {

        openModal()
    }

    //#region THÊM
    const Trl_spLeave_Save = async () => {
        try {

            if (Reason === "") {
                Alertwarning("Nhập lý do nghỉ");
                return;
            }

            if (IsFromDate === "" || IsFromDate === undefined) {
                Alertwarning("Chọn ngày đăng ký nghỉ phép");
                return;
            }

            if (AccountId.value === 0) {
                Alertwarning("Chọn nhân viên xác nhận");
                return;
            }
            let listfile = "";
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
            let ConfirmId = AccountId.value;
            let ConfirmName = AccountId.label;
            const pr = {
                LeaveID: LeaveId,
                Reason: Reason.trim(),
                NumberLeave:NumberLeave,
                TimeLeave: IsFromDate,
                TypeLeave: TypeLeave,
                ConfirmId: ConfirmId,
                ConfirmName: ConfirmName,
                Files: LeaveId === 0 ? listfile : (listfile === "" ? Files : listfile + "," + Files),
                Creater: Creater,
                CreateName: CreateName,
                Notes: Notes
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spLeave_Save"
            }


            const prno = {
                NotificationId: 0,
                Title: LeaveId === 0 ? "Đăng ký nghỉ phép" : 'Chỉnh sửa nghỉ phép',
                Contents: CreateName + ': ' + (TypeLeave === 'A' ? `${NumberLeave} Nghỉ phép thường` : `${NumberLeave} Nghỉ phép năm`) + ' : ' + FormatDateJson(IsFromDate) + ' Lý do: ' + Reason.trim(),
                Files: '',
                Creater: Creater,
                CreateName: CreateName,
            }

            const paramsno = {
                Json: JSON.stringify(prno),
                func: "Trl_spNotification_Save"
            }

            const result = await mainAction.API_spCallServer(params, dispatch);


            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Cancel();
                Trl_spLeave_List();
                setIsOpen(false); // close popup

                const resultno = await mainAction.API_spCallServer(paramsno, dispatch);
                if (resultno.Status === "OK") {
                    let a = window.location.pathname + '?id=31&&NoticationId=' + resultno.NotificationID;
                    navigate(a);
                }
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
        setIsFix(false);
        setLeaveId(0);
        setReason("");
        setNotes("");
        setAccountId({ value: 0, label: 'Chọn nhân viên' });
        setFiles("");
        setFileUpload("");
        setFileUpload1("");
        setViewFiles([]);
        setFromDate("");
        setLeaveList({value: 0,label: "0.5 ngày",})
        setTypeLeaveList({value: "A",label: "Nghỉ phép thường",})
        $(".addf .react-datetime-picker__clear-button").click();
    }
    //#endregion

    //#region DANH SÁCH
    const [HeaderInfor, setHeaderInform] = useState()
    const [DataDetail, setDataDetail] = useState();
    const Trl_spLeave_List = async () => {
        let date = new Date(),
            firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        try {
            const pr = {
                FromDate: TimeSearch !== undefined ? FormatDateJson(TimeSearch[0]) : FormatDateJson(firstDay),
                Todate: TimeSearch !== undefined ? FormatDateJson(addHours(TimeSearch[1],12)) : FormatDateJson(date),
                CheckDate: TimeSearch !== undefined   ? 'A' : 'B',
                DepartId: Dpid,
                Creater: Creater,
                CreateName: CreateName
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spLeave_List_V1"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            setHeaderInform({
                TotalLeave:list?.ReturnMess2.length,
                Finish: list?.ReturnMess2.filter(x => x.IsConfirm === 'A').length,
                NotFinish: list?.ReturnMess2.filter(x => x.IsConfirm === 'B').length
            })

            setData(list);
            setDataDetail(list?.ReturnMess2);

        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
            
        }
    }

    const Trl_spLeave_FilterStatus = async (StatusId) => {
        const oldData = [...DataDetail];
        const Datacr = {...data};
        
        if(StatusId === 1){
            Datacr.ReturnMess2 = oldData;
            $(".FilterStatu1").removeClass("taskblock");
            $(".FilterStatu2").removeClass("taskblock");
            $(".FilterStatu3").removeClass("taskblock");
        }
        if(StatusId === 2){
            Datacr.ReturnMess2 = oldData.filter(x => x.IsConfirm === 'A');
            $(".FilterStatu2").addClass("taskblock");
            $(".FilterStatu3").removeClass("taskblock");
        }
        if(StatusId === 3){
            Datacr.ReturnMess2 = oldData.filter(x => x.IsConfirm === 'B');
            $(".FilterStatu2").removeClass("taskblock");
            $(".FilterStatu3").addClass("taskblock");
        }
        setData(Datacr);
    }

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

    const Trl_spLeave_FileDelete = (filename) => {
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

    const Trl_spLeave_Approve_Sign = (item,number) => {
        setIsOpen2(true);
        setDataview({
            ...item, typeLeaveComfirm: item?.IsConfirm === 'B'? "Chưa duyệt":"Đã duyệt",
            typeView : number === 4 ? "Xem đăng ký nghỉ phép" : "Phê duyệt nghỉ phép",
            typeNumber : number,
        });

        if (item.Files !== undefined && item.Files !== "") {
            
            let checkfile = item.Files.split(",").filter(e => e !== "");
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
        setFiles(item.Files);
    }


    const Trl_spLeave_Approve = async (LeaveId,number) => {

        try {
            const pr = {
                LeaveID: LeaveId,
                Creater: Creater,
                CreateName: CreateName,
                IsConfirm: number,
            }
            
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spLeave_Approve"
            }

            const result = await mainAction.API_spCallServer(params, dispatch);
            Alertsuccess(result.ReturnMess);
            Trl_spLeave_List();
            setIsOpen2(false);

        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
            
        }
    }

    const [IsFix,setIsFix] = useState(false)
    const Trl_spLeave_View = (item) => {
        setIsOpen2(false);
        setIsOpen(true);
        const obView = item;
        setLeaveId(obView.LeaveID);
        setReason(obView.Reason);
        setNotes(obView.Note);
        setAccountId({ value: obView.ConfirmId1, label: obView.ConfirmName1 });

        const x = ListTypeLeave.find((x) => x.value == obView.TypeLeave);
        setTypeLeaveList(x);
        setTypeLeave(obView.TypeLeave);

        const y = ListLeave.find((x) => x.label == obView.NumberLeave);
        setLeaveList(y);
        setNumberLeave(obView.NumberLeave);

        if (obView?.TimeLeave) {
            let bri = new Date(obView.TimeLeave);
            setFromDate(FormatDateJson(bri,7));
            setIsFromDate(bri);
        }

        if(obView?.Creater === parseInt(Creater) && obView?.IsConfirmTime <= 1){
            setIsFix(false);
        }else{
            setIsFix(true);
        }

        if (obView?.Files && obView?.Files !== "") {
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
    }

    const Trl_spLeave_Delete = async (item) => {

        try {
            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                LeaveID: item.LeaveID
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spLeave_Delete"
            }

            const result = await mainAction.API_spCallServer(params, dispatch)
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spLeave_List();
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

    const [modalIsOpen, setIsOpen] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
        Cancel();
    }

    const [modalIsOpen2, setIsOpen2] = useState(false);
    const closeModal2 = () => {
        setIsOpen2(false);
    }

    return (
        <>
        <div className="content-wrapper">
            <div class="card-header border-left-red">
                <div class="row">
                    <div class="col-sm-12 col-md-3" >
                        <h3 class="card-title font-weight-bold">Đăng ký nghỉ phép ({data?.ReturnMess2?.length || 0})</h3>
                    </div>
                    <div class="col-sm-12 col-md-9 margin-top-5s">
                        <button onClick={VideAdd} type="button" class="btn btn-sm btn-success pull-right margin-left-5">
                            <i class="fa fa-plus pr-2"></i>
                            Tạo nghỉ phép
                        </button>
                        <button type="button" class="btn btn-sm btn-danger pull-right margin-left-5" onClick={e => Trl_spLeave_List()}>
                            <i class="fa fa-search pr-2"></i>
                            Tìm kiếm
                        </button>
                        <div class="form-group pull-right" style={{ marginTop: '-4px', width: '35%', marginRight: '5px' }}>
                            <div class="input-group ">
                                <DateTimeRangePicker className="form-control2 px-1 pb-2px zIndex-300"
                                    value={TimeSearch}
                                    onChange={onchangeTimeSearch}
                                    format='dd-MM-yyyy' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card-body border-left-red">

                <div className='row margin-top-5' style={{ marginTop: '10px' }}>
                    <div class="col-md-4 col-sm-6 col-12" onClick={e => Trl_spLeave_FilterStatus(1)}>
                        <div class="info-box shadow-sm cursor-pointer">
                            <span class="info-box-icon bg-info"><i class="fas fa-th-list"></i></span>
                            <div class="info-box-content">
                                <span class="info-box-text">Số nghỉ phép</span>
                                <span class="info-box-number">{HeaderInfor?.TotalLeave || 0}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 col-sm-6 col-12" onClick={e => Trl_spLeave_FilterStatus(2)}>
                        <div class="info-box shadow FilterStatu2 cursor-pointer">
                            <span class="info-box-icon bg-success"><i class="fas fa-plus"></i></span>
                            <div class="info-box-content">
                                <span class="info-box-text">Đã phê duyệt</span>
                                <span class="info-box-number">{HeaderInfor?.Finish || 0}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 col-sm-6 col-12" onClick={e => Trl_spLeave_FilterStatus(3)}>
                        <div class="info-box shadow-lg FilterStatu3 cursor-pointer">
                            <span class="info-box-icon bg-warning"><i class="fa fa-list"></i></span>
                            <div class="info-box-content">
                                <span class="info-box-text">Chưa phê duyệt</span>
                                <span class="info-box-number">{HeaderInfor?.NotFinish || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-12 content margin-top-5">
                    <div class= "card-body "style={{marginTop :'10px'}}>
                        <div class="card-header">
                            <h3 class="card-title">Danh sách đăng ký</h3>
                        </div>
                        <div class=" table-responsive">
                            <table class="table table-bordered" id="dataTable">
                                <thead>
                                    <th style={{ minWidth: '130px' }}> Option</th>
                                    <th style={{ minWidth: '280px'}}> Xác nhận</th>
                                    <th style={{ minWidth: '180px'}}> Mã đơn</th>
                                    <th style={{ minWidth: '200px'}}> Người tạo</th>
                                    <th style={{ minWidth: '250px'}}> Phòng ban</th>
                                    <th style={{ minWidth: '350px' }}> Nội dung</th>
                                    <th style={{ minWidth: '250px' }}> Loại nghỉ</th>
                                    <th style={{ minWidth: '180px' }} > Thời gian nghỉ</th>
                                    <th style={{ minWidth: '180px' }} > Tình trạng</th>
                                </thead>
                                <tbody>
                                    {
                                        data?.ReturnMess2?.map((item, index) => {
                                        let classhow = "card-header display-none isdatashow" + index;
                                        let cStatus = item.IsConfirm;
                                        let classStatus = "div-title no-border-radius btn btn-block bg-gradient-success btn-flat margin-left-5";
                                        if (cStatus === "B") classStatus = "background-danger div-title no-border-radius btn btn-block bg-gradient-warning btn-flat margin-left-5";

                                            return (
                                                <tr>
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                            <div className="row">
                                                                <button className="btn btn-xs btn-success margin-left-5" 
                                                                    onClick={e => Trl_spLeave_View(item)}
                                                                > 
                                                                    <i class="fa fa-eye"></i> Xem
                                                                </button>
                                                                <button 
                                                                    className="btn btn-xs btn-danger margin-left-5" 
                                                                    onClick={() => {
                                                                        ConfirmAlert(
                                                                        "Xác nhận",
                                                                        "Bạn có muốn xóa không?",
                                                                        () => {
                                                                            Trl_spLeave_Delete(item);
                                                                        }
                                                                    );
                                                                    }}
                                                                    disabled={((item?.IsConfirm === 'B' && item?.Creater === parseInt(Creater))|| PositionId <= 7) ? false: true}
                                                                > 
                                                                    <i class="fa fa-trash"></i> Xóa
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                            <div className="row">
                                                                {item?.Creater === parseInt(Creater) ?
                                                                    <button 
                                                                        className={item?.IsConfirmTime >= 2? "btn btn-xs btn-success margin-left-5" : "btn btn-xs btn-info margin-left-5"}
                                                                        onClick={e => Trl_spLeave_Approve_Sign(item,0)}
                                                                        disabled={(item?.IsConfirm === 'B' && item?.Creater ===  parseInt(Creater) && item?.IsConfirmTime === 0) ? false: true}
                                                                    >
                                                                        Xác nhận
                                                                    </button>
                                                                    : ""
                                                                }
                                                                <button 
                                                                    className={item?.IsConfirmTime >= 2? "btn btn-xs btn-success margin-left-5" : "btn btn-xs btn-info margin-left-5"}
                                                                    onClick={e => Trl_spLeave_Approve_Sign(item,1)}
                                                                    disabled={(item?.IsConfirm === 'B' && item?.ConfirmId1 ===  parseInt(Creater) && item?.IsConfirmTime === 1) ? false: true}
                                                                >
                                                                    QL duyệt
                                                                </button>
                                                                <button 
                                                                    className={item?.IsConfirmTime > 2? "btn btn-xs btn-success margin-left-5" : "btn btn-xs btn-warning margin-left-5"} 
                                                                    onClick={e => Trl_spLeave_Approve_Sign(item,2)}
                                                                    disabled={(item?.IsConfirm === 'B' && PositionId <= 6) ? false: true}
                                                                >
                                                                    BGD duyệt
                                                                </button>
                                                                <button 
                                                                    className={item?.IsConfirmTime > 2? "btn btn-xs btn-success margin-left-5" : "btn btn-xs btn-warning margin-left-5"} 
                                                                    onClick={e => Trl_spLeave_Approve_Sign(item,3)}
                                                                    disabled={(item?.IsConfirm === 'B' && (item?.ConfirmId1 ===  parseInt(Creater) || PositionId <= 7)) ? false: true}
                                                                >
                                                                    Duyệt thẳng
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault" style={{ textAlign: 'left' }}>
                                                            {item.LeaveCode}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault" title={item?.CreateName}>
                                                            {item.CreateName}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault" style={{ textAlign: 'left' }}>
                                                            {item.DepartmentName}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault" style={{ textAlign: 'left' }}>
                                                            {item.Reason}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault" style={{ textAlign: 'left' }}>
                                                            {`${item.NumberLeave} ${item.TypeLeaveName}`}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault">
                                                            {FormatDateJson(item?.TimeLeave ? item?.TimeLeave : null, 7)}
                                                        </div>
                                                    </td>
                                                    <td onClick={e => Trl_spLeave_Approve_Sign(item,4)}>
                                                        <div class={classStatus}>
                                                            {item.StatusApprove}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={modalIsOpen}
                onHide={closeModal}
                size='xl'
                className=' custom-modal-w-90'
                aria-labelledby="example-custom-modal-styling-title"
            >

                <Modal.Header >

                    <Modal.Title id="example-custom-modal-styling-title">

                        {LeaveId === 0 ? "Đăng ký nghỉ phép" : "Sửa đăng ký nghỉ phép "}
                    </Modal.Title>
                    <button type="button" class="close" aria-label="Đóng" onClick={() => {
                        closeModal()
                    }}>
                        <span aria-hidden="true">&times;</span>
                    </button>

                </Modal.Header>
                <Modal.Body>
                    <div class="card-body addf">

                        <div class="row">
                            <div className="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group" style={{ zIndex: "100" }}>
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">
                                                Số ngày nghỉ(<strong className="check-point">*</strong>)
                                            </span>
                                        </div>
                                        <Select
                                            className="SelectMeno"
                                            value={LeaveList}
                                            onChange={onSelecteLeave}
                                            options={ListLeave}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">
                                                Loại nghỉ phép
                                            </span>
                                        </div>
                                        <Select
                                            className="SelectMeno"
                                            value={TypeLeaveList}
                                            onChange={onSelecteTypeLeave}
                                            options={ListTypeLeave}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">
                                                Ngày nghỉ phép(<strong className="check-point">*</strong>)
                                            </span>
                                        </div>
                                        <DateTimePicker className="z-index-1k"
                                            value={IsFromDate}
                                            onChange={(date) => setIsFromDate(date)}
                                            format='dd/MM/yyyy HH:mm'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Lý do  (<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={Reason} onChange={e => setReason(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-text">Quản lý xác nhận(<strong className='check-point'>*</strong>)</span>
                                        <SelectStaff
                                            onSelected={e => setAccountId(e)}
                                            BranchId={0}
                                            DepartmentId={0}
                                            onStaffId={AccountId.value}
                                            StaffId={0}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-8">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Ghi chú </span>
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
                                                            <i className='fa fa-trash' onClick={e => Trl_spLeave_FileDelete(filename)}></i> {filename}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>


                                </div>

                            </div>



                            <div class="col-sm-12 col-md-12">
                                <button onClick={Cancel} type="button" class="btn btn-sm btn-danger pull-right margin-left-5">
                                    <i class="fa fa-trash pr-2"></i>
                                    Hủy
                                </button>

                                <button 
                                    type="button" 
                                    class="btn btn-sm btn-success pull-right" 
                                    onClick={() => {
                                        ConfirmAlert(
                                            "Xác nhận",
                                            "Bạn có muốn xác nhận lệnh?",
                                            () => {
                                                Trl_spLeave_Save();
                                            }
                                        );
                                    }}
                                    disabled = {IsFix}
                                >
                                    <i class="fa fa-edit pr-2"></i>
                                    {LeaveId === 0 ? " Thêm mới" : "Chỉnh sửa"}
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

            <Modal
                show={modalIsOpen2}
                onHide={closeModal2}
                size='xl'
                className=' custom-modal-w-90'
                aria-labelledby="example-custom-modal-styling-title"
            >

                <Modal.Header  >
                    <Modal.Title> {`${Dataview.typeView} : ${Dataview.CreateName}`}</Modal.Title>
                    <button type="button" class="close" aria-label="Đóng" onClick={() => {
                        closeModal2()
                    }}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div class="card-body addf">

                        <div class="row">
                            <div className="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Mã đơn:</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={Dataview?.LeaveCode} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Phòng ban:</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={Dataview?.DepartmentName} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Ngày nghỉ phép:</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={FormatDateJson(Dataview?.TimeLeave,7)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Loại nghỉ phép:</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={`${Dataview?.NumberLeave} ${Dataview?.TypeLeaveName}`} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Lý do nghỉ phép :</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={Dataview?.Reason} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Ghi chú:</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={Dataview?.Note} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Quản lý xác nhận:</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={Dataview?.ConfirmName1} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Thời gian QL xác nhận:</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={Dataview?.ConfirmTime1 === undefined ?"":FormatDateJson(Dataview?.ConfirmTime1,0)} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Người duyệt:</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={Dataview?.ConfirmName2} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Thời  gian xác nhận:</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value= {Dataview?.ConfirmTime2 === undefined ?"":FormatDateJson(Dataview?.ConfirmTime2,0)} />
                                    </div>
                                </div>
                            </div>
                            {Dataview?.typeNumber === 4 ? (
                                <div className="col-md-12 col-sm-6">
                                    <div class="col-sm-12 col-md-12">
                                        {Dataview?.Creater === parseInt(Creater) && Dataview?.IsConfirmTime <= 1 ?
                                            <button
                                                type="button"
                                                class="btn btn-sm btn-success margin-left-5 pull-right"
                                                onClick={() => {
                                                    ConfirmAlert(
                                                        "Xác nhận",
                                                        "Bạn có muốn sửa nghỉ phép này?",
                                                        () => {
                                                            Trl_spLeave_View(Dataview);
                                                        }
                                                    );
                                                    
                                                }}
                                            >
                                                <i class="fa fa-edit pr-2"></i>
                                                Sửa
                                            </button>
                                            :""
                                        }
                                    </div>
                                </div>
                                )
                                :
                                (<div class="col-sm-12 col-md-6">
                                    <div class="card-body pt-3" style={{marginLeft:'-30px'}}>
                                        <div className="col-md-12 col-sm-12">
                                            <div className="row" >
                                                <div className="col-md-12 col-sm-6">
                                                    <div className="col-md-12 col-sm-12">
                                                        <button
                                                            type="button"
                                                            class="btn btn-sm btn-success margin-left-5 pull-right"
                                                            onClick={() => {
                                                                ConfirmAlert(
                                                                    "Xác nhận",
                                                                    "Bạn có muốn duyệt nghỉ phép này?",
                                                                    () => {
                                                                        Trl_spLeave_Approve(Dataview?.LeaveID,Dataview?.typeNumber);
                                                                    }
                                                                );
                                                                 
                                                            }}
                                                        >
                                                            <i class="fa fa-edit pr-2"></i>
                                                           Xác nhận nghỉ phép
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                )}



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
    },
};
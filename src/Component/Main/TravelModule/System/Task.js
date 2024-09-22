import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alertwarning, Alertsuccess,
    Alerterror, FormatDateJson,
    ConvertUTCDateToLocalDate,
    ExportExcel
} from '../../../../Utils';
import { TinyMCE, SelectStaff, DataTable } from '../../../../Common';
import { IMAGES_DOMAIN } from '../../../../Services'
import { Link, useLocation } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery'
import Select from 'react-select';
import ReactHtmlParser from 'react-html-parser';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import DateTimePicker from 'react-datetime-picker';
import { DataTable2 } from '../../../../Common/DataTable2';
import * as XLSX from 'xlsx';

import { addHours } from 'date-fns';
export const Task = () => {
    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const DepartmentId = localStorage.getItem("Dpid");
    const PositionId = localStorage.getItem("PositionId");
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [isOpenReport, setIsOpenReport] = useState(false);
    const [Files1, setFiles1] = useState();
    const [ViewFiles1, setViewFiles1] = useState([])
    const [FileUpload1, setFileUpload1] = useState("")

    const [isBoss, setIsBoss] = useState(false);
    const [dateSearchReport, setDateSearchReport] = useState([new Date(), new Date()]);
    const [dataReport, setDataReport] = useState([]);
    const [fileExcelReport, setFileExcelReport] = useState({});
    let prm = useLocation()
    useEffect(() => {
        Trl_spTask_List(0)
    }, [DepartmentId, prm])

    const [TaskSearch, setTaskSearch] = useState("")
    const VideAdd = () => {
        //setTaskinfor({ ...Taskinfor, TaskType: 'A' });
        setTaskinfor({
            TaskId: 0,
            TaskName: "",
            TaskContent: "",
            TaskContentpr: "",
            AssignTo: 0,
            Creater: 0,
            CreateName: "",
            Deadline: "",
            DepartmentId: 0,
            NotesReports: '',
            Files1: "",
            Files2: "",
            StatusId: 0,
            StatusName: '',
            TaskType: 'A'

        })
        openModal()
    }

    const VideAddreport = () => {
        setTaskinfor({
            TaskId: 0,
            TaskName: "",
            TaskContent: "",
            TaskContentpr: "",
            AssignTo: 0,
            Creater: 0,
            CreateName: "",
            Deadline: "",
            DepartmentId: 0,
            NotesReports: '',
            Files1: "",
            Files2: "",
            StatusId: 0,
            TaskType: 'B'

        })
        openModal()
    }

    const [StatusList, setStatusList] = useState({
        value: 1,
        label: "Trong tiến trình",
    });
    const ListStatus = [
    { value: 1, label: "Trong tiến trình" },
    { value: 2, label: "Hoàn thành" },
    { value: 3, label: "Quá hạn" },
    { value: 4, label: "Trể Deadline" },
    ];

    const [StatusListSearch, setStatusListSearch] = useState({
        value: 0,
        label: "Chọn tất cả",
    });
    const ListStatusSearch = [
        { value: 1, label: "Chọn tất cả" },
        { value: 1, label: "Trong tiến trình" },
        { value: 2, label: "Hoàn thành" },
        { value: 3, label: "Quá hạn" },
        { value: 4, label: "Trể Deadline" },
    ];

    const onSelecteStatus = (e) => {
        setStatusList({value:e.value, label: e.label});
        setTaskinfor({ ...Taskinfor, StatusId: e.value , StatusName: e.label});
    }

    const Trl_spTask_View = (detail) => {
        let dl = ConvertUTCDateToLocalDate(new Date(detail?.Deadline || null)),
            TA = new Date(detail?.TimeApprove || new Date());
        detail.Deadline = dl;
        setTaskinfor({
            ...detail,
            TaskType: detail?.StatusId === 5 ? 'B' : 'A' // A task B Report
        });

        setStatusList({value: detail?.StatusId, label: detail?.StatusName});
        setIsDeadline(dl);
        setIsTimeApprove(TA);

        if (detail.Files !== undefined && detail.Files !== "") {

            let checkfile = detail.Files.split(",").filter(e => e !== "");
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
        if (detail.Files1 !== undefined && detail.Files1 !== "") {

            let checkfile = detail.Files1.split(",").filter(e => e !== "");
            let ListFileName = [];
            for (let i = 0; i < checkfile.length; i++) {
                const splitfn = checkfile[i].split("/");
                ListFileName.push(splitfn[splitfn.length - 1]);
            }
            setViewFiles1(ListFileName);

        }
        else {
            setViewFiles1([]);
        }

        openModal()
    }


    //#region THÊM
    const [Taskinfor, setTaskinfor] = useState({
        TaskId: 0,
        TaskName: "",
        TaskContent: "",
        TaskContentpr: "",
        AssignTo: 0,
        Creater: 0,
        CreateName: "",
        StartTime: "",
        Deadline: "",
        DepartmentId: 0,
        NotesReports: '',
        StatusId: 0,
        StatusName: '',
        TaskType: 'A' // A task B Report

    });

    const [IsDeadline, setIsDeadline] = useState();
    const onDeadline = (item) => {
        setIsDeadline(item)
        setTaskinfor({ ...Taskinfor, Deadline: FormatDateJson(item) })
    }

    const [IsTimeApprove,setIsTimeApprove] = useState(new Date());
    const onTimeApprove = (e) =>{
        setIsTimeApprove(e)
        setTaskinfor({ ...Taskinfor, TimeApprove: FormatDateJson(e) })
    }

    const [TaskContentTMC, setTaskContentTMC] = useState("");
    const Trl_spTask_Save = async () => {
        try {


            if (Taskinfor?.TaskName === "") {
                Alertwarning("Nhập tiêu đề");
                return;
            }

            if (TaskContentTMC === "") {
                Alertwarning("Nhập nội dung");
                return;
            }


            let listfile = "";
            if (FileUpload !== "" && FileUpload.length > 0) {
                const formData = new FormData();
                formData.append("Key", "Files1");
                for (let i = 0; i < FileUpload.length; i++) {
                    formData.append("myFile" + i, FileUpload[i]);

                }
                const data = await mainAction.API_spCallPostFile(formData, dispatch);
                let _img = data.Message.replaceAll('"', '')
                listfile = _img.replace("[", "").replace("]", "");
            }

            let TaskContentpr = ""
            if (Taskinfor?.TaskContent.includes('"')) TaskContentpr = Taskinfor?.TaskContent.replaceAll('"', "||");

            TaskContentpr = Taskinfor?.TaskContentpr.replace(/!|\|~/g, "");

            if (TaskContentpr === "") TaskContentpr = Taskinfor?.TaskContent;


            const pr = {
                TaskId: Taskinfor?.TaskId,
                TaskName: Taskinfor?.TaskName,
                TaskContent: TaskContentTMC,
                Files: Taskinfor?.TaskId === 0 ? listfile : (listfile === "" ? Files : listfile + "," + Files),
                AssignTo: Taskinfor?.AssignTo || 0,
                Deadline: Taskinfor?.Deadline || '2022-12-12',
                Creater: Creater,
                CreateName: CreateName,
                DepartmentId: DepartmentId,
                StatusId: Taskinfor?.TaskType === "B" ? 5 : Taskinfor?.StatusId === 0 ? 1 : Taskinfor?.StatusId,
                StatusName: Taskinfor?.TaskType === "B" ? 'Báo cáo' : Taskinfor?.StatusName === '' ? 'Trong tiến trình' : Taskinfor?.StatusName,
                PositionId: PositionId
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spTask_Save"
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Cancel();
                Trl_spTask_List(0);
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

    const Trl_spTask_Approve = async () => {
        try {

            if (Taskinfor?.TimeApprove === undefined) {
                Alertwarning("Chọn time hoàn thành");
                return;
            }

            let listfile1 = "";
            if (FileUpload1 !== "" && FileUpload1.length > 0) {
                const formData = new FormData();
                formData.append("Key", "Files1");
                for (let i = 0; i < FileUpload1.length; i++) {
                    formData.append("myFile" + i, FileUpload1[i]);

                }
                const data = await mainAction.API_spCallPostFile(formData, dispatch);
                let _img = data.Message.replaceAll('"', '')
                listfile1 = _img.replace("[", "").replace("]", "");
            }

            const pr = {
                TaskId: Taskinfor?.TaskId,
                Files1: Taskinfor?.TaskId === 0 ? listfile1 : (listfile1 === "" ? Files1 : listfile1 + "," + Files1),
                Creater: Creater,
                CreateName: CreateName,
                DepartmentId: DepartmentId,
                NotesReports: Taskinfor?.NotesReports,
                StatusId: Taskinfor?.TaskType === "B" ? 5 : Taskinfor?.StatusId === 0 ? 1 : Taskinfor?.StatusId,
                StatusName: Taskinfor?.TaskType === "B" ? 'Báo cáo' : Taskinfor?.StatusName === '' ? 'Trong tiến trình' : Taskinfor?.StatusName,
                TimeApprove: Taskinfor?.TimeApprove,
                PositionId: PositionId

            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spTask_Approve"
            }

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Cancel();
                Trl_spTask_List(0);
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
        // setTaskId(0);
        // setTaskName("");
        // setTaskContent("");

        // setFiles("");
        // setFileUpload("");
        // setViewFiles([]);

        // setFiles1("");
        // setFileUpload1("");
        // setViewFiles1([]);

        setStatusList({value: 1, label: "Trong tiến trình"});

        setTaskinfor({
            TaskId: 0,
            TaskName: "",
            TaskContent: "",
            TaskContentpr: "",
            AssignTo: 0,
            Creater: 0,
            CreateName: "",
            Deadline: "",
            DepartmentId: 0,
            NotesReports: '',
            Files1: "",
            Files2: "",
            StatusId: 0,
            StatusName: '',

        })

        $(".addf .react-datetime-picker__clear-button").click();
    }
    //#endregion

    //#region DANH SÁCH
    let Datfirst = new Date()
    const [TimeSearch, setTimeSearch] = useState([new Date(Datfirst.getFullYear(), Datfirst.getMonth(), 1),new Date()]);
    const [HeaderInfor, setHeaderInfor] = useState();
    const [StatusType, setStatusType] = useState({ value: 1, label: 'Công việc' });

    const onchangeTimeSearch =(e)=>{
        setTimeSearch(e)
    }

    const onSelecteStatusSearch = (e)=>{
        setStatusListSearch({value:e.value, label: e.label});
        setTaskSearch(e.label);
    }
    const Trl_spTask_List = async (e) => {
        let date = new Date(),
            firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        try {
            const pr = {
                TaskId: 0,
                Creater: Creater,
                CreateName: CreateName,
                DepartmentId: DepartmentId,
                TaskSearch: TaskSearch === "Chọn tất cả"? "" : TaskSearch,
                FromDate: TimeSearch !== undefined ? FormatDateJson(TimeSearch[0]) : FormatDateJson(firstDay),
                ToDate: TimeSearch !== undefined ? FormatDateJson(addHours(TimeSearch[1],12)) : FormatDateJson(date),
                CheckDate: TimeSearch !== undefined   ? 'A' : 'B',
                StatusType: StatusType?.value || 1
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spTask_List"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list?.ReturnMess1 !== undefined) {
                setData(list);
                setData1(list?.ReturnMess1);
                setHeaderInfor({
                    TotalTask: list?.ReturnMess1?.length || 0,
                    Finish: (list?.ReturnMess1?.filter(p => p.StatusId === 2 || p.StatusId === 5)?.length || 0),
                    NotFinish: (list?.ReturnMess1?.length || 0) - (list?.ReturnMess1?.filter(p => p.StatusId === 2 || p.StatusId === 5)?.length || 0),
                    Deadline: list?.ReturnMess1?.filter(p => p.TimeLineOK >= 100)?.length || 0
                })
            }
            else {
                setData([]);
                setData1([]);
                setHeaderInfor({
                    TotalTask: 0,
                    Finish: 0,
                    NotFinish: 0,
                    Deadline: 0
                })
            }
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }

    }

    const Trl_spTask_FilterStatus = (StatusId) => {
        const oldData = [...data1];
        const Datacr = { ...data };
        if (StatusId === 1) {
            $(".FilterStatu2").removeClass("taskblock");
            $(".FilterStatu3").removeClass("taskblock");
            $(".FilterStatu4").removeClass("taskblock");
            Datacr.ReturnMess1 = oldData;
        }
        else if (StatusId === 2) {
            $(".FilterStatu2").addClass("taskblock");
            $(".FilterStatu3").removeClass("taskblock");
            $(".FilterStatu4").removeClass("taskblock");
            Datacr.ReturnMess1 = oldData.filter(p => p.StatusId === 2);

        }
        else if (StatusId === 3) {
            $(".FilterStatu2").removeClass("taskblock");
            $(".FilterStatu3").addClass("taskblock");
            $(".FilterStatu4").removeClass("taskblock");
            Datacr.ReturnMess1 = oldData.filter(p => p.TimeApprove === undefined || p.TimeApprove === null);
        }
        else {
            $(".FilterStatu2").removeClass("taskblock");
            $(".FilterStatu3").removeClass("taskblock");
            $(".FilterStatu4").addClass("taskblock");
            Datacr.ReturnMess1 = oldData.filter(p => p.TimeLineOK >= 100);
        }

        setData(Datacr);
    }

    //#endregion

    const [modalIsOpen, setIsOpen] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }
    const [Files, setFiles] = useState();
    const [ViewFiles, setViewFiles] = useState([])
    const [FileUpload, setFileUpload] = useState("")
    const onFileChange = (event) => {
        let fileok = event.target.files;
        setFileUpload(fileok);
        let filename = [...ViewFiles];
        for (let i = 0; i < fileok.length; i++) {
            filename.push(fileok[i].name);
        }
        setViewFiles(filename);
    };

    const onFileChange1 = (event) => {
        let fileok = event.target.files;
        setFileUpload1(fileok);
        let filename = [...ViewFiles];
        for (let i = 0; i < fileok.length; i++) {
            filename.push(fileok[i].name);
        }
        setViewFiles(filename);
    };

    const Trl_spTask_FileDelete = (filename, key) => {
        if (window.confirm("Bạn có chắc muốn xóa file?")) {

            let fileold = key === "A" ? Files : Files1, // list file gốc
                listfileok = "", // file sau khi đã xóa
                showdata = key === "A" ? [...ViewFiles] : [...ViewFiles1]  // list file đang hiển thị
            if (fileold !== undefined && fileold !== "") {
                let checkfile = fileold.split(",").filter(e => e !== "");
                for (let i = 0; i < checkfile.length; i++) {
                    const splitfn = checkfile[i].split("/").filter(e => e !== "");
                    if (splitfn[splitfn.length - 1] !== filename) {
                        listfileok += checkfile[i] + ',';
                    }
                    if (splitfn[splitfn.length - 1] === filename) {
                        const dbnew = showdata.filter(p => p !== filename);
                        key === "A" ? setViewFiles(dbnew) : setViewFiles1(dbnew)
                    }
                }
                key === "A" ? setFiles(listfileok) : setFiles1(listfileok);
            }
        }

    }

    //handle file upload
    const handleFile = () => {
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);
            handleDataImport(data);
        };
        if (rABS) {
            reader.readAsBinaryString(fileExcelReport);
        } else {
            reader.readAsArrayBuffer(fileExcelReport);
        };
    }

    const handleChangeFileExcel = (e) => {
        const files = e.target.files;
        if (files && files[0]) setFileExcelReport(files[0]);
    }

    const handleDataImport = (dataImport) => {

        let newData = dataImport.length > 0 ?
            dataImport.map((item, index) => {
                return {
                    DateReport: item["NGÀY"],
                    Source: item["NGUỒN"],
                    Name: item["HỌ TÊN"],
                    Phone: item["SĐT"],
                    Email: item["EMAIL"],
                    Tour: item["TOUR"],
                    StartDate: item["NGÀY KH"],
                    DayNumber: item["SỐ NGÀY"],
                    Quanlity: item["SL"],
                    Price: item["ĐƠN GIÁ"],
                    TotalPrice: item["TỔNG THU"],
                    Status: item["TÌNH TRẠNG"],
                    Note: item["NOTE"],
                }
            }).filter(p => p.Name)
            : [];
        if (newData.length === 0) {
            Alertwarning('File Excel không hợp lệ!')
            return
        }
        // setDataReport([...dataReport, ...newData]);
        Trl_spCustomerSummary_Save(newData);
    }

    const changeDayvsMonth = (date) => {
        let arr = date.split('/')
        return `${arr[1]}/${arr[0]}/${arr[2]}`
    }

    const Trl_spCustomerSummary_List = async (value) => {
        value === 0 ? setIsBoss(false) : setIsBoss(true)
        try {
            const pr = value === 0
                ? {
                    Creater: +Creater,
                    FromDate: FormatDateJson(new Date(), 1),
                    ToDate: FormatDateJson(new Date(), 2),
                    DepartmentId: +DepartmentId,
                }
                : {
                    Creater: 0,
                    FromDate: FormatDateJson(dateSearchReport[0], 1),
                    ToDate: FormatDateJson(dateSearchReport[1], 2),
                    DepartmentId: +DepartmentId,
                }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spCustomerSummary_List"
            }

            const respone = await mainAction.API_spCallServer(params, dispatch);
            if (respone && respone.length > 0) {
                let res = respone.map(item => {
                    return {
                        ...item,
                        DateReport: FormatDateJson(item.DateReport, 7),
                        Phone: item.Phone.trim(),
                        CreateTime: FormatDateJson(item.CreateTime, 10)
                    }
                })
                setDataReport(res)
                return
            }
            setDataReport([])

        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }

    }

    const Trl_spCustomerSummary_Save = async (data) => {
        try {
            let dt = data.map(item => {
                return {
                    ...item,
                    Creater: +Creater,
                    DateReport: FormatDateJson(changeDayvsMonth(item.DateReport)),
                    Phone: item.Phone.replaceAll(' ', '')
                }
            })
            const pr = { data: dt }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spCustomerSummary_Save"
            }

            const respone = await mainAction.API_spCallServer(params, dispatch);
            if (respone.Status === 'OK') {
                Alertsuccess(respone.ReturnMess);
                Trl_spCustomerSummary_List(0)
            }

        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }

    }

    const handleClickReport = (value) => {
        setIsOpenReport(true)
        Trl_spCustomerSummary_List(value);
    }

    const columns = [
        {
            Header: 'Options',
            accessor: '[row identifier to be passed to button]',
            fixed: "left",
            width: 80,
            textAlign: "center",
            filterable: false,
            sortable: false,
            Cell: ({ row }) => (

                <span>
                    <button
                        className="btn btn-xs btn-danger" onClick={e => Trl_spCustomerSummary_Delete({ row })}>
                        <i class="fa fa-trash pr-1" ></i> Xóa
                    </button>
                </span>
            )

        },
        {
            Header: 'No',
            Cell: (row) => <span>{row.index + 1}</span>,
            textAlign: "center",
            width: 40,
            filterable: false,
            sortable: false,

        },
        {
            Header: "Ngày",
            accessor: "DateReport",
            minWidth: 100,
            //Cell: renderEditable,
        },
        {
            Header: "Nguồn",
            accessor: "Source",
            minWidth: 150,
            //Cell: renderEditable,
        },
        {
            Header: "Họ tên",
            accessor: "Name",
            minWidth: 200,
            //Cell: renderEditable,
        },
        {
            Header: "SĐT",
            accessor: "Phone",
            minWidth: 150,
            //Cell: renderEditable,
        },
        {
            Header: 'Email',
            accessor: 'Email',
            minWidth: 300,
            textAlign: "center",

            //Cell: renderEditable,

        },
        {
            Header: "Tour",
            accessor: "Tour",
            minWidth: 150,
            //Cell: renderEditable,
        },
        {
            Header: 'Ngày KH',
            accessor: 'StartDate',
            minWidth: 150,
            textAlign: "center",
        },
        {
            Header: 'Số ngày',
            accessor: 'DayNumber',
            disableResizing: true,
            minWidth: 100,
            //Cell: renderEditable,
        },
        {
            Header: 'SL',
            accessor: 'Quanlity',
            disableResizing: true,
            minWidth: 50,
            //Cell: renderEditable,
        },
        {
            Header: 'Đơn giá',
            accessor: 'Price',
            disableResizing: true,
            minWidth: 100,
            maxWidth: 500,
            //Cell: renderEditable,
        },
        {
            Header: 'Tổng thu',
            accessor: 'TotalPrice',
            disableResizing: true,
            minWidth: 150,
            maxWidth: 500,
            //Cell: renderEditable,
        },
        {
            Header: 'Tình trạng',
            accessor: 'Status',
            disableResizing: true,
            minWidth: 250,
            maxWidth: 500,
        },
        {
            Header: 'Note',
            accessor: 'Note',
            minWidth: 200,
            width: 800,
            textAlign: "center",
        },
        {
            Header: 'Người tạo',
            accessor: 'CreateName',
            minWidth: 150,
            textAlign: "center",
        },
        {
            Header: 'Thời gian tạo',
            accessor: 'CreateTime',
            minWidth: 200,
            textAlign: "center",
        }
    ]

    const Trl_spCustomerSummary_Delete = async (item) => {
        try {

            const pr = {
                Id: item.row._original.Id,
                Creater: +Creater
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spCustomerSummary_Delete"
            }

            const respone = await mainAction.API_spCallServer(params, dispatch);
            if (respone.Status === 'OK') {
                Alertsuccess(respone.ReturnMess);
                let v = isBoss ? 1 : 0;
                Trl_spCustomerSummary_List(v)
            }

        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }

    const handleClickExportExcel = () => {
        let newData = dataReport.map(item => {
            return {
                'NGÀY': item.DateReport,
                'NGUỒN': item.Source,
                'HỌ TÊN': item.Name,
                'SĐT': item.Phone,
                'EMAIL': item.Email,
                'TOUR': item.Tour,
                'NGÀY KH': item.StartDate,
                'SỐ NGÀY': item.DayNumber,
                'SL': item.Quanlity,
                'ĐƠN GIÁ': item.Price,
                'TỔNG THU': item.TotalPrice,
                'TÌNH TRẠNG': item.Status,
                'NOTE': item.Note,
                'NGƯỜI TẠO': item.CreateName,
                'THỜI GIAN TẠO': item.CreateTime,
            }
        })
        ExportExcel(newData, 'Báo cáo khách hàng')
    }

    return (
        <>
        <div className="content-wrapper" style={{ backgroundColor: '#ffff' }}>
            <div className="content">
                <div className="container-fluid">
                    <div class="border-left-red card-header  bg-ab ">
                        <div class="row ">
                            <div class="col-sm-12 col-md-3 cardtext " >
                                <h3 class="card-title font-weight-bold ">Quản lý công việc ({data?.ReturnMess1?.length})</h3>
                            </div>

                            <div class="col-sm-12 col-md-9 margin-top-5s">

                                <button type="button" class="btn btn-sm btn-danger pull-right margin-left-10" onClick={e => Trl_spTask_List()}>
                                    <i class="fa fa-search pr-2"></i>
                                    Tìm kiếm
                                </button>
                                <div class="form-group pull-right" style={{ marginTop: '-4px', width: '20%' }}>
                                    <div class="input-group">
                                        <Select className="SelectMeno"
                                            value={StatusType}
                                            onChange={e => setStatusType(e)}
                                            options={[{ value: 1, label: 'Công việc' }, { value: 2, label: 'Báo cáo' }]}
                                        />
                                    </div>
                                </div>
                                <div class="form-group pull-right" style={{ marginTop: '-4px', width: '20%' }}>
                                    <div class="input-group" style={{  display: (+StatusType?.value === 1) ? "block" : "none" }}>
                                        <Select
                                            className="SelectMeno"
                                            value={StatusListSearch}
                                            onChange={onSelecteStatusSearch}
                                            options={ListStatusSearch}
                                        />
                                    </div>
                                </div>
                                <div class="form-group pull-right" style={{ marginTop: '-4px', width: '35%', marginRight: '5px' }}>
                                    <div class="input-group ">
                                        <DateTimeRangePicker className="form-control2 px-1 pb-2px zIndex-300"
                                            value={TimeSearch}
                                            //onChange={date => setTimeSearch(date)}
                                            onChange={onchangeTimeSearch}
                                            format='dd-MM-yyyy' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body border-left-red">

                        <div className='row'>
                            <div class="col-sm-12 col-md-12">

                                <button onClick={VideAdd} type="button" class="btn btn-sm btn-success pull-right margin-left-10">
                                    <i class="fa fa-plus pr-2"></i>
                                    Thêm giao việc
                                </button>

                                {(+DepartmentId === 29 || +DepartmentId === 33) ?
                                    <>
                                        <button onClick={e => handleClickReport(0)} type="button" class="btn btn-sm btn-warning pull-right margin-left-10">
                                            <i class="fa fa-plus pr-2"></i>
                                            Báo cáo sales
                                        </button>
                                        {(+PositionId !== 11 && +PositionId !== 12) && 
                                        <button onClick={e => handleClickReport(1)} type="button" class="btn btn-sm btn-info pull-right margin-left-10">
                                        <i class="fa fa-eye pr-2"></i>
                                        Xem báo cáo tổng
                                    </button>
                                    }
                                        
                                    </> :

                                    <button onClick={VideAddreport} type="button" class="btn btn-sm btn-warning pull-right margin-left-10">
                                        <i class="fa fa-plus pr-2"></i>
                                        Gửi báo cáo
                                    </button>
                                }
                            </div>
                        </div>

                        <div className='row margin-top-5' style={{ marginTop: '10px' }}>
                            <div class="col-md-3 col-sm-6 col-12" onClick={e => Trl_spTask_FilterStatus(1)}>
                                <div class="info-box shadow-sm cursor-pointer">
                                    <span class="info-box-icon bg-info"><i class="fas fa-th-list"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">Số công việc</span>
                                        <span class="info-box-number">{HeaderInfor?.TotalTask || 0}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-12" onClick={e => Trl_spTask_FilterStatus(2)}>
                                <div class="info-box shadow FilterStatu2 cursor-pointer">
                                    <span class="info-box-icon bg-success"><i class="fas fa-plus"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">Hoàn thành</span>
                                        <span class="info-box-number">{HeaderInfor?.Finish || 0}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-12" onClick={e => Trl_spTask_FilterStatus(3)}>
                                <div class="info-box shadow-lg FilterStatu3 cursor-pointer">
                                    <span class="info-box-icon bg-warning"><i class="fa fa-list"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">Chưa hoàn thành</span>
                                        <span class="info-box-number">{HeaderInfor?.NotFinish || 0}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-12" onClick={e => Trl_spTask_FilterStatus(4)}>
                                <div class="info-box shadow-lg FilterStatu4 cursor-pointer">
                                    <span class="info-box-icon bg-danger"><i class="fa fa-list"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">Trễ deadline</span>
                                        <span class="info-box-number">{HeaderInfor?.Deadline || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content margin-top-5">
                            {
                                data?.ReturnMess2?.map((item, index) => {
                                    let classhow = "card-header display-none isdatashow" + index;
                                    return (

                                        <div key={index} className="card card-outline  shadow-sm" style={{ marginTop: index !== 0 ? '-0px' : '10px' }}>
                                            <div class={classhow} ishow="1">
                                                <div class="card-title" style={{ color: '#1547d4', fontWeight: 'bold', marginLeft: '1%' }}>
                                                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                                        <i class="fas fa-minus"></i>
                                                    </button>
                                                    {item?.AssignToName || ""} ({data?.ReturnMess1?.filter(p => p.AssignTo === item.AssignTo).length})
                                                </div>
                                            </div>
                                            <div className="card-body" style={{ marginTop: '-21px'}}>
                                                <div class="form-group">
                                                    <table class="table table-nopadding" style={{ borderTop: '2px solid #fff', scrollbarWidth:'auto'}}>
                                                        <thead>
                                                            {
                                                                StatusType.value === 1 ? (
                                                                    <>
                                                                        <th style={{ width: '15%' }}> Nội dung</th>
                                                                        <th style={{ width: '15%' }}> Người giao</th>
                                                                        <th style={{ width: '20%' }}> Người nhận</th>
                                                                        <th style={{ width: '12%' }}> Trạng thái</th>
                                                                        <th> TimeLine</th>
                                                                        <th> Ngày giao</th>
                                                                        <th> Ngày hết</th>
                                                                        <th> Ngày hoàn thành</th>
                                                                    </>
                                                                ) :
                                                                    (
                                                                        <>
                                                                            <th style={{ width: '15%' }}> Nội dung</th>
                                                                            <th style={{ width: '15%' }}> Người gửi</th>
                                                                            <th style={{ width: '20%' }}> Người nhận</th>
                                                                            <th> Ngày báo cáo</th>
                                                                        </>

                                                                    )
                                                            }

                                                        </thead>
                                                        <tbody>
                                                            {
                                                                data?.ReturnMess1?.filter(p => p.AssignTo === item.AssignTo).map((detail, kdt) => {
                                                                    let cStatus = detail.StatusName;
                                                                    let classStatus = "div-title no-border-radius btn btn-block bg-gradient-danger btn-flat margin-left-5";
                                                                    if (cStatus === "Trong tiến trình") classStatus = "background-blue div-title no-border-radius btn btn-block bg-gradient-warning btn-flat margin-left-5";
                                                                    if (cStatus === "Quá hạn") classStatus = "div-title no-border-radius btn btn-block bg-gradient-warning btn-flat margin-left-5";
                                                                    if (cStatus === "Hoàn thành") classStatus = "div-title no-border-radius btn btn-block bg-gradient-success btn-flat margin-left-5";
                                                                    if (cStatus === "Báo cáo") classStatus = "div-title no-border-radius btn btn-block bg-gradient-success btn-flat margin-left-5";

                                                                    /* check timeline ok */
                                                                    let TimeLineOK = detail.TimeLineOK;
                                                                    let classTimeline = "progress-bar bg-success";
                                                                    if (TimeLineOK >= 50 && TimeLineOK <= "90") classTimeline = "progress-bar bg-warning";
                                                                    if (TimeLineOK > 90) classTimeline = "progress-bar bg-danger";

                                                                    return (
                                                                        <tr key={kdt} onClick={e => Trl_spTask_View(detail)}>
                                                                            <td>
                                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault border-left-red" style={{ textAlign: 'left' }}>
                                                                                    {detail.TaskName}
                                                                                </div>
                                                                            </td>

                                                                            {
                                                                                StatusType.value === 1 ?
                                                                                    (
                                                                                        <>
                                                                                            <td>
                                                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5" alt={detail?.CreateName}>
                                                                                                    <img alt={detail?.CreateName} height="20" class="table-avatar" 
                                                                                                        src={detail.CreateAvatar.length != 0? IMAGES_DOMAIN + detail.CreateAvatar :
                                                                                                            "../../assets/img/avt.png"} 
                                                                                                    />
                                                                                                    <span style={{ marginLeft: '2%' }}> {detail?.CreateName}</span>
                                                                                                </div>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5" alt={detail?.CreateName}>
                                                                                                    <img alt={detail?.AssignTo} height="20" class="table-avatar" 
                                                                                                        src={item?.AssignToAvatar.length != 0? IMAGES_DOMAIN + item?.AssignToAvatar  :
                                                                                                            "../../assets/img/avt.png"} 
                                                                                                    />
                                                                                                    <span style={{ marginLeft: '2%' }}> {detail?.AssignToName}</span>
                                                                                                </div>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div class={classStatus}>
                                                                                                    {detail.StatusName}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                                                    <div class="progress mb-3">
                                                                                                        <div class={classTimeline} role="progressbar" aria-valuenow={detail.TimeLineOK} aria-valuemin="0"
                                                                                                            aria-valuemax="100" style={{ width: detail.TimeLineOK + '%' }}>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                                                    {FormatDateJson(detail?.Createtime ? detail?.Createtime : null, 7)}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                                                    {FormatDateJson(detail?.Deadline ? detail?.Deadline : null, 7)}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                                                    {detail?.TimeApprove ? FormatDateJson(detail?.TimeApprove, 5) : 'NA'}
                                                                                                </div>
                                                                                            </td>
                                                                                        </>

                                                                                    ) :
                                                                                    (
                                                                                        <>
                                                                                            <td>
                                                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5" alt={detail?.CreateName}>
                                                                                                    <img alt={detail?.CreateName} height="20" class="table-avatar" 
                                                                                                        src={detail.CreateAvatar.length != 0? IMAGES_DOMAIN + detail.CreateAvatar :
                                                                                                            "../../assets/img/avt.png"} 
                                                                                                    />
                                                                                                    <span style={{ marginLeft: '2%' }}> {detail?.CreateName}</span>
                                                                                                </div>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5" alt={detail?.CreateName}>
                                                                                                    <img alt={detail?.AssignTo} height="20" class="table-avatar" 
                                                                                                        src={item?.AssignToAvatar.length != 0? IMAGES_DOMAIN + item?.AssignToAvatar  :
                                                                                                            "../../assets/img/avt.png"} 
                                                                                                    />
                                                                                                    <span style={{ marginLeft: '2%' }}> {detail?.AssignToName}</span>
                                                                                                </div>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div class={classStatus}>
                                                                                                    {detail.StatusName}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                                                    {detail?.Deadline ? FormatDateJson(detail?.Deadline, 5) : 'NA'}
                                                                                                </div>
                                                                                            </td>
                                                                                        </>
                                                                                    )
                                                                            }

                                                                        </tr>

                                                                    )


                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
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

                <Modal.Header >
                    <Modal.Title id="example-custom-modal-styling-title">
                        <div class="">
                            {Taskinfor?.TaskType === "A" ? (Taskinfor?.TaskId === 0 ? `Tạo giao việc :` : `Chi tiết giao việc : ${Taskinfor?.TaskName.toUpperCase()}`) : "Gửi báo cáo hàng ngày :"}
                        </div>

                    </Modal.Title>
                    <button type="button" class="close" aria-label="Close" onClick={() => setIsOpen(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div class="card-body addf">
                        <div className='row'>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div>
                                            <span class="input-group-text">{Taskinfor?.TaskType === "A" ? "Tiêu đề" : "Tiêu đề báo cáo"}  (<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="500" class="form-control" value={Taskinfor?.TaskName || ""} onChange={e => setTaskinfor({ ...Taskinfor, TaskName: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-text">{Taskinfor?.TaskType === "A" ? "Người được giao" : "Người nhận báo cáo"} (<strong className='check-point'>*</strong>)</span>
                                        <SelectStaff
                                            onSelected={item => setTaskinfor({ ...Taskinfor, AssignTo: item.value })}
                                            StaffId={Taskinfor?.AssignTo || 0}
                                            onStaffId={Taskinfor?.AssignTo || 0}
                                            BranchId={0}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-text">{Taskinfor?.TaskType === "A" ? "Ngày hạn chót" : "Ngày báo cáo"}(<strong className='check-point'>*</strong>)</span>
                                        <DateTimePicker
                                            onChange={onDeadline}
                                            value={IsDeadline}
                                            format='dd/MM/yyyy HH:mm:ss'
                                        />
                                            
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-4" style={{ display: Taskinfor?.TaskType === 'A' ? "block" : "none" }}>
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-text">Trạng thái</span>
                                        <Select
                                            className="SelectMeno"
                                            value={StatusList}
                                            onChange={onSelecteStatus}
                                            options={ListStatus}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-4" style={{ display: (+Taskinfor?.TaskId !== 0) ? "block" : "none" }}>
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-text">Ngày hoàn thành(<strong className='check-point'>*</strong>)</span>
                                        <DateTimePicker
                                            onChange={onTimeApprove}
                                            value={IsTimeApprove}
                                            format='dd/MM/yyyy HH:mm:ss'
                                         />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-12">
                                <h4>{Taskinfor?.TaskType === "A" ? "Nội dung công việc:" : "Nội dung báo cáo:"}</h4>
                                <div class="form-group">
                                    <div class="input-group">
                                        {/* <textarea rows="9" value={Contents} onChange={e => setContents(e.target.value)} style={{ width: '100%' }}>

                                        </textarea> */}
                                        <TinyMCE
                                            onSelected={e => setTaskContentTMC(e)}
                                            Values={Taskinfor?.TaskContent || ""}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div class="col-sm-12 col-md-6">
                                <div className="form-collapse-default mt-4">
                                    <div className="row">
                                        <a className="form-collapse-link">
                                            {Taskinfor?.TaskType === 'A' ? 'Files giao việc:' : 'File báo cáo'}
                                        </a>
                                    </div>
                                    <div className="row pb-3">
                                        <div className="col-sm-12 col-md-4">
                                            <label class="image-collapse-label">
                                                <input
                                                    type="file"
                                                    className="image-collapse-file"
                                                    onChange={onFileChange}
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
                                                            <i style={{ display: +Taskinfor?.Creater === +Creater ? "Block" : "none" }} className='fa fa-trash' onClick={e => Trl_spTask_FileDelete(filename, "A")}></i> {filename}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='row' style={{ display: Taskinfor?.TaskType === "A" ? "flex" : "none" }}>
                            <div class="col-sm-12 col-md-6" style={{ display: +Taskinfor?.AssignTo === +Creater && +Taskinfor?.StatusId !== 0 ? "block" : "none" }} >
                                <div class="form-group">
                                    <h4>Ghi chú hoàn thành việc</h4>
                                    <div class="input-group">
                                        <textarea style={{ height: '190px' }} class="form-control" value={Taskinfor?.NotesReports || ""} onChange={e => setTaskinfor({ ...Taskinfor, NotesReports: e.target.value })}>

                                        </textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-6" style={{ display: +Taskinfor?.AssignTo === +Creater && +Taskinfor?.StatusId !== 0 ? "block" : "none" }}>
                                <div className="form-collapse-default mt-4">
                                    <div className="row">
                                        <a className="form-collapse-link">
                                            Files hoàn thành việc
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
                                                ViewFiles1.map((filename, index) => {
                                                    return (
                                                        <div className='margin-top-5 hover-deletefile'>
                                                            <i className='fa fa-trash' style={{ display: +Taskinfor?.AssignTo === +Creater ? "Block" : "none" }} onClick={e => Trl_spTask_FileDelete(filename, "B")}></i> {filename}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row' style={{ display: (+Taskinfor?.StatusId === 5 || +Taskinfor?.StatusId === 2) ? "none" : "flex" }}>
                            <div class="col-sm-12 col-md-12">
                                <button onClick={e => setIsOpen(false)} type="button" class="btn btn-sm btn-danger pull-right margin-left-5">
                                    <i class="fa fa-undo pr-2"></i>
                                    Đóng
                                </button>
                                <button type="button" class="btn btn-sm btn-success pull-right margin-left-5" onClick={Trl_spTask_Save} style={{ display: +Taskinfor?.Creater !== +Creater && +Taskinfor?.TaskId !== 0 ? "none" : "flex" }}>
                                    <i class="fa fa-edit pr-2"></i>
                                    {Taskinfor?.TaskType === "A" ? (Taskinfor?.TaskId === 0 ? "Giao việc" : "Cập nhật") : "Gửi báo cáo"}
                                </button>
                                <button type="button" class="btn btn-sm btn-info pull-right margin-left-5" onClick={Trl_spTask_Approve} style={{ display: (+Taskinfor?.AssignTo === +Creater || PositionId <= 7) && Taskinfor?.TaskType === "A" && Taskinfor?.StatusId !== 0 ? "flex" : "none" }}>
                                    <i class="fa fa-edit pr-2"></i>
                                    Hoàn thành
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
                show={isOpenReport}
                onHide={isOpenReport}
                className=' custom-modal-w-90'
                aria-labelledby="example-custom-modal-styling-title"
            >

                <Modal.Header className='p-2' >
                    <Modal.Title id="example-custom-modal-styling-title" className='center-item'>
                        Báo cáo hằng ngày
                        <Link
                            download
                            target="_blank"
                            to="/assets/Excel/mau-tong-hop-khach-hang.xlsx"
                            class="btn btn-sm btn-info ml-4 "
                        >
                            <i class="fas fa-file-upload pr-1"></i>
                            Tải file mẫu
                        </Link>
                        <button
                            type='button'
                            class="btn btn-sm btn-success ml-2 "
                            onClick={handleClickExportExcel}
                        >
                            <i class="fas fa-download pr-1"></i>
                            Export Excel
                        </button>
                    </Modal.Title>

                    <button
                        type="button"
                        class="close"
                        aria-label="Close"
                        onClick={() => {
                            setIsOpenReport(false)
                            setDataReport([])
                        }}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div class="card-body p-0">
                        <div className="row">
                            {!isBoss ?
                                <div className="col-6 m-auto  d-flex">
                                    <input
                                        type="file"
                                        className='form-control2 w-80 mr-3'
                                        onChange={handleChangeFileExcel}
                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    />
                                    <button
                                        className="btn btn-success pull-right"
                                        onClick={handleFile}
                                    >
                                        <i class="fas fa-file-upload mr-1"></i>  Tải lên
                                    </button>
                                </div>
                                : <div className="col-6 m-auto  d-flex">
                                    <div class="input-group w-80 mr-3">
                                        <DateTimeRangePicker className="form-control2 px-1 pb-2px"
                                            value={dateSearchReport}
                                            onChange={date => setDateSearchReport(date)}
                                            format={"dd/MM/yyyy"}
                                        />
                                    </div>
                                    <button
                                        className="btn btn-success pull-right"
                                        onClick={e => Trl_spCustomerSummary_List(1)}
                                    >
                                        <i class="fa fa-search mr-1"></i>Xem
                                    </button>
                                </div>}


                        </div>
                        <div className="table-responsive mt-3">
                            <DataTable
                                columns={columns}
                                data={dataReport}
                                pageSize={10}
                            />
                        </div>

                    </div>
                </Modal.Body>
            </Modal>
        </div>
        </>
    )
}



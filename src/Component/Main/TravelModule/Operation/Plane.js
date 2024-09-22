import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alertwarning, Alertsuccess,
    Alerterror, FormatDateJson,
    ConvertUTCDateToLocalDate,
    CheckTypeFile, FormatMoney,
    ConfirmAlert, ExportExcel,
} from '../../../../Utils';
import { DataTable, SelectInvoiceStatus } from '../../../../Common';
import Select from 'react-select';
import { IMAGES_DOMAIN } from '../../../../Services'
//import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery'
import SignatureCanvas from 'react-signature-canvas'
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import { PlaneTicketForm } from '../Booking/PlaneTicketForm'

export const Plane = () => {

    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const VideAdd = () => {

        openModal()
    }

    const Cancel = () => {

        setNotes("");
        setFiles("");
        setFileUpload("");
        setFileUpload1("");
        setViewFiles([]);
    }
    const onFileChange1 = (event) => {
        let fileok = event.target.files;
        setFileUpload1(fileok);
        let filename = [...ViewFiles];
        for (let i = 0; i < fileok.length; i++) {
            filename.push(fileok[i].name);
        }
        setViewFiles(filename);
    };

    const [data, setData] = useState([])
    const [PlaneSearch, setPlaneSearch] = useState("")
    const [TimeSearch, setTimeSearch] = useState();
    const [TTbooking, setTTbooking] = useState(0);
    const [TTprovider, setTTprovider] = useState(0);
    const Trl_spBookingPlane_List = async () => {

        if (TimeSearch === undefined) {
            Alertwarning("Vui lòng chọn thời gian")
            return;
        }

        try {

            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                PlaneSearch: PlaneSearch,
                FromDate: TimeSearch !== undefined ? FormatDateJson(TimeSearch[0]) : '01/01/2000',
                ToDate: TimeSearch !== undefined ? FormatDateJson(TimeSearch[1]) : '01/01/2000',
                CheckDate: TimeSearch !== undefined ? 'A' : 'B'
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spBookingPlane_List"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            setData(list);
            
            if (list.length > 0) {
                
                let result = [];
                list.reduce(function (res, value) {
                    if (!res[value.BookingId]) {
                        res[value.BookingId] = { BookingId: value.BookingId, qty: 0 };
                        result.push(res[value.BookingId])
                    }
                    res[value.BookingId].qty += value.BookingPlaneId;
                    return res;
                }, {});
                setTTbooking(result.length)

                let result1 = [];
                list.filter(p => p.ProviderId !== 0).reduce(function (res, value) {
                    if (!res[value.ProviderId]) {
                        res[value.ProviderId] = { ProviderId: value.ProviderId, qty: 0 };
                        result1.push(res[value.ProviderId])
                    }
                    res[value.ProviderId].qty += value.ProviderId;
                    return res;
                }, {});
                setTTprovider(result1.length)
            }

        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
            
        }
    }

    const Trl_spBookingPlane_Excel = () => {
        ConfirmAlert("Xác nhận", "Bạn có chắc muốn xuất?", () => {
            let dataexcel = data.map((item, index) => {
                return {
                    "Hóa đơn": item.InvoiceType === "A" ? "Thu" : "Chi",
                    "Loại Hóa đơn": item.StyleName,
                    "Ngày thanh toán": FormatDateJson(item.DatePayment),
                    "Mã hóa đơn": item.InvoiceCode,
                    "Trạng thái": item.StatusName,
                    "Booking/Tour": item.BookingCode + '/' + item.BookingName,
                    "Khách hàng/Đối tác": item.ObName,
                    "Đối tượng": item.ObjectName,
                    "Loại Tiền": item.TypeMoneyName,
                    "Tỷ giá": item.ExchangeRate,
                    "Tổng giá trị": item.TotalMoney,
                    "Giá trị ước tính": item.Money,
                    "VAT": item.VAT,
                    "Giá trị VAT": item.MoneyVAT,
                    "Giá trị thanh toán": item.MoneyPayment,
                    "Phương thức thanh toán": item.PaymentName,
                    "Ghi chú thanh toán": item.NotePayment,
                    "Nội dung thanh toán": item.Decscription,
                    "Người đề nghị": item.CreateName,
                    "Ngày đề nghị": FormatDateJson(item.CreateTime)
                }
            })
            ExportExcel(dataexcel, "Danh sách hóa đơn thanh toán_" + CreateName)
        })
    }
    const [Notes, setNotes] = useState("")

    const [Files, setFiles] = useState();
    const [ViewFiles, setViewFiles] = useState([])
    const [FileUpload, setFileUpload] = useState("")
    const [FileUpload1, setFileUpload1] = useState("")
    const [invoice, setinvoice] = useState({
        InvoiceType: "A",
        DatePayment: new Date(),
        ExchangeRate: "1.0",
        TotalMoney: 0,
        Money: 0,
        VAT: 0,
        Decscription: "",
        NotePayment: "",
        InvoiceId: 0,
        StatusId: 0,
        StatusName: "",
        Files: "",
        CreateConfirmName: "",
        CreateConfirmTime: "",
        ObjectName: "",
        BookingCode: "",
        BookingName: "",
        TypeMoneyName: ""

    })

    const Trl_spCustomer_FileDelete = (filename) => {
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

    const [dataPlane, setdataPlane] = useState({});
    const [bookingIdview, setbookingIdview] = useState();
    const Trl_spBookingPlane_View = async (row) => {
        
        setbookingIdview(row._original.BookingId)
        await setdataPlane(data.filter(p => p.BookingId === row._original.BookingId));
        openModal();
    }

    const Trl_spBookingPlane_Print = async (row) => {
        let viewdata = row._original;
        await setinvoice({
            InvoiceType: viewdata.InvoiceType,
            DatePayment: viewdata.DatePayment,
            ExchangeRate: viewdata.ExchangeRate,
            TotalMoney: viewdata.TotalMoney,
            Money: viewdata.Money,
            VAT: viewdata.VAT,
            MoneyVAT: viewdata.MoneyVAT,
            MoneyPayment: viewdata.MoneyPayment,
            Decscription: viewdata.Decscription,
            NotePayment: viewdata.NotePayment,
            InvoiceId: viewdata.InvoiceId,
            StatusId: viewdata.StatusId,
            StatusName: viewdata.StatusName,
            Files: viewdata.Files,
            CreateConfirmName: viewdata.CreateConfirmName,
            CreateConfirmTime: viewdata.CreateConfirmTime,
            ObjectName: viewdata.ObjectName,
            BookingCode: viewdata.BookingCode,
            BookingName: viewdata.BookingName,
            TypeMoneyName: viewdata.TypeMoneyName,
            ObName: viewdata.ObName,
            CreateName: CreateName
        });

        $(".PrintInvoiceHide").css("display", "none");
        $(".main-footer").css("display", "none");
        $(".main-sidebar").css("display", "none");
        // $(".main-header").css("display", "none");
        $(".PrintInvoice").css("display", "block");
        window.print();
        $(".PrintInvoiceHide").css("display", "block");
        $(".main-footer").css("display", "block");
        $(".main-sidebar").css("display", "block");
        // $(".main-header").css("display", "block");
        $(".PrintInvoice").css("display", "none");
    }


    const columns = [
        {
            Header: 'Lựa chọn',
            accessor: 'Edit',
            Cell: ({ row }) => (
                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-sm btn-success" onClick={e => Trl_spBookingPlane_View(row)}> <i class="fa fa-edit"></i>Cập nhật</button>
                </div>
            ),
            width: 200,
            fixed: "left"
        },
        {
            Header: 'Booking/Tour',
            accessor: 'BookingName',
            width: 350,
            Cell: ({ row }) => { //spread the props
                
                return (
                    <span><a href={`/booking/tour-booking?bookingId=${row._original?.BookingId}&id=18`} target='_blank'>{row._original?.BookingName}</a></span>
                )

            }

        }
        ,
        {
            Header: 'Tổng khách',
            accessor: 'Total',
            width: 150

        },
        {
            Header: "Mã chuyến bay",
            accessor: "PlaneCode",
            width: 200
        },
        {
            Header: "Tên chuyến bay",
            accessor: "PlaneName",
            width: 200
        },
        {
            Header: "Nhà cung cấp",
            accessor: "ProviderName",
            width: 200
        },
        {
            Header: "Đi từ",
            accessor: "GoFrom",
            width: 200
        },
        {
            Header: "Đi đến",
            accessor: "GoTos",
            width: 200
        },
        {
            Header: "T.Gian đi",
            accessor: "FromDate",
            width: 200,
            Cell: ({ row }) => { //spread the props
                return (
                    <span>{FormatDateJson(row._original?.FromDate ? row._original?.FromDate : null, 3)}</span>
                )
            }
        },
        {
            Header: "T.Gian đến",
            accessor: "ToDate",
            width: 200,
            Cell: ({ row }) => { //spread the props
                return (
                    <span>{FormatDateJson(row._original?.ToDate ? row._original?.ToDate : null, 3)}</span>
                )
            }
        },

        {
            Header: "Vé người lớn",
            accessor: "Number_Ticket",
        },
        {
            Header: "Vé trẻ em",
            accessor: "Number_Ticket_Chil",
        }
        ,
        {
            Header: "Tổng giá vé",
            accessor: "Price",
            with: 350,
            Cell: ({ row }) => { //spread the props
                return (
                    <span className="badge badge-success">{FormatMoney(row._original?.Price || 0)}</span>
                )
            }
        },
        {
            Header: "Mã HĐ T.Toán",
            accessor: "InvoiceCode",
        },
        {
            Header: "Trạng thái HĐ",
            accessor: "StatusName",
            width: 200,
            Cell: ({ row }) => { //spread the props
                const fls = row._original.StatusId;
                let kcheck = "badge badge-success"
                if (fls === 1) kcheck = "badge badge-danger";
                else if (fls === 3) kcheck = "badge badge-warning";
                else kcheck = "badge badge-danger";
                return (
                    <span className={kcheck}>{row._original?.StatusName || ''}</span>
                )
            }
        },

        {
            Header: "Số tiền HĐ",
            accessor: "Money",
            with: 350,
            Cell: ({ row }) => { //spread the props
                const fls = row._original.StatusId;
                let kcheck = "badge badge-success"
                if (fls === 1) kcheck = "badge badge-danger";
                if (fls === 3) kcheck = "badge badge-warning";
                return (
                    <span className={kcheck}>{FormatMoney(row._original?.Money || 0)}</span>
                )
            }
        },
        {
            Header: "Người tạo",
            accessor: "CreateName",
            with: 200
        },
        {
            Header: "Thời gian",
            accessor: "CreateTime",
            with: 200
        }
        ,
        {
            Header: "Files",
            accessor: "Files",
            with: 300,
            Cell: ({ row }) => { //spread the props
                const fls = row._original?.Files?.split(",").filter(e => e !== "");
                return fls?.map((fn, id) => {
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
        }
    ];

    const [modalIsOpen, setIsOpen] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }
    const [SignatureInvoice, setSignatureInvoice] = useState();
    const [StatusId, setStatusId] = useState();
    const [NoteConfirm, setNoteConfirm] = useState();
    const Trl_spBookingPlane_Approve = async () => {

        try {

            if (StatusId?.value === "2" && SignatureInvoice === undefined) {
                Alerterror("Vui lòng ký xác nhận thanh toán");
                return
            }

            if (window.confirm("Bạn có chắc chắn muốn xác nhận?")) {

                let Files = "";
                if (SignatureInvoice !== undefined) {
                    let signature = SignatureInvoice.getTrimmedCanvas()
                        .toDataURL('image/png');
                    Files = signature
                }
                let pr = {
                    InvoiceId: invoice.InvoiceId,
                    StatusId: StatusId.value,
                    StatusName: StatusId.label,
                    Notes: NoteConfirm,
                    Files: Files,
                    Creater: Creater,
                    CreateName: CreateName,
                }
                const params = {
                    Json: JSON.stringify(pr),
                    func: "Trl_spBookingPlane_Approve"
                }
                const respone = await mainAction.API_spCallServer(params, dispatch);
                if (respone.Status === 'OK') {
                    Alertsuccess(respone.ReturnMess);
                    if (SignatureInvoice !== undefined) SignatureInvoice.clear();
                    setNoteConfirm("");
                    return;
                }
                else {
                    Alertsuccess(respone.ReturnMess)
                    return;
                }
            }
        } catch (error) {
            Alerterror("Lỗi server, liên hệ IT");
            return
        }

    }

    const Trl_spSignatureInvoice_Clear = () => {
        SignatureInvoice.clear();
    }
    return (
        <>
        <div className="content-wrapper">
            <div class="card-header border-left-red PrintInvoiceHide">
                <div class="row">
                    <div class="col-sm-12 col-md-4" >
                        <h3 class="card-title font-weight-bold">Quản lý vé máy bay({data.length})</h3>
                    </div>
                    <div class="col-sm-12 col-md-8 margin-top-5s">
                        <button disabled={data.length > 0 ? false : true} onClick={Trl_spBookingPlane_Excel} type="button" class="btn btn-sm btn-success pull-right margin-left-5">
                            <i class="fa fa-download pr-2"></i>
                            Excel
                        </button>
                        <button onClick={Trl_spBookingPlane_List} type="button" class="btn btn-sm btn-danger pull-right margin-left-5">
                            <i class="fa fa-search pr-2"></i>
                            Tìm kiếm
                        </button>
                        <div class="form-group pull-right" style={{ marginTop: '-4px' }}>
                            <div class="input-group" style={{ width: '100%' }}>
                                <input type="text" maxLength="500" placeholder="Status Plane,Booking..." class="form-control" value={PlaneSearch} onChange={e => setPlaneSearch(e.target.value)} />
                            </div>
                        </div>
                        <div class="form-group pull-right" style={{ marginTop: '-4px', width: '50%', marginRight: '5px' }}>
                            <div class="input-group ">
                                <DateTimeRangePicker className="form-control2 px-1 pb-2px zIndex-300"
                                    value={TimeSearch}
                                    onChange={date => setTimeSearch(date)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card-body border-left-red PrintInvoiceHide">
                <div className="row">
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="info-box">
                            <span className="info-box-icon bg-infor elevation-1"><i className="fas fa-th-list"></i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">Plane</span>
                                <span className="info-box-number float-left">
                                    {data.filter(p => p.BookingPlaneId !== undefined).length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="clearfix hidden-md-up"></div>

                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="info-box mb-3">
                            <span className="info-box-icon bg-success elevation-1"><i className="fas fa-file"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Booking</span>
                                <span className="info-box-number">
                                    {TTbooking}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="clearfix hidden-md-up"></div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="info-box mb-3">
                            <span className="info-box-icon bg-danger elevation-1"><i className="fas fa-check"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Khách hàng</span>
                                <span className="info-box-number">
                                    {data.reduce((accumulator, object) => {
                                        return accumulator + object.Total;
                                    }, 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="clearfix hidden-md-up"></div>
                    <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box mb-3">
                            <span className="info-box-icon bg-warning elevation-1"><i className="fas fa-undo"></i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">Nhà cung cấp</span>
                                <span className="info-box-number">
                                {TTprovider}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" >
                    <DataTable
                        data={data}
                        columns={columns}
                        IsSearch={true}
                    />
                </div>
            </div>

            <Modal
                show={modalIsOpen}
                onHide={closeModal}
                aria-labelledby="example-custom-modal-styling-title"
                className=' custom-modal-w-90'
            >

                <Modal.Header closeButton >
                    <Modal.Title id="example-custom-modal-styling-title">
                        <div class="text-center">
                            Cập nhật Plane
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PlaneTicketForm data={dataPlane}
                        bookingId={bookingIdview} />
                </Modal.Body>


            </Modal>

            <div className='PrintInvoice' style={{ display: 'none' }}>
                <div class="card">
                    <div class="card-body pt-3">
                        <div className="row booking">
                            <div class="col-sm-12 col-md-12 text-center">
                                <h4>ĐỀ NGHỊ THANH TOÁN</h4>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">NGÀY THANH TOÁN : {FormatDateJson(invoice?.DatePayment)}</span>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">Đối tượng : {invoice?.ObjectName}</span>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">Khách hàng / Đối tác : {invoice?.ObName}</span>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">BOOKING/TOUR : {(invoice?.BookingCode || "") + '/' + (invoice?.BookingName || "")}</span>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">LOẠI TIỀN : {invoice?.TypeMoneyName || ""}</span>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">Tỷ GIÁ : {invoice?.ExchangeRate || ""}</span>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">TỔNG GIÁ TRỊ : {FormatMoney(invoice?.TotalMoney || 0)}</span>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">GIÁ TRỊ TẠM ỨNG : {FormatMoney(invoice?.Money || 0)}</span>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">VAT : {FormatMoney(invoice?.VAT || 0)} |  {FormatMoney(invoice?.MoneyVAT || 0)}</span>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">Đã thanh toán : {FormatMoney(invoice?.MoneyPayment || 0)}</span>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">PHƯƠNG THỨC THANH TOÁN : {invoice?.PaymentName || ""}</span>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">GHI CHÚ THANH TOÁN : {invoice?.NotePayment || ""}</span>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">NỘI DUNG THANH TOÁN : {invoice?.Decscription || ""}</span>
                                </div>
                            </div>
                        </div>
                        <div className="row margin-top-10">
                            <div className="col-md-6 col-sm-12">
                                <div className="row margin-top-5">
                                    <div className='col-md-12'>
                                        <div class="form-group">
                                            <span class="font-weight-bold text-muted">
                                                Người xác nhận thanh toán:
                                            </span>
                                        </div>
                                    </div>
                                    <div className='col-md-12'>
                                        <div class="form-group">
                                            <span class="font-weight-bold text-muted">
                                                Ngày &nbsp; &nbsp;&nbsp;   Tháng &nbsp; &nbsp;&nbsp;   Năm 2022
                                            </span>
                                        </div>
                                    </div>
                                    <div className='col-md-12'>
                                        <div class="form-group">
                                            <span class="font-weight-bold text-muted">
                                                {
                                                    invoice?.Files ?
                                                        (
                                                            <img src={invoice?.Files} alt={invoice.CreateConfirmName} width="150" />
                                                        ) : ""
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className='col-md-12'>
                                        <div class="form-group">
                                            <span class="font-weight-bold text-muted">
                                                {invoice.CreateConfirmName}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <div className="row margin-top-5">
                                    <div className='col-md-12'>
                                        <div class="form-group">
                                            <span class="font-weight-bold text-muted">
                                                Quản lý xác nhận:
                                            </span>
                                        </div>
                                    </div>
                                    <div className='col-md-12'>
                                        <div class="form-group">
                                            <span class="font-weight-bold text-muted">
                                                Ngày &nbsp; &nbsp;&nbsp;   Tháng &nbsp; &nbsp;&nbsp;   Năm 2022
                                            </span>
                                        </div>
                                    </div>
                                    <div className='col-md-12'>
                                        <div class="form-group">
                                            <span class="font-weight-bold text-muted" style={{ height: '50px' }}>

                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
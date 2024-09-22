import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alertwarning, Alertsuccess,
    Alerterror, FormatDateJson,
    FormatMoney,
    ConfirmAlert, ExportExcel,
} from '../../../../Utils';
import { DataTable } from '../../../../Common';
import { IMAGES_DOMAIN } from '../../../../Services'
//import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery'
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import { TourGuiderForm } from '../Booking/TourGuider'
export const Guide = () => {

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
    const [GuideSearch, setGuideSearch] = useState("")
    const [TimeSearch, setTimeSearch] = useState();
    const [TTbooking, setTTbooking] = useState(0);
    const [TTprovider, setTTprovider] = useState(0);

    const Trl_spBookingGuide_List = async () => {

        if (TimeSearch === undefined) {
            Alertwarning("Vui lòng chọn thời gian")
            return;
        }

        try {

            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                GuideSearch: GuideSearch,
                FromDate: TimeSearch !== undefined ? FormatDateJson(TimeSearch[0]) : '01/01/2000',
                ToDate: TimeSearch !== undefined ? FormatDateJson(TimeSearch[1]) : '01/01/2000',
                CheckDate: TimeSearch !== undefined ? 'A' : 'B'
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spBookingGuide_List"
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
                    res[value.BookingId].qty += value.BookingTourGuideId;
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

    const Trl_spBookingGuide_Excel = () => {
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
    const Trl_spBookingGuide_View = async (row) => {
        try {
            const pr = {

                BookingId: +row._original.BookingId,
                CreateName: +Creater,

            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spBooking_TourGuide_View"
            }
            const res = await mainAction.API_spCallServer(params, dispatch);
           
            await setbookingIdview(row._original.BookingId)
            await setdataPlane(res);
            await openModal();
            // setDataBookingStatus(res)
        } catch (error) {
            ;
        }
    }

    const Trl_spBookingGuide_Print = async (row) => {
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
                    <button className="btn btn-sm btn-success" onClick={e => Trl_spBookingGuide_View(row)}> <i class="fa fa-edit"></i>Cập nhật</button>
                </div>
            ),
            width: 200,
            fixed: "left"
        },
        {
            Header: 'Booking/Tour',
            accessor: 'BookingName',
            width: 400,
            Cell: ({ row }) => { //spread the props
                return (
                    <span><a href={`/booking/tour-booking?bookingId=${row._original?.BookingId}&id=18`} target='_blank'>{row._original?.BookingName}</a></span>
                )
            }
        },
        {
            Header: "Trạng thái",
            accessor: "StatusNameTour",
            // Cell: obj => (<span className="badge badge-success">{obj.value}</span>),
            width: 150,
            Cell: ({ row }) => { //spread the props
                let className = "badge bg-danger";
                if (row._original.StatusIdTour === 1)
                    className = 'badge bg-primary'
                else if (row._original.StatusIdTour === 2)
                    className = 'badge bg-warning'
                if (row._original.StatusIdTour === 3)
                    className = 'badge bg-success'
                return (
                    <span className={className}>{row._original.StatusNameTour}</span>
                )
            }
        },
        {
            Header: 'Tổng khách',
            accessor: 'Total',
            width: 150
        },
        {
            Header: "Tour Leader Name",
            accessor: "TourGuideName",
            width: 200
        },
        {
            Header: "Tour Leader Phone",
            accessor: "Phone",
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
            Header: "T.Gian đi",
            accessor: "FromDate",
            width: 200,
            Cell: ({ row }) => { //spread the props
                return (
                    <span>{(row._original?.FromDate ? FormatDateJson(row._original?.FromDate,3) : '')}</span>
                )
            }
        },
        {
            Header: "T.Gian về",
            accessor: "ToDate",
            width: 200,
            Cell: ({ row }) => { //spread the props
                return (
                    <span>{(row._original?.ToDate ? FormatDateJson(row._original?.ToDate,3) : '')}</span>
                )
            }
        },
        {
            Header: "Giá thuê",
            accessor: "Price",
            with: 350,
            Cell: ({ row }) => { //spread the props
                return (
                    <span className="badge badge-success">{FormatMoney(row._original?.Price || 0)}</span>
                )
            }
        },
        {
            Header: "Ghi chú",
            accessor: "Notes",
            with: 200
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
                    <span className={kcheck}>{row._original.StatusName}</span>
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
    const Trl_spBookingGuide_Approve = async () => {

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
                    func: "Trl_spBookingGuide_Approve"
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
                        <h3 class="card-title font-weight-bold">Quản lý Tour Leader({data.length})</h3>
                    </div>
                    <div class="col-sm-12 col-md-8 margin-top-5s">
                        <button disabled={data.length > 0 ? false : true} onClick={Trl_spBookingGuide_Excel} type="button" class="btn btn-sm btn-success pull-right margin-left-5">
                            <i class="fa fa-download pr-2"></i>
                            Excel
                        </button>
                        <button onClick={Trl_spBookingGuide_List} type="button" class="btn btn-sm btn-danger pull-right margin-left-5">
                            <i class="fa fa-search pr-2"></i>
                            Tìm kiếm
                        </button>
                        <div class="form-group pull-right" style={{ marginTop: '-4px' }}>
                            <div class="input-group" style={{ width: '100%' }}>
                                <input type="text" maxLength="500" placeholder="Status Plane,Booking..." class="form-control" value={GuideSearch} onChange={e => setGuideSearch(e.target.value)} />
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
                                <span className="info-box-text">Tour Leader</span>
                                <span className="info-box-number float-left">
                                    {data.filter(p => p.BookingTourGuideId !== undefined).length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="clearfix hidden-md-up"></div>

                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="info-box mb-3">
                            <span className="info-box-icon bg-success elevation-1"><i className="fas fa-file"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Booking/Tour</span>
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

                <Modal.Header  className='p-2 '>
                    <Modal.Title id="example-custom-modal-styling-title ">
                        <div class="text-center ml-2">
                            Cập nhật Tour Leader
                        </div>
                    </Modal.Title>
                    <button type="button" class="close" aria-label="Close" onClick={() => closeModal()}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body class='p-1'>
                    <TourGuiderForm data={dataPlane}
                        bookingId={bookingIdview} />
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
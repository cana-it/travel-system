import { useState } from "react";
import { Modal } from "react-bootstrap"
import DateTimePicker from "react-datetime-picker"
import Select from "react-select";
import { SelectProvider } from "./SelectProvider";
import { SelectService } from "./SelectService";
import { useDispatch } from 'react-redux';
import { mainAction } from "../Redux/Actions";
import { Alertwarning, FormatDateJson } from "../Utils";

export const ModalInvoice = ({
    show,
    handleClose,
    data,
    setOpacity,
    BookingId = 0,
    setInvoiceStatus,
}) => {
    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const [invoice, setInvoice] = useState({
        typeOfMoney: { value: 0, label: "Vui lòng chọn" },
        typeOfPayment: { value: 0, label: "Vui lòng chọn" },
        type: 'A',
        date: new Date(),
    });
    const typeOfMoney = [
        { value: 1, label: 'VND' },
        { value: 2, label: 'USD' },
    ]
    const typeOfPayment = [
        { value: 1, label: 'Tiền mặt' },
        { value: 2, label: 'Chuyển khoản' },
    ]

    const onChange = (e, type) => {
        if (type === 'typeOfMoney') {
            setInvoice({
                ...invoice,
                typeOfMoney: e
            })
        } else {
            setInvoice({
                ...invoice,
                typeOfPayment: e
            })
        }
    }

    const Trl_spInvoice_Save = async () => {
        if (!invoice.service?.value || invoice.service?.value === 0) {
            Alertwarning('Vui lòng chọn dịch vụ');
            return;
        }
        if (!invoice.provider?.value || invoice.provider?.value === 0) {
            Alertwarning('Vui lòng chọn nhà cung cấp ');
            return;
        }
        if (!invoice.typeOfMoney?.value || invoice.typeOfMoney?.value === 0) {
            Alertwarning('Vui lòng chọn loại tiền');
            return;
        }
        if (!invoice.typeOfPayment?.value || invoice.typeOfPayment?.value === 0) {
            Alertwarning('Vui lòng chọn hình thức thanh toán');
            return;
        }
        if (!invoice.date) {
            Alertwarning('Vui lòng chọn ngày thanh toán');
            return;
        }
        if (invoice.rate === '' || invoice.rate === 0) {
            Alertwarning('Vui lòng nhập tỷ giá hợp lệ');
            return;
        }
        if (invoice.totalPrice === '' || invoice.totalPrice === 0) {
            Alertwarning('Vui lòng nhập tổng tiền hợp lệ');
            return;
        }
        if (invoice.advancePrice === '' || invoice.advancePrice === 0) {
            Alertwarning('Vui lòng nhập giá trị tạm ứng hợp lệ');
            return;
        }


        try {
            let pr = {
                InvoiceId: 0,
                InvoiceCode: '',
                InvoiceType: invoice.type, // A thu, B chi
                ObjectId: 0,
                ObjectName: '',
                ObId: 0, // sub of objID
                ObName: '',
                TypeMoney: invoice.typeOfMoney.label,
                ExchangeRate: invoice.rate,
                BookingId: BookingId,
                PaymentType: invoice.typeOfPayment.value,
                PaymentName: invoice.typeOfPayment.label,
                TotalMoney: invoice.totalPrice,
                Money: 0, // ?
                VAT: 0,
                MoneyVAT: 0,
                MoneyPayment: invoice.advancePrice,
                Decscription: invoice.content,
                NotePayment: invoice.note,
                DatePayment: FormatDateJson(invoice.date),
                Creater: Creater,
                CreateName: CreateName
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spInvoice_Save"
            }

            const respone = await mainAction.API_spCallServer(params, dispatch);
            if (respone.Status === 'OK') {
                alert('Thêm thành công');
                setInvoiceStatus('success')
                handleClose();
            }

        } catch (error) {
            
        }
    }

    const cancelInvoice = () => {
        setInvoice({
            typeOfMoney: { value: 0, label: "Vui lòng chọn" },
            typeOfPayment: { value: 0, label: "Vui lòng chọn" },
            type: 'A',
            date: new Date(),
            rate: '',
            totalPrice: '',
            advancePrice: '',
            content: '',
            note: '',
            booking: ''
        })
    }


    return (
        <Modal
            show={show}
            onHide={() => handleClose(5)}
            backdrop="static"
            keyboard={false}
            size="lg"
            className="z-smax"

        >
            <Modal.Header className="py-2 border-bottom-0">
                <Modal.Title className='ml-auto'>ĐỀ NGHỊ THANH TOÁN</Modal.Title>
                <button type="button" class="close" aria-label="Close" onClick={() => {
                    handleClose(5)
                    setOpacity('opacity-1')
                }}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body class='p-1'>

                <div class="card m-1 card-shadow shadow">
                    <div class="card-header card-header-custom p-0 px-1 mt-1">
                        <div class="row d-flex align-items-center justify-content-center">
                            <div class="col-sm-12 col-md-6">
                                <h3 class="card-title font-weight-bold text-muted">Hóa đơn</h3>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <button 
                                type="button" 
                                class="btn btn-sm btn-danger pull-right margin-left-5"
                                onClick={cancelInvoice}
                                 >
                                    <i class="fa fa-trash pr-2"></i>
                                    Hủy bỏ
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-sm btn-success pull-right"
                                    onClick={Trl_spInvoice_Save}
                                >
                                    <i class="fa fa-edit pr-2"></i>
                                    Khởi tạo
                                </button>

                            </div>
                        </div>
                    </div>
                    <div class="card-body pt-3 ">
                        <div className="row  booking">
                            <div className="col-6">
                                <div class="form-group clearfix">
                                    <div class="icheck-success d-inline">
                                        <input 
                                        type="radio" 
                                        name="r3"  
                                        id="radioSuccess1"
                                        checked={invoice.type === 'A'}
                                        onChange={() => setInvoice({...invoice, type: 'A' })}
                                         />
                                        <label for="radioSuccess1">
                                            Thu
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6">
                                <div class="form-group clearfix">
                                    <div class="icheck-success d-inline">
                                        <input 
                                        type="radio" 
                                        name="r3" 
                                        id="radioSuccess2" 
                                        checked={invoice.type === 'B'}
                                        onChange={() => setInvoice({...invoice, type: 'B' })}
                                         />
                                        <label for="radioSuccess2">
                                            Chi
                                        </label>
                                    </div>
                                </div>
                            </div>
                        <div class="col-sm-12 col-md-6">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">NGÀY THANH TOÁN</span>
                                <div class="input-group ">
                                    <DateTimePicker className="form-control2"
                                        value={invoice.date}
                                        onChange={date => setInvoice({ ...invoice, date })}
                                        format={"MM/dd/yyyy"}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">LOẠI DỊCH VỤ</span>
                                <div class="input-group">
                                    <SelectService
                                        onSelected={e => setInvoice({ ...invoice, service: e })}
                                        items={invoice.service?.value || 0}
                                        className={'w-100 select-custom'}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">NHÀ CUNG CẤP</span>
                                <div class="input-group">

                                    <SelectProvider
                                        onSelected={e => setInvoice({ ...invoice, provider: e })}
                                        items={invoice.provider?.value || 0}
                                        className={'w-100 select-custom'}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">BOOKING/TOUR</span>
                                <div class=" input-group">
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={invoice.booking}
                                        onChange={e => setInvoice({ ...invoice, booking: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">LOẠI TIỀN</span>
                                <div class="input-group">

                                    <Select
                                        className={'w-100 select-custom'}
                                        value={invoice.typeOfMoney}
                                        onChange={e => onChange(e, 'typeOfMoney')}
                                        options={typeOfMoney}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">TỈ GIÁ</span>
                                <div class=" input-group">
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={invoice.rate}
                                        onChange={e => setInvoice({ ...invoice, rate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">TỔNG GIÁ TRỊ</span>
                                <div class=" input-group">
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={invoice.totalPrice}
                                        onChange={e => setInvoice({ ...invoice, totalPrice: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">GIÁ TRỊ TẠM ỨNG</span>
                                <div class=" input-group">
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={invoice.advancePrice}
                                        onChange={e => setInvoice({ ...invoice, advancePrice: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">PHƯƠNG THỨC THANH TOÁN</span>
                                <div class="input-group">

                                    <Select
                                        className={'w-100 select-custom'}
                                        value={invoice.typeOfPayment}
                                        onChange={e => onChange(e, 'typeOfPayment')}
                                        options={typeOfPayment}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">GHI CHÚ THANH TOÁN</span>
                                <div class=" input-group">
                                    <textarea
                                        type="text"
                                        class="form-control2"
                                        rows="4"
                                        cols="50"
                                        value={invoice.note}
                                        onChange={e => setInvoice({ ...invoice, note: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">NỘI DUNG THANH TOÁN</span>
                                <div class=" input-group">
                                    <textarea
                                        type="text"
                                        class="form-control2"
                                        rows="4"
                                        cols="50"
                                        value={invoice.content}
                                        onChange={e => setInvoice({ ...invoice, content: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal.Body>

        </Modal >
    )
}
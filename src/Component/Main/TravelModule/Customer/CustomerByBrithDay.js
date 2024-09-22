import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alertwarning, Alertsuccess,
    Alerterror, FormatDateJson,
    ExportExcel,
    CheckTypeFile,
    ConfirmAlert
} from '../../../../Utils';
import { DataTable, SelectBranch, SelectCustomerTypeType } from '../../../../Common';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import { IMAGES_DOMAIN } from '../../../../Services'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery'

export const CustomerByBrithDay = ()=>{

    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const [MonthBD,setMonthBD] = useState(0)
    const [HiddenTable,setHiddenTable] = useState(true)
    const [TitleShow,setTitleShow] = useState('')
    const [DataExcel,setDataExcel] = useState([])
    const [DataTableList,setDataTableList] = useState([])

    const Trl_spCustomer_ListBrithDay = async ()=>{
        let Monthstring = MonthBD.toString().trim(),
            Mt = '';
        Mt = Monthstring.split("-");
        try {
            if(MonthBD === 0)
            {
                Alertwarning("Vui lòng chọn tháng để xem!")
                return
            }
            const pr = {
                MonthCus:parseFloat(Mt[1]),
                Officer:Creater,
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spCustomer_ListBrithDay"
            }

            const result = await mainAction.API_spCallServer(params, dispatch);
            if(result.length != 0){
                setDataTableList(result)
                setTitleShow(`Khách hàng có ngày sinh trong tháng ${parseFloat(Mt[1])} : ${result.length} người`)
                setHiddenTable(false)

                const newData = result.map(item => {
                    return {
                        'Tên KH': item.CustomerName,
                        'Mã KH': item.CustomerCode,
                        'Mã Tour': item.BookingCode,
                        'Số ĐT': item.Phone,
                        'Giới Tính': item.Sex,
                        'Ngày Sinh': FormatDateJson(item.Brithday,7),
                        'PassPort':item.PassportCode,
                        'Ngày cấp': item.PassportTimeFrom == ''? item.PassportTimeFrom: FormatDateJson(item.PassportTimeFrom,7),
                        'Ngày hết': item.PassportTimeTo == ''? item.PassportTimeTo: FormatDateJson(item.PassportTimeTo,7),
                        'Sales': item.StaffName,
                        'Địa Chỉ KH':item.Address,
                    }
                })
                setDataExcel(newData)
            }
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
            setHiddenTable(true)
            
        }
    }

    const columns = [
        {
            Header: "STT",
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 40,
            textAlign: "center",
            filterable: false,
            sortable: false,
        },
        {
            Header: 'Tên Khách Hàng',
            accessor: 'CustomerName',
            width: 250,
        },
        {
            Header: 'Mã Khách Hàng',
            accessor: 'CustomerCode',
            width: 250,
        },
        {
            Header: 'Mã Tour',
            accessor: 'BookingCode',
            width: 250,
        },
        {
            Header: 'Số ĐT',
            accessor: 'Phone',
            width: 150,
        },
        {
            Header: 'Giới Tính',
            accessor: 'Sex',
            width: 100,
        },
        {
            Header: 'Sinh Nhật',
            accessor: 'Brithday',
            width: 200,
            Cell: ({ row }) => (<span>{FormatDateJson(row._original.Brithday,7)}</span>),
        },
        {
            Header: 'PassPort',
            accessor: 'PassportCode',
            width: 200,
        },
        {
            Header: 'Ngày Cấp',
            accessor: 'PassportTimeFrom',
            width: 200,
            Cell: ({ row }) => (row._original.PassportTimeFrom == ''?<span></span>:<span>{FormatDateJson(row._original.PassportTimeFrom,7)}</span>),
        },
        {
            Header: 'Ngày Hết',
            accessor: 'PassportTimeTo',
            width: 200,
            Cell: ({ row }) => (row._original.PassportTimeTo == ''?<span></span>:<span>{FormatDateJson(row._original.PassportTimeTo,7)}</span>),
        },
        {
            Header: 'Sales',
            accessor: 'StaffName',
            width: 250,
        },
        {
            Header: 'Địa Chỉ',
            accessor: 'Address',
            width: 350,
        },
    ];

    return(
        <>
            <div className="content-wrapper pt-1 px-2 pb-2">
                <div class="card p-1 PrintInvoiceHide">
                    <div class="card-header border-left-red">
                        <div class="row">
                            <div class="col-sm-12 col-md-3 margin-top-5s">
                                TÌM KIẾM KHÁCH HÀNG
                            </div>
                            <div class="col-sm-12 col-md-9 margin-top-5s">
                                <button
                                onClick={()=>{
                                    ConfirmAlert("Xác nhận", "Bạn có muốn xuất Excel không?", () => {
                                        ExportExcel(DataExcel,TitleShow);
                                    });
                                }}
                                type="button"
                                class="btn btn-sm btn-success pull-right margin-left-5"
                                >
                                <i class="fa fa-download pr-2"></i>
                                Excel
                                </button>
                                <button
                                onClick={(e) => {
                                    Trl_spCustomer_ListBrithDay();
                                }}
                                type="button"
                                class="btn btn-sm btn-danger pull-right margin-left-5"
                                >
                                <i class="fa fa-search pr-2"></i>
                                Tìm kiếm
                                </button>
                                <div
                                    class="form-group pull-right"
                                    style={{ marginTop: "-4px", marginRight: "5px" }}
                                >
                                    <div class="input-group ">
                                        <input 
                                            type="month" 
                                            className="form-control" 
                                            key="start" 
                                            id="start" 
                                            name="start" 
                                            value={MonthBD} 
                                            onChange={e => setMonthBD(e.target.value)} 
                                        
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body border-left-red">
                        <div className="row">
                            <div className={HiddenTable === true ? "card display-none" : "card display-block"}>
                                <div class="card-header d-flex">
                                    <div class="d-flex">
                                        <div class="font-weight-bold text-muted">{TitleShow}</div>
                                    </div>
                                </div>
                                <div className="card-body p-1 pl-0">
                                    <div className="col-md-12">
                                        <div class="table-responsive">
                                        <DataTable
                                            data={DataTableList}
                                            columns={columns}
                                        />
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
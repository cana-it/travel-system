import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alerterror, FormatDateJson,
    ConfirmAlert,
    ExportExcel
} from '../../../../Utils';
import { DataTable, SelectDepartment, SelectStaff } from '../../../../Common';
import Select from 'react-select';
import { IMAGES_DOMAIN } from '../../../../Services'
//import Modal from 'react-modal';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { useLocation } from 'react-router-dom';

export const LeaveManage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const Dpid = localStorage.getItem("Dpid");

    const [data, setData] = useState([])
    const [DataExcel,setDataExcel] = useState([])
    const [TypeLeave,setTypeLeave] = useState({ value: 'C', label: 'Chọn tất cả' })
    const [DepartId,setDepartId] = useState(0)
    const [StaffId,setStaffId] = useState(0)

    //#region DANH SÁCH
    
    const [leaveDateSearch, setleaveDateSearch] = useState()
    const Trl_spLeave_List = async () => {
        try {
            
            const pr = {
                DepartId: DepartId,
                FromDate: leaveDateSearch !== undefined ? FormatDateJson(leaveDateSearch[0]) : '01/01/2000',
                Todate: leaveDateSearch !== undefined ? FormatDateJson(leaveDateSearch[1]) : '01/01/2000',
                CheckDate: leaveDateSearch !== undefined ? 'A' : 'B',
                StaffId: StaffId,
                TypeLeave: TypeLeave.value,
                Creater: Creater,
                CreateName: CreateName

            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spLeave_Management_List"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            if(list.length > 0){
                setData(list);
                const newData = list.map(item => {
                    return {
                        'Mã đơn': item.LeaveCode,
                        'NV đăng ký': item.CreateName,
                        'Phong ban': item.DepartmentName,
                        'Trạng thái': item.IsConfirm === "A"? "Đả phê duyệt" : item.IsConfirm === "B" && item.IsConfirmTime === 0 ? "Người tạo chưa xác nhận"
                                        : item.IsConfirm === "B" && item.IsConfirmTime === 1 ? "Quản lý chưa xác nhận": "Chư phê duyệt",
                        'QL Xác nhận': item.ConfirmName1,
                        'TG QL xác nhận': item.ConfirmTime1 === undefined ? "": FormatDateJson(item.ConfirmTime1,5),
                        'Người xác nhận': item.ConfirmName2,
                        'TG xác nhận':  item.ConfirmTime2 === undefined ? "": FormatDateJson(item.ConfirmTime2,5),
                        'Ngày đăng ký': FormatDateJson(item.TimeLeave,5),
                        'Số ngày nghỉ': item.NumberLeave,
                        'Loại nghỉ phép': item.TypeLeaveName,
                        'Lý do':item.Reason,
                        'Ghi chú':item.Note,
                    }
                })
                setDataExcel(newData)
            }else{
                setData([])
            }

        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
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
            Header: "Status",
            accessor: "IsConfirm",
            Cell: ({ row }) => (
                <div>
                    {row._original.IsConfirm === "A" &&
                        <span  className='btn btn-success btn-sm m-1 btn-add'>Đã phê duyệt</span>}

                    {row._original.IsConfirm === "B" && row._original.IsConfirmTime === 0 &&
                        <span  className='btn btn-danger btn-sm m-1 btn-add'>Người tạo chưa xác nhận</span>
                    }
                    {row._original.IsConfirm === "B" && row._original.IsConfirmTime === 1 &&
                        <span  className='btn btn-warning btn-sm m-1 btn-add'>Quản lý chưa xác nhận</span>
                    }
                    {row._original.IsConfirm === "B" && row._original.IsConfirmTime === 2 &&
                        <span  className='btn btn-info btn-sm m-1 btn-add'>Chưa phê duyệt</span>
                    }
                </div>
            ),
            minWidth: 200
        },
        {
            Header: "Mã đơn",
            accessor: "LeaveCode",
            minWidth: 230
        },
        {
            Header: "Phòng ban",
            accessor: "DepartmentName",
            minWidth: 230
        },
        {
            Header: 'Nhân viên',
            accessor: 'CreateName',
            minWidth: 180
        },
        {
            Header: "QL xác nhận",
            accessor: "ConfirmName1",
            minWidth: 200
        },
        {
            Header: "Thời gian QL xác nhận",
            accessor: "ConfirmTime1",
            Cell: ({ row }) => (
                <div>
                    {row._original.ConfirmTime1 === undefined ?<></>:
                        <span>{FormatDateJson(row._original.ConfirmTime1,5)}</span>
                    }
                </div>
            ),
            minWidth: 200
        },
        {
            Header: "Người xác nhận",
            accessor: "ConfirmName2",
            minWidth: 200
        },
        {
            Header: "Thời gian xác nhận",
            accessor: "ConfirmTime2",
            Cell: ({ row }) => (
                <div>
                    {row._original.ConfirmTime2 === undefined ?<></>:
                        <span>{FormatDateJson(row._original.ConfirmTime2,5)}</span>
                    }
                </div>
            ),
            minWidth: 200
        },
        {
            Header: "Ngày đăng ký",
            accessor: "TimeLeave",
            Cell: (obj) => FormatDateJson(obj.value,5),
            width: 150
        },
        {
            Header: "Số ngày nghỉ",
            accessor: "NumberLeave",
            width: 150
        },
        {
            Header: "Loại nghỉ phép",
            accessor: "TypeLeaveName",
            width: 150
        },
        {
            Header: "Lý do",
            accessor: "Reason",
            minWidth: 300
        },
        {
            Header: "Ghi chú",
            accessor: "Note",
            minWidth: 250
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
            accessor: "CreateName",
            minWidth: 150
        },
        {
            Header: "Thời gian",
            accessor: "CreateTime",
            Cell: (obj) => FormatDateJson(obj.value,7),
            minWidth: 150
        },
        {
            Header: "Người Sửa",
            accessor: "EditName",
            minWidth: 150
        },
        {
            Header: "Thời gian sửa",
            accessor: "EditTime",
            Cell: ({ row }) => (
                <div>
                    {row._original.EditTime === undefined ?<></>:
                        <span>{FormatDateJson(row._original.EditTime,7)}</span>
                    }
                </div>
            ),
            minWidth: 150
        }
    ];

    //#endregion


    return (
        <>
        <div className="content-wrapper">
            <div className="card card-primary">
                <div class="card-header border-left-red">
                    <div class="row">
                        <div class="col-sm-12 col-md-2" >
                            <h3 class="card-title font-weight-bold">Quản lý nghỉ phép ({data.length})</h3>
                        </div>
                        <div class="col-sm-12 col-md-10 margin-top-5s">
                            <button onClick={Trl_spLeave_List} type="button" class="btn btn-sm btn-danger pull-right margin-left-5">
                                <i class="fa fa-search pr-2"></i>
                                Tìm kiếm
                            </button>
                            <button
                                onClick={()=>{
                                    ConfirmAlert("Xác nhận", "Bạn có muốn xuất Excel không?", () => {
                                        ExportExcel(DataExcel,"Danh sách đăng ký nghỉ phép");
                                    });
                            }}
                                type="button"
                                class="btn btn-sm btn-success pull-right margin-left-5"
                                >
                                <i class="fa fa-download pr-2"></i>
                                Excel
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <div class="row">
                        <div class="col-xs-12 col-sm-6 col-md-3 m-auto">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">
                                    Theo khoảng thời gian đăng ký
                                </span>
                                <div class="input-group">
                                    <DateTimeRangePicker className="form-control2"
                                        value={leaveDateSearch}
                                        onChange={date => setleaveDateSearch(date)}
                                        format={"dd/MM/yyyy"}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-3 m-auto">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">
                                    Theo phòng bàn
                                </span>
                                <div class="input-group">
                                    <SelectDepartment className="SelectMeno"
                                        onSelected={e => setDepartId(e.value)}
                                        onDepartmentId={DepartId}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-3 m-auto">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">
                                    Theo nhân viên
                                </span>
                                <div class="input-group">
                                    <SelectStaff
                                        onSelected={e => setStaffId(e.value)}
                                        onAccountId={StaffId}
                                        items={StaffId}
                                        BranchId={0}
                                        DepartmentId={DepartId}
                                        onStaffId={StaffId}

                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-3 m-auto">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">
                                    Theo loại nghỉ phép
                                </span>
                                <div class="input-group">
                                    <Select className="SelectMeno"
                                        value={TypeLeave}
                                        onChange={e => setTypeLeave(e)}
                                        options={[
                                            { value: 'C', label: 'Chọn tất cả' },
                                            { value: 'A', label: 'Nghỉ phép thường'},
                                            { value: 'B', label: 'Nghỉ phép năm'},
                                        ]}
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
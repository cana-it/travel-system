import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { DataTable } from "../../../../Common";
import { mainAction } from "../../../../Redux/Actions";
import { Alertsuccess, Alertwarning, FormatDateJson, FormatMoney, ConfirmAlert } from "../../../../Utils";
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import { IMAGES_DOMAIN } from '../../../../Services';
export const Booking_ByStaff_Report = () => {

    const dispatch = useDispatch();
    const CreateBy = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const [data, setData] = useState([]);
    const columns = [
        {
            Header: 'Lựa chọn',
            accessor: 'Edit',
            fixed: 'left',
            Cell: ({ row }) => (
                <div>
                    <button
                        className=" btn btn-sm btn-success"
                    >
                        <i class="fa fa-eye mr-1"></i>
                        Chi tiết
                    </button>
                </div>
            )
        },
        {
            Header: "Nhân viên",
            accessor: "StaffName",
            Cell: ({ row }) => { //spread the props
                if (row._original?.Avatar) {
                    return (
                        <div className="direct-chat-msg">
                            <img className="direct-chat-img" src={IMAGES_DOMAIN + row._original?.Avatar} alt="" /> <br/>
                            <span className="badge badge-warning">{row._original?.StaffName}</span>
                        </div>
                    )
                }
            },
            fixed: 'left',
            width: 150
        },
        {
            Header: 'Phòng ban',
            accessor: 'DepartmentName',
            fixed: 'left',
            width: 100
        },
        {
            Header: 'Doanh số bán',
            accessor: 'Revenue',
            width: 150,
            Cell: obj => (<span className="">{FormatMoney(obj.value)}</span>)
        },
        {
            Header: '% Hoa hồng',
            accessor: 'HH',
            width: 150
        }
        ,
        {
            Header: 'Tiền hoa hồng',
            accessor: 'RevenueHH',
            width: 200,
            Cell: obj => (<span className="badge badge-danger">{FormatMoney(obj.value)}</span>)
        },
        {
            Header: 'Số Tour bán',
            accessor: 'TourNumber',
            width: 100
        },
        {
            Header: 'Tháng/Năm',
            accessor: 'TimeStart',
            width: 100
        },
        {
            Header: "D.số chưa giảm giá",
            accessor: "PriceTour",
            // Cell: obj => (<span className="badge badge-success">{obj.value}</span>),
            width: 150,
            Cell: ({ row }) => { //spread the props
                return (
                    <span className="badge bg-success">{FormatMoney(row._original?.PriceTour || 0)}</span>
                )
            }
        },
        {
            Header: 'Phụ thu tour',
            accessor: 'Surcharge',
            width: 100,
            Cell: obj => (<span className="">{FormatMoney(obj.value)}</span>)
        },
        {
            Header: 'Giám giá',
            accessor: 'Discount',
            width: 100,
            Cell: obj => (<span className="">{FormatMoney(obj.value)}</span>)
        }
       
    ];

    const [TourHeadinfor, setTourHeadinfor] = useState({})
    const [bookingDateSearch, setbookingDateSearch] = useState([new Date(), new Date()]) 
    const Trl_spBooking_ByStaff_Report = async () => {
        try {

            if(bookingDateSearch === null || bookingDateSearch.length === 0)
            {
                Alertwarning("Vui lòng chọn thời gian");
                return;
            }

            const pr = {
                TimeStart: FormatDateJson(bookingDateSearch[0]),
                TimeEnd: FormatDateJson(bookingDateSearch[1]),
                Creater: +CreateBy,
                CreateName: CreateName
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spBooking_ByStaff_Report"
            }
            const respone = await mainAction.API_spCallServer(params, dispatch);
            if (respone.length > 0) {
                setData(respone);
                setTourHeadinfor({
                    Revenue: respone.reduce((a, b) => a + b.Revenue, 0),
                    RevenueHH: respone.reduce((a, b) => a + b.RevenueHH, 0),
                    TourNumber: respone.reduce((a, b) => a + b.TourNumber, 0)
                });
            }
        } catch (error) {
            ;
        }
    }
    return (
        <>
        <div className="content-wrapper">
            <div class="card-header z-10">
                    <div class="row">
                        <div class="col-sm-12 col-md-3" >
                            <h3 class=" font-weight-bold fs-16 text-muted">Doanh số bán tour theo nhân viên ({data?.length || 0})</h3>
                        </div>
                        <div class="col-sm-12 col-md-9">

                            <button
                                type="button"
                                class="btn btn-sm btn-danger pull-right margin-left-5 margin-top-5s"
                                onClick={Trl_spBooking_ByStaff_Report}>
                                <i class="fa fa-search pr-2"></i>
                                Tìm kiếm
                            </button>
                            <div class="form-group pull-right mt-10px ">
                                <div class="input-group ">
                                    <DateTimeRangePicker className="form-control2 px-1 pb-2px"
                                        value={bookingDateSearch}
                                        onChange={date => setbookingDateSearch(date)}
                                        format={"dd/MM/yyyy"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div className="row" style={{ display: TourHeadinfor === undefined ? 'none' : 'flex' }}>
                        <div className="col-12 col-sm-6 col-md-4">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-success elevation-1"><i className="fas fa-list"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Số tour bán</span>
                                    <span className="info-box-number">
                                        {FormatMoney(TourHeadinfor?.TourNumber || 0)} 
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="clearfix hidden-md-up"></div>
                        <div className="col-12 col-sm-6 col-md-4">
                            <div className="info-box">
                                <span className="info-box-icon badge bg-primary elevation-1"><i className="fas fa-list"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Doanh số bán</span>
                                    <span className="info-box-number float-left">
                                        {FormatMoney(TourHeadinfor?.Revenue || 0)} VND
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-danger elevation-1"><i className="fas fa-list"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Tiền hoa hồng</span>
                                    <span className="info-box-number">
                                        {FormatMoney(TourHeadinfor?.RevenueHH || 0)} VND
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <DataTable
                            data={data}
                            columns={columns}
                            IsSearch={true}
                        />
                    </div>
                </div>
        </div>
        </>
    )
}


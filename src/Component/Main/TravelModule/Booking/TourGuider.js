import { useEffect } from "react";
import { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useDispatch } from "react-redux";
import { SelectProvider, SelectStaff } from "../../../../Common";
import { mainAction } from "../../../../Redux/Actions";
import { Alertsuccess, Alertwarning, FormatDateJson, FormatMoney, ConfirmAlert } from "../../../../Utils";

export const TourGuiderForm = ({
    data = [],
    setData,
    handleShow = () => { },
    setOpacity = () => { },
    bookingId = 0,
    onTourGuider = () => { },
}) => {

    useEffect(() => {
        data.length > 0 && setTourGuider({
            ...data[0],
            PassportFromdate: data[0]?.PassportFromdate ?  new Date(data[0].PassportFromdate) : new Date(data[0].PassportTimeFrom),
            PassportTodate: data[0]?.PassportTodate ?  new Date(data[0].PassportTodate) : new Date(data[0].PassportTimeTo),
            Fromdate: new Date(data[0].Fromdate),
            Todate: new Date(data[0].Todate),
            Passport: data[0]?.Passport !== '' ? data[0].Passport : data[0].PassportCode,
            
        })
    }, []);

    const dispatch = useDispatch();
    const [tourGuider, setTourGuider] = useState({});
    const CreateBy = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const Trl_spBooking_TourGuide_Save = async () => {
        try {
            const pr = {
                BookingTourGuideId: tourGuider?.BookingTourGuideId || 0,
                BookingId: bookingId,
                TourGuideName: tourGuider?.TourGuideName || '',
                Phone: tourGuider?.Phone || '',
                TourGuideCode: tourGuider?.TourGuideCode || '',
                Passport: tourGuider?.Passport || '',
                PassportFromdate: FormatDateJson(tourGuider?.PassportFromdate),
                PassportTodate: FormatDateJson(tourGuider?.PassportTodate),
                Fromdate: FormatDateJson(tourGuider?.Fromdate),
                Todate: FormatDateJson(tourGuider?.Todate),
                Creater: +CreateBy,
                CreateName: CreateName,
                Notes: tourGuider?.Notes || '',
                ProviderId: tourGuider?.ProviderId || 0,
                Price: tourGuider?.Price || 0,
                StaffId: tourGuider?.StaffId || 0,
            }
          
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spBooking_TourGuide_Save"
            }
            const respone = await mainAction.API_spCallServer(params, dispatch);
            if (respone && respone.Status === 'OK') {
                Alertsuccess(respone.ReturnMess)
                setData([{ ...data[0], ...pr, BookingTourGuideId: respone.BookingTourGuideId }]);
            }
        } catch (error) {
            ;
        }
    }

    const onGuiderStaff = (e) => {
        Trl_spStaff_Infor(+e.value);
    }



    const Trl_spStaff_Infor = async (StaffId) => {

        try {
            const pr = {
                StaffId: StaffId,
                DepartmentId: 0,
                BranchId: 0,
                StaffSearch: '',
                Creater: +CreateBy
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spStaff_List"
            }
            const respone = await mainAction.API_spCallServer(params, dispatch);
            if (respone.length > 0) {
                setTourGuider(
                    {
                        ...tourGuider,
                        TourGuideName: respone[0].StaffName,
                        Phone: respone[0].Phone,
                        Passport: respone[0].PassportCode,
                        PassportFromdate: respone[0]?.PassportTimeFrom ? new Date(respone[0]?.PassportTimeFrom) : new Date(),
                        PassportTodate: respone[0]?.PassportTimeTo ? new Date(respone[0]?.PassportTimeTo) : new Date(),
                        StaffId: StaffId
                    })
            }
        } catch (error) {
            ;
        }
    }

    const Trl_spBooking_TourGuide_Delete = async () => {
        ConfirmAlert("Hủy guide", "Bạn có chắc muốn hủy thông tin này?", async () => {
            try {
                const pr = {
                    BookingTourGuideId: tourGuider?.BookingTourGuideId,
                    BookingId: tourGuider?.BookingId,
                    Creater: +CreateBy,
                    CreateName: CreateName
                }
                const params = {
                    Json: JSON.stringify(pr),
                    func: "Trl_spBooking_TourGuide_Delete"
                }
                const respone = await mainAction.API_spCallServer(params, dispatch);
                if (respone.Status === "OK") {
                    Alertsuccess(respone.ReturnMess);
                    setTourGuider({})
                }
                else {
                    Alertwarning(respone.ReturnMess);
                    return
                }
            } catch (error) {
                ;
            }
        })
    }

    return (
        <>
            <div className="row booking">
                <div className="col-md-12">
                    <div class="card m-1 card-shadow">
                        <div class="card-header card-header-custom">
                            <div class="row center-item">
                                <div class="col-sm-12 col-md-6">
                                    <h3 class="card-title font-weight-bold text-muted">Thêm Tour Leader</h3>
                                </div>
                                <div class="col-sm-12 col-md-6 ">
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-danger pull-right margin-left-5"
                                        onClick={Trl_spBooking_TourGuide_Delete}
                                    >
                                        <i class="fa fa-trash pr-2"></i>
                                        Hủy bỏ
                                    </button>
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-success pull-right"
                                        onClick={() => Trl_spBooking_TourGuide_Save()}
                                    >
                                        <i class="fa fa-edit pr-2"></i>
                                        Lưu
                                    </button>

                                </div>
                            </div>
                        </div>
                        <div class="card-body pt-3 ">
                            <div className="row">
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">NHÀ CUNG CẤP THUÊ GUIDE(NẾU CÓ)</span>
                                        <div class="input-group">

                                            <SelectProvider
                                                onSelected={e => setTourGuider({ ...tourGuider, provider: e, ProviderId: e.value })}
                                                onProviderId={tourGuider?.ProviderId || 0}
                                                ProviderTypeId={5}
                                                className={'w-100 select-custom'}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">TOUR LEADER CÔNG TY</span>
                                        <div class=" input-group">
                                            <SelectStaff
                                                onSelected={e => onGuiderStaff(e)}
                                                onStaffId={tourGuider?.StaffId || 0}
                                                className={'w-100 select-custom'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">TÊN TOUR LEADER</span>
                                        <div class=" input-group">
                                            <input
                                                type="text"
                                                class="form-control2"
                                                value={tourGuider?.TourGuideName || ''}
                                                onChange={e => setTourGuider({ ...tourGuider, TourGuideName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">SỐ ĐIỆN THOẠI</span>
                                        <div class=" input-group">
                                            <input
                                                type="text"
                                                class="form-control2"
                                                value={tourGuider?.Phone || ''}
                                                onChange={e => setTourGuider({ ...tourGuider, Phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">SỐ PASSPORT</span>
                                        <div class=" input-group">
                                            <input
                                                type="text"
                                                class="form-control2"
                                                value={tourGuider?.Passport || ''}
                                                onChange={e => setTourGuider({ ...tourGuider, Passport: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">NGÀY CẤP</span>
                                        <div class="input-group ">
                                            <DateTimePicker className="form-control2"
                                                value={tourGuider?.PassportFromdate || new Date()}
                                                onChange={date => setTourGuider({ ...tourGuider, PassportFromdate: date })}
                                                format={"dd/MM/yyyy"}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-4">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">NGÀY HẾT HẠN</span>
                                        <div class="input-group ">
                                            <DateTimePicker className="form-control2"
                                                value={tourGuider?.PassportTodate || new Date()}
                                                onChange={date => setTourGuider({ ...tourGuider, PassportTodate: date })}
                                                format={"dd/MM/yyyy"}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">NGÀY XUẤT PHÁT</span>
                                        <div class="input-group ">
                                            <DateTimePicker className="form-control2"
                                                value={tourGuider?.Fromdate || new Date()}
                                                onChange={date => setTourGuider({ ...tourGuider, Fromdate: date })}
                                                format={"hh:mm MM/dd/yyyy"}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">NGÀY KẾT THÚC</span>
                                        <div class="input-group ">
                                            <DateTimePicker className="form-control2"
                                                value={tourGuider?.Todate || new Date()}
                                                onChange={date => setTourGuider({ ...tourGuider, Todate: date })}
                                                format={"hh:mm MM/dd/yyyy"}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {
                                    tourGuider?.ProviderId ?
                                        (
                                            <>
                                                <div class="col-sm-12 col-md-6">
                                                    <div class="form-group">
                                                        <span class="small font-weight-bold text-muted">SỐ TIỀN THUÊ GUIDE(NẾU CÓ)</span>
                                                        <div class=" input-group">
                                                            <input
                                                                type="text"
                                                                class="form-control2"
                                                                value={tourGuider?.Price ? FormatMoney(tourGuider?.Price) : 0}
                                                                onChange={e => setTourGuider({ ...tourGuider, Price: FormatMoney(e.target.value, 1), Money: FormatMoney(e.target.value, 1) })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-12 col-md-6">
                                                    <div class="form-group">
                                                        <span class="small font-weight-bold text-muted">TÌNH TRẠNG THANH TOÁN(NẾU CÓ)</span>
                                                        {(!tourGuider?.StatusId || tourGuider.StatusId === 1) && <div
                                                            className="  text-center modal-payment-pending"
                                                            onClick={() => {
                                                                if (tourGuider?.BookingTourGuideId && tourGuider?.BookingTourGuideId !== 0) {
                                                                    handleShow(9)
                                                                    setOpacity('opacity-0')
                                                                } else {
                                                                    Alertwarning('Vui lòng khởi tạo trước khi thanh toán')
                                                                }

                                                            }}
                                                        >
                                                            <span class="text-danger">{tourGuider?.StatusName || 'Đề nghị thanh toán'}</span>
                                                        </div>

                                                        }
                                                        {tourGuider?.StatusId && tourGuider.StatusId === 2 && <div
                                                            className="  text-center modal-payment-success"
                                                            onClick={() => {
                                                                if (tourGuider?.BookingTourGuideId && tourGuider?.BookingTourGuideId !== 0) {
                                                                    handleShow(9)
                                                                    setOpacity('opacity-0')
                                                                } else {
                                                                    Alertwarning('Vui lòng khởi tạo vé trước khi thanh toán')
                                                                }

                                                            }}
                                                        >
                                                            <span class="text-success">{tourGuider?.StatusName}</span>
                                                        </div>

                                                        }
                                                    </div>
                                                </div>

                                            </>

                                        ):''
                                }

                                <div class="col-sm-12 col-md-12">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">GHI CHÚ</span>
                                        <div class=" input-group">
                                            <textarea
                                                type="text"
                                                class="form-control2"
                                                rows="5"
                                                cols="50"
                                                value={tourGuider?.Notes || ''}
                                                onChange={e => setTourGuider({ ...tourGuider, Notes: e.target.value })}
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


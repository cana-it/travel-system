import { useState } from "react";
import { useDispatch } from "react-redux";
import { SelectProvider } from "../../../../Common";
import { mainAction } from "../../../../Redux/Actions";
import { Alerterror, Alertsuccess, FormatMoney } from "../../../../Utils";

export const HotelForm = ({
    data = [],
    setData,
    handleShow = () => { },
    setOpacity = () => { },
    bookingId = 0,
}) => {

    const dispatch = useDispatch();
    const CreateBy = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const [hotel, setHotel] = useState();

    const Trl_spBooking_CustomerRoomHotel_Save = async () => {
        try {
            const pr = {
                BookingId: bookingId,
                BookingRoomHotelId: hotel.BookingRoomHotelId || 0,
                RoomCode: hotel?.RoomCode || "",
                RoomName: hotel?.RoomName || "",
                Price: +hotel?.Price || 0,
                ProviderId: +hotel.ProviderId || 0,
                Notes: hotel.Notes || "",
                InvoiceId: hotel.InvoiceId || 0,
                Number_Room: +hotel.Number_Room || 0,
                Number_RoomDB: +hotel.Number_RoomDB || 0,
                Creater: +CreateBy,
                CreateName: CreateName

            }
            
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spBooking_CustomerRoomHotel_Save"
            }
            const res = await mainAction.API_spCallServer(params, dispatch);
            if(res && res.Status === 'OK'){
                Alertsuccess(res.ReturnMess)
                pr.BookingRoomHotelId !== 0 
                ? setData(data.filter(item => item.BookingRoomHotelId !== pr.BookingRoomHotelId).concat(pr)) 
                : setData([...data], pr)
                setHotel({ProviderId: 0})
            }
        } catch (error) {
            Alerterror('Có lỗi xảy ra, vui lòng thử lại sau')
            ;
        }
    }

    const handleClickDetail = (item) => {
        setHotel(item)
    }

    return (
        <>
            <div className="row booking">
                <div className="col-md-6">
                    <div class="card m-1 card-shadow" >
                        <div class="card-header card-header-custom  ">
                            <div class="row center-item">
                                <div class="col-sm-12 col-md-6" >
                                    <h3 class="card-title font-weight-bold text-muted">
                                        Danh sách
                                    </h3>
                                </div>
                                <div class="col-sm-12 col-md-6">
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-success pull-right"
                                    >
                                        <i class="fa fa-eye pr-2"></i>
                                        Xem
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body table-responsive p-0">
                            {/* <div className="table-responsive ">
                                        <DataTable
                                            data={bookingDetails}
                                            columns={columnsDetail}
                                            IsSearch={false}
                                            showPagination={false}
                                            showPageSizeOptions={false}

                                        />
                                    </div> */}
                            {
                                data.map((item, index) => {
                                  return (
                                    <div class="small-box bg-hotel m-2 shadow-sm" key={index}>
                                    <div class="inner">
                                        <h4>{item.RoomCode} - {item.RoomName}</h4>
    
                                        <p className='mb-1'><b>{item.Number_Room}</b> Phòng đơn - <b>{item.Number_RoomDB}</b> Phòng đôi</p>
                                        <p className='mb-1'>Tổng chi phí: {FormatMoney(item.Price)} VND</p>
                                    </div>
                                    <div class="icon">
                                        <i class="fas fa-hotel"></i>
                                    </div>
                                    <div 
                                    class="small-box-footer cursor-pointer"
                                    onClick={() => handleClickDetail(item)}
                                    >
                                        Xem chi tiết và chỉnh sửa <i class="fas fa-arrow-circle-right"></i>
                                        </div>
                                </div>
                                  )
                                })
                            }



                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div class="card m-1 card-shadow">
                        <div class="card-header card-header-custom">
                            <div class="row center-item">
                                <div class="col-sm-12 col-md-6">
                                    <h3 class="card-title font-weight-bold text-muted">Thêm mới khách sạn</h3>
                                </div>
                                <div class="col-sm-12 col-md-6">
                                    <button 
                                    type="button"
                                     class="btn btn-sm btn-danger pull-right ml-1" 
                                        onClick={() => setHotel({ProviderId: 0})}
                                     >
                                        <i class="fa fa-trash pr-2"></i>
                                        Hủy bỏ
                                    </button>
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-success pull-right"
                                        onClick={Trl_spBooking_CustomerRoomHotel_Save}

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
                                        <span class="small font-weight-bold text-muted">NHÀ CUNG CẤP</span>
                                        <div class="input-group">

                                            <SelectProvider
                                                onSelected={e => setHotel({ ...hotel, provider: e, ProviderId: e.value })}
                                                onProviderId={hotel?.ProviderId || 0}
                                                ProviderTypeId={3}
                                                className={'w-100 select-custom'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">MÃ KHÁCH SẠN</span>
                                        <div class=" input-group">
                                            <input
                                                type="text"
                                                class="form-control2"
                                                value={hotel?.RoomCode || ''}
                                                onChange={e => setHotel({ ...hotel, RoomCode: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">TÊN SÁCH SẠN</span>
                                        <div class=" input-group">
                                            <input
                                                type="text"
                                                class="form-control2"
                                                value={hotel?.RoomName || ''}
                                                onChange={e => setHotel({ ...hotel, RoomName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">SỐ PHÒNG ĐƠN</span>
                                        <div class=" input-group">
                                            <input
                                                type="text"
                                                class="form-control2"
                                                value={hotel?.Number_Room || ''}
                                                onChange={e => setHotel({ ...hotel, Number_Room: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">SỐ PHÒNG ĐÔI</span>
                                        <div class=" input-group">
                                            <input
                                                type="text"
                                                class="form-control2"
                                                value={hotel?.Number_RoomDB || ''}
                                                onChange={e => setHotel({ ...hotel, Number_RoomDB: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">TỔNG TIỀN</span>
                                        <div class=" input-group">
                                            <input
                                                type="text"
                                                class="form-control2"
                                                value={FormatMoney(hotel?.Price || 0)}
                                                onChange={e => setHotel({ ...hotel, Price: FormatMoney(e.target.value, 1) })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">GHI CHÚ</span>
                                        <div class=" input-group">
                                            <textarea
                                                type="text"
                                                class="form-control2"
                                                rows="5" cols="50"
                                                value={hotel?.Notes || ''}
                                                onChange={e => setHotel({ ...hotel, Notes: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <span class="small font-weight-bold text-muted">TÌNH TRẠNG THANH TOÁN</span>
                                        <div
                                            className="  text-center modal-hotel__payment-pending"
                                            onClick={() => {
                                                handleShow(5)
                                                setOpacity('opacity-0')
                                            }
                                            }
                                        >
                                            <span class="text-danger">Đề nghị thanh toán</span>
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
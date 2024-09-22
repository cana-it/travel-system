import { useEffect } from "react";
import { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useDispatch } from "react-redux";
import { SelectProvider } from "../../../../Common";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertsuccess,
  Alertwarning,
  FormatDateJson,
  FormatMoney,
  HandleZeroCalendar,
} from "../../../../Utils";
import $ from "jquery";

export const PlaneTicketForm = ({
  data = [],
  setData,
  handleShow = () => {},
  setOpacity = () => {},
  bookingId = 0,
  Booking,
  DataObject,
  onFlight = () => {},
  onPlaneId = () => {},
}) => {
  const [flight, setFlight] = useState({});
  const dispatch = useDispatch();
  const CreateBy = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");

  const Trl_spBooking_CustomerPlane_Save = async () => {
    try {
      const pr = {
        BookingId: +bookingId,
        BookingPlaneId: +flight.BookingPlaneId || 0,
        PlaneCode: flight.PlaneCode || "",
        PlaneName: flight.PlaneName || "",
        ProviderId: +flight.ProviderId || 0,
        GoFrom: flight.GoFrom || "",
        GoTos: flight.GoTos || "",
        FromDate: FormatDateJson(flight.FromDate, 0) || "",
        ToDate: FormatDateJson(flight.ToDate, 0) || "",
        Number_Ticket: +flight.Adult || 0,
        Number_Ticket_Chil: +flight.Child || 0,
        Price: +flight.TotalPrice || 0,
        Creater: +CreateBy,
        CreateName: CreateName,
        InvoiceId: +flight?.InvoiceId || 0,
        Note: flight?.Note || "",
      };
      //return
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBooking_CustomerPlane_Save",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res && res.Status === "OK") {
        Alertsuccess(res.ReturnMess);
        if (pr.BookingPlaneId !== 0) {
          let dataold = [...data];
          dataold = dataold.filter(
            (p) => p.BookingPlaneId !== pr.BookingPlaneId
          );
          setData(
            [
              ...dataold,
              {
                ...pr,
                BookingPlaneId: +res.BookingPlaneId,
                PlaneCodeEnd: res.PlaneCodeEnd,
                FromDate: new Date(pr.FromDate),
                ToDate: new Date(pr.ToDate),
              },
            ].sort((a, b) => {
              return a.BookingPlaneId - b.BookingPlaneId;
            })
          );
        } else {
          setData([
            ...data,
            {
              ...pr,
              BookingPlaneId: +res.BookingPlaneId,
              PlaneCodeEnd: res.PlaneCodeEnd,
              FromDate: new Date(pr.FromDate),
              ToDate: new Date(pr.ToDate),
            },
          ]);
        }
        setFlight({ ProviderId: 0 });
      }
    } catch (error) {
      ;
    }
  };

  const Trl_spBooking_CustomerPlane_Delete = async (item) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      try {
        const pr = {
          BookingId: +item?.BookingId,
          BookingPlaneId: +item?.BookingPlaneId || 0,
        };
        //return
        const params = {
          Json: JSON.stringify(pr),
          func: "Trl_spBooking_CustomerPlane_Delete",
        };

        const res = await mainAction.API_spCallServer(params, dispatch);
        if (res && res.Status === "OK") {
          let dataold = [...data];
          dataold = dataold.filter(
            (p) => p.BookingPlaneId !== pr.BookingPlaneId
          );
          setData(
            dataold.sort((a, b) => {
              return a.BookingPlaneId - b.BookingPlaneId;
            })
          );
        }
      } catch (error) {
        ;
      }
    }
  };

  const handleClickDetail = (item) => {
    onPlaneId({ ...item, BookingPlaneId: item?.BookingPlaneId || 0 });
    setFlight({
      ...item,
      Adult: item.Number_Ticket,
      Child: item.Number_Ticket_Chil,
      TotalPrice: item.Price,
    });
  };

  const onFromDate = (date) => {
    setFlight({ ...flight, FromDate: date });
  };
  const onToDate = (date) => {
    // $(".react-datetime-picker__inputGroup__leadingZero").html("")
    setFlight({ ...flight, ToDate: date });
  };

  return (
    <>
      <div className="row booking">
        <div className="col-md-6">
          <div class="card m-1 card-shadow">
            <div class="card-header card-header-custom">
              <div class="row center-item">
                <div class="col-sm-12 col-md-6">
                  <h3 class="card-title font-weight-bold text-muted">
                    Danh sách
                  </h3>
                </div>
                <div class="col-sm-12 col-md-6"></div>
              </div>
            </div>
            <div class="card-body table-responsive p-0">
              {data.map((item, index) => {
                return (
                  <div class="small-box bg-hotel m-2 shadow-sm " key={index}>
                    <div class="inner">
                      <h4 className="ml-0 text-warning mb-1">
                        {item.PlaneCodeEnd}
                      </h4>
                      <p className="mb-1">
                        Giờ khởi hành: {FormatDateJson(item.FromDate, 5)} -{" "}
                        {FormatDateJson(item.ToDate, 5)}
                      </p>
                      <p className="mb-1">
                        <b>{item.Number_Ticket}</b> Vé người lớn -{" "}
                        <b>{item.Number_Ticket_Chil}</b> trẻ em
                      </p>
                      <p className="mb-1">
                        Tổng chi phí: {FormatMoney(item.Price)} VND
                      </p>
                    </div>
                    <div class="icon">
                      <i class="fas fa-plane"></i>
                    </div>
                    <div class="small-box-footer cursor-pointer ">
                      <span onClick={() => handleClickDetail(item)}>
                        Xem chi tiết và chỉnh sửa{" "}
                        <i class="fas  fa-arrow-circle-right mr-3"></i>
                      </span>
                      <span
                        onClick={() => Trl_spBooking_CustomerPlane_Delete(item)}
                        className=" btn btn-sm btn-light py-0"
                      >
                        <i class="fas  fa-delete "></i>Xóa bỏ
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div class="card m-1 card-shadow">
            <div class="card-header  card-header-custom">
              <div class="row center-item">
                <div class="col-sm-12 col-md-6">
                  <h3 class="card-title font-weight-bold text-muted">
                    Thêm vé máy bay
                  </h3>
                </div>
                <div class="col-sm-12 col-md-6 ">
                  <button
                    type="button"
                    class="btn btn-sm btn-danger pull-right margin-left-5"
                    onClick={() => setFlight({ ProviderId: 0 })}
                  >
                    <i class="fa fa-trash pr-2"></i>
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-success pull-right"
                    onClick={() => Trl_spBooking_CustomerPlane_Save()}
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
                    <span class="small font-weight-bold text-muted">
                      NHÀ CUNG CẤP
                    </span>
                    <div class="input-group">
                      <SelectProvider
                        onSelected={(e) =>
                          setFlight({
                            ...flight,
                            provider: e,
                            ProviderId: e.value,
                          })
                        }
                        onProviderId={flight?.ProviderId || 0}
                        ProviderTypeId={1}
                        className={"w-100 select-custom"}
                      />
                    </div>
                  </div>
                </div>

                <div class="col-sm-12 col-md-6">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      MÃ CHUYẾN BAY
                    </span>
                    <div class=" input-group">
                      <input
                        type="text"
                        class="form-control2"
                        value={flight?.PlaneCode || ""}
                        onChange={(e) =>
                          setFlight({ ...flight, PlaneCode: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-6">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      XUẤT PHÁT TỪ
                    </span>
                    <div class=" input-group">
                      <input
                        type="text"
                        class="form-control2"
                        value={flight?.GoFrom || ""}
                        onChange={(e) =>
                          setFlight({ ...flight, GoFrom: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-6">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">ĐẾN</span>
                    <div class=" input-group">
                      <input
                        type="text"
                        class="form-control2"
                        value={flight?.GoTos || ""}
                        onChange={(e) =>
                          setFlight({ ...flight, GoTos: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div class="col-sm-12 col-md-6">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      KHỞI HÀNH LÚC
                    </span>
                    <div class="input-group ">
                      <DateTimePicker
                        className="form-control2"
                        value={
                          flight?.FromDate ? new Date(flight?.FromDate) : ""
                        }
                        onChange={(date) => onFromDate(date)}
                        /* format={"hh:mm MM/dd/yyyy"} */
                        format={"dd/MM/yyyy HH:mm"}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-6">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      HẠ CÁNH LÚC
                    </span>
                    <div class="input-group ">
                      <DateTimePicker
                        className="form-control2"
                        value={flight?.ToDate ? new Date(flight?.ToDate) : ""}
                        onChange={(date) => onToDate(date)}
                        format={"dd/MM/yyyy HH:mm"}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-4">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      SỐ VÉ NGƯỜI LỚN
                    </span>
                    <div class=" input-group">
                      <input
                        type="text"
                        class="form-control2"
                        value={flight?.Adult || ""}
                        onChange={(e) =>
                          setFlight({ ...flight, Adult: +e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-4">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      SỐ VÉ TRẺ EM
                    </span>
                    <div class=" input-group">
                      <input
                        type="text"
                        class="form-control2"
                        value={flight?.Child || ""}
                        onChange={(e) =>
                          setFlight({ ...flight, Child: +e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div class="col-sm-12 col-md-4 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      TỔNG TIỀN
                    </span>
                    <div class=" input-group">
                      <input
                        type="text"
                        class="form-control2"
                        value={FormatMoney(flight?.TotalPrice || 0)}
                        onChange={(e) =>
                          setFlight({
                            ...flight,
                            TotalPrice: FormatMoney(e.target.value, 1),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-6">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      GHI CHÚ
                    </span>
                    <div class=" input-group">
                      <textarea
                        type="text"
                        class="form-control2"
                        rows="5"
                        cols="50"
                        value={flight?.Note || ""}
                        onChange={(e) =>
                          setFlight({ ...flight, Note: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-6">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      TÌNH TRẠNG THANH TOÁN
                    </span>
                    {(!flight?.StatusId || flight.StatusId === 1) && (
                      <div
                        className="  text-center modal-payment-pending"
                        onClick={() => {
                          if (
                            flight?.BookingPlaneId &&
                            flight?.BookingPlaneId !== 0
                          ) {
                            handleShow(9);
                            setOpacity("opacity-0");
                          } else {
                            Alertwarning(
                              "Vui lòng khởi tạo vé trước khi thanh toán"
                            );
                          }
                        }}
                      >
                        <span class="text-danger">
                          {flight?.StatusName || "Đề nghị thanh toán"}
                        </span>
                      </div>
                    )}
                    {flight?.StatusId && flight.StatusId === 2 && (
                      <div
                        className="  text-center modal-payment-success"
                        onClick={() => {
                          if (
                            flight?.BookingPlaneId &&
                            flight?.BookingPlaneId !== 0
                          ) {
                            handleShow(9);
                            setOpacity("opacity-0");
                          } else {
                            Alertwarning(
                              "Vui lòng khởi tạo vé trước khi thanh toán"
                            );
                          }
                        }}
                      >
                        <span class="text-success">{flight?.StatusName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

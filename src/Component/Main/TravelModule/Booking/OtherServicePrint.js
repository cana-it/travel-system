import React, { useEffect, useState } from "react";
import $ from "jquery";
import { FormatDateJson, FormatMoney } from "../../../../Utils";
import { Img } from "react-image";
const OtherServicePrintComp = ({
  onDataBooking = () => {},
  onFlightList = () => {},
  onInfoRoom = () => {},
}) => {
  const [Invoice, setInvoice] = useState();
  const [FlightList, setFlightList] = useState();
  const [InfoRoom, setInfoRoom] = useState("");
  useEffect(() => {
    setInvoice(onDataBooking);
    if (onDataBooking?.dataDetail !== undefined) {
      $(".PrintBookingNone").css("display", "none");
      $(".main-footer").css("display", "none");
      $(".main-sidebar").css("display", "none");
      // $(".main-header").css("display", "none");
      $(".PrintBooking").css("display", "block");
      $("body").css("zoom", "70%");
      setTimeout(function () {
        window.print();
        $(".PrintBookingNone").css("display", "block");
        $(".main-footer").css("display", "block");
        $(".main-sidebar").css("display", "block");
        // $(".main-header").css("display", "block");
        $(".PrintBooking").css("display", "none");
        $("body").css("zoom", "100%");
      }, 1000);
    }
  }, [onDataBooking]);

  useEffect(() => {
    setFlightList(onFlightList);
  }, [onFlightList]);

  useEffect(() => {
    setInfoRoom(onInfoRoom);
  }, [onInfoRoom]);

  return (
    <>
      <div
        className="row booking landscape"
        style={{ backgroundColor: "#fff" }}
      >
        <div class="col-sm-2 text-center">
          <Img
            src="../dist/img/logo.png"
            height="70px"
            style={{ marginleft: "20%", marginTop: "20px" }}
          />
        </div>
        <div
          class="col-sm-8"
          style={{
            textAlign: "center",
            verticalAlign: "middle",
            lineHeight: "50px",
            fontSize: "25px",
            textTransform: "uppercase",
            paddingTop: "20px",
          }}
        >
          {Invoice?.BookingName}
        </div>
        {/* <div class="col-sm-2 mt-2">
                    <div className='row'>
                        <div className='col-md-12 mt-1'>
                            <span class="small"><strong>VÉ NGƯỜI LỚN</strong> : {FormatMoney(Invoice?.Price1 || 0)}</span>
                        </div>
                        <div className='col-md-12 mt-1'>
                            <span class="small"><strong>VÉ TRẺ EM</strong> : {FormatMoney(Invoice?.Price2 || 0)}</span>
                        </div>
                        <div className='col-md-12 mt-1'>
                            <span class="small"><strong>VÉ EM BÉ</strong> : {FormatMoney(Invoice?.Price3 || 0)}</span>
                        </div>
                    </div>
                </div> */}
        {/* <div class="col-sm-12" style={{ marginTop: "15px" }}>
                    <div class="progress" style={{ height: "30px" }}>
                        <div class="progress-bar progress-bar-success bg-success" role="progressbar" aria-valuenow="33" style={{ width: "33%", height: "30px", fontSize: "18px" }}>
                            {FormatDateJson(Invoice?.Deadline1From || "", 3)} - {FormatDateJson(Invoice?.Deadline1To || "", 3)}
                        </div>
                        <div class="progress-bar progress-bar-warning bg-warning" role="progressbar" aria-valuenow="34" style={{ width: "34%", height: "30px", fontSize: "18px" }}>
                            {FormatDateJson(Invoice?.Deadline2From || "", 3)} - {FormatDateJson(Invoice?.Deadline2To || "", 3)}
                        </div>
                        <div class="progress-bar progress-bar-danger bg-danger" role="progressbar" aria-valuenow="33" style={{ width: "33%", height: "30px", fontSize: "18px" }}>
                            {FormatDateJson(Invoice?.Deadline3From || "", 3)} - {FormatDateJson(Invoice?.Deadline3To || "", 3)}
                        </div>
                    </div>

                </div> */}
        {/* <div class="col-sm-12 mt-2">
                    <div className='row'>
                        <div className='col-sm-4 pl-2'>
                            <div className='print-border'>
                                <span className='title-absolute'>THÔNG TIN DEALINE</span>
                                <span class="block small">Dealine hoàn tất hồ sơ: {FormatDateJson(Invoice?.DeadlineFinish || "", 3)}</span>
                                <span class="block small">Dealine visa: {FormatDateJson(Invoice?.DeadlineVisa || "", 3)}</span>
                            </div>
                        </div>
                        <div className='col-sm-4 pl-2'>
                            <div className='print-border'>
                                <span className='title-absolute'>THÔNG TIN MÁY BAY</span>
                                {
                                    FlightList?.length > 0 && FlightList?.map((item, index) => {
                                        return (
                                            <span class="block small" key={"plane" + index}>{item.PlaneCodeNew}</span>
                                        )
                                    })
                                }
                                {
                                    FlightList?.length === 0 && <span class="block small">Chưa có thông tin</span>
                                }
                            </div>
                        </div>
                        <div className='col-sm-4 pl-2'>
                            <div className='print-border'>
                                <span className='title-absolute'>THÔNG TIN PHÒNG</span>
                                <span class="block small">{InfoRoom ?? "Chưa có thông tin"}</span>
                            </div>

                        </div>

                        {/* <div className='col-md-3'>
                        <h4>Thông tin Landtour</h4>
                        <div class="form-group">
                            <span class="small font-weight-bold text-muted">Lantour-AUS-USA</span> <br />
                            <span class="small font-weight-bold text-muted">16/01/2022</span>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <h4>Thông tin Guide</h4>
                        <div class="form-group">
                            <span class="small font-weight-bold text-muted">Antony Guide Leader</span> <br />
                            <span class="small font-weight-bold text-muted">16/01/2022</span>
                        </div>
                    </div>
                    </div>
                </div> */}
        <div class="col-sm-12 col-md-12 mt-3">
          <table
            className="table bg-white table-work-break table-bordered"
            cellPadding={1}
            width={"100%"}
          >
            <thead style={{}}>
              <tr>
                <th>No</th>
                <th>Full Name</th>
                <th>Sex</th>
                <th>DOB</th>
                <th>Tel</th>
                <th>Register Date</th>
                <th>Price Tour</th>
                <th>Discount</th>
                <th>Surcharge</th>
                <th>Payment 1</th>
                <th>Payment 2</th>
                <th>Payment 3</th>
                <th>Sale</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {Invoice?.dataDetail
                ?.filter((p) => p.StatusCustomer === "OK")
                .map((item, index) => {
                  return (
                    <tr key={"PrinDetai" + index}>
                      <td>{index + 1}</td>
                      <td>{item?.Name || ""}</td>
                      <td>{item?.Sex.label || ""}</td>
                      <td>{item?.DOB || ""}</td>
                      <td>{item?.Tel || ""}</td>
                      <td>{item?.RegisterDate || ""}</td>
                      <td>{FormatMoney(item?.TourPrice || 0)}</td>
                      <td>{FormatMoney(item?.Endow || 0)}</td>
                      <td>{FormatMoney(item?.Surchage || 0)}</td>
                      <td>{FormatMoney(item?.Payment1 || 0)}</td>
                      <td>{FormatMoney(item?.Payment2 || 0)}</td>
                      <td>{FormatMoney(item?.Payment3 || 0)}</td>
                      <td>{item?.Sale || ""}</td>
                      <td>{item?.Note || ""}</td>
                    </tr>
                  );
                })}
              {Invoice?.dataDetail?.filter((p) => p.StatusCustomer === "OK")
                .length === 0 && (
                <tr>
                  <td colSpan={23} class="text-center">
                    Chưa có thông tin{" "}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* <div class="col-sm-12 col-md-12 margin-top-5">
                <div class="form-group">
                    <span class="small font-weight-bold text-muted">GHI CHÚ THANH TOÁN </span> <br />
                    <span class="small font-weight-bold text-muted">{Invoice?.Notes || ""}</span>
                </div>
            </div>
            <div class="col-sm-12 col-md-12 margin-top-5">
                <table className='table bg-white'>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Full Name</th>
                            <th>Sex</th>
                            <th>DOB</th>
                            <th>Passport No</th>
                            <th>DOI</th>
                            <th>DOE</th>
                            <th>ROOM</th>
                            <th>Tel</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Invoice?.dataDetail?.filter(p => p.StatusCustomer !== 'OK').map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item?.Name || ''}</td>
                                        <td>{item?.Sex?.label || ''}</td>
                                        <td>{FormatDateJson(item?.DOB || '')}</td>
                                        <td>{item.Passport}</td>
                                        <td>{FormatDateJson(item?.DOI || '')}</td>
                                        <td>{FormatDateJson(item?.DOE || '')}</td>
                                        <td>{item?.Room || ''}</td>
                                        <td>{item?.Tel || ''}</td>
                                        <td>{item?.Note || ''}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div> */}
      </div>
    </>
  );
};

export const OtherServicePrint = React.memo(OtherServicePrintComp);

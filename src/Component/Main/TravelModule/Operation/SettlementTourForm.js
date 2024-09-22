import { useState } from "react";
import { useEffect } from "react";
import { Img } from "react-image";
import { FormatDateJson } from "../../../../Utils";

export const SettlementTourForm = ({ data = {} }) => {
  const [dt, setDt] = useState();
  const [DataSplit, setDataSplit] = useState({});

  useEffect(() => {
    if (data !== {}) {
      setDataSplit({
        PlaneTicket: data.Details.filter((p) => p.Service === "Vé máy bay"),
        LandTour: data.Details.filter((p) => p.Service === "LandTour"),
        Visa: data.Details.filter((p) => p.Service === "Visa"),
        TourLeader: data.Details.filter((p) => p.Service === "TourLeader"),
        Insurance: data.Details.filter((p) => p.Service === "Bảo hiểm"),
        Tip: data.Details.filter((p) => p.Service === "Tip"),
        Water: data.Details.filter((p) => p.Service === "Nước"),
        Gift: data.Details.filter((p) => p.Service === "Quà tặng"),
        Another: data.Details.filter((p) => p.Service === "Chi phí khác"),
        Incurred: data.Details.filter((p) => p.Service === "Phát sinh"),
        HDV: data.Details.filter((p) => p.Service === "HDV"),
      });
      setDt(data);
    }
  }, [data]);

  return (
    <>
      <div>
        <div class="col-12 text-center header">
          <Img src="../dist/img/logo-invoice.png" style={{ width: "100%" }} />
        </div>
      </div>
      <table
        width={"100%"}
        className="p-2"
        id="settlement-tour"
        style={{
          backgroundColor: "#fff",
          fontFamily: "TimeNewRoman",
          pageBreakAfter: "always",
        }}
      >
        <thead
          style={{
            display: "table-header-group",
            position: "fixed",
            top: 0,
          }}
        >
          <tr className="display-none">
            <th>
              <div class="col-12 text-center header">
                <Img
                  src="../dist/img/logo-invoice.png"
                  style={{ width: "100%" }}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody style={{ display: "table-row-group" }}>
          <tr>
            <td>
              <div className="row" style={{ fontSize: "11px" }}>
                <div className="col-12">
                  <br />
                  <table width={"100%"}>
                    <tr>
                      <td
                        style={{
                          fontSize: "25px",
                          fontWeight: 700,
                          textAlign: "center",
                        }}
                        colSpan={4}
                      >
                        PHIẾU BÀN GIAO TOUR
                        <br />
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        Người giao: {""} <b> {dt?.CreateName || ""}</b>
                      </td>
                      <td>
                        Người nhận: {""} <b>{dt?.TourGuiderName || ""}</b>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        Chức vụ: {""} <b>{dt?.PositionName || ""}</b>
                      </td>
                      <td>
                        Chức vụ: {""} <b>HƯỚNG DẪN VIÊN</b>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        Phòng ban: {""} <b>{dt?.DepartmentName || ""}</b>
                      </td>
                      <td>
                        Phòng ban: {""} <b>HƯỚNG DẪN VIÊN</b>
                      </td>
                      <td></td>
                    </tr>
                  </table>
                  <br />
                  <table
                    width={"100%"}
                    border={1}
                    cellPadding={5}
                    cellSpacing={0}
                  >
                    <thead className="bg-light">
                    <tr>
                      <th
                        style={{ minWidth: 150, maxWidth: 600 }}
                        className="align-middle text-center"
                      >
                        Tour Code
                      </th>
                      <th
                        style={{ minWidth: 200, maxWidth: 600 }}
                        className="align-middle  text-center"
                      >
                        Hành trình
                      </th>
                      <th
                        style={{
                          maxWidth: 300,
                        }}
                        className="align-middle text-center"
                      >
                        Ngày khởi hành
                      </th>

                      <th
                        style={{ maxWidth: 200 }}
                        className="align-middle text-center"
                      >
                        Số khách
                      </th>
                    </tr>
                    </thead>
                    <tr>
                      <td className="text-center align-middle">
                        <div class="input-group ">
                          <div className="padding-td text-center">
                            <span className="  text-center">
                              {dt?.ServiceSaleCode}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center align-middle">
                        <div class="input-group ">
                          <div className="padding-td">
                            <span className=" text-center ">
                              {dt?.ServiceSaleName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center align-middle">
                        <div class="input-group ">
                          <div className="padding-td">
                            <span className=" text-center ">
                              {FormatDateJson(dt?.DateSaleFrom, 7)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center align-middle">
                        <div class="input-group ">
                          <div className="padding-td">
                            <span className=" text-center ">
                              {dt?.AdultQuantity +
                                dt?.ChildQuantity +
                                dt?.InfantQuantity}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                  <br />
                  <table
                    width={"100%"}
                    border={1}
                    cellPadding={5}
                    cellSpacing={0}
                  >
                    <thead className="bg-light">
                      <tr>
                        <th
                          style={{ minWidth: 105 }}
                          className="align-middle text-center"
                        >
                          Dịch vụ
                        </th>
                        <th
                          style={{ minWidth: 200 }}
                          className="align-middle text-center"
                        >
                          Nội dung
                        </th>
                        <th
                          style={{
                            width: 100,
                          }}
                          className="align-middle text-center"
                        >
                          Số lượng
                        </th>

                        <th
                          style={{ minWidth: 300 }}
                          className="align-middle text-center"
                        >
                          Ghi chú
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-dark">
                      {/* Vé máy bay */}
                      {(DataSplit === {} ||
                        DataSplit.PlaneTicket?.length === 0) && (
                        <tr>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" ">Vé máy bay</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {DataSplit !== {} &&
                        DataSplit.PlaneTicket?.length > 0 &&
                        DataSplit.PlaneTicket?.map((item, index) => {
                          return (
                            <tr key={"tb" + index}>
                              {index === 0 && (
                                <td
                                  className="text-center align-middle"
                                  rowSpan={DataSplit?.PlaneTicket?.length}
                                >
                                  {item?.Service}
                                </td>
                              )}
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">
                                      {item?.ServiceContent}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Quantity}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Note}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {/* LandTour */}
                      {(DataSplit === {} ||
                        DataSplit.LandTour?.length === 0) && (
                        <tr>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" ">LandTour</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {DataSplit !== {} &&
                        DataSplit.LandTour?.length > 0 &&
                        DataSplit.LandTour?.map((item, index) => {
                          return (
                            <tr key={"tb" + index}>
                              {index === 0 && (
                                <td
                                  className="text-center align-middle"
                                  rowSpan={DataSplit?.LandTour?.length}
                                >
                                  {item?.Service}
                                </td>
                              )}
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">
                                      {item?.ServiceContent}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Quantity}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Note}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      {/* Visa */}
                      {(DataSplit === {} || DataSplit.Visa?.length === 0) && (
                        <tr>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" ">Visa</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {DataSplit !== {} &&
                        DataSplit.Visa?.length > 0 &&
                        DataSplit.Visa?.map((item, index) => {
                          return (
                            <tr key={"tb" + index}>
                              {index === 0 && (
                                <td
                                  className="text-center align-middle"
                                  rowSpan={DataSplit?.Visa?.length}
                                >
                                  {item?.Service}
                                </td>
                              )}
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">
                                      {item?.ServiceContent}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Quantity}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Note}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      {/* TourLeader */}
                      {(DataSplit === {} ||
                        DataSplit.TourLeader?.length === 0) && (
                        <tr>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" ">TourLeader</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {DataSplit !== {} &&
                        DataSplit.TourLeader?.length > 0 &&
                        DataSplit.TourLeader?.map((item, index) => {
                          return (
                            <tr key={"tb" + index}>
                              {index === 0 && (
                                <td
                                  className="text-center align-middle"
                                  rowSpan={DataSplit?.TourLeader?.length}
                                >
                                  {item?.Service}
                                </td>
                              )}
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">
                                      {item?.ServiceContent}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Quantity}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Note}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      {/* Bảo hiểm */}
                      {(DataSplit === {} ||
                        DataSplit.Insurance?.length === 0) && (
                        <tr>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" ">Bảo hiểm</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {DataSplit !== {} &&
                        DataSplit.Insurance?.length > 0 &&
                        DataSplit.Insurance?.map((item, index) => {
                          return (
                            <tr key={"tb" + index}>
                              {index === 0 && (
                                <td
                                  className="text-center align-middle"
                                  rowSpan={DataSplit?.Insurance?.length}
                                >
                                  {item?.Service}
                                </td>
                              )}
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">
                                      {item?.ServiceContent}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Quantity}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Note}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      {/* Tip */}
                      {(DataSplit === {} || DataSplit.Tip?.length === 0) && (
                        <tr>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" ">Tip</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {DataSplit !== {} &&
                        DataSplit.Tip?.length > 0 &&
                        DataSplit.Tip?.map((item, index) => {
                          return (
                            <tr key={"tb" + index}>
                              {index === 0 && (
                                <td
                                  className="text-center align-middle"
                                  rowSpan={DataSplit?.Tip?.length}
                                >
                                  {item?.Service}
                                </td>
                              )}
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">
                                      {item?.ServiceContent}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Quantity}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Note}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      {/* Nước */}
                      {(DataSplit === {} || DataSplit.Water?.length === 0) && (
                        <tr>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" ">Nước</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {DataSplit !== {} &&
                        DataSplit.Water?.length > 0 &&
                        DataSplit.Water?.map((item, index) => {
                          return (
                            <tr key={"tb" + index}>
                              {index === 0 && (
                                <td
                                  className="text-center align-middle"
                                  rowSpan={DataSplit?.Water?.length}
                                >
                                  {item?.Service}
                                </td>
                              )}
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">
                                      {item?.ServiceContent}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Quantity}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Note}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      {/* Quà tặng */}
                      {(DataSplit === {} || DataSplit.Gift?.length === 0) && (
                        <tr>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" ">Quà tặng</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {DataSplit !== {} &&
                        DataSplit.Gift?.length > 0 &&
                        DataSplit.Gift?.map((item, index) => {
                          return (
                            <tr key={"tb" + index}>
                              {index === 0 && (
                                <td
                                  className="text-center align-middle"
                                  rowSpan={DataSplit?.Gift?.length}
                                >
                                  {item?.Service}
                                </td>
                              )}
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">
                                      {item?.ServiceContent}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Quantity}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Note}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      {/* Chi phí khác */}
                      {(DataSplit === {} ||
                        DataSplit.Another?.length === 0) && (
                        <tr>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" ">Chi phí khác</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {DataSplit !== {} &&
                        DataSplit.Another?.length > 0 &&
                        DataSplit.Another?.map((item, index) => {
                          return (
                            <tr key={"tb" + index}>
                              {index === 0 && (
                                <td
                                  className="text-center align-middle"
                                  rowSpan={DataSplit?.Another?.length}
                                >
                                  {item?.Service}
                                </td>
                              )}
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">
                                      {item?.ServiceContent}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Quantity}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Note}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      {/* Phát sinh */}
                      {(DataSplit === {} ||
                        DataSplit.Incurred?.length === 0) && (
                        <tr>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" ">Phát sinh</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {DataSplit !== {} &&
                        DataSplit.Incurred?.length > 0 &&
                        DataSplit.Incurred?.map((item, index) => {
                          return (
                            <tr key={"tb" + index}>
                              {index === 0 && (
                                <td
                                  className="text-center align-middle"
                                  rowSpan={DataSplit?.Incurred?.length}
                                >
                                  {item?.Service}
                                </td>
                              )}
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">
                                      {item?.ServiceContent}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Quantity}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Note}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      {/* HDV */}
                      {(DataSplit === {} || DataSplit.HDV?.length === 0) && (
                        <tr>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" ">HDV</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center align-middle">
                            <div class="input-group ">
                              <div className="padding-td">
                                <span className=" "></span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {DataSplit !== {} &&
                        DataSplit.HDV?.length > 0 &&
                        DataSplit.HDV?.map((item, index) => {
                          return (
                            <tr key={"tb" + index}>
                              {index === 0 && (
                                <td
                                  className="text-center align-middle"
                                  rowSpan={DataSplit?.HDV?.length}
                                >
                                  {item?.Service}
                                </td>
                              )}
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">
                                      {item?.ServiceContent}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Quantity}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center align-middle">
                                <div class="input-group ">
                                  <div className="padding-td">
                                    <span className=" ">{item?.Note}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  <br />
                  <table width={"100%"}>
                    <tr>
                      <td style={{ textAlign: "center" }}>
                        <b>Phòng Điều Hành</b>
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <b>Hướng Dẫn Viên</b>
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <b>Phòng Hành Chính</b>
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot
          style={{
            display: "table-footer-group",
            position: "fixed",
            bottom: 0,
          }}
        >
          <tr className="display-none">
            <td>
              <Img
                src="../dist/img/logo-invoice-footer.png"
                style={{ width: "100%" }}
              />
            </td>
          </tr>
        </tfoot>
      </table>
      <div>
        <Img
          src="../dist/img/logo-invoice-footer.png"
          style={{ width: "100%" }}
        />
      </div>
    </>
  );
};

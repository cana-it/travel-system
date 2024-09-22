import React, { useEffect, useState } from "react";
import $ from "jquery";
import { FormatDateJson, FormatMoney, MoneyToText } from "../../../../Utils";
import { Img } from "react-image";
import { ShowFiles } from "../../../../Common";
const InvoicePrintComp = ({
  onInvoice = () => {},
  onPrint = 0,
  isEmpty = false,
}) => {
  const [invoice, setInvoice] = useState();
  useEffect(() => {
    setInvoice(onInvoice);
  }, [onInvoice]);

  useEffect(() => {
    if (onInvoice !== undefined && onPrint > 0) {
      setTimeout(function () {
        //#region Khởi tạo form in
        let _timeout = 1000;
        let html = $("#portrait").html();
        html += `<script type="text/javascript">window.focus();setTimeout(function(){window.print();window.close();},${_timeout});</script>`;
        var myWindow = window.open("", "_blank");
        myWindow.document.write(
          '<html><head></head><body style="margin:0">' + html + "</body></html>"
        );
        //#endregion
      }, 1000);
    }
  }, [onPrint]);

  return (
    <>
      <div
        id="portrait"
        className="row booking portrait"
        style={{
          width: "210mm",
          height: "297mm",
          padding: "0 12mm",
          backgroundColor: "#fff",
          fontFamily: "TimeNewRoman",
        }}
      >
        <div class="header">
          <Img
            src="../dist/img/logo-invoice.jpg"
            style={{ width: "calc(100% - 24mm)", marginLeft: "12mm" }}
          />
        </div>
        {invoice?.InvoiceType === "A" && (
          <>
            <table width={"100%"} cellPadding="4" cellSpacing={1}>
              <tr>
                <td
                  colSpan={2}
                  style={{
                    textAlign: "center",
                    width: "135mm",
                    paddingLeft: "10mm",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    CÔNG TY TNHH ĐT TM DV DU LỊCH CHÂU ÂU
                  </span>
                  <br /> <span style={{ fontWeight: "bold" }}>EUROTRAVEL</span>
                  <br />
                  352-354-356 Lê Văn Sỹ, P2, Q Tân Bình, TP.HCM
                </td>
                <td
                  style={{
                    textAlign: "right",
                    verticalAlign: "top",
                    width: "60mm",
                  }}
                >
                  <span>Mã phiếu:</span> {invoice?.InvoiceCode}
                </td>
                <td width={"15mm"}></td>
              </tr>
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "25px", fontWeight: 700 }}>
                    PHIẾU THU
                  </span>
                  <div class="form-group mt-1">
                    {FormatDateJson(invoice.CreateTime, 12)}
                  </div>
                  {/* <div style={{ float: "right",marginTop:"-50px",marginRight:"15mm" }}><span>Mã phiếu:</span> {invoice?.InvoiceCode}</div> */}
                </td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Khách Hàng:{" "}
                  <span style={{ textTransform: "uppercase" }}>
                    {invoice?.ObName}
                  </span>
                </td>
                {/* <td>
                  Ngày sinh:{" "}
                  <span>{FormatDateJson(invoice?.Brithday, 7) || ""}</span>
                </td> */}
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>Điện thoại: {invoice?.Phone}</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Mã Tour đăng ký: {invoice?.BookingCode || "DỊCH VỤ KHÁC"}
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>Chi tiết Tour: {invoice?.ServiceName || ""}</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Số ngày Tour:{" "}
                  {invoice?.TotalDate
                    ? ("0" + invoice?.TotalDate).slice(-2)
                    : 0}{" "}
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Ngày khởi hành Tour:{" "}
                  {invoice?.TimeStart
                    ? FormatDateJson(invoice?.TimeStart, 7)
                    : ""}
                  . Ngày kết thúc Tour:{" "}
                  {invoice?.TimeEnd ? FormatDateJson(invoice?.TimeEnd, 7) : ""}
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Số thành viên:{" "}
                  {invoice?.TotalInvoiceGroup
                    ? ("0" + invoice?.TotalInvoiceGroup).slice(-2)
                    : 1}{" "}
                  người
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              {invoice?.TotalNL > 0 && (
                <tr>
                  <td style={{ width: "15mm" }}></td>
                  <td>
                    Người lớn:{" "}
                    {invoice?.TotalNL ? ("0" + invoice?.TotalNL).slice(-2) : 0}{" "}
                    người
                  </td>
                  <td>Giá: {FormatMoney(invoice?.PriceNL || 0)}/người</td>
                  <td style={{ width: "15mm" }}></td>
                </tr>
              )}
              {invoice?.TotalTE > 0 && (
                <tr>
                  <td style={{ width: "15mm" }}></td>
                  <td>
                    Trẻ em:{" "}
                    {invoice?.TotalTE ? ("0" + invoice?.TotalTE).slice(-2) : 0}{" "}
                    người
                  </td>
                  <td>Giá: {FormatMoney(invoice?.PriceTE || 0)}/người</td>
                  <td style={{ width: "15mm" }}></td>
                </tr>
              )}
              {invoice?.TotalTN > 0 && (
                <tr>
                  <td style={{ width: "15mm" }}></td>
                  <td>
                    Infant:{" "}
                    {invoice?.TotalTN ? ("0" + invoice?.TotalTN).slice(-2) : 0}{" "}
                    người
                  </td>
                  <td>Giá: {FormatMoney(invoice?.PriceTN || 0)}/người</td>
                  <td style={{ width: "15mm" }}></td>
                </tr>
              )}
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  <span className="oneline">
                    Tổng tiền Tour: {FormatMoney(invoice?.TotalPrice || 0)}
                    {invoice?.TypeMoneyName || ""} (Bằng chữ:{" "}
                    {MoneyToText(
                      invoice?.TotalPrice || 0,
                      invoice?.TypeMoneyName || ""
                    )}
                    )
                  </span>
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  <i>Ghi chú: Sau khi đã áp dụng ưu đãi và phụ thu (nếu có).</i>
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  <table width={"100%"}>
                    <tr>
                      <td>Cọc Tour: x</td>

                      {(invoice?.Payment1 || 0) > 0 && (
                        <td>
                          <input
                            style={{ width: "18px", height: "18px" }}
                            type="checkbox"
                            checked={true}
                          />{" "}
                          Lần 1
                        </td>
                      )}
                      {(invoice?.Payment2 || 0) > 0 && (
                        <td>
                          <input
                            style={{ width: "18px", height: "18px" }}
                            type="checkbox"
                            checked={true}
                          />{" "}
                          Lần 2
                        </td>
                      )}
                      {(invoice?.Payment3 || 0) > 0 && (
                        <td>
                          <input
                            style={{ width: "18px", height: "18px" }}
                            type="checkbox"
                            checked={true}
                          />{" "}
                          Lần 3
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td>Số tiền:</td>
                      {(invoice?.Payment1 || 0) > 0 && (
                        <td>{FormatMoney(invoice?.Payment1 || 0)}</td>
                      )}
                      {(invoice?.Payment2 || 0) > 0 && (
                        <td>{FormatMoney(invoice?.Payment2 || 0)}</td>
                      )}
                      {(invoice?.Payment3 || 0) > 0 && (
                        <td>{FormatMoney(invoice?.Payment3 || 0)}</td>
                      )}
                    </tr>
                    <tr>
                      <td></td>

                      {(invoice?.Payment4 || 0) > 0 && (
                        <td>
                          <input
                            style={{ width: "18px", height: "18px" }}
                            type="checkbox"
                            checked={true}
                          />{" "}
                          Lần 4
                        </td>
                      )}
                      {(invoice?.Payment5 || 0) > 0 && (
                        <td>
                          <input
                            style={{ width: "18px", height: "18px" }}
                            type="checkbox"
                            checked={true}
                          />{" "}
                          Lần 5
                        </td>
                      )}
                      {(invoice?.Payment6 || 0) > 0 && (
                        <td>
                          <input
                            style={{ width: "18px", height: "18px" }}
                            type="checkbox"
                            checked={true}
                          />{" "}
                          Lần 6
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td></td>
                      {(invoice?.Payment4 || 0) > 0 && (
                        <td>{FormatMoney(invoice?.Payment4 || 0)}</td>
                      )}
                      {(invoice?.Payment5 || 0) > 0 && (
                        <td>{FormatMoney(invoice?.Payment5 || 0)}</td>
                      )}
                      {(invoice?.Payment6 || 0) > 0 && (
                        <td>{FormatMoney(invoice?.Payment6 || 0)}</td>
                      )}
                    </tr>
                  </table>
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Còn lại: {FormatMoney(invoice?.TotalRemain || 0)} (Bằng chữ:{" "}
                  {MoneyToText(
                    invoice?.TotalRemain || 0,
                    invoice?.TypeMoneyName || ""
                  )}
                  )
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>

              <tr>
                <td style={{ width: "15mm" }}></td>

                <td colSpan={2}>
                  <table width={"100%"}>
                    <tr>
                      <td>
                        Phương thức thanh toán: {invoice?.PaymentName || ""}
                      </td>
                      <td>
                        Số tài khoản chuyển tiền:{" "}
                        {invoice?.BankAccount || "......................."}
                      </td>
                    </tr>
                  </table>
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Nội dung thanh toán:{" "}
                  {invoice?.Decscription ||
                    ".........................................."}
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Ghi chú:{" "}
                  {invoice?.NotePayment ||
                    ".........................................."}
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td>Người đóng tiền: {invoice?.ObName}</td>
                <td>Khác: ..........................................</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>Người đề xuất: {invoice?.CreateName}</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  <table width={"100%"}>
                    <tr>
                      <td style={{ textAlign: "left", width: "25%" }}>
                        <br />
                        <b>Người lập phiếu</b>
                      </td>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        <br />
                        <b>Thủ quỹ</b>
                      </td>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        <br />
                        <b>Kế toán</b>
                      </td>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        <br />
                        <b>Khách Hàng</b>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        {
                          <Img
                            src={invoice?.Files}
                            style={{ height: "70px" }}
                          />
                        }
                      </td>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          textAlign: "left",
                          width: "30%",
                          fontSize: "13px",
                        }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            display: "inline-block",
                            marginLeft: "10px",
                          }}
                        >
                          {invoice?.CreateName}
                        </span>
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          width: "20%",
                          fontSize: "13px",
                        }}
                      ></td>
                      <td
                        style={{
                          textAlign: "center",
                          width: "20%",
                          fontSize: "13px",
                        }}
                      ></td>
                      <td
                        style={{
                          textAlign: "center",
                          width: "30%",
                          fontSize: "13px",
                        }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            display: "inline-block",
                          }}
                        >
                          {invoice?.ObName}
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              {/* <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  <table width={"100%"}>
                    <tr>
                      <td
                        style={{
                          textAlign: "center",
                          width: "30%",
                          fontSize: "13px",
                        }}
                      >
                        {invoice?.CreateName}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          width: "20%",
                          fontSize: "13px",
                        }}
                      ></td>
                      <td
                        style={{
                          textAlign: "center",
                          width: "20%",
                          fontSize: "13px",
                        }}
                      ></td>
                      <td
                        style={{
                          textAlign: "center",
                          width: "30%",
                          fontSize: "13px",
                        }}
                      >
                        {invoice?.ObName}
                      </td>
                    </tr>

                  </table>
                </td>
                <td style={{ width: "20mm" }}></td>
              </tr> */}
            </table>
          </>
        )}
        {invoice?.InvoiceType === "B" && (
          <>
            <table width={"100%"} cellPadding="5" cellSpacing={1}>
              <tr>
                <td
                  colSpan={2}
                  style={{
                    textAlign: "center",
                    width: "125mm",
                    paddingLeft: "10mm",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    CÔNG TY TNHH ĐT TM DV DU LỊCH CHÂU ÂU
                  </span>
                  <br />
                  352-354-356 Lê Văn Sỹ, P2, Q Tân Bình
                </td>
                <td style={{ textAlign: "right", width: "70mm" }}>
                  <span>Mã phiếu:</span> {invoice?.InvoiceCode}
                </td>
                <td width={"15mm"}></td>
              </tr>

              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "25px", fontWeight: 700 }}>
                    PHIẾU PĐX
                  </span>
                  <div class="form-group mt-1">
                    {FormatDateJson(invoice.CreateTime, 12)}
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Người đề xuất:{" "}
                  <span style={{ textTransform: "uppercase" }}>
                    {invoice?.CreateName}
                  </span>
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>Phòng ban: {invoice?.DepartmentName || ""}</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Nội dung: {invoice?.Decscription || ""}{" "}
                  {invoice?.ExchangeRate || ""}
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>Đối tượng thụ hưởng: {invoice?.ObName}</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>Mã Tour: {invoice?.BookingCode || ""}</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Phương thức thanh toán {invoice?.PaymentName || ""}
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Số tiền: {FormatMoney(invoice?.TotalMoney || 0)}
                  {invoice?.TypeMoneyName || ""} (Bằng chữ:{" "}
                  {MoneyToText(
                    invoice?.TotalMoney || 0,
                    invoice?.TypeMoneyName || ""
                  )}
                  )
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Ghi chú:{" "}
                  {invoice?.NotePayment ||
                    ".........................................."}
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td>
                  <ShowFiles
                    fileData={{
                      fileShow: invoice?.AttackFile || "",
                      imageShow: invoice?.AttackImage || "",
                    }}
                    _type={1}
                  />
                </td>
                <td>
                  <ShowFiles
                    fileData={{
                      fileShow: invoice?.AttackFile || "",
                      imageShow: invoice?.AttackImage || "",
                    }}
                    _type={2}
                  />
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>Chữ ký:</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <table width={"100%"}>
                    <tr>
                      <td style={{ textAlign: "center" }}>
                        <br />
                        <b>Người lập phiếu</b>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        {invoice?.ConfirmName4}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <br />
                        <b>Quản lý phòng</b>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <br />
                        <b>Kế toán</b>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <br />
                        <b>Ban lãnh đạo</b>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <br />
                        <b>Thủ quỹ</b>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <br />
                        <b>Khách Hàng</b>
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </>
        )}
        {invoice?.InvoiceType === "C" && (
          <>
            <table width={"100%"} cellPadding="5" cellSpacing={1}>
              <tr>
                <td
                  colSpan={2}
                  style={{
                    textAlign: "center",
                    width: "125mm",
                    paddingLeft: "10mm",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    CÔNG TY TNHH ĐT TM DV DU LỊCH CHÂU ÂU
                  </span>
                  <br />
                  352-354-356 Lê Văn Sỹ, P2, Q Tân Bình
                </td>
                <td style={{ textAlign: "right", width: "70mm" }}>
                  <span>Mã phiếu:</span> {invoice?.InvoiceCode}
                </td>
                <td width={"15mm"}></td>
              </tr>

              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "25px", fontWeight: 700 }}>PNB</span>
                  <div class="form-group mt-1">
                    {FormatDateJson(invoice.CreateTime, 12)}
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Người đề xuất:{" "}
                  <span style={{ textTransform: "uppercase" }}>
                    {invoice?.CreateName}
                  </span>
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>Phòng ban: {invoice?.DepartmentName || ""}</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Nội dung: {invoice?.Decscription || ""}{" "}
                  {invoice?.ExchangeRate || ""}
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>Đối tượng thụ hưởng: {invoice?.ObName}</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Phương thức thanh toán {invoice?.PaymentName || ""}
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Số tiền: {FormatMoney(invoice?.TotalMoney || 0)}
                  {invoice?.TypeMoneyName || ""} (Bằng chữ:{" "}
                  {MoneyToText(
                    invoice?.TotalMoney || 0,
                    invoice?.TypeMoneyName || ""
                  )}
                  )
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td>Đối tượng thanh toán: {invoice?.NotePayment || ""}</td>
                <td>Số tài khoản: {invoice?.BankAccount || ""}</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Ghi chú:{" "}
                  {invoice?.NotePayment ||
                    ".........................................."}
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td>
                  <ShowFiles
                    fileData={{
                      fileShow: invoice?.AttackFile || "",
                      imageShow: invoice?.AttackImage || "",
                    }}
                    _type={1}
                  />
                </td>
                <td>
                  <ShowFiles
                    fileData={{
                      fileShow: invoice?.AttackFile || "",
                      imageShow: invoice?.AttackImage || "",
                    }}
                    _type={2}
                  />
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>Chữ ký:</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <table width={"100%"}>
                    <tr>
                      <td style={{ textAlign: "center" }}>
                        <br />
                        <b>Người lập phiếu</b>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <br />
                        <b>Quản lý phòng</b>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <br />
                        <b>Kế toán</b>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <br />
                        <b>Ban lãnh đạo</b>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <br />
                        <b>Thủ quỹ</b>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </>
        )}
        {isEmpty && (
          <>
            <table width={"100%"} cellPadding="4" cellSpacing={1}>
              <tr>
                <td
                  colSpan={2}
                  style={{
                    textAlign: "center",
                    width: "135mm",
                    paddingLeft: "10mm",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    CÔNG TY TNHH ĐT TM DV DU LỊCH CHÂU ÂU
                  </span>
                  <br /> <span style={{ fontWeight: "bold" }}>EUROTRAVEL</span>
                  <br />
                  352-354-356 Lê Văn Sỹ, P2, Q Tân Bình, TP.HCM
                </td>
                <td
                  style={{
                    textAlign: "right",
                    verticalAlign: "top",
                    width: "60mm",
                  }}
                >
                  <span>Mã phiếu:..........................</span>
                </td>
                <td width={"15mm"}></td>
              </tr>
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "25px", fontWeight: 700 }}>
                    PHIẾU THU
                  </span>
                  <div class="form-group mt-1">
                    <span className="pr-3">
                      Ngày..... tháng..... năm..........
                    </span>
                  </div>
                  {/* <div style={{ float: "right",marginTop:"-50px",marginRight:"15mm" }}><span>Mã phiếu:</span> {invoice?.InvoiceCode}</div> */}
                </td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Khách
                  Hàng:..........................................................................................................................
                </td>
                {/* <td>
                  Ngày sinh:{" "}
                  <span>{FormatDateJson(invoice?.Brithday, 7) || ""}</span>
                </td> */}
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Điện
                  thoại:..............................................................................................................................
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Mã Tour đăng
                  ký:...................................................................................................................
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Chi tiết
                  Tour:..........................................................................................................................
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Số ngày
                  Tour:.........................................................................................................................
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Ngày khởi hành Tour:................................. . Ngày
                  kết thúc Tour:.................................
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>Số thành viên:..... người</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td>Người lớn:..... người</td>
                <td>Giá: ........................./người</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td>Trẻ em: ..... người</td>
                <td>Giá:........................./người</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td>Infant:..... người</td>
                <td>Giá:........................./người</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  <span className="oneline">
                    Tổng tiền Tour: .........................
                  </span>
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>

              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  <table width={"100%"}>
                    <tr>
                      <td>Cọc Tour: x</td>
                      <td>
                        <input
                          style={{ width: "18px", height: "18px" }}
                          type="checkbox"
                          checked={false}
                        />{" "}
                        Lần .....
                      </td>
                      <td>
                        <input
                          style={{ width: "18px", height: "18px" }}
                          type="checkbox"
                          checked={false}
                        />{" "}
                        Lần .....
                      </td>
                    </tr>
                    <tr>
                      <td>Số tiền: .........................</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </table>
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>Còn lại: .........................</td>
                <td style={{ width: "15mm" }}></td>
              </tr>

              <tr>
                <td style={{ width: "15mm" }}></td>

                <td colSpan={2}>
                  <table width={"100%"}>
                    <tr>
                      <td>
                        Phương thức thanh toán: ..............................
                      </td>
                      <td>
                        Số tài khoản chuyển tiền: ..............................
                      </td>
                    </tr>
                  </table>
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Nội dung thanh toán:
                  ................................................................................................................
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>

              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Ghi
                  chú:.....................................................................................................................................
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>

              <tr>
                <td style={{ width: "15mm" }}></td>
                <td>
                  Người đóng tiền: ..........................................
                </td>
                <td>Khác: ...........................................</td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  Người đề xuất: .............................................
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
              <tr>
                <td style={{ width: "15mm" }}></td>
                <td colSpan={2}>
                  <table width={"100%"}>
                    <tr>
                      <td style={{ textAlign: "left", width: "25%" }}>
                        <br />
                        <b>Người lập phiếu</b>
                      </td>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        <br />
                        <b>Thủ quỹ</b>
                      </td>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        <br />
                        <b>Kế toán</b>
                      </td>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        <br />
                        <b>Khách Hàng</b>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        {
                          <Img
                            src={invoice?.Files}
                            style={{ height: "70px" }}
                          />
                        }
                      </td>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          textAlign: "left",
                          width: "30%",
                          fontSize: "13px",
                        }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            display: "inline-block",
                            marginLeft: "10px",
                          }}
                        >
                          {invoice?.CreateName}
                        </span>
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          width: "20%",
                          fontSize: "13px",
                        }}
                      ></td>
                      <td
                        style={{
                          textAlign: "center",
                          width: "20%",
                          fontSize: "13px",
                        }}
                      ></td>
                      <td
                        style={{
                          textAlign: "center",
                          width: "30%",
                          fontSize: "13px",
                        }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            display: "inline-block",
                          }}
                        >
                          {invoice?.ObName}
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
                <td style={{ width: "15mm" }}></td>
              </tr>
            </table>
          </>
        )}
        <div className="clearfix"></div>
        <footer
          class="footer"
          style={{ position: "absolute", bottom: "10px", zIndex: 1 }}
        >
          <Img
            src="../dist/img/logo-invoice-footer.png"
            style={{ width: "calc(100% - 24mm)", marginLeft: "12mm" }}
          />
        </footer>
      </div>
    </>
  );
};

export const InvoicePrint = React.memo(InvoicePrintComp);

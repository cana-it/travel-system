import { useState, useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import { useDispatch } from "react-redux";
import {
  SelectProvider,
  SelectObjectStatus,
  SelectInvoiceStatus,
  SelectInvoiceStyle,
  SelectExpenseItem,
} from "../../../../Common";
import { mainAction } from "../../../../Redux/Actions";
import { FormatMoney, ConfirmAlert } from "../../../../Utils";
import Select from "react-select";
import SignatureCanvas from "react-signature-canvas";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  FormatDateJson,
} from "../../../../Utils";
export const Invoice = ({
  data = [],
  handleClose,
  handleShow = () => {},
  setOpacity = () => {},
  Booking = () => {},
  DataObject = () => {},
  IsActive = () => {},
  onInvoiceInfor = () => {},
  invoiceStyle = "",
}) => {
  const dispatch = useDispatch();
  const Creater = +localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const DepartmentId = +localStorage.getItem("DepartmentId");

  const [invoice, setInvoice] = useState({
    typeOfMoney: { value: 0, label: "Vui lòng chọn" },
    typeOfPayment: { value: 0, label: "Vui lòng chọn" },
    InvoiceType: "A",
    DatePayment: new Date(),
    InvoiceId: 0,
  });
  const typeOfMoney = [
    { value: 1, label: "VND" },
    { value: 2, label: "USD" },
  ];
  const typeOfPayment = [
    { value: 1, label: "Tiền mặt" },
    { value: 2, label: "Chuyển khoản" },
    { value: 3, label: "Quẹt thẻ" },
    { value: 4, label: "Ví điện tử" },
    { value: 5, label: "Khác" },
  ];

  const onChange = (e, type) => {
    if (type === "typeOfMoney") {
      setInvoice({
        ...invoice,
        typeOfMoney: e,
      });
    } else {
      setInvoice({
        ...invoice,
        typeOfPayment: e,
      });
    }
  };

  const Trl_spInvoice_Save = async () => {
    if (!invoice.typeOfMoney?.value || invoice.typeOfMoney?.value === 0) {
      Alertwarning("Vui lòng chọn loại tiền");
      return;
    }
    if (!invoice.typeOfPayment?.value || invoice.typeOfPayment?.value === 0) {
      Alertwarning("Vui lòng chọn hình thức thanh toán");
      return;
    }
    if (!invoice.DatePayment) {
      Alertwarning("Vui lòng chọn ngày thanh toán");
      return;
    }
    if (!invoice?.Money) {
      Alertwarning("Vui lòng nhập giá trị tạm ứng hợp lệ");
      return;
    }
    if (invoice.Money > invoice.TourPrice) {
      Alertwarning("Giá trị tạm ứng không hợp lệ");
      return;
    }

    try {
      let pr = {
        InvoiceId: invoice.InvoiceId,
        InvoiceCode: "",
        InvoiceType: invoice.InvoiceType, // A thu, B chi
        ObjectId: DataObject.ObjectId,
        ObjectName: DataObject.ObjectName,
        ObId: DataObject.CustomerId, // sub of objID
        ObName: DataObject.CustomerName,
        TypeMoneyType: invoice.typeOfMoney.value,
        TypeMoneyName: invoice.typeOfMoney.label,
        ExchangeRate: invoice.ExchangeRate,
        BookingId: Booking.BookingId,
        PaymentType: invoice.typeOfPayment.value,
        PaymentName: invoice.typeOfPayment.label,
        TotalMoney: invoice.TotalMoney,
        Money: invoice.Money, // ?
        VAT: invoice.VAT,
        MoneyVAT: (invoice.VAT * invoice.Money) / 100,
        MoneyPayment: invoice.TotalMoney - (invoice.VAT * invoice.Money) / 100,
        Decscription: invoice.Decscription,
        NotePayment: invoice.NotePayment,
        DatePayment: FormatDateJson(invoice.DatePayment),
        BookingDetailId: DataObject.BookingDetailId,
        TypePm: DataObject.TypePm,
        Creater: Creater,
        CreateName: CreateName,
        StyleId: invoiceStyle.StyleId,
        StyleName: invoiceStyle.StyleName,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_Save",
      };
      const respone = await mainAction.API_spCallServer(params, dispatch);
      if (respone.Status === "OK") {
        Alertsuccess(respone.ReturnMess);
        onInvoiceInfor({
          Money: invoice.Money,
          VAT: +invoice.VAT,
          InvoiceId: respone.InvoiceId, //update invoiceid vao detail booking
          BookingDetailId: DataObject.BookingDetailId,
          CustomerId: DataObject.CustomerId,
          TypePm: DataObject.TypePm, // V1 là invoice1, V2 là invoice2...
        });
        handleClose();
      }
    } catch (error) {
      ;
    }
  };

  const cancelInvoice = () => {
    setInvoice({
      typeOfMoney: { value: 0, label: "Vui lòng chọn" },
      typeOfPayment: { value: 0, label: "Vui lòng chọn" },
      InvoiceType: "A",
      DatePayment: new Date(),
      ExchangeRate: "",
      TotalMoney: "",
      Money: "",
      Decscription: "",
      NotePayment: "",
      booking: "",
      VAT: 0,
    });
  };

  useEffect(() => {
    if (DataObject?.InvoiceId1 && DataObject?.TypePm === "V1") {
      Trl_spInvoice_List(DataObject.InvoiceId1);
    } else if (DataObject?.InvoiceId2 && DataObject.TypePm === "V2") {
      Trl_spInvoice_List(DataObject.InvoiceId2);
    } else if (DataObject?.InvoiceId3 && DataObject.TypePm === "V3") {
      Trl_spInvoice_List(DataObject.InvoiceId3);
    } else {
      setInvoice({
        typeOfMoney: { value: 1, label: "VND" },
        typeOfPayment: { value: 2, label: "Chuyển khoản" },
        InvoiceType: "A",
        DatePayment: new Date(),
        ExchangeRate: "1.0",
        InvoiceId: 0,
        VAT: 0,
        MoneyVAT: 0,
        MoneyPayment: 0,
        Decscription: "",
        NotePayment: "",
        StatusId: 1,
        TotalMoney:
          invoice?.InvoiceId !== 0
            ? invoice?.TotalMoney
            : DataObject?.TourPrice -
              (DataObject?.Payment1 +
                DataObject?.Payment2 +
                -DataObject?.Payment3),
      });
    }
  }, [IsActive]);

  const Trl_spInvoice_List = async (InvoiceId) => {
    try {
      let pr = {
        InvoiceId: InvoiceId,
        ObjectId: 0,
        ObId: 0,
        Creater: Creater,
        CreateName: CreateName,
        InvoiceSearch: "",
        FromDate: "2022-10-10",
        ToDate: "2022-10-10",
        CheckDate: "B",
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_List",
      };

      const respone = await mainAction.API_spCallServer(params, dispatch);
      if (respone !== "") {
        setInvoice({
          typeOfMoney: {
            value: respone[0].TypeMoneyType,
            label: respone[0].TypeMoneyName,
          },
          typeOfPayment: {
            value: respone[0].PaymentType,
            label: respone[0].PaymentName,
          },
          InvoiceType: respone[0].InvoiceType,
          DatePayment: new Date(respone[0].DatePayment),
          ExchangeRate: respone[0].ExchangeRate,
          TotalMoney: respone[0].TotalMoney,
          Money: respone[0].Money,
          VAT: respone[0].VAT,
          Decscription: respone[0].Decscription,
          NotePayment: respone[0].NotePayment,
          InvoiceId: respone[0].InvoiceId,
          StatusId: respone[0].StatusId,
          StatusName: respone[0].StatusName,
          Files: respone[0].Files,
          CreateConfirmName: respone[0].CreateConfirmName,
          CreateConfirmTime: respone[0].CreateConfirmTime,
        });
      }
    } catch (error) {
      ;
    }
  };

  const Trl_spInvoice_Delete = async () => {
    if (window.confirm("Bạn có chắc muốn hủy?")) {
      try {
        let pr = {
          InvoiceId: invoice.InvoiceId,
          BookingDetailId: DataObject.BookingDetailId,
          BookingId: Booking.BookingId,
          TypePm: DataObject.TypePm,
          Creater: Creater,
          CreateName: CreateName,
        };
        const params = {
          Json: JSON.stringify(pr),
          func: "Trl_spInvoice_Delete",
        };

        const respone = await mainAction.API_spCallServer(params, dispatch);
        if (respone.Status === "OK") {
          Alertsuccess(respone.ReturnMess);

          await onInvoiceInfor({
            Money: 0,
            VAT: 0,
            BookingDetailId: DataObject.BookingDetailId,
            CustomerId: DataObject.CustomerId,
            TypePm: DataObject.TypePm, // V1 là invoice1, V2 là invoice2...
            InvoiceId: invoice.InvoiceId, //update invoiceid vao detail booking
          });

          cancelInvoice();
          return;
        } else {
          Alertsuccess(respone.ReturnMess);
          return;
        }
      } catch (error) {
        ;
      }
    }
  };

  const [SignatureInvoice, setSignatureInvoice] = useState();
  const [StatusId, setStatusId] = useState();
  const [NoteConfirm, setNoteConfirm] = useState();
  const Trl_spInvoice_Approve = async () => {
    try {
      if (StatusId?.value === "2" && SignatureInvoice === undefined) {
        Alerterror("Vui lòng ký xác nhận thanh toán");
        return;
      }
      if (!invoice?.ExpenseItemId || invoice?.ExpenseItemId === 0) {
        Alerterror("Vui lòng chọn khoản mục chi phí");
        return;
      }

      if (window.confirm("Bạn có chắc chắn muốn xác nhận?")) {
        let Files = "";
        if (SignatureInvoice !== undefined) {
          let signature =
            SignatureInvoice.getTrimmedCanvas().toDataURL("image/png");
          Files = signature;
        }
        let pr = {
          InvoiceId: invoice.InvoiceId,
          StatusId: StatusId.value,
          StatusName: StatusId.label,
          Notes: NoteConfirm,
          Files: Files,
          Creater: Creater,
          CreateName: CreateName,
        };
        const params = {
          Json: JSON.stringify(pr),
          func: "Trl_spInvoice_Approve",
        };
        const respone = await mainAction.API_spCallServer(params, dispatch);
        if (respone.Status === "OK") {
          Alertsuccess(respone.ReturnMess);

          await onInvoiceInfor({
            BookingDetailId: DataObject.BookingDetailId,
            CustomerId: DataObject.CustomerId,
            TypePm: DataObject.TypePm, // V1 là invoice1, V2 là invoice2...
            InvoiceId: invoice.InvoiceId, //update invoiceid vao detail booking
            StatusId: StatusId.value,
            StatusName: StatusId.label,
          });
          if (SignatureInvoice !== undefined) SignatureInvoice.clear();
          setNoteConfirm("");
          return;
        } else {
          Alertsuccess(respone.ReturnMess);
          return;
        }
      }
    } catch (error) {
      Alerterror("Lỗi server, liên hệ IT");
      return;
    }
  };

  const Trl_spSignatureInvoice_Clear = () => {
    SignatureInvoice.clear();
  };

  return (
    <div className="row booking">
      <div class="card m-1 card-shadow shadow">
        <div class="card-header card-header-custom p-0 px-1 mt-1 d-flex align-items-center ">
          <div class="row d-flex align-items-center justify-content-center w-100">
            <div class="col-sm-12 col-md-6">
              <h3 class="card-title font-weight-bold text-muted">
                Đề nghị thanh toán{" "}
                {Booking && `tour ${Booking?.ServiceSaleCode}`}
              </h3>
            </div>
            <div class="col-sm-12 col-md-6">
              <div
                style={{
                  display: invoice?.StatusId === 2 ? "none" : "block",
                }}
              >
                <button
                  type="button"
                  class="btn btn-sm btn-danger pull-right margin-left-5"
                  onClick={Trl_spInvoice_Delete}
                  style={{
                    display: invoice.InvoiceId === 0 ? "none" : "Block",
                  }}
                >
                  <i class="fa fa-trash pr-2"></i>
                  Hủy đề nghị
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-success pull-right"
                  onClick={Trl_spInvoice_Save}
                >
                  <i class="fa fa-edit pr-2"></i>
                  {invoice.InvoiceId === 0 ? "Tạo đề nghị" : "Cập nhật đề nghị"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body pt-3">
          <div className="row  booking">
            <div className="col-6">
              <div class="form-group clearfix">
                <div class="icheck-success d-inline">
                  <input
                    type="radio"
                    name="r3"
                    id="radioSuccess1"
                    checked={invoice.InvoiceType === "A"}
                    onChange={() =>
                      setInvoice({ ...invoice, InvoiceType: "A" })
                    }
                  />
                  <label for="radioSuccess1">Thu</label>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div
                class="form-group clearfix"
                style={{ display: Booking !== undefined ? "none" : "block" }}
              >
                <div class="icheck-success d-inline">
                  <input
                    type="radio"
                    name="r3"
                    id="radioSuccess2"
                    checked={invoice.InvoiceType === "B"}
                    onChange={() =>
                      setInvoice({ ...invoice, InvoiceType: "B" })
                    }
                  />
                  <label for="radioSuccess2">Chi</label>
                </div>
              </div>
            </div>

            <div class="col-sm-12 col-md-6">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  NGÀY THANH TOÁN
                </span>
                <div class="input-group ">
                  <DateTimePicker
                    className="form-control2"
                    value={invoice.DatePayment}
                    onChange={(date) =>
                      setInvoice({ ...invoice, DatePayment: date })
                    }
                    format={"MM/dd/yyyy"}
                  />
                </div>
              </div>
            </div>

            <div class="col-sm-12 col-md-6">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">Đối tượng</span>
                <div class="input-group">
                  <SelectObjectStatus
                    onSelected={(e) => setInvoice({ ...invoice, ObjectId: e })}
                    onObjectId={DataObject?.ObjectId}
                    className={"w-100 select-custom"}
                  />
                </div>
              </div>
            </div>

            <div class="col-sm-12 col-md-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  Khách hàng
                </span>
                <div class=" input-group">
                  <input
                    type="text"
                    class="form-control2"
                    value={
                      DataObject?.CustomerName ? DataObject?.CustomerName : ""
                    }
                    readOnly="true"
                  />
                </div>
              </div>
            </div>
            <div class={Booking ? "col-sm-12 col-md-12" : "d-none"}>
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  BOOKING/TOUR
                </span>
                <div class=" input-group">
                  <input
                    type="text"
                    class="form-control2"
                    value={Booking?.ServiceSaleCode}
                    readOnly="true"
                  />
                </div>
              </div>
            </div>

            <div class="col-sm-12 col-md-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">LOẠI TIỀN</span>
                <div class="input-group">
                  <Select
                    className={"w-100 select-custom"}
                    value={invoice.typeOfMoney}
                    onChange={(e) => onChange(e, "typeOfMoney")}
                    options={typeOfMoney}
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">TỶ GIÁ</span>
                <div class=" input-group">
                  <input
                    type="text"
                    class="form-control2"
                    value={invoice.ExchangeRate}
                    onChange={(e) =>
                      setInvoice({ ...invoice, ExchangeRate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  TỔNG GIÁ TRỊ
                </span>
                <div class=" input-group">
                  <input
                    type="text"
                    class="form-control2"
                    value={
                      invoice?.InvoiceId !== 0
                        ? FormatMoney(invoice?.TotalMoney || 0)
                        : FormatMoney(
                            DataObject?.TourPrice -
                              (DataObject?.Payment1 +
                                DataObject?.Payment2 +
                                -DataObject?.Payment3) || 0
                          )
                    }
                    // onChange={e => setInvoice({ ...invoice, TotalMoney: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div class="col-sm-12 col-md-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  GIÁ TRỊ TẠM ỨNG
                </span>
                <div class=" input-group">
                  <input
                    type="text"
                    class="form-control2"
                    value={FormatMoney(invoice?.Money || 0)}
                    onChange={(e) =>
                      setInvoice({
                        ...invoice,
                        Money: FormatMoney(e.target.value, 1),
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">VAT</span>
                <div class=" input-group">
                  <input
                    type="text"
                    class="form-control2"
                    value={FormatMoney(invoice.VAT || 0)}
                    onChange={(e) =>
                      setInvoice({
                        ...invoice,
                        VAT: FormatMoney(e.target.value, 1),
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  PHƯƠNG THỨC THANH TOÁN
                </span>
                <div class="input-group">
                  <Select
                    className={"w-100 select-custom"}
                    value={invoice.typeOfPayment}
                    onChange={(e) => onChange(e, "typeOfPayment")}
                    options={typeOfPayment}
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  GHI CHÚ THANH TOÁN
                </span>
                <div class=" input-group">
                  <textarea
                    type="text"
                    class="form-control2"
                    rows="4"
                    cols="50"
                    value={invoice.NotePayment}
                    onChange={(e) =>
                      setInvoice({ ...invoice, NotePayment: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  NỘI DUNG THANH TOÁN
                </span>
                <div class=" input-group">
                  <textarea
                    type="text"
                    class="form-control2"
                    rows="4"
                    cols="50"
                    value={invoice.Decscription}
                    onChange={(e) =>
                      setInvoice({ ...invoice, Decscription: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            DepartmentId === 42 || DepartmentId === 6
              ? "card-body pt-3"
              : "card-body pt-3 d-none"
          }
        >
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div
                className="row"
                style={{
                  display: invoice?.StatusId === 2 ? "none" : "block",
                }}
              >
                <h4>Ký xác nhận vào ô bên dưới:</h4>
                <SignatureCanvas
                  penColor="black"
                  style={{ width: "100%", height: "300" }}
                  canvasProps={{ className: "sigCanvas SignatureCanvas" }}
                  ref={(ref) => {
                    setSignatureInvoice(ref);
                  }}
                />
                <button
                  type="button"
                  class="btn btn-sm btn-warning pull-left margin-top-5"
                  onClick={Trl_spSignatureInvoice_Clear}
                >
                  <i class="fa fa-undo pr-2"></i>
                  Ký lại
                </button>
              </div>

              <div
                className="row margin-top-5"
                style={{
                  display: invoice?.StatusId === 2 ? "block" : "none",
                }}
              >
                <div class="form-group">
                  <span class="font-weight-bold text-muted">
                    Người xác nhận: {invoice.CreateConfirmName}
                  </span>
                </div>
                <div class="form-group">
                  <span class="font-weight-bold text-muted">
                    Time xác nhận: {invoice.CreateConfirmTime}
                  </span>
                </div>
                <div class="form-group">
                  <span class="font-weight-bold text-muted">
                    Chữ ký:
                    <img src={invoice?.Files} alt="message user image" />
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  Trạng thái thanh toán
                </span>
                <div class="input-group">
                  <SelectInvoiceStatus
                    onSelected={(e) => setStatusId(e)}
                    onObjectId={invoice?.StatusId || 0}
                    className={"w-100 select-custom"}
                  />
                </div>
              </div>
              <div class="form-group">
                <span class="small font-weight-bold text-muted">Khoản mục</span>
                <div class="input-group">
                  <SelectExpenseItem
                    onSelected={(e) =>
                      setInvoice({ ...invoice, ExpenseItemId: e.value })
                    }
                    items={invoice?.ExpenseItemId || 0}
                    className={"w-100 select-custom"}
                  />
                </div>
              </div>
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  Kế toán ghi chú
                </span>
                <div class=" input-group">
                  <textarea
                    type="text"
                    class="form-control2"
                    rows="4"
                    cols="50"
                    value={
                      invoice?.StatusId === 2
                        ? invoice?.NotePayment
                        : NoteConfirm
                    }
                    onChange={(e) => setNoteConfirm(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="button"
                class="btn btn-sm btn-success pull-right"
                onClick={Trl_spInvoice_Approve}
                style={{
                  display: invoice?.StatusId === 2 ? "none" : "block",
                }}
              >
                <i class="fa fa-edit pr-2"></i>
                KT Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

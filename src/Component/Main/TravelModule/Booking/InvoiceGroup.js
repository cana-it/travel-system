import { useState, useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import { useDispatch } from "react-redux";
import { SelectObjectStatus, UploadFile } from "../../../../Common";
import { mainAction } from "../../../../Redux/Actions";
import { FormatMoney, ConfirmAlert, ConvertFileName } from "../../../../Utils";
import Select from "react-select";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  FormatDateJson,
} from "../../../../Utils";
import { InvoiceConfirmTemp } from "../Accounting/InvoiceConfirmTemp";

export const InvoiceGroup = ({
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
    let listfile = "";
    if (FileUpload !== "" && FileUpload.length > 0) {
      const formData = new FormData();
      formData.append("Key", "Files1");
      for (let i = 0; i < FileUpload.length; i++) {
        let f = FileUpload[i];
        let renamedFile = new File([f], ConvertFileName(f.name), {
          type: f.type,
        });

        formData.append("myFile" + i, renamedFile);
      }
      const data = await mainAction.API_spCallPostFile(formData, dispatch);
      let _img = data.Message.replaceAll('"', "");
      listfile = _img.replace("[", "").replace("]", "");
    }
    let listimage = "";
    if (ImageUpload !== "" && ImageUpload.length > 0) {
      const formData = new FormData();
      formData.append("Key", "Files2");
      for (let i = 0; i < ImageUpload.length; i++) {
        formData.append("myFile" + i, ImageUpload[i]);
      }
      const data = await mainAction.API_spCallPostFile(formData, dispatch);
      let _img = data.Message.replaceAll('"', "");
      listimage = _img.replace("[", "").replace("]", "");
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
        Money: invoice.TotalMoney, // ?
        VAT: invoice.isVAT ? 10 : 0,
        MoneyVAT: (invoice.isVAT ? 10 : 0 * invoice.TotalMoney) / 100,
        MoneyPayment:
          invoice.TotalMoney -
          (invoice.isVAT ? 10 : 0 * invoice.TotalMoney) / 100,
        Decscription: invoice.Decscription,
        NotePayment: invoice.NotePayment,
        DatePayment: FormatDateJson(invoice.DatePayment),
        BookingDetailId: DataObject.BookingDetailId,
        TypePm: DataObject.TypePm,
        Creater: Creater,
        CreateName: CreateName,
        StyleId: invoiceStyle.StyleId,
        StyleName: invoiceStyle.StyleName,
        TypeInvoice: invoiceStyle.TypeInvoice,
        DepartmentId: +DepartmentId,
        TypeOfReceipt: "PHIEUTHUNHOM",
        AttackFile: listfile,
        AttackImage: listimage,
        BookingDetailIdList:
          DataObject?.CustomerList && DataObject.CustomerList.length > 0
            ? DataObject.CustomerList.map((item) => {
                return { BookingDetailId: item.BookingDetailId };
              })
            : [],
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_Save",
      };
      const respone = await mainAction.API_spCallServer(params, dispatch);
      if (respone.Status === "OK") {
        Alertsuccess(respone.ReturnMess);
        setFileUpload([]);
        setImageUpload([]);
        // onInvoiceInfor(
        //   {
        //     Money: invoice.Money,
        //     VAT: invoice.VAT,
        //     InvoiceId: +respone.InvoiceId, //update invoiceid vao detail booking
        //     BookingDetailId: DataObject.BookingDetailId,
        //     BookingId: Booking.BookingId,
        //     CustomerId: DataObject.CustomerId,
        //     TypePm: 'phieuthunhom',
        //   },
        //   +invoiceStyle.TypeInvoice
        // );
        Trl_spInvoice_List(respone.InvoiceId);
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
      TotalMoney: 0,
      Money: 0,
    });
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
          ...respone[0],
          typeOfMoney: {
            value: respone[0].TypeMoneyType,
            label: respone[0].TypeMoneyName,
          },
          typeOfPayment: {
            value: respone[0].PaymentType,
            label: respone[0].PaymentName,
          },
          InvoiceType: respone[0].InvoiceType,
          DatePayment: respone[0].DatePayment,
          ExchangeRate: respone[0].ExchangeRate,
          TotalMoney: respone[0].TotalMoney,
          Money: respone[0].Money,
          VAT: respone[0].VAT,
          isVAT: respone[0].VAT > 0 ? true : false,
          Decscription: respone[0].Decscription,
          NotePayment: respone[0].NotePayment,
          InvoiceId: respone[0].InvoiceId,
          StatusId: respone[0].StatusId,
          StatusName: respone[0].StatusName,
          Files: respone[0].Files,
          CreateConfirm: respone[0].CreateConfirm,
          CreateConfirmName: respone[0].CreateConfirmName,
          CreateConfirmTime: respone[0].CreateConfirmTime,
          Confirm1: respone[0].Confirm1,
          Confirm2: respone[0].Confirm2,
          Confirm3: respone[0].Confirm3,
          Confirm4: respone[0].Confirm4,
          ConfirmName1: respone[0].ConfirmName1,
          ConfirmName2: respone[0].ConfirmName2,
          ConfirmName3: respone[0].ConfirmName3,
          ConfirmName4: respone[0].ConfirmName4,
          ConfirmTime1: respone[0].ConfirmTime1,
          ConfirmTime2: respone[0].ConfirmTime2,
          ConfirmTime3: respone[0].ConfirmTime3,
          ConfirmTime4: respone[0].ConfirmTime4,
          Files1: respone[0].Files1,
          Files2: respone[0].Files2,
          Files3: respone[0].Files3,
          Files4: respone[0].Files4,
          Document: respone[0].Document,
          Document1: respone[0].Document1,
          Document2: respone[0].Document2,
          Document3: respone[0].Document3,
          Document4: respone[0].Document4,
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
            TotalMoney: 0,
            Money: 0,
          });
          // cancelInvoice();
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
  const [ImageUpload, setImageUpload] = useState([]);
  const [FileUpload, setFileUpload] = useState([]);
  const onChangeFileOrImage = (e, type) => {
    if (type === 0) setFileUpload(e);
    else setImageUpload(e);
  };

  return (
    <div className="row booking">
      <div class="card m-1 card-shadow shadow">
        <div class="card-header card-header-custom p-0 px-1 mt-1 d-flex align-items-center ">
          <div class="row d-flex align-items-center justify-content-center w-100">
            <div class="col-sm-12 col-md-6">
              <h3 class="card-title font-weight-bold text-dark pl-3">
                {invoice?.InvoiceCode &&
                  invoice?.InvoiceCode !== "" &&
                  `Mã phiếu: ${invoice?.InvoiceCode}`}
              </h3>
            </div>
            <div class="col-sm-12 col-md-6">
              <div
                style={{ display: invoice?.StatusId === 2 ? "none" : "block" }}
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
                  Hủy đề xuất
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-success pull-right"
                  onClick={Trl_spInvoice_Save}
                >
                  <i class="fa fa-edit pr-2"></i>
                  {invoice.InvoiceId === 0 ? "Tạo đề xuất" : "Cập nhật đề xuất"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body pt-3">
          <div className="row  booking">
            {/* <div className="col-6">
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
              <div class="form-group clearfix">
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
            </div> */}

            <div class="col-sm-12 col-md-6">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  NGÀY THANH TOÁN
                </span>
                <div class="input-group ">
                  <DateTimePicker
                    className="form-control2"
                    value={
                      invoice?.DatePayment
                        ? new Date(invoice.DatePayment)
                        : new Date()
                    }
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
                <span class="small font-weight-bold text-muted">ĐỐI TƯỢNG</span>
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
                  {+invoice?.ObjectId?.value === 0 ||
                  +invoice?.ObjectId?.value === -1 ||
                  !invoice?.ObjectId?.value
                    ? "NHÓM KHÁCH HÀNG"
                    : invoice?.ObjectId?.label}
                </span>
                <div class=" input-group">
                  <input
                    type="text"
                    class="form-control2"
                    value={invoice.CustomerName}
                    onChange={(e) =>
                      setInvoice({ ...invoice, CustomerName: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-12">
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
                <span class="small font-weight-bold text-muted">
                  DANH SÁCH KHÁCH HÀNG TRONG NHÓM
                </span>
                <div className="customer-list ">
                  {DataObject?.CustomerList?.map((item, index) => {
                    return (
                      <div className="customer-item" key={index}>
                        <span>
                          {item.CustomerName} - {item.DOB} - {item.Phone}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div class="col-sm-12 col-md-6">
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
            <div class="col-sm-12 col-md-6">
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
            <div className="col-sm-12 col-md-12 ">
              <div class="form-group clearfix">
                <span class="small font-weight-bold text-muted">
                  LẤY HÓA ĐƠN
                </span>
                <div className=" input-group">
                  <div class="icheck-success d-inline ">
                    <input
                      type="checkbox"
                      name="r3"
                      id="radioSuccess3"
                      checked={invoice.isVAT}
                      onChange={() =>
                        setInvoice({ ...invoice, isVAT: !invoice.isVAT })
                      }
                    />
                    <label for="radioSuccess3"></label>
                  </div>
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
                    value={FormatMoney(invoice?.TotalMoney || 0)}
                    onChange={(e) =>
                      setInvoice({
                        ...invoice,
                        TotalMoney: FormatMoney(e.target.value, 1),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* <div class="col-sm-12 col-md-12">
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
            </div> */}

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
            <UploadFile
              onImageUpload={(e) => {
                onChangeFileOrImage(e, 1);
              }}
              onFileUpload={(e) => {
                onChangeFileOrImage(e, 0);
              }}
              fileData={{
                fileShow: invoice?.AttackFile,
                imageShow: invoice?.AttackImage,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

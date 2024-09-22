import { useState, useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import { useDispatch } from "react-redux";
import {
  SelectObjectStatus,
  SelectInvoiceStatus,
  SelectExpenseItem,
  UploadFile,
} from "../../../../Common";
import { mainAction } from "../../../../Redux/Actions";
import { FormatMoney, ConfirmAlert, ConvertFileName } from "../../../../Utils";
import Select from "react-select";
import SignatureCanvas from "react-signature-canvas";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  FormatDateJson,
} from "../../../../Utils";
import { InvoiceConfirmTemp } from "../Accounting/InvoiceConfirmTemp";
import { Button, Modal } from "react-bootstrap";

export const InvoiceGroupAc = ({
  isActive = 0,
  //invoiceStyle = "",
  GroupInvoice = [],
  GroupCode = "",
  reloadS = () => {},
}) => {
  const dispatch = useDispatch();
  const Creater = +localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const DepartmentId = +localStorage.getItem("DepartmentId");
  const [show, setShow] = useState(false);
  const [invoice, setInvoice] = useState({
    TypeOfMoney: { value: 0, label: "Vui lòng chọn" },
    TypeOfPayment: { value: 0, label: "Vui lòng chọn" },
    StyleId: 0,
    StyleName: "",
    InvoiceType: "A",
    DatePayment: new Date(),
    InvoiceId: 0,
    TotalMoney: 0,
    Money: 0,
    BookingId: 0,
    TypeOfReceipt: "PHIEUTHUNHOMAC",
    GroupId: 0,
    TypeInvoice: 0,
    InvoiceCode: "",
  });

  const [flagResetFile, setFlagResetFile] = useState(0);
  const [ImageUpload, setImageUpload] = useState([]);
  const [FileUpload, setFileUpload] = useState([]);

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
        TypeOfMoney: e,
      });
    } else {
      setInvoice({
        ...invoice,
        TypeOfPayment: e,
      });
    }
  };

  const handleClose2 = (title = "Bạn có chắc chắn muốn tắt form không ?") => {
    ConfirmAlert(title, "", async () => {
      setShow(false);
      isActive = false;
    });
  };

  const Trl_spInvoice_Save = (
    value,
    title = "Bạn có chắc chắn muốn tạo " +
      (invoice.TypeOfReceipt === "PHIEUTHUNHOMAC"
        ? "phiếu thu nhóm"
        : "phiếu đề xuất nhóm") +
      " không?"
  ) => {
    if (!invoice.TypeOfMoney?.value || invoice.TypeOfMoney?.value === 0) {
      Alertwarning("Vui lòng chọn loại tiền");
      return;
    }
    if (!invoice.TypeOfPayment?.value || invoice.TypeOfPayment?.value === 0) {
      Alertwarning("Vui lòng chọn hình thức thanh toán");
      return;
    }
    if (!invoice.DatePayment) {
      Alertwarning("Vui lòng chọn ngày thanh toán");
      return;
    }
    /*  if (!invoice?.Money) {
             Alertwarning("Vui lòng nhập giá trị tạm ứng hợp lệ");
             return;
         }
         if (+invoice.Money > +invoice.TotalMoney) {
             Alertwarning("Giá trị tạm ứng không hợp lệ");
             return;
         } */
    ConfirmAlert(
      title,
      "",
      async () => {
        try {
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
            const data = await mainAction.API_spCallPostFile(
              formData,
              dispatch
            );
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
            const data = await mainAction.API_spCallPostFile(
              formData,
              dispatch
            );
            let _img = data.Message.replaceAll('"', "");
            listimage = _img.replace("[", "").replace("]", "");
          }
          let newListFile = [invoice.AttackFile, listfile]
            .filter((p) => p !== "" && p !== undefined && p !== "undefined")
            .join(",");
          let newListImage = [invoice.AttackImage, listimage]
            .filter((p) => p !== "" && p !== undefined && p !== "undefined")
            .join(",");
          let pr = {
            GroupId: 0,
            InvoiceId: invoice.InvoiceId,
            InvoiceCode: GroupCode,
            InvoiceType: invoice.InvoiceType, // A thu, B chi
            ObjectId: invoice.ObjectId.value,
            ObjectName: invoice.ObjectId.label,
            ObId: invoice.CustomerId, // sub of objID
            ObName: invoice.CustomerName,
            TypeMoneyType: invoice.TypeOfMoney.value,
            TypeMoneyName: invoice.TypeOfMoney.label,
            ExchangeRate: invoice.ExchangeRate,
            BookingId: invoice.BookingId,
            PaymentType: invoice.TypeOfPayment.value,
            PaymentName: invoice.TypeOfPayment.label,
            TotalMoney: invoice.TotalMoney,
            Money: invoice.Money, // ?
            VAT: invoice.isVAT ? 10 : 0,
            MoneyVAT: (invoice.isVAT ? 10 : 0 * invoice.Money) / 100,
            MoneyPayment:
              invoice.TotalMoney -
              (invoice.isVAT ? 10 : 0 * invoice.Money) / 100,
            Decscription: invoice.Decscription,
            NotePayment: invoice.NotePayment,
            DatePayment: FormatDateJson(invoice.DatePayment),
            BookingDetailId: 0,
            //TypePm: DataObject.PaymentType,
            Creater: GroupInvoice[0].Creater,
            CreateName: GroupInvoice[0].CreateName,
            StyleId: invoice.StyleId,
            StyleName: invoice.StyleName,
            TypeInvoice: 0,
            //BookingPlaneId: +idPlane?.BookingPlaneId,
            //BookingTourGuideId: +idTourLeader[0]?.BookingTourGuideId,
            DepartmentId: +DepartmentId,
            TypeOfReceipt: invoice.TypeOfReceipt,
            BookingDetailIdList:
              GroupInvoice.length > 0
                ? GroupInvoice.map((item) => {
                    return {
                      BookingDetailId: item.BookingDetailId,
                      InvoiceId: item.InvoiceId,
                    };
                  })
                : [],
            StepConfirm: GroupInvoice[0].StepConfirm,
            StatusId: GroupInvoice[0].StatusId,
            StatusName: GroupInvoice[0].StatusName,
            AttackFile: newListFile,
            AttackImage: newListImage,
            TotalInvoiceGroup: GroupInvoice.length,
            BankAccount: invoice.BankAccount,
          };
          const params = {
            Json: JSON.stringify(pr),
            func: "Trl_spInvoice_Save",
          };
          const respone = await mainAction.API_spCallServer(params, dispatch);
          if (respone.Status === "OK") {
            Alertsuccess(respone.ReturnMess);
            setShow(false);
            isActive = false;
            reloadS();
            setFlagResetFile(1);
            setFlagResetFile(0);
          }
        } catch (error) {
          ;
        }
      },
      "Tôi đồng ý"
    );
  };

  useEffect(() => {
    setShow(isActive);
  }, [isActive]);

  useEffect(() => {
    if (GroupInvoice !== []) {
      setInvoice({
        ...invoice,
        TypeOfMoney: { value: 1, label: "VND" },
        TypeOfPayment: { value: 2, label: "Chuyển khoản" },
        InvoiceType: "A",
        DatePayment: new Date(),
        ExchangeRate: "1.0",
        InvoiceId: 0,
        InvoiceCode: "",
        VAT: 0,
        MoneyVAT: 0,
        MoneyPayment: 0,
        Decscription: GroupInvoice[0]?.Decscription,
        NotePayment: GroupInvoice[0]?.NotePayment,
        PaymentType: GroupInvoice[0]?.BankAccount || "",
        StatusId: 1,
        CustomerName: GroupInvoice[0]?.CustomerName,
        StyleId: GroupInvoice[0]?.StyleId,
        StyleName: GroupInvoice[0]?.StyleName,
        TotalMoney:
          GroupInvoice.reduce((a, v) => (a = a + v.TotalMoney), 0) || 0,
        Money: GroupInvoice.reduce((a, v) => (a = a + v.Money), 0) || 0,
        BookingId: GroupInvoice[0]?.BookingId,
        ObjectId: {
          value: GroupInvoice[0]?.ObjectId || 0,
          label: GroupInvoice[0]?.ObjectName || "",
        },
        //TypeOfMoney: { value: GroupInvoice[0]?.TypeMoneyType || 0, label: GroupInvoice[0]?.TypeMoneyName || "" },
        //TypeOfPayment: { value: GroupInvoice[0]?.PaymentType || 0, label: GroupInvoice[0]?.PaymentName || "" }
      });
    }
  }, [GroupInvoice]);

  const onChangeFileOrImage = (e, type) => {
    if (type === 0) setFileUpload(e);
    else setImageUpload(e);
  };

  return (
    <Modal show={show} onHide={handleClose2} size="xl">
      <Modal.Header>
        <Modal.Title>PHIẾU THU NHÓM {GroupCode}</Modal.Title>
        <Button
          type="button"
          className="close"
          aria-label="Đóng"
          onClick={() => {
            handleClose2();
          }}
        >
          <span aria-hidden="true">&times;</span>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <>
          <div className="row  booking">
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
                    onObjectId={{
                      value: GroupInvoice[0]?.ObjectId,
                      label: GroupInvoice[0]?.ObjectName,
                    }}
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
                    value={invoice?.CustomerName}
                    onChange={(e) =>
                      setInvoice({ ...invoice, CustomerName: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            {GroupInvoice[0]?.InvoiceType !== "C" && (
              <>
                <div class="col-sm-12 col-md-12">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      BOOKING/TOUR
                    </span>
                    <div class=" input-group">
                      <input
                        type="text"
                        class="form-control2"
                        value={GroupInvoice[0]?.BookingCode}
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
                      {GroupInvoice.map((item, index) => {
                        return (
                          <div className="customer-item" key={index}>
                            <span>
                              {item.CustomerName} -{" "}
                              {FormatDateJson(item.Brithday, 7)} - {item.Phone}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div class="col-sm-12 col-md-6">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">LOẠI TIỀN</span>
                <div class="input-group">
                  <Select
                    className={"w-100 select-custom"}
                    value={invoice?.TypeOfMoney}
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
                    value={invoice?.ExchangeRate}
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
                      checked={invoice?.isVAT}
                      onChange={() =>
                        setInvoice({ ...invoice, isVAT: !invoice?.isVAT })
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
                    value={FormatMoney(invoice?.TotalMoney)}
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

            {/*  <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">
                                    GIÁ TRỊ TẠM ỨNG
                                </span>
                                <div class=" input-group">
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={FormatMoney(invoice?.Money)}
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
                    value={invoice?.TypeOfPayment}
                    onChange={(e) => onChange(e, "typeOfPayment")}
                    options={typeOfPayment}
                  />
                </div>
              </div>
            </div>
            {invoice?.TypeOfPayment.value === 2 && (
              <div class="col-sm-12 col-md-12">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    TÀI KHOẢN NGÂN HÀNG
                  </span>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control2"
                      value={invoice.BankAccount}
                      onChange={(e) =>
                        setInvoice({
                          ...invoice,
                          BankAccount: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

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
                    value={invoice?.Decscription}
                    onChange={(e) =>
                      setInvoice({ ...invoice, Decscription: e.target.value })
                    }
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
                    rows="2"
                    cols="50"
                    value={invoice?.NotePayment}
                    onChange={(e) =>
                      setInvoice({ ...invoice, NotePayment: e.target.value })
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
                fileShow: invoice?.AttackFile || "",
                imageShow: invoice?.AttackImage || "",
              }}
              flag={flagResetFile}
            />
          </div>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          onClick={(e) => {
            Trl_spInvoice_Save();
          }}
        >
          <i className="fas fa-save pr-2"></i> Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

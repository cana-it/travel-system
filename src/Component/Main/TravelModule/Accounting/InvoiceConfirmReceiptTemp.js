import React, { useEffect, useState } from "react";
import {
  Alerterror,
  Alertsuccess,
  ConfirmAlert,
  FormatMoney,
} from "../../../../Utils";
import { SelectInvoiceStatus } from "../../../../Common";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import moment from "moment";
import { Img } from "react-image";
const InvoiceConfirmReceiptTempComp = ({
  onInvoice = () => {},
  reloadS = () => {},
}) => {
  const dispatch = useDispatch();
  const Creater = +localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const DepartmentId = +localStorage.getItem("DepartmentId");
  const Sign = localStorage.getItem("Signature") || "";

  const [StepActive, setStepActive] = useState(1);
  const [StepFocus, setStepFocus] = useState(1);
  const [StepConfirm, setStepConfirm] = useState(0);

  const [Invoice, setInvoice] = useState({});
  useEffect(() => {
    if (onInvoice !== {}) {
      let _invoice = onInvoice;
      Trl_spInvoice_List_Detail(_invoice);
    }
  }, [onInvoice]);

  const [IsConfirm, setIsConfirm] = useState(0);

  const Trl_spStaffConfirmInvoice_Check_Step = async (CreateConfirm, Step) => {
    try {
      const pr = {
        StaffId: CreateConfirm,
        Creater: Creater,
        Step: Step,
        Type: "A",
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spStaffConfirmInvoice_Check_Step",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      if (list.Status > 0) setIsConfirm(true);
      else setIsConfirm(false);
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spInvoice_List_Detail = async (_invoice) => {
    try {
      const pr = {
        Creater: Creater,
        InvoiceId: _invoice.InvoiceId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_List_Detail_V1",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      _invoice.Files = list[0].Files;
      _invoice.CreateConfirm = list[0].CreateConfirm;
      _invoice.CreateConfirmName = list[0].CreateConfirmName;
      _invoice.CreateConfirmTime = list[0].CreateConfirmTime;
      _invoice.Files1 = list[0].Files1;
      _invoice.Confirm1 = list[0].ConfirmName1;
      _invoice.ConfirmName1 = list[0].ConfirmName1;
      _invoice.ConfirmTime1 = list[0].ConfirmTime1;
      let step = _invoice?.Step;
      setInvoice(_invoice);
      if (
        step === 2 &&
        (_invoice?.StatusFilter === 3 || _invoice?.StatusFilter === 4)
      ) {
        setIsConfirm(0);
        setStepActive(2); //Active step cần xác nhận để tô màu cam
        setStepFocus(2); //Focus vào step tiếp theo
        setStepConfirm(2); //Đã xác nhận bước nào
      } else {
        Trl_spStaffConfirmInvoice_Check_Step(
          _invoice?.CreateConfirm,
          2,
          _invoice?.InvoiceType
        ); //Kiểm tra quyền xác nhận
        setStepActive(2); //Active step cần xác nhận để tô màu cam
        setStepFocus(2); //Focus vào step tiếp theo
        setStepConfirm(1); //Đã xác nhận bước nào
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  //#region Approve

  const [StatusId, setStatusId] = useState({
    value: 0,
    label: "Vui lòng chọn trạng thái thanh toán",
  });
  const [NoteConfirm, setNoteConfirm] = useState();

  const Trl_spInvoice_Approve = async () => {
    if (Sign === undefined || Sign === "") {
      Alerterror("Vui lòng tạo chữ ký điện tử trước");
      return;
    }
    if ((StatusId?.value || 0) === 0) {
      Alerterror("Vui lòng chọn trạng thái thanh toán để xác nhận");
      return;
    }
    try {
      let pr = {
        InvoiceId: Invoice.GroupId || Invoice.InvoiceId,
        StatusId: StatusId?.value || 1,
        StatusName: StatusId?.label || "Đề nghị thanh toán",
        Notes: NoteConfirm,
        Files: Sign,
        Creater: Creater,
        CreateName: CreateName,
        MoneyReceive:
          StatusId?.value === 5 || StatusId?.value === 6
            ? Invoice.MoneyReceive
            : Invoice.TotalMoney,
        Step: StepActive,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_Approve",
      };
      const respone = await mainAction.API_spCallServer(params, dispatch);
      reloadS();
      if (respone.Status === "OK") {
        Alertsuccess(respone.ReturnMess);
        //if (SignatureInvoice !== undefined) SignatureInvoice.clear();
        setNoteConfirm("");
        //setIsOpen(false);
        //Trl_spInvoice_List();
        return;
      } else {
        Alertsuccess(respone.ReturnMess);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi server, liên hệ IT");
      return;
    }
  };

  //#endregion

  return (
    <>
      {Invoice?.InvoiceId !== 0 && Invoice?.InvoiceId !== undefined && (
        <>
          {Invoice?.StatusId !== 0 && (
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group text-center">
                  Trạng thái:{" "}
                  <span
                    style={{ fontSize: "18px" }}
                    className={
                      Invoice?.StatusId === 2
                        ? "badge badge-success"
                        : Invoice?.StatusId === 4
                        ? "badge badge-warning"
                        : Invoice?.StatusId === 1
                        ? "badge badge-orange"
                        : "badge badge-danger"
                    }
                  >
                    {Invoice?.StatusName || "Chờ xử lý"}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div class="row justify-content-center">
            <div class="col-sm-12 text-center">
              <div class="px-0 pt-4 pb-0">
                <div className="stepper">
                  <ul id="progressbar">
                    <li
                      class={
                        "cursor" +
                        (StepActive === 1 ? " active" : "") +
                        (StepConfirm >= 1 ? " done" : "") +
                        (StepFocus === 1 ? " focus" : "")
                      }
                      onClick={(e) => setStepFocus(1)}
                      style={{ width: "50%" }}
                      id="step1"
                    >
                      <strong>NGƯỜI ĐỀ XUẤT</strong>
                    </li>
                    <li
                      class={
                        "cursor" +
                        (StepActive === 2 ? " active" : "") +
                        (StepConfirm >= 2 ? " done" : "") +
                        (StepFocus === 2 ? " focus" : "")
                      }
                      onClick={(e) =>
                        setStepFocus(StepActive < 2 ? StepFocus : 2)
                      }
                      style={{ width: "50%" }}
                      id="step2"
                    >
                      <strong>THỦ QUỸ</strong>
                    </li>
                  </ul>
                  <div class="progress">
                    <div
                      class="progress-bar"
                      style={{ width: (StepConfirm / 2) * 100 + "%" }}
                    ></div>
                  </div>{" "}
                  <br />
                </div>
              </div>
            </div>
          </div>
          <div className="card-body pt-3">
            <div className="row">
              {StepActive === StepFocus &&
                IsConfirm === true &&
                StepConfirm < 2 && (
                  <>
                    <div className="col-md-6 col-sm-12">
                      {Sign !== "" && (
                        <>
                          Chữ ký điện tử có sẵn
                          <br />
                          <img src={Sign} alt="Chữ ký điện tử" />
                        </>
                      )}
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          TRẠNG THÁI THANH TOÁN
                        </span>
                        <div class="input-group">
                          <SelectInvoiceStatus
                            onSelected={(e) => setStatusId(e)}
                            onStatusId={StatusId}
                            className={"w-100 select-custom"}
                            TotalStep={2}
                          />
                        </div>
                      </div>
                      {((StatusId?.value || 0) === 5 ||
                        (StatusId?.value || 0) === 6) && (
                        <div class="form-group">
                          <span class="small font-weight-bold text-muted">
                            SỐ TIỀN THỦ QUỸ NHẬN
                          </span>
                          <div class=" input-group">
                            <input
                              type="text"
                              class="form-control2"
                              value={FormatMoney(
                                Invoice?.MoneyReceive || Invoice?.TotalMoney
                              )}
                              onChange={(e) =>
                                setInvoice({
                                  ...Invoice,
                                  MoneyReceive: FormatMoney(e.target.value, 1),
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          GHI CHÚ
                        </span>
                        <div class=" input-group">
                          <textarea
                            type="text"
                            class="form-control2"
                            rows="4"
                            cols="50"
                            value={NoteConfirm}
                            onChange={(e) => setNoteConfirm(e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        class="btn btn-sm btn-success pull-right"
                        onClick={() => {
                          ConfirmAlert(
                            "Bạn có chắc chắn muốn xác nhận?",
                            "Xác nhận",
                            () => {
                              Trl_spInvoice_Approve();
                            },
                            "Đồng ý",
                            "Hủy bỏ"
                          );
                        }}
                      >
                        <i class="fa fa-edit pr-2"></i>
                        Xác nhận
                      </button>
                    </div>
                  </>
                )}
              {StepFocus === 1 && StepConfirm >= 1 && (
                <>
                  <div className="col-md-6 col-sm-12">
                    <div class="form-group">
                      Người đề xuất xác nhận: {Invoice?.CreateConfirmName}
                    </div>
                    <div class="form-group">
                      Thời gian xác nhận:{" "}
                      {Invoice?.CreateConfirmTime
                        ? moment(Invoice?.CreateConfirmTime).format(
                            "HH:mm:ss DD/MM/YYYY "
                          )
                        : ""}
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div class="form-group">
                      Chữ ký:
                      <br />
                      <Img
                        key={"signature1"}
                        style={{ width: "100%" }}
                        src={Invoice?.Files}
                        alt="Chữ ký người đề xuất"
                      />
                    </div>
                  </div>
                </>
              )}
              {StepFocus === 2 && StepConfirm >= 2 && (
                <>
                  <div className="col-md-6 col-sm-12">
                    <div class="form-group">
                      Thủ quỹ xác nhận: {Invoice?.ConfirmName1}
                    </div>
                    <div class="form-group">
                      Thời gian xác nhận:{" "}
                      {Invoice?.CreateConfirmTime
                        ? moment(Invoice?.CreateConfirmTime).format(
                            "HH:mm:ss DD/MM/YYYY "
                          )
                        : ""}
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div class="form-group">
                      Chữ ký: <br />
                      <Img
                        key={"signature2"}
                        style={{ width: "100%" }}
                        src={Invoice?.Files1}
                        alt="Chữ ký thủ quỹ"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const InvoiceConfirmReceiptTemp = React.memo(
  InvoiceConfirmReceiptTempComp
);

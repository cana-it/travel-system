import React, { useEffect, useState } from "react";
import {
  Alerterror,
  Alertsuccess,
  ConfirmAlert,
  ConvertFileName,
} from "../../../../Utils";
import { SelectInvoiceStatus, ShowFiles, UploadFile } from "../../../../Common";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import moment from "moment";
import { Img } from "react-image";
const InvoiceConfirmTempComp = ({
  onInvoice = () => {},
  onInvoiceInfor = () => {},
  DataObject = () => {},
  onClose = () => {},
  reloadS = () => {},
  type = 0,
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

  const [StatusId, setStatusId] = useState({
    value: 1,
    label: "Đề nghị thanh toán",
  });

  /* useEffect(() => {
    if (onInvoice !== {}) {
      let _invoice = onInvoice;
      setInvoice(_invoice);
      setStepActive(_invoice?.Step + 1); //Active step cần xác nhận để tô màu cam
      setStepFocus(_invoice?.Step + 1); //Focus vào step tiếp theo
      setStepConfirm(_invoice?.Step); //Đã xác nhận bước nào
      if (_invoice?.Step > 0 && _invoice.StatusId === 3) setIsConfirm(0);
      else
        Trl_spStaffConfirmInvoice_Check_Step(
          _invoice?.CreateConfirm,
          (_invoice?.Step || 0) + 1,
          _invoice.InvoiceType
        ); //Kiểm tra quyền xác nhận
    }
  }, [onInvoice]); */

  useEffect(() => {
    if (onInvoice !== {} && type === 0) {
      let _invoice = onInvoice;
      type === 0 && Trl_spInvoice_List_Detail(_invoice);
    }
  }, [onInvoice]);

  useEffect(() => {
    if (onInvoice !== {} && type === 1) {
      let _invoice = onInvoice;
      Trl_spInvoice_List_Detail(_invoice);
    }
  }, [onInvoice.InvoiceId]);

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

      _invoice.Files2 = list[0].Files2;
      _invoice.Confirm2 = list[0].ConfirmName2;
      _invoice.ConfirmName2 = list[0].ConfirmName2;
      _invoice.ConfirmTime2 = list[0].ConfirmTime2;

      _invoice.Files3 = list[0].Files3;
      _invoice.Confirm3 = list[0].ConfirmName3;
      _invoice.ConfirmName3 = list[0].ConfirmName3;
      _invoice.ConfirmTime3 = list[0].ConfirmTime3;

      _invoice.Files4 = list[0].Files4;
      _invoice.Confirm4 = list[0].ConfirmName4;
      _invoice.ConfirmName4 = list[0].ConfirmName4;
      _invoice.ConfirmTime4 = list[0].ConfirmTime4;

      _invoice.FileStep5 = list[0].FileStep5;
      _invoice.ImageStep5 = list[0].ImageStep5;

      let checkStep = 0;
      setInvoice(_invoice);
      if (
        (_invoice?.StatusFilter === 3 && list[0].Step === 5) ||
        _invoice?.StatusFilter === 4
      ) {
        setIsConfirm(0);
        setStepActive(list[0].Step); //Active step cần xác nhận để tô màu cam
        setStepFocus(list[0].Step); //Focus vào step tiếp theo
        setStepConfirm(list[0].Step); //Đã xác nhận bước nào
      } else if (_invoice?.StatusFilter === 2) {
        setStepActive(list[0].Step); //Active step cần xác nhận để tô màu cam
        setStepFocus(list[0].Step); //Focus vào step tiếp theo
        setStepConfirm(list[0].Step - 1); //Đã xác nhận bước nào
        Trl_spStaffConfirmInvoice_Check_Step(
          list[0].CreateConfirm,
          list[0].Step - 1,
          list[0].InvoiceType
        );
        checkStep = list[0].Step - 1;
        //Alerterror("Lùi 1 step !!!");
      } else {
        setStepActive(list[0].Step + 1); //Active step cần xác nhận để tô màu cam
        setStepFocus(list[0].Step + 1); //Focus vào step tiếp theo
        setStepConfirm(list[0].Step); //Đã xác nhận bước nào
        Trl_spStaffConfirmInvoice_Check_Step(
          list[0].CreateConfirm,
          list[0].Step + 1,
          list[0].InvoiceType
        );
        checkStep = list[0].Step;
      }
      if (checkStep === 0) {
        setStatusId({
          value: 1,
          label: "Đề nghị thanh toán",
        });
      }
      if (checkStep === 1) {
        setStatusId({
          value: 8,
          label: "TREO",
        });
      }
      if (checkStep === 2) {
        setStatusId({
          value: 1,
          label: "Đề nghị thanh toán",
        });
      }
      if (checkStep === 3) {
        setStatusId({
          value: 8,
          label: "TREO",
        });
      }
      if (checkStep === 4) {
        setStatusId({
          value: 11,
          label: "ĐÃ CHI",
        });
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const [IsConfirm, setIsConfirm] = useState(0);

  const Trl_spStaffConfirmInvoice_Check_Step = async (
    CreateConfirm,
    Step,
    Type
  ) => {
    try {
      const pr = {
        StaffId: CreateConfirm, //User tạo phiếu
        Creater: Creater,
        Step: Step,
        Type: Type,
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

  //#region Approve

  const [NoteConfirm, setNoteConfirm] = useState();

  const Trl_spInvoice_Approve = async () => {
    try {
      if (Sign === undefined || Sign === "") {
        Alerterror("Vui lòng tạo chữ ký điện tử trước");
        return;
      }
      if ((StatusId?.value || 0) === 0) {
        Alerterror("Vui lòng chọn trạng thái thanh toán để xác nhận");
        return;
      }

      let listfile = "";
      if (fileUpload !== "" && fileUpload.length > 0) {
        const formData = new FormData();
        formData.append("Key", "Files1");
        for (let i = 0; i < fileUpload.length; i++) {
          let f = fileUpload[i];
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
      if (imageUpload !== "" && imageUpload.length > 0) {
        const formData = new FormData();
        formData.append("Key", "Files2");
        for (let i = 0; i < imageUpload.length; i++) {
          formData.append("myFile" + i, imageUpload[i]);
        }
        const data = await mainAction.API_spCallPostFile(formData, dispatch);
        let _img = data.Message.replaceAll('"', "");
        listimage = _img.replace("[", "").replace("]", "");
      }
      let newListFile = [Invoice.FileStep5, listfile]
        .filter((p) => p !== "" && p !== undefined && p !== "undefined")
        .join(",");
      let newListImage = [Invoice.ImageStep5, listimage]
        .filter((p) => p !== "" && p !== undefined && p !== "undefined")
        .join(",");

      let pr = {
        InvoiceId: Invoice?.InvoiceId,
        StatusId: StatusId?.value,
        StatusName: StatusId?.label,
        Notes: NoteConfirm,
        Files: Sign,
        Creater: Creater,
        CreateName: CreateName,
        Step: StepActive,
        ExpenseItemId: Invoice?.ExpenseItemId,
        FileStep5: newListFile,
        ImageStep5: newListImage,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spInvoice_Approve",
      };

      const respone = await mainAction.API_spCallServer(params, dispatch);
      reloadS();
      if (respone.Status === "OK") {
        Alertsuccess(respone.ReturnMess);
        Trl_spInvoice_List_Detail(Invoice);
        await onInvoiceInfor({
          BookingDetailId: Invoice?.BookingDetailId,
          CustomerId: Invoice?.CustomerId,
          TypePm: Invoice?.TypePm, // V1 là invoice1, V2 là invoice2...
          InvoiceId: Invoice?.InvoiceId, //update invoiceid vao detail booking
          StatusId: StatusId?.value,
          StatusName: StatusId?.label,
        });
        setNoteConfirm("");
        onClose(1);
        return;
      } else {
        Alertsuccess(respone.ReturnMess);
        onClose(2);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi server, liên hệ IT");
      return;
    }
  };

  //#endregion
  const [fileUpload, setfileUpload] = useState("");
  const [imageUpload, setimageUpload] = useState("");
  const onChangeFileOrImage = (e, type) => {
    if (type === 0) setfileUpload(e);
    else setimageUpload(e);
  };

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
                      Invoice?.StatusId === 2 ||
                      Invoice?.StatusId === 9 ||
                      Invoice?.StatusId === 11
                        ? "badge badge-success"
                        : Invoice?.StatusId === 4 ||
                          Invoice?.StatusId === 8 ||
                          Invoice?.StatusId === 14
                        ? "badge badge-warning"
                        : Invoice?.StatusId === 1
                        ? "badge badge-orange"
                        : "badge badge-danger"
                    }
                  >
                    {Invoice?.StatusName || "Chờ xử lý"}
                    {(Invoice?.StatusId === 4 ||
                      Invoice?.StatusId === 8 ||
                      Invoice?.StatusId === 14) && (
                      <span style={{ marginLeft: "5px" }}>({StepActive})</span>
                    )}
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
                      id="step2"
                    >
                      <strong>QL PHÒNG</strong>
                    </li>
                    <li
                      class={
                        "cursor" +
                        (StepActive === 3 ? " active" : "") +
                        (StepConfirm >= 3 ? " done" : "") +
                        (StepFocus === 3 ? " focus" : "")
                      }
                      onClick={(e) =>
                        setStepFocus(StepActive < 3 ? StepFocus : 3)
                      }
                      id="step3"
                    >
                      <strong>KẾ TOÁN</strong>
                    </li>
                    <li
                      class={
                        "cursor" +
                        (StepActive === 4 ? " active" : "") +
                        (StepConfirm >= 4 ? " done" : "") +
                        (StepFocus === 4 ? " focus" : "")
                      }
                      onClick={(e) =>
                        setStepFocus(StepActive < 4 ? StepFocus : 4)
                      }
                      id="step4"
                    >
                      <strong>BAN LÃNH ĐẠO</strong>
                    </li>
                    <li
                      class={
                        "cursor" +
                        (StepActive === 5 ? " active" : "") +
                        (StepConfirm >= 5 ? " done" : "") +
                        (StepFocus === 5 ? " focus" : "")
                      }
                      onClick={(e) =>
                        setStepFocus(StepActive < 5 ? StepFocus : 5)
                      }
                      id="step5"
                    >
                      <strong>THỦ QUỸ</strong>
                    </li>
                  </ul>
                  <div class="progress">
                    <div
                      class="progress-bar"
                      style={{ width: (StepConfirm / 5) * 100 + "%" }}
                    ></div>
                  </div>{" "}
                  <br />
                </div>
              </div>
            </div>
          </div>
          <div className="row card p-2">
            {Invoice?.CreateConfirmNote &&
              Invoice?.CreateConfirmNote.length > 0 && (
                <div className="col-3 m-auto">
                  Ghi chú 1: {Invoice?.CreateConfirmNote}
                </div>
              )}
            {Invoice?.ConfirmNote1 && Invoice?.ConfirmNote1.length > 0 && (
              <div className="col-3 m-auto">
                Ghi chú 2: {Invoice?.ConfirmNote1}
              </div>
            )}
            {Invoice?.ConfirmNote2 && Invoice?.ConfirmNote2.length > 0 && (
              <div className="col-3 m-auto">
                Ghi chú 3: {Invoice?.ConfirmNote2}
              </div>
            )}
            {Invoice?.ConfirmNote3 && Invoice?.ConfirmNote3.length > 0 && (
              <div className="col-3 m-auto">
                Ghi chú 4: {Invoice?.ConfirmNote3}
              </div>
            )}
            {Invoice?.ConfirmNote4 && Invoice?.ConfirmNote4.length > 0 && (
              <div className="col-3 m-auto">
                Ghi chú 5: {Invoice?.ConfirmNote4}
              </div>
            )}
          </div>
          <div className="card-body pt-3">
            <div className="row">
              {IsConfirm === true && (
                <>
                  {StepActive === StepFocus && StepConfirm < 5 && (
                    <>
                      {StepActive === StepFocus && StepConfirm === 4 && (
                        <UploadFile
                          onImageUpload={(e) => {
                            onChangeFileOrImage(e, 1);
                          }}
                          onFileUpload={(e) => {
                            onChangeFileOrImage(e, 0);
                          }}
                          fileData={{
                            fileShow: Invoice?.FileStep5,
                            imageShow: Invoice?.ImageStep5,
                          }}
                          onFileData={(e) =>
                            setInvoice({
                              ...Invoice,
                              FileStep5: e.fileShow || "",
                              ImageStep5: e.imageShow || "",
                            })
                          }
                          flag={0}
                        />
                      )}
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
                            Trạng thái thanh toán
                          </span>
                          <div class="input-group">
                            <SelectInvoiceStatus
                              onSelected={(e) => setStatusId(e)}
                              onStatusId={StatusId}
                              className={"w-100 select-custom"}
                              StepActive={StepActive}
                              TotalStep={5}
                            />
                          </div>
                        </div>
                        <div class="form-group">
                          <span class="small font-weight-bold text-muted">
                            Ghi chú
                          </span>
                          <div class=" input-group">
                            <textarea
                              type="text"
                              class="form-control2"
                              rows="3"
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
                          // style={{
                          //   display: Invoice?.StatusId === 2 ? "none" : "block",
                          // }}
                        >
                          <i class="fa fa-edit pr-2"></i>
                          Xác nhận
                        </button>
                      </div>
                    </>
                  )}
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
                    <div className="form-group">
                      Ghi chú: {Invoice?.CreateConfirmNote}
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div class="form-group">
                      Chữ ký:
                      <br />
                      <Img
                        key={"ntimg"}
                        src={Invoice?.Files}
                        alt="message user image"
                      />
                    </div>
                  </div>
                </>
              )}
              {StepFocus === 2 && StepConfirm >= 2 && (
                <>
                  <div className="col-md-6 col-sm-12">
                    <div class="form-group">
                      Quản lý phòng xác nhận: {Invoice?.ConfirmName1}
                    </div>
                    <div class="form-group">
                      Thời gian xác nhận:{" "}
                      {Invoice?.ConfirmTime1
                        ? moment(Invoice?.ConfirmTime1).format(
                            "HH:mm:ss DD/MM/YYYY "
                          )
                        : ""}
                    </div>
                    <div className="form-group">
                      Ghi chú: {Invoice?.ConfirmNote1}
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div class="form-group">
                      Chữ ký: <br />
                      <Img
                        key={"qlimg"}
                        src={Invoice?.Files1}
                        alt="message user image"
                      />
                    </div>
                  </div>
                </>
              )}
              {StepFocus === 3 && StepConfirm >= 3 && (
                <>
                  <div className="col-md-6 col-sm-12">
                    <div class="form-group">
                      Kế toán xác nhận: {Invoice?.ConfirmName2}
                    </div>
                    <div class="form-group">
                      Thời gian xác nhận:{" "}
                      {Invoice?.ConfirmTime2
                        ? moment(Invoice?.ConfirmTime2).format(
                            "HH:mm:ss DD/MM/YYYY "
                          )
                        : ""}
                    </div>
                    <div className="form-group">
                      Ghi chú: {Invoice?.ConfirmNote2}
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div class="form-group">
                      Chữ ký: <br />
                      <Img
                        key={"ktimg"}
                        src={Invoice?.Files2}
                        alt="message user image"
                      />
                    </div>
                  </div>
                </>
              )}
              {StepFocus === 4 && StepConfirm >= 4 && (
                <>
                  <div className="col-md-6 col-sm-12">
                    <div class="form-group">
                      Ban lãnh đạo xác nhận: {Invoice?.ConfirmName3}
                    </div>
                    <div class="form-group">
                      Thời gian xác nhận:{" "}
                      {Invoice?.ConfirmTime3
                        ? moment(Invoice?.ConfirmTime3).format(
                            "DD/MM/YYYY HH:mm:ss"
                          )
                        : ""}
                    </div>
                    <div className="form-group">
                      Ghi chú: {Invoice?.ConfirmNote3}
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div class="form-group">
                      Chữ ký: <br />
                      <Img
                        key={"bldimg"}
                        src={Invoice?.Files3}
                        alt="message user image"
                      />
                    </div>
                  </div>
                </>
              )}
              {StepFocus === 5 && StepConfirm === 5 && (
                <>
                  <ShowFiles
                    fileData={{
                      imageShow: Invoice.ImageStep5,
                      fileShow: Invoice.FileStep5,
                    }}
                    _type={0}
                  />
                  <div className="col-md-6 col-sm-12">
                    <div class="form-group">
                      Thủ quỹ xác nhận: {Invoice?.ConfirmName4}
                    </div>
                    <div class="form-group">
                      Thời gian xác nhận:{" "}
                      {Invoice?.ConfirmTime4
                        ? moment(Invoice?.ConfirmTime4).format(
                            " HH:mm:ss DD/MM/YYYY"
                          )
                        : ""}
                    </div>
                    <div className="form-group">
                      Ghi chú: {Invoice?.ConfirmNote4}
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div class="form-group">
                      Chữ ký: <br />
                      <Img
                        key={"tqi1mg"}
                        src={Invoice?.Files4}
                        alt="message user image"
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

export const InvoiceConfirmTemp = React.memo(InvoiceConfirmTempComp);

import { useEffect } from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import { useDispatch } from "react-redux";
import { SelectStatusVisa, TooltipCustom } from "../../../../Common";
import { mainAction } from "../../../../Redux/Actions";
import { IMAGES_DOMAIN } from "../../../../Services";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  ConfirmAlert,
  FormatDateJson,
} from "../../../../Utils";
import { CheckList } from "./CheckList";

export const VisaForm = ({
  data = {},
  setData = () => {},
  handleShow = () => {},
  setOpacity = () => {},
  onVisa,
  type = 0,
}) => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const DepartmentId = +localStorage.getItem("DepartmentId");

  const [visa, setVisa] = useState({ StatusVisaId: 1, VisaName: "" });
  const [filesVisa, setFilesVisa] = useState([]);
  const [imagesVisa, setImagesVisa] = useState([]);
  const [imageShow, setImageShow] = useState([]);
  const [fileShow, setFileShow] = useState([]);
  const [isVisa, setIsVisa] = useState(false);
  const [docs, setDocs] = useState("");
  const [isPreviewFile, setIsPreviewFile] = useState(false);
  const [ShowCheckList, setShowCheckList] = useState(0);
  const changeDayvsMonth = (date) => {
    let arr = date.split("/");
    return `${arr[1]}/${arr[0]}/${arr[2]}`;
  };

  useEffect(() => {
    if (data?.ImagesVisa) {
      let arr = data?.ImagesVisa?.split(",");
      setImageShow(arr);
    }
    if (data?.FilesVisa) {
      let arr = data?.FilesVisa?.split(",");
      setFileShow(arr);
    }
    data?.CustomerId && type === 0
      ? setVisa({
          ...data,
          PassportTimeFrom: data?.DOI
            ? new Date(changeDayvsMonth(data.DOI))
            : null,
          PassportTimeTo: data?.DOE
            ? new Date(changeDayvsMonth(data.DOE))
            : null,
          StatusVisaId: data?.StatusVisaId || 5,
          VisaName: data?.VisaName || "COLLECTING",
          VisaStatus: data?.VisaStatus || "1",
          NoteOfVisa: data?.NoteOfVisa || "",
        })
      : type === 1
      ? setVisa({
          ...data,
          PassportTimeFrom: data?.PassportTimeFrom
            ? new Date(changeDayvsMonth(data.PassportTimeFrom))
            : null,
          PassportTimeTo: data?.PassportTimeTo
            ? new Date(changeDayvsMonth(data.PassportTimeTo))
            : null,
          StatusVisaId: data?.StatusVisaId || 5,
          VisaName: data?.VisaName || "COLLECTING",
          VisaStatus: data?.VisaStatus || "1",
          NoteOfVisa: data?.NoteOfVisa || "",
        })
      : setVisa({
          ...data,
          PassportTimeFrom: data?.DOI
            ? new Date(changeDayvsMonth(data.DOI))
            : null,
          PassportTimeTo: data?.DOE
            ? new Date(changeDayvsMonth(data.DOE))
            : null,
          StatusVisaId: data?.StatusVisaId || 5,
          VisaName: data?.VisaName || "COLLECTING",
          VisaStatus: data?.VisaStatus || "1",
          NoteOfVisa: data?.NoteOfVisa || "",
          PassportCode: data?.PassportNo || "",
        });

    data?.VisaId && setIsVisa(true);
  }, [data]);

  const checkExtentionFile = (value, type) => {
    let check = 0;
    let exName = value.slice(
      (Math.max(0, value.lastIndexOf(".")) || Infinity) + 1
    );

    if (
      exName === "doc" ||
      exName === "docx" ||
      exName === "xls" ||
      exName === "xlsx"
    ) {
      check = 0;
    } else {
      check = 1;
    }
    return check;
  };

  const handleChangeFileAndImage = (e, type = 0) => {
    let f = e.target.files;
    // setFilesVisa([...filesVisa, ...e.target.files]);
    let check = true;
    if (type === 0) {
      for (let i = 0; i < f.length; i++) {
        let exName = f[i].name.slice(
          (Math.max(0, f[i].name.lastIndexOf(".")) || Infinity) + 1
        );
        if (
          exName === "pdf" ||
          exName === "doc" ||
          exName === "docx" ||
          exName === "xls" ||
          exName === "xlsx"
        ) {
          check = true;
        } else {
          check = false;
        }
        if (check === false) break;
      }
      check
        ? setFilesVisa([...filesVisa, ...e.target.files])
        : Alertwarning(
            'File không đúng định dạng! Vui lòng chọn lại file có định dạng "pdf", "doc", "docx", "xls", "xlsx"'
          );
    } else {
      for (let i = 0; i < f.length; i++) {
        let exName = f[i].name.slice(
          (Math.max(0, f[i].name.lastIndexOf(".")) || Infinity) + 1
        );
        if (
          exName === "jpg" ||
          exName === "jpeg" ||
          exName === "png" ||
          exName === "gif"
        ) {
          check = true;
        } else {
          check = false;
        }
        if (check === false) break;
      }
      check
        ? setImagesVisa([...imagesVisa, ...e.target.files])
        : Alertwarning(
            'File không đúng định dạng! Vui lòng chọn lại file có định dạng "jpg", "jpeg", "png", "gif"'
          );
    }

    // setFilesVisa(arr);
  };

  const Trl_spBookingDetail_UpdateVisa = async () => {
    let listFileVisa = "",
      listImagesVisa = "";
    try {
      if (filesVisa.length > 0) {
        const formData = new FormData();
        formData.append("Key", "Files");
        for (let i = 0; i < filesVisa.length; i++) {
          formData.append("myFile" + i, filesVisa[i]);
        }
        const res = await mainAction.API_spCallPostFile(formData, dispatch);
        listFileVisa = res.Message.replaceAll('"', "")
          .replace("[", "")
          .replace("]", "");
      }

      if (imagesVisa.length > 0) {
        const formData = new FormData();
        formData.append("Key", "Files");
        for (let i = 0; i < imagesVisa.length; i++) {
          formData.append("myFile" + i, imagesVisa[i]);
        }
        const res2 = await mainAction.API_spCallPostFile(formData, dispatch);
        listImagesVisa = res2.Message.replaceAll('"', "")
          .replace("[", "")
          .replace("]", "");
      }
      let f = listFileVisa.length > 0 ? "," + listFileVisa : listFileVisa;
      let i = listImagesVisa.length > 0 ? "," + listImagesVisa : listImagesVisa;

      const pr = {
        VisaId: data?.VisaId || 0,
        BookingId: data?.BookingId || 0,
        CustomerId: data?.CustomerId || 0,
        BookingDetailId: data?.BookingDetailId || 0,
        FromDate: FormatDateJson(visa.PassportTimeFrom),
        ToDate: FormatDateJson(visa.PassportTimeTo),
        Files: fileShow.length > 0 ? fileShow.join(",") + f : listFileVisa,
        Images: imageShow.length > 0 ? imageShow.join(",") + i : listImagesVisa,
        VisaName: visa.VisaName,
        VisaNote: "",
        Creater: +Creater,
        CreateName: CreateName,
        StatusVisaId: visa.StatusVisaId,
        VisaStatus: visa.StatusVisaId,
        Note: visa.NoteOfVisa,
        FingerprintDate: visa.FingerprintDate,
        RetailVisaId: data.RetailVisaId,
        DepartmentId: +DepartmentId,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBookingDetail_UpdateVisa",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.Status === "OK") {
        onVisa({
          VisaId: +res.VisaId,
          StatusVisaId: visa.StatusVisaId,
          VisaName: visa.VisaName,
          VisaStatus: visa.StatusVisaId,
          DOI: FormatDateJson(visa.PassportTimeFrom),
          DOE: FormatDateJson(visa.PassportTimeTo),
          FingerprintDate: visa.FingerprintDate,
          NoteOfVisa: visa.NoteOfVisa,
          ImagesVisa:
            imageShow.length > 0 ? imageShow.join(",") + i : listImagesVisa,
          FilesVisa:
            fileShow.length > 0 ? fileShow.join(",") + f : listFileVisa,
        });
        Alertsuccess("Cập nhật thành công");
        setVisa({ ...visa, VisaId: +res.VisaId });
        setIsVisa(true);
      }
      if (res.Status === "NOTOK") {
        Alerterror(res.ReturnMess);
      }
    } catch (error) {
      ;
    }
  };

  const [loadCheckList, setLoadCheckList] = useState(0);
  const Trl_spServiceOfVisa_Check = async (VisaId) => {
    if (VisaId === 0) {
      Alertwarning("Chưa tạo visa");
      return;
    }
    try {
      const pr = {
        VisaId: +VisaId,
        CreateName: +Creater,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spServiceOfVisa_Check",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      ;
      // mở form  checklist Âu
      setVisa({ ...visa, ...res[0] });
      if (res.length === 0) {
        setShowCheckList(1);
        setLoadCheckList(1);
        return;
      }
      if (res[0]?.ServiceId === 35) {
        setShowCheckList(1);
        setLoadCheckList(1);
        return;
      } else if (res[0]?.ServiceId === 36) {
        // mở form  checklist Mỹ
        setShowCheckList(2);
        setLoadCheckList(1);
        return;
      } else {
        Alertwarning("Thị trường này chưa có checklist");
        setLoadCheckList(0);
      }

      // setInvoiceStyleList(res);
    } catch (error) {
      ;
    }
  };

  return (
    <>
      <div class="card m-1 card-shadow shadow">
        <div class="card-header card-header-custom">
          <div class="row  booking center-item">
            <div class="col-sm-12 col-md-6">
              <h3 class="card-title font-weight-bold text-muted">VISA</h3>
            </div>
            <div class="col-sm-12 col-md-6">
              <button
                type="button"
                class="btn btn-sm btn-danger pull-right margin-left-5"
              >
                <i class="fa fa-trash pr-2"></i>
                Hủy bỏ
              </button>
              <button
                type="button"
                class="btn btn-sm btn-success pull-right"
                onClick={() => {
                  ConfirmAlert(
                    "Bạn có muốn cập nhật thông tin visa không?",
                    "",
                    () => {
                      Trl_spBookingDetail_UpdateVisa();
                    }
                  );
                }}
              >
                <i class="fa fa-edit pr-2"></i>
                {(data?.VisaId || 0) === 0 ? "Khởi tạo" : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
        <div class="card-body pt-3 ">
          <div className="row  booking">
            <div class="col-sm-12 col-md-4">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">HỌ & TÊN</span>
                <div class=" input-group">
                  <input
                    type="text"
                    class="form-control2"
                    value={visa?.Name}
                    onChange={(e) => setVisa({ ...visa, Name: e.target.value })}
                    readOnly="true"
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-4">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  TRẠNG THÁI VISA
                </span>
                <div class="input-group">
                  <SelectStatusVisa
                    onSelected={(e) =>
                      setVisa({
                        ...visa,
                        VisaName: e.label,
                        VisaStatus: e.value,
                        StatusVisaId: e.value,
                      })
                    }
                    statusVisaId={visa?.StatusVisaId || 1}
                    className={"w-100 select-custom"}
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-2 ">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  FINGERPRINT DATE
                </span>
                <div class=" input-group">
                  <input
                    type="text"
                    class="form-control2"
                    value={visa?.FingerprintDate || ""}
                    onChange={(e) =>
                      setVisa({ ...visa, FingerprintDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-2 ">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  CHECKLIST VISA
                </span>
                <div
                  className="  text-center form-text"
                  onClick={() => {
                    Trl_spServiceOfVisa_Check(visa?.VisaId || 0);
                  }}
                >
                  <span class="text-success">Thêm check list</span>
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-3">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  SỐ HỘ CHIẾU
                </span>
                <div class=" input-group">
                  <input
                    type="text"
                    class="form-control2"
                    value={visa?.PassportCode || ""}
                    onChange={(e) =>
                      setVisa({ ...visa, PassportCode: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-3">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">NGÀY CẤP</span>
                <div class="input-group ">
                  <DateTimePicker
                    className="form-control2"
                    value={visa?.PassportTimeFrom || new Date()}
                    onChange={(date) =>
                      setVisa({ ...visa, PassportTimeFrom: date })
                    }
                    format={"dd/MM/yyyy"}
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-3">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  NGÀY HẾT HẠN
                </span>
                <div class="input-group ">
                  <DateTimePicker
                    className="form-control2"
                    value={visa?.PassportTimeTo || new Date()}
                    onChange={(date) =>
                      setVisa({ ...visa, PassportTimeTo: date })
                    }
                    format={"dd/MM/yyyy"}
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-3">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  TÌNH TRẠNG THANH TOÁN
                </span>
                {(!visa?.StatusIdVisa || visa.StatusIdVisa !== 2) && (
                  <div
                    className="  text-center modal-payment-pending"
                    onClick={() => {
                      if (isVisa) {
                        handleShow(13);
                        setOpacity("opacity-0");
                      } else {
                        Alertwarning(
                          "Vui lòng khởi tạo visa trước khi thanh toán"
                        );
                      }
                    }}
                  >
                    <span class="text-danger">
                      {visa?.StatusNameVisa || "Đề xuất thanh toán"}
                    </span>
                  </div>
                )}
                {visa?.StatusIdVisa && visa.StatusIdVisa === 2 && (
                  <div
                    className="  text-center modal-payment-success"
                    onClick={() => {
                      if (isVisa) {
                        handleShow(13);
                        setOpacity("opacity-0");
                      } else {
                        Alertwarning(
                          "Vui lòng khởi tạo visa trước khi thanh toán"
                        );
                      }
                    }}
                  >
                    <span class="text-success">{visa?.StatusNameVisa}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="col-12">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">GHI CHÚ</span>
                <div class=" input-group">
                  <textarea
                    type="text"
                    class="form-control2"
                    rows="4"
                    cols="50"
                    value={visa?.NoteOfVisa || ""}
                    onChange={(e) =>
                      setVisa({ ...visa, NoteOfVisa: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-6">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  UPLOAD FILES{" "}
                  <span class="text-danger">(pdf, xls, xlsx, doc, docx)</span>
                </span>
                <label class="image-collapse-label2 ">
                  <input
                    type="file"
                    className="image-collapse-file cursor-pointer"
                    onChange={(e) => handleChangeFileAndImage(e, 0)}
                    accept=".pdf, .xls, .xlsx, .doc, .docx"
                    multiple
                  />
                  <i className="fa fa-file upload-file-btn"></i>
                </label>
                <div className="">
                  {filesVisa.map((item, ix) => {
                    return (
                      <div
                        className="upload-file-item py-1 my-2 shadow-sm "
                        key={"asdsad" + ix}
                      >
                        <i className="fa fa-file px-2"></i>
                        <span>{item.name}</span>
                        <i
                          className="fa fa-times pl-2 text-danger cursor-pointer"
                          onClick={(e) =>
                            setFilesVisa(filesVisa.filter((_, i) => i !== ix))
                          }
                        ></i>
                      </div>
                    );
                  })}
                </div>
                <div className="">
                  {fileShow.length > 0 &&
                    fileShow.map((item, ix) => {
                      return (
                        <div
                          className="upload-file-item py-1 my-2 shadow-sm d-flex justify-content-between"
                          download
                          key={"aaa" + ix}
                        >
                          <div>
                            <i className="fa fa-file px-2"></i>
                            <span>{item.split("/")[6]}</span>
                          </div>
                          <div className="">
                            <TooltipCustom content={"Xoá"}>
                              <i
                                className="fa fa-times pl-2 text-danger cursor-pointer px-2"
                                onClick={(e) =>
                                  setFileShow(
                                    fileShow.filter((_, i) => i !== ix)
                                  )
                                }
                              ></i>
                            </TooltipCustom>
                            <TooltipCustom content={"Tải xuống"}>
                              <a
                                href={IMAGES_DOMAIN + item}
                                download
                                target={"_blank"}
                                className="px-3"
                              >
                                <i class="fa fa-download"></i>
                              </a>
                            </TooltipCustom>
                            <TooltipCustom content={"Xem file trực tiếp"}>
                              <i
                                className="fa fa-eye pl-2 text-success cursor-pointer px-2"
                                onClick={(e) => {
                                  setDocs(IMAGES_DOMAIN + item);
                                  setIsPreviewFile(true);
                                }}
                              ></i>
                            </TooltipCustom>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-6">
              <div class="form-group">
                <span class="small font-weight-bold text-muted">
                  UPLOAD HÌNH ẢNH VISA{" "}
                  <span class="text-danger">(jpg, jpeg, png)</span>
                </span>
                <label class="image-collapse-label2">
                  <input
                    type="file"
                    className="image-collapse-file cursor-pointer"
                    onChange={(e) => handleChangeFileAndImage(e, 1)}
                    accept="image/*"
                    multiple
                  />
                  <i class="fas fa-passport upload-file-btn"></i>
                </label>
                <div className="row ">
                  {imagesVisa.map((item, ix) => {
                    return (
                      <div
                        className="upload-file-item py-1 my-2 shadow-sm col-6 position-relative"
                        key={"a" + ix}
                      >
                        <img
                          src={URL.createObjectURL(item)}
                          alt=""
                          className="image-upload"
                        />
                        <i
                          className="fa fa-times pl-2 text-danger cursor-pointer position-absolute top-1 right-1"
                          onClick={(e) =>
                            setImagesVisa(imagesVisa.filter((_, i) => i !== ix))
                          }
                        ></i>
                      </div>
                    );
                  })}
                </div>
                <div className="row">
                  {imageShow.length > 0 &&
                    imageShow.map((item, ix) => {
                      return (
                        <div
                          className="upload-file-item py-1 my-2 shadow-sm col-6 position-relative"
                          key={"b" + ix}
                        >
                          <img
                            src={IMAGES_DOMAIN + item}
                            alt=""
                            className="image-upload"
                          />
                          <i
                            className="fa fa-times pl-2 text-danger cursor-pointer position-absolute top-1 right-1"
                            onClick={(e) =>
                              setImageShow(imageShow.filter((_, i) => i !== ix))
                            }
                          ></i>
                          <a
                            href={IMAGES_DOMAIN + item}
                            download
                            target={"_blank"}
                            className="fa fa-download mr-4 cursor-pointer position-absolute top-1 right-1"
                          ></a>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={isPreviewFile}
        onHide={() => setIsPreviewFile(false)}
        aria-labelledby="example-custom-modal-styling-title"
        className="custom-modal-w-100 z-maxx"
      >
        <Modal.Header className="p-2">
          <Modal.Title id="example-custom-modal-styling-title">
            <div class="text-center">Preview Document</div>
          </Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => setIsPreviewFile(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          {checkExtentionFile(docs) === 0 ? (
            <iframe
              className={"docs"}
              width="100%"
              height="800"
              frameBorder="0"
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${docs}`}
              title="preview file"
            ></iframe>
          ) : (
            <iframe
              className={"docs"}
              width="100%"
              height="800"
              frameBorder="0"
              src={`https://drive.google.com/viewerng/viewer?url=${docs}&embedded=true&hl=vi`}
              title="preview file"
            ></iframe>
          )}{" "}
        </Modal.Body>
      </Modal>

      <CheckList
        Keys={ShowCheckList}
        Visa={visa}
        reload={loadCheckList}
        onClose={(e) => setLoadCheckList(e)}
      />
    </>
  );
};

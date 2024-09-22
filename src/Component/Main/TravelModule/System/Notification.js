import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  FormatDateJson,
  ConfirmAlert,
  ConvertFileName,
} from "../../../../Utils";
import { TinyMCE, TooltipCustom } from "../../../../Common";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import $ from "jquery";
import ReactHtmlParser from "react-html-parser";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { Img } from "react-image";
import { IMAGES_DOMAIN } from "../../../../Services";

export const Notification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const DepartmentId = localStorage.getItem("DepartmentId");
  const PositionId = localStorage.getItem("PositionId");
  const pr = new URLSearchParams(location.search);
  const DepartCurent = parseInt(pr.get("dpid"));
  const [data, setData] = useState([]);
  const [dataStaffView, setdataStaffView] = useState([]);
  const [NotificationId, setNotificationId] = useState(0);
  const [Files, setFiles] = useState();
  const [ViewFiles, setViewFiles] = useState([]);
  const [FileUpload, setFileUpload] = useState([]);
  const [FileUpload1, setFileUpload1] = useState("");
  const [ImagesUpload, setImagesUpload] = useState([]);
  const [KeySearch, setKeySearch] = useState("");
  const [Title, setTitle] = useState("");
  const [Contents, setContents] = useState("");
  const [ContentTinyMCE, setContentTinyMCE] = useState("");
  const [Notifys, setNotifys] = useState([]);
  const [State, setState] = useState(0);
  const [docs, setDocs] = useState("");
  const [isPreviewFile, setIsPreviewFile] = useState(false);

  useEffect(() => {
    const pr = new URLSearchParams(location.search);
    if (pr.get("NotificationId") !== null) {
      Trl_spNotification_List(
        parseInt(pr.get("NotificationId")),
        1,
        parseInt(pr.get("dpid"))
      );
    } else {
      Trl_spNotification_List(0, 0, parseInt(pr.get("dpid")));
    }
  }, [location.search]);

  //#region THÊM
  const VideAdd = () => {
    openModal();
  };

  // File and Imga
  const handleChangeFileAndImage = (e, type = 0) => {
    let f = e.target.files;
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
        ? setFileUpload([...FileUpload, ...e.target.files])
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
        ? setImagesUpload([...ImagesUpload, ...e.target.files])
        : Alertwarning(
            'File không đúng định dạng! Vui lòng chọn lại file có định dạng "jpg", "jpeg", "png", "gif"'
          );
    }
  };

  const Trl_spNotification_GetContent = async (NotificationId) => {
    try {
      const pr = {
        NotificationId: NotificationId,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spNotification_GetContent",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      return list;
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };

  const Trl_spNotification_Save = async () => {
    try {
      if (Title === "") {
        Alertwarning("Nhập tiêu đề");
        return;
      }
      if (Contents === "") {
        Alertwarning("Nhập nội dung");
        return;
      }

      let ListFiles = "",
        ListImages = "";
      if (FileUpload.length > 0) {
        const formData = new FormData();
        formData.append("Key", "Files");
        for (let i = 0; i < FileUpload.length; i++) {
          let f = FileUpload[i];
          let renamedFile = new File([f], ConvertFileName(f.name), {
            type: f.type,
          });

          formData.append("myFile" + i, renamedFile);
        }
        const res = await mainAction.API_spCallPostFile(formData, dispatch);
        ListFiles = res.Message.replaceAll('"', "")
          .replace("[", "")
          .replace("]", "");
      }

      if (ImagesUpload.length > 0) {
        const formData = new FormData();
        formData.append("Key", "Files");
        for (let i = 0; i < ImagesUpload.length; i++) {
          formData.append("myFile" + i, ImagesUpload[i]);
        }
        const res = await mainAction.API_spCallPostFile(formData, dispatch);
        ListImages = res.Message.replaceAll('"', "")
          .replace("[", "")
          .replace("]", "");
      }

      let Contentspr = "";
      if (Contents.includes('"')) Contentspr = Contents?.replaceAll('"', "||");
      Contentspr = Contentspr.replace(/!|\|~/g, "");
      if (Contentspr === "") Contentspr = Contents;
      const pr = {
        NotificationId: NotificationId,
        Title: Title,
        Contents: Contentspr,
        Files:
          NotificationId === 0
            ? ListFiles
            : ListFiles === ""
            ? Files
            : ListFiles + "," + Files,
        Images: NotificationId === 0 ? ListImages : "",
        Creater: Creater,
        CreateName: CreateName,
        Keys: 0,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spNotification_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result?.Status === "OK") {
        Alertsuccess(result?.ReturnMess);
        Cancel();
        Trl_spNotification_List(0, 0, DepartmentId);
        navigate(
          "/tao-thong-bao?id=32&dpid=" +
            DepartCurent +
            "&&NoticationId=" +
            result?.NotificationID
        );
        setIsOpen(false);
        return;
      }
      if (result?.Status === "NOTOK") {
        Alerterror(result?.ReturnMess);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };
  const Cancel = () => {
    setNotificationId(0);
    setTitle("");
    setContents("");
    setContentTinyMCE("");
    setFiles("");
    setFileUpload([]);
    setFileUpload1("");
    setViewFiles([]);
    setImagesUpload([]);
    $(".addf .react-datetime-picker__clear-button").click();
  };
  //#endregion

  //moment js create date from fisrt day of month

  //#region DANH SÁCH
  const [TimeSearch, setTimeSearch] = useState();
  const Trl_spNotification_List = async (
    NotificationId,
    KeyStatus,
    DepartId
  ) => {
    try {
      const pr = {
        Creater: Creater,
        CreateName: CreateName,
        DepartmentId:
          DepartId === undefined || isNaN(DepartId) === true ? 0 : DepartId,
        KeySearch: KeySearch,
        State: State,
        NotificationId: NotificationId,
        KeyStatus: KeyStatus,
        FromDate:
          TimeSearch !== undefined
            ? FormatDateJson(TimeSearch[0])
            : "01/01/2000",
        ToDate:
          TimeSearch !== undefined
            ? FormatDateJson(TimeSearch[1])
            : "01/01/2000",
        CheckDate: TimeSearch !== undefined ? "A" : "B",
        Keys: 0,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spNotification_List_V3",
      };

      const list = await mainAction.API_spCallServer(params, dispatch);

      let cont = await Trl_spNotification_GetContent(
        list?.Notification_List?.length > 0
          ? list?.Notification_List[0]?.NotificationId
          : 0
      );

      if (list?.Notification_List?.length > 0) {
        let newList = list?.Notification_List.map((item) => {
          if (item.NotificationId === cont[0].NotificationId) {
            return {
              ...item,
              Contents: cont[0]?.Contents,
              Files: cont[0]?.Files,
              Images: cont[0]?.Images,
            };
          }
          return item;
        });
        setNotifys(newList.slice(0, 5));
        setData(newList);
      }
      setdataStaffView(list?.Notification_List_StaffView);
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };

  //#endregion

  //#region đóng mở modal
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setmodalIsOpenStaffview(false);
  };
  //#endregion

  //#region  xem nhaan vieen ddax xem thoong baos
  const [modalIsOpenStaffview, setmodalIsOpenStaffview] = useState(false);
  const [ListView, setListView] = useState([]);
  const Show_StaffView = (Id) => {
    setmodalIsOpenStaffview(true);
    setListView(dataStaffView?.filter((e) => e.NotificationId === Id));
  };
  //#endregion

  const handleGetcontent = async (e) => {
    let cont = await Trl_spNotification_GetContent(e);
    let newList = Notifys.map((item) => {
      if (item.NotificationId === cont[0].NotificationId) {
        return {
          ...item,
          Contents: cont[0]?.Contents,
          Files: cont[0]?.Files,
          Images: cont[0]?.Images,
        };
      }
      return item;
    });
    setNotifys(newList);
  };

  const loadMore = () => {
    let length = Notifys.length;
    let newNoti = [...Notifys, ...data.slice(length, length + 5)];
    setNotifys(newNoti);
  };

  const Trl_spNotification_Delete = async (NotificationId) => {
    try {
      const pr = {
        NotificationId: NotificationId,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spNotification_Delete",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      if (list.Status === "OK") {
        Alertsuccess(list.ReturnMess);
        setNotifys(Notifys.filter((x) => x.NotificationId !== NotificationId));
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };

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

  return (
    <>
      <div className="content-wrapper">
        <div class="card-header border-left-red">
          <div class="row">
            <div class="col-sm-12 col-md-3">
              <h3 class="card-title font-weight-bold">
                Tạo thông báo phòng ban ({data?.length || 0})
              </h3>
            </div>
            <div class="col-sm-12 col-md-9 margin-top-5s">
              <button
                onClick={VideAdd}
                type="button"
                class="btn btn-sm btn-success pull-right margin-left-5"
              >
                <i class="fa fa-plus pr-2"></i>
                Thêm thông báo
              </button>

              <button
                onClick={(e) => Trl_spNotification_List(0, 0, DepartmentId)}
                type="button"
                class="btn btn-sm btn-danger pull-right margin-left-5"
              >
                <i class="fa fa-search pr-2"></i>
                Tìm kiếm
              </button>
              <div
                class="form-group pull-right"
                style={{ marginTop: "-4px", marginRight: "5px" }}
              >
                <div class="input-group ">
                  <DateTimeRangePicker
                    className="form-control2 px-1 pb-2px zIndex-300"
                    value={TimeSearch}
                    onChange={(date) => setTimeSearch(date)}
                    format={"dd/MM/yyyy"}
                  />
                </div>
              </div>
              <div
                className="form-group pull-right"
                style={{ marginTop: "-4px", marginRight: "5px" }}
              >
                <div class="input-group">
                  <input
                    type="text"
                    maxLength="500"
                    placeholder="Tiêu để,nội dung ..."
                    class="form-control"
                    value={KeySearch}
                    onChange={(e) => setKeySearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card-body border-left-red">
          <div class="row">
            <div class="col-md-12 noti">
              {Notifys?.map((item, index) => {
                let FilesArr = item.Files?.replaceAll('"', "").split(","),
                  ImageArr = item.Images?.replaceAll('"', "").split(",");
                return (
                  <div class="timeline">
                    <div class="time-label">
                      <span class="bg-red">
                        {" "}
                        <i class="fa fa-clock" aria-hidden="true"></i>{" "}
                        {item?.CreateTime
                          ? FormatDateJson(item?.CreateTime, 0)
                          : null}
                      </span>
                    </div>

                    <div>
                      <i class="fa fa-bell faa-ring animated fa-4x bg-blue"></i>
                      <div class="timeline-item " style={{ marginTop: "20px" }}>
                        <h3 class="timeline-header">
                          <a href="#"> Tiêu đề :</a> <b>{item?.Title || ""}</b>{" "}
                        </h3>

                        <div class="timeline-body">
                          <div className="margin-left-10">
                            {" "}
                            {ReactHtmlParser(
                              item?.Contents?.replaceAll("||", '"') || ""
                            )}
                          </div>
                          <div className="row ">
                            {item?.Images.length > 0 &&
                              ImageArr.map((item, ix) => {
                                return (
                                  <div
                                    className="upload-file-item py-1 my-2 col-12 m-auto shadow-sm position-relative center-item"
                                    key={"b" + ix}
                                  >
                                    <img
                                      src={IMAGES_DOMAIN + item}
                                      alt=""
                                      className="image-upload"
                                    />
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
                          <div className="row mt-3">
                            {item?.Files.length > 0 &&
                              FilesArr.map((v, ix) => {
                                return (
                                  <div
                                    className="upload-file-item py-1 my-2 shadow d-flex col-12 justify-content-between"
                                    download
                                    key={"aaa" + ix}
                                  >
                                    <div>
                                      <i className="fa fa-file px-2"></i>
                                      <span>{v.split("/")[6]}</span>
                                    </div>
                                    <div className="">
                                      <TooltipCustom content={"Tải xuống"}>
                                        <a
                                          href={IMAGES_DOMAIN + v}
                                          download
                                          target={"_blank"}
                                          className="px-3"
                                          rel="noreferrer"
                                        >
                                          <i class="fa fa-download"></i>
                                        </a>
                                      </TooltipCustom>
                                      <TooltipCustom
                                        content={"Xem file trực tiếp"}
                                      >
                                        <i
                                          className="fa fa-eye pl-2 text-success cursor-pointer px-2"
                                          onClick={(e) => {
                                            setDocs(IMAGES_DOMAIN + v);
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
                        <div class="timeline-footer">
                          <div className="row">
                            <div className="col-md-8 noti_CreteName">
                              <span>
                                Người thông báo :{" "}
                                <span className="badge badge-warning">
                                  {item?.CreateName || ""}{" "}
                                </span>
                              </span>
                              {(item.Creater === +Creater ||
                                PositionId <= 7) && (
                                <button
                                  type="button"
                                  class="ml-5 btn btn-tool cursor"
                                  title="Click để xóa thông báo"
                                  onClick={() => {
                                    ConfirmAlert(
                                      "Xác nhận",
                                      "Bạn có muốn xóa thông báo không?",
                                      () => {
                                        Trl_spNotification_Delete(
                                          item.NotificationId
                                        );
                                      }
                                    );
                                  }}
                                >
                                  <i class="fas fa-trash"></i> Delete
                                </button>
                              )}
                            </div>
                            <div className="col-md-4 text-right">
                              {(
                                dataStaffView !== null &&
                                dataStaffView?.filter(
                                  (e) =>
                                    e.NotificationId === item.NotificationId
                                )
                              )?.map((item2, index2) => {
                                return (
                                  <Img
                                    src={item2.Avatar}
                                    title={item2.StaffName}
                                    className={
                                      index2 + 1 < 6
                                        ? "notiviewstaff_n"
                                        : "display-none"
                                    }
                                  />
                                );
                              })}
                              <sup
                                onClick={(e) =>
                                  Show_StaffView(item.NotificationId)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <span
                                  className={
                                    dataStaffView?.filter(
                                      (e) =>
                                        e.NotificationId === item.NotificationId
                                    ).length > 0
                                      ? "notiviewstaffTotal"
                                      : ""
                                  }
                                >
                                  {dataStaffView?.filter(
                                    (e) =>
                                      e.NotificationId === item?.NotificationId
                                  ).length > 0
                                    ? dataStaffView?.filter(
                                        (e) =>
                                          e.NotificationId ===
                                          item.NotificationId
                                      ).length
                                    : ""}
                                </span>
                              </sup>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {Notifys.length > 0 && Notifys.length !== data.length ? (
              <div class=" col-12 center-item">
                <button
                  type="button"
                  class="btn btn-outline-primary "
                  onClick={loadMore}
                >
                  Xem thêm
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
          <Modal
            show={modalIsOpenStaffview}
            onHide={closeModal}
            className=" custom-modal-w-90"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
                <div class="">
                  <h6>
                    {" "}
                    Danh sách nhân viên đã xem thông báo :{" "}
                    {ListView.length > 0 && ListView[0].Title} (
                    <strong className="check-point">{ListView.length}</strong>){" "}
                  </h6>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class="card-body">
                <div className="row">
                  {ListView.length > 0 &&
                    ListView?.map((item3, index3) => {
                      return (
                        <div className="col-md-3" style={{ padding: "15px" }}>
                          <div
                            className="row"
                            style={{
                              boxShadow:
                                "0 0 1px rgb(0 0 0 / 13%), 0 1px 3px rgb(0 0 0 / 20%)",
                              borderRadius: "0.25rem",
                              backgroundColor: "#fff",
                            }}
                          >
                            <div
                              class="col-md-3"
                              style={{ height: "50px", width: "50px" }}
                            >
                              <Img
                                src={item3?.Avatar}
                                className="notiviewstaff"
                              />
                            </div>
                            <div class="col-md-8">
                              <div class="info-box-content">
                                <div className="noti_Name">
                                  <span class="info-box-text">
                                    <b>{item3?.StaffName}</b>
                                  </span>
                                </div>
                                <div className="noti_Time">
                                  {" "}
                                  <i
                                    class="fa fa-clock"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  {item3?.TimeView
                                    ? FormatDateJson(item3?.TimeView, 0)
                                    : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
        <Modal
          show={modalIsOpen}
          onHide={closeModal}
          className=" custom-modal-w-90"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              <div class="">
                {NotificationId === 0
                  ? "Tạo thông báo"
                  : "Sửa thông báo " + Title}
              </div>
            </Modal.Title>
            <button
              type="button"
              class="btn-sm btn-danger close"
              aria-label="Close"
              onClick={closeModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            <div class="card-body addf">
              <div class="row">
                <div class="col-sm-12 col-md-12">
                  <div class="form-group">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          Tiêu đề (<strong className="check-point">*</strong>)
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength="500"
                        class="form-control"
                        value={Title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-12">
                  <h4>Nội dung thông báo:</h4>
                  <div class="form-group">
                    <div class="input-group">
                      <TinyMCE
                        onSelected={(e) => setContents(e)}
                        Values={ContentTinyMCE}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-12">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      UPLOAD FILES{" "}
                      <span class="text-danger">
                        (pdf, xls, xlsx, doc, docx)
                      </span>
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
                      {FileUpload.map((item, ix) => {
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
                                setFileUpload(
                                  FileUpload.filter((_, i) => i !== ix)
                                )
                              }
                            ></i>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-12">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      UPLOAD HÌNH ẢNH{" "}
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
                      {ImagesUpload.map((item, ix) => {
                        return (
                          <div
                            className="upload-file-item py-1 my-2 shadow-sm col-12 col-md-12 position-relative"
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
                                setImagesUpload(
                                  ImagesUpload.filter((_, i) => i !== ix)
                                )
                              }
                            ></i>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-12">
                  {/* <button
                    onClick={(e) => setIsOpen(false)}
                    type="button"
                    class="btn btn-sm btn-warning pull-right margin-left-5"
                  >
                    <i class="fa fa-undo pr-2"></i>
                    Đóng
                  </button> */}
                  <button
                    onClick={Cancel}
                    type="button"
                    class="btn btn-sm btn-danger pull-right margin-left-5"
                  >
                    <i class="fa fa-trash pr-2"></i>
                    Hủy
                  </button>

                  <button
                    type="button"
                    class="btn btn-sm btn-success pull-right"
                    onClick={Trl_spNotification_Save}
                  >
                    <i class="fa fa-edit pr-2"></i>
                    {NotificationId === 0 ? " Thêm mới" : "Chỉnh sửa"}
                  </button>
                </div>
                <div class="col-sm-12 col-md-12">
                  <div class="form-group">
                    <h5 style={{ color: "red" }}>
                      Ghi chú: các ô có dấu sao màu đỏ là bắt buộc nhập
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
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
      </div>
    </>
  );
};

const customStyles = {
  content: {
    top: "25%",
    left: "55%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    zIndex: "4",
  },
};

import React, { useEffect, useRef, useState } from "react";
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
//import Modal from 'react-modal';
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import $ from "jquery";
import ReactHtmlParser from "react-html-parser";
import { IMAGES_DOMAIN } from "../../../../Services";
import { Img } from "react-image";

import { useMemo } from "react";
export const News = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const DepartmentId = localStorage.getItem("dpid");
  const [data, setData] = useState([]);
  const [dataLeave, setdataLeave] = useState([]);
  const [dataStaffView, setdataStaffView] = useState([]);
  const [dataStaffComment, setdataStaffComment] = useState([]);
  const [NotificationId, setNotificationId] = useState(0);
  const [Files, setFiles] = useState();
  const [ViewFiles, setViewFiles] = useState([]);
  const [FileUpload, setFileUpload] = useState([]);
  const [ImagesUpload, setImagesUpload] = useState([]);
  const [FileUpload1, setFileUpload1] = useState("");
  const [Title, setTitle] = useState("");
  const [Contents, setContents] = useState("");
  const [ContentTinyMCE, setContentTinyMCE] = useState("");
  const [PermissionAdd, setPermissionAdd] = useState([]);
  const [Likes, setLikes] = useState(1);
  const [notifys, setNotifys] = useState([]);
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
      Trl_spLeave_List_ShowNoti();
    } else {
      Trl_spNotification_List(0, 0, parseInt(pr.get("dpid")));
      Trl_spLeave_List_ShowNoti();
      Trl_spMenuModule_Permission_List();
    }
  }, [location.search]);

  const Trl_spMenuModule_Permission_List = async () => {
    const pr = {
      Json: JSON.stringify({
        Id: 0,
        MenuId: 56,
        AccountId: Creater,
        Creater: Creater,
        KeyLanguage: "VN",
      }),

      func: "Trl_spMenuModule_Permission_List",
    };

    try {
      const result = await mainAction.API_spCallServer(pr, dispatch);
      setPermissionAdd(result);
    } catch (error) {
    }
  };

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

    // setFilesVisa(arr);
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
      if (Contents.includes('"')) Contentspr = Contents.replaceAll('"', "||");

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
        Keys: 1,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spNotification_Save",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Cancel();
        Trl_spNotification_List(0, 0, 0, 1);
        navigate("/news?id=56&dpid=0NoticationId=" + result.NotificationID);
        setIsOpen(false); // close popup
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.ReturnMess);
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
    setFiles("");
    setFileUpload([]);
    setImagesUpload([]);
    setFileUpload1("");
    setViewFiles([]);
    setContentTinyMCE("");
    $(".addf .react-datetime-picker__clear-button").click();
  };
  //#endregion

  //#region DANH SÁCH

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
        setNotifys(notifys.filter((x) => x.NotificationId !== NotificationId));
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };

  const Trl_spNotification_List = async (
    NotificationId,
    KeyStatus,
    DepartId,
    KeyShow
  ) => {
    try {
      const pr = {
        Creater: Creater,
        CreateName: CreateName,
        DepartmentId: DepartId === undefined ? 0 : DepartId,
        KeySearch: "",
        State: 0,
        NotificationId: NotificationId,
        KeyStatus: KeyStatus,
        FromDate: "01/01/2000",
        ToDate: "01/01/2000",
        CheckDate: "B",
        Keys: 1,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spNotification_List_V2",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      let cont = await Trl_spNotification_GetContent(
        list?.Notification_List[0].NotificationId
      );
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
      setdataStaffView(list?.Notification_List_StaffView);
      setdataStaffComment(list?.Notification_List_StaffComment);
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };
  const Trl_spLeave_List_ShowNoti = async () => {
    try {
      const prt = {
        Creater: Creater,
      };
      const paramst = {
        Json: JSON.stringify(prt),
        func: "Trl_spLeave_List_ShowNoti",
      };
      const list = await mainAction.API_spCallServer(paramst, dispatch);
      setdataLeave(list);
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };
  //#endregion

  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setmodalIsOpenStaffview(false);
    setmodalIsOpenStaffLike(false);
  };
  //#region  xem nhaan vieen ddax xem thoong baos
  const [modalIsOpenStaffview, setmodalIsOpenStaffview] = useState(false);
  const [ListView, setListView] = useState([]);
  const Show_StaffView = (Id) => {
    setmodalIsOpenStaffview(true);
    setListView(dataStaffView.filter((e) => e.NotificationId === Id));
  };
  //#endregion
  const [modalIsOpenStaffLike, setmodalIsOpenStaffLike] = useState(false);
  const [StaffLike, setStaffLike] = useState([]);
  const Show_StaffLike = (Id, Keys) => {
    setmodalIsOpenStaffLike(true);
    setLikes(Keys);
    setStaffLike(
      dataStaffView.filter(
        (e) =>
          e.NotificationId === Id &&
          (Keys === 1 ? e.Likes === true : e.DisLike === true)
      )
    );
  };
  const Trl_spNotification_Like = async (Keys, Id) => {
    const pr = {
      Creater: Creater,
      NotificationID: Id,
      KeysLike: Keys,
    };
    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spNotification_Like",
    };
    const list = await mainAction.API_spCallServer(params, dispatch);
    Trl_spNotification_List(0, 1, 0, 0);
  };

  const [CommentName, setCommentName] = useState("");
  const Trl_spNotification_Comment = async (Id) => {
    const pr = {
      Creater: Creater,
      NotificationID: Id,
      CommentName: CommentName,
    };
    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spNotification_Comment",
    };
    const list = await mainAction.API_spCallServer(params, dispatch);
    setCommentName("");
    Trl_spNotification_List(0, 1, 0, 0);
  };

  const RenderModal = useMemo(() => {
    return (
      <div class="addf">
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
            <h5 className="">Nội dung thông báo:</h5>
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
                          setFileUpload(FileUpload.filter((_, i) => i !== ix))
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
            <div class="form-group"></div>
          </div>
        </div>
      </div>
    );
  }, [
    Title,
    ContentTinyMCE,
    NotificationId,
    Contents,
    FileUpload,
    ImagesUpload,
  ]);
  const handleGetcontent = async (e) => {
    let cont = await Trl_spNotification_GetContent(e);
    let newList = notifys.map((item) => {
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
    let length = notifys.length;
    let newNoti = [...notifys, ...data.slice(length, length + 5)];
    setNotifys(newNoti);
  };

  const RenderListNoti = useMemo(() => {
    return (
      <div class="row">
        <div class={dataLeave.length > 0 ? "col-md-8 col-12" : "col-12"}>
          {notifys.length > 0 ? (
            notifys?.map((item, index) => {
              let Farr = item.Files?.replaceAll('"', ""),
                FilesArr = [],
                ImageArr = item.Images?.replaceAll('"', "").split(",");
              FilesArr = Farr.split(",");
              return (
                <div className=" timeline" key={index}>
                  <div class="time-label">
                    <span class="bg-red">
                      {" "}
                      <i class="fa fa-clock" aria-hidden="true"></i>{" "}
                      {item?.CreateTime
                        ? FormatDateJson(item?.CreateTime, 10)
                        : null}
                    </span>
                  </div>
                  <div class="direct-chat direct-chat-primary">
                    <div class={"card card-widget"}>
                      <div class="card-body">
                        <div
                          class="direct-chat-messages"
                          style={{ minHeight: "100px" }}
                        >
                          <div id={"noti" + index}>
                            <h6 class="timeline-header">
                              {item?.Contents && item?.Contents.length > 0 ? (
                                <>
                                  <a
                                    data-toggle="collapse"
                                    href={"#collapseNew_" + index}
                                    role="button"
                                    aria-expanded="false"
                                    aria-controls={"collapseNew_" + index}
                                    className="cursor-pointer"
                                  >
                                    <TooltipCustom
                                      content={
                                        "Click để mở hoặc đóng thông báo"
                                      }
                                    >
                                      <b>{item?.Title || ""}</b>
                                    </TooltipCustom>
                                  </a>
                                </>
                              ) : (
                                <a
                                  data-toggle="collapse"
                                  href={"#collapseNew_" + index}
                                  role="button"
                                  aria-expanded="false"
                                  aria-controls={"collapseNew_" + index}
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleGetcontent(item.NotificationId)
                                  }
                                >
                                  <TooltipCustom
                                    content={"Click để mở hoặc đóng thông báo"}
                                  >
                                    <b>{item?.Title || ""}</b>
                                  </TooltipCustom>
                                </a>
                              )}

                              {/* <a href="#"> Tiêu đề :</a>{" "} */}
                            </h6>
                            <div
                              class={index > 0 ? "collapse" : ""}
                              id={"collapseNew_" + index}
                            >
                              <div className="row text-sm">
                                <div className="col-md-12 text-right">
                                  Người tạo :{" "}
                                  <span className="badge badge-warning">
                                    {item?.CreateName || ""}{" "}
                                  </span>
                                </div>
                              </div>{" "}
                              {ReactHtmlParser(
                                item?.Contents?.replaceAll("||", '"') || ""
                              )}
                              <div className="row ">
                                {item?.Images.length > 0 &&
                                  ImageArr.map((item, ix) => {
                                    return (
                                      <div
                                        className="upload-file-item py-1 my-2 col-12 m-auto shadow-sm position-relative center-item"
                                        key={"b" + ix}
                                      >
                                        <img src={IMAGES_DOMAIN + item} alt="" />
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
                          </div>
                        </div>
                        <div class="direct-chat-contacts">
                          <div class="input-group inputcomment input-group-sm mt-2 mb-2">
                            <textarea
                              type="text"
                              rows={2}
                              class="form-control"
                              placeholder="Nhập bình luận cho thông báo"
                              value={CommentName}
                              onChange={(e) => setCommentName(e.target.value)}
                            />
                            <span class="input-group-append">
                              <button
                                type="button"
                                class="btn btn-info btn-flat"
                                onClick={(e) =>
                                  Trl_spNotification_Comment(
                                    item.NotificationId
                                  )
                                }
                              >
                                <i class="far fa-paper-plane"></i> Gửi
                              </button>
                            </span>
                          </div>
                          <ul class="contacts-list mt-2">
                            {dataStaffComment !== null &&
                              dataStaffComment
                                ?.filter(
                                  (e) =>
                                    e.NotificationId === item.NotificationId
                                )
                                .map((item3, index3) => {
                                  return (
                                    <>
                                      <li>
                                        <div className="row">
                                          <div className="col-md-1">
                                            <Img
                                              class="contacts-list-img"
                                              src={item3.Avatar}
                                              className="notiviewstaff_n"
                                            />
                                          </div>
                                          <div className="col-md-11">
                                            <div class="contacts-list-info mt-2">
                                              <span class="contacts-list-name">
                                                <small class="contacts-list-date float-right">
                                                  <i
                                                    class="fa fa-clock"
                                                    aria-hidden="true"
                                                  ></i>{" "}
                                                  {FormatDateJson(
                                                    item3.CreateTime,
                                                    10
                                                  )}
                                                </small>
                                              </span>
                                              <span class="contacts-list-msg">
                                                {item3.CommentName}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    </>
                                  );
                                })}
                          </ul>
                        </div>
                      </div>
                      <div class="card-footer">
                        <div className="row">
                          <div className="col-md-8 noti_CreteName">
                            <div class="post">
                              <p class="mb-0">
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    Trl_spNotification_Like(
                                      1,
                                      item.NotificationId
                                    )
                                  }
                                  class={
                                    dataStaffView?.filter(
                                      (e) =>
                                        e.NotificationId ===
                                          item.NotificationId &&
                                        e.Likes === true &&
                                        e.StaffId === parseInt(Creater)
                                    )?.length > 0
                                      ? "link-black text-sm colorLike cursor btn"
                                      : "link-black text-sm cursor btn"
                                  }
                                >
                                  <i class="far fa-thumbs-up mr-1"></i> Likes{" "}
                                </button>
                                <sup
                                  className="badge badge-primary cursor"
                                  onClick={(e) =>
                                    Show_StaffLike(item.NotificationId, 1)
                                  }
                                >
                                  {
                                    (
                                      dataStaffView !== null &&
                                      dataStaffView?.filter(
                                        (e) =>
                                          e.NotificationId ===
                                            item.NotificationId &&
                                          e.Likes === true
                                      )
                                    ).length
                                  }
                                </sup>
                                <button
                                  type="button"
                                  class="ml-5 btn btn-tool cursor"
                                  title="Contacts"
                                  data-widget="chat-pane-toggle"
                                >
                                  <i class="fas fa-comments"></i> Comments
                                </button>{" "}
                                <sup
                                  className="badge badge-warning cursor "
                                  title="Contacts"
                                  data-widget="chat-pane-toggle"
                                >
                                  {" "}
                                  {
                                    (
                                      dataStaffComment !== null &&
                                      dataStaffComment?.filter(
                                        (e) =>
                                          e.NotificationId ===
                                          item.NotificationId
                                      )
                                    ).length
                                  }
                                </sup>
                                {item.Creater === +Creater && (
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
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4 text-right">
                            {(
                              dataStaffView !== null &&
                              dataStaffView?.filter(
                                (e) => e.NotificationId === item.NotificationId
                              )
                            ).map((item2, index2) => {
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
                                  dataStaffView.filter(
                                    (e) =>
                                      e.NotificationId === item.NotificationId
                                  ).length > 0
                                    ? "notiviewstaffTotal"
                                    : ""
                                }
                              >
                                {dataStaffView.filter(
                                  (e) =>
                                    e.NotificationId === item.NotificationId
                                ).length > 0
                                  ? dataStaffView.filter(
                                      (e) =>
                                        e.NotificationId === item.NotificationId
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
            })
          ) : (
            <div className="col-12">
              <i className=" m-auto">
                {" "}
                Đang lấy dữ liệu thông báo, vui lòng chờ trong giây lát...
              </i>
            </div>
          )}
          {notifys.length > 0 && notifys.length !== data.length ? (
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
        <div
          class={
            dataLeave?.length > 0
              ? "col-md-4 col-12 noti card display-block"
              : "display-none"
          }
        >
          <div className="card-header">
            Nhân viên đăng ký nghỉ phép : ({dataLeave.length})
          </div>
          {dataLeave?.map((item3, index3) => {
            return (
              <div
                className="row"
                style={{
                  boxShadow:
                    "0 0 1px rgb(0 0 0 / 13%), 0 1px 3px rgb(0 0 0 / 20%)",
                  borderRadius: "0.25rem",
                  backgroundColor: "#fff",
                  margin: "5px -1px",
                }}
              >
                <div class="col-md-3" style={{ height: "50px", width: "50px" }}>
                  <Img src={item3.Avatar} className="leaveimg" />
                </div>
                <div class="col-md-8">
                  <div class="info-box-content">
                    <div className="noti_Name">
                      <span class="info-box-text">
                        <b>{item3.StaffName}</b>
                      </span>
                    </div>
                    <div className="noti_Time">
                      {" "}
                      <i class="fa fa-clock" aria-hidden="true"></i> Nghỉ:{" "}
                      <b>
                        {item3?.TimeLeave
                          ? FormatDateJson(item3?.TimeLeave, 7)
                          : null}
                      </b>
                    </div>
                  </div>
                </div>
                <div
                  className="col-md-12"
                  style={{ borderTop: "1px dashed #009688" }}
                >
                  <span style={{ fontSize: "11px" }}>
                    <b>{item3.TypeLeaveName}</b>
                  </span>{" "}
                  -{" "}
                  <span style={{ fontSize: "11px" }}>
                    Lý do : {item3.Reason}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [notifys, dataLeave, dataStaffComment, dataStaffView]);

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
      <div className="content-wrapper NewsNotification">
        <div class="card-header border-left-red">
          <div class="row">
            <div class="col-sm-12 col-md-3">
              <h3 class="card-title font-weight-bold">
                THÔNG BÁO NỘI BỘ ({data?.length || 0})
              </h3>
            </div>
            <div class="col-sm-12 col-md-9 margin-top-5s">
              {PermissionAdd.length > 0 && PermissionAdd[0].Adds === "C" ? (
                <button
                  onClick={VideAdd}
                  type="button"
                  class="btn btn-sm btn-success pull-right margin-left-5"
                >
                  <i class="fa fa-plus pr-2"></i>
                  Thêm thông báo
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div class="card-body border-left-red">
          {RenderListNoti}
          <Modal
            show={modalIsOpenStaffview}
            onHide={closeModal}
            className=" custom-modal-w-90"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header>
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

              <button
                type="button"
                class="close"
                aria-label="Close"
                onClick={closeModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
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
                                src={item3.Avatar}
                                className="notiviewstaff"
                              />
                            </div>
                            <div class="col-md-8">
                              <div class="info-box-content">
                                <div className="noti_Name">
                                  <span class="info-box-text">
                                    <b>{item3.StaffName}</b>
                                  </span>
                                </div>
                                <div className="noti_Time">
                                  {" "}
                                  <i
                                    class="fa fa-clock"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  {item3?.TimeView
                                    ? FormatDateJson(item3?.TimeView, 10)
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

          <Modal
            show={modalIsOpenStaffLike}
            onHide={closeModal}
            className=" custom-modal-w-90"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header>
              <Modal.Title id="example-custom-modal-styling-title">
                <div class="">
                  <h6>
                    {" "}
                    Danh sách nhân viên đã {Likes === 1
                      ? "Likes"
                      : "DisLike"}{" "}
                    thông báo : (
                    <strong className="check-point">{StaffLike.length}</strong>){" "}
                  </h6>
                </div>
              </Modal.Title>
              <button
                type="button"
                class="close"
                aria-label="Close"
                onClick={closeModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </Modal.Header>
            <Modal.Body>
              <div class="card-body">
                <div className="row">
                  {StaffLike.length > 0 &&
                    StaffLike?.map((item4, index4) => {
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
                                src={item4.Avatar}
                                className="notiviewstaff"
                              />
                            </div>
                            <div class="col-md-8">
                              <div class="info-box-content">
                                <div className="noti_Name">
                                  <span class="info-box-text">
                                    <b>{item4.StaffName}</b>
                                  </span>
                                </div>
                                <div className="noti_Time">
                                  {" "}
                                  <i
                                    class="fa fa-clock"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  {item4?.TimeLikes
                                    ? FormatDateJson(item4?.TimeLikes, 10)
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
              class="close"
              aria-label="Close"
              onClick={closeModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body>{RenderModal}</Modal.Body>
        </Modal>
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
    </>
  );
};

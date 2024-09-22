import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  ConfirmAlert,
} from "../../../../Utils";
import Modal from "react-bootstrap/Modal";
import { useLocation } from "react-router-dom";
import { IMAGES_DOMAIN } from "../../../../Services";

export const DepartmentMap = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const DepartmentId = localStorage.getItem("Dpid");
  let prm = useLocation();
  useEffect(() => {
    Trl_spDepartment_List();
  }, [DepartmentId, prm]);

  const [IsOpen, setIsOpen] = useState(false);
  const openModalCreate = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setImagesDP([]);
  };

  // Update hình ảnh phòng ban
  const [ImagesDP, setImagesDP] = useState([]);
  const handleChangeFileAndImage = (e, type = 0) => {
    let f = e.target.files;
    let check = true;
    if (type === 0) {
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
        ? setImagesDP([...ImagesDP, ...e.target.files])
        : Alertwarning(
            'File không đúng định dạng! Vui lòng chọn lại file có định dạng "jpg", "jpeg", "png", "gif"'
          );
    }
  };

  //#region  Danh sách
  const [Data, setData] = useState("");
  const Trl_spDepartment_List = async (brid, Keys) => {
    try {
      const pr = {
        DepartmentId: DepartmentId,
        DepartmentSearch: "",
        BranchId: 0,
        Creater: Creater,
        CreateName: CreateName,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spDepartment_List",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      setData(list, "mapdetail");
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };

  const Trl_spDepartment_Routermap_Save = async () => {
    let listImagesDP = "";
    try {
      if (ImagesDP.length <= 0) {
        Alertwarning("Vui lòng chọn hình ảnh!");
        return;
      }

      if (ImagesDP.length > 0) {
        const formData = new FormData();
        formData.append("Key", "RouteMapDepartment");
        for (let i = 0; i < ImagesDP.length; i++) {
          formData.append("myFile" + i, ImagesDP[i]);
        }
        const res = await mainAction.API_spCallPostFile(formData, dispatch);
        listImagesDP = res.Message.replaceAll('"', "")
          .replace("[", "")
          .replace("]", "");
      }

      const pr = {
        DepartmentId: Data[0]?.DepartmentId,
        Routermap: listImagesDP,
        Editer: Creater,
        EditName: CreateName,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spDepartment_Routermap_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spDepartment_List();
        closeModal();
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <div class="card-header border-left-red">
          <div class="row">
            <div class="col-sm-12 col-md-4">
              <h3 class="card-title font-weight-bold ">
                SƠ ĐỒ TỔ CHỨC BỘ PHẬN
              </h3>
            </div>
            <div class="col-sm-12 col-md-8 margin-top-5s">
              <button
                onClick={(e) => {
                  openModalCreate();
                }}
                type="button"
                class="btn btn-sm btn-success pull-right margin-left-5"
              >
                <i class="fas fa-edit pr-2"></i>
                Update
              </button>
            </div>
          </div>
        </div>
        <div className="card-body border-left-red">
          <div className="row margin-top-5">
            <img
              src={IMAGES_DOMAIN + Data[0]?.Routermap}
              alt=""
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <Modal
          show={IsOpen}
          onHide={closeModal}
          aria-labelledby="example-custom-modal-styling-title"
          className=" custom-modal-w-90"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              <div class="">
                {Data[0]?.Routermap?.length <= 0
                  ? "Thêm mới hình ảnh tổ chức bộ phận"
                  : "Chỉnh sửa hình ảnh tổ chức bộ phận"}
              </div>
            </Modal.Title>
            <div>
              <button
                type="button"
                class="btn btn-sm btn-danger pull-right margin-left-5 close"
                aria-label="Close"
                onClick={closeModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <button
                style={{ marginRight: "5px" }}
                type="button"
                class="btn btn-sm btn-success pull-right"
                onClick={() => {
                  ConfirmAlert("Xác nhận", "Bạn có muốn lưu không?", () => {
                    Trl_spDepartment_Routermap_Save();
                  });
                }}
              >
                <i class="fa fa-edit pr-2"></i>
                {Data[0]?.Routermap?.length <= 0 ? "Thêm mới" : "Chỉnh sửa"}
              </button>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="card-body ">
              <div className="row">
                <div class="col-xs-12 col-sm-12 col-md-12 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Hình Sơ Đồ{" "}
                      <span class="text-danger">(jpg, jpeg, png)</span>
                    </span>
                    <label class="image-collapse-label2">
                      <input
                        type="file"
                        className="image-collapse-file cursor-pointer"
                        onChange={(e) => handleChangeFileAndImage(e, 0)}
                        accept="image/*"
                        multiple
                      />
                      <i class="fas fa-passport upload-file-btn"></i>
                    </label>
                    <div className="row ">
                      {ImagesDP.map((item, ix) => {
                        return (
                          <div
                            className="upload-file-item py-1 my-2 shadow-sm col-12 position-relative"
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
                                setImagesDP(ImagesDP.filter((_, i) => i !== ix))
                              }
                            ></i>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

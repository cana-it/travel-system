import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  ConfirmAlert,
  GetLogin,
} from "../../../Utils";
import { Button, Modal } from "react-bootstrap";
import { SelectTags } from "../../../Common/CMS/SelectTags";
import FormImageUpload from "../../../Common/CMS/FormImageUpload";
import { mainAction } from "../../../Redux/Actions";
import { IMAGES_DOMAIN } from "../../../Services";
import { MyEditor } from "../../../Common/CMS/MyEditor";
import { DragAndDropFile } from "../../../Common/CMS/DragAndDropFile";
import { SelectMenu } from "../../../Common/CMS/SelectMenu";

export const Galery = () => {
  const dispatch = useDispatch();
  const [Disable, setDisable] = useState(true);
  const [Disable2, setDisable2] = useState(true);
  const [AllowChange, setAllowChange] = useState(false);
  const [dataImages, setDataImages] = useState([]);
  const [tagSearch, setTagSearch] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [FileUpload, setFileUpload] = useState([]);
  const [tags, setTags] = useState({});
  const [Introduce, setIntroduce] = useState("");
  useEffect(() => {
    CMS_spGalery_List();
  }, []);

  useEffect(() => {
    CMS_spGalery_List();
  }, [tagSearch]);

  //#region List
  const CMS_spGalery_List = async () => {
    try {
      setDisable2(false);
      const pr = {
        Type: "GALERY",
        TagUrl: tagSearch?.obj?.TagUrl || "",
        UserId: GetLogin("Creater"),
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "CMS_spGalery_List",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        setDataImages(result);
        setDisable2(true);
        return;
      }
      setSelectedImage([]);
      setDataImages([]);
      Alertwarning("Không có dữ liệu");
      setDisable2(true);
    } catch (err) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
      setDisable2(true);
    }
  };

  const updateTableData = (
    action,
    parentIndex = -1,
    rowIndex = -1,
    value = -1
  ) => {
    if (action === "selectItem")
      setDataImages((old) =>
        old.map((row, index) => {
          if (index === parentIndex) {
            return {
              ...row,
              Images: row.Images?.map((r, i) => {
                if (i === rowIndex) {
                  return { ...r, Selected: value };
                } else return r;
              }),
            };
          }
          return row;
        })
      );
    else {
      //Xóa tất cả hình ảnh có thuộc tính Selected //Hoặc xóa tất cả Hình ảnh có GaleryId=value
      setDataImages((old) =>
        old.map((row, index) => {
          return {
            ...row,
            Images: row.Images.filter(
              (p) =>
                (value === -1 && p.Selected !== true) ||
                (value !== -1 && p.GaleryId !== value)
            ),
          };
        })
      );
    }
  };
  const [selectedImage, setSelectedImage] = useState([]);
  const updateSelectedData = (item, key) => {
    let tmp = selectedImage || [];
    if (key === true) {
      tmp.push(item);
      setSelectedImage(tmp);
    } else {
      setSelectedImage(tmp.filter((p) => p.GaleryId !== item.GaleryId));
    }
  };
  //#endregion

  //#region Form Upload Image
  const onChangeTags = (e) => {
    setTags(e);
  };
  const CMS_spGalery_Save = async () => {
    try {
      setDisable(false);
      if ((tags?.length || 0) === 0) {
        Alertwarning("Vui lòng chọn ít nhất 1 tag");
        setDisable(true);
        return;
      }
      let _newListImage = "";
      if (FileUpload.length > 0) {
        //addFormImageUpload
        const formData = [];
        FileUpload.forEach((file) => {
          formData.push(file.file);
        });
        const imageUploaded = await FormImageUpload(
          formData,
          "Galery",
          dispatch
        );
        _newListImage = imageUploaded.split(",");
      } else if (typeof FileUpload === "string" || FileUpload.length === 0) {
        // Alertwarning("Vui lòng chọn file");
        // setDisable(true);
        // return;
      } else if (!_newListImage) {
        Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
        setDisable(true);
        return;
      }
      const params = {
        Json: JSON.stringify({
          Tags: tags,
          Galery: _newListImage,
          CreateBy: GetLogin("CreateBy"),
          Introduce: Introduce,
        }),
        func: "CMS_spGalery_Save",
      };
      setDisable(true);
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        setDisable(true);
        setTagSearch(tags[0]);
        setTags([]);
        setFileUpload([]);
        return;
      }
      if (result.Status === "NOTOK") {
        Alertwarning(result.ReturnMess);
        setDisable(true);
        return;
      }
      setDisable(true);
    } catch (err) {
      setDisable(true);
    }
  };
  //#endregion

  //#region Show hình ảnh chi tiết
  const [ModalImg, setModalImg] = useState("");
  const ChangeImage = async (img) => {
    await setModalImg(img);
  };

  const ViewImg = (
    <div
      className="modal fade"
      id="modalImg"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalImg"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content" style={{ width: "100%" }}>
          <div className="modal-header">
            <h5 className="modal-title">Hình ảnh</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body text-center" id="modal-body">
            <img
              src={ModalImg}
              id="myimage"
              width="100%"
              height="100%"
              style={{ marginTop: "10px !important" }}
              alt="something"
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  //#endregion

  //#region Modal
  const [modalIsOpenCreate, setIsOpenCreate] = useState(false);
  const openModalCreate = () => {
    setIsOpenCreate(true);
  };

  const closeModalCreate = (
    title = "Bạn có chắc chắn muốn tắt form không?"
  ) => {
    //ConfirmAlert(title, "", async () => {
    setIsOpenCreate(false);
    setFileUpload([]);
    setTags([]);
    //});
  };
  //#endregion

  //#region Xóa hình ảnh
  const CMS_spGaleryTags_Remove = async (GaleryItem) => {
    try {
      setDisable2(false);
      const pr = {
        Galery: GaleryItem,
        UserId: GetLogin("Creater"),
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "CMS_spGaleryTags_Remove",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        setDataImages(result);
        setDisable2(true);
        return;
      }
      setDisable2(true);
    } catch (err) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
      setDisable2(true);
    }
  };
  //#endregion

  return (
    <>
      <div className="content-wrapper">
        <div className="card p-1">
          <div className="card-header">
            <span className="HomeTitle  bold">Quản lý hình ảnh</span>
            <div className="float-right">
              <button
                onClick={(e) => {
                  openModalCreate();
                }}
                type="button"
                class="btn btn-sm btn-success pull-right margin-left-5"
                style={{ marginTop: "-7px" }}
              >
                <i class="fa fa-plus pr-2"></i>
                Upload
              </button>
              {selectedImage.length > 0 && (
                <button
                  onClick={(e) => {
                    ConfirmAlert(
                      "Xác nhận",
                      "Xác nhận xóa hình ảnh",
                      async () => {
                        CMS_spGaleryTags_Remove(selectedImage);
                        updateTableData("deleteItem", -1, -1, -1);
                        setSelectedImage([]);
                      }
                    );
                  }}
                  type="button"
                  class="btn btn-sm btn-danger pull-right margin-left-5"
                  style={{ marginTop: "-7px" }}
                >
                  <i class="fa fa-trash pr-2"></i>
                  Xóa
                </button>
              )}
            </div>
          </div>
          <div className="col-md-4 mt-4">
            <SelectTags
              Type="GALERY"
              activer={tagSearch || []}
              onSelected={(e) => setTagSearch(e)}
              isMulti={false}
            />
          </div>
          <div className="card-body">
            {dataImages.map((itemTag, indexTag) => {
              return (
                itemTag.Images?.length > 0 && (
                  <div
                    className="row"
                    key={indexTag}
                    style={{ marginBottom: "20px" }}
                  >
                    <div className="col-md-12">
                      <h4
                        style={{
                          margin: "10px 0",
                          padding: "8px",
                          color: "#ce2029",
                          border: "1px solid #ddd",
                        }}
                      >
                        <i
                          className="fas fa-images"
                          style={{ marginRight: "10px" }}
                        ></i>
                        {itemTag.TagName}
                        <div className="float-right">#{itemTag.TagUrl}</div>
                      </h4>
                    </div>
                    {itemTag.Images?.map((item, index) => {
                      return (
                        <div className="col-md-3 justify-content-center align-items-center">
                          <div className="image-container">
                            <img
                              className="object-fit-cover"
                              src={IMAGES_DOMAIN + item.Image}
                              alt=""
                            />
                            <div class="option-checkbox">
                              <input
                                type="checkbox"
                                id="checkbox1"
                                checked={item.Selected || false}
                                onChange={() => {
                                  let k = !(item.Selected || false);
                                  updateTableData(
                                    "selectItem",
                                    indexTag,
                                    index,
                                    k
                                  );
                                  updateSelectedData(item, k);
                                }}
                              />
                            </div>
                            <div class="option-buttons">
                              <div className="center-image">
                                <button
                                  class="btn btn-primary"
                                  onClick={() =>
                                    ChangeImage(IMAGES_DOMAIN + item.Image)
                                  }
                                  data-toggle="modal"
                                  data-target="#modalImg"
                                  title="Click để xem hình lớn"
                                >
                                  <i className="fa fa-expand"></i>
                                </button>
                                <button
                                  class="btn btn-danger"
                                  onClick={() =>
                                    ConfirmAlert(
                                      "Xác nhận",
                                      "Xác nhận xóa hình ảnh",
                                      async () => {
                                        CMS_spGaleryTags_Remove(item);
                                        updateTableData(
                                          "deleteItem",
                                          indexTag,
                                          index,
                                          item.GaleryId
                                        );
                                        setSelectedImage([]);
                                      }
                                    )
                                  }
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              );
            })}
          </div>
        </div>
        {ViewImg}
        <Modal
          show={modalIsOpenCreate}
          onHide={closeModalCreate}
          aria-labelledby="example-custom-modal-styling-title"
          className=" custom-modal-w-90"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              <div class="text-center">Quản lý hình ảnh</div>
            </Modal.Title>
            <Button
              type="button"
              className="close"
              aria-label="Đóng"
              onClick={() => {
                closeModalCreate();
              }}
            >
              <span aria-hidden="true">&times;</span>
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="col-md-12">
              <div className="form-group">
                <label className="no-absolute">Chọn tags</label>
                <SelectTags
                  Type="GALERY"
                  activer={tags || []}
                  onSelected={(e) => onChangeTags(e)}
                  isMulti={true}
                />
              </div>
            </div>
            <div className="col-md-12">
              <label className="no-absolute">
                Upload hình ảnh <span className="red">(*)</span>
              </label>
              <DragAndDropFile
                fileUpload={FileUpload}
                onFileChange={setFileUpload}
              />
            </div>
            {/* <div className="col-md-12 CKEditor-m">
              <label className="no-absolute">
                Giới thiệu <span className="red">(*)</span>
              </label>
            </div>
            <MyEditor
              onChange={(e) => setIntroduce(e)}
              values={Introduce}
              height={400}
            /> */}
          </Modal.Body>
          <Modal.Footer>
            {!AllowChange && (
              <button
                type="button"
                className="btn btn-sm btn-outline-info"
                onClick={() => {
                  setTags([]);
                  setFileUpload([]);
                }}
              >
                <i className="fa fa-rotate-left mr-1"></i>Làm mới
              </button>
            )}
            <button
              type="button"
              className="btn btn-sm btn-success ml-3"
              disabled={!Disable}
              data-dismiss={AllowChange ? "modal" : ""}
              onClick={(e) => {
                CMS_spGalery_Save();
              }}
            >
              <i className="fa fa-floppy-disk mr-1"></i>Lưu
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

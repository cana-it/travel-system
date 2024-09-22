import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  ConfirmAlert,
  ConvertToUrl,
  GetLogin,
} from "../../../Utils";
import { mainAction } from "../../../Redux/Actions";
import { IMAGES_DOMAIN } from "../../../Services";
import { DataTable } from "../../../Common";
import { MyEditor } from "../../../Common/CMS/MyEditor";
import { ImgMutilUpload } from "../../../Common/CMS/ImgMutilUpload";
import FormImageUpload from "../../../Common/CMS/FormImageUpload";
import { Button, Modal } from "react-bootstrap";
import { SelectMenu } from "../../../Common/CMS/SelectMenu";

export const Blogs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    CMS_spBlogs_List();
  }, []);
  const CreateBy = localStorage.getItem("CreateBy");
  const [Title, setTitle] = useState("Thêm bài đăng");
  const [Content, setContent] = useState("");
  const [AllowChange, setAllowChange] = useState(false);
  const [FileUpload, setFileUpload] = useState([]);
  const [FileUploadBanner, setFileUploadBanner] = useState([]);
  const _User = GetLogin("CreateBy");
  const User = _User && JSON.parse(_User);

  const [formData, setFormData] = useState({
    BlogsId: 0,
    Title: "",
    Description: "",
    MetaTitle: "",
    MetaDescription: "",
    IsHide: 0,
    ImageBanner: "",
    Images: "",
    IsDelete: 0,
    FileBlogs: "",
    ParentId: { value: 0, label: "Vui lòng chọn" },
    CategoriesId: "",
  });

  const [ListData, setListData] = useState([]);
  const [Value, setValue] = useState({
    Images: "",
    ImageBanner: "",
  });

  const ClearForm = () => {
    setFormData({
      BlogsId: 0,
      Title: "",
      IsHide: 0,
      ImageBanner: "",
      Images: "",
      IsDelete: 0,
      ParentId: { value: 0, label: "Vui lòng chọn" },
    });
    setValue({
      ImageBanner: "",
      Images: "",
    });
    setContent("");
    setFileUpload([]);
    setFileUploadBanner([]);
    setAllowChange(false);
    setTitle("Thêm bài đăng");
    setCategorisChoose([]);
  };

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

  //#region Categories thêm
  const [categories, setCategories] = useState({
    MenuId: "",
  });
  const [categorisChoose, setCategorisChoose] = useState([]);

  const CMS_spMenu_List = async () => {
    try {
      let pr = {
        Id: 0,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "CMS_spMenu_List",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      setCategories(createNestedArray(res));
    } catch (error) {}
  };

  function createNestedArray(arr) {
    const map = new Map();
    const result = [];
    for (const item of arr) {
      if (!map.has(item.Id)) {
        const key = item.MenuUrl.substring(1);
        map.set(item.Id, {
          key: key,
          MenuId: item.Id,
          children: [],
          MenuImage: item.MenuImage,
          MenuName: item.MenuName,
          isShow: false,
          // MenuName: lang === "vi" ? item.MenuName : item.MenuNameEn,
        });
      }
    }
    for (const item of arr) {
      if (item.ParentId === undefined) {
        result.push(map.get(item.Id));
      } else {
        const parentItem = map.get(item.ParentId);
        if (parentItem) {
          parentItem.children.push(map.get(item.Id));
        }
      }
    }
    const filteredArr = result.map((item) => removeEmptyChildren(item));
    return filteredArr;
  }

  function removeEmptyChildren(node) {
    if (node.children && node.children.length === 0) {
      delete node.children;
    } else if (node.children && node.children.length > 0) {
      node.children = node.children.map((childNode) =>
        removeEmptyChildren(childNode)
      );
    }
    return node;
  }

  const handleShowCategories = (id) => {
    let newCategories = categories.map((item) => {
      if (item.MenuId === id) return { ...item, isShow: !item.isShow };
      return { ...item, isShow: false };
    });
    setCategories(newCategories);
  };

  const handleChooseCategories = (item) => {
    let index = categorisChoose.findIndex((x) => x.MenuId === item.MenuId);
    if (index !== -1) {
      categorisChoose.splice(index, 1);
    } else {
      categorisChoose.push(item);
    }
    setCategorisChoose([...categorisChoose]);
  };

  const RenderCategories = () => {
    return (
      <div class="accordion" id="accordionExample">
        <div class="card">
          {categories?.map((item, index) => {
            return (
              <>
                <div class="" id={item.MenuName}>
                  <h5 class="mb-0 w-100">
                    <button
                      class="btn btn-link text-dark fs-14 bold w-100 d-flex justify-content-between align-items-center"
                      type="button"
                      onClick={(e) => {
                        handleChooseCategories(item);
                        handleShowCategories(item.MenuId);
                      }}
                      data-toggle="collapse"
                      data-target={`#${item.MenuName}${index}`}
                      aria-expanded={item.isShow ? "true" : "false"}
                      aria-controls={`${item.MenuName}${index}`}
                    >
                      {item.MenuName}
                      {item.isShow ? (
                        <i class="fas fa-chevron-up fs-12"></i>
                      ) : (
                        <i class="fas fa-chevron-down fs-12"></i>
                      )}
                    </button>
                  </h5>
                </div>
                <div
                  id={`${item.MenuName}${index}`}
                  class={`collapse ${item.isShow ? "show" : ""}`}
                  aria-labelledby={item.MenuName}
                  data-parent="#accordionExample"
                >
                  {item.children &&
                    item.children.length > 0 &&
                    item.children.map((child, index2) => {
                      return (
                        <div
                          class="card-body px-4 py-1 fs-14 cursor-pointer"
                          key={index2}
                          onClick={(e) => handleChooseCategories(child)}
                        >
                          {child.MenuName}
                        </div>
                      );
                    })}
                </div>
              </>
            );
          })}
        </div>
      </div>
    );
  };

  const RenderCategoriesChoose = () => {
    return (
      <div class="d-flex flex-row flex-wrap fs-12 ">
        {categorisChoose?.map((item, index) => {
          return (
            <span
              class="mx-1 px-2 py-1 rounded-lg my-1 bg-secondary "
              key={index}
              id={item.MenuName}
            >
              {item.MenuName}
              <i
                class="fas fa-times ml-2 cursor-pointer"
                onClick={() => handleChooseCategories(item)}
              ></i>
            </span>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    CMS_spMenu_List();
  }, []);
  //#endregion thêm

  //#region Save
  const CMS_spBlogs_Save = async () => {
    ;
    try {
      let _newListImage = "";
      if (FileUpload.length > 0) {
        //addFormImageUpload
        const newListImage = await FormImageUpload(
          FileUpload,
          "Blogs",
          dispatch
        );
        _newListImage = [newListImage, Value?.Images || ""].join(",");
      } else if (typeof FileUpload === "string" || FileUpload.length === 0) {
        _newListImage = Value.Images;
      } else if (!_newListImage) {
        Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
        return;
      }

      let _newListImageBanner = "";
      if (FileUploadBanner.length > 0) {
        //addFormImageUpload
        const newListImageBanner = await FormImageUpload(
          FileUploadBanner,
          "Blogs",
          dispatch
        );
        _newListImageBanner = [
          newListImageBanner,
          Value?.ImageBanner || "",
        ].join(",");
      } else if (
        typeof FileUploadBanner === "string" ||
        FileUploadBanner.length === 0
      ) {
        _newListImageBanner = Value.ImageBanner;
      } else if (!_newListImageBanner) {
        Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
        return;
      }
      if (formData.Title === "" || formData.Title === undefined) {
        Alertwarning("Vui lòng nhập tiêu đề");
        return;
      }
      if (formData.Description === "" || formData.Description === undefined) {
        Alertwarning("Vui lòng nhập mô tả");
        return;
      }
      if (Content === "" || Content === undefined) {
        Alertwarning("Vui lòng nhập nội dung");
        return;
      }
      if (formData.MetaTitle === "" || formData.MetaTitle === undefined) {
        Alertwarning("Vui lòng nhập MetaTitle");
        return;
      }
      if (
        formData.MetaDescription === "" ||
        formData.MetaDescription === undefined
      ) {
        Alertwarning("Vui lòng nhập MetaDescription");
        return;
      }
      let cateName = "",
        cateId = "";
      let categoryList = categorisChoose.map((item) => {
        cateName += item.MenuName + ";";
        cateId += item.MenuId + ";";
        return { CategoryId: item.MenuId, BlogId: formData.BlogsId };
      });

      const params = {
        Json: JSON.stringify({
          BlogsId: formData.BlogsId,
          Title: formData.Title?.trim(),
          Description: formData.Description,
          Content: Content?.trim().replaceAll("\n", ""),
          Images: _newListImage?.trim(),
          ImageBanner: _newListImageBanner?.trim(),
          ParentId: formData.ParentId?.value,
          UserId: User.UserId,
          GroupId: User.GroupId,
          CreateBy: CreateBy,
          MetaTitle: formData.MetaTitle,
          MetaDescription: formData.MetaDescription,
          CategoriesName: cateName,
          CategoriesId: cateId,
          CategoriesList: categoryList,
          Url: ConvertToUrl(formData.Title?.trim()),
        }),
        func: "CMS_spBlogs_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      ;
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        setIsOpen(!modalIsOpen);
        CMS_spBlogs_List();
        setFileUpload([]);
        setFileUploadBanner([]);
        ClearForm();
      }
    } catch (error) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
    }
  };
  //#endregion

  //#region List
  const [CategoriesId, setCategoriesId] = useState(0);
  const CMS_spBlogs_List = async () => {
    ;
    try {
      setListData([]);
      const params = {
        Json: JSON.stringify({
          KeySelect: 0,
          CategoriesId: CategoriesId,
        }),
        func: "CMS_spBlogs_List",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        setListData(result);
        return;
      }
      Alertwarning("Không có dữ liệu");
    } catch (err) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
    }
  };
  //#endregion

  //#region Update Attribute

  const updateTableData = (BlogsId, columnId, value) => {
    if (columnId === "IsDelete")
      setListData(ListData.filter((p) => p.BlogsId !== BlogsId));
    else
      setListData((old) =>
        old.map((row, index) => {
          if (row.BlogsId === BlogsId) {
            ;
            if (columnId === "IsHide") row.IsHide = value;
            if (columnId === "IsHot") row.IsHot = value;
          }
          return row;
        })
      );
  };

  const CMS_spBlogs_UpdateAtribute = async (item, ColumnName, Value) => {
    try {
      let action = "";
      if (ColumnName === "IsDelete") action = "XÓA";
      if (ColumnName === "IsHide")
        action = Value === 0 ? "ẨN BÀI ĐĂNG" : "HIỆN BÀI ĐĂNG";
      if (ColumnName === "IsHot")
        action =
          Value === 1
            ? "XÁC NHẬN ĐÂY LÀ BÀI ĐĂNG NỔI BẬT"
            : "XÁC NHẬN TRỞ VỀ BÀI ĐĂNG BÌNH THƯỜNG";
      ConfirmAlert("Xác nhận", `Bạn có chắc muốn ${action}?`, async () => {
        let Data = item._original;
        const params = {
          Json: JSON.stringify({
            BlogsId: Data.BlogsId,
            ColumnName: ColumnName,
            Value: Value,
            UserId: GetLogin("CreateBy"),
          }),
          func: "CMS_spBlogs_UpdateAtribute",
        };
        const result = await mainAction.API_spCallServer(params, dispatch);
        if (result.Status === "OK") {
          updateTableData(Data.BlogsId, ColumnName, !Data.IsHide);
          Alertsuccess(result.Message);
          //alert(result.Message);
          return;
        }
        Alertwarning(result.ReturnMess);
      });
    } catch (error) {
      Alerterror("Vui lòng liên hệ IT!");
    }
  };
  //#endregion

  //#region edit
  const CMS_spBlogs_Edit = (item, key) => {
    let Data = item._original;
    setFormData({
      BlogsId: Data.BlogsId,
      Title: Data.Title,
      Description: Data.Description,
      MetaTitle: Data.MetaTitle,
      MetaDescription: Data.MetaDescription,
      Images: Data.Images,
      ImageBanner: Data.ImageBanner,
      IsHide: Data.IsHide ? 0 : 1,
      IsHot: Data.IsHot ? 0 : 1,
      IsDelete: Data.IsDelete ? 0 : 1,
      CreateBy: User.UserId,
      ParentId: { value: Data.ParentMenuId },
    });
    handleSetCategory(Data);
    setContent(Data.Content);
    setIsOpen(true);
    setTitle("Sửa bài đăng");
  };
  const handleSetCategory = (cate) => {
    let cId = cate.CategoriesId.split(";")
      .filter((item) => item)
      .map(Number);
    let cName = cate.CategoriesName.split(";").filter((item) => item);
    let caChoose = cId.map((item, index) => {
      return { MenuId: item, MenuName: cName[index] };
    });
    setCategorisChoose(caChoose);
  };
  //#endregion

  const columns = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      filterable: false,
      special: true,
      className: "text-center",
      show: true,
    },
    {
      Header: "Tùy chọn",
      Cell: ({ row }) => (
        <>
          <button
            title="Sửa"
            className="btn bg-warning btn-sm mx-2 text-white"
            onClick={(e) => {
              setValue({
                ...Value,
                Images: row._original.Images,
                ImageBanner: row._original.ImageBanner,
              });
              CMS_spBlogs_Edit(row);
            }}
          >
            <i className="fas fa-edit" title="Sửa" />
          </button>
          <button
            title="Xóa"
            className="btn bg-danger btn-sm mx-2"
            onClick={(e) => CMS_spBlogs_UpdateAtribute(row, "IsDelete", true)}
          >
            <i className="fas fa-trash" title="Xóa" />
          </button>
        </>
      ),
      width: 180,
      filterable: false,
      className: "text-center",
    },
    {
      Header: "Ẩn",
      accessor: "IsHide",
      filterable: false,
      className: "text-center",
      width: 70,
      Cell: ({ row }) => {
        return (
          <div
            class="custom-control custom-switch"
            onClick={(e) =>
              CMS_spBlogs_UpdateAtribute(row, "IsHide", !row._original.IsHide)
            }
          >
            <input
              class="custom-control-input"
              type="checkbox"
              id={"customSwitchHide" + row._original.BlogsId}
              checked={row._original.IsHide}
            />
            <label
              class="custom-control-label"
              for={"customSwitchHide" + row._original.BlogsId}
            ></label>
          </div>
        );
      },
    },
    {
      Header: "Hot",
      accessor: "IsHot",
      filterable: false,
      className: "text-center",
      width: 50,
      Cell: ({ row }) => {
        return (
          <div
            class="custom-control custom-switch"
            onClick={(e) =>
              CMS_spBlogs_UpdateAtribute(row, "IsHot", !row._original.IsHot)
            }
          >
            <input
              class="custom-control-input"
              type="checkbox"
              id={"customSwitchHot" + row._original.BlogsId}
              checked={row._original.IsHot}
            />
            <label
              class="custom-control-label"
              for={"customSwitchHot" + row._original.BlogsId}
            ></label>
          </div>
        );
      },
    },
    {
      Header: "Hình ảnh",
      accessor: "Images",
      className: "text-center",
      filterable: false,
      Cell: ({ row }) => {
        return (
          <div>
            {row.Images !== undefined &&
            row.Images !== "" &&
            row.Images !== null
              ? row._original.Images.split(",").map((img, index) => {
                  return (
                    <>
                      {img !== "" && (
                        <a
                          className="cursor"
                          data-toggle="modal"
                          data-target="#modalImg"
                          title="Click để xem hình lớn"
                          onClick={(e) => {
                            ChangeImage(IMAGES_DOMAIN + img);
                          }}
                          key={index} // Add key prop to resolve the unique key warning
                        >
                          <img
                            src={IMAGES_DOMAIN + img}
                            width="30"
                            height="30"
                          />{" "}
                          {/* Add alt attribute */}
                        </a>
                      )}
                    </>
                  );
                })
              : null}
          </div>
        );
      },
    },
    {
      Header: "Banner",
      accessor: "ImageBanner",
      className: "text-center",
      filterable: false,
      Cell: ({ row }) => {
        return (
          <div>
            {row.ImageBanner !== undefined &&
            row.ImageBanner !== "" &&
            row.ImageBanner !== null
              ? row._original.ImageBanner.split(",").map((img, index) => {
                  return (
                    <>
                      {img !== "" && (
                        <a
                          className="cursor"
                          data-toggle="modal"
                          data-target="#modalImg"
                          title="Click để xem hình lớn"
                          onClick={(e) => {
                            ChangeImage(IMAGES_DOMAIN + img);
                          }}
                          key={index} // Add key prop to resolve the unique key warning
                        >
                          <img
                            src={IMAGES_DOMAIN + img}
                            width="30"
                            height="30"
                          />{" "}
                          {/* Add alt attribute */}
                        </a>
                      )}
                    </>
                  );
                })
              : null}
          </div>
        );
      },
    },
    {
      Header: "Tiêu đề",
      accessor: "Title",
      className: "text-center",
    },
    /* {
      Header: "Link hiển thị",
      accessor: "MenuName",
    }, */
    {
      Header: "Người tạo",
      accessor: "CreateName",
      className: "text-center",
    },
    {
      Header: "Ngày tạo",
      accessor: "CreateOn",
      className: "text-center",
    },
    {
      Header: "Người sửa",
      accessor: "EditName",
      className: "text-center",
    },
    {
      Header: "Ngày sửa",
      accessor: "EditOn",
      className: "text-center",
    },
  ];

  //#region Modal
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const VideAdd = () => {
    openModal();
  };
  //#endregion

  return (
    <div className="content-wrapper">
      <div className="card p-1">
        <div className="card-header">
          <span className="HomeTitle">
            Danh sách bài đăng
            <span className="color-green">
              {ListData.length > 0 && `(${ListData.length})`}
            </span>
          </span>
          <div className="float-right">
            <button
              onClick={(e) => {
                ClearForm();
                setFileUpload([]);

                setFileUploadBanner([]);
                VideAdd();
                setTitle("Thêm bài đăng");
              }}
              type="button"
              class="btn btn-sm btn-success pull-right margin-left-5"
              style={{ marginTop: "-7px" }}
            >
              <i class="fa fa-plus pr-2"></i>
              Thêm mới
            </button>
            <button
              onClick={(e) => {
                CMS_spBlogs_List();
              }}
              type="button"
              class="btn btn-sm btn-success pull-right margin-left-5"
              style={{ marginTop: "-7px" }}
            >
              <i class="fa fa-search pr-2"></i>
              Tìm kiếm
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row" style={{ marginTop: "-15px" }}>
            <div className="col-md-8"></div>
            <div className="col-md-4">
              <div className="form-group">
                <span className="small">
                  Danh mục <span className="red"> (*)</span>
                </span>
                <SelectMenu
                  onSelected={(e) => setCategoriesId(e.value)}
                  items={CategoriesId}
                />
              </div>
            </div>
          </div>
          {ViewImg}
          <div className="col-md-12 mb-3">
            <DataTable data={ListData} columns={columns} />
          </div>
        </div>
      </div>
      <Modal
        show={modalIsOpen}
        onHide={closeModal}
        className=" custom-modal-w-90"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header className="p-2">
          <Modal.Title id="example-custom-modal-styling-title">
            <div className="">
              {formData.BlogsId === 0
                ? "Thêm mới bài viết"
                : "Chỉnh sửa bài viết"}
            </div>
          </Modal.Title>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={closeModal}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <h2>Chi tiết</h2>
          <div className="row">
            <div className="col-8">
              <div className="col-md-12">
                <div className="form-group">
                  <label className="no-absolute">
                    Tiêu đề <span className="red">(*)</span>
                  </label>
                  <input
                    maxLength="100"
                    type="text"
                    className="form-control"
                    value={formData.Title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Title: e.target.value,
                      })
                    }
                    onBlur={(e) => {
                      setFormData({
                        ...formData,
                        MetaTitle:
                          formData.MetaTitle?.length === 0
                            ? e.target.value
                            : formData.MetaTitle,
                      });
                    }}
                    readOnly={AllowChange}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="no-absolute">
                    Mô tả <span className="red">(*)</span>
                  </label>
                  <textarea
                    rows={3}
                    type="text"
                    className="form-control"
                    value={formData.Description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Description: e.target.value,
                      })
                    }
                    onBlur={(e) => {
                      setFormData({
                        ...formData,
                        MetaDescription:
                          formData.MetaDescription?.length === 0
                            ? e.target.value
                            : formData.MetaDescription,
                      });
                    }}
                    readOnly={AllowChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <p className="p-2 mx-0 mb-0 shadow-sm">
                Danh mục <span className="red">(*)</span>{" "}
              </p>
              <div className="">
                <RenderCategoriesChoose />
              </div>
              <div className="box p-2">
                <RenderCategories />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <span className="small font-weight-bold text-muted">
                Hình ảnh
                <span className="text-danger"> (jpg, jpeg, png)</span>
              </span>
              <ImgMutilUpload
                onImageUpload={(e) => setFileUpload(e)}
                onData={(e) => setValue({ ...Value, Images: e })}
                data={Value.Images}
                isMutil={true}
              />
            </div>
            <div className="col-md-6">
              <span className="small font-weight-bold text-muted">
                Banner
                <span className="text-danger"> (jpg, jpeg, png)</span>
              </span>
              <ImgMutilUpload
                onImageUpload={(e) => setFileUploadBanner(e)}
                onData={(e) => setValue({ ...Value, ImageBanner: e })}
                data={Value.ImageBanner}
                isMutil={true}
              />
            </div>
          </div>
          <div className="col-md-12 CKEditor-m">
            <label className="no-absolute">
              Nội dung <span className="red">(*)</span>
            </label>
          </div>
          <MyEditor
            onChange={(e) => setContent(e)}
            values={Content}
            height={400}
            Folder="Blogs"
          />
          <h2 style={{ marginTop: "20px" }}>SEO</h2>
          <div className="col-md-12">
            <div className="form-group">
              <label className="no-absolute">
                Meta Title <span className="red">(*)</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.MetaTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    MetaTitle: e.target.value,
                  })
                }
                readOnly={AllowChange}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <label className="no-absolute">
                Meta description <span className="red">(*)</span>
              </label>
              <textarea
                rows={3}
                type="text"
                className="form-control"
                value={formData.MetaDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    MetaDescription: e.target.value,
                  })
                }
                readOnly={AllowChange}
              />
            </div>
          </div>
          <div className="col-sm-12 col-md-12 mt-2">
            <button
              onClick={() => {
                ClearForm();
                setFileUpload([]);
              }}
              type="button"
              className="btn btn-sm btn-danger pull-right margin-left-5"
            >
              <i className="fa fa-trash pr-2"></i>
              Clear form
            </button>
            <button
              type="button"
              className="btn btn-sm btn-success pull-right"
              onClick={CMS_spBlogs_Save}
            >
              <i className="fa fa-save pr-2"></i>
              {formData.BlogsId === 0 ? "Lưu" : "Chỉnh sửa"}
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Module Search */}
    </div>
  );
};

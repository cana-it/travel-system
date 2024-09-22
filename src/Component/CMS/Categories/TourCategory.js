import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { DataTable } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import { IMAGES_DOMAIN } from "../../../Services";
import { Alerterror, Alertsuccess, Alertwarning } from "../../../Utils";
import FormImageUpload from "../../../Common/CMS/FormImageUpload";
import { ImgMutilUpload } from "../../../Common/CMS/ImgMutilUpload";
import { confirmAlert } from "react-confirm-alert";
import { MyEditor } from "../../../Common/CMS/MyEditor";
import { SelectMenu } from "../../../Common/CMS/SelectMenu";
export const TourCategory = () => {
    const CreateBy = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    useEffect((e) => {
        CMS_spCategoryContent_List()
    }, []);
    const dispatch = useDispatch();
    const [ContentIntro, setContentIntro] = useState("");
    const [ContentDetail, setContentDetail] = useState("");
    const [FromValue, setFromValue] = useState({
        contentId: 0,
        ContentName: "",
        CategoriesId: "",
        CategoriesName: "",
        ImageFeedback: "",
        IsDelete: 0
    });

    const [ListData, setListData] = useState([]);
    const [FileUpload, setFileUpload] = useState([]);
    const ClearForm = () => {
        setFromValue({
            contentId: 0,
            ContentName: "",
            CategoriesId: "",
            CategoriesName: "",
            ImageFeedback: "",
        });
        setFileUpload([]);
    };

    //#region Save
    const CMS_spCategoryContent_Save = async () => {
        
        try {
            // HÌNH ẢNH THỰC TẾ
            let _newListImage = "";
            if (FileUpload.length > 0) {
                //addFormImageUpload
                const newListImage = await FormImageUpload(FileUpload, "Main", dispatch);
                _newListImage = [newListImage, FromValue?.ImageFeedback || ""].join(",");

            } else if (typeof FileUpload === 'string' || FileUpload.length === 0) {
                _newListImage = FromValue.ImageFeedback
            } else if (!_newListImage) {
                Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
                return;
            }

            const params = {
                Json: JSON.stringify({
                    contentId: FromValue.contentId,
                    ContentName: FromValue?.CategoriesName,
                    CategoriesId: FromValue?.CategoriesId,
                    CategoriesName: FromValue?.CategoriesName,
                    ContentIntro: ContentIntro,
                    ContentDetail: ContentDetail,
                    ImageFeedback: _newListImage?.trim(),
                    Creater: CreateBy,
                    CreateName: CreateName
                }),
                func: "CMS_spCategoryContent_Save",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                setIsOpen(false);
                CMS_spCategoryContent_List();
                return;
            }
            if (result.Status === "NOTOK") {
                Alertwarning(result.ReturnMess);
                return;
            } else {
                ListData.map((e) => {
                    if (e.contentId === FromValue.contentId) {
                        e.ContentName = FromValue.CategoriesName;
                        e.CategoriesId = FromValue.CategoriesId;
                        e.CategoriesName = FromValue.CategoriesName;
                        e.ImageFeedback = _newListImage;
                        e.IsDelete = FromValue.IsDelete;
                    }
                    return e;
                });
                setListData(ListData);
                Alertsuccess(result.ReturnMess);
                ClearForm();
            }
        } catch (error) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
        }
    };
    //#endregion

    //#region List
    const CMS_spCategoryContent_List = async () => {
        try {
            setListData([]);
            const pr = {
                contentId: 0
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "CMS_spCategoryContent_List",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setListData(result);
                return;
            }
            Alertwarning("Không có dữ liệu")
        } catch (err) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
        }
    };
    //#endregion

    //#region delete
    const CMS_spCategoryContent_Delete = (item) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return <ConfirmAlertUi onClose={onClose} item={item} />;
            },
        });
    };
    const ConfirmAlertUi = (props) => {
        return (
            <div className="card-body border-left-red">
                <h3>Xác nhận xóa dữ liệu!</h3>
                <p>
                    Bạn có chắc chắn muốn xóa{" "}
                    <strong>{props.item._original.MenuName}</strong>{" "}
                </p>
                <button className="btn btn-small btn-warning" onClick={props.onClose}>
                    {" "}
                    <i className="fa fa-undo"> </i> Hủy
                </button>
                <button
                    className="btn btn-small btn-danger margin-left-5"
                    onClick={() => {
                        props.onClose();
                        CMS_spCategoryContent_Delete_Action(props.item);
                    }}
                >
                    <i className="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    };
    const CMS_spCategoryContent_Delete_Action = async (item) => {
        try {
            const pr = {
                contentId: item._original.contentId,
                IsDelete: 1,
            };

            const params = {
                Json: JSON.stringify(pr),
                func: " CMS_spCategoryContent_Delete",
            };

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                CMS_spCategoryContent_List();
                return;
            }
            if (result.Status === "NOTOK") {
                Alerterror(result.ReturnMess);
                return;
            }
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
            ;
        }
    };
    //#endregion

    //#region edit
    const Trl_spSetting_Edit = (item, key) => {
        setIsOpen(true);
        let Data = item._original;
        setFromValue({
            contentId: Data.contentId,
            CategoriesId: Data.CategoriesId,
            CategoriesName: Data.CategoriesName,
            ContentIntro: Data.ContentIntro,
            ContentDetail: Data.ContentDetail,
            ImageFeedback: Data.ImageFeedback,
            EditBy: CreateBy,
            EditName: CreateName,
            IsDelete: Data.IsDelete ? 1 : 0
        });
        setContentIntro(Data.ContentIntro);
        setContentDetail(Data.ContentDetail);
    };
    //#endregion

    const columns = [
        {
            Header: "STT",
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 40,
            filterable: false,
            special: true,
            show: true,
            className: "text-center"
        },
        {
            Header: "Tùy chọn",
            Cell: ({ row }) => (
                <>
                    <button
                        type="button"
                        title="Sửa"
                        className="btn btn-secondary btn-sm m-1 btn-add"
                        onClick={(e) => Trl_spSetting_Edit(row)}
                    >
                        <i className="fa fa-edit"></i>
                    </button>
                    <button
                        type="button"
                        title="Xóa"
                        className="btn btn-danger btn-sm m-1 btn-add"
                        onClick={(e) => CMS_spCategoryContent_Delete(row)}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </>
            ),
            width: 150,
            filterable: false,
            className: "text-center"
        },
        {
            Header: "Tên danh mục",
            accessor: "ContentName",
            className: "text-center"
        },
        {
            Header: "Danh mục menu",
            accessor: "CategoriesName",
            className: "text-center"
        },
        {
            Header: "Hình ảnh thực tế",
            accessor: "ImageFeedback",
            filterable: false,
            className: "text-center",
            Cell: ({ row }) => {
                return (
                    <>
                        {row.ImageFeedback !== undefined && row.ImageFeedback !== "" && row.ImageFeedback !== null ? (
                            row._original.ImageFeedback.split(",").map((img, index) => {
                                return (<>
                                    {img !== "" && <span
                                        className="cursor"
                                        data-toggle="modal"
                                        data-target="#modalImg"
                                        title="Click để xem hình lớn"
                                        key={index} // Add key prop to resolve the unique key warning
                                    >
                                        <img src={IMAGES_DOMAIN + img} width="30" alt="" /> {/* Add alt attribute */}
                                    </span>}
                                </>
                                );
                            })
                        ) : null}
                    </>
                );
            },
        },
        {
            Header: "Người tạo",
            accessor: "CreateName",
            className: "text-center"
        },
        {
            Header: "Người sửa",
            accessor: "EditName",
            className: "text-center"
        },
    ];
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
    return (
        <div className="content-wrapper">
            <div className="card">
                <div className="card-header">
                    <span className="HomeTitle">
                        Quản lý danh mục
                    </span>
                    <div className="float-right">
                        <button
                            onClick={(e) => {
                                VideAdd();
                                ClearForm();
                                setContentIntro([]);
                                setContentDetail([]);
                                setFileUpload([]);
                            }}
                            type="button"
                            class="btn btn-sm btn-success pull-right margin-left-5"
                            style={{ marginTop: "-7px" }}
                        >
                            <i class="fa fa-plus pr-2"></i>
                            Thêm danh mục
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="col-md-12 mb-3">
                        <DataTable data={ListData} columns={columns} fixedColumns="true" />
                    </div>
                </div>
            </div>

            {/* Module add */}
            <Modal
                show={modalIsOpen}
                onHide={closeModal}
                className=" custom-modal-w-90"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header className="p-2">
                    <Modal.Title id="example-custom-modal-styling-title">
                        <div className="">
                            {FromValue.contentId === 0
                                ? "Thêm mới danh mục"
                                : "Chỉnh sửa danh mục"}
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
                    <div className="card-body p-0">
                        <div className="row">
                            <div className="col-md-6">
                                <span className="small font-weight-bold text-muted">
                                    Hình ảnh thực tế<span className="text-danger">(jpg, jpeg, png || Có thể thêm nhiều ảnh)</span>
                                </span>
                                <ImgMutilUpload
                                    onImageUpload={(e) => setFileUpload(e)}
                                    onData={(e) => setFromValue({ ...FromValue, ImageFeedback: e })}
                                    data={FromValue.ImageFeedback}
                                    isMutil={true}
                                />
                            </div>
                            <div className="col-md-6 mt-2">
                                <div className="form-group">
                                    <label className="no-absolute custom-label">
                                        Danh mục menu{" "}
                                        <span className="text-danger">(*)</span>
                                    </label>
                                    <SelectMenu
                                        Id={FromValue.CategoriesId}
                                        onSelected={(e) => {
                                            setFromValue({
                                                ...FromValue,
                                                CategoriesId: e?.value,
                                                CategoriesName: e?.label
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <span className="small font-weight-bold text-muted">
                                    Giới thiệu tour
                                </span>
                                <MyEditor
                                    values={ContentIntro}
                                    onChange={(e) => {
                                        setContentIntro(e);
                                    }}>
                                </MyEditor>
                            </div>
                            <div className="col-md-12 mt-4">
                                <span className="small font-weight-bold text-muted">
                                    Mô tả chi tiết
                                </span>
                                <MyEditor
                                    values={ContentDetail}
                                    onChange={(e) => {
                                        setContentDetail(e);
                                    }}>
                                </MyEditor>
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
                                    onClick={CMS_spCategoryContent_Save}
                                >
                                    <i className="fa fa-save pr-2"></i>
                                    {FromValue.contentId === 0 ? "Lưu" : "Chỉnh sửa"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
};
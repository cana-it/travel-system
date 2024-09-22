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
import { SelectMenu } from "../../../Common/CMS/SelectMenu";
export const Sites = () => {
    const CreateBy = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    useEffect((e) => {
        Trl_spSiteManagement_List()
    }, []);
    const dispatch = useDispatch();
    const [FromValue, setFromValue] = useState({
        SitesId: 0,
        SiteName: "",
        ParentId: "",
        ParentName: "",
        SiteImage: "",
        IsDelete: 0
    });
    const [ParentId, setParentId] = useState(0);
    const [ListData, setListData] = useState([]);
    const [FileUpload, setFileUpload] = useState([]);
    const ClearForm = () => {
        setFromValue({
            SitesId: 0,
            SiteName: "",
            ParentId: "",
            ParentName: "",
            SiteImage: "",
        });
        setFileUpload([]);
    };

    //#region Save
    const Trl_spSiteManagement_Save = async () => {
        
        try {
            // HÌNH ẢNH THỰC TẾ
            let _newListImage = "";
            if (FileUpload.length > 0) {
                //addFormImageUpload
                const newListImage = await FormImageUpload(FileUpload, "Euro_Travel", dispatch);
                _newListImage = [newListImage, FromValue?.SiteImage || ""].join(",");

            } else if (typeof FileUpload === 'string' || FileUpload.length === 0) {
                _newListImage = FromValue.SiteImage
            } else if (!_newListImage) {
                Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
                return;
            }

            const params = {
                Json: JSON.stringify({
                    SitesId: FromValue.SitesId,
                    SiteName: FromValue?.SiteName,
                    ParentId: FromValue?.ParentId,
                    ParentName: FromValue?.ParentName,
                    SiteImage: _newListImage?.trim(),
                    Creater: CreateBy,
                    CreateName: CreateName
                }),
                func: "Trl_spSiteManagement_Save",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                setIsOpen(false);
                Trl_spSiteManagement_List();
                return;
            }
            if (result.Status === "NOTOK") {
                Alertwarning(result.ReturnMess);
                return;
            } else {
                ListData.map((e) => {
                    if (e.SitesId === FromValue.SitesId) {
                        e.SiteName = FromValue.SiteName;
                        e.ParentId = FromValue.ParentId;
                        e.ParentName = FromValue.ParentName;
                        e.SiteImage = _newListImage;
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
    const Trl_spSiteManagement_List = async () => {
        try {
            setListData([]);
            const pr = {
                SitesId: 0,
                ParentId: ParentId
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spSiteManagement_List",
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
    const Trl_spSiteManagement_Delete = (item) => {
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
                        Trl_spSiteManagement_Delete_Action(props.item);
                    }}
                >
                    <i className="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    };
    const Trl_spSiteManagement_Delete_Action = async (item) => {
        try {
            const pr = {
                SitesId: item._original.SitesId,
                IsDelete: 1,
            };

            const params = {
                Json: JSON.stringify(pr),
                func: " Trl_spSiteManagement_Delete",
            };

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spSiteManagement_List();
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
    const Trl_spSiteManagement_Edit = (item, key) => {
        setIsOpen(true);
        let Data = item._original;
        setFromValue({
            SitesId: Data.SitesId,
            SiteName: Data.SiteName,
            ParentId: Data.ParentId,
            ParentName: Data.ParentName,
            ContentDetail: Data.ContentDetail,
            SiteImage: Data.SiteImage,
            Editor: CreateBy,
            EditName: CreateName,
            IsDelete: Data.IsDelete ? 1 : 0
        });
    };
    //#endregion

    //#region 
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
                        onClick={(e) => Trl_spSiteManagement_Edit(row)}
                    >
                        <i className="fa fa-edit"></i>
                    </button>
                    <button
                        type="button"
                        title="Xóa"
                        className="btn btn-danger btn-sm m-1 btn-add"
                        onClick={(e) => Trl_spSiteManagement_Delete(row)}
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
            Header: "Tên địa danh",
            accessor: "SiteName",
            className: "text-center"
        },
        {
            Header: "Danh mục menu",
            accessor: "ParentName",
            className: "text-center"
        },
        {
            Header: "Hình ảnh",
            accessor: "SiteImage",
            filterable: false,
            className: "text-center",
            Cell: ({ row }) => {
                return (
                    <>
                        {row.SiteImage !== undefined && row.SiteImage !== "" && row.SiteImage !== null ? (
                            row._original.SiteImage.split(",").map((img, index) => {
                                return (<>
                                    {img !== "" && (
                                        <a
                                            href="/"
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
                                                alt=""
                                            />{" "}
                                            {/* Add alt attribute */}
                                        </a>
                                    )}
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
            Header: "Ngày tạo",
            accessor: "CreateOn",
            className: "text-center"
        },
        {
            Header: "Người sửa",
            accessor: "EditName",
            className: "text-center"
        },
        {
            Header: "Ngày sửa",
            accessor: "EditOn",
            className: "text-center"
        }
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
                        Quản lý địa danh nổi bật
                    </span>
                    <div className="float-right">
                        <button
                            onClick={(e) => {
                                VideAdd();
                                ClearForm();
                                setFileUpload([]);
                            }}
                            type="button"
                            class="btn btn-sm btn-success pull-right margin-left-5"
                            style={{ marginTop: "-7px" }}
                        >
                            <i class="fa fa-plus pr-2"></i>
                            Thêm địa danh
                        </button>
                        <button
                            onClick={(e) => {
                                Trl_spSiteManagement_List();
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
                                    onSelected={(e) => setParentId(e.value)}
                                    items={ParentId}
                                />
                            </div>
                        </div>
                    </div>
                    {ViewImg}
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
                            {FromValue.SitesId === 0
                                ? "Thêm mới địa danh"
                                : "Chỉnh sửa địa danh"}
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
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Tên địa danh <span className="text-danger">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.SiteName}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, SiteName: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Danh mục menu <span className="text-danger">(*)</span>
                                    </label>
                                    <SelectMenu
                                        Id={FromValue.ParentId}
                                        onSelected={(e) => {
                                            setFromValue({
                                                ...FromValue,
                                                ParentId: e?.value,
                                                ParentName: e?.label
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <span className="small font-weight-bold text-muted">
                                    Upload hình ảnh<span className="text-danger">(jpg, jpeg, png || Có thể thêm nhiều ảnh)</span>
                                </span>
                                <ImgMutilUpload
                                    onImageUpload={(e) => setFileUpload(e)}
                                    onData={(e) => setFromValue({ ...FromValue, SiteImage: e })}
                                    data={FromValue.SiteImage}
                                    isMutil={true}
                                />
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
                                    onClick={Trl_spSiteManagement_Save}
                                >
                                    <i className="fa fa-save pr-2"></i>
                                    {FromValue.SitesId === 0 ? "Lưu" : "Chỉnh sửa"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
};
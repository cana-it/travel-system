import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { confirmAlert } from "react-confirm-alert";
import { SelectTrademark } from "../../../Common/SelectTrademark";
import { SelectGuarantee } from "../../../Common/SelectGuarantee";
import { SelectCategory } from "../../../Common/SelectCategory";
import { DataTable } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import { IMAGES_DOMAIN } from "../../../Services";
import { Alerterror, Alertsuccess, FormatDateJson } from "../../../Utils";
export const ProductManagement = () => {
    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const [Data, setData] = useState([]);
    const [TrademarkId_List, setTrademarkId_List] = useState(0);
    const [CategoryId_List, setCategoryId_List] = useState(0);
    const [ProductSearch, setProductSearch] = useState("");
    const [ProductId, setProductId] = useState(0);
    const [ProductName, setProductName] = useState("");
    const [CategoryId, setCategoryId] = useState(0);
    const [TrademarkId, setTrademarkId] = useState(0);
    const [GuaranteeId, setGuaranteeId] = useState(0);
    const [Price, setPrice] = useState("");
    const [Describe, setDescribe] = useState("");
    const [ProductDescription, setProductDescription] = useState("");
    const [ProductDetails, setProductDetails] = useState("");
    const [ProductSummary, setProductSummary] = useState("");
    const [Avatar, setAvatar] = useState("");
    const [MetaTitle, setMetaTitle] = useState("");
    const [MetaKeyword, setMetaKeyword] = useState("");
    const [MetaDescription, setMetaDescription] = useState("");
    const [FileUpload, setFileUpload] = useState("");
    const [DepartMulti, setDepartMulti] = useState([]);
    const [modalIsOpenPass, setmodalIsOpenPass] = useState(false);

    const VideAdd = () => {
        openModal();
    };
    const Cancel = () => {
        setProductId(0);
        setProductName("");
        setCategoryId(0);
        setTrademarkId(0);
        setGuaranteeId(0);
        setPrice("");
        setDescribe("");
        setProductDescription("");
        setProductSummary("");
        setAvatar("");
        setMetaTitle("");
        setMetaKeyword("");
        setMetaDescription("");
        setFileUpload("");
    };

    const Product_List = async (CategoryId, TrademarkId, Keys) => {
        try {
            const pr = {
                // DepartmentId:'0',
                TrademarkId: Keys === 1 ? TrademarkId : TrademarkId_List,
                CategoryId: 0,
                ProductSearch: ProductSearch,
                ProductId: 0,
                Creater: Creater,
            };

            const params = {
                Json: JSON.stringify(pr),
                func: "Product_List",
            };

            const list = await mainAction.API_spCallServer(params, dispatch);
            setData(list);
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
            ;
        }
    };

    const Product_Save = async () => {
        let FollowIds = "";
        if (
            DepartMulti.length > 0 &&
            DepartMulti !== "" &&
            DepartMulti !== undefined &&
            DepartMulti !== []
        ) {
            DepartMulti.forEach((item, index) => {
                FollowIds += item.value + ";";
            });
        } else FollowIds = "Chưa thêm sản phẩm nào";
    };

    let avt = "";
    if (FileUpload !== "" && FileUpload.name !== undefined) {
        const formData = new FormData();
        formData.append("myFile", FileUpload);
        formData.append("Key", "Avatar");
        const data = mainAction.API_spCallPostFile(formData, dispatch);
        let _imgavt = data.Message.replaceAll('"', "");
        avt = _imgavt.replace("[", "").replace("]", "");
    }

    const [IsAcctive2, setIsAcctive2] = useState(false);
    const onFileChange = (event) => {
        setFileUpload(event.target.files[0]);
        setAvatar(URL.createObjectURL(event.target.files[0]));
    };
    const Product_View = (item) => {
        const obView = item._original;
        setProductName(obView.ProductName);
        setCategoryId(obView.CategoryId);
        setTrademarkId(obView.TrademarkId);
        setGuaranteeId(obView.GuaranteeId);
        setPrice(obView.Price);
        setDescribe(obView.Describe);
        setProductDescription(obView.ProductDescription);
        setProductSummary(obView.ProductSummary);
        setAvatar(obView.Avatar);
        setMetaTitle(obView.MetaTitle);
        setMetaKeyword(obView.MetaKeyword);
        setMetaDescription(obView.MetaDescription);
    };

    const Product_Delete = (item) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return <ConfirmAlertUi onClose={onClose} item={item} />;
            },
        });
    };

    const Product_Delete_Action = async (item) => {
        try {
            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                ProductId: item._original.StaffId,
            };

            const params = {
                Json: JSON.stringify(pr),
                func: "Product_Delete",
            };

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Product_List();
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

    const ConfirmAlertUi = (props) => {
        return (
            <div className="card-body border-left-red">
                <h3>Xác nhận xóa dữ liệu!</h3>
                <p>
                    Bạn có chắc chắn muốn xóa{" "}
                    <strong>{props.item._original.StaffName}</strong>{" "}
                </p>
                <button className="btn btn-small btn-warning" onClick={props.onClose}>
                    {" "}
                    <i class="fa fa-undo"> </i> Hủy
                </button>
                <button
                    className="btn btn-small btn-danger margin-left-5"
                    onClick={() => {
                        props.onClose();
                        Product_Delete_Action(props.item);
                    }}
                >
                    <i class="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    };
    let data = [
        {
            ProductImage: '1234567890',
            ProductCode: '12345',
            ProductName: 'hfuiqhf',
            Category: 'dvbja',
            Trademark: 'skjnk',
            Outstanding: 'nksnk',
            New: 'ksldmk',
            Presently: '214242',
            MetaTitle: '363',
            MetaKeyword: 'f193y9',
            CreateName: 'jksnkn',
            DateCreated: '10400',
            Repairer: 'ndqdm',
            ModificationDate: '98919'
        },
        {
            ProductImage: '989352',
            ProductCode: '91849',
            ProductName: 'bjabjd',
            Category: 'jbjdan',
            Trademark: 'hưuir',
            Outstanding: 'bvja',
            New: '49190',
            Presently: '393990',
            MetaTitle: '91492',
            MetaKeyword: '10349',
            CreateName: 'jfdkjnv',
            DateCreated: '1394',
            Repairer: 'nfsknk',
            ModificationDate: '19194'
        },
    ]

    const [modalIsOpen, setIsOpen] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    };
    const closeModal = () => {
        setIsOpen(false);
        setmodalIsOpenPass(false);
    };
    const columns = [
        {
            Header: 'Tùy chọn',
            accessor: 'Edit',
            Cell: ({ row }) => (
                <div>

                    <button
                        type="button"
                        title="Sửa"
                        className="btn btn-success btn-sm m-1 btn-add"
                        onClick={(e) => Product_View(row)}
                    >
                        <i className="fa fa-eye"></i>
                    </button>

                    <button
                        type="button"
                        title="Xóa"
                        className="btn btn-danger btn-sm m-1 btn-add"
                        onClick={(e) => Product_Delete(row)}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            ),
        },
        {
            Header: 'Thứ tự',
            accessor: 'Ordinal'
        },
        {
            Header: 'Hình ảnh sản phẩm',
            accessor: 'ProductImage',
            Cell: (obj) => (
                <div className="direct-chat-msg">
                    <img
                        className="direct-chat-img"
                        src={IMAGES_DOMAIN + obj.value}
                        alt="message user image"
                    />
                </div>
            ),
        },
        {
            Header: 'Mã sản phẩm',
            accessor: 'ProductCode'
        },
        {
            Header: 'Tên sản phẩm',
            accessor: 'ProductName'
        },
        {
            Header: 'Danh mục',
            accessor: 'Category'
        },
        {
            Header: 'Thương hiệu',
            accessor: 'Trademark'
        },
        {
            Header: 'Nổi bật',
            accessor: 'Outstanding'
        },
        {
            Header: 'Mới',
            accessor: 'New'
        },
        {
            Header: 'Hiện',
            accessor: 'Presently'
        },
        {
            Header: 'Meta Title',
            accessor: 'MetaTitle'
        },
        {
            Header: 'Meta Keyword',
            accessor: 'MetaKeyword'
        },
        {
            Header: 'Người tạo',
            accessor: 'CreateName'
        },
        {
            Header: 'Ngày tạo',
            accessor: 'DateCreated',
            Cell: (obj) => (obj?.value ? FormatDateJson(obj.value, 10) : ""),
        },
        {
            Header: 'Người sửa',
            accessor: 'Repairer'
        },
        {
            Header: 'Ngày sửa',
            accessor: 'ModificationDate',
            Cell: (obj) => (obj?.value ? FormatDateJson(obj.value, 10) : ""),
        },

    ]

    return (
        <div className="content-wrapper">
            <div className="card">
                <div className="card-header">
                    <span className="HomeTitle">
                        Quản lý sản phẩm
                    </span>
                    <div className="float-right">
                        <button
                            onClick={(e) => {
                                VideAdd();
                            }}
                            type="button"
                            class="btn btn-sm btn-success pull-right margin-left-5"
                            style={{ marginTop: "-7px" }}
                        >
                            <i class="fa fa-plus pr-2"></i>
                            Thêm sản phẩm
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="col-md-12 mb-3">
                        <DataTable data={data} columns={columns} fixedColumns="true" />
                    </div>
                </div>
            </div>

            {/* Module Add */}
            <Modal
                show={modalIsOpen}
                onHide={closeModal}
                className=" custom-modal-w-90"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header className="p-2">
                    <Modal.Title id="example-custom-modal-styling-title">
                        <div class="">
                            {ProductId === 0
                                ? "Thêm mới sản phẩm"
                                : "Chỉnh sửa thông tin sản phẩm " + ProductName}
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
                    <div class="card-body p-0">
                        <div class="row">
                            <div className="col-md-12 m-auto">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">
                                        Tên sản phẩm
                                        <strong className="check-point">(*)</strong>
                                    </span>
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={ProductName}
                                        onChange={(e) => setProductName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12 m-auto">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">
                                        Danh mục sản phẩm<strong className="check-point">(*)</strong>
                                    </span>
                                    <SelectCategory
                                        onSelected={(item) => setCategoryId(item.value)}
                                        CategoryId={-1}
                                        onCategoryId={CategoryId}
                                        className="select-custom"
                                    />
                                </div>
                            </div>
                            <div className="col-md-12 m-auto">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">
                                        Thương hiệu<strong className="check-point">(*)</strong>
                                    </span>
                                    <SelectTrademark
                                        onSelected={(item) => setTrademarkId(item.value)}
                                        TrademarkId={-1}
                                        onTrademarkId={TrademarkId}
                                        className="select-custom"
                                    />
                                </div>
                            </div>
                            <div className="col-md-12 m-auto">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">
                                        Bảo hành<strong className="check-point">(*)</strong>
                                    </span>
                                    <SelectGuarantee
                                        onSelected={(item) => setGuaranteeId(item.value)}
                                        GuaranteeId={-1}
                                        onGuaranteeId={GuaranteeId}
                                        className="select-custom"
                                    />
                                </div>
                            </div>

                            <div className="col-md-12 m-auto">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">
                                        Giá bán
                                    </span>
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={Price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12 m-auto">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">
                                        Mô tả
                                    </span>
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={Describe}
                                        onChange={(e) => setDescribe(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12 m-auto">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">
                                        Mô tả sản phẩm
                                    </span>
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={ProductDescription}
                                        onChange={(e) => setProductDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12 m-auto">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">
                                        Chi tiết sản phẩm
                                    </span>
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={ProductDetails}
                                        onChange={(e) => setProductDetails(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12 m-auto">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">
                                        Tóm tắt sản phẩm
                                    </span>
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={ProductSummary}
                                        onChange={(e) => setProductSummary(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div class="col-md-12 m-auto">
                                <div className="row">
                                    <div className="form-collapse-default mt-4">
                                        <div className="row">
                                            <a className="form-collapse-link text-uppercase">
                                                Banner sản phẩm
                                                <span className="form__title__note"> (yêu cầu 1 hình size 200x200, dung lượng dưới 100kb)</span>
                                            </a>
                                        </div>
                                        {IsAcctive2 ? (
                                            ""
                                        ) : (
                                            <div className="row">
                                                <div className="col-md-12 pb-3">
                                                    {Avatar ? (
                                                        <label class="image-collapse-label">
                                                            <input
                                                                type="file"
                                                                className="image-collapse-file"
                                                                onChange={onFileChange}
                                                                accept="image/*"
                                                            />
                                                            <img
                                                                src={Avatar === "" ? "" : Avatar}
                                                                className="image-collapse-image"
                                                                onChange={onFileChange}
                                                                alt="ProductBanner"
                                                            />
                                                        </label>
                                                    ) : (
                                                        <label class="image-collapse-label">
                                                            <input
                                                                type="file"
                                                                className="image-collapse-file"
                                                                onChange={onFileChange}
                                                                accept="image/*"
                                                            />
                                                            <i className="fa fa-camera upload-file-btn"></i>
                                                            <span className="image-collapse-span">
                                                                Upload images
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12 m-auto">
                                <div className="row">
                                    <div className="form-collapse-default mt-4">
                                        <div className="row">
                                            <a className="form-collapse-link text-uppercase">
                                                Tất cả hình ảnh sản phẩm
                                                <span className="form__title__note"></span>
                                            </a>
                                        </div>
                                        {IsAcctive2 ? (
                                            ""
                                        ) : (
                                            <div className="row">
                                                <div className="col-md-12 pb-3">
                                                    {Avatar ? (
                                                        <label class="image-collapse-label">
                                                            <input
                                                                type="file"
                                                                className="image-collapse-file"
                                                                onChange={onFileChange}
                                                                accept="image/*"
                                                            />
                                                            <img
                                                                src={Avatar === "" ? "" : Avatar}
                                                                className="image-collapse-image"
                                                                onChange={onFileChange}
                                                                alt="AllImages"
                                                            />
                                                        </label>
                                                    ) : (
                                                        <label class="image-collapse-label">
                                                            <input
                                                                type="file"
                                                                className="image-collapse-file"
                                                                onChange={onFileChange}
                                                                accept="image/*"
                                                            />
                                                            <i className="fa fa-camera upload-file-btn"></i>
                                                            <span className="image-collapse-span">
                                                                Upload images
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 m-auto">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">Meta title</span>
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={MetaTitle}
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12 m-auto">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">Meta keyword</span>
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={MetaKeyword}
                                        onChange={(e) => setMetaKeyword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12 m-auto">
                                <div class="form-group">
                                    <span class="small font-weight-bold text-muted">Meta description</span>
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={MetaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12 mt-2">
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
                                    onClick={Product_Save}
                                >
                                    <i class="fa fa-edit pr-2"></i>
                                    {ProductId === 0 ? " Thêm mới" : "Chỉnh sửa"}
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
        </div>
    );
};
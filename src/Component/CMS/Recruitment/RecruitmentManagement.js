import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { confirmAlert } from "react-confirm-alert";
import { DataTable } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import { IMAGES_DOMAIN } from "../../../Services";
import {
    Alerterror,
    Alertsuccess,
    ConvertUTCDateToLocalDate,
    FormatDateJson,
} from "../../../Utils";
import DateTimePicker from "react-datetime-picker";
import Select from "react-select";
import { MyEditor } from "../../../Common/CMS/MyEditor";
import { ImgMutilUpload } from "../../../Common/CMS/ImgMutilUpload";
import FormImageUpload from "../../../Common/CMS/FormImageUpload";
import { useDispatch } from "react-redux";
export const RecruitmentManagement = () => {
    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const IsHide = localStorage.getItem("IsHide");
    const [IsToDate, setIsToDate] = useState();
    const [Data, setData] = useState([]);
    const [Id, setId] = useState(0);
    const [ParentId, setParentId] = useState(0);
    const [TitleRecruitment, setTitleRecruitment] = useState("");
    const [ShortContent, setShortContent] = useState("");
    const [ToDate, setToDate] = useState("");
    const [SalaryLevel, setSalaryLevel] = useState("");
    const [Address, setAddress] = useState("");
    const [Quantity, setQuantity] = useState("");
    const [WorkingForm, setWorkingForm] = useState("");
    const [RecruitmentLevel, setRecruitmentLevel] = useState("");
    const [InternshipPeriod, setInternshipPeriod] = useState("");
    const [WorkExperience, setWorkExperience] = useState("");
    const [DegreeRequired, setDegreeRequired] = useState("");
    const [FileUpload, setFileUpload] = useState("");
    const [ListData, setListData] = useState([]);
    const [Status, setStatus] = useState([]);
    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const [FromValue, setFromValue] = useState({
        Id: 0,
        ParentId: { value: 0, label: "Vui lòng chọn" },
        TitleRecruitment: "",
        ShortContent: "",
        ToDate: "",
        SalaryLevel: "",
        Address: "",
        Quantity: "",
        WorkingForm: "",
        RecruitmentLevel: "",
        InternshipPeriod: "",
        WorkExperience: "",
        DegreeRequired: "",
        Image: "",
        IndexNumber: 0,
        IsHide: 0,
        IsDelete: 0,
        ChangeParentId: 0,
    });
    const replaceList = ListData.map((elem) => ({
        value: elem.Id,
        label: elem.TitleRecruitment,
    }));
    const parentMenu = [{ value: 0, label: "Vui lòng chọn" },...replaceList];

    const [SearchValue, setSearchValue] = useState({
        ToDate: new Date(),
        TitleRecruitment: "",
    });
    const [Value, setValue] = useState({
        Image: "",
        Document: "",
    });
    const [valueType, setValueType] = useState({ value: 'img', label: 'Hình ảnh' });
    const optionSelect = [
        { value: 'img', label: 'Hình ảnh' },
    ];
    const [TypeSetting, setTypeSetting] = useState('img');
    const onTypeRecept = (item) => {
        setValueType(item);
        setTypeSetting(item.value);
    }

    useEffect(() => {
        CMS_spRecruitment_List();
    }, []);

    const onToDate = (item) => {
        setIsToDate(item);
        setToDate(FormatDateJson(item));
    };

    const ClearForm = () => {
        setTypeSetting('img')
        setValueType({ value: 'img', label: 'Hình ảnh' });
        setFromValue({
            Id: 0,
            ParentId: { value: 0, label: "Vui lòng chọn" },
            TitleRecruitment: "",
            ShortContent: "",
            ToDate: "",
            SalaryLevel: "",
            Address: "",
            Quantity: "",
            WorkingForm: "",
            RecruitmentLevel: "",
            InternshipPeriod: "",
            WorkExperience: "",
            DegreeRequired: "",
            Image: "",
            IndexNumber: 0,
            IsHide: 0,
            IsDelete: 0,
            ChangeParentId: 0,
        });
        setValue({
            Image: "",
            Document: "",
        })
        setFileUpload([]);
    };


    const Cancel = () => {
        setId(0);
        setParentId(0);
        setTitleRecruitment("");
        setShortContent("");
        setToDate("");
        setSalaryLevel("");
        setAddress("");
        setQuantity("");
        setWorkingForm("");
        setRecruitmentLevel("");
        setInternshipPeriod("");
        setWorkExperience("");
        setDegreeRequired("");
        setFileUpload("");
    };

    const CMS_spRecruitment_List = async () => {
        try {
            setListData([]);
            setDisable2(false);
            const pr = {
                TitleRecruitment: SearchValue.TitleRecruitment?.trim(),
                Id: 0,
                ToDate: FormatDateJson(SearchValue.ToDate, 10),
                Creater: Creater,
            };

            const params = {
                Json: JSON.stringify(pr),
                func: "CMS_spRecruitment_List",
            };

            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.length > 0) {
                setData(list);
                setListData(list);
                setDisable2(true);
            }
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
            ;
            setDisable2(true);
        }
    };

    const CMS_spRecruitment_Save = async () => {
        
        try {
            setDisable(false);
            let _newListImage = "";
            if (FileUpload.length > 0) {
                const newListImage = await FormImageUpload(FileUpload, "Main", dispatch);
                _newListImage = [newListImage, FromValue?.Image || ""].join(",");
            }
            else if (typeof FileUpload === 'string' || FileUpload.length === 0) {
                _newListImage = FromValue.Image;
            }
            else if (!_newListImage) {
                Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
                setDisable(true);
                return;
            }

            let Image = '';
            if (valueType.value === 'img') {
                Image = _newListImage
            }
            else if (valueType.value === 'doc') {
                Image = Value.Document
            }

            const params = {
                Json: JSON.stringify({
                    Id: Id,
                    ParentId: FromValue.ParentId,
                    ParentName: FromValue.ParentName,
                    TitleRecruitment: TitleRecruitment,
                    ShortContent: ShortContent,
                    ToDate: ToDate,
                    SalaryLevel: SalaryLevel,
                    Address: Address,
                    Quantity: Quantity,
                    WorkingForm: WorkingForm,
                    RecruitmentLevel: RecruitmentLevel,
                    InternshipPeriod: InternshipPeriod,
                    WorkExperience: WorkExperience,
                    DegreeRequired: DegreeRequired,
                    Image: _newListImage,
                    TypeSetting: TypeSetting,
                }),
                func: "CMS_spRecruitment_Save",
            };
            setDisable(true);
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Cancel();
                setIsOpen(false);
                setListData(ListData);
                return;
            }
            if (result.Status === "NOTOK") {
                Alerterror(result.ReturnMess);
                setDisable2(true);
                return;
            } else {
                const timeConfirm = new Date();
                ListData.map((e) => {
                    if (e.Id === FromValue.Id) {
                        e.ParentId = FromValue.ParentId === 0 ? "" : FromValue.ParentId;
                        e.ParentName = FromValue.ParentName;
                        e.TitleRecruitment = FromValue.TitleRecruitment;
                        e.ShortContent = FromValue.ShortContent;
                        e.ToDate = FromValue.ToDate;
                        e.SalaryLevel = FromValue.SalaryLevel;
                        e.Address = FromValue.Address;
                        e.Quantity = FromValue.Quantity;
                        e.WorkingForm = FromValue.WorkingForm;
                        e.RecruitmentLevel = FromValue.RecruitmentLevel;
                        e.InternshipPeriod = FromValue.InternshipPeriod;
                        e.WorkExperience = FromValue.WorkExperience;
                        e.DegreeRequired = FromValue.DegreeRequired;
                        e.Image = _newListImage;
                        e.TypeSetting = TypeSetting;
                        e.IsHide = FromValue.IsHide;
                        e.IsDelete = FromValue.IsDelete;
                        e.EditOn = FormatDateJson(timeConfirm);
                        e.TypeSettingName = valueType?.label
                    }
                    return e;
                });
                setListData(ListData);
                Alertsuccess(result.ReturnMess);
                ClearForm();
                setDisable2(true);
            }
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
            setDisable2(true);
        }
    };

    const Recruitment_View = (item) => {
        setIsOpen(true);
        const obView = item._original;
        setId(obView.Id);
        setParentId(obView.ParentId);
        setTitleRecruitment(obView.TitleRecruitment);
        setShortContent(obView.ShortContent);
        setToDate(obView.ToDate);
        setSalaryLevel(obView.SalaryLevel);
        setAddress(obView.Address);
        setQuantity(obView.Quantity);
        setWorkingForm(obView.WorkingForm);
        setRecruitmentLevel(obView.RecruitmentLevel);
        setInternshipPeriod(obView.InternshipPeriod);
        setWorkExperience(obView.WorkExperience);
        setDegreeRequired(obView.DegreeRequired);
        setFromValue({
            Id: obView.Id,
            ParentId: obView.ParentId,
            ParentName: obView.ParentName,
            TitleRecruitment: obView.TitleRecruitment,
            ShortContent: obView.ShortContent,
            ToDate: obView.ToDate,
            SalaryLevel: obView.SalaryLevel,
            Address: obView.Address,
            Quantity: obView.Quantity,
            WorkingForm: obView.WorkingForm,
            RecruitmentLevel: obView.RecruitmentLevel,
            InternshipPeriod: obView.InternshipPeriod,
            WorkExperience: obView.WorkExperience,
            DegreeRequired: obView.DegreeRequired,
            Image: obView.Image,
            From: obView.From,
            IndexNumber: 0,
            IsHide: obView.IsHide ? 1 : 0,
            IsDelete: obView.IsDelete ? 1 : 0,
            TypeSetting: obView.TypeSetting,
        });
        setValue({
            Image: obView.Image,
            Document: obView.DataSetting
        })
        if (obView.TypeSetting === 'img') {
            setTypeSetting('img');
        }
        setValueType({ value: item._original.TypeSetting, label: item._original.TypeSettingName })

        if (obView.ToDate !== undefined) {
            let td = ConvertUTCDateToLocalDate(new Date(obView.ToDate));
            setToDate(FormatDateJson(td));
            setIsToDate(td);
        }
    };

    const CMS_spRecruitment_Delete = (item) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return <ConfirmAlertUi onClose={onClose} item={item} />;
            },
        });
    };

    const CMS_spRecruitment_Delete_Action = async (item) => {
        try {
            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                Id: item._original.Id,
            };

            const params = {
                Json: JSON.stringify(pr),
                func: " CMS_spRecruitment_Delete",
            };

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                CMS_spRecruitment_List();
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
                    <strong>{props.item._original.MenuName}</strong>{" "}
                </p>
                <button className="btn btn-small btn-warning" onClick={props.onClose}>
                    {" "}
                    <i class="fa fa-undo"> </i> Hủy
                </button>
                <button
                    className="btn btn-small btn-danger margin-left-5"
                    onClick={() => {
                        props.onClose();
                        CMS_spRecruitment_Delete_Action(props.item);
                    }}
                >
                    <i class="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    };

    const CMS_spRecruitment_Hide = async (item) => {
        const pr = {
            Creater: Creater,
            CreateName: CreateName,
            Id: item._original.Id,
        };

        const params = {
            Json: JSON.stringify(pr),
            func: "CMS_spRecruitment_Hide",
        };
        const result = await mainAction.API_spCallServer(params, dispatch);
        Alertsuccess(result.ReturnMess);
        let newData = Data.map((x) => {
            if (x.Id === item._original.Id) {
                return { ...x, IsHide: !x.IsHide };
            }
            return x;
        });
        setData(newData);
    };

    const CMS_spRecruitment_ChangeIndex = async (item, key) => {
        try {
            let Data = item.row._original,
                _IndexNumber = 0;
            if (key === "down") {
                _IndexNumber = Data.IndexNumber - 1;
            } else {
                _IndexNumber = Data.IndexNumber + 1;
            }
            setDisable2(false);
            const params = {
                Json: JSON.stringify({
                    Id: Data.Id,
                    IndexNumber: _IndexNumber,
                }),
                func: "CMS_spRecruitment_ChangeIndex",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                ListData.map((e) => {
                    if (e.Id === Data.Id) {
                        e.IndexNumber = _IndexNumber;
                    }
                    return e;
                });
                setListData(ListData);
                setDisable2(true);
                return;
            }
            Alerterror(result.ReturnMess);
            setDisable2(true);
        } catch (error) {
            setDisable2(true);
            Alerterror("Lỗi, liên hệ IT");
        }
    };

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
    const columns = [
        {
            Header: "STT",
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 40,
            filterable: false,
            special: true,
            show: true,
        },
        {
            Header: "Tùy chọn",
            accessor: "Edit",
            Cell: ({ row }) => (
                <div>
                    <button
                        type="button"
                        title="Sửa"
                        className="btn btn-success btn-sm m-1 btn-add"
                        onClick={(e) => Recruitment_View(row)}
                    >
                        <i className="fa fa-eye"></i>
                    </button>

                    <button
                        type="button"
                        title="Xóa"
                        className="btn btn-danger btn-sm m-1 btn-add"
                        onClick={(e) => CMS_spRecruitment_Delete(row)}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            ),
        },
        {
            Header: "Ẩn Hiện",
            accessor: "IsHide",
            Cell: ({ row }) => (
                <div style={{ textAlign: "center" }}>
                    <>
                        <button
                            className={
                                row._original.IsHide
                                    ? "btn btn-xs btn-primary pr-2"
                                    : " btn btn-xs btn-warning pr-2"
                            }
                            onClick={(e) => CMS_spRecruitment_Hide(row)}
                        >
                            {" "}
                            <i
                                class={row._original.IsHide ? "fa fa-eye" : "fas fa-eye-slash"}
                            ></i>{" "}
                            {row._original.IsHide ? "Ẩn" : " Bỏ Ẩn"}
                        </button>{" "}
                    </>
                </div>
            ),
        },
        {
            Header: "Thứ tự",
            accessor: "IndexNumber",
            filterable: false,
            width: 120,
            Cell: ({ row }) => {
                return (
                    <>
                        <div className="d-flex justify-content-center ">
                            <div>
                                <button
                                    className="border-0"
                                    type="button"
                                    onClick={(e) => CMS_spRecruitment_ChangeIndex({ row }, "up")}
                                >
                                    <i class="fas fa-chevron-circle-up text-info"></i>
                                </button>
                            </div>
                            <span className="px-3">{row._original.IndexNumber} </span>
                            <div>
                                <button
                                    className="border-0"
                                    type="button"
                                    onClick={(e) => CMS_spRecruitment_ChangeIndex({ row }, "down")}
                                >
                                    <i class="fas fa-chevron-circle-down text-info"></i>
                                </button>
                            </div>
                        </div>
                    </>
                );
            },
        },
        {
            Header: "Hot",
            accessor: "Image",
            filterable: false,
            className: "text-center",
            Cell: ({ row }) => {
                return (
                    <>
                        {row.Image !== undefined && row.Image !== "" && row.Image !== null ? (
                            row._original.Image.split(",").map((img, index) => {
                                return (<>
                                    {img !== "" && <span
                                        className="cursor"
                                        data-toggle="modal"
                                        data-target="#modalImg"
                                        title="Click để xem hình lớn"
                                        key={index}
                                    >
                                        <img src={IMAGES_DOMAIN + img} width="30" />
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
            Header: "Tiêu đề tuyển dụng",
            accessor: "TitleRecruitment",
        },
        {
            Header: "Nội dung ngắn",
            accessor: "ShortContent",
        },
        {
            Header: "Hạn nộp hồ sơ",
            accessor: "ToDate",
            Cell: (obj) => (obj?.value ? FormatDateJson(obj.value, 10) : ""),
        },
        {
            Header: "Mức lương",
            accessor: "SalaryLevel",
        },
        {
            Header: "Địa điểm tuyển dụng",
            accessor: "Address",
        },
        {
            Header: "Số lượng tuyển dụng",
            accessor: "Quantity",
        },
        {
            Header: "Hình thức làm việc",
            accessor: "WorkingForm",
        },
        {
            Header: "Cấp bậc tuyển dụng",
            accessor: "RecruitmentLevel",
        },
        {
            Header: "Thời gian thử việc",
            accessor: "InternshipPeriod",
        },
        {
            Header: "Kinh nghiệm làm việc",
            accessor: "WorkExperience",
        },
        {
            Header: "Yều cầu bằng cấp",
            accessor: "DegreeRequired",
        },
        {
            Header: "Người tạo",
            accessor: "CreateName",
        },
        {
            Header: "Ngày tạo",
            accessor: "CreateOn",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
        {
            Header: "Người sửa",
            accessor: "EditName",
        },
        {
            Header: "Ngày sửa",
            accessor: "EditOn",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
    ];

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="header col-md-12">
                    <div className="row">
                        <div className="col-md-2"></div>

                        <div className="headerlink col-md-4">
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item">
                                        <a href="#">Trang chủ</a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">
                                        Quản Lý Tuyển Dụng
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        <div className="flex items-center gap-2 col-md-6">
                            <button
                                onClick={() => {
                                    VideAdd();
                                    ClearForm();
                                }}
                                type="button"
                                class="button btn btn-sm btn-primary float-right"
                            >
                                <i class="fa fa-plus pr-2"></i>
                                Thêm mới tuyển dụng
                            </button>
                        </div>

                        <Modal
                            show={modalIsOpen}
                            onHide={closeModal}
                            className=" custom-modal-w-90"
                            aria-labelledby="example-custom-modal-styling-title"
                        >
                            <Modal.Header className="p-2">
                                <Modal.Title id="example-custom-modal-styling-title">
                                    <div class="">
                                        {FromValue.Id === 0 ? "Thêm mới tuyển dụng" : "Sửa tin tuyển dụng"}
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
                                        <div className="col-xs-12 col-md-6 m-auto">
                                            <div class="form-group">
                                                <span class="small font-weight-bold text-muted">
                                                    Thương hiệu
                                                    <strong className="check-point">(*)</strong>
                                                </span>
                                                <Select
                                                    onChange={(e) => {
                                                        setFromValue({ ...FromValue, ParentId: e.value, ParentName: e.label });
                                                    }}
                                                    placeholder=""
                                                    options={parentMenu}
                                                    value={{ value: FromValue?.ParentId, label: FromValue?.ParentName }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-md-6 m-auto">
                                            <div class="form-group">
                                                <span class="small font-weight-bold text-muted">
                                                    Tiêu đề tuyển dụng
                                                    <strong className="check-point">(*)</strong>
                                                </span>
                                                <input
                                                    type="text"
                                                    class="form-control2"
                                                    value={TitleRecruitment}
                                                    onChange={(e) => setTitleRecruitment(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-md-6 m-auto">
                                            <div class="form-group">
                                                <span class="small font-weight-bold text-muted">
                                                    Nội dung ngắn<strong className="check-point">(*)</strong>
                                                </span>
                                                <input
                                                    type="text"
                                                    class="form-control2"
                                                    value={ShortContent}
                                                    onChange={(e) => setShortContent(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-md-6 m-auto">
                                            <div class="form-group">
                                                <span class="small font-weight-bold text-muted">
                                                    Hạn nộp hồ sơ<strong className="check-point">(*)</strong>
                                                </span>
                                                <DateTimePicker
                                                    onChange={onToDate}
                                                    value={IsToDate}
                                                    format="dd/MM/yyyy"
                                                    className={"form-control2"}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-md-6 m-auto">
                                            <div class="form-group">
                                                <span class="small font-weight-bold text-muted">
                                                    Mức lương<strong className="check-point">(*)</strong>
                                                </span>
                                                <input
                                                    type="text"
                                                    class="form-control2"
                                                    value={SalaryLevel}
                                                    onChange={(e) => setSalaryLevel(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-md-6 m-auto">
                                            <div class="form-group">
                                                <span class="small font-weight-bold text-muted">
                                                    Địa điểm tuyển dụng<strong className="check-point">(*)</strong>
                                                </span>
                                                <input
                                                    type="text"
                                                    class="form-control2"
                                                    value={Address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-md-6 m-auto">
                                            <div class="form-group">
                                                <span class="small font-weight-bold text-muted">
                                                    Số lượng tuyển dụng<strong className="check-point">(*)</strong>
                                                </span>
                                                <input
                                                    type="text"
                                                    class="form-control2"
                                                    value={Quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-md-6 m-auto">
                                            <div class="form-group">
                                                <span class="small font-weight-bold text-muted">
                                                    Hình thức làm việc<strong className="check-point">(*)</strong>
                                                </span>
                                                <input
                                                    type="text"
                                                    class="form-control2"
                                                    value={WorkingForm}
                                                    onChange={(e) => setWorkingForm(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-md-6 m-auto">
                                            <div class="form-group">
                                                <span class="small font-weight-bold text-muted">
                                                    Cấp bậc tuyển dụng<strong className="check-point">(*)</strong>
                                                </span>
                                                <input
                                                    type="text"
                                                    class="form-control2"
                                                    value={RecruitmentLevel}
                                                    onChange={(e) => setRecruitmentLevel(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-md-6 m-auto">
                                            <div class="form-group">
                                                <span class="small font-weight-bold text-muted">
                                                    Thời gian thử việc<strong className="check-point">(*)</strong>
                                                </span>
                                                <input
                                                    type="text"
                                                    class="form-control2"
                                                    value={InternshipPeriod}
                                                    onChange={(e) => setInternshipPeriod(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-md-6 m-auto">
                                            <div class="form-group">
                                                <span class="small font-weight-bold text-muted">
                                                    Kinh nghiệm làm việc<strong className="check-point">(*)</strong>
                                                </span>
                                                <input
                                                    type="text"
                                                    class="form-control2"
                                                    value={WorkExperience}
                                                    onChange={(e) => setWorkExperience(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-md-6 m-auto">
                                            <div class="form-group">
                                                <span class="small font-weight-bold text-muted">
                                                    Yêu cầu bằng cấp<strong className="check-point">(*)</strong>
                                                </span>
                                                <input
                                                    type="text"
                                                    class="form-control2"
                                                    value={DegreeRequired}
                                                    onChange={(e) => setDegreeRequired(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        {TypeSetting === 'img' &&
                                            <div className="col-md-12">
                                                <span className="small font-weight-bold text-muted"></span>
                                                <ImgMutilUpload
                                                    onImageUpload={(e) => setFileUpload(e)}
                                                    onData={(e) => setFromValue({ ...FromValue, Image: e })}
                                                    data={FromValue.Image}
                                                    isMutil={true}
                                                />
                                            </div>
                                        }
                                        <div className="col-md-12 m-auto">
                                            <div class="form-group">
                                                <span class="small font-weight-bold text-muted">
                                                    <strong className="check-point">(*)</strong>
                                                </span>
                                                <MyEditor
                                                    onChange={e => setValue({ ...Value, Document: e })}
                                                    values={Value.Document}
                                                    height={400}
                                                />
                                            </div>
                                        </div>
                                        <div class="col-sm-12 col-md-12 mt-2">
                                            <button
                                                onClick={() => {
                                                    ClearForm();
                                                    setFileUpload([]);
                                                    Cancel();
                                                }}
                                                type="button"
                                                class="btn btn-sm btn-danger pull-right margin-left-5"
                                            >
                                                <i class="fa fa-trash pr-2"></i>
                                                Hủy
                                            </button>

                                            <button
                                                type="button"
                                                class="btn btn-sm btn-success pull-right"
                                                onClick={CMS_spRecruitment_Save}
                                            >
                                                <i class="fa fa-edit pr-2"></i>
                                                {FromValue.Id === 0 ? " Thêm mới" : "Chỉnh sửa"}
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
                </div>

                <div className="body col-md-12">
                    <div className="row">
                        <div className="col-md-2"></div>

                        <div className="bodytable col-md-10">
                            <DataTable data={Data} columns={columns} fixedColumns="true" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
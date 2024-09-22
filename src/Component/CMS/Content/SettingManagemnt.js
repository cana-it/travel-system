import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { DataTable } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import { IMAGES_DOMAIN } from "../../../Services";
import { Alerterror, Alertsuccess, Alertwarning, FormatDateJson } from "../../../Utils";
import FormImageUpload from "../../../Common/CMS/FormImageUpload";
import Select from "react-select";
import { ImgMutilUpload } from "../../../Common/CMS/ImgMutilUpload";
import { MyEditor } from "../../../Common/CMS/MyEditor";
import { confirmAlert } from "react-confirm-alert";
export const SettingManagemnt = () => {
    const CreateBy = localStorage.getItem("CreateBy");
    const ListRefts = {
        KeySettingRef: useRef()
    };
    useEffect((e) => {
        Trl_spSetting_List()
    }, []);
    const dispatch = useDispatch();
    const [Value, setValue] = useState({
        Image: "",
        Text: "",
        Document: "",
        Number: ""
    });
    const [FromValue, setFromValue] = useState({
        IdSetting: 0,
        KeySetting: "",
        Description: "",
        DataSetting: "",
        CreateBy: "",
        IsHide: 0,
        IsDelete: 0
    });
    const [valueType, setValueType] = useState({ value: 'img', label: 'Hình ảnh' });
    const optionSelect = [
        { value: 'img', label: 'Hình ảnh' },
        { value: 'text', label: 'Chữ' },
        { value: 'doc', label: 'Văn bản' },
        { value: 'bool', label: 'Số' },
    ];
    const [TypeSetting, setTypeSetting] = useState('img');
    const onTypeRecept = (item) => {
        setValueType(item);
        setTypeSetting(item.value);
    }
    const [ListData, setListData] = useState([]);
    const [FileUpload, setFileUpload] = useState([]);
    const ClearForm = () => {
        setTypeSetting('img')
        setValueType({ value: 'img', label: 'Hình ảnh' });
        setFromValue({
            IdSetting: 0,
            KeySetting: "",
            Description: "",
            CreateBy: "",
            IsHide: 0,
            IsDelete: 0,
            DataSetting: ""
        });
        setValue({
            Image: "",
            Text: "",
            Document: "",
            Number: ""
        })
        setFileUpload([]);
    };

    //#region Save
    const Trl_spSetting_Save = async (item, key) => {
        
        try {
            let _newListImage = "";
            if (FileUpload.length > 0) {
                //addFormImageUpload
                const newListImage = await FormImageUpload(FileUpload, "Main", dispatch);
                _newListImage = [newListImage, FromValue?.DataSetting || ""].join(",");

            } else if (typeof FileUpload === 'string' || FileUpload.length === 0) {
                _newListImage = FromValue.DataSetting
            } else if (!_newListImage) {
                Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
                return;
            }
            if (FromValue.KeySetting === "" || FromValue.KeySetting === undefined) {
                Alertwarning("Vui lòng thêm cài đặt");
                ListRefts.KeySettingRef.current.focus();
                return;
            }
            let DataSetting = ''
            if (valueType.value === 'img') {
                DataSetting = _newListImage
            } else if (valueType.value === 'text') {
                DataSetting = Value.Text
            } else if (valueType.value === 'bool') {
                DataSetting = Value.Number
            } else if (valueType.value === 'doc') {
                DataSetting = Value.Document
            }

            const params = {
                Json: JSON.stringify({
                    IdSetting: FromValue.IdSetting,
                    KeySetting: FromValue.KeySetting?.trim(),
                    Description: FromValue.Description?.trim(),
                    TypeSetting: TypeSetting,
                    DataSetting: DataSetting?.trim(),
                    IsHide: FromValue.IsHide,
                    IsDelete: FromValue.IsDelete,
                    CreateBy: CreateBy
                }),
                func: "Trl_spSetting_Save",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                setIsOpen(false);
                Trl_spSetting_List();
                return;
            }
            if (result.Status === "NOTOK") {
                Alertwarning(result.ReturnMess);
                return;
            } else {
                const timeConfirm = new Date();
                ListData.map((e) => {
                    if (e.IdSetting === FromValue.IdSetting) {
                        e.KeySetting = FromValue.KeySetting;
                        e.Description = FromValue.Description;
                        e.TypeSetting = TypeSetting;
                        e.DataSetting = DataSetting;
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
            }
        } catch (error) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
        }
    };
    //#endregion

    //#region List
    const Trl_spSetting_List = async () => {
        try {
            setListData([]);
            const pr = {
                KeySelect: 0,
                // UserId: User.UserId,
                // GroupId: User.GroupId
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spSetting_List",
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
    const Trl_spSetting_Delete = (item) => {
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
                        Trl_spSetting_Delete_Action(props.item);
                    }}
                >
                    <i className="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    };
    const Trl_spSetting_Delete_Action = async (item) => {
        
        try {
            const pr = {
                IdSetting: item._original.IdSetting,
                IsDelete: 1,
            };

            const params = {
                Json: JSON.stringify(pr),
                func: " Trl_spSetting_Delete",
            };

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spSetting_List();
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
            IdSetting: Data.IdSetting,
            KeySetting: Data.KeySetting,
            Description: Data.Description,
            TypeSetting: Data.TypeSetting,
            DataSetting: Data.DataSetting,
            EditBy: CreateBy,
            IsHide: Data.IsHide ? 1 : 0,
            IsDelete: Data.IsDelete ? 1 : 0
        });
        setValue({
            Image: Data.DataSetting,
            Text: Data.DataSetting,
            Number: Data.DataSetting,
            Document: Data.DataSetting
        })
        if (Data.TypeSetting === 'img') {
            setTypeSetting('img');
        } else if (Data.TypeSetting === 'text') {
            setTypeSetting('text');
        } else if (Data.TypeSetting === 'bool') {
            setTypeSetting('bool');
        } else if (Data.TypeSetting === 'doc') {
            setTypeSetting('doc');
        }
        setValueType({ value: item._original.TypeSetting, label: item._original.TypeSettingName })

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
                        onClick={(e) => Trl_spSetting_Delete(row)}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </>
            ),
            width: 150,
            filterable: false,
            className: "text-center"
        },
        // {
        //     Header: "Ẩn hiện",
        //     accessor: "IsHide",
        //     filterable: false,
        //     width: 70,
        //     Cell: ({ row }) => {
        //         return (
        //             <div>
        //                 {row._original.IsHide ? (
        //                     <a className="pointer" onClick={e => Shop_spSetting_Hide({ row })} title="Ẩn" >
        //                         <img src="../assets/img/icons8-toggle-off-50.png" className="transform-13" alt="Toggle Off" width="20" />
        //                     </a>
        //                 ) : (
        //                     <a className="pointer" onClick={e => Shop_spSetting_Hide({ row })} title="Hiện">
        //                         <img src="../assets/img/icons8-toggle-on-50.png" className="transform-13" alt="Toggle On" width="20" />
        //                     </a>
        //                 )}
        //             </div>
        //         );
        //     },
        // },
        {
            Header: "Cài đặt dữ liệu",
            accessor: "DataSetting",
            filterable: false,
            className: "text-center",
            Cell: ({ row }) => {
                return (
                    <>
                        {row._original.TypeSetting === 'img' &&
                            <>
                                {row.DataSetting !== undefined && row.DataSetting !== "" && row.DataSetting !== null ? (
                                    row._original.DataSetting.split(",").map((img, index) => {
                                        return (<>
                                            {img !== "" && <span
                                                className="cursor"
                                                data-toggle="modal"
                                                data-target="#modalImg"
                                                title="Click để xem hình lớn"
                                                key={index} // Add key prop to resolve the unique key warning
                                            >
                                                <img src={IMAGES_DOMAIN + img} width="30" alt=""/> {/* Add alt attribute */}
                                            </span>}
                                        </>
                                        );
                                    })
                                ) : null}</>
                        }
                        {row._original.TypeSetting === 'text' &&
                            <span>{row._original.DataSetting}</span>}
                        {row._original.TypeSetting === 'bool' &&
                            <span>{row._original.DataSetting}</span>}
                        {row._original.TypeSetting === 'doc' &&
                            <span>{row._original.DataSetting}</span>}
                    </>
                );
            },
        },
        {
            Header: "Cài đặt",
            accessor: "KeySetting",
            className: "text-center"
        },
        {
            Header: "Mô tả",
            accessor: "Description",
            className: "text-center"
        },
        {
            Header: "Loại",
            accessor: "TypeSettingName",
            className: "text-center"
        },
        {
            Header: "Người tạo",
            accessor: "CreateName",
            className: "text-center"
        },
        {
            Header: "Ngày tạo",
            accessor: "CreateOn"
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
                        Quản lý nội dung website
                    </span>
                    <div className="float-right">
                        <button
                            onClick={(e) => {
                                VideAdd();
                                ClearForm();
                            }}
                            type="button"
                            class="btn btn-sm btn-success pull-right margin-left-5"
                            style={{ marginTop: "-7px" }}
                        >
                            <i class="fa fa-plus pr-2"></i>
                            Thêm nội dung
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
                            {FromValue.IdSetting === 0
                                ? "Thêm mới nội dung"
                                : "Chỉnh sửa nội dung "}
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
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Cài đặt hiển thị
                                        <span className="text-danger">
                                            {FromValue.IdSetting === 0
                                                ? "(*)"
                                                : "( Khách hàng không sửa mục này! )"}
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.KeySetting}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, KeySetting: e.target.value })
                                        }
                                        ref={ListRefts.KeySettingRef}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Mô tả <span className="text-danger">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.Description}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, Description: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Loại <span className="text-danger">(*)</span>
                                    </label>
                                    <Select
                                        onChange={e => onTypeRecept(e)}
                                        value={valueType}
                                        options={optionSelect}
                                    />
                                </div>
                            </div>
                            {TypeSetting === 'img' &&
                                <div className="col-md-12">
                                    <span className="small font-weight-bold text-muted">
                                        Upload Hình Ảnh || Logo<span className="text-danger">(jpg, jpeg, png || Có thể thêm nhiều ảnh)</span>
                                    </span>
                                    <ImgMutilUpload
                                        onImageUpload={(e) => setFileUpload(e)}
                                        onData={(e) => setFromValue({ ...FromValue, DataSetting: e })}
                                        data={FromValue.DataSetting}
                                        isMutil={true}
                                    />
                                </div>
                            }
                            {TypeSetting === 'text' &&
                                <div className="col-md-12">
                                    <label className="no-absolute">
                                        Vui lòng nhập dữ liệu <span className="text-danger">(*)</span>
                                    </label>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={Value.Text}
                                            onChange={(e) =>
                                                setValue({ ...Value, Text: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                            }
                            {TypeSetting === 'doc' &&
                                <div className="col-md-12">
                                    <label className="no-absolute">
                                        Vui lòng nhập dữ liệu <span className="text-danger">(*)</span>
                                    </label>
                                    <MyEditor
                                        onChange={e => setValue({ ...Value, Document: e })}
                                        values={Value.Document}
                                        height={400}
                                    />
                                </div>
                            }
                            {TypeSetting === 'bool' &&
                                <div className="col-md-12">
                                    <label className="no-absolute">
                                        Vui lòng nhập dữ liệu <span className="text-danger">(*)</span>
                                    </label>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={Value.Number}
                                            onChange={(e) =>
                                                setValue({ ...Value, Number: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                            }

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
                                    onClick={Trl_spSetting_Save}
                                >
                                    <i className="fa fa-save pr-2"></i>
                                    {FromValue.IdSetting === 0 ? "Lưu" : "Chỉnh sửa"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
};
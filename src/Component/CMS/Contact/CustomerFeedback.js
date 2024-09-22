import React, { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { DataTable } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import { Alerterror, Alertsuccess, Alertwarning, FirstOrLastDayinMonth, FormatDateJson } from "../../../Utils";
import "react-datetime-picker/dist/DateTimePicker.css";
import DateTimePicker from "react-datetime-picker";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
export const CustomerFeedback = () => {
    const dispatch = useDispatch();
    const [Data, setData] = useState([]);
    const [SearchValue, setSearchValue] = useState({
        FromDate: FirstOrLastDayinMonth(new Date(), 1),
        ToDate: new Date(),
    });
    useEffect(() => {
        Trl_spTourCustomerReview_List();
    }, []);

    const Trl_spTourCustomerReview_List = async () => {
        
        try {
            setData([]);
            const pr = {
                Id: 0,
                FromDate: SearchValue.FromDate,
                ToDate: SearchValue.ToDate
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spTourCustomerReview_List",
            };
            const list = await mainAction.API_spCallServer(params, dispatch);
            if (list.length > 0) {
                setData(list);
                return;
            }
            Alertwarning("Không có dữ liệu");
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    };

    const Trl_spTourCustomerReview_Delete = (item) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return <ConfirmAlertUi onClose={onClose} item={item} />;
            },
        });
    };

    const Trl_spTourCustomerReview_Delete_Action = async (item) => {
        try {
            const pr = {
                IsDelete: 1,
                Id: item._original.Id,
            };

            const params = {
                Json: JSON.stringify(pr),
                func: " Trl_spTourCustomerReview_Delete",
            };

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spTourCustomerReview_List();
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

    const [nameCustomer, setNameCustomer] = useState('');
    const [phone, setPhone] = useState('');
    const [tourReview, setTourReview] = useState('');
    const [tourGuide, setTourGuide] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [createOn, setCreateOn] = useState('');
    const Trl_spTourCustomerReview_View = (e) => {
        let NameCustomerDt = `${(e?.row?.CustomerName) || "..."}`
        let PhoneDt = `${(e?.row?.PhoneNumber) || "..."}`
        let TourReviewDt = `${(e?.row?.TourReview) || "..."}`
        let TourTourGuideDt = `${(e?.row?.TourGuide) || "..."}`
        let DateStartDt = `${(e?.row?.DateStart) || "..."}`
        let CreateOnDt = `${(e?.row?.CreateOn) || "..."}`
        // ----------------------------------
        setNameCustomer(`${NameCustomerDt}`);
        setPhone(`${PhoneDt}`);
        setTourReview(`${TourReviewDt}`);
        setTourGuide(`${TourTourGuideDt}`);
        setDateStart(`${DateStartDt}`);
        setCreateOn(`${CreateOnDt}`);
    }

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
                        Trl_spTourCustomerReview_Delete_Action(props.item);
                    }}
                >
                    <i class="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    };
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
            accessor: "Edit",
            className: "text-center",
            Cell: ({ row }) => (
                <div>
                    <button
                        type="button"
                        title="Xóa"
                        className="btn btn-success btn-sm m-1 btn-add"
                        onClick={(e) => {
                            Trl_spTourCustomerReview_View({ row })
                            openModal(row)
                        }}
                    >
                        <i className="fa fa-eye"></i>
                    </button>
                    <button
                        type="button"
                        title="Xóa"
                        className="btn btn-danger btn-sm m-1 btn-add"
                        onClick={(e) => Trl_spTourCustomerReview_Delete(row)}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            ),
        },
        {
            Header: "Tên tour",
            accessor: "TourReview",
            className: "text-center"
        },
        {
            Header: "Tên khách hàng",
            accessor: "CustomerName",
            className: "text-center"
        },
        {
            Header: "Số điện thoại",
            accessor: "PhoneNumber",
            className: "text-center"
        },
        {
            Header: "Hướng dẫn viên",
            accessor: "TourGuide",
            className: "text-center"
        },
        {
            Header: "Ngày khởi hành",
            accessor: "DateStart",
            className: "text-center"
        },
        {
            Header: "Hệ thống khách sạn",
            accessor: "Hotel",
            className: "text-center"
        },
        {
            Header: "Hệ thống nhà hàng",
            accessor: "Restaurant",
            className: "text-center"
        },
        {
            Header: "Hành trình tham quan",
            accessor: "Trip",
            className: "text-center"
        },
        {
            Header: "Nhân viên Tư Vấn",
            accessor: "Counselor",
            className: "text-center"
        },
        {
            Header: "Hướng dẫn viên",
            accessor: "TourGuideOnTrip",
            className: "text-center"
        },
        {
            Header: "Ngày tạo",
            accessor: "CreateOn",
            className: "text-center",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
    ];

    const [modalIsOpen, setIsOpen] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    };
    const closeModal = () => {
        setIsOpen(false);
    };
    return (
        <div className="content-wrapper">
            <div className="card">
                <div className="card-header">
                    <span className="HomeTitle">
                        Quản lý feedback của khách hàng
                    </span>
                    <div className="float-right">
                        <button
                            onClick={Trl_spTourCustomerReview_List}
                            type="button"
                            class="btn btn-sm btn-success pull-right margin-left-5"
                            style={{ marginTop: "-7px" }}
                        >
                            <i class="fas fa-search pr-2"></i>
                            Tìm kiếm
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div class="row" style={{ marginTop: "-15px" }}>
                        <div className="col-md-6">
                            <div class="form-group">
                                <span class="small">
                                    Từ ngày <span className="red">(*)</span>
                                </span>
                                <DateTimePicker
                                    className={"form-control2"}
                                    format="MM/dd/yyyy"
                                    value={SearchValue.FromDate}
                                    onChange={(e) => setSearchValue({ ...SearchValue, FromDate: e })}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div class="form-group">
                                <span class="small">
                                    Đến ngày <span className="red">(*)</span>
                                </span>
                                <DateTimePicker
                                    className={"form-control2"}
                                    format="MM/dd/yyyy"
                                    value={SearchValue.ToDate}
                                    onChange={(e) => setSearchValue({ ...SearchValue, ToDate: e })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 mb-3">
                        <DataTable data={Data} columns={columns} fixedColumns="true" />
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
                        <h3>Chi tiết Feedback của khách hàng</h3>
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
                            <div className="col-md-12 px-4">
                                <div className="rounded border border-light-subtle">
                                    <h4 className="text-center py-2 text-danger">THÔNG TIN KHẢO SÁT CỦA KHÁCH HÀNG</h4>
                                    <hr />
                                    <div className="row text-center">
                                        <div className="col-md-6 border-light-subtle border-right">
                                            <p>Tên khách hàng: <span className="font-weight-bold">{nameCustomer}</span></p>
                                            <p>Số điện thoại: <span className="font-weight-bold">{phone}</span></p>
                                            <p>Ngày gửi feedback: <span className="font-weight-bold">{createOn}</span></p>
                                        </div>
                                        <div className="col-md-6">
                                            <p>Hành trình du khách đã trải nghiệm: <span className="font-weight-bold">{tourReview}</span></p>
                                            <p>Hướng Dẫn Viên: <span className="font-weight-bold">{tourGuide}</span></p>
                                            <p>Ngày bắt đầu chuyến đi: <span className="font-weight-bold">{dateStart}</span></p>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

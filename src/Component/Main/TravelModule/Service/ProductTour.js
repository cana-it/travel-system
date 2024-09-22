import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import { Alertwarning, Alertsuccess, Alerterror, FormatDateJson } from '../../../../Utils';
import { SelectOfficer, DataTable } from '../../../../Common';
import Modal from 'react-modal';

export const ProductTour = () => {

    const dispatch = useDispatch();
    const CreateBy = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const VideAdd = () => {
        openModal()
    }


    const [data, setData] = useState([])
    useEffect(() => {
        let data = [
            {
                Id: 1,
                ProductCode: "TV00001",
                ProviderName: "Tour châu âu Pháp/Anh",
                Types: "Private",
                Status: "Hoạt động",
                Price1: "6000 $",
                Price2: "5000 $",
                DayTravel: "9 ngày 10 đêm",
                TotalCustomer: 15,
                TotalPoint: "20",
                TotalBooking: 65,
                TotalRevenue: "30.000 USD",
                Creator: "Admin",
                CrearTime: "10/10/22",
                Editor: "",
                EditTime: ""

            },
            {
                Id: 1,
                ProductCode: "TV00002",
                ProviderName: "Tour châu âu Tây ban nha/Bồ đào nha",
                Types: "Public",
                Status: "Tạm ngưng",
                Price1: "6000 $",
                Price2: "5000 $",
                DayTravel: "9 ngày 10 đêm",
                TotalCustomer: 15,
                TotalPoint: "20",
                TotalBooking: 55,
                TotalRevenue: "60.000 USD",
                Creator: "Admin",
                CrearTime: "10/10/22",
                Editor: "",
                EditTime: ""

            },
            {
                Id: 2,
                ProductCode: "TV00003",
                ProviderName: "Tour châu âu Nga/Bĩ",
                Types: "S.I.C",
                Status: "Hoạt động",
                Price1: "6000 $",
                Price2: "5000 $",
                DayTravel: "9 ngày 10 đêm",
                TotalCustomer: 15,
                TotalPoint: "20",
                TotalBooking: 45,
                TotalRevenue: "90.000 USD",
                Creator: "Admin",
                CrearTime: "10/10/22",
                Editor: "",
                EditTime: ""

            },
            {
                Id: 3,
                ProductCode: "TV00004",
                ProviderName: "Tour châu âu Thổ nhĩ kỳ",
                Types: "Public",
                Status: "Hoạt động",
                Price1: "6000 $",
                Price2: "5000 $",
                DayTravel: "9 ngày 10 đêm",
                TotalCustomer: 15,
                TotalPoint: "20",
                TotalBooking: 35,
                TotalRevenue: "320.000 USD",
                Creator: "Admin",
                CrearTime: "10/10/22",
                Editor: "",
                EditTime: ""

            },
            {
                Id: 4,
                ProductCode: "TV00005",
                ProviderName: "Tour châu âu Đan mạch",
                Types: "Public",
                Status: "Hoạt động",
                Price1: "6000 $",
                Price2: "5000 $",
                DayTravel: "9 ngày 10 đêm",
                TotalCustomer: 15,
                TotalPoint: "20",
                TotalBooking: 25,
                TotalRevenue: "30.000 USD",
                Creator: "Admin",
                CrearTime: "10/10/22",
                Editor: "",
                EditTime: ""

            },
            {
                Id: 5,
                ProductCode: "TV00006",
                ProviderName: "Tour châu âu thụy sỹ",
                Types: "S.I.C",
                Status: "Hoạt động",
                Price1: "6000 $",
                Price2: "5000 $",
                DayTravel: "9 ngày 10 đêm",
                TotalCustomer: 15,
                TotalPoint: "20",
                TotalBooking: 15,
                TotalRevenue: "30.000 USD",
                Creator: "Admin",
                CrearTime: "10/10/22",
                Editor: "",
                EditTime: ""

            }
        ]
        setData(data);
        LoadData();
    }, [])

    const LoadData = async () => {
        try {
            const params = {
              Json: JSON.stringify({
                TextSearch: "",
                UserId: 1
              }),
              func: "Trl_spService_List",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            setData(result);
            if (result.length === 0) {
              Alertwarning("Nodata");
            }
          } catch (error) {
            Alertwarning("Nodata");
          }
    }

    const columns = [
        {
            Header: 'Lựa chọn',
            accessor: 'Edit',
            Cell: ({ row }) => (
                <div>
                    <button className="btn btn-sm btn-success" > <i class="fa fa-book"></i> Hành trình</button> |
                    <button className="btn btn-sm btn-warning" > <i class="fa fa-eye"></i> Sửa</button> |
                    <button className="btn btn-sm btn-danger"> <i class="fa fa-undo"></i> Xóa</button>
                </div>

            ),
            width: 300
        },
        {
            Header: 'Mã Dịch vụ',
            accessor: 'ProductCode',
        },
        {
            Header: "Tên dịch vụ",
            accessor: "ProviderName",
            width: 350
        }
        ,
        {
            Header: 'Loại tour',
            accessor: 'Types',
        }
        ,
        {
            Header: "Trạng thái",
            accessor: "Status",
            Cell: obj => (<span className={obj.value === "Hoạt động" ? "badge badge-success" : "badge badge-warning"}>{obj.value}</span>)
        },
        {
            Header: "Tổng booking",
            accessor: "TotalBooking",
            width: 200
        },
        {
            Header: "Tổng Doanh thu",
            accessor: "TotalRevenue",
            width: 200
        }
        ,
        {
            Header: "Giá người lớn",
            accessor: "Price1",
            width: 200
        },
        {
            Header: "Giá trẻ em",
            accessor: "Price2",
            width: 200
        },
        {
            Header: "Số ngày",
            accessor: "DayTravel"
        },
        {
            Header: "Khách tối đa",
            accessor: "TotalCustomer"
        },
        {
            Header: "Số điểm tham quan",
            accessor: "TotalPoint"
        },
        {
            Header: "Người tạo",
            accessor: "Creator"
        },
        {
            Header: "Thời gian",
            accessor: "CrearTime"
        },
        {
            Header: "Người Sửa",
            accessor: "Editor"
        },
        {
            Header: "Thời gian sửa",
            accessor: "EditTime"
        }
    ];

    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }
    return (
        <div className="content-wrapper">


            <div class="card-header border-left-red">
                <div class="row">
                    <div class="col-sm-12 col-md-6" >
                        <h3 class="card-title font-weight-bold">Dịch vụ tour(5)</h3>
                    </div>
                    <div class="col-sm-12 col-md-6 margin-top-5s">
                        <button type="button" class="btn btn-sm btn-danger pull-right margin-left-5">
                            <i class="fa fa-search pr-2"></i>
                            Tìm kiếm
                        </button>

                        <button onClick={VideAdd} type="button" class="btn btn-sm btn-success pull-right">
                            <i class="fa fa-plus pr-2"></i>
                            Tạo dịch vụ
                        </button>
                    </div>
                </div>
            </div>

            <div class="card-body border-left-red">

                <div class="row" style={{ display: modalIsOpen === false ? "block" : "none" }}>
                    <DataTable
                        data={data}
                        columns={columns}
                        IsSearch={true}
                        style={{ zIndex: 500 }}
                    />
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                className=' custom-modal-w-90'
            >


                <div class="card-header border-left-red">
                    <div class="row">
                        <div class="col-sm-12 col-md-6" >
                            <h3 class="card-title font-weight-bold">Thêm mới dịch vụ</h3>
                        </div>
                        <div class="col-sm-12 col-md-6 margin-top-5s">
                            <button onClick={closeModal} type="button" class="btn btn-sm btn-default pull-right margin-left-5">
                                <i class="fa fa-undo pr-2"></i>
                                Hủy
                            </button>

                            <button type="button" class="btn btn-sm btn-danger pull-right">
                                <i class="fa fa-edit pr-2"></i>
                                Lưu & đóng
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card-body border-left-red">

                    <div class="row">
                        <div class="col-sm-12 col-md-6">
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Mã loại NCC</span>
                                    </div>
                                    <input type="text" maxLength="50" class="form-control" />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Tên loại NCC</span>
                                    </div>
                                    <input type="text" maxLength="50" class="form-control" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Modal>


        </div>
    )
}

const customStyles = {
    content: {
        top: '15%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        zIndex: '1000'
    }
};
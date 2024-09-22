import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alertwarning, Alertsuccess,
    Alerterror, FormatDateJson,
    FormatNumber
} from '../../../../Utils';
import {
    DataTable, SelectContractType, SelectDepartment, SelectStaff
} from '../../../../Common';
import DateTimePicker from 'react-datetime-picker';
//import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { useLocation } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery'



export const Staff_Contract = () => {
    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const location = useLocation();
  
    const [data, setData] = useState([])
    const [DepartmentId_List, setDepartmentId_List] = useState(0)
    const [BranchId_List, setBranchId_List] = useState(0)
    const [StaffSearch, setStaffSearch] = useState("")
    const [StaffId, setStaffId] = useState(0)
    const [ContractCode, setContractCode] = useState("")
    const [Notes, setNotes] = useState("")
    const [Salary, setSalary] = useState(0)
    const [WorkPlace, setWorkPlace] = useState("")
    const [DepartmentId, setDepartmentId] = useState()
    const [AccountId, setAccountId] = useState({ value: 0, label: 'Chọn nhân viên' });
    const [ContractTypeId, setContractTypeId] = useState({ value: 0, label: 'Chọn loại hợp đồng' });
    const [ContractId, setContractId] = useState(0)
    const pr = new URLSearchParams(location.search);
    const [DepartmentID, setDepartmentID] = useState(parseInt(pr.get("dpid")));
    const [IsTodate, setIsTodate] = useState();

    useEffect(() => {
        const pr = new URLSearchParams(location.search);
        if (pr.get("dpid") !== null) {
            setDepartmentId_List(parseInt(pr.get("dpid")));
            Trl_spStaff_Contract_List(pr.get("dpid"), 1);
        }
        else {
            Trl_spStaff_Contract_List(0, 0);
        }
    }, [])

    const [FromDate, setFromDate] = useState('');   
    const [IsFromDate, setIsFromDate] = useState();
    const onFromDate = (item) => {
        setIsFromDate(item)
        setFromDate(FormatDateJson(item))
    }
    const [EndDate, setEndDate] = useState('');
    const [IsEndDate, setIsEndDate] = useState();
    const onEndDate = (item) => {
        setIsEndDate(item)
        setEndDate(FormatDateJson(item))
    }

    //#region thêm 
    const Trl_spStaff_Contract_Save = async () => {
        try {
            if (ContractCode === "") {
                Alertwarning("Nhập mã hợp đồng!");
                return;
            }

            if (ContractCode.length <= 4) {
                Alertwarning("Nhập mã hợp đồng > 4 kí tự");
                return;
            }
            if (FromDate === '') {
                Alertwarning("Chọn hiệu lực cho hợp đồng!");
                return;
            }

            if (EndDate === '') {
                Alertwarning("Chọn hiệu lực cho hợp đồng!");
                return;
            }
            if (AccountId.value === 0) {
                Alertwarning("Chọn nhân viên!");
                return;
            }
            if (ContractTypeId === '') {
                Alertwarning("Chọn loại hợp đồng!");
                return;
            }
            if (Salary === 0) {
                Alertwarning("Nhập lương!");
                return;
            }
            if (WorkPlace === '') {
                Alertwarning("Nhập nơi làm việc!");
                return;
            }

            const pr = {
                ContractId: ContractId,
                StaffId: AccountId.value,
                ContractTypeId: ContractTypeId.value,
                ContractTypeName: ContractTypeId.label,
                ContractCode: ContractCode,
                FromDate: FromDate,
                Todate: EndDate,
                Salary: Salary,
                WorkPlace: WorkPlace,
                Notes: Notes,
                Creater: Creater,
                CreateName: CreateName
            }


            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spStaff_Contract_Save"
            }

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Cancel();
                Trl_spStaff_Contract_List(0, 0);
                setIsOpen(false); // close popup
                return;
            }
            if (result.Status === "NOTOK") {
                Alerterror(result.ReturnMess);
                return;
            }
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }
    const Cancel = () => {
        setContractId(0);
        setContractCode("");
        setContractTypeId({ value: 0, label: 'Chọn nhân viên' });
        setAccountId({ value: 0, label: 'Chọn nhân viên' });
        setSalary(0);
        setWorkPlace('');
        setFromDate("");
        setEndDate("");
        $(".react-datetime-picker__clear-button").click();
        setDepartmentId(0)
    }
    //#endregion

    //#region sửa
    const Trl_spStaff_Contract_View = (item) => {
        const obView = item._original;
        setContractId(obView.ContractId);
        setAccountId({ value: obView.StaffId, label: obView.StaffName });
        setContractCode(obView.ContractCode);
        setNotes(obView.Notes);
        setSalary(obView.Salary);
        setWorkPlace(obView.WorkPlace);
        setContractTypeId({ value: obView.ContractTypeId, label: obView.ContractTypeName });
        setEndDate(obView.Todate);
        setFromDate(obView.FromDate);
        if (obView?.FromDate) {
            let bri = new Date(obView.FromDate);
            setFromDate(FormatDateJson(bri));
            setIsFromDate(bri);
        }

        if (obView?.Todate) {
            let ttw = new Date(obView.Todate);
            setEndDate(FormatDateJson(ttw));
            setIsEndDate(ttw);
        }
       
        setIsOpen(true);
    }
    //#endregion

    //#region xóa
    const Trl_spStaff_Contract_Delete = (item) => {

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ConfirmAlertUi onClose={onClose} item={item} />
                );
            }
        });
    }

    const Trl_spStaff_Delete_Action = async (item) => {
        try {
            const pr = {
                Creater: Creater,
                CreateName: CreateName,
                ContractId: item._original.ContractId
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spStaff_Contract_Delele"
            }
            const result = await mainAction.API_spCallServer(params, dispatch)
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                Trl_spStaff_Contract_List(0, 0);
            }
            if (result.Status === "NOTOK") {
                Alerterror(result.ReturnMess);
                return;
            }
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }

    const ConfirmAlertUi = (props) => {
        return (
            <div className="card-body border-left-red">
                <h3>Xác nhận xóa dữ liệu!</h3>
                <p>Bạn có chắc chắn muốn xóa <strong>{props.item._original.StaffName}</strong> </p>
                <button className='btn btn-small btn-warning' onClick={props.onClose}> <i class="fa fa-undo"> </i> Hủy</button>
                <button className='btn btn-small btn-danger margin-left-5'
                    onClick={() => {
                        props.onClose();
                        Trl_spStaff_Delete_Action(props.item);
                    }}
                >
                    <i class="fa fa-trash"> </i> Xóa
                </button>
            </div>
        );
    }
    //#endregion

    //#region danh sách
    const Trl_spStaff_Contract_List = async (DepartmentId, Keys) => {
        try {

            const pr = {

                ContractId: 0,
                DepartmentId: Keys === 1 ? DepartmentId : DepartmentId_List,
                Creater: Creater,
                KeySearch: StaffSearch,
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spStaff_Contract_List"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            setData(list);
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }
    const columns = [
        {
            Header: 'Lựa chọn',
            accessor: 'Edit',
            Cell: ({ row }) => (

                <div style={{ textAlign: 'center' }}>
                    {
                        row._original.IsPerEdit === 1 ?
                            (<>
                                <button className="btn btn-xs btn-success" onClick={e => Trl_spStaff_Contract_View(row)}> <i class="fa fa-eye"></i> Sửa</button> |
                            </>

                            ) :
                            (
                                "")
                    }
                    {
                        row._original.IsPerDelete === 1 ?
                            (<>
                                <button className="btn btn-xs btn-danger pr-2" onClick={e => Trl_spStaff_Contract_Delete(row)}> <i class="fa fa-trash"></i> Xóa</button>
                            </>

                            ) :
                            (
                                "")
                    }



                </div>
            ),
            width: 140,
            fixed: "left"
        },
        {
            Header: "Phòng ban",
            accessor: "DepartmentName",
            width: 150
        },
        {
            Header: 'Mã HĐ',
            accessor: 'ContractCode',
            fixed: "left"
        },
        {
            Header: "Tên NV",
         
            width: 200,
            fixed: "left",
            Cell: ({ row }) => (

                <div style={{ textAlign: 'center' }}>
                    {
                        row._original.IsEffect === 1 ?
                            (
                                <span className="badge badge-danger"> {row._original.StaffName} </span>
                            

                            ) :
                            (
                                <span className=""> {row._original.StaffName} </span>)
                    }
                  
                </div>
            ),
        },

        {
            Header: "Loại HĐ",
            accessor: "ContractTypeName",
            width: 180
        },

        {
            Header: "Hiệu lực từ",
            accessor: "FromDate",
            Cell: (obj) => FormatDateJson(obj.value),
            with: 140
        },
        {
            Header: "Hiệu lực đến",
            accessor: "Todate",
            Cell: (obj) => FormatDateJson(obj.value),
            width: 140
        },
        {
            Header: "Lương",
            accessor: "Salary",
            Cell: (obj) => FormatNumber(obj.value),
            width: 140
        },

        {
            Header: "Nơi làm việc",
            accessor: "WorkPlace",
            with: 100
        }
        ,
        {
            Header: "Ghi chú",
            accessor: "Notes",
            with: 100
        }
        ,
        {
            Header: "Người tạo",
            accessor: "CreateName"
        },
        {
            Header: "Thời gian",
            accessor: "CreateTime",
            Cell: (obj) => FormatDateJson(obj.value),
        },
        {
            Header: "Người Sửa",
            accessor: "EditName"
        },
        {
            Header: "Thời gian sửa",
            accessor: "EditTime",
            Cell: (obj) => FormatDateJson(obj.value),
        }
    ];
    //#endregion

    //#region đóng mở tab
    const VideAdd = () => {

        openModal();
        Cancel();
    }
    const [modalIsOpen, setIsOpen] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }
    //#endregion

    return (
        <>
        <div className="content-wrapper ">
            <div class="border-left-red card-header  bg-ab ">
                <div class="row ">
                    <div class="col-sm-12 col-md-2 cardtext " >
                        <h3 class="card-title font-weight-bold ">Hợp đồng ({data.length})</h3>
                    </div>
                    <div class="col-sm-12 col-md-10 margin-top-5s">
                        <button onClick={VideAdd} type="button" class="btn btn-sm btn-success pull-right margin-left-10">
                            <i class="fa fa-plus pr-2"></i>
                            Thêm mới
                        </button>
                        <button onClick={Trl_spStaff_Contract_List} type="button" class="btn btn-sm btn-danger pull-right margin-left-10">
                            <i class="fa fa-search pr-2"></i>
                            Tìm kiếm
                        </button>
                        <div class="form-group pull-right" style={{ marginTop: '-4px', width: '20%' }}>
                            <div class="input-group" style={{ width: '100%' }}>
                                <input type="text" maxLength="500" placeholder="SĐT,Email,Tên..." class="form-control" value={StaffSearch} onChange={e => setStaffSearch(e.target.value)} />
                            </div>
                        </div>
                        <div class="form-group pull-right" style={{ marginTop: '-4px', width: '20%' }}>
                            <div class="input-group" style={{ width: '100%' }}>
                                <SelectDepartment
                                    onSelected={item => setDepartmentId_List(item.value)}
                                    BranchId={BranchId_List}
                                    onDepartmentId={DepartmentId_List}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row mt-3 ml-5'>
                <span style={{color:'red'}}> Ghi chú : Cột tên nhân viên màu đỏ là còn 2 tháng hết hạn hợp đồng.</span>
            </div>
            <div class="card-body border-left-red mt-2">

                <div class="row" >
                    <DataTable
                        data={data}
                        columns={columns}
                        IsSearch={true}
                        style={{ zIndex: 500 }}
                    />
                </div>
            </div>
            <Modal
                show={modalIsOpen}
                onHide={closeModal}
                className=' custom-modal-w-90'
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton >

                    <Modal.Title id="example-custom-modal-styling-title">
                        <div class="">
                            {StaffId === 0 ? "Thêm mới hợp đồng" : "Chỉnh sửa hợp đồng nhân viên "}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="card-body">

                        <div class="row">
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Mã hợp đồng(<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={ContractCode} onChange={e => setContractCode(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"> Hiệu lực từ</span>
                                        </div>
                                        <DateTimePicker className="z-index-1k"
                                             onChange={onFromDate}
                                             value={IsFromDate}
                                             format='MM/dd/yyyy'
                                           
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Hết hiệu lực</span>
                                        </div>
                                        <DateTimePicker className="z-index-1k"
                                         onChange={onEndDate}
                                         value={IsEndDate}
                                         format='MM/dd/yyyy'
                                           
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-text">Loại HĐ(<strong className='check-point'>*</strong>)</span>
                                        <SelectContractType
                                            onSelected={e => setContractTypeId(e)}
                                            onContractTypeId={ContractTypeId.value}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-text">Chọn nhân viên(<strong className='check-point'>*</strong>)</span>
                                        <SelectStaff
                                            onSelected={e => setAccountId(e)}
                                            onAccountId={AccountId}
                                            items={AccountId}
                                            BranchId={0}
                                            DepartmentId={DepartmentId}
                                            onStaffId={AccountId.value}

                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Lương(<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="number" maxLength="50" class="form-control" value={Salary} onChange={e => setSalary(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Nơi làm việc (<strong className='check-point'>*</strong>)</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={WorkPlace} onChange={e => setWorkPlace(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-8">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Ghi chú</span>
                                        </div>
                                        <input type="text" maxLength="50" class="form-control" value={Notes} onChange={e => setNotes(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <button onClick={e => setIsOpen(false)} type="button" class="btn btn-sm btn-default pull-right margin-left-5">
                                    <i class="fa fa-undo pr-2"></i>
                                    Đóng
                                </button>
                                <button onClick={Cancel} type="button" class="btn btn-sm btn-warning pull-right margin-left-5">
                                    <i class="fa fa-trash pr-2"></i>
                                    Hủy
                                </button>

                                <button type="button" class="btn btn-sm btn-danger pull-right" onClick={Trl_spStaff_Contract_Save}>
                                    <i class="fa fa-edit pr-2"></i>
                                    {StaffId === 0 ? " Thêm mới" : "Chỉnh sửa"}
                                </button>
                            </div>
                            <div class="col-sm-12 col-md-12">
                                <div class="form-group">
                                    <h5 style={{ color: 'red' }}>Ghi chú: các ô có dấu sao màu đỏ là bắt buộc nhập</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
        </>
    )
}

import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  FormatDateJson,
  ConvertUTCDateToLocalDate,
  CheckTypeFile,
  FormatMoney,
  ConfirmAlert,
} from "../../../../Utils";
import {
  DataTable,
  SelectBranch,
  SelectCustomerType,
} from "../../../../Common";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";
import { IMAGES_DOMAIN } from "../../../../Services";
//import Modal from 'react-modal';
import { confirmAlert } from "react-confirm-alert"; // Import
import Modal from "react-bootstrap/Modal";
import { useLocation } from "react-router-dom";
import $ from "jquery";

export const Customer = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.search !== "" && location.search.indexOf("KH") !== -1) {
      let _params = location.search
        .replace("?", "")
        .split("&")
        .find((p) => p.indexOf("KH") !== -1);
      Trl_spCustomer_List(_params.split("KH")[1]);
    }
  }, [location.search]);

  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");

  const [IsPassportTimeFrom, setIsPassportTimeFrom] = useState();
  const onPassportTimeFrom = (item) => {
    
    setIsPassportTimeFrom(item);
    setPassportTimeFrom(FormatDateJson(item));
  };

  const [IsPassportTimeTo, setIsPassportTimeTo] = useState();
  const onPassportTimeTo = (item) => {
    
    setIsPassportTimeTo(item);
    setPassportTimeTo(FormatDateJson(item));
  };

  const [IsBrithday, setIsBrithday] = useState();
  const onBrithday = (item) => {
    setIsBrithday(item);
    setBrithday(FormatDateJson(item));
  };

  const VideAdd = () => {
    openModal();
  };

  const Cancel = () => {
    setCustomerId(0);
    setCustomerCode("");
    setCustomerName("");

    setPhone("");
    setAddress("");
    setSex("");
    setEmail("");
    setIdentityCode("");
    setNotes("");

    setPassportScan("");
    setFiles("");

    setFileUpload("");
    setFileUpload1("");
    setViewFiles([]);

    setBrithday("");
    setPassportCode("");
    setPassportTimeFrom("");
    setPassportTimeTo("");
    $(".react-datetime-picker__clear-button").click();

    setBranchId(0);
    setCustomerTypeId(0);
  };

  const [data, setData] = useState([]);
  const [CustomerTypeId_List, setCustomerTypeId_List] = useState(0);
  const [BranchId_List, setBranchId_List] = useState(0);
  const [CustomerId_List, setCustomerId_List] = useState(0);
  const [CustomerSearch, setCustomerSearch] = useState("");
  const [DateSearch, setDateSearch] = useState();
  const Trl_spCustomer_List = async (e) => {
    try {
      if (e === 0 && CustomerSearch === "") {
        Alertwarning("Vui lòng nhập ký tự,tên,tên đệm của khách hàng để xem!");
        return;
      }

      const pr = {
        CustomerId: e === 0 ? CustomerId_List : e,
        CustomerSearch: CustomerSearch,
        CustomerTypeId: CustomerTypeId_List,
        Creater: Creater,
        CreateName: CreateName,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomer_List",
      };

      const list = await mainAction.API_spCallServer(params, dispatch);
      setData(list);
      
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const [CustomerId, setCustomerId] = useState(0);
  const [CustomerCode, setCustomerCode] = useState("");
  const [CustomerName, setCustomerName] = useState("");
  const [PassportCode, setPassportCode] = useState("");
  const [PassportTimeFrom, setPassportTimeFrom] = useState("");
  const [PassportTimeTo, setPassportTimeTo] = useState("");
  const [CustomerNameVn, setCustomerNameVn] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [Sex, setSex] = useState("");
  const [Email, setEmail] = useState("");
  const [PassportScan, setPassportScan] = useState("");
  const [IdentityCode, setIdentityCode] = useState("");
  const [Brithday, setBrithday] = useState("");
  const [Notes, setNotes] = useState("");

  const [CustomerTypeId, setCustomerTypeId] = useState(0);
  const [BranchId, setBranchId] = useState(0);
  const [Files, setFiles] = useState();
  const [ViewFiles, setViewFiles] = useState([]);
  const [FileUpload, setFileUpload] = useState("");
  const [FileUpload1, setFileUpload1] = useState("");
  const [DataHistoryTour, setDataHistoryTour] = useState([]);
  const [DataVisa, setDataVisa] = useState([]);
  const Trl_spCustomer_Save = async () => {
    try {
      ;
      if (CustomerCode === "") {
        Alertwarning("Nhập mã khách hàng");
        return;
      }

      if (CustomerCode.length <= 4) {
        Alertwarning("Nhập mã khách hàng > 4 kí tự");
        return;
      }
      if (CustomerName === "") {
        Alertwarning("Nhập tên khách hàng");
        return;
      }
      if (CustomerName.length <= 5) {
        Alertwarning("Nhập tên khách hàng > 5 kí tự");
        return;
      }
      if (Brithday === "") {
        Alertwarning("Nhập ngày sinh nhật");
        return;
      }
      if (PassportCode === "") {
        Alertwarning("Nhập số Hộ chiếu");
        return;
      }
      if (PassportTimeFrom === "") {
        Alertwarning("Nhập ngày cấp hộ chiếu");
        return;
      }
      if (PassportTimeTo === "") {
        Alertwarning("Nhập ngày hết hạn cấp hộ chiếu");
        return;
      }
      if (Phone !== undefined && Phone !== "" && Phone.length <= 9) {
        Alertwarning("SĐT phải 10 số trở lên");
        return;
      }
      if (BranchId === 0 || BranchId === undefined) {
        Alertwarning("Chọn chi nhánh thuộc khách hàng");
        return;
      }
      if (CustomerTypeId === 0 || CustomerTypeId === undefined) {
        Alertwarning("Chọn loại khách hàng");
        return;
      }

      let listfile = "";

      if (FileUpload1 !== "" && FileUpload1.length > 0) {
        const formData = new FormData();
        formData.append("Key", "Files");
        for (let i = 0; i < FileUpload1.length; i++) {
          formData.append("myFile" + i, FileUpload1[i]);
        }
        const data = await mainAction.API_spCallPostFile(formData, dispatch);
        let _img = data.Message.replaceAll('"', "");
        listfile = _img.replace("[", "").replace("]", "");
      }

      let avt = "";
      if (FileUpload !== "" && FileUpload.name !== undefined) {
        const formData = new FormData();
        formData.append("myFile", FileUpload);
        formData.append("Key", "PassportScan");
        const data = await mainAction.API_spCallPostFile(formData, dispatch);
        let _imgavt = data.Message.replaceAll('"', "");
        avt = _imgavt.replace("[", "").replace("]", "");
      }

      const pr = {
        CustomerId: CustomerId,
        CustomerCode: CustomerCode.trim(),
        CustomerName: CustomerName.trim(),
        CustomerNameVn: CustomerNameVn.trim(),
        Phone: Phone,
        Address: Address,
        Sex: Sex,
        Email: Email,
        IdentityCode: IdentityCode,
        Brithday: Brithday,
        PassportCode: PassportCode,
        PassportTimeFrom: PassportTimeFrom,
        PassportTimeTo: PassportTimeTo,
        PassportScan: avt,
        Files:
          CustomerId === 0
            ? listfile
            : listfile === ""
            ? Files
            : listfile + "," + Files,
        Notes: Notes,
        CustomerTypeId: CustomerTypeId,
        BranchId: BranchId,
        Creater: Creater,
        CreateName: CreateName,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomer_Save",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Cancel();
        Trl_spCustomer_List();
        setIsOpen(false); // close popup
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

  const [IsAcctive1, setIsAcctive1] = useState(false);
  const [IsAcctive2, setIsAcctive2] = useState(false);
  const onFileChange = (event) => {
    setFileUpload(event.target.files[0]);
    setPassportScan(URL.createObjectURL(event.target.files[0]));
  };

  const onFileChange1 = (event) => {
    let fileok = event.target.files;
    setFileUpload1(fileok);
    let filename = [...ViewFiles];
    for (let i = 0; i < fileok.length; i++) {
      filename.push(fileok[i].name);
    }
    setViewFiles(filename);
  };

  const Trl_spCustomer_FileDelete = (filename) => {
    if (window.confirm("Bạn có chắc muốn xóa file?")) {
      ;
      let fileold = Files, // list file gốc
        listfileok = "", // file sau khi đã xóa
        showdata = [...ViewFiles]; // list file đang hiển thị
      if (fileold !== undefined && fileold !== "") {
        ;
        let checkfile = fileold.split(",").filter((e) => e !== "");
        for (let i = 0; i < checkfile.length; i++) {
          const splitfn = checkfile[i].split("/").filter((e) => e !== "");
          if (splitfn[splitfn.length - 1] !== filename) {
            listfileok += checkfile[i] + ",";
          }
          if (splitfn[splitfn.length - 1] === filename) {
            const dbnew = showdata.filter((p) => p !== filename);
            setViewFiles(dbnew);
          }
        }
        
        setFiles(listfileok);
      }
    }
  };

  const Trl_spCustomer_ViewHistoryTour = async (item) => {
    setmodalIsOpenHistoryTour(true);
    try {
      const pr = {
        CustomerId: item._original.CustomerId,
        Creater: Creater,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spBooking_ListByCustomerId",
      };

      const listdata = await mainAction.API_spCallServer(params, dispatch);
      setDataHistoryTour(listdata);
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };
  const Trl_spCustomer_ViewVisa = async (item) => {
    setmodalIsOpenVisa(true);
    try {
      ;
      const prvs = {
        CustomerId: item._original.CustomerId,
        Creater: Creater,
      };

      const paramsvs = {
        Json: JSON.stringify(prvs),
        func: "Trl_spBooking_CustomerVisa_ListByCustomerId",
      };

      const listdata = await mainAction.API_spCallServer(paramsvs, dispatch);
      setDataVisa(listdata);
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spCustomer_View = (item) => {
    ;
    
    const obView = item._original;
    setBranchId(obView.BranchId);
    setCustomerId(obView.CustomerId);
    setCustomerCode(obView.CustomerCode);
    setCustomerName(obView.CustomerName);
    setCustomerNameVn(obView.CustomerNameVn);
    setPassportCode(obView.PassportCode);
    // setUserName(obView.UserName);
    // setPassword(obView.Password);
    // setPasswordcf(obView.Password);
    setPhone(obView.Phone);
    setAddress(obView.Address);
    setSex(obView.Sex);
    setEmail(obView.Email);
    setNotes(obView.Notes);
    setIdentityCode(obView.IdentityCode);
    setPassportScan(IMAGES_DOMAIN + obView.PassportScan);

    if (obView.Brithday !== undefined) {
      let bri = ConvertUTCDateToLocalDate(new Date(obView.Brithday));
      setBrithday(FormatDateJson(bri));
      setIsBrithday(bri);
    }

    if (obView.PassportTimeFrom !== undefined) {
      let ttw = ConvertUTCDateToLocalDate(new Date(obView.PassportTimeFrom));
      setPassportTimeFrom(FormatDateJson(ttw));
      setIsPassportTimeFrom(ttw);
    }
    if (obView.PassportTimeTo !== undefined) {
      let ttw = ConvertUTCDateToLocalDate(new Date(obView.PassportTimeTo));
      setPassportTimeTo(FormatDateJson(ttw));
      setIsPassportTimeTo(ttw);
    }

    if (obView.Files !== undefined && obView.Files !== "") {
      ;
      let checkfile = obView.Files.split(",").filter((e) => e !== "");
      let ListFileName = [];
      for (let i = 0; i < checkfile.length; i++) {
        const splitfn = checkfile[i].split("/");
        ListFileName.push(splitfn[splitfn.length - 1]);
      }
      
      setViewFiles(ListFileName);
    } else {
      setViewFiles([]);
    }
    setFiles(obView.Files);
    setBranchId(obView.BranchId);
    setCustomerTypeId(obView.CustomerTypeId);

    // open popup
    setIsOpen(true);
  };

  const Trl_spCustomer_Delete = (item) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return <ConfirmAlertUi onClose={onClose} item={item} />;
      },
    });
  };

  const Trl_spCustomer_Delete_Action = async (item) => {
    try {
      ;
      const pr = {
        Creater: Creater,
        CreateName: CreateName,
        CustomerId: item._original.CustomerId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomer_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spCustomer_List();
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
          <strong>{props.item._original.CustomerName}</strong>{" "}
        </p>
        <button className="btn btn-small btn-warning" onClick={props.onClose}>
          {" "}
          <i class="fa fa-undo"> </i> Hủy
        </button>
        <button
          className="btn btn-small btn-danger margin-left-5"
          onClick={() => {
            props.onClose();
            Trl_spCustomer_Delete_Action(props.item);
          }}
        >
          <i class="fa fa-trash"> </i> Xóa
        </button>
      </div>
    );
  };

  const columns = [
    {
      Header: "Lựa chọn",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-xs btn-success"
            onClick={(e) => Trl_spCustomer_View(row)}
          >
            {" "}
            <i class="far fa-edit"></i>Cập Nhật
          </button>
          {/* <button className="btn btn-xs btn-danger" onClick={e => Trl_spCustomer_Delete(row)}> <i class="fa fa-trash"></i> Xóa</button> | */}
          {/* <button className="btn btn-xs btn-warning" onClick={e => Trl_spCustomer_ViewHistoryTour(row)}> <i class="fa fa-history"></i>Booking</button> |
                    <button className="btn btn-xs btn-info" onClick={e => Trl_spCustomer_ViewVisa(row)}> <i class="fa fa-history"></i>Visa</button> */}
        </div>
      ),
      width: 100,
      fixed: "left",
    },
    {
      Header: "Mã KH",
      accessor: "CustomerCode",
      width: 200,
      fixed: "left",
    },
    {
      Header: "Tên KH",
      accessor: "CustomerName",
      width: 250,
      fixed: "left",
    },
    {
      Header: "Tên KH VN",
      accessor: "CustomerNameVn",
      width: 200,
    },
    {
      Header: "Ngày sinh",
      accessor: "Brithday",
      with: 100,
      Cell: (obj) => (
        <div>
          <span className="">
            {obj.value !== undefined ? FormatDateJson(obj.value, 7) : "N/A"}
          </span>
        </div>
      ),
    },
    {
      Header: "Giới tính",
      accessor: "Sex",
      with: 100,
    },

    {
      Header: "Hộ chiếu",
      accessor: "PassportCode",
      with: 100,
    },
    {
      Header: "Ảnh Hộ chiếu",
      accessor: "PassportScan",
      Cell: ({ row }) => {
        //spread the props
        if (
          row._original?.PassportScan &&
          (row._original?.PassportScan.includes(".jpg") ||
            row._original?.PassportScan.includes(".png"))
        ) {
          return (
            <div
              className="direct-chat-msg"
              data-toggle="tooltip"
              data-placement="top"
              title=""
            >
              <img
                className="direct-chat-img"
                src={IMAGES_DOMAIN + row._original?.PassportScan}
                alt=""
              />
            </div>
          );
        } else {
          return (
            <div>
              <span className="badge badge-danger">Chưa scan</span>
            </div>
          );
        }
      },
      with: 200,
    },
    {
      Header: "Ngày cấp HC",
      accessor: "PassportTimeFrom",
      with: 150,
      Cell: (obj) => (
        <div>
          <span className="">
            {obj.value !== undefined ? FormatDateJson(obj.value, 7) : "N/A"}
          </span>
        </div>
      ),
    },
    {
      Header: "Ngày hết hạn HC",
      accessor: "PassportTimeTo",
      with: 150,
      Cell: (obj) => (
        <div>
          <span className="">
            {obj.value !== undefined ? FormatDateJson(obj.value, 7) : "N/A"}
          </span>
        </div>
      ),
    },
    {
      Header: "Loại KH",
      accessor: "CustomerTypeName",
      with: 100,
    },
    {
      Header: "Chi nhánh",
      accessor: "BranchName",
      with: 100,
    },
    {
      Header: "CMND/CCCD",
      accessor: "IdentityCode",
      with: 100,
    },
    {
      Header: "Email",
      accessor: "Email",
      with: 100,
    },
    {
      Header: "SĐT",
      accessor: "Phone",
    },
    {
      Header: "Địa chỉ",
      accessor: "Address",
      width: 250,
    },
    {
      Header: "Files",
      accessor: "Files",
      with: 300,
      Cell: ({ row }) => {
        //spread the props
        const fls = row._original.Files.split(",").filter((e) => e !== "");
        return fls.map((fn, id) => {
          //let keyc = CheckTypeFile(fn);
          const splitfn = fls[id].split("/");
          const fname = splitfn[splitfn.length - 1];
          return (
            <a
              href={IMAGES_DOMAIN + fn}
              target="_blank"
              style={{ float: "left", marginleft: "5px" }}
            >
              {fname}
            </a>
          );
        });
      },
    },
    {
      Header: "Ghi chú",
      accessor: "Notes",
    },
    {
      Header: "Người tạo",
      accessor: "CreateName",
    },
    {
      Header: "Thời gian",
      accessor: "CreateTime",
      Cell: (obj) => (
        <div>
          <span className="">
            {obj.value !== undefined ? FormatDateJson(obj.value, 0) : "N/A"}
          </span>
        </div>
      ),
    },
    {
      Header: "Thời gian sửa",
      accessor: "EditTime",
      Cell: (obj) => (
        <div>
          <span className="">
            {obj.value !== undefined ? FormatDateJson(obj.value, 0) : "N/A"}
          </span>
        </div>
      ),
    },
    {
      Header: "Người Sửa",
      accessor: "EditName",
    },
  ];

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenHistoryTour, setmodalIsOpenHistoryTour] = useState(false);
  const [modalIsOpenVisa, setmodalIsOpenVisa] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setmodalIsOpenHistoryTour(false);
    setmodalIsOpenVisa(false);
  };

  const [valueSex, setvalueSex] = useState({ value: "Male", label: "Male" });
  const onSelecteSex = (item) => {
    setSex(item.value);
    setvalueSex(item);
  };
  return (
    <>
      <div className="content-wrapper">
        <div class="card-header border-left-red">
          <div class="row">
            <div class="col-sm-12 col-md-6">
              <h3 class="card-title font-weight-bold">
                Khách hàng({data.length})
              </h3>
            </div>
            <div class="col-sm-12 col-md-6 margin-top-5s">
              {/* <button onClick={VideAdd} type="button" class="btn btn-sm btn-success pull-right margin-left-5">
                            <i class="fa fa-plus pr-2"></i>
                            Thêm mới
                        </button> */}
              <button
                onClick={() => Trl_spCustomer_List(0)}
                type="button"
                class="btn btn-sm btn-success pull-right margin-left-5"
              >
                <i class="fa fa-search pr-2"></i>
                Tìm kiếm
              </button>
              <div class="form-group pull-right" style={{ marginTop: "-4px" }}>
                <div class="input-group" style={{ width: "100%" }}>
                  <input
                    type="text"
                    maxLength="500"
                    placeholder="SĐT,Email,Tên KH..."
                    class="form-control"
                    value={CustomerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                  />
                </div>
              </div>
              {/* <div class="form-group pull-right" style={{ marginTop: '-4px' }}>
                            <div class="input-group ">
                                <DateTimeRangePicker className="form-control2 px-1 pb-2px"
                                    value={DateSearch}
                                    onChange={date => setDateSearch(date)}
                                    format={"dd/MM/yyyy"}
                                />
                            </div>
                        </div> */}
            </div>
          </div>
        </div>

        <div class="card-body border-left-red">
          <div class="row">
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
          aria-labelledby="example-custom-modal-styling-title"
          className=" custom-modal-w-90"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              <div class="">
                {CustomerId === 0
                  ? "Thêm mới khách hàng"
                  : "Chỉnh sửa thông tin khách hàng " + CustomerName}
              </div>
            </Modal.Title>
            <button
              type="button"
              class="btn btn-xs btn-danger pull-right margin-left-5 close"
              aria-label="Close"
              onClick={closeModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            <div class="card-body">
              <div class="row">
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <span class="label">
                      Mã Khách Hàng<sup style={{ color: "#dc3545" }}>(*)</sup>
                    </span>
                    <div class="input-group">
                      <input
                        type="text"
                        maxLength="50"
                        class="form-control"
                        value={CustomerCode}
                        onChange={(e) => setCustomerCode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <span class="label">
                      Tên Khách Hàng<sup style={{ color: "#dc3545" }}>(*)</sup>
                    </span>
                    <div class="input-group">
                      <input
                        type="text"
                        maxLength="50"
                        class="form-control"
                        value={CustomerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <span class="label">Tên Khách Hàng VN</span>
                    <div class="input-group">
                      <input
                        type="text"
                        maxLength="50"
                        class="form-control"
                        value={CustomerNameVn}
                        onChange={(e) => setCustomerNameVn(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <span class="label">Giới Tính</span>
                    <div class="input-group">
                      <Select
                        className="SelectMeno"
                        value={valueSex}
                        onChange={onSelecteSex}
                        options={[
                          { value: "Male", label: "Male" },
                          { value: "Female", label: "Female" },
                          { value: "Orther", label: "Orther" },
                        ]}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <span class="label">
                      Sinh Nhật<sup style={{ color: "#dc3545" }}>(*)</sup>
                    </span>
                    <div class="input-group" style={{ height: "38px" }}>
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="fas fa-gift"></i>
                        </span>
                      </div>
                      <DateTimePicker
                        className="z-index-1k"
                        onChange={onBrithday}
                        value={IsBrithday}
                        format={"dd/MM/yyyy"}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <span class="label">Số Điện Thoại</span>
                    <div class="input-group">
                      <input
                        type="text"
                        maxLength="50"
                        class="form-control"
                        value={Phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div class="col-sm-12 col-md-6">
                  <div class="form-group">
                    <span class="label">Địa Chỉ</span>
                    <div class="input-group">
                      <input
                        type="text"
                        maxLength="500"
                        class="form-control"
                        value={Address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <span class="label">
                      CMND/CCCD<sup style={{ color: "#dc3545" }}>(*)</sup>
                    </span>
                    <div class="input-group">
                      <input
                        type="text"
                        maxLength="50"
                        class="form-control"
                        value={IdentityCode}
                        onChange={(e) => setIdentityCode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <span class="label">
                      Số Hộ Chiếu<sup style={{ color: "#dc3545" }}>(*)</sup>
                    </span>
                    <div class="input-group">
                      <input
                        type="text"
                        maxLength="50"
                        class="form-control"
                        value={PassportCode}
                        onChange={(e) => setPassportCode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <span class="label">
                      Ngày Cấp<sup style={{ color: "#dc3545" }}>(*)</sup>
                    </span>
                    <div class="input-group" style={{ height: "38px" }}>
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="far fa-calendar-check"></i>
                        </span>
                      </div>
                      <DateTimePicker
                        className="z-index-1k"
                        onChange={onPassportTimeFrom}
                        value={IsPassportTimeFrom}
                        format={"dd/MM/yyyy"}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <span class="label">
                      Ngày Hết<sup style={{ color: "#dc3545" }}>(*)</sup>
                    </span>
                    <div class="input-group" style={{ height: "38px" }}>
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="far fa-calendar-times"></i>
                        </span>
                      </div>
                      <DateTimePicker
                        className="z-index-1k"
                        onChange={onPassportTimeTo}
                        value={IsPassportTimeTo}
                        format={"dd/MM/yyyy"}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <span class="label">
                      Loại Khách Hàng<sup style={{ color: "#dc3545" }}>(*)</sup>
                    </span>
                    <div class="input-group">
                      <SelectCustomerType
                        onSelected={(item) => setCustomerTypeId(item.value)}
                        CustomerTypeId={CustomerTypeId}
                        onCustomerTypeId={CustomerTypeId}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <span class="label">
                      Chi Nhánh<sup style={{ color: "#dc3545" }}>(*)</sup>
                    </span>
                    <div class="input-group">
                      <SelectBranch
                        onSelected={(item) => setBranchId(item.value)}
                        BranchId={-1}
                        onBranchId={BranchId}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-6">
                  <div class="form-group">
                    <span class="label">Email</span>
                    <div class="input-group">
                      <input
                        type="text"
                        maxLength="200"
                        class="form-control"
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-12">
                  <div class="form-group">
                    <span class="label">Ghi Chú</span>
                    <div class="input-group">
                      <input
                        type="text"
                        maxLength="500"
                        class="form-control"
                        value={Notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div class="col-sm-12 col-md-6">
                  <div className="form-collapse-default mt-4">
                    <div className="row">
                      <a className="form-collapse-link text-uppercase">
                        Files
                        <span className="form__title__note"> (*)</span>
                      </a>
                    </div>
                    <div className="row pb-3">
                      <div className="col-sm-12 col-md-4">
                        <label class="image-collapse-label">
                          <input
                            type="file"
                            className="image-collapse-file"
                            onChange={onFileChange1}
                            accept="*"
                            multiple
                          />
                          <i className="fa fa-file upload-file-btn"></i>
                          <span className="image-collapse-span">
                            Upload Excel, PDF, Work...
                          </span>
                        </label>
                      </div>
                      <div className="col-sm-12 col-md-8">
                        {ViewFiles.map((filename, index) => {
                          return (
                            <div className="margin-top-5 hover-deletefile">
                              <i
                                className="fa fa-trash"
                                onClick={(e) =>
                                  Trl_spCustomer_FileDelete(filename)
                                }
                              ></i>{" "}
                              {filename}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-sm-12 col-md-6">
                  <div className="row">
                    <div className="form-collapse-default mt-4">
                      <div className="row">
                        <a className="form-collapse-link text-uppercase">
                          Passport
                          <span className="form__title__note"> (*)</span>
                        </a>
                      </div>
                      {IsAcctive2 ? (
                        ""
                      ) : (
                        <div className="row">
                          <div className="col-md-12 pb-3">
                            {PassportScan ? (
                              <label class="image-collapse-label">
                                <input
                                  type="file"
                                  className="image-collapse-file"
                                  onChange={onFileChange}
                                  accept="image/*"
                                />
                                <img
                                  src={PassportScan === "" ? "" : PassportScan}
                                  className="image-collapse-image"
                                  onChange={onFileChange}
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
                                  Upload Passport
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-12">
                  <button
                    type="button"
                    class="btn btn-sm btn-danger pull-right margin-left-5"
                    onClick={() => {
                      ConfirmAlert(
                        "Xác nhận",
                        "Bạn có muốn xóa những gì đã nhập!",
                        () => {
                          Cancel();
                        }
                      );
                    }}
                  >
                    <i class="fa fa-trash pr-2"></i>
                    Hủy
                  </button>

                  <button
                    type="button"
                    class="btn btn-sm btn-success pull-right"
                    onClick={() => {
                      ConfirmAlert("Xác nhận", "Bạn có muốn lưu không?", () => {
                        Trl_spCustomer_Save();
                      });
                    }}
                  >
                    <i class="fa fa-edit pr-2"></i>
                    {CustomerId === 0 ? " Thêm mới" : "Chỉnh sửa"}
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

        <Modal
          show={modalIsOpenHistoryTour}
          onHide={closeModal}
          aria-labelledby="example-custom-modal-styling-title"
          className=" custom-modal-w-90"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              <div class="">
                Lịch sử Tour/Booking : ({DataHistoryTour.length})
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="card-body" style={{ background: "#dddddd" }}>
              {DataHistoryTour?.map((item, index) => {
                return (
                  <div class="tickets-container mb-2">
                    <div class="item">
                      <div class="item-right text-center">
                        <h6 className="mt-2" style={{ color: "#06c3b4" }}>
                          {item.BookingName}
                        </h6>
                        <h2 class="num">TỪ : {item.GoFrom}</h2>
                        <p class="ref mt-2" style={{ fontStyle: "italic" }}>
                          <b>
                            {item.BookingCode} | Thời gian :{" "}
                            {FormatDateJson(item.TimeStart, 7)} -{" "}
                            {FormatDateJson(item.TimeEnd, 7)}
                          </b>
                        </p>
                        <div class="buy">
                          <span class="up-border"></span>
                          <span class="down-border"></span>
                        </div>
                      </div>

                      <div class="item-left">
                        <div class="icons mt-5">
                          <p class="day">
                            <iconify-icon
                              icon="ph:bed-thin"
                              width="32"
                              height="32"
                            ></iconify-icon>{" "}
                            {item.CustomerName}
                          </p>

                          <p class="day">
                            <iconify-icon
                              icon="ph:battery-charging-thin"
                              width="32"
                              height="32"
                            ></iconify-icon>{" "}
                            Giảm : {FormatMoney(item.PriceTour_Discount)}
                          </p>
                        </div>
                        <div class="icons mt-5">
                          <p class="day">
                            <iconify-icon
                              icon="ph:bed-thin"
                              width="32"
                              height="32"
                            ></iconify-icon>{" "}
                            Giá : {FormatMoney(item.PriceTour)}
                          </p>
                          <p class="day">
                            <iconify-icon
                              icon="ph:battery-charging-thin"
                              width="32"
                              height="32"
                            ></iconify-icon>{" "}
                            Phụ phí : {FormatMoney(item.PriceTour_Surcharge)}
                          </p>
                        </div>
                        <div class="icons mt-5">
                          <p class="day">
                            <iconify-icon
                              icon="ph:bed-thin"
                              width="32"
                              height="32"
                            ></iconify-icon>
                            <span className="Statusticked">
                              {item.StatusName}
                            </span>
                          </p>
                          <p class="day">
                            <iconify-icon
                              icon="ph:bed-thin"
                              width="32"
                              height="32"
                            ></iconify-icon>
                            <span style={{ fontSize: "8px" }}>
                              {" "}
                              ({item.Note})
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={modalIsOpenVisa}
          onHide={closeModal}
          aria-labelledby="example-custom-modal-styling-title"
          className=" custom-modal-w-90"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              <div class="">Lịch sử Visa : ({DataVisa.length})</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="card-body" style={{ background: "#dddddd" }}>
              {DataVisa?.map((item2, index) => {
                return (
                  <div class="tickets-container mb-2">
                    <div class="item">
                      <div class="item-right text-center">
                        <h6 className="mt-2" style={{ color: "#06c3b4" }}>
                          {item2.VisaName}
                        </h6>
                        <p class="ref mt-2" style={{ fontStyle: "italic" }}>
                          <b>
                            {" "}
                            Thời gian : {FormatDateJson(
                              item2?.FromDate,
                              7
                            )} - {FormatDateJson(item2?.ToDate, 7)}
                          </b>
                        </p>
                        <p class="ref mt-2" style={{ fontStyle: "italic" }}>
                          <b> Mã Booking: {item2?.BookingCode}</b>
                        </p>

                        <div class="buy">
                          <span class="up-border"></span>
                          <span class="down-border"></span>
                        </div>
                      </div>

                      <div class="item-left">
                        <div class="icons mt-5">
                          <p class="day">
                            <iconify-icon
                              icon="ph:bed-thin"
                              width="32"
                              height="32"
                            ></iconify-icon>{" "}
                            {item2.CustomerName}
                          </p>

                          <p class="day">
                            <iconify-icon
                              icon="ph:battery-charging-thin"
                              width="32"
                              height="32"
                            ></iconify-icon>{" "}
                            Giảm : {FormatMoney(item2.PriceTour_Discount)}
                          </p>
                        </div>
                        <div class="icons mt-5">
                          <p class="day">
                            <iconify-icon
                              icon="ph:bed-thin"
                              width="32"
                              height="32"
                            ></iconify-icon>{" "}
                            Giá : {FormatMoney(item2.PriceTour)}
                          </p>
                          <p class="day">
                            <iconify-icon
                              icon="ph:battery-charging-thin"
                              width="32"
                              height="32"
                            ></iconify-icon>{" "}
                            Phụ phí : {FormatMoney(item2.PriceTour_Surcharge)}
                          </p>
                        </div>
                        <div class="icons mt-5">
                          <p class="day">
                            <iconify-icon
                              icon="ph:bed-thin"
                              width="32"
                              height="32"
                            ></iconify-icon>
                            <span className="Statusticked">
                              {item2.StatusName}
                            </span>
                          </p>
                          <p class="day">
                            <iconify-icon
                              icon="ph:bed-thin"
                              width="32"
                              height="32"
                            ></iconify-icon>
                            <span style={{ fontSize: "8px" }}>
                              {" "}
                              ({item2.Note})
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

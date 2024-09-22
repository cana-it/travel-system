import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  FormatDateJson,
  ConvertUTCDateToLocalDate,
} from "../../../../Utils";
import {
  DataTable,
  SelectBranch,
  SelectDepartment,
  SelectDepartmentMulti,
  SelectPostion,
} from "../../../../Common";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";
import { IMAGES_DOMAIN } from "../../../../Services";
//import Modal from 'react-modal';
import { confirmAlert } from "react-confirm-alert"; // Import
import { useLocation } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import $ from "jquery";


export const Staff = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const location = useLocation();
  const [IsTimestartwork, setIsTimestartwork] = useState();
  const [data, setData] = useState([]);
  const [DepartmentId_List, setDepartmentId_List] = useState(0);
  const [BranchId_List, setBranchId_List] = useState(0);
  const [StaffSearch, setStaffSearch] = useState("");
  const [StaffId, setStaffId] = useState(0);
  const [StaffCode, setStaffCode] = useState("");
  const [StaffName, setStaffName] = useState("");
  const [UserName, setUserName] = useState("");
  const [Password, setPassword] = useState("");
  const [Passwordcf, setPasswordcf] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [Sex, setSex] = useState("Male");
  const [Email, setEmail] = useState("");
  const [Avatar, setAvatar] = useState("");
  const [IdentityCode, setIdentityCode] = useState("");
  const [Brithday, setBrithday] = useState("");
  const [Timestartwork, setTimestartwork] = useState("");
  const [DepartmentId, setDepartmentId] = useState(0);
  const [BranchId, setBranchId] = useState(0);
  const [Files, setFiles] = useState();
  const [ViewFiles, setViewFiles] = useState([]);
  const [FileUpload, setFileUpload] = useState("");
  const [FileUpload1, setFileUpload1] = useState("");
  const [IsActive, setIsActive] = useState();
  const [DepartMulti, setDepartMulti] = useState([]);
  const [PassportCode, setPassportCode] = useState("");
  const [ActiveDate, setActiveDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [PositionID, setPositionID] = useState(0);
  const [PositionName, setPositionName] = useState("");
  const [PasswordView, setPasswordView] = useState("");
  const [modalIsOpenPass, setmodalIsOpenPass] = useState(false);

  //do thêm cột nên bổ sung phần này
  const [staffInfo, setStaffInfo] = useState({
    StaffId: 0,
    IdentityDate: null,
    IdentityPlace: "",
    PermanentAddress: "",
    TemporaryAddress: "",
    ContractCode: "",
    ContractType: "",
    ContractNumberSigning: "",
    RemainingAnnualLeave: "",
    NumberOfDaysOff: "",
    Education: "",
    ProfileStatus: "",
    MaritalStatus: "",
    DateOfEmployment: null,
  });

  useEffect(() => {
    const pr = new URLSearchParams(location.search);
    if (pr.get("BrandId") !== null) {
      setBranchId_List(parseInt(pr.get("BrandId")));
      setDepartmentId_List(parseInt(pr.get("DepartmentId")));

      Trl_spStaff_List(pr.get("BrandId"), pr.get("DepartmentId"), 1);
    } else {
      Trl_spStaff_List(0, 0, 0);
    }
  }, []);

  const onTimestartwork = (item) => {
    setIsTimestartwork(item);
    setTimestartwork(FormatDateJson(item));
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
    setStaffId(0);
    setStaffCode("");
    setStaffName("");
    setUserName("");
    setPassword("");
    setPasswordcf("");
    setPhone("");
    setAddress("");
    setSex("");
    setEmail("");
    setIdentityCode("");
    setAvatar("");
    setFiles("");
    setFileUpload("");
    setFileUpload1("");
    setViewFiles([]);
    setBranchId(0);
    setDepartmentId(0);
    setBrithday("");
    setTimestartwork("");
    setStaffInfo({
      StaffId: 0,
      IdentityDate: null,
      IdentityPlace: "",
      PermanentAddress: "",
      TemporaryAddress: "",
      ContractCode: "",
      ContractType: "",
      ContractNumberSigning: "",
      RemainingAnnualLeave: "",
      NumberOfDaysOff: "",
      Education: "",
      ProfileStatus: "",
      MaritalStatus: "",
      DateOfEmployment: null,
    });
    $(".react-datetime-picker__clear-button").click();
  };

  const Setitem = (item) => {
    setPositionID(item.value);
    setPositionName(item.label);
  };

  const Trl_spStaff_List = async (BrandId, DepartmentId, Keys) => {
    try {
      const pr = {
        // DepartmentId:'0',
        DepartmentId: Keys === 1 ? DepartmentId : DepartmentId_List,
        BranchId: 0,
        StaffSearch: StaffSearch,
        StaffId: 0,
        Creater: Creater,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spStaff_List",
      };

      const list = await mainAction.API_spCallServer(params, dispatch);
      setData(list);
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };

  const Trl_spStaff_Save = async () => {
    let FollowIds = "";
    if (
      DepartMulti.length > 0 &&
      DepartMulti !== "" &&
      DepartMulti !== undefined
    ) {
      DepartMulti.forEach((item, index) => {
        FollowIds += item.value + ";";
      });
    } else FollowIds = "Chưa quản lý phòng ban nào";

    try {
      if (StaffCode === "") {
        Alertwarning("Nhập mã nhân viên");
        return;
      }

      if (StaffName === "") {
        Alertwarning("Nhập tên nhân viên");
        return;
      }
      if (StaffName.length <= 5) {
        Alertwarning("Nhập tên nhân viên > 5 kí tự");
        return;
      }
      if (Brithday === "") {
        Alertwarning("Nhập ngày sinh nhật");
        return;
      }

      if (Phone !== undefined && Phone !== "" && Phone.length <= 9) {
        Alertwarning("SĐT phải 10 số trở lên");
        return;
      }
      if (UserName === "") {
        Alertwarning("Nhập tên đăng nhập");
        return;
      }
      if (UserName.length < 4) {
        Alertwarning("Nhập tên đăng nhập > 4 kí tự");
        return;
      }
      if (Password === "") {
        Alertwarning("Nhập Password");
        return;
      }
      if (Password.length < 8) {
        Alertwarning("Nhập Password >= 8");
        return;
      }
      if (Password !== Passwordcf) {
        Alertwarning("Xác nhận mật khẩu không đúng");
        return;
      }
      if (BranchId === 0) {
        Alertwarning("Chọn chi nhánh làm việc");
        return;
      }
      if (DepartmentId === 0) {
        Alertwarning("Chọn phòng ban làm việc");
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

      let date = new Date();
      let fdate = FormatDateJson(date);
      let active = "",
        end = "";

      if (ActiveDate !== "" && ActiveDate !== undefined) {
        active = FormatDateJson(ActiveDate);
      } else {
        active = fdate;
      }

      if (EndDate !== "" && EndDate !== undefined) {
        end = FormatDateJson(EndDate);
      } else {
        end = fdate;
      }

      let avt = "";
      if (FileUpload !== "" && FileUpload.name !== undefined) {
        const formData = new FormData();
        formData.append("myFile", FileUpload);
        formData.append("Key", "Avatar");
        const data = await mainAction.API_spCallPostFile(formData, dispatch);
        let _imgavt = data.Message.replaceAll('"', "");
        avt = _imgavt.replace("[", "").replace("]", "");
      }

      const pr = {
        StaffId: StaffId,
        StaffCode: StaffCode.trim(),
        StaffName: StaffName.trim(),
        NickName: UserName.trim(),
        UserName: UserName.trim(),
        Password: Password.trim(),
        Phone: Phone,
        Address: Address,
        Sex: Sex,
        Email: Email,
        IdentityCode: IdentityCode,
        Brithday: Brithday,
        Timestartwork: Timestartwork,
        Avatar: avt,
        Files:
          StaffId === 0
            ? listfile
            : listfile === ""
            ? Files
            : listfile + "," + Files,
        PassportCode: PassportCode,
        PassportTimeFrom: active,
        PassportTimeTo: end,
        DepartmentManage: FollowIds,
        DepartmentId: DepartmentId,
        BranchId: BranchId,
        PositionId: PositionID,
        PositionName: PositionName,
        Creater: Creater,
        CreateName: CreateName,
        IdentityDate: staffInfo?.IdentityDate
          ? FormatDateJson(staffInfo?.IdentityDate, 1)
          : null,
        IdentityPlace: staffInfo.IdentityPlace,
        PermanentAddress: staffInfo.PermanentAddress,
        TemporaryAddress: staffInfo.TemporaryAddress,
        ContractCode: staffInfo.ContractCode,
        ContractType: staffInfo.ContractType,
        ContractNumberSigning: staffInfo.ContractNumberSigning,
        RemainingAnnualLeave: staffInfo.RemainingAnnualLeave,
        NumberOfDaysOff: staffInfo.NumberOfDaysOff,
        Education: staffInfo.Education,
        ProfileStatus: staffInfo.ProfileStatus,
        MaritalStatus: staffInfo.MaritalStatus,
        DateOfEmployment: staffInfo?.DateOfEmployment
          ? FormatDateJson(staffInfo?.DateOfEmployment, 1)
          : null,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spStaff_Save",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Cancel();
        Trl_spStaff_List(0, 0, 0);
        setPassportCode("");
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
  };

  const [IsAcctive2, setIsAcctive2] = useState(false);
  const onFileChange = (event) => {
    setFileUpload(event.target.files[0]);
    setAvatar(URL.createObjectURL(event.target.files[0]));
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

  const Trl_spStaff_FileDelete = (filename) => {
    if (window.confirm("Bạn có chắc muốn xóa file?")) {
      let fileold = Files, // list file gốc
        listfileok = "", // file sau khi đã xóa
        showdata = [...ViewFiles]; // list file đang hiển thị
      if (fileold !== undefined && fileold !== "") {
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

  const Trl_spStaff_View = (item) => {
    const obView = item._original;
    setBranchId(obView.BranchId);
    setStaffId(obView.StaffId);
    setStaffCode(obView.StaffCode);
    setStaffName(obView.StaffName);
    setUserName(obView.UserName);
    setPassword(obView.Password);
    setPasswordcf(obView.Password);
    setPhone(obView.Phone);
    setAddress(obView.Address);
    setSex(obView.Sex);
    setEmail(obView.Email);
    setPassportCode(obView.PassportCode);
    obView?.PassportTimeFrom &&
      setActiveDate(new Date(obView.PassportTimeFrom));
    obView?.PassportTimeTo && setEndDate(new Date(obView.PassportTimeTo));
    // Setitem(obView.PositionId)
    setPositionID(obView.PositionId);
    setPositionName(obView.PositionName);
    // setDepartMulti(obView.DepartmentManage)
    setIdentityCode(obView.IdentityCode);
    setAvatar(IMAGES_DOMAIN + obView.Avatar);
    setStaffInfo({
      IdentityDate: obView?.IdentityDate
        ? new Date(obView?.IdentityDate)
        : null,
      IdentityPlace: obView.IdentityPlace,
      PermanentAddress: obView.PermanentAddress,
      TemporaryAddress: obView.TemporaryAddress,
      ContractCode: obView.ContractCode,
      ContractType: obView.ContractType,
      ContractNumberSigning: obView.ContractNumberSigning,
      Education: obView.Education,
      ProfileStatus: obView.ProfileStatus,
      MaritalStatus: obView.MaritalStatus,
      DateOfEmployment: obView?.DateOfEmployment
        ? new Date(obView?.DateOfEmployment)
        : null,
    });

    if (obView.Brithday !== undefined) {
      let bri = ConvertUTCDateToLocalDate(new Date(obView.Brithday));
      setBrithday(FormatDateJson(bri));
      setIsBrithday(bri);
    }

    if (obView.Timestartwork !== undefined) {
      let ttw = ConvertUTCDateToLocalDate(new Date(obView.Timestartwork));
      setTimestartwork(FormatDateJson(ttw));
      setIsTimestartwork(ttw);
    }

    if (obView.Files !== undefined && obView.Files !== "") {
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
    setDepartmentId(obView.DepartmentId);

    // open popup
    setIsOpen(true);
  };

  const Trl_spStaff_Delete = (item) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return <ConfirmAlertUi onClose={onClose} item={item} />;
      },
    });
  };

  const Trl_spStaff_Delete_Action = async (item) => {
    try {
      const pr = {
        Creater: Creater,
        CreateName: CreateName,
        StaffId: item._original.StaffId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spStaff_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spStaff_List();
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.ReturnMess);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
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
            Trl_spStaff_Delete_Action(props.item);
          }}
        >
          <i class="fa fa-trash"> </i> Xóa
        </button>
      </div>
    );
  };

  const Trl_spStaff_ViewPass = (item) => {
    setPasswordView(item._original.Password);
    setmodalIsOpenPass(true);
  };

  const Trl_spStaff_BlockUser = async (item) => {
    const pr = {
      Creater: Creater,
      StaffId: item._original.StaffId,
    };

    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spStaff_BlockUser",
    };
    const result = await mainAction.API_spCallServer(params, dispatch);
    Alertsuccess(result.ReturnMess);
    let rows = data.find((e) => e.StaffId === item._original.StaffId);
    rows.BlockUser = rows.BlockUser === 1 ? 0 : 1;
  };

  const columns = [
    {
      Header: "Lựa chọn",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-xs btn-success"
            onClick={(e) => Trl_spStaff_View(row)}
          >
            {" "}
            <i class="fa fa-eye"></i> Sửa
          </button>{" "}
          <button
            className="btn btn-xs btn-danger pr-2"
            onClick={(e) => Trl_spStaff_Delete(row)}
          >
            {" "}
            <i class="fa fa-trash"></i> Xóa
          </button>{" "}
          {row._original.IsBlockUser === 1 ? (
            <>
              <button
                className={
                  row._original.BlockUser === 1
                    ? "btn btn-xs btn-primary pr-2"
                    : " btn btn-xs btn-warning pr-2"
                }
                onClick={(e) => Trl_spStaff_BlockUser(row)}
              >
                {" "}
                <i
                  class={
                    row._original.BlockUser === 1 ? "fa fa-unlock" : "fa fa-ban"
                  }
                ></i>{" "}
                {row._original.BlockUser === 1 ? "Mở khóa" : " Khóa User"}
              </button>{" "}
            </>
          ) : (
            ""
          )}
          <>
            <button
              className="btn btn-xs btn-info pr-2"
              onClick={(e) => Trl_spStaff_ViewPass(row)}
            >
              {" "}
              <i class="fa fa-eye"></i> Mật khẩu
            </button>
            <span></span>
          </>
        </div>
      ),
      width: 300,
      fixed: "left",
    },
    {
      Header: "Tên Nhân Viên",
      accessor: "StaffName",
      width: 200,
      fixed: "left",
    },
    {
      Header: "Mã Nhân Viên",
      accessor: "StaffCode",
      fixed: "left",
      width: 150,
    },

    {
      Header: "Tên đăng nhập",
      accessor: "UserName",
      width: 150,
    },
    {
      Header: "Ảnh",
      accessor: "Avatar",
      Cell: (obj) => (
        <div className="direct-chat-msg">
          <img
            className="direct-chat-img"
            src={IMAGES_DOMAIN + obj.value}
            alt="message user image"
          />
        </div>
      ),
      width: 80,
    },
    {
      Header: "Ngày sinh",
      accessor: "Brithday",
      Cell: (obj) => (obj?.value ? FormatDateJson(obj.value, 10) : ""),
      width: 150,
    },
    {
      Header: "Giới tính",
      accessor: "Sex",
      width: 100,
    },
    {
      Header: "Số điện thoại",
      accessor: "Phone",
      width: 150,
    },
    {
      Header: "Chức danh",
      accessor: "PositionName",
      width: 100,
    },
    {
      Header: "Phòng ban",
      accessor: "DepartmentName",
      width: 150,
    },
    {
      Header: "Ngày nhận việc",
      accessor: "Timestartwork",
      Cell: (obj) => (obj?.value ? FormatDateJson(obj.value, 10) : ""),
      width: 150,
    },

    {
      Header: "Số hđ",
      accessor: "ContractCode",
      width: 100,
    },
    {
      Header: "Loại hđ",
      accessor: "ContractType",
      width: 100,
    },

    {
      Header: "Số lần kí hđ",
      accessor: "ContractNumberSigning",
      width: 100,
    },
    {
      Header: "Số phép năm còn lại",
      accessor: "RemainingAnnualLeave",
      width: 100,
    },
    {
      Header: "Ngày nghỉ phép",
      accessor: "NumberOfDaysOff",
      width: 100,
    },
    {
      Header: "Trình độ/Chuyên Ngành",
      accessor: "Education",
      width: 200,
    },

    {
      Header: "Tình trạng hồ sơ",
      accessor: "ProfileStatus",
      width: 150,
    },
    {
      Header: "Tình trạng hôn nhân",
      accessor: "MaritalStatus",
      width: 150,
    },

    {
      Header: "CMND/CCCD",
      accessor: "IdentityCode",
      width: 150,
    },
    {
      Header: "Ngày cấp",
      accessor: "IdentityDate",
      Cell: (obj) => (obj?.value ? FormatDateJson(obj.value, 10) : ""),
      width: 150,
    },
    {
      Header: "Nơi cấp",
      accessor: "IdentityPlace",
      width: 200,
    },
    {
      Header: "Địa chỉ thường trú",
      accessor: "PermanentAddress",
      width: 200,
    },
    {
      Header: "Địa chỉ tạm trú",
      accessor: "TemporaryAddress",
      width: 200,
    },
    {
      Header: "Email cá nhân",
      accessor: "Email",
      width: 100,
    },
    // {
    //   Header: "Files",
    //   accessor: "Files",
    //   with: 300,
    //   Cell: ({ row }) => {
    //     //spread the props
    //     const fls = row._original.Files.split(",").filter((e) => e !== "");
    //     return fls.map((fn, id) => {
    //       //let keyc = CheckTypeFile(fn);
    //       const splitfn = fls[id].split("/");
    //       const fname = splitfn[splitfn.length - 1];
    //       return (
    //         <a
    //           href={IMAGES_DOMAIN + fn}
    //           target="_blank"
    //           style={{ float: "left", marginleft: "5px" }}
    //         >
    //           {fname}
    //         </a>
    //       );
    //     });
    //   },
    // },
    {
      Header: "Người tạo",
      accessor: "CreateName",
    },
    {
      Header: "Thời gian",
      accessor: "CreateTime",
      Cell: (obj) => (obj?.value ? FormatDateJson(obj.value, 10) : ""),
    },
    {
      Header: "Người Sửa",
      accessor: "EditName",
    },
    {
      Header: "Thời gian sửa",
      accessor: "EditTime",
      Cell: (obj) => (obj?.value ? FormatDateJson(obj.value, 10) : ""),
    },
  ];

  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setmodalIsOpenPass(false);
  };

  const [valueSex, setvalueSex] = useState({ value: "Male", label: "Male" });
  const onSelecteSex = (item) => {
    setSex(item.value);
    setvalueSex(item);
  };

  return (
    <>
      <div className="content-wrapper staff-content">
        <div class="border-left-red card-header  bg-ab ">
          <div class="row ">
            <div class="col-sm-12 col-md-2 cardtext ">
              <h3 class="card-title font-weight-bold ">
                Nhân viên ({data.length})
              </h3>
            </div>
            <div class="col-sm-12 col-md-10 margin-top-5s">
              <button
                onClick={VideAdd}
                type="button"
                class="btn btn-sm btn-success pull-right margin-left-10"
              >
                <i class="fa fa-plus pr-2"></i>
                Thêm mới
              </button>

              <button
                onClick={Trl_spStaff_List}
                type="button"
                class="btn btn-sm btn-danger pull-right margin-left-10"
              >
                <i class="fa fa-search pr-2"></i>
                Tìm kiếm
              </button>
              <div
                class="form-group pull-right"
                style={{ marginTop: "-4px", width: "20%" }}
              >
                <div class="input-group" style={{ width: "100%" }}>
                  <input
                    type="text"
                    maxLength="500"
                    placeholder="SĐT,Email,Tên..."
                    class="form-control"
                    value={StaffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                  />
                </div>
              </div>
              <div
                class="form-group pull-right"
                style={{ marginTop: "-4px", width: "20%" }}
              >
                <div class="input-group index-select" style={{ width: "100%" }}>
                  <SelectDepartment
                    onSelected={(item) => setDepartmentId_List(item.value)}
                    BranchId={BranchId_List}
                    onDepartmentId={DepartmentId_List}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card-body border-left-red margin-top-35">
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
          className=" custom-modal-w-90"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header className="p-2">
            <Modal.Title id="example-custom-modal-styling-title">
              <div class="">
                {StaffId === 0
                  ? "Thêm mới nhân viên"
                  : "Chỉnh sửa thông tin nhân viên " + StaffName}
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
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Mã nhân viên(
                      <strong className="check-point">*</strong>)
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={StaffCode}
                      onChange={(e) => setStaffCode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Tên nhân viên(
                      <strong className="check-point">*</strong>)
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={StaffName}
                      onChange={(e) => setStaffName(e.target.value)}
                    />
                  </div>
                </div>
                {/* <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      NickName
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={NickName}
                      onChange={(e) => setNickName(e.target.value)}
                    />
                  </div>
                </div> */}
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Ngày sinh(<strong className="check-point">*</strong>)
                    </span>
                    <DateTimePicker
                      onChange={onBrithday}
                      value={IsBrithday}
                      format="dd/MM/yyyy"
                      className={"form-control2"}
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Giới tính
                    </span>

                    <Select
                      className="select-custom"
                      value={valueSex}
                      onChange={onSelecteSex}
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Other", label: "Other" },
                      ]}
                    />
                  </div>
                </div>

                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      CMND/CCCD
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={IdentityCode}
                      onChange={(e) => setIdentityCode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Ngày cấp
                    </span>
                    <DateTimePicker
                      onChange={(e) =>
                        setStaffInfo({ ...staffInfo, IdentityDate: e })
                      }
                      value={staffInfo.IdentityDate}
                      format="dd/MM/yyyy"
                      className={"form-control2"}
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Nơi cấp
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={staffInfo.IdentityPlace}
                      onChange={(e) =>
                        setStaffInfo({
                          ...staffInfo,
                          IdentityPlace: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">SĐT</span>
                    <input
                      type="text"
                      class="form-control2"
                      value={Phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">Email</span>
                    <input
                      type="text"
                      class="form-control2"
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Địa chỉ thường trú
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={staffInfo.PermanentAddress}
                      onChange={(e) =>
                        setStaffInfo({
                          ...staffInfo,
                          PermanentAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Địa chỉ tạm trú
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={staffInfo.TemporaryAddress}
                      onChange={(e) =>
                        setStaffInfo({
                          ...staffInfo,
                          TemporaryAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Số hợp đồng
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={staffInfo.ContractCode}
                      onChange={(e) =>
                        setStaffInfo({
                          ...staffInfo,
                          ContractCode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Loại hợp đồng
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={staffInfo.ContractType}
                      onChange={(e) =>
                        setStaffInfo({
                          ...staffInfo,
                          ContractType: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Số lần ký hợp đồng
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={staffInfo.ContractNumberSigning}
                      onChange={(e) =>
                        setStaffInfo({
                          ...staffInfo,
                          ContractNumberSigning: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                {/* <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Số phép năm còn lại
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={staffInfo.RemainingAnnualLeave}
                      onChange={(e) =>
                        setStaffInfo({
                          ...staffInfo,
                          RemainingAnnualLeave: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Số ngày nghỉ
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={staffInfo.NumberOfDaysOff}
                      onChange={(e) =>
                        setStaffInfo({
                          ...staffInfo,
                          NumberOfDaysOff: e.target.value,
                        })
                      }
                    />
                  </div>
                </div> */}
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Trình độ/chuyên ngành
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={staffInfo.Education}
                      onChange={(e) =>
                        setStaffInfo({
                          ...staffInfo,
                          Education: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Tình trạng hồ sơ
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={staffInfo.ProfileStatus}
                      onChange={(e) =>
                        setStaffInfo({
                          ...staffInfo,
                          ProfileStatus: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Tình trạng hôn nhân
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={staffInfo.MaritalStatus}
                      onChange={(e) =>
                        setStaffInfo({
                          ...staffInfo,
                          MaritalStatus: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Ngày nhận việc
                    </span>
                    <DateTimePicker
                      onChange={onTimestartwork}
                      value={IsTimestartwork}
                      format="dd/MM/yyyy"
                      className={"form-control2"}
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Tên đăng nhập(<strong className="check-point">*</strong>)
                    </span>
                    <input
                      type="text"
                      class="form-control2"
                      value={UserName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Mật khẩu(<strong className="check-point">*</strong>)
                    </span>
                    <input
                      type="password"
                      class="form-control2"
                      value={Password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Nhập lại mật khẩu(
                      <strong className="check-point">*</strong>)
                    </span>
                    <input
                      type="password"
                      class="form-control2"
                      value={Passwordcf}
                      onChange={(e) => setPasswordcf(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Chi nhánh(<strong className="check-point">*</strong>)
                    </span>
                    <SelectBranch
                      onSelected={(item) => setBranchId(item.value)}
                      BranchId={-1}
                      onBranchId={BranchId}
                      className="select-custom"
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Phòng ban(<strong className="check-point">*</strong>)
                    </span>
                    <SelectDepartment
                      onSelected={(item) => setDepartmentId(item.value)}
                      BranchId={BranchId}
                      onDepartmentId={DepartmentId}
                      className="select-custom"
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-md-3 m-auto">
                  <div class="form-group">
                    <span class="small font-weight-bold text-muted">
                      Chức danh(<strong className="check-point">*</strong>)
                    </span>
                    <SelectPostion
                      onSelected={(item) => Setitem(item)}
                      PositionId={-1}
                      onPositionId={PositionID}
                      className="select-custom"
                    />
                  </div>
                </div>

                {Creater === "1" ? (
                  <div className="col-xs-12 col-md-12 m-auto">
                    <div class="form-group">
                      <span class="small font-weight-bold text-muted">
                        Quản lý phòng ban(
                        <strong className="check-point">*</strong>)
                      </span>
                      <SelectDepartmentMulti
                        onSelected={(item) => {
                          setDepartMulti(item);
                        }}
                        BranchId={BranchId}
                        IsActive={IsActive}
                        IsFirst={{ value: 0, label: "Select" }}
                        isMulti={true}
                        IsClass={0}
                        className="select-custom"
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}

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
                            Upload Excel, PDF, Word...
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
                                  Trl_spStaff_FileDelete(filename)
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
                          Avatar
                          <span className="form__title__note"> (*)</span>
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
                                  alt="Avatar"
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
                    onClick={Trl_spStaff_Save}
                  >
                    <i class="fa fa-edit pr-2"></i>
                    {StaffId === 0 ? " Thêm mới" : "Chỉnh sửa"}
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
          show={modalIsOpenPass}
          onHide={closeModal}
          className=" custom-modal-w-90"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              <div class=""></div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="card-body text-center">Mật khẩu : {PasswordView}</div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

const customStyles = {
  content: {
    top: "25%",
    left: "55%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    zIndex: "4",
  },
};

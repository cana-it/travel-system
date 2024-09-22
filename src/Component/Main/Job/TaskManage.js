import React, { useEffect, useRef, useState } from "react";

import ReactHtmlParser from "react-html-parser";
import { mainAction } from "../../../Redux/Actions";
import { useDispatch } from "react-redux";
import { CreateTask, DataTable, SelectStaff, TinyMCE } from "../../../Common";
import {
  Alerterror,
  Alertsuccess,
  ConfirmAlert,
  FormatDateJson,
  FormatMoney,
  GetLogin,
} from "../../../Utils";
import { Modal } from "react-bootstrap";
import { SelectStatusV2 } from "../../../Common/SelectStatusV2";
import { CategoryList } from "./CategoryList";
import Drawer from "../../../Common/Drawer";
import CustomInput from "../../../Common/CustomInput";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker";
import moment from "moment";
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker";
import { SelectTaskStaff } from "../../../Common/SelectTaskStaff";
import { MyEditor } from "../../../Common/CMS/MyEditor";
import { StatusModal } from "../../../Common/StatusModal";
const TaskManageComp = ({
  onClickProject = () => {},
  IsProject = false,
  onTitle = -1,
  IsChange = (item) => {},
  TaskId = 0,
}) => {
  const _User = GetLogin();
  const User = _User && JSON.parse(_User);
  const [page, setPage] = useState(0);
  const [DetailJob, setDetailJob] = useState({});
  const [Status, setStatus] = useState({ value: "-1", label: "Select Status" });
  const [title, setTitle] = useState("Chi tiết");
  const [key, setKey] = useState(1);
  const [taskName, setTaskName] = useState("");
  const [taskContent, setTaskContent] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [Enddate, setEnddate] = useState("");
  const [AssignTos, setAssignTos] = useState(0);
  const [ContentTinyMCE, setContentTinyMCE] = useState("");
  const [IsStartDate, setIsStartDate] = useState(new Date());
  const [IsEnddate, setIsEnddate] = useState(new Date());
  const Dpid = localStorage.getItem("Dpid");

  const [showModal, setShowModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState({});

  const handleCloseModal = () => setShowModal(false);

  const Task_sTask_ChangeStatus_Save = async (taskId) => {
    const pr = {
      TaskId: taskId,
      StatusId: currentStatus?.value,
      StatusName: currentStatus?.label,
    };
    try {
      const params = {
        Json: JSON.stringify(pr),
        func: "Task_sTask_ChangeStatus_Save",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result?.Status == "OK") {
        Task_spTask_List();
        handleCloseModal();
        Alertsuccess("Cập nhật thành công");
      }
    } catch (err) {
    }
  };
  const [stateForm, setStateForm] = useState({
    TimeSearch: [
      new Date(
        moment(new Date().setDate(new Date().getDate() - 30)).startOf("date")
      ),
      new Date(moment(new Date()).endOf("date")),
    ],
    AssignTo: 0,
  });

  const CreateJob = () => {
    setTitle("Thêm mới công việc");
    setIsDrawerNewJobOpen(true);
  };

  

  const onFromDate = (item) => {
    setIsStartDate(item);
    setStartDate(FormatDateJson(item));
  };

  const onTodate = (item) => {
    setIsEnddate(item);
    setEnddate(FormatDateJson(item));
  };

  const columns = [
    {
      Header: <div></div>,
      accessor: "Edit",
      Cell: ({ row }) => (
        <div
          style={{ textAlign: "center", gap: "12px" }}
          className="d-flex justify-content-center"
        >
          <button
            className={"btn btn-sm btn-success"}
            onClick={() => {
              setDetailJob(row._original);
              setStatus({
                value: row._original.StatusId,
                label: row._original.StatusName,
              });
              setTaskName(row._original.TaskName);
              setIsStartDate(new Date(row._original.StartTime));
              setIsEnddate(new Date(row._original.Deadline));
              setTaskContent(row._original.TaskContent);
              setAssignTos(row._original.StaffId);
              setTitle("Chi tiết");
              setKey(1);
              toggleDrawer();
            }}
          >
            {" "}
            <i class="fa fa-eye"></i>
          </button>
          {(row._original.StatusId != 2 ||
            User.StaffId == row._original.Creater) && (
            <button
              className={"btn btn-sm btn-warning"}
              onClick={() => {
                setDetailJob(row._original);
                setStatus({
                  value: row._original.StatusId,
                  label: row._original.StatusName,
                });
                setTaskName(row._original.TaskName);
                setTitle("Cập nhật");
                setKey(2);
                toggleDrawer();
                setTaskContent(row._original.TaskContent);
                setAssignTos(row._original.StaffId);

                setIsStartDate(new Date(row._original.StartTime));
                setIsEnddate(new Date(row._original.Deadline));
              }}
            >
              <i class="fa fa-edit"></i>
            </button>
          )}
          {User.StaffId == row._original.Creater && (
            <>
              <button
                className={"btn btn-sm btn-danger"}
                onClick={(e) => {
                  ConfirmAlert("Xác nhận", "Bạn có muốn xóa không?", () => {
                    Task_spTask_Delete(row._original.TaskId);
                  });
                }}
              >
                {" "}
                <i class="fa fa-trash"></i>
              </button>
            </>
          )}

          <label
            class={
              row._original.AllowDelete === 1
                ? "container-checkbox ml-2 mt-1"
                : " disabled d-none"
            }
          >
            <input
              type="checkbox"
              checked={row._original?.Checked || false}
              //   onChange={() => {
              //     handleChecked(row._original);
              //   }}
            />
            <span class="checkmark"></span>
          </label>
        </div>
      ),
      fixed: "left",
    },
    {
      Header: "Phòng ban",
      accessor: "DepartmentName",
      fixed: "left",
    },
    {
      Header: "Người thực hiện",
      accessor: "StaffName",
      width: 200,
      fixed: "left",
    },
    {
      Header: "Tên công việc",
      accessor: "TaskName",
      minwidth: 200,
      fixed: "left",
      Cell: ({ row }) => (
        <div
          style={{
            color: row._original.StatusName == "Quá hạn" ? "red " : "black",
            fontWeight: "bold",
          }}
        >
          {row._original.TaskName}
        </div>
      ),
    },

    {
      Header: "Trạng thái ",
      accessor: "StatusName",
      width: 200,
      fixed: "left",
      Cell: ({ row }) => (
        <div className="relative d-flex align-items-center justify-content-center">
          {row._original.StatusName == "Quá hạn" && (
            <span
              className="bg-danger font-weight-bold text-light rounded px-1"
              style={{ fontSize: "13px" }}
            >
              Quá hạn
            </span>
          )}

          {row._original.StatusName == "Hoàn thành" && (
            <span
              className="bg-success font-weight-bold text-light rounded px-1"
              style={{ fontSize: "13px" }}
            >
              {row._original.StatusName}
            </span>
          )}

          {row._original.StatusName == "Trong tiến trình" && (
            <span
              className="bg-primary font-weight-bold text-light rounded px-1"
              style={{ fontSize: "13px" }}
            >
              {row._original.StatusName}
            </span>
          )}
          {row._original.StatusName == "Báo cáo" && (
            <span
              className="bg-warning font-weight-bold text-light rounded px-1"
              style={{ fontSize: "13px" }}
            >
              {row._original.StatusName}
            </span>
          )}
          {row._original.ToDate < new Date() && (
            <span
              className="bg-warning font-weight-bold text-light rounded px-1"
              style={{ fontSize: "13px" }}
            >
              {row._original.StatusName}
            </span>
          )}
          {row._original.StatusName != "Hoàn thành" && (
            <button
              onClick={() => {
                setShowModal(true);
                setCurrentStatus({
                  value: row._original.StatusId,
                  label: row._original.StatusName,
                });
                setDetailJob(row._original);
              }}
              class="cursor-pointer btn"
            >
              <i class="fa fa-edit"></i>
            </button>
          )}
        </div>
      ),
    },
    {
      Header: "Ngày bắt đầu",
      accessor: "StartTime",
      fixed: "left",
      Cell: ({ row }) => (
        <div className="relative d-flex align-items-center justify-content-center">
          {FormatDateJson(row._original.StartTime, 10)}
        </div>
      ),
    },
    {
      Header: "Ngày kết thúc",
      accessor: "Deadline",
      width: 250,
      fixed: "left",
      Cell: ({ row }) => (
        <div className="relative d-flex align-items-center justify-content-center">
          {FormatDateJson(row._original.Deadline, 10)}
        </div>
      ),
    },
    {
      Header: "Người tạo",
      accessor: "Creator",
      fixed: "left",
    },
  ];

  const [JobLits, setJobList] = useState([]);
  const [dataTempJob, setDataTempJob] = useState([]);
  const dispatch = useDispatch();
  const Task_spTask_List = async () => {
    const pr = {
      Id: 0,
      Asign: stateForm.AssignTo,
      FromDate:
        stateForm.TimeSearch !== undefined
          ? FormatDateJson(stateForm.TimeSearch[0])
          : "01/01/2000",
      ToDate:
        stateForm.TimeSearch !== undefined
          ? FormatDateJson(stateForm.TimeSearch[1])
          : "01/01/2000",
      DepartmentId: User?.DepartmentId,
      StaffId : User?.StaffId
    };

    const params = {
      Json: JSON.stringify(pr),
      func: "Task_spTask_List",
    };
    const result = await mainAction.API_spCallServer(params, dispatch);

    if (result) {
      setJobList(result?.JsonReturn1);
      setDataTempJob(result?.JsonReturn1);
    }
  };

  useEffect(() => {
    Task_spTask_List();
  }, [Dpid]);

  //#region handle Modal Edit, View
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  //#endregion

  //#region handle Modal Edit, View
  const [isDrawerNewJobOpen, setIsDrawerNewJobOpen] = useState(false);

  const toggleNewJobDrawer = () => {
    setIsDrawerNewJobOpen(!isDrawerNewJobOpen);
  };

  //#endregion

  const Trl_spTask_Save = async (taskId) => {
    ;
    const pr = {
      TaskId: taskId,
      TaskName: taskName,
      TaskContent: taskContent,
      StatusName: Status.label,
      StatusId: Status.value,
      AssignTo: AssignTos,
      StartTime: FormatDateJson(IsStartDate),
      Deadline: FormatDateJson(IsEnddate),
      Creater: User.StaffId,
    };

    try {
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTask_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result?.Status == "OK") {
        Task_spTask_List();
        Alertsuccess(result?.ReturnMess);
        toggleDrawer();
      }
    } catch (err) {
      Alerterror("Liên hệ IT NETCO");
    }
  };

  const Task_spTask_Delete = async (taskId) => {
    const pr = {
      TaskId: taskId,
    };

    try {
      const params = {
        Json: JSON.stringify(pr),
        func: "Task_spTask_Delete",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result) {
        Task_spTask_List();
        Alertsuccess("Xóa thành công");
      }
    } catch (err) {
      Alerterror("Liên hệ IT NETCO");
    }
  };

  return (
    <div>
      <div className="content-wrapper" style={{ backgroundColor: "#ffff" }}>
        <div style={{padding : 0}} className="card-header border-left-red">
          <div className="row">
            <div className="col-12 col-md-2 d-flex align-items-center  mb-2 mb-md-0">
              <h3 className="card-title font-weight-bold text-center text-md-left">
                {onTitle}
              </h3>
            </div>
            <div className="col-12 col-md-10 d-flex flex-column flex-md-row align-items-center justify-content-end">
              <button
                onClick={CreateJob}
                type="button"
                className="btn btn-sm btn-success mb-2 mb-md-0 ml-md-2"
              >
                <i className="fa fa-plus pr-2"></i>
                Thêm mới công việc
              </button>

              <button
                onClick={Task_spTask_List}
                type="button"
                className="btn btn-sm btn-danger mx-md-2 mb-2 mb-md-0"
                style={{ marginRight: "4px", marginLeft: "4px" }}
              >
                <i className="fa fa-search pr-2"></i>
                Tìm kiếm
              </button>

              <div
                className="form-group mx-md-2 mb-2 mb-md-0"
                style={{ width: "200px" }}
              >
                <div className="input-group">
                  <SelectStaff
                    onSelected={(e) => {
                      setStateForm({ ...stateForm, AssignTo: e.value });
                    }}
                  />
                </div>
              </div>

              <div className="form-group mb-2 mb-md-0 mr-md-2">
                <div className="input-group">
                  <DateTimeRangePicker
                    className="form-control2 px-1 pb-2px zIndex-300"
                    value={stateForm.TimeSearch}
                    format="dd/MM/yyyy"
                    onChange={(date) =>
                      setStateForm({ ...stateForm, TimeSearch: date })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="d-flex align-items-center justify-content-center p-3 flex-wrap "
          style={{
            gap: "12px",
          }}
        >
          <div
            className=" cursor"
            style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}
            onClick={(e) => {
              const newData = JobLits.filter((item) => item.StatusId == 1);
              setDataTempJob(newData);
            }}
          >
            <div className="info-box">
              <span className="info-box-icon bg-info elevation-1">
                <i className="fas fa-th-list"></i>
              </span>
              <div className="info-box-content">
                <span className="info-box-text">TRONG TIẾN TRÌNH</span>
                <span className="info-box-number float-left">
                  <span className="info-box-number">
                    {JobLits.filter((p) => p.StatusId === 1).length}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div
            className=" cursor"
            style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}
            onClick={(e) => {
              const newData = JobLits.filter((item) => item.StatusId == 2);
              setDataTempJob(newData);
            }}
          >
            <div className="info-box mb-3">
              <span className="info-box-icon bg-success elevation-1">
                <i className="fas fa-check"></i>
              </span>
              <div className="info-box-content">
                <span className="info-box-text">HOÀN THÀNH</span>
                <span className="info-box-number">
                  {JobLits.filter((p) => p.StatusId === 2).length}
                </span>
              </div>
            </div>
          </div>

          <div
            className=" cursor"
            style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}
            onClick={(e) => {
              const newData = JobLits.filter((item) => item.StatusId == 4);
              setDataTempJob(newData);
            }}
          >
            <div className="info-box mb-3">
              <span className="info-box-icon bg-danger elevation-1">
                <i class="fas fa-clock"></i>
              </span>

              <div className="info-box-content">
                <span className="info-box-text">QUÁ HẠN</span>
                <span className="info-box-number">
                  <span className="info-box-number">
                    {JobLits.filter((p) => p.StatusId === 4).length}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div
            className=" cursor"
            style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}
            onClick={(e) => {
              const newData = JobLits.filter((item) => item.StatusId == 5);
              setDataTempJob(newData);
            }}
          >
            <div className="info-box mb-3">
              <span className="info-box-icon bg-success elevation-1">
                <i class="fas fa-newspaper"></i>
              </span>

              <div className="info-box-content">
                <span className="info-box-text">BÁO CÁO</span>
                <span className="info-box-number">
                  <span className="info-box-number">
                    {JobLits.filter((p) => p.StatusId === 5).length}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3">
          <DataTable
            data={dataTempJob}
            page={page}
            onPageChange={(e) => setPage(e)}
            columns={columns}
            IsSearch={true}
            isFixPage={true}
          />
        </div>
        <StatusModal
          show={showModal}
          handleClose={handleCloseModal}
          value={currentStatus}
          onChange={(e) => {
            setCurrentStatus(e);
          }}
          handleSave={Task_sTask_ChangeStatus_Save}
          TaskId={DetailJob.TaskId}
        />
        {isDrawerNewJobOpen && (
          <Drawer
            title={title}
            isOpen={isDrawerNewJobOpen}
            toggleDrawer={toggleNewJobDrawer}
          >
            <CreateTask
              onTitle="Create new task"
              LoadList={Task_spTask_List}
              toggleDrawer={toggleNewJobDrawer}
            />
          </Drawer>
        )}
        {isDrawerOpen && (
          <Drawer
            title={title}
            isOpen={isDrawerOpen}
            toggleDrawer={toggleDrawer}
          >
            <div class="">
              <div class="row" style={{ rowGap: "12px" }}>
                <div class="col-sm-12 col-md-6">
                  <CustomInput
                    label="Tên công việc"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    key={key}
                  />
                </div>

                <div class="col-sm-12 col-md-6 position-relative">
                  <div>
                    <label
                      style={{
                        fontSize: "13px",
                        color: "#009688",
                      }}
                      class="position-absolute top-0 pb-8"
                    >
                      Phụ trách
                    </label>
                    {/* <SelectStatusV2
                    onSelected={(e) => setStatus(e)}
                    statusValue={Status}
                  /> */}
                    <div style={{ marginTop: "20px" }} className="mt-8">
                      <SelectTaskStaff
                        onSelected={(item) => setAssignTos(item.value)}
                        onStaffId={AssignTos}
                      />
                    </div>
                  </div>
                </div>

                <div class="col-sm-12 col-md-6">
                  <div class="form-group d-flex flex-column align-items-start">
                    <label
                      class=" col-form-label"
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold !important",
                        color: "#009688",
                      }}
                    >
                      Ngày bắt đầu
                    </label>
                    <div class=" input-group ">
                      <DateTimePicker
                        className="form-control  "
                        onChange={onFromDate}
                        value={IsStartDate}
                      />
                    </div>
                  </div>
                </div>

                <div class="col-sm-12 col-md-6">
                  <div class="form-group d-flex flex-column align-items-start">
                    <label
                      class=" col-form-label"
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold !important",
                        color: "#009688",
                      }}
                    >
                      Ngày kết thúc
                    </label>
                    <div class=" input-group ">
                      <DateTimePicker
                        className="form-control col-sm-12 "
                        onChange={onTodate}
                        value={IsEnddate}
                      />
                    </div>
                  </div>
                </div>

                <div class="col-sm-12 col-md-12">
                  <span style={{ width: "fit-content", color: "#009688" }}>
                    Ghi chú
                  </span>
                  <div class="">
                    <div class="">
                      {/* <TinyMCE
                        onSelected={(e) => setTaskContent(e)}
                        Values={ContentTinyMCE}
                      /> */}
                      <MyEditor
                        values={taskContent}
                        onChange={(e) => {
                          setTaskContent(e);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div class="col-sm-12 col-md-12">
                  <button
                    type="button"
                    class="btn btn-sm btn-default pull-right margin-left-5"
                    onClick={() => toggleDrawer()}
                  >
                    <i class="fa fa-undo pr-2"></i>
                    Đóng
                  </button>

                  {title != "Chi tiết" && (
                    <button
                      type="button"
                      class="btn btn-sm btn-danger pull-right"
                      onClick={() => Trl_spTask_Save(DetailJob.TaskId)}
                    >
                      <i class="fa fa-edit pr-2"> Lưu</i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Drawer>
        )}
      </div>
    </div>
  );
};

export const TaskManage = React.memo(TaskManageComp);

import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
import DateTimePicker from "react-datetime-picker";
import { SelectStaff } from "../Common";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  FormatDateJson,
  GetLogin,
} from "../Utils";
import { CategoryList } from "../Component/Main";
import { MyEditor } from "./CMS/MyEditor";
const CreateTaskComp = ({
  onClickProject = () => {},
  IsChange = (item) => {},
  TaskId = 0,
  onBack = () => {},
  LoadList = () => {},
  toggleDrawer = () => {},
}) => {
  const _User = GetLogin();
  const User = _User && JSON.parse(_User);
  const Dpid = localStorage.getItem("Dpid");
  const dispatch = useDispatch();
  const [IsStartDate, setIsStartDate] = useState(new Date());
  const onFromDate = (item) => {
    setIsStartDate(item);
    setStartDate(FormatDateJson(item));
  };

  const [IsEnddate, setIsEnddate] = useState(new Date());
  const onTodate = (item) => {
    setIsEnddate(item);
    setEnddate(FormatDateJson(item));
  };


  const CreateBy = localStorage.getItem("CreateBy");

  const [staffId, setStaffId] = useState({ value: 0, label: "Chọn nhân viên" });

  const [IsActive, setIsActive] = useState();
  const [IsActiveFollow, setIsActiveFollow] = useState("-0");
  const [IsDataPriority, setIsDataPriority] = useState("");

  const [Id, setId] = useState(0);
  const [TaskName, setTaskName] = useState("");
  const [Sumary, setSummary] = useState("");
  const TaskNameRef = useRef();
  const [SummaryCategory, setSummaryCategory] = useState(0);
  const [Priority, setPriority] = useState("");
  const [Contents, setContents] = useState("");
  const [ContentTinyMCE, setContentTinyMCE] = useState("");
  //const [ContentsRef] = useRef();
  const [StartDate, setStartDate] = useState("");
  const [Enddate, setEnddate] = useState("");
  const [AssignTos, setAssignTos] = useState(0);
  const [DepartmentId, setDepartmentId] = useState("");
  const [ProjectId, setProjectId] = useState(0);
  const [ProjectCode, setProjectCode] = useState("");
  const [ProjectName, setProjectName] = useState("");
  const [OrderBy, setOrderBy] = useState(0);
  const OrderByRef = useRef();
  const [CategoryId, setCategoryId] = useState(0);
  const [CategoryName, setCategoryName] = useState("");
  const [Fllow, setFllow] = useState([]);
  const [Disablebtn, setDisablebtn] = useState(true);

 
  const Trl_spTask_Save = async () => {
    try {
      if (AssignTos === 0) {
        Alertwarning("Select Assign Tos! Pls");
        return;
      }

      if (TaskName === "") {
        Alertwarning("Enter the Sumary! Pls");
        TaskName.current.focus();
        return;
      }
      let Contentspr = "";
      if (Contents.includes('"')) Contentspr = Contents.replaceAll('"', "||");

      Contentspr = Contentspr.replace(/!|\|~/g, "");

      if (Contentspr === "") Contentspr = Contents;

      //proces Fllowby
      let FollowIds = "";
      if (Fllow.length > 0) {
        Fllow.forEach((item, index) => {
          FollowIds += item.value + ";";
        });
      }

      const pr = {
        TaskId: 0,
        TaskName: TaskName,
        TaskContent: ContentTinyMCE,
        AssignTo: AssignTos,
        StatusId: 1,
        StatusName: "Trong tiến trình",
        StartTime: FormatDateJson(IsStartDate),
        Deadline: FormatDateJson(IsEnddate),
        Creater: User.StaffId,
        DepartmentId: Dpid,
        FollowBy: FollowIds,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTask_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      setDisablebtn(true); //enable btn
      if (result.Status === "OK") {
        setTaskName("");
        setContentTinyMCE("");
        setContents("");
        setAssignTos(0);
        setDepartmentId(0);
        setStaffId({ value: 0, label: "Chọn nhân viên" });
        toggleDrawer();
        LoadList();
        Alertsuccess(result.ReturnMess);
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.ReturnMess);
        return;
      }
      IsChange(true);
    } catch (error) {
      Alerterror("Error API, pls check");
    }
  };

  // cancel to clear form
  const Cancel = () => {
    onBack();
    setId(0);
    setSummary("");
    setContents("");
    setContentTinyMCE("");
    setOrderBy("0");
  };

  const [dataCategory, setDataCategory] = useState([]);
  const Task_spCategory_Get = async (ProjectId) => {
    try {
      const pr = {
        UserId: 952,
        ProjectId: ProjectId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Task_spCategory_Get",
      };

      const list = await mainAction.API_spCallServer(params, dispatch);
      const FirstData = { value: 0, label: "Chosen" };
      let dataSelect = [];
      dataSelect.push(FirstData);
      list.forEach((element, index) => {
        dataSelect.push({
          value: element.CategoryId,
          label: element.CategoryName,
        });
      });
      setDataCategory(dataSelect);
    } catch (error) {
      Alerterror("Error API, pls check");
      ;
    }
  };

  const [dataslProject, setdataslProject] = useState([]);
  const [dataProject, setdataProject] = useState([]);
  const Task_spProjectPlan_List = async () => {
    try {
      const pr = {
        UserId: 952,
        ProjectId: 0,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Task_spProjectPlan_List",
      };

      const list = await mainAction.API_spCallServer(params, dispatch);
      setdataProject(list);

      const FirstData = { value: 0, label: "Chose" };
      let dataSelect = [];
      dataSelect.push(FirstData);
      list.forEach((element, index) => {
        dataSelect.push({
          value: element.ProjectId,
          label: element.ProjectName,
        });
      });
      setdataslProject(dataSelect);
    } catch (error) {
      Alerterror("Error API, pls check");
      ;
    }
  };

  const [valueProject, setValueProject] = useState();
  const onProject = (item) => {
    // ;
    setValueProject(item);
    const project = dataProject.filter((p) => p.ProjectId == item.value);
    setProjectId(item.value);
    setProjectCode(project[0].ProjectCode);
    setProjectName(project[0].ProjectName);
    Task_spCategory_Get(item.value);
  };

  const [IsFormTask, setIsFormTask] = useState("block");
  const [IsFormCategory, setIsFormCategory] = useState("none");
  const AddCategory = () => {
    setIsFormTask("none");
    setIsFormCategory("block");
  };

  const ClickCategoryList = () => {
    setIsFormTask("block");
    setIsFormCategory("none");
  };

  return (
    <div>
      <div className="">
        <div class="card-body" style={{ display: IsFormTask }}>
          <div class="row">
            <div class="col-sm-12 col-md-6 ">
              <div class="form-group d-flex flex-column align-items-start">
                <label
                  class=" col-form-label"
                  style={{ fontSize: "13px", fontWeight: "bold !important" }}
                >
                  Công việc:{" "}
                </label>
                <div class=" input-group">
                  <input
                    type="text"
                    maxLength="50"
                    class="form-control"
                    placeholder="Nhập nội dung công việc"
                    ref={TaskNameRef}
                    value={TaskName}
                    onChange={(e) => setTaskName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-6">
              <div class="form-group d-flex flex-column align-items-start">
                <label
                  class="col-form-label"
                  style={{ fontSize: "13px", fontWeight: "bold !important" }}
                >
                  Giao cho:{" "}
                </label>
                <div class="input-group">
                  {/* <SelectOfficer 
                                        onSelected = { item => setAssignTos(item.value) }
                                        DepartId={0}
                                        IsActive={IsActive}
                                        IsFirst = {{value:0,label:'Select'}}
                                    /> */}
                  <SelectStaff
                    onStaffId={staffId}
                    onSelected={(item) => setAssignTos(item.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 col-md-6">
              <div class="form-group d-flex flex-column align-items-start">
                <label
                  class=" col-form-label"
                  style={{ fontSize: "13px", fontWeight: "bold !important" }}
                >
                  Từ ngày:{" "}
                </label>
                <div class=" input-group ">
                  <DateTimePicker
                    className=" form-control"
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
                  style={{ fontSize: "13px", fontWeight: "bold !important" }}
                >
                  Đến ngày:{" "}
                </label>
                <div class=" input-group ">
                  <DateTimePicker
                    className=" form-control"
                    onChange={onTodate}
                    value={IsEnddate}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <div class="row">
            <div class="col-sm-12 col-md-6">
              <div class="form-group d-flex flex-column align-items-start">
                <label
                  class=" col-form-label"
                  style={{ fontSize: "13px", fontWeight: "bold !important" }}
                >
                  Phòng ban:{" "}
                </label>
                <div class=" input-group">
                  <SelectDepartment
                    onSelected={(item) => {
                      setDepartmentId(item.value);
                      
                    }}
                    onDepartmentId={DepartmentId}
                  />
                </div>
              </div>
            </div>
            
          </div> */}

          <div class="row">
            <div class="col-sm-12 col-md-12">
              <label>Nội dung :</label>
              <div class="">
                <div class="">
                  {/* <TinyMCE
                    onSelected={(e) => setContents(e)}
                    Values={ContentTinyMCE}
                  /> */}
                  <MyEditor
                    values={Contents}
                    onChange={(e) => {
                      setContents(e);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 col-md-12">
              <button
                type="button"
                class="btn btn-sm btn-default pull-right margin-left-5"
                // onClick={() => toggleDrawer()}
              >
                <i class="fa fa-undo pr-2"></i>
                Đóng
              </button>

              <button
                type="button"
                class="btn btn-sm btn-danger pull-right"
                onClick={() => Trl_spTask_Save()}
              >
                <i class="fa fa-edit pr-2"> Lưu</i>
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: IsFormCategory }}>
          <CategoryList
            onTitle="List of the category"
            onClickCategoryList={ClickCategoryList}
          />
        </div>
      </div>
    </div>
  );
};

export const CreateTask = React.memo(CreateTaskComp);

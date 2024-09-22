
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from 'react-datetime-picker';
import Select from 'react-select';
import { mainAction } from "../../../Redux/Actions";
import { CreateTask } from "../../../Common";
import {FormatDateJson,Alertwarning, Alertsuccess, Alerterror } from "../../../Utils";
import { IMAGES_DOMAIN } from "../../../Services";
import { Img } from 'react-image';
import { ProjectDetail } from "./ProjectDetail";
import {SelectOfficer,SelectStatus,SelectOfficerNew} from "../../../Common";
import Modal from 'react-modal';
import 'animate.css';
import $ from 'jquery';
// Import React Table

export const Taskdaily = () => {

    const dispatch = useDispatch();
    const CreateBy = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    useEffect(() => {
        Task_spProjectPlan_List();
    }, [])

    const [IsStartDate,setIsStartDate] = useState();
    const onFromDate = (item) => {
        setIsStartDate(item)
        setStartDate(FormatDateJson(item))
    }

    const [IsEnddate,setIsEnddate] = useState();
    const onTodate = (item) => {
        setIsEnddate(item);
        setEnddate(FormatDateJson(item))
    }
    
    const [IsProjectDetail,setIsProjectDetail] = useState('none');
    const [dataJobDetail, setDataJobDetail] = useState([]);
    const [dataJobDetailMain, setDataJobDetailMain] = useState([]);
    const [AssignTo,setAssignTo] = useState(0);
    const [Status,setStatus] = useState('-1');
    const [StartDate,setStartDate] = useState('');
    const [Enddate,setEnddate] = useState('');
    const [ProjectId,setProjectId] = useState(-1);
    const [taskMain,settaskMain] = useState(0);
    const [taskMainfn,settaskMainfn] = useState(0);

    const [taskDetail,settaskDetail] = useState(0);
    const [taskDetailfn,settaskDetailfn] = useState(0);

    const [taskBug,settaskBug] = useState(0);
    const [taskBugfn,settaskBugfn] = useState(0);
    const [inProgress,setinProgress] = useState(0);
    const [inTest,setinTest] = useState(0);
    const [taskFixing,settaskFixing] = useState(0);
    const Task_spIssueTracking_GetTask = async (Proid,AssId,Stas) => {
        try 
        {
            const pr = {
                AssignTo: AssId === 0 ? AssignTo : AssId,
                Status: Stas === 0 ? Status : Stas,
                ProjectId: Proid === 0 ? ProjectId : Proid,
                FromDate:StartDate,
                Todate:Enddate,
                CreateBy:CreateBy
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTracking_GetTask"
            }
    
            const list = await mainAction.API_spCallServer(params, dispatch);
            setDataJobDetail(list);
            setDataJobDetailMain(list);
    
            settaskMain(list.length);
            settaskMainfn(list.filter(p => p.Status === "Archive").length);
            setinProgress(list.filter(p => p.Status === "In progress").length);
            setinTest(list.filter(p => p.Status === "Test required").length);
            settaskBug(list.filter(p => p.Status === "Bug Function").length);
            settaskFixing(list.filter(p => p.Status === "Fixing").length);

            let taskdt = 0;
            let taskdtfn = 0;
            let bug = 0;
            let bugfn = 0;
            list.map((item,index) => {
                taskdt += item.IsTask;
                taskdtfn += item.IsTaskDone;
    
                bug += item.IsBug;
                bugfn += item.IsBugDone;
            });
    
            settaskDetail(taskdt);
            settaskDetailfn(taskdtfn);
            //settaskBug(bug);
            settaskBugfn(bugfn);

            // set animation
             Animate();
        } catch (error) {
            ;
            Alerterror("Something wwrong!pls check");
        }
    }

    const onSelectStatusFilter = (item) => {
        
        setStatus(item);
        const datanew = [...dataJobDetailMain];
        if(item === "-1")
        {
            setDataJobDetail(datanew)
        }
        else
        {
            setDataJobDetail([]);
            setDataJobDetail(datanew.filter(p => p.Status === item))
        }
        //item === "-1" ? setDataJobDetail(datanew) : setDataJobDetail(datanew.filter(p => p.Status === item));
        
        // set animation
        Animate();
    }

    const Animate = () => {
        
        $(".animateTitle").addClass("animate__animated animate__backInLeft");
        
        window.setInterval(function(){
            $(".animateTitle").removeClass("animate__animated");
            $(".animateTitle").removeClass("animate__backInLeft");
        },10000)
    }

    const [IsChangepr,setIsChangepr] = useState(false);
    const ClickProjectDetail = () => {
        
        setIsProjectDetail('none');
        setIshow('block');
        setIshowForm('none');
        if(IsChangepr)Task_spIssueTracking_GetTask(ProjectId,AssignTo,Status);
    }

    const [Ishow,setIshow] = useState('block');
    const [IshowForm,setIshowForm] = useState('none');
    const FollowProjectDetail = (detail) => {
        setProjectdt(detail);
        setIsProjectDetail('block');
        setIshow('none');
    }

    const addTask = () => {
        setIshow('none');
        setIshowForm('block');
    }

    const [Projectdt,setProjectdt] = useState({});

    const onIsChange = (item) => {
        setIsChangepr(item);
    }

    const [dataProject, setDataProject] = useState([])
    const [dataSelect, setDataSelect] = useState([])
    const [valueS, setValueS] = useState({})
    const Task_spProjectPlan_List = async () => {
        try 
        {
            const params = {
                Json: JSON.stringify({ AreaId: 0 }),
                func: "Task_spProjectPlan_List"
            }
            const list = await mainAction.API_spCallServer(params, dispatch);
            setDataProject(list);
    
            const FirstData = { value: -1, label: "Name's project" }
            let dataSelect = [];
            dataSelect.push(FirstData);
            setValueS(FirstData);
            list.forEach((element, index) => {
                dataSelect.push({ value: element.ProjectId, label: element.ProjectName });
            });
            setDataSelect(dataSelect)
        } catch (error) {
            ;
            Alerterror("Something wwrong!pls check");
        }
        
    }

    const onSelectProject = (item) => {
        setValueS(item); // set data to display
        setProjectId(item.value);
        Task_spIssueTracking_GetTask(item.value,0,0);
    }

    const SelectOfficer = (item) => {
        setAssignTo(item);
        Task_spIssueTracking_GetTask(0,item,0);
    }

    const onSelectStatus = (item) => {
        setStatus(item);
        Task_spIssueTracking_GetTask(0,0,item);
    }

    
    const [IsFinishD,setFinishD] = useState(new Date());
    const onFinishDate = (item) => {
        setFinishD(item);
        setFinishDate(FormatDateJson(item))
    }
    const [FinishDate,setFinishDate] = useState('');
    const [itemUpdate,setItemUpdate] = useState();
    const [Disablebtn,setDisablebtn] = useState(true);
    const [Statusfn,setStatusfn] = useState('-1');
    const Task_spIssueTracking_Finish = async () => {
        try 
        {
            
            if(Statusfn === "-1" && FinishDate === "")
            {
                closeModal();
                return;
            }

            
            const pr = {
                CreateBy: CreateBy,
                CreateName: CreateName,
                TaskId:itemUpdate.id,
                Status:Statusfn,
                FromDate:FinishDate
            };

            // validation the little task in the main task
            if(CreateBy !== 952)
            {
                if(itemUpdate.IsTask <= 0 || itemUpdate.IsTask === undefined)
                {
                    Alertwarning("This task does not have a little task, Can not update!");
                    return;
                }
                if(itemUpdate.IsTaskDone <= 0 || itemUpdate.IsTaskDone === undefined)
                {
                    Alertwarning("The little task is not finish, Can not update!");
                    return;
                }
                if(itemUpdate.IsTask < 3 )
                {
                    Alertwarning("The little task <= 3, Can not update!");
                    return;
                }
            }
            
    
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTracking_Finish"
            };
            setDisablebtn(false);
            const result = await mainAction.API_spCallServer(params, dispatch);
            if(result.Status === "OK")
            {
                Alertsuccess(result.ReturnMess);
                Task_spIssueTracking_GetTask(ProjectId,AssignTo,Status);
                closeModal();
                setStatusfn('-1');
                setFinishDate('');
            }
            else
            {
                Alerterror(result.ReturnMess);
            }
            setDisablebtn(true);

        } catch (error) {
            Alerterror("Something Wrong, pls check API");
        }
    }

    const Task_spIssueTracking_UpdateDelete = async (item) => {
        try 
        {
            if(window.confirm("Are you sure?"))
            {
                
                const pr = {
                    Creater: CreateBy,
                    TaskId:item.id,
                    Status:item.Status
                };
        
                const params = {
                    Json: JSON.stringify(pr),
                    func: "Task_spIssueTracking_UpdateDelete"
                };
        
                const result = await mainAction.API_spCallServer(params, dispatch);
                if(result.Status === "OK")
                {
                    Alertsuccess(result.ReturnMess);
                    Task_spIssueTracking_GetTask();
                }
                else
                {
                    Alerterror(result.ReturnMess);
                }
            }

        } catch (error) {
            Alerterror("Something Wrong, pls check API");
        }
    }

    const [modalIsOpen,setIsOpen] = useState(false);

    const openModal = ()  => {
        setIsOpen(true);
    }

    const closeModal = () =>{
        setIsOpen(false);
    }

    const ModelShoOpen = (item) => {
        setItemUpdate(item);
        openModal();
    }

    const [TaskId,setTaskId] = useState(0);
    const editTask = (id) => {
        
        setTaskId(id);
        setIshow('none');
        setIshowForm('block');
    }


    return (
        <>
        <div  className="content-wrapper" style={{ backgroundColor: '#ffff',display:Ishow}}>
            <div className="content">
                <div className="container-fluid">
                    <div class="card-body border-left-blue">
                       
                        <div class="row">
                                {/* <button type="button" class="btn btn-sm btn-danger pull-left" onClick={Task_spIssueTracking_GetTask}>
                                        <i class="fa fa-eye pr-2"></i>
                                        View Task
                                </button> */}
                               <div class="col-sm-12 col-md-6">
                                    <h3 className="title pull-left">My task </h3> 
                               </div>
                               <div class="col-sm-12 col-md-6">
                                    <button type="button" class="btn btn-sm btn-success pull-right" onClick={addTask}>
                                        <i class="fa fa-plus pr-2"></i>
                                        Create
                                    </button>
                               </div>
                                
                        </div>
                        <div class="row">
                            <div class="col-sm-12 col-md-3">
                                <div class="form-group">
                                    <div class="input-group">
                                        <Select className="SelectMeno"
                                            value={valueS}
                                            onChange={onSelectProject}
                                            options={dataSelect}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-3">
                                {/* <div class="form-group">
                                    <div class="input-group SelectDatetime">
                                        
                                        <SelectStatus
                                            onSelected = { e => onSelectStatus(e.value) }
                                            DepartId={0}
                                            IsClass = {1}
                                        />
                                    </div>
                                </div> */}
                                <ul class="list-inline" style={{marginTop:'5px'}}>
                                    <li class="list-inline-item">
                                        <div onClick={e => onSelectStatusFilter("-1")} class="iconof" title="All tasks" style={{position:'inherit',top:0}}>
                                            {dataJobDetailMain.length}
                                        </div>
                                    </li>
                                    <li class="list-inline-item">
                                        <div  onClick={e => onSelectStatusFilter("In progress")} title="In progress"  class="iconof background-blue color-while" style={{position:'inherit',top:0}}>
                                            {inProgress}
                                        </div>
                                    </li>
                                    <li class="list-inline-item">
                                        <div onClick={e => onSelectStatusFilter("Archive")} title="Done"  class="iconof bg-gradient-success" style={{position:'inherit',top:0}}>
                                            {taskMainfn}
                                        </div>
                                    </li>
                                    <li class="list-inline-item">
                                        <div onClick={e => onSelectStatusFilter("Test required")} title="Test required"  class="iconof bg-gradient-warning" style={{position:'inherit',top:0}}>
                                            {inTest}
                                        </div>
                                    </li>
                                    <li class="list-inline-item">
                                        <div onClick={e => onSelectStatusFilter("Bug Function")} title="Bug Function" class="iconof bg-gradient-danger" style={{position:'inherit',top:0}}>
                                            {taskBug}
                                        </div>
                                    </li>
                                     <li class="list-inline-item">
                                        <div onClick={e => onSelectStatusFilter("Fixing")} title="Fixing" class="iconof bg-gradient-fixing" style={{position:'inherit',top:0}}>
                                            {taskFixing}
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div class="col-sm-12 col-md-6">
                                <SelectOfficerNew
                                    onSelected = { e => SelectOfficer(e.value) }
                                    DepartId={0}
                                    IsFirst = {{value:0,label:'...'}}
                                    IsClass = {1}
                                />
                            </div>
                        </div>
                        
                        <div class="content" style={{display: taskMain > 0 ? 'block' : 'none'}}>
                        
                        <div className="row table-responsive">
                                <div className="card-body">
                                    <div>
                                        <table class="table table-nopadding" style={{width:'130%'}}>
                                            <thead>
                                                <th>Sumary ({dataJobDetail.length})</th>
                                                <th>Owner</th>
                                                <th>AssignTo</th>
                                                <th>Status</th>
                                                <th>TimeLine</th>
                                                <th>Due Date</th>
                                                <th>Fn Date</th>
                                                <th>Priority</th>
                                                <th>Task</th>
                                                <th>BUG</th>
                                            </thead>
                                            <tbody>
                                                {
                                                    dataJobDetail.map((detail, kdt) => {
                                                        let cStatus = detail.Status;
                                                        let classStatus = "div-title no-border-radius btn btn-block bg-gradient-danger btn-flat margin-left-5";
                                                        if (cStatus === "In progress") classStatus = "background-blue div-title no-border-radius btn btn-block bg-gradient-warning btn-flat margin-left-5";
                                                        if (cStatus === "Test required") classStatus = "div-title no-border-radius btn btn-block bg-gradient-warning btn-flat margin-left-5";
                                                        if (cStatus === "Archive") classStatus = "div-title no-border-radius btn btn-block bg-gradient-success btn-flat margin-left-5";
                                                        if (cStatus === "Fixing") classStatus = "div-title no-border-radius btn btn-block bg-gradient-fixing btn-flat margin-left-5";
                                                        
                                                        /* check timeline ok */
                                                        let TimeLineOK = parseFloat(detail.TimeLineOK);
                                                        let classTimeline = "progress-bar bg-success";
                                                        if(TimeLineOK >= 50 && TimeLineOK <= 90 && detail.CompleteOn === 'NA') classTimeline = "progress-bar bg-warning";
                                                        if(TimeLineOK > 90 && detail.CompleteOn === 'NA') classTimeline = "progress-bar bg-danger";
                                                        
                                                        return (
                                                        <tr key={kdt}>
                                                            <td>
                                                                <div className="animateTitle">
                                                                    <div onClick={ e => FollowProjectDetail(detail)} class="no-border-radius btn btn-default toastsDefaultDefault border-left-red" style={{textAlign:'left'}}>
                                                                        {detail.Summary}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                    <Img alt="Avatar" height="30" class="table-avatar" src={ IMAGES_DOMAIN + detail.AvatarCreate} />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div onDoubleClick={e => editTask(detail.id)} class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                    <Img alt="Avatar" height="30" class="table-avatar" src={ IMAGES_DOMAIN + detail.Avatar} />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="animateTitle">
                                                                    <div onDoubleClick={e => ModelShoOpen(detail)}  class={classStatus}>
                                                                        {detail.Status === "Archive" ? "Done":detail.Status}
                                                                    </div>
                                                                </div>
                                                                
                                                            </td>
                                                            <td>
                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                    <div class="progress mb-3">
                                                                        <div class={classTimeline} role="progressbar" aria-valuenow={detail.TimeLineOK} aria-valuemin="0"
                                                                            aria-valuemax="100" style={{ width: detail.TimeLineOK }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                    {detail.DueDate}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                    {detail.CompleteOn}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div onDoubleClick={e => Task_spIssueTracking_UpdateDelete(detail)} class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                    <span class={detail.Priority === "Do now" ? "div-title badge badge-danger":"div-title badge badge-warning"}>{detail.Priority}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                    <span class="div-title badge badge-success">{detail.IsTaskDone}/{detail.IsTask}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                    <span class="div-title badge badge-danger">{detail.IsBugDone}/{detail.IsBug}</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="row" style={{display:IsProjectDetail}}>
            <ProjectDetail 
                onTitle="Follow task"
                isData={Projectdt}
                onClickProjectDetail={ClickProjectDetail}
                IsChange={onIsChange}
            />
        </div>
        <div class="row" style={{display:IshowForm}}>
            <CreateTask 
                onTitle="Create/Update the task"
                IsProject={true}
                onClickProject = {ClickProjectDetail}
                IsChange={onIsChange}
                TaskId={TaskId}
            />
        </div>
        
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Update Job"
            >

                
            <div class="card-header border-left-red">
                <div class="row">
                    <div class="col-sm-12 col-md-6" >
                        <h3 class="card-title font-weight-bold">Update Job</h3>
                    </div>
                    <div class="col-sm-12 col-md-6 margin-top-5s">
                        <button onClick={closeModal} type="button" class="btn btn-sm btn-default pull-right margin-left-5">
                            <i class="fa fa-undo pr-2"></i>
                            Cancel
                        </button>
                        
                        <button disabled={!Disablebtn}  onClick={Task_spIssueTracking_Finish} type="button" class="btn btn-sm btn-danger pull-right">
                            <i class="fa fa-edit pr-2"></i>
                            Update
                        </button>
                    </div>
                </div>
            </div>

            <div class="card-body border-left-red">
                
                <div class="row">
                    <div class="col-sm-12 col-md-8">
                            <div class="form-group">
                                <div class="input-group SelectDatetime">
                                    <div class="input-group-prepend ">
                                        <span class="input-group-text">Finish Date:</span>
                                    </div>
                                    <DateTimePicker className="z-index-1k"
                                        onChange={onFinishDate}
                                        value={IsFinishD}
                                    />
                                </div>
                            </div>
                    </div>

                    <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                                <div class="input-group SelectDatetime">
                                    <div class="input-group-prepend ">
                                        <span class="input-group-text">Status:</span>
                                    </div>
                                    <select className="form-control" onChange={e => setStatusfn(e.target.value)}>
                                        <option value="-1">Default</option>
                                        <option value="Archive">Done</option>
                                        <option value="Test required">Test required</option>
                                        <option value="Bug Function">Bug Function</option>
                                    </select>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        
        </Modal>
        </>
    )
}


const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      width                 : '55%'
    }
};
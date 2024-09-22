
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from 'react-datetime-picker';
import Select from 'react-select';
import { Img } from 'react-image';
import { mainAction } from "../../../Redux/Actions";
import { FormConditions, SelectOfficer, SelectCity, SelectPost, DataTable,CreateTask } from "../../../Common";
import { Alerterror, Alertsuccess, Alertwarning, ExportExcel,FormatDateJson } from "../../../Utils";
import { ProjectDetail } from "./ProjectDetail";
import { IMAGES_DOMAIN } from "../../../Services";
import Modal from 'react-modal';
// Import React Table

export const Project = () => {
    const dispatch = useDispatch();
    const CreateBy = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    useEffect(() => {
        Task_spProjectPlan_List();
    }, [])

    const [ProjectId, setProjectId] = useState(0)
    const [dataProject, setDataProject] = useState([])
    const [dataSelect, setDataSelect] = useState([])
    const [valueS, setValueS] = useState({})

    const Task_spProjectPlan_List = async () => {
        const params = {
            Json: JSON.stringify({ AreaId: 0 }),
            func: "Task_spProjectPlan_List"
        }
        const list = await mainAction.API_spCallServer(params, dispatch);
        setDataProject(list);

        const FirstData = { value: 0, label: "Select Project" }
        let dataSelect = [];
        dataSelect.push(FirstData);
        setValueS(FirstData);
        list.forEach((element, index) => {
            dataSelect.push({ value: element.ProjectId, label: element.ProjectName });
        });
        setDataSelect(dataSelect)

    }

    const onSelectProject = (item) => {
        setValueS(item); // set data to display
        setProjectId(item.value);
        Task_spIssueTracking_List_V1(item.value);
    }

    const [dataJob, setDataJob] = useState([]);
    const Task_spCategory_Get = async (pId) => {
        
        try {
            const pr = {
                UserId: CreateBy,
                ProjectId: pId
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spCategory_Get"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            setDataJob(list);
        } catch (error) {
            Alertwarning("Error API, pls check")
            ;
        }
        
    }

    const [dataJobDetail, setDataJobDetail] = useState([]);
    const Task_spIssueTracking_List_V1 = async (ProId) => {
        
        const pId = ProId === 0 ? ProjectId : ProId;
        try {
            const pr = {
                DepartmentId: 0,
                AssignTo: 0,
                Status: '-1',
                Resolution: '',
                Priority: '',
                Id: 0,
                ProjectId: pId
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTracking_GetbyProject"
            }
    
            const list = await mainAction.API_spCallServer(params, dispatch);
            Task_spProjectPlan_Statistics(pId);
            setDataJobDetail(list);
            Task_spCategory_Get(pId);
        } catch (error) {
            Alerterror("Error API, pls check");
            ;
        }
    }

    const [Ishow,setIshow] = useState('block');
    const [IshowForm,setIshowForm] = useState('none');
    const addTask = () => {
        setIshow('none');
        setIshowForm('block');
    }

    const [TaskId,setTaskId] = useState(0);
    const editTask = (id) => {
        
        setTaskId(id);
        setIshow('none');
        setIshowForm('block');
    }

    const onClickProject = () => {
        setIshow('block');
        setIshowForm('none');
        
        //reload project again
        if(ProjectId !== 0) Task_spIssueTracking_List_V1(0);
    }

    const [Projectdt,setProjectdt] = useState({});
    const [IsProjectDetail,setIsProjectDetail] = useState('none');
    const FollowProjectDetail = (detail) => {
        setProjectdt(detail);
        setIsProjectDetail('block');
        setIshow('none');
    }
    const [IsChangepr,setIsChangepr] = useState(false);
    const ClickProjectDetail = () => {
        
        setIsProjectDetail('none');
        setIshow('block');
        if(IsChangepr)Task_spIssueTracking_List_V1(0);
    }

    const [DataviewProject,setDataviewProject] = useState([]);
    const Task_spProjectPlan_Statistics = async (pId) => {
        const pr = {
            UserId: CreateBy,
            ProjectId:pId
        };

        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spProjectPlan_Statistics"
        };

        const list = await mainAction.API_spCallServer(params, dispatch);
        setDataviewProject(list);
    }

    const onIsChange = (item) => {
        setIsChangepr(item);
    }

    /* count and sum task, bug */

    const CountJob = (type,id) => {
        
        const data = dataJobDetail.filter(p => p.CategoryId === id);
        if(type === "Bug")
        {
            let Bug = 0;
            let Bugfn = 0;
            data.map((item,index) => {
                Bug += item.IsBug;
                Bugfn += item.IsBugDone;
            })
            return <span className='div-title badge badge-danger'>{Bugfn +"/"+ Bug}</span>;
        }
        else
        {
            let Task = 0;
            let Taskfn = 0;
            data.map((item,index) => {
                Task += item.IsTask;
                Taskfn += item.IsTaskDone;
            })
            return <span className='div-title badge badge-success'>{Taskfn +"/"+ Task}</span>;
        }
    }

    const Clickclasshow  = (index) => {
        
        let obj = document.getElementsByClassName("isdatashow" + index),
        show = obj[0].getAttribute("ishow");
        if(show === "1")
        {
            obj[0].classList.remove("display-none");
            obj[0].setAttribute("ishow","0");
        }
        else
        {
            obj[0].className += " display-none"; 
            obj[0].setAttribute("ishow","1");
        }    
    }

    const Task_spIssueTracking_UpdateDelete = async (item) => {
        try 
        {
            if(item.Status !== "In progress" && CreateBy !== '952')
            {
                Alerterror("Can not delete this job!pls check");
                return;
            }

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
                    Task_spIssueTracking_List_V1(0);
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
            
            const pr = {
                CreateBy: CreateBy,
                CreateName: CreateName,
                TaskId:itemUpdate.id,
                Status:Statusfn,
                FromDate:FinishDate
            };
    
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTracking_Finish"
            };
            setDisablebtn(false);
            const result = await mainAction.API_spCallServer(params, dispatch);
            if(result.Status === "OK")
            {
                Alertsuccess(result.ReturnMess);
                Task_spIssueTracking_List_V1(0);
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
    return (
        <>
        <div class="row" style={{display:IsProjectDetail}}>
            <ProjectDetail 
                onTitle="Create new task for project"
                isData={Projectdt}
                onClickProjectDetail={ClickProjectDetail}
                IsChange={onIsChange}
            />
        </div>

        <div class="row" style={{display:IshowForm}}>
            <CreateTask 
                onTitle="Create new task for project"
                IsProject={true}
                onClickProject = {onClickProject}
                TaskId={TaskId}
            />
        </div>

        <div className="content-wrapper" style={{ backgroundColor: '#ffff',display:Ishow }}>
            <div className="content">
                <div className="container-fluid">
                    <div class="card-body border-left-blue">
                        <div class="row">
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <h3 className="tit">Manage Plan Project</h3>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group SelectDatetime">
                                        <Select className="SelectMeno"
                                            value={valueS}
                                            onChange={onSelectProject}
                                            options={dataSelect}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    {/* <button type="button" class="btn btn-sm btn-danger pull-left" onClick={Task_spIssueTracking_List_V1}>
                                        <i class="fa fa-eye pr-2"></i>
                                        View Project
                                    </button> */}
                                    <button type="button" class="btn btn-sm btn-success pull-left margin-left-5" onClick={addTask}>
                                        <i class="fa fa-plus pr-2"></i>
                                        Create
                                    </button>


                                </div>
                            </div>

                        </div>
                        {
                            DataviewProject.map((item,index) => {
                                return(
                                        <div class="row" key={index}>
                                        <div class="col-md-3 col-sm-6 col-12">
                                            <div class="info-box shadow-none">
                                            <span class="info-box-icon bg-info"><i class="far fa-clock"></i></span>

                                            <div class="info-box-content">
                                                <span class="info-box-text">TimeLine, {item.Todate}</span>
                                                <div class="progress mb-3" style={{height:'10px'}}>
                                                    <div style={{width:item.TimeOK + '%'}} class="progress-bar bg-danger" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                    <span class="progress-description" style={{marginTop:'-15px'}}>
                                                     {item.TimeOK}%  in {item.DayTimeLine} Days
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3 col-sm-6 col-12">
                                            <div class="info-box shadow-sm">
                                            <span class="info-box-icon bg-success"><i class="far fa-flag"></i></span>

                                            <div class="info-box-content">
                                                <span class="info-box-text">General Task</span>
                                                <span class="info-box-number"> {item.IsDone}/{item.Total}, ({item.IsTaskDone}/{item.IsTask})</span>
                                            </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3 col-sm-6 col-12">
                                            <div class="info-box shadow">
                                            <span class="info-box-icon bg-warning"><i class="far fa-copy"></i></span>

                                            <div class="info-box-content">
                                                <span class="info-box-text">Test required</span>
                                                <span class="info-box-number">({item.IsTest})</span>
                                            </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3 col-sm-6 col-12">
                                            <div class="info-box shadow-lg">
                                            <span class="info-box-icon bg-danger"><i class="fa fa-bug"></i></span>

                                            <div class="info-box-content">
                                                <span class="info-box-text">Bug</span>
                                                <span class="info-box-number"> {item.IsBugDone} / {item.IsBug}</span>
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                )
                            })
                        }
                        <div class="content">
                            {
                                dataJob.map((item, index) => {
                                    let classhow = "card-header display-none isdatashow" + index;
                                    return (

                                        <div key={index} className="card card-outline  shadow-sm" style={{marginTop: index !== 0 ? '-0px':'10px' }}>
                                            <div class={classhow} ishow="1">
                                                <div class="card-title" style={{color:'#1547d4',fontWeight:'bold',marginLeft:'1%'}}>
                                                    <button onClick={e => Clickclasshow(index)} type="button" class="btn btn-tool" data-card-widget="collapse">
                                                        <i class="fas fa-minus"></i>
                                                    </button>
                                                    {item.CategoryName} ({dataJobDetail.filter(p => p.CategoryId === item.CategoryId).length})
                                                </div>
                                            </div>
                                            <div className="card-body" style={{marginTop:'-21px'}}>
                                                <div>
                                                    <table class="table table-nopadding" style={{borderTop:'2px solid #fff'}}>
                                                        <thead>
                                                            <th style={{width:'25%',color:'#1547d4'}}>
                                                            <button onClick={e => Clickclasshow(index)} type="button" class="btn btn-tool" data-card-widget="collapse">
                                                                <i class="fas fa-minus"></i>
                                                            </button>
                                                                {item.CategoryName} ({dataJobDetail.filter(p => p.CategoryId === item.CategoryId).length})
                                                            </th>
                                                            <th style={{width:'5%'}}> Owner</th>
                                                            <th style={{width:'15%'}}> Status</th>
                                                            <th style={{width:'10%'}}> TimeLine</th>
                                                            <th> Due Date</th>
                                                            <th> Priority</th>
                                                            <th> Task {CountJob('Task',item.CategoryId)}</th>
                                                            <th> BUG {CountJob('Bug',item.CategoryId)}</th>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                dataJobDetail.filter(p => p.CategoryId === item.CategoryId).map((detail, kdt) => {
                                                                    let cStatus = detail.Status;
                                                                    let classStatus = "div-title no-border-radius btn btn-block bg-gradient-danger btn-flat margin-left-5";
                                                                    if (cStatus === "In progress") classStatus = "background-blue div-title no-border-radius btn btn-block bg-gradient-warning btn-flat margin-left-5";
                                                                    if (cStatus === "Test required") classStatus = "div-title no-border-radius btn btn-block bg-gradient-warning btn-flat margin-left-5";
                                                                    if (cStatus === "Archive") classStatus = "div-title no-border-radius btn btn-block bg-gradient-success btn-flat margin-left-5";
                                                                    
                                                                    /* check timeline ok */
                                                                    let TimeLineOK = detail.TimeLineOK;
                                                                    let classTimeline = "progress-bar bg-success";
                                                                    if(TimeLineOK >= 50 && TimeLineOK <= "90") classTimeline = "progress-bar bg-warning";
                                                                    if(TimeLineOK > 90 ) classTimeline = "progress-bar bg-danger";
                                                                    
                                                                    return (
                                                                    <tr key={kdt}>
                                                                        <td>
                                                                            <div onClick={ e => FollowProjectDetail(detail)} class="no-border-radius btn btn-default toastsDefaultDefault border-left-red" style={{textAlign:'left'}}>
                                                                                {detail.Summary}
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div onDoubleClick={e => editTask(detail.id)} class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                                <Img alt="Avatar" height="30" class="table-avatar" src={ IMAGES_DOMAIN + detail.Avatar} />
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div onDoubleClick={e => ModelShoOpen(detail)} class={classStatus}>
                                                                                {detail.Status === "Archive" ? "Done" : detail.Status}
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                                <div class="progress mb-3">
                                                                                    <div class={classTimeline} role="progressbar" aria-valuenow={detail.TimeLineOK} aria-valuemin="0"
                                                                                        aria-valuemax="100" style={{ width: detail.TimeLineOK + '%' }}>
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
                                        
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
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
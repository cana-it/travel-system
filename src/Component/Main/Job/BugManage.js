
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from 'react-datetime-picker';
import Select from 'react-select';
import { Img } from 'react-image';
import { mainAction } from "../../../Redux/Actions";
import { SelectOfficer,SelectOfficerNew, DataTable,CreateTask } from "../../../Common";
import { Alertwarning, Alertsuccess, Alerterror,FormatDateJson } from "../../../Utils";
import { ProjectDetail } from "./ProjectDetail";
import { IMAGES_DOMAIN,IMAGES_DOMAIN } from "../../../Services";
import ReactHtmlParser from 'react-html-parser';
import 'animate.css';
// Import React Table

export const BugManage = () => {
    const dispatch = useDispatch();
    const CreateBy = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const linkAvatar = IMAGES_DOMAIN;
    const linkJob = IMAGES_DOMAIN;
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

    const [StartDate,setStartDate] = useState('');
    const [Enddate,setEnddate] = useState('');

    const [ProjectId, setProjectId] = useState(0)
    const [dataProject, setDataProject] = useState([])
    const [dataSelect, setDataSelect] = useState([])
    const [valueS, setValueS] = useState({})
    const [AssignTo,setAssignTo] = useState(0);
    const [CreateBug,setCreateBug] = useState(0);
    const [CategoryId,setCategoryId] = useState(0);
    const [CategoryName,setCategoryName] = useState('');

    const Task_spProjectPlan_List = async () => {
        try {
            const params = {
                Json: JSON.stringify({ AreaId: 0 }),
                func: "Task_spProjectPlan_List"
            }
            const list = await mainAction.API_spCallServer(params, dispatch);
            setDataProject(list);
    
            const FirstData = { value: 0, label: "Project" }
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
        //Task_spCategory_Get(item.value);
        Task_spIssueTracking_GetTaskbugDetail(item.value,0,0);
    }

    const onSelectCreateBug = (item) => {
        
        setCreateBug(item);
        Task_spIssueTracking_GetTaskbugDetail(0,item,0);
    }

    const [dataJob, setDataJob] = useState([]);
    const [Status,setStatus] = useState('-1');
    const Task_spIssueTracking_GetTaskbug = async (proid,AssId,sts) => {
        try {
           
            const pr = {
                ProjectId:proid,
                CreateBy:AssignTo,
                CategoryId:CategoryId,
                CreateBug:AssId,
                Status:sts,
                StartDate:StartDate,
                Enddate:Enddate
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTracking_GetTaskbug"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            setDataJob(list);
        } catch (error) {
            ;
            Alerterror("Something wwrong!pls check");
        }
    }

    const [dataJobDetail, setDataJobDetail] = useState([]);
    const [Bugtt,setBugtt] = useState(0);
    const [Bugfn,setBugfn] = useState(0);
    const Task_spIssueTracking_GetTaskbugDetail = async (proid,AssId,Sta) => {
        try {
            const pid = proid === 0 ? ProjectId : proid
            const asid = AssId === 0 ? CreateBug : AssId
            const sts = Sta === 0 ? Status : Sta
            const pr = {
                ProjectId: pid,
                CreateBy:AssignTo,
                CategoryId:CategoryId,
                CreateBug:asid,
                Status:sts,
                StartDate:StartDate,
                Enddate:Enddate
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTracking_GetTaskbugDetail"
            }
    
            const list = await mainAction.API_spCallServer(params, dispatch);
            setDataJobDetail(list);
            setBugtt(list.filter(p => p.Status == 'In progress').length);
            setBugfn(list.filter(p => p.Status == 'Done').length);
            Task_spIssueTracking_GetTaskbug(pid,asid,sts);
        } catch (error) {
            Alerterror("Something wwrong!pls check");
        }
        
    }

    const onSelectStatusFilter = (item) => {
        Task_spIssueTracking_GetTaskbugDetail(0,0,item);
    }

    const [Ishow,setIshow] = useState('block');
    const [IshowForm,setIshowForm] = useState('none');
   
    const onClickProject = () => {
        setIshow('block');
        setIshowForm('none');
        
        //reload project again
        if(ProjectId !== 0) Task_spIssueTracking_GetTaskbugDetail(0,0,0);
    }

    const [ViewSubBug,setViewSubBug] = useState('');
    const [ViewcontentBug,setViewcontentBug] = useState('');
    const [viewImagesBug,setviewImagesBug] = useState('');
    const [viewTimeBug,setviewTimeBug] = useState('');
    

    const [IsShowViewBug,setIsShowViewBug] = useState('none');
    const [IsShowFormBug,setIsShowFormBug] = useState('block');
    const Task_spIssueTrackingDetail_viewBug = (item) => {
        
        setIsShowViewBug('block');
        setIsShowFormBug('none');
        
        setViewSubBug(item.Subject);
        setViewcontentBug(item.Contents);
        setviewImagesBug(item.ImagesLink);
        setviewTimeBug(item.CreaterTimeListBug);

    }

    const Task_spIssueTracking_Backshowformbug = () => {
        setIsShowViewBug('none');
        setIsShowFormBug('block');
    }

    const clickImage = (link) => {
        window.open(link, "myWindow", "width=700,height=700");
    }

    const Clickclasshow  = (index) => {
        
        let obj = document.getElementsByClassName("isdatashow" + index),
        len = obj !== null ? obj.length : 0,
        i = 0,
        Ishow = obj[0].getAttribute("Ishow");
        if(Ishow === "1")
        {
            obj[0].classList.remove("display-none");
            obj[0].setAttribute("Ishow","0");
            
        }
        else
        {
            obj[0].className += " display-none"; 
            obj[0].setAttribute("Ishow","1");
        }    
    }

    const [StautsValue,setStautsValue] = useState({value:"-1",label:"Select Status"});
    const dataStatus = [
        {value:"-1",label:"Select Status"},
        {value:"In progress",label:"In progress"},
        {value:"Working",label:"Working"},
        {value:"QC Review",label:"QC Review"},
        {value:"Fixing",label:"Fixing"},
        {value:"Done",label:"Done"}
    ]

    const onSelectStatus = (item) => {
        
        setStautsValue(item);
        setStatus(item.value);
    }


    /* update task */
    const Task_spIssueTrackingDetail_Update = async (item,type) => {
        if(item.Status === "Archive") return;
        
        if(window.confirm("Are you sure?"))
        {
            const pr = {
                DetailId: item.TaskDetailId,
                OfficeId: CreateBy,
                CreateName:CreateName,
                IsType:type
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTrackingDetail_Update"
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            if(result.Status === "OK")
            {
                Alertsuccess(result.ReturnMess);
                Task_spIssueTracking_GetTaskbugDetail(); // load again task detail.
            }
            else
            {
                Alertwarning(result.ReturnMess);
            }
        }
    }
    return (
    <>
        <div class="row" style={{display:IshowForm}}>
            <CreateTask 
                onTitle="Create new task for project"
                IsProject={true}
                onClickProject = {onClickProject}
            />
        </div>

        <div className="content-wrapper" style={{ backgroundColor: '#ffff',display:Ishow }}>
            <div className="content">
                <div className="container-fluid">
                    <div class="card-body border-left-blue">
                        <h3 className="tit">Follow Bug</h3>
                        
                        <div class="row">
                            <div class="col-sm-12 col-md-6">
                                <div class="form-group row">
                                    <label class="col-sm-4 col-form-label">Name's project:</label>
                                    <div class="col-sm-8 input-group SelectDatetime">
                                        <Select className="SelectMeno"
                                            value={valueS}
                                            onChange={onSelectProject}
                                            options={dataSelect}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-sm-12 col-md-6">
                                <SelectOfficerNew
                                    onSelected = { e => onSelectCreateBug(e.value) }
                                    DepartId={0}
                                    IsFirst = {{value:0,label:'...'}}
                                    IsClass = {1}
                                />   
                            </div>
                                                      
                        </div>
                        <div class="row">
                            <ul class="list-inline" style={{marginTop:'5px'}}>
                                <li class="list-inline-item">
                                    <div onClick={e => onSelectStatusFilter("-1")}  class="iconof" title="All bug" style={{position:'inherit',top:0}}>
                                        {dataJobDetail.length}
                                    </div>
                                </li>
                                
                                <li class="list-inline-item">
                                    <div onClick={e => onSelectStatusFilter("Done")} title="Done"  class="iconof bg-gradient-success" style={{position:'inherit',top:0}}>
                                        {Bugfn}
                                    </div>
                                </li>
                                
                                <li class="list-inline-item">
                                    <div onClick={e => onSelectStatusFilter("In progress")} title="Bug Function" class="iconof bg-gradient-danger" style={{position:'inherit',top:0}}>
                                        {Bugtt}
                                    </div>
                                </li>
                                     
                            </ul>
                        </div>
                            
                        <div class="content" style={{display:IsShowFormBug}}>
                            {
                                dataJob.map((item, index) => {
                                    let classhow = "card-header display-none isdatashow" + index;
                                    return (

                                        <div key={index} className="card card-outline  shadow-sm" style={{marginTop: index !== 0 ? '-0px':'10px' }}>
                                           
                                           <div class={classhow} Ishow="1">
                                                <div class="card-title" style={{color:'#1547d4',fontWeight:'bold',marginLeft:'1%'}}>
                                                    <button onClick={e => Clickclasshow(index)} type="button" class="btn btn-tool" data-card-widget="collapse">
                                                        <i class="fas fa-minus"></i>
                                                    </button>
                                                    {item.Summary} ({dataJobDetail.filter(p => p.TaskId == item.id).length})
                                                </div>
                                            </div>
                                            <div className="card-body" style={{marginTop:'-21px'}}>
                                                <div>
                                                    <table class="table table-nopadding" style={{borderTop:'2px solid #fff'}}>
                                                        <thead>
                                                            <th class="th-title" style={{width:'35%',color:'#1547d4'}}>
                                                                <button onClick={e => Clickclasshow(index)} type="button" class="btn btn-tool" data-card-widget="collapse">
                                                                    <i class="fas fa-minus"></i>
                                                                </button>
                                                                {item.Summary} ({dataJobDetail.filter(p => p.TaskId == item.id).length})
                                                            
                                                            </th>
                                                            <th style={{width:'10%'}}>QC</th>
                                                            <th style={{width:'20%'}}>CreateTime</th>
                                                            <th style={{width:'10%'}}>Status</th>
                                                            <th style={{width:'10%'}}>Dev</th>
                                                            <th style={{width:'20%'}}>Finish</th>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                dataJobDetail.filter(p => p.TaskId == item.id).map((detail, kdt) => {
                                                                    let cStatus = detail.Status;
                                                                    let classStatus = "div-title no-border-radius btn btn-block bg-gradient-danger btn-flat margin-left-5";
                                                                    if (cStatus === "QC Review") classStatus = "background-Violet div-title no-border-radius btn btn-block bg-gradient-warning btn-flat margin-left-5";
                                                                    if (cStatus === "In progress") classStatus = "div-title no-border-radius btn btn-block bg-gradient-danger btn-flat margin-left-5";
                                                                    if (cStatus === "Fixing") classStatus = "div-title no-border-radius btn btn-block bg-gradient-warning btn-flat margin-left-5";
                                                                    if (cStatus === "Archive" || cStatus === "Done") classStatus = "div-title no-border-radius btn btn-block bg-gradient-success btn-flat margin-left-5";
                                                                    
                                                                    return (
                                                                    <tr key={kdt}>
                                                                        <td>
                                                                            <div className="animate__animated animate__backInLeft">
                                                                                <div onClick={ e => Task_spIssueTrackingDetail_viewBug(detail)} class="no-border-radius btn btn-default toastsDefaultDefault border-left-red" style={{textAlign:'left'}}>
                                                                                    {detail.Subject.length >= 25 ? detail.Subject.substring(0,25) + '...' : detail.Subject  }
                                                                                </div>
                                                                            </div>
                                                                            
                                                                        </td>
                                                                        <td>
                                                                            <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                                <Img  height="30" class="table-avatar" src={ IMAGES_DOMAIN + detail.AvatarCreate} alt={detail.CreateName}/>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                                {detail.CreateTime}
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="animate__animated animate__bounce">
                                                                                <div onClick={e => Task_spIssueTrackingDetail_Update(detail,'B')} class={classStatus}>
                                                                                    {detail.Status === "In progress" ? "Working": detail.Status}
                                                                                </div>
                                                                            </div>
                                                                            
                                                                        </td>
                                                                        <td>
                                                                            <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                                <Img  height="30" class="table-avatar" src={ IMAGES_DOMAIN + detail.Avatardev} alt={detail.EditName}/>
                                                                            </div>
                                                                        </td>
                                                                       
                                                                        <td>
                                                                            <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                                {detail.EditTime}
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
                    
                            
                        <div class="row" style={{display:IsShowViewBug}}>
                            <div class="direct-chat-new direct-chat-messages" style={{display:IsShowViewBug}}>
                                <div class="timeline-item">
                                <span class="time"><i class="fas fa-clock"></i> {viewTimeBug}</span>
                                <h3 class="timeline-header">{ViewSubBug}</h3>
                                
                                <div class="timeline-body">
                                    {ReactHtmlParser(ViewcontentBug)}
                                </div>
                                </div>

                                <div class="input-group" style={{marginTop:'10px'}}>
                                    <button  type="button" onClick={Task_spIssueTracking_Backshowformbug} class="btn btn-warning margin-left-5">
                                        <i className="fa fa-undo"></i> Back 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}
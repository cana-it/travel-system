
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from 'react-datetime-picker';
import Select from 'react-select';
import { Img } from 'react-image';
import { mainAction } from "../../../Redux/Actions";
import { SelectOfficer, DataTable,CreateTask } from "../../../Common";
import { Alertwarning, Alertsuccess, Alerterror,FormatDateJson } from "../../../Utils";
import { ProjectDetail } from "./ProjectDetail";
import { IMAGES_DOMAIN,IMAGES_DOMAIN } from "../../../Services";
import ReactHtmlParser from 'react-html-parser';
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
        Task_spCategory_Get(item.value);
    }

    const [dataJob, setDataJob] = useState([]);
    const [Status,setStatus] = useState('-1');
    const Task_spIssueTracking_GetTaskbug = async () => {
        try {
            
            if(StartDate === '' || Enddate === '')
            {
                Alertwarning('Choose Time to View data,pls check');
                return;
            }
            const pr = {
                ProjectId:ProjectId,
                CreateBy:AssignTo,
                CategoryId:CategoryId,
                CreateBug:CreateBug,
                Status:Status,
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
    const Task_spIssueTracking_GetTaskbugDetail = async () => {
        try {
            const pr = {
                ProjectId: ProjectId,
                CreateBy:AssignTo,
                CategoryId:CategoryId,
                CreateBug:CreateBug,
                Status:Status,
                StartDate:StartDate,
                Enddate:Enddate
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTracking_GetTaskbugDetail"
            }
    
            const list = await mainAction.API_spCallServer(params, dispatch);
            setDataJobDetail(list);
            
            setBugtt(list.length);
            setBugfn(list.filter(p => p.Status == 'Archive').length);
            Task_spIssueTracking_GetTaskbug();
        } catch (error) {
            ;
            Alerterror("Something wwrong!pls check");
        }
        
    }

    const [Ishow,setIshow] = useState('block');
    const [IshowForm,setIshowForm] = useState('none');
    const addTask = () => {
        setIshow('none');
        setIshowForm('block');
    }
    const onClickProject = () => {
        setIshow('block');
        setIshowForm('none');
        
        //reload project again
        if(ProjectId !== 0) Task_spIssueTracking_GetTaskbugDetail();
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
        if(IsChangepr)Task_spIssueTracking_GetTaskbugDetail();
    }

    const onIsChange = (item) => {
        setIsChangepr(item);
    }

    const [valueCategory,setValueCategory] = useState({value:0,label:"Category"})
    const onCategory = (item) => {
        
        setValueCategory(item);
        setCategoryId(item.value);
        setCategoryName(item.label);
    }

    const [dataCategory,setDataCategory] = useState([])
    const Task_spCategory_Get = async (ProjectId) => {
        try 
        {
            const pr = {
                UserId : CreateBy,
                ProjectId:ProjectId
            }
    
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spCategory_Get"
            }
    
            const list = await mainAction.API_spCallServer(params, dispatch);
            const FirstData = {value:0,label:"Category"};
            let dataSelect = [];
            dataSelect.push(FirstData);
            list.forEach((element,index) => {
                dataSelect.push({value:element.CategoryId,label:element.CategoryName});
            });
            setDataCategory(dataSelect)
        } catch (error) {
            ;
            Alerterror("Something wwrong!pls check");
        }
        
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
    <div>
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
                        <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group SelectDatetime">
                                        <div class="input-group-prepend ">
                                            <span class="input-group-text">Start Date:</span>
                                        </div>
                                        <DateTimePicker className="z-index-1k"
                                            onChange={onFromDate}
                                            value={IsStartDate}
                                        />
                                    </div>
                                </div>
                        </div>
                        <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group SelectDatetime">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">End Date:</span>
                                        </div>
                                            <DateTimePicker className="z-index-1k"
                                                onChange={onTodate}
                                                value={IsEnddate}
                                            />
                                    </div>
                                </div>
                        </div>
                        <div class="col-sm-12 col-md-4">
                            <div class="form-group">
                                <button type="button" class="btn btn-sm btn-danger pull-left" onClick={Task_spIssueTracking_GetTaskbugDetail}>
                                    <i class="fa fa-eye pr-2"></i>
                                    View Bug
                                </button>
                            </div>
                        </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group SelectDatetime">
                                        <div class="input-group-prepend ">
                                            <span class="input-group-text"><i class="fas fa-clock"></i></span>
                                        </div>
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
                                    <div class="input-group SelectDatetime">
                                        <div class="input-group-prepend ">
                                            <span class="input-group-text"><i class="fas fa-clock"></i></span>
                                        </div>
                                        <Select className="SelectMeno"
                                            value={valueCategory}
                                            onChange={onCategory}
                                            options={dataCategory}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group SelectDatetime">
                                        <div class="input-group-prepend ">
                                            <span class="input-group-text"><i class="fas fa-user"></i></span>
                                        </div>
                                        <SelectOfficer
                                            onSelected = { e => setCreateBug(e.value) }
                                            DepartId={0}
                                            IsFirst = {{value:0,label:'User qc'}}
                                            IsClass = {1}
                                        />
                                    </div>
                                </div>
                            </div>
                                                      
                        </div>
                        <div class="row">
                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group SelectDatetime">
                                        <div class="input-group-prepend ">
                                            <span class="input-group-text"><i class="fas fa-user"></i></span>
                                        </div>
                                        <SelectOfficer
                                            onSelected = { e => setAssignTo(e.value) }
                                            DepartId={0}
                                            IsFirst = {{value:0,label:'User dev'}}
                                            IsClass = {1}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-4">
                                <div class="form-group">
                                    <div class="input-group SelectDatetime">
                                        <div class="input-group-prepend ">
                                            <span class="input-group-text"><i class="fas fa-user"></i></span>
                                        </div>
                                        <Select className="SelectMeno"
                                            value={StautsValue}
                                            onChange={onSelectStatus}
                                            options={dataStatus}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 col-md-4">
                                <span class="div-title badge badge-danger margin-left-10">Bug: {Bugtt}</span>                   
                                <span class="div-title badge badge-success margin-left-10">Finish: {Bugfn}</span> 
                            </div>
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
                                                            <th class="th-title" style={{width:'25%',color:'#1547d4'}}>
                                                                <button onClick={e => Clickclasshow(index)} type="button" class="btn btn-tool" data-card-widget="collapse">
                                                                    <i class="fas fa-minus"></i>
                                                                </button>
                                                                {item.Summary} ({dataJobDetail.filter(p => p.TaskId == item.id).length})
                                                            
                                                            </th>
                                                            <th style={{width:'10%'}}>QC</th>
                                                            <th style={{width:'20%'}}>CreateTime</th>
                                                            <th style={{width:'25%'}}>Status</th>
                                                            <th style={{width:'10%'}}>Dev</th>
                                                            <th style={{width:'15%'}}>Finish</th>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                dataJobDetail.filter(p => p.TaskId == item.id).map((detail, kdt) => {
                                                                    let cStatus = detail.Status;
                                                                    let classStatus = "div-title no-border-radius btn btn-block bg-gradient-danger btn-flat margin-left-5";
                                                                    if (cStatus === "QC Review") classStatus = "background-Violet div-title no-border-radius btn btn-block bg-gradient-danger btn-flat margin-left-5";
                                                                    if (cStatus === "In progress") classStatus = "background-blue div-title no-border-radius btn btn-block bg-gradient-danger btn-flat margin-left-5";
                                                                    if (cStatus === "Fixing") classStatus = "div-title no-border-radius btn btn-block bg-gradient-warning btn-flat margin-left-5";
                                                                    if (cStatus === "Archive" || cStatus === "Done") classStatus = "div-title no-border-radius btn btn-block bg-gradient-success btn-flat margin-left-5";
                                                                    
                                                                    return (
                                                                    <tr key={kdt}>
                                                                        <td>
                                                                            <div onClick={ e => Task_spIssueTrackingDetail_viewBug(detail)} class="no-border-radius btn btn-default toastsDefaultDefault border-left-red" style={{textAlign:'left'}}>
                                                                                {detail.Subject.length >= 25 ? detail.Subject.substring(0,25) + '...' : detail.Subject  }
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                                <Img  height="30" alt="Avatar" class="table-avatar" src={ IMAGES_DOMAIN + detail.AvatarCreate} alt={detail.CreateName}/>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                                {detail.CreateTime}
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div onClick={e => Task_spIssueTrackingDetail_Update(detail,'B')} class={classStatus}>
                                                                                {detail.Status}
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                                                <Img  height="30" alt="Avatar" class="table-avatar" src={ IMAGES_DOMAIN + detail.Avatardev} alt={detail.EditName}/>
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
    </div>
    )
}
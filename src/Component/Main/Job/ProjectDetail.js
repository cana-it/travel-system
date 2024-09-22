import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../Redux/Actions';
import DateTimePicker from 'react-datetime-picker';
import { SelectOfficer, SelectPriority,TinyMCE } from '../../../Common';
import { Alertwarning, Alertsuccess, Alerterror, FormatDateJson } from '../../../Utils';
import { Img } from 'react-image';
import axios, { post } from 'axios';
import {IMAGES_DOMAIN,IMAGES_DOMAIN,API_END_POINT} from "../../../Services";
import ReactHtmlParser from 'react-html-parser';
import Modal from 'react-modal';
import HtmlParser from 'react-html-parser';
const ProjectDetailComp = ({
    onClickProjectDetail = () => { },
    isData = {},
    onTitle = -1,
    IsChange = (item) => { }
}) => {

    const dispatch = useDispatch();
    const linkAvatar = IMAGES_DOMAIN;
    const linkJob = IMAGES_DOMAIN;
    const CreateBy = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    useEffect(() => {
        Task_spIssueTracking_Detail_Load();
        Task_spIssueTrackingChat_Load();
    }, [isData]);

    const ClickProjectDetail = () => {
        onClickProjectDetail();
    }

    /* Load data task detail and error for the task in the project */
    const [dataTaskdetail,setDataTaskdetail] = useState([]);
    const [dataTaskError,setdataTaskError] = useState([]);
    const [totalTask,settotalTask] = useState(0);
    const [totalTaskfn,settotalTaskfn] = useState(0);
    const [totalError,settotalError] = useState(0);
    const [totalErrorfn,settotalErrorfn] = useState(0);
    const Task_spIssueTracking_Detail_Load = async () => {
        
        try {
            const pr = {
                TaskId: isData.id,
                OfficeId: CreateBy
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTracking_Detail_Load"
            }
    
            const List = await mainAction.API_spCallServer(params, dispatch);
            const Task = List.filter(p => p.IsType === "A");
            const Error = List.filter(p => p.IsType === "B");
            setDataTaskdetail(Task);
            setdataTaskError(Error);
            settotalTask(Task.length);
            settotalTaskfn(Task.filter(p => p.Status === "Done").length);
            settotalError(Error.length);
            settotalErrorfn(Error.filter(p => p.Status === "Done").length);
        } catch (error) {
            Alerterror("Error API, pls check");
            ;
        }
        
    }

    const [TaskSubject,setTaskSubject] = useState('');
    const [Contents,setContents] = useState('');
    const [ContentTinyMCE,setContentTinyMCE] = useState('');
    const [ImagesLink,setImagesLink] = useState('');
    const [IsDisAddtask,setIsDisAddtask] = useState(true);
    const [IshowCreateTask,setIshowCreateTask] = useState('none');
    const [IshowFromTask,setIshowFromTask] = useState('block');
    const [Uploadimg,setUploadimg] = useState(undefined);
    const [IsSend,setIsSend] = useState(0);
    const [DetailId,setDetailId] = useState(0);
    const [Priority,setPriority] = useState(0);
    const [DevId,setDevId] =  useState(0);
    const [IsDevId,setIsDevId] =  useState();
    const ImagesFile = (item) => {
        const file = item.target.files;
        setUploadimg(file);
    }

    const Task_spIssueTrackingDetail_Save = async (IsType) => {
        
        try 
        {
            
            if(TaskSubject === "")
            {
                Alertwarning("Enter the contents,pls");
                return;
            }

            let Contentspr = ""
            if(Contents.includes('"')) Contentspr = Contents.replaceAll('"',"||");
            
            Contentspr = Contentspr.replace(/!|\|~/g, "");

            if(Contentspr === "") Contentspr = Contents;

            let linkfile = "";

            const pr = {
                TaskId: isData.id,
                OfficeId: CreateBy,
                CreateName:CreateName,
                Subject:TaskSubject,
                Contents:Contentspr,
                ImagesLink:linkfile,
                IsType:IsType,
                IsSend:IsSend,
                DetailId:DetailId,
                Priority:Priority,
                DevId:DevId

            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTrackingDetail_Save"
            }

            setIsDisAddtask(false);
            const result = await mainAction.API_spCallServer(params, dispatch);
            if(result.Status === "OK")
            {
                Alertsuccess(result.ReturnMess);
                Task_spIssueTracking_Detail_Load(); // load again task detail.
            }
            else
            {
                Alertwarning(result.ReturnMess);
            }
            setIsDisAddtask(true);
            IsChange(true); // reload main project page 1
            
        } catch (error) {
            Alerterror("Error API, pls check");
            ;
        }
        
    }

    const fileUpload = async (file) => {
        
        const url = API_END_POINT + '/ApiMain/UploadImgJob';
        const formData = new FormData();
        for(let i = 0;i < file.length;i++)
        {
            formData.append('file',file[i]);
        }
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return  await post(url, formData,config)
      }

    const [EditerTask,setEditerTask] = useState(0);
    const Task_spIssueTrackingDetail_ViewEdit = (item) => {
        
        
        try {
            
            setTaskSubject(item.Subject);
            setDetailId(item.TaskDetailId);
            setContents(item.Contents);
            setContentTinyMCE(item.Contents);
            setImagesLink(item.ImagesLink);
            setIshowCreateTask('block');
            setIshowFromTask('none');

            setEditerTask(item.Creater);
        } catch (error) {
            ;
            Alerterror("Something wwrong!pls check");
        }
    }

    const Task_spIssueTrackingDetail_showform = () => {
        setIshowCreateTask('block');
        setIshowFromTask('none');
        setDetailId(0);
        setTaskSubject('');
        setContents('');
        setContentTinyMCE('');
    }
    const [IshowviewTask,setIshowviewTask] = useState('none');
    const Task_spIssueTrackingDetail_Backshowform = () => {
        setIshowCreateTask('none');
        setIshowviewTask('none');
        setIshowFromTask('block');
    }

    /* view function */
    const [ViewSub,setViewSub] = useState('');
    const [Viewcontent,setViewcontent] = useState('');
    const [viewImages,setviewImages] = useState('');
    const [viewTime,setviewTime] = useState('');
    const Task_spIssueTrackingDetail_view = (item) => {
        
        setIshowviewTask('block');
        setIshowFromTask('none');
        setViewSub(item.Subject);
        setViewcontent(item.Contents);
        setviewImages(item.ImagesLink);
        setviewTime(item.CreateTime);
        setDetailId(item.TaskDetailId);

    }
    const clickImage = (link) => {
        window.open(link, "myWindow", "width=700,height=700");
    }
   
    /* update task */
    const [EstimatesHour,setEstimatesHour] = useState(0);
    const [TrackingDetail,setTrackingDetail] = useState();
    const [TypeDetail,setTypeDetail] = useState('');
    const [Disablebtn,setDisablebtn] = useState(true);
    const [Statusfn,setStatusfn] = useState('');
    const Task_spIssueTrackingDetail_Update = async () => {
       try {
            
            // dev can not update
           if((Statusfn === "Done" || Statusfn === "Fixing") && CreateBy !== TrackingDetail.Creater && TypeDetail === "B")
           {
               Alerterror("You don't have permisstion");
               return;
           }

           // QC can not update
           if((Statusfn === "Working" || Statusfn === "QC Review") && CreateBy !== TrackingDetail.DevId && TypeDetail === "B")
           {
               Alerterror("You don't have permisstion");
               return;
           }
           const pr = {
                DetailId: TrackingDetail.TaskDetailId,
                OfficeId: CreateBy,
                CreateName:CreateName,
                IsType:TypeDetail,
                Status:Statusfn,
                EstimatesHour:EstimatesHour
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTrackingDetail_Update"
            }

            setDisablebtn(false);
            const result = await mainAction.API_spCallServer(params, dispatch);
            if(result.Status === "OK")
            {
                Alertsuccess(result.ReturnMess);
                Task_spIssueTracking_Detail_Load(); // load again task detail.
                closeModal();
                setTrackingDetail(null);
                setTypeDetail('');
                setStatusfn('');
            }
            else
            {
                Alertwarning(result.ReturnMess);
            }
            setDisablebtn(true);
            //IsChange(true); // reload main project page 1
       } catch (error) {
           Alerterror("The API is wrong, Contact dev");
       }
    }

    const [TitleJob,setTitleJob] = useState('');
    const Task_spIssueTrackingDetail_Open = (item,type) => {
        setEstimatesHour(item.EstimatesHour);
        setTitleJob(item.Subject);
        setTrackingDetail(item);
        setTypeDetail(type);
        setIsDevId(item.DevId);
        setDevId(item.DevId);
        setPriority(item.Priority);
        setStatusfn(item.Status);
        openModal();
    }

    /* delete task */
    const Task_spIssueTrackingDetail_Delete = async (item) => {
        if(window.confirm("Are you sure?"))
        {
            try 
            {
                const pr = {
                    DetailId: item.TaskDetailId,
                    OfficeId: CreateBy,
                    CreateName:CreateName
                }
                const params = {
                    Json: JSON.stringify(pr),
                    func: "Task_spIssueTrackingDetail_Delete"
                }
        
                const result = await mainAction.API_spCallServer(params, dispatch);
                if(result.Status === "OK")
                {
                    Alertsuccess(result.ReturnMess);
                }
                else
                {
                    Alerterror(result.ReturnMess);
                }
                
                const dataoke = [...dataTaskdetail];
                let DataTask = dataoke.filter(p => p.TaskDetailId !== item.TaskDetailId);
                setDataTaskdetail(DataTask);
                settotalTask(DataTask.length);
                settotalTaskfn(DataTask.filter(p => p.Status === "Done").length);
                IsChange(true); // reload main project page 1
            } catch (error) {
                Alerterror("Error API, pls check");
                ;
            }
            
        }
    }
    /*Delete bug */
    const Task_spIssueTrackingDetail_DeleteBug = async (item) => {
        if(window.confirm("Are you sure?"))
        {
            try 
            {
                const pr = {
                    DetailId: item.TaskDetailId,
                    OfficeId: CreateBy,
                    CreateName:CreateName
                }
                const params = {
                    Json: JSON.stringify(pr),
                    func: "Task_spIssueTrackingDetail_Delete"
                }
        
                const result = await mainAction.API_spCallServer(params, dispatch);
                if(result.Status === "OK")
                {
                    Alertsuccess(result.ReturnMess);
                }
                else
                {
                    Alerterror(result.ReturnMess);
                }
                
                const dataoke = [...dataTaskError];
                let DataTask = dataoke.filter(p => p.TaskDetailId !== item.TaskDetailId);
                setdataTaskError(DataTask);
                settotalError(DataTask.length);
                settotalErrorfn(DataTask.filter(p => p.Status === "Done").length);
                IsChange(true); // reload main project page 1
            } catch (error) {
                Alerterror("Error API, pls check");
                ;
            }
            
        }
    }

    /* task bug */
    const [IsShowFormBug,setIsShowFormBug] = useState('block');
    const [IsShowFormCreateBug,setIsShowFormCreateBug] = useState('none');
    const [IsShowViewBug,setIsShowViewBug] = useState('none');
    const [IsShowFormCreateCheckListBug,setIsShowFormCreateCheckListBug] = useState('none');
    const Task_spIssueTrackingDetail_showformaddBug = () => {
        setIsShowFormBug('none');
        setIsShowFormCreateBug('block');
        setDetailId(0);
        setTaskSubject('');
        setContents('');
        setContentTinyMCE('');
        setEditerBug(0);
    }
    const Task_spIssueTrackingDetail_Backshowformbug = () => {
        setIsShowFormBug('block');
        setIsShowFormCreateBug('none');
        setIsShowViewBug('none');
        setIsShowFormCreateCheckListBug('none');
    }
    const [ViewSubBug,setViewSubBug] = useState('');
    const [ViewcontentBug,setViewcontentBug] = useState('');
    const [viewImagesBug,setviewImagesBug] = useState('');
    const [viewTimeBug,setviewTimeBug] = useState('');
    const Task_spIssueTrackingDetail_viewBug = (item) => {
        setIsShowViewBug('block');
        setIsShowFormBug('none');
        
        setViewSubBug(item.Subject);
        setViewcontentBug(item.Contents);
        setviewImagesBug(item.ImagesLink);
        setviewTimeBug(item.CreateTime);
        Task_spIssueTracking_DetailChat_Load(item.TaskDetailId);
        setTaskDetailId(item.TaskDetailId);

    }

    const [EditerBug,setEditerBug] = useState(0);
    const Task_spIssueTrackingDetail_EditBug = (item) => {
        try {
            
            setTaskSubject(item.Subject);
            setDetailId(item.TaskDetailId);
            setContents(item.Contents);
            setContentTinyMCE(item.Contents);
            setImagesLink(item.ImagesLink);
            setEditerBug(item.Creater);
            setDevId(item.DevId);
            setIsDevId(item.DevId);
            setPriority(item.Priority);

            setIsShowFormCreateBug('block');
            setIsShowFormBug('none');
            
        } catch (error) {
            ;
            Alerterror("Something wwrong!pls check");
        }
    }
    const ShowFormCreateCheckListBug = () => {
        setIsShowFormCreateCheckListBug('block');
        setIsShowFormBug('none');
        setIsShowFormCreateBug('none');
        setIsShowViewBug('none');
    }

    /* Load data chat for the task in the project */
    const [dataChat,setdataChat] = useState([]);
    const Task_spIssueTrackingChat_Load = async () => {
        try 
        {
            const pr = {
                TaskId: isData.id,
                OfficeId: CreateBy
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTrackingChat_Load"
            }
    
            const list = await mainAction.API_spCallServer(params, dispatch);
            setdataChat(list);
            setIsTotalChat(list.length);
        } catch (error) {
            Alerterror("Error API, pls check");
            ;
        }
        
    }

    const [ChatContent,setChatContent] = useState('');
    const [IsDischat,setIsDischat] = useState(true);
    const [IsTotalChat,setIsTotalChat] = useState(0);
    const Task_spIssueTrackingChat_Save = async () => {
        try 
        {
            
            const pr = {
                IdTask: isData.id,
                ChatContent:ChatContent,
                Createby: CreateBy,
                CreateName:CreateName
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTrackingChat_Save"
            }
            setIsDischat(false);
            const list = await mainAction.API_spCallServer(params, dispatch);
            const dataChatnew = [...dataChat];
            dataChatnew.push(list[0]);
            setdataChat(dataChatnew);
            setChatContent('');
            setIsDischat(true);
            setIsTotalChat(dataChatnew.length);
            IsChange(true); // reload main project page 1
        } catch (error) {
            ;
            Alerterror("Something wwrong!pls check");
        }
        
    };


    const [dataChatBug,setdataChatBug] =  useState([]);
    const Task_spIssueTracking_DetailChat_Load = async (TaskDetailId) => {
        try 
        {
            const pr = {
                TaskId: TaskDetailId,
                OfficeId: CreateBy
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTracking_DetailChat_Load"
            }
    
            const list = await mainAction.API_spCallServer(params, dispatch);
            setdataChatBug(list);
        } catch (error) {
            Alerterror("Error API, pls check");
            ;
        }
        
    }

    const [ContentTinyMCEBug,setContentTinyMCEBug] = useState('');
    const [ChatContentBug,setChatContentBug] = useState('');
    const [IsDischatBug,setIsDischatBug] = useState(true);
    const [TaskDetailId,setTaskDetailId] =  useState();
    const Task_spIssueTracking_DetailChat_Save = async () => {
        try 
        {

            let Contentspr = ""
            if(ChatContentBug.includes('"')) Contentspr = ChatContentBug.replaceAll('"',"||");
            
            Contentspr = Contentspr.replace(/!|\|~/g, "");

            if(Contentspr === "") Contentspr = ChatContentBug;

            
            const pr = {
                IdTask: TaskDetailId,
                ChatContent:Contentspr,
                Createby: CreateBy,
                CreateName:CreateName
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTracking_DetailChat_Save"
            }
            setIsDischatBug(false);
            const list = await mainAction.API_spCallServer(params, dispatch);
            const dataChatnew = [...dataChatBug];
            dataChatnew.push(list[0]);
            setdataChatBug(dataChatnew);
            setChatContentBug('');
            setContentTinyMCEBug('');
            setIsDischatBug(true);
        } catch (error) {
            setIsDischatBug(true);
            ;
            Alerterror("Something wwrong!pls check");
        }
        
    };

    /* Manage Bug */
    const [CheckListBug,setCheckListBug] = useState('');
    const [CreaterTimeListBug,setCreaterTimeListBug] = useState('');
    const [IsDisbtnChecklist,setIsDisbtnChecklist] = useState(true);
    const Task_spIssueTrackingCheckList_Save = async () => {
        try 
        {
            if(CheckListBug === '')
            {
                Alertwarning("Enter the content,Pls");
                return;
            }
            const pr = {
                TaskId:isData.id,
                CreateBy:CreateBy,
                CheckListBug:CheckListBug
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spIssueTrackingCheckList_Save"
            }
            setIsDisbtnChecklist(false);
            const result = await mainAction.API_spCallServer(params, dispatch);
            if(result.length > 0)
            {
                Alertsuccess("Add check list success!");
                setCreaterTimeListBug(result[0].CreaterTimeListBug);
            }
            else
            {
                Alertwarning("Something wrong! pls check");
            }
            setIsDisbtnChecklist(true);
            IsChange(true); // reload main project page 1
        } catch (error) {
            ;
            Alerterror("Something wwrong!pls check");
        }
        

    }

    const onIsSend = () => {
        IsSend === 0 ? setIsSend(1) : setIsSend(0);
    }

    const [SreenChat,setSreenChat] = useState('block');
    const [SreenTask,setSreenTask] = useState('block');
    const [SreenBug,setSreenBug] = useState('block');

    const [SreenKeyBug,setSreenKeyBug] = useState("block");
    const [SreenKeyTask,setSreenKeyTask] = useState("block");
    const FullSreenBug = () => {
        if(SreenKeyBug === "block")
        {
            setSreenBug("block");
            setSreenChat("none");
            setSreenTask("none");

            setSreenKeyBug("none");
        }
        else
        {
            setSreenBug("block");
            setSreenChat("block");
            setSreenTask("block");

            setSreenKeyBug("block");
        }
        
    }

    const FullSreenTask = () => {
        if(SreenKeyTask === "block")
        {
            setSreenBug("none");
            setSreenChat("none");
            setSreenTask("block");

            setSreenKeyTask("none");
        }
        else
        {
            setSreenBug("block");
            setSreenChat("block");
            setSreenTask("block");

            setSreenKeyTask("block");
        }
    }

    const [modalIsOpen,setIsOpen] = useState(false);

    const openModal = ()  => {
        setIsOpen(true);
    }

    const closeModal = () =>{
        setIsOpen(false);
    }

    return (
        <div className="content-wrapper">

        <div class="content row">
            <div class="col-sm-12 col-md-6">
                <div class="form-group">
                    <h3 className="tit">Follow task : {isData.Summary}</h3>
                </div>
            </div>
            
            <div class="col-sm-12 col-md-6">
                <div class="form-group">
                    <button type="button" class="btn btn-sm btn-danger pull-right margin-left-5" onClick={ClickProjectDetail}>
                        <i class="fa fa-undo pr-2"></i>
                        Back to Project
                    </button>
                </div>
            </div>

        </div>

            <div class="row">
                {/* Chat */}
                <div class="col-md-3" style={{display:SreenChat}}>
                    <div class="card card-success card-outline direct-chat direct-chat-success shadow-sm">
                        <div class="card-header">
                            <h3 class="card-title">Chat</h3>

                            <div class="card-tools">
                                <span title="3 New Messages" class="badge bg-success">{IsTotalChat}</span>
                                <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                    <i class="fas fa-minus"></i>
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="direct-chat-new direct-chat-messages">
                                {
                                    dataChat.map((item,index) => {
                                        
                                        if(item.CreateBy === CreateBy)
                                        {
                                            return(
                                                <div key={index} class="direct-chat-msg">
                                                    <div class="direct-chat-infos clearfix">
                                                        <span class="direct-chat-name float-left">{item.OfficerName}</span>
                                                        <span class="direct-chat-timestamp float-right">{item.CreateDate}</span>
                                                    </div>
                                                    <Img class="direct-chat-img" src={linkAvatar + item.Avatar} alt={item.OfficerName} />
                                                    <div class="direct-chat-text">
                                                        {item.ChatContent}
                                                    </div>
                                                </div>
                                            )
                                        }
                                        else
                                        {
                                            return(

                                                <div key={index} class="direct-chat-msg right">
                                                    <div class="direct-chat-infos clearfix">
                                                        <span class="direct-chat-name float-right">{item.OfficerName}</span>
                                                        <span class="direct-chat-timestamp float-left">{item.CreateDate}</span>
                                                    </div>
                                                    <Img class="direct-chat-img" src={linkAvatar + item.Avatar} alt={item.OfficerName} />
                                                    <div class="direct-chat-text">
                                                        {item.ChatContent}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })
                                }                               
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="input-group">
                                <input type="text" name="message" value={ChatContent} onChange={e => setChatContent(e.target.value)} placeholder="Type Message ..." class="form-control" />
                                <span class="input-group-append">
                                    <button disabled={!IsDischat} type="button" onClick={Task_spIssueTrackingChat_Save} class="btn btn-success">Send</button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Chat */}

                {/* Task */}
                <div class={SreenKeyTask === "block" ? "col-md-4" : "col-md-12"} style={{display:SreenTask}}>
                    <div class="card card-warning card-outline direct-chat direct-chat-warning shadow-sm">
                        <div class="card-header">
                            <h3 class="card-title">Task: {isData.Summary}</h3>

                            <div class="card-tools">
                                <span title="3 New Messages" class="badge bg-warning">{totalTaskfn}/{totalTask}</span>
                                <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                    <i class="fas fa-minus"></i>
                                </button>
                            </div>
                        </div>

                        <div class="card-body">
                            <div class="direct-chat-new direct-chat-messages" style={{display:IshowviewTask}}>
                                <div class="timeline-item">
                                <span class="time"><i class="fas fa-clock"></i> {viewTime}</span>
                                <h3 class="timeline-header">{ViewSub}</h3>
                                <div class="timeline-body">
                                    {ReactHtmlParser(Viewcontent)}
                                </div>
                                </div>

                                <div class="input-group" style={{marginTop:'10px'}}>
                                    <button  type="button" onClick={Task_spIssueTrackingDetail_Backshowform} class="btn btn-warning margin-left-5">
                                        <i className="fa fa-undo"></i> Back 
                                    </button>
                                </div>
                            </div>
                            
                            {/* Manage add/edit task */}
                            <div class="direct-chat-new direct-chat-messages" style={{display:IshowCreateTask}}>
                                <h4>Creare a new task</h4>
                                <div class="input-group">
                                    <input type="text" name="message" value={TaskSubject} onChange={e => setTaskSubject(e.target.value)}  placeholder="Enter subject" class="form-control" />
                                </div>
                                <div class="input-group" style={{marginTop:'10px'}}>
                                    {/* <textarea rows="10" class="form-control" value={Contents} onChange={e => setContents(e.target.value)} placeholder="Enter Contents">
                                        
                                    </textarea> */}
                                    <TinyMCE 
                                        onSelected = {e => setContents(e)}
                                        Values={ContentTinyMCE}
                                    />
                                </div>
                                
                                <div class="input-group" style={{marginTop:'10px'}}>
                                    <button style={{display:(EditerTask === parseInt(CreateBy) || EditerTask === 0) ? "block" : "none"}}  type="button" onClick={e => Task_spIssueTrackingDetail_Save('A')} class="btn btn-warning">
                                        <i className="fa fa-plus"></i> Save 
                                    </button>
                                    <button  type="button" onClick={Task_spIssueTrackingDetail_Backshowform} class="btn btn-warning margin-left-5">
                                        <i className="fa fa-undo"></i> Back 
                                    </button>
                                    <button  type="button" onClick={FullSreenTask} class="btn btn-sm btn-warning" style={{marginLeft:'5px'}}>
                                        <i className="fas fa-expand-arrows-alt"></i> 
                                        {SreenKeyTask === "block" ? "Full" : "Small"} 
                                    </button>
                                </div>
                            </div>
                            {/* End Manage add/edit task */}
                            
                            {/* Manage List task */}
                            <div class="direct-chat-new direct-chat-messages" style={{display:IshowFromTask}}>
                                <div class="row margin-left-5" style={{height:'300px',overflow:'auto'}}>
                                    <div class="timeline-item">
                                        <span class="time"><i class="fas fa-clock"></i> {isData.DueDate}</span>
                                        <div class="timeline-body">
                                            <p>{ReactHtmlParser(isData.Contents)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-responsive" style={{width: SreenKeyTask === "block" ? "200%" : "100%",overflowX:'hidden'}}>
                                <table class="table table-nopadding">
                                    <thead>
                                        <th style={{width:'25%'}}> Func</th>
                                        <th> Status</th>
                                        <th> Owner</th>
                                        <th> Due Date</th>
                                        <th> Ely</th>
                                        <th> Time</th>
                                        <th> Del</th>
                                    </thead>
                                    <tbody>
                                        {
                                            dataTaskdetail.map((detail, kdt) => {
                                                let cStatus = detail.Status;
                                                let classStatus = "div-title no-border-radius btn btn-block bg-gradient-danger btn-flat margin-left-5";
                                                if (cStatus === "In progress") classStatus = "background-blue div-title no-border-radius btn btn-block bg-gradient-danger btn-flat margin-left-5";
                                                if (cStatus === "Done") classStatus = "div-title no-border-radius btn btn-block bg-gradient-success btn-flat margin-left-5";
                                                
                                                return (
                                                <tr key={kdt}>
                                                    
                                                    <td title={detail.Subject}>
                                                        <div onClick={e => Task_spIssueTrackingDetail_ViewEdit(detail)} class="no-border-radius btn btn-default toastsDefaultDefault border-left-red"  style={{textAlign:'left'}}>
                                                        {detail.Subject.length >= 18 ? detail.Subject.substring(0,18) + '...' : detail.Subject  }
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div onClick={e => Task_spIssueTrackingDetail_Open(detail,'Task')} class={classStatus}>
                                                            {detail.Status}
                                                        </div>
                                                    </td>
                                                    
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                            <Img alt="Avatar"  height="30"  class="table-avatar" src={linkAvatar + detail.Avatar} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                            {detail.CreateTime}
                                                        </div>
                                                    </td>
                                                    
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                            <Img alt="Avatar"  height="30"  class="table-avatar" src={linkAvatar + detail.AvatarEditor} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                            {detail.EditTime}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                    
                                                            <button onClick={e => Task_spIssueTrackingDetail_Delete(detail)} disabled={detail.Status === "Done" ? true:false} class="btn btn-sm btn-danger margin-left-5" style={{marginTop:'-10px'}}>
                                                                <i class="fa fa-trash"></i>
                                                            </button>
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
                            {/* End Manage List task */}
                        </div>
                        <div class="card-footer" style={{display:IshowFromTask}}>
                            <div class="input-group">
                                <input type="text" readOnly name="message"  placeholder="Create new task" class="form-control" />
                                <span class="input-group-append">
                                    <button disabled={!IsDischat} type="button" onClick={Task_spIssueTrackingDetail_showform} class="btn btn-warning">
                                     <i className="fa fa-plus"></i> Add Task
                                    </button>
                                    <button  type="button" onClick={FullSreenTask} class="btn btn-sm btn-warning" style={{marginLeft:'5px'}}>
                                        <i className="fas fa-expand-arrows-alt"></i> 
                                        {SreenKeyTask === "block" ? "Full" : "Small"} 
                                    </button>
                                </span>
                            </div>
                        </div>
                   
                    </div>
                </div>
                 {/* End Task */}

                {/* Bug */}
                <div class={SreenKeyBug === "block" ? "col-md-5" : "col-md-12"} style={{display:SreenBug}}>
                    <div class="card card-danger card-outline direct-chat direct-chat-danger shadow-sm">
                        <div class="card-header">
                            <h3 class="card-title">List Bug</h3>
                            <div class="card-tools">
                                <button onClick={ShowFormCreateCheckListBug} style={{marginTop:'-10px',marginRight:'5px'}} class="btn btn-sm btn-danger">
                                    <i class="fa fa-plus"></i>
                                    {isData.CheckListBug === "NA" ? "Add Check List?" : "Edit Check List"}
                                </button>
                                <span title="3 New Messages" class="badge bg-danger">{totalErrorfn}/{totalError}</span>
                                <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                    <i class="fas fa-minus"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="card-body">
                            {/* Creare Check List */}
                            <div class="direct-chat-new direct-chat-messages" style={{display:IsShowFormCreateCheckListBug}}>
                                    <h4>Creare Check List</h4>
                                    
                                    <div class="input-group" style={{marginTop:'10px'}}>
                                        <textarea rows="15" class="form-control" value={CheckListBug === '' ? isData.CheckListBug:CheckListBug} onChange={e => setCheckListBug(e.target.value)} placeholder="Enter Contents check list">
                                        </textarea>
                                    </div>
                                    
                                    <div class="input-group" style={{marginTop:'10px'}}>
                                        <button  type="button" disabled={!IsDisbtnChecklist} onClick={Task_spIssueTrackingCheckList_Save} class="btn btn-warning">
                                            <i className="fa fa-plus"></i> Create 
                                        </button>
                                        <button  type="button" onClick={Task_spIssueTrackingDetail_Backshowformbug} class="btn btn-warning margin-left-5">
                                            <i className="fa fa-undo"></i> Back 
                                        </button>
                                    </div>
                            </div>
                            <div class="direct-chat-new direct-chat-messages" style={{display:IsShowViewBug}}>
                                <div class="timeline-item">
                                    <span class="time margin-left-5"><i class="fas fa-clock"></i> {viewTimeBug}</span>
                                    <h3 class="timeline-header margin-left-5">{ViewSubBug}</h3>
                                    <div class="timeline-body margin-left-5">
                                        {ReactHtmlParser(ViewcontentBug)}
                                    </div>
                                
                                </div>
                                <div class="card-body">
                                <h4>Chat history!</h4>
                                <div class="direct-chat-new direct-chat-messages" style={{height:'auto'}}>
                                    {
                                        dataChatBug.map((item,index) => {
                                            
                                            if(item.CreateBy === CreateBy)
                                            {
                                                return(
                                                    <div key={index} class="direct-chat-msg">
                                                        <div class="direct-chat-infos clearfix">
                                                            <span class="direct-chat-name float-left">{item.OfficerName}</span>
                                                            <span class="direct-chat-timestamp float-right">{item.CreateDate}</span>
                                                        </div>
                                                        <Img class="direct-chat-img" src={linkAvatar + item.Avatar} alt={item.OfficerName} />
                                                        <div class="direct-chat-text" style={{backgroundColor:'#fff',color:'#101010'}}>
                                                            {ReactHtmlParser(item.ChatContent)}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            else
                                            {
                                                return(

                                                    <div key={index} class="direct-chat-msg right">
                                                        <div class="direct-chat-infos clearfix">
                                                            <span class="direct-chat-name float-right">{item.OfficerName}</span>
                                                            <span class="direct-chat-timestamp float-left">{item.CreateDate}</span>
                                                        </div>
                                                        <Img class="direct-chat-img" src={linkAvatar + item.Avatar} alt={item.OfficerName} />
                                                        <div class="direct-chat-text" style={{backgroundColor:'#fff',color:'#101010'}}>
                                                        {ReactHtmlParser(item.ChatContent)}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    }                               
                                </div>
                                </div>
                                <div class="card-footer">
                                    <div class="input-group">
                                        {/* <input type="text" name="message" value={ChatContentBug} onChange={e => setChatContentBug(e.target.value)} placeholder="Type Message ..." class="form-control" /> */}
                                        <TinyMCE 
                                            onSelected = {e => setChatContentBug(e)}
                                            Values = {ContentTinyMCEBug}
                                            height={350}
                                        />
                                        <span class="input-group-append">
                                            <button disabled={!IsDischatBug} type="button" onClick={Task_spIssueTracking_DetailChat_Save} class="btn btn-success">Send</button>
                                        </span>
                                    </div>
                                </div>

                                <div class="input-group" style={{marginTop:'10px'}}>
                                    <button  type="button" onClick={Task_spIssueTrackingDetail_Backshowformbug} class="btn btn-warning margin-left-5">
                                        <i className="fa fa-undo"></i> Back 
                                    </button>

                                    <button  type="button" onClick={FullSreenBug} class="btn btn-sm btn-danger" style={{marginLeft:'5px'}}>
                                        <i className="fas fa-expand-arrows-alt"></i> 
                                        {SreenKeyBug === "block" ? "Full" : "Small"}
                                          
                                    </button>
                                </div>

                                
                            </div>
                            {/*end Creare Check List */}

                            {/*Manage add/edit bug */}
                            <div class="direct-chat-new direct-chat-messages" style={{display:IsShowFormCreateBug}}>
                                <h4>Manage bug</h4>
                                <div class="input-group">
                                    <input type="text" name="message" value={TaskSubject} onChange={e => setTaskSubject(e.target.value)}  placeholder="Enter subject bug" class="form-control" />
                                </div>
                                <div class="input-group" style={{marginTop:'10px'}}>
                                    {/* <textarea rows="10" class="form-control" value={Contents} onChange={e => setContents(e.target.value)} placeholder="Enter Contents bug">
                                        
                                    </textarea> */}
                                    <TinyMCE 
                                        onSelected = {e => setContents(e)}
                                        Values={ContentTinyMCE}
                                    />
                                </div>

                                
                                <div class="input-group" style={{marginTop:'10px'}}>
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Dev Fix:</span>
                                    </div>
                                    <SelectOfficer 
                                        onSelected = { item => setDevId(item.value) }
                                        DepartId={0}
                                        IsActive={IsDevId}
                                        IsFirst = {{value:0,label:'Dev Fix'}}
                                    />
                                </div>
                                <div class="input-group" style={{marginTop:'10px'}}>
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Priority:</span>
                                    </div>
                                    <SelectPriority className="SelectMeno"
                                        onSelected = { item => setPriority(item.value) }
                                        IsLoad={1}
                                        IsData={Priority}
                                    />
                                </div>
                                <div class="input-group" style={{marginTop:'10px'}}>
                                    <div class="form-check">
                                        <input type="checkbox" class="form-check-input" id="exampleCheck2" onClick={onIsSend} />
                                        <label class="form-check-label" for="exampleCheck2">Send Notification</label>
                                    </div>
                                </div>
                                <div class="input-group" style={{marginTop:'10px'}}>
                                    <button style={{display:(EditerBug === parseInt(CreateBy) || EditerBug === 0) ? "block" : "none"}}  type="button" onClick={e => Task_spIssueTrackingDetail_Save('B')} class="btn btn-sm btn-danger">
                                        <i className="fa fa-plus"></i> Save 
                                    </button>
                                    <button  type="button" onClick={Task_spIssueTrackingDetail_Backshowformbug} class="btn btn-sm btn-danger margin-left-5">
                                        <i className="fa fa-undo"></i> Back 
                                    </button>
                                    <button  type="button" onClick={FullSreenBug} class="btn btn-sm btn-danger" style={{marginLeft:'5px'}}>
                                        <i className="fas fa-expand-arrows-alt"></i> 
                                        {SreenKeyBug === "block" ? "Full" : "Small"}
                                          
                                    </button>
                                </div>
                            </div>
                            {/*end  Manage bug */}

                            {/* List bug */}
                            <div class="direct-chat-new direct-chat-messages" style={{display:IsShowFormBug}}>
                            <div class="row margin-left-5" style={{height:'300px',overflow:'auto'}}>
                                <div class="timeline-item">
                                    <span class="time"><i class="fas fa-clock"></i> {CreaterTimeListBug === '' ? isData.CreaterTimeListBug:CreaterTimeListBug}</span>
                                    <div class="timeline-body">
                                        <p>{CheckListBug === '' ? isData.CheckListBug:CheckListBug}</p>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="table-responsive" style={{width: SreenKeyBug === "block" ? "250%" : "100%",overflowX:'hidden'}}>
                                <table class="table table-nopadding">
                                    <thead>
                                        <th style={{width:'25%'}}> Func</th>
                                        <th> Status</th>
                                        <th> Priority</th>
                                        <th> QC</th>
                                        <th> Dev</th>
                                        <th> Time</th>
                                        <th> Due Date</th>
                                        <th> Fn Time</th>
                                        <th> Del</th>
                                    </thead>
                                    <tbody>
                                        {
                                            dataTaskError.map((detail, kdt) => {
                                                let cStatus = detail.Status;
                                                let classStatus = "div-title no-border-radius btn btn-block bg-gradient-danger btn-flat margin-left-5";
                                                if (cStatus === "QC Review") classStatus = "background-Violet div-title no-border-radius btn btn-block bg-gradient-danger btn-flat margin-left-5";
                                                if (cStatus === "In progress") classStatus = "background-blue div-title no-border-radius btn btn-block bg-gradient-danger btn-flat margin-left-5";
                                                if (cStatus === "Fixing") classStatus = "div-title no-border-radius btn btn-block bg-gradient-warning btn-flat margin-left-5";
                                                if (cStatus === "Done") classStatus = "div-title no-border-radius btn btn-block bg-gradient-success btn-flat margin-left-5";
                                                
                                                return (
                                                <tr key={kdt}>
                                                    
                                                    <td title={detail.Subject}>
                                                        <div onClick={e => Task_spIssueTrackingDetail_viewBug(detail)} class="no-border-radius btn btn-default toastsDefaultDefault border-left-red"  style={{textAlign:'left'}}>
                                                        {detail.Subject.length >= 18 ? detail.Subject.substring(0,18) + '...' : detail.Subject  }
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div onClick={e => Task_spIssueTrackingDetail_Open(detail,'Bug')} class={classStatus}>
                                                            {detail.Status}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class='no-border-radius btn btn-default toastsDefaultDefault margin-left-5'>
                                                            <span class={detail.Priority === "Do now" ? "div-title badge badge-danger":"div-title badge badge-warning"}>{detail.Priority}</span>
                                                        </div>
                                                    </td>
                                                    
                                                    <td>
                                                        <div onClick={e => Task_spIssueTrackingDetail_EditBug(detail)}  class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                            <Img alt="Avatar"  height="30" class="table-avatar" src={linkAvatar + detail.Avatar} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div title={detail.DevName} class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                            <Img alt="Avatar"  height="30" class="table-avatar" src={linkAvatar + detail.Devavarta} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                            {detail.CreateTime}
                                                        </div>
                                                    </td>
                                                    
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                            {detail.DueDate}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                            {detail.EndTime !== undefined ? detail.EndTime: "N/A"}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="no-border-radius btn btn-default toastsDefaultDefault margin-left-5">
                                                    
                                                            <button onClick={e => Task_spIssueTrackingDetail_DeleteBug(detail)} disabled={detail.Status === "Done" ? true:false} class="btn btn-sm btn-danger margin-left-5" style={{marginTop:'-10px'}}>
                                                                <i class="fa fa-trash"></i>
                                                            </button>
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
                            {/* End List bug */}
                        </div>
                        <div class="card-footer" style={{display:IsShowFormBug}}>
                            <div class="input-group">
                                <input type="text" name="message" readOnly  placeholder="Create new Bug" class="form-control" />
                                <span class="input-group-append">
                                    <button disabled={!IsDischat} type="button" onClick={Task_spIssueTrackingDetail_showformaddBug} class="btn btn-danger">
                                     <i className="fa fa-plus"></i> Add Bug
                                    </button>

                                    <button  type="button" onClick={FullSreenBug} class="btn btn-sm btn-danger" style={{marginLeft:'5px'}}>
                                        <i className="fas fa-expand-arrows-alt"></i> 
                                        {SreenKeyBug === "block" ? "Full" : "Small"}
                                          
                                    </button>
                                </span>
                            </div>
                        </div>                      
                    </div>
                </div>
                {/* End Bug */}
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
                        <h3 class="card-title font-weight-bold">{TitleJob}</h3>
                    </div>
                    <div class="col-sm-12 col-md-6 margin-top-5s">
                        <button onClick={closeModal} type="button" class="btn btn-sm btn-default pull-right margin-left-5">
                            <i class="fa fa-undo pr-2"></i>
                            Cancel
                        </button>
                        
                        <button disabled={!Disablebtn}  onClick={Task_spIssueTrackingDetail_Update} type="button" class="btn btn-sm btn-danger pull-right">
                            <i class="fa fa-edit pr-2"></i>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>

            <div class="card-body border-left-red">
                
                <div class="row">
                    <div class="col-sm-12 col-md-6">
                        <div class="form-group">
                            <div class="input-group SelectDatetime">
                                <div class="input-group-prepend ">
                                    <span class="input-group-text">Status:</span>
                                </div>
                                <select className="form-control" value={Statusfn} onChange={e => setStatusfn(e.target.value)}>
                                    <option value="In progress">In progress</option>
                                    <option value="Working">Working</option>
                                    <option value="QC Review">QC Review</option>
                                    <option value="Fixing">Fixing</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6">
                        <div class="form-group" style={{display:parseInt(CreateBy) === DevId ? "block":"none"}}>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Estimates Hour:</span>
                                </div>
                                <input type="text" maxLength="50" class="form-control"  value={EstimatesHour}  onChange={e => setEstimatesHour(e.target.value)} />
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

export const ProjectDetail = React.memo(ProjectDetailComp)
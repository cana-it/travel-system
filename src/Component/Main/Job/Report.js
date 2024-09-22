
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from 'react-datetime-picker';
import Select from 'react-select';
import { mainAction } from "../../../Redux/Actions";
import { SelectOfficer,SelectPriority,TinyMCE,DataTable } from "../../../Common";
import { Alertsuccess, Alertwarning, Alerterror,FormatDateJson } from "../../../Utils";
import {IMAGES_DOMAIN,IMAGES_DOMAIN,API_END_POINT} from "../../../Services";
import ReactHtmlParser from 'react-html-parser';
import { Img } from 'react-image';
export const Report = () => {
    const dispatch = useDispatch();
    const linkAvatar = IMAGES_DOMAIN;
    useEffect(() => {
        
    }, []);

    const [IsStartDate,setIsStartDate] = useState(new Date());
    const onFromDate = (item) => {
        setIsStartDate(item)
        setStartDate(FormatDateJson(item))
    }

    const [IsEnddate,setIsEnddate] = useState(new Date());
    const onTodate = (item) => {
        setIsEnddate(item);
        setEnddate(FormatDateJson(item))
    }

    const [ContentReport,setContentReport] =  useState('');
    const [ContentReportPlan,setContentReportPlan] =  useState('');
    const [ContentReportIdea,setContentReportIdea] =  useState('');
    const [Fllow,setFllow] =  useState();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const [StartDate,setStartDate] = useState('');
    const [Enddate,setEnddate] = useState('');
    const [User,setUser] = useState(0);

    const Task_spIssueTracking_Report_Save = async () => {
        
        if(ContentReport === "")
        {
            Alertwarning("Enter the content report");
            return;
        }
        if(ContentReportPlan === "")
        {
            Alertwarning("Enter the content plan report");
            return;
        }

        //proces Fllowby
        let FollowIds = "";
        if(Fllow.length > 0)
        {
            Fllow.forEach((item,index) => {
                FollowIds += item.value + ";";
            });
        }

        const pr = {
            ContentReport:ContentReport,
            ContentReportPlan:ContentReportPlan,
            Follow:FollowIds,
            Creater:Creater,
            CreateName:CreateName
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spIssueTracking_Report_Save"
        }
        const result = await mainAction.API_spCallServer(params, dispatch);
        if(result.Status === "OK")
        {
            Alertsuccess(result.ReturnMess);
            return;
        }
        if(result.Status === "NOTOK")
        {
            Alerterror(result.ReturnMess);
            return;
        }
    }

    const [dataReport,setdataReport] = useState([]);

    const Task_spIssueTracking_Report_List = async () => {

        const pr = {
            Fromdate:StartDate,
            Todate:Enddate,
            Creater:User
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spIssueTracking_Report_List"
        }
        const result = await mainAction.API_spCallServer(params, dispatch);
        setdataReport(result);
    }
      
    return (
        <>
            <div  className="content-wrapper" style={{ backgroundColor:'#ffff'}}>
                <div class="card card-primary card-tabs">

                <div class="card-header p-0 pt-1" style={{backgroundColor:'#009688'}}>

                    <ul class="nav nav-tabs" id="custom-tabs-three-tab" role="tablist" style={{marginTop:'-5px'}}>
                        <li class="nav-item">
                            <a class="nav-link active" id="tab-report-tab" data-toggle="pill" href="#tab-report" role="tab" aria-controls="tab-report" aria-selected="true">Send Report</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="tab-report-history-tab" data-toggle="pill" href="#tab-report-history" role="tab" aria-controls="tab-report-history" aria-selected="false">View History</a>
                        </li>

                    </ul>
                    </div>

                    <div class="card-body">

                    <div  class="tab-content" id="custom-tabs-three-tabContent">
                        <div class="tab-pane fade active show" id="tab-report" role="tabpanel" aria-labelledby="custom-tabs-three-home-tab">

                            <div class="row margin-top-10">
                                <div class="col-sm-12 col-md-6" >
                                    <h3 class="card-title font-weight-bold">Report dailly</h3>
                                </div>
                                <div class="col-sm-12 col-md-6 margin-top-5s">
                                    <button  onClick={Task_spIssueTracking_Report_Save} type="button" class="btn btn-sm btn-danger pull-right">
                                        <i class="fa fa-plus pr-2"></i>
                                        Send Report
                                    </button>
                                </div>
                            </div>

                            <div class="row margin-top-10">
                                <div class="col-sm-12 col-md-12">
                                        <div class="form-group">
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text"> Report To:</span>
                                                </div>
                                                <SelectOfficer 
                                                    onSelected = { item => setFllow(item) }
                                                    DepartId={0}
                                                    IsFirst = {{value:952,label:'Select'}}
                                                    isMulti={true}
                                                    IsClass={1}
                                                />
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <div class="row margin-top-10">
                                <div class="col-sm-12">
                                <div class="form-group">
                                    <label> Contents Report</label>
                                    <div class="input-group">
                                            <TinyMCE 
                                                onSelected = {e => setContentReport(e)}
                                                height = {250}
                                            />
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div class="row margin-top-10">
                                <div class="col-sm-12">
                                <div class="form-group">
                                    <label> Plan Content Tomorrow</label>
                                    <div class="input-group">
                                            <TinyMCE 
                                                onSelected = {e => setContentReportPlan(e)}
                                                height = {250}
                                            />
                                    </div>
                                </div>
                                </div>
                            </div>

                        </div>
                        <div class="tab-pane fade" id="tab-report-history" role="tabpanel" aria-labelledby="custom-tabs-three-messages-tab">

                        <div class="row margin-top-10">
                            <div class="col-sm-12 col-md-6" >
                                <h3 class="card-title font-weight-bold">List of the Report</h3>
                            </div>
                            <div class="col-sm-12 col-md-6 margin-top-5s">
                                <button  onClick={Task_spIssueTracking_Report_List} type="button" class="btn btn-sm btn-danger pull-right">
                                    <i class="fa fa-search pr-2"></i>
                                    Search
                                </button>
                            </div>
                    </div>

                        
                        <div class="row margin-top-10">
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
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">User:</span>
                                    </div>
                                    <SelectOfficer
                                        onSelected = { item => setUser(item.value) }
                                        DepartId={0}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-4 margin-top-10">
                                
                        <span class="div-title badge badge-success">Total Report: {dataReport.length}</span> 
                                      
                            
                    </div>

                        <div class="row margin-top-10">
                    <table class="table table-nopadding">
                        <thead>
                            <th>Content Report</th>
                            <th>Content Plan</th>
                            <th>Author</th>
                            <th>Date</th>
                        </thead>
                        <tbody>

                            {
                                dataReport.map((item,index) => {
                                    return(
                                        <tr>
                                            <td>
                                                {ReactHtmlParser(item.ContentReport)}
                                            </td>
                                            <td>
                                                {ReactHtmlParser(item.ContentReportPlan)}
                                            </td>
                                            <td>
                                                <Img alt="Avatar"  height="30"  class="table-avatar" style={{marginTop:'10px',marginLeft:'10px'}} src={linkAvatar + item.Avatar} />
                                            </td>
                                            <td>
                                                {item.CreateTime}
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
        </>
    )
}
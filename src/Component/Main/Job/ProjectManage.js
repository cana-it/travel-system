import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../Redux/Actions';
import DateTimePicker from 'react-datetime-picker';
import {Alertwarning,Alertsuccess,Alerterror, FormatDateJson} from '../../../Utils';
import {SelectOfficer, DataTable} from '../../../Common';
export const ProjectManage = () => {

    const dispatch = useDispatch();
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

    const CreateBy = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const [ProjectId,setProjectId] = useState(0);
    const [ProjectName,setProjectName] = useState('');
    const [StartDate,setStartDate] = useState();
    const [Enddate,setEnddate] = useState();
    const [Disablebtn,setDisablebtn] = useState(true);

    const Task_spProjectPlan_Save = async () => {
        
        try 
        {
            if(ProjectName === "")
            {
                Alertwarning("Enter the CategoryName! Pls");
                return;
            }
            if(StartDate === undefined || Enddate === undefined)
            {
                Alertwarning("Enter the times! Pls");
                return;
            }
            setDisablebtn(false); // disable btn save
            const pr = {
                ProjectId:ProjectId,
                ProjectName:ProjectName,
                FromDate:StartDate,
                Todate:Enddate,
                CreateBy:CreateBy,
                CreateName:CreateName
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spProjectPlan_Save"
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            setDisablebtn(true); //enable btn
            if(result.Status === "OK")
            {
                Alertsuccess(result.ReturnMess);
                Task_spProjectPlan_List();
                return;
            }
            if(result.Status === "NOTOK")
            {
                Alerterror(result.ReturnMess);
                return;
            }
        } catch (error) {
            ;
            Alerterror("Something wwrong!pls check");
        }
        
    }

    const [DisablebtnList,setDisablebtnList] = useState(true);
    const [AssignTos,setAssignTos] = useState(0);
    const [dataProjectPlanList,setdataProjectPlanList] = useState([]);
    const [IshowList,setIshowList] = useState('none');
    const Task_spProjectPlan_List = async () => {
        
        try {
            setDisablebtnList(false); // disable btn save
            const pr = {
                UserId:AssignTos
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spProjectPlan_List"
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            setDisablebtnList(true); // enable btn save
            setdataProjectPlanList(result);
            setIshowList('block');
        } catch (error) {
            ;
            Alerterror("Something wwrong!pls check");
        }
        
    }

    // cancel to clear form
    const Cancel = () => {
        
    }

     /* end Load project*/

    const View = (item) => {
        
        let row = item.row._original;
        setProjectName(row.ProjectName);
        setProjectId(row.ProjectId);
        
    }

    const Task_spProjectPlan_Delete =  async (item) => {
        if(window.confirm("Are you sure?"))
        {
            try 
            {
                let Cateid = item.row._original.CategoryId;
                const pr = {
                    ProjectId:ProjectId,
                    CreateBy:CreateBy,
                    CreateName:CreateName
                }

                const params = {
                    Json: JSON.stringify(pr),
                    func: "Task_spProjectPlan_Delete"
                }
        
                const result = await mainAction.API_spCallServer(params, dispatch);
                if(result.Status === 'OK')
                {
                    Alertsuccess(result.ReturnMess);
                    const datanew = [...dataProjectPlanList];
                    setdataProjectPlanList(datanew.filter(p => p.CategoryId !== Cateid));
                }
                else
                {
                    Alerterror(result.ReturnMess);
                }
            } catch (error) {
                ;
                Alerterror("Something wwrong!pls check");
            }
        }
    }

    const columns =  [
        {
            Header: 'Edit',
            accessor: 'Edit',
            Cell: ({row})  => (<button className="btn btn-sm btn-success" onClick={e => View({row})}> <i class="fa fa-eye"></i> View</button>)
        }, 
        {
            Header: 'Delete',
            accessor: 'Delete',
            Cell: ({row})  => (<button className="btn btn-sm btn-danger" onClick={e => Task_spProjectPlan_Delete({row})}> <i class="fa fa-undo"></i> Delete</button>)
        },
        
        {
          Header: "CreateName",
          accessor: "CreateName",
        },
        {
          Header: "CreateTime",
          accessor: "CreateTime"
        },
        {
          Header: "ProjectName",
          accessor: "ProjectName",
          Cell: obj => (<span className='btn btn-sm btn-success'>{obj.value}</span>)
        },
        {
          Header: "Fromdate",
          accessor: "Fromdate"
        },
        {
          Header: "Todate",
          accessor: "Todate"
        }
      ];

    return (
        <>
        <div class="content-wrapper" style={{ backgroundColor:'#ffff'}}>
            <div class="card-header border-left-red">
                <div class="row">
                    <div class="col-sm-12 col-md-6" >
                        <h3 class="card-title font-weight-bold">Add new Project</h3>
                    </div>
                    <div class="col-sm-12 col-md-6 margin-top-5s">
                        <button onClick={Cancel} type="button" class="btn btn-sm btn-default pull-right margin-left-5">
                            <i class="fa fa-undo pr-2"></i>
                            Cancel
                        </button>
                        
                        <button disabled={!Disablebtn}  onClick={Task_spProjectPlan_Save} type="button" class="btn btn-sm btn-danger pull-right">
                            <i class="fa fa-edit pr-2"></i>
                            Save
                        </button>
                    </div>
                </div>
            </div>


            <div class="card-body border-left-red">
                
                <div class="row">
                    <div class="col-sm-12 col-md-4">
                    <div class="form-group">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">ProjectName:</span>
                            </div>
                            <input type="text" maxLength="50" class="form-control"   value={ProjectName}  onChange={e => setProjectName(e.target.value)} />
                        </div>
                    </div>
                    </div>

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
                </div>
            </div>
        

            <div class="card-header border-left-red margin-top-10">
                <div class="row">
                    <div class="col-sm-12 col-md-6" >
                        <h3 class="card-title font-weight-bold">List of the Project</h3>
                    </div>
                    <div class="col-sm-12 col-md-6 margin-top-5s">
                        <button disabled={!DisablebtnList}  onClick={Task_spProjectPlan_List} type="button" class="btn btn-sm btn-danger pull-right">
                            <i class="fa fa-search pr-2"></i>
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div class="card-body border-left-red">
                
                <div class="row">
                    <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Creator:</span>
                                    </div>
                                    <SelectOfficer
                                        onSelected = { item => setAssignTos(item.value) }
                                        DepartId={0}
                                    />
                                </div>
                            </div>
                        </div>
                </div>

                <div class="row" style={{display:IshowList}}>
                <DataTable
                    data={dataProjectPlanList}
                    columns={columns}
                    IsSearch={false}
                />
                </div>
            </div>
       
        </div>
        </>
    )
}

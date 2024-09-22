import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../Redux/Actions';
import DateTimePicker from 'react-datetime-picker';
import {Alertwarning,Alertsuccess,Alerterror, FormatDateJson} from '../../../Utils';
import {SelectOfficer, DataTable} from '../../../Common';
const CategoryListComp = ({
    onClickCategoryList = () => { },
    onTitle = '',
    IsLoad = false
}) => {

    const ClickCategoryList = () => {
        onClickCategoryList();
    }

    const dispatch = useDispatch();
    const CreateBy = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const [CategoryId,setCategoryId] = useState(0);
    const [CategoryName,setCategoryName] = useState('');
    const CategoryNameRef = useRef(); 
    const [ProjectId,setProjectId] = useState(0);
    const [ProjectName,setProjectName] = useState('');
    const [Orderby,setOrderby] = useState('0');
    const OrderbyRef = useRef();
    const [Disablebtn,setDisablebtn] = useState(true);
    const Task_spCategory_Save = async () => {
        
        try 
        {
            if(CategoryName === "")
            {
                Alertwarning("Enter the CategoryName! Pls");
                CategoryNameRef.current.focus();
                return;
            }
            
            if(Orderby === "")
            {
                Alertwarning("Enter Orderby Category! Pls");
                OrderbyRef.current.focus();
                return;
            }
            
            setDisablebtn(false); // disable btn save
            const pr = {
                CategoryId:CategoryId,
                CategoryName:CategoryName,
                ProjectId:ProjectId,
                ProjectName:ProjectName,
                Orderby:Orderby,
                CreateBy:CreateBy,
                CreateName:CreateName
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spCategory_Save"
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            setDisablebtn(true); //enable btn
            if(result.Status === "OK")
            {
                Alertsuccess(result.ReturnMess);
                Task_spCategory_List();
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

    // useEffect(() => {
    //     Task_spProjectPlan_List();
    // }, []);

    const [DisablebtnList,setDisablebtnList] = useState(true);
    const [AssignTos,setAssignTos] = useState(0);
    const [dataCategory,setDataCategory] = useState([]);
    const [IshowList,setIshowList] = useState('none');
    const [valueProjectList,setValueProjectList] = useState();
    const Task_spCategory_List = async () => {
        
        try {
            setDisablebtnList(false); // disable btn save
            const pr = {
                ProjectId:ProjectListId,
                UserId:AssignTos
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spCategory_List"
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            setDisablebtnList(true); // enable btn save
            setDataCategory(result);
            setIshowList('block');
        } catch (error) {
            ;
            Alerterror("Something wwrong!pls check");
        }
    }

    // cancel to clear form
    const Cancel = () => {
        
        setCategoryId(0);
        setCategoryName('');
        setOrderby('0');
    }

    const [valueProject,setValueProject] = useState();
    const onProject = (item) => {
        setValueProject(item);
        setProjectId(item.value);
        setProjectName(item.label);
    }

    const [ProjectListId,setProjectListId] = useState(0);
    const onProjectList = (item) => {
        setValueProjectList(item);
        setProjectListId(item.value);
    }

    /*Load project*/
    const [dataslProject,setdataslProject] = useState([]);
    const [dataProject,setdataProject] = useState([]);
    const Task_spProjectPlan_List = async () => {
        try 
        {
            const pr = {
                UserId : CreateBy,
                ProjectId: ProjectId
            }
    
            const params = {
                Json: JSON.stringify(pr),
                func: "Task_spProjectPlan_List"
            }
    
            const list = await mainAction.API_spCallServer(params, dispatch);
            setdataProject(list);
    
            const FirstData = {value:0,label:"Chose"};
            let dataSelect = [];
            dataSelect.push(FirstData);
            list.forEach((element,index) => {
                dataSelect.push({value:element.ProjectId,label:element.ProjectName});
            });
            setdataslProject(dataSelect)
        } catch (error) {
            ;
            Alerterror("Something wwrong!pls check");
        }
    }
     /* end Load project*/

    const View = (item) => {
        
        let row = item.row._original;
        setCategoryId(row.CategoryId);
        setCategoryName(row.CategoryName);
        setOrderby(row.Orderby);
        setProjectId(row.ProjectId === undefined ? 0 : row.ProjectId);
        setProjectName(row.ProjectId === undefined ? 'NA' : row.ProjectName);
        if(row.ProjectName !== 'NA') setValueProject({value:row.ProjectId,label:row.ProjectName});
    }

    const Task_spCategory_Delete =  async (item) => {
        if(window.confirm("Are you sure?"))
        {
            try {
                let Cateid = item.row._original.CategoryId;
                const pr = {
                    CategoryId:Cateid,
                    CreateBy:CreateBy,
                    CreateName:CreateName
                }

                const params = {
                    Json: JSON.stringify(pr),
                    func: "Task_spCategory_Delete"
                }
        
                const result = await mainAction.API_spCallServer(params, dispatch);
                if(result.Status === 'OK')
                {
                    Alertsuccess(result.ReturnMess);
                    const dataCategorynew = [...dataCategory];
                    setDataCategory(dataCategorynew.filter(p => p.CategoryId !== Cateid));
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
            Cell: ({row})  => (<button className="btn btn-sm btn-danger" onClick={e => Task_spCategory_Delete({row})}> <i class="fa fa-undo"></i> Delete</button>)
        }, 
        {
          Header: 'CategoryName',
          accessor: 'CategoryName',
        },
        {
          Header: "Orderby",
          accessor: "Orderby",
          Cell: obj => (<span className='btn btn-sm btn-warning'>{obj.value}</span>)
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
        }
      ];

    return (
        <div>

            <div class="card-header border-left-red">
                <div class="row">
                    <div class="col-sm-12 col-md-6" >
                        <h3 class="card-title font-weight-bold">Add new category</h3>
                    </div>
                    <div class="col-sm-12 col-md-6 margin-top-5s">
                        <button onClick={Cancel} type="button" class="btn btn-sm btn-default pull-right margin-left-5">
                            <i class="fa fa-undo pr-2"></i>
                            Cancel
                        </button>
                        <button onClick={ClickCategoryList} type="button" class="btn btn-sm btn-success pull-right margin-left-5">
                            <i class="fa fa-undo pr-2"></i>
                            Back
                        </button>
                        
                        <button disabled={!Disablebtn}  onClick={Task_spCategory_Save} type="button" class="btn btn-sm btn-danger pull-right">
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
                                <span class="input-group-text">CategoryName:</span>
                            </div>
                            <input type="text" maxLength="50" class="form-control"  ref={CategoryNameRef} value={CategoryName}  onChange={e => setCategoryName(e.target.value)} />
                        </div>
                    </div>
                    </div>

                    <div class="col-sm-12 col-md-4">
                        <div class="form-group">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Project:</span>
                                </div>
                                <Select className="z-index-1k SelectMeno"
                                    value={valueProject}
                                    onChange={onProject}
                                    options={dataslProject}
                                />
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-12 col-md-4">
                    <div class="form-group">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Order by:</span>
                            </div>
                            <input type="text" maxLength="50" class="form-control"  ref={OrderbyRef} value={Orderby}  onChange={e => setOrderby(e.target.value)} />
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        

            <div class="card-header border-left-red">
                <div class="row">
                    <div class="col-sm-12 col-md-6" >
                        <h3 class="card-title font-weight-bold">List of the category</h3>
                    </div>
                    <div class="col-sm-12 col-md-6 margin-top-5s">
                        <button disabled={!DisablebtnList}  onClick={Task_spCategory_List} type="button" class="btn btn-sm btn-danger pull-right">
                            <i class="fa fa-search pr-2"></i>
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div class="card-body border-left-red">
                
                <div class="row">
                    
                    <div class="col-sm-12 col-md-6">
                        <div class="form-group">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Project:</span>
                                </div>
                                <Select className="SelectMeno"
                                    value={valueProjectList}
                                    onChange={onProjectList}
                                    options={dataslProject}
                                />
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-12 col-md-6">
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
                    data={dataCategory}
                    columns={columns}
                    IsSearch={false}
                />
                </div>
            </div>
        
        </div>
    )
}


export const CategoryList = React.memo(CategoryListComp)
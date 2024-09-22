import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../Redux/Actions';
import DateTimePicker from 'react-datetime-picker';
import {Alertwarning,Alertsuccess,Alerterror, FormatDateJson} from '../../../Utils'
const CategoryCreateComp = ({
    onClickCategory = () => { },
    onTitle = '',
    IsCategory = {},
    IsLoad = false
}) => {

    const ClickCategory = () => {
        onClickCategory();
    }

    const dispatch = useDispatch();
    const CreateBy = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    useEffect(() => {
        Task_spProjectPlan_List();
    }, []);

    
    const [CategoryId,setCategoryId] = useState(0);
    const [CategoryName,setCategoryName] = useState('');
    const CategoryNameRef = useRef(); 
    const [ProjectId,setProjectId] = useState();
    const [ProjectName,setProjectName] = useState();
    const [Orderby,setOrderby] = useState('0');
    const OrderbyRef = useRef();
    const [Disablebtn,setDisablebtn] = useState(true);
    const Task_spCategory_Save = async () => {
        
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
            return;
        }
        if(result.Status === "NOTOK")
        {
            Alerterror(result.ReturnMess);
            return;
        }
    }

    useEffect(() => {
        IsCategoryView();
    }, [IsLoad]);

    const IsCategoryView = () => {
        
        if(IsCategory.CategoryId != undefined)
        {
            setCategoryId(IsCategory.CategoryId);
            setCategoryName(IsCategory.CategoryName);
            setProjectId(IsCategory.ProjectId);
            setProjectName(IsCategory.ProjectName);
            setOrderby(IsCategory.Orderby);
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
        const project = dataProject.filter(p => p.ProjectId == item.value);
        setProjectId(item.value);
        setProjectName(project[0].ProjectName);
    }

    const [dataslProject,setdataslProject] = useState([]);
    const [dataProject,setdataProject] = useState([]);
    const Task_spProjectPlan_List = async () => {

        const pr = {
            UserId : CreateBy,
            ProjectId:0
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
    }

    return (
        <div>
            <div class="card-header border-left-red">
                <div class="row">
                    <div class="col-sm-12 col-md-6" >
                        <h3 class="card-title font-weight-bold">{onTitle}</h3>
                    </div>
                    <div class="col-sm-12 col-md-6 margin-top-5s">
                        <button onClick={Cancel} type="button" class="btn btn-sm btn-default pull-right margin-left-5">
                            <i class="fa fa-undo pr-2"></i>
                            Cancel
                        </button>
                        <button onClick={ClickCategory} type="button" class="btn btn-sm btn-success pull-right margin-left-5">
                            <i class="fa fa-undo pr-2"></i>
                            Back
                        </button>
                        
                        <button disabled={!Disablebtn}  onClick={Task_spCategory_Save} type="button" class="btn btn-sm btn-danger pull-right">
                            <i class="fa fa-plus pr-2"></i>
                            Create
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
                                <Select className="SelectMeno"
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
        
        </div>
    )
}


export const CategoryCreate = React.memo(CategoryCreateComp)
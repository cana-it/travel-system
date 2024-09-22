import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from 'react-datetime-picker';
import Select from 'react-select';
import {SelectCity} from '../../Common';
import {Alertsuccess,Alerterror} from '../../Utils';
import {Img} from 'react-image';
import {mainAction} from '../../Redux/Actions';
export const TextBoss = () => {

    /* run after render */
    useEffect(() => {
        getCity();
        Alertsuccess('Thành công ok con dê?');
        Alerterror('loi cc');
    }, []);

    const dispatch = useDispatch();

    const [city,setCity] = useState(0);
    const [value, onChange] = useState(new Date());
    const [isVisible, setIsVisible] = useState(false);
    const [chooseProvince, setChooseProvince] = useState(0);
    const [disable,setDisable] = useState(true);
    /* get the city */
    const getCity = () => {
        Alerterror('call get the city');
    };

    const onChooseProvince = (item) => {
        setIsVisible(true);
        setChooseProvince(item);
    };

    /* datatable */
    const columns = ['Title','Name'];
    const data = [{Title:'OK man',Name:'Name0001'},{Title:'OK man1',Name:'Name0002'}]
    const [options,changeOptions] = useState([
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
      ]);


    const clickMainF = () => {
        
        Alertsuccess('Thành công ok con dê?');
    };

    const showLoading = () => {
        mainAction.LOADING({IsLoading: true}, dispatch); 
    }

    const hideLoading = () => {
        mainAction.LOADING({IsLoading: false}, dispatch); 
    }

    return (
        <div className="main-panel">
            
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header card-header-primary">
                                    <h4 className="card-title">Điền thông tin lấy hàng</h4>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="form-group bmd-form-group">
                                                <DateTimePicker
                                                    onChange={onChange}
                                                    value={value}
                                                />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group bmd-form-group">
                                                <SelectCity
                                                    isVisible={isVisible}
                                                    setIsVisible={setIsVisible}
                                                    onSelected={(item) => {
                                                        onChooseProvince(item)
                                                    }}
                                                />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group bmd-form-group">
                                                <Select
                                                    value={options}
                                                    onChange={changeOptions}
                                                    options={options}
                                                />

                                                
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group bmd-form-group">
                                                    <label className="bmd-label-floating">Fist Name</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group bmd-form-group">
                                                    <label className="bmd-label-floating">Last Name</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group bmd-form-group">
                                                    <label className="bmd-label-floating">Adress</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group bmd-form-group">
                                                    <select  className="form-control" > 
                                                        <option value="0">HCM</option>
                                                        <option value="1">HNI</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group bmd-form-group">
                                                    <label className="bmd-label-floating">Country</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group bmd-form-group">
                                               
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label>About Me</label>
                                                    <div className="form-group bmd-form-group">
                                                        <label className="bmd-label-floating"> Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo.</label>
                                                        <textarea className="form-control" rows="5"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                            <button disabled={!disable} onClick={clickMainF} type="button" className="btn btn-danger pull-right">
                                            <i className="material-icons">edit</i>
                                            Xác nhận lấy
                                            </button>
                                            <button  type="submit" className="btn btn-default pull-right">
                                            <i className="material-icons">undo</i>
                                            Hủy
                                            </button>
                                            <button onClick={showLoading} type="button" className="btn btn-success pull-right">
                                            <i className="material-icons">map</i>
                                            Loading
                                            </button>
                                            <button onClick={hideLoading} type="button" className="btn btn-success pull-right">
                                            <i className="material-icons">map</i>
                                            Hide Loading
                                            </button>
                                        <div className="clearfix"></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header card-header-primary">
                                    <h4 className="card-title ">Danh sách lấy hàng</h4>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">


                                        <table id="dataTable" className="table">
                                            <thead className=" text-primary">
                                                <tr>
                                                    <th>ID</th>
                                                    <th> Name</th>
                                                    <th>Country</th>
                                                    <th>City</th>
                                                    <th>Salary</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
                                                <tr>
                                                    <td>1 </td>
                                                    <td>Dakota Rice</td>
                                                    <td>Niger</td>
                                                    <td>Oud-Turnhout</td>
                                                    <td className="text-primary"> $36,738</td>
                                                </tr>
                                                <tr>
                                                    <td> 2</td>
                                                    <td>Minerva Hooper </td>
                                                    <td>Curaçao</td>
                                                    <td>Sinaai-Waas</td>
                                                    <td className="text-primary">$23,789</td>
                                                </tr>
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

    )

}

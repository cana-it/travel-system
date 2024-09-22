import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { FormatDateJson } from '../Utils';
// import { SelectOfficer, DataTable } from '../Common';
//import Modal from 'react-modal';
import { IMAGES_DOMAIN } from '../Services'
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export const OnlineStaff = () => {

    useEffect(() => {
        Trl_spOnline_Staff();
    }, [])

    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const [OnlineStaffData, setOnlineStaffData] = useState([]);

    const Trl_spOnline_Staff = async () => {
        let pr = {
            KeySearch: "",
            LoginLogId: 0
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Trl_spOnline_Staff",
        }
        const result = await mainAction.API_spCallServer(params, dispatch)

        setOnlineStaffData(result);

    }

    const RenderOnlinePlayer = (

        <div>
            {
                OnlineStaffData.map((item, index) => {
                    let ab = FormatDateJson(item.LoginTime)
                    let dte = new Date();

                    return (

                        <li>
                            <img src={IMAGES_DOMAIN + item.Avatar} alt='User Image' />
                            <a className="users-list-name" href="#">
                                <i class="fa fa-circle" style={{ color: 'green' }} aria-hidden="true"></i> {item.StaffName}</a>
                            <span className="users-list-date">{FormatDateJson(item.LoginTime)}</span>
                        </li>
                    )

                })}
        </div>
    )

    return (
        <div className="content-wrapper" >
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">NV đang online</h3>

                    <div className="card-tools">
                        <span className="badge badge-danger">{OnlineStaffData.length} Members</span>
                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                            <i className="fas fa-minus"></i>
                        </button>
                        <button type="button" className="btn btn-tool" data-card-widget="remove">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="col-sm-12 col-md-12 card-body p-0 margin-top-10" >
                    <ul className="users-list clearfix position margin-top-10">
                        {OnlineStaffData.length > 0 && RenderOnlinePlayer}
                    </ul>
                </div>
            </div>
        </div>
    )


}
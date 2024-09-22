import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from 'react-datetime-picker';
import Select from 'react-select';
import { Img } from 'react-image';
import { mainAction } from "../../../Redux/Actions";
import { SelectOfficer, DataTable, CreateTask } from "../../../Common";
import { Alertwarning, Alertsuccess, Alerterror, FormatDateJson } from "../../../Utils";
import { ProjectDetail } from "./ProjectDetail";
import { IMAGES_DOMAIN } from "../../../Services";
import ReactHtmlParser from 'react-html-parser';
import Modal from 'react-modal';
export const Home = () => {
    const dispatch = useDispatch();
    let linkAvatar = IMAGES_DOMAIN;
    let linkoke = localStorage.getItem("Avatar") === null ? linkAvatar + "/Content/img/LogoNetco.png" : linkAvatar + localStorage.getItem("Avatar");
    let nameoke = localStorage.getItem("CreateName") === null ? "Login pls" : localStorage.getItem("CreateName");
    let Nicknames = localStorage.getItem("Nickname") === null ? nameoke : localStorage.getItem("Nickname");
    let position = "";
    let CreateBy = localStorage.getItem("CreateBy");
    if (CreateBy === "952") position = "IT Management";
    else if (CreateBy === "2966") position = "QC Leader";
    else if (CreateBy === "1628") position = "Softwate Leader";
    else if (CreateBy === "4736") position = "QC Engineer";
    else if (CreateBy === "4799") position = "QC Engineer";
    else if (CreateBy === "4798") position = "QC Engineer";
    else position = "Software Engineer";

    const [Nickname, setNickname] = useState(Nicknames);

    useEffect(() => {
        Task_spIssueTracking_CheckTaskAndBug();
    });

    let hello = "Good Morning";
    let d = new Date();
    let n = d.getHours();
    if (n >= 12 && n < 18) hello = "Good Afternoon";
    if (n >= 18 && n <= 23) hello = "Good Evening";


    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    const ModelShoOpen = (item) => {
        openModal();
    }

    const Task_spNickname_Update = () => {
        localStorage.setItem("Nickname", Nickname);
        closeModal();
        window.location = "/home";
    }

    const [Task, setTask] = useState(0)
    const [TaskAdd, setTaskAdd] = useState(0)
    const [Bug, setBug] = useState(0)
    const [Report, setReport] = useState(0)
    const [Project, setProject] = useState(0)
    const [Plans, setPlans] = useState(0)
    const Task_spIssueTracking_CheckTaskAndBug = async () => {

        /* const pr = {
          Creater: CreateBy
        };
        const params = {
          Json: JSON.stringify(pr),
          func: "Task_spIssueTracking_CheckTaskAndBug"
        };
        const result = await mainAction.API_spCallServer(params, dispatch);
        setTask(result[0].Task)
        setTaskAdd(result[0].TaskAdd)
        setBug(result[0].Bug)
        setReport(result[0].Report);
        setProject(result[0].Project);
        setPlans(result[0].Plans); */
    }

    return (
        <>
            <div className="content-wrapper">
                <section class="content">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="card card-primary card-outline">
                                    <div class="card-body box-profile">
                                        <div class="text-center">
                                            <Img onClick={e => ModelShoOpen({})} class="profile-user-img img-fluid img-circle"
                                                src={linkoke}
                                                alt="User profile picture" />
                                        </div>

                                        <h3 class="profile-username text-center">{Nickname}</h3>

                                        <p class="text-muted text-center">{position}</p>

                                        <ul class="list-group list-group-unbordered mb-3">
                                            <li class="list-group-item">
                                                <b>Timekeeping date</b> <a class="float-right">26/Month</a>
                                            </li>
                                            <li class="list-group-item">
                                                <b>Days of leave</b> <a class="float-right">14/Year</a>
                                            </li>
                                            <li class="list-group-item">
                                                <b>Report</b> <a class="float-right">24/Month</a>
                                            </li>
                                        </ul>

                                        <a href="#" class="btn btn-primary btn-block"><b>Click avatar to change nickname</b></a>
                                    </div>
                                </div>

                            </div>
                            <div class="col-md-8">
                                <div class="card card-primary card-outline">
                                    <div class="card-body box-profile">
                                        <h4>Hello!, </h4>
                                        <h5 style={{ color: '#009688' }}>{hello}, Have a great day for you!</h5>
                                        <h5>Follow your task below:</h5>
                                        <div class="row">

                                            <div class="col-md-4 col-sm-6 col-12">
                                                <div class="info-box shadow-sm">
                                                    <span class="info-box-icon bg-success"><i class="far fa-flag"></i></span>

                                                    <div class="info-box-content">
                                                        <span class="info-box-text">Your Task</span>
                                                        <span class="info-box-number"> ({Task})</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6 col-12">
                                                <div class="info-box shadow">
                                                    <span class="info-box-icon bg-warning"><i class="far fa-copy"></i></span>

                                                    <div class="info-box-content">
                                                        <span class="info-box-text">Task Created</span>
                                                        <span class="info-box-number">({TaskAdd})</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6 col-12">
                                                <div class="info-box shadow-lg">
                                                    <span class="info-box-icon bg-danger"><i class="fa fa-bug"></i></span>

                                                    <div class="info-box-content">
                                                        <span class="info-box-text">Your Bug</span>
                                                        <span class="info-box-number"> ({Bug})</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row margin-top-10">
                                        <div class="card-body box-profile">
                                            <h4>Your plan today:</h4>
                                            {ReactHtmlParser(Plans)}
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </section>


                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Change the nickname :)"
                >


                    <div class="card-header border-left-red">
                        <div class="row">
                            <div class="col-sm-12 col-md-6" >
                                <h3 class="card-title font-weight-bold">Change the nickname</h3>
                            </div>
                            <div class="col-sm-12 col-md-6 margin-top-5s">
                                <button onClick={closeModal} type="button" class="btn btn-sm btn-default pull-right margin-left-5">
                                    <i class="fa fa-undo pr-2"></i>
                                    Cancel
                                </button>

                                <button onClick={Task_spNickname_Update} type="button" class="btn btn-sm btn-danger pull-right">
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
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Your Nickname:</span>
                                        </div>
                                        <input type="text" class="form-control" value={Nickname} onChange={e => setNickname(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </Modal>

            </div>
        </>
    )
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '55%'
    }
};
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { Alertwarning, Alertsuccess, Alerterror, FormatDateJson } from '../Utils';
import { SelectOfficer, DataTable, TinyMCE } from '../Common';
//import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-bootstrap/Modal';
import parse from 'react-html-parser'
export const News = () => {

    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    useEffect(() => {
        Trl_spPostInfor_List();
    }, [])



    const [modalIsOpen, setIsOpen] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    }
    const closeModal = () => {
        setIsOpen(false);
    }


    //#region thêm
    const VideAdd = () => {

        openModal()
    }
    const [PostData, setPostData] = useState([]);

    const [PostContent, setPostContent] = useState('');
    const [PostTiltile, setPostTiltile] = useState('');

    const CreatePost = async () => {
        let ab = new Date();

        if (PostTiltile === '' || PostTiltile === undefined) {
            Alertwarning('Vui lòng nhập tiêu đề')
        }
        if (PostContent === '' || PostContent === undefined) {
            Alertwarning('Vui lòng nhập nội dung')
        }



        let pr = {
            Post_Id: 0,
            Post_Tiltle: PostTiltile,
            Post_Content: PostContent,
            Creater: Creater,
            CreaterName: CreateName,
            Createtime: ab
        }

        const params = {
            Json: JSON.stringify(pr),
            func: "Trl_spPostInfor_Save",
        }
        const result = await mainAction.API_spCallServer(params, dispatch)
        Alertsuccess(result.Result);
        setPostContent('');
        setPostTiltile('');
        Trl_spPostInfor_List();

    }

    const Trl_spPostInfor_List = async () => {
        let pr = {
            Keysearch: "",
            Post_Id: 0
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Trl_spPostInfor_List",
        }
        const result = await mainAction.API_spCallServer(params, dispatch)
        setPostData(result);
    }



    const RenderNews = (
        <>
            {

                PostData.map((item, index) => {
                    let Date = FormatDateJson(item?.Createtime);
                    let text = '';
                    let ab = item?.Post_Content.length;
                    if (item.Post_Content.lenght > 200) {
                        let ab = item.PostContent.slice(0, 200)
                        text = ab;
                    }
                    else { text = item.Post_Content }

                    return (
                        <div>
                            <i class="fas fa-newspaper bg-blue"></i>
                            <div class="timeline-item margin-top-20" >
                                <span class="time"><i class="fas fa-clock">
                                    <span class='newstime'>{FormatDateJson(item.Createtime)}</span></i> </span>
                                <h3 class="timeline-header"><a href="#">Tiêu đề :</a>{item.Post_Tiltle}</h3>
                                <div class="timeline-body">
                                    Tác giả : {item.CreaterName}
                                    <br />
                                    <span> {parse(text)}</span>
                                    <br />
                                </div>
                                <div class="timeline-footer">
                                    <a class="btn btn-primary btn-sm">Read more</a>
                                </div>
                            </div>
                        </div>
                    )

                })
            }
        </>
    )

    return (
        <div class="content-wrapper ">
            <div class="card-header">
                <div class="card-tools">

                    <button type="button" class="btn btn-tool" data-card-widget="collapse"
                        onClick={VideAdd}>
                        Create    <i class="fas fa-plus"></i>
                    </button>
                    <button type="button" class="btn btn-tool" data-card-widget="remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="col-md-12">
                <section class="content-header">
                    <div class="col-sm-6 mb-2">
                        <h1>Các bảng tin mới </h1>
                    </div>
                    <div class="col-sm-6">
                    </div>
                </section>

                <div class="col-md-12 timeline">
                    {RenderNews}
                </div>


            </div>

            <Modal
                show={modalIsOpen}
                onHide={closeModal}
                className=' custom-modal-w-90'
                aria-labelledby="example-custom-modal-styling-title"
            >

                <Modal.Header  >
                    <Modal.Title id="example-custom-modal-styling-title">
                        <div class="">
                            <button
                                type="button"
                                class="btn btn-tool"
                                data-card-widget="remove"
                                style={{ marginLeft: '1300px' }}
                                onClick={closeModal}>
                                <i class="fas fa-times"></i>
                            </button>
                            <h3 class=" titile">Thêm bảng tin mới</h3>
                        </div>


                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>




                    <div class="card-body">

                        <div class="tab-content" id="custom-tabs-three-tabContent">
                            <div class="tab-pane fade active show" id="tab-report" role="tabpanel" aria-labelledby="custom-tabs-three-home-tab">

                                <div class="row margin-top-10">
                                    <div class="col-sm-12 col-md-6" >

                                    </div>

                                </div>

                                <div class="row margin-top-10">
                                    <div class="col-sm-12 col-md-12">
                                        <div class="form-group">
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">Tiêu đề :</span>
                                                </div>
                                                <input type="text"
                                                    maxLength="50"
                                                    class="form-control margin-left-5 titleip"
                                                    value={PostTiltile}
                                                    onChange={(e) => setPostTiltile(e.target.value)} />
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
                                                    onSelected={e => setPostContent(e)}
                                                    height={250}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-sm-12 col-md-6 margin-top-5s">
                                        <button onClick={CreatePost} type="button" class="btn btn-sm btn-success margin-top-10">
                                            <i class="fa fa-plus pr-2"></i>
                                            Tạo bảng tin
                                        </button>
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>

                </Modal.Body>


            </Modal>
        </div >





    )
}
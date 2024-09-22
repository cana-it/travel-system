import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alertsuccess,
    Alerterror, FormatDateJson,
} from '../../../../Utils';
import { IMAGES_DOMAIN } from '../../../../Services'
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useNavigate } from 'react-router-dom';

export const StaffinforDetail = () => {
    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const [Data, setData] = useState([]);
    const navigate = useNavigate();
    let linkAvatar = IMAGES_DOMAIN;
    let linkoke = localStorage.getItem("Avatar") === null ? linkAvatar + "/Content/img/LogoNetco.png" : linkAvatar + localStorage.getItem("Avatar");
    const [Files, setFiles] = useState();
    const [ViewFiles, setViewFiles] = useState([])
    const [FileUpload, setFileUpload] = useState("");
    const [Avatar, setAvatar] = useState(linkoke);

    useEffect(() => {
        Trl_spStaff_List();
    }, [])

    //#region thông tin nhân viên 
    const Trl_spStaff_List = async () => {
        try {

            const pr = {

                DepartmentId: 0,
                BranchId: 0,
                StaffSearch: '',
                StaffId: Creater,
                Creater: Creater
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spStaff_List"
            }

            const list = await mainAction.API_spCallServer(params, dispatch);
            setData(list);
            setAvatar(linkAvatar + list[0].Avatar);
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }

    //#endregion

    //#region đổi avvatar
    const onFileChange = (event) => {
        setFileUpload(event.target.files[0]);
        setAvatar(URL.createObjectURL(event.target.files[0]));
    };
    const Change_Avatar = async() => {
        let avt = "";
        if (FileUpload !== "" && FileUpload.name !== undefined) {
            const formData = new FormData();
            formData.append("myFile", FileUpload);
            formData.append("Key", "Avatar");
            const data = await mainAction.API_spCallPostFile(formData, dispatch);
            let _imgavt = data.Message.replaceAll('"', '')
            avt = _imgavt.replace("[", "").replace("]", "");
        }
        const pr = {
            StaffId: Creater,
            Avatar: avt
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Trl_spStaff_Update_Avatar"
        }
        const result = await mainAction.API_spCallServer(params, dispatch);
        Alertsuccess(result.ReturnMess);
        localStorage.removeItem("Avatar");
        localStorage.setItem("Avatar", avt);
        navigate("/thong-tin-nhan-vien")
    };
    //#endregion

    return (
        <>
        <div className="content-wrapper ">
            <section className="content">
                <div className="container-fluid">
                    <div class="mt-3">
                        <div class="content">
                            <div class="container-fluid">
                                {
                                    Data.map((item, index) => {
                                        return (
                                            <div class="section-image">
                                                <div class="container">
                                                    <div class="row">
                                                        <div class="col-md-4">
                                                            <div class="card-user card" style={{height:'350px'}}>
                                                                <div class="card-body">
                                                                    <div class="author">
                                                                        <div className="row">
                                                                            <div className="col-md-12 pb-3 text-center">
                                                                                <div>
                                                                                    <label class="">
                                                                                        <input
                                                                                            type="file"
                                                                                            className="image-collapse-file"
                                                                                            /*  onChange={onFileChange} */
                                                                                            accept="image/*"
                                                                                        />
                                                                                        <img
                                                                                            src={Avatar}
                                                                                            style={{
                                                                                                width: '150px',
                                                                                                height: '150px',
                                                                                                borderRadius: '100px',
                                                                                                border: '5px dashed #009688'
                                                                                            }}
                                                                                        /*  onChange={onFileChange} */
                                                                                        />
                                                                                    </label>
                                                                                </div>




                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <p class="card-description text-center">   <div class='rainbow'>{item.StaffName}</div></p>
                                                                </div>
                                                                <div class="card-footer text-center">

                                                                    <div class='row'>
                                                                        <input
                                                                            type="file"
                                                                            className="image-collapse-file"
                                                                            onChange={onFileChange}
                                                                            accept="image/*"
                                                                        />
                                                                        <i className="fa fa-camera upload-file-btn"></i>
                                                                        <span className="image-collapse-span" style={{ paddingTop: '10px',marginLeft: '9px'}}>
                                                                            Chọn hình
                                                                        </span>
                                                                    </div>
                                                                    <div class=''>
                                                                        <button type="btn" onClick={e => Change_Avatar()} class="btn-fill pull-right btn btn-info">Đổi Avatar</button>
                                                                    </div>


                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-8 col-sm-6">

                                                            <div class="card">

                                                                <div class="card-header">
                                                                    <h4 class="card-title">THÔNG TIN NHÂN VIÊN</h4>
                                                                </div>

                                                                <div class="card-body">

                                                                    <div class="row">

                                                                        <div class="col-md-6">
                                                                            <div class="form-group">
                                                                                <label className='infor_tt'>Chi nhánh</label>
                                                                                <input cols="80" rows="4" class="form-control" value={item.BranchName} />
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-md-6">
                                                                            <div class="form-group">
                                                                                <label className='infor_tt'>Phòng Ban</label>
                                                                                <input cols="80" rows="4" class="form-control" value={item.DepartmentName} />
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-md-4">
                                                                            <div class="form-group">
                                                                                <label className='infor_tt'>Mã nhân viên</label>
                                                                                <input cols="80" rows="4" class="form-control" value={item.StaffCode} />
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-md-8">
                                                                            <div class="form-group">
                                                                                <label className='infor_tt'>Tên đăng Nhập</label>
                                                                                <input cols="80" rows="4" class="form-control" value={item.UserName} />
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-md-4">
                                                                            <div class="form-group">
                                                                                <label className='infor_tt'>Giới Tính</label>
                                                                                <input cols="80" rows="4" class="form-control" value={item.Sex} />
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-md-4">
                                                                            <div class="form-group">
                                                                                <label className='infor_tt'> Ngày sinh</label>
                                                                                <input cols="80" rows="4" class="form-control" value={item.Brithday === '' ? '' : FormatDateJson(item.Brithday, 4)} />
                                                                            </div>
                                                                        </div>

                                                                        <div class="col-md-4">
                                                                            <div class="form-group">
                                                                                <label className='infor_tt'>Số DT</label>
                                                                                <input cols="80" rows="4" class="form-control" value={item.Phone} />
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-md-4">
                                                                            <div class="form-group">
                                                                                <label className='infor_tt'>Email</label>
                                                                                <input cols="80" rows="4" class="form-control" value={item.Email} />
                                                                            </div>
                                                                        </div>

                                                                        <div class="col-md-4">
                                                                            <div class="form-group">
                                                                                <label className='infor_tt'> Ngày làm việc</label>
                                                                                <input cols="80" rows="4" class="form-control" value={item.Timestartwork === '' ? '' : FormatDateJson(item.Timestartwork, 4)} />
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-md-4">
                                                                            <div class="form-group">
                                                                                <label className='infor_tt'>CMND/CCCD</label>
                                                                                <input cols="80" rows="4" class="form-control" value={item.IdentityCode} />
                                                                            </div>
                                                                        </div>

                                                                        <div class="col-md-12">
                                                                            <div class="form-group">
                                                                                <label className='infor_tt'>Địa chỉ</label>
                                                                                <input cols="80" rows="4" class="form-control" value={item.Address} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="clearfix"></div>
                                                                </div>
                                                            </div>

                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
        </>
    )
}

const customStyles = {
    content: {
        top: '25%',
        left: '55%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        zIndex: '4'
    }
};
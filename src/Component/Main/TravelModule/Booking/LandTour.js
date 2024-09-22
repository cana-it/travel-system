import { useState, useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import { useDispatch } from "react-redux";
import { SelectProvider } from "../../../../Common";
import { mainAction } from "../../../../Redux/Actions";
import { FormatMoney } from "../../../../Utils";
import { ServiceLandTourForm } from '../Service/ServiceLandTourForm';

import { IMAGES_DOMAIN } from '../../../../Services'
import { Alertsuccess,  Alerterror} from '../../../../Utils';
export const LandTourForm = ({
    data = [],
    handleShow = () => { },
    setOpacity = () => { },
    Booking = () => { },
    IsActive = () => { },
    onLantourInfor = () => { },
    DataObject = () => { },
}) => {
    const dispatch = useDispatch();

    const [LandTourId, setLandtourId] = useState();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const [FileLandTour, setFileLandTour] = useState("");
    const [BookingInfor, setBookingInfor] = useState("");
    const [LandTourCode, setLandTourCode] = useState(0);
    const Trl_spBooking_UpdateLandTour_Save = async () => {

        let listfile = ""

        if (FileUpload1 !== "" && FileUpload1.length > 0) {
            const formData = new FormData();
            formData.append("Key", "FilesLandTour");
            for (let i = 0; i < FileUpload1.length; i++) {
                formData.append("myFile" + i, FileUpload1[i]);

            }
            const data = await mainAction.API_spCallPostFile(formData, dispatch);
            let _img = data.Message.replaceAll('"', '')
            listfile = _img.replace("[", "").replace("]", "");
        }
        try {
            const params = {
                Json: JSON.stringify({
                    BookingId: Booking.BookingId,
                    LandTourId: LandTourId === undefined ? 0 : LandTourId,
                    Files: listfile === "" ? Files : listfile,
                    Creater: Creater,
                    CreateName: CreateName
                }),
                func: "Trl_spBooking_UpdateLandTour_Save"
            }
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                result.Files !== "" ? setFileLandTour(IMAGES_DOMAIN + listfile) : setFileLandTour("")// show file
                let LandTourFile = "";
                if(result.LandTourFile !== "")
                {
                    const fls = result.LandTourFile?.split(",").filter(e => e !== "");
                    fls.map((fn, id) => {
                    //let keyc = CheckTypeFile(fn);
                    const splitfn = fls[id].split("/");
                    LandTourFile = splitfn[splitfn.length - 1];
                })
                }
                
                //return data to booking form
                onLantourInfor({
                    LandTourCode:result.LandTourCode,
                    LandTourName:result.LandTourName,
                    LandTourFile:LandTourFile,
                    LandTourTime:result.LandTourTime
                })
                return;
            }
            if (result.Status === "NOTOK") {
                Alerterror(result.ReturnMess);
                return;
            }
        } catch (error) {
            ;
        }
    }
    const [Files, setFiles] = useState("");
    const [ViewFiles, setViewFiles] = useState([])
    const [FileUpload1, setFileUpload1] = useState("")
    const onFileChange1 = (event) => {
        let fileok = event.target.files;
        setFileUpload1(fileok);
        let filename = [...ViewFiles];
        for (let i = 0; i < fileok.length; i++) {
            filename.push(fileok[i].name);
        }
        setViewFiles(filename);
    };

    useEffect(() => {
   
        setBookingInfor(Booking?.BookingCode + '/' + Booking?.BookingName);
        setLandTourCode(Booking?.LandTourCode);
        const fls = Booking?.LandTourFile?.split(",").filter(e => e !== "");
        fls !== undefined && fls.map((fn, id) => {
            //let keyc = CheckTypeFile(fn);
            const splitfn = fls[id]?.split("/");
            const fname = splitfn[splitfn.length - 1];
            setFileLandTour(IMAGES_DOMAIN + fn);
        })

    }, [IsActive, Booking]);

    
    const Trl_spLandTour_FileDelete = (filename) => {
        if (window.confirm("Bạn có chắc muốn xóa file?")) {
            let fileold = Files, // list file gốc
                listfileok = "", // file sau khi đã xóa
                showdata = [...ViewFiles]; // list file đang hiển thị
            if (fileold !== undefined && fileold !== "") {
                let checkfile = fileold.split(",").filter(e => e !== "");
                for (let i = 0; i < checkfile.length; i++) {
                    const splitfn = checkfile[i].split("/").filter(e => e !== "");
                    if (splitfn[splitfn.length - 1] !== filename) {
                        listfileok += checkfile[i] + ',';
                    }
                    if (splitfn[splitfn.length - 1] === filename) {
                        const dbnew = showdata.filter(p => p !== filename);
                        setViewFiles(dbnew);
                    }
                }
                
                setFiles(listfileok);
            }
        }

    }

    return (
        <>
            <div className="row booking">
                <div className="col-md-12">
                    <h4>{BookingInfor}</h4>
                </div>
                <div className="col-md-4">
                    <div class="card m-1 card-shadow" >
                        <div class="card-header card-header-custom">
                            <div class="row center-item">
                                <div class="col-sm-12 col-md-6" >
                                    <h3 class="card-title font-weight-bold text-muted">
                                        Land Tour File
                                    </h3>
                                </div>
                                <div class="col-sm-12 col-md-6" >
                                    <button type="button" class="btn btn-sm btn-success pull-right" onClick={e => Trl_spBooking_UpdateLandTour_Save()}>
                                        <i class="fa fa-edit pr-2"></i>
                                        Lưu Thông tin LandTour
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body table-responsive p-0">
                            <div className="col-sm-12 col-md-12">
                                <label class="image-collapse-label">
                                    <input
                                        type="file"
                                        className="image-collapse-file"
                                        onChange={onFileChange1}
                                        accept="*"
                                    />
                                    <i className="fa fa-file upload-file-btn"></i>
                                    <span className="image-collapse-span">
                                        Upload PDF Land Tour
                                    </span>
                                </label>
                            </div>
                            <div className="col-sm-12 col-md-8">
                                {
                                    ViewFiles.map((filename, index) => {
                                        return (
                                            <div className='margin-top-5 hover-deletefile'>
                                                <i className='fa fa-trash' onClick={e => Trl_spLandTour_FileDelete(filename)}></i> {filename}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="col-sm-12 col-md-12 margin-top-10">
                                <iframe
                                    src={FileLandTour}
                                     style={{ width: '100%', height: '400px' }} 
                                     frameborder="0"
                                     title="document"
                                     >
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <ServiceLandTourForm
                        onSelected={e => setLandtourId(e)}
                        onItem={LandTourCode}
                        handleShow={handleShow}
                        setOpacity={setOpacity}
                        Booking={Booking}
                        DataObject={DataObject}
                    />
                </div>
            </div>
        </>
    )
}
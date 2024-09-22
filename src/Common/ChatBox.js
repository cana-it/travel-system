
import { IMAGES_DOMAIN } from '../Services'
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { FormatDateJson } from '../Utils';


export const ChatBox = () => {

    useEffect(() => {

        Trl_spChatlog_GetLogData();
    }, [])
 

    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
  
    const [DataLog, setDataLog] = useState([]);
    const Trl_spChatlog_GetLogData = async () => {
        let pr = {
            Group_Id:"Test"
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Trl_spChatlog_GetLogData",
        }
        const result = await mainAction.API_spCallServer(params, dispatch)
        setDataLog(result);
    }

    const back = useRef(null)
    useEffect(() => {
        back.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }, [DataLog]);


    const [ChatText, setChatText] = useState('');

    const ChatBoxMess = (event) => {
        
        if(event.key === 'Enter'){
        if (ChatText !== "" && ChatText !== undefined) {
            let datachat = [...DataLog]
            let text =ChatText
            const hel = {
                Avatar:"/Content/Upload/Avatar/2022/11/312603811_490948179739155_3407035704825977580_n(4).jpg",
                Createtime:"11/17/2022",
                Group_Id:"Test",
                Id_Send :parseInt(Creater)  ,
                Message:text,
                StaffName:CreateName
            }

            datachat.push(hel);
            setDataLog(datachat)
            Trl_spChatlog_Save(hel);
        }
    }}



    const Trl_spChatlog_Save = async (data) => {   
        let b = data.Message
        let id =parseInt(data.Id_Send);

        let pr = {
            Id_Chat_Log: 0,
            Id_Send: id,
            Name_Send: CreateName,
            Message: b,
            Createtime: '',
            Group_Id:'Test'
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Trl_spChatlog_Save",
        }
        const result = await mainAction.API_spCallServer(params, dispatch)
        Trl_spChatlog_GetLogData();
        setChatText('')
    }


    const RenderMessage = () => {
        return (
            
            DataLog.map((item, index) => {

                if (item.Id_Send === parseInt(Creater)) {
                 
                    return (
                        <div className="direct-chat-msg right">
                            <div className="direct-chat-infos clearfix">

                            </div>
                            <img className="direct-chat-img" src={IMAGES_DOMAIN + item.Avatar} alt='User Image' />
                            <div className="direct-chat-text chat-user-text">
                                {item.Message}<br />
                                <span className="direct-chat-timestamp float-left chat-time">{FormatDateJson(item.Createtime)}</span>
                            </div>
                        </div>
                    )
                }


                else {

                    return (

                        <div className="direct-chat-msg">
                            <div className="direct-chat-infos clearfix">
                                <span className="direct-chat-name float-left">{item.StaffName}</span>

                            </div>
                            <img className="direct-chat-img" src={IMAGES_DOMAIN + item.Avatar} alt='User Image' />
                            <div className="direct-chat-text chat-guest-text">
                                {item.Message}<br />
                                <span className="direct-chat-timestamp float-right chat-time">{FormatDateJson(item.Createtime)}</span>
                            </div>
                        </div>
                    )
                }
            })
        )
    }

    return (
        <>
        <div className="content-wrapper">
            <div className="card direct-chat direct-chat-warning">
                <div className="card-header">
                    <h3 className="card-title"><p class='chat-box-title'>Tâm sự tuổi hồng</p></h3>

                    <div className="card-tools">
                        <span title="New Messages" className="badge badge-warning">{DataLog.length}</span>
                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                            <i className="fas fa-minus"></i>
                        </button>
                        <button type="button" className="btn btn-tool" title="Contacts" data-widget="chat-pane-toggle">
                            <i className="fas fa-comments"></i>
                        </button>
                        <button type="button" className="btn btn-tool" data-card-widget="remove">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="direct-chat-messages chat-box">
                        <RenderMessage />
                        <div id={'el'} ref={back}></div>

                    </div>
                </div>
                <div className="card-footer margin-top-20">
                        <div className="input-group">

                            <img src='https://media0.giphy.com/media/3oEjI6SIIHBdRxXI40/200w.gif?cid=6c09b952s0gxsa0o9rz4thketxykmtq4jvoyz05xwdz2iiii&rid=200w.gif&ct=g'
                                class='chat-loading fade' />
                            <input type="text" name="message"
                                placeholder="Nhập tin nhắn ..."
                                className="chat-group-text" 
                                value={ChatText}
                                onChange={(e) =>setChatText(e.target.value)}
                                onKeyDown={(e) => ChatBoxMess(e)}
                                />
                            <span className="input-group-append">
                                <button type="button" className="btn btn-warning">Send</button>
                            </span>
                        </div>
                </div>
            </div>
        </div>
        </>
    )
}
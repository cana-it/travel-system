import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  DataTable,
  SelectContinent,
  SelectCountry,
  SelectCity,
} from "../../../../Common";
import {
  Alertwarning,
  Alertsuccess,
  Alerterror,
  ExportExcel,
  FormatDateJson,
  ConfirmAlert,
} from "../../../../Utils";
import { IMAGES_DOMAIN } from "../../../../Services";
import "react-confirm-alert/src/react-confirm-alert.css";
import Modal from "react-bootstrap/Modal";
import $ from "jquery";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";


export const SightseeingData = ()=>{
    useEffect(() => {
        Trl_spOperating_SightSeeing_List()
    }, []);
    
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const dispatch = useDispatch();

    //Ref
  const ContinentRef = useRef();
  const CountryRef = useRef();
  const AreaRef = useRef();

  const [SightseeingId,setSightseeingId] = useState(0)
  const [Continent,setContinent] = useState(0)
  const [Country,setCountry] = useState(0)
  const [Area,setArea] = useState(0)
  const [SightseeingName,setSightseeingName] = useState("")
  const [SightseeingAddress,setSightseeingAddress] = useState("")
  const [TicketY,setTicketY] = useState(0)
  const [TicketN,setTicketN] = useState(1)
  const [FIT,setFIT] = useState(0)
  const [GIT,setGIT] = useState(0)
  const [Company,setCompany] = useState(0)
  const [Partner,setPartner] = useState(0)
  const [Other,setOther] = useState(0)
  const [Notes,setNotes]  = useState("")
  const [DataTableList,setDataTableList] = useState([])

  const onSelectContinent = (e)=>{
    setContinent(e.value)
  }

  const onSelectCountry = (e) =>{
    setCountry(e.value)
  }

  const onSelectCity = (e) =>{
    setArea(e.value)
  }

  const onClickY = (e) => {
    if(e === true){
      setTicketY(1)
      setTicketN(0)
    }
  }

  const onClickN = (e) => {
    if(e === true){
      setTicketY(0)
      setTicketN(1)
    }
  }

  const onClickF = (e)=>{
    if(e === true){
      setFIT(1)
    }else{
      setFIT(0)
    }
  }

  const onClickG = (e)=>{
    if(e === true){
      setGIT(1)
    }else{
      setGIT(0)
    }
  }

  const onClickC = (e)=>{
    if(e === true){
      setCompany(1)
    }else{
      setCompany(0)
    }
  }

  const onClickP = (e)=>{
    if(e === true){
      setPartner(1)
    }else{
      setPartner(0)
    }
  }

  const onClickO = (e)=>{
    if(e === true){
      setOther(1)
    }else{
      setOther(0)
    }
  }

  const Trl_spOperating_Sightseeing_Save = async () => {
    try {
      if(Continent === 0 || Continent === -1){
        Alertwarning("Vui Lòng Chọn Châu Lục!");
        return;
      }
      if(Country === 0 || Country === -1){
        Alertwarning("Vui Lòng Chọn Nước!");
        return;
      }
      if(Area === 0 || Area === -1){
        Alertwarning("Vui Lòng Chọn Khu Vực!");
        return;
      }
      if(SightseeingName == ""){
        Alertwarning("Vui Lòng Nhập Tên Điểm Tham Quan!");
        return;
      }
      const pr = {
        SightseeingId: SightseeingId,
        SightseeingName: SightseeingName,
        SightseeingAddress: SightseeingAddress,
        Note: Notes,
        Continent: Continent,
        Country: Country,
        Area: Area,
        Ticket: TicketY === 1? TicketY : 0,
        FIT: FIT,
        GIT: GIT,
        Company: Company,
        Partner: Partner,
        Other: Other,
        Creater: parseInt(Creater)
      }
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_Sightseeing_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spOperating_SightSeeing_List();
        ClearFrom();
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const ClearFrom = ()=>{
    setSightseeingId(0);
    setSightseeingName("");
    setSightseeingAddress("");
    setNotes("");
    setTicketY(0);
    setTicketN(1);
  }

  const Trl_spOperating_SightSeeing_List = async () =>{
    try {
        const pr = {
            Officer: parseInt(Creater),
        };

        const params = {
            Json: JSON.stringify(pr),
            func: "Trl_spOperating_SightSeeing_List",
        };

        const result = await mainAction.API_spCallServer(params, dispatch);
        if(result.length != 0){
            setDataTableList(result)
        }
        } catch (error) {
        Alerterror("Lỗi, liên hệ IT");
        ;
    }
  }

  const Edit = (e) =>{
    let Ojb = e.row.original;
    document.querySelector("#tab_1").click();
    setSightseeingId(Ojb.SightseeingId);
    setSightseeingName(Ojb.SightseeingName);
    setSightseeingAddress(Ojb.SightseeingAddress);
    setContinent(Ojb.Continent);
    setCountry(Ojb.Country);
    setArea(Ojb.Area);
    setNotes(Ojb.Note);
    if(Ojb.Ticket === true){
        setTicketY(1);
        setTicketN(0);
    }else{
        setTicketY(0);
        setTicketN(1);
    }
    if(Ojb.FIT === true){
      setFIT(1);
      setGIT(0);
    }
    if(Ojb.GIT === true){
      setFIT(0);
      setGIT(1);
    }
    if(Ojb.Company === true){
      setCompany(1);
      setPartner(0);
      setOther(0);
    }
    if(Ojb.Partner === true){
      setCompany(0);
      setPartner(1);
      setOther(0);
    }
    if(Ojb.Other === true){
      setCompany(0);
      setPartner(0);
      setOther(1);
    }
  }

  const Delete = async (e) =>{
    let Ojb = e.row._original;
    try {
      const pr = {
        SightseeingId: Ojb.SightseeingId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_SightSeeing_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        const newArr = [...DataTableList];
        setDataTableList(newArr.filter(item => item.SightseeingId !== Ojb.SightseeingId))
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  }

  const columns = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 40,
      textAlign: "center",
      filterable: false,
      sortable: false,
    },
    {
      Header: "Tùy Chọn",
      accessor: '[row identifier to be passed to button]',
      width: 150,
      filterable: false,
      sortable: false,
      Cell: (row) => (
        <div>
            <span>
              <button className="btn btn-sm btn-success" onClick={e => Edit({ row })}><i class="fa fa-eye"></i> Sửa</button>|
              <button className="btn btn-sm btn-danger" onClick={(e) => {ConfirmAlert("Xác nhận", "Bạn có muốn lưu không?", () => {Delete(row);});}}><i class="fas fa-eraser"></i> Xóa</button>
            </span>
        </div>  
      ),
    },
    {
      Header: 'Châu Lục',
      accessor: 'ContinentName',
      width: 150,
    },
    {
      Header: 'Nước',
      accessor: 'CountryName',
      width: 150,
    },
    {
      Header: 'Thành Phố',
      accessor: 'AreaName',
      width: 250,
    },
    {
      Header: 'Tên Điểm Tham Quan',
      accessor: 'SightseeingName',
      width: 250,
    },
    {
      Header: 'Địa Chỉ',
      accessor: 'SightseeingAddress',
      width: 350,
    },
    {
        Header: 'Vé Vào',
        accessor: 'Ticket',
        width: 150,
        Cell: ({ row }) => <span>{row._original.Ticket === true ? <span><i class="fas fa-check"></i></span> : ""}</span>
    },
    {
      Header: 'FIT',
      accessor: 'FIT',
      width: 150,
      Cell: ({ row }) => <span>{row._original.FIT === true ? <span><i class="fas fa-check"></i></span> : ""}</span>
    },
    {
      Header: 'GIT',
      accessor: 'GIT',
      width: 150,
      Cell: ({ row }) => <span>{row._original.GIT === true ? <span><i class="fas fa-check"></i></span> : ""}</span>
    },
    {
      Header: 'Công Ty',
      accessor: 'Company',
      width: 150,
      Cell: ({ row }) => <span>{row._original.Company === true ? <span><i class="fas fa-check"></i></span> : ""}</span>
    },
    {
      Header: 'Đối Tác',
      accessor: 'Partner',
      width: 150,
      Cell: ({ row }) => <span>{row._original.Partner === true ? <span><i class="fas fa-check"></i></span> : ""}</span>
    },
    {
      Header: 'Khác',
      accessor: 'Other',
      width: 150,
      Cell: ({ row }) => <span>{row._original.Other === true ? <span><i class="fas fa-check"></i></span> : ""}</span>
    },
    {
      Header: 'Người Tạo',
      accessor: 'Create',
      width: 200,
    },
    {
      Header: 'Thời Gian Tạo',
      accessor: 'CreateTime',
      width: 200,
      Cell: ({ row }) => (<span>{FormatDateJson(row._original.CreateTime,10)}</span>),
    },
    {
      Header: 'Ghi Chú',
      accessor: 'Note',
      width: 450,
    },
  ]

  return (
    <>
      <div className="content-wrapper">
        <div className="card card-primary">
          <ul className="nav float-left">
            <li className="nav-item">
              <a
                id="tab_1"
                className="nav-link active"
                href="#tab_1add"
                data-toggle="tab"
              >
                THÊM MỚI
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link " href="#tab_2" data-toggle="tab">
                DANH SÁCH
              </a>
            </li>
          </ul>
          <div className="body-padding">
            <div className="tab-content" id="custom-tabs-two-tabContent">
              <div
                className="tab-pane fade show active"
                id="tab_1add"
                role="tabpanel"
                aria-labelledby="custom-tabs-two-home-tab"
              >
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-6">
                      <h3 className="card-title">
                        <i className="fas fa-plus" />
                        <span className="font-weight-bold">
                          Thêm Mới Điểm Tham Quan
                        </span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      <button
                        className="btn btn-success btn-sm float-right btn-header"
                        onClick={() => {
                          ConfirmAlert("Xác nhận", "Bạn có muốn lưu không?", () => {
                            Trl_spOperating_Sightseeing_Save();
                          });
                        }}
                        type="button"
                      >
                        <i className="fa fa-save mr-2 " />
                        Thêm Mới
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body ">
                  <div className="row">
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Châu Lục
                        </span>
                        <div class="input-group">
                          <SelectContinent className="SelectMeno"
                            onSelected={e => {
                              onSelectContinent(e)
                            }}
                            LocationId ={Continent}
                            ref={ContinentRef}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Nước
                        </span>
                        <div class="input-group">
                          <SelectCountry className="SelectMeno"
                            onSelected={e => {
                              onSelectCountry(e)
                            }}
                            ContinentId = {Continent}
                            LocationId ={Country}
                            ref={CountryRef}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Thành Phố
                        </span>
                        <div class="input-group">
                          <SelectCity className="SelectMeno"
                            onSelected={e => {
                              onSelectCity(e)
                            }}
                            CountryId = {Country}
                            LocationId ={Area}
                            ref={AreaRef}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Tên Điểm Tham Quan
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={SightseeingName} onChange={e => setSightseeingName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-9 col-md-9 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Địa Chỉ
                        </span>
                        <div class="input-group">
                        <input
                          type="text"
                          class="form-control2"
                          value={SightseeingAddress} onChange={e => setSightseeingAddress(e.target.value)}
                        />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                    <div class="form-group">
                      <span className='small font-weight-bold text-muted'>Vé Tham Quan</span>
                        <div class="input-group" >
                          <div class="col-sm-6 col-md-6 " >
                            <div class="icheck-success d-inline">
                              <input type="checkbox" id="checkboxYT" checked={TicketY} onChange={e => onClickY(e.target.checked)} />
                              <label class="label checkbox" htmlFor="checkboxYT">Có Vé</label>
                            </div>
                          </div>
                          <div class="col-sm-6 col-md-6" >
                            <div class="icheck-success d-inline">
                              <input type="checkbox" id="checkboxNT" checked={TicketN} onChange={e => onClickN(e.target.checked)} />
                              <label class="label checkbox" htmlFor="checkboxNT">Không Vé</label>
                            </div>
                          </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 ">
                    <div class="form-group">
                      <span className='small font-weight-bold text-muted opacity-0 '>Buffet</span>
                        <div class="input-group">
                          <div class="col-sm-6 col-md-6" >
                            <div class="icheck-success d-inline">
                              <input type="checkbox" id="checkboxFit" checked={FIT} onChange={e => onClickF(e.target.checked)} />
                              <label class="label checkbox" htmlFor="checkboxFit">FIT</label>
                            </div>
                          </div>
                          <div class="col-sm-6 col-md-6" >
                            <div class="icheck-success d-inline">
                              <input type="checkbox" id="checkboxGit" checked={GIT} onChange={e => onClickG(e.target.checked)} />
                              <label class="label checkbox" htmlFor="checkboxGit">GIT</label>
                            </div>
                          </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3">
                    <div class="form-group">
                      <span className='small font-weight-bold text-muted opacity-0 '>Agency</span>
                        <div class="input-group row">
                          <div class="col-sm-4 col-md-4" >
                            <div class="icheck-success d-inline">
                              <input type="checkbox" id="checkboxComP" checked={Company} onChange={e => onClickC(e.target.checked)} />
                              <label class="label checkbox" htmlFor="checkboxComP">CTy</label>
                            </div>
                          </div>
                          <div class="col-sm-4 col-md-4">
                            <div class="icheck-success d-inline">
                              <input type="checkbox" id="checkboxPartner" checked={Partner} onChange={e => onClickP(e.target.checked)} />
                              <label class="label checkbox" htmlFor="checkboxPartner">Đối Tác</label>
                            </div>
                          </div>
                          <div class="col-sm-4 col-md-4">
                            <div class="icheck-success d-inline">
                              <input type="checkbox" id="checkboxK" checked={Other} onChange={e => onClickO(e.target.checked)} />
                              <label class="label checkbox" htmlFor="checkboxK">Khác</label>
                            </div>
                          </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Ghi Chú
                        </span>
                        <div class="input-group">
                        <input
                          type="text"
                          class="form-control2"
                          value={Notes} onChange={e => setNotes(e.target.value)}
                        />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="tab_2"
                role="tabpanel"
                aria-labelledby="custom-tabs-two-profile-tab"
              >
              <div className="card">
                <div className="card-body">
                  <div class="form-group">
                    <DataTable
                      data={DataTableList}
                      columns={columns}
                    />
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
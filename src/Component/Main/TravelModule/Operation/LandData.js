import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import Select from "react-select";
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
import { VisaForm } from "../Booking/VisaForm";
import moment from "moment";
import { InvoiceVisa } from "../Booking/InvoiceVisa";

import DateTimePicker from "react-datetime-picker";

export const LandData = () => {

  useEffect(() => {
    Trl_spOperating_Land_List()
  }, []);

  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const dispatch = useDispatch();

  //Ref
  const ContinentRef = useRef();
  const CountryRef = useRef();
  const AreaRef = useRef();

  const [LandId,setLandId] = useState(0)
  const [Continent,setContinent] = useState(0)
  const [Country,setCountry] = useState(0)
  const [Area,setArea] = useState(0)
  const [LandName,setLandName] = useState("")
  const [LandPhone,setLandPhone] = useState("")
  const [LandManager,setLandManager] = useState("")
  const [LandAddress,setLandAddress] = useState("")
  const [Notes,setNotes]  = useState("")
  const [DataTableList,setDataTableList] = useState([])

  const ClearFrom = ()=>{
    setLandId(0);
    setLandName("");
    setLandAddress("");
    setLandManager("");
    setLandPhone("");
    setNotes("");
  }

  const onSelectContinent = (e)=>{
    setContinent(e.value)
  }

  const onSelectCountry = (e) =>{
    setCountry(e.value)
  }

  const onSelectCity = (e) =>{
    setArea(e.value)
  }

  const Trl_spOperating_Land_Save = async () => {
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
      const pr = {
        LandId: LandId,
        LandName: LandName,
        LandAddress: LandAddress,
        LandPhone: LandPhone,
        LandManager: LandManager,
        Note: Notes,
        Continent: Continent,
        Country: Country,
        Area: Area,
        Creater: parseInt(Creater)
      }
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_Land_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spOperating_Land_List();
        ClearFrom();
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spOperating_Land_List = async ()=>{
    try {
      const pr = {
        Officer: parseInt(Creater),
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_Land_List",
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
    setLandId(Ojb.LandId);
    setLandName(Ojb.LandName);
    setLandPhone(Ojb.LandPhone);
    setLandManager(Ojb.LandManager);
    setLandAddress(Ojb.LandAddress);
    setContinent(Ojb.Continent);
    setCountry(Ojb.Country);
    setArea(Ojb.Area);
    setNotes(Ojb.Note);
  }

  const Delete = async (e) =>{
    let Ojb = e.row._original;
    try {
      const pr = {
        LandId: Ojb.LandId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_Land_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        const newArr = [...DataTableList];
        setDataTableList(newArr.filter(item => item.LandId !== Ojb.LandId))
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
              <button className="btn btn-sm btn-danger" onClick={(e) => {ConfirmAlert("Xác nhận", "Bạn có muốn xóa không?", () => {Delete(row);});}}><i class="fas fa-eraser"></i> Xóa</button>
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
      Header: 'Đối Tác',
      accessor: 'LandName',
      width: 200,
    },
    {
      Header: 'Địa Chỉ',
      accessor: 'LandAddress',
      width: 350,
    },
    {
      Header: 'Số ĐT',
      accessor: 'LandPhone',
      width: 200,
    },
    {
      Header: 'Quản Lý',
      accessor: 'LandManager',
      width: 250,
    },
    {
      Header: 'Người Tạo',
      accessor: 'Create',
      width: 250,
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
                          Thêm Mới Tour
                        </span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      <button
                        className="btn btn-success btn-sm float-right btn-header"
                        onClick={() => {
                          ConfirmAlert("Xác nhận", "Bạn có muốn lưu không?", () => {
                            Trl_spOperating_Land_Save();
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
                    <div className="col-xs-12 col-sm-6 col-md-3 m-auto">
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
                    <div className="col-xs-12 col-sm-6 col-md-3 m-auto">
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
                    <div className="col-xs-12 col-sm-6 col-md-3 m-auto">
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
                    <div className="col-xs-12 col-sm-6 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Tên Đối Tác
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={LandName} onChange={e => setLandName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Địa Chỉ
                        </span>
                        <div class="input-group">
                        <input
                          type="text"
                          class="form-control2"
                          value={LandAddress} onChange={e => setLandAddress(e.target.value)}
                        />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Số ĐT
                        </span>
                        <div class="input-group">
                        <input
                          type="text"
                          class="form-control2"
                          value={LandPhone} onChange={e => setLandPhone(e.target.value)}
                        />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Quản Lý
                        </span>
                        <div class="input-group">
                        <input
                          type="text"
                          class="form-control2"
                          value={LandManager} onChange={e => setLandManager(e.target.value)}
                        />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Ghi Chú
                        </span>
                        <div class="input-group">
                        <textarea
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

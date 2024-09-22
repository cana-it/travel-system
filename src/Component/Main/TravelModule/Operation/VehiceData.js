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
  FormatDateJson,
  ConfirmAlert,
  FormatMoney,
} from "../../../../Utils";
import "react-confirm-alert/src/react-confirm-alert.css";

export const VehicleData = () => {

  useEffect(() => {
    Trl_spOperating_Vehicle_List()
  }, []);

  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const dispatch = useDispatch();

  const [VehicleId,setVehicleId] = useState(0)
  const [VehicleName,setVehicleName] = useState("")
  const [VehicleAddress,setVehicleAddress] = useState("")
  const [Downtown,setDowntown] = useState(0)
  const [Suburban,setSuburban] = useState(0)
  const [VehicleStar,setVehicleStar] = useState("")
  const [Continent,setContinent] = useState(0)
  const [Country,setCountry] = useState(0)
  const [Area,setArea] = useState(0)
  const [Notes,setNotes] = useState("")
  const [TypeVehicle16C,setTypeVehicle16C] = useState(0)
  const [TypeVehicle29C,setTypeVehicle29C] = useState(0)
  const [TypeVehicle35C,setTypeVehicle35C] = useState(0)
  const [TypeVehicle45C,setTypeVehicle45C] = useState(0)
  const [Brand,setBrand] = useState("")
  const [Driver,setDriver] = useState("")
  const [Price,setPrice] = useState("")
  const [PriceOverTime,setPriceOverTime] = useState("")
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

  const [StarList, setStarList] = useState({ value: 0 , label: 'Vui Lòng Chọn Số Sao' })
  const ListStar = [
    { value: 1, label: '3*' },
    { value: 2, label: '3*+'},
    { value: 3, label: '4*' },
    { value: 4, label: '4*+'},
    { value: 5, label: '5*' },
    { value: 6, label: '5*+'},
  ];

  const onSelecteVehicleStar = (e)=>{
    setStarList({value : e.value, label : e.label})
    setVehicleStar(e.label)
  }

  const onClickDT = (e) => {
    if(e === true){
      setDowntown(1)
      setSuburban(0)
    }
  }

  const onClickSB = (e) => {
    if(e === true){
      setDowntown(0)
      setSuburban(1)
    }
  }

  const onClick16C = (e) => {
    if(e === true){
      setTypeVehicle16C(1)
      setTypeVehicle29C(0)
      setTypeVehicle35C(0)
      setTypeVehicle45C(0)
    }
  }

  const onClick29C = (e) => {
    if(e === true){
      setTypeVehicle16C(0)
      setTypeVehicle29C(1)
      setTypeVehicle35C(0)
      setTypeVehicle45C(0)
    }
  }

  const onClick35C = (e) => {
    if(e === true){
      setTypeVehicle16C(0)
      setTypeVehicle29C(0)
      setTypeVehicle35C(1)
      setTypeVehicle45C(0)
    }
  }

  const onClick45C = (e) => {
    if(e === true){
      setTypeVehicle16C(0)
      setTypeVehicle29C(0)
      setTypeVehicle35C(0)
      setTypeVehicle45C(1)
    }
  }

  const Trl_spOperating_Vehicle_Save = async ()=>{
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
        VehicleId: VehicleId,
        VehicleName: VehicleName,
        VehicleAddress: VehicleAddress,
        Downtown: Downtown,
        Suburban: Suburban,
        VehicleStar: VehicleStar,
        TypeVehicle16C: TypeVehicle16C,
        TypeVehicle29C: TypeVehicle29C,
        TypeVehicle35C: TypeVehicle35C,
        TypeVehicle45C: TypeVehicle45C,
        Note: Notes,
        Brand: Brand,
        Driver: Driver,
        Price: +Price?.Price1 || 0,
        PriceOverTime: +PriceOverTime?.Price2 || 0,
        Continent: Continent,
        Country: Country,
        Area: Area,
        Creater: parseInt(Creater)
      }
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_Vehicle_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spOperating_Vehicle_List();
        ClearFrom();
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  }

  const Trl_spOperating_Vehicle_List = async ()=>{
    try {
      const pr = {
        Officer: parseInt(Creater),
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_Vehicle_List",
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

  const Edit = (e)=>{
    
    let Ojb = e.row.original;
    document.querySelector("#tab_1").click();
    setVehicleId(Ojb.VehicleId);
    setVehicleName(Ojb.VehicleName);
    setVehicleAddress(Ojb.VehicleAddress);
    setDowntown(Ojb.Downtown === true ?1:0);
    setSuburban(Ojb.Suburban === true ?1:0);
    const x = ListStar.find(x => x.label == Ojb.VehicleStar);
    setStarList(x);
    setVehicleStar(Ojb.VehicleStar);
    setTypeVehicle16C(Ojb.TypeVehicle16C === true ?1:0);
    setTypeVehicle29C(Ojb.TypeVehicle29C === true ?1:0);
    setTypeVehicle35C(Ojb.TypeVehicle35C === true ?1:0);
    setTypeVehicle45C(Ojb.TypeVehicle45C === true ?1:0);
    setBrand(Ojb.Brand);
    setDriver(Ojb.Driver);
    setPrice({...Price, Price1: FormatMoney(Ojb.Price, 1)});
    setPriceOverTime({...PriceOverTime, Price2: FormatMoney(Ojb.PriceOverTime, 1)});
    setContinent(Ojb.Continent);
    setCountry(Ojb.Country);
    setArea(Ojb.Area);
    setNotes(Ojb.Note);
  }

  const Delete = async (e)=>{
    let Ojb = e.row._original;
    try {
      const pr = {
        VehicleId: Ojb.VehicleId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_Vehicle_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        const newArr = [...DataTableList];
        setDataTableList(newArr.filter(item => item.VehicleId !== Ojb.VehicleId))
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  }

  const ClearFrom = ()=>{
    setVehicleId(0);
    setVehicleName("");
    setVehicleAddress("");
    setVehicleStar("");
    setStarList({value: 0 , label: 'Vui Lòng Chọn Số Sao'})
    setDowntown(0);
    setSuburban(0);
    setTypeVehicle16C(0);
    setTypeVehicle29C(0);
    setTypeVehicle35C(0);
    setTypeVehicle45C(0);
    setBrand("");
    setDriver("");
    setPrice("");
    setPriceOverTime("");
    setContinent(0);
    setCountry(0);
    setArea(0);
    setNotes("");
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
      Header: 'Tên Nhà Xe',
      accessor: 'VehicleName',
      width: 200,
    },
    {
      Header: 'Địa Chỉ',
      accessor: 'VehicleAddress',
      width: 350,
    },
    {
      Header: 'Trung Tâm',
      accessor: 'Downtown',
      width: 100,
      Cell: ({ row }) => <span>{row._original.Downtown === true ? <span><i class="fas fa-check"></i></span> : ""}</span>
    },
    {
      Header: 'Ngoại Ô',
      accessor: 'Suburban',
      width: 100,
      Cell: ({ row }) => <span>{row._original.Suburban === true ? <span><i class="fas fa-check"></i></span> : ""}</span>
    },
    {
      Header: 'Sao',
      accessor: 'VehicleStar',
      width: 150,
    },
    {
      Header: 'Loaij Xe 16C',
      accessor: 'TypeVehicle16C',
      width: 150,
      Cell: ({ row }) => <span>{row._original.TypeVehicle16C === true ? <span><i class="fas fa-check"></i></span> : ""}</span>
    },
    {
      Header: 'Loaij Xe 29C',
      accessor: 'TypeVehicle29C',
      width: 150,
      Cell: ({ row }) => <span>{row._original.TypeVehicle29C === true ? <span><i class="fas fa-check"></i></span> : ""}</span>
    },
    {
      Header: 'Loaij Xe 35C',
      accessor: 'TypeVehicle35C',
      width: 150,
      Cell: ({ row }) => <span>{row._original.TypeVehicle35C === true ? <span><i class="fas fa-check"></i></span> : ""}</span>
    },
    {
      Header: 'Loaij Xe 45C',
      accessor: 'TypeVehicle45C',
      width: 150,
      Cell: ({ row }) => <span>{row._original.TypeVehicle45C === true ? <span><i class="fas fa-check"></i></span> : ""}</span>
    },
    {
      Header: 'Thương Hiệu',
      accessor: 'Brand',
      width: 200,
    },
    {
      Header: 'Tài Xế',
      accessor: 'Driver',
      width: 200,
    },
    {
      Header: 'Mức Giá/Ngày',
      accessor: 'Price',
      width: 200,
    },
    {
      Header: 'Giá Over Time',
      accessor: 'PriceOverTime',
      width: 200,
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
  ];

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
                          Thêm Mới Xe Du Lịch
                        </span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      <button
                        className="btn btn-success btn-sm float-right btn-header"
                        onClick={() => {
                          ConfirmAlert("Xác nhận", "Bạn có muốn lưu không?", () => {
                            Trl_spOperating_Vehicle_Save();
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
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Sao Nhà Xe
                        </span>
                        <div class="input-group">
                          <Select className="SelectMeno"
                          value={StarList}
                          onChange={onSelecteVehicleStar}
                          options={ListStar}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Tên Nhà Xe
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={VehicleName} onChange={e => setVehicleName(e.target.value)}
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
                          value={VehicleAddress} onChange={e => setVehicleAddress(e.target.value)}
                        />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto" style={{paddingBottom:"35px"}}>
                      <span className='small font-weight-bold text-muted'>Khu Vực</span>
                        <div class="input-group">
                          <div class="col-sm-6 col-md-6" style={{marginLeft:"-10px"}}>
                            <div class="icheck-success d-inline">
                              <input type="checkbox" id="checkboxDT" checked={Downtown} onChange={e => onClickDT(e.target.checked)} />
                              <label class="label checkbox" htmlFor="checkboxDT">Trung Tâm</label>
                            </div>
                          </div>
                          <div class="col-sm-6 col-md-6" style={{marginLeft:"35px"}}>
                            <div class="icheck-success d-inline">
                              <input type="checkbox" id="checkboxSB" checked={Suburban} onChange={e => onClickSB(e.target.checked)} />
                              <label class="label checkbox" htmlFor="checkboxSB">Ngoại Ô</label>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Thương Hiệu
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={Brand} onChange={e => setBrand(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Tài Xế
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={Driver} onChange={e => setDriver(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Mức Giá/Ngày
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={FormatMoney(+Price?.Price1 || 0)} 
                          onChange={e => setPrice({
                            ...Price,
                            Price1: FormatMoney(e.target.value, 1),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Phí Over Time
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={FormatMoney(+PriceOverTime?.Price2 || 0)}
                          onChange={(e) =>
                            setPriceOverTime({
                              ...PriceOverTime,
                              Price2: FormatMoney(e.target.value, 1),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-8 col-md-8 m-auto">
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
                    <div className="col-xs-12 col-sm-4 col-md-4 m-auto">
                      <div class="input-group">
                        <div class="col-sm-3 col-md-3" style={{marginLeft:"-10px"}}>
                          <div class="icheck-success d-inline">
                            <input type="checkbox" id="checkbox16C" checked={TypeVehicle16C} onChange={e => onClick16C(e.target.checked)} />
                            <label class="label checkbox" htmlFor="checkbox16C">16C</label>
                          </div>
                        </div>
                        <div class="col-sm-3 col-md-3" style={{marginLeft:"10px"}}>
                          <div class="icheck-success d-inline">
                            <input type="checkbox" id="checkbox29C" checked={TypeVehicle29C} onChange={e => onClick29C(e.target.checked)} />
                            <label class="label checkbox" htmlFor="checkbox29C">29C</label>
                          </div>
                        </div>
                        <div class="col-sm-3 col-md-3" style={{marginLeft:"15px"}}>
                          <div class="icheck-success d-inline">
                            <input type="checkbox" id="checkbox35C" checked={TypeVehicle35C} onChange={e => onClick35C(e.target.checked)} />
                            <label class="label checkbox" htmlFor="checkbox35C">35C</label>
                          </div>
                        </div>
                        <div class="col-sm-3 col-md-3" style={{marginLeft:"10px"}}>
                          <div class="icheck-success d-inline">
                            <input type="checkbox" id="checkbox45C" checked={TypeVehicle45C} onChange={e => onClick45C(e.target.checked)} />
                            <label class="label checkbox" htmlFor="checkbox45C">45C</label>
                          </div>
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
};

import React, { useEffect, useState } from "react";
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
} from "../../../../Utils";
import "react-confirm-alert/src/react-confirm-alert.css";

export const HotelData = () => {
  useEffect(() => {
    Trl_spOperating_Hotel_List();
  }, []);

  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const dispatch = useDispatch();

  const [HotelId, setHotelId] = useState(0);
  const [HotelName, setHotelName] = useState("");
  const [HotelAddress, setHotelAddress] = useState("");
  const [Downtown, setDowntown] = useState(0);
  const [Suburban, setSuburban] = useState(0);
  const [HotelStar, setHotelStar] = useState("");
  const [Continent, setContinent] = useState(0);
  const [Country, setCountry] = useState(0);
  const [Area, setArea] = useState(0);
  const [Notes, setNotes] = useState("");
  const [RoomDBL, setRoomDBL] = useState(0);
  const [RoomTWN, setRoomTWN] = useState(0);
  const [RoomTPL, setRoomTPL] = useState(0);
  const [BuffetFIT, setBuffetFIT] = useState(0);
  const [BuffetGIT, setBuffetGIT] = useState(0);
  const [Website, setWebsite] = useState("");
  const [HotelEvaluate, setHotelEvaluate] = useState("");
  const [DataTableList, setDataTableList] = useState([]);

  const ClearFrom = () => {
    setHotelId(0);
    setHotelName("");
    setHotelAddress("");
    setHotelStar("");
    setStarList({ value: 0, label: "Vui Lòng Chọn Số Sao" });
    setHotelEvaluate("");
    setEvaluateList({ value: 0, label: "Vui Lòng Chọn Đánh Giá" });
    setDowntown(0);
    setSuburban(0);
    setRoomDBL(0);
    setRoomTPL(0);
    setRoomTWN(0);
    setBuffetFIT(0);
    setBuffetGIT(0);
    setWebsite("");
    setContinent(0);
    setCountry(0);
    setArea(0);
    setNotes("");
  };

  const [StarList, setStarList] = useState({
    value: 0,
    label: "Vui Lòng Chọn Số Sao",
  });
  const ListStar = [
    { value: 1, label: "3*" },
    { value: 2, label: "3*+" },
    { value: 3, label: "4*" },
    { value: 4, label: "4*+" },
    { value: 5, label: "5*" },
    { value: 6, label: "5*+" },
  ];

  const [EvaluateList, setEvaluateList] = useState({
    value: 0,
    label: "Vui Lòng Chọn Đánh Giá",
  });
  const ListEvaluate = [
    { value: 1, label: "A++" },
    { value: 2, label: "A+" },
    { value: 3, label: "A" },
    { value: 4, label: "B++" },
    { value: 5, label: "B+" },
  ];

  const onClickDT = (e) => {
    if (e === true) {
      setDowntown(1);
      setSuburban(0);
    }
  };

  const onClickSB = (e) => {
    if (e === true) {
      setDowntown(0);
      setSuburban(1);
    }
  };

  const onClickDBL = (e) => {
    setRoomDBL(e === true ? 1 : 0);
  };

  const onClickTWN = (e) => {
    setRoomTWN(e === true ? 1 : 0);
  };

  const onClickTPL = (e) => {
    setRoomTPL(e === true ? 1 : 0);
  };

  const onClickFIT = (e) => {
    if (e === true) {
      setBuffetFIT(1);
      setBuffetGIT(0);
    }
  };

  const onClickGIT = (e) => {
    if (e === true) {
      setBuffetFIT(0);
      setBuffetGIT(1);
    }
  };

  const onSelecteEvaluateHotel = (e) => {
    setEvaluateList({ value: e.value, label: e.label });
    setHotelEvaluate(e.label);
  };

  const onSelecteStarHotel = (e) => {
    setStarList({ value: e.value, label: e.label });
    setHotelStar(e.label);
  };

  const onSelectContinent = (e) => {
    setContinent(e.value);
  };

  const onSelectCountry = (e) => {
    setCountry(e.value);
  };

  const onSelectCity = (e) => {
    setArea(e.value);
  };

  const Trl_spOperating_Hotel_Save = async () => {
    try {
      if (Continent === 0 || Continent === -1) {
        Alertwarning("Vui Lòng Chọn Châu Lục!");
        return;
      }
      if (Country === 0 || Country === -1) {
        Alertwarning("Vui Lòng Chọn Nước!");
        return;
      }
      if (Area === 0 || Area === -1) {
        Alertwarning("Vui Lòng Chọn Khu Vực!");
        return;
      }
      const pr = {
        HotelId: HotelId,
        HotelName: HotelName,
        HotelAddress: HotelAddress,
        Downtown: Downtown,
        Suburban: Suburban,
        HotelStar: HotelStar,
        RoomDBL: RoomDBL,
        RoomTWN: RoomTWN,
        RoomTPL: RoomTPL,
        Note: Notes,
        BuffetFIT: BuffetFIT,
        BuffetGIT: BuffetGIT,
        Website: Website,
        Continent: Continent,
        Country: Country,
        Area: Area,
        Creater: parseInt(Creater),
        HotelReviews: HotelEvaluate,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_Hotel_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spOperating_Hotel_List();
        ClearFrom();
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spOperating_Hotel_List = async () => {
    try {
      const pr = {
        Officer: parseInt(Creater),
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_Hotel_List",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length != 0) {
        setDataTableList(result);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Edit = (e) => {
    let Ojb = e.row.original;
    document.querySelector("#tab_1").click();
    setHotelId(Ojb.HotelId);
    setHotelName(Ojb.HotelName);
    setHotelAddress(Ojb.HotelAddress);
    setDowntown(Ojb.Downtown === true ? 1 : 0);
    setSuburban(Ojb.Suburban === true ? 1 : 0);
    const x = ListStar.find((x) => x.label == Ojb.HotelStar);
    setStarList(x);
    setHotelStar(Ojb.HotelStar);
    const y = ListEvaluate.find((y) => y.label == Ojb.HotelReviews);
    setEvaluateList(y);
    setHotelEvaluate(Ojb.HotelReviews);
    setRoomDBL(Ojb.RoomDBL === true ? 1 : 0);
    setRoomTWN(Ojb.RoomTWN === true ? 1 : 0);
    setRoomTPL(Ojb.RoomTPL === true ? 1 : 0);
    setBuffetFIT(Ojb.BuffetFIT === true ? 1 : 0);
    setBuffetGIT(Ojb.BuffetGIT === true ? 1 : 0);
    setWebsite(Ojb.Website);
    setContinent(Ojb.Continent);
    setCountry(Ojb.Country);
    setArea(Ojb.Area);
    setNotes(Ojb.Note);
  };

  const Delete = async (e) => {
    let Ojb = e.row._original;
    try {
      const pr = {
        HotelId: Ojb.HotelId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_Hotel_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        const newArr = [...DataTableList];
        setDataTableList(newArr.filter((item) => item.HotelId !== Ojb.HotelId));
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

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
      accessor: "[row identifier to be passed to button]",
      width: 150,
      filterable: false,
      sortable: false,
      Cell: (row) => (
        <div>
          <span>
            <button
              className="btn btn-sm btn-success"
              onClick={(e) => Edit({ row })}
            >
              <i class="fa fa-eye"></i> Sửa
            </button>
            |
            <button
              className="btn btn-sm btn-danger"
              onClick={(e) => {
                ConfirmAlert("Xác nhận", "Bạn có muốn lưu không?", () => {
                  Delete(row);
                });
              }}
            >
              <i class="fas fa-eraser"></i> Xóa
            </button>
          </span>
        </div>
      ),
    },
    {
      Header: "Châu Lục",
      accessor: "ContinentName",
      width: 100,
    },
    {
      Header: "Nước",
      accessor: "CountryName",
      width: 100,
    },
    {
      Header: "Thành Phố",
      accessor: "AreaName",
      width: 150,
    },
    {
      Header: "Tên Khách Sạn",
      accessor: "HotelName",
      width: 300,
    },
    {
      Header: "Sao",
      accessor: "HotelStar",
      width: 50,
    },
    {
      Header: "Đánh Giá",
      accessor: "HotelReviews",
      width: 50,
    },
    {
      Header: "FIT",
      accessor: "BuffetFIT",
      width: 50,
      Cell: ({ row }) => (
        <span>
          {row._original.BuffetFIT === true ? (
            <span>
              <i class="fas fa-check"></i>
            </span>
          ) : (
            ""
          )}
        </span>
      ),
    },
    {
      Header: "GIT",
      accessor: "BuffetGIT",
      width: 50,
      Cell: ({ row }) => (
        <span>
          {row._original.BuffetGIT === true ? (
            <span>
              <i class="fas fa-check"></i>
            </span>
          ) : (
            ""
          )}
        </span>
      ),
    },
    {
      Header: "Trung Tâm",
      accessor: "Downtown",
      width: 50,
      Cell: ({ row }) => (
        <span>
          {row._original.Downtown === true ? (
            <span>
              <i class="fas fa-check"></i>
            </span>
          ) : (
            ""
          )}
        </span>
      ),
    },
    {
      Header: "Ngoại Ô",
      accessor: "Suburban",
      width: 50,
      Cell: ({ row }) => (
        <span>
          {row._original.Suburban === true ? (
            <span>
              <i class="fas fa-check"></i>
            </span>
          ) : (
            ""
          )}
        </span>
      ),
    },
    {
      Header: "Ghi Chú",
      accessor: "Note",
      width: 450,
    },
    {
      Header: "DBL",
      accessor: "RoomDBL",
      width: 50,
      Cell: ({ row }) => (
        <span>
          {row._original.RoomDBL === true ? (
            <span>
              <i class="fas fa-check"></i>
            </span>
          ) : (
            ""
          )}
        </span>
      ),
    },
    {
      Header: "TWN",
      accessor: "RoomTWN",
      width: 50,
      Cell: ({ row }) => (
        <span>
          {row._original.RoomTWN === true ? (
            <span>
              <i class="fas fa-check"></i>
            </span>
          ) : (
            ""
          )}
        </span>
      ),
    },
    {
      Header: "TPL",
      accessor: "RoomTPL",
      width: 50,
      Cell: ({ row }) => (
        <span>
          {row._original.RoomTPL === true ? (
            <span>
              <i class="fas fa-check"></i>
            </span>
          ) : (
            ""
          )}
        </span>
      ),
    },
    {
      Header: "Địa Chỉ",
      accessor: "HotelAddress",
      width: 450,
    },
    {
      Header: "Website",
      accessor: "Website",
      width: 450,
    },
    {
      Header: "Người Tạo",
      accessor: "CreateName",
      width: 250,
    },
    {
      Header: "Thời Gian Tạo",
      accessor: "CreateTime",
      width: 200,
      Cell: ({ row }) => (
        <span>{FormatDateJson(row._original.CreateTime, 10)}</span>
      ),
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
                        <span className="font-weight-bold">Thêm Mới Hotel</span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      <button
                        className="btn btn-success btn-sm float-right btn-header"
                        onClick={() => {
                          ConfirmAlert(
                            "Xác nhận",
                            "Bạn có muốn lưu không?",
                            () => {
                              Trl_spOperating_Hotel_Save();
                            }
                          );
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
                          <SelectContinent
                            className="SelectMeno"
                            onSelected={(e) => {
                              onSelectContinent(e);
                            }}
                            LocationId={Continent}
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
                          <SelectCountry
                            className="SelectMeno"
                            onSelected={(e) => {
                              onSelectCountry(e);
                            }}
                            ContinentId={Continent}
                            LocationId={Country}
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
                          <SelectCity
                            className="SelectMeno"
                            onSelected={(e) => {
                              onSelectCity(e);
                            }}
                            CountryId={Country}
                            LocationId={Area}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Tên Khách Sạn
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={HotelName}
                          onChange={(e) => setHotelName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Sao KS
                        </span>
                        <div class="input-group" style={{ zIndex: "100" }}>
                          <Select
                            className="SelectMeno"
                            value={StarList}
                            onChange={onSelecteStarHotel}
                            options={ListStar}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Đánh Giá
                        </span>
                        <div class="input-group">
                          <Select
                            className="SelectMeno"
                            value={EvaluateList}
                            onChange={onSelecteEvaluateHotel}
                            options={ListEvaluate}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <span className="small font-weight-bold text-muted">
                        Buffet
                      </span>
                      <div class="input-group" style={{ marginBottom: "20px" }}>
                        <div
                          class="col-sm-6 col-md-6 center-item"
                          style={{ marginLeft: "-45px" }}
                        >
                          <div class="icheck-success d-inline">
                            <input
                              type="checkbox"
                              id="checkboxFIT"
                              checked={BuffetFIT}
                              onChange={(e) => onClickFIT(e.target.checked)}
                            />
                            <label class="label checkbox" htmlFor="checkboxFIT">
                              FIT
                            </label>
                          </div>
                        </div>
                        <div
                          class="col-sm-6 col-md-6 center-item"
                          style={{ marginLeft: "40px" }}
                        >
                          <div class="icheck-success d-inline">
                            <input
                              type="checkbox"
                              id="checkboxGIT"
                              checked={BuffetGIT}
                              onChange={(e) => onClickGIT(e.target.checked)}
                            />
                            <label class="label checkbox" htmlFor="checkboxGIT">
                              GIT
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <span className="small font-weight-bold text-muted">
                        Khu Vực
                      </span>
                      <div class="input-group" style={{ marginBottom: "20px" }}>
                        <div
                          class="col-sm-6 col-md-6"
                          style={{ marginLeft: "-10px" }}
                        >
                          <div class="icheck-success d-inline">
                            <input
                              type="checkbox"
                              id="checkboxDT"
                              checked={Downtown}
                              onChange={(e) => onClickDT(e.target.checked)}
                            />
                            <label class="label checkbox" htmlFor="checkboxDT">
                              Trung Tâm
                            </label>
                          </div>
                        </div>
                        <div
                          class="col-sm-6 col-md-6"
                          style={{ marginLeft: "35px" }}
                        >
                          <div class="icheck-success d-inline">
                            <input
                              type="checkbox"
                              id="checkboxSB"
                              checked={Suburban}
                              onChange={(e) => onClickSB(e.target.checked)}
                            />
                            <label class="label checkbox" htmlFor="checkboxSB">
                              Ngoại Ô
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-9 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Ghi Chú
                        </span>
                        <div class="input-group">
                          <textarea
                            type="text"
                            class="form-control2"
                            value={Notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <span className="small font-weight-bold text-muted">
                        Loại Phòng
                      </span>
                      <div class="input-group" style={{ marginBottom: "10px" }}>
                        <div
                          class="col-sm-4 col-md-4"
                          style={{ marginLeft: "-10px" }}
                        >
                          <div class="icheck-success d-inline">
                            <input
                              type="checkbox"
                              id="checkboxDBL"
                              checked={RoomDBL}
                              onChange={(e) => onClickDBL(e.target.checked)}
                            />
                            <label class="label checkbox" htmlFor="checkboxDBL">
                              DBL
                            </label>
                          </div>
                        </div>
                        <div class="col-sm-4 col-md-4">
                          <div class="icheck-success d-inline">
                            <input
                              type="checkbox"
                              id="checkboxTWN"
                              checked={RoomTWN}
                              onChange={(e) => onClickTWN(e.target.checked)}
                            />
                            <label class="label checkbox" htmlFor="checkboxTWN">
                              TWN
                            </label>
                          </div>
                        </div>
                        <div
                          class="col-sm-4 col-md-4"
                          style={{ marginLeft: "10px" }}
                        >
                          <div class="icheck-success d-inline">
                            <input
                              type="checkbox"
                              id="checkboxTPL"
                              checked={RoomTPL}
                              onChange={(e) => onClickTPL(e.target.checked)}
                            />
                            <label class="label checkbox" htmlFor="checkboxTPL">
                              TPL
                            </label>
                          </div>
                        </div>
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
                            value={HotelAddress}
                            onChange={(e) => setHotelAddress(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Website
                        </span>
                        <div class="input-group">
                          <input
                            type="text"
                            class="form-control2"
                            value={Website}
                            onChange={(e) => setWebsite(e.target.value)}
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
                      <DataTable data={DataTableList} columns={columns} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

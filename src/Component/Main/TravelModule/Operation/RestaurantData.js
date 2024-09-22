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
  FormatMoney,
} from "../../../../Utils";
import { IMAGES_DOMAIN } from "../../../../Services";
import "react-confirm-alert/src/react-confirm-alert.css";
import Modal from "react-bootstrap/Modal";
import $ from "jquery";

import { Label } from "reactstrap";

export const RestaurantData = () => {
  useEffect(() => {
    Trl_spOperating_Restaurant_List();
  }, []);

  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const dispatch = useDispatch();

  const [RestaurantId, setRestaurantId] = useState(0);
  const [RestaurantName, setRestaurantName] = useState("");
  const [RestaurantAddress, setRestaurantAddress] = useState("");
  const [Downtown, setDowntown] = useState(0);
  const [Suburban, setSuburban] = useState(0);
  const [RestaurantStar, setRestaurantStar] = useState("");
  const [Continent, setContinent] = useState(0);
  const [Country, setCountry] = useState(0);
  const [Area, setArea] = useState(0);
  const [Notes, setNotes] = useState("");
  const [Breakfast, setBreakfast] = useState(0);
  const [Lunch, setLunch] = useState(0);
  const [Dinner, setDinner] = useState(0);
  const [Specialized, setSpecialized] = useState("");
  const [Menu, setMenu] = useState("");
  const [Price, setPrice] = useState("");
  const [WedSite, setWedSite] = useState("");
  const [RestaurantEvaluate, setRestaurantEvaluate] = useState("");
  const [DataTableList, setDataTableList] = useState([]);

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

  const onSelecteStarRestaurant = (e) => {
    setStarList({ value: e.value, label: e.label });
    setRestaurantStar(e.label);
  };

  const onSelecteEvaluateRestaurant = (e) => {
    setEvaluateList({ value: e.value, label: e.label });
    setRestaurantEvaluate(e.label);
  };

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

  const onClickBreakfast = (e) => {
    setBreakfast(e === true ? 1 : 0);
  };

  const onClickLunch = (e) => {
    setLunch(e === true ? 1 : 0);
  };

  const onClickDinner = (e) => {
    setDinner(e === true ? 1 : 0);
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

  const Trl_spOperating_Restaurant_Save = async () => {
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
        RestaurantId: RestaurantId,
        RestaurantName: RestaurantName,
        RestaurantAddress: RestaurantAddress,
        Downtown: Downtown,
        Suburban: Suburban,
        RestaurantStar: RestaurantStar,
        RestaurantReviews: RestaurantEvaluate,
        Breakfast: Breakfast,
        Lunch: Lunch,
        Dinner: Dinner,
        Note: Notes,
        Specialized: Specialized,
        Menu: Menu.replaceAll(/\r?\n/g, ";"),
        Price: +Price?.Price1 || 0,
        WedSite: WedSite,
        Continent: Continent,
        Country: Country,
        Area: Area,
        Creater: parseInt(Creater),
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_Restaurant_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spOperating_Restaurant_List();
        ClearFrom();
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spOperating_Restaurant_List = async () => {
    try {
      const pr = {
        Officer: parseInt(Creater),
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_Restaurant_List",
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
    let Ojb = e.row.original,
      MenuPR = e.row.original.Menu.replaceAll(";", "\n");
    document.querySelector("#tab_1").click();
    setRestaurantId(Ojb.RestaurantId);
    setRestaurantName(Ojb.RestaurantName);
    setRestaurantAddress(Ojb.RestaurantAddress);
    setDowntown(Ojb.Downtown === true ? 1 : 0);
    setSuburban(Ojb.Suburban === true ? 1 : 0);
    const x = ListStar.find((x) => x.label == Ojb.RestaurantStar);
    setStarList(x);
    setRestaurantStar(Ojb.RestaurantStar);
    const y = ListEvaluate.find((y) => y.label == Ojb.RestaurantReviews);
    setEvaluateList(y);
    setRestaurantEvaluate(Ojb.RestaurantReviews);
    setBreakfast(Ojb.Breakfast === true ? 1 : 0);
    setLunch(Ojb.Lunch === true ? 1 : 0);
    setDinner(Ojb.Dinner === true ? 1 : 0);
    setSpecialized(Ojb.Specialized);
    setPrice({ ...Price, Price1: FormatMoney(Ojb.Price, 1) });
    setMenu(MenuPR);
    setContinent(Ojb.Continent);
    setCountry(Ojb.Country);
    setArea(Ojb.Area);
    setNotes(Ojb.Note);
    setWedSite(Ojb.WedSite);
  };

  const Delete = async (e) => {
    let Ojb = e.row._original;
    try {
      const pr = {
        RestaurantId: Ojb.RestaurantId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_Restaurant_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        const newArr = [...DataTableList];
        setDataTableList(
          newArr.filter((item) => item.RestaurantId !== Ojb.RestaurantId)
        );
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const ClearFrom = () => {
    setRestaurantId(0);
    setRestaurantName("");
    setRestaurantAddress("");
    setRestaurantStar("");
    setStarList({ value: 0, label: "Vui Lòng Chọn Số Sao" });
    setRestaurantEvaluate("");
    setEvaluateList({ value: 0, label: "Vui Lòng Chọn Đánh Giá" });
    setDowntown(0);
    setSuburban(0);
    setBreakfast(0);
    setLunch(0);
    setDinner(0);
    setSpecialized("");
    setMenu("");
    setPrice("");
    setContinent(0);
    setCountry(0);
    setArea(0);
    setNotes("");
    setWedSite("");
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
      minWidth: 100,
    },
    {
      Header: "Nước",
      accessor: "CountryName",
      minWidth: 100,
    },
    {
      Header: "Thành Phố",
      accessor: "AreaName",
      minWidth: 150,
    },
    {
      Header: "Tên Nhà Hàng",
      accessor: "RestaurantName",
      minWidth: 200,
    },
    {
      Header: "Đánh Giá",
      accessor: "RestaurantReviews",
      minWidth: 100,
    },
    {
      Header: "Sao",
      accessor: "RestaurantStar",
      minWidth: 50,
    },
    {
      Header: "Món",
      accessor: "Specialized",
      minWidth: 200,
    },
    {
      Header: "Thực Đơn",
      accessor: "Menu",
      minWidth: 250,
    },
    {
      Header: "Mức Giá",
      accessor: "Price",
      minWidth: 80,
    },
    {
      Header: "Sáng",
      accessor: "Breakfast",
      minWidth: 80,
      Cell: ({ row }) => (
        <span>
          {row._original.Breakfast === true ? (
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
      Header: "Trưa",
      accessor: "Lunch",
      minWidth: 80,
      Cell: ({ row }) => (
        <span>
          {row._original.Lunch === true ? (
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
      Header: "Tối",
      accessor: "Dinner",
      minWidth: 80,
      Cell: ({ row }) => (
        <span>
          {row._original.Dinner === true ? (
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
      Header: "WedSite",
      accessor: "WedSite",
      minWidth: 200,
    },
    {
      Header: "Địa Chỉ",
      accessor: "RestaurantAddress",
      minWidth: 250,
    },
    {
      Header: "Trung Tâm",
      accessor: "Downtown",
      minWidth: 80,
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
      minWidth: 80,
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
      Header: "Người Tạo",
      accessor: "CreateName",
      minWidth: 150,
    },
    {
      Header: "Thời Gian Tạo",
      accessor: "CreateTime",
      minWidth: 200,
      Cell: ({ row }) => (
        <span>{FormatDateJson(row._original.CreateTime, 10)}</span>
      ),
    },
    {
      Header: "Ghi Chú",
      accessor: "Note",
      minWidth: 500,
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
                          Thêm Mới Nhà Hàng
                        </span>
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
                              Trl_spOperating_Restaurant_Save();
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
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Tên Nhà Hàng
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={RestaurantName}
                          onChange={(e) => setRestaurantName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Sao
                        </span>
                        <div class="input-group">
                          <Select
                            className="SelectMeno z-date"
                            value={StarList}
                            onChange={onSelecteStarRestaurant}
                            options={ListStar}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 ">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Đánh Giá
                        </span>
                        <div class="input-group">
                          <Select
                            className="SelectMeno"
                            value={EvaluateList}
                            onChange={onSelecteEvaluateRestaurant}
                            options={ListEvaluate}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Món
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={Specialized}
                          onChange={(e) => setSpecialized(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Mức Giá
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={FormatMoney(+Price?.Price1 || 0)}
                          onChange={(e) =>
                            setPrice({
                              ...Price,
                              Price1: FormatMoney(e.target.value, 1),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Thực Đơn
                        </span>
                        <textarea
                          type="text"
                          class="form-control2"
                          style={{ height: "37px" }}
                          value={Menu}
                          onChange={(e) => setMenu(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-xs-12 col-sm-6 col-md-6 ">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Lưu Ý
                        </span>
                        <div class="input-group">
                          <input
                            type="text"
                            class="form-control2"
                            value={Notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 ">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          WedSite
                        </span>
                        <div class="input-group">
                          <input
                            type="text"
                            class="form-control2"
                            value={WedSite}
                            onChange={(e) => setWedSite(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span className="small font-weight-bold text-muted">
                          Khu Vực
                        </span>
                        <div class="input-group d-flex justify-content-around">
                          <div class="icheck-success d-inline">
                            <input
                              type="checkbox"
                              id="checkboxDT"
                              checked={Downtown}
                              onChange={(e) => onClickDT(e.target.checked)}
                            />
                            <label
                              class="label checkbox font-weight-bold"
                              htmlFor="checkboxDT"
                            >
                              Trung Tâm
                            </label>
                          </div>
                          <div class="icheck-success d-inline">
                            <input
                              type="checkbox"
                              id="checkboxSB"
                              checked={Suburban}
                              onChange={(e) => onClickSB(e.target.checked)}
                            />
                            <label
                              class="label checkbox font-weight-bold"
                              htmlFor="checkboxSB"
                            >
                              Ngoại Ô
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3  ">
                      <div class="form-group">
                        <span className="small font-weight-bold text-muted opacity-0">
                          Bữa ăn
                        </span>
                        <div class="input-group d-flex justify-content-around">
                          <div class="icheck-success d-inline">
                            <input
                              type="checkbox"
                              id="checkboxBreakfast"
                              checked={Breakfast}
                              onChange={(e) =>
                                onClickBreakfast(e.target.checked)
                              }
                            />
                            <label
                              class="label checkbox"
                              htmlFor="checkboxBreakfast"
                            >
                              Sáng
                            </label>
                          </div>
                          <div class="icheck-success d-inline">
                            <input
                              type="checkbox"
                              id="checkboxLunch"
                              checked={Lunch}
                              onChange={(e) => onClickLunch(e.target.checked)}
                            />
                            <label
                              class="label checkbox"
                              htmlFor="checkboxLunch"
                            >
                              Trưa
                            </label>
                          </div>
                          <div class="icheck-success d-inline">
                            <input
                              type="checkbox"
                              id="checkboxDinner"
                              checked={Dinner}
                              onChange={(e) => onClickDinner(e.target.checked)}
                            />
                            <label
                              class="label checkbox"
                              htmlFor="checkboxDinner"
                            >
                              Tối
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Địa Chỉ
                        </span>
                        <div class="input-group">
                          <input
                            type="text"
                            class="form-control2"
                            value={RestaurantAddress}
                            onChange={(e) =>
                              setRestaurantAddress(e.target.value)
                            }
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

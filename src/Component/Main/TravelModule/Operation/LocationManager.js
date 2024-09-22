import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertsuccess,
  Alerterror,
  FormatDateJson,
  ConfirmAlert,
  Alertwarning,
} from "../../../../Utils";
import { DataTable, SelectContinent, SelectCountry } from "../../../../Common";
import "react-confirm-alert/src/react-confirm-alert.css";
import Modal from "react-bootstrap/Modal";


export const LocationManager = () => {
  const dispatch = useDispatch();
  const Creater = +localStorage.getItem("CreateBy");
  const [dataContinent, setDataContinent] = useState([]);
  const [dataCountry, setDataCountry] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [country, setCountry] = useState({});
  const [continent, setContinent] = useState({});
  const [city, setCity] = useState({});
  const [level, setLevel] = useState(1);
  const [continentId, setContinetId] = useState(0);
  const [countryId, setCountryId] = useState(0);
  const [showModalCountry, setshowModalCountry] = useState();
  const [showModalCity, setShowModalCity] = useState(false);

  const Trl_spLocation_List = async (level = 1) => {
    try {
      const params = {
        Json: JSON.stringify({
          Level: level,
          ParentId: 0,
        }),
        func: "Trl_spLocation_List",
      };

      const respone = await mainAction.API_spCallServer(params, dispatch);
      if (respone.length > 0) {
        if (level === 1) {
          setDataContinent(respone);
        } else if (level === 2) {
          setDataCountry(respone);
        } else {
          setDataCity(respone);
        }
      }
    } catch (error) {
      Alerterror("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
      ;
    }
  };

  const Trl_spLocation_Save = async (level = 1) => {
    let pr = {};
    if (level === 1) {
      if (
        continent.LocationCode === "" ||
        continent.LocationName === "" ||
        continent.LocationCode === undefined ||
        continent.LocationName === undefined
      ) {
        Alertwarning("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
      pr = {
        LocationCode: continent.LocationCode,
        LocationName: continent.LocationName,
        Level: level,
        ParentId: 0,
        Creater: +Creater,
        LocationId: continent?.LocationId || 0,
      };
    }
    if (level === 2) {
      if (continentId === 0) {
        Alertwarning("Vui lòng chọn châu lục!");
        return;
      }
      if (
        country.LocationCode === "" ||
        country.LocationName === "" ||
        country.LocationCode === undefined ||
        country.LocationName === undefined
      ) {
        Alertwarning("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
      pr = {
        LocationCode: country.LocationCode,
        LocationName: country.LocationName,
        Level: level,
        ParentId: continentId,
        Creater: +Creater,
        LocationId: country?.LocationId || 0,
      };
    }
    if (level === 3) {
      if (countryId === 0) {
        Alertwarning("Vui lòng chọn quốc gia!");
        return;
      }
      if (
        city.LocationCode === "" ||
        city.LocationName === "" ||
        city.LocationCode === undefined ||
        city.LocationName === undefined
      ) {
        Alertwarning("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
      pr = {
        LocationCode: city.LocationCode,
        LocationName: city.LocationName,
        Level: level,
        ParentId: countryId,
        Creater: +Creater,
        LocationId: city?.LocationId || 0,
      };
    }

    try {
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spLocation_Save",
      };
      const respone = await mainAction.API_spCallServer(params, dispatch);
      if (respone.Status === "OK") {
        Alertsuccess("Lưu thành công!");
        Trl_spLocation_List(level);
        handleCancelForm();
      } else {
        Alerterror(respone.Message);
      }
    } catch (error) {
      Alerterror("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
      ;
    }
  };

  const Trl_spLocation_Delete = async (level, Id) => {
    let id = Id._original.LocationId;
    try {
      const params = {
        Json: JSON.stringify({
          LocationId: id,
        }),
        func: "Trl_spLocation_Delete",
      };

      const respone = await mainAction.API_spCallServer(params, dispatch);
      if (respone.Status === "OK") {
        Alertsuccess("Xóa thành công!");
        Trl_spLocation_List(level);
      } else {
        Alerterror(respone.Message);
      }
    } catch (error) {
      Alerterror("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
      ;
    }
  };

  const handleEdit = (level, obj) => {
    if (level === 1) {
      setContinent(obj);
      setShowModalAdd(true);
    } else if (level === 2) {
      setCountry(obj);
      setContinetId(obj.ParentId);
      setshowModalCountry(true);
    } else {
      setCity(obj);
      setCountryId(obj.ParentId);
      setContinetId(obj.ParentIdMain);
      setShowModalCity(true);
    }
  };

  const handleCancelForm = () => {
    setContinent({});
    setCountry({});
    setCity({});
    setShowModalAdd(false);
    setshowModalCountry(false);
    setShowModalCity(false);
    setContinetId(0);
    setCountryId(0);
  };

  const handleOpenModalAdd = (level) => {
    setLevel(level);
    if (level === 1) {
      setShowModalAdd(true);
    }
    if (level === 2) {
      setshowModalCountry(true);
    }
    if (level === 3) {
      setShowModalCity(true);
    }
  };

  const columnsContinent = [
    {
      Header: "Lựa chọn",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-xs btn-success"
            onClick={() => handleEdit(1, row._original)}
          >
            {" "}
            <i class="fa fa-eye"></i> Sửa
          </button>{" "}
          <button
            className="btn btn-xs btn-danger pr-2"
            onClick={() =>
              ConfirmAlert("Xác nhận", "Bạn có chắc muốn xoá không?", () => {
                Trl_spLocation_Delete(1, row);
              })
            }
          >
            {" "}
            <i class="fa fa-trash"></i> Xóa
          </button>{" "}
        </div>
      ),
      width: 130,
      textAlign: "center",
    },
    {
      Header: "Mã châu lục",
      accessor: "LocationCode",
      minWidth: 200,
      textAlign: "center",
    },
    {
      Header: "Tên châu lục",
      accessor: "LocationName",
      minWidth: 200,
      textAlign: "center",
    },
    {
      Header: "Người tạo",
      accessor: "CreateName",
      minWidth: 200,
      textAlign: "center",
    },
    {
      Header: "Thời gian",
      accessor: "CreateTime",
      Cell: (obj) => (obj?.value ? FormatDateJson(obj.value) : ""),
      minWidth: 200,
      textAlign: "center",
    },
  ];

  const columnsCountry = [
    {
      Header: "Lựa chọn",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-xs btn-success"
            onClick={() => handleEdit(2, row._original)}
          >
            {" "}
            <i class="fa fa-eye"></i> Sửa
          </button>{" "}
          <button
            className="btn btn-xs btn-danger pr-2"
            onClick={() =>
              ConfirmAlert("Xác nhận", "Bạn có chắc muốn xoá không?", () => {
                Trl_spLocation_Delete(2, row);
              })
            }
          >
            {" "}
            <i class="fa fa-trash"></i> Xóa
          </button>{" "}
        </div>
      ),
      width: 130,
      textAlign: "center",
    },
    {
      Header: "Châu lục",
      accessor: "ParentName",
      minWidth: 200,
      textAlign: "center",
    },
    {
      Header: "Mã quốc gia",
      accessor: "LocationCode",
      minWidth: 200,
      textAlign: "center",
    },
    {
      Header: "Tên quốc gia",
      accessor: "LocationName",
      minWidth: 200,
      textAlign: "center",
    },
    {
      Header: "Người tạo",
      accessor: "CreateName",
      minWidth: 200,
      textAlign: "center",
    },
    {
      Header: "Thời gian",
      accessor: "CreateTime",
      Cell: (obj) => (obj?.value ? FormatDateJson(obj.value) : ""),
      minWidth: 200,
      textAlign: "center",
    },
  ];

  const columnsCity = [
    {
      Header: "Lựa chọn",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-xs btn-success"
            onClick={() => handleEdit(3, row._original)}
          >
            {" "}
            <i class="fa fa-eye"></i> Sửa
          </button>{" "}
          <button
            className="btn btn-xs btn-danger pr-2"
            onClick={() =>
              ConfirmAlert("Xác nhận", "Bạn có chắc muốn xoá không?", () => {
                Trl_spLocation_Delete(3, row);
              })
            }
          >
            {" "}
            <i class="fa fa-trash"></i> Xóa
          </button>{" "}
        </div>
      ),
      width: 130,
      textAlign: "center",
    },
    {
      Header: "Quốc gia",
      accessor: "ParentName",
      minWidth: 200,
      textAlign: "center",
    },
    {
      Header: "Mã Thành phố",
      accessor: "LocationCode",
      minWidth: 200,
      textAlign: "center",
    },
    {
      Header: "Tên Thành phố",
      accessor: "LocationName",
      minWidth: 200,
      textAlign: "center",
    },
    {
      Header: "Người tạo",
      accessor: "CreateName",
      minWidth: 200,
      textAlign: "center",
    },
    {
      Header: "Thời gian",
      accessor: "CreateTime",
      Cell: (obj) => (obj?.value ? FormatDateJson(obj.value) : ""),
      minWidth: 200,
      textAlign: "center",
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
                CHÂU LỤC
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link " href="#tab_2" data-toggle="tab">
                QUỐC GIA
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link " href="#tab_3" data-toggle="tab">
                THÀNH PHỐ
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
                          Quản lý châu lục
                        </span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      <button
                        className="btn btn-danger btn-sm float-right btn-header"
                        type="button"
                        onClick={() => Trl_spLocation_List(1)}
                      >
                        <i className="fa fa-search mr-2 " />
                        Tìm kiếm
                      </button>
                      <button
                        className="btn btn-success btn-sm float-right btn-header"
                        type="button"
                        onClick={() => handleOpenModalAdd(1)}
                      >
                        <i className="fa fa-plus mr-2 " />
                        Thêm mới
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body ">
                  <div className="row">
                    <DataTable
                      data={dataContinent}
                      columns={columnsContinent}
                    />
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="tab_2"
                role="tabpanel"
                aria-labelledby="custom-tabs-two-profile-tab"
              >
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-6">
                      <h3 className="card-title">
                        <i className="fas fa-plus" />
                        <span className="font-weight-bold">
                          Quản lý quốc gia
                        </span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      <button
                        className="btn btn-danger btn-sm float-right btn-header"
                        type="button"
                        onClick={() => Trl_spLocation_List(2)}
                      >
                        <i className="fa fa-search mr-2 " />
                        Tìm kiếm
                      </button>
                      <button
                        className="btn btn-success btn-sm float-right btn-header"
                        type="button"
                        onClick={() => handleOpenModalAdd(2)}
                      >
                        <i className="fa fa-plus mr-2 " />
                        Thêm mới
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body ">
                  <div className="row">
                    <DataTable data={dataCountry} columns={columnsCountry} />
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="tab_3"
                role="tabpanel"
                aria-labelledby="custom-tabs-two-profile-tab"
              >
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-6">
                      <h3 className="card-title">
                        <i className="fas fa-plus" />
                        <span className="font-weight-bold">
                          Quản lý thành phố
                        </span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      <button
                        className="btn btn-danger btn-sm float-right btn-header"
                        type="button"
                        onClick={() => Trl_spLocation_List(3)}
                      >
                        <i className="fa fa-search mr-2 " />
                        Tìm kiếm
                      </button>
                      <button
                        className="btn btn-success btn-sm float-right btn-header"
                        type="button"
                        onClick={() => handleOpenModalAdd(3)}
                      >
                        <i className="fa fa-plus mr-2 " />
                        Thêm mới
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body ">
                  <div className="row">
                    <DataTable data={dataCity} columns={columnsCity} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showModalAdd}
        onHide={handleCancelForm}
        backdrop="static"
        keyboard={false}
        size="xl"
        className={`custom-modal-w-90   z-max`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">THÊM MỚI</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={handleCancelForm}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="px-3">
          <div className="card p-3">
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-6">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    MÃ CHÂU LỤC
                  </span>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control2"
                      value={continent.LocationCode}
                      onChange={(e) => {
                        setContinent({
                          ...continent,
                          LocationCode: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    TÊN CHÂU LỤC
                  </span>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control2"
                      value={continent.LocationName}
                      onChange={(e) => {
                        setContinent({
                          ...continent,
                          LocationName: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <button
                  className="btn btn-success float-right btn-header"
                  onClick={() => {
                    ConfirmAlert("Xác nhận", "Bạn có muốn lưu không?", () => {
                      Trl_spLocation_Save(1);
                    });
                  }}
                >
                  <i className="fa fa-save mr-2 " />
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModalCountry}
        onHide={handleCancelForm}
        backdrop="static"
        keyboard={false}
        size="xl"
        className={`custom-modal-w-90   z-max`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">THÊM MỚI</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={handleCancelForm}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="px-3">
          <div className="card p-3">
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-4 ">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    Châu lục
                  </span>
                  <div class="input-group">
                    <SelectContinent
                      onSelected={(e) => setContinetId(e.value)}
                      className={"w-100 select-custom "}
                      LocationId={continentId}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-4">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    MÃ QUỐC GIA
                  </span>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control2"
                      value={country.LocationCode}
                      onChange={(e) => {
                        setCountry({
                          ...country,
                          LocationCode: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-4">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    TÊN QUỐC GIA
                  </span>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control2"
                      value={country.LocationName}
                      onChange={(e) => {
                        setCountry({
                          ...country,
                          LocationName: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <button
                  className="btn btn-success float-right btn-header"
                  onClick={() => {
                    ConfirmAlert("Xác nhận", "Bạn có muốn lưu không?", () => {
                      Trl_spLocation_Save(2);
                    });
                  }}
                >
                  <i className="fa fa-save mr-2 " />
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModalCity}
        onHide={handleCancelForm}
        backdrop="static"
        keyboard={false}
        size="xl"
        className={`custom-modal-w-90   z-max`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">THÊM MỚI</Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={handleCancelForm}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="px-3">
          <div className="card p-3">
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-3 ">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    CHÂU LỤC
                  </span>
                  <div class="input-group">
                    <SelectContinent
                      onSelected={(e) => setContinetId(e.value)}
                      className={"w-100 select-custom "}
                      LocationId={continentId}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-3 ">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    QUỐC GIA
                  </span>
                  <div class="input-group">
                    <SelectCountry
                      onSelected={(e) => setCountryId(e.value)}
                      className={"w-100 select-custom "}
                      LocationId={countryId}
                      ContinentId={continentId}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-3">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    MÃ THÀNH PHỐ
                  </span>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control2"
                      value={city.LocationCode}
                      onChange={(e) => {
                        setCity({
                          ...city,
                          LocationCode: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-3">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">
                    TÊN THÀNH PHỐ
                  </span>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control2"
                      value={city.LocationName}
                      onChange={(e) => {
                        setCity({
                          ...city,
                          LocationName: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <button
                  className="btn btn-success float-right btn-header"
                  onClick={() => {
                    ConfirmAlert("Xác nhận", "Bạn có muốn lưu không?", () => {
                      Trl_spLocation_Save(3);
                    });
                  }}
                >
                  <i className="fa fa-save mr-2 " />
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

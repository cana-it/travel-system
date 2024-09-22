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
import DateTimePicker from "react-datetime-picker";
import $ from "jquery";

import { Label } from "reactstrap";
import moment from "moment";

export const TourGuiderData = () => {
  useEffect(() => {
    Trl_spOperating_TourGuider_List();
  }, []);

  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const dispatch = useDispatch();

  const [TourGuiderId, setTourGuiderId] = useState(0);
  const [TourGuiderName, setTourGuiderName] = useState("");
  const [TourGuiderAddress, setTourGuiderAddress] = useState("");
  const [InternationalCertificate, setInternationalCertificate] = useState(0);
  const [DomesticCertificate, setDomesticCertificate] = useState(0);
  const [ForeignLanguage, setForeignLanguage] = useState("");
  const [Experience, setExperience] = useState("");
  const [YearOfBirth, setYearOfBirth] = useState(null);
  const [Identification, setIdentification] = useState("");
  const [Phone, setPhone] = useState("");
  const [Passport, setPassport] = useState("");
  const [IssueDate, setIssueDate] = useState(new Date());
  const [ExpirationDate, setExpirationDate] = useState(new Date());
  const [AssessmentOfWorkCapacity, setAssessmentOfWorkCapacity] = useState("");
  const [Continent, setContinent] = useState(0);
  const [Country, setCountry] = useState(0);
  const [ImagesTG, setImagesTG] = useState([]);
  const [ImageShow, setImageShow] = useState([]);
  const [HiddenFix, setHiddenFix] = useState(false);
  const [DataTableList, setDataTableList] = useState([]);

  const ClearFrom = () => {
    setTourGuiderId(0);
    setTourGuiderName("");
    setTourGuiderAddress("");
    setInternationalCertificate(0);
    setDomesticCertificate(0);
    setForeignLanguage("");
    setExperience("");
    setYearOfBirth(null);
    setIdentification("");
    setPhone("");
    setPassport("");
    setIssueDate(new Date());
    setExpirationDate(new Date());
    setAssessmentOfWorkCapacity("");
    setContinent(0);
    setCountry(0);
    setImageShow([]);
    setImagesTG([]);
    setHiddenFix(false);
  };

  const handleChangeFileAndImage = (e, type = 0) => {
    let f = e.target.files;
    let check = true;
    if (type === 0) {
      for (let i = 0; i < f.length; i++) {
        let exName = f[i].name.slice(
          (Math.max(0, f[i].name.lastIndexOf(".")) || Infinity) + 1
        );
        if (
          exName === "jpg" ||
          exName === "jpeg" ||
          exName === "png" ||
          exName === "gif"
        ) {
          check = true;
        } else {
          check = false;
        }
        if (check === false) break;
      }
      check
        ? setImagesTG([...ImagesTG, ...e.target.files])
        : Alertwarning(
            'File không đúng định dạng! Vui lòng chọn lại file có định dạng "jpg", "jpeg", "png", "gif"'
          );
    }
  };

  const onSelectContinent = (e) => {
    setContinent(e.value);
  };

  const onSelectCountry = (e) => {
    setCountry(e.value);
  };

  const onClickIC = (e) => {
    setInternationalCertificate(e === true ? 1 : 0);
  };

  const onClickDC = (e) => {
    setDomesticCertificate(e === true ? 1 : 0);
  };

  const Trl_spOperating_TourGuider_Save = async () => {
    let listImagesTG = "";
    try {
      if (Continent === 0 || Continent === -1) {
        Alertwarning("Vui Lòng Chọn Châu Lục!");
        return;
      }
      if (Country === 0 || Country === -1) {
        Alertwarning("Vui Lòng Chọn Nước!");
        return;
      }
      if (TourGuiderName === "") {
        Alertwarning("Vui Lòng Nhập Tên Hướng Dẫn Viên!");
        return;
      }
      if (YearOfBirth === null) {
        Alertwarning("Vui Lòng Chọn Ngày Sinh!");
        return;
      }
      let code = "";
      if (YearOfBirth) {
        let name = TourGuiderName.split(" ");
        let lastName = name[name.length - 1];
        let firstName = name[0];

        let formatDate = moment(YearOfBirth).format("DDMMYY");
        code = `${firstName}${lastName}${formatDate}`;
      }

      if (ImagesTG.length > 0) {
        const formData = new FormData();
        formData.append("Key", "Files");
        for (let i = 0; i < ImagesTG.length; i++) {
          formData.append("myFile" + i, ImagesTG[i]);
        }
        const res = await mainAction.API_spCallPostFile(formData, dispatch);
        listImagesTG = res.Message.replaceAll('"', "")
          .replace("[", "")
          .replace("]", "");
      }

      let i = listImagesTG.length > 0 ? "," + listImagesTG : listImagesTG;

      const pr = {
        TourGuiderId: TourGuiderId,
        TourGuiderName: TourGuiderName,
        TourGuiderCode: code,
        TourGuiderAddress: TourGuiderAddress,
        InternationalCertificate: InternationalCertificate,
        DomesticCertificate: DomesticCertificate,
        ForeignLanguage: ForeignLanguage,
        Experience: Experience,
        YearOfBirth: YearOfBirth,
        Identification: Identification,
        Phone: Phone,
        Passport: Passport,
        IssueDate: IssueDate,
        ExpirationDate: ExpirationDate,
        AssessmentOfWorkCapacity: AssessmentOfWorkCapacity,
        Continent: Continent,
        Country: Country,
        Creater: parseInt(Creater),
        Images: ImageShow.length > 0 ? ImageShow.join(",") + i : listImagesTG,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_TourGuider_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spOperating_TourGuider_List();
        ClearFrom();
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spOperating_TourGuider_List = async () => {
    try {
      const pr = {
        Officer: parseInt(Creater),
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_TourGuider_List",
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

  const Edit = (e, type) => {
    ;
    let Ojb = e.row.original;
    document.querySelector("#tab_1").click();
    setTourGuiderId(Ojb.TourGuiderId);
    setTourGuiderName(Ojb.TourGuiderName);
    setTourGuiderAddress(Ojb.TourGuiderAddress);
    setInternationalCertificate(Ojb.InternationalCertificate === true ? 1 : 0);
    setDomesticCertificate(Ojb.DomesticCertificate === true ? 1 : 0);
    setForeignLanguage(Ojb.ForeignLanguage);
    setExperience(Ojb.Experience);
    setYearOfBirth(new Date(Ojb.YearOfBirth));
    setIdentification(Ojb.Identification);
    setPassport(Ojb.Passport);
    setPhone(Ojb.Phone);
    setContinent(Ojb.Continent);
    setCountry(Ojb.Country);
    setAssessmentOfWorkCapacity(Ojb.AssessmentOfWorkCapacity);
    setIssueDate(new Date(Ojb.IssueDate));
    setExpirationDate(new Date(Ojb.ExpirationDate));
    let arr = e.row.original.Images?.split(",");
    setImageShow(arr);
    if (type === 1) {
      setHiddenFix(true);
    }
  };

  const Delete = async (e) => {
    let Ojb = e.row._original;
    try {
      const pr = {
        TourGuiderId: Ojb.TourGuiderId,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spOperating_TourGuider_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        const newArr = [...DataTableList];
        setDataTableList(
          newArr.filter((item) => item.TourGuiderId !== Ojb.TourGuiderId)
        );
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
      width: 220,
      filterable: false,
      sortable: false,
      Cell: (row) => (
        <div>
          <span>
            <button
              className="btn btn-sm btn-info"
              onClick={(e) => Edit({ row }, 1)}
            >
              <i class="fa fa-eye"></i> Xem
            </button>
            |
            <button
              className="btn btn-sm btn-success"
              onClick={(e) => Edit({ row }, 0)}
            >
              <i class="far fa-edit"></i> Sửa
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
      Header: "Chuyên Khu Vực",
      accessor: "CountryName",
      width: 150,
    },
    {
      Header: "Tên Hướng Dẫn Viên",
      accessor: "TourGuiderName",
      width: 200,
    },
    {
      Header: "Mã Hướng Dẫn Viên",
      accessor: "TourGuiderCode",
      width: 200,
    },
    {
      Header: "Ngày Sinh",
      accessor: "YearOfBirth",
      Cell: ({ row }) => (
        <span>{FormatDateJson(row._original.YearOfBirth, 7)}</span>
      ),
      width: 150,
    },
    {
      Header: "Số ĐT",
      accessor: "Phone",
      width: 150,
    },
    {
      Header: "Ngoại Ngữ",
      accessor: "ForeignLanguage",
      width: 150,
    },
    {
      Header: "Kinh Nghiệm",
      accessor: "Experience",
      width: 150,
    },
    {
      Header: "Bằng Quốc Tế",
      accessor: "InternationalCertificate",
      width: 100,
      Cell: ({ row }) => (
        <span>
          {row._original.InternationalCertificate === true ? (
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
      Header: "Bằng Nội Địa",
      accessor: "DomesticCertificate",
      width: 100,
      Cell: ({ row }) => (
        <span>
          {row._original.DomesticCertificate === true ? (
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
      Header: "CCCD",
      accessor: "Identification",
      width: 150,
    },
    {
      Header: "Địa Chỉ",
      accessor: "TourGuiderAddress",
      width: 350,
    },
    {
      Header: "Passport",
      accessor: "Passport",
      width: 150,
    },
    {
      Header: "Ngày Cấp",
      accessor: "IssueDate",
      width: 150,
      Cell: ({ row }) => (
        <span>{FormatDateJson(row._original.IssueDate, 7)}</span>
      ),
    },
    {
      Header: "Ngày Hết",
      accessor: "ExpirationDate",
      Cell: ({ row }) => (
        <span>{FormatDateJson(row._original.ExpirationDate, 7)}</span>
      ),
      width: 150,
    },
    {
      Header: "Người Tạo",
      accessor: "CreateName",
      width: 200,
    },
    {
      Header: "Thời Gian Tạo",
      accessor: "CreateTime",
      width: 200,
      Cell: ({ row }) => (
        <span>{FormatDateJson(row._original.CreateTime, 10)}</span>
      ),
    },
    {
      Header: "Đánh Giá Năng Lực",
      accessor: "AssessmentOfWorkCapacity",
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
                          Thêm Mới Hướng Dẫn Viên
                        </span>
                      </h3>
                    </div>
                    <div className="col-md-6 card-header-btn">
                      {!HiddenFix ? (
                        <button
                          className="btn btn-success btn-sm float-right btn-header"
                          onClick={() => {
                            ConfirmAlert(
                              "Xác nhận",
                              "Bạn có muốn lưu không?",
                              () => {
                                Trl_spOperating_TourGuider_Save();
                              }
                            );
                          }}
                          type="button"
                        >
                          <i className="fa fa-save mr-2 " />
                          Thêm Mới
                        </button>
                      ) : (
                        <button
                          className="btn btn-warning btn-sm float-right btn-header"
                          onClick={() => ClearFrom()}
                          type="button"
                        >
                          <i className="fas fa-reply mr-2" />
                          Quay Lại
                        </button>
                      )}
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
                          Chuyên Khu Vực
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
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Tên Nhân Viên
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={TourGuiderName}
                          onChange={(e) => setTourGuiderName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Năm Sinh
                        </span>
                        <DateTimePicker
                          className="form-control2 z-date"
                          value={YearOfBirth}
                          onChange={(date) => setYearOfBirth(date)}
                          format={"dd/MM/yyyy"}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Số ĐT
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={Phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Ngoại Ngữ
                        </span>
                        <div class="input-group">
                          <input
                            type="text"
                            class="form-control2"
                            value={ForeignLanguage}
                            onChange={(e) => setForeignLanguage(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Kinh Nghiệm
                        </span>
                        <div class="input-group">
                          <input
                            type="text"
                            class="form-control2"
                            value={Experience}
                            onChange={(e) => setExperience(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-xs-12 col-sm-3 col-md-3 m-auto"
                      style={{ paddingBottom: "35px" }}
                    >
                      <span className="small font-weight-bold text-muted">
                        Bằng
                      </span>
                      <div class="input-group">
                        <div
                          class="col-sm-6 col-md-6"
                          style={{ marginLeft: "-10px" }}
                        >
                          <div class="icheck-success d-inline">
                            <input
                              type="checkbox"
                              id="checkboxIC"
                              checked={InternationalCertificate}
                              onChange={(e) => onClickIC(e.target.checked)}
                            />
                            <label class="label checkbox" htmlFor="checkboxIC">
                              Quốc Tế
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
                              id="checkboxDC"
                              checked={DomesticCertificate}
                              onChange={(e) => onClickDC(e.target.checked)}
                            />
                            <label class="label checkbox" htmlFor="checkboxDC">
                              Nội Địa
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          CCCD
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={Identification}
                          onChange={(e) => setIdentification(e.target.value)}
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
                            value={TourGuiderAddress}
                            onChange={(e) =>
                              setTourGuiderAddress(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Đánh Giá Năng Lực
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={AssessmentOfWorkCapacity}
                          onChange={(e) =>
                            setAssessmentOfWorkCapacity(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Passport
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={Passport}
                          onChange={(e) => setPassport(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Ngày Cấp
                        </span>
                        <DateTimePicker
                          className="form-control2 z-date"
                          value={IssueDate}
                          onChange={(date) => setIssueDate(date)}
                          format={"dd/MM/yyyy"}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Ngày Hết Hạn
                        </span>
                        <DateTimePicker
                          className="form-control2 z-date"
                          value={ExpirationDate}
                          onChange={(date) => setExpirationDate(date)}
                          format={"dd/MM/yyyy"}
                        />
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          UPLOAD HÌNH ẢNH{" "}
                          <span class="text-danger">(jpg, jpeg, png)</span>
                        </span>
                        <label class="image-collapse-label2">
                          <input
                            type="file"
                            className="image-collapse-file cursor-pointer"
                            onChange={(e) => handleChangeFileAndImage(e, 0)}
                            accept="image/*"
                            multiple
                          />
                          <i class="fas fa-passport upload-file-btn"></i>
                        </label>
                        <div className="row ">
                          {ImagesTG.map((item, ix) => {
                            return (
                              <div
                                className="upload-file-item py-1 my-2 shadow-sm col-6 position-relative"
                                key={"a" + ix}
                              >
                                <img
                                  src={URL.createObjectURL(item)}
                                  alt=""
                                  className="image-upload"
                                />
                                <i
                                  className="fa fa-times pl-2 text-danger cursor-pointer position-absolute top-1 right-1"
                                  onClick={(e) =>
                                    setImagesTG(
                                      ImagesTG.filter((_, i) => i !== ix)
                                    )
                                  }
                                ></i>
                              </div>
                            );
                          })}
                        </div>
                        <div className="row">
                          {ImageShow.length > 0 &&
                            ImageShow.map((item, ix) => {
                              return (
                                <div
                                  className="upload-file-item py-1 my-2 shadow-sm col-6 position-relative"
                                  key={"b" + ix}
                                >
                                  <img
                                    src={IMAGES_DOMAIN + item}
                                    alt=""
                                    className="image-upload"
                                  />
                                  <i
                                    className="fa fa-times pl-2 text-danger cursor-pointer position-absolute top-1 right-1"
                                    onClick={(e) =>
                                      setImageShow(
                                        ImageShow.filter((_, i) => i !== ix)
                                      )
                                    }
                                  ></i>
                                  <a
                                    href={IMAGES_DOMAIN + item}
                                    download
                                    target={"_blank"}
                                    className="fa fa-download mr-4 cursor-pointer position-absolute top-1 right-1"
                                  ></a>
                                </div>
                              );
                            })}
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

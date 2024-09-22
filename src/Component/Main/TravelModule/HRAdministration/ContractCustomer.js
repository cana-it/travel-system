import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import Select from "react-select";
import {
  DataTable,
  TooltipCustom,
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
  ConvertFileName,
} from "../../../../Utils";
import { IMAGES_DOMAIN } from "../../../../Services";
import DateTimePicker from "react-datetime-picker";
import "react-confirm-alert/src/react-confirm-alert.css";
import Modal from "react-bootstrap/Modal";
import $ from "jquery";

export const ContractCustomer = () => {
  useEffect(() => {
    Trl_spContractCustomerl_List();
  }, []);

  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const dispatch = useDispatch();

  const [ContractId, setContractId] = useState(0);
  const [ContractTime, setContractTime] = useState();
  const [TypeBill, setTypeBill] = useState({ value: "A", label: "Có hóa đơn" });
  const [CustomerContract, setCustomerContract] = useState(0);
  const [Journey, setJourney] = useState("");
  const [StatusContract, setStatusContract] = useState("");
  const [FileUpload, setFileUpload] = useState([]);
  const [FileShow, setFileShow] = useState([]);
  const [ContentCus, setContentCus] = useState("");
  const [Notes, setNotes] = useState("");
  const [docs, setDocs] = useState("");
  const [CustomerName, setCustomerName] = useState("");
  const [isPreviewFile, setIsPreviewFile] = useState(false);

  const [DataTableList, setDataTableList] = useState([]);

  // File and Imga
  const checkExtentionFile = (value, type) => {
    let check = 0;
    let exName = value.slice(
      (Math.max(0, value.lastIndexOf(".")) || Infinity) + 1
    );

    if (
      exName === "doc" ||
      exName === "docx" ||
      exName === "xls" ||
      exName === "xlsx"
    ) {
      check = 0;
    } else {
      check = 1;
    }
    return check;
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
          exName === "pdf" ||
          exName === "doc" ||
          exName === "docx" ||
          exName === "xls" ||
          exName === "xlsx"
        ) {
          check = true;
        } else {
          check = false;
        }
        if (check === false) break;
      }
      check
        ? setFileUpload([...FileUpload, ...e.target.files])
        : Alertwarning(
            'File không đúng định dạng! Vui lòng chọn lại file có định dạng "pdf", "doc", "docx", "xls", "xlsx"'
          );
    }
  };

  const Trl_spContractCustomer_Save = async () => {
    let date = FormatDateJson(new Date(), 7).toString().replaceAll("/", ""),
      listFile = "";
    try {
      if (CustomerName === "") {
        Alertwarning("Vui lòng nhập tên khách hàng!");
        return;
      }
      if (ContractTime === undefined) {
        Alertwarning("Vui lòng chọn ngày ký hợp đồng!");
        return;
      }
      if (CustomerContract <= 0) {
        Alertwarning("Vui lòng nhập số khách hàng!");
        return;
      }
      if (FileUpload.length > 0) {
        const formData = new FormData();
        formData.append("Key", "Files");
        for (let i = 0; i < FileUpload.length; i++) {
          let f = FileUpload[i];
          let renamedFile = new File([f], ConvertFileName(f.name), {
            type: f.type,
          });

          formData.append("myFile" + i, renamedFile);
        }
        const res = await mainAction.API_spCallPostFile(formData, dispatch);
        listFile = res.Message.replaceAll('"', "")
          .replace("[", "")
          .replace("]", "");
      }

      let Type = TypeBill.value === "A" ? "AF" : "BF";
      let f = listFile.length > 0 ? "," + listFile : listFile;
      const pr = {
        ContractId: ContractId,
        NumberContract: `CON${FormatDateJson(ContractTime, 7)
          .toString()
          .replaceAll("/", "")
          .slice(0, 4)}${date}${Type}`,
        ContractTime: FormatDateJson(ContractTime),
        CustomerId: 0,
        CustomerName: CustomerName,
        Bill: TypeBill.value,
        CustomerContract: CustomerContract,
        Journey: Journey,
        StatusContract: StatusContract,
        ContentCus: ContentCus,
        Notes: Notes,
        Files: FileShow.length > 0 ? FileShow.join(",") + f : listFile,
        Creater: Creater,
        CreateName: CreateName,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spContractCustomer_Save",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spContractCustomerl_List();
        ClearFrom();
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const ClearFrom = () => {
    setContractId(0);
    setContractTime();
    setTypeBill({ value: "A", label: "Có hóa đơn" });
    setCustomerContract(0);
    setJourney("");
    setStatusContract("");
    setContentCus("");
    setNotes("");
    setCustomerName("");
    setFileShow([]);
    setFileUpload([]);
  };

  const Trl_spContractCustomerl_List = async () => {
    try {
      const pr = {
        Officer: parseInt(Creater),
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spContractCustomerl_List",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length !== 0) {
        setDataTableList(result);
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Edit = (e) => {
    let Ojb = e.row.original;
    if (Ojb.Files === undefined || Ojb.Files === "") {
      setFileShow([]);
    } else {
      setFileShow(Ojb.Files?.split(","));
    }
    document.querySelector("#tab_1").click();
    setContractId(Ojb.ContractId);
    setContractTime(Ojb.ContractTime);
    setTypeBill(
      Ojb.Bill === "A"
        ? { value: "A", label: "Có hóa đơn" }
        : { value: "B", label: "Không có hóa đơn" }
    );
    setCustomerContract(Ojb.CustomerContract);
    setCustomerName(Ojb?.CustomerName);
    setJourney(Ojb.Journey);
    setStatusContract(Ojb.StatusContract);
    setContentCus(Ojb.ContentCus);
    setNotes(Ojb.Notes);
    setFileUpload([]);
  };

  const Delete = async (e) => {
    let Ojb = e.row._original;
    try {
      const pr = {
        ContractId: Ojb.ContractId,
        Creater: Creater,
        CreateName: CreateName,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spContractCustomer_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        const newArr = [...DataTableList];
        setDataTableList(
          newArr.filter((item) => item.ContractId !== Ojb.ContractId)
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
                ConfirmAlert("Xác nhận", "Bạn có muốn xóa không?", () => {
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
      Header: "Số Hợp Đồng",
      accessor: "NumberContract",
      width: 200,
    },
    {
      Header: "Ngày Ký",
      accessor: "ContractTime",
      width: 200,
      Cell: ({ row }) => (
        <span>{FormatDateJson(row._original.ContractTime, 7)}</span>
      ),
    },
    {
      Header: "Tên Khách Hàng",
      accessor: "CustomerName",
      width: 250,
    },
    {
      Header: "Hóa Đơn",
      accessor: "TypeBill",
      width: 200,
    },
    {
      Header: "Số KH/Hợp đồng",
      accessor: "CustomerContract",
      width: 150,
    },
    {
      Header: "Hành Trình/Ngày",
      accessor: "Journey",
      width: 250,
    },
    {
      Header: "Tình Trạng",
      accessor: "StatusContract",
      width: 250,
    },
    {
      Header: "File",
      accessor: "Files",
      width: 350,
      Cell: ({ row }) => {
        const fls = row._original.Files.split(",").filter((e) => e !== "");
        return fls.map((fn, id) => {
          const splitfn = fls[id].split("/");
          const fname = splitfn[splitfn.length - 1];
          return (
            <a
              href={IMAGES_DOMAIN + fn}
              target="_blank"
              style={{ float: "left", marginleft: "5px" }}
            >
              {fname}
            </a>
          );
        });
      },
    },
    {
      Header: "Nội Dung",
      accessor: "ContentCus",
      width: 300,
    },
    {
      Header: "Ghi Chú",
      accessor: "Notes",
      width: 350,
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
      Header: "Người Sửa",
      accessor: "EditName",
      width: 200,
    },
    {
      Header: "Thời Gian Sửa",
      accessor: "EditTime",
      width: 200,
      Cell: ({ row }) => (
        <span>
          {row._original.EditTime === undefined
            ? ""
            : FormatDateJson(row._original.EditTime, 10)}
        </span>
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
                        <span className="font-weight-bold">
                          Thêm Mới Hợp Đồng
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
                              Trl_spContractCustomer_Save();
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
                    <div className="col-xs-12 col-sm-6 col-md-4 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Tên Khách Hàng(
                          <strong className="check-point">*</strong>)
                        </span>
                        <div class="input-group">
                          <input
                            type="text"
                            class="form-control2"
                            value={CustomerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-4 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Ngày Ký Hợp Đồng(
                          <strong className="check-point">*</strong>)
                        </span>
                        <div class="input-group">
                          <DateTimePicker
                            className="form-control2"
                            value={ContractTime}
                            onChange={(date) => setContractTime(date)}
                            format={"dd/MM/yyyy"}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-xs-12 col-sm-6 col-md-4 m-auto"
                      style={{ width: "100%" }}
                    >
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Hóa Đơn
                        </span>
                        <div class="input-group">
                          <Select
                            className="ReactTable z-index-1k"
                            value={TypeBill}
                            onChange={(e) => setTypeBill(e)}
                            options={[
                              { value: "A", label: "Có hóa đơn" },
                              { value: "B", label: "Không có hóa đơn" },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-4 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Số Khách / Hợp Đồng(
                          <strong className="check-point">*</strong>)
                        </span>
                        <input
                          type="number"
                          class="form-control2"
                          value={CustomerContract}
                          onChange={(e) => setCustomerContract(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-4 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Hành Trình / Ngày
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={Journey}
                          onChange={(e) => setJourney(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-4 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Tình Trạng
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={StatusContract}
                          onChange={(e) => setStatusContract(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Nội Dung
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={ContentCus}
                          onChange={(e) => setContentCus(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          Ghi Chú
                        </span>
                        <input
                          type="text"
                          class="form-control2"
                          value={Notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 m-auto">
                      <div class="form-group">
                        <span class="small font-weight-bold text-muted">
                          UPLOAD FILES{" "}
                          <span class="text-danger">
                            (pdf, xls, xlsx, doc, docx)
                          </span>
                        </span>
                        <label class="image-collapse-label2 ">
                          <input
                            type="file"
                            className="image-collapse-file cursor-pointer"
                            onChange={(e) => handleChangeFileAndImage(e, 0)}
                            accept=".pdf, .xls, .xlsx, .doc, .docx"
                            multiple
                          />
                          <i className="fa fa-file upload-file-btn"></i>
                        </label>
                        <div className="">
                          {FileUpload.map((item, ix) => {
                            return (
                              <div
                                className="upload-file-item py-1 my-2 shadow-sm "
                                key={"asdsad" + ix}
                              >
                                <i className="fa fa-file px-2"></i>
                                <span>{item.name}</span>
                                <i
                                  className="fa fa-times pl-2 text-danger cursor-pointer"
                                  onClick={(e) =>
                                    setFileUpload(
                                      FileUpload.filter((_, i) => i !== ix)
                                    )
                                  }
                                ></i>
                              </div>
                            );
                          })}
                        </div>
                        <div className="">
                          {FileShow.length > 0 &&
                            FileShow.map((item, ix) => {
                              return (
                                <div
                                  className="upload-file-item py-1 my-2 shadow-sm d-flex justify-content-between"
                                  download
                                  key={"aaa" + ix}
                                >
                                  <div>
                                    <i className="fa fa-file px-2"></i>
                                    <span>{item.split("/")[6]}</span>
                                  </div>
                                  <div className="">
                                    <TooltipCustom content={"Xoá"}>
                                      <i
                                        className="fa fa-times pl-2 text-danger cursor-pointer px-2"
                                        onClick={(e) =>
                                          setFileShow(
                                            FileShow.filter((_, i) => i !== ix)
                                          )
                                        }
                                      ></i>
                                    </TooltipCustom>
                                    <TooltipCustom content={"Tải xuống"}>
                                      <a
                                        href={IMAGES_DOMAIN + item}
                                        download
                                        target={"_blank"}
                                        className="px-3"
                                      >
                                        <i class="fa fa-download"></i>
                                      </a>
                                    </TooltipCustom>
                                    <TooltipCustom
                                      content={"Xem file trực tiếp"}
                                    >
                                      <i
                                        className="fa fa-eye pl-2 text-success cursor-pointer px-2"
                                        onClick={(e) => {
                                          setDocs(IMAGES_DOMAIN + item);
                                          setIsPreviewFile(true);
                                        }}
                                      ></i>
                                    </TooltipCustom>
                                  </div>
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
        <Modal
          show={isPreviewFile}
          onHide={() => setIsPreviewFile(false)}
          aria-labelledby="example-custom-modal-styling-title"
          className="custom-modal-w-100 z-maxx"
        >
          <Modal.Header className="p-2">
            <Modal.Title id="example-custom-modal-styling-title">
              <div class="text-center">Preview Document</div>
            </Modal.Title>
            <button
              type="button"
              class="close"
              aria-label="Close"
              onClick={() => setIsPreviewFile(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            {checkExtentionFile(docs) === 0 ? (
              <iframe
                className={"docs"}
                width="100%"
                height="800"
                frameBorder="0"
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${docs}`}
                title="preview file"
              ></iframe>
            ) : (
              <iframe
                className={"docs"}
                width="100%"
                height="800"
                frameBorder="0"
                src={`https://drive.google.com/viewerng/viewer?url=${docs}&embedded=true&hl=vi`}
                title="preview file"
              ></iframe>
            )}{" "}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

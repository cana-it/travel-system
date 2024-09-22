import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { DataTable } from "../../../Common";
import { mainAction } from "../../../Redux/Actions";
import {
  Alerterror,
  Alertsuccess,
  Alertwarning,
  FormatDateJson,
} from "../../../Utils";
import { confirmAlert } from "react-confirm-alert";
import { TourGroupDetail } from "./TourGroupDetail";
const TourGroupManagemnt = () => {
  const dispatch = useDispatch();
  const CreateBy = localStorage.getItem("CreateBy");
  useEffect((e) => {
    Trl_spTour_Group_List();
  }, []);
  const [DataGroupTour, setDataGroupTour] = useState([]);
  const [dataTourList, setDataTourList] = useState([]);
  const [tourGroupList, setTourGroupList] = useState([]);

  const [ValueImage, setValueImage] = useState({
    Image: "",
  });
  const [dataProductGroup, setDataProductGroup] = useState({
    TourGroupId: 0,
    NameVN: "",
    NameEN: "",
    Slug: "",
    Image: "",
    ContentVN: "",
    ContentEN: "",
    IsDelete: 0,
    TourList: [],
    IndexNumber: 0,
  });
  const ClearForm = () => {
    setDataProductGroup({
      TourGroupId: 0,
      NameVN: "",
      NameEN: "",
      Slug: "",
      Image: "",
      ContentVN: "",
      ContentEN: "",
      IsDelete: 0,
      TourList: [],
      IndexNumber: 0,
    });
    setValueImage({
      Image: "",
    });
  };

  //#region quản lý tour
  const Trl_spTour_Group_Save = async () => {
    try {
      if (
        dataProductGroup?.NameVN === "" ||
        dataProductGroup?.NameVN === undefined
      ) {
        Alertwarning("Vui lòng nhập tên nhóm");
        return;
      }
      // if(dataProductGroup?.NameEN === "" || dataProductGroup?.NameEN === undefined){
      //     Alertwarning("Vui lòng nhập tên tour tiếng Anh");
      //     return;
      // };
      // if(dataProductGroup?.Slug === "" || dataProductGroup?.Slug === undefined){
      //     Alertwarning("Vui lòng nhập đường dẫn");
      //     return;
      // }
      let idList = dataProductGroup.TourList.map((x) => x.Id).join(",");
      const params = {
        Json: JSON.stringify({
          TourGroupId: dataProductGroup?.TourGroupId,
          NameVN: dataProductGroup?.NameVN,
          NameEN: dataProductGroup?.NameEN,
          Slug: dataProductGroup?.Slug,
          TourList: idList,
          ContentVN: dataProductGroup?.ContentVN,
          ContentEN: dataProductGroup?.ContentEN,
          IndexNumber: dataProductGroup?.IndexNumber || 0,
          Creater: CreateBy,
        }),
        func: "Trl_spTour_Group_Save",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        setIsOpenSave(false);
        Trl_spTour_Group_List();
        return;
      }
      if (result.Status === "NOTOK") {
        Alertwarning(result.ReturnMess);
        return;
      } else {
        DataGroupTour.map((e) => {
          if (e.TourGroupId === dataProductGroup.TourGroupId) {
            e.NameVN = dataProductGroup?.NameVN;
            e.NameEN = dataProductGroup?.NameEN;
            e.Slug = dataProductGroup?.Slug;
            e.TourList = idList;
            e.ContentVN = dataProductGroup?.ContentVN;
            e.ContentEN = dataProductGroup?.ContentEN;
            e.IndexNumber = dataProductGroup?.IndexNumber || 0;
          }
          return e;
        });
        setDataGroupTour(DataGroupTour);
        Alertsuccess(result.ReturnMess);
        ClearForm();
      }
    } catch (error) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
    }
  };

  const Trl_spTour_Group_List = async () => {
    try {
      setDataGroupTour([]);
      const pr = {
        TourGroupId: 0,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTour_Group_List",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        setDataGroupTour(result);
        return;
      }
      Alertwarning("Không có dữ liệu");
    } catch (err) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
    }
  };

  const Trl_spTourManagement_List = async (setIdList) => {
    // let  = [];
    try {
      setDataTourList([]);
      const pr = {
        Id: 0,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spTourManagement_List",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.length > 0) {
        let res = result?.map((x) => {
          return {
            key: x.Id,
            name: x.NameTour,
            ...x,
          };
        });
        if (setIdList.length > 0) {
          let newRes = setIdList
            ?.map((x) => {
              return res.find((i) => i.Id === x);
            })
            .filter((item) => item);

          const reminingItems = res.filter(
            (item) => !setIdList.includes(item.Id)
          );
          setDataTourList(reminingItems);
          setTourGroupList([...newRes]);
          return newRes;
        } else {
          setDataTourList(res);
          setTourGroupList([]);
          return [];
        }
      } else {
        setDataTourList(result);
        setTourGroupList([]);
        return [];
      }
    } catch (err) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
    }
  };

  const Trl_spTour_Group_Delete = (item) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return <ConfirmAlertUi onClose={onClose} item={item} />;
      },
    });
  };
  const ConfirmAlertUi = (props) => {
    return (
      <div className="card-body border-left-red">
        <h3>Xác nhận xóa dữ liệu!</h3>
        <p>
          Bạn có chắc chắn muốn xóa{" "}
          <strong>{props.item._original.MenuName}</strong>{" "}
        </p>
        <button className="btn btn-small btn-warning" onClick={props.onClose}>
          {" "}
          <i className="fa fa-undo"> </i> Hủy
        </button>
        <button
          className="btn btn-small btn-danger margin-left-5"
          onClick={() => {
            props.onClose();
            Trl_spTour_Group_Delete_Action(props.item);
          }}
        >
          <i className="fa fa-trash"> </i> Xóa
        </button>
      </div>
    );
  };
  const Trl_spTour_Group_Delete_Action = async (item) => {
    try {
      const pr = {
        TourGroupId: item._original.TourGroupId,
        IsDelete: 1,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: " Trl_spTour_Group_Delete",
      };

      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "OK") {
        Alertsuccess(result.ReturnMess);
        Trl_spTour_Group_List();
        return;
      }
      if (result.Status === "NOTOK") {
        Alerterror(result.ReturnMess);
        return;
      }
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spTour_Group_Edit = async (item) => {
    setIsOpenSave(true);
    let Data = item._original;
    const list =
      Data.TourList?.length > 0 ? Data.TourList.split(",").map((x) => +x) : [];
    let newTourList = await Trl_spTourManagement_List(list);
    setDataProductGroup({
      TourGroupId: Data.TourGroupId,
      NameVN: Data.NameVN,
      NameEN: Data.NameEN,
      Slug: Data.Slug,
      Image: Data.ImageSrc,
      ContentVN: Data.ContentVN,
      ContentEN: Data.ContentEN,
      IndexNumber: Data.IndexNumber,
      TourList: newTourList,
    });
  };

  //#region change Index
  const [Status, setStatus] = useState([]);
  const [timer, setTimer] = useState(null);
  let delayTime = 1000;
  const handleChange = () => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      Call_Api();
    }, delayTime);
    setTimer(newTimer);
  };
  const Trl_spTour_Group_IndexNumber = async (item, key) => {
    try {
      let Data = item.row._original,
        _IndexNumber = 0;
      if (key === "down") {
        _IndexNumber = Data.IndexNumber - 1;
      } else {
        _IndexNumber = Data.IndexNumber + 1;
      }

      let datatmp = DataGroupTour.find(
        (e) => e.TourGroupId === Data.TourGroupId
      );
      datatmp.IndexNumber = _IndexNumber;
      datatmp.IsCheck = true;
      setStatus({ list: DataGroupTour });

      handleChange();
    } catch (error) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT");
    }
  };
  const Call_Api = async () => {
    let data_tmp = DataGroupTour.filter((e) => e.IsCheck === true);
    const extractedData = data_tmp.map((item) => ({
      TourGroupId: item.TourGroupId,
      IndexNumber: item.IndexNumber,
    }));
    const params = {
      Json: JSON.stringify(extractedData),
      func: "Trl_spTour_Group_IndexNumber",
    };
    await mainAction.API_spCallServer(params, dispatch);
  };

  //#endregion change Index

  const columns = [
    {
      Header: "STT",
      Cell: (row) => <span>{row.index + 1}</span>,
      width: 40,
      filterable: false,
      special: true,
      show: true,
      className: "text-center",
    },
    {
      Header: "Tùy chọn",
      Cell: ({ row }) => (
        <>
          <button
            type="button"
            title="Sửa"
            className="btn btn-secondary btn-sm m-1 btn-add"
            onClick={(e) => {
              setValueImage({
                ...ValueImage,
                Image: row._original.Image,
              });
              Trl_spTour_Group_Edit(row);
            }}
          >
            <i className="fa fa-edit"></i>
          </button>
          <button
            type="button"
            title="Xóa"
            className="btn btn-danger btn-sm m-1 btn-add"
            onClick={(e) => Trl_spTour_Group_Delete(row)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </>
      ),
      width: 150,
      filterable: false,
      className: "text-center",
    },
    {
      Header: "Thứ tự",
      accessor: "IndexNumber",
      filterable: false,
      width: 120,
      Cell: ({ row }) => {
        return (
          <>
            <div className="d-flex justify-content-center ">
              <div>
                <button
                  className="border-0"
                  type="button"
                  onClick={(e) => Trl_spTour_Group_IndexNumber({ row }, "up")}
                >
                  <i class="fas fa-chevron-circle-up text-info"></i>
                </button>
              </div>
              <span className="px-3">{row._original.IndexNumber} </span>
              <div>
                <button
                  className="border-0"
                  type="button"
                  onClick={(e) => Trl_spTour_Group_IndexNumber({ row }, "down")}
                >
                  <i class="fas fa-chevron-circle-down text-info"></i>
                </button>
              </div>
            </div>
          </>
        );
      },
    },
    {
      Header: "Tên tiếng Việt",
      accessor: "NameVN",
      className: "text-center",
    },
    {
      Header: "Tên tiếng Anh",
      accessor: "NameEN",
      className: "text-center",
    },
    {
      Header: "Đường dẫn",
      accessor: "Slug",
      className: "text-center",
    },
    {
      Header: "Người tạo",
      accessor: "CreateName_Gr",
      className: "text-center",
    },
    {
      Header: "Ngày tạo",
      accessor: "CreateDate",
      Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
      className: "text-center",
    },
  ];
  //#endregion quản lý tour

  //#region popup Lưu
  const [modalIsOpenSave, setIsOpenSave] = useState(false);
  const openModalSave = () => {
    setIsOpenSave(true);
  };
  const closeModalSave = () => {
    setIsOpenSave(false);
  };
  const viewAdd = () => {
    openModalSave();
  };
  //#endregion popup Lưu

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header">
          <span className="HomeTitle">Quản lý nhóm tour</span>
          <div className="float-right">
            <button
              onClick={(e) => {
                viewAdd();
                viewAdd();
                ClearForm();
                Trl_spTourManagement_List([]);
              }}
              type="button"
              class="btn btn-sm btn-success pull-right margin-left-5"
              style={{ marginTop: "-7px" }}
            >
              <i class="fa fa-plus pr-2"></i>
              Thêm nhóm tour
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="col-md-12 mb-3">
            <DataTable
              data={DataGroupTour}
              columns={columns}
              fixedColumns="true"
            />
          </div>
        </div>
      </div>
      {/* Module ADD */}
      <Modal
        show={modalIsOpenSave}
        onHide={closeModalSave}
        className=" custom-modal-w-90"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header className="p-2">
          <Modal.Title id="example-custom-modal-styling-title">
            <div className="">
              {dataProductGroup.TourGroupId === 0
                ? "Thêm nhóm tour"
                : "Chỉnh sửa"}
            </div>
          </Modal.Title>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={closeModalSave}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="card-body p-0">
            <div className="row">
              <div className="col-md-12 mt-4">
                <TourGroupDetail
                  data={dataProductGroup}
                  setData={setDataProductGroup}
                  dataTourList={dataTourList} //list tour
                  setDataTourList={setDataTourList}
                  Trl_spTourManagement_List={Trl_spTourManagement_List}
                  // tourGroupList={dataProductGroup.TourList
                  // } // list group
                  // setTourGroupList={(e) =>
                  //     setDataProductGroup(
                  //         {...dataProductGroup,
                  //         TourList: e
                  // }
                  // )}
                  tourGroupList={tourGroupList}
                  setTourGroupList={setTourGroupList}
                ></TourGroupDetail>
              </div>

              {/* Lưu */}
              <div className="col-sm-12 col-md-12 mt-4">
                <hr />
                <button
                  onClick={() => {
                    ClearForm();
                  }}
                  type="button"
                  className="btn btn-sm btn-danger pull-right margin-left-5"
                >
                  <i className="fa fa-trash pr-2"></i>
                  Clear form
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-success pull-right"
                  onClick={(e) => {
                    Trl_spTour_Group_Save();
                    closeModalSave();
                  }}
                >
                  <i className="fa fa-save pr-2"></i>
                  {dataProductGroup.TourGroupId === 0 ? "Lưu" : "Chỉnh sửa"}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default TourGroupManagemnt;

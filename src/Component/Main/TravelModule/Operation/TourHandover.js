import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import Modal from "react-bootstrap/Modal";
import { DataTable } from "../../../../Common";

import { Alerterror, FormatDateJson } from "../../../../Utils";
import { SettlementTourForm } from "./SettlementTourForm";
import { Img } from "react-image";

export const TourHandover = () => {
  const dispatch = useDispatch();
  const Creater = +localStorage.getItem("CreateBy");
  const [showForm, setShowForm] = useState(false);
  const [settlementList, setSettlementList] = useState([]);

  useEffect(() => {
    Trl_spSettlementTour_List();
  }, []);

  const onPrint = () => {
    var content = 
    document.getElementById("settlement-tour");
    var pri = document.getElementById("ifmcontentstoprint").contentWindow;
    pri.document.open();
    //pri.document.write(document.getElementById("headerPrint").innerHTML);
    pri.document.write(content.innerHTML);
    //pri.document.write(document.getElementById("footerPrint").innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
  };

  const Trl_spSettlementTour_List = async (type = 0) => {
    try {
      const pr = {
        SettlementTourId: 0,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spSettlementTour_List",
      };

      const res = await mainAction.API_spCallServer(params, dispatch);
      if (res.length > 0) {
        setSettlementList(res);
      } else {
        Alerterror("Không có dữ liệu");
        setSettlementList([]);
      }
    } catch (error) {
      ;
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const [DataPrint, setDataPrint] = useState();
  const Trl_spTourHandover_Print = async (_dataprint, type = 0) => {
    try {
      const pr = {
        SettlementTourId: _dataprint.SettlementTourId || 0,
        CreateName: +Creater,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spSettlementTour_Excel",
      };
      const res = await mainAction.API_spCallServer(params, dispatch);
      setDataPrint(res[0]);
      setShowForm(true);
    } catch (error) {
      ;
      Alerterror("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const columns = [
    {
      Header: "Options",
      accessor: "Edit",
      Cell: ({ row }) => (
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-success btn-xs"
            onClick={() => {
              Trl_spTourHandover_Print(row._original);
            }}
          >
            <i class="fas fa-eye"></i> Xem
          </button>
        </div>
      ),
      minWidth: 100,
      fixed: "left",
    },
    {
      Header: "Mã Tour",
      accessor: "ServiceSaleCode",
      minWidth: 250,
      fixed: "left",
    },
    {
      Header: "Tên Tour",
      accessor: "ServiceSaleName",
      minWidth: 250,
      fixed: "left",
    },
    {
      Header: "Người tạo",
      accessor: "CreateName",
      minWidth: 150,
    },
    {
      Header: "Thời gian",
      accessor: "CreateTime",
      minWidth: 150,
      Cell: (obj) => FormatDateJson(obj.value, 10),
    },
    {
      Header: "Người Sửa",
      accessor: "EditName",
      minWidth: 150,
    },
    {
      Header: "Thời gian sửa",
      accessor: "EditTime",
      minWidth: 150,
      Cell: (obj) => {
        return obj?.value ? FormatDateJson(obj.value, 10) : "";
      },
    },
  ];

  return (
    <>
      <div className="content-wrapper">
        <div class="card-header border-left-red PrintInvoiceHide">
          <div class="row">
            <div class="col-sm-12 col-md-3">
              <h3 class="card-title font-weight-bold">
                PHIẾU BÀN GIAO TOUR ({settlementList.length})
              </h3>
            </div>
          </div>
        </div>
        <div class="card-body border-left-red PrintInvoiceHide">
          <div className="row">
            <DataTable data={settlementList} columns={columns} />
          </div>
        </div>
      </div>
      <Modal
        show={showForm}
        onHide={() => setShowForm(false)}
        aria-labelledby="example-custom-modal-styling-title"
        className=" custom-modal-w-90"
      >
        <Modal.Header className="p-2">
          <Modal.Title id="example-custom-modal-styling-title">
            <div class="text-center"></div>
          </Modal.Title>
          <button
            type="button"
            class="close"
            onClick={() => {
              onPrint();
            }}
          >
            <span aria-hidden="true">In</span>
          </button>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => setShowForm(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-2">
          <SettlementTourForm data={DataPrint} />
          <div id="headerPrint" style={{ display: "none" }}>
            <header
              style={{
                display: "table-header-group",
                position: "absolute",
                top: 0,
              }}
            >
              <div class="col-12 text-center header">
                <Img
                  src="../dist/img/logo-invoice.png"
                  style={{ width: "100%" }}
                />
              </div>
            </header>
          </div>
          <div id="footerPrint" style={{ display: "none" }}>
            <footer
              style={{
                display: "table-footer-group",
                position: "absolute",
                bottom: 0,
              }}
            >
              <Img
                src="../dist/img/logo-invoice-footer.png"
                style={{ width: "100%" }}
              />
            </footer>
          </div>
          <iframe
            id="ifmcontentstoprint"
            style={{ height: "0px", width: "0px", position: "absolute" }}
          ></iframe>
        </Modal.Body>
      </Modal>
    </>
  );
};

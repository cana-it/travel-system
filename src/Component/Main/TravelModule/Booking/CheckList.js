import React, { useEffect, useState } from "react";
import {
  Alerterror,
  Alertsuccess,
  ConfirmAlert,
  FormatDateJson,
  FormatMoney,
  setData,
} from "../../../../Utils";
import { SelectExpenseItem, SelectInvoiceStatus } from "../../../../Common";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import moment from "moment";
import { Modal } from "react-bootstrap";
const CheckListComp = ({
  onCheckList = () => {},
  onClose = () => {},
  Keys = 0, //Key=1 Tour Âu Úc, Key= 2 Tour Mỹ
  Visa = {},
  reload = 0,
}) => {
  const dispatch = useDispatch();
  const Creater = +localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const DepartmentId = +localStorage.getItem("DepartmentId");

  const [CheckListData, setCheckListData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (reload !== 0) {
      Trl_spCheckList_List(Keys);
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [reload]);

  const Trl_spCheckList_List = async (key) => {
    try {
      const pr = {
        Keys: key,
        Creater: Creater,
        VisaId: Visa?.VisaId,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCheckList_List",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      setCheckListData(list);
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const Trl_spCheckListVisa_Save = async () => {
    try {
      const pr = {
        Creater: Creater,
        VisaId: Visa?.VisaId,
        CheckList: CheckListData,
        CustomerId: Visa?.CustomerId,
        BookingId: Visa?.BookingId,
        BookingDetailId: Visa?.BookingDetailId,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCheckListVisa_Save",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      Alertsuccess("Lưu check list thành công");
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  const handleClose = () => {
    setShowModal(false);
    onClose(0);
    Keys = 0;
    onCheckList(0);
  };

  const updateTableData = (rowIndex, columnId, value) => {
    setCheckListData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          ;
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => handleClose()}
        backdrop="static"
        keyboard={false}
        size="xl"
        className={`custom-modal-w-90 z-maxxx`}
      >
        <Modal.Header className="py-2 border-bottom-0">
          <Modal.Title className="ml-auto">
            {Keys === 1 && <>CHECKLIST HỒ SƠ CHÂU ÂU ÚC</>}
            {Keys === 2 && <>CHECKLIST HỒ SƠ CHÂU MỸ</>}
          </Modal.Title>
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={() => handleClose()}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body class="p-1">
          <div className="col-md-12">
            <div className="row">
              <div class="col-sm-12 col-md-6">1. Họ & tên: {Visa?.Name}</div>
              <div class="col-sm-12 col-md-6">
                Hành trình: {Visa?.ServiceName}
              </div>
              <div class="col-sm-12 col-md-6">
                2. SĐT: {Visa?.Phone || Visa?.Tel}
              </div>
              <div class="col-sm-12 col-md-6">
                Code tour: {Visa?.ServiceSaleCode}
              </div>
              <div class="col-sm-12 col-md-6">
                3. Passport No: {Visa?.PassportCode}
              </div>
              <div class="col-sm-12 col-md-6">Số ngày: {Visa?.TotalDay}</div>
              <div className="col-sm-12 col-md-6">
                <div className="row">
                  <div class="col-sm-12 col-md-6">
                    Ngày cấp: {FormatDateJson(Visa?.PassportTimeFrom, 7)}
                  </div>
                  <div class="col-sm-12 col-md-6">
                    Ngày hết hạn: {FormatDateJson(Visa?.PassportTimeTo, 7)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 mt-2">
            <table
              width={"100%"}
              className="table table-bordered"
              cellPadding={5}
            >
              {CheckListData.map((item, index) => {
                return (
                  <>
                    {item.NumberIndex === 0 && (
                      <>
                        <tr
                          key={"row1_" + index}
                          style={customStyles.leverIndex1}
                        >
                          <td
                            rowSpan={2}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            STT
                          </td>
                          <td
                            rowSpan={2}
                            style={{ width: "50%", verticalAlign: "middle" }}
                          >
                            {item.Name}
                          </td>
                          <td colSpan={Keys === 1 ? 4 : 2}>Thông tin</td>
                          <td rowSpan={2} style={{ verticalAlign: "middle" }}>
                            Ghi chú
                          </td>
                        </tr>
                        {Keys === 1 && (
                          <tr
                            key={"row2_" + index}
                            style={customStyles.leverIndex1}
                          >
                            <td>Photo</td>
                            <td>Scan</td>
                            <td>Sao y</td>
                            <td>Gốc</td>
                          </tr>
                        )}
                        {Keys === 2 && (
                          <tr
                            key={"row2_" + index}
                            style={customStyles.leverIndex1}
                          >
                            <td>Photo</td>
                            <td>Gốc</td>
                          </tr>
                        )}
                      </>
                    )}
                    {item.NumberIndex !== 0 && (
                      <>
                        {item.LevelFormat !== 3 && (
                          <tr
                            key={"row_" + index}
                            style={
                              item.LevelFormat === 1
                                ? customStyles.leverIndex1
                                : customStyles.leverIndex2
                            }
                          >
                            <td>{item.NumberShow}</td>
                            <td style={{ wordBreak: "break-word" }}>
                              {item.Name}
                            </td>
                            {Keys === 1 && (
                              <>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </>
                            )}
                            {Keys === 2 && (
                              <>
                                <td></td>
                                <td></td>
                              </>
                            )}
                            <td></td>
                          </tr>
                        )}
                        {item.LevelFormat === 3 && (
                          <tr
                            key={"row_" + index}
                            style={customStyles.leverIndex3}
                          >
                            <td style={{ textAlign: "center" }}>
                              {item.NumberShow}
                            </td>
                            <td>{item.Name}</td>
                            {Keys === 1 && (
                              <>
                                <td style={{ textAlign: "center" }}>
                                  <input
                                    type="checkbox"
                                    onChange={(e) => {
                                      updateTableData(
                                        index,
                                        "Photo",
                                        !item.Photo
                                      );
                                    }}
                                    value={1}
                                    checked={item.Photo || false}
                                  />
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <input
                                    type="checkbox"
                                    onChange={(e) => {
                                      updateTableData(
                                        index,
                                        "Scan",
                                        !item.Scan
                                      );
                                    }}
                                    value={1}
                                    checked={item.Scan || false}
                                  />
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <input
                                    type="checkbox"
                                    onChange={(e) => {
                                      updateTableData(
                                        index,
                                        "CertifiedCopy",
                                        !item.CertifiedCopy
                                      );
                                    }}
                                    value={1}
                                    checked={item.CertifiedCopy || false}
                                  />
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <input
                                    type="checkbox"
                                    onChange={(e) => {
                                      updateTableData(
                                        index,
                                        "Original",
                                        !item.Original
                                      );
                                    }}
                                    value={1}
                                    checked={item.Original || false}
                                  />
                                </td>
                              </>
                            )}
                            {Keys === 2 && (
                              <>
                                <td style={{ textAlign: "center" }}>
                                  <input
                                    type="checkbox"
                                    onChange={(e) => {
                                      updateTableData(
                                        index,
                                        "Photo",
                                        !item.Photo
                                      );
                                    }}
                                    value={1}
                                    checked={item.Photo || false}
                                  />
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <input
                                    type="checkbox"
                                    onChange={(e) => {
                                      updateTableData(
                                        index,
                                        "Original",
                                        !item.Original
                                      );
                                    }}
                                    value={1}
                                    checked={item.Original || false}
                                  />
                                </td>
                              </>
                            )}
                            <td>
                              <input
                                value={item.Notes}
                                onChange={(e) =>
                                  updateTableData(
                                    index,
                                    "Notes",
                                    e.target.value
                                  )
                                }
                                type="text"
                                className="form-control"
                              />
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </>
                );
              })}
              <tr></tr>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="col-md-12">
            <button
              type="button"
              className="btn btn-sm btn-success pull-right"
              onClick={Trl_spCheckListVisa_Save}
            >
              <i class="fa fa-save pr-2"></i> Lưu
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const customStyles = {
  leverIndex1: {
    backgroundColor: "#e2f2ec",
    color: "#007bff",
    fontWeight: 600,
    textAlign: "center",
    fontSize: "18px",
  },
  leverIndex2: {
    backgroundColor: "#e2f2ec",
    color: "#333",
    fontWeight: 500,
    fontSize: "16px",
  },
  leverIndex3: {
    vertitalAlign: "middle",
  },
};

export const CheckList = React.memo(CheckListComp);

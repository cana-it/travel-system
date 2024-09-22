import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import SignatureCanvas from "react-signature-canvas";
import { useNavigate } from "react-router-dom";
import {
  Alertsuccess,
  Alerterror,
  ConfirmAlert,
} from "../../../../Utils";
import Resizer from "react-image-file-resizer";


export const StaffSignature = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const [SignatureInvoice, setSignatureInvoice] = useState();
  const [Sign, setSign] = useState(localStorage.getItem("Signature"));

  const Trl_spSignatureInvoice_Clear = () => {
    SignatureInvoice.clear();
  };

  const Trl_spStaff_Signature_Save = async () => {
    if (SignatureInvoice === undefined && imageSingature === null) {
      Alerterror("Vui lòng thực hiện chữ ký");
      return;
    }
    ConfirmAlert("Bạn có chắc chắn muốn xác nhận?", "", async () => {
      try {
        let Files = "";
        if (imageSingature !== null) {
          const image = await resizeFile(imageSingature);
          Files = image;
        } else {
          let signature =
            SignatureInvoice.getTrimmedCanvas().toDataURL("image/png");
          Files = signature;
        }
        let pr = {
          StaffId: +Creater,
          Signature: Files,
        };
        const params = {
          Json: JSON.stringify(pr),
          func: "Trl_spStaff_Signature_Save",
        };
        const respone = await mainAction.API_spCallServer(params, dispatch);
        if (respone.Status === "OK") {
          Alertsuccess(respone.ReturnMess);
          localStorage.setItem("Signature", Files);
          setSign(Files);
          navigate("/news?id=56");
          //if (SignatureInvoice !== undefined) SignatureInvoice.clear();
          return;
        } else {
          Alertsuccess(respone.ReturnMess);
          return;
        }
      } catch (error) {
        Alerterror("Lỗi server, liên hệ IT");
        return;
      }
    });
  };
  const [imageSingature, setImageSingature] = useState(null);
  const handleChangeFileAndImage = (e, type = 0) => {
    if (!e.target?.files || e.target?.files?.length === 0) {
      setImageSingature(null);
      return;
    }
    setImageSingature(e.target.files[0]);
    // setFilesVisa(arr);
  };
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        500,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });
  return (
    <>
      <div className="content-wrapper">
        <div class="card p-1 PrintInvoiceHide">
          <div class="card-header border-left-red p-0">
            <div class="row p-1">
              <div class="col-sm-12 col-md-3 d-flex align-items-center">
                <span className="card-title">CHỮ KÝ ĐIỆN TỬ</span>
              </div>
              <div class="col-sm-12 col-md-9 ">
                <button
                  onClick={(e) => {
                    Trl_spStaff_Signature_Save();
                  }}
                  type="button"
                  class="btn btn-sm btn-success pull-right margin-left-5"
                >
                  <i class="fa fa-save pr-2"></i>
                  Lưu
                </button>
              </div>
            </div>
          </div>

          <div class="card-body border-left-red">
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="row shadow-sm">
                  <h5 className="text-center pt-2 ml-2 mr-2">Upload chữ ký</h5>
                  <div style={{ height: 346 }}>
                    <input
                      type="file"
                      className="form-control2"
                      onChange={(e) => handleChangeFileAndImage(e, 1)}
                      accept="image/*"
                    />
                    <div className="">
                      {imageSingature && (
                        <img
                          src={URL.createObjectURL(imageSingature)}
                          alt=""
                          width={"auto"}
                          height={300}
                          className="image-upload"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="row shadow-sm">
                  <h5 className="text-center pt-2 ml-2">
                    Chữ ký điện tử
                    <button
                      type="button"
                      class="btn btn-sm btn-default pull-right ml-2"
                      onClick={Trl_spSignatureInvoice_Clear}
                    >
                      <i class="fa fa-undo"></i>
                    </button>
                  </h5>
                  <SignatureCanvas
                    penColor="black"
                    style={{ width: "100%", height: "300" }}
                    canvasProps={{
                      className: "sigCanvas SignatureCanvas",
                    }} /* SignatureCanvas */
                    ref={(ref) => {
                      setSignatureInvoice(ref);
                    }}
                  />
                </div>
              </div>
              <div className="col-md-6 com-sm-12 mt-4">
                Chữ ký hiện tại:
                <br />
                {Sign !== undefined && (
                  <img src={Sign} alt="message user image" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

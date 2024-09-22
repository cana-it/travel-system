import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { IMAGES_DOMAIN } from "../Services";

const ShowFilesComp = ({ fileData = {}, _type = 0 }) => {
  const [docs, setDocs] = useState("");
  const [isPreviewFile, setIsPreviewFile] = useState(false);
  const [f, setF] = useState([]);
  const [i, setI] = useState([]);

  useEffect(() => {
    if (fileData?.imageShow) {
      let arr = fileData?.imageShow?.split(",").filter((p) => p !== "" && p!=="undefined");
      setI(arr);
    }
    if (fileData?.fileShow) {
      let arr = fileData?.fileShow?.split(",").filter((p) => p !== "" && p!=="undefined");
      setF(arr);
    }
  }, [fileData]);
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
  return (
    <>
      {_type === 0 && (
        <>
          <div class="col-sm-12 col-md-6">
            {f.length > 0 && (
              <>
                File đính kèm <br />
                <div class="form-group">
                  <div className="">
                    {f.map((item, ix) => {
                      return (
                        <>
                          {item !== "" && (
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
                                <a
                                  href={IMAGES_DOMAIN + item}
                                  download
                                  target={"_blank"}
                                  className="px-3"
                                >
                                  <i class="fa fa-download"></i>
                                </a>
                                <i
                                  className="fa fa-eye pl-2 text-success cursor-pointer px-2"
                                  onClick={(e) => {
                                    setDocs(IMAGES_DOMAIN + item.replace("/", ""));
                                    setIsPreviewFile(true);
                                  }}
                                ></i>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
          <div class="col-sm-12 col-md-6">
            {i.length > 0 && (
              <>
                Hình ảnh đính kèm <br />
                <div class="form-group">
                  <div className="row">
                    {i.map((item, ix) => {
                      return (
                        <>
                          {item !== "" && (
                            <div
                              className="upload-file-item py-1 my-2 shadow-sm col-6 position-relative"
                              key={"b" + ix}
                            >
                              <img
                                src={IMAGES_DOMAIN + item}
                                alt=""
                                className="image-upload"
                              />

                              <a
                                href={IMAGES_DOMAIN + item}
                                download
                                target={"_blank"}
                                className="fa fa-eye  cursor-pointer position-absolute top-1 right-1"
                              ></a>
                            </div>
                          )}
                        </>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
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
        </>
      )}
      {_type === 1 && (
        <>
          File đính kèm <br />
          {f.length > 0 &&
            f.map((item, ix) => {
              return (
                <>
                  {item !== "" && (
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
                        <a
                          href={IMAGES_DOMAIN + item}
                          download
                          target={"_blank"}
                          className="px-3"
                        >
                          <i class="fa fa-download"></i>
                        </a>
                        <i
                          className="fa fa-eye pl-2 text-success cursor-pointer px-2"
                          onClick={(e) => {
                            setDocs(IMAGES_DOMAIN + item.replace("/", ""));
                            setIsPreviewFile(true);
                          }}
                        ></i>
                      </div>
                    </div>
                  )}
                </>
              );
            })}
        </>
      )}
      {_type === 2 && (
        <>
          Hình ảnh đính kèm<br />
          {i.length > 0 &&
            i.map((item, ix) => {
              return (
                <>
                  {item !== "" && (
                    <div
                      className="upload-file-item py-1 my-2 shadow-sm col-6 position-relative"
                      key={"b" + ix}
                    >
                      <img
                        height={"50px"}
                        src={IMAGES_DOMAIN + item}
                        alt=""
                        className="image-upload"
                      />

                      <a
                        href={IMAGES_DOMAIN + item}
                        download
                        target={"_blank"}
                        className="fa fa-eye cursor-pointer position-absolute top-1 right-1"
                      ></a>
                    </div>
                  )}
                </>
              );
            })}
        </>
      )}
    </>
  );
};

export const ShowFiles = React.memo(ShowFilesComp);

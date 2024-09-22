import React, { useEffect, useRef, useState } from "react";
import { IMAGES_DOMAIN } from "../../Services";
import { Alertwarning, ConfirmDeleteImg, } from "../../Utils";

const ImgMutilUploadComp = ({
  data = "",
  onData = () => { },
  onImageUpload = () => { },
  flag = 0,
  isReset = 0,
  isMutil = false,
  readOnly = false,
}) => {
  const inputRef = useRef(null);

  const [ImageUpload, setImageUpload] = useState([]);
  const [i, setI] = useState([]);

  useEffect(() => {
    if (data !== undefined) {
      let arr = data
        ?.split(",")
        .filter((p) => p !== "" && p !== "undefined");
      setI(arr);
    } else setI([]);
  }, [data]);

  useEffect(() => {
    if (isReset !== 0) { inputRef.current.value = null; setImageUpload([]) }
  }, [isReset]);

  useEffect(() => {
    if (flag === 1) {
      setImageUpload([]);
    }
  }, [flag]);

  const handleChangeFileAndImage = (e) => {

    if(isMutil === false){
      setI([]);
      let t = e.target.files;
      let check = true;
      let exName = t[0].name.slice(
        (Math.max(0, t[0].name.lastIndexOf(".")) || Infinity) + 1
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
    if (check) {
      let newListFile = [...e.target.files];
      setImageUpload(newListFile);
      onImageUpload(newListFile);
    }
    else {
      Alertwarning(
        'File không đúng định dạng! Vui lòng chọn lại file có định dạng "jpg", "jpeg", "png", "gif"'
      );
    }
    }
    else if(isMutil === true){
      let t = e.target.files;
      let check = true;
      for (let k = 0; k < t.length; k++) {
        let exName = t[k].name.slice(
          (Math.max(0, t[k].name.lastIndexOf(".")) || Infinity) + 1
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
      if (check) {
        let newListFile = [...ImageUpload, ...e.target.files];
        setImageUpload(newListFile);
        onImageUpload(newListFile);
      }
      else {
        Alertwarning(
          'File không đúng định dạng! Vui lòng chọn lại file có định dạng "jpg", "jpeg", "png", "gif"'
        );
      }
    }
     
  };

  const onFileDelete = (filename, type = "f") => {
    ConfirmDeleteImg("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {
      let showdata = [...i]; // list file đang hiển thị
      let checkfile = showdata.filter((e) => e !== "" && e !== filename) || [];
      setI(checkfile);
      onData(checkfile.join(","));
    });
  };


  return (
    <>
      <div className="form-group">
        {!readOnly && <>
          <label className="image-collapse-label2">
            <input
              type="file"
              className="image-collapse-file cursor-pointer"
              onChange={(e) => handleChangeFileAndImage(e)}
              accept="image/*"
              multiple = {isMutil}
              ref={inputRef}
              readOnly={readOnly}
            />
            <i className="fa fa-upload upload-file-btn"></i>
          </label>
        </>
        }
        <div className="row listimgupload">
          {ImageUpload.map((item, ix) => {
            return (
              <div
                className="upload-file-item py-1 my-2 shadow-sm col-3 position-relative"
                key={"bsds" + ix}
              >
                <img
                  src={URL.createObjectURL(item)}
                  alt=""
                  className="image-upload"
                  width={"70px"}
                />
                <i
                  className="fa fa-times pl-2 text-danger cursor-pointer position-absolute top-1 right-1 btn-cursor"
                  onClick={(e) =>
                    setImageUpload(ImageUpload.filter((_, p) => p !== ix))
                  }
                ></i>
              </div>
            );
          })}
        </div>
        <div className="row listimgupload">
          {i.length > 0 &&
            i.map((item, ix) => {
              return (
                <div
                  className="upload-file-item py-1 my-2 shadow-sm col-3 position-relative"
                  key={"b" + ix}
                >
                  <img
                    src={IMAGES_DOMAIN + item}
                    alt=""
                    className="image-upload"
                  />
                  {!readOnly &&
                    <span
                      className="position-absolute right-0"
                      style={{ width: "50px" }}
                    >
                      <i
                        className="fa fa-times pl-2 text-danger cursor-pointer position-absolute top-1 right-1 btn-cursor"
                        onClick={(e) => onFileDelete(item, "i")}
                      ></i>
                
                    </span>}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export const ImgMutilUpload = React.memo(ImgMutilUploadComp);
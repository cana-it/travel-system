import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";
import {
  Alertwarning,
  Alerterror,
  FormatDate,
  FormatDateJson,
} from "../../../../Utils";
import { IMAGES_DOMAIN } from "../../../../Services";
//import Modal from 'react-modal';
import { useLocation } from "react-router-dom";
import { Img } from "react-image";

export const CustomerInformation = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  //const [CustomerId,setCustomerId]=useState(0);
  const location = useLocation();
  useEffect(() => {
    const pr = new URLSearchParams(location.search);
    let _customerId = +pr.get("k") || 0;
    if (_customerId !== 0) Trl_spCustomer_List(_customerId);
  }, [location]);

  const [data, setData] = useState([]);

  const Trl_spCustomer_List = async (CustomerId) => {
    try {
      const pr = {
        CustomerId: CustomerId,
        CustomerSearch: "",
        CustomerTypeId: "",
        Creater: Creater,
        CreateName: CreateName,
      };

      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spCustomer_List",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      
      setData(list[0]);
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
      ;
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <div class="card-header border-left-red">
          <div class="row">
            <div class="col-sm-12 col-md-12">
              <h3 class="card-title font-weight-bold">Thông tin khách hàng</h3>
            </div>
          </div>
        </div>

        <div class="card-body border-left-red">
          <div class="row">
            <div className="col-md-3">
              <div class="card card-primary card-outline">
                <div class="card-body box-profile">
                  <div class="text-center">
                    <Img
                      class="profile-user-img img-fluid img-circle"
                      src={IMAGES_DOMAIN + data.Photo}
                      alt="User profile picture"
                    />
                  </div>

                  <h3 class="profile-username text-center">
                    {data?.CustomerName}
                  </h3>

                  <p class="text-muted text-center">{data?.CustomerCode}</p>

                  <ul class="list-group list-group-unbordered mb-3">
                    <li class="list-group-item">
                      <b>Sinh nhật</b>{" "}
                      <a class="float-right">
                        {FormatDateJson(data?.Brithday, 7)}
                      </a>
                    </li>
                    <li class="list-group-item">
                      <b>Giới tính</b> <a class="float-right">{data?.Sex}</a>
                    </li>
                    <li class="list-group-item">
                      <b>From</b> <a class="float-right">{data?.From}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div class="card">
                <div class="card-body">
                  <form class="form-horizontal">
                    <div class="form-group row">
                      <label for="inputEmail" class="col-sm-2 col-form-label">
                        Số điện thoại
                      </label>
                      <div class="col-sm-10">
                        <input
                          type="text"
                          value={data.Phone}
                          class="form-control"
                          readOnly={true}
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="inputEmail" class="col-sm-2 col-form-label">
                        Địa chỉ
                      </label>
                      <div class="col-sm-10">
                        <input
                          type="text"
                          value={data.Address}
                          class="form-control"
                          readOnly={true}
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="inputEmail" class="col-sm-2 col-form-label">
                        Hộ chiếu
                      </label>
                      <div class="col-sm-10">
                        <input
                          type="text"
                          value={
                            data.PassportCode +
                            " - DOI: " +
                            FormatDateJson(data?.PassportTimeFrom, 7) +
                            " - DOE: " +
                            FormatDateJson(data?.PassportTimeTo, 7)
                          }
                          class="form-control"
                          readOnly={true}
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="inputName" class="col-sm-2 col-form-label">
                        SALE
                      </label>
                      <div class="col-sm-10">
                        <input
                          type="email"
                          value={data.CreateName}
                          class="form-control"
                          readOnly={true}
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="inputName" class="col-sm-2 col-form-label">
                        Mã tour
                      </label>
                      <div class="col-sm-10">
                        <input
                          type="email"
                          value={data.ServiceSaleCode}
                          class="form-control"
                          readOnly={true}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const customStyles = {
  content: {
    top: "25%",
    left: "55%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    zIndex: "4",
  },
};

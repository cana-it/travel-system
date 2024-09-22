import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../../../Redux/Actions";

import {
  DataTable,
  SelectServiceSale,
  TableShowDataBooking,
} from "../../../../Common";
import "react-confirm-alert/src/react-confirm-alert.css";
import moment from "moment";


export const ManageBooking = () => {
  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");

  const [TimeSearch, setTimeSearch] = useState();
  const [serviceSaleSearch, setServiceSaleSearch] = useState({});

  const startOfMonth = moment().startOf("month").format("MM-DD-YYYY 00:00:00");
  const endOfMonth = moment().endOf("month").format("MM-DD-YYYY 23:59:59");

  useEffect(() => {
    setTimeSearch([new Date(startOfMonth), new Date(endOfMonth)]);
  }, []);

  const [bookingId, setBookingId] = useState(-1);

  return (
    <>
      <div className="content-wrapper">
        <div className="card card-primary">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h3 className="card-title">
                  <i className="fas fa-plus" />
                  <span className="font-weight-bold">Series Tour</span>
                </h3>
              </div>
              <div className="col-md-6 card-header-btn"></div>
            </div>
          </div>
          <div className="card-body ">
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-4 m-auto">
                <div class="form-group">
                  <span class="small font-weight-bold text-muted">Tour</span>
                  <div class="input-group">
                    <SelectServiceSale
                      onSelected={(e) => {
                        setServiceSaleSearch(e);
                        setBookingId(e?.BookingId || 0);
                      }}
                      items={serviceSaleSearch?.value || 0}
                      className={"w-100 select-custom z-maxx"}
                      type={1}
                    />
                  </div>
                </div>
              </div>
            </div>

            <TableShowDataBooking bookingId={bookingId} type={1} />
          </div>
        </div>
      </div>
    </>
  );
};

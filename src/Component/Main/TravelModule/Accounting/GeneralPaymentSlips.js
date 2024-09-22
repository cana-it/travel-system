import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { InvoiceCustomerMain } from "../Booking/InvoiceCustomerMain";

export const GeneralPaymentSlips = () => {
  let params = new useLocation();
  let prm = useLocation();
  useEffect(() => {
    if (prm.search.length > 0 && prm.search.includes("dpid")) {
      let id;
      let arrPr = prm.search.split("&");
      if (arrPr.length === 1) {
        id = +arrPr[0].replace(/\D/g, "");
      }
      if (arrPr.length > 1) {
        arrPr.forEach((item) => {
          if (item.includes("dpid")) {
            id = +item.replace(/\D/g, "");
          }
        });
      }
      if (id === 30) {
        setTypeOfReceipt("PĐXHC");
      }
      if (id === 33) {
        setTypeOfReceipt("PĐXKD");
      }
      if (id === 34) {
        setTypeOfReceipt("PĐXDH");
      }
      if (id === 32) {
        setTypeOfReceipt("PĐXVS");
      }
      if (id === 31) {
        setTypeOfReceipt("PĐXKT");
      }
      if (id === 37) {
        setTypeOfReceipt("PĐXMAR");
      }
      if (id === 1) {
        setTypeOfReceipt("PĐXIT");
      }
      if (id === 38) {
        setTypeOfReceipt("PĐXCS");
      }
      if (id === 14) {
        setTypeOfReceipt("PĐXVE");
      }
      if (id === 39) {
        setTypeOfReceipt("PĐXSP");
      }
      if (id === 35) {
        setTypeOfReceipt("PĐXHDV");
      }
      if (id === 13) {
        setTypeOfReceipt("PĐXHN");
      }
      if (id === 40) {
        setTypeOfReceipt("PĐXTL");
      }
    }

    /* let pr = new URLSearchParams(prm.search);
            setBookingPr(pr.get('bookingId'))
            alert(pr.get('bookingId')); */
  }, [prm.search]);
  const [DataObject, setDataObject] = useState({
    ObjectId: 4,
    ObjectName: "Phòng ban",
  });
  const [invoiceStyle, setInvoiceStyle] = useState({
    StyleId: 7,
    StyleName: "Chi",
    TypeInvoice: 6,
  });
  const [typeOfReceipt, setTypeOfReceipt] = useState("");

  return (
    <>
      <div className="content-wrapper pt-1 px-2 pb-2">
        <div className="center-item">
          <h3 class=" font-weight-bold text-dark fs-18 mb-0">PHIẾU ĐỀ XUẤT</h3>
        </div>
        <InvoiceCustomerMain
          Booking={{}}
          DataObject={DataObject}
          // handleShow={() => handleShow(14)}
          IsActive={Math.random()}
          invoiceStyle={invoiceStyle}
          onInvoiceInfor={() => {}}
          data={[]}
          TypeOfReceipt={typeOfReceipt}
        />
      </div>
    </>
  );
};

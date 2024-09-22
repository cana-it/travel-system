import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { InvoiceInternal } from "../Booking";

export const GeneralPaymentInternal = () => {
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
        setTypeOfReceipt("PĐXHCN");
      }
      if (id === 33) {
        setTypeOfReceipt("PĐXKDN");
      }
      if (id === 34) {
        setTypeOfReceipt("PĐXDHN");
      }
      if (id === 32) {
        setTypeOfReceipt("PĐXVSN");
      }
      if (id === 31) {
        setTypeOfReceipt("PĐXKTN");
      }
      if (id === 37) {
        setTypeOfReceipt("PĐXMARN");
      }
      if (id === 1) {
        setTypeOfReceipt("PĐXITN");
      }
      if (id === 38) {
        setTypeOfReceipt("PĐXCSN");
      }
      if (id === 14) {
        setTypeOfReceipt("PĐXVEN");
      }
      if (id === 39) {
        setTypeOfReceipt("PĐXSPN");
      }
      if (id === 35) {
        setTypeOfReceipt("PĐXHDVN");
      }
      if (id === 13) {
        setTypeOfReceipt("PĐXHNN");
      }
      if (id === 40) {
        setTypeOfReceipt("PĐXTLN");
      }
    }

    /* let pr = new URLSearchParams(prm.search);
            setBookingPr(pr.get('bookingId'))
            alert(pr.get('bookingId')); */
  }, [prm.search]);
  const [DataObject, setDataObject] = useState({
    ObjectId: 5,
    ObjectName: "Nhân viên",
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
          <h3 class=" font-weight-bold text-dark fs-18 mb-0">PNB</h3>
        </div>
        <InvoiceInternal
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

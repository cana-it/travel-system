import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
import { FormatDateJson } from "../Utils";
import moment from "moment";

let d = new Date();
const expiry =
  d.getMonth() == 11
    ? new Date(d.getFullYear() + 1, 0, 1)
    : new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());

const SelectServiceSale_Comp = ({
  onSelected = () => {},
  items = 0,
  className = "SelectMeno SelectMenoo",
  fromDate = moment(new Date()).format("MM/DD/YYYY"),
  toDate = new Date(
    expiry.getMonth() +
      1 +
      "/" +
      expiry.getDate() +
      "/" +
      (+expiry.getFullYear() + 1)
  ),
  type = 0,
  ServiceId = 0,
  init = "Vui lòng chọn tour",
}) => {
  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState();

  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  const dispatch = useDispatch();
  const Trl_spServiceSale_List = async () => {
    let pr = {
      FromDate: fromDate ? FormatDateJson(fromDate) : "01/01/2023 00:00:00",
      Todate: FormatDateJson(toDate),
      ServiceId: ServiceId,
      TextSearch: "",
      Type: type,
    };
    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spServiceSale_List",
    };
    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: init };
    let dataSelect = [];
    dataSelect.push(FirstData);
    list.forEach((e, index) => {
      dataSelect.push({
        value: e.ServiceSaleId,
        label: e.ServiceSaleCode,
        ...e,
      });
    });
    setData(dataSelect);
    if (items === 0) {
      setValueS(FirstData);
      onSelected(FirstData);
    } else {
      setValueS(dataSelect.find((a) => a.value === items));
      onSelected(dataSelect.find((a) => a.value === items));
    }
  };

  useEffect(() => {
    Trl_spServiceSale_List();
  }, [ServiceId]);

  useEffect(() => {
    if (items !== 0) {
      setValueS(data.filter((a) => a.value === items));
      //data.filter((a) => a.value === items);
    } else {
      setValueS({ value: 0, label: init });
    }
  }, [items]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectServiceSale = React.memo(SelectServiceSale_Comp);

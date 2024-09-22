import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectTourFromServiceComp = ({
  onSelected = () => {},
  ServiceId = -1,
  ServiceSaleId = 0,
  className = "SelectMeno",
}) => {
  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState();
  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const Trl_spServiceSale_FromServiceId = async () => {
    
    const params = {
      Json: JSON.stringify({
        ServiceId: ServiceId === -1 ? 0 : ServiceId,
        OfficerId: Creater,
      }),
      func: "Trl_spServiceSale_FromServiceId",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Vui lòng chọn" };
    let dataSelect = [],
      IsActive = 0;
    dataSelect.push(FirstData);
    list.forEach((element, index) => {
      dataSelect.push({
        value: element.ServiceSaleId,
        label: element.TourCode,
      });
      if (element.ServiceSaleId === ServiceSaleId) {
        IsActive = 1;
      }
    });

    setData(dataSelect);
    if (IsActive === 1) {
      let ListActive = list.filter((a) => a.ServiceSaleId === ServiceSaleId)[0];
      setValueS({
        value: ListActive.ServiceSaleId,
        label: ListActive.TourCode,
      });
    } else {
      setValueS(FirstData);
    }
  };

  useEffect(() => {
    
    Trl_spServiceSale_FromServiceId();
  }, [ServiceId]);

  useEffect(() => {
    if (ServiceSaleId !== 0 && ServiceSaleId !== -1) {
      let ar = data.find((a) => a.value === ServiceSaleId);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Vui lòng chọn" });
    } else {
      setValueS({ value: 0, label: "Vui lòng chọn" });
    }
  }, [ServiceSaleId]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectTourFromService = React.memo(SelectTourFromServiceComp);
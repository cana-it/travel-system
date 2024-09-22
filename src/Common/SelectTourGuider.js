import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectTourguiderComp = ({
  onSelected = () => {},
  TourGuiderId = -1,
  className = "w-100 select-custom",
  isFront = false,
}) => {
  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState();
  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  const dispatch = useDispatch();
  const Trl_spTouGuider_List = async () => {
    const pr = {
      TourGuiderId: 0,
    };
    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spTouGuider_List",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Vui lòng chọn" };
    let dataSelect = [],
      IsActive = 0;
    dataSelect.push(FirstData);
    //setValueS(FirstData);
    list.forEach((element, index) => {
      dataSelect.push({
        value: element.TourGuiderId,
        label: element.TourGuiderName + " - " + element.Phone,
        ...element,
      });
      if (element.TourGuiderId === TourGuiderId) {
        IsActive = 1;
      }
    });

    setData(dataSelect);
    if (IsActive === 1) {
      let ListActive = list.filter((a) => a.TourGuiderId === TourGuiderId)[0];
      setValueS({
        value: ListActive.TourGuiderId,
        label: ListActive.TourGuiderName + " - " + ListActive.Phone,
      });
    }
  };

  useEffect(() => {
    Trl_spTouGuider_List();
  }, []);

  useEffect(() => {
    if (TourGuiderId !== 0 && TourGuiderId !== -1) {
      let ar = data.find((a) => a.value === TourGuiderId);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Vui lòng chọn" });
    } else {
      setValueS({ value: 0, label: "Vui lòng chọn" });
    }
  }, [TourGuiderId]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
      menuPortalTarget={isFront ? document.querySelector("body") : null}
    />
  );
};

export const SelectTourGuider = React.memo(SelectTourguiderComp);

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectContinentComp = ({
  onSelected = () => {},
  LocationId = -1,
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
  const Trl_spLocation_List = async () => {
    const params = {
      Json: JSON.stringify({
        Level: 1,
        ParentId: 0,
      }),
      func: "Trl_spLocation_List",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Vui lòng chọn" };
    let dataSelect = [],
      IsActive = 0;
    dataSelect.push(FirstData);
    //setValueS(FirstData);
    list.forEach((element, index) => {
      dataSelect.push({
        value: element.LocationId,
        label: element.LocationName,
      });
      if (element.LocationId === LocationId) {
        IsActive = 1;
      }
    });

    setData(dataSelect);
    if (IsActive === 1) {
      let ListActive = list.filter((a) => a.LocationId === LocationId)[0];
      setValueS({
        value: ListActive.LocationId,
        label: ListActive.LocationName,
      });
    }
  };

  useEffect(() => {
    Trl_spLocation_List();
  }, []);

  useEffect(() => {
    if (LocationId !== 0 && LocationId !== -1) {
      let ar = data.find((a) => a.value === LocationId);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Vui lòng chọn" });
    } else {
      setValueS({ value: 0, label: "Vui lòng chọn" });
    }
  }, [LocationId]);

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

export const SelectContinent = React.memo(SelectContinentComp);

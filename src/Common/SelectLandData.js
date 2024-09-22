import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
import { useLayoutEffect } from "react";
const SelectLandDataComp = ({
  onSelected = () => {},
  LandId = 0,
  className = "SelectMeno",
  isDisabled = false,
}) => {
  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState();
  const onSelecteItem = (item) => {
    if (isDisabled) return;
    onSelected(item);
    setValueS(item);
  };

  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");

  const Trl_spOperating_Land_List = async () => {
    const pr = {
      Creater: +Creater,
    };
    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spOperating_Land_List",
    };
    const List = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Vui lòng chọn" };
    let dataSelect = [],
      IsActive = 0;
    dataSelect.push(FirstData);
    List.forEach((element, index) => {
      dataSelect.push({ value: element.LandId, label: element.LandName });
      if (element.LandId === LandId) {
        IsActive = 1;
      }
    });
    setData(dataSelect);
    if (IsActive === 1) {
      let ListActive = List.filter((a) => a.LandId === LandId)[0];
      setValueS({
        value: ListActive.LandId,
        label: ListActive.LandName,
      });
    }
  };

  useLayoutEffect(() => {
    Trl_spOperating_Land_List();
  }, []);

  useEffect(() => {
    ;
    if (LandId !== 0 && LandId !== -1) {
      let ar = data.find((a) => a.value === LandId);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Vui lòng chọn" });
    } else {
      setValueS({ value: 0, label: "Vui lòng chọn" });
    }
  }, [LandId]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectLandData = React.memo(SelectLandDataComp);

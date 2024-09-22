import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectPostionComp = ({
  onSelected = () => {},
  onPositionId = 0,
  PositionId = -1,
  PositionName = "",
  className = "SelectMeno",
}) => {
  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState();
  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  const dispatch = useDispatch();

  const PositionID = PositionId;
  const _onPositionID = onPositionId;
  const Trl_spStaff_Position_List = async () => {
    let pr = {
      PositionId: 0,
      Keysearch: "",
    };
    const params = {
      Json: JSON.stringify(pr),
      func: "Trl_spStaff_Position_List",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Chọn chức danh" };
    let dataSelect = [],
      IsActive = 0;
    dataSelect.push(FirstData);
    //setValueS(FirstData);
    list.forEach((element, index) => {
      dataSelect.push({
        value: element.PositionId,
        label: element.PositionName,
      });
      if (element.PositionId === _onPositionID) {
        IsActive = 1;
      }
    });

    setData(dataSelect);
    if (IsActive === 1) {
      let ListActive = list.filter((a) => a.PositionId === _onPositionID)[0];
      setValueS({
        value: ListActive.PositionId,
        label: ListActive.PositionName,
      });
    }
  };

  useEffect(() => {
    Trl_spStaff_Position_List();
  }, [PositionID]);

  useEffect(() => {
    if (_onPositionID !== 0 && _onPositionID !== -1) {
      let ar = data.find((a) => a.value === _onPositionID);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Chọn chức danh" });
    } else {
      setValueS({ value: 0, label: "Chọn chức danh" });
    }
  }, [_onPositionID]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectPostion = React.memo(SelectPostionComp);

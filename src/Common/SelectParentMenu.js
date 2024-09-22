import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectParentMenuComp = ({
  onSelected = () => { },
  onParentId = 0,
  ParentId = -1,
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
  const CreateName = localStorage.getItem("CreateName");
  const ParentID = ParentId;
  const _onParentId = onParentId;
  const CMS_spMenu_List = async () => {
    const params = {
      Json: JSON.stringify({
        Creater: Creater,
        ParentID: _onParentId !== 0 ? -1 : ParentID,
      }),
      func: "CMS_spMenu_Select",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Vui lòng chọn" };
    let dataSelect = [],
      IsActive = 0;
    dataSelect.push(FirstData);

    list.forEach((element, index) => {
      dataSelect.push({ value: element.ParentID, label: element.ParentName });
      if (element.ParentID === _onParentId) {
        IsActive = 1;
      }
    });

    setData(dataSelect);
    if (IsActive === 1) {
      let ListActive = list.filter((a) => a.ParentID === _onParentId)[0];
      setValueS({
        value: ListActive.ParentID,
        label: ListActive.ParentName,
      });
    }
  };

  useEffect(() => {
    CMS_spMenu_List();
  }, [ParentID]);

  useEffect(() => {
    if (_onParentId !== 0 && _onParentId !== -1) {
      let ar = data.find((a) => a.value === _onParentId);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Vui lòng chọn" });
    } else {
      setValueS({ value: 0, label: "Vui lòng chọn" });
    }
  }, [_onParentId]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectParentMenu = React.memo(SelectParentMenuComp);

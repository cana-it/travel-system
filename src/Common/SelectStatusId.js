import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectStatusIdComp = ({
  onSelected = () => {},
  onStatusId = 0,
  StatusId = -1,
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
  const StatusID = StatusId;
  const _onStatusId = onStatusId;
  const CMS_spContact_Select = async () => {
    const params = {
      Json: JSON.stringify({
        Creater: Creater,
        StatusID: _onStatusId !== 0 ? -1 : StatusID,
      }),
      func: "CMS_spContact_Select",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Chọn trạng thái" };
    let dataSelect = [],
      IsActive = 0;
    dataSelect.push(FirstData);
    //setValueS(FirstData);
    list.forEach((element, index) => {
      dataSelect.push({ value: element.StatusID, label: element.StatusName });
      if (element.StatusID === _onStatusId) {
        IsActive = 1;
      }
    });

    setData(dataSelect);
    if (IsActive === 1) {
      let ListActive = list.filter((a) => a.StatusID === _onStatusId)[0];
      setValueS({
        value: ListActive.StatusID,
        label: ListActive.StatusName,
      });
    }
  };

  useEffect(() => {
    CMS_spContact_Select();
  }, [StatusID]);

  useEffect(() => {
    if (_onStatusId !== 0 && _onStatusId !== -1) {
      let ar = data.find((a) => a.value === _onStatusId);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Chọn trạng thái" });
    } else {
      setValueS({ value: 0, label: "Chọn trạng thái" });
    }
  }, [_onStatusId]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectStatusId = React.memo(SelectStatusIdComp);

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectBranchComp = ({
  onSelected = () => {},
  onBranchId = 0,
  BranchId = -1,
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
  const BranchID = BranchId;
  const _onBranchID = onBranchId;
  const Trl_spBranch_List = async () => {
    const params = {
      Json: JSON.stringify({
        Creater: Creater,
        BranchId: _onBranchID !== 0 ? -1 : BranchID,
      }),
      func: "Trl_spBranch_List",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Chọn C.Nhánh" };
    let dataSelect = [],
      IsActive = 0;
    dataSelect.push(FirstData);
    //setValueS(FirstData);
    list.forEach((element, index) => {
      dataSelect.push({ value: element.BranchId, label: element.BranchName });
      if (element.BranchId === _onBranchID) {
        IsActive = 1;
      }
    });

    setData(dataSelect);
    if (IsActive === 1) {
      let ListActive = list.filter((a) => a.BranchId === _onBranchID)[0];
      setValueS({
        value: ListActive.BranchId,
        label: ListActive.BranchName,
      });
    }
  };

  useEffect(() => {
    Trl_spBranch_List();
  }, [BranchID]);

  useEffect(() => {
    if (_onBranchID !== 0 && _onBranchID !== -1) {
      let ar = data.find((a) => a.value === _onBranchID);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Chọn C.Nhánh" });
    } else {
      setValueS({ value: 0, label: "Chọn C.Nhánh" });
    }
  }, [_onBranchID]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectBranch = React.memo(SelectBranchComp);

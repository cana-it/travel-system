import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectGuaranteeComp = ({
  onSelected = () => {},
  onGuaranteeId = 0,
  GuaranteeId = -1,
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
  const GuaranteeID = GuaranteeId;
  const _onGuaranteeID = onGuaranteeId;
  const Trl_spGuarantee_List = async () => {
    const params = {
      Json: JSON.stringify({
        Creater: Creater,
        GuaranteeId: _onGuaranteeID !== 0 ? -1 : GuaranteeID,
      }),
      func: "Trl_spGuarantee_List",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Chọn loại bảo hành" };
    let dataSelect = [],
      IsActive = 0;
    dataSelect.push(FirstData);
    //setValueS(FirstData);
    list.forEach((element, index) => {
      dataSelect.push({ value: element.GuaranteeId, label: element.GuaranteeName });
      if (element.GuaranteeId === _onGuaranteeID) {
        IsActive = 1;
      }
    });

    setData(dataSelect);
    if (IsActive === 1) {
      let ListActive = list.filter((a) => a.GuaranteeId === _onGuaranteeID)[0];
      setValueS({
        value: ListActive.GuaranteeId,
        label: ListActive.GuaranteeName,
      });
    }
  };

  useEffect(() => {
    Trl_spGuarantee_List();
  }, [GuaranteeID]);

  useEffect(() => {
    if (_onGuaranteeID !== 0 && _onGuaranteeID !== -1) {
      let ar = data.find((a) => a.value === _onGuaranteeID);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Chọn loại bảo hành" });
    } else {
      setValueS({ value: 0, label: "Chọn loại bảo hành" });
    }
  }, [_onGuaranteeID]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectGuarantee = React.memo(SelectGuaranteeComp);

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectTrademarkComp = ({
  onSelected = () => { },
  onTrademarkId = 0,
  TrademarkId = -1,
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
  const TrademarkID = TrademarkId;
  const _onTrademarkID = onTrademarkId;
  const CMS_spTrademark_List = async () => {
    const params = {
      Json: JSON.stringify({
        Creater: Creater,
        TrademarkId: _onTrademarkID !== 0 ? -1 : TrademarkID,
      }),
      func: "CMS_spTrademark_List",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Chọn Menu" };
    let dataSelect = [
      { value: 1, label: "Chưa xử lý" },
      { value: 2, label: "Đang xử lý" },
      { value: 3, label: "Đã xử lý" },
    ],
      IsActive = 0;
    dataSelect.push(FirstData);
    //setValueS(FirstData);
    list.forEach((element, index) => {
      dataSelect.push({ value: element.TrademarkId, label: element.TrademarkName });
      if (element.TrademarkId === _onTrademarkID) {
        IsActive = 1;
      }
    });

    setData(dataSelect);
    if (IsActive === 1) {
      let ListActive = list.filter((a) => a.TrademarkId === _onTrademarkID)[0];
      setValueS({
        value: ListActive.TrademarkId,
        label: ListActive.TrademarkName,
      });
    }
  };

  useEffect(() => {
    CMS_spTrademark_List();
  }, [TrademarkID]);

  useEffect(() => {
    if (_onTrademarkID !== 0 && _onTrademarkID !== -1) {
      let ar = data.find((a) => a.value === _onTrademarkID);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Chọn Menu" });
    } else {
      setValueS({ value: 0, label: "Chọn Menu" });
    }
  }, [_onTrademarkID]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectTrademark = React.memo(SelectTrademarkComp);

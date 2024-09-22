import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectBannerTypeComp = ({
  onSelected = () => { },
  onBannerTypeId = 0,
  BannerTypeId = -1,
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
  const BannerTypeID = BannerTypeId;
  const _onBannerTypeId = onBannerTypeId;
  const CMS_spSlide_Select = async () => {
    const params = {
      Json: JSON.stringify({
        Creater: Creater,
        BannerTypeId: _onBannerTypeId !== 0 ? -1 : BannerTypeId,
      }),
      func: "CMS_spSlide_Select",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Vui lòng chọn" };
    let dataSelect = [],
      IsActive = 0;
    dataSelect.push(FirstData);
    //setValueS(FirstData);
    list.forEach((element, index) => {
      dataSelect.push({ value: element.BannerTypeId, label: element.BannerTypeName });
      if (element.BannerTypeId === _onBannerTypeId) {
        IsActive = 1;
      }
    });

    setData(dataSelect);
    if (IsActive === 1) {
      let ListActive = list.filter((a) => a.BannerTypeId === _onBannerTypeId)[0];
      setValueS({
        value: ListActive.BannerTypeId,
        label: ListActive.BannerTypeName,
      });
    }
  };

  useEffect(() => {
    CMS_spSlide_Select();
  }, [BannerTypeId]);

  useEffect(() => {
    if (_onBannerTypeId !== 0 && _onBannerTypeId !== -1) {
      let ar = data.find((a) => a.value === _onBannerTypeId);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Vui lòng chọn" });
    } else {
      setValueS({ value: 0, label: "Vui lòng chọn" });
    }
  }, [_onBannerTypeId]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectBannerType = React.memo(SelectBannerTypeComp);

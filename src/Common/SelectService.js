import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import I18n from "../Language";
import { mainAction } from "../Redux/Actions";
import { useLayoutEffect } from "react";

const SelectServiceComp = ({
  onSelected = () => {},
  items = 0,
  type = 1,
  IsFirst = {
    value: 0,
    label:
      type === 1
        ? "Chọn tuyến điểm"
        : type === 2
        ? "Chọn thị trường"
        : "Chọn tất cả",
  },
  isMulti = false,
  className = "SelectMeno",
  disabled = false,
}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState({
    value: 0,
    label:
      type === 1
        ? "Chọn tuyến điểm"
        : type === 2
        ? "Chọn thị trường"
        : "Chọn tất cả",
  });
  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  const LoadData = async () => {
    const params = {
      Json: JSON.stringify({
        TextSearch: "",
        UserId: 1,
        Type: type,
      }),
      func: "Trl_spService_List",
    };
    const list = await mainAction.API_spCallServer(params, dispatch);
    let dataSelect = [];
    dataSelect.push(IsFirst);
    list.forEach((element, index) => {
      dataSelect.push({
        value: element.ServiceId,
        label: element.ServiceCode + " - " + element.ServiceName,
        ...element,
      });
    });
    if (items !== 0) {
      let ar = dataSelect.find((a) => a.value === items);
      ar ? setValueS(ar) : setValueS(IsFirst);
    } // Active
    setData(dataSelect);
  };

  useLayoutEffect(() => {
    LoadData();
  }, []);

  useEffect(() => {
    if (items != 0) {
      let ar = data.filter((a) => a.value === items);
      ar.length > 0
        ? setValueS(ar[0])
        : setValueS({
            value: 0,
            label:
              type === 1
                ? "Chọn tuyến điểm"
                : type === 2
                ? "Chọn thị trường"
                : "Chọn tất cả",
          });
    } else {
      if (isMulti === false) {
        setValueS({
          value: 0,
          label:
            type === 1
              ? "Chọn tuyến điểm"
              : type === 2
              ? "Chọn thị trường"
              : "Chọn tất cả",
        });
      } else {
        setValueS([]);
      }
    }
  }, [items]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
      isMulti={isMulti}
      disabled={disabled}
    />
  );
};

export const SelectService = React.memo(SelectServiceComp);

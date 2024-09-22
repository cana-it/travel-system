import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectOperatingDataComp = ({
  onSelected = () => {},
  CityId = -1,
  Type = 0,
  operatingId = 0,
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
  const Trl_spOperatingData_List = async () => {
    const params = {
      Json: JSON.stringify({
        CityId: CityId,
        Type: Type,
      }),
      func: "Trl_spOperatingData_List",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Vui lòng chọn" };
    let dataSelect = [];
    if (Type === 0) {
      list.forEach((element, index) => {
        dataSelect.push({
          value: element.VehicleId,
          label: element.VehicleName,
          ...element,
        });
        // if (element.Are === VehicleId) {
        //   IsActive = 1;
        // }
      });

      setData(dataSelect);

      setValueS(FirstData);
    } else if (Type === 1) {
      list.forEach((element, index) => {
        dataSelect.push({
          value: element.HotelId,
          label: element.HotelName,
          ...element,
        });
      });

      setData(dataSelect);
      setValueS(FirstData);
    }else if (Type === 4) {
      list.forEach((element, index) => {
        dataSelect.push({
          value: element.SightseeingId,
          label: element.SightseeingName,
          ...element,
        });
      });

      setData(dataSelect);
      setValueS(FirstData);
    } else {
      list.forEach((element, index) => {
        dataSelect.push({
          value: element.RestaurantId,
          label: element.RestaurantName,
          ...element,
        });
      });

      setData(dataSelect);

      setValueS(FirstData);
    }
    return dataSelect;
  };

  useEffect(() => {
    operatingId === 0 && Trl_spOperatingData_List();
  }, []);

  useEffect(() => {
    const abc = async () => {
      if (CityId !== 0 && CityId !== -1) {
        let ab = await Trl_spOperatingData_List();
        let ar = ab.find((a) => a.value === operatingId);
        ar ? setValueS(ar) : setValueS({ value: 0, label: "Vui lòng chọn" });
      } else {
        setValueS({ value: 0, label: "Vui lòng chọn" });
      }
    };
    abc();
  }, [CityId]);

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

export const SelectOperatingData = React.memo(SelectOperatingDataComp);

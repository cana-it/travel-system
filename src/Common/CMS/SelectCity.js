import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { mainAction } from "../../Redux/Actions";
import { useDispatch } from "react-redux";
const animatedComponents = makeAnimated();

const SelectCity_ = React.forwardRef(
  (
    {
      onSelected = () => {},
      IsFirst = { value: 0, label: "Vui lòng chọn" },
      isMulti = false,
      customStyles = {},
      activer = [], // multi
      LocationId = 0,
      type = 0,
    },
    ref
  ) => {
    const [data, setData] = useState([]);
    const [valueS, setValueS] = useState();
    const dispatch = useDispatch();
    useEffect(() => {
      Trl_spLocation_Select();
    }, []);

    const onSelecteItem = (item) => {
      onSelected(item);
      setValueS(item);
    };

    const Trl_spLocation_Select = async () => {
      let pr = {
        LocationId: 0,
        LocationLevel: 2,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spLocation_Select",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      const FirstData = IsFirst;
      let dataSelect = [];
      setValueS(FirstData);
      type === 1 && dataSelect.push({ value: 0, label: "Chọn tất cả" });
      list.length > 0 &&
        list.forEach((element, index) => {
          dataSelect.push({
            value: element.LocationId,
            label: element.LocationName,
            data: element,
          });
        });
      // Active multi
      if (activer.length > 0) {
        let datatam = [],
          valuetam = "";
        activer.forEach((element, index) => {
          if (element !== -1 && element !== 0) {
            valuetam = dataSelect.find((a) => a.value === element);
            datatam.push(valuetam);
          }
        });
        setValueS(datatam);
      }
      setData(dataSelect);
    };
    useEffect(() => {
      if (data.length === 0 && LocationId !== 0) {
        Trl_spLocation_Select();
      } else {
        if (activer.length === 0) {
          setValueS(data.find((p) => p.value === LocationId));
        }
      }
    }, [data, LocationId]);
    //multi
    useEffect(() => {
      if (activer.length > 0 && data.length > 0) {
        let datatam = [],
          valuetam = "";
        activer.forEach((element, index) => {
          if (element !== -1 && element !== 0) {
            valuetam = data.find((a) => a.value === +element);
            datatam.push(valuetam);
          }
        });
        setValueS(datatam);
        return;
      }
      return;
    }, [activer]);

    return (
      <Select
        placeholder="Vui lòng chọn"
        styles={customStyles}
        components={animatedComponents}
        defaultValue={valueS}
        value={valueS}
        onChange={onSelecteItem}
        options={data}
        isMulti={isMulti}
      />
    );
  }
);

export const SelectCity = SelectCity_;

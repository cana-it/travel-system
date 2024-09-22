import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { mainAction } from "../../Redux/Actions";
import { useDispatch } from "react-redux";
const animatedComponents = makeAnimated();

const SelectStartPoint_ = React.forwardRef(
  (
    {
      onSelected = () => {},
      IsFirst = { value: 0, label: "Vui lòng chọn" },
      isMulti = false,
      customStyles = {},
      activer = [], // multi
      StartPointId = 0,
    },
    ref
  ) => {
    const [data, setData] = useState([]);
    const [valueS, setValueS] = useState();
    const dispatch = useDispatch();
    useEffect(() => {
      Trl_spStartPoint_Select();
    }, []);

    const onSelecteItem = (item) => {
      onSelected(item);
      setValueS(item);
    };

    const Trl_spStartPoint_Select = async () => {
      let pr = {
        StartPointId: 0,
      };
      const params = {
        Json: JSON.stringify(pr),
        func: "Trl_spStartPoint_Select",
      };
      const list = await mainAction.API_spCallServer(params, dispatch);
      let dataSelect = [];
      setValueS(IsFirst);

      list.length > 0 &&
        list.forEach((element, index) => {
          dataSelect.push({
            value: element.StartPointId,
            label: element.NameStartPoint,
            data: element,
          });
        });
      // Active multi
      if (activer.length > 0) {
        let dataTemp = [];
        activer.forEach((element, index) => {
          if (element !== -1 && element !== 0) {
            let res = dataSelect.find((a) => a.value === element);
            dataTemp.push(res);
          }
        });
        setValueS(dataTemp);
      }
      setData(dataSelect);
    };
    useEffect(() => {
      if (data.length === 0 && StartPointId !== 0) {
        Trl_spStartPoint_Select();
      } else {
        if (activer.length === 0) {
          setValueS(data.find((p) => p.value === StartPointId));
        }
      }
    }, [data, StartPointId]);

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
      }
    }, [activer]);

    return (
      <Select
        placeholder="Chọn điểm bắt đầu"
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

export const SelectStartPoint = SelectStartPoint_;

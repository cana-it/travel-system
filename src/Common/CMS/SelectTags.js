import React, { useEffect, useState } from "react";
import Select from "react-select";
import I18n from "i18n-js";
import { mainAction } from "../../Redux/Actions";
import { useDispatch } from "react-redux";
const SelectTagsComp = React.forwardRef(
  (
    {
      onSelected = () => {},
      activer = [], // multi
      Type = "GALERY",
      isMulti = false,
    },
    ref
  ) => {
    const dispatch = useDispatch();
    const FirstData = { value: 0, label: "Vui lòng chọn" };
    const [data, setData] = useState([]); //danh sách tất cả các tags
    const [valueS, setValueS] = useState([]);

    useEffect(() => {
      CMS_spTags_List();
    }, []);

    useEffect(() => {
      CMS_spTags_List();
    }, [activer]);

    const onSelecteItem = (item) => {
      //onSelected(item);
      if (isMulti) {
        let tmp = [];
        item.forEach((element, index) => {
          //nếu có parentId thì phải tự động tag thêm parentId
          tmp.push(element);
          if (element.obj.ParentId !== 0)
            tmp = getParent(data, tmp, element.obj.ParentId);
        });
        setValueS(tmp);
        onSelected(tmp);
      } else {
        onSelected(item);
        setValueS(item);
      }
    };

    const CMS_spTags_List = async () => {
      try {
        const params = {
          Json: JSON.stringify({ TagsType: Type }),
          func: "CMS_spTags_List",
        };

        const list = await mainAction.API_spCallServer(params, dispatch);
        let dataSelect = [];

        //Lặp data theo parent - child
        if (list?.filter((p) => p.ParentId === 0).length > 0) {
          list.forEach((element, index) => {
            dataSelect.push({
              value: element.TagId,
              label: element.TagName, //"#" + element.TagUrl,
              obj: element,
            });
            dataSelect = getChild(list, dataSelect, element.TagId, "--> ");
          });
        }
        setData(dataSelect);

        // Active data
        if (activer.length > 0) {
          let datatam = [],
            valuetam = "";
          activer.forEach((element, index) => {
            if (element.value !== -1 && element.value !== 0) {
              valuetam = dataSelect.find((a) => a.value === element.value);
              datatam.push(valuetam);
              //nếu có parentId thì phải tự động tag thêm parentId
              if (valuetam.obj.ParentId !== 0)
                datatam = getParent(dataSelect, datatam, valuetam.obj.ParentId);
            }
          });
          setValueS([...new Set(datatam)]);
        }
      } catch (e) {
      }
    };

    const getChild = (data, current, id, tabStr = "") => {
      let arr = current;
      let tmp = data.filter((p) => p.ParentId === id);
      tmp.forEach((element, index) => {
        arr.push({
          value: element.TagId,
          label: tabStr + element.TagName, //"#" + element.TagUrl,
          obj: element,
        });
        arr = getChild(data, arr, element.TagId, "--" + tabStr);
      });
      return arr;
    };

    const getParent = (data, current, id) => {
      let arr = current;
      if (current.filter((p) => p.value === id)?.length === 0) {
        let tmp = data.find((a) => a.value === id);
        arr.push(tmp);
        if (tmp.obj.ParentId !== 0) {
          let t = getParent(data, arr, tmp.obj.ParentId);
          arr = t;
        }
      }
      return arr;
    };
    return (
      <Select
        className="w-full"
        value={valueS}
        onChange={onSelecteItem}
        options={data}
        ref={ref}
        isMulti={isMulti}
        style={{ minWidth: "200px" }}
      />
    );
  }
);

export const SelectTags = React.memo(SelectTagsComp);

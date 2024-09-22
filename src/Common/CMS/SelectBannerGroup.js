import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { mainAction } from '../../Redux/Actions';
import { useDispatch } from 'react-redux';
const animatedComponents = makeAnimated();

const SelectBannerGroup_ = React.forwardRef(
    (
        {
            onSelected = () => { },
            IsFirst = { value: 0, label: "Vui lòng chọn" },
            isMulti = false,
            customStyles = {},
            activer = [],// multi
            BannerGroupId = 0
        },
        ref
    ) => {
        const [data, setData] = useState([])
        const [valueS, setValueS] = useState()
        const dispatch = useDispatch();
        useEffect(() => {
            Trl_spBanner_Group_Select();
        }, [])

        const onSelecteItem = (item) => {
            onSelected(item)
            setValueS(item);
        }

        const Trl_spBanner_Group_Select = async () => {
            let pr = {
                BannerGroupId: 0
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spBanner_Group_Select",
            }
            const list = await mainAction.API_spCallServer(params, dispatch);
            const FirstData = IsFirst;
            let dataSelect = []
            setValueS(FirstData);
            dataSelect.push(FirstData);

            list.length > 0 && list.forEach((element, index) => {
                dataSelect.push({
                    value: element.BannerGroupId,
                    label: element.BannerName,
                    data: element,
                });

            });
            // Active multi
            if (activer.length > 0) {
                let datatam = [], valuetam = "";
                activer.forEach((element, index) => {
                    if (element !== -1 && element !== 0) {
                        valuetam = dataSelect.find(a => a.value === element);
                        datatam.push(valuetam);
                    }
                });
                setValueS(datatam);
            }
            setData(dataSelect);

        }
        useEffect(() => {
            if (data.length === 0 & BannerGroupId !== 0) {
                Trl_spBanner_Group_Select()
            } else {
                setValueS(data.find((p) => p.value === BannerGroupId));
            }
        }, [data, BannerGroupId]);
        //multi
        useEffect(() => {
            if (activer.length > 0 & data.length > 0) {
                let datatam = [], valuetam = "";
                activer.forEach((element, index) => {
                    if (element !== -1 && element !== 0) {
                        valuetam = data.find(a => a.value === +element);
                        datatam.push(valuetam);
                    }
                });
                setValueS(datatam);
                return
            }
            return
        }, [activer]);

        return (
            <Select styles={customStyles}
                components={animatedComponents}
                defaultValue={valueS}
                value={valueS}
                onChange={onSelecteItem}
                options={data}
                isMulti={isMulti}
            />
        )
    }
);


export const SelectBannerGroup = SelectBannerGroup_

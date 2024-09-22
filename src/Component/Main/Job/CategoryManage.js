import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../Redux/Actions';
import DateTimePicker from 'react-datetime-picker';
import {Alertwarning,Alertsuccess,Alerterror, FormatDateJson} from '../../../Utils';
import {CategoryList} from '../'
export const CategoryManage = () => {

    return (
        <>
        <div class="content-wrapper" style={{ backgroundColor: '#ffff'}}>
            <CategoryList />
        </div>
        </>
    )
}

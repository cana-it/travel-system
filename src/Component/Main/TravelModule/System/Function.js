import { IMAGES_DOMAIN } from '../../../../Services'
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import { Alertsuccess, FormatDateJson, Alerterror } from '../../../../Utils';
import { SelectStaff, SelectTypeApprove, DataTable } from '../../../../Common'
import { Alert } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';

export const Function = () => {

    return (
        <>
        <div className="content-wrapper">
            <div className="card direct-chat direct-chat-warning">
               
                    <h3 class='margin-top-20 margin-left-10'>Thiết lập chức năng phòng ban</h3>
               
                <div className="card-body approve">

                </div>
            </div>
        </div>
        </>
    )
}
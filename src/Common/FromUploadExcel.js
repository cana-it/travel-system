import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import { SelectArea, SelectPost, SelectDepart } from "./";
import { SelectAction } from "../Redux/Actions";
import I18n from '../Language';
const FromUploadExcelComp = ({
    onClickOpenFile = () => { },
    onClickUpLoad = () => { },
    onFileDowloadLink = () => { },
}) => {

    return (
        <div class="card card-success">
            <div class="card-header p-0 pt-1">
                <div class="col-sm-12 col-md-12"><i class="fa fa-bookmark" aria-hidden="true"></i>
                    <span> Upload Excel</span>
                </div>
            </div>
            <div class="card-body">
                <div class="col-sm-12 col-md-12">
                    <div class="row border-bottom">

                        <div class="col-sm-12 col-md-8">
                            <div class="row">
                                <div class="col-sm-12 col-md-6">
                                    <button type="file" class="btn btn-sm btn-success" onClick={onClickOpenFile}>
                                        <i class="fa fa-upload"></i> Chọn Tệp</button>
                                </div>
                                <div class="col-sm-12 col-md-3">
                                    <button type="button" class="btn btn-sm btn-danger" onClick={onClickUpLoad}>
                                        <i class="fa fa-upload"></i> Upload
                                        </button>
                                </div>
                                <div class="col-sm-12 col-md-3">

                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 pull-right">
                            <div class="form-group">
                                <a href={onFileDowloadLink} class="btn btn-xs btn-info pull-right"><i class="fa fa-upload" aria-hidden="true"></i> Dowload File mẫu</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const FromUploadExcel = React.memo(FromUploadExcelComp)
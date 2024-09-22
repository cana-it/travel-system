import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import DateTimePicker from "react-datetime-picker";
import Select from "react-select";
import { mainAction } from "../../../Redux/Actions";
import { CreateTask } from "../../../Common";
import { ExportExcel } from "../../../Utils";
import { TaskManage } from "./TaskManage";
// Import React Table

export const Task = () => {
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  return (
    <TaskManage onTitle="Quản lý công việc" />

    // <CreateTask onTitle="Create new task"/>
  );
};

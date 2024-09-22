import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { mainAction } from '../../../../Redux/Actions';
import {
    Alertwarning, Alertsuccess,
    Alerterror, FormatDateJson,
    ConvertUTCDateToLocalDate,
    CheckTypeFile,
    FormatMoney
} from '../../../../Utils';
import { DataTable, SelectBranch, SelectProvider } from '../../../../Common';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import { IMAGES_DOMAIN } from '../../../../Services'

import { DataTable2 } from '../../../../Common/DataTable2';
import { data } from 'jquery';
const ServiceLandTourFormComp = ({
    onSelected = () => { },
    onItem = {},
    handleShow,
    setOpacity,
    Booking,
    DataObject
}) => {
    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const [LandTourId, setLandTourId] = useState(0)
    const [LandTourCode, setLandTourCode] = useState("")
    const [LandTourName, setLandTourName] = useState("")
    const [Price,setPrice] = useState("")
    const [Notes, setNotes] = useState("")
    const [ProviderId, setProviderId] = useState(0)
    const Trl_spServiceLandTour_Save = async () => {

        try {
            if (LandTourCode === "" || LandTourCode === undefined) {
                Alertwarning("Nhập mã LandTour");
                return;
            }

            if (LandTourCode !== undefined && LandTourCode.length <= 4) {
                Alertwarning("Nhập mã LandTour > 4 kí tự");
                return;
            }
            if (LandTourName === "" || LandTourName === undefined) {
                Alertwarning("Nhập tên LandTour");
                return;
            }
            if (LandTourName !== undefined && LandTourName.length <= 5) {
                Alertwarning("Nhập tên LandTour > 5 kí tự");
                return;
            }


            if (ProviderId === 0 || ProviderId === undefined) {
                Alertwarning("Chọn nhà cung cấp");
                return;
            }
            let dataHl = dataHotel.filter( p => p.City !== ""),
            datasv = dataService.filter( p => p.City !== ""),
            datam = dataMeals.filter( p => p.City !== ""),
            datag = dataGuide.filter( p => p.City !== ""),
            datat = dataTrade.filter( p => p.City !== ""),
            datap = dataParking.filter( p => p.City !== ""),
            datao = dataOrther.filter( p => p.City !== "")

            let datamain = [...dataHl,...datasv,...datam,...datag,...datat,...datap,...datao]

            const pr = {
                LandTourId: LandTourId === undefined ? 0 : LandTourId,
                LandTourCode: LandTourCode.trim(),
                LandTourName: LandTourName.trim(),
                Price:Price,
                Notes: Notes,
                ProviderId: ProviderId,
                Creater: Creater,
                CreateName: CreateName,
                ListDetail:datamain
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spServiceLandTour_Save"
            }

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                Alertsuccess(result.ReturnMess);
                onSelected(result.LandTourId); // set data to props
                return;
            }
            if (result.Status === "NOTOK") {
                Alerterror(result.ReturnMess);
                return;
            }
        } catch (error) {
            Alerterror("Lỗi, liên hệ IT");
        }
    }

    const Cancel = () => {
        setLandTourId(0);
        setLandTourCode("");
        setLandTourName("");
        setNotes("");
        setPrice("");
        setProviderId(0)
    }

    const Trl_spServiceLandTour_View = (item) => {
         const obView = item;
        // setLandTourId(obView?.LandTourId);
        // setLandTourCode(obView?.LandTourCode);
        // setLandTourName(obView?.LandTourName);
        // Price(obView?.Price);
        // Notes(obView?.Notes);
        // setProviderId(obView?.ProviderId);
        Trl_spServiceLandTour_ViewData(obView?.LandTourCode);
    }

    const Trl_spServiceLandTour_ViewData = async (LandTourSearch) => {
        if(LandTourSearch === "" || LandTourSearch === undefined)
            return;

        const pr = {
            LandTourId: 0,
            LandTourSearch: LandTourSearch,
            Creater: Creater,
            CreateName: CreateName
        }

        const params = {
            Json: JSON.stringify(pr),
            func: "Trl_spServiceLandTour_View"
        }

        const result = await mainAction.API_spCallServer(params, dispatch);
        if (result !== "") {
           
            let obView = result.JsonReturn[0];
             onSelected(obView?.LandTourId); // set data to props
            setLandTourId(obView?.LandTourId);
            setLandTourCode(obView?.LandTourCode);
            setLandTourName(obView?.LandTourName);
            setPrice(obView?.Price);
            setNotes(obView?.Notes);
            
            setProviderId(obView?.ProviderId);

            let datadetail = result.JsonReturn1;

            // hotel
            const dbhotel = datadetail.filter(p => p.TypeLandtour === "Hotel");
            const dbhotelold = [...dataHotel].slice(0, dbhotel.length < sizePageHotel ?  (sizePageHotel - dbhotel.length) : dbhotel.length)
           if(dbhotelold.length <= 0)
           {
                let arr = [];
                for (var i = 0; i < sizePageHotel; i++) {
                    arr.push(sampleDataHotel);
                
                }
                const dbhotelold1 = [...arr].slice(0, dbhotel.length < sizePageHotel ?  (sizePageHotel - dbhotel.length) : arr.length)
                setdataHotel([...dbhotel,...dbhotelold1]);
           }
           else
           {
            setdataHotel([...dbhotel,...dbhotelold]);
           }

            //service
            const dbService = datadetail.filter(p => p.TypeLandtour === "Service");
            const dbServiceold = [...dataService].slice(0,dbService.length < sizePageService ? (sizePageService - dbService.length) : dbService.length);
            setdataService([...dbService,...dbServiceold]);

            //Guide
            const dbGuide = datadetail.filter(p => p.TypeLandtour === "Guide");
            const dbGuideold = [...dataGuide].slice(0,dbGuide.length < sizePageGuide ? (sizePageGuide - dbGuide.length) : dbGuide.length);
            setdataGuide([...dbGuide,...dbGuideold]);

            //Meals
            const dbMeals = datadetail.filter(p => p.TypeLandtour === "Meals");
            const dbMealsold = [...dataMeals].slice(0,dbMeals.length < sizePageMeals ? (sizePageMeals - dbMeals.length) : dbMeals.length);
            setdataMeals([...dbMeals,...dbMealsold]);

            //Parking
            const dbParking = datadetail.filter(p => p.TypeLandtour === "Parking");
            const dbParkingold = [...dataParking].slice(0,dbParking.length < sizePageParking ? (sizePageParking - dbParking.length) : dbParking.length);
            setdataParking([...dbParking,...dbParkingold]);


            // Trade
            const dbTrade = datadetail.filter(p => p.TypeLandtour === "Trade");
            const dbTradeold = [...dataTrade].slice(0,dbTrade.length < sizePageTrade ? (sizePageTrade - dbTrade.length) : dbTrade.length);
            setdataTrade([...dbTrade,...dbTradeold]);

            //Orther
            const dbOrther = datadetail.filter(p => p.TypeLandtour === "Orther");
            const dbOrtherold = [...dataOrther].slice(0,dbOrther.length < sizePageOrther ? (sizePageOrther - dbOrther.length) : dbOrther.length);
            setdataOrther([...dbOrther,...dbOrtherold]);

            return;
        }
       
    }

    const onLandTourCode = event  => {
      
        if (event.key === 'Enter') {
           const keysearch = event.target.value.trim();
           if(keysearch !== "")
           {
                Trl_spServiceLandTour_ViewData(keysearch);
           }
        }
    }

    useEffect(() => {
        if(onItem !== "") Trl_spServiceLandTour_ViewData(onItem);
      
    }, [onItem]);

    //#region hotel
    const [sizePageHotel,setsizePageHotel] = useState(10)
    let sampleDataHotel =
    {
        No:"",
        City: "",
        NameHotelServiceStaff: "",
        Arrival: "",
        Nights: "",
        CityTax: "",
        Price: "",
        Notes: "",
        TypeLandtour:"Hotel"
    }
    const columnsHotel = useMemo(() =>
        [
            {
                Header: 'No',
                Cell: (row) => <span>{row.index + 1}</span>,
                textAlign: "center",
                filterable: false,
                maxWidth:50,
                sortable: false,
                disableResizing: true
            },
            {
                Header: 'City',
                accessor: 'City',
                sticky: 'left',
                maxWidth:60,
                disableResizing: true
                //Cell: renderEditable,

            },
            {
                Header: "Quoted Hotel ",
                accessor: "NameHotelServiceStaff",
                maxWidth: 300,
                disableResizing: true
                //Cell: renderEditable,
            }
            ,
            {
                Header: "Arrival",
                accessor: "Arrival",
                disableResizing: true
                //Cell: renderEditable,
            },
            {
                Header: "Nights",
                accessor: "Nights",
                disableResizing: true
                //Cell: renderEditable
            },
            {
                Header: "CityTax",
                accessor: "CityTax",
                disableResizing: true
                //Cell: renderEditable
            }
            ,
            {
                Header: "Price",
                accessor: "Price",
                disableResizing: true
                //Cell: renderEditable
            },
            {
                Header: "Notes",
                accessor: "Notes",
                disableResizing: true
                //Cell: renderEditable
            }
        ], []);

    const [skipPageReset, setSkipPageReset] = useState(false);
    const [dataHotel, setdataHotel] = useState([]);
    const updateMyData = (rowIndex, columnId, value) => {
        setSkipPageReset(true)
        setdataHotel(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }
    //#endregion

    //#region Service
    const [sizePageService,setsizePageService] = useState(20)
    let sampleDataService =
    {
        No: "",
        City: "",
        NameHotelServiceStaff: "",
        DayDate: "",
        Price : "",
        Notes: "",
        TypeLandtour:"Service"
    }
    const columnsService = useMemo(() =>
        [
            {
                Header: 'No',
                Cell: (row) => <span>{row.index + 1}</span>,
                sticky: 'left',
                width: 40,
                textAlign: "center",
                filterable: false,
                sortable: false,
                disableResizing: true
            },
            {
                Header: 'City',
                accessor: 'City',
                sticky: 'left',
                maxWidth: 60,
                disableResizing: true
                //Cell: renderEditable,

            },
            {
                Header: "General Services",
                accessor: "NameHotelServiceStaff",
                maxWidth: 200,
                disableResizing: true
                //Cell: renderEditable,
            }
            ,
            {
                Header: "Day/Date",
                accessor: "DayDate",
                disableResizing: true
                //Cell: renderEditable,
            },
            {
                Header: "Price",
                accessor: "Price",
                disableResizing: true
                //Cell: renderEditable
            },
            {
                Header: "Notes",
                accessor: "Notes",
                disableResizing: true
                //Cell: renderEditable
            }
        ], []);

    const [skipPageResetService, setSkipPageResetService] = useState(false);
    const [dataService, setdataService] = useState([]);
    const updateMyDataService = (rowIndex, columnId, value) => {
        setSkipPageResetService(true)
        setdataService(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }
    //#endregion

    //#region Guide
    const [sizePageGuide,setsizePageGuide] = useState(10)
    let sampleDataGuide =
    {
        No: "",
        City: "",
        StaffType: "",
        DayDate: "",
        Duration: "",
        Language: "",
        Price:"",
        Notes: "",
        TypeLandtour:"Guide"
    }
    const columnsGuide = useMemo(() =>
        [
            {
                Header: 'No',
                Cell: (row) => <span>{row.index + 1}</span>,
                sticky: 'left',
                width: 40,
                textAlign: "center",
                filterable: false,
                sortable: false,
                disableResizing: true
            },
            {
                Header: 'City',
                accessor: 'City',
                sticky: 'left',
                minWidth: 30,
                maxWidth: 60,
                disableResizing: true
                //Cell: renderEditable,

            },
            {
                Header: "Staff Type",
                accessor: "StaffType",
                disableResizing: true
                //Cell: renderEditable,
            }
            ,
            {
                Header: "Day/Date",
                accessor: "DayDate",
                disableResizing: true
                //Cell: renderEditable,
            },
            {
                Header: "Duration",
                accessor: "Duration",
                disableResizing: true
                //Cell: renderEditable
            },
            {
                Header: "Language",
                accessor: "Language",
                disableResizing: true
                //Cell: renderEditable
            },
            {
                Header: "Price",
                accessor: "Price",
                disableResizing: true
                //Cell: renderEditable
            },
            {
                Header: "Notes",
                accessor: "Notes",
                disableResizing: true
                //Cell: renderEditable
            }
        ], []);

    const [skipPageResetGuide, setSkipPageResetGuide] = useState(false);
    const [dataGuide, setdataGuide] = useState([]);
    const updateMyDataGuide = (rowIndex, columnId, value) => {
        setSkipPageResetGuide(true)
        setdataGuide(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }
    //#endregion

    //#region Meals
    const [sizePageMeals,setsizePageMeals] = useState(20)
    let sampleDataMeals =
    {
        No: "",
        City: "",
        DayDate: "",
        Meal: "",
        Restaurant: "",
        Menu: "",
        Price:"",
        Notes: "",
        TypeLandtour:"Meals"
    }
    const columnsMeals = useMemo(() =>
        [
            {
                Header: 'No',
                Cell: (row) => <span>{row.index + 1}</span>,
                sticky: 'left',
                width: 40,
                textAlign: "center",
                filterable: false,
                sortable: false,
                disableResizing: true
            },
            {
                Header: 'City',
                accessor: 'City',
                sticky: 'left',
                maxWidth: 60,
                disableResizing: true
                //Cell: renderEditable,

            }
            ,
            {
                Header: "Day/Date",
                accessor: "DayDate",
                disableResizing: true
                //Cell: renderEditable,
            },
            {
                Header: "Restaurant",
                accessor: "Restaurant",
                disableResizing: true
                //Cell: renderEditable
            },
            {
                Header: "Menu",
                accessor: "Menu",
                maxWidth: 400,
                disableResizing: true
                //Cell: renderEditable
            },
            {
                Header: "Price",
                accessor: "Price",
                disableResizing: true
                //Cell: renderEditable
            },
            {
                Header: "Notes",
                accessor: "Notes",
                disableResizing: true
                //Cell: renderEditable
            }
        ], []);

    const [skipPageResetMeals, setSkipPageResetMeals] = useState(false);
    const [dataMeals, setdataMeals] = useState([]);
    const updateMyDataMeals = (rowIndex, columnId, value) => {
        setSkipPageResetMeals(true)
        setdataMeals(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }
    //#endregion

    //#region Parking/Permits
    const [sizePageParking,setsizePageParking] = useState(10)
    let sampleDataParking =
    {
        No: "",
        City: "",
        DayDate: "",
        ParkingPermit: "",
        Price:"",
        Notes: "",
        TypeLandtour:"Parking"
    }
    const columnsParking = useMemo(() =>
        [
            {
                Header: 'No',
                Cell: (row) => <span>{row.index + 1}</span>,
                sticky: 'left',
                width: 40,
                textAlign: "center",
                filterable: false,
                sortable: false,
                disableResizing: true
            },
            {
                Header: 'City',
                accessor: 'City',
                sticky: 'left',
                minWidth: 30,
                width: 100,
                maxWidth: 400,
                disableResizing: true
                //Cell: renderEditable,

            }
            ,
            {
                Header: "Day/Date",
                accessor: "DayDate",
                disableResizing: true
                //Cell: renderEditable,
            },
            {
                Header: "Parking/Permit",
                accessor: "ParkingPermit",
                disableResizing: true
                //Cell: renderEditable
            },
            {
                Header: "Price",
                accessor: "Price",
                disableResizing: true
                //Cell: renderEditable
            },
            {
                Header: "Notes",
                accessor: "Notes",
                disableResizing: true
                //Cell: renderEditable
            }
        ], []);

    const [skipPageResetParking, setSkipPageResetParking] = useState(false);
    const [dataParking, setdataParking] = useState([]);
    const updateMyDataParking = (rowIndex, columnId, value) => {
        setSkipPageResetParking(true)
        setdataParking(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }
    //#endregion

    //#region Trade
    const [sizePageTrade,setsizePageTrade] = useState(10)
    let sampleDataTrade =
    {
        No: "",
        City: "",
        FromTodate: "",
        TradeFairEvent: "",
        G2Category: "",
        Price:"",
        Notes: "",
        TypeLandtour:"Trade"
    }
    const columnsTrade = useMemo(() =>
        [
            {
                Header: 'No',
                Cell: (row) => <span>{row.index + 1}</span>,
                sticky: 'left',
                width: 40,
                textAlign: "center",
                filterable: false,
                sortable: false,
                disableResizing: true
            },
            {
                Header: 'City',
                accessor: 'City',
                sticky: 'left',
                minWidth: 30,
                width: 100,
                maxWidth: 400,
                disableResizing: true
                //Cell: renderEditable,

            }
            ,
            {
                Header: "From/To date",
                accessor: "FromTodate",
                disableResizing: true
                //Cell: renderEditable,
            },
            {
                Header: "Trade /Fair Event",
                accessor: "TradeFairEvent",
                disableResizing: true
                //Cell: renderEditable
            },
            {
                Header: "G2 Category",
                accessor: "G2Category",
                disableResizing: true
                //Cell: renderEditable
            },
            {
                Header: "Price",
                accessor: "Price",
                disableResizing: true
                //Cell: renderEditable
            }
            ,
            {
                Header: "Notes",
                accessor: "Notes",
                disableResizing: true
                //Cell: renderEditable
            }
        ], []);

    const [skipPageResetTrade, setSkipPageResetTrade] = useState(false);
    const [dataTrade, setdataTrade] = useState([]);
    const updateMyDataTrade = (rowIndex, columnId, value) => {
        setSkipPageResetTrade(true)
        setdataTrade(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }
    //#endregion

    //#region Orther service
    const [sizePageOrther,setsizePageOrther] = useState(10)
    let sampleDataOrther =
    {
        No: "",
        City: "",
        Price:"",
        Notes1: "",
        Notes2: "",
        TypeLandtour:"Orther"
    }
    const columnsOrther = useMemo(() =>
        [
            {
                Header: 'No',
                Cell: (row) => <span>{row.index + 1}</span>,
                sticky: 'left',
                width: 40,
                textAlign: "center",
                filterable: false,
                sortable: false,
                disableResizing: true
            },
            {
                Header: 'City',
                accessor: 'City',
                sticky: 'left',
                minWidth: 30,
                width: 100,
                maxWidth: 400,
                disableResizing: true
                //Cell: renderEditable,

            },
            {
                Header: "Price",
                accessor: "Price",
                disableResizing: true
                //Cell: renderEditable
            }
            ,
            {
                Header: "Notes1",
                accessor: "Notes1",
                disableResizing: true
                //Cell: renderEditable,
            },
            {
                Header: "Notes2",
                accessor: "Notes2",
                disableResizing: true
                //Cell: renderEditable
            }
        ], []);

    const [skipPageResetOrther, setSkipPageResetOrther] = useState(false);
    const [dataOrther, setdataOrther] = useState([]);
    const updateMyDataOrther = (rowIndex, columnId, value) => {
        setSkipPageResetOrther(true)
        setdataOrther(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }
    //#endregion

    //#region Render table
    //const [pageSize,setpageSize] = useState(10)

    useEffect(() => {
        let arr = [];
        for (var i = 0; i < sizePageHotel; i++) {
            arr.push(sampleDataHotel);
          
        }
        setdataHotel(arr);

    }, []);


    const onClickService = () => {
        if(dataService.length <= 0)
        {
            let arrService = [];
            for (var i = 0; i < sizePageService; i++) {
                arrService.push(sampleDataService);
            
            }
            setdataService(arrService);
        }
        
    }

    const onClickGuide = () => {
        if(dataGuide.length <= 0)
        {
            let arrGuide = [];
            for (var i = 0; i < sizePageGuide; i++) {
                arrGuide.push(sampleDataGuide);
            
            }
            setdataGuide(arrGuide);
        }
        
    }

    const onClickMeals = () => {
        if(dataMeals.length <= 0)
        {
            let arrMeals = [];
            for (var i = 0; i < sizePageMeals; i++) {
                arrMeals.push(sampleDataMeals);
            
            }
            setdataMeals(arrMeals);
        }
        
    }

    const onClickParking = () => {
        if(dataParking.length <= 0)
        {
            let arrParking = [];
            for (var i = 0; i < sizePageParking; i++) {
                arrParking.push(sampleDataParking);
            
            }
            setdataParking(arrParking);
        }
        
    }

    const onClickTrade = () => {
        if(dataTrade.length <= 0)
        {
            let arrTrade = [];
            for (var i = 0; i < sizePageTrade; i++) {
                arrTrade.push(sampleDataTrade);
            
            }
            setdataTrade(arrTrade);
        }
        
    }

    const onClickOrther = () => {
        if(dataOrther.length <= 0)
        {
            let arrOrther = [];
            for (var i = 0; i < sizePageOrther; i++) {
                arrOrther.push(sampleDataOrther);
            
            }
            setdataOrther(arrOrther);
        }
    }
    //#endregion


    return (
        <div className='card m-1 card-shadow'>
            <div class="card-header">
                <div class="row">
                    <div class="col-sm-12 col-md-6" >
                        <h3 class="card-title font-weight-bold">{(LandTourId === 0 || LandTourId === undefined) ? "Thêm mới LandTour" : "Thông tin LandTour: " + LandTourName}</h3>
                    </div>
                    <div class="col-sm-12 col-md-6 margin-top-5s">
                        <button onClick={Cancel} type="button" class="btn btn-sm btn-warning pull-right margin-left-5">
                            <i class="fa fa-trash pr-2"></i>
                            Hủy
                        </button>

                        <button type="button" class="btn btn-sm btn-danger pull-right" onClick={Trl_spServiceLandTour_Save}>
                            <i class="fa fa-edit pr-2"></i>
                            {(LandTourId === 0 || LandTourId === undefined) ? " Thêm mới" : "Cập nhật Landtour"}
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-body p-2">
                <div class="row">
                    <div class="col-sm-12 col-md-6">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">MÃ LANDTOUR(<strong className='check-point'>*</strong>)</span>
                                <div class=" input-group">
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={LandTourCode} 
                                        onChange={event => setLandTourCode(event.target.value)} 
                                        onKeyDown={onLandTourCode} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">TÊN LANDTOUR(<strong className='check-point'>*</strong>)</span>
                                <div class=" input-group">
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={LandTourName} 
                                        onChange={event => setLandTourName(event.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">GIÁ LANDTOUR(<strong className='check-point'>*</strong>)</span>
                                <div class=" input-group">
                                    <input
                                        type="text"
                                        class="form-control2"
                                        value={FormatMoney(Price)} 
                                        onChange={event => setPrice(FormatMoney(event.target.value,1))} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">NCC(<strong className='check-point'>*</strong>)</span>
                                <div class=" input-group">
                                <SelectProvider
                                    onSelected={item => setProviderId(item.value)}
                                    ProviderId={ProviderId}
                                    onProviderId={ProviderId}
                                    className={'w-100 select-custom'}
                                />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">NỘI DUNG</span>
                                <div class=" input-group">
                                <textarea 
                                rows="4" 
                                cols="60" 
                                type="text"
                                 class="form-control2"
                                  value={Notes}
                                   onChange={e => setNotes(e.target.value)} 
                                   />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <div class="form-group">
                                <span class="small font-weight-bold text-muted">TÌNH TRẠNG THANH TOÁN</span>
                                {(!Booking?.StatusLandTourId || Booking?.StatusLandTourId === 1) && <div
                                        className="  text-center modal-payment-pending"
                                        onClick={() => {
                                                handleShow(9)
                                                setOpacity('opacity-0')
                                           
                                        }}
                                    >
                                        <span class="text-danger">{Booking?.StatusLandTourName || 'Đề nghị thanh toán'}</span>
                                    </div>
                                    
                                }
                                 { Booking?.StatusLandTourId === 2 && <div
                                        className="  text-center modal-payment-success"
                                        onClick={() => {
                                                handleShow(9)
                                                setOpacity('opacity-0')
                                           
                                        }}
                                    >
                                        <span class="text-success">{Booking?.StatusLandTourName}</span>
                                    </div>
                                    
                                }
                                
                            </div>
                        </div>
                       
                    
                </div>
            </div>
            <section class="content margin-top-5" style={{ height: '600px', 'overflow': 'auto' }}>
                <div class="container-fluid">
                    <div class="card card-danger">
                        <div class="card-header-custom p-0 pt-1">
                            <ul class="nav nav-tabs " id="custom-tabs-two-tab" role="tablist">
                                <li class="nav-item margin-left-1s">
                                    <a class="nav-link active" id="data-hotel" data-toggle="pill" href="#data-hotel-tab" role="tab" aria-controls="custom-tabs-two-hotel" aria-selected="true">Hotel</a>
                                </li>
                                <li class="nav-item" onClick={onClickService()}>
                                    <a class="nav-link" id="data-service" data-toggle="pill" href="#data-service-tab" role="tab" aria-controls="custom-tabs-two-service" aria-selected="false">Service</a>
                                </li>
                                <li class="nav-item" onClick={onClickGuide()}>
                                    <a class="nav-link" id="data-Guide" data-toggle="pill" href="#data-Guide-tab" role="tab" aria-controls="custom-tabs-two-Guide" aria-selected="false">Guide Services </a>
                                </li>
                                <li class="nav-item" onClick={onClickMeals()}>
                                    <a class="nav-link" id="data-Meals" data-toggle="pill" href="#data-Meals-tab" role="tab" aria-controls="custom-tabs-two-Meals" aria-selected="false">Meals</a>
                                </li>
                                <li class="nav-item" onClick={onClickParking()}>
                                    <a class="nav-link" id="data-Parking" data-toggle="pill" href="#data-Parking-tab" role="tab" aria-controls="custom-tabs-two-Parking" aria-selected="false">Parking/Permits</a>
                                </li>
                                <li class="nav-item" onClick={onClickTrade()}>
                                    <a class="nav-link" id="data-Trade" data-toggle="pill" href="#data-Trade-tab" role="tab" aria-controls="custom-tabs-two-Trade" aria-selected="false">Trade</a>
                                </li>
                                <li class="nav-item" onClick={onClickOrther()}>
                                    <a class="nav-link" id="data-OrtherService" data-toggle="pill" href="#data-OrtherService-tab" role="tab" aria-controls="custom-tabs-two-OrtherService" aria-selected="false">Orther Service</a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-content" id="custom-tabs-two-tabContent">
                            <div class="tab-pane fade show active" id="data-hotel-tab" role="tabpanel" aria-labelledby="custom-tabs-two-home-tab">
                                {/* <h4>Proposed Hotel List</h4> */}
                                <div className='table-responsive'>
                                <DataTable2
                                    columns={columnsHotel}
                                    data={dataHotel}
                                    updateMyData={updateMyData}
                                    skipPageReset={skipPageReset}
                                    size={30}
                                />
                                </div>
                            </div>
                            <div class="tab-pane fade" id="data-service-tab" role="tabpanel" aria-labelledby="custom-tabs-two-profile-tab">
                                {/* <h4>General Services Included</h4> */}
                              <div className='table-responsive'>
                              <DataTable2
                                    columns={columnsService}
                                    data={dataService}
                                    updateMyData={updateMyDataService}
                                    skipPageReset={skipPageResetService}
                                    size={30}
                                />
                              </div>
                            </div>
                            <div class="tab-pane fade" id="data-Guide-tab" role="tabpanel" aria-labelledby="custom-tabs-two-Guide-tab">
                                {/* <h4>Guide Services Included</h4> */}
                                <div className='table-responsive'>
                                     <DataTable2
                                    columns={columnsGuide}
                                    data={dataGuide}
                                    updateMyData={updateMyDataGuide}
                                    skipPageReset={skipPageResetGuide}
                                    size={30}
                                />
                                </div>
                            </div>
                            <div class="tab-pane fade" id="data-Meals-tab" role="tabpanel" aria-labelledby="custom-tabs-two-Meals-tab">
                                {/* <h4>Meals Included</h4> */}
                                <div className='table-responsive'>
                                <DataTable2
                                    columns={columnsMeals}
                                    data={dataMeals}
                                    updateMyData={updateMyDataMeals}
                                    skipPageReset={skipPageResetMeals}
                                    size={30}
                                />
                                </div>
                            </div>
                            <div class="tab-pane fade" id="data-Parking-tab" role="tabpanel" aria-labelledby="custom-tabs-two-Parking-tab">
                                {/* <h4>Parking/Permits Included</h4> */}
                                <div className='table-responsive'>
                                <DataTable2
                                    columns={columnsParking}
                                    data={dataParking}
                                    updateMyData={updateMyDataParking}
                                    skipPageReset={skipPageResetParking}
                                    size={30}
                                />
                                </div>
                            </div>
                            <div class="tab-pane fade" id="data-Trade-tab" role="tabpanel" aria-labelledby="custom-tabs-two-Trade-tab">
                                {/* <h4>Trade Fairs/Events that may affect the group</h4> */}
                                <div className='table-responsive'>
                                <DataTable2
                                    columns={columnsTrade}
                                    data={dataTrade}
                                    updateMyData={updateMyDataTrade}
                                    skipPageReset={skipPageResetTrade}
                                    size={30}
                                />
                                </div>
                            </div>
                            <div class="tab-pane fade" id="data-OrtherService-tab" role="tabpanel" aria-labelledby="custom-tabs-two-OrtherService-tab">
                                {/* <h4>Orther Service</h4> */}
                                <div className='table-responsive'>
                                <DataTable2
                                    columns={columnsOrther}
                                    data={dataOrther}
                                    updateMyData={updateMyDataOrther}
                                    skipPageReset={skipPageResetOrther}
                                    size={30}
                                />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}
export const ServiceLandTourForm = React.memo(ServiceLandTourFormComp)
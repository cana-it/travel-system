import React, { useState, useEffect, useRef } from "react";
import { withGoogleMap, withScriptjs, GoogleMap, Marker, InfoWindow, DirectionsRenderer, Polyline, KmlLayer } from "react-google-maps";
import axios from "axios";
import I18n from '../../../../Language';
import { DataTable, SelectPost, SelectArea, SelectOfficerList } from '../../../../Common';
import { Alerterror, Alertsuccess, Alertwarning, GetDataFromLogin, FormatDateJson, ConfirmAlert } from "../../../../Utils";
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';

export const StaffMap = ({
    dataof = () => [],
    Typerunset = 0,
}) => {
    useEffect(async () => {
        Alertsuccess('loadmap');
    }, [Typerunset])

    const [selectedPark, setSelectedPark] = useState({});
    const [Zooom, setZooom] = useState(18);
    const [isFocus, setIsFocus] = useState(null);
    return (
        <div>
            <>
                <GoogleMap
                    zoom={10}
                    scrollwheel={true}
                    center={{ lat: dataof[0].Lat, lng: dataof[0].Lng }}
                    options={{
                        mapTypeControl: false,
                        mapTypeControlOptions: {
                            style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                            position: window.google.maps.ControlPosition.BOTTOM_RIGHT
                        },
                        gestureHandling: "greedy",
                        fullscreenControlOptions: {
                            position: window.google.maps.ControlPosition.BOTTOM_RIGHT,
                        },

                    }}
                >
                    {dataof.map((k2, i) => {
                        let url =
                       ( (i === 0)  ? ("./assets/img/icon-On.png") : ("./assets/img/icon-Of.png"))
                        return (
                            <Marker
                                key={i}
                                onClick={() => {
                                    setSelectedPark(k2);
                                }}
                                position={{ lat: +k2.Lat, lng: +k2.Lng }}
                                icon={{
                                    url: url,
                                    scaledSize: new window.google.maps.Size(40, 40),
                                    anchor: { x: 20, y: 20 }
                                }}
                            />
                        )
                    })}

                    {selectedPark.Lat !== undefined && (
                        <InfoWindow
                            onCloseClick={() => {
                                setSelectedPark({ Lat: undefined })
                            }}
                            position={{
                                lat: selectedPark.Lat,
                                lng: selectedPark.Lng
                            }}
                            clickable={true}
                            options={{
                                Width: '200px'
                            }}
                        >
                            <div className="row">
                                <div className="col-md-12 col-12">
                                    <h6 className="cl-car">Đăng nhập </h6>
                                    <div className="row" style={{ fontSize: '10px' }}>
                                        <div className="col-md-12 col-12">
                                            <p className="mb-2"> <span className="font-weight-bold"> {I18n.t('System.Name')}  :</span> {selectedPark.StaffName}</p>
                                            <p className="mb-2"><span className="font-weight-bold"> Thời gian:</span> {FormatDateJson(selectedPark.TimeLocation)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </>
        </div>
    );

};


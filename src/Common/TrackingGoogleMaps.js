
import React, { useEffect, useState } from 'react';
import { withGoogleMap, withScriptjs, GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "react-google-maps";
/* import { StaffMap } from "./StaffMap"; */
import { KeyGoogle } from '../Utils';
import { StaffMap } from '../Component/Main/TravelModule/System';
const TrackingGoogleMapsComp = ({
    dataof = () => [], 
    TypeRun = 0,
    OfficerIdMap = 0,
    ShowMaps = false,
}) => { /* type="bar|line|area|bubble|pie" */
    const PreviewWithMap = withScriptjs(withGoogleMap(StaffMap));
    return (
        <div class=" pt-0">
            {
                <PreviewWithMap
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${KeyGoogle}&v=3.exp&libraries=geometry,drawing,places`}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `500px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    dataof={dataof}
                    Typerunset={TypeRun}
                    OfficerId={OfficerIdMap}
                    ShowMaps ={ShowMaps}
                />}
        </div>
    );


};
export const TrackingGoogleMaps = React.memo(TrackingGoogleMapsComp);
import React from 'react'
import Location from './location';
import LocationDetails from './locationDetails';
import { useAppSelector } from '@lib/redux/hooks';
import { tabPanelActionSelector } from '@features/tabPanel'

function LocationPanel() {
    const { tabPanel: { selectedLocation } } = useAppSelector(tabPanelActionSelector);
    return (
        selectedLocation ? <LocationDetails selected={selectedLocation} /> : <Location />
    )
}

export default LocationPanel
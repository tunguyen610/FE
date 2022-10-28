import { notification } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import OrderRepository from '~/repositories/OrderRepository';

const PATHS = {
    CITIES:
        'https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/cities.json',
    DISTRICTS:
        'https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/districts',
    WARDS:
        'https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/wards',
    LOCATION:
        'https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/location.json',
};

const FETCH_TYPES = {
    CITIES: 'FETCH_CITIES',
    DISTRICTS: 'FETCH_DISTRICTS',
    WARDS: 'FETCH_WARDS',
};
async function fetchLocationOptions(fetchType, locationId) {
    let url;
    switch (fetchType) {
        case FETCH_TYPES.CITIES: {
            url = PATHS.CITIES;
            break;
        }
        case FETCH_TYPES.DISTRICTS: {
            url = `${PATHS.DISTRICTS}/${locationId}.json`;
            break;
        }
        case FETCH_TYPES.WARDS: {
            url = `${PATHS.WARDS}/${locationId}.json`;
            break;
        }
        default: {
            return [];
        }
    }
    const locations = (await axios.get(url)).data['data'];
    return locations.map(({ id, name }) => ({ value: id, label: name }));
}

async function fetchInitialData() {
    const { cityId, districtId, wardId } = (
        await axios.get(PATHS.LOCATION)
    ).data;
    const [cities, districts, wards] = await Promise.all([
        fetchLocationOptions(FETCH_TYPES.CITIES),
        fetchLocationOptions(FETCH_TYPES.DISTRICTS, cityId),
        fetchLocationOptions(FETCH_TYPES.WARDS, districtId),
    ]);
    return {
        cityOptions: cities,
        districtOptions: districts,
        wardOptions: wards,
        selectedCity: cities.find((c) => c.value === cityId),
        selectedDistrict: districts.find((d) => d.value === districtId),
        selectedWard: wards.find((w) => w.value === wardId),
    };
}

function useLocationForm(shouldFetchInitialLocation) {
    const [state, setState] = useState({
        cityOptions: [],
        districtOptions: [],
        wardOptions: [],
        address: '',
        selectedCity: null,
        selectedDistrict: null,
        selectedWard: null,
    });

    const { selectedCity, selectedDistrict } = state;

    useEffect(() => {
        (async function () {
            if (shouldFetchInitialLocation) {
                const initialData = await fetchInitialData();
                setState(initialData);
            } else {
                const options = await fetchLocationOptions(FETCH_TYPES.CITIES);
                setState({ ...state, cityOptions: options });
            }
        })();
    }, []);

    useEffect(() => {
        (async function () {
            if (!selectedCity) return;
            const options = await fetchLocationOptions(
                FETCH_TYPES.DISTRICTS,
                selectedCity.value
            );
            setState({ ...state, districtOptions: options });
        })();
    }, [selectedCity]);

    useEffect(() => {
        (async function () {
            if (!selectedDistrict) return;
            const options = await fetchLocationOptions(
                FETCH_TYPES.WARDS,
                selectedDistrict.value
            );
            setState({ ...state, wardOptions: options });
        })();
    }, [selectedDistrict]);

    function onCitySelect(option) {
        if (option !== selectedCity) {
            setState({
                ...state,
                districtOptions: [],
                wardOptions: [],
                selectedCity: option,
                selectedDistrict: null,
                selectedWard: null,
            });
        }
    }

    function onDistrictSelect(option) {
        if (option !== selectedDistrict) {
            setState({
                ...state,
                wardOptions: [],
                selectedDistrict: option,
                selectedWard: null,
            });
        }
    }

    function onWardSelect(option) {
        setState({ ...state, selectedWard: option });
    }

    async function onSubmit(data) {
        if (
            state.selectedCity !== null &&
            state.selectedDistrict !== null &&
            state.selectedWard !== null
        ) {
            data.map((item) => {
                item.info =
                    state.selectedCity.label +
                    ',' +
                    state.selectedDistrict.label +
                    ',' +
                    state.selectedWard.label;
                return item;
            });
            const result = await OrderRepository.orderItem(data);
            if (result) {
                notification['success']({
                    message: 'Order Success',
                });
            }
        } else {
            notification['error']({
                message: 'Order Failed',
                description: 'Please finish your address',
            });
        }
    }

    return { state, onCitySelect, onDistrictSelect, onWardSelect, onSubmit };
}

export default useLocationForm;

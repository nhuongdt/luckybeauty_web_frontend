import React, { useState, useEffect } from 'react';
import { NativeSelect, FormControl, InputLabel, Box } from '@mui/material/';
import axios from 'axios';

interface Province {
    codeName: string;
    code: number;
    name: string;
}
interface District {
    codeName: string;
    name: string;
    code: number;
}
const ApiVN: React.FC = () => {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    useEffect(() => {
        axios
            .get<Province[]>('https://provinces.open-api.vn/api/p/')
            .then((response) => {
                setProvinces(response.data);
            })
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            axios
                .get<District[]>(`https://provinces.open-api.vn/api/p/${selectedProvince}/?depth=2`)
                .then((response) => {
                    const districtList = response.data;
                    setDistricts(districtList);
                    console.log(districts);
                })
                .catch((error) => console.log(error));
        } else {
            setDistricts([]);
        }
    }, [selectedProvince]);

    return (
        <div className="select-row">
            <FormControl>
                <InputLabel htmlFor="province-native-select">Tỉnh/Thành phố</InputLabel>
                <NativeSelect
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    inputProps={{
                        name: 'province',
                        id: 'province-native-select'
                    }}>
                    {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                            {province.name}
                        </option>
                    ))}
                </NativeSelect>
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="district-native-select">Quận/Huyện</InputLabel>
                <NativeSelect
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    inputProps={{
                        name: 'district',
                        id: 'district-native-select'
                    }}
                    disabled={!selectedProvince}>
                    {districts.length > 4 &&
                        districts.map((district) => (
                            <option key={district.code} value={district.code}>
                                {district.name}
                            </option>
                        ))}
                </NativeSelect>
            </FormControl>
        </div>
    );
};

export default ApiVN;

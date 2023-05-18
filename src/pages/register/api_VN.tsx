import { FormControl, InputLabel, Select } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

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
    const [selectedProvince, setSelectedProvince] = useState<number>(0);
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<number>(0);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get<Province[]>(
                    'https://provinces.open-api.vn/api/p/'
                );
                setProvinces(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchProvinces();
    }, []);

    const fetchDistricts = async (provinceCode: number) => {
        try {
            const response = await axios.get<District[]>(
                `https://provinces.open-api.vn/api/p/${provinceCode}/?depth=2`
            );
            const districtList = response.data;
            setDistricts(districtList);
            console.log(districts);
        } catch (error) {
            console.log(error);
        }
    };

    const handleProvinceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const provinceCode = Number(event.target.value);
        setSelectedProvince(provinceCode);
        fetchDistricts(provinceCode);
    };

    return (
        <div className="select-row">
            <FormControl>
                <InputLabel htmlFor="province-native-select" className="login-label">
                    Tỉnh/Thành phố
                </InputLabel>
                <Select
                    defaultValue=""
                    className="login-label"
                    inputProps={{
                        name: 'province',
                        id: 'province-native-select'
                    }}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none'
                        }
                    }}>
                    {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                            {province.name}
                        </option>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="district-native-select" className="login-label">
                    Quận/Huyện
                </InputLabel>
                <Select
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none'
                        }
                    }}
                    onChange={(e) => setSelectedDistrict(Number(e.target.value))}
                    inputProps={{
                        name: 'district',
                        id: 'district-native-select'
                    }}
                    disabled={!selectedProvince}></Select>
            </FormControl>
        </div>
    );
};

export default ApiVN;

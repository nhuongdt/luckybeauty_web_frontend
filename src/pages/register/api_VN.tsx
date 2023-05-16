import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
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
    const { Option } = Select;

    useEffect(() => {
        fetchProvinces();
    }, []);

    async function fetchProvinces() {
        try {
            const datas = await axios.get('https://provinces.open-api.vn/api/p/');
            setProvinces(datas.data);
        } catch (error) {
            console.error('Error fetching province data:', error);
        }
    }
    async function fetchDistricts(provinceId: number) {
        try {
            const response = await axios.get(
                `https://provinces.open-api.vn/api/p/${provinceId}?depth=2`
            );
            const districtList = response.data.districts;
            setDistricts(districtList);
            console.log(districts);
        } catch (error) {
            console.error('Error fetching district data:', error);
        }
    }
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<any | undefined>(undefined);
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<any | undefined>(undefined);
    const [disabledd, setDisabledd] = useState(true);
    function handleProvinceChange(value: any) {
        setSelectedProvince(value);
        setSelectedDistrict('Chọn');
        fetchDistricts(value);
        setDisabledd(false);
    }
    function handleDistrictChange(value: string) {
        setSelectedDistrict(value);
    }
    return (
        <div className="select-row">
            <Select placeholder="Chọn" value={selectedProvince} onChange={handleProvinceChange}>
                {provinces &&
                    provinces.map((province) => (
                        <Option key={province.code} value={province.code}>
                            {province.name}
                        </Option>
                    ))}
            </Select>

            <Select
                placeholder="Chọn"
                value={selectedDistrict}
                disabled={disabledd}
                onChange={handleDistrictChange}>
                {Array.isArray(districts) &&
                    districts.map((district) => (
                        <Option key={district.code} value={district.name}>
                            {district.name}
                        </Option>
                    ))}
            </Select>
        </div>
    );
};

export default ApiVN;

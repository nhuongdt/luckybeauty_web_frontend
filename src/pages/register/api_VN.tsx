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
    async function fetchDistricts(key: number) {
        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/p/${key}?depth=2`);
            setDistricts(response.data.data);
        } catch (error) {
            console.error('Error fetching district data:', error);
            console.log(`https://provinces.open-api.vn/api/p/${key}?depth=2`);
        }
    }
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<number | undefined>(undefined);
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<number | undefined>(undefined);
    function handleProvinceChange(key: number) {
        setSelectedProvince(key);
        setSelectedDistrict(undefined);
        fetchDistricts(key);
    }
    function handleDistrictChange(key: number) {
        setSelectedDistrict(key);
    }
    return (
        <div>
            <Select placeholder="Chọn" value={selectedProvince} onChange={handleProvinceChange}>
                {provinces.map((province) => (
                    <Option key={province.code} value={province.name}>
                        {province.name}
                    </Option>
                ))}
            </Select>
            <Select placeholder="Chọn" value={selectedDistrict} onChange={handleDistrictChange}>
                {districts.map((district) => (
                    <Option key={district.code} value={district.name}>
                        {district.name}
                    </Option>
                ))}
            </Select>
        </div>
    );
};

export default ApiVN;

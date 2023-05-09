import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';

import CustomersChecking from '../check_in/customer_checking';
import PageBanHang from './page_ban_hang';
import HoaDonContext from '../ban_hang/HoaDonContext';

import './style.css';

export default function MainPageBanHang() {
    const history = useNavigate();
    const [activeTabProduct, setActiveTabProduc] = useState(false);
    const [cusChecking, setCusChecking] = useState<PageKhachHangCheckInDto>(
        new PageKhachHangCheckInDto({ idKhachHang: null })
    );

    return (
        <>
            <HoaDonContext.Provider value={cusChecking}>
                <CustomersChecking />
                <PageBanHang />
            </HoaDonContext.Provider>
        </>
    );
}

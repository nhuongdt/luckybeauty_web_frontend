import { createContext } from 'react';
import { PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
const HoaDonContext = createContext(new PageKhachHangCheckInDto({ idKhachHang: null }));
export default HoaDonContext;

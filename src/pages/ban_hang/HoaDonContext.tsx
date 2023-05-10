import { createContext } from 'react';
import { PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import { Guid } from 'guid-typescript';
const HoaDonContext = createContext(new PageKhachHangCheckInDto({ idKhachHang: Guid.EMPTY }));
export default HoaDonContext;

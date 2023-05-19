import Dexie, { Table } from 'dexie';
import HoaDonChiTietDto from '../../services/ban_hang/HoaDonChiTietDto';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import { PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';

export class SubClassDexie extends Dexie {
    hoaDonChiTiet!: Table<HoaDonChiTietDto>;
    hoaDon!: Table<PageHoaDonDto>;
    khachCheckIn!: Table<PageKhachHangCheckInDto>;

    constructor() {
        super('DBTest');
        this.version(1).stores({
            hoaDon: 'id, idKhachHang',
            hoaDonChiTiet: 'id, idHoaDon,idDonViQuyDoi,soLuong, thanhTien',
            khachCheckIn: 'id, idKhachHang'
        });
    }
}
export const dbDexie = new SubClassDexie();

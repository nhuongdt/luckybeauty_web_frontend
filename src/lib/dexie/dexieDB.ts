import Dexie, { Table } from 'dexie';
import HoaDonChiTietDto from '../../services/ban_hang/HoaDonChiTietDto';

export class SubClassDexie extends Dexie {
    hoaDonChiTiet!: Table<HoaDonChiTietDto>;

    constructor() {
        super('DBTest');
        this.version(1).stores({
            hoaDonChiTiet: 'id, idHoaDon,idDonViQuyDoi,soLuong, thanhTien'
        });
    }
}
export const dbDexie = new SubClassDexie();

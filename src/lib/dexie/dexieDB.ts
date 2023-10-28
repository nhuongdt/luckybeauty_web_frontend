import Dexie, { Table } from 'dexie';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import { PageKhachHangCheckInDto } from '../../services/check_in/CheckinDto';
import { useContext } from 'react';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import Cookies from 'js-cookie';
import utils from '../../utils/utils';

export class SubClassDexie extends Dexie {
    hoaDon!: Table<PageHoaDonDto>;
    khachCheckIn!: Table<PageKhachHangCheckInDto>;

    constructor() {
        super('DBTest');
        this.version(1).stores({
            hoaDon: '&id, idKhachHang',
            khachCheckIn: '&idCheckIn, idKhachHang'
        });
        this.version(2)
            .stores({
                hoaDon: '&id, idKhachHang, idChiNhanh' // add column idChiNhanh
            })
            .upgrade((x) => {
                // update idChiNhanh for cache hdOld (if idChiNhanh null)
                const appContext = useContext(AppContext);
                const chinhanh = appContext.chinhanhCurrent;
                const idChiNhanh = chinhanh.id ?? Cookies.get('IdChiNhanh');
                console.log('dexie ', idChiNhanh);
                return x
                    .table('hoaDon')
                    .filter((o) => utils.checkNull(o.idChiNhanh))
                    .modify((o) => (o.idChiNhanh = idChiNhanh));
            });
        this.version(3)
            .stores({
                hoaDon: '&id, idKhachHang, idChiNhanh, idCheckIn' // add column idCheckIn
            })
            .upgrade((x) => {
                // update idCheckIn for cache hdOld
                return x
                    .table('hoaDon')
                    .filter((o) => utils.checkNull(o.idCheckIn))
                    .modify(async (o) => {
                        const datCheckIn = await x
                            .table('khachCheckIn')
                            .where('idKhachHang')
                            .equals(o.idKhachHang)
                            .toArray();
                        if (datCheckIn.length > 0) {
                            o.idCheckIn = datCheckIn[0].idCheckIn;
                        } else {
                            x.table('hoaDon').delete(o.id);
                        }
                    });
            });
        this.version(4).stores({
            khachCheckIn: null // remove table
        });
    }
}
export const dbDexie = new SubClassDexie();

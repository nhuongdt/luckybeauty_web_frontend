import utils from '../../../utils/utils';
import http from '../../httpService';
import { CustomerSMSDto } from '../gui_tin_nhan/gui_tin_nhan_dto';
import { CaiDatNhacNhoChiTietDto, CaiDatNhacNhoDto } from './cai_dat_nhac_nho_dto';
import { format } from 'date-fns';

const objSMS = {
    idKhachHang: '',
    maKhachHang: 'KH001',
    tenKhachHang: 'Chị Mai Hương',
    soDienThoai: '0978005006',
    ngaySinh: '1990-11-11',
    bookingDate: '11:00 05/04/2024',
    startDate: '11:25 05/04/2024',
    thoiGianHen: '14:00 - 16:00',
    tenHangHoa: 'Cắt tóc',
    maHoaDon: 'HD001',
    ngayLapHoaDon: '10:00 04/04/2024'
} as CustomerSMSDto;

class CaiDatNhacNhoService {
    objSMS = objSMS;
    ReplaceBienSMS = (input: string): string => {
        let txt = input;
        txt = txt.replace('{TenKhachHang}', this.objSMS?.tenKhachHang ?? '');
        if (!utils.checkNull(this.objSMS?.ngaySinh as unknown as string)) {
            txt = txt.replace('{NgaySinh}', format(new Date(this.objSMS?.ngaySinh ?? new Date()), 'dd/MM/yyyy'));
        } else {
            txt = txt.replace('{NgaySinh}', '');
        }
        if (!utils.checkNull(this.objSMS?.bookingDate as unknown as string)) {
            txt = txt.replace(
                '{BookingDate}',
                format(new Date(this.objSMS?.bookingDate ?? new Date()), 'HH:mm dd/MM/yyyy')
            );
        }
        txt = txt.replace('{ThoiGianHen}', this.objSMS?.thoiGianHen ?? '');
        txt = txt.replace('{MaHoaDon}', this.objSMS?.maHoaDon ?? '');
        if (!utils.checkNull(this.objSMS?.ngayLapHoaDon as unknown as string)) {
            txt = txt.replace(
                '{NgayLapHoaDon}',
                format(new Date(this.objSMS?.ngayLapHoaDon ?? new Date()), 'HH:mm dd/MM/yyyy')
            );
        }
        txt = txt.replace('{TenHangHoa}', this.objSMS?.tenHangHoa ?? '');
        txt = txt.replace('{TenCuaHang}', 'Nail salon HN');
        txt = txt.replace('{SDTCuaHang}', '0243.933.033');
        return txt;
    };
    GetAllCaiDatNhacNho = async (): Promise<CaiDatNhacNhoDto[]> => {
        const xx = await http.get(`api/services/app/CaiDatNhacNho/GetAllCaiDat`);
        return xx.data.result;
    };
    GetInforCaiDatNhacNho_byId = async (idSetup: string): Promise<CaiDatNhacNhoDto> => {
        const xx = await http.get(
            `api/services/app/CaiDatNhacNho/GetInforCaiDatNhacNho_byId?idCaiDatNhacNho=${idSetup}`
        );
        return xx.data.result;
    };
    CreateCaiDatNhacNho = async (input: CaiDatNhacNhoDto): Promise<CaiDatNhacNhoDto> => {
        const xx = await http.post(`api/services/app/CaiDatNhacNho/CreateCaiDatNhacNho`, input);
        return xx.data.result;
    };
    UpdateCaiDatNhacNho = async (input: CaiDatNhacNhoDto): Promise<string> => {
        const xx = await http.post(`api/services/app/CaiDatNhacNho/UpdateCaiDatNhacNho`, input);
        return xx.data.result;
    };
    CaiDatNhacNho_UpdateTrangThai = async (idSetup: string, trangThai = 0): Promise<CaiDatNhacNhoDto> => {
        const xx = await http.get(
            `api/services/app/CaiDatNhacNho/CaiDatNhacNho_UpdateTrangThai?idCaiDatNhacNho=${idSetup}&trangThai=${trangThai}`
        );
        return xx.data.result;
    };
    CreateOrUpdateCaiDatNhacNhoChiTiet = async (
        idSetup: string,
        itemDetail: CaiDatNhacNhoChiTietDto
    ): Promise<CaiDatNhacNhoChiTietDto> => {
        const xx = await http.post(
            `api/services/app/CaiDatNhacNho/CreateOrUpdateCaiDatNhacNhoChiTiet?idCaiDatNhacNho=${idSetup}`,
            itemDetail
        );
        return xx.data.result;
    };
}
export default new CaiDatNhacNhoService();

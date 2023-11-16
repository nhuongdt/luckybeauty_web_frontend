import http from '../../httpService';
import { CustomerSMSDto } from '../gui_tin_nhan/gui_tin_nhan_dto';
import { CaiDatNhacNhoChiTietDto, CaiDatNhacNhoDto } from './cai_dat_nhac_nho_dto';
import { format } from 'date-fns';

const objSMS = {
    id: '',
    maKhachHang: 'KH001',
    tenKhachHang: 'Chị Mai Hương',
    soDienThoai: '0978005006',
    ngaySinh: new Date('1990-11-11'),
    bookingDate: new Date(),
    thoiGianHen: '14:00 - 16:00',
    tenDichVu: 'Cắt tóc',
    maHoaDon: 'HD001',
    ngayLapHoaDon: new Date()
} as CustomerSMSDto;

class CaiDatNhacNhoService {
    ReplaceBienSMS = (input: string): string => {
        let txt = input;
        txt = txt.replace('{TenKhachHang}', objSMS?.tenKhachHang);
        txt = txt.replace('{NgaySinh}', format(objSMS?.ngaySinh as Date, 'dd/MM/yyyy'));
        txt = txt.replace('{BookingDate}', format(objSMS?.bookingDate as Date, 'dd/MM/yyyy'));
        txt = txt.replace('{ThoiGianHen}', objSMS?.thoiGianHen ?? '');
        txt = txt.replace('{MaHoaDon}', objSMS?.maHoaDon ?? '');
        txt = txt.replace('{NgayLapHoaDon}', format(objSMS?.ngayLapHoaDon as Date, 'dd/MM/yyyy'));
        txt = txt.replace('{TenHangHoa}', objSMS?.tenDichVu ?? '');
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

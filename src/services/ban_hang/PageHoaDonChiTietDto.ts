import { Guid } from 'guid-typescript';
import HoaDonChiTietDto from './HoaDonChiTietDto';

export default class PageHoaDonChiTietDto extends HoaDonChiTietDto {
    maHangHoa = '';
    tenHangHoa = '';
    giaBan = 0;
    giaNhap? = 0;
    thanhTien? = 0;
    idNhomHangHoa = null;

    constructor({
        maHangHoa = '',
        tenHangHoa = '',
        giaBan = 0,
        giaNhap = 0,
        thanhTien = 0,
        idNhomHangHoa = null
    }) {
        super({ id: Guid.createEmpty(), idDonViQuyDoi: null, soLuong: 0 });
        this.maHangHoa = maHangHoa;
        this.tenHangHoa = tenHangHoa;
        this.giaBan = giaBan;
        this.giaNhap = giaNhap;
        this.thanhTien = thanhTien;
        this.idNhomHangHoa = idNhomHangHoa;
    }
}

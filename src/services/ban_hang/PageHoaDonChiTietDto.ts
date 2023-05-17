import { Guid } from 'guid-typescript';
import HoaDonChiTietDto from './HoaDonChiTietDto';

export default class PageHoaDonChiTietDto extends HoaDonChiTietDto {
    maHangHoa = '';
    tenHangHoa = '';
    giaBan = 0;
    giaNhap? = 0;
    thanhTien? = 0;
    idNhomHangHoa = null;
    idHangHoa? = null;

    constructor({
        maHangHoa = '',
        tenHangHoa = '',
        giaBan = 0,
        giaNhap = 0,
        thanhTien = 0,
        idNhomHangHoa = null,
        idHangHoa = null,
        idDonViQuyDoi = null,
        soLuong = 1
    }) {
        super({
            id: Guid.createEmpty().toString(),
            idDonViQuyDoi: idDonViQuyDoi,
            soLuong: soLuong
        });
        this.maHangHoa = maHangHoa;
        this.tenHangHoa = tenHangHoa;
        this.giaBan = giaBan;
        this.giaNhap = giaNhap;
        this.thanhTien = thanhTien;
        this.idNhomHangHoa = idNhomHangHoa;
        this.idHangHoa = idHangHoa;
        this.donGiaTruocCK = giaBan;
    }
}

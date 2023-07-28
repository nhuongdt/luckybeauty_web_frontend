import PageHoaDonChiTietDto from '../../../../services/ban_hang/PageHoaDonChiTietDto';
import PageHoaDonDto from '../../../../services/ban_hang/PageHoaDonDto';
import { ChiNhanhDto } from '../../../../services/chi_nhanh/Dto/chiNhanhDto';
import { KhachHangItemDto } from '../../../../services/khach-hang/dto/KhachHangItemDto';
import logoChiNhanh from '../../../../images/Lucky_beauty.jpg';
import { CuaHangDto } from '../../../../services/cua_hang/Dto/CuaHangDto';
import utils from '../../../../utils/utils';

const dv1 = new PageHoaDonChiTietDto({
    maHangHoa: 'DV01',
    tenHangHoa: 'Chăm sóc da mặt',
    soLuong: 1,
    giaBan: 100000
});

const dv2 = new PageHoaDonChiTietDto({
    maHangHoa: 'DV02',
    tenHangHoa: 'Gội nữ',
    soLuong: 1,
    giaBan: 80000
});
const congty = {
    tenCongTy: 'MAIANH HAIR SALON',
    soDienThoai: '0243.565.789',
    diaChi: 'Số 112, Tây Hồ, Hoàn Kiếm, HN',
    website: 'MaiAnhHairSalon.luckybeauty.vn',
    logo: logoChiNhanh
} as CuaHangDto;
const chinhanh = {
    maChiNhanh: 'CN01',
    tenChiNhanh: 'Chi nhánh Hà Nội',
    soDienThoai: '0978000854' as unknown as null,
    diaChi: '31 Lê Văn Lương',
    maSoThue: '',
    logo: logoChiNhanh as unknown as null
} as ChiNhanhDto;
const khachhang = {
    maKhachHang: 'KH001',
    tenKhachHang: 'Anh B',
    avatar: '',
    soDienThoai: '0975482120',
    diaChi: 'Hai Bà Trưng, HN',
    tenNhomKhach: 'Nhóm khách 01'
} as KhachHangItemDto;

const hoadon = new PageHoaDonDto({
    maHoaDon: 'HD001',
    ngayLapHoaDon: '25/07/2023 10:15',
    tenKhachHang: 'Anh B',
    tongTienHang: 1000000
});
class DataMauIn {
    congty = congty;
    khachhang = khachhang;
    chinhanh = chinhanh;
    hoadonChiTiet = [dv1, dv2];
    InitVariable_ofHoaDon = () => {
        hoadon.tongTienHangChuaChietKhau = 1100000;
        hoadon.tongChietKhauHangHoa = 100000;
        hoadon.tongGiamGiaHD = 20000;
        hoadon.tongTienThue = 8000;
        hoadon.tongTienHDSauVAT = 988000;
        hoadon.tongThanhToan = 988000;
        hoadon.pTGiamGiaHD = 2;
        hoadon.ptThueHD = 0.8;
        hoadon.tenNhanVien = 'TN01';
        return hoadon;
    };
    replaceHoaDon = (shtml: string) => {
        let data = shtml;
        data = data.replaceAll('{TenCuaHang}', congty.tenCongTy);
        data = data.replaceAll('{LogoCuaHang}', congty.logo);
        data = data.replaceAll('{DiaChiCuaHang}', congty.diaChi);
        data = data.replaceAll('{SDTCuaHang}', congty.soDienThoai);

        data = data.replaceAll('{LogoChiNhanh}', `<img src=${chinhanh.logo ?? ''} />`);
        data = data.replaceAll('{TenChiNhanh}', chinhanh.tenChiNhanh);
        data = data.replaceAll('{DienThoaiChiNhanh}', chinhanh.soDienThoai ?? '');
        data = data.replaceAll('{DiaChiChiNhanh}', chinhanh.diaChi ?? '');

        data = data.replaceAll('{TenKhachHang}', khachhang.tenKhachHang);
        data = data.replaceAll('{DiaChiKhachHang}', khachhang.diaChi);
        data = data.replaceAll('{DienThoaiKhachHang}', khachhang.soDienThoai);

        data = data.replaceAll('{MaHoaDon}', hoadon.maHoaDon);
        data = data.replaceAll('{NgayBan}', hoadon.ngayLapHoaDon);
        data = data.replaceAll('{NgayLapHoaDon}', hoadon.ngayLapHoaDon);
        data = data.replaceAll('{NhanVienBanHang}', hoadon.tenNhanVien ?? '');
        data = data.replaceAll('{GhiChuHD}', hoadon.ghiChuHD ?? '');

        data = data.replaceAll(
            '{TongTienHangChuaChietKhau}',
            new Intl.NumberFormat('vi-VN').format(hoadon.tongTienHangChuaChietKhau)
        );
        data = data.replaceAll(
            '{TongChietKhauHangHoa}',
            new Intl.NumberFormat('vi-VN').format(hoadon.tongChietKhauHangHoa)
        );
        data = data.replaceAll(
            '{TongTienHang}',
            new Intl.NumberFormat('vi-VN').format(hoadon.tongTienHang)
        );
        data = data.replaceAll('{PTThueHD}', hoadon.ptThueHD?.toString() ?? '0');
        data = data.replaceAll(
            '{TongTienThue}',
            new Intl.NumberFormat('vi-VN').format(hoadon.tongTienThue ?? 0)
        );
        data = data.replaceAll(
            '{TongTienHDSauVAT}',
            new Intl.NumberFormat('vi-VN').format(hoadon.tongTienHDSauVAT ?? 0)
        );
        data = data.replaceAll('{PTGiamGiaHD}', hoadon.pTGiamGiaHD?.toString() ?? '0');
        data = data.replaceAll(
            '{TongGiamGiaHD}',
            new Intl.NumberFormat('vi-VN').format(hoadon.tongGiamGiaHD)
        );
        data = data.replaceAll(
            '{TongThanhToan}',
            new Intl.NumberFormat('vi-VN').format(hoadon.tongThanhToan)
        );

        // thanh toan
        data = data.replaceAll(
            '{DaThanhToan}',
            new Intl.NumberFormat('vi-VN').format(hoadon.daThanhToan ?? 0)
        );
        data = data.replaceAll('{TienBangChu}', utils.DocSo(hoadon.tongThanhToan));
        return data;
    };
    replaceChiTietHoaDon = (shtml: string) => {
        const data = shtml;
        return data;
    };
}

export default new DataMauIn();

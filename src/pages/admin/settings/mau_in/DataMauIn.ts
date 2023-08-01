import PageHoaDonChiTietDto from '../../../../services/ban_hang/PageHoaDonChiTietDto';
import PageHoaDonDto from '../../../../services/ban_hang/PageHoaDonDto';
import { ChiNhanhDto } from '../../../../services/chi_nhanh/Dto/chiNhanhDto';
import { KhachHangItemDto } from '../../../../services/khach-hang/dto/KhachHangItemDto';
import logoChiNhanh from '../../../../images/Lucky_beauty.jpg';
import { CuaHangDto } from '../../../../services/cua_hang/Dto/CuaHangDto';
import utils from '../../../../utils/utils';
import { format } from 'date-fns';

const dv1 = new PageHoaDonChiTietDto({
    maHangHoa: 'DV01',
    tenHangHoa: 'Chăm sóc da mặt',
    soLuong: 1,
    giaBan: 100000
});

const dv2 = new PageHoaDonChiTietDto({
    maHangHoa: 'DV02',
    tenHangHoa: 'Gội nữ',
    soLuong: 2,
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
hoadon.tongTienHangChuaChietKhau = 1100000;
hoadon.tongChietKhauHangHoa = 100000;
hoadon.tongGiamGiaHD = 20000;
hoadon.tongTienThue = 8000;
hoadon.tongTienHDSauVAT = 988000;
hoadon.tongThanhToan = 988000;
hoadon.pTGiamGiaHD = 2;
hoadon.ptThueHD = 0.8;
hoadon.daThanhToan = 500000;
hoadon.tenNhanVien = 'TN01';

class DataMauIn {
    congty = congty;
    khachhang = khachhang;
    chinhanh = chinhanh;
    hoadon = hoadon;
    hoadonChiTiet = [dv1, dv2];
    replaceHoaDon = (shtml: string) => {
        let data = shtml;
        data = data.replaceAll('{TenCuaHang}', this.congty.tenCongTy.toUpperCase());
        data = data.replaceAll('{LogoCuaHang}', this.congty.logo);
        data = data.replaceAll('{DiaChiCuaHang}', this.congty.diaChi);
        data = data.replaceAll('{DienThoaiCuaHang}', this.congty.soDienThoai);

        data = data.replaceAll(
            '{LogoChiNhanh}',
            `<img src=${this.chinhanh.logo ?? chinhanh.logo} />`
        );
        data = data.replaceAll('{TenChiNhanh}', this.chinhanh.tenChiNhanh.toUpperCase());
        data = data.replaceAll('{DienThoaiChiNhanh}', this.chinhanh.soDienThoai ?? '');
        data = data.replaceAll('{DiaChiChiNhanh}', this.chinhanh.diaChi ?? '');

        data = data.replaceAll('{TenKhachHang}', this.khachhang.tenKhachHang);
        data = data.replaceAll('{DiaChiKhachHang}', this.khachhang.diaChi ?? '');
        data = data.replaceAll('{DienThoaiKhachHang}', this.khachhang.soDienThoai ?? '');

        data = data.replaceAll('{MaHoaDon}', this.hoadon.maHoaDon);
        data = data.replaceAll(
            '{NgayBan}',
            format(new Date(this.hoadon?.ngayLapHoaDon ?? ''), 'dd/MM/yyyy HH:mm:ss')
        );
        data = data.replaceAll(
            '{NgayLapHoaDon}',
            format(new Date(this.hoadon?.ngayLapHoaDon ?? ''), 'dd/MM/yyyy HH:mm:ss')
        );
        data = data.replaceAll('{NhanVienBanHang}', this.hoadon.tenNhanVien ?? '');
        data = data.replaceAll('{GhiChuHD}', this.hoadon.ghiChuHD ?? '');

        data = data.replaceAll(
            '{TongTienHangChuaChietKhau}',
            new Intl.NumberFormat('vi-VN').format(this.hoadon.tongTienHangChuaChietKhau)
        );
        data = data.replaceAll(
            '{TongChietKhauHangHoa}',
            new Intl.NumberFormat('vi-VN').format(this.hoadon.tongChietKhauHangHoa)
        );
        data = data.replaceAll(
            '{TongTienHang}',
            new Intl.NumberFormat('vi-VN').format(this.hoadon.tongTienHang)
        );
        data = data.replaceAll('{PTThueHD}', this.hoadon.ptThueHD?.toString() ?? '0');
        data = data.replaceAll(
            '{TongTienThue}',
            new Intl.NumberFormat('vi-VN').format(this.hoadon.tongTienThue ?? 0)
        );
        data = data.replaceAll(
            '{TongTienHDSauVAT}',
            new Intl.NumberFormat('vi-VN').format(this.hoadon.tongTienHDSauVAT ?? 0)
        );
        data = data.replaceAll('{PTGiamGiaHD}', this.hoadon.pTGiamGiaHD?.toString() ?? '0');
        data = data.replaceAll(
            '{TongGiamGiaHD}',
            new Intl.NumberFormat('vi-VN').format(this.hoadon.tongGiamGiaHD)
        );
        data = data.replaceAll(
            '{TongThanhToan}',
            new Intl.NumberFormat('vi-VN').format(this.hoadon.tongThanhToan)
        );

        // thanh toan
        data = data.replaceAll(
            '{DaThanhToan}',
            new Intl.NumberFormat('vi-VN').format(this.hoadon.daThanhToan ?? 0)
        );
        data = data.replaceAll(
            '{NoHoaDon}',
            new Intl.NumberFormat('vi-VN').format(this.hoadon.conNo ?? 0)
        );
        data = data.replaceAll('{TienBangChu}', utils.DocSo(this.hoadon.daThanhToan));
        return data;
    };
    replaceChiTietHoaDon = (shtml: string) => {
        let data = shtml;
        // find table contain cthd
        let cthd_from = data.lastIndexOf('tbody', data.indexOf('{TenHangHoa')) - 1;
        let cthd_to = data.indexOf('tbody', data.indexOf('{TenHangHoa')) + 6;
        let contain_Ten = true;
        if (cthd_from < 0) {
            cthd_from = data.lastIndexOf('tbody', data.indexOf('{MaHangHoa}')) - 1;
            cthd_to = data.indexOf('tbody', data.indexOf('{MaHangHoa}')) + 6;
            contain_Ten = false;
        }
        const sTempCTHD = data.substring(cthd_from, cthd_to);

        let tr1_from = -1,
            tr1_to = -1;
        if (contain_Ten) {
            tr1_from = sTempCTHD.lastIndexOf('tr', sTempCTHD.indexOf('{TenHangHoa}')) - 1;
            tr1_to = sTempCTHD.indexOf('tr', sTempCTHD.indexOf('{TenHangHoa}')) + 3;
        } else {
            tr1_from = sTempCTHD.lastIndexOf('tr', sTempCTHD.indexOf('{MaHangHoa}'));
            tr1_to = sTempCTHD.indexOf('tr', sTempCTHD.indexOf('{MaHangHoa}'));
        }

        const tr2_from = sTempCTHD.lastIndexOf('tr', sTempCTHD.indexOf('{SoLuong}')) - 1;
        const tr2_to = sTempCTHD.indexOf('tr', sTempCTHD.indexOf('{SoLuong}')) + 3;

        let cthdContentCopy = '',
            cthdContent = '';

        if (tr2_from > 0 && tr2_from !== tr1_from) {
            // tenhanghoa + soluong # row
            cthdContentCopy = sTempCTHD.substring(tr1_from, tr2_to); // keep string
            cthdContent = cthdContentCopy;

            data = data.replace(cthdContentCopy, cthdContent);
        } else {
            // tenhanghoa + soluong same row
            cthdContentCopy = sTempCTHD.substring(tr1_from, tr1_to); // keep string
            cthdContent = cthdContentCopy;
        }
        for (let i = 0; i < this.hoadonChiTiet.length; i++) {
            const forCTHD = this.hoadonChiTiet[i];
            if (i === 0) {
                cthdContent = cthdContent.replaceAll('{STT}', forCTHD.stt.toString());
                cthdContent = cthdContent.replaceAll('{TenHangHoa}', forCTHD.tenHangHoa);
                cthdContent = cthdContent.replaceAll(
                    '{SoLuong}',
                    new Intl.NumberFormat('vi-VN').format(forCTHD.soLuong)
                );
                cthdContent = cthdContent.replaceAll(
                    '{DonGiaSauCK}',
                    new Intl.NumberFormat('vi-VN').format(forCTHD.donGiaSauCK ?? 0)
                );
                cthdContent = cthdContent.replaceAll(
                    '{ThanhTienSauCK}',
                    new Intl.NumberFormat('vi-VN').format(forCTHD.thanhTienSauCK ?? 0)
                );
            } else {
                let newRow = cthdContentCopy;
                newRow = newRow.replaceAll('{TenHangHoa}', forCTHD.tenHangHoa);
                newRow = newRow.replaceAll(
                    '{SoLuong}',
                    new Intl.NumberFormat('vi-VN').format(forCTHD.soLuong)
                );
                newRow = newRow.replaceAll(
                    '{DonGiaSauCK}',
                    new Intl.NumberFormat('vi-VN').format(forCTHD.donGiaSauCK ?? 0)
                );
                newRow = newRow.replaceAll(
                    '{ThanhTienSauCK}',
                    new Intl.NumberFormat('vi-VN').format(forCTHD.thanhTienSauCK ?? 0)
                );
                cthdContent = cthdContent.concat(newRow);
            }
        }
        data = data.replace(cthdContentCopy, cthdContent);

        return data;
    };
    Print = (contentHtml: string) => {
        const css = `<style type="text/css"> figure table {width: 100%} </style>`;
        contentHtml = css.concat(contentHtml);
        const newIframe = document.createElement('iframe');
        newIframe.height = '0';
        newIframe.src = 'about:blank';
        document.body.appendChild(newIframe);
        newIframe.src = 'javascript:window["contents"]';
        newIframe.focus();
        const pri = newIframe.contentWindow;
        pri?.document.open();
        pri?.document.write(contentHtml);
        pri?.document.close();
        pri?.focus();
        // pri?.print();
        setTimeout(function () {
            pri?.print();
        }, 1000);
    };
}

export default new DataMauIn();

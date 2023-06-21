import * as React from 'react';
import utils from '../../utils/utils';
import { PropToChildMauIn } from '../../utils/PropParentToChild';
import { format } from 'date-fns';

interface InHoaDonProp {
    props?: PropToChildMauIn;
}

export function InHoaDon({ props }: any) {
    const [contentData, setContentData] = React.useState('');
    React.useEffect(() => {
        let contentHtml = props.contentHtml;
        contentHtml = ReplaceHoaDon(contentHtml);
        contentHtml = ReplaceKhachHang(contentHtml);
        contentHtml = ReplaceHoaDonChiTiet(contentHtml);
        setContentData(contentHtml);
        Print(contentHtml);
    }, [props.contentHtml]);

    // for (const x in props.hoadon) {
    //     console.log('contentHoaDon', new RegExp(x, 'g'), props.hoadon);
    // }
    console.log('props', props.hoadon);
    const ReplaceHoaDon = (str: string) => {
        str = str.replace('{MaHoaDon}', `${props.hoadon?.maHoaDon}`);
        str = str.replace(
            '{NgayBan}',
            `${format(new Date(props.hoadon?.ngayLapHoaDon), 'dd/MM/yyyy HH:mm')}`
        );
        str = str.replace('{TongTienHang}', `${utils.formatNumber(props.hoadon?.tongTienHang)}`);
        str = str.replace('{DaThanhToan}', `${utils.formatNumber(props.hoadon?.tongTienHang)}`);
        str = str.replace('{TienBangChu}', `${utils.DocSo(props.hoadon?.tongThanhToan)}`);

        return str;
    };
    const ReplaceHoaDonChiTiet = (str: string) => {
        str = str.replace('{TenHangHoa}', `${props.hoadonChiTiet[0].tenHangHoa}`);
        str = str.replace('{SoLuong}', `${props.hoadonChiTiet[0].soLuong}`);
        str = str.replace('{GiaBan}', `${utils.formatNumber(props.hoadonChiTiet[0].giaBan)}`);
        str = str.replace(
            '{ThanhTien}',
            `${utils.formatNumber(props.hoadonChiTiet[0].thanhTienSauCK)}`
        );
        return str;
    };

    const ReplaceKhachHang = (str: string) => {
        str = str.replace('{MaKhachHang}', `${props.khachhang?.maKhachHang}`);
        str = str.replace('{TenKhachHang}', `${props.khachhang?.tenKhachHang}`);
        str = str.replace('{DienThoai}', `${props.khachhang?.soDienThoai}`);
        return str;
    };

    const Print = (contentHtml: string) => {
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
        pri?.print();
    };

    return (
        <>
            <div style={{ display: 'none' }}>{contentData}</div>
        </>
    );
}

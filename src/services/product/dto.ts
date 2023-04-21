import Utils from '../../utils/utils';

export class ModelHangHoaDto {
    id?: string = Utils.GuidEmpty;
    tenHangHoa?: string = '';
    tenHangHoa_KhongDau?: string = '';
    idNhomHangHoa?: string | null = '';
    idLoaiHangHoa?: number = 2;
    soPhutThucHien?: number | string = '0';
    moTa?: string = '';
    trangThai?: number = 1;
    tenNhomHang?: string = '';
    tenLoaiHangHoa?: string = 'Dịch vụ';
    txtTrangThaiHang?: string = 'Đang kinh doanh';

    idDonViQuyDoi?: string;
    tenDonViTinh?: string;
    maHangHoa?: string;
    giaBan?: string | number;
    tyLeChuyenDoi?: number;
    laDonViTinhChuan?: number;
    idHangHoa?: string;

    donViQuiDois:
        | any[]
        | {
              id: string;
              maHangHoa: string;
              tenDonViTinh: string;
              tyLeChuyenDoi: number;
              giaBan: string | number;
              laDonViTinhChuan: number;
          }[];

    constructor(
        id = Utils.GuidEmpty,
        tenHangHoa = '',
        idNhomHangHoa = '',
        moTa = '',
        donViQuiDois: any = []
    ) {
        this.id = id;
        this.tenHangHoa = tenHangHoa;
        this.idNhomHangHoa = idNhomHangHoa;
        this.moTa = moTa;
        this.donViQuiDois = donViQuiDois;
    }
}

/* group product */
export class ModelNhomHangHoa {
    id: string = Utils.GuidEmpty;
    maNhomHang? = '';
    tenNhomHang? = '';
    tenNhomHang_KhongDau = '';
    moTa? = '';
    idParent: string | null = null;
    color = '';
    laNhomHangHoa = true;

    constructor(
        id: string = Utils.GuidEmpty,
        maNhomHang = '',
        tenNhomHang = '',
        laNhomHangHoa = true
    ) {
        this.id = id;
        this.maNhomHang = maNhomHang;
        this.tenNhomHang = tenNhomHang;
        this.laNhomHangHoa = laNhomHangHoa;
    }
}

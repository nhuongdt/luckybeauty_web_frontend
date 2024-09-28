import http from '../httpService';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import { Guid } from 'guid-typescript';
import { HoaDonRequestDto } from '../dto/ParamSearchDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import utils from '../../utils/utils';
import { IFileDto } from '../dto/FileDto';
import HoaDonDto from './HoaDonDto';
import ChiTietSuDungGDVDto, { GroupChiTietSuDungGDVDto } from './ChiTietSuDungGDVDto';
import ParamSearchChiTietSuDungGDVDto from './ParamSearchChiTietSuDungGDVDto';
import HoaDonChiTietDto from './HoaDonChiTietDto';
import INhatKySuDungGDVDto from './NhatKySuDungGDVDto';
class HoaDonService {
    CreateHoaDon = async (input: any): Promise<HoaDonDto | null> => {
        if (input.idKhachHang === '' || input.idKhachHang === Guid.EMPTY.toString()) {
            input.idKhachHang = null;
        }
        if (input.idChiNhanh === '' || input.idChiNhanh === Guid.EMPTY.toString()) {
            input.idChiNhanh = null;
        }
        const result = await http.post('api/services/app/HoaDon/CreateHoaDon', input);
        return result.data.result;
    };
    CreateHoaDon2 = async (input: { hoadon: PageHoaDonDto; hoadonChiTiet: PageHoaDonChiTietDto[] }) => {
        const result = await http.post('api/services/app/HoaDon/CreateHoaDon2', input);

        return result.data.result;
    };
    UpdateHoaDon = async (input: any) => {
        // update hoadon + chitiet
        const result = await http.post('api/services/app/HoaDon/UpdateHoaDon', input);
        return result.data.result;
    };
    Update_InforHoaDon = async (input: any): Promise<HoaDonDto> => {
        // only update hoadon
        const result = await http.post('api/services/app/HoaDon/Update_InforHoaDon', input);
        return result.data.result;
    };
    UpdateTongTienHoaDon_ifChangeCTHD = async (idHoaDon: string): Promise<HoaDonDto | null> => {
        if (utils.checkNull_OrEmpty(idHoaDon)) {
            return null;
        }
        const result = await http.get(`api/services/app/HoaDon/UpdateTongTienHoaDon_ifChangeCTHD?idHoaDon=${idHoaDon}`);
        return result.data.result;
    };
    Update_ChiTietHoaDon = async (input: any, idHoaDon: string) => {
        // only update chitiet
        const result = await http.post(`api/services/app/HoaDon/Update_ChiTietHoaDon?idHoadon=${idHoaDon}`, input);
        return result.data.result;
    };
    CreateOrUpdateCTHD_byIdChiTiet = async (input: HoaDonChiTietDto): Promise<HoaDonChiTietDto | null> => {
        const result = await http.post(`api/services/app/HoaDon/CreateOrUpdateCTHD_byIdChiTiet`, input);
        return result.data.result;
    };
    GetListHoaDon = async (input: HoaDonRequestDto): Promise<PagedResultDto<PageHoaDonDto>> => {
        const result = await http.post('api/services/app/HoaDon/GetListHoaDon', input);
        return result.data.result;
    };
    GetInforHoaDon_byId = async (id: string): Promise<PageHoaDonDto[]> => {
        if (utils.checkNull(id)) {
            return [];
        }
        const result = await http.get(`api/services/app/HoaDon/GetInforHoaDon_byId?id=${id}`);
        return result.data.result;
    };
    GetChiTietHoaDon_byIdHoaDon = async (idHoaDon: string): Promise<PageHoaDonChiTietDto[]> => {
        if (utils.checkNull(idHoaDon)) {
            return [];
        }
        const result = await http.get(`api/services/app/HoaDon/GetChiTietHoaDon_byIdHoaDon?idHoaDon=${idHoaDon}`);
        return result.data.result;
    };
    GetChiTietHoaDon_byIdChiTiet = async (idChiTiet: string): Promise<PageHoaDonChiTietDto | null> => {
        if (utils.checkNull_OrEmpty(idChiTiet)) {
            return null;
        }
        const result = await http.get(`api/services/app/HoaDon/GetChiTietHoaDon_byIdChiTiet?idChiTiet=${idChiTiet}`);
        return result.data.result;
    };
    DeleteHoaDon = async (idHoaDon: string) => {
        if (utils.checkNull(idHoaDon)) {
            return [];
        }
        const result = await http.get(`api/services/app/HoaDon/DeleteHoaDon?id=${idHoaDon}`);
        return result.data.result;
    };
    KhoiPhucHoaDon = async (idHoaDon: string): Promise<boolean> => {
        if (utils.checkNull(idHoaDon)) {
            return false;
        }
        const result = await http.get(`api/services/app/HoaDon/KhoiPhucHoaDon?idHoaDon=${idHoaDon}`);
        return result.data.result;
    };
    UpdateCustomer_toHoaDon = async (idHoaDon: string, idKhachHangnew: string): Promise<boolean> => {
        if (utils.checkNull(idHoaDon)) {
            return false;
        }
        const result = await http.get(
            `api/services/app/HoaDon/UpdateCustomer_toHoaDon?idHoaDon=${idHoaDon}&idKhachHangnew=${idKhachHangnew}`
        );
        return result.data.result;
    };
    Delete_MultipleHoaDon = async (lstId: any) => {
        if (lstId !== null && lstId !== undefined && lstId.length > 0) {
            const result = await http.post(`api/services/app/HoaDon/Delete_MultipleHoaDon`, lstId);
            return result.data.result;
        }
        return false;
    };
    DeleteMultipleCTHD = async (lstId: string[]): Promise<boolean> => {
        if (lstId !== null && lstId !== undefined && lstId.length > 0) {
            const result = await http.post(`api/services/app/HoaDon/DeleteMultipleCTHD`, lstId);
            return result.data.result;
        }
        return false;
    };
    ExportToExcel = async (input: HoaDonRequestDto): Promise<IFileDto> => {
        const result = await http.post('api/services/app/HoaDon/ExportDanhSach', input);
        return result.data.result;
    };
    ExportHoaDon_byId = async (idHoaDon: string): Promise<IFileDto> => {
        const result = await http.get('api/services/app/HoaDon/ExportHoaDon_byId?idHoaDon=' + idHoaDon);
        return result.data.result;
    };

    GetChiTiet_SuDungGDV_ofCustomer = async (
        param: ParamSearchChiTietSuDungGDVDto
    ): Promise<GroupChiTietSuDungGDVDto[]> => {
        const result = await http.post('api/services/app/HoaDon/GetChiTiet_SuDungGDV_ofCustomer', param);
        return result.data.result;
    };
    GetNhatKySuDungGDV_ofKhachHang = async (
        param: ParamSearchChiTietSuDungGDVDto
    ): Promise<PagedResultDto<INhatKySuDungGDVDto>> => {
        const result = await http.post('api/services/app/HoaDon/GetNhatKySuDungGDV_ofKhachHang', param);
        return result.data.result;
    };
    CheckCustomer_hasGDV = async (customerId: string): Promise<boolean> => {
        if (utils.checkNull_OrEmpty(customerId)) {
            return false;
        }
        const result = await http.get(`api/services/app/HoaDon/CheckCustomer_hasGDV?customerId=${customerId}`);
        return result.data.result;
    };
    CheckGDV_DaSuDung = async (idGoiDV: string): Promise<boolean> => {
        if (utils.checkNull_OrEmpty(idGoiDV)) {
            return false;
        }
        const result = await http.get(`api/services/app/HoaDon/CheckGDV_DaSuDung?idGoiDV=${idGoiDV}`);
        return result.data.result;
    };
    CheckChiTietGDV_DaSuDung = async (idChiTietGDV: string): Promise<boolean> => {
        if (utils.checkNull_OrEmpty(idChiTietGDV)) {
            return false;
        }
        const result = await http.get(`api/services/app/HoaDon/CheckChiTietGDV_DaSuDung?idChiTietGDV=${idChiTietGDV}`);
        return result.data.result;
    };
}

export default new HoaDonService();

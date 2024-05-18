import http from '../httpService';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import { Guid } from 'guid-typescript';
import { HoaDonRequestDto } from '../dto/ParamSearchDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import utils from '../../utils/utils';
import { IFileDto } from '../dto/FileDto';
import HoaDonDto from './HoaDonDto';
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
    Update_InforHoaDon = async (input: any) => {
        // only update hoadon
        const result = await http.post('api/services/app/HoaDon/Update_InforHoaDon', input);
        return result.data.result;
    };
    Update_ChiTietHoaDon = async (input: any, idHoaDon: string) => {
        // only update chitiet
        const result = await http.post(`api/services/app/HoaDon/Update_ChiTietHoaDon?idHoadon=${idHoaDon}`, input);
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
    ExportToExcel = async (input: HoaDonRequestDto): Promise<IFileDto> => {
        const result = await http.post('api/services/app/HoaDon/ExportDanhSach', input);
        return result.data.result;
    };
}

export default new HoaDonService();

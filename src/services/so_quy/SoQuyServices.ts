import { StringSchema } from 'yup';
import { RequestFromToDto } from '../dto/ParamSearchDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import QuyHoaDonDto from '../so_quy/QuyHoaDonDto';
import { PagedQuyHoaDonRequestDto } from './Dto/PagedQuyHoaDonRequest';
import { GetAllQuyHoaDonItemDto } from './Dto/QuyHoaDonViewItemDto';
import utils from '../../utils/utils';
import { Guid } from 'guid-typescript';
import { IFileDto } from '../dto/FileDto';

class SoQuyServices {
    CreateQuyHoaDon = async (input: any) => {
        const result = await http.post('api/services/app/QuyHoaDon/Create', input);
        return result.data.result;
    };
    UpdateQuyHoaDon = async (input: any) => {
        const result = await http.post('api/services/app/QuyHoaDon/UpdateQuyHoaDon', input);
        return result.data.result;
    };
    DeleteSoQuy = async (id: string) => {
        const result = await http.get('api/services/app/QuyHoaDon/Delete?id=' + id);
        return result.data.result;
    };
    GetNhatKyThanhToan_ofHoaDon = async (idHoaDonLienQuan: string): Promise<QuyHoaDonDto[]> => {
        const result = await http.get(
            `api/services/app/QuyHoaDon/GetNhatKyThanhToan_ofHoaDon?idHoaDonLienQuan=${idHoaDonLienQuan}`
        );
        console.log('GetNhatKyThanhToan_ofHoaDon ', result.data.result);
        return result.data.result;
    };
    HuyPhieuThuChi_ofHoaDonLienQuan = async (idHoaDonLienQuan: string) => {
        const result = await http.get(
            `api/services/app/QuyHoaDon/HuyPhieuThuChi_ofHoaDonLienQuan?idHoaDonLienQuan=${idHoaDonLienQuan}`
        );
        return result.data.result;
    };
    async getAll(input: RequestFromToDto): Promise<PagedResultDto<GetAllQuyHoaDonItemDto>> {
        const response = await http.get('api/services/app/QuyHoaDon/GetAll', {
            params: input
        });
        return response.data.result;
    }

    async ExportToExcel(input: RequestFromToDto): Promise<IFileDto> {
        const response = await http.post('api/services/app/QuyHoaDon/ExportToExcel', input);
        return response.data.result;
    }
    async GetForEdit(idQuyHD: string): Promise<QuyHoaDonDto> {
        const response = await http.get(`api/services/app/QuyHoaDon/GetForEdit?id=${idQuyHD}`);
        return response.data.result;
    }
    CheckExistsMaPhieuThuChi = async (maHoaDon: string, idQuy: string | null = null) => {
        if (utils.checkNull(maHoaDon)) {
            return false;
        } else {
            if (utils.checkNull(idQuy)) {
                idQuy = Guid.EMPTY;
            }
            const response = await http.get(
                `api/services/app/QuyHoaDon/CheckExistsMaPhieuThuChi?maphieu=${maHoaDon}&id=${idQuy}`
            );
            return response.data.result;
        }
    };
}

export default new SoQuyServices();

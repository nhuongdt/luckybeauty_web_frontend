import { RequestFromToDto } from '../../dto/ParamSearchDto';
import { PagedResultDto } from '../../dto/pagedResultDto';
import { CreateOrEditSMSDto, CustomerSMSDto, ESMSDto, NhatKyGuiTinSMSDto, ResultESMSDto } from './gui_tin_nhan_dto';
import http from '../../httpService';
import { CustomerBasicDto } from '../../khach-hang/dto/CustomerBasicDto';

class HeThongSMSServices {
    JqAutoCustomer_byIdLoaiTin = async (input: RequestFromToDto, idLoaiTin: number): Promise<CustomerBasicDto[]> => {
        // get ds khachhang co: sinhnhat, lichhen, giaodich
        const result = await http.post(
            `api/services/app/HeThongSMS/JqAutoCustomer_byIdLoaiTin?idLoaiTin=${idLoaiTin}`,
            input
        );
        return result.data.result;
    };
    GetListCustomer_byIdLoaiTin = async (
        input: RequestFromToDto,
        idLoaiTin: number
    ): Promise<PagedResultDto<CustomerSMSDto[]>> => {
        const result = await http.post(
            `api/services/app/HeThongSMS/GetListCustomer_byIdLoaiTin?idLoaiTin=${idLoaiTin}`,
            input
        );
        return result.data.result;
    };
    Insert_HeThongSMS = async (input: CreateOrEditSMSDto): Promise<CreateOrEditSMSDto> => {
        const result = await http.post(`api/services/app/HeThongSMS/Insert_HeThongSMS`, input);
        return result.data.result;
    };
    GetListSMS = async (input: RequestFromToDto): Promise<PagedResultDto<CreateOrEditSMSDto>> => {
        const result = await http.post(`api/services/app/HeThongSMS/GetListSMS`, input);
        return result.data.result;
    };
    SendSMS_Json = async (input: ESMSDto): Promise<ResultESMSDto> => {
        // api cua ben ESMS: tra ve idTinNhan + trangthaiTin
        const result = await http.post(`api/services/app/ESMS/SendSMS_Json`, input);
        return result.data.result;
    };
    ThemMoi_NhatKyGuiTin = async (input: NhatKyGuiTinSMSDto): Promise<ResultESMSDto> => {
        const result = await http.post(`api/services/app/HeThongSMS/ThemMoi_NhatKyGuiTin`, input);
        return result.data.result;
    };
}

export default new HeThongSMSServices();

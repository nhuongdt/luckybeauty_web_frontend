import { PagedRequestDto } from '../../dto/pagedRequestDto';
import http from '../../httpService';
import { BrandnameDto } from './BrandnameDto';

class BrandnameService {
    GetListBandname = async (params: PagedRequestDto) => {
        const result = await http.post(`api/services/app/Brandname/GetListBandname`, params);
        return result.data.result;
    };
    CreateBrandname = async (input: BrandnameDto) => {
        const result = await http.post('api/services/app/Brandname/CreateBrandname', input);
        return result.data.result;
    };
    UpdateBrandname = async (input: BrandnameDto) => {
        const result = await http.post('api/services/app/Brandname/UpdateBrandname', input);
        return result.data.result;
    };
    XoaBrandname = async (id: string) => {
        const result = await http.get('api/services/app/Brandname/XoaBrandname?id=' + id);
        return result.data.result;
    };
}

export default new BrandnameService();

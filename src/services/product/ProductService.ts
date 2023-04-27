import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';

import { ModelHangHoaDto, ModelNhomHangHoa, PagedProductSearchDto } from './dto';

class ProductService {
    GetDetailProduct = async (id: string): Promise<PagedResultDto<ModelHangHoaDto>> => {
        const data = await http
            .get(`api/services/app/HangHoa/GetDetailProduct?idDonViQuyDoi=${id}`)
            .then((res) => {
                return res.data.result;
            });
        console.log('GetDetailProduct ', data);
        return data;
    };
    Get_DMHangHoa = async (input: PagedProductSearchDto) => {
        const xx = await http
            .post(`api/services/app/HangHoa/GetDMHangHoa`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        console.log('GetDMHangHoa', xx);
        return xx;
    };
    CreateOrEditProduct = async (input: ModelHangHoaDto) => {
        const xx = await http
            .post(`api/services/app/HangHoa/CreateOrEdit`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        console.log('CreateOrEdit', xx, input);
        return xx;
    };
    DeleteProduct_byIDHangHoa = async (idHangHoa: string) => {
        const xx = await http
            .post(`api/services/app/HangHoa/Delete`, idHangHoa)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        console.log('DeleteProduct_byIDHangHoa', xx);
        return xx;
    };
}
export default new ProductService();

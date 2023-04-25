import http from '../httpService';
import { ModelHangHoaDto, ModelNhomHangHoa, IPagedProductSearchDto } from './dto';
class ProductService {
    GetDetailProduct = async (id: string) => {
        const data = await http
            .get(`api/services/app/HangHoa/GetDetailProduct?idDonViQuyDoi=${id}`)
            .then((res) => {
                return res.data.result;
            });
        console.log('GetDetailProduct ', data);
        return data;
    };
    Get_DMHangHoa = async (input: IPagedProductSearchDto) => {
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
}
export default new ProductService();

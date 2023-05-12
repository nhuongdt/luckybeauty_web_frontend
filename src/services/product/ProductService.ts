import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { ModelHangHoaDto, PagedProductSearchDto } from './dto';
import Utils from '../../utils/utils';

class ProductService {
    CheckExistsMaHangHoa = async (maHangHoa: string, id?: string) => {
        if (!Utils.checkNull(maHangHoa)) {
            const data = await http
                .get(
                    `api/services/app/HangHoa/CheckExistsMaHangHoa?mahanghoa=${maHangHoa}&id=${id}`
                )
                .then((res) => {
                    return res.data.result;
                });
            return data;
        } else {
            return false;
        }
    };
    GetDetailProduct = async (id: string) => {
        const data = await http
            .get(`api/services/app/HangHoa/GetDetailProduct?idDonViQuyDoi=${id}`)
            .then((res) => {
                return res.data.result;
            });
        console.log('GetDetailProduct ', data);
        return data;
    };
    Get_DMHangHoa = async (input: any) => {
        const xx = await http
            .post(`api/services/app/HangHoa/GetDMHangHoa`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    CreateOrEditProduct = async (input: ModelHangHoaDto) => {
        const xx = await http
            .post(`api/services/app/HangHoa/CreateOrEdit`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    DeleteProduct_byIDHangHoa = async (idHangHoa: string) => {
        const xx = await http
            .post(`api/services/app/HangHoa/Delete?id=${idHangHoa}`)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
    GetDMHangHoa_groupByNhom = async (input: any) => {
        const xx = await http
            .post(`api/services/app/HangHoa/GetDMHangHoa_groupByNhom`, input)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        return xx;
    };
}
export default new ProductService();

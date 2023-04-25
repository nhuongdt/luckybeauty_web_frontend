import http from '../httpService';
import { ModelHangHoaDto, ModelNhomHangHoa, PagedProductSearchDto } from './dto';
class GroupProductService {
    GetNhomHangHoa_byID = async (id: string) => {
        const xx = await http
            .get(`api/services/app/NhomHangHoa/GetNhomHangHoa_byID?id=${id}`)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        console.log('GetNhomHangHoa_byID ', xx);
        return xx;
    };
    GetDM_NhomHangHoa = async () => {
        const xx = await http
            .get(`api/services/app/NhomHangHoa/GetNhomDichVu`)
            .then((res: { data: { result: any } }) => {
                return res.data.result;
            });
        console.log('GetDM_NhomHangHoa ', xx);
        return xx;
    };
    InsertNhomHangHoa = async (param: ModelNhomHangHoa) => {
        const xx = await http
            .post(`api/services/app/NhomHangHoa/CreateNhomHangHoa`, param)
            .then((res) => {
                return res.data.result;
            });
        return xx;
    };
}
export default new GroupProductService();

import http from '../httpService';
import { ModelHangHoaDto, ModelNhomHangHoa } from './dto';
export const Get_DMHangHoa = async (input: {
    idNhomHangHoas: string | null;
    paramSearch: {
        textSearch: string;
        currentPage: number;
        pageSize: number;
        columnSort: string;
        typeSort: string;
    };
}) => {
    const xx = await http
        .post(`${process.env.REACT_APP_BASE_URL_LOCAL}HangHoa/GetDMHangHoa`, input)
        .then((res: { data: { result: any } }) => {
            return res.data.result;
        });
    console.log('GetDMHangHoa', xx);
    return xx;
};
export const CreateOrEditProduct = async (input: ModelHangHoaDto) => {
    const xx = await http
        .post(`${process.env.REACT_APP_BASE_URL_LOCAL}HangHoa/CreateOrEdit`, input)
        .then((res: { data: { result: any } }) => {
            return res.data.result;
        });
    console.log('CreateOrEdit', xx);
    return xx;
};

/* group product */
export const GetNhomHangHoa_byID = async (id: string) => {
    const xx = await http
        .get(`${process.env.REACT_APP_BASE_URL_LOCAL}NhomHangHoa/GetNhomHangHoa_byID?id=${id}`)
        .then((res: { data: { result: any } }) => {
            return res.data.result;
        });
    console.log('GetNhomHangHoa_byID ', xx);
    return xx;
};

export const GetDM_NhomHangHoa = async () => {
    const xx = await http
        .get(`${process.env.REACT_APP_BASE_URL_LOCAL}NhomHangHoa/GetNhomDichVu`)
        .then((res: { data: { result: any } }) => {
            return res.data.result;
        });
    console.log('GetDM_NhomHangHoa ', process.env.REACT_APP_BASE_URL_LOCAL);
    return xx;
};

export const InsertNhomHangHoa = async (param: ModelNhomHangHoa) => {
    const xx = await http
        .post(`${process.env.REACT_APP_BASE_URL_LOCAL}NhomHangHoa/CreateNhomHangHoa`, param)
        .then((res) => {
            return res.data.result;
        });
    return xx;
};

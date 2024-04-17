import axios from 'axios';
import utils from '../../utils/utils';

export interface ImgurCommonDto<T> {
    status: number;
    success: boolean;
    data?: T;
}

export interface Imgur_ImageDetailDto {
    id: string;
    deletehash: string;
    title: string;
    link: string;
    width: number;
    height: number;
    size: number;
}

class ImgurAPI {
    GetFile_fromId = async (fileId = 'mVu3TZz'): Promise<ImgurCommonDto<Imgur_ImageDetailDto> | null> => {
        if (utils.checkNull(fileId)) return null;
        const response = await axios.get(`https://api.imgur.com/3/image/${fileId}`, {
            headers: {
                Authorization: `Client-ID ${process.env.REACT_APP_IMGUR_CLIENT_ID}`
            }
        });
        return response.data;
    };
    UploadFile = async (file: File): Promise<ImgurCommonDto<Imgur_ImageDetailDto>> => {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Client-ID ${process.env.REACT_APP_IMGUR_CLIENT_ID}`);

        const formdata = new FormData();
        formdata.append('image', file, file.name);
        formdata.append('type', 'image');
        formdata.append('title', 'test upload file');
        formdata.append('description', 'use fetch');

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata
        };
        const result = await fetch('https://api.imgur.com/3/image', requestOptions);
        const data = await result.json();
        return data;
    };
    DeleteFile = async () => {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer {{accessToken}}');

        const formdata = new FormData();

        const requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: formdata
        };

        fetch('https://api.imgur.com/3/image/{{imageHash}}', requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log('error', error));
    };
}
export default new ImgurAPI();

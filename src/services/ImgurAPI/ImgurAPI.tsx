import axios from 'axios';

class ImgurAPI {
    GetFile_fromId = async (fileId = 'mVu3TZz') => {
        const result = await axios.get(`https://api.imgur.com/3/image/${fileId}`, {
            headers: {
                Authorization: `Client-ID ${process.env.REACT_APP_IMGUR_CLIENT_ID}`
            }
        });
        return result.data.data; // {id, link}
    };
    UploadFile = async (file: File) => {
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

        const result = await fetch('https://api.imgur.com/3/image', requestOptions)
            .then((response) => console.log(22, response.text()))
            .then((result) => {
                return result;
            })
            .catch((error) => console.log('error', error));
        console.log('result imgu ', result);
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

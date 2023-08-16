import utils from '../utils/utils';
import { IFileDto } from './dto/FileDto';
import http from './httpService';
import Cookies from 'js-cookie';

class UpLoadFileService {
    async downloadImportTemplate(fileName: string): Promise<IFileDto> {
        const res = await http.get(
            `/api/upload-file/download-import-template?fileName=${fileName}`
        );
        return res.data;
    }

    AppendFile_toFormData = (fileImage: File) => {
        const formData = new FormData();
        formData.append('file', fileImage);
        return formData;
    };

    GetLinkFileOnDrive_byFileId = (fileId: string) => {
        if (!utils.checkNull(fileId)) {
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
        }
        return '';
    };
    GoogleApi_UploaFileToDrive = async (fileSelect: File) => {
        const tenantName = Cookies.get('TenantName');
        const fromData = this.AppendFile_toFormData(fileSelect);
        const data = await http
            .post(
                `api/services/app/GoogleAPI/GoogleApi_UploaFileToDrive?tenantName=${tenantName}`,
                fromData
            )
            .then((res) => {
                return res.data.result;
            });
        return data;
    };
    GoogleApi_UpdateFileIfExist = async (fileSelect: File, fileId: string) => {
        const tenantName = Cookies.get('TenantName');
        const fromData = this.AppendFile_toFormData(fileSelect);
        const data = await http
            .post(
                `api/services/app/GoogleAPI/GoogleApi_UploaFileToDrive?fileId=${fileId}&tenantName=${tenantName}`,
                fromData
            )
            .then((res) => {
                return res.data.result;
            });
        return data;
    };
}

export default new UpLoadFileService();

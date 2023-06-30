import { makeAutoObservable } from 'mobx';
import AppConsts from '../lib/appconst';
// import { saveAs } from 'file-saver';
import { FileDto, IFileDto } from './dto/FileDto';

class FileDownloadService {
    static downloadTempFile(result: IFileDto) {
        throw new Error('Method not implemented.');
    }
    constructor() {
        makeAutoObservable(this);
    }
    downloadTempFile(file: IFileDto) {
        const url =
            AppConsts.remoteServiceBaseUrl +
            'File/DownloadTempFile?fileType=' +
            file.fileType +
            '&fileToken=' +
            file.fileToken +
            '&fileName=' +
            file.fileName;
        location.href = url; //TODO: This causes reloading of same page in Firefox
        alert(url);
    }
}

export default FileDownloadService;

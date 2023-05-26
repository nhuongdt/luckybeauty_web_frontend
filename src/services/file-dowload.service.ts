import AppConsts from '../lib/appconst';
import axios from 'axios';
// import { saveAs } from 'file-saver';
import { FileDto } from './dto/FileDto';

class FileDownloadService {
    downloadTempFile(file: FileDto) {
        const url =
            AppConsts.remoteServiceBaseUrl +
            'File/DownloadTempFile?fileType=' +
            file.fileType +
            '&fileToken=' +
            file.fileToken +
            '&fileName=' +
            file.fileName;

        console.log(url);
    }
}

export default new FileDownloadService();

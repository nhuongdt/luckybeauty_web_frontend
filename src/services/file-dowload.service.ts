import AppConsts from '../lib/appconst';
// import { saveAs } from 'file-saver';
import { FileDto, IFileDto } from './dto/FileDto';

class FileDownloadService {
    downloadTempFile(file: IFileDto) {
        try {
            console.log(file);
            if (!file || !file.fileType || !file.fileToken || !file.fileName) {
                console.error('Invalid file object');
                return;
            }
            const url = `${file.fileName}`;
            console.log(url);
            window.location.href = url; // TODO: This causes reloading of the same page in Firefox
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }
}

export default new FileDownloadService();

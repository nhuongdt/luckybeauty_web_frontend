import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { EditionListDto } from './dto/EditionListDto';
class EditionService {
    public async getAllEdition(): Promise<PagedResultDto<EditionListDto>> {
        const result = await http.get('api/services/app/Edition/GetEditions');
        return result.data.result;
    }
}
export default new EditionService();

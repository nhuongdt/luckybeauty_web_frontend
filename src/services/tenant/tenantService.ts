import CreateTenantInput from './dto/createTenantInput';
import CreateTenantOutput from './dto/createTenantOutput';
import { EntityDto } from '../../services/dto/entityDto';
import { GetAllTenantOutput } from './dto/getAllTenantOutput';
import GetTenantOutput from './dto/getTenantOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { PagedTenantResultRequestDto } from './dto/PagedTenantResultRequestDto';
import UpdateTenantInput from './dto/updateTenantInput';
import UpdateTenantOutput from './dto/updateTenantOutput';
import http from '../httpService';

class TenantService {
    public async create(createTenantInput: CreateTenantInput): Promise<CreateTenantOutput> {
        const result = await http.post('api/services/app/Tenant/Create', createTenantInput);
        return result.data.result;
    }

    public async delete(entityDto: EntityDto) {
        const result = await http.delete('api/services/app/Tenant/Delete', {
            params: entityDto
        });
        return result.data;
    }

  public async get(entityDto: number): Promise<GetTenantOutput> {
    const result = await http.get(`api/services/app/Tenant/Get?Id=${entityDto}`)
    return result.data.result
  }

    public async getAll(
        pagedFilterAndSortedRequest: PagedTenantResultRequestDto
    ): Promise<PagedResultDto<GetAllTenantOutput>> {
        const result = await http.get('api/services/app/Tenant/GetAll', {
            params: pagedFilterAndSortedRequest
        });
        return result.data.result;
    }

    public async update(updateTenantInput: UpdateTenantInput): Promise<UpdateTenantOutput> {
        const result = await http.put('api/services/app/Tenant/Update', updateTenantInput);
        return result.data.result;
    }
}

export default new TenantService();

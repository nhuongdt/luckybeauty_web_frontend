import { makeAutoObservable } from 'mobx';

import type { CreateRoleInput } from '../services/role/dto/createRoleInput';
import { EntityDto } from '../services/dto/entityDto';
import { GetAllPermissionsOutput } from '../services/role/dto/getAllPermissionsOutput';
import { GetAllRoleOutput } from '../services/role/dto/getAllRoleOutput';
import type { GetRoleAsyncInput } from '../services/role/dto/getRolesAsyncInput';
import type { PagedResultDto } from '../services/dto/pagedResultDto';
import type { PagedRoleResultRequestDto } from '../services/role/dto/PagedRoleResultRequestDto';
import RoleEditModel from '../models/Roles/roleEditModel';
import type { UpdateRoleInput } from '../services/role/dto/updateRoleInput';
import roleService from '../services/role/roleService';
import { CreateOrEditRoleDto } from '../services/role/dto/createOrEditRoleDto';

class RoleStore {
    roles!: PagedResultDto<GetAllRoleOutput>;

    roleEdit: RoleEditModel = new RoleEditModel();

    allPermissions: GetAllPermissionsOutput[] = [];

    constructor() {
        makeAutoObservable(this);
    }
    async createOrEdit(createOrEditInput: CreateOrEditRoleDto) {
        await roleService.createOrEdit(createOrEditInput);
    }

    async createRole() {
        this.roleEdit = {
            grantedPermissionNames: [],
            role: {
                name: '',
                displayName: '',
                description: '',
                id: 0
            },
            permissions: [{ name: '', displayName: '', description: '' }]
        };
    }
    async getRolesAsync(getRoleAsyncInput: GetRoleAsyncInput) {
        await roleService.getRolesAsync(getRoleAsyncInput);
    }

    async delete(entityDto: EntityDto) {
        await roleService.delete(entityDto.id);
        this.roles.items = this.roles.items.filter((x: GetAllRoleOutput) => x.id !== entityDto.id);
    }

    async getAllPermissions() {
        const result = await roleService.getAllPermissions();
        this.allPermissions = result;
    }

    async get(entityDto: EntityDto) {
        const result = await roleService.get(entityDto.id);
        this.roles = result.data.result;
    }

    async getAll(pagedFilterAndSortedRequest: PagedRoleResultRequestDto) {
        const result = await roleService.getAll(pagedFilterAndSortedRequest);
        this.roles = result;
    }
}

export default RoleStore;

import {  makeAutoObservable } from 'mobx'

import type { CreateRoleInput } from '../services/role/dto/createRoleInput'
import { EntityDto } from '../services/dto/entityDto'
import { GetAllPermissionsOutput } from '../services/role/dto/getAllPermissionsOutput'
import { GetAllRoleOutput } from '../services/role/dto/getAllRoleOutput'
import type { GetRoleAsyncInput } from '../services/role/dto/getRolesAsyncInput'
import type { PagedResultDto } from '../services/dto/pagedResultDto'
import type { PagedRoleResultRequestDto } from '../services/role/dto/PagedRoleResultRequestDto'
import RoleEditModel from '../models/Roles/roleEditModel'
import type { UpdateRoleInput } from '../services/role/dto/updateRoleInput'
import roleService from '../services/role/roleService'

class RoleStore {
  roles!: PagedResultDto<GetAllRoleOutput>

  roleEdit: RoleEditModel = new RoleEditModel()

  allPermissions: GetAllPermissionsOutput[] = []


  constructor(){
      makeAutoObservable(this)
  }
  async create(createRoleInput: CreateRoleInput) {
    await roleService.create(createRoleInput)
  }

  async createRole() {
    this.roleEdit = {
      grantedPermissionNames: [],
      role: {
        name: '',
        displayName: '',
        description: '',
        id: 0,
      },
      permissions: [{ name: '', displayName: '', description: '' }],
    }
  }
  async getRolesAsync(getRoleAsyncInput: GetRoleAsyncInput) {
    await roleService.getRolesAsync(getRoleAsyncInput)
  }

  async update(updateRoleInput: UpdateRoleInput) {
    await roleService.update(updateRoleInput)
    this.roles.items
      .filter((x: GetAllRoleOutput) => x.id === updateRoleInput.id)
      .map((x: GetAllRoleOutput) => {
        return (x = updateRoleInput)
      })
  }

  async delete(entityDto: EntityDto) {
    await roleService.delete(entityDto)
    this.roles.items = this.roles.items.filter(
      (x: GetAllRoleOutput) => x.id !== entityDto.id
    )
  }

  async getAllPermissions() {
    const result = await roleService.getAllPermissions()
    this.allPermissions = result
  }

  async getRoleForEdit(entityDto: number) {
    const result = await roleService.getRoleForEdit(entityDto)
    this.roleEdit.grantedPermissionNames = result.grantedPermissionNames
    this.roleEdit.permissions = result.permissions
    this.roleEdit.role = result.role
  }

  async get(entityDto: EntityDto) {
    const result = await roleService.get(entityDto)
    this.roles = result.data.result
  }

  async getAll(pagedFilterAndSortedRequest: PagedRoleResultRequestDto) {
    const result = await roleService.getAll(pagedFilterAndSortedRequest)
    this.roles = result
  }
}

export default RoleStore

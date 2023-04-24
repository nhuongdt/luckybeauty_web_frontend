import React from 'react'
import AppComponentBase from '../../components/AppComponentBase'
import { Button, FormInstance, Space } from 'antd'
import { EntityDto } from '../../services/dto/entityDto'
import roleService from '../../services/role/roleService'
import { Pagination, Stack } from '@mui/material'
import { EditOutlined } from '@ant-design/icons'
import { DeleteOutline } from '@mui/icons-material'
import { GetAllRoleOutput } from '../../services/role/dto/getAllRoleOutput'
import '../../custom.css'
import CreateOrEditRole from './create-or-edit-role'
import { GetAllPermissionsOutput } from '../../services/role/dto/getAllPermissionsOutput'
import RoleEditModel from '../../models/Roles/roleEditModel'
export interface IRoleProps {
}

export interface IRoleState {
  modalVisible: boolean
  maxResultCount: number
  skipCount: number
  roleId: number
  filter: string
  listRole: GetAllRoleOutput[]
  totalCount: number,
  allPermissions : GetAllPermissionsOutput[],
  roleEdit: RoleEditModel
  currentPage: number;
  totalPage: number;
  startIndex: number;
}
class RoleScreen extends AppComponentBase<IRoleProps, IRoleState> {
  formRef = React.createRef<FormInstance>()

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    roleId: 0,
    filter: '',
    listRole: [] as GetAllRoleOutput[],
    totalCount: 0,
    allPermissions: [] as GetAllPermissionsOutput[],
    roleEdit: {} as RoleEditModel,
    currentPage: 1,
    totalPage: 0,
    startIndex: 1
  }

  async componentDidMount() {
    await this.getAll()
  }

  async getAll() {
    const roles = await roleService.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      keyword: this.state.filter,
    })
    const permissions = await roleService.getAllPermissions()
    this.setState({
      listRole: roles.items,
      totalCount: roles.totalCount,
      allPermissions: permissions,
      totalPage: Math.ceil(roles.totalCount / this.state.maxResultCount),
    })
  }

  handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const { maxResultCount } = this.state;
    this.setState({
      currentPage: value,
      skipCount: value,
      startIndex: (value - 1 <= 0 ? 0 : value - 1) * maxResultCount,
    });
    this.getAll();
  };

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  }

  async createOrUpdateModalOpen(id: number) {
    if (id === 0) {
      const allPermission = await roleService.getAllPermissions()
      this.setState({
        allPermissions: allPermission
      })
    } else {
      const roleForEdit = await roleService.getRoleForEdit(id)

      const allPermission = await roleService.getAllPermissions()
      this.setState({
        allPermissions: allPermission,
        roleId : id,
        roleEdit: roleForEdit
      })
    }

    this.setState({ roleId: id })
    this.Modal()

    // setTimeout(() => {
    //   this.formRef.current?.setFieldsValue({
    //     ...this.props.roleStore.roleEdit.role,
    //     grantedPermissions:
    //       this.props.roleStore.roleEdit.grantedPermissionNames,
    //   })
    // }, 100)
  }

  delete(input: EntityDto) {
    const self = this
  }

  handleCreate = () => {
    const form = this.formRef.current
    form!.validateFields().then(async (values: any) => {
      if (this.state.roleId === 0) {
        await roleService.create(values)
      } else {
        await roleService.update({ id: this.state.roleId, ...values })
      }

      await this.getAll()
      this.setState({ modalVisible: false })
      form!.resetFields()
    })
  }

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => this.getAll())
  }
  render(){
    return (
      <div className="container">
      <div className="page-header">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <div>
            <div className="pt-2">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    Vai trò
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Quản lý vai trò
                  </li>
                </ol>
              </nav>
            </div>
            <div>
              <h3>Vai trò</h3>
            </div>
          </div>
          <div>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={1}
            >
              <div className="search w-100">
                <i className="fa-thin fa-magnifying-glass"></i>
                <input
                  type="text"
                  //onChange={()=>{this.handleSearch()}}
                  className="input-search"
                  placeholder="Tìm kiếm ..."
                />
              </div>
              <Stack
                direction="row"
                justifyContent="flex-endspace-between"
                alignItems="center"
                spacing={1}
              >
                <Button className="btn-import">
                  <i className="fa fa-home"></i> Nhập
                </Button>
                <Button className="btn-export">
                  <i className="fa fa-home"></i> Xuất
                </Button>
              </Stack>
              <Button className="btn btn-add-item" onClick={this.Modal}>
                Thêm vai trò
              </Button>
            </Stack>
          </div>
        </Stack>
      </div>
      <div className="page-content pt-2">
        <table className="h-100 w-100 table table-border-0 table">
          <thead className="bg-table w-100">
              <tr style={{ height: "48px" }}>
                <th className="text-center">
                  <input
                    className="text-th-table text-center"
                    type="checkbox"
                  />
                </th>
                <th className="text-th-table text-center">STT</th>
                <th className="text-th-table">
                  Tên vai trò
                </th>
                <th className="text-th-table">
                  Mô tả
                </th>
                <th className="text-th-table">
                  Hành động
                </th>
              </tr>
          </thead>
          <tbody>
            {this.state.listRole.map((item,index)=>{
              return(
              <tr>
                <td className="text-td-table text-center" style={{width: '50px'}}>
                  <input
                      className="text-th-table text-center"
                      type="checkbox"
                    />
                </td>
                <td className="text-td-table text-center" style={{width: '100px'}}>
                    {index+1}
                </td>
                <td className="text-td-table">
                    {item.name}  
                </td>
                <td className="text-td-table">
                    {item.description}
                </td>
                <td className="text-td-table" style={{width: '150px'}}>
                <Space wrap direction="horizontal">
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                          this.setState({
                            roleId: item.id,
                          });
                          this.createOrUpdateModalOpen(item.id)
                        }}
                      />
                      <Button
                        danger
                        icon={<DeleteOutline/>}
                        onClick={() => {
                          this.setState({
                            roleId: item.id,
                          });
                          // this.onCancelDelete()
                        }}
                      />
                    </Space>
                </td>
              </tr>
              )
            })}
              
          </tbody>
        </table>
        <div className="row">
            <div className="col-6" style={{ float: "left" }}></div>
            <div className="col-6" style={{ float: "right" }}>
              <div className="row">
                <div className="col-5 align-items-center">
                  <label
                    className="pagination-view-record align-items-center"
                    style={{ float: "right" }}
                  >
                    Hiển thị{" "}
                    {this.state.currentPage * this.state.maxResultCount - 9}-
                    {this.state.currentPage * this.state.maxResultCount} của{" "}
                    {this.state.totalCount} mục
                  </label>
                </div>
                <div style={{ float: "right" }} className="col-7">
                  <Stack spacing={1.5} className="align-items-center">
                    <Pagination
                      count={this.state.totalPage}
                      defaultPage={this.state.currentPage}
                      onChange={this.handlePageChange}
                      color="secondary"
                      shape="rounded"
                    />
                  </Stack>
                </div>
              </div>
            </div>
          </div>
      </div>
      <CreateOrEditRole
          visible={this.state.modalVisible}
          onCancel={() =>
            this.setState({
              modalVisible: false,
            })
          }
          modalType={this.state.roleId === 0 ? 'Thêm mới quyền' : 'Cập nhật quyền'}
          onOk={this.handleCreate}
          permissions={this.state.allPermissions}
          //formRef={this.formRef}
        />
    </div>
    )
  }
  
}

export default RoleScreen
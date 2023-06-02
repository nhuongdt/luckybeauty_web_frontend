export interface CreateOrEditRoleDto {
    name: string;
    displayName: string;
    description: string;
    grantedPermissionNames: string[];
    id: number;
}

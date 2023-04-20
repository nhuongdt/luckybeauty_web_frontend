class abpClient {
    public isGrandPermission(permission: string, listPermission: string[]) {
        if (listPermission.includes(permission) || permission === '') {
            return true;
        }
        return false;
    }
}
export default new abpClient();

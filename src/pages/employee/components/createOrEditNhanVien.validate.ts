const employeeRules = {
    hoNhanVien: [{ require: true, message: 'Họ nhân viên không được để trống' }],
    tenNhanVien: [{ require: true, message: 'Tên nhân viên không được để trống' }],
    soDienThoai: [{ require: true, message: 'Số điện thoại nhân viên không được để trống' }],
    ngaySinh: [{ require: true, message: 'Ngày sinh không được để trống' }]
};
export default employeeRules;

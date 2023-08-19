import http from '../httpService';

class DichVuNhanVienDetailDto {
    async getDichVuNhanVienDetail(idNhanVien: string) {
        const response = await http.post(
            `api/services/app/NhanVienDichVu/GetDetail?idNhanVien=${idNhanVien}`
        );
        return response.data.result;
    }
}
export default new DichVuNhanVienDetailDto();

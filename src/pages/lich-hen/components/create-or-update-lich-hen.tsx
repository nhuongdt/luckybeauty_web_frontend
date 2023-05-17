import {
    Button,
    Col,
    Form,
    FormInstance,
    Input,
    Modal,
    Row,
    Select,
    TimePicker,
    Typography
} from 'antd';
import {
    AiOutlineCalendar,
    AiOutlineClockCircle,
    AiOutlinePlus,
    AiOutlineSearch
} from 'react-icons/ai';
import { SuggestDonViQuiDoiDto } from '../../../services/suggests/dto/SuggestDonViQuiDoi';
import { SuggestKhachHangDto } from '../../../services/suggests/dto/SuggestKhachHangDto';
import { SuggestNhanSuDto } from '../../../services/suggests/dto/SuggestNhanSuDto';
import { Component, ReactNode } from 'react';
const { Text, Title } = Typography;
const timeFormat = 'HH:mm';
interface AppointmentProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    suggestDichVu: SuggestDonViQuiDoiDto[];
    suggestKhachHang: SuggestKhachHangDto[];
    suggestNhanVien: SuggestNhanSuDto[];
    onOk: () => void;
    formRef: React.RefObject<FormInstance>;
}
class CreateOrUpdateAppointment extends Component<AppointmentProps> {
    render(): ReactNode {
        const {
            visible,
            onCancel,
            onOk,
            modalType,
            suggestDichVu,
            suggestKhachHang,
            suggestNhanVien,
            formRef
        } = this.props;
        return (
            <Modal
                visible={visible}
                title={<Title level={3}>{modalType}</Title>}
                cancelButtonProps={{
                    style: {
                        backgroundColor: '#FFFFFF',
                        color: '#965C85',
                        border: '1px solid #965C85',
                        borderRadius: 4
                    }
                }}
                cancelText="Hủy"
                okButtonProps={{
                    style: {
                        backgroundColor: '#B085A4',
                        color: '#FFFAFF',
                        border: '1px solid #965C85',
                        borderRadius: 4
                    }
                }}
                okText="Lưu"
                onCancel={onCancel}
                onOk={onOk}
                destroyOnClose={true}
                width={1006}>
                <Form ref={formRef} layout="vertical">
                    <Row gutter={24}>
                        <Col span={11}>
                            <Form.Item name={'idKhachHang'}>
                                <Select
                                    size="large"
                                    style={{ width: '100%' }}
                                    placeholder="Tìm tên"
                                    dropdownRender={(menu) => (
                                        <div className="text-center">
                                            <Button
                                                type="link"
                                                icon={<AiOutlinePlus />}
                                                className="btn-add-in-select">
                                                <span style={{ marginLeft: '10px' }}>
                                                    Thêm khách hàng mới
                                                </span>
                                            </Button>
                                            {menu}
                                        </div>
                                    )}>
                                    {suggestKhachHang.map((item) => {
                                        return (
                                            <Select.Option value={item.id}>
                                                {item.tenKhachHang} - {item.soDienThoai}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={13}>
                            <Text>Chi tiết cuộc hẹn</Text>
                            <Row gutter={4} style={{ marginTop: '20px' }}>
                                <Col span={8}>
                                    <Form.Item label="Ngày" name={'startTime'}>
                                        <Input size="large" type="date" />
                                    </Form.Item>
                                </Col>
                                <Col span={16}>
                                    <Form.Item label="Dịch vụ" name={'IdDonViQuiDoi'}>
                                        <Select size="large">
                                            {suggestDichVu.map((item) => {
                                                return (
                                                    <Select.Option value={item.id}>
                                                        {item.tenDonVi}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={4}>
                                <Col span={8}>
                                    <Form.Item label="Giờ" name={'startHours'}>
                                        <Input type="time" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={16}>
                                    <Form.Item name="idNhanVien" label="Nhân sự đã có">
                                        <Select size="large">
                                            {suggestNhanVien.map((item) => {
                                                return (
                                                    <Select.Option value={item.id}>
                                                        {item.tenNhanVien}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="Trạng thái" name={'trangThai'}>
                                <Select size="large" defaultValue={1}>
                                    <Select.Option value={1}>Đặt lịch</Select.Option>
                                    <Select.Option value={2}>Đã liên hệ với khách</Select.Option>
                                    <Select.Option value={3}>CheckIn</Select.Option>
                                    <Select.Option value={0}>Xóa</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Ghi chú" name={'ghiChu'}>
                                <Input.TextArea size="large" rows={4} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default CreateOrUpdateAppointment;

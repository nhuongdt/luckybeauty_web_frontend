import { Col, Form, FormInstance, Input, Modal, Row, Select, Typography } from 'antd';
import { AiOutlineCalendar, AiOutlineClockCircle, AiOutlineSearch } from 'react-icons/ai';
const { Text, Title } = Typography;
interface AppointmentProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    onOk: () => void;
    formRef: React.RefObject<FormInstance>;
}
const CreateOrUpdateAppointment = ({
    visible,
    onCancel,
    onOk,
    modalType,
    formRef
}: AppointmentProps) => {
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
                        <Input size="large" placeholder="large size" prefix={<AiOutlineSearch />} />
                    </Col>
                    <Col span={13}>
                        <Text>Chi tiết cuộc hẹn</Text>
                        <Row gutter={4} style={{ marginTop: '20px' }}>
                            <Col span={8}>
                                <Form.Item label="Ngày" name={'soDienThoai'}>
                                    <Input size="large" prefix={<AiOutlineCalendar />} />
                                </Form.Item>
                            </Col>
                            <Col span={16}>
                                <Form.Item label="Dịch vụ" name={'IdDichVu'}>
                                    <Select size="large"></Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={4}>
                            <Col span={8}>
                                <Form.Item label="Giờ" name={'time'}>
                                    <Input size="large" prefix={<AiOutlineClockCircle />} />
                                </Form.Item>
                            </Col>
                            <Col span={16}>
                                <Form.Item name="nhanSuId" label="Nhân sự đã có">
                                    <Select size="large"></Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="Trạng thái">
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item label="Ghi chú">
                            <Input.TextArea size="large" rows={4} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
export default CreateOrUpdateAppointment;

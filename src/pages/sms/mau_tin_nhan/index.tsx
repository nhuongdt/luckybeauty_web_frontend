import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import AddIcon from '../../../images/add.svg';
import ModalSmsTemplate from './components/modal_sms_template';
import { useEffect, useState } from 'react';
import { GroupMauTinSMSDto, MauTinSMSDto } from '../../../services/sms/mau_tin_sms/mau_tin_dto';
import MauTinSMService from '../../../services/sms/mau_tin_sms/MauTinSMService';
import PageEmpty from '../../../components/DataGrid/PageEmpty';
import abpCustom from '../../../components/abp-custom';
import SnackbarAlert from '../../../components/AlertDialog/SnackbarAlert';

const MauTinNhan = () => {
    const [visiable, setVisiable] = useState(false);
    const [dataGroupMauTin, setDataGroupMauTin] = useState<GroupMauTinSMSDto[]>([]);
    const [idMauTin, setIdMauTin] = useState('');
    const [objMauTin, setObjMauTin] = useState<MauTinSMSDto>({} as MauTinSMSDto);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    useEffect(() => {
        GetAllMauTinSMS();
    }, []);

    const GetAllMauTinSMS = async () => {
        const data = await MauTinSMService.GetAllMauTinSMS_GroupLoaiTin();
        if (data !== null) {
            setDataGroupMauTin(data);
        }
    };

    const editMauTin = async (item: MauTinSMSDto) => {
        const roleEdit = abpCustom.isGrandPermission('"Pages.SMS_Template.Create');
        if (roleEdit) {
            setObjAlert({ mes: `Không có quyền chỉnh sửa mẫu tin`, show: true, type: 2 });
            return;
        }
        setVisiable(true);
        setIdMauTin(item.id);
        setObjMauTin(item);
    };

    const saveMauTinOK = async (objMauTin: MauTinSMSDto, type: number) => {
        GetAllMauTinSMS();
        setVisiable(false);
    };

    return (
        <>
            <ModalSmsTemplate
                visiable={visiable}
                idMauTin={idMauTin}
                objMauTinOld={objMauTin}
                onCancel={() => setVisiable(false)}
                onOK={saveMauTinOK}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>

            <Box paddingTop={2}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} pb={2}>
                    <Typography color={'#3D475C'} fontSize={'18px'} fontWeight={700}>
                        Bản mẫu tin nhắn
                    </Typography>
                    <Button
                        size="small"
                        sx={{
                            height: '40px',
                            display: abpCustom.isGrandPermission('"Pages.SMS_Template.Create') ? '' : 'none'
                        }}
                        variant="contained"
                        startIcon={<img src={AddIcon} />}
                        onClick={() => {
                            setVisiable(true);
                        }}>
                        Thêm mẫu tin
                    </Button>
                </Box>
                <Box bgcolor={'#FFF'} className="page-box-left">
                    {dataGroupMauTin.length == 0 ? (
                        <PageEmpty />
                    ) : (
                        <Box padding={'16px 16px 16px 32px'}>
                            {dataGroupMauTin?.map((item, index) => (
                                <Stack paddingBottom={2} key={index}>
                                    <Stack spacing={1.5}>
                                        <Typography fontSize={'16px'} color={'#525F7A'} fontWeight={600}>
                                            {item?.loaiTin}
                                        </Typography>
                                        {item?.lstDetail?.map((detail, index2) => (
                                            <Stack spacing={1} direction={'row'} alignItems={'center'} key={index2}>
                                                <Chip
                                                    label={
                                                        <Typography
                                                            fontSize={'12px'}
                                                            color={'#525F7A'}
                                                            fontWeight={400}>
                                                            {detail?.tenMauTin}
                                                        </Typography>
                                                    }
                                                    sx={{ marginRight: '10px' }}
                                                    onClick={() => editMauTin(detail)}
                                                />
                                                <Typography variant={'body2'} fontWeight={400} color={'#525F7A'}>
                                                    {detail?.noiDungTinMau}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Stack>
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
};
export default MauTinNhan;

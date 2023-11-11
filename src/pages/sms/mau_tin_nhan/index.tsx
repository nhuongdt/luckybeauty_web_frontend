import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import AddIcon from '../../../images/add.svg';
import ModalSmsTemplate from './components/modal_sms_template';
import { useEffect, useState } from 'react';
import { GroupMauTinSMSDto, MauTinSMSDto } from '../../../services/sms/mau_tin_sms/mau_tin_dto';
import MauTinSMService from '../../../services/sms/mau_tin_sms/MauTinSMService';
const MauTinNhan = () => {
    const [visiable, setVisiable] = useState(false);
    const [dataGroupMauTin, setDataGroupMauTin] = useState<GroupMauTinSMSDto[]>([]);
    const [idMauTin, setIdMauTin] = useState('');
    const [objMauTin, setObjMauTin] = useState<MauTinSMSDto>({} as MauTinSMSDto);

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

            <Box paddingTop={2}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} paddingRight={2} pb={2}>
                    <Typography color={'#3D475C'} fontSize={'18px'} fontWeight={700}>
                        Bản mẫu tin nhắn
                    </Typography>
                    <Button
                        size="small"
                        sx={{ height: '40px' }}
                        variant="contained"
                        startIcon={<img src={AddIcon} />}
                        onClick={() => {
                            setVisiable(true);
                            setIdMauTin('');
                        }}>
                        Thêm mới
                    </Button>
                </Box>
                <Box bgcolor={'#FFF'}>
                    <Box padding={'16px 16px 16px 32px'}>
                        {dataGroupMauTin?.map((item, key) => (
                            <Stack paddingBottom={2}>
                                <Stack spacing={1.5}>
                                    <Typography fontSize={'16px'} color={'#525F7A'} fontWeight={600}>
                                        {item?.loaiTin}
                                    </Typography>
                                    {item?.lstDetail?.map((detail, index2) => (
                                        <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                            <Chip
                                                label={
                                                    <Typography fontSize={'12px'} color={'#525F7A'} fontWeight={400}>
                                                        {detail?.tenMauTin}
                                                    </Typography>
                                                }
                                                sx={{ marginRight: '10px' }}
                                                onClick={() => editMauTin(detail)}
                                            />
                                            <Typography
                                                key={index2}
                                                variant={'body2'}
                                                fontWeight={400}
                                                color={'#525F7A'}>
                                                {detail?.noiDungTinMau}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Stack>
                        ))}
                    </Box>
                </Box>
            </Box>
        </>
    );
};
export default MauTinNhan;

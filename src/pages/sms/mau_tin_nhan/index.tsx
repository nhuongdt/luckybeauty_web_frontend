import {
    Box,
    Button,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    SelectChangeEvent,
    Typography
} from '@mui/material';
import AddIcon from '../../../images/add.svg';
import CreateOrEditMauTinNhanModal from './components/create_or_edit_tin_nhan_template_modal';
import { useEffect, useState } from 'react';
import abpCustom from '../../../components/abp-custom';
import { SMSTempalteViewDto } from '../../../services/sms/template/dto/SMSTemplateVIewDto';
import { CreateOrEditSMSTemplateDto } from '../../../services/sms/template/dto/CreateOrEditSMSTemplateDto';
import smsTemplateService from '../../../services/sms/template/smsTemplateService';
import AppConsts from '../../../lib/appconst';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
const MauTinNhan = () => {
    const [visiable, setVisiable] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [maxResultCount, setMaxResultCount] = useState(5);
    const [totalPage, setTotalPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [formRef, setFormRef] = useState<CreateOrEditSMSTemplateDto>({
        id: AppConsts.guidEmpty,
        idLoaiTin: 1,
        laMacDinh: false,
        tenMauTin: '',
        noiDungTinMau: '',
        trangThai: 1
    });
    const [data, setData] = useState<SMSTempalteViewDto[]>([]);
    const getData = async () => {
        const result = await smsTemplateService.getAll({
            keyword: filter,
            maxResultCount: maxResultCount,
            skipCount: currentPage
        });
        setData(result.items);
        setTotalCount(result.totalCount);
        setTotalPage(Math.ceil(result.totalCount / maxResultCount));
    };
    useEffect(() => {
        getData();
    }, [maxResultCount, currentPage]);
    const onModal = () => {
        setVisiable(!visiable);
    };
    const onCreateOrEditModal = async (id: string) => {
        if (id === '') {
            setFormRef({
                id: AppConsts.guidEmpty,
                idLoaiTin: 1,
                laMacDinh: false,
                tenMauTin: '',
                noiDungTinMau: '',
                trangThai: 1
            });
        } else {
            const data = await smsTemplateService.getForEdit(id);
            setFormRef(data);
        }
        onModal();
    };
    const handlePageChange = async (event: any, value: number) => {
        await setCurrentPage(value);
    };
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await setMaxResultCount(parseInt(event.target.value.toString(), 10));
        setCurrentPage(1);
    };
    return (
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
                    hidden={!abpCustom.isGrandPermission('Pages.Administration')}
                    onClick={() => {
                        onCreateOrEditModal('');
                    }}>
                    Thêm mới
                </Button>
            </Box>
            <Box bgcolor={'#FFF'}>
                <List sx={{ padding: '4px 16px 16px 16px' }}>
                    {data.map((item, key) => (
                        <ListItemButton
                            key={key}
                            divider
                            onClick={() => {
                                setSelectedRowId(item.id);
                            }}
                            onDoubleClick={() => {
                                onCreateOrEditModal(item.id);
                            }}>
                            <ListItemText
                                primary={
                                    <Typography fontSize={'16px'} color={'#525F7A'} fontWeight={500}>
                                        {item.tenMauTin}
                                    </Typography>
                                }
                                secondary={
                                    <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                        <Chip
                                            label={
                                                <Typography fontSize={'12px'} color={'#525F7A'} fontWeight={400}>
                                                    {(() => {
                                                        switch (item.idLoaiTin) {
                                                            case 1:
                                                                return 'Tin thường';
                                                            case 2:
                                                                return 'Sinh nhật';
                                                            case 3:
                                                                return 'Lịch hẹn';
                                                            case 4:
                                                                return 'Đánh giá';
                                                            default:
                                                                return 'Tin thường';
                                                        }
                                                    })()}
                                                </Typography>
                                            }
                                            sx={{ marginRight: '10px' }}
                                        />
                                        <Typography fontSize={'14px'} color={'#525F7A'} fontWeight={400}>
                                            {item.noiDungTinMau}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItemButton>
                    ))}
                </List>
                <CustomTablePagination
                    currentPage={currentPage}
                    rowPerPage={maxResultCount}
                    totalPage={totalPage}
                    totalRecord={totalCount}
                    handlePerPageChange={handlePerPageChange}
                    handlePageChange={handlePageChange}
                />
            </Box>
            <CreateOrEditMauTinNhanModal
                visiable={visiable}
                formRef={formRef}
                onCancel={() => {
                    setVisiable(!visiable);
                }}
                onOk={() => {
                    getData();
                    setVisiable(!visiable);
                }}
            />
        </Box>
    );
};
export default MauTinNhan;

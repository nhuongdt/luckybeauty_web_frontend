import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
    Grid,
    Box,
    Typography,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    Menu,
    Stack,
    Button,
    Container,
    Link,
    Avatar,
    IconButton,
    TextareaAutosize,
    ButtonGroup,
    Breadcrumbs,
    Dialog
} from '@mui/material';
import './style.css';
import { ModalNhomHangHoa } from './ModalGroupProduct';
import avatar from '../../images/avatar.png';
import EditIcon from '@mui/icons-material/Edit';
import { ReactComponent as ClockIcon } from '../../images/clock.svg';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '../../images/add.svg';
import SearchIcon from '../../images/search-normal.svg';
import fileSmallIcon from '../../../images/fi_upload-cloud.svg';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import { ReactComponent as DateIcon } from '../../../images/calendar-5.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ReactComponent as CloseIcon } from '../../../images/close-square.svg';
import tagIcon1 from '../../images/tagAll.svg';
import tagIcon2 from '../../images/tag2.svg';
import tagIcon3 from '../../images/tag3.svg';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { ModalHangHoa } from './ModalProduct';
const PageProductNew: React.FC = () => {
    const breadcrumbs = [
        <Typography key="1" color="#999699" fontSize="14px">
            Dịch vụ
        </Typography>,
        <Typography key="2" color="#333233" fontSize="14px">
            Danh mục dịch vụ
        </Typography>
    ];

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const Services = [
        {
            Name: 'Tất cả',
            icon: tagIcon1
        },
        {
            Name: 'Chăm sóc tóc',
            icon: tagIcon2,
            categorys: ['Gội đầu', 'Hấp', 'Phục hồi']
        },
        {
            Name: 'Hoá chất tóc',
            icon: tagIcon3,
            categorys: ['Uốn', 'Nhuộm', 'Tẩy']
        }
    ];
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50,
            renderCell: (params) => (
                <Typography variant="body1" fontSize="14px" color="#333233">
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'name',
            headerName: 'Tên dịch vụ',
            width: 176,
            renderCell: (params) => (
                <Box display="flex">
                    <Avatar
                        src={params.row.avatar}
                        alt="Avatar"
                        style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    <Typography
                        variant="body1"
                        fontSize="14px"
                        color="#333233"
                        title={params.value}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'nameGroup',
            headerName: 'Nhóm dịch vụ',
            width: 176
        },
        {
            field: 'price',
            headerName: 'Giá',
            width: 113
        },
        {
            field: 'time',
            headerName: 'Thời gian',
            width: 128,
            renderCell: (params) => (
                <Box display="flex">
                    <ClockIcon />
                    <Typography fontSize="14px" color="#333233" marginLeft="9px">
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'state',
            headerName: 'Trạng thái',
            width: 130,
            renderCell: (params) => (
                <Typography
                    sx={{
                        padding: '4px 8px',
                        borderRadius: '1000px',
                        backgroundColor: '#F1FAFF',
                        color: '#009EF7',
                        fontSize: '14px'
                    }}>
                    {params.value}
                </Typography>
            )
        }
    ];
    const rows = [
        {
            id: 980,
            name: 'Tên dài ơi là dàiiiiiiiiii đâyyyyyyyyy nè....... ',
            avatar: avatar,
            nameGroup: 'Dịch vụ hóa chất ',
            price: 600000,
            time: '3h 30m',
            state: 'Đang kinh doanh'
        },
        {
            id: 880,
            name: 'Tên dài ơi là dàiiiiiiiii đâyyyyyyyyy nè....... ',
            avatar: avatar,
            nameGroup: 'Dịch vụ hóa chất ',
            price: 600000,
            time: '3h 30m',
            state: 'Đang kinh doanh'
        },
        {
            id: 80,
            name: 'Tên dài ơi là dàiiiiiiiiii đâyyyyyyyy nè....... ',
            avatar: avatar,
            nameGroup: 'Dịch vụ hóa chất ',
            price: 600000,
            time: '3h 30m',
            state: 'Đang kinh doanh'
        },
        {
            id: 80,
            name: 'Tên dài ơi là dàiiiiiiiiii đâyyyyyyyy nè....... ',
            avatar: avatar,
            nameGroup: 'Dịch vụ hóa chất ',
            price: 600000,
            time: '3h 30m',
            state: 'Đang kinh doanh'
        },
        {
            id: 80,
            name: 'Tên dài ơi là dàiiiiiiiiii đâyyyyyyyy nè....... ',
            avatar: avatar,
            nameGroup: 'Dịch vụ hóa chất ',
            price: 600000,
            time: '3h 30m',
            state: 'Đang kinh doanh'
        },
        {
            id: 80,
            name: 'Tên dài ơi là dàiiiiiiiiii đâyyyyyyyy nè....... ',
            avatar: avatar,
            nameGroup: 'Dịch vụ hóa chất ',
            price: 600000,
            time: '3h 30m',
            state: 'Đang kinh doanh'
        },
        {
            id: 80,
            name: 'Tên dài ơi là dàiiiiiiiiii đâyyyyyyyy nè....... ',
            avatar: avatar,
            nameGroup: 'Dịch vụ hóa chất ',
            price: 600000,
            time: '3h 30m',
            state: 'Đang kinh doanh'
        },
        {
            id: 80,
            name: 'Tên dài ơi là dàiiiiiiiiii đâyyyyyyyy nè....... ',
            avatar: avatar,
            nameGroup: 'Dịch vụ hóa chất ',
            price: 600000,
            time: '3h 30m',
            state: 'Đang kinh doanh'
        },
        {
            id: 80,
            name: 'Tên dài ơi là dàiiiiiiiiii đâyyyyyyyy nè....... ',
            avatar: avatar,
            nameGroup: 'Dịch vụ hóa chất ',
            price: 600000,
            time: '3h 30m',
            state: 'Đang kinh doanh'
        }
    ];
    return (
        <>
            <Box padding="22px 32px" className="dich-vu-page">
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto">
                        <Breadcrumbs separator="›" aria-label="breadcrumb">
                            {breadcrumbs}
                        </Breadcrumbs>
                        <Typography
                            color="#0C050A"
                            variant="h1"
                            fontSize="24px"
                            fontWeight="700"
                            lineHeight="32px"
                            marginTop="4px">
                            Quản lý thời gian nghỉ
                        </Typography>
                    </Grid>
                    <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                        <Box component="form" className="form-search">
                            <TextField
                                size="small"
                                sx={{
                                    backgroundColor: '#FFFAFF',
                                    borderColor: '#CDC9CD!important'
                                }}
                                className="search-field"
                                variant="outlined"
                                type="search"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton type="submit">
                                            <img src={SearchIcon} />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>

                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<img src={DownloadIcon} />}
                            sx={{
                                backgroundColor: '#fff',
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                height: '40px',
                                borderColor: '#E6E1E6!important'
                            }}>
                            Nhập
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<img src={UploadIcon} />}
                            sx={{
                                backgroundColor: '#fff',
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                color: '#666466',
                                padding: '10px 16px',
                                borderColor: '#E6E1E6!important',
                                height: '40px'
                            }}>
                            Xuất
                        </Button>
                        <Button
                            onClick={handleOpen}
                            size="small"
                            variant="contained"
                            startIcon={<img src={AddIcon} />}
                            sx={{
                                textTransform: 'capitalize',
                                fontWeight: '400',
                                minWidth: '173px',
                                height: '40px',
                                backgroundColor: '#7C3367!important'
                            }}>
                            Thêm dịch vụ
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={3} sx={{ marginTop: '24px' }}>
                    <Grid item lg={3}>
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                minHeight: '100%'
                            }}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                borderBottom="1px solid #E6E1E6"
                                padding="16px 24px">
                                <Typography
                                    variant="h3"
                                    fontSize="18px"
                                    fontWeight="700"
                                    color="#4C4B4C">
                                    Nhóm dịch vụ
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{
                                        minWidth: 'unset!important',
                                        height: '32px',
                                        width: '32px',
                                        backgroundColor: '#7C3367!important'
                                    }}>
                                    <img src={AddIcon} />
                                </Button>
                            </Box>
                            <Box>
                                {Services.map((Service) => (
                                    <Accordion
                                        key={Service.Name.replace(/\s/g, '')}
                                        sx={{
                                            border: 'none!important',
                                            boxShadow: 'unset',
                                            '&.MuiAccordion-root::before': { content: 'none' }
                                        }}>
                                        <AccordionSummary
                                            sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box>
                                                <img src={Service.icon} alt={Service.Name} />
                                            </Box>
                                            <Typography
                                                variant="h3"
                                                fontSize="16px"
                                                color="#333233"
                                                fontWeight="700"
                                                sx={{
                                                    marginLeft: '9px',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                {Service.Name}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails
                                            sx={{ padding: '0', paddingLeft: '30px' }}>
                                            {Service.categorys?.map((category) => (
                                                <Button
                                                    key={category.replace(/\s/g, '')}
                                                    sx={{
                                                        display: 'block',
                                                        color: '#4C4B4C',
                                                        fontSize: '14px',
                                                        textTransform: 'unset',
                                                        textAlign: 'left',
                                                        fontWeight: '400'
                                                    }}>
                                                    {category}
                                                </Button>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item lg={9}>
                        <Box height="504px" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 5 }
                                    }
                                }}
                                pageSizeOptions={[5, 10]}
                                checkboxSelection
                                sx={{ border: 'none!important' }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
export default PageProductNew;

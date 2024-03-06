import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Popover,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import { ReactComponent as SearchIcon } from '../../../images/search-normal.svg';
import React, { useEffect, useState } from 'react';
import NhatKyThaoTacItemDto from '../../../services/nhat_ky_hoat_dong/dto/NhatKyThaoTacItemDto';
import nhatKyHoatDongService from '../../../services/nhat_ky_hoat_dong/nhatKyHoatDongService';
import { format as formatDate, startOfMonth, endOfMonth } from 'date-fns';
import { ReactComponent as FilterIcon } from '../../../images/icons/i-filter.svg';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import htmlParse from 'html-react-parser';
import DateFilterCustom from '../../../components/DatetimePicker/DateFilterCustom';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
    ({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
            borderBottom: 0
        },
        '&::before': {
            display: 'none'
        }
    })
);

const AccordionSummary = styled((props: AccordionSummaryProps) => <MuiAccordionSummary {...props} />)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)'
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1)
    }
}));
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)'
}));
const NhatKyHoatDongPage = () => {
    const [selectedRow, setSelectedRow] = useState(-1);
    const [showContentRowSelect, setShowContentRowSelect] = useState(false);
    const [nhatKyHoatDongData, setNhatKyHoatDongData] = useState([] as NhatKyThaoTacItemDto[]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [filter, setFilter] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortType, setSortType] = useState('');
    const [skipCount, setSkipCount] = useState(1);
    const [maxResultCount, setMaxResultCount] = useState(10);
    const [timeFrom, setTimeFrom] = useState<Date>(startOfMonth(new Date()));
    const [timeTo, setTimeTo] = useState<Date>(endOfMonth(new Date()));
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const [loaiNhatKys, setLoaiNhatKys] = useState([] as number[]);
    const [anchorElFilter, setAnchorElFilter] = useState<any>(null);
    const handleSearchChange = (event: any) => {
        setFilter(event.target.value);
    };
    const getAll = async () => {
        const response = await nhatKyHoatDongService.getAll({
            loaiNhatKys: loaiNhatKys.filter((x) => x != null),
            keyword: filter,
            sortBy: sortBy,
            sortType: sortType,
            skipCount: skipCount,
            maxResultCount: maxResultCount,
            timeFrom: timeFrom,
            timeTo: timeTo
        });
        setNhatKyHoatDongData(response.items);
        setTotalCount(response.totalCount);
        setTotalPage(Math.ceil(response.totalCount / skipCount));
    };
    useEffect(() => {
        getAll();
    }, [loaiNhatKys, timeFrom, timeTo, filter, sortBy, sortType]);
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        setMaxResultCount(parseInt(event.target.value.toString(), 10));
        setSkipCount(1);
    };
    const handlePageChange = async (event: any, value: number) => {
        setSkipCount(value);
    };
    const chonLoaiThaoTac = (event: React.ChangeEvent<any>, checked: boolean) => {
        if (checked === true) {
            setLoaiNhatKys([...loaiNhatKys, Number.parseInt(event.target.value)]);
        } else {
            const newData = loaiNhatKys.filter((x) => x !== Number.parseInt(event.target.value));
            setLoaiNhatKys(newData);
        }
        console.log(JSON.stringify(loaiNhatKys));
    };
    const onApplyFilterDate = async (from: string, to: string, txtShow: string) => {
        setAnchorDateEl(null);
        setTimeFrom(new Date(from));
        setTimeTo(new Date(to));
    };
    const openDateSelect = Boolean(anchorDateEl);
    const filterContent = (
        <Box>
            <Accordion defaultExpanded={true}>
                <AccordionSummary>
                    <Typography>Chức năng</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <TextField
                            size="small"
                            onChange={(e) => {
                                setFilter(e.target.value);
                            }}
                            placeholder="Nhập từ khóa"
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') {
                                    getAll();
                                }
                            }}
                            fullWidth
                        />
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded={true}>
                <AccordionSummary>
                    <Typography>Thời gian</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack>
                        <TextField
                            label="Thời gian"
                            size="small"
                            fullWidth
                            variant="outlined"
                            sx={{
                                '& .MuiInputBase-root': {
                                    height: '40px!important'
                                },
                                backgroundColor: 'white'
                            }}
                            onClick={(event) => setAnchorDateEl(event.currentTarget)}
                            value={`${formatDate(new Date(timeFrom), 'dd/MM/yyyy')} - ${formatDate(
                                new Date(timeTo),
                                'dd/MM/yyyy'
                            )}`}
                        />
                        <DateFilterCustom
                            id="popover-date-filter"
                            open={openDateSelect}
                            anchorEl={anchorDateEl}
                            onClose={() => setAnchorDateEl(null)}
                            onApplyDate={onApplyFilterDate}
                        />
                    </Stack>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded={true}>
                <AccordionSummary>
                    <Typography>Thao tác</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box display={'flex'} flexDirection={'column'} justifyContent={'start'}>
                        <FormControlLabel
                            control={<Checkbox />}
                            value={1}
                            checked={loaiNhatKys.find((x) => x === 1) ? true : false}
                            onChange={chonLoaiThaoTac}
                            label={'Thêm mới'}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            value={2}
                            checked={loaiNhatKys.find((x) => x === 2) ? true : false}
                            onChange={chonLoaiThaoTac}
                            label={'Cập nhật'}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            value={3}
                            checked={loaiNhatKys.find((x) => x === 3) ? true : false}
                            onChange={chonLoaiThaoTac}
                            label={'Xóa'}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            value={4}
                            checked={loaiNhatKys.find((x) => x === 4) ? true : false}
                            onChange={chonLoaiThaoTac}
                            label={'Nhập'}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            value={5}
                            checked={loaiNhatKys.find((x) => x === 5) ? true : false}
                            onChange={chonLoaiThaoTac}
                            label={'Xuất'}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            value={6}
                            checked={loaiNhatKys.find((x) => x === 6) ? true : false}
                            onChange={chonLoaiThaoTac}
                            label={'Đăng nhập'}
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
    return (
        <Box
            sx={{
                paddingTop: '16px'
            }}>
            <Grid container columnSpacing={1.5}>
                <Grid item sm={0} md={3} lg={2.5} display={window.screen.width <= 600 ? 'none' : ''}>
                    {filterContent}
                </Grid>
                <Grid item sm={12} md={9} lg={9.5}>
                    <Grid container columnSpacing={1} justifyItems={'center'}>
                        <Grid item xs={6} md={7} display={'flex'} alignItems={'center'}>
                            <Typography variant="h1" fontWeight="700" fontSize="16px" color="#333233">
                                Lịch sử thao tác
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            md={5}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'end'}
                            spacing={1}>
                            <Button
                                className="border-color btn-outline-hover"
                                aria-describedby="popover-filter"
                                variant="outlined"
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    color: '#666466',
                                    padding: '10px 16px',
                                    borderColor: '#E6E1E6',
                                    bgcolor: '#fff!important',
                                    display: window.screen.width > 500 ? 'none' : 'inherit'
                                }}
                                onClick={(e) => {
                                    setAnchorElFilter(e.currentTarget);
                                }}>
                                <FilterIcon />
                            </Button>
                            <TextField
                                fullWidth
                                onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        getAll();
                                    }
                                }}
                                onChange={handleSearchChange}
                                size="small"
                                sx={{
                                    borderColor: '#E6E1E6!important',
                                    bgcolor: '#fff'
                                }}
                                placeholder="Tìm kiếm..."
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon
                                            onClick={() => {
                                                getAll();
                                            }}
                                            style={{
                                                marginRight: '8px',
                                                color: 'gray'
                                            }}
                                        />
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box mt={2}>
                        <table className="table">
                            <thead>
                                <tr key="table-nhat-ky">
                                    <th style={{ color: '#3d475c', fontSize: 14, fontWeight: 600 }}>Tên nhân viên</th>
                                    <th style={{ color: '#3d475c', fontSize: 14, fontWeight: 600 }}>Chức năng</th>
                                    <th style={{ color: '#3d475c', fontSize: 14, fontWeight: 600 }}>Thời gian</th>
                                    <th style={{ color: '#3d475c', fontSize: 14, fontWeight: 600 }}>Nội dung</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nhatKyHoatDongData.map((item, index) => {
                                    return (
                                        <>
                                            <tr
                                                key={index}
                                                onClick={() => {
                                                    setSelectedRow(index);
                                                    setShowContentRowSelect(!showContentRowSelect);
                                                }}>
                                                <td
                                                    style={{
                                                        color: '#3d475c',
                                                        fontSize: 14,
                                                        fontWeight: 400,
                                                        fontFamily: 'Roboto'
                                                    }}>
                                                    {item.tenNguoiThaoTac}
                                                </td>
                                                <td
                                                    style={{
                                                        color: '#3d475c',
                                                        fontSize: 14,
                                                        fontWeight: 400,
                                                        fontFamily: 'Roboto'
                                                    }}>
                                                    {item.chucNang}
                                                </td>
                                                <td
                                                    style={{
                                                        color: '#3d475c',
                                                        fontSize: 14,
                                                        fontWeight: 400,
                                                        fontFamily: 'Roboto'
                                                    }}>
                                                    {formatDate(new Date(item.creationTime), 'dd/MM/yyyy HH:mm')}
                                                </td>
                                                <td
                                                    style={{
                                                        color: '#3d475c',
                                                        fontSize: 14,
                                                        fontWeight: 400,
                                                        fontFamily: 'Roboto'
                                                    }}>
                                                    {item.noiDung}
                                                </td>
                                            </tr>
                                            <tr key={item.noiDungChiTiet}>
                                                {selectedRow !== -1 &&
                                                    selectedRow === index &&
                                                    showContentRowSelect && (
                                                        <td
                                                            colSpan={4}
                                                            className="text-start p-3"
                                                            style={{ background: '#e6e6e6' }}>
                                                            {htmlParse(item.noiDungChiTiet ?? '')}
                                                        </td>
                                                    )}
                                            </tr>
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                        <CustomTablePagination
                            currentPage={skipCount}
                            rowPerPage={maxResultCount}
                            totalPage={totalPage}
                            totalRecord={totalCount}
                            handlePerPageChange={handlePerPageChange}
                            handlePageChange={handlePageChange}
                        />
                        <Popover
                            id={'popover-filter'}
                            open={Boolean(anchorElFilter)}
                            anchorEl={anchorElFilter}
                            onClose={() => {
                                setAnchorElFilter(null);
                            }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center'
                            }}
                            sx={{ marginTop: 1 }}>
                            {filterContent}
                        </Popover>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default NhatKyHoatDongPage;

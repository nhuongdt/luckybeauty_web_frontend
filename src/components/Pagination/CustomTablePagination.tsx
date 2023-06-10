import { Box, Grid, MenuItem, Pagination, Select, Typography } from '@mui/material';
import { Component, ReactNode } from 'react';

interface TablePaginationProps {
    totalRecord: number;
    totalPage: number;
    currentPage: number;
    handlePageChange: (e: any, page: number) => void;
    rowPerPage: number;
}

class CustomTablePagination extends Component<TablePaginationProps> {
    render(): ReactNode {
        const { totalPage, totalRecord, currentPage, rowPerPage, handlePageChange } = this.props;
        return (
            <Grid container>
                <Grid item xs={3}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            height: 48
                        }}>
                        <Select sx={{ height: '23px' }} defaultValue={rowPerPage}>
                            <MenuItem value={5}>
                                <Typography variant="caption">5 Trang</Typography>
                            </MenuItem>
                            <MenuItem value={10}>
                                <Typography variant="caption">10 Trang</Typography>
                            </MenuItem>
                            <MenuItem value={20}>
                                <Typography variant="caption">20 Trang</Typography>
                            </MenuItem>
                            <MenuItem value={50}>
                                <Typography variant="caption">50 Trang</Typography>
                            </MenuItem>
                            <MenuItem value={100}>
                                <Typography variant="caption">100 Trang</Typography>
                            </MenuItem>
                        </Select>
                    </Box>
                </Grid>
                <Grid item xs={9}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            height: 48
                        }}>
                        <Typography variant="body2">
                            Hiển thị {rowPerPage * currentPage - 9} - {rowPerPage * currentPage} của{' '}
                            {totalRecord} mục
                        </Typography>
                        <Pagination
                            count={totalPage}
                            page={currentPage}
                            onChange={handlePageChange}
                            sx={{
                                '& button': {
                                    display: 'inline-block',
                                    borderRadius: '4px',
                                    lineHeight: '1'
                                },
                                '& .Mui-selected': {
                                    backgroundColor: '#7C3367!important',
                                    color: '#fff'
                                }
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        );
    }
}
export default CustomTablePagination;

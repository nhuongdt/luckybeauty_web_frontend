import { Grid, Stack } from '@mui/material';

export default function ListProductByGroup({ listProduct }: any) {
    return (
        <>
            {listProduct.map((nhom: any, index: any) => (
                <Grid container>
                    <Grid item xs={12}>
                        Nhom 01
                        <span
                            style={{
                                fontSize: '16px',
                                color: '#000',
                                fontWeight: '700',
                                marginBottom: '16px'
                            }}></span>
                    </Grid>
                    <Grid container spacing={2}>
                        {nhom.hangHoas.map((item: any, index2: any) => (
                            <Grid item xs={6} sm={3} md={2} lg={2}>
                                <Stack direction="column"></Stack>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            ))}
        </>
    );
}

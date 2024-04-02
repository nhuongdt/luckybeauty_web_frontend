import { Stack, Typography, Grid, Button } from '@mui/material';
import ZaloService from '../../services/zalo/ZaloService';
import { useEffect, useState } from 'react';
import { IZaloButtonDetail, IZaloTableDetail } from '../../services/zalo/ZaloTemplateDto';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';

export type PropsZaloTempView = {
    logoBanner?: string;
    headerText: string;
    contentText: string;
    tables?: IZaloTableDetail[];
    buttons?: IZaloButtonDetail[];
};

export const ZaloTemplateView = (props: PropsZaloTempView) => {
    const { logoBanner, headerText, contentText, tables, buttons } = props;
    // todo replace content
    return (
        <>
            <Stack spacing={1} padding={2}>
                {logoBanner && <img src={logoBanner} style={{ width: '200px', height: '48px' }} />}

                <Typography variant="body1" fontWeight={600}>
                    {headerText}
                </Typography>
                <Typography variant="body2">{contentText}</Typography>

                {tables?.map((x, index) => (
                    <Grid container key={index}>
                        <Grid item xs={4}>
                            <Typography variant="body2">{x.key}</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body2">{x.value}</Typography>
                        </Grid>
                    </Grid>
                ))}

                <Stack spacing={1}>
                    {buttons?.map((x: any, index: number) => (
                        <Button variant="contained" key={index}>
                            {x.title}
                        </Button>
                    ))}
                </Stack>
            </Stack>
        </>
    );
};

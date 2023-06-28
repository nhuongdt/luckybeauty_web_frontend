import './index.css';

import * as React from 'react';

import { Link } from 'react-router-dom';
import error500 from '../../images/500.png';
import { Avatar, Button, Grid } from '@mui/material';
import { width } from '@mui/system';

class Exception500 extends React.Component<any, any> {
    render() {
        return (
            <Grid container style={{ marginTop: 150 }}>
                <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                    <Avatar
                        variant="square"
                        sx={{ width: '100%', height: '100%' }}
                        src={error500}
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={4} xl={4} style={{ marginTop: 75 }}>
                    <Grid item>
                        <h1 className={'errorTitle'}>500</h1>
                    </Grid>
                    <Grid item>
                        <h5 className={'errorDescription'}>
                            Sorry, the server is reporting an error
                        </h5>
                    </Grid>
                    <Grid item textAlign={'center'}>
                        <Button variant="contained" color="primary">
                            <Link
                                style={{ color: '#FFFFFF', textDecoration: 'none' }}
                                to={{
                                    pathname: '/'
                                }}>
                                Back to Home
                            </Link>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default Exception500;

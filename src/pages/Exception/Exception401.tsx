import './index.css';

import * as React from 'react';

import { Link } from 'react-router-dom';
import error401 from '../../images/401.png';
import { Avatar, Button, Grid } from '@mui/material';

class Exception401 extends React.Component<any, any> {
    render() {
        return (
            <Grid container style={{ marginTop: 150 }}>
                <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                    <Avatar
                        variant="square"
                        sx={{ width: '100%', height: '100%' }}
                        src={error401}
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={4} xl={4} style={{ marginTop: 75 }}>
                    <Grid item>
                        <h1 className={'errorTitle'}>401</h1>
                    </Grid>
                    <Grid item>
                        <h5 className={'errorDescription'}>
                            Sorry, you don`t have access to this page
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

export default Exception401;

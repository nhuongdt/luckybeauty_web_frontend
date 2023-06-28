import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
const UserLayout = () => {
    return (
        <Container maxWidth="lg" style={{ padding: '50px 30px 50px 30px', height: '100vh' }}>
            <Outlet />
        </Container>
    );
};
export default UserLayout;

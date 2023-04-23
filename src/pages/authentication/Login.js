import { Link } from 'react-router-dom';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';

// ================================|| LOGIN ||================================ //

const Login = () => (
    <AuthWrapper>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <img src={require('../../assets/logo.png')} style={{ width: 70, display: 'block', margin: 'auto' }} alt="" />
            </Grid>
            <Grid item xs={12}>
                <AuthLogin />
            </Grid>
        </Grid>
    </AuthWrapper>
);

export default Login;

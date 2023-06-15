// material-ui
import { useMediaQuery, Container, Link, Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
    const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const { t, i18n } = useTranslation();

    return (
        <Container maxWidth="xl" style={{direction: i18n.language == "en" ? "ltr" : "rtl"}}>
            <Stack
                direction={matchDownSM ? 'column' : 'row'}
                justifyContent={matchDownSM ? 'center' : 'space-between'}
                spacing={2}
                textAlign={matchDownSM ? 'center' : 'inherit'}
            >
                <Typography variant="subtitle2" color="secondary" component="span">
                    &copy; {t("تمامی حقوق این سایت متعلق به شرکت مهندسی")} &nbsp;
                    <Typography component={Link} variant="subtitle2" href="https://mydejban.com" target="_blank" underline="hover">
                    {t("پیام گستر فاوا")}&nbsp;
                    </Typography>
                    <Typography variant="subtitle2" color="secondary" component="span">
                    {t("می باشد")}
                    </Typography>
                </Typography>

                <Stack
                    direction={matchDownSM ? 'column' : 'row'}
                    spacing={matchDownSM ? 1 : 3}
                    textAlign={matchDownSM ? 'center' : 'inherit'}
                >
                    <Typography
                        variant="subtitle2"
                        color="secondary"
                        component={Link}
                        href=""
                        target="_blank"
                        underline="hover"
                    >
                        {t("سیاست حفظ حریم خصوصی")}&nbsp;&nbsp;&nbsp;
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        color="secondary"
                        component={Link}
                        href=""
                        target="_blank"
                        underline="hover"
                    >
                        {t("پشتیبانی")}
                    </Typography>
                </Stack>
            </Stack>
        </Container>
    );
};

export default AuthFooter;

import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import CardDemo from '../components/CardDemo';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const CardDemoPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const lang = location.pathname.startsWith('/en') ? 'en' : 'ru';
    i18n.changeLanguage(lang);
  }, [location]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
      }}
    >
      <CardDemo
        title={t('card.title')}
        description={t('card.description')}
        tag={t('card.tag')}
        moreText={t('card.more')}
        onMoreClick={() => alert(t('card.more'))}
      />
    </Box>
  );
};

export default CardDemoPage; 
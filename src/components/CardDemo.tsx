import React from 'react';
import logo from '../assets/logo.svg';
import { Card, CardContent, CardMedia, Typography, Box, Button, Chip, Avatar, Divider } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { CardDemoProps } from '../types/card';

const CardDemo: React.FC<CardDemoProps> = ({
  title = 'React Карточка',
  description = 'Это современная карточка на Material UI с градиентным фоном, тегом, аватаром и анимацией наведения. Вы можете легко изменить оформление и добавить новые элементы!',
  tag = 'React',
  onMoreClick,
  moreText = 'Подробнее',
}) => {
  return (
    <Card
      sx={{
        display: 'flex',
        maxWidth: 650,
        borderRadius: 6,
        boxShadow: 8,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.03)',
          boxShadow: 16,
        },
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ background: '#fff', p: 3 }}>
        <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: '#1976d2' }}>
          <InfoOutlinedIcon sx={{ fontSize: 48, color: '#fff' }} />
        </Avatar>
        <CardMedia
          component="img"
          sx={{ width: 100, height: 100, objectFit: 'contain', mb: 1 }}
          image={logo}
          alt="Логотип React"
        />
        <Chip icon={<TagIcon />} label={tag} color="primary" variant="outlined" sx={{ mt: 1 }} />
      </Box>
      <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 4, borderColor: '#e0e0e0' }} />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Typography component="h2" variant="h4" gutterBottom color="primary" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
        <Button variant="contained" color="primary" size="large" sx={{ alignSelf: 'flex-start', borderRadius: 3, textTransform: 'none', fontWeight: 600 }} onClick={onMoreClick}>
          {moreText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardDemo; 
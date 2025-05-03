import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      card: {
        title: 'Добро пожаловать в демо-карточку!',
        description: 'Это пример переиспользуемого компонента с типами и темой. Вы можете легко менять содержимое и стили.',
        tag: 'Демо',
        more: 'Подробнее',
      },
    },
  },
  en: {
    translation: {
      card: {
        title: 'Welcome to the demo card!',
        description: 'This is an example of a reusable component with types and theme. You can easily change the content and styles.',
        tag: 'Demo',
        more: 'Learn more',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n; 
import "../i18n";
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

const withTranslation = (Component) => {
  const TranslatedComponent = (props) => {
    const { t, i18n } = useTranslation();
    return <Component {...props} t={t} i18n={i18n} />;
  };

  return dynamic(() => Promise.resolve(TranslatedComponent), { ssr: false });
};

export default withTranslation;
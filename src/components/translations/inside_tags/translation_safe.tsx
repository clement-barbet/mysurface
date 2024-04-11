import { Trans } from 'react-i18next';

interface TProps {
  tkey: string;
}

const TS: React.FC<TProps> = ({ tkey }) => {
  return <Trans i18nKey={tkey} />;
};

export default TS;
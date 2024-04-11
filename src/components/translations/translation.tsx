import withTranslation from '../../hoc/withTranslation';

const T = ({ t, tkey }) => {
  return t(tkey);
};

export default withTranslation(T);
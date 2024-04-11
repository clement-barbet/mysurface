import dynamic from 'next/dynamic';

const DynamicTS = dynamic(() => import('./translation_safe'), { ssr: false });

export default DynamicTS;
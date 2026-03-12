import { Helmet } from 'react-helmet';

interface HelmetProps {
  title: string;
  description?: string;
  keywords?: string;
  content?: string;
}

const PageHelmet = ({ title, description, keywords, content }: HelmetProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="content" content={content} />
    </Helmet>
  );
};

export default PageHelmet;

import { ErrorBoundary } from 'react-error-boundary';

const fallbackRender = ({ error }: any) => {
  const handleReturn = () => {
    location.href = '/app';
  };

  return (
    <div className="notfound">
      <div className="notfound-flex">
        <div className="notfound-logo">
          <img alt="logo" src="/images/tilty_logo_round_white.png" />
        </div>
        <div className="notfound-header">
          <span>申し訳ありませんが</span>
        </div>
        <div className="notfound-describe">
          <span>{error.message}</span>
        </div>
        <div className="notfound-button">
          <button className="button button-default" onClick={handleReturn}>
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
};

const Index = (props: any) => {
  return <ErrorBoundary fallbackRender={fallbackRender}>{props.children}</ErrorBoundary>;
};

export default Index;

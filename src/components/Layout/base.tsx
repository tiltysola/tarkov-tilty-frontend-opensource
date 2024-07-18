import { Outlet } from 'react-router-dom';

interface LayoutBaseProps {
  children?: JSX.Element | JSX.Element[];
}

const Index = (props: LayoutBaseProps) => {
  const { children } = props;

  return <div>{children || <Outlet />}</div>;
};

export default Index;

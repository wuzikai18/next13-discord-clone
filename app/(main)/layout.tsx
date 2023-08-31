import React, { FC } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default MainLayout;

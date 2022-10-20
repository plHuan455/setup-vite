import React, { Suspense } from 'react';
import Loading from '~atoms/Loading';
import HeaderControl from '~templates/HeaderControl';

interface AuthLayoutProps {
  onHeaderControlClick: () => void;
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, onHeaderControlClick }) => {
  return <div className="t-authLayout">
    <div className="t-authLayout_headerControl">
      <HeaderControl onClick={onHeaderControlClick} />
    </div>
    <main className="t-authLayout_main">
      <Suspense fallback={<Loading size="full"/>}>
        {children}
      </Suspense>
    </main>
  </div>
};

AuthLayout.defaultProps = {
  children: undefined,
};

export default AuthLayout;


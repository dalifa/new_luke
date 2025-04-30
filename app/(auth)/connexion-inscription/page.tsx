
import { Suspense } from "react";
import { CardWrapper } from '@/components/auth/card-wrapper';
import { LogGoogleButton } from '@/components/auth/log-google-button';

const LoginRegister = () => {
  return (
    <CardWrapper headerLabel="Uniquement avec votre compte ...">
      <Suspense fallback={null}>
        <LogGoogleButton />
      </Suspense>
    </CardWrapper>
  );
};

export default LoginRegister;


import { CardWrapper } from '@/components/auth/card-wrapper'
import { LogGoogleButton } from '@/components/auth/log-google-button'

const LoginRegister = () => {
    return (
        <CardWrapper
        headerLabel='Uniquement avec votre compte ...'
        >
            <LogGoogleButton/>
        </CardWrapper>
    )
}

export default LoginRegister
import { useCallback, useMemo } from 'react'
import ErrorCatcher from 'modules/ErrorCatcher'
import useAuth from './useAuth'

const useErrorCatcher = () => {
  const { auth, setLogout } = useAuth();

  const errorCatch = useCallback((e: any) => {
    ErrorCatcher(e, { auth, setLogout });
    // eslint-disable-next-line
  }, [auth, setLogout]);

  return useMemo(() => ({ errorCatch }), [errorCatch]);
}

export default useErrorCatcher;
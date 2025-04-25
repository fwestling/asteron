import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios, { AxiosRequestHeaders } from 'axios';
import { useEffect } from 'react';
import { useAuthToken } from './AuthProvider';

const queryClient = new QueryClient();

// Must be rendered inside an AuthProvider.
const ApiProvider: React.FC<
  React.PropsWithChildren<{ initialState?: string }>
> = ({ children }) => {
  const { token } = useAuthToken();

  useEffect(() => {
    const interceptorId = axios.interceptors.request.use((config) => ({
      ...config,
      headers: (token
        ? {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          }
        : config.headers) as AxiosRequestHeaders,
    }));

    return () => {
      axios.interceptors.request.eject(interceptorId);
    };
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default ApiProvider;

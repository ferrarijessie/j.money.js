import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";

import { setToken, getToken } from './utils';
import AppRoutes from '../AppRoutes';
import Login from './auth/Login';
import { ContentWrapper } from './common/styles/globalStyles';


const queryClient = new QueryClient();
const engine = new Styletron();


function App() {
  const token = getToken();

  if(!token) {
    return (
      <QueryClientProvider client={queryClient}>
        <StyletronProvider value={engine}>
          <ContentWrapper>
            <Login setToken={setToken} />
          </ContentWrapper>
        </StyletronProvider>
      </QueryClientProvider>
      )
  }

  return (
    <>      
      <QueryClientProvider client={queryClient}>
      <StyletronProvider value={engine}>
        <ContentWrapper>
          <BaseProvider theme={LightTheme}>
            <AppRoutes />
          </BaseProvider>
        </ContentWrapper>
      </StyletronProvider>
    </QueryClientProvider>
    </>
    
  );
}

export default App;

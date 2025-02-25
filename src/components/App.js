import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";

import { setToken, getToken } from './utils';
import AppRoutes from '../AppRoutes';
import Login from './auth/Login';


const queryClient = new QueryClient();
const engine = new Styletron();


function App() {
  const token = getToken();

  if(!token) {
    return (
      <QueryClientProvider client={queryClient}>
        <StyletronProvider value={engine}>
          <Login setToken={setToken} />
        </StyletronProvider>
      </QueryClientProvider>
      )
  }

  return (
    <>      
      <QueryClientProvider client={queryClient}>
      <StyletronProvider value={engine}>
        <BaseProvider theme={LightTheme}>
          <AppRoutes />
        </BaseProvider>
      </StyletronProvider>
    </QueryClientProvider>
    </>
    
  );
}

export default App;

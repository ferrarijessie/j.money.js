import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";

import AppRoutes from '../AppRoutes';


const queryClient = new QueryClient();
const engine = new Styletron();

function App() {
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

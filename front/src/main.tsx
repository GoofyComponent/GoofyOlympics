import '@/styles/index.css';

import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hook/useAuth';
import { MockServer } from './mirage';
// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
/* eslint-disable react-refresh/only-export-components */
function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <StrictMode>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </StrictMode>
  );
}

if (import.meta.env.MODE === 'development') {
  // You can't use import in a conditional so we're using require() so no
  // Mirage JS code will ever reach your production build.
  //mirageSetup();
  MockServer({ environment: 'development' });
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

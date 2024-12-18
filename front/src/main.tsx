import '@/styles/index.css';

import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

//import { MockServer } from './mirage';
// Import the generated route tree
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

/* if (import.meta.env.MODE === 'development') {
  // You can't use import in a conditional so we're using require() so no
  // Mirage JS code will ever reach your production build.
  //mirageSetup();
  MockServer({ environment: 'development' });
} */

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}

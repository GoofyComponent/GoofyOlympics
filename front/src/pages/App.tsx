import '@/styles/index.css';

import { DoorClosed } from 'lucide-react';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const aaa = 'aaaaaaaaa';

    console.log('MODE', import.meta.env.MODE);

    console.log('uuuuuu', aaa);

    testMock();
  }, []);

  const testMock = async () => {
    const reponse = await fetch('/api/test');
    const data = await reponse.json();
    console.log('data', data);
  };

  return (
    <>
      <DoorClosed size={64} />
      <p className="text-3xl font-bold  text-red-600 underline">
        Ceci est un test pour s'assurer que tout s'actualise correctement
      </p>
    </>
  );
}

export default App;

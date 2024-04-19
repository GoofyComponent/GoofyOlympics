import '@/styles/index.css';

import { DoorClosed } from 'lucide-react';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const aaa = 'aaaaaaaaa';

    console.log('uuuuuu', aaa);
  }, []);

  return (
    <>
      <DoorClosed size={64} />
      <p className="text-3xl font-bold  text-red-600 underline">sdfqdd</p>
    </>
  );
}

export default App;

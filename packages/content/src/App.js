import { useEffect } from 'react';

function HeadlessApp() {

  useEffect(()=>{
    console.log("Headless app got mounted");
  }, [])

  return (
    <div className="HeadlessApp">
    </div>
  );
}

export default HeadlessApp;

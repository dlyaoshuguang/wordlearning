import { useState, useEffect } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg'
import './App.css'
interface Translation {
  pos: string
  tran_cn: string
}
function App() {
  const [count, setCount] = useState(0)
  const [url, setUrl] = useState('https://v2.xxapi.cn/api/englishwords'+ '?word=' +'about');
  const [translations, setTranslations] = useState<Translation[]>([])

  useEffect(() => {
  axios.get(url)
     .then(response => {
      if(!response.data||response.data.length=== 0) {return; }
      if(response.data.code!==200){
        setTranslations([]);
        return;
      }
      console.log(response.data.data);
      setTranslations(response.data.data.translations);
     })
     .catch(error => {
      alert("出错了！"+error.message);       
     });
 }, [url]);
return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="./vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <h1>
          {translations.map((translation, index) => (
            <div key={index}>
              <p>{translation.pos}</p>
              <p>{translation.tran_cn}</p>
            </div>
          ))}
        </h1>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App

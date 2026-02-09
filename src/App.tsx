import { useState,useEffect} from 'react'
import './App.css'
import axios from 'axios';
import { supabase } from "./utils/supabase";
import { UserData, WordData,englishWordUrl,Phrase,Sentence,Translation } from './components/baseData';
import { WordCard } from './components/WordCard';
export default function App() {
  // 从localStorage获取词库位置
  const getStoredIndex = () => {
    const stored = localStorage.getItem(`SupabaseWordIndex`)
    return stored ? parseInt(stored, 10) : 1
  }
  // 存储词库位置到localStorage
  const storeIndex = (index: number) => {
    localStorage.setItem(`SupabaseWordIndex`, index.toString())
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<UserData>({ id: "", email: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true)// 加载状态
  const [wordDatas, setWordDatas] = useState<WordData[]>([])//单词列表
  const [wordData, setWordData] = useState<WordData | null>(null);//单词数据
  const [totalWords, setTotalWords] = useState(0)// 总单词数
  const [currentIndex, setCurrentIndex] = useState(() => getStoredIndex())// 当前单词索引
  const [url, setUrl] = useState(englishWordUrl + '?word=' + (wordData?.word || ''));//dan词API地址
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [sentences, setSentences] = useState<Sentence[]>([])
  const [translations, setTranslations] = useState<Translation[]>([])
  const [us, setUs] = useState('美音');
  const [gb, setGb] = useState('英音');
  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setUser({ id: data.user?.id||"", email: data.user?.email||"" });
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else setUser({ id: data.user?.id||"", email: data.user?.email||"" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser({ id: "", email: "" });
  };
  useEffect(() => {
    async function getWordDatas() {
      const { data: words } = await supabase.from('words').select('*').order('id', { ascending: true });
      console.log(words);
      if (words && words.length >= 1) {
        console.log(words);
        setWordDatas(words)
        setWordData(words[currentIndex-1])// 设置当前单词
        setUrl(englishWordUrl + '?word=' + words[currentIndex-1].word)// 设置API地址
        setTotalWords(words.length)
        setIsLoading(false);
      }
    }
    getWordDatas()
  }, [])
useEffect(() => {
  setTotalWords(wordDatas.length);
  if(wordDatas.length===0) return;
  if(currentIndex > wordDatas.length) {
    setCurrentIndex(wordDatas.length);
    return;
  }
  let newWord=wordDatas[currentIndex-1];
  setWordData(newWord);
  setUrl(englishWordUrl + '?word=' + newWord?.word);
}, [wordDatas,currentIndex,isLoading]);
  useEffect(() => {
    axios.get(url)
      .then(response => {
        if(!response.data||response.data.length=== 0) {return; }
        if(response.data.code!==200){
          setTranslations([]);
          setPhrases([]);
          setSentences([]);
          setUs("");
          setGb("");
          return;
        }
        console.log(response.data.data);
        setTranslations(response.data.data.translations);
        setPhrases(response.data.data.phrases);
        setSentences(response.data.data.sentences);
        setUs(response.data.data.usphone);
        setGb(response.data.data.ukphone);
      })
      .catch(error => {
        alert("出错了！"+error.message);       
      });
  }, [url]);
  useEffect(() => {
    storeIndex(currentIndex)
  }, [currentIndex])
const handleNewWordClose = (addedFlag: boolean,newWordData: WordData) => {
  if (addedFlag) {
      setWordData(newWordData);
      setWordDatas(prev => [...prev, newWordData]);
      setTotalWords(prev => prev + 1);
      setCurrentIndex(wordDatas.length + 1);
  }
}
const handleEditWordClose = (editedFlag: boolean, editedWordData: WordData) => {
  if (editedFlag && editedWordData) {
      setWordData(editedWordData);
      setWordDatas(prev => prev.map(w => w.word === editedWordData.word ? editedWordData : w));
  }
}
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-80">
        <h2 className="text-2xl font-bold text-center mb-4">欢迎来到私房单词本</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {!user.id ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSignup}
                className="w-1/2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                注册
              </button>
              <button
                onClick={handleLogin}
                className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                登录
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="mb-4">{user.email}已经登录</p>
            <p className="mb-4">当前单词：{currentIndex}/{totalWords}</p>
            <button onClick={() => setCurrentIndex(prev => Math.max(1, prev - 1))}
                disabled={isLoading}>⬅️ 上一个
            </button>
            <button onClick={() => setCurrentIndex(prev => (prev < totalWords ? prev + 1 : prev))}
                disabled={isLoading}>下一个 ➡️
            </button>
            <button onClick={() => setCurrentIndex(()=> (Math.floor(Math.random() * totalWords) + 1))}
                disabled={isLoading}>任一个 🎲
            </button>
            <WordCard
              wordData={wordData||{id:0,word:'',description:''}}
              description={wordData?.description || ''}
              translations={translations}
              phrases={phrases}
              sentences={sentences}
              us={us}
              gb={gb}
              isLoading={isLoading}
              onNewWordClose={handleNewWordClose}
              onEditWordFinished={handleEditWordClose}
            />
            <div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                登出
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

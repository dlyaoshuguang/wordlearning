import styled from 'styled-components'
import { WordCard } from './components/WordCard'
import { GlobalStyle } from './components/GlobalStyles'
import { gradientShift, pulse } from './components/animations'
import type { Translation, Phrase, Sentence, WordData } from './components/baseData'
import {Button} from './components/style.tsx'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl,englishWordUrl} from './components/baseData'

// 主容器
const Container = styled.div<{ $bg: string; $textcolor: string }>`
  min-height: 100vh;
  background: ${props => props.$bg};
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  font-family: 'Inter', sans-serif;
  color: ${props => props.$textcolor};
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 226, 0.3) 0%, transparent 50%);
    animation: ${pulse} 8s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 80px 10px;
    align-items: stretch;
  }
`
// 显示框样式
const DisplayBox = styled.div<{ $textcolor: string }>`
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
  color: ${props => props.$textcolor};
  font-size: 16px;
  margin-top: 10px;
  white-space: pre-line;
`

function App() {
  // 从localStorage获取词库位置
  const getStoredIndex = () => {
    const stored = localStorage.getItem(`wordIndex`)
    return stored ? parseInt(stored, 10) : 1
  }
  // 存储词库位置到localStorage
  const storeIndex = (index: number) => {
    localStorage.setItem(`wordIndex`, index.toString())
  }
  const [wordList, setWordList] = useState<WordData[]>(() => loadWords());
  const [translations, setTranslations] = useState<Translation[]>([])
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [sentences, setSentences] = useState<Sentence[]>([])
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [url, setUrl] = useState(englishWordUrl + '?word=' + (wordData?.word || ''));
  //const [url, setUrl] = useState(englishWordUrl + '?word="about"');
  const [us, setUs] = useState('美音');
  const [gb, setGb] = useState('英音');
  const [currentIndex, setCurrentIndex] = useState(() => getStoredIndex())// 当前单词索引
  const [totalWords, setTotalWords] = useState(0)// 总单词数
  const [isLoading, setIsLoading] = useState(true)// 加载状态
  const [bgIndex, setBgIndex] = useState(0)// 上次索引
  const backgrounds = [
  'linear-gradient(-45deg, #f5f5dc, #ede0c8, #f5f5dc)',
  'linear-gradient(-45deg, #f39c12, #e67e22, #e74c3c, #c0392b, #f39c12)',
  'linear-gradient(-45deg, #1abc9c, #16a085, #2ecc71, #27ae60, #1abc9c)',
  'linear-gradient(-45deg, #2196f3, #21cbf3, #2196f3)',
  'linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #1a1a2e, #533483)'
]
  function loadWords(): WordData[] {
  // 模拟从本地存储或文件加载单词列表
    let getWordList: WordData[] = [];

    axios.get(baseUrl)
    .then(response => {
      console.log(response.data); // Handle the response data
      getWordList.push(...response.data.map((item: { id: number; word: string; description: string; }) => ({id: item.id, word: item.word, description: item.description})));
      setWordData(getWordList[currentIndex-1] || null);
      setUrl(englishWordUrl + '?word=' + getWordList[currentIndex-1]?.word);
      setTotalWords(getWordList.length);
      setBgIndex(0)
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error:', error); // Handle errors
    });
    return getWordList;
    }
const handleNewWordClose = (addedFlag: boolean,newWordData: WordData) => {
  if (addedFlag) {
      setWordData(newWordData);
      wordList.push(newWordData);
      setWordList([...wordList]);
      setCurrentIndex(wordList.length);
  }
}
const handleEditWordFinished = () => {
    let getWordList: WordData[] = [];

    axios.get(baseUrl)
    .then(response => {
      console.log(response.data); // Handle the response data
      getWordList.push(...response.data.map((item: { id: number; word: string; description: string; }) => ({id: item.id, word: item.word, description: item.description})));
      setWordData(getWordList[currentIndex] || null);
      setUrl(englishWordUrl + '?word=' + getWordList[currentIndex]?.word);
      setWordList(getWordList);})
    .catch(error => {
      console.error('Error:', error); // Handle errors
    });
   }
useEffect(() => {
    storeIndex(currentIndex)
  }, [currentIndex])
useEffect(() => {
  setTotalWords(wordList.length);
  if(wordList.length===0) return;
  if(currentIndex > wordList.length) {
    setCurrentIndex(wordList.length);
    return;
  }
  let newWord=wordList[currentIndex-1];
  setWordData(newWord);
  setUrl(englishWordUrl + '?word=' + newWord?.word);
}, [wordList,currentIndex]);
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
  return (
    <div>
    <GlobalStyle />
    <Container $bg={backgrounds[bgIndex]} $textcolor={bgIndex === 0 ? '#000' : '#fff'}>
        <div style={{ alignItems: 'center', justifyContent: 'center' }}>
        <DisplayBox $textcolor={bgIndex === 0 ? '#000' : '#fff'}>
          {`当前是单词库\n第${currentIndex}个，共${totalWords}个`}
        </DisplayBox>
        <Button onClick={() => setCurrentIndex(prev => Math.max(1, prev - 1))}
            disabled={isLoading}>⬅️ 上一个
        </Button>
        <Button onClick={() => setCurrentIndex(prev => (prev < totalWords ? prev + 1 : prev))}
            disabled={isLoading}>下一个 ➡️
        </Button>
        <Button onClick={() => setCurrentIndex(()=> (Math.floor(Math.random() * totalWords) + 1))}
            disabled={isLoading}>任一个 🎲
        </Button>
        </div>
        <div>
          <WordCard
            wordData={wordData||{id:0,word:'',description:''}}
            description={wordData?.description || ''}
            translations={translations}
            phrases={phrases}
            sentences={sentences}
            us={us}
            gb={gb}
            bgIndex={bgIndex}
            isLoading={isLoading}
            onNewWordClose={handleNewWordClose}
            onEditWordFinished={handleEditWordFinished}
          />
        </div>
    </Container>
    </div>
  )
}

export default App;
import styled from 'styled-components'
import { useState } from 'react'
import type { Translation, Phrase, Sentence, WordData } from './baseData'
import { NewWordModal } from './NewWordModal'
import { EditWordModal } from './EditWordModal'
import { UnknownWordsModal } from './UnknownWordsModal'

// 卡片容器
const Card = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 900px;
  width: 100%;
  position: relative;
  z-index: 1;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px) rotateX(2deg);
  }
`

// 文本样式
const Text = styled.p`
  font-size: 1.1rem;
  font-weight: 400;
  margin: 15px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
`
// 列表样式
const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 15px 0;
`
// 列表项样式
const ListItem = styled.li`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  margin: 8px 0;
  padding: 15px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
  }
  &:hover {
    transform: translateX(15px) scale(1.02);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    &::before {
      left: 100%;
    }
  }
`
// 按钮样式
const Button = styled.button<{ i?: number }>`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: ${props => (props.i === 0 ? '#000' : 'white')};
  font-size: 16px;
  font-weight: 500;
  padding: 14px 28px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin: 12px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.3);
    &::before {
      left: 100%;
    }
  }
  &:active {
    transform: translateY(-1px) scale(1.02);
  }
`
const PlayButton = styled(Button)`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 8px 25px rgba(245, 87, 108, 0.3);
  &:hover {
    box-shadow: 0 12px 35px rgba(245, 87, 108, 0.4);
  }
`

interface WordCardProps {
  wordData?: WordData
  //word: string
  description: string
  translations: Translation[]
  phrases: Phrase[]
  sentences: Sentence[]
  isLoading: boolean
  gb?: string
  us?: string
  bgIndex: number
  onNewWordClose?: (addedFlag: boolean,newWordData: WordData) => void
  onEditWordFinished: () => void
}


export const WordCard = ({
  wordData,
  //word,
  description,
  translations,
  phrases,
  sentences,
  gb = '英音',
  us = '美音',
  isLoading,
  bgIndex,
  onNewWordClose,
  onEditWordFinished,
}: WordCardProps) => {
const [showNewWordModal, setShowNewWordModal] = useState(false);
const [showEditWordModal, setShowEditWordModal] = useState(false);
const [showUnknown, setShowUnknown] = useState(false);
const [yaounknownWords, setYaoUnknownWords] = useState<{ wordData: WordData }[]>(
    () => {
      const data = localStorage.getItem('yaounknownWords')
      return data ? JSON.parse(data) : []
    }
  )
const handleRemoveUnknown = (index: number) => {
    const updated = [...yaounknownWords];
    updated.splice(index, 1);
    localStorage.setItem('yaounknownWords', JSON.stringify(updated));
    setYaoUnknownWords(updated);
  }; 
const handleNewWordClose = (addedFlag: boolean,newWordData: WordData) => {
  setShowNewWordModal(false);
  if (onNewWordClose) {
    onNewWordClose(addedFlag,newWordData);
  }
}
  const handleDontKnow = (wordData: WordData) => {
    const existing = JSON.parse(localStorage.getItem('yaounknownWords') || '[]')
    existing.push({ wordData })
    localStorage.setItem('yaounknownWords', JSON.stringify(existing))
    setYaoUnknownWords(existing)
  }

 const handlePlay = (type: string) => {
    const audioElement = document.getElementById(`audio-element${type}`) as HTMLAudioElement | null;
    if (!audioElement) return;
      audioElement.play();
  };
  if (isLoading||!wordData?.word) {
    return (
      <Card>
        <div
          style={{ textAlign: 'center', fontSize: '2rem', color: bgIndex === 0 ? '#000' : '#fff' }}
        >
          Loading...
        </div>
      </Card>
    )
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '20px',
          zIndex: 1000
        }}
      >
        <NewWordModal show={showNewWordModal} addedFlag={false} onClose={handleNewWordClose}/>
        <EditWordModal show={showEditWordModal} wordData={wordData} onClose={() => setShowEditWordModal(false)} onEditFinished={onEditWordFinished} />
        <UnknownWordsModal
          show={showUnknown}
          onClose={() => setShowUnknown(false)}
          yaounknownWords={yaounknownWords}
          onRemove={handleRemoveUnknown}
        />

      </div>

  <Card>
    <div style={{ textAlign: 'center', marginTop: '20px' , fontSize: '2.2rem'}}>
      <strong>{wordData?.word}</strong>
    </div>
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
    </div>
      <audio id="audio-elementGB" src={`https://dict.youdao.com/dictvoice?audio=${wordData?.word}&type=1`} />
      <audio id="audio-elementUS" src={`https://dict.youdao.com/dictvoice?audio=${wordData?.word}&type=2`} />
    <div>
        <PlayButton onClick={() => handlePlay('US')}>🇺🇸 🔊 {us}</PlayButton>
        <PlayButton onClick={() => handlePlay('GB')}>🇬🇧 🔊 {gb}</PlayButton>
    </div>
      <Text>
        <strong>描述：</strong>
      </Text>
      <List>
        <ListItem>{description}</ListItem>
      </List>
      <Text>
        <strong>翻译：</strong>
      </Text>
      <List>
        {translations.map((t, i) => (
          <ListItem key={i}>
            <strong>{t.pos}:</strong> {t.tran_cn}
          </ListItem>
        ))}
      </List>
      <Text>
        <strong>句子：</strong>
      </Text>
      <List>
        {sentences.map((s, i) => (
          <ListItem key={i}>
            <strong>{s.s_content}</strong>
            <br />
            {s.s_cn}
          </ListItem>
        ))}
      </List>
      {phrases.length > 0 && (
        <>
          <Text>
            <strong>短语：</strong>
          </Text>
          <List>
            {phrases.map((p, i) => (
              <ListItem key={i}>
                <strong>{p.p_content}:</strong> {p.p_cn}
              </ListItem>
            ))}
          </List>
        </>
      )}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button onClick={() => handleDontKnow(wordData)}>不会</Button>
        <Button onClick={() => setShowUnknown(true)}>不会的单词</Button>
        <Button
            onClick={() => setShowNewWordModal(true)}>
            ＋ 追加新单词
        </Button>
        <Button
            onClick={() => setShowEditWordModal(true)}>
            ＋ 编辑当前单词
        </Button>
      </div>
    </Card>
    </div>
  )
}
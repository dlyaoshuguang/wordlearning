import { Phrase, Sentence, Translation, WordData } from "./baseData";
import { EditWordModal } from "./EditWordModal";
import { NewWordModal } from "./NewWordModal";
import { UnknownWordsModal } from "./UnknownWordsModal";
import { useState } from "react";
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
  onNewWordClose?: (addedFlag: boolean,newWordData: WordData) => void
  onEditWordFinished?: (editedFlag: boolean, editedWordData: WordData) => void
}
export const WordCard = ({ 
    wordData, 
    description, 
    translations, 
    phrases, 
    sentences, 
    isLoading, 
    gb, 
    us,
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
        const handleDontKnow = (wordData: WordData) => {
            const existing = JSON.parse(localStorage.getItem('yaounknownWords') || '[]')
            existing.push({ wordData })
            localStorage.setItem('yaounknownWords', JSON.stringify(existing))
            setYaoUnknownWords(existing)
        }
        const handleRemoveUnknown = (index: number) => {
            const updated = [...yaounknownWords];
            updated.splice(index, 1);
            localStorage.setItem('yaounknownWords', JSON.stringify(updated));
            setYaoUnknownWords(updated);
        }; 
        if (isLoading||!wordData?.word) {
            return (
                <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-gray-400 text-white">
                    <h2 className="text-2xl font-bold mb-4">单词加载中...</h2>
                </div>
            )
        }
        const handleNewWordClose = (addedFlag: boolean, newWordData: WordData) => {
            setShowNewWordModal(false);
            if (onNewWordClose) {
                onNewWordClose(addedFlag, newWordData);
            }
        };
        const handleEditWordClose = (editedFlag: boolean, editedWordData: WordData) => {
            setShowEditWordModal(false);
            if (onEditWordFinished) {
                onEditWordFinished(editedFlag, editedWordData);
            }
        };
    return (
        <>
        <NewWordModal show={showNewWordModal} onClose={handleNewWordClose}/>
        <EditWordModal show={showEditWordModal} onClose={handleEditWordClose} wordData={wordData} />
        <UnknownWordsModal
          show={showUnknown}
          onClose={() => setShowUnknown(false)}
          yaounknownWords={yaounknownWords}
          onRemove={handleRemoveUnknown}
        />
        <div>
            <div className="mb-4">
                <h2 className="text-2xl">{wordData?.word}</h2>
            </div>
            <audio id="audio-elementGB" src={`https://dict.youdao.com/dictvoice?audio=${wordData?.word}&type=1`}>
                <track kind="captions" srcLang="en" label="No captions available" />
            </audio>
            <audio id="audio-elementUS" src={`https://dict.youdao.com/dictvoice?audio=${wordData?.word}&type=2`}>
                <track kind="captions" srcLang="en" label="No captions available" />
            </audio>
            <button onClick={() => {
                const audioGB = document.getElementById('audio-elementGB') as HTMLAudioElement;
                audioGB.play();
            }} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">GB🔊 {gb}</button>
            <button onClick={() => {
                const audioUS = document.getElementById('audio-elementUS') as HTMLAudioElement;
                audioUS.play();
            }} className="ml-2 px-2 py-1 bg-green-500 text-white rounded">US🔊 {us}</button>
        </div>
        <h2 className="text-xl font-bold mt-4 mb-2">释义</h2>
            <p className="mb-4">{description}</p>
        <h2 className="text-xl font-bold mt-4 mb-2">翻译</h2>
        <ul className="list-disc list-inside mb-4">
            {translations.map((t, index) => (
                <p key={index}>{t.pos}.{t.tran_cn}</p>
            ))}
        </ul>
        <h2 className="text-xl font-bold mt-4 mb-2">短语</h2>
        <ul className="list-disc list-inside mb-4 list-style:none">
            {phrases.map((p, index) => (
                <p key={index}>{p.p_content} - {p.p_cn}</p>
            ))}
        </ul>
        <h2 className="text-xl font-bold mt-4 mb-2">例句</h2>
        <ul className="list-disc list-inside mb-4">
            {sentences.map((s, index) => (
                <p key={index}>{s.s_content} - {s.s_cn}</p>
            ))}
        </ul>
        <button
            onClick={() => setShowNewWordModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            ＋ 追加新单词
        </button>
        <button
            onClick={() => setShowEditWordModal(true)}
            className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            ✏️ 编辑释义
        </button>
        <button onClick={() => handleDontKnow(wordData)} className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            不会
        </button>
        <button onClick={() => setShowUnknown(true)} className="ml-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            不会的单词
        </button>
        </>
    )}

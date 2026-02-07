import { Phrase, Sentence, Translation, WordData } from "./baseData";
import { NewWordModal } from "./NewWordModal";
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
    }: WordCardProps) => {
        const [showNewWordModal, setShowNewWordModal] = useState(false);
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
    return (
        <>
        <NewWordModal show={showNewWordModal} onClose={handleNewWordClose}/>
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
                <p key={index}>{t.pos}{t.tran_cn}</p>
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
        </>
    )}

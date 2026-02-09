import { useState,useEffect} from 'react'
import type {WordData,HandleChangeEvent} from './baseData'
import { supabase } from "../utils/supabase";
import {ModalOverlay,ModalContent} from './style'
interface NewWordModalProps {
  userId?: string
  show: boolean
  onClose: (addedFlag: boolean, newWordData: WordData) => void
}
export const NewWordModal = ({ userId, show, onClose }: NewWordModalProps) => {

  const [inputWord, setInputWord] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [addedFlag, setAddedFlag] = useState(false);
  const [newWordData, setNewWordData] = useState<WordData>({word: '', description: ''});
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(show)
    useEffect(() => {
    if (show) {
      setIsVisible(true)
      setTimeout(() => setIsOpen(true), 0)
    } else {
      setIsOpen(false)
    }
  }, [show])
  const handleWordChange = (event: HandleChangeEvent) => {
    setInputWord(event.target.value);
  }
  const handleDescriptionChange = (event: HandleChangeEvent) => {
    setInputDescription(event.target.value);
  }
  async function findWord(newword: string, description: string) {
    const { data, error } = await supabase
        .from('words')
        .select('word')
        .eq('word', newword)
    if (data && data.length > 0) {
        console.log('Data:', data);
        alert("该单词已存在");
        setAddedFlag(false)
    }
    if (data && data.length === 0) {
        await insertWord(inputWord, inputDescription)
    } 
    if (error) {
        console.error('Error:', error);
        alert("未知错误，请稍后再试");
    }
  }
  async function insertWord(newword: string, description: string) {
    const { data, error } = await supabase
        .from('words')
        .insert({word: newword, description: description, user_id: userId })
    if (error) {
        console.error('Error:', error);
    } else {
      console.log('Inserted data:', data);
      setInputWord('');
      setInputDescription('');
      setAddedFlag(true)
      setNewWordData({word: newword, description: description})
    }
  }
  const handleSubmit = async () => {
    await findWord(inputWord, inputDescription)
  }
    if (!show) return null

  if (!isVisible) return null
return (
<ModalOverlay className={`modal ${isOpen ? 'open' : ''}`}>
    <ModalContent $isOpen={isOpen} className="modal-content">
        <h2 className="text-2xl font-bold mb-4">添加新单词</h2>
        <label>
        输入新单词：<input type="text" value={inputWord} onChange={handleWordChange} />
        <p>新单词: {inputWord}</p>
        输入释义：<input type="text" value={inputDescription} onChange={handleDescriptionChange} />
        <p>释义: {inputDescription}</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-5" onClick={() => handleSubmit()}>追加</button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-5" onClick={() => onClose(addedFlag, newWordData)}>关闭</button>
        </label>
    </ModalContent>
</ModalOverlay>
)
}
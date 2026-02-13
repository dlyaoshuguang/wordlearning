import { useState,useEffect} from 'react'
import type {WordData,HandleChangeEvent} from './baseData'
import { supabase } from "../utils/supabase";
import {ModalOverlay,ModalContent} from './style'
interface EditWordModalProps {
  userId?: string
  show: boolean
  onClose: (editedFlag: boolean, editedWordData: WordData) => void
  onDelete: () => void
  wordData: WordData
}
export const EditWordModal = ({ userId, show, onClose, onDelete,wordData }: EditWordModalProps) => {
  const [inputDescription, setInputDescription] = useState(wordData.description);
  const [editedFlag, setEditedFlag] = useState(false);
  const [editedWordData, setEditedWordData] = useState<WordData>(wordData);
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(show)
    useEffect(() => {
    if (show) {
      setIsVisible(true)
      setInputDescription(wordData.description)
      setTimeout(() => setIsOpen(true), 0)
    } else {
      setIsOpen(false)
    }}, [show,isVisible,wordData])
  const handleDescriptionChange = (event: HandleChangeEvent) => {
    setInputDescription(event.target.value);
  }
  async function updateWord(newword: string, description: string) {
    const { error } = await supabase
      .from('words')
      .update({word: newword, description: description})
      .eq('word', wordData.word)
      .eq('user_id', userId)
    if (error) {
      console.error('Error:', error);
      alert("未知错误，请稍后再试");
    } else {
      setEditedFlag(true)
      setEditedWordData({word: newword, description: description})
      onClose(true, {word: newword, description: description})
    }
  }
  async function deleteWord() {
    const { error } = await supabase
      .from('words')
      .delete()
      .eq('word', wordData.word)
      .eq('user_id', userId)
    if (error) {
      console.error('Error:', error);
      alert("未知错误，请稍后再试");
    } else {
      onDelete();
    }
  }
  
      if (!show) return null

  if (!isVisible) return null

  return (
    <ModalOverlay style={{ display: isVisible ? 'flex' : 'none' }}>
      <ModalContent $isOpen={isOpen} className="modal-content">
        <h2>编辑释义</h2>
        <p>单词: {wordData.word}</p>
       {/* Moved inline styles to className, define .edit-word-input in external CSS */}
       <input
          type="text"
          value={inputDescription}
          onChange={handleDescriptionChange}
          placeholder="释义"
          className="edit-word-input p-2 border rounded mb-4"
        />
        <div>
        <button className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          onClick={() => updateWord(wordData.word, inputDescription)}>
          变更
        </button>
        <button className="w-1/2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          onClick={() => {
            if (globalThis.confirm("确定要删除这个单词吗？")) {
              deleteWord();
            }
          }}>
          删除
        </button>
        <button className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        onClick={() => onClose(editedFlag, editedWordData)}>关闭</button>
        </div>
      </ModalContent>
    </ModalOverlay>
  )
}
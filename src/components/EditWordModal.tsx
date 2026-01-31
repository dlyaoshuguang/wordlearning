import { useState,useEffect} from 'react'
import axios from 'axios';
import {Button, ModalOverlay,ModalContent} from './style.tsx'
import type {WordData,HandleChangeEvent} from './baseData'
import { baseUrl } from './baseData'
interface EditWordModalProps {
  show: boolean
  wordData: WordData
  onClose: () => void
  onEditFinished: () => void
}

   function editWord(wordData: WordData, description: string, onEditFinished: () => void) {
    axios.put(baseUrl + wordData.id, {
      word: wordData.word,
      description: description
    })
    .then(response => {
      console.log(response.data); // Handle the response data
        onEditFinished();
    })
    .catch(error => {
      console.error('Error:', error); // Handle errors
    });
  }
  function deleteWord(wordData: WordData, onEditFinished: () => void) {
    axios.delete(baseUrl + wordData.id)
    .then(response => {
      console.log(response.data); // Handle the response data
      onEditFinished();
    })
    .catch(error => {
      console.error('Error:', error); // Handle errors
    });
  }
export const EditWordModal = ({ show, onClose,wordData, onEditFinished}: EditWordModalProps) => {
  if (!show) return null
  const [inputDescription, setInputDescription] = useState(wordData.description);
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(show)
  const handleDescriptionChange = (event: HandleChangeEvent) => {
    setInputDescription(event.target.value);
  }
  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setTimeout(() => setIsOpen(true), 0)
    } else {
      setIsOpen(false)
    }
  }, [show])

  if (!isVisible) return null
  return (
    <ModalOverlay onClick={() => onClose()}>
      <ModalContent onClick={(e) => e.stopPropagation()} $isOpen={isOpen}>
        <h2>变更单词描述</h2>
      <label>
        <p>单词: {wordData.word}</p>
        输入描述：<input type="text" value={inputDescription} onChange={handleDescriptionChange} />
        <p>描述: {inputDescription}</p>
        <Button onClick={() => editWord(wordData, inputDescription, onEditFinished)}>变更</Button>
        <Button onClick={() => deleteWord(wordData, onEditFinished)}>删除单词</Button>
        <Button onClick={() => onClose()}>关闭</Button>
      </label>
      </ModalContent>
    </ModalOverlay>
  )
}

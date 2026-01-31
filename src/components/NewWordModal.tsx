import { useState,useEffect} from 'react'
import axios from 'axios';
import {Button, ModalOverlay,ModalContent} from './style.tsx'
import type {WordData,HandleChangeEvent} from './baseData'
import { baseUrl} from './baseData'
interface NewWordModalProps {
  show: boolean
  addedFlag: boolean
  onClose: (addedFlag: boolean, newWordData: WordData) => void
}

export const NewWordModal = ({ show, onClose }: NewWordModalProps) => {
  if (!show) return null
  const [inputWord, setInputWord] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [addedFlag, setAddedFlag] = useState(false);
  const [newWordData, setNewWordData] = useState<WordData>({word: '', description: ''});
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(show)
  const handleWordChange = (event: HandleChangeEvent) => {
    setInputWord(event.target.value);
  }
  const handleDescriptionChange = (event: HandleChangeEvent) => {
    setInputDescription(event.target.value);
  }
  function insertWord(newword: string, description: string) {
    console.log("This is a dummy function to demonstrate changes.");
    axios.post(baseUrl, {
      word: newword,
      description: description
    })
    .then(response => {
      console.log(response.data); // Handle the response data
      setAddedFlag(true)
      setNewWordData({word: newword, description: description})
    })
    .catch(error => {
      alert("该单词已存在");
      setAddedFlag(false)
      console.error('Error:', error); // Handle errors
    })
    .finally(() => {
      setInputWord('');
      setInputDescription('');
    })
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
    <ModalOverlay onClick={() => onClose(addedFlag, newWordData)}>
      <ModalContent onClick={(e) => e.stopPropagation()} $isOpen={isOpen}>
        <h2>追加新单词</h2>
      <label>
        输入新单词：<input type="text" value={inputWord} onChange={handleWordChange} />
        <p>新单词: {inputWord}</p>
        输入描述：<input type="text" value={inputDescription} onChange={handleDescriptionChange} />
        <p>描述: {inputDescription}</p>
        <Button onClick={() => insertWord(inputWord, inputDescription)}>追加</Button>
        <Button onClick={() => onClose(addedFlag, newWordData)}>关闭</Button>
      </label>
      </ModalContent>
    </ModalOverlay>
  )
}

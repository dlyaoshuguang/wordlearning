import styled from 'styled-components'
import { useState, useEffect } from 'react'
import type { WordData } from './baseData'
import {ModalOverlay,ModalContent} from './style.tsx'

interface UnknownWordsModalProps {
  show: boolean
  onClose: () => void
  yaounknownWords: { wordData: WordData }[]
  onRemove: (index: number) => void
}

// 标题
const ModalTitle = styled.h2`
  color: white;
  margin-bottom: 20px;
  text-align: center;
`

// 关闭按钮
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  &:active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`

// 单词项
const WordItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  margin: 10px 0;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  position: relative;
`

// 删除按钮
const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    color: #ff5252;
  }
`
export const UnknownWordsModal = ({
  show,
  onClose,
  yaounknownWords,
  onRemove
}: UnknownWordsModalProps) => {
  const [isVisible, setIsVisible] = useState(show)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setTimeout(() => setIsOpen(true), 0)
    } else {
      setIsOpen(false)
    }
  }, [show])

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setIsVisible(false)
    }
  }

  if (!isVisible) return null

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent
        $isOpen={isOpen}
        onClick={e => e.stopPropagation()}
        onTransitionEnd={handleTransitionEnd}
      >
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalTitle>不会的单词</ModalTitle>
        <p style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
          点击单词面板底部的"不会"按钮，即可标记
        </p>
        {yaounknownWords.length === 0 ? (
          <p style={{ color: 'white', textAlign: 'center' }}>暂无不会的单词</p>
        ) : (
          yaounknownWords.map((item, index) => (
            <WordItem key={index}>
              <DeleteButton onClick={() => onRemove(index)}>×</DeleteButton>
              <strong>{item.wordData.word}</strong>
              <br />
              {item.wordData.description && <em>{item.wordData.description}</em>}
            </WordItem>
          ))
        )}
      </ModalContent>
    </ModalOverlay>
  )
}

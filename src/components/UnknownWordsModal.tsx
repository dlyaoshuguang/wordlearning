import { useState, useEffect } from 'react'
import type { WordData } from './baseData'
import {ModalOverlay,ModalContent,ModalTitle,CloseButton,WordItem,DeleteButton} from './style'
import styled from 'styled-components'
const MessageParagraph = styled.p`
  color: white;
  text-align: center;
  margin-bottom: 20px;
`

interface UnknownWordsModalProps {
  show: boolean
  onClose: () => void
  yaounknownWords: { wordData: WordData }[]
  onRemove: (index: number) => void
}
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
        <MessageParagraph>
          点击单词面板底部的"不会"按钮，即可标记
        </MessageParagraph>
        {yaounknownWords.length === 0 ? (
          <MessageParagraph>暂无不会的单词</MessageParagraph>
        ) : (
          yaounknownWords.map((item, index) => (
            <WordItem key={item.wordData.word}>
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

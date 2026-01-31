import styled from 'styled-components'
// 按钮样式
export const Button = styled.button<{ i?: number }>`
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
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`
export const ModalContent = styled.div<{ $isOpen: boolean }>`
  background: rgba(7, 160, 225, 0.66);
  color: white;
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: scale(1.05);
  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out;
  position: relative;
  ${props =>
    props.$isOpen &&
    `
    opacity: 1;
    transform: scale(1);
  `}
`

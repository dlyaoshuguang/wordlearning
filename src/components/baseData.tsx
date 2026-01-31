export interface Translation {
  pos: string
  tran_cn: string
}
export interface Phrase {
  p_content: string
  p_cn: string
}

export interface Sentence {
  s_content: string
  s_cn: string
}
export interface WordData {
  id?: number
  word: string
  description: string
}
export interface HandleChangeEvent {
  target: { value: string }
}

export const baseUrl = 'http://192.168.1.11:6868/api/words/';
//export const baseUrl = 'http://localhost:8080/api/words/';
export const englishWordUrl = 'https://v2.xxapi.cn/api/englishwords';

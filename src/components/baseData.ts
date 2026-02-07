export interface WordData {
  id?: number
  word: string
  description: string
}
export interface UserData {
  id: string
  email: string
}
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
export const englishWordUrl = 'https://v2.xxapi.cn/api/englishwords';
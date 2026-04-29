// 클라이언트/서버 모두 사용 가능한 타입 파일 (fs 미포함)

export interface WorkLink {
  url?: string;   // 버튼 클릭 시 이동할 URL
  text?: string;  // 버튼에 표시될 텍스트
}

// key = vimeoId
export type WorkLinks = Record<string, WorkLink>;

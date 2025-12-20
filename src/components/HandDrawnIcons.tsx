import React from 'react';

interface IconProps {
  className?: string;
}

export const HandDrawnHome: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* 屋根 */}
    <path d="M3.2 10.8c0 0 8.5-8.2 8.8-8.5s.8-.3 1 0 8.8 8.5 8.8 8.5" />
    {/* 家の本体 */}
    <path d="M5.1 10.2v8.3c0 .8.2 1.5 1.5 1.5h10.8c1.3 0 1.5-.7 1.5-1.5v-8.3" />
    {/* ドア */}
    <path d="M10.2 20v-5.5c0-.8.3-1.5 1.8-1.5s1.8.7 1.8 1.5V20" />
    {/* 窓 */}
    <path d="M8.5 15.2h1.2m5.1-1.7h1.2v1.5h-1.2z" />
    {/* 煙突 */}
    <path d="M16.8 7.2v-2.7c0-.5.2-.7.7-.7h1.1c.5 0 .7.2.7.7v5.3" />
    {/* 煙 */}
    <path d="M17.8 4.2c.3-.8.8-1.2 1.2-1.2s.8.4.8.8-.3.7-.8.7-.9-.1-1.2-.3z" />
  </svg>
);

export const HandDrawnList: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* リストアイテム1 */}
    <path d="M3.8 6.2c0 .8.6 1.4 1.4 1.4s1.4-.6 1.4-1.4-.6-1.4-1.4-1.4-1.4.6-1.4 1.4z" />
    <path d="M8.5 6.2h11.2" />
    
    {/* リストアイテム2 */}
    <path d="M3.8 12c0 .8.6 1.4 1.4 1.4s1.4-.6 1.4-1.4-.6-1.4-1.4-1.4-1.4.6-1.4 1.4z" />
    <path d="M8.5 12h11.2" />
    
    {/* リストアイテム3 */}
    <path d="M3.8 17.8c0 .8.6 1.4 1.4 1.4s1.4-.6 1.4-1.4-.6-1.4-1.4-1.4-1.4.6-1.4 1.4z" />
    <path d="M8.5 17.8h11.2" />
    
    {/* 手書き風の装飾線 */}
    <path d="M8.2 5.8c.1.1.2.2.3.4m10.8-.2c.1.1.2.2.3.4" />
  </svg>
);

export const HandDrawnUsers: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* 人物1の頭 */}
    <circle cx="9" cy="7.2" r="3.8" />
    {/* 人物1の体 */}
    <path d="M2.8 20.2v-1.8c0-2.2 1.8-4 4-4h4.4c2.2 0 4 1.8 4 4v1.8" />
    
    {/* 人物2の頭 */}
    <circle cx="16.5" cy="6.8" r="2.8" />
    {/* 人物2の体 */}
    <path d="M21.2 20.2v-1.4c0-1.6-1.3-2.9-2.9-2.9h-1.8" />
    
    {/* 手書き風の装飾 */}
    <path d="M6.2 4.8c.2-.3.5-.5.8-.5m9.8 1.2c.3-.2.6-.3.9-.2" />
    <path d="M12.8 18.5c.1.3.2.6.2.9m5.2-.8c.1.2.2.4.2.6" />
  </svg>
);

export const HandDrawnChart: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Y軸 */}
    <path d="M3.2 20.8V3.5c0-.3.2-.5.5-.5" />
    {/* X軸 */}
    <path d="M3.2 20.8h17.3c.3 0 .5-.2.5-.5" />
    
    {/* バー1 */}
    <path d="M6.8 20.8V15.2c0-.3.3-.6.6-.6h1.2c.3 0 .6.3.6.6v5.6" />
    {/* バー2 */}
    <path d="M11.2 20.8V11.8c0-.3.3-.6.6-.6h1.2c.3 0 .6.3.6.6v9" />
    {/* バー3 */}
    <path d="M15.6 20.8V8.2c0-.3.3-.6.6-.6h1.2c.3 0 .6.3.6.6v12.6" />
    
    {/* 手書き風の装飾点 */}
    <circle cx="7.4" cy="13.8" r="0.3" fill="currentColor" />
    <circle cx="11.8" cy="9.5" r="0.3" fill="currentColor" />
    <circle cx="16.2" cy="6.2" r="0.3" fill="currentColor" />
    
    {/* グリッド線（手書き風） */}
    <path d="M3.5 16.5h17m-17-4h17m-17-4h17" strokeWidth="0.8" opacity="0.3" />
  </svg>
);
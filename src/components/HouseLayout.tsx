import React from 'react';

export function HouseLayout() {
  return (
    <div className="relative w-full h-full">
      {/* シンプルな家の外枠 */}
      <svg 
        viewBox="0 0 300 400" 
        className="w-full h-full absolute inset-0"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }}
      >
        <defs>
          {/* 屋根用の色鉛筆風テクスチャ */}
          <pattern id="crayonRoofTexture" patternUnits="userSpaceOnUse" width="6" height="6">
            <rect width="6" height="6" fill="#dc2626"/>
            <path d="M0,3 L6,3 M3,0 L3,6" stroke="#b91c1c" strokeWidth="0.3" opacity="0.5"/>
            <path d="M0,0 L6,6 M-1,2 L7,2 M-1,4 L7,4" stroke="#991b1b" strokeWidth="0.4" opacity="0.3"/>
            <circle cx="1.5" cy="1.5" r="0.3" fill="#ef4444" opacity="0.6"/>
            <circle cx="4.5" cy="4.5" r="0.2" fill="#fca5a5" opacity="0.4"/>
            <circle cx="2" cy="4" r="0.25" fill="#f87171" opacity="0.5"/>
          </pattern>
          
          {/* 煙のアニメーション */}
          <g id="smoke">
            {/* 煙の雲1 */}
            <ellipse cx="0" cy="0" rx="3.5" ry="2.5" fill="#9ca3af" opacity="0.7">
              <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite"/>
              <animateTransform 
                attributeName="transform" 
                type="translate" 
                values="0,0; -1,-2; 1,-1; 0,0" 
                dur="3s" 
                repeatCount="indefinite"
              />
            </ellipse>
            
            {/* 煙の雲2 */}
            <ellipse cx="2" cy="-5" rx="4" ry="3" fill="#6b7280" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite"/>
              <animateTransform 
                attributeName="transform" 
                type="translate" 
                values="0,0; 2,-1; -1,-2; 0,0" 
                dur="3.5s" 
                repeatCount="indefinite"
              />
            </ellipse>
            
            {/* 煙の雲3 */}
            <ellipse cx="-1" cy="-10" rx="4.5" ry="3.5" fill="#9ca3af" opacity="0.5">
              <animate attributeName="opacity" values="0.5;0.15;0.5" dur="3s" repeatCount="indefinite"/>
              <animateTransform 
                attributeName="transform" 
                type="translate" 
                values="0,0; -2,-1; 1,-3; 0,0" 
                dur="4s" 
                repeatCount="indefinite"
              />
            </ellipse>
            
            {/* 煙の雲4 */}
            <ellipse cx="1" cy="-16" rx="3.8" ry="2.8" fill="#6b7280" opacity="0.4">
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3.5s" repeatCount="indefinite"/>
              <animateTransform 
                attributeName="transform" 
                type="translate" 
                values="0,0; 1,-2; -2,-1; 0,0" 
                dur="4.5s" 
                repeatCount="indefinite"
              />
            </ellipse>
            
            {/* 煙の雲5 */}
            <ellipse cx="-2" cy="-22" rx="3.2" ry="2.2" fill="#9ca3af" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0.05;0.3" dur="4s" repeatCount="indefinite"/>
              <animateTransform 
                attributeName="transform" 
                type="translate" 
                values="0,0; -1,-3; 2,-1; 0,0" 
                dur="5s" 
                repeatCount="indefinite"
              />
            </ellipse>
          </g>
        </defs>
        
        {/* 外壁 - 縦長 */}
        <rect 
          x="30" 
          y="80" 
          width="240" 
          height="300" 
          fill="#f8f9fa" 
          stroke="#e9ecef" 
          strokeWidth="2"
          rx="8"
        />
        
        {/* 屋根 - 色鉛筆風の赤色 */}
        <polygon 
          points="20,90 150,20 280,90" 
          fill="url(#crayonRoofTexture)"
          stroke="#991b1b" 
          strokeWidth="2"
        />
        
        {/* 煙突 */}
        <rect 
          x="190" 
          y="30" 
          width="22" 
          height="50" 
          fill="#8b4513" 
          stroke="#654321" 
          strokeWidth="1.5"
          rx="3"
        />
        
        {/* 煙突の上部 */}
        <rect 
          x="186" 
          y="26" 
          width="30" 
          height="8" 
          fill="#654321" 
          stroke="#4a2c17" 
          strokeWidth="1.5"
          rx="3"
        />
        
        {/* 煙突から出る煙 */}
        <g transform="translate(201, 22)">
          <use href="#smoke"/>
        </g>

      </svg>
      

    </div>
  );
}
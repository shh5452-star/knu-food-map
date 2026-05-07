'use client'

import { useEffect } from 'react'

export default function FoodIcons() {
  useEffect(() => {
    const foods = ['🍜','☕','🍱','🍢','🍝','🍕','🍣','🧋','🥗','🥐','🍰','🍛','🌮','🍔','🍙','🧆']
    const positions = [
      {top:'6%',left:'4%'},{top:'12%',right:'5%'},
      {top:'22%',left:'2%'},{top:'18%',left:'55%'},
      {top:'35%',right:'3%'},{top:'42%',left:'8%'},
      {top:'55%',right:'6%'},{top:'60%',left:'3%'},
      {top:'70%',left:'50%'},{top:'72%',right:'4%'},
      {top:'82%',left:'6%'},{top:'85%',right:'7%'},
      {top:'3%',left:'28%'},{top:'48%',left:'45%'},
      {top:'30%',left:'22%'},{top:'65%',left:'30%'},
    ]
    const container = document.getElementById('food-icons')
    if (!container) return
    const icons: HTMLSpanElement[] = []
    positions.forEach((p: {top?:string,left?:string,right?:string}, i) => {
      const el = document.createElement('span')
      const dur = (4.5 + Math.random() * 4).toFixed(1)
      const delay = (Math.random() * 8).toFixed(1)
      const size = (18 + Math.random() * 14).toFixed(0)
      el.style.cssText = `position:absolute;font-size:${size}px;line-height:1;opacity:0;animation:foodFloatGlow ${dur}s ease-in-out infinite;animation-delay:-${delay}s;pointer-events:none;`
      if (p.top) el.style.top = p.top
      if (p.left) el.style.left = p.left
      if (p.right) el.style.right = p.right
      el.textContent = foods[i % foods.length]
      container.appendChild(el)
      icons.push(el)
    })
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * icons.length)
      const el = icons[idx]
      if (parseFloat(window.getComputedStyle(el).opacity) < 0.05) {
        el.textContent = foods[Math.floor(Math.random() * foods.length)]
      }
    }, 3000)
    return () => { clearInterval(interval); if (container) container.innerHTML = '' }
  }, [])

  return (
    <>
      <style>{`
        @keyframes foodFloatGlow {
          0%   { transform:translateY(0) rotate(0deg);    opacity:0;    filter:drop-shadow(0 0 0px  rgba(99,102,241,0));   }
          15%  { transform:translateY(-5px) rotate(2deg); opacity:0.35; filter:drop-shadow(0 0 8px  rgba(99,102,241,.55)); }
          45%  { transform:translateY(-18px) rotate(7deg);opacity:0.55; filter:drop-shadow(0 0 14px rgba(99,102,241,.8));  }
          70%  { transform:translateY(-10px) rotate(4deg);opacity:0.3;  filter:drop-shadow(0 0 6px  rgba(99,102,241,.4));  }
          85%  { transform:translateY(-3px) rotate(1deg); opacity:0;    filter:drop-shadow(0 0 0px  rgba(99,102,241,0));   }
          100% { transform:translateY(0) rotate(0deg);    opacity:0;    filter:drop-shadow(0 0 0px  rgba(99,102,241,0));   }
        }
      `}</style>
      <div id="food-icons" style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:1 }} />
    </>
  )
}

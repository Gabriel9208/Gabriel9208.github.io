import React, { useRef } from "react";
import { Link } from "react-router-dom";

interface BentoCellProps {
  className?: string;
  children: React.ReactNode;
  href?: string;
  external?: string;
}

export function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ boxShadow: '0 0 0 1px #1e1e1e', borderRadius: 24 }} className="bg-black">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] [&>*:first-child]:rounded-t-[24px] md:[&>*:first-child]:rounded-tl-[24px] md:[&>*:nth-child(2)]:rounded-tr-[24px] [&>*:last-child]:rounded-b-[24px] md:[&>*:last-child]:rounded-br-[24px] md:[&>*:nth-child(6)]:rounded-bl-[24px]"
        style={{ gap: 2 }}>
        {children}
      </div>
    </div>
  );
}

export function BentoCell({ className = "", children, href, external }: BentoCellProps) {
  const ref = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
    el.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
    el.style.setProperty('--my', `${(y / rect.height) * 100}%`);
    el.style.zIndex = '10';
    el.style.position = 'relative';
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    el.style.zIndex = '';
  };

  const sharedProps = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: {
      background: '#111',
      padding: 36,
      position: 'relative' as const,
      overflow: 'hidden',
      transition: 'transform 0.15s ease',
      transformStyle: 'preserve-3d' as const,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    className: `bento-cell ${className}`,
  };

  const content = (
    <>
      <div className="bento-cell-glow" />
      {children}
    </>
  );

  if (href) return <Link ref={ref as any} to={href} {...sharedProps} className={`block cursor-pointer outline-none ${sharedProps.className}`}>{content}</Link>;
  if (external) return <a ref={ref as any} href={external} target="_blank" rel="noopener noreferrer" {...sharedProps} className={`block cursor-pointer outline-none ${sharedProps.className}`}>{content}</a>;
  return <div ref={ref as any} {...sharedProps}>{content}</div>;
}

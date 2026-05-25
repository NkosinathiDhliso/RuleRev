import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

export const runtime = 'edge';

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? SITE.positioning;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: '#3B6BB8',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: '-0.01em', opacity: 0.85 }}>{SITE.name}</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            maxWidth: 920,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 22, opacity: 0.85 }}>rulerev.com</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

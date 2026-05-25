import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#3B6BB8',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          fontWeight: 600,
          fontFamily: 'serif',
          letterSpacing: '-0.04em',
          borderRadius: 6,
        }}
      >
        R
      </div>
    ),
    size,
  );
}

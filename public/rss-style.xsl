<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en-ZA">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS Feed</title>
        <style>
          * { box-sizing: border-box; margin: 0; }
          body {
            font-family: 'Inter', -apple-system, system-ui, sans-serif;
            background: #fafafa;
            color: #0a0a0a;
            line-height: 1.6;
            padding: 0;
          }
          .banner {
            background: linear-gradient(135deg, #6d5ef5 0%, #3b6bb8 45%, #1ab6c9 100%);
            color: #fff;
            padding: 48px 24px;
            text-align: center;
          }
          .banner h1 { font-size: 28px; font-weight: 500; letter-spacing: -0.02em; margin-bottom: 8px; }
          .banner p { opacity: 0.85; font-size: 15px; max-width: 480px; margin: 0 auto; }
          .banner .hint {
            display: inline-block;
            margin-top: 16px;
            padding: 6px 14px;
            border-radius: 999px;
            background: rgba(255,255,255,0.15);
            font-size: 13px;
            backdrop-filter: blur(4px);
          }
          .container { max-width: 680px; margin: 0 auto; padding: 40px 24px; }
          .meta { font-size: 13px; color: #5b5b5b; margin-bottom: 32px; }
          .meta a { color: #3b6bb8; text-decoration: none; }
          .meta a:hover { text-decoration: underline; }
          .item {
            padding: 24px 0;
            border-bottom: 1px solid rgba(0,0,0,0.06);
          }
          .item:last-child { border-bottom: none; }
          .item-title {
            font-size: 18px;
            font-weight: 500;
            letter-spacing: -0.01em;
            margin-bottom: 6px;
          }
          .item-title a { color: #0a0a0a; text-decoration: none; }
          .item-title a:hover { color: #3b6bb8; }
          .item-date { font-size: 12px; color: #8a8a8a; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px; }
          .item-desc { font-size: 15px; color: #5b5b5b; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="banner">
          <h1>&#128225; RSS Feed</h1>
          <p>This is a web feed. Subscribe by copying the URL into your RSS reader.</p>
          <span class="hint">Copy this page's URL &#8594; paste into Feedly, NetNewsWire, etc.</span>
        </div>
        <div class="container">
          <p class="meta">
            <strong><xsl:value-of select="/rss/channel/title"/></strong>
            &#160;&#8212;&#160;
            <a href="{/rss/channel/link}">Visit website</a>
          </p>
          <xsl:for-each select="/rss/channel/item">
            <div class="item">
              <div class="item-date"><xsl:value-of select="pubDate"/></div>
              <h2 class="item-title">
                <a href="{link}"><xsl:value-of select="title"/></a>
              </h2>
              <p class="item-desc"><xsl:value-of select="description"/></p>
            </div>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

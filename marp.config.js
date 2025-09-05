const { Marp } = require('@marp-team/marp-core')

module.exports = {
  engine: ({ marp }) => marp.themeSet.add(`
    /* business-green theme */
    section {
      background: linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%);
      font-family: 'Yu Gothic Medium', 'Yu Gothic', 'Meiryo', 'Hiragino Kaku Gothic ProN', sans-serif;
      font-size: 28px;
      padding: 60px 80px;
      color: #333;
    }

    section::after {
      font-size: 18px;
      color: #666;
      font-weight: normal;
    }

    h1 {
      color: #1b5e20;
      font-size: 3.2rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 2rem;
      background: linear-gradient(135deg, #2e7d32, #4caf50);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    h2 {
      color: #2e7d32;
      font-size: 2.4rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
      border-left: 8px solid #4caf50;
      padding-left: 1rem;
    }

    h3 {
      color: #388e3c;
      font-size: 1.8rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    p, li {
      color: #333;
      line-height: 1.8;
      font-size: 1.1rem;
    }

    ul, ol {
      margin-left: 2rem;
    }

    li {
      margin-bottom: 0.8rem;
    }

    strong {
      color: #2e7d32;
      font-weight: bold;
    }

    em {
      color: #4caf50;
      font-style: normal;
      font-weight: bold;
    }

    code {
      background: #f1f8e9;
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      color: #2e7d32;
    }

    pre {
      background: #f1f8e9;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #4caf50;
      overflow-x: auto;
    }

    blockquote {
      background: #e8f5e8;
      border-left: 6px solid #4caf50;
      padding: 1.5rem;
      margin: 2rem 0;
      border-radius: 4px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 2rem 0;
    }

    th, td {
      border: 1px solid #c8e6c9;
      padding: 1rem;
      text-align: left;
    }

    th {
      background: #e8f5e8;
      color: #2e7d32;
      font-weight: bold;
    }

    .center {
      text-align: center;
    }

    .highlight-box {
      background: linear-gradient(135deg, #e8f5e8, #f1f8e9);
      border: 2px solid #4caf50;
      border-radius: 12px;
      padding: 2rem;
      margin: 2rem 0;
    }

    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
    }

    .icon {
      font-size: 3rem;
      color: #4caf50;
      text-align: center;
      margin-bottom: 1rem;
    }

    .demo-qr {
      text-align: center;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      border: 2px solid #4caf50;
      margin: 2rem auto;
      max-width: 300px;
    }

    .footer-info {
      font-size: 0.9rem;
      color: #666;
      text-align: center;
      margin-top: 2rem;
    }
  `)
}
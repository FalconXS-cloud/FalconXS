# FalconXS

FalconXS is a small AI chat website powered by the OpenAI Responses API.

## Setup

1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env`.
3. Put your OpenAI API key in `.env`:

```env
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-5.2
PORT=3000
```

4. Start the website:

```bash
npm start
```

5. Open `http://localhost:3000`.

## Notes

- Keep your API key only in `.env`. Do not paste it into browser JavaScript.
- The server uses the OpenAI Responses API endpoint at `/v1/responses`.
- You can change the model by editing `OPENAI_MODEL`.

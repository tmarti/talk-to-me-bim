## talk-to-me-bim

Code for the talk2meBIM hackathon challenge!

## 🎥 connecting the LLM to the viewer and the model data

https://github.com/user-attachments/assets/8c493885-5547-4fc9-a96e-7cc1588dc363

## 🎥 connecting the LLM to the model database

https://github.com/user-attachments/assets/33418e31-9dfe-48a0-a0ca-649e58eeef0e

## clone it!

```
git clone https://github.com/tmarti/talk-to-me-bim
```

## configure it!

Edit `src/agents/agent.ts` and insert your openAI API key:

```ts
// Insert here your openai API key
export const openAIApiKey = '{your-key-here}';
```

## install it!

```
npm ci
```

## run it!

```
npm run dev
```

Now you can navigate to [http://localhost:5173/](http://localhost:5173/)


## Set up frontend
1. go to the frontend and install node dependencies by running these commands:
```bash
cd frontend
pnpm install
```

2. create a `.env` file under the `frontend` root directory and add these variables:
```text
ELASTICSEARCH_API_KEY="..."
KIBANA_URL=...
NEXT_PUBLIC_ELASTICSEARCH_URL=...
FASTAPI_URL=... # set it to http://localhost:8000 for development
```
*refer to `@/frontend/.env.example`*

3. run the UI using the command:
```bash
pnpm run dev
```

## Folder Structure
```
└── frontend
    └── public
        ├── file.svg
        ├── globe.svg
        ├── next.svg
        ├── vercel.svg
        ├── window.svg
    └── src
        └── app
            └── api
                └── agent_builder
                    └── conversations
                        └── [conversation_id]
                            ├── route.ts
                        ├── route.ts
                └── agent-chat
                    ├── route.ts
            ├── favicon.ico
            ├── globals.css
            ├── layout.tsx
            ├── page.tsx
        └── components
            └── ui
                ├── badge.tsx
                ├── button.tsx
                ├── card.tsx
                ├── dialog.tsx
                ├── input.tsx
                ├── scroll-area.tsx
                ├── select.tsx
                ├── separator.tsx
            ├── AgentChat.tsx
        └── lib
            ├── utils.ts
        └── services
            ├── api.ts
    ├── .gitignore
    ├── components.json
    ├── eslint.config.mjs
    ├── FRONTEND.md
    ├── next.config.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml
    ├── postcss.config.mjs
    ├── README.md
    └── tsconfig.json
```
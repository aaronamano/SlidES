# Summary
As a college student, I use lecture slides to study because most of my professors use them to teach, but I face multiple problems. The first problem was that there was no centralized place to store slides. Often, I would download lecture slides, and it would get stored with other files and documents in my local computer, which becomes messy and disorganized. The other problem was that manual searching and scrolling was time-consuming. Whenever I needed to look for certain information, I had to search and scroll through multiple slides, which killed a lot of time. This is why I created SlidES, a platform to organize your lecture slides in a singular place and leverage the SlidES agent to search for information you need that would take countless hours for a human to do. 

There are many features that I implemented in SlidES. A primary feature I implemented was uploading slides as PDF files, extracting its text, and storing them using ElasticSearch’s index database. Under the hood I used the Elser Pipeline to embed the PDF file’s extracted text into sparse vectors. Another notable feature I implemented was a chat interface to interact with my own SlidES Agent that I built using ElasticSearch’s Agent Builder through the Kibana API. My SlidES Agent had two main roles, generate notes and answer questions, by searching through the user’s uploaded slides using ElasticSearch’s built-in agent tools, mainly the platform.core.search tool. There were also minor features such as viewing conversation history while asking follow up questions, creating notes and folders, creating courses, especially adding the Agent’s response into your notes.

I enjoyed using the ElasticSearch Agent Builder where I was able to create my agent with full control and give it prompts. I also liked how I was able to interact and test my agent in ElasticSearch’s interface, and I enjoyed using their built-in tools because it was easy to use and plug in for my agent. Additionally, I enjoyed using the Kibana API since it helped interact with my ElasticSearch agent, and I was able to create a UI from it.

# Overview 
1. Follow the instructions on how to set up the frontend and backend in the README files:
[Frontend Instructions](frontend/FRONTEND.md)
[Backend Instructions](backend/BACKEND.md)

2. You can see all information related to ElasticSearch such as Agent Prompt, Mappings, etc. under the folder directory `@/backend/elastic-search`:
```
└── elastic-search
    ├── courses-init.py # courses index mapping
    ├── lecture-slides-init.py # lecture slides index mapping
    ├── notes-folders-init.py # notes and folders mappings
    ├── PIPELINE.md # pipeline to converting text to sparse vectors
    ├── RESULT.md # example json response via Kibana API
    ├── SCHEMA.md # mappings of the ES index databases
    ├── SLIDES_AGENT.md # slides agent outline of the prompt, name, and description
    ├── TEST.md
    └── TEST2.md
```

3. Note that to test the application on development, run the backend and the frontend simultaneously in separate terminals

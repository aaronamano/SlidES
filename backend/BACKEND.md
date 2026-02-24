## Set up backend

1. go to the backend, create a conda environment, and install pip dependencies in the conda environment by running these commands:

```bash
cd backend
conda create -n slides-env -y python=3.14
conda activate slides-env
pip install -r requirements.txt
```

2. create a `.env` file under the `backend` root directory and add these variables:

```text
ELASTICSEARCH_URL=...
ELASTICSEARCH_API_KEY="..."
KIBANA_URL=...
```
*refer to `@/backend/.env.example`*

3. run the API in the conda environment using these commands:

```bash
conda activate slides-env
python main.py
```

## Folder Structure

```
└── backend
    └── elastic-search
        ├── courses-init.py
        ├── lecture-slides-init.py
        ├── notes-folders-init.py
        ├── PIPELINE.md
        ├── RESULT.md
        ├── SLIDES_AGENT.md
    ├── .env.example
    ├── .gitignore
    ├── BACKEND.md
    ├── course_service.py
    ├── folder_service.py
    ├── main.py
    ├── note_service.py
    └── requirements.txt
```

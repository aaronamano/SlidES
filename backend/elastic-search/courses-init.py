from elasticsearch import Elasticsearch
from dotenv import load_dotenv
import os

load_dotenv()

client = Elasticsearch(
    str(os.getenv('ELASTICSEARCH_URL')),
    api_key=str(os.getenv('ELASTICSEARCH_API_KEY'))
)

index_name = "courses-index"

mappings = {
    "properties": {
        "course_id": { "type": "keyword" },
        "course_name": { "type": "text" }
    }
}

if not client.indices.exists(index=index_name):
    client.indices.create(index=index_name)
    client.indices.put_mapping(index=index_name, body=mappings)
    print(f"Created index: {index_name}")
else:
    print(f"Index {index_name} already exists")

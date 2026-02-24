Lecture Slides Index

```json
{
  "course_id": { "type": "keyword" },
  "filename": { "type": "keyword" },
  "title": { "type": "text" },
  "text_content": { "type": "text" },
  "text_embedding": { "type": "sparse_vector" },
  "pdf_binary": {
      "type": "binary",
      "store": True,
      "doc_values": False
  },
  "pdf_size": { "type": "long" },
  "has_binary": { "type": "boolean" }
}
```

Notes Index

```json
{
  "title": { "type": "text", "fields": { "keyword": { "type": "keyword" } } },
  "notes": { "type": "text" },
  "folder_id": { "type": "keyword" },
  "created_at": { "type": "date" },
  "updated_at": { "type": "date" }
}
```

Folders Index

```json
{
  "folder_name": { "type": "text", "fields": { "keyword": { "type": "keyword" } } },
  "created_at": { "type": "date" },
  "updated_at": { "type": "date" }
}
```

Courses Index

```json
{
  "course_id": { "type": "keyword" },
  "course_name": { "type": "text" }
}
```
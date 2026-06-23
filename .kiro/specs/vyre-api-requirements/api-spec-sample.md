# Vyre API Specification — Sample

---

## R20 — Create Journal Entry

### Endpoint

```
Method - POST /api/journals
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

| Field         | Type       | Required    |
|---------------|------------|-------------|
| `title`       | `string`   | No          |
| `notes`       | `string`   | No          |
| `mood`        | `enum`     | Yes         |
| `entryType`   | `enum`     | Yes         |
| `activities`  | `string[]` | Yes         |
| `feelings`    | `string[]` | Yes         |
| `audioUrl`    | `string`   | Conditional |
| `imageUrls`   | `string[]` | Conditional |
| `scribbleUrl` | `string`   | Conditional |

---

### Request Examples

**Text entry**
```json
{
  "title": "Productive afternoon",
  "notes": "Finished the onboarding flow and felt really accomplished.",
  "mood": "happy",
  "entryType": "text",
  "activities": ["work"],
  "feelings": ["thankful", "blissed"]
}
```

**Audio entry** *(required when entryType is `audio`)*
```json
{
  "title": "Morning thoughts",
  "notes": "",
  "mood": "sad",
  "entryType": "audio",
  "activities": ["jogging"],
  "feelings": ["eccentric"],
  "audioUrl": "https://cdn.vyre.app/media/audio/abc123.mp4"
}
```

**Gallery entry** *(required when entryType is `gallery`)*
```json
{
  "title": "Weekend vibes",
  "notes": "Spent the day outdoors, took some great shots.",
  "mood": "happy",
  "entryType": "gallery",
  "activities": ["pet"],
  "feelings": ["blissed"],
  "imageUrls": [
    "https://cdn.vyre.app/media/images/img001.jpg",
    "https://cdn.vyre.app/media/images/img002.jpg"
  ]
}
```

**Scribble entry** *(required when entryType is `scribble`)*
```json
{
  "title": "Mind map",
  "notes": "Drew out how I was feeling today.",
  "mood": "confused",
  "entryType": "scribble",
  "activities": ["work"],
  "feelings": ["obscure"],
  "scribbleUrl": "https://cdn.vyre.app/media/scribble/scr456.png"
}
```

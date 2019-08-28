# Streaming Video Provider :: Delete Videos From Playlist

Integration with stream video provider:

1. Endpoints:
    - Get all playlists
    - Get single playlist
    - Get single video
    - Delete single video
2. Hooks:
    - [Delete_old_videos](https://api-node.breatheco.de/streaming/hook/delete_old_videos)

## 👀 Get all the playlists

Devuelve json de todos los playlist existentes y su informacion

```json
    `GET` /playlists

    RESPONSE:

    "response": {
        "result": ["OK"],
        "count": ["26"],
        "video_playlists": [
            {
                "video_playlist": [
                {
                    "ref_no": ["146965"],
                    "title": ["Santiago PT 1"]
                },
                ...
                ]
            }
        ]
    }
```

## 👀 Get a particular playlist

Devuelve json del playlist existente y todos los videos relacionados

```
    `GET` /playlists/:channel_ref
```

## 👀 Get all playlist videos

Devuelve json del playlist existente y todos los videos relacionados que tengan mas de N dias creados por defecto es 1*

```
    GET /playlists/:channel_ref?days_old=1
```

## 🗑 Delete a particular video

Elimina todos los videos pasados como referencia separados por coma*

```js
    `DELETE` /playlists/video/:video_ref
```

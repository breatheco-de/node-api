# Streaming Video Provider :: Delete Videos From Playlist

## `GET` /playlists

Devuelve json de todos los playlist existentes y su informacion

```js
    fetch("https://video-list-api.ljavierrodriguez.now.sh/playlists")
        .then(resp => resp.json)
        .then(data => console.log(data))
        .catch(error => console.log(error));
```

## `GET` /playlists/:channel_ref

Devuelve json del playlist existente y todos los videos relacionados

```
    fetch("https://video-list-api.ljavierrodriguez.now.sh/playlists")
        .then(resp => resp.json)
        .then(data => console.log(data))
        .catch(error => console.log(error));
```

## `GET` Get playlist videos

Devuelve json del playlist existente y todos los videos relacionados que tengan mas de N dias creados por defecto es 1*

```
    GET /playlists/:channel_ref?days_old=1
```

## `DELETE` /playlists/video/:video_ref

Elimina todos los videos pasados como referencia separados por coma*

```js
    fetch("https://video-list-api.ljavierrodriguez.now.sh/playlists/video/1,2,3")
        .then(resp => resp.json)
        .then(data => console.log(data))
        .catch(error => console.log(error));
```
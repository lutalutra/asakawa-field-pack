# ASAKAWA Field Pack

Faultier Commons / Namakemono Commons prototype.

This is a static HTML + CSS + JavaScript demo that reproduces the current ASAKAWA Field Pack mockup:

- HOME
- LIST
- Sound
- Sound-Info
- Mapping
- Mapping with bottom sheet

## File structure

```txt
asakawa-field-pack/
├── index.html
├── style.css
├── app.js
├── data/
│   ├── field.json
│   ├── species.json
│   ├── landscapes.json
│   └── today.json
├── assets/
│   ├── images/
│   ├── audio/
│   └── icons/
└── README.md
```

## How to run locally

Because the app loads JSON with `fetch()`, open it through a local server.

```bash
python3 -m http.server 8000
```

Then open:

```txt
http://localhost:8000
```

## GitHub Pages

1. Create a new GitHub repository.
2. Upload all files in this folder.
3. Go to **Settings → Pages**.
4. Set source to **Deploy from a branch**.
5. Choose `main` and `/root`.
6. Save.

## Editing the Field Pack

Change the field title, date, time, and location in:

```txt
data/field.json
```

Add or edit species in:

```txt
data/species.json
```

Add or edit landscape units in:

```txt
data/landscapes.json
```

Control what appears on the HOME screen in:

```txt
data/today.json
```

## Notes

This version uses local SVG placeholders and a blank MP3 placeholder. Replace these with real open-license images and audio files when ready.

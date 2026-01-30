
# WordPress Docker Starter

Questo progetto usa Docker per sviluppare un tema WordPress.

## Come iniziare

1. Copia il file `.env.example` e rinominalo in `.env`
2. lancia l'app di docker
3. Avvia i container:
```bash
docker-compose up -d
```
4. Visita `http://localhost:8000` per completare l'installazione di WordPress.
5. Installa composer e le sue dipendenze: da ficus: `docker run --rm -v $(pwd):/app composer:latest install`
6. Dalla cartella del tema indica la versione di node che ti interessa:
```bash
nvm use
```
8. Sempre dalla cartella del tema lancia l'installazione dei pacchetti necessari al frontend
```bash
npm install
```
9. Sempre dalla cartella del tema lancia vite per farlo partire runtime (vedi riferimenti in package json)
```bash
npm run dev
```
## Struttura

- `docker-compose.yml`: setup base di WP + MySQL
- `.env`: variabili d’ambiente
- `ficus/`: il tuo tema custom
- `db-data/`: dati del database (non versionati)

## Caratteristiche del tema WP
- templating in twig
- dipendenze php (in particolare twig) gestite con __composer__
- dipendenze frontend gestite con __npm__
- gestione frontend in __vite__
- stili in _.scss_, scripts in _.ts_

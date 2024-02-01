## Setup

### Backend Setup

1. Cd into the backend directory

```
cd todolist-backend
```

2. run postgresql server

```
docker compose up -d go_db
```

3. Build the main docker image

```
docker compose build
```

4. Run the Application

```
docker compose up go-app
```

### Frontend Setup

1. Cd into the frontend directory

```
cd todo-frontend
```

2. Install dependencies

```
npm install
```

3. Run the Application

```
npm run dev
```

# Dev Insights Emotimonitor Dashboard

This repo contains the NextJS app for observing the data submitted through emotimonitor (currently developed plugin for [Trello](https://github.com/dev-insights-development-team/emotimonitor-trello) with opportunity to expand to Jira). The dashboard displays the data using emotion summary graphs as well as a holistic metric graph. It is also used to configure the plugin. Please read below for instructions on how to develop on the repo.

## To set up local developing environment

Install docker https://docs.docker.com/get-docker/

Add a .env file in the root directory

```env
DATABASE_URL="postgresql://dev_team:secret@localhost:5432/dev_insights"
```

Run

```bash
npm install
makefile all
```

Make changes in prisma/schema.prisma as needed. For prisma client to recognise the changes and preserve them, run

```bash
npx prisma migrate dev
```

To restart your docker db run

```bash
make reset
```

## Getting started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

For config page you can modify `pages/config.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Testing

This repo is using playwright for end to end testing using a built version of the app and your running db in docker.

The code will first need to be built:
```bash
npm run build
```

Then to run the tests:

```bash
npm run test:e2e
```

## Deployment
This app is deployed using Netlify.

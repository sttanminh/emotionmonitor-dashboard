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

To run the tests run:

```bash
npm run test:e2e
```

To run a specific test run:

```bash
npm run test:e2e path/to/file.ts:lineNumber
```

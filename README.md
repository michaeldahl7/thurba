Repo where I am learning and refining my skills in the following technologies:

- Turborepo
- Tanstack Router
- Tanstack Query
- React
- Drizzle ORM
- Hono
- Postgres
- NodeJS
- TypeScript
- Tailwind CSS
- Shadcn UI
- Lucia
- Biome
- GitHub Actions


Shoutout to the following open source projects that inspired this repo: \
-- create-t3-turbo https://github.com/t3-oss/create-t3-turbo \
-- wdc-saas-starter-kit https://github.com/t3-oss/wdc-saas-starter-kit \
-- cloudflare-saas-stack https://github.com/t3-oss/cloudflare-saas-stack

To get it running, follow the steps below:

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Drizzle schema to the database
pnpm db:push
```


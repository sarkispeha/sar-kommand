This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Run the Docker container

Then run the database locally:

```bash
npm run start:db
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Next.js resources:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API.

## Deploy on Vercel

[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

[Next.js deployment documentation](https://nextjs.org/docs/deployment)

## Notes

## Troubleshooting

- if server action data is throwing a type error, be sure to run `npm run prisma:migrate:local` as the schema may have changed. Also run this command whenever making changes to the API payloads.

#This is a hackernews clone created via howtographql.com

###DB setup
npx prisma migrate save --experimental
npx prisma migrate up --experimental
npx prisma generate

###To open Prisma Studio
npx prisma studio --experimental

//import PrismaClient constructor from the node module
const { PrismaClient } = require("@prisma/client");

//instantiate PrismaClient
const prisma = new PrismaClient();

//function that sends queries to the db, all gueries go inside this function
async function main() {
  const newLink = await prisma.link.create({
    data: {
      description: "Fullstack tutorial for GraphQL",
      url: "www.howtographql.com",
    },
  });

  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}
prisma.link.delete()
//call main function
main()
  .catch((e) => {
    throw e;
  })
  //clase db connection
  .finally(async () => {
    await prisma.disconnect();
  });

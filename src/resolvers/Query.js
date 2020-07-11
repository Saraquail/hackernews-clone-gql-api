//every GraphQL resolver function actually receives four input arguments

async function feed(parent, args, context, info) {
  const where = args.filter 
  ? {
    OR: [
      //filters data
      { description: {contains: args.filter } },
      { url: { contains: args.filter } },
    ],
  }
  : {}

  const links = await context.prisma.link.findMany({
    where,
    //limits data
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  });

  const count = await context.prisma.link.count({
    where
  })

  return {
    links,
    count,
  } 
}

const data = [
  {
  id: 001, 
  agency: "Mern",
  sponsors:  ["a", "b", "c"],
  date: 20200701
  }
]

function publication(parent, args, context) {
  return data
}

module.exports = {
  feed, publication
};

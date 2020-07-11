//every GraphQL resolver function actually receives four input arguments

function feed(parent, args, context, info) {
  return context.prisma.link.findMany();
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

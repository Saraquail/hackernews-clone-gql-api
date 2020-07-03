const { GraphQLServer } = require("graphql-yoga");

//used to store links at runtime in memory
let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

//simple way to implement unique IDs
let idCount = links.length;

// implementation of GQL schema
//every GraphQL resolver function actually receives four input arguments
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    //notide that resolvers must be named after correspoinding field from schema definition
    feed: () => links,
    // link: (id) => links.find(link => link.id === id)
  },
  Mutation: {
    // implements post. creates new link, adds to links, returns new link
    //args contains the values sent by the query
    createPost: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      parent.description = args.description,
      parent.url = args.url
      return parent
    }
  },
  // //resolvers for Link type aren't needed bc GraphQL server infers this information in the following way
  // Link: {
  //   //parent(or root) is the first of the 4 arguments and is the result of the previous resolver execution level
  //   //in this case links from the Query resolver
  //   id: (parent) => parent.id,
  //   description: (parent) => parent.description,
  //   url: (parent) => parent.url,
  // }
};

// This tells the server what API operations are accepted and how they should be resolved.
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`));

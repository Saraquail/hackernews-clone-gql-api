const { GraphQLServer } = require('graphql-yoga')

// defines GraphQL schema
const typeDefs = 
` type Query {
  info: String!
  feed: [Link!]!
}

type Link {
  id: ID!
  description: String!
  url: String!
}
`

//used to store links at runtime in memory
let links =[{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

// implementation of GQL schema
//every GraphQL resolver function actually receives four input arguments
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    //notide that resolvers must be named after correspoinding field from schema definition
    feed: () => links,
  },
  //resolvers for Link type
  Link: {
    //parent(or root) is the first of the 4 arguments and is the result of the previous resolver execution level
    //in this case links from the Query resolver
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  }
}

// This tells the server what API operations are accepted and how they should be resolved.
const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
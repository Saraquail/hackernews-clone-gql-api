const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  //encrypt user password
  const password = await bcrypt.hash(args.password, 10);

  //store new user in db
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  //generate jwt token
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  //retrieve user via email
  const user = await context.prisma.user.findOne({
    where: {
      email: args.email,
    },
  });
  //if user not in db, return error
  if (!user) {
    throw new Error("No such user found");
  }

  //compare provided password to password in db
  const valid = await bcrypt.compare(args.password, user.password);
  // if passwords don't match, return error
  if (!valid) {
    throw new Error("Invalid Password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

// implements post. creates new link, adds to links, returns new link
//args contains the values sent by the query
function createLink(parent, args, context, info) {
  const userId = getUserId(context);

  const newLink = context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
  context.pubsub.publish("NEW_LINK", newLink);

  return newLink;
}

function updateLink(parent, args, context, info) {
  const link = context.prisma.link.update({
    where: {
      id: parseInt(args.id),
    },
    data: {
      description: args.description,
      url: args.url,
    },
  });
  return link;
}

function deleteLink(parent, args, context, info) {
  const link = context.prisma.link.delete({
    where: {
      id: parseInt(args.id),
    },
  });
  return link;
}

async function vote(parent, args, context, info) {
  //validate user
  const userId = getUserId(context)

  //check if this vote already exists
  const vote = await context.prisma.vote.findOne({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId
      }
    }
  })
  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`)
  }

  //creates new vote and connects the user and link
  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    }
  })
  context.pubsub.publish("NEW_VOTE", newVote)

  return newVote
}

// //resolvers for Link type aren't needed if there are no relations to another table bc GraphQL server infers this information in the following way
// Link: {
//   //parent(or root) is the first of the 4 arguments and is the result of the previous resolver execution level
//   //in this case links from the Query resolver
//   id: (parent) => parent.id,
//   description: (parent) => parent.description,
//   url: (parent) => parent.url,
// }

module.exports = {
  signup,
  login,
  createLink,
  updateLink,
  deleteLink,
  vote
};

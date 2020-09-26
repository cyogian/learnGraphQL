const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

const post = async (parent, args, context, info) => {
  const userId = getUserId(context);
  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
  context.pubsub.publish("NEW_LINK", newLink);
  return newLink;
};

const updateLink = async (parent, args, context, info) => {
  const userId = getUserId(context);
  const link = await context.prisma.link.findOne({
    where: {
      id: parseInt(args.id),
    },
  });
  if (!link) {
    throw new Error("No such link found");
  }

  if (link.userId != userId) {
    throw new Error("Current User is not Authorized to make this change.");
  }

  const updatedLink = {};
  if (args.description) updatedLink.description = args.description;
  if (args.url) updatedLink.url = args.url;

  return await context.prisma.link.update({
    where: { id: parseInt(args.id) },
    data: updatedLink,
  });
};

const deleteLink = async (parent, args, context, info) => {
  const userId = getUserId(context);
  const link = await context.prisma.link.findOne({
    where: {
      id: parseInt(args.id),
    },
  });
  if (!link) {
    throw new Error("No such link found");
  }
  if (link.userId != userId) {
    throw new Error("Current User is not Authorized to make this change.");
  }
  return await context.prisma.link.delete({
    where: {
      id: parseInt(args.id),
    },
  });
};

const signup = async (parent, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

const login = async (parent, args, context, info) => {
  const user = await context.prisma.user.findOne({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

const vote = async (parent, args, context, info) => {
  const userId = getUserId(context);

  const vote = await context.prisma.vote.findOne({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });
  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
};

const Mutation = {
  post,
  updateLink,
  deleteLink,
  login,
  signup,
  vote,
};

module.exports = Mutation;

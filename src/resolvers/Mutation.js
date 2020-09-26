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
    throw new Error("No such user found");
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
    throw new Error("No such user found");
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

const Mutation = {
  post: post,
  updateLink: updateLink,
  deleteLink: deleteLink,
  login: login,
  signup: signup,
};

module.exports = Mutation;

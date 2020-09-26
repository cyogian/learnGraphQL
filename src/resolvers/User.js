const links = (parent, args, context) => {
  return context.prisma.user.findOne({ where: { id: parent.id } }).links();
};

const votes = (parent, args, context) => {
  return context.prisma.user.findOne({ where: { id: parent.id } }).votes();
};
const User = {
  id: (parent) => parent.id,
  name: (parent) => parent.name,
  email: (parent) => parent.email,
  links,
  votes,
};

module.exports = User;

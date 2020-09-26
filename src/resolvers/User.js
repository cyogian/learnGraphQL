const links = (parent, args, context) => {
  return context.prisma.user.findOne({ where: { id: parent.id } }).links();
};

const User = {
  id: (parent) => parent.id,
  name: (parent) => parent.name,
  email: (parent) => parent.email,
  links: links,
};

module.exports = User;

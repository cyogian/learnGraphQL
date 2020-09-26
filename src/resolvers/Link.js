const postedBy = (parent, args, context) => {
  return context.prisma.link.findOne({ where: { id: parent.id } }).postedBy();
};

const Link = {
  id: (parent) => parent.id,
  description: (parent) => parent.description,
  url: (parent) => parent.url,
  postedBy: postedBy,
};

module.exports = Link;

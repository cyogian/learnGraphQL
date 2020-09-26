const feed = async (parent, args, context, info) => {
  const Links = await context.prisma.link.findMany();
  return Links;
};
const link = async (parent, args, context, info) => {
  const Link = await context.prisma.link.findOne({
    where: {
      id: int(args.id),
    },
  });
  if (!Link) {
    throw new Error("No such link found");
  }
  return Link;
};

const Query = {
  info: () => `This is the API of a HackerNews Clone`,
  feed: feed,
  link: link,
};

module.exports = Query;

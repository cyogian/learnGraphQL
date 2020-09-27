const feed = async (parent, args, context, info) => {
  const where = args.filter
    ? {
        OR: [
          {
            description: { contains: args.filter },
          },
          {
            url: { contains: args.filter },
          },
        ],
      }
    : {};
  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  });
  const count = await context.prisma.link.count({ where });
  return { links, count };
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

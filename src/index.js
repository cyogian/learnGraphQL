const { GraphQLServer } = require("graphql-yoga");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a HackerNews Clone`,
    feed: () => links,
    link: (parent, args) => {
      const index = links.findIndex((link) => link.id === args.id);
      if (index >= 0) return links[index];
      return null;
    },
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        url: args.url,
        description: args.description,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      const link = links.filter((l) => l.id === args.id)[0];
      if (args.description) link.description = args.description;
      if (args.url) link.url = args.url;
      return link;
    },
    deleteLink: (parent, args) => {
      let link = null;
      links = links.filter((l) => {
        if (l.id === args.id) {
          link = l;
          return false;
        } else {
          return true;
        }
      });
      return link;
    },
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
});
server.start(() => console.log(`Server is running on http://localhost:4000`));

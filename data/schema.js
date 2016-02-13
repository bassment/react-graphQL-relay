import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';

const Schema = database => {
  const linkType = new GraphQLObjectType({
    name: 'Link',
    fields: () => ({
      _id: {type: GraphQLString},
      title: {type: GraphQLString},
      url: {type: GraphQLString}
    })
  });

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: () => ({
        links: {
          type: new GraphQLList(linkType),
          resolve: () => database.collection('links').find({}).toArray()
        }
      })
    })
  });

  return schema;
};

export default Schema;

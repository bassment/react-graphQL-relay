import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import {
  globalIdField,
  fromGlobalId,
  nodeDefinitions,
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray,
  mutationWithClientMutationId
} from 'graphql-relay';

const Schema = database => {
  class Store {}
  const store = new Store();

  const nodeDefs = nodeDefinitions(
    globalId => {
      let {type} = fromGlobalId(globalId);
      if (type === 'Store') {
        return store;
      }
      return null;
    },
    obj => {
      if (obj instanceof Store) {
        return storeType;
      }
      return null;
    }
  );

  const linkType = new GraphQLObjectType({
    name: 'Link',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLID),
        resolve: obj => obj._id
      },
      title: {type: GraphQLString},
      url: {type: GraphQLString},
      createdAt: {
        type: GraphQLString,
        resolve: obj => new Date(obj.createdAt).toISOString()
      }
    })
  });

  const linkConnection = connectionDefinitions({
    name: 'Link',
    nodeType: linkType
  });

  const storeType = new GraphQLObjectType({
    name: 'Store',
    fields: () => ({
      id: globalIdField('Store'),
      linkConnection: {
        type: linkConnection.connectionType,
        args: {
          ...connectionArgs,
          query: {type: GraphQLString}
        },
        resolve: (_, args) => {
          const findParams = {};
          if (args.query) {
            findParams.title = new RegExp(args.query, 'i');
          }
          return connectionFromPromisedArray(
            database.collection('links')
              .find(findParams)
              .sort({createdAt: -1})
              .limit(args.first).toArray(),
            args
          );
        }
      }
    }),
    interfaces: [nodeDefs.nodeInterface]
  });

  const createMutationLink = mutationWithClientMutationId({
    name: 'CreateLink',

    inputFields: {
      title: {type: new GraphQLNonNull(GraphQLString)},
      url: {type: new GraphQLNonNull(GraphQLString)}
    },

    outputFields: {
      linkEdge: {
        type: linkConnection.edgeType,
        resolve: obj => ({node: obj.ops[0], cursor: obj.insertedId})
      },
      store: {
        type: storeType,
        resolve: () => store
      }
    },
    mutateAndGetPayload: ({title, url}) => {
      return database.collection('links').insertOne({
        title,
        url,
        createdAt: Date.now()
      });
    }
  });

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: () => ({
        node: nodeDefs.nodeField,
        store: {
          type: storeType,
          resolve: () => store
        }
      })
    }),

    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: () => ({
        createLink: createMutationLink
      })
    })
  });

  return schema;
};

export default Schema;

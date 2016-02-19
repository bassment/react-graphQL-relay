import fs from 'fs';
import express from 'express';
import importedSchema from './data/schema';
import graphqlHTTP from 'express-graphql';
import {graphql} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';
import {MongoClient} from 'mongodb';

let app = express();
app.use(express.static('public'));

(async () => {
  const database = await MongoClient.connect(process.env.MONGO_URL);
  const schema = importedSchema(database);

  app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
  }));

  app.listen(3000, () => console.log('Server running at port 3000...'));

  const json = await graphql(schema, introspectionQuery);
  fs.writeFile('./data/schema.json', JSON.stringify(json, null, 2), err => {
    if (err) {
      throw err;
    }

    console.log('JSON schema created');
  });
})();

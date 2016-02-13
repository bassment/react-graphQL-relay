import express from 'express';
import schema from './data/schema';
import graphqlHTTP from 'express-graphql';
import {MongoClient} from 'mongodb';

let app = express();
app.use(express.static('public'));

MongoClient.connect(process.env.MONGO_URL, (err, database) => {
  if (err) {
    throw err;
  }

  app.use('/graphql', graphqlHTTP({
    schema: schema(database),
    graphiql: true
  }));

  app.listen(3000, () => console.log('Server running at port 3000...'));
});

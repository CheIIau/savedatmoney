import express from 'express';
import path from 'path';
import cors from 'cors';
import history from 'connect-history-api-fallback';
import 'dotenv/config';
import { connect } from 'mongoose';
import { graphqlHTTP } from 'express-graphql';
import { Schema } from './server/schema';
import { router } from './server/routes';
import { mongoUri } from './server/constants';
const app = express();

const port = process.env.PORT || 3000;
app.set('port', port);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', router);
app.use('/graphql', graphqlHTTP({ schema: Schema, graphiql: true }));

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

app.use(history());

app.use(express.static(path.join(__dirname, 'dist/spa')));
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/spa/index.html');
});

async function start() {
  try {
    await connect(mongoUri!);
    console.log('succesfully connected to DB');
  } catch (e) {
    console.log('Server Error', e);
    process.exit(1);
  }
}

start().catch((e) => {
  console.log(e);
});

const express = require('express');
const { createServer } = require('http');
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const { ApolloServer, PubSub } = require('apollo-server-express');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

const pubsub = new PubSub();

const app = express();
const PORT = process.env.PORT || 3001;

const httpServer = createServer(app);

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    context: authMiddleware
});

// unsure of this switch but could potential make subscriptions work cleaner to change path to /subscriptions for the subscription server?
const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: '/subscriptions' }
)

const server = new ApolloServer({
    schema,
    plugins: [
        {
            async serverWillStart(){
                return{
                    async drainServer() {
                        subscriptionServer.close();
                    }
                };
            }
        }
    ],
    context: () => {
        return { pubsub };
    },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const startApolloServer = async () => {
    await server.start();
    server.applyMiddleware({ app });

    db.once('open', () => {
        httpServer.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        });
    });
};

startApolloServer();
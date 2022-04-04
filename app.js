"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const cors_1 = (0, tslib_1.__importDefault)(require("cors"));
const connect_history_api_fallback_1 = (0, tslib_1.__importDefault)(require("connect-history-api-fallback"));
const mongoose_1 = require("mongoose");
const express_graphql_1 = require("express-graphql");
const schema_1 = require("./server/schema");
const routes_1 = require("./server/routes");
const constants_1 = require("./server/constants");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.set('port', port);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/auth', routes_1.router);
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({ schema: schema_1.Schema, graphiql: true }));
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
app.use((0, connect_history_api_fallback_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'dist/spa')));
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/spa/index.html');
});
async function start() {
    try {
        await (0, mongoose_1.connect)(constants_1.mongoUri);
        console.log('succesfully connected to DB');
    }
    catch (e) {
        console.log('Server Error', e);
        process.exit(1);
    }
}
start().catch((e) => {
    console.log(e);
});
//# sourceMappingURL=app.js.map
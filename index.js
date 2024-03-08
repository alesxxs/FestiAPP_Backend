const { ApolloServer, AuthenticationError } = require("apollo-server")
const typeDefs = require("./db/schema")
const resolvers = require("./db/resolvers")
const DB_CONNECTION = require("./config/db")
const jwt = require("jsonwebtoken")
require("dotenv").config({ path: "var.env" })

DB_CONNECTION();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers["authorization"] || "";

        if(token) {
            try {
                const user = jwt.verify(token, process.env.SECRET)
                return { user }
            } catch (error) {
                console.log(error)
            }
        } 
    }
})


server.listen().then(({ url }) => {
    console.log(`Server already on server: ${url}`)
})
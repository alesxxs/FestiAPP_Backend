const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID
    name: String
    email: String
    created: String
  }

  type Token {
    token: String
  }

  type GeneralFest {
    id: ID!
    name: String!
    initialDate: String
    image: String
    contentType: String
    isTicketMaster: Boolean
    userID: ID
    country: String
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  input AuthenticateInput {
    email: String!
    password: String!
  }

  input generalFestInput {
    name: String!
    initialDate: String
    image: String
    contentType: String
    isTicketMaster: Boolean
    userID: ID!
    country: String
  }

  type Query {
    # Users

    getUser(token: String!): User

    # General Festivals

    getGeneralFest(id: ID!): [GeneralFest]
  }

  type Mutation {
    # Users

    createUser(input: UserInput): User
    authenticateUser(input: AuthenticateInput): Token

    # General Festivals

    createGeneralFest(input: generalFestInput): GeneralFest
  }
`;

module.exports = typeDefs;

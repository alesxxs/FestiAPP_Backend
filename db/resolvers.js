const { AuthenticationError } = require("apollo-server");
const User = require("../models/User");
const GeneralFest = require("../models/GeneralFest");

const bcryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "var.env" });

const createToken = (user, secret, expiresIn) => {
  const { id, email, name } = user;

  return jwt.sign({ id, email, name }, secret, { expiresIn });
};

const resolvers = {
  Query: {
    getUser: async (_, { token }, ctx) => {

      const { user } = ctx;

      if (!user) {
        throw new AuthenticationError("User doesn't have credencials to execute queries");
      }

      // Con esta funcion se revisa que el token sea valido // se tiene que ejecutar cada que se quiera entrar a una vista privada
      const userId = await jwt.verify(token, process.env.SECRET);

      return userId;
    },
    getGeneralFest: async (_, { id }, ctx) => {

      const { user } = ctx;

      if (!user) {
        throw new AuthenticationError("User doesn't have credencials to execute queries");
      }

      const festivalExist = await GeneralFest.find({ userID: id });

      return festivalExist;
    },
  },
  Mutation: {
    createUser: async (_, { input }) => {
      const { email, password } = input;

      const userExist = await User.findOne({ email });

      if (userExist) {
        throw new Error("User already exist.");
      }

      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      try {
        const user = new User(input);
        user.save();
        return user;
      } catch (error) {
        console.error(error);
      }
    },
    authenticateUser: async (_, { input }) => {
      const { email, password } = input;

      const userExist = await User.findOne({ email });
      if (!userExist) {
        throw new Error("Email is not registered");
      }

      const correctPass = await bcryptjs.compare(password, userExist.password);

      if (!correctPass) {
        throw new Error("Password incorrect");
      }

      return {
        token: createToken(userExist, process.env.SECRET, "24h"),
      };
    },
    createGeneralFest: (_, { input }, ctx) => {
      const { name, userID, image, isTicketMaster } = input;

      const { user } = ctx;

      if (!user) {
        throw new AuthenticationError("User doesn't have credencials to execute mutations");
      }

      if (!name || !userID) {
        throw new Error("You have to complete the obligatory fields");
      }

      // pass image to base64 (data is image)
      // data: data.toString('base64'),

      try {
        // console.log({...input, image: image.toString('base64')});

        const fest = new GeneralFest(isTicketMaster ? input : {...input, image: image.toString('base64')});
        fest.save();

        return fest;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = resolvers;

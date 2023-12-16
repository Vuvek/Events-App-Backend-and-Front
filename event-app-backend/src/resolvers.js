import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./db/modals/User.js";
import Event from "./db/modals/Events.js";


const resolvers = {
  Query: {
    users: async () => await User.find({}),
    ievent: async (_, { by }) => await Event.find({ by }),
  },

  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await User.findOne({ email: userNew.email });
      if (user) {
        throw new Error("User already exists with that email");
      }
      const hashedPassword = await bcrypt.hash(userNew.password, 12);

      const newUser = new User({
        ...userNew,
        password: hashedPassword,
      });
      return await newUser.save();
    },

    signinUser: async (_, { userSignin }) => {
      const user = await User.findOne({ email: userSignin.email });
      if (!user) {
        throw new Error("User dosent exists with that email");
      }
      const doMatch = await bcrypt.compare(userSignin.password, user.password);
      if (!doMatch) {
        throw new Error("email or password in invalid");
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      console.log({ token, user }, "helladfjlasdkjf");
      return { token, user };
    },

    createEvent: async (_, { event }, { userId }) => {
      if (!userId) throw new Error("You must be logged in");
      const newQuote = new Event({ ...event, by: userId });
      await newQuote.save();
      return "Event saved successfully";
    },
  },
};

export default resolvers;

import mongoose from "mongoose";

import { MONGODB_URI } from "./config";

export default async () => {
  const connection = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return connection.connection.db;
};

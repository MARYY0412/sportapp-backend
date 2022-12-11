const mongoose = require("mongoose");

const bikeActivitySchema = new mongoose.Schema(
  {
    id: String,
    timeOfActivity: String,
    distanceOfActivity: String,
    dateOfActivity: String,
    speedOfActivity: String,
  },
  {
    collection: "bikeActivities",
  }
);

mongoose.model("bikeActivities", bikeActivitySchema);

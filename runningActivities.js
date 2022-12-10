const mongoose = require("mongoose");

const runningActivitySchema = new mongoose.Schema(
  {
    id: String,
    timeOfActivity: String,
    distanceOfActivity: String,
    dateOfActivity: String,
  },
  {
    collection: "runningActivities",
  }
);

mongoose.model("runningActivities", runningActivitySchema);

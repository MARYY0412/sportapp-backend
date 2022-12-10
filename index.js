const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
//mongo db
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
//token do logowania
const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "adsodnaiubu%&@#$^&RRT^##$S135DSF$%2432434@SfSFsfeww324fwf2@#33428$##%^%$2";
app.use(cors());
app.use(express.json());
//połączenie z bazą danych
const mongoURL =
  "mongodb+srv://mateusz-ryba:Sluchaj1968%40@cluster0.3rgxt0g.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((e) => console.log(e));

//slash to url
app.get("/", (req, res) => {
  console.log(req.body);
  res.send("serwer działa");
});

app.listen(8888, () => {
  console.log("serwer działa");
});

//BIKE ACTIVITIES
require("./bikeActivities");
const bikeActivity = mongoose.model("bikeActivities");
//wysyłanie kolekcji do fronta
app.get("/bikeActivities", async (req, res) => {
  const bikeActivities = await bikeActivity.find();
  res.json({ bikeActivities });
});
//zapisywanie pojedyńczego elementu z fronta
app.post("/bikeActivities", async (req, res) => {
  const { id, timeOfActivity, dateOfActivity, distanceOfActivity } = req.body;
  //sprawdzamy czy istnieje element o takim id, jeżeli tak to znaczy że edytujemy jakąś
  //aktywność i po prostu podmieniamy zawartość aktywności
  const activity = await bikeActivity.findOne({ id });
  if (activity) {
    await bikeActivity.updateOne(
      { id: id },
      {
        $set: {
          timeOfActivity: String(timeOfActivity),
          dateOfActivity: String(dateOfActivity),
          distanceOfActivity: String(distanceOfActivity),
        },
      }
    );
    //sytuacja, gdy id nie istnieje. To znaczy, że dodajemy nową aktywność.
  } else {
    try {
      await bikeActivity.create({
        id,
        timeOfActivity,
        dateOfActivity,
        distanceOfActivity,
      });
      res.send({ status: "ok" });
    } catch (error) {
      res.send({ status: "error" });
    }
  }
});
//usuwanie pojedyńczego elementu z fronta
app.delete("/bikeActivities/:Id", async (req, res) => {
  const Id = req.params.Id;
  await bikeActivity.deleteOne({ id: Id });
  res.status(200).end();
});

//RUNNING ACTIVITIES
require("./runningActivities");
const runningActivity = mongoose.model("runningActivities");
//wysyłanie całej listy do aplikacji
app.get("/runningActivities", async (req, res) => {
  const runningActivities = await runningActivity.find();
  res.json({ runningActivities });
});
//zapisywanie pojedyńczego elementu z fronta
app.post("/runningActivities", async (req, res) => {
  const { id, timeOfActivity, dateOfActivity, distanceOfActivity } = req.body;
  //sprawdzamy czy istnieje element o takim id, jeżeli tak to znaczy że edytujemy jakąś
  //aktywność i po prostu podmieniamy zawartość aktywności
  const activity = await runningActivity.findOne({ id });
  if (activity) {
    await runningActivity.updateOne(
      { id: id },
      {
        $set: {
          timeOfActivity: String(timeOfActivity),
          dateOfActivity: String(dateOfActivity),
          distanceOfActivity: String(distanceOfActivity),
        },
      }
    );
    //sytuacja, gdy id nie istnieje. To znaczy, że dodajemy nową aktywność.
  } else {
    try {
      await runningActivity.create({
        id,
        timeOfActivity,
        dateOfActivity,
        distanceOfActivity,
      });
      res.send({ status: "ok" });
    } catch (error) {
      res.send({ status: "error" });
    }
  }
  res.status(200).end();
});
//usuwanie pojedyńczego elementu z fronta
app.delete("/runningActivities/:Id", async (req, res) => {
  console.log(req.body);
  const Id = req.params.Id;
  await runningActivity.deleteOne({
    id: Id,
  });
  res.status(200).end();
});

//OPERACJA NA UŻYTKOWNIKACH
require("./userDetails");
const User = mongoose.model("UserInfo");
//rejestracja
app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  //szyfrowanie hasła
  const encryptedPassword = await bcrypt.hash(password, 10);
  //wysłanie informacji do fronta, że
  //podany email jest w bazie danych

  // //j.w. z nazwą użytkownika
  // const checkUsername = User.findOne({ username });
  // if (checkUsername) res.send({ error: "username already exists" });

  try {
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.send({ error: "email already exists" });
    }
    await User.create({
      username,
      email,
      password: encryptedPassword,
    });
    console.log(username);
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});
//logowanie
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.json({ error: "user not exists" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({}, JWT_SECRET);
    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "invalid Password" });

  //https://www.youtube.com/watch?v=6oTDAyuQ5iw&list=PLS3Cbnye46mu2DTyFXfOeefex6L8In9zg&index=5
  //skończone tutaj, czas 7:39
});

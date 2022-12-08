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
//https://www.youtube.com/watch?v=8zCZqGLHQQ0&list=PLS3Cbnye46mu2DTyFXfOeefex6L8In9zg&index=3
mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((e) => console.log(e));

let bikeActivities = [];
let runningActivities = [];

//slash to url
app.get("/", (req, res) => {
  console.log(req.body);
  res.send("serwer działa");
});

//BIKE ACTIVITIES
//wysyłanie całej listy do aplikacji
app.get("/bikeActivities", (req, res) => {
  res.json({ bikeActivities });
});
//zapisywanie pojedyńczego elementu z fronta
app.post("/bikeActivities", (req, res) => {
  //case 1. Jeżeli id elementu istnieeje w tablicy to check=true, łapiemy też od razu jego index
  //aby pozniej łatwo podmienić. Case 1 wykonuje się, gdy edytujemy aktywność sportową.
  let check = false;
  let itemIndex;

  bikeActivities.forEach((item, index) => {
    if (item.id === req.body.id) {
      check = true;
      itemIndex = index;
    }
  });

  //cd case 1...Jeżeli check=true to zamieniamy stary element na nowy
  if (check) bikeActivities[itemIndex] = req.body;
  //case 2. jezeli danego elementu nie ma jeszcze w tablicy to dodajemy go na koncu
  //case 2 się wykonuje przy dodaniu elementu do tablicy.
  else bikeActivities.push(req.body);
  res.status(200).end();
  console.log(bikeActivities);
});
//usuwanie pojedyńczego elementu z fronta
app.delete("/bikeActivities/:Id", (req, res) => {
  const Id = req.params.Id;
  let array = bikeActivities.filter((item) => {
    return item.id !== Id;
  });
  bikeActivities = array;
  res.status(200).end();
});

//RUNNING ACTIVITIES
//wysyłanie całej listy do aplikacji
app.get("/runningActivities", (req, res) => {
  res.json({ runningActivities });
});
//zapisywanie pojedyńczego elementu z fronta
app.post("/runningActivities", (req, res) => {
  runningActivities.push(req.body);
  res.status(200).end();
  console.log(runningActivities);
});
//usuwanie pojedyńczego elementu z fronta
app.delete("/runningActivities/:Id", (req, res) => {
  const Id = req.params.Id;
  let array = runningActivities.filter((item) => {
    return item.id !== Id;
  });
  bikeActivities = array;
  req.status(200).end();
});
app.listen(8888, () => {
  console.log("serwer działa");
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

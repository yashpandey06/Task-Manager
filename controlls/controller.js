import User from "../models/Users.js";
import argon2 from "argon2";
import { GenerateToken } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import Done from "../models/Done.js";
import Todo from "../models/ToDo.js";
import Progress from "../models/Progress.js";

async function Homeresponse(req, res) {
  await res.json({
    message: "Welcome Home",
  });
}
// ! Hashing the Password using Argon2
async function HashedPassword(password) {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
// ! Verify the login password
async function VerifyPassword(db_password, password) {
  try {
    const result = await argon2.verify(db_password, password);
    if (result) {
      return true;
    }
    return false;
  } catch (error) {
    res.status(500).json({
      message: "Internal Error",
      error: error,
    });
  }
}

async function Register(req, res) {
  // ? Steps involve in registration

  // ! Existing User ?
  // ! Hash the Password
  // ! User creatiion

  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Wrong Credentials");
  }
  const hashed_pass = await HashedPassword(password);

  try {
    const User_exist = await User.findOne({ email: email }).exec();
    if (User_exist) {
      return res.json({
        message: "Already a User",
      });
    }
    const newUser = await new User({
      email: email,
      password: hashed_pass,
      date: new Date(),
    });
    await newUser.save();

    res.status(201).json({
      message: "User Registered",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error,
    });
  }
}

async function Login(req, res) {
  // ! Generate Token can be done in login route
  // ! Store it in a Cookie using Cookie parser

  const { email, password } = req.body;
  try {
    const Access = await User.findOne({ email: email }).exec();

    if (Access) {
      const db_pass = Access.password;
      if ((await VerifyPassword(db_pass, password)) === true) {
        //   ! create jwt token
        const token = GenerateToken(Access);

        // ! Cookie-Section

        res
          .cookie("token", token, {
            maxAge: 600000,
            httpOnly: true,
          })
          .json({ token });
      } else {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }
    } else {
      return res.status(400).json({
        message: "Register",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}
async function DashBoardController(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const decodetoken = jwt.verify(token, process.env.SECRET_KEY);
  const { id, email } = decodetoken;
  res.status(200).json({
    id: id,
    email: email,
  });
}
async function BoardController1(req, res) {
  //  Retrieve every data present their of a particular user
  try {
    const DoneTasks = await Done.find({ author: req.user.id }).exec();
    const ProgressTasks = await Progress.find({ author: req.user.id }).exec();
    const TodoTask = await Todo.find({ author: req.user.id }).exec();
    return res.status(200).json({
      done: DoneTasks,
      progress: ProgressTasks,
      todo: TodoTask,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}
async function BoardController2(req, res) {
  const { id, title, input } = req.body;
  try {
    const dumTitle = title.trim().toLowerCase();
    if (dumTitle.toLowerCase().includes("done")) {
      // todo -->  save the data into their respective documents
      const newTask = await new Done({
        Task: input,
        author: req.user.id,
      });
      await newTask.save();
    } else if (dumTitle.toLowerCase().includes("progress")) {
      // todo -->  save the data into their respective documents
      const newTask = await new Progress({
        Task: input,
        author: req.user.id,
      });
      await newTask.save();
    } else if (dumTitle.toLowerCase().includes("tasks")) {
      // todo -->  save the data into their respective documents
      const newTask = await new Todo({
        Task: input,
        author: req.user.id,
      });
      await newTask.save();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
async function BoardController3(req, res) {
  const { author, id } = req.params;
  try {
    await Done.deleteOne({ _id: id, author: author }).exec();
    await Progress.deleteOne({
      _id: id,
      author: author,
    }).exec();
    await Todo.deleteOne({ _id: id, author: author }).exec();
    res.status(200).json("delted");
  } catch (error) {
    res.status(500).json("error");
  }
}
export {
  Homeresponse,
  Register,
  Login,
  DashBoardController,
  BoardController1,
  BoardController2,
  BoardController3,
};

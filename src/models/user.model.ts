import crypto from "crypto";
import jwt, { Jwt, Secret } from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { appConfig } from "@base/config/app";
import { IReport, Report } from "./report.model";

// ------------- Types----------------
interface IUserMethods {
  createJwt: () => Jwt;
}
type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  password: string;
  admissionNumber: number;
  department: string;
  class: string;
  reports: IReport[];
  role: string;
  tel: string;
  passwordResetExpire: Date;
  passwordResetToken: string;
}
// -----------------------------------
const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    firstName: {
      type: String,
      required: [true, "Please provide first name"],
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Please provide last name"],
      maxLength: 50,
    },
    admissionNumber: {
      type: Number,
      required: function () {
        return this.role === "student" ? true : false;
      },
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    avatar: {
      type: String,
    },
    class: String,
    department: String,

    password: {
      type: String,
      minLength: 6,
      required: [true, "You must provide password"],
    },
    role: {
      type: String,
      enum: ["teacher", "student", "admin"],
      default: "student",
      required: [true, "Please specify role for this user"],
    },
    tel: {
      type: String,
      minLength: 10,
      maxLength: 11,
      trim: true,
      required: [true, "Please provide phone number"],
    },
    passwordResetToken: String,
    passwordResetExpire: Date,
    reports: {
      type: [],
    },
  },

  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, email: this.email, role: this.role },
    appConfig.jwtSecret as Secret,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpire = Date.now() + 10 * (1000 * 60);

  return resetToken;
};

export const User = mongoose.model<IUser, UserModel>("User", UserSchema);

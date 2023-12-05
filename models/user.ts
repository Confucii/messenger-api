import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    minlength: [5, "Username length should be at least 5 characters"],
    required: [true, "Username length should be at least 5 characters"],
  },
  password: {
    type: String,
    required: [true, "Password length should be at least 8 characters"],
    minlength: [8, "Password length should be at least 8 characters"],
  },
  displayName: {
    type: String,
    required: [true, "Display name is required"],
  },
  status: {
    type: String,
    default: "",
  },
});

UserSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.password;
  },
});

export const User = mongoose.model("User", UserSchema);

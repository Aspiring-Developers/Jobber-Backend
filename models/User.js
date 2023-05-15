const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  city: String,
  state: String,
  country: String,
  dob: String,
  passwordHash: String,
  gender: String,
  occupation: String,
  confirmationCode: String,
  regStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive"
  },
  resume: String,
  applications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  feed: [
    {
      type: Schema.Types.ObjectId,
      ref: "Feed",
    },
  ],
  membership: {
    type: String,
    enum: ["basic", "premium"],
    default: "basic",
  },
});

schema.plugin(uniqueValidator);

schema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;

    delete returnedObject.passwordHash;
  },
});

const User = model("User", schema);
module.exports = User;

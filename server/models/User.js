import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true, maxlength: 20 },
    last_name: { type: String, required: false },
  
    group: {
      type: String,
      required: true,
      enum: ["Admin", "Sales", "Operations", "Customer", "Vendor", "Custom"],
    },

    customer_id: { type: Number, minlength: 6, maxlength: 6 },
    // below are user inputs
    customer_code: {
      type: String,
      uppercase: true,
      minlength: 4,
      maxlength: 4,
    },

    access_level: { type: String }, //

    customer_type: { type: String, enum: ["Business", "Individual"] },

    customer_name: { type: String },
    form_filled: { type: Boolean, default: true, maxlength: 80 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

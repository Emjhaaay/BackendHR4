const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        validate: [validator.isEmail, "Invalid email format"] // Validate email format
    },
    password: { 
        type: String, 
        required: true,
        minlength: [8, "Password must be at least 8 characters"], // Min length validation
        validate: {
            validator: function(value) {
                // Regex for strong password
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
            },
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
    },
},  { timestamps: true });

// Pre-save hook to hash password
EmployeeSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);

module.exports = EmployeeModel;

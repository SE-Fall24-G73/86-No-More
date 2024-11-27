const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const Food = require("../../../models/food");
const History = require("../../../models/history");
const Job = require("../../../models/job");
const Application = require("../../../models/application");
const Inventory = require("../../../models/inventory");
const Menu = require("../../../models/menu");
const Inventoryhistory = require("../../../models/inventoryhistory");
const Reduction = require("../../../models/reduction");
var bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    const compare_password = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!compare_password) {
      return res.status(422).json({
        message: "Invalid username or password",
      });
    }

    if (!user) {
      return res.json(422, {
        message: "Invalid username or password",
      });
    }

    return res.json(200, {
      message: "Sign In Successful, here is your token, please keep it safe",
      data: {
        token: jwt.sign(user.toJSON(), "caloriesapp", { expiresIn: "100000" }),
        user: user,
      },
      success: true,
    });
  } catch (err) {
    console.log("*******", err);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.createHistory = async function (req, res) {
  try {
    let history = await History.create({
      date: req.body.date,
      caloriesgain: req.body.total,
      caloriesburn: req.body.burnout,
      user: req.body.id,
    });

    return res.json(200, {
      message: "History Created Successfully",

      data: {
        history: history,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.signUp = async function (req, res) {
  try {
    const { email, confirmPassword, password, fullName, restaurantName, role } =
      req.body;

    if (
      !email ||
      !password ||
      !fullName ||
      !role ||
      !password ||
      !confirmPassword
    ) {
      return res.json(422, {
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.json(422, {
        message: "Passwords donot match",
      });
    }

    if (role === "owner") {
      if (!restaurantName) {
        return res.json(422, {
          message: "Restaurant Name is required",
        });
      }
    }

    User.findOne({ email: email }, async function (err, user) {
      if (user) {
        return res.json(422, {
          message: "User already exists",
        });
      }

      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const userData = {
          email: email,
          password: hashedPassword,
          fullName: fullName,
          restaurantName: restaurantName,
          role: role,
        };

        let user = User.create(userData, function (err, user) {
          // console.log(err);

          if (err) {
            return res.json(500, {
              message: "Internal Server Error",
            });
          }

          // let userr = User.findOne({ email: req.body.email });

          // console.log(user);

          return res.json(200, {
            message: "Sign Up Successful, here is your token, plz keep it safe",

            data: {
              //user.JSON() part gets encrypted
              token: jwt.sign(user.toJSON(), "caloriesapp", {
                expiresIn: "100000",
              }),
              user,
            },
            "message ": "User Created Successfully!",
            success: true,
          });
        });
      } else {
        return res.json(500, {
          message: "Internal Server Error",
        });
      }
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
module.exports.editProfile = async function (req, res) {
  if (req.body.password == req.body.confirm_password) {
    try {
      let user = await User.findById(req.body.id);

      user.name = req.body.name;
      user.password = req.body.password;

      user.save();

      return res.json(200, {
        message: "User is updated Successfully",

        data: {
          //user.JSON() part gets encrypted

          // token: jwt.sign(user.toJSON(), env.jwt_secret, {
          //   expiresIn: "100000",
          // }),
          user,
        },
        success: true,
      });
    } catch (err) {
      console.log(err);

      return res.json(500, {
        message: "Internal Server Error",
      });
    }
  } else {
    return res.json(422, {
      message: "Passwords donot match",
    });
  }
};

module.exports.editItem = async function (req, res) {
  try {
    let inventory = await Inventory.findOne({
      itemname: new RegExp("^" + req.body.itemname + "$", "i"),
    });

    let inventoryhistory = await Inventoryhistory.findOne({
      itemname: new RegExp("^" + req.body.itemname + "$", "i"),
    });

    let reduction = await Reduction.findOne({
      metric: new RegExp("^" + req.body.metric + "$", "i"),
    });

    let oldquantity = inventoryhistory.quantity;

    reduction.amount = oldquantity - req.body.quantity;

    inventoryhistory.quantity = req.body.quantity;
    inventoryhistory.metric = req.body.metric;

    reduction.save();
    // inventory.save();
    inventoryhistory.save();

    let inventories = await Inventory.find({}).sort("-createdAt");

    return res.json(200, {
      message: "User is updated Successfully",

      data: {
        //user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, {
        //   expiresIn: "100000",
        // }),
        inventories,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.searchUser = async function (req, res) {
  try {
    var regex = new RegExp(req.params.name, "i");

    let users = await Job.find({ name: regex });

    return res.json(200, {
      message: "The list of Searched Users",

      data: {
        //user.JSON() part gets encrypted

        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" }),
        users: users,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.getHistory = async function (req, res) {
  try {
    let history = await History.findOne({
      user: req.query.id,
      date: req.query.date,
    });

    return res.json(200, {
      message: "The User Profile",

      data: {
        //user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" }),
        history: history,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.createJob = async function (req, res) {
  // let inventory = await Inventory.findOne({ itemname: req.body.itemname });

  try {
    let job = await Inventory.create({
      restname: req.body.restname,
      itemname: req.body.itemname,
      metric: req.body.metric,
      restid: req.body.id,
      quantity: req.body.quantity,
      costperitem: req.body.costperitem,
      datebought: req.body.datebought,
      dateexpired: req.body.dateexpired,
    });

    return res.json(200, {
      data: {
        job: job,
        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" })
      },
      message: "Job Created!!",
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "NOT CREATED",
    });
  }
};

module.exports.fetchallmenus = async function (req, res) {
  try {
    const menus = await Menu.find({});

    return res.json(200, {
      data: {
        menu: menus,
      },
      message: "Fetched all menus",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.createMenu = async function (req, res) {
  const {
    restaurantName,
    restaurantId,
    itemName,
    quantity,
    cost,
    productType,
  } = req.body;

  console.log(req.body);

  // Ensure productType is an array
  let processedProductType = Array.isArray(productType)
    ? productType
    : productType.split(",").map((type) => type.trim());

  if (
    !restaurantName ||
    !restaurantId ||
    !itemName ||
    cost === undefined ||
    !processedProductType
  ) {
    return res.status(400).json({
      error:
        "restaurantName, restaurantId, itemName, cost, and productType are required fields.",
    });
  }

  if (
    !Array.isArray(processedProductType) ||
    processedProductType.length === 0
  ) {
    return res.status(400).json({
      error: "productType must be a non-empty array.",
    });
  }

  const allowedProductTypes = [
    "Beef",
    "Pork",
    "Chicken",
    "Milk",
    "Egg",
    "Vegan",
    "Vegetarian",
    "Glutten-Free",
    "Fish",
    "Others",
  ];

  for (const type of processedProductType) {
    if (!allowedProductTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid product type: ${type}. Allowed types are: ${allowedProductTypes.join(
          ", "
        )}.`,
      });
    }
  }

  const restaurantUser = await User.findById(restaurantId);

  if (!restaurantUser) {
    return res.status(404).json({ error: "Restaurant not found." });
  }

  if (restaurantUser.role !== "owner") {
    return res
      .status(403)
      .json({ error: "User is not authorized to create menu items." });
  }

  try {
    const newMenuItem = new Menu({
      restaurantName: restaurantName,
      restaurantId: restaurantId,
      itemName: itemName,
      quantity: quantity || 0,
      cost,
      productType: processedProductType, // Use the processed array
    });

    const savedMenuItem = await newMenuItem.save();

    console.log(savedMenuItem);

    return res.json({
      data: {
        menu: savedMenuItem,
      },
      message: `${itemName} added to Menu Successfully!!`,
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "NOT CREATED",
    });
  }
};

module.exports.deleteMenu = async function (req, res) {
  try {
    console.log("Inside delete func");
    const menuName = req.body.id; // Get the menu ID from the request parameters
    console.log("Menuitem " + menuName);
    // Check if the menu item with the provided ID exists
    const menu = await Menu.findOne({
      menuname: new RegExp("^" + menuName + "$", "i"),
    });

    if (!menu) {
      return res.status(404).json({
        message: "Menu item not found",
        success: false,
      });
    }
    console.log(menu);
    // If the menu item exists, delete it
    await Menu.findByIdAndRemove(menu._id);

    return res.status(200).json({
      data: {
        menu: menu,
        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" })
      },
      message: "Menu item deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports.deleteInventoryItem = async function (req, res) {
  try {
    console.log("Inside delete func");
    const itemName = req.body.id; // Get the menu ID from the request parameters
    console.log("Inventory item " + itemName);
    // Check if the item with the provided ID exists
    const item = await Inventory.findOne({
      itemname: new RegExp("^" + itemName + "$", "i"),
    });

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found",
        success: false,
      });
    }
    console.log(item);
    // If the item exists, delete it
    await Inventory.findByIdAndRemove(item._id);

    return res.status(200).json({
      data: {
        job: item,
        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" })
      },
      message: "Inventory item deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports.index = async function (req, res) {
  let jobs = await Inventory.find({}).sort("-createdAt");

  //Whenever we want to send back JSON data

  return res.json(200, {
    message: "List of jobs",

    jobs: jobs,
  });
};

module.exports.fetchApplication = async function (req, res) {
  let application = await Application.find({}).sort("-createdAt");

  //Whenever we want to send back JSON data

  return res.json(200, {
    message: "List of Applications",

    application: application,
  });
};

module.exports.fetchMenu = async function (req, res) {
  const restaurantId = req.body.restaurantId;

  // console.log("Fetching application", restaurantId);

  let menu = await Menu.find({ restaurantId: restaurantId }).sort("-createdAt");

  console.log(menu);

  //Whenever we want to send back JSON data

  return res.json(200, {
    message: "List of Menus",
    menu: menu,
  });
};

module.exports.createInventoryHistory = async function (req, res) {
  // let inventory = await Inventory.findOne({ itemname: req.body.itemname });

  const {
    itemName,
    quantity,
    metric,
    costperitem,
    datebought,
    dateexpired,
    restaurantName,
    restaurantId,
  } = req.body;

  console.log(
    itemName,
    quantity,
    metric,
    costperitem,
    datebought,
    dateexpired,
    restaurantName,
    restaurantId
  );

  try {
    const restaurant = await User.findOne({ _id: restaurantId });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
        success: false,
      });
    }

    let inventoryhistory = await Inventory.create({
      itemName: itemName,
      quantity: quantity,
      metric: metric,
      costperitem: costperitem,
      datebought: datebought,
      dateexpired: dateexpired,
      restaurantName: restaurantName,
      restaurantId: restaurantId,
    });

    let reduction = await Reduction.findOne({
      metric: new RegExp("^" + req.body.metric + "$", "i"),
    });

    reduction.total = reduction.total + Number(req.body.quantity);

    await reduction.save();

    console.log(reduction);

    console.log(inventoryhistory);
    return res.json(200, {
      data: {
        inventoryhistory: inventoryhistory,
        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" })
      },
      message: "Inventory History Created!!",
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "NOT CREATED",
    });
  }
};

module.exports.fetchInventoryHistory = async function (req, res) {
  //let inventoryhistory = await Inventoryhistory.findOne({itemname: new RegExp('^'+req.body.itemname+'$', "i")});
  try {
    const { restaurantId } = req.body;

    // console.log(restaurantId);

    let inventoryhistory = await Inventory.find({
      restaurantId: restaurantId,
    });

    // console.log(inventoryhistory);

    //Whenever we want to send back JSON data
    // console.log(inventoryhistory);
    return res.json(200, {
      message: "List of InventoryHistory",
      inventoryhistory: inventoryhistory,
    });
  } catch (error) {}
};

module.exports.fetchReductionEstimate = async function (req, res) {
  //let inventoryhistory = await Inventoryhistory.findOne({itemname: new RegExp('^'+req.body.itemname+'$', "i")});
  let reduction = await Reduction.find({});

  //Whenever we want to send back JSON data
  console.log(reduction);
  return res.json(200, {
    message: "List of Waste Reduction",

    reduction: reduction,
  });
};

module.exports.resetReduction = async function (req, res) {
  // let inventory = await Inventory.findOne({ itemname: req.body.itemname });

  try {
    await Reduction.deleteMany({});

    const metrics = ["Items", "Tons", "Gallons", "Kilograms"];
    const resultsArray = [];

    // Loop through each metric and create the object
    for (const metric of metrics) {
      const reduction = await Reduction.create({
        metric: metric,
        amount: 0,
        total: 0,
      });

      resultsArray.push(reduction);
    }

    return res.json(200, {
      data: resultsArray,
      message: "Reset Complete!!",
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "NOT RESET",
    });
  }
};

module.exports.createApplication = async function (req, res) {
  // let user = await User.findOne({ _id: req.body.id });
  check = req.body.skills;

  try {
    let application = await Application.create({
      // applicantemail: req.body.applicantemail,
      applicantid: req.body.applicantId,
      applicantname: req.body.applicantname,
      address: req.body.address,
      phonenumber: req.body.phonenumber,
      hours: req.body.hours,
      dob: req.body.dob,
      gender: req.body.gender,
      skills: check.split(","),
      jobname: req.body.jobname,
      jobid: req.body.jobId,
      manageremail: req.body.managerId,
    });

    return res.json(200, {
      data: {
        application: application,
        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" })
      },
      message: "Job Created!!",
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "NOT CREATED",
    });
  }
};

module.exports.acceptApplication = async function (req, res) {
  try {
    let application = await Application.findById(req.body.applicationId);

    application.status = "1";

    application.save();

    return res.json(200, {
      message: "Application is updated Successfully",

      data: {
        //user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, {
        //   expiresIn: "100000",
        // }),
        application,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

function generateEmailForRating({
  restaurantName,
  userName,
  dishName,
  rating,
  comments,
  companyName,
}) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>New Rating Received</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333333;
          padding: 20px;
        }
        .email-container {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          border-bottom: 2px solid #28a745;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .header h2 {
          color: #28a745;
        }
        .content {
          line-height: 1.6;
        }
        .footer {
          margin-top: 30px;
          font-size: 0.9em;
          color: #777777;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h2>New Rating Received</h2>
        </div>
        <div class="content">
          <p>Dear <strong>${restaurantName}</strong>,</p>
          <p>
            User <strong>${userName}</strong> has rated your dish
            <strong>${dishName}</strong> with <strong>${rating} stars</strong>.
          </p>
          ${comments ? `<p>Comments: "${comments}"</p>` : ""}
          <p>Thank you for providing excellent service!</p>
        </div>
        <div class="footer">
          <p>Best regards,<br />${companyName}</p>
        </div>
      </div>
    </body>
  </html>
    `;
}

module.exports.submitRating = async function (req, res) {
  const { foodItemId, rating, customerId } = req.body;

  const customer = await User.findById(customerId);

  if (!customer) {
    return res.status(404).json({
      message: "Customer not found",
    });
  }

  if (!foodItemId || typeof rating !== "number") {
    return res
      .status(400)
      .json({ success: false, message: "foodItemId and rating are required." });
  }

  if (rating < 0.5 || rating > 5.0) {
    return res
      .status(400)
      .json({ success: false, message: "Rating must be between 0.5 and 5.0." });
  }

  try {
    const menuItem = await Menu.findById(foodItemId);

    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found." });
    }

    menuItem.totalRating += rating;
    menuItem.numberOfRatings += 1;
    menuItem.averageRating = parseFloat(
      (menuItem.totalRating / menuItem.numberOfRatings).toFixed(2)
    );

    await menuItem.save();

    const emailData = {
      restaurantName: menuItem.restaurantName,
      userName: customer.fullName,
      dishName: menuItem.itemName,
      rating: rating,
      companyName: process.env.COMPANY_NAME || "86-NO-MORE",
    };

    console.log(emailData);

    const htmlContent = generateEmailForRating(emailData);

    console.log(menuItem);

    const restaurant = await User.findById(menuItem.restaurantId);

    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found." });
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: restaurant.email,
      subject: `New Rating for ${menuItem.itemName}`,
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);

    res.status(200).json({
      success: true,
      message: "Rating submitted successfully.",
      averageRating: menuItem.averageRating,
    });
  } catch (error) {
    console.error(`Error submitting rating: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports.rejectApplication = async function (req, res) {
  try {
    let application = await Application.findById(req.body.applicationId);

    application.status = "2";

    application.save();

    return res.json(200, {
      message: "Application is updated Successfully",

      data: {
        //user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, {
        //   expiresIn: "100000",
        // }),
        application,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.closeJob = async function (req, res) {
  try {
    let job = await Job.findById(req.body.jobId);

    job.status = "1";

    job.save();

    return res.json(200, {
      message: "Job is updated Successfully",

      data: {
        //user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, {
        //   expiresIn: "100000",
        // }),
        job,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  const user = await User.findOne({ email });

  // console.log(user);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User Not Found",
    });
  }

  const resetToken = await user.getResetToken();
  // console.log(resetToken);

  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
    `;

  // await sendEmail(user.email, "SkillShare Reset Password", message);

  try {
    // Send the email using Nodemailer transporter
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "86-No-More Reset Password", // Email subject
      html: message, // Email body (HTML)
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }

  res.status(200).json({
    success: true,
    message: `Reset Token has been sent to ${user.email}`,
  });
};

module.exports.resetPassword = async (req, res) => {
  const token = req.body.token;

  // console.log(token);

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const expire = Date.now() + 15 * 60 * 1000;

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid Token",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user.password = hashedPassword;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset Successfully",
  });
};

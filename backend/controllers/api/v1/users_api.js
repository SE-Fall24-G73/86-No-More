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

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user || user.password != req.body.password) {
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
    const { email, confirmPassword, password, fullName, restaurentName, role } =
      req.body;

    if (password !== confirmPassword) {
      return res.json(422, {
        message: "Passwords donot match",
      });
    }

    console.log(req.body);

    User.findOne({ email: email }, function (err, user) {
      if (user) {
        console.log(user);

        return res.json(200, {
          message: "Sign Up Successful, here is your token, plz keep it safe",

          data: {
            //user.JSON() part gets encrypted

            token: jwt.sign(user.toJSON(), "caloriesapp", {
              expiresIn: "100000",
            }),
            user,
          },
          success: true,
        });
      }

      if (!user) {
        const userData = {
          email: email,
          password: password,
          fullName: fullName,
          restaurentName: restaurentName,
          role: role,
        };

        let user = User.create(userData, function (err, user) {
          console.log(err);

          if (err) {
            return res.json(500, {
              message: "Internal Server Error",
            });
          }

          // let userr = User.findOne({ email: req.body.email });

          console.log(user);

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

module.exports.createMenu = async function (req, res) {
  // let inventory = await Inventory.findOne({ itemname: req.body.itemname });

  try {
    let menu = await Menu.create({
      restname: req.body.restname,
      menuname: req.body.menuname,
      restid: req.body.id,
      quantity: req.body.quantity,
      costmenu: req.body.costmenu,
    });

    return res.json(200, {
      data: {
        menu: menu,
        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" })
      },
      message: "Menu Created!!",
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
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
  let menu = await Menu.find({}).sort("-createdAt");

  //Whenever we want to send back JSON data

  return res.json(200, {
    message: "List of Menus",

    menu: menu,
  });
};

module.exports.createInventoryHistory = async function (req, res) {
  // let inventory = await Inventory.findOne({ itemname: req.body.itemname });

  try {
    let inventoryhistory = await Inventoryhistory.create({
      itemname: req.body.itemname,
      quantity: req.body.quantity,
      metric: req.body.metric,
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
  let inventoryhistory = await Inventoryhistory.find({});
  //Whenever we want to send back JSON data
  console.log(inventoryhistory);
  return res.json(200, {
    message: "List of InventoryHistory",

    inventoryhistory: inventoryhistory,
  });
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

      // Add each created menu to the results array
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

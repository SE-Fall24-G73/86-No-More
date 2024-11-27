let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index"); // Adjust the path as needed
let expect = chai.expect;
let mongoose = require("mongoose");

chai.should();
chai.use(chaiHttp);

describe("Users API", function () {
  this.timeout(10000);

  before(function (done) {
    if (mongoose.connection.readyState === 1) {
      done();
    } else {
      mongoose.connection.once("open", done);
      mongoose.connection.on("error", done);
    }
  });

  let testUserToken;
  let testUserId;
  let testRestaurantId;
  let testMenuItemId;
  let testCustomerId;
  let testResetToken;

  /**
   * Test the POST route for user sign-up
   */
  describe("POST /api/v1/users/signup", () => {
    it("It should create a new owner user", (done) => {
      const user = {
        email: "owner@example.com",
        password: "password123",
        confirmPassword: "password123",
        fullName: "Owner User",
        restaurantName: "Owner's Restaurant",
        role: "owner",
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/signup")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("success").eq(true);
          response.body.data.should.have.property("token");
          response.body.data.should.have.property("user");
          testUserToken = response.body.data.token;
          testUserId = response.body.data.user._id;
          testRestaurantId = testUserId; // Assuming restaurantId is the same as userId for owner
          console.log("*********", response.body);
          done();
        });
    });

    it("It should not create a user with existing email", (done) => {
      const user = {
        email: "owner@example.com", // Same email as before
        password: "password123",
        confirmPassword: "password123",
        fullName: "Another User",
        restaurantName: "Another Restaurant",
        role: "owner",
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/signup")
        .send(user)
        .end((err, response) => {
          response.should.have.status(422);
          response.body.should.be.a("object");
          response.body.should.have
            .property("message")
            .eq("User already exists");
          console.log("*********", response.body);
          done();
        });
    });

    it("It should not create a user with missing fields", (done) => {
      const user = {
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        role: "",
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/signup")
        .send(user)
        .end((err, response) => {
          response.should.have.status(422);
          response.body.should.be.a("object");
          response.body.should.have
            .property("message")
            .eq("All fields are required");
          console.log("*********", response.body);
          done();
        });
    });
  });

  /**
   * Test the POST route for user login (create session)
   */
  describe("POST /api/v1/users/create-session", () => {
    it("It should log in the user and return a token", (done) => {
      const userCredentials = {
        email: "owner@example.com",
        password: "password123",
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/create-session")
        .send(userCredentials)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("success").eq(true);
          response.body.data.should.have.property("token");
          response.body.data.should.have.property("user");
          testUserToken = response.body.data.token;
          testUserId = response.body.data.user._id;
          console.log("*********", response.body);
          done();
        });
    });

    it("It should not log in with incorrect password", (done) => {
      const userCredentials = {
        email: "owner@example.com",
        password: "wrongpassword",
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/create-session")
        .send(userCredentials)
        .end((err, response) => {
          response.should.have.status(422);
          response.body.should.be.a("object");
          response.body.should.have
            .property("message")
            .eq("Invalid username or password");
          console.log("*********", response.body);
          done();
        });
    });

    it("It should not log in with non-existent email", (done) => {
      const userCredentials = {
        email: "nonexistent@example.com",
        password: "password123",
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/create-session")
        .send(userCredentials)
        .end((err, response) => {
          response.should.have.status(422);
          response.body.should.be.a("object");
          response.body.should.have
            .property("message")
            .eq("Invalid username or password");
          console.log("*********", response.body);
          done();
        });
    });
  });

  /**
   * Test the POST route for creating history
   */
  describe("POST /api/v1/users/createHistory", () => {
    it("It should create a new history entry", (done) => {
      const historyData = {
        date: "2023-10-10",
        total: 500,
        burnout: 200,
        id: testUserId, // Use the test user ID
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/createHistory")
        .send(historyData)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("success").eq(true);
          response.body.data.should.have.property("history");
          console.log("*********", response.body);
          done();
        });
    });

    it("It should not create history with missing fields", (done) => {
      const historyData = {
        date: "",
        total: null,
        burnout: null,
        id: "",
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/createHistory")
        .send(historyData)
        .end((err, response) => {
          response.should.have.status(500);
          response.body.should.be.a("object");
          response.body.should.have
            .property("message")
            .eq("Internal Server Error");
          console.log("*********", response.body);
          done();
        });
    });
  });

  /**
   * Test the GET route for fetching user history
   */
  describe("GET /api/v1/users/getHistory", () => {
    it("It should get the user's history", (done) => {
      const userId = testUserId;
      const date = "2023-10-10";
      chai
        .request("http://localhost:8000")
        .get(`/api/v1/users/getHistory?id=${userId}&date=${date}`)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("success").eq(true);
          response.body.data.should.have.property("history");
          console.log("*********", response.body);
          done();
        });
    });

    it("It should return null for history that doesn't exist", (done) => {
      const userId = testUserId;
      const date = "2025-01-01";
      chai
        .request("http://localhost:8000")
        .get(`/api/v1/users/getHistory?id=${userId}&date=${date}`)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.data.should.have.property("history").eq(null);
          console.log("*********", response.body);
          done();
        });
    });
  });

  /**
   * Test the GET route for searching users
   */
  describe("GET /api/v1/users/search/:name", () => {
    it("It should return searched users", (done) => {
      const searchName = "Owner";
      chai
        .request("http://localhost:8000")
        .get(`/api/v1/users/search/${searchName}`)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("success").eq(true);
          response.body.data.should.have.property("users").to.be.an("array");
          console.log("*********", response.body.data.users);
          done();
        });
    });

    it("It should return empty array if no users found", (done) => {
      const searchName = "NonExistentName";
      chai
        .request("http://localhost:8000")
        .get(`/api/v1/users/search/${searchName}`)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.data.should.have.property("users").to.be.an("array")
            .that.is.empty;
          console.log("*********", response.body.data.users);
          done();
        });
    });
  });

  /**
   * Test the GET route for fetching all menus
   */
  describe("GET /api/v1/users/fetchallmenus", () => {
    it("It should fetch all menus", (done) => {
      chai
        .request("http://localhost:8000")
        .get("/api/v1/users/fetchallmenus")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("success").eq(true);
          response.body.data.should.have.property("menu").to.be.an("array");
          console.log("*********", response.body.data.menu);
          done();
        });
    });
  });

  /**
   * Test the POST route for creating a menu item
   */
  describe("POST /api/v1/users/createMenu", () => {
    it("It should create a new menu item", (done) => {
      const menuData = {
        restaurantName: "Owner's Restaurant",
        restaurantId: testRestaurantId,
        itemName: "Test Dish",
        quantity: 50,
        cost: 15.99,
        productType: ["Vegan", "Glutten-Free"],
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/createMenu")
        .send(menuData)
        .end((err, response) => {
          console.log("*********", response.body);

          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("success").eq(true);
          response.body.data.should.have.property("menu");
          testMenuItemId = response.body.data.menu._id;
          console.log("*********", response.body.data.menu);
          done();
        });
    });

    it("It should not create a menu item with invalid product type", (done) => {
      const menuData = {
        restaurantName: "Owner's Restaurant",
        restaurantId: testRestaurantId,
        itemName: "Invalid Dish",
        quantity: 10,
        cost: 9.99,
        productType: ["InvalidType"],
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/createMenu")
        .send(menuData)
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a("object");
          response.body.should.have.property("error");
          console.log("*********", response.body);
          done();
        });
    });
  });

  /**
   * Test the GET route for fetching reduction estimates
   */
  describe("GET /api/v1/users/fetchReductionEstimate", () => {
    it("It should fetch reduction estimates", (done) => {
      chai
        .request("http://localhost:8000")
        .get("/api/v1/users/fetchReductionEstimate")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("reduction");
          console.log("*********", response.body.reduction);
          done();
        });
    });
  });

  /**
   * Test the POST route for forgot password
   */
  describe("POST /api/v1/users/forgotPassword", () => {
    it("It should send a password reset email", (done) => {
      const emailData = {
        email: "owner@example.com",
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/forgotPassword")
        .send(emailData)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("success").eq(true);
          response.body.should.have.property("message");
          console.log("*********", response.body);
          // For testing reset password, extract reset token from user in database
          // Assume we have a function to get user by email
          // Replace this with actual implementation
          const User = require("../models/user");
          User.findOne({ email: "owner@example.com" }).then((user) => {
            testResetToken = user.resetPasswordToken;
            done();
          });
        });
    });

    it("It should not send email to non-existent user", (done) => {
      const emailData = {
        email: "nonexistent@example.com",
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/forgotPassword")
        .send(emailData)
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.be.a("object");
          response.body.should.have.property("success").eq(false);
          response.body.should.have.property("message").eq("User Not Found");
          console.log("*********", response.body);
          done();
        });
    });
  });

  /**
   * Test the POST route for resetting password
   */
  describe("POST /api/v1/users/resetPassword", () => {
    it("It should not reset password with invalid token", (done) => {
      const resetData = {
        token: "invalidtoken",
        password: "newpassword123",
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/resetPassword")
        .send(resetData)
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a("object");
          response.body.should.have.property("success").eq(false);
          response.body.should.have.property("message").eq("Invalid Token");
          console.log("*********", response.body);
          done();
        });
    });
  });

  /**
   * Test the POST route for submitting a rating
   */
  describe("POST /api/v1/users/submitRating", () => {
    before((done) => {
      // Create a customer user for rating
      const user = {
        email: "customer@example.com",
        password: "password123",
        confirmPassword: "password123",
        fullName: "Customer User",
        role: "customer",
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/signup")
        .send(user)
        .end((err, response) => {
          testCustomerId = response.body.data.user._id;
          done();
        });
    });

    it("It should submit a rating for a menu item", (done) => {
      const ratingData = {
        foodItemId: testMenuItemId,
        rating: 4.5,
        customerId: testCustomerId,
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/submitRating")
        .send(ratingData)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("success").eq(true);
          response.body.should.have.property("averageRating");
          console.log("*********", response.body);
          done();
        });
    });

    it("It should not submit rating with invalid rating value", (done) => {
      const ratingData = {
        foodItemId: testMenuItemId,
        rating: 6, // Invalid rating, should be between 0.5 and 5.0
        customerId: testCustomerId,
      };
      chai
        .request("http://localhost:8000")
        .post("/api/v1/users/submitRating")
        .send(ratingData)
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a("object");
          response.body.should.have.property("success").eq(false);
          response.body.should.have
            .property("message")
            .eq("Rating must be between 0.5 and 5.0.");
          console.log("*********", response.body);
          done();
        });
    });
  });

  /**
   * Cleanup after tests
   */
  after((done) => {
    // Clean up the test data
    const User = require("../models/user");
    const Menu = require("../models/menu");
    const History = require("../models/history");

    User.deleteMany({
      email: { $in: ["owner@example.com", "customer@example.com"] },
    })
      .then(() => Menu.deleteMany({ restaurantId: testRestaurantId }))
      .then(() => History.deleteMany({ user: testUserId }))
      .then(() => done());
  });
});

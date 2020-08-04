import fs from "fs";
import path from "path";
import chai from "chai";
import chaiHttp from "chai-http";
import { config } from "dotenv";

import app from "../index";

config();

const { expect } = chai;
chai.use(chaiHttp);

const BASE_URL = "/api/auth/admin";
const file = path.resolve(`${__dirname}/eventhall.jpg`);

describe("Admin Endpoints - Signup, Signin and Profile", () => {
  // empty the tables after each test
  //   before(() => {
  //     dropTables();
  //   });

  it("Should create a new Admin, Login the Admin and Return the Admin Profile info", (done) => {
    /**
     * POST /signup
     * DESC - Creates a new admin
     */
    chai
      .request(app)
      .post(`${BASE_URL}/signup`)
      .set("content-type", "multipart/form-data")
      .field("firstName", "John")
      .field("lastName", "Doe")
      .field("address", "123, Main Street")
      .field("email", "johndoe@test.comm")
      .field("password", "123456789")
      .field("confirmPassword", "123456789")
      .field("businessName", "JohnDoes Event")
      .field("phoneNum", "08012345678")
      .attach("logo", fs.readFileSync(file), "eventhall.jpg")
      .end((err, res) => {
        // console.log('Signup: ', res.text);
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals(200);
        expect(res.body.message).to.equals("Account created successfully");

        /**
         * POST /signin
         * DESC - Logs in an admin
         */
        chai
          .request(app)
          .post(`${BASE_URL}/signin`)
          .set("content-type", "application/x-www-form-urlencoded")
          .send({
            email: "johndoe@test.com",
            password: "123456789",
          })
          .end((err, res) => {
            // console.log('Login: ', res.text);
            expect(res).to.have.status(200);
            expect(res.body.status).to.equals(200);
            expect(res.body.message).to.equals("Login successful");
            expect(res.body).to.have.property("token");

            let token = res.body.token;

            /**
             * GET /profile
             * DESC - Returns an admin profile info
             */
            chai
              .request(app)
              .get(`${BASE_URL}/profile`)
              .set({
                Authorization: token,
              })
              .end((err, res) => {
                // console.log('Profile: ', res.text);
                expect(res).to.have.status(200);
                expect(res.body.success).to.equals(true);
                expect(res.body.message).to.equals("Welcome Admin");
                expect(res.body).to.have.property("profile");
              });
          });
      });
    done();
  });

  it("Should not create Admin if logo is not uploaded", (done) => {
    chai
      .request(app)
      .post(`${BASE_URL}/signup`)
      .set("content-type", "multipart/form-data")
      .field("firstName", "John")
      .field("lastName", "Doe")
      .field("address", "123, Main Street")
      .field("email", "janedoe@test.com")
      .field("password", "123456789")
      .field("confirmPassword", "123456789")
      .field("businessName", "JaneDoes Event")
      .field("phoneNum", "08012345678")
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equals(400);
        expect(res.body.message).to.equals(
          "Please upload a logo for your event center"
        );
      });
    done();
  });

  it("Should not create Admin if email is already registered", (done) => {
    chai
      .request(app)
      .post(`${BASE_URL}/signup`)
      .set("content-type", "multipart/form-data")
      .field("firstName", "John")
      .field("lastName", "Doe")
      .field("address", "123, Main Street")
      .field("email", "johndoe@test.com")
      .field("password", "123456789")
      .field("confirmPassword", "123456789")
      .field("businessName", "JohnDoes Event")
      .field("phoneNum", "08012345678")
      .attach("logo", fs.readFileSync(file), "eventhall.jpg")
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equals(400);
        expect(res.body.message).to.equals(
          "User already exist please log in or check credentials passed"
        );
      });
    done();
  });

  it("Should not create Admin if email doesnt have the correct format", (done) => {
    chai
      .request(app)
      .post(`${BASE_URL}/signup`)
      .set("content-type", "multipart/form-data")
      .field("firstName", "John")
      .field("lastName", "Doe")
      .field("address", "123, Main Street")
      .field("email", "johndoe")
      .field("password", "123456789")
      .field("confirmPassword", "123456789")
      .field("businessName", "JohnDoes Event")
      .field("phoneNum", "08012345678")
      .attach("logo", fs.readFileSync(file), "eventhall.jpg")
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equals(400);
        expect(res.body.message).to.equals("Email do not match correct format");
      });
    done();
  });

  it("Should not create Admin if phone number is less than 11 characters", (done) => {
    chai
      .request(app)
      .post(`${BASE_URL}/signup`)
      .set("content-type", "multipart/form-data")
      .field("firstName", "John")
      .field("lastName", "Doe")
      .field("address", "123, Main Street")
      .field("email", "johndoe@test.commm")
      .field("password", "123456789")
      .field("confirmPassword", "123456789")
      .field("businessName", "JohnDoes Event")
      .field("phoneNum", "080123456")
      .attach("logo", fs.readFileSync(file), "eventhall.jpg")
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equals(400);
        expect(res.body.message).to.equals(
          "Phone number must be a number not less than 11 characters"
        );
      });
    done();
  });
});

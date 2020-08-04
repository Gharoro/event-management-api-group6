import chai from "chai";
import chaiHttp from "chai-http";

import app from "../index";
import { dropTables } from "../config/dbconnection";

const { expect } = chai;
chai.should();
chai.use(chaiHttp);

describe("Server!", () => {
  // empty the tables after each test
  // before(() => {
  //     dropTables();
  // });

  it("welcomes user to the api", (done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.equals(true);
        expect(res.body.message).to.equals(
          "Hello there! Welcome to Magnitude Event Manager."
        );
      });
    done();
  });

  // it("Redirects to API Documentation", done => {
  //     chai
  //         .request(app)
  //         .get("/api-docs").redirects(0)
  //         .end((err, res) => {
  //             res.should.redirectTo('https://documenter.getpostman.com/view/6511530/T17NbQMH?version=latest');
  //         });
  //     done();
  // });
});

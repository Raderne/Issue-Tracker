const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

// Create an issue with every field: POST request to /api/issues/{project}
// Create an issue with only required fields: POST request to /api/issues/{project}
// Create an issue with missing required fields: POST request to /api/issues/{project}
// View issues on a project: GET request to /api/issues/{project}
// View issues on a project with one filter: GET request to /api/issues/{project}
// View issues on a project with multiple filters: GET request to /api/issues/{project}
// Update one field on an issue: PUT request to /api/issues/{project}
// Update multiple fields on an issue: PUT request to /api/issues/{project}
// Update an issue with missing _id: PUT request to /api/issues/{project}
// Update an issue with no fields to update: PUT request to /api/issues/{project}
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
// Delete an issue: DELETE request to /api/issues/{project}
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}

let issue1;
let issue2;
suite("Functional Tests", function () {
  suite("POST /api/issues/{project}", function () {
    test("Create an issue with every field", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test",
          assigned_to: "Chai and Mocha",
          status_text: "In QA",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(res.body.created_by, "Functional Test");
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "In QA");
          issue1 = res.body;
          done();
        });
    });

    test("Create an issue with only required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Only required fields",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Only required fields"
          );
          issue2 = res.body;
          done();
        });
    });

    test("Create an issue with missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  suite("GET /api/issues/{project}", function () {
    test("View issues on a project", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    test("View issues on a project with one filter", function (done) {
      chai
        .request(server)
        .get("/api/issues/test?issue_title=Title")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    test("View issues on a project with multiple filters", function (done) {
      chai
        .request(server)
        .get(
          "/api/issues/test?issue_title=Title&created_by=Functional Test - Every field"
        )
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });
  });

  suite("PUT /api/issues/{project}", function () {
    test("Update one field on an issue", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: issue1._id,
          issue_title: "Updated Title",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, issue1._id);
          done();
        });
    });

    test("Update multiple fields on an issue", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: issue1._id,
          issue_title: "Updated Title",
          issue_text: "Updated text",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, issue1._id);
          assert.equal(res.body.result, "successfully updated");
          done();
        });
    });

    test("Update an issue with missing _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          issue_title: "Updated Title",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });

    test("Update an issue with no fields to update", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: issue1._id,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          done();
        });
    });

    test("Update an issue with an invalid _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: "60f5f8c3f8d6c2e4b9b7b8c13",
          issue_title: "Updated Title",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          assert.equal(res.body._id, "60f5f8c3f8d6c2e4b9b7b8c13");
          done();
        });
    });
  });

  suite("DELETE /api/issues/{project}", function () {
    test("Delete an issue", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({
          _id: issue1._id,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");
          done();
        });
    });

    test("Delete an issue with an invalid _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({
          _id: "60f5f8c3f8d6c2e4b9b7b8sc1",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.body._id, "60f5f8c3f8d6c2e4b9b7b8sc1");
          done();
        });
    });

    test("Delete an issue with missing _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
  });
});

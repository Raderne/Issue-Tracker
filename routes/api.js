"use strict";

const { ProjectModel, IssueModel } = require("../model");

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(async function (req, res) {
      let project = req.params.project;
      let query = req.query;

      try {
        let projects = await ProjectModel.find({ name: project });
        if (!projects) {
          return res.json({ error: "project not found" });
        }
        if (projects.length === 0) {
          return res.json([]);
        }

        let projectId = projects[0]._id;
        let issues = await IssueModel.find({ projectId, ...query });

        if (!issues) {
          return res.json({ error: "Issues not found" });
        }

        return res.json(issues);
      } catch (error) {
        console.log(error);
        res.json({ error: "could not get" });
        return;
      }
    })

    .post(async function (req, res) {
      let projectName = req.params.project;
      let issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
      };
      if (!issue.issue_title || !issue.issue_text || !issue.created_by) {
        return res.json({ error: "required field(s) missing" });
      }

      try {
        let projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          projectModel = new ProjectModel({ name: projectName });
          await projectModel.save();
        }

        const issueModel = new IssueModel({
          ...issue,
          projectId: projectModel._id,
        });
        await issueModel.save();

        return res.json(issueModel);
      } catch (error) {
        console.log(error);
        res.json({ error: "could not create" });
        return;
      }
    })

    .put(async function (req, res) {
      let projectName = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;

      if (!_id) {
        res.json({ error: "missing _id" });
        return;
      }

      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open
      ) {
        res.json({ error: "no update field(s) sent", _id: _id });
        return;
      }

      try {
        const project = await ProjectModel.findOne({
          name: projectName,
        });
        if (!project) {
          throw new Error("project not found");
        }

        let issue = await IssueModel.findByIdAndUpdate(_id, {
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          open,
          updated_on: new Date(),
        });

        if (!issue) {
          res.json({ error: "could not update", _id: _id });
          return;
        }

        await issue.save();

        res.json({ result: "successfully updated", _id: _id });
      } catch (error) {
        console.log(error);
        res.json({ error: "could not update", _id: _id });
        return;
      }
    })

    .delete(async function (req, res) {
      let projectName = req.params.project;
      let _id = req.body._id;

      if (!_id) {
        res.json({ error: "missing _id" });
        return;
      }

      try {
        const project = await ProjectModel.findOne({ name: projectName });
        if (!project) {
          throw new Error("project not found");
        }

        const deleteIssue = await IssueModel.deleteOne({
          _id,
          projectId: project._id,
        });

        if (deleteIssue.deletedCount === 0) {
          throw new Error("could not delete");
        }

        res.json({ result: "successfully deleted", _id: _id });
      } catch (error) {
        console.log(error);
        res.json({ error: "could not delete", _id: _id });
        return;
      }
    });
};

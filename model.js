const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true },
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String, default: "" },
    status_text: { type: String, default: "" },
    open: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_on", updatedAt: "updated_on" } }
);

const IssueModel = mongoose.model("Issue", issueSchema);

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const ProjectModel = mongoose.model("Project", projectSchema);

module.exports = { IssueModel, ProjectModel };

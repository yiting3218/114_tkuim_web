//campusEvent/backend/controllers/controller.js
import * as repo from "../repositories/participants.js";

const success = (res, data = null, message = "OK", status = 200) => {
  res.status(status).json({
    success: true,
    message,
    data
  });
};

const fail = (res, status, message) => {
  res.status(status).json({
    success: false,
    message
  });
};

export async function create(req, res) {
  const { name, studentId, department, eventTitle } = req.body;

  if (!name || !studentId || !department || !eventTitle) {
    return fail(res, 400, "name, studentId, department, eventTitle are required");
  }

  const id = await repo.createParticipant({
    name,
    studentId,
    department,
    eventTitle,
    status: req.body.status, 
    note: req.body.note      
  });

  success(res, { id }, "Participant created", 201);
}

export async function list(req, res) {
  const data = await repo.findParticipants();
  success(res, data);
}

export async function get(req, res) {
  const item = await repo.findParticipantById(req.params.id);
  if (!item) return fail(res, 404, "Participant not found");
  success(res, item);
}

export async function update(req, res) {
  const allow = ["name", "studentId", "department", "eventTitle", "status", "note"];
  const patch = {};

  for (const key of allow) {
    if (req.body[key] !== undefined) patch[key] = req.body[key];
  }

  const ok = await repo.updateParticipant(req.params.id, patch);
  if (!ok) return fail(res, 404, "Participant not found");
  success(res, null, "Participant updated");
}

export async function remove(req, res) {
  const ok = await repo.deleteParticipant(req.params.id);
  if (!ok) return fail(res, 404, "Participant not found");
  success(res, null, "Participant deleted");
}

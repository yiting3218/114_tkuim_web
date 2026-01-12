import * as repo from "../repositories/participants.js";

const success = (res, data = null, message = "OK") => {
  res.status(200).json({
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
  const { name, email, eventTitle } = req.body;
  if (!name || !email || !eventTitle) {
    return fail(res, 400, "name, email, eventTitle are required");
  }
  const id = await repo.createParticipant(req.body);
  success(res, { id }, "Participant created");
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
  const ok = await repo.updateParticipant(req.params.id, req.body);
  if (!ok) return fail(res, 404, "Participant not found");
  success(res, null, "Participant updated");
}

export async function remove(req, res) {
  const ok = await repo.deleteParticipant(req.params.id);
  if (!ok) return fail(res, 404, "Participant not found");
  success(res, null, "Participant deleted");
}

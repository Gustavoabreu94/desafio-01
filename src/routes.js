import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-rout-path.js";

const database = new Database();

export const routes = [
  {
    path: buildRoutePath("/tasks"),
    method: "GET",
    handler: (request, response) => {
      const data = database.select("tasks");
      return response.end(JSON.stringify(data));
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { id } = req.params;
      const users = database.select(
        "tasks",
        id
          ? {
              id,
            }
          : null
      );

      return res.end(JSON.stringify(users));
    },
  },
  {
    path: buildRoutePath("/tasks"),
    method: "POST",
    handler: (request, response) => {
      const { title, description } = request.body;
      const task = {
        id: randomUUID(),
        title,
        description,
        create_at: new Date(),
        updated_at: null,
      };

      database.insert("tasks", task);

      return response.writeHead(201).end();
    },
  },
  {
    path: buildRoutePath("/create-many-tasks-by-csv"),
    method: "POST",
    handler: (request, response) => {
      readRecordsOnCsvFile(request);
      return response.writeHead(201).end();
    },
  },
  {
    path: buildRoutePath("tasks/:id/complete"),
    method: "PATCH",
    handler: (request, response) => {
      const { id } = request.params;
      database.complete("tasks", id);

      return response.writeHead(201).end();
    },
  },
  {
    path: buildRoutePath("/tasks/:id"),
    method: "PUT",
    handler: (request, response) => {
      const { id } = request.params;
      const { title, description } = request.body;
      database.update(
        "tasks",
        {
          id,
          title,
          description,
          update_at: new Date(),
        },
        id
      );
      return response.writeHead(204).end();
    },
  },
  {
    path: buildRoutePath("/tasks/:id"),
    method: "DELETE",
    handler: (request, response) => {
      const { id } = request.params;

      database.delete("tasks", id);

      return response.writeHead(204).end();
    },
  },
];

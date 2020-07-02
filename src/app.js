const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const {id} = request.query;

  const results = id ? repositories.filter(rep => rep.id.includes(id)): 
  repositories;
  return response.json(results)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repository = {id: uuid(), title, url, techs, likes: 0};

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repo = repositories.findIndex((repository) => repository.id == id)

  if (repo < 0) {
    return response
      .status(400)
      .json({ error: 'repository not found in array expecified' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  }

  repositories[repo] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repo = repositories.findIndex((repository) => repository.id == id)

  if (repo < 0) {
    return response
      .status(400)
      .json({ error: 'repository not found in array expecified' });
  }

  repositories.splice(repo, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repo = repositories.findIndex((repository) => repository.id == id)

  if ( repo < 0) {
    return response
      .status(400)
      .json({ error: 'repository not found in array expecified' });
  }

  repositories[repo].likes += 1

  return response.json(repositories[repo])
});

module.exports = app;

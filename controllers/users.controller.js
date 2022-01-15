const { response, request } = require("express");

const usersPost = (req = request, res = response) => {
  const { name, age } = req.body;
  console.log(name, age);

  res.status(201).json({
    msg: "post api - usersPost",
    body: `${name}, ${age}`,
  });
};

const usersGet = (req = request, res = response) => {
  // users?q=someQuery&name=Javi&limit=10
  const { q, name = "no name", page = 1, limit } = req.query;

  res.status(200).json({
    msg: "get api - usersGet",
    q,
    name,
    page,
    limit,
  });
};

const usersPut = (req = request, res = response) => {
  const { id } = req.params;

  res.json({
    msg: `put api - usersPut ${id}`,
  });
};

const usersDelete = (req = request, res = response) => {
  res.json({
    msg: "delete api - usersDelete",
  });
};

const usersPatch = (req = request, res = response) => {
  res.json({
    msg: "patch api - usersPatch",
  });
};

module.exports = {
  usersPost,
  usersGet,
  usersPut,
  usersDelete,
  usersPatch,
};

const { request, response } = require("express");

// The user must be an administrator
const isAdminRole = (req = request, res = response, next) => {
  if (!req.authenticatedUser) {
    return res.status(500).json({
      msg: "you need to validate the token first",
    });
  }
  const { role, name } = req.authenticatedUser;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} is not an admin, can't do that`,
    });
  }

  next();
};

// Check if user has certain role
const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.authenticatedUser) {
      return res.status(500).json({
        msg: "you need to validate the token first",
      });
    }

    if(!roles.includes(req.authenticatedUser.role)){
        return res.status(401).json({
            msg: `The service requires one of these roles: ${roles}`
        })
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  hasRole,
};

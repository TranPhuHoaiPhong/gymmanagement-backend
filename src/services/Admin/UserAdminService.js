const createUser = (req, res) => {
  return new Promise((resolve, reject) => {
    try {
      resolve({ message: "Create user successfully" });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
};

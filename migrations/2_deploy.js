const deployCertification = artifacts.require("Certification");

module.exports = function(deployer) {
  deployer.deploy(deployCertification);
};

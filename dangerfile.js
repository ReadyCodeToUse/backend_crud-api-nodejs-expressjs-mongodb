const {
  danger, fail,
} = require('danger');

const branchName = {
  STAGE: 'stage',
  PREPROD: 'preprod',
  DEVELOP: 'develop',
  PROD: 'prod',
};

const branchRegExp = {
  STAGE: /^[A-Z]{2}-\d{2} - STAGE .+$/,
  PREPROD: /^[A-Z]{2}-\d{2} - PREPROD .+$/,
  DEVELOP: /^[A-Z]{2}-\d{2} - DEVELOP .+$/,
  PROD: /^[A-Z]{2}-\d{2} - PROD .+$/,
  GLOBAL: /^[A-Z]{2}-\d{2} - .+$/,
};

const prTitle = danger.github.pr.title;
const prBaseRef = danger.github.pr.base;

switch (prBaseRef) {
  case branchName.STAGE:
    // regex for stage branch
    if (!prTitle.match(branchRegExp.STAGE)) {
      fail(`${prTitle} is not allowed when PR on ${branchName.STAGE} branch. Please follow the format EA-00 - STAGE <<anyText>>`);
    }
    break;
  case branchName.PREPROD:
    // regex for preprod branch
    if (!prTitle.match(branchRegExp.PREPROD)) {
      fail(`${prTitle} is not allowed when PR on ${branchName.PREPROD} branch. Please follow the format EA-00 - PREPROD <<anyText>>`);
    }
    break;
  case branchName.DEVELOP:
    // regex for develop branch
    if (!prTitle.match(branchRegExp.DEVELOP)) {
      fail(`${prTitle} is not allowed when PR on ${branchName.DEVELOP} branch. Please follow the format EA-00 - STAGE <<anyText>>`);
    }
    break;
  default:
    break;
}

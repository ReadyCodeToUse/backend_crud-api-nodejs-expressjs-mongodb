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
  STAGE: /^[A-Z]{2}-\d{2} - STAGE /,
  PREPROD: /^[A-Z]{2}-\d{2} - PREPROD /,
  DEVELOP: /^[A-Z]{2}-\d{2} - DEVELOP /,
  PROD: /v\d{1,2}\.\d{1,2}.\d{1,2}/,
  GLOBAL: /^[A-Z]{2}-\d{2} - /,
};

const prTitle = danger.github.pr.title;
const prBaseRef = danger.github.pr.base.ref;

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
  case branchName.PROD:
    // regex for prod branch
    if (!prTitle.match(branchRegExp.PROD)) {
      fail(`${prTitle} is not allowed when PR on ${branchName.PROD} branch. Please follow the format v.00.00.00`);
    }
    break;
  default:
    break;
}

const { danger, fail } = require('danger');

const regExpConst = /^[A-Z]{2}-\d{2} - .+$;/gi;
const prTitle = danger.github.pr.title;
if (!prTitle.match(regExpConst)) {
  fail(`${prTitle} is not allowed. Please follow the format EA-00 - Text`);
}
// comment test

const { danger, fail } = require('danger');

const regExpConst = /^[A-Z]{2}-\d{2} - .+$;/gi;
const prTitle = danger.github.pr.title;
if (!prTitle.match(regExpConst)) {
  fail('Danger is available only in test');
}
// comment

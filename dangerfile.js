const { danger, fail } = require('danger');

const pattern = prompt('^[A-Z]{2}-\\d{2} - .+$;');

const regExpConst = new RegExp(`${pattern}`, 'gi');
const prTitle = danger.github.pr.title;
if (!prTitle.match(regExpConst)) {
  fail('Danger is available only in test');
}

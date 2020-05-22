const CronJob = require('cron').CronJob;
const axios = require('axios');

const host = process.env['HOST'];
const paths = [
  '/',
  '/api/lists/browse',
];

new CronJob(
	'* * * * * *',
	async function() {
    for (let path of paths) {
      const url = `http://${host}${path}`;
      try {
        const response = await axios.get(url);
        console.log(`Received ${response.status} from ${url}`);
      } catch (e) {
        console.log(`Error pinging ${url}:`);
        console.log(e);
      }
    }
	},
	null,
	true,
	'Europe/London'
);

console.log('exiting');

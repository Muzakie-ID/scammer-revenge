const fs = require('fs');
const axios = require('axios');

let totalMessagesSent = 0;

async function sendMessages(urls, customText) {
  try {
    console.log(`Sending: "${customText}"`);
    const requests = urls.map((url, index) =>
      axios
        .get(`${url}${encodeURIComponent(customText)}`)
        .then((response) => {
          if (response.status === 200) {
            return `Bot ${index + 1}: PESAN TERKIRIM`;
          } else {
            return `Bot ${index + 1}: Unexpected status code: ${response.status}`;
          }
        })
        .catch((error) => {
          return `Bot ${index + 1}: API down!: ${error.message}`;
        })
    );
    const results = await Promise.allSettled(requests);
    results.forEach((result) => {
      console.log(result.value);
    });
    totalMessagesSent++;
    console.log(`Total Pesan Terkirim : ${totalMessagesSent}`);
    console.log('='.repeat(30));    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function main() {
  try {
    const urls = fs
      .readFileSync('urls.txt', 'utf8')
      .trim()
      .split('\n');
    const customText = fs
      .readFileSync('pesan.txt', 'utf8')
      .trim();
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    while (true) {
      await sendMessages(urls, customText);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();

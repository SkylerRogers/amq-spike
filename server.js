const ActiveMQ = require('stompit');

const connectOptions = {
  host: 'localhost',
  port: 61613,
  connectHeaders: {
    host: '/',
    login: 'username',
    passcode: 'password',
    'heart-beat': '5000,5000'
  }
};

const sendHeaders = {
  destination: '/queue/test',
  'content-type': 'text/plain'
};

const subscribeHeaders = {
  destination: '/queue/test',
  ack: 'client-individual'
};

// Connect
ActiveMQ.connect(connectOptions, (error, client) => {

  if (error) {
    console.log(`connect error: ${error.message}`);
    return;
  }

  // Produce
  const frame = client.send(sendHeaders);
  frame.write('Hello Buddy!');
  frame.end();

  // Consume
  client.subscribe(subscribeHeaders, (error, message) => {

    if (error) {
      console.log(`subscribe error: ${error.message}`);
      return;
    }

    message.readString('utf-8', (error, body) => {
      if (error) {
        console.log(`read message error: ${error.message}`);
        return;
      }
      console.log(`received message: ${body}`);
      client.ack(message);
    });
  });

  // Graceful Shutdown
  process.on('exit', () => {
    client.disconnect();
    process.exit(1);
  });
});

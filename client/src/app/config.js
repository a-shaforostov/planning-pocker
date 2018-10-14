export default {
  wsServer: {
    host: process.env.REACT_APP_HOST || 'localhost',
    port: '3002',
  },
}
console.log('process.env.REACT_APP_HOST', process.env);

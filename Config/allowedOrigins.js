const allowedOrigins = [
  "http://localhost:3500", //our nodejs local host url
  "http://localhost:5173", //our react app host url
  "http://localhost:5173/connect", //our react app host url
  "0.0.0.0/0 ",
];

module.exports = allowedOrigins;

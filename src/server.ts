import express from "express";

const app = express();

app.get('/', (req, res) => {
  return res.json({
    "id": 1,
    "user": "jato",
    "isAllowedToBeatUp": true,
    "hasAdminPermission": true,
  });
});

app.listen(3001, () => console.log('listening at 3001 port'));
            
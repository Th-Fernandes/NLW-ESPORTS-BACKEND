"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    return res.json({
        "id": 1,
        "user": "jato",
        "hasAdminPermission": true
    });
});
app.listen(3001, () => console.log('listening at 3001 port'));

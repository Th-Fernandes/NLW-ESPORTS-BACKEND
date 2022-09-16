"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const convert_hour_string_to_minutes_1 = require("./utils/convert-hour-string-to-minutes");
const convert_minutes_string_to_hour_1 = require("./utils/convert-minutes-string-to-hour");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const prisma = new client_1.PrismaClient({ log: ['query'] });
app.get('/games', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield prisma.game.findMany({
        include: {
            _count: {
                select: {
                    Ads: true
                }
            }
        }
    });
    return res
        .status(200)
        .json(games);
}));
app.get('/games/:id/ads', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const ads = yield prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnds: true,
            game: true,
        },
        where: {
            gameId: id
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return res.json(ads.map(ad => {
        return Object.assign(Object.assign({}, ad), { weekDays: ad.weekDays.split(','), hourStart: (0, convert_minutes_string_to_hour_1.convertMinutesStringToHour)(ad.hourStart), hourEnds: (0, convert_minutes_string_to_hour_1.convertMinutesStringToHour)(ad.hourEnds) });
    }));
}));
app.get('/ads/:id/discord', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const discord = yield prisma.ad.findUniqueOrThrow({
        select: {
            discord: true
        },
        where: {
            id,
        },
    });
    return res.json(discord);
}));
app.post('/games/:id/ads', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    const ad = yield prisma.ad.create({
        data: {
            gameId: id,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: (0, convert_hour_string_to_minutes_1.convertHourStringToMinutes)(body.hourStart),
            hourEnds: (0, convert_hour_string_to_minutes_1.convertHourStringToMinutes)(body.hourEnds),
            useVoiceChannel: body.useVoiceChannel,
            createdAt: body.createdAt,
        }
    });
    return res
        .status(201)
        .json(ad);
}));
app.listen(3001, () => console.log('listening at 3001 port'));

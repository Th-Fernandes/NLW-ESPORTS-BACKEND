import express from "express";
import {PrismaClient} from "@prisma/client";
import cors from "cors"
import { convertHourStringToMinutes } from "./utils/convert-hour-string-to-minutes";
import { convertMinutesStringToHour } from "./utils/convert-minutes-string-to-hour";

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient({ log: ['query'] });

app.get('/games',  async (req, res) => {
  const games = await prisma.game.findMany({
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
});

app.get('/games/:id/ads', async (req, res) => {
  const { id } = req.params;

  const ads = await prisma.ad.findMany({
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
  })

  return res.json(
    ads.map(ad => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(','),
        hourStart: convertMinutesStringToHour(ad.hourStart),       
        hourEnds: convertMinutesStringToHour(ad.hourEnds),         
      }
    })
  );
});

app.get('/ads/:id/discord', async (req, res) => {
  const { id } = req.params;

  const discord = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true
    },
    where: {
      id,
    },
    
  })

  return res.json(discord)
})

app.post('/games/:id/ads',async(req, res) => {
  const { id } = req.params;
  const {body} = req;

  const ad = await prisma.ad.create({
    data: {
      gameId: id,              
      name: body.name,                                        
      yearsPlaying: body.yearsPlaying,        
      discord: body.discord,       
      weekDays: body.weekDays.join(','),                
      hourStart: convertHourStringToMinutes(body.hourStart),              
      hourEnds: convertHourStringToMinutes(body.hourEnds),                
      useVoiceChannel: body.useVoiceChannel , 
      createdAt: body.createdAt,
    }
  })

  return res
    .status(201)
    .json(ad);
})

app.listen(3001, () => console.log('listening at 3001 port'));

            
import { fetchMemberProfile, fetchUser } from './hypixel'
import express from 'express'
import { fetchAllLeaderboardsCategorized, fetchMemberLeaderboard } from './database'
import rateLimit from 'express-rate-limit'

const app = express()

export const debug = true

// 500 requests over 5 minutes
const limiter = rateLimit({
	windowMs: 60 * 1000 * 5,
	max: 500,
	skip: (req: express.Request) => {
		return req.headers.key === process.env.key
	},
	keyGenerator: (req: express.Request) => {
		return (req.headers['Cf-Connecting-Ip'] ?? req.ip).toString()
	}
})

app.use(limiter)

app.get('/', async(req, res) => {
	res.json({ ok: true })
})

app.get('/player/:user', async(req, res) => {
	res.json(
		await fetchUser(
			{ user: req.params.user },
			['profiles', 'player']
		)
	)
})

app.get('/player/:user/:profile', async(req, res) => {
	res.json(
		await fetchMemberProfile(req.params.user, req.params.profile)
	)
})

app.get('/leaderboard/:name', async(req, res) => {
	res.json(
		await fetchMemberLeaderboard(req.params.name)
	)
})

app.get('/leaderboards', async(req, res) => {
	res.json(
		await fetchAllLeaderboardsCategorized()
	)
})



app.listen(8080, () => console.log('App started :)'))

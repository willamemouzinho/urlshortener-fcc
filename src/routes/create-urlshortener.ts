import dns from 'node:dns/promises'
import type { Request, Response } from 'express'
import isUrlHttp from 'is-url-http'
import { z } from 'zod'
import { database } from '../database'

export const createURLShortener = async (req: Request, res: Response) => {
	const createShortenerBody = z.object({
		url: z.string(),
	})

	try {
		const { url } = createShortenerBody.parse(req.body)

		if (!isUrlHttp(url)) {
			return res.status(200).json({
				error: 'Invalid URL',
			})
		}
		const hostname = new URL(url).hostname

		try {
			const dnsResult = await dns.lookup(hostname)
			console.log({ dnsResult })
		} catch (error) {
			return res.status(200).json({
				error: 'Invalid Hostname',
			})
		}

		// url already exists on database
		const urlShortenerExists = database.find(
			(shortener) => shortener.original_url === url,
		)

		if (urlShortenerExists) {
			return res.status(200).json({
				original_url: urlShortenerExists.original_url,
				short_url: urlShortenerExists.short_url,
			})
		}

		// create new url shortener
		const newShortener = {
			original_url: url,
			short_url: database.length + 1,
		}
		database.push(newShortener)

		return res.status(201).json({
			original_url: newShortener.original_url,
			short_url: newShortener.short_url,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: 'internal server error.' })
	}
}

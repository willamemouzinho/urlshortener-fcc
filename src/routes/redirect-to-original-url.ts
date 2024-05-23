import type { Request, Response } from 'express'
import { z } from 'zod'
import { database } from '../database'

export const redirectToOriginalURL = async (req: Request, res: Response) => {
	const createShortenerBody = z.object({
		id: z.coerce.number(),
	})

	try {
		const { id } = createShortenerBody.parse(req.params)
		const urlShortener = database.find(
			(shortener) => shortener.short_url === id,
		)

		if (!urlShortener) {
			return res.status(200).json({
				error: 'No short URL found for the given input',
			})
		}

		return res.redirect(urlShortener.original_url)
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: 'internal server error.' })
	}
}

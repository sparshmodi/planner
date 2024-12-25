import { NextRequest, NextResponse } from 'next/server'

// Referenced from https://codeparrot.ai/blogs/nextjs-middleware-simple-guide-to-control-requests
interface RateLimitRecord {
  lastRequestTime: number;
  requestCount: number;
}

// In-memory store for request rates
const rateLimitStore: Map<string, RateLimitRecord> = new Map()

const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 60

export function middleware(req: NextRequest) {
	// Get client IP address
	const clientIp = req.ip ?? 'unknown'

	// Initialize or update the rate limit record for this IP
	const currentTime = Date.now()
	const rateLimitRecord = rateLimitStore.get(clientIp)

	if (rateLimitRecord) {
		// Check if the current request is within the rate limit window
		const elapsedTime = currentTime - rateLimitRecord.lastRequestTime

		if (elapsedTime < RATE_LIMIT_WINDOW_MS) {
			// Within the same window, increment the request count
			rateLimitRecord.requestCount += 1

			if (rateLimitRecord.requestCount > RATE_LIMIT_MAX_REQUESTS) {
				// Rate limit exceeded, deny request
				return new NextResponse(
					JSON.stringify({ error: 'Too many requests. Please try again later.' }),
					{ status: 429, headers: { 'Content-Type': 'application/json' } }
				)
			}
		} else {
			// Reset the window and request count
			rateLimitRecord.lastRequestTime = currentTime
			rateLimitRecord.requestCount = 1
		}
	} else {
		// Create a new rate limit record for this IP
		rateLimitStore.set(clientIp, {
			lastRequestTime: currentTime,
			requestCount: 1,
		})
	}

	// Allow the request to proceed
	return NextResponse.next()
}

export const config = {
	matcher: ['/', '/404', '/plan/:path*', '/profile'],
}
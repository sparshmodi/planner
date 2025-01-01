import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist'
import { DJANGO_BACKEND_URL, GRAPHQL_EP } from '@/constants'

export const createClientSideApolloClient = async () => {
	const cache = new InMemoryCache()

	await persistCache({
		cache,
		storage: new LocalStorageWrapper(window.localStorage),
	})

	return new ApolloClient({
		link: new HttpLink({
			uri: 'http://localhost:8000' + GRAPHQL_EP,
		}),
		cache,
	}) 
}

export const createServerSideApolloClient = () => {
	return new ApolloClient({
		link: new HttpLink({
			uri: DJANGO_BACKEND_URL + GRAPHQL_EP,
			credentials: 'same-origin',
		}),
		cache: new InMemoryCache(),
	})
}

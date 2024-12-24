import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { DJANGO_BACKEND_URL, GRAPHQL_EP } from '@/constants'

export const createApolloClient = () => {
	return  new ApolloClient({
		link: new HttpLink({
			uri: DJANGO_BACKEND_URL + GRAPHQL_EP,
			credentials: 'same-origin',
		}),
		cache: new InMemoryCache(),
	}) 
}

const client = createApolloClient()

export default client
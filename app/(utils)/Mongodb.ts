import { MongoClient, ServerApiVersion } from 'mongodb'

const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}`
const options = {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
}

const clientPromise = MongoClient.connect(url, options)

export default clientPromise
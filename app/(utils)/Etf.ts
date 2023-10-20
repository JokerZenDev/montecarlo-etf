// List of tickers to fetch
import { promises as fs } from 'fs';
import clientPromise from './Mongodb';

type Etf = {
	symbol: string
	name: string
	currency: string
	stockExchange: string
	exchangeShortName: string
}

// In the free tier of api service you can only get US stocks
const EXCHANGE_ACCEPTED = ["AMEX", "NASDAQ"]
const TICKERS_ACCEPTED = ["VSS", "VEU"]

const getAllEtfFromDb = async () => {
	const dbClient = await clientPromise
	const db = dbClient.db('all-etf')
	const allEtfs = await db.collection("all")
		.find({})
		.toArray()

	const etfs: Etf[] = JSON.parse(allEtfs[0].data)

	return etfs
}

export const getAvailableEtf = async () => {
	const etfs: Etf[] = await getAllEtfFromDb()

	return etfs.filter((etf) => EXCHANGE_ACCEPTED.indexOf(etf.exchangeShortName) > -1 && (etf.name.includes('iShares') || TICKERS_ACCEPTED.indexOf(etf.symbol) > -1))
}

export const getProcessedEtf = async () => {
	const allEtf: Etf[] = await getAllEtfFromDb()

	const dbClient = await clientPromise
	const db = dbClient.db('etf')
	const tickers = await db.listCollections().toArray()

	const etfs = tickers.map(ticker => allEtf.find(etf => etf.symbol === ticker.name) as Etf)

	return etfs
}

export const getEtfRatesByTicker = async (ticker: string) => {
	const client = await clientPromise

	const db = client.db("etf")

	const rates = await db
		.collection(ticker.toUpperCase())
		.find({})
		.toArray()

	return rates
}

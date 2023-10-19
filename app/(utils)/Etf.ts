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

export const getAvailableEtf = async () => {
	// Fetch available etfs from file to reduce api calls
	const data = await fs.readFile(process.cwd() + '/available-etf.json', 'utf8')

	const etfs: Etf[] = JSON.parse(data)

	return etfs.filter((etf) => EXCHANGE_ACCEPTED.indexOf(etf.exchangeShortName) > -1 && (etf.name.includes('iShares') || TICKERS_ACCEPTED.indexOf(etf.symbol) > -1))
}

export const getProcessedEtf = async () => {
	// Fetch available etfs from file to reduce api calls
	const data = await fs.readFile(process.cwd() + '/available-etf.json', 'utf8')
	const allEtf: Etf[] = JSON.parse(data)

	const dbClient = await clientPromise
	const db = dbClient.db('etf')
	const tickers = await db.listCollections().toArray()

	const etfs = tickers.map(ticker => allEtf.find(etf => etf.symbol === ticker.name) as Etf)

	return etfs
}

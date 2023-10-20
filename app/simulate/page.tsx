import { redirect } from "next/navigation"
import { getAvailableEtf, getEtfRatesByTicker } from "../(utils)/Etf"
import SimulationStats from "../(components)/SimulationStats"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

const SIMULATIONS_QUANTITY = 10000
const DEFAULT_INFLATION = 0.97

export default async function Simulate({ searchParams }: Props) {
	const {
		ticker,
		monthly_savings: monthlySavingsParam,
		investments_years: investmentsYears,
		inflation_per_year: inflationPerYear,
		simulation_type: simulationType,
		portfolio_value: portfolioValue,
	} = searchParams

	const inflationPerYearNumber = inflationPerYear
		? 1 - +inflationPerYear / 100
		: DEFAULT_INFLATION

	if (
		(!monthlySavingsParam && !portfolioValue) ||
		!investmentsYears ||
		!ticker
	) {
		redirect("/?error=Missing+parameters")
	}

	if (
		(monthlySavingsParam === undefined || +monthlySavingsParam === 0) &&
		(portfolioValue === undefined || +portfolioValue === 0)
	) {
		redirect(
			"/?error=Monthly+savings+and+portfolio+value+cannot+both+be+zero"
		)
	}

	const monthlySavings =
		monthlySavingsParam === undefined ? 0 : +monthlySavingsParam
	const startPortfolioValue = portfolioValue ? +portfolioValue : 0

	const etfs = await getAvailableEtf()
	const etf = etfs.find(
		(etf) => etf.symbol === ticker.toString().toUpperCase()
	)

	const totalMonths = investmentsYears ? +investmentsYears * 12 : 0
	const rates = await getEtfRatesByTicker(ticker.toString())

	const ratesPerMonth: number[][] = []
	rates.forEach((rate) => {
		if (!ratesPerMonth[rate.month]) {
			ratesPerMonth[rate.month] = []
		}
		ratesPerMonth[rate.month].push(rate.rate)
	})

	if (rates.length === 0) {
		redirect("/?error=No+tickers+found")
	}

	const simulations = []
	const simulationsWithInflation = []

	for (let c = 0; c < SIMULATIONS_QUANTITY; c++) {
		simulations[c] = +monthlySavings + startPortfolioValue
		simulationsWithInflation[c] = +monthlySavings + startPortfolioValue

		for (let month = 0; month < totalMonths - 1; month++) {
			if (simulationType === "seasonal") {
				const rand = Math.floor(
					Math.random() * (ratesPerMonth[month % 12].length - 1)
				)
				simulations[c] =
					simulations[c] * +ratesPerMonth[month % 12][rand] +
					+monthlySavings
				simulationsWithInflation[c] =
					simulationsWithInflation[c] *
						+ratesPerMonth[month % 12][rand] +
					+monthlySavings
			} else {
				const rand = Math.floor(Math.random() * (rates.length - 1))
				simulations[c] =
					simulations[c] * +rates[rand].rate + +monthlySavings
				simulationsWithInflation[c] =
					simulationsWithInflation[c] * +rates[rand].rate +
					+monthlySavings
			}

			if (month > 0 && month % 12 === 0) {
				simulationsWithInflation[c] =
					simulationsWithInflation[c] * inflationPerYearNumber
			}
		}
	}

	simulations.sort((a, b) => b - a)
	simulationsWithInflation.sort((a, b) => b - a)

	const totalInvestments = +monthlySavings * totalMonths + startPortfolioValue
	const belowInvestment = simulations.reduce((acc, simulation) => {
		if (simulation < totalInvestments) {
			acc++
		}

		return acc
	}, 0)

	const percentageBelowInvestment = (
		(belowInvestment / SIMULATIONS_QUANTITY) *
		100
	).toFixed(2)

	const belowInvestmentWithInflation = simulationsWithInflation.reduce(
		(acc, simulation) => {
			if (simulation < totalInvestments) {
				acc++
			}

			return acc
		},
		0
	)

	const percentageBelowInvestmentWithInflation = (
		(belowInvestmentWithInflation / SIMULATIONS_QUANTITY) *
		100
	).toFixed(2)

	return (
		<main className='flex flex-col items-center justify-between w-full px-24 py-12 gap-6'>
			<div className='flex flex-col gap-4 w-full'>
				<h1 className='text-2xl font-bold'>{etf?.name}</h1>
				<div className='flex justify-between w-full'>
					<SimulationStats
						totalInvestments={totalInvestments}
						percentageBelowInvestment={+percentageBelowInvestment}
						simulations={simulations}
						simulationsQuantity={SIMULATIONS_QUANTITY}
					/>
					<SimulationStats
						totalInvestments={totalInvestments}
						percentageBelowInvestment={
							+percentageBelowInvestmentWithInflation
						}
						simulations={simulationsWithInflation}
						simulationsQuantity={SIMULATIONS_QUANTITY}
						inflation={-(+inflationPerYearNumber * 100 - 100)}
					/>
				</div>
			</div>
		</main>
	)
}

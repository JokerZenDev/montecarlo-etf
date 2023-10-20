import { bestXPercent } from "../(utils)/Stats"

type Props = {
	totalInvestments: number
	percentageBelowInvestment: number
	simulations: number[]
	simulationsQuantity: number
	inflation?: number
}

const BEST_PERCENTAGE = 10

const formatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
})

export default function SimulationStats({
	totalInvestments,
	percentageBelowInvestment,
	simulations,
	simulationsQuantity,
	inflation,
}: Props) {
	return (
		<div className='flex flex-col gap-1 w-1/2'>
			<h3 className='text-xl font-semibold pb-2'>
				{inflation && `With inflation (${inflation}% per year)`}
				{!inflation && `Without inflation`}
			</h3>
			<span>
				Total money put in: {formatter.format(totalInvestments)}
			</span>
			<span>
				Percentage below investment: {percentageBelowInvestment}%
			</span>
			<span>
				Worst simulation:{" "}
				{formatter.format(simulations[simulationsQuantity - 1])}
			</span>
			<span>
				Worst {BEST_PERCENTAGE}% of simulations:{" "}
				{formatter.format(
					bestXPercent(simulations, 1 - BEST_PERCENTAGE / 100, false)
				)}
			</span>
			<span>
				Average simulation:{" "}
				{formatter.format(
					simulations.reduce((a, b) => a + b, 0) / simulationsQuantity
				)}
			</span>
			<span>
				Best {BEST_PERCENTAGE}% of simulations:{" "}
				{formatter.format(
					bestXPercent(simulations, BEST_PERCENTAGE / 100, true)
				)}
			</span>
			<span>Best simulations: {formatter.format(simulations[0])}</span>
		</div>
	)
}

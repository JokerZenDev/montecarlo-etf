import { bestXPercent } from "../(utils)/Stats"
import BarChart from "./BarChart"

type Props = {
	simulations: number[]
	simulationsWithInflation: number[]
	totalInvestments: number
}

const STEPS_NUMBER = 250
const BEST_PERCENTAGE = 0.1

const formatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
})

export default function BarChartSimulations({
	simulations,
	simulationsWithInflation,
	totalInvestments,
}: Props) {
	const minValue = Math.min(
		simulations[simulations.length - 1],
		simulationsWithInflation[simulationsWithInflation.length - 1],
		totalInvestments
	)
	const maxValue = Math.max(
		bestXPercent(simulations, BEST_PERCENTAGE, true),
		bestXPercent(simulationsWithInflation, BEST_PERCENTAGE, true),
		totalInvestments
	)

	const minExponential = Math.floor(Math.log10(minValue))
	const minPow = Math.pow(10, minExponential)
	const minValueAdjusted = Math.floor(minValue / minPow) * minPow
	const maxValueAdjusted = Math.ceil(maxValue / minPow) * minPow

	const stepSize = Math.ceil(
		(maxValueAdjusted - minValueAdjusted) / STEPS_NUMBER
	)

	const simulationsSteps = new Array(STEPS_NUMBER).fill(0)
	const simulationsWithInflationSteps = new Array(STEPS_NUMBER).fill(0)
	for (let i = 0; i < simulations.length - 1; i++) {
		const simulation = simulations[i]
		const simulationWithInflation = simulationsWithInflation[i]

		if (simulation <= maxValue) {
			simulationsSteps[
				Math.floor((simulation - minValueAdjusted) / stepSize)
			]++
		}
		if (simulationWithInflation <= maxValue) {
			simulationsWithInflationSteps[
				Math.floor(
					(simulationWithInflation - minValueAdjusted) / stepSize
				)
			]++
		}
	}

	const totalInvestmentsStep = Math.ceil(
		Math.abs(totalInvestments - minValueAdjusted) / stepSize
	)

	const maxYChart = Math.max(
		...[...simulationsSteps, ...simulationsWithInflationSteps]
	)

	const app = new Array(totalInvestmentsStep)
	app[totalInvestmentsStep - 1] = Math.ceil(
		(maxYChart / simulations.length) * 100
	)

	const data = {
		labels: simulationsSteps.map(
			(x, idx) =>
				formatter.format(stepSize * idx + minValueAdjusted)
				// " - " +
				// formatter.format(stepSize * (idx + 1) + minValueAdjusted)
		),
		datasets: [
			{
				label: "Simulations %",
				data: simulationsSteps.map(
					(simulation) => (simulation / simulations.length) * 100
				),
				backgroundColor: "rgba(0, 128, 0, 0.5)",
			},
			{
				label: "Simulations with inflation %",
				data: simulationsWithInflationSteps.map(
					(simulation) =>
						(simulation / simulationsWithInflation.length) * 100
				),
				backgroundColor: "rgba(255, 65, 0, 0.5)",
			},
			{
				label: "Total investments",
				data: app,
				backgroundColor: "rgb(65, 105, 225)",
			},
		],
	}

	return (
		<BarChart
			data={data}
			options={{
				scales: {
					x: {
						display: true,
						// type: "linear",
						min: 0,
						max: 500,
						ticks: { autoSkip: true, maxTicksLimit: 15 },
					},
				},
			}}
		/>
	)
}

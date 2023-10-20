export function bestXPercent(array: number[], percent: number, fromLeft: boolean): number {
	const length = array.length

	if (fromLeft) {
		return array
			.slice(0, Math.floor(length * percent))
			.reduce((a, b) => a + b, 0) /
			(Math.floor(length * percent))
	} else {
		return array
			.slice(
				Math.floor(length * percent),
				length - 1
			)
			.reduce((a, b) => a + b, 0) /
			(length -
				Math.floor(length * percent))
	}
}
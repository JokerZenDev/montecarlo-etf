"use client"

import Select from "react-select"

export default function CustomSelect({
	options,
	name
}: {
	options: { value: string; label: string }[]
	name: string
}) {
	return (
		<Select
			options={options}
			className="min-w-[40rem]"
			name={name}
		/>
	)
}

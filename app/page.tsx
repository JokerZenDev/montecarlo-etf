import InputGroup from "./(components)/InputGroup"
import { getProcessedEtf } from "./(utils)/Etf"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Home({ searchParams }: Props) {
	const { error } = searchParams
	const etfs = await getProcessedEtf()

	return (
		<main className='flex flex-col items-center'>
			<form action='/simulate' className='flex flex-col gap-2'>
				<InputGroup>
					<label htmlFor='ticker'>Choose ETF:</label>
					<select name='ticker' id='ticker'>
						{etfs.map((etf) => (
							<option key={etf.symbol} value={etf.symbol}>
								{etf.name}
							</option>
						))}
					</select>
				</InputGroup>
				<InputGroup>
					<label htmlFor='portfolio_value'>Portfolio value:</label>
					<input
						type='number'
						name='portfolio_value'
						id='portfolio_value'
						step='0.01'
						min='0'
						defaultValue='0'
						className='border-b border-gray-300 w-[7.5rem]'
					/>
				</InputGroup>
				<InputGroup>
					<label htmlFor='monthly_savings'>Monthly savings:</label>
					<input
						type='number'
						name='monthly_savings'
						id='monthly_savings'
						step='0.01'
						min='0'
						defaultValue='0'
						className='border-b border-gray-300 w-[7.5rem]'
					/>
				</InputGroup>
				<InputGroup>
					<label htmlFor='investments_years'>
						Investments years:
					</label>
					<input
						type='number'
						name='investments_years'
						id='investments_years'
						step='1'
						min='1'
						defaultValue='1'
						className='border-b border-gray-300 w-[5rem]'
					/>
				</InputGroup>
				<InputGroup>
					<label htmlFor='inflation_per_year'>
						Inflation per year (%):
					</label>
					<input
						type='number'
						name='inflation_per_year'
						id='inflation_per_year'
						step='0.01'
						min='0'
						defaultValue='3'
						className='border-b border-gray-300 w-[5rem]'
					/>
				</InputGroup>
				<input
					type='hidden'
					name='simulation_type'
					id='simulation_type'
					defaultValue='seasonal'
				/>
				<button
					type='submit'
					className='bg-gray-500 text-white px-4 py-2'
				>
					Run simulations
				</button>
				{error && <p className='text-red-500'>{error}</p>}
			</form>
		</main>
	)
}

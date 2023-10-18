import Link from "next/link"

export default function Header() {
	return (
		<header className='flex items-center justify-between w-full py-4 px-8'>
			<span>MonteCarlo ETF</span>
			<div>
				<Link href={"/"}>Home</Link>
			</div>
		</header>
	)
}

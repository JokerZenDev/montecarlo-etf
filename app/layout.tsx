import "./globals.css"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import Header from "./(components)/Header"

const inter = Poppins({ weight: "400", subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Montecarlo ETF",
	description:
		"Montecarlo ETF is a tool to simulate the performance of ETFs with historical data and Monte Carlo simulations.",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body
				className={`${inter.className} flex min-h-screen flex-col items-center justify-between`}
			>
				<Header />
				{children}
				<footer>Copyright © 2023</footer>
			</body>
		</html>
	)
}

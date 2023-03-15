import * as dotenv from "dotenv"
dotenv.config()

import { ThirdwebSDK } from "@thirdweb-dev/sdk"
import { readFileSync } from "fs"
import { BigNumber, ethers } from "ethers"

const watch = async () => {
	const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

	const sdk = ThirdwebSDK.fromPrivateKey(
		process.env.PRIVATE_KEY || "",
		"ethereum"
	)

	const contract = await sdk.getContractFromAbi(
		usdcAddress,
		JSON.parse(readFileSync("./USDCAbi.json", "utf8"))
	)

	try {
		contract.events.listenToAllEvents((event) => {
			if (event.eventName) {
				console.log("Event name:", event.eventName)

				console.log(
					"New transfer of",
					ethers.utils.formatEther(event.data.value as BigNumber),
					"USDC"
				)
			}
		})
	} catch (error) {
		console.error(error)
	}
}

watch()

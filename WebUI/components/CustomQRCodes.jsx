/*
 * See https://github.com/eddyoc/react-native-custom-qr-codes-expo
 *
 * This library does not work on Expo Web but does work on iOS and Android.
 * The linearGradient option doesn't seem to work.
 */

import { QRCode as CustomQRCode } from "react-native-custom-qr-codes-expo";

export default function CustomQRCodes() {
	return (
		<>
			<CustomQRCode
				codeStyle="circle"
				linearGradient={["green", "red"]}
				content="QR code with circles"
			/>
			<CustomQRCode
				backgroundImage={require("../assets/colours.png")}
				content="QR code with background image"
			/>
		</>
	);
}

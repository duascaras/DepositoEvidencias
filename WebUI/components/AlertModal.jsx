import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AlertModal = ({ visible, message, onClose }) => {
	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="none"
			onRequestClose={onClose}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.modalText}>{message}</Text>
					<TouchableOpacity
						style={[styles.modalButton, styles.confirmButton]}
						onPress={onClose}
					>
						<Text style={styles.buttonText}>OK</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
	},
	modalText: {
		fontSize: 18,
		marginBottom: 20,
		textAlign: "center",
	},
	modalButton: {
		padding: 10,
		borderRadius: 5,
		backgroundColor: "#2A316E",
	},
	buttonText: {
		color: "white",
		textAlign: "center",
		fontWeight: "bold",
	},
});

export default AlertModal;

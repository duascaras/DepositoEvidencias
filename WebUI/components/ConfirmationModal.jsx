import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ConfirmationModal = ({ visible, message, onConfirm, onCancel }) => {
	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="none"
			onRequestClose={onCancel}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.modalText}>{message}</Text>
					<View style={styles.modalButtons}>
						<TouchableOpacity
							style={[styles.modalButton, styles.cancelButton]}
							onPress={onCancel}
						>
							<Text style={styles.buttonText}>Cancelar</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.modalButton, styles.confirmButton]}
							onPress={onConfirm}
						>
							<Text style={styles.buttonText}>Confirmar</Text>
						</TouchableOpacity>
					</View>
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
	},
	modalText: {
		fontSize: 18,
		marginBottom: 20,
		textAlign: "center",
	},
	modalButtons: {
		flexDirection: "row",
	},
	modalButton: {
		padding: 10,
		borderRadius: 5,
		flex: 1,
		marginHorizontal: 5,
	},
	cancelButton: {
		backgroundColor: "#f44a4a",
	},
	confirmButton: {
		backgroundColor: "#2A316E",
	},
	buttonText: {
		color: "white",
		textAlign: "center",
		fontWeight: "bold",
	},
});

export default ConfirmationModal;

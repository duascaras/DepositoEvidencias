import axios from "axios";
import { useState } from "react";

export const getItems = async () => {
	const API_URL = "http://localhost:5021/api/Itens/exibir-itens";

	const [itemInfo, setItemInfo] = useState({});
	const { data } = await axios.get(API_URL);
	console.log(data);
	setItemInfo(data);
};

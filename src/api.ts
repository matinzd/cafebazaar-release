import axios from "axios";
import { baseUrl } from "./constants";

export const api = axios.create({ baseURL: baseUrl });

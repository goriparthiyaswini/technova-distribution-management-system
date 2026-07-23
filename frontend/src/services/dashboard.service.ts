import api from "../api/axios";
import type { DashboardSummary } from "../types";

export const getDashboardSummary = () => api.get<DashboardSummary>("/dashboard/summary").then((r) => r.data);
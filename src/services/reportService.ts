
export interface MedicalStats {
  totalDiagnoses: number;
  criticalCases: number;
  recoveredPatients: number;
  diagnosisDistribution: { category: string; value: number }[];
}

export interface FinancialStats {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  monthlyPerformance: { month: string; revenue: number; expenses: number }[];
  revenueByDepartment: { dept: string; value: number }[];
}

export interface OperationalStats {
  avgWaitTime: number; // in minutes
  clinicOccupancy: number; // percentage
  staffEfficiency: number; // percentage
  appointmentsByStatus: { status: string; count: number }[];
  waitingTimeTrend: { day: string; time: number }[];
}

export interface DoctorPerformance {
  doctorId: string;
  name: string;
  specialty: string;
  patientsTreated: number;
  avgRating: number;
  efficiency: number;
}

export interface AnalyticsData {
  medical: MedicalStats;
  financial: FinancialStats;
  operational: OperationalStats;
  doctorPerformance: DoctorPerformance[];
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const response = await fetch('/api/analytics/full-report');
  if (!response.ok) throw new Error('Failed to fetch analytics data');
  return response.json();
}

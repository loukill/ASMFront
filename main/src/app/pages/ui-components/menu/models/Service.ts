export interface Service {
  id: number;
  name?: string;
  description?: string;
  prix?: number;
  posId: number;
  userServices?: any; // Modifier selon les besoins
}

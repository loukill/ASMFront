export interface Event {
  id: number;
  description: string;
  dateRequest: Date;
  eventStatus: string;
  prestataireName: string;
  adminName: string;
  clientId?: string;
  prestataireId?: string;
  clientName?: String;
  posId?: number;
  serviceId?: number;
}

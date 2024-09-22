import { Service } from "../../ui-components/menu/models/Service";
import { Prestataire } from "../../ui-components/menu/models/Prestataire";

export interface POSWithDetails {
  posId: number;
  posName: string;
  posLocation: string;
  imageUrl: string;
  adminId?: string;
  admin?: any; // Modifier selon les besoins
  services: Service[];
  clients: any[]; // Modifier selon les besoins
  prestataires: Prestataire[];
}

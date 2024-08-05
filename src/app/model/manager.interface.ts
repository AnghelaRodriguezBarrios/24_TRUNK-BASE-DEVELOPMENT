export interface Manager {
  id: number | undefined;
  lastName: string | undefined;
  firstName: string | undefined;
  documentType?: string | undefined;
  documentNumber?: string | undefined;
  address?: string | undefined;
  ubigeoId?: number | undefined;
  email?: string | undefined;
  status?: string | undefined;
  className?: string | undefined; 
}

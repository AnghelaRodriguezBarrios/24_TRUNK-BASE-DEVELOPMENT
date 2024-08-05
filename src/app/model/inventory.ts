export interface Inventory {
    id: string;
    area: string;
    code: string;
    description: string;
    amount: string; // Ajusta el tipo según corresponda en tu caso específico
    modality: string;
    date: Date; // Utiliza Date para representar fechas en TypeScript
    status: string;
    manager_id: string;
  }

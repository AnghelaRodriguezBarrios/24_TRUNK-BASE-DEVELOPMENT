export interface Payment {
    id?: number | undefined;
    manager: {
      id: string | undefined;
      firstName: string | undefined;
      lastName: string | undefined;
    };
    description: string | undefined;
    dueDate: string | undefined;
    date: string | undefined;
    amount: string | undefined;
    status: string | undefined;
    className?: string | undefined;
  }
  
import { Prescription } from './inventoryService';

const prescriptions: Prescription[] = [
  {
    id: 'pr1',
    patientId: 'p1',
    doctorId: 'd1',
    date: '2024-04-28',
    status: 'Pending',
    items: [
      { medicationId: '1', dosage: 'مرة واحدة يومياً', quantity: 1, status: 'Pending' },
      { medicationId: '2', dosage: 'عند اللزوم', quantity: 2, status: 'Pending' },
    ]
  },
  {
    id: 'pr2',
    patientId: 'p2',
    doctorId: 'd2',
    date: '2024-04-27',
    status: 'Completed',
    items: [
      { medicationId: '2', dosage: '3 مرات يومياً', quantity: 1, status: 'Dispensed' },
    ]
  }
];

export const pharmacyService = {
  getPrescriptions: async (): Promise<Prescription[]> => {
    const res = await fetch('/api/pharmacy/prescriptions');
    return res.json();
  },
  getPendingPrescriptions: async (): Promise<Prescription[]> => {
    const p = await pharmacyService.getPrescriptions();
    return p.filter(x => x.status === 'Pending');
  },
  dispensePrescription: async (id: string) => {
    const res = await fetch(`/api/pharmacy/dispense/${id}`, { method: 'POST' });
    return res.json();
  }
};

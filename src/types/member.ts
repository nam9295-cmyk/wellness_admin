export type Member = {
  id: string;
  name: string;
  age: number;
  room: string;
  guardian: string;
  status: 'Stable' | 'Attention' | 'Check';
  lastCheckTime: string;
  note: string;
};

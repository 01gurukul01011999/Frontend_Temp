export type Ticket = {
  id: string;
  createdOn: string;
  issue: string;
  lastUpdate?: string;
  status: 'Needs Attention' | 'In Progress' | 'Closed' | 'All';
};

export const mockTickets: Ticket[] = [
  {
    id: '8732800747553',
    createdOn: '2024-11-28T19:02:00',
    issue: 'I have received wrong return',
    lastUpdate:
      "Your claim payment of Rs 1521.04 for this order was done on 03 Dec 2024 with a transaction id: IN6ON241203046NK",
    status: 'Closed',
  },
  {
    id: '8732799822707',
    createdOn: '2024-11-28T18:47:00',
    issue: 'I have received damaged return',
    lastUpdate: '',
    status: 'Closed',
  },
  {
    id: '8732797792668',
    createdOn: '2024-11-28T18:13:00',
    issue: 'I have received damaged return',
    lastUpdate:
      "Your claim payment of Rs 231.81 for this order was done on 02 Dec 2024 with a transaction id: IN6ON24120204ULV",
    status: 'Closed',
  },
  {
    id: '8732796547453',
    createdOn: '2024-11-28T17:52:00',
    issue: 'I have received damaged return',
    lastUpdate: '',
    status: 'Needs Attention',
  },
];

// export default removed; use named export `mockTickets`

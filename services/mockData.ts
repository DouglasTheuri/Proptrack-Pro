
import { Owner, Building, Unit, Tenant } from '../types';

export const mockOwners: Owner[] = [
  { id: 'o1', name: 'John Smith', email: 'john@example.com', phone: '555-0101', paymentInfo: 'Chase Bank ...' },
  { id: 'o2', name: 'Sarah Wilson', email: 'sarah@example.com', phone: '555-0102', paymentInfo: 'BofA ...' }
];

export const mockBuildings: Building[] = [
  { id: 'b1', ownerId: 'o1', name: 'Skyline Apartments', address: '123 View St', managementFeePercent: 10 },
  { id: 'b2', ownerId: 'o1', name: 'Green Garden', address: '456 Bloom Ave', managementFeePercent: 10 },
  { id: 'b3', ownerId: 'o2', name: 'The Heights', address: '789 Summit Rd', managementFeePercent: 10 }
];

export const mockUnits: Unit[] = [
  { id: 'u1', buildingId: 'b1', unitNumber: '101', unitType: '2 Bedrooms', monthlyRent: 1200, status: 'Occupied' },
  { id: 'u2', buildingId: 'b1', unitNumber: '102', unitType: '1 Bedroom', monthlyRent: 850, status: 'Occupied' },
  { id: 'u3', buildingId: 'b1', unitNumber: '103', unitType: 'Bedsitter', monthlyRent: 500, status: 'Vacant' },
  { id: 'u4', buildingId: 'b2', unitNumber: 'A1', unitType: '3 Bedrooms', monthlyRent: 1800, status: 'Occupied' },
  { id: 'u5', buildingId: 'b3', unitNumber: 'PH-1', unitType: 'Gated', monthlyRent: 3500, status: 'Occupied' }
];

export const mockTenants: Tenant[] = [
  { id: 't1', unitId: 'u1', name: 'Alice Johnson', email: 'alice@test.com', phone: '555-1234', moveInDate: '2023-01-15', rentAmount: 1200, deposit: 1200 },
  { id: 't2', unitId: 'u2', name: 'Bob Roberts', email: 'bob@test.com', phone: '555-5678', moveInDate: '2023-03-01', rentAmount: 850, deposit: 850 },
  { id: 't3', unitId: 'u4', name: 'Charlie Davis', email: 'charlie@test.com', phone: '555-9012', moveInDate: '2022-11-20', rentAmount: 1800, deposit: 1800 },
  { id: 't4', unitId: 'u5', name: 'Eve Evans', email: 'eve@test.com', phone: '555-3456', moveInDate: '2023-06-10', rentAmount: 3500, deposit: 3500 }
];


import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { Building, Owner, Unit } from '../types';
import { Icons, UNIT_TYPES } from '../constants';

const BuildingsManager: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [showAddOwner, setShowAddOwner] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'buildings' | 'owners'>('buildings');

  const refreshData = () => {
    setBuildings(dataService.getBuildings());
    setOwners(dataService.getOwners());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAddBuilding = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newBuilding = dataService.addBuilding({
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      ownerId: formData.get('ownerId') as string,
      managementFeePercent: Number(formData.get('fee')) || 10
    });
    setBuildings([...buildings, newBuilding]);
    setShowAddBuilding(false);
  };

  const handleAddOwner = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOwner = dataService.addOwner({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      paymentInfo: formData.get('paymentInfo') as string,
    });
    setOwners([...owners, newOwner]);
    setShowAddOwner(false);
  };

  const handleDeleteBuilding = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this building and all its units?")) {
      try {
        dataService.deleteBuilding(id);
        if (selectedBuildingId === id) setSelectedBuildingId(null);
        refreshData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleDeleteOwner = (id: string) => {
    if (window.confirm("Are you sure you want to remove this owner?")) {
      try {
        dataService.deleteOwner(id);
        refreshData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex bg-slate-200 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('buildings')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'buildings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Buildings
          </button>
          <button 
            onClick={() => setActiveTab('owners')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'owners' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Owners
          </button>
        </div>
        <button 
          onClick={() => activeTab === 'buildings' ? setShowAddBuilding(true) : setShowAddOwner(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Icons.Plus /> {activeTab === 'buildings' ? 'Add Building' : 'Add Owner'}
        </button>
      </div>

      {activeTab === 'buildings' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Buildings List */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Building</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Owner</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Fee</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {buildings.map(b => (
                  <tr 
                    key={b.id} 
                    className={`hover:bg-slate-50 cursor-pointer ${selectedBuildingId === b.id ? 'bg-indigo-50/50' : ''}`}
                    onClick={() => setSelectedBuildingId(b.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{b.name}</div>
                      <div className="text-xs text-slate-500">{b.address}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {owners.find(o => o.id === b.ownerId)?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{b.managementFeePercent}%</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={(e) => handleDeleteBuilding(b.id, e)} 
                          className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete Building"
                        >
                          <Icons.Trash />
                        </button>
                        <Icons.ChevronRight />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Units View */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h4 className="font-semibold text-slate-800">
                {selectedBuildingId 
                  ? `${buildings.find(b => b.id === selectedBuildingId)?.name} Units` 
                  : 'Select a building to view units'}
              </h4>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {selectedBuildingId ? (
                <div className="space-y-3">
                  {dataService.getUnits(selectedBuildingId).map(u => (
                    <div key={u.id} className="p-4 border border-slate-100 rounded-lg flex justify-between items-center hover:border-indigo-200 transition-colors">
                      <div>
                        <div className="font-bold text-slate-800">Unit {u.unitNumber}</div>
                        <div className="text-xs text-slate-500">{u.unitType} • ${u.monthlyRent}/mo</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        u.status === 'Occupied' ? 'bg-green-100 text-green-700' :
                        u.status === 'Vacant' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                  <Icons.Buildings />
                  <p className="mt-2">No building selected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Owners List */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Owner Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Contact</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Buildings</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {owners.map(o => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">{o.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div>{o.phone}</div>
                    <div className="text-xs opacity-70">{o.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {buildings.filter(b => b.ownerId === o.id).length}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteOwner(o.id)} 
                      className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete Owner"
                    >
                      <Icons.Trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Building Modal */}
      {showAddBuilding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Add New Building</h3>
            <form onSubmit={handleAddBuilding} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Building Name</label>
                <input required name="name" type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Address</label>
                <input required name="address" type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Owner</label>
                <select required name="ownerId" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                  {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Management Fee (%)</label>
                <input name="fee" type="number" defaultValue="10" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddBuilding(false)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Save Building</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Owner Modal */}
      {showAddOwner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Add New Owner</h3>
            <form onSubmit={handleAddOwner} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                <input required name="name" type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                <input required name="email" type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
                <input required name="phone" type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Payment Info</label>
                <textarea name="paymentInfo" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddOwner(false)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Save Owner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingsManager;

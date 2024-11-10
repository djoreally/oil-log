<tbody className="bg-white divide-y divide-gray-200">
{selectedVehicle.serviceHistory.map((record, idx) => (
  <tr key={idx} className="hover:bg-gray-100">
    <td className="px-4 py-2 text-gray-800">{record.serviceDate}</td>
    <td className="px-4 py-2 text-gray-800">{record.mileage}</td>
    <td className="px-4 py-2 text-gray-800">{record.oilType}</td>
    <td className="px-4 py-2 text-gray-800">{record.filterType}</td>
    <td className="px-4 py-2">
      <button
        onClick={() => handleDeleteServiceRecord(idx)}
        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
      >
        Delete
      </button>
    </td>
  </tr>
))}
</tbody>
</table>
</div>
</div>

{/* Add New Service Record */}
<div className="mt-6">
<h3 className="text-lg font-semibold mb-2">Add New Service Record</h3>
<form onSubmit={handleAddServiceRecord}>
<div className="mb-4">
<label className="block text-gray-700">Service Date</label>
<input
type="date"
value={newServiceRecord.serviceDate}
onChange={(e) =>
  setNewServiceRecord({
    ...newServiceRecord,
    serviceDate: e.target.value,
  })
}
className="p-3 border border-gray-300 rounded-md w-full bg-gray-100"
required
/>
</div>
<div className="mb-4">
<label className="block text-gray-700">Mileage</label>
<input
type="number"
value={newServiceRecord.mileage}
onChange={(e) =>
  setNewServiceRecord({
    ...newServiceRecord,
    mileage: e.target.value,
  })
}
className="p-3 border border-gray-300 rounded-md w-full bg-gray-100"
required
/>
</div>
<div className="mb-4">
<label className="block text-gray-700">Oil Type</label>
<input
type="text"
value={newServiceRecord.oilType}
onChange={(e) =>
  setNewServiceRecord({
    ...newServiceRecord,
    oilType: e.target.value,
  })
}
className="p-3 border border-gray-300 rounded-md w-full bg-gray-100"
required
/>
</div>
<div className="mb-4">
<label className="block text-gray-700">Filter Type</label>
<input
type="text"
value={newServiceRecord.filterType}
onChange={(e) =>
  setNewServiceRecord({
    ...newServiceRecord,
    filterType: e.target.value,
  })
}
className="p-3 border border-gray-300 rounded-md w-full bg-gray-100"
required
/>
</div>
<div className="mb-4">
<label className="block text-gray-700">Filter Part Number</label>
<input
type="text"
value={newServiceRecord.filterPartNumber}
onChange={(e) =>
  setNewServiceRecord({
    ...newServiceRecord,
    filterPartNumber: e.target.value,
  })
}
className="p-3 border border-gray-300 rounded-md w-full bg-gray-100"
required
/>
</div>
<div className="mb-4">
<label className="block text-gray-700">Additional Checks</label>
<textarea
value={newServiceRecord.additionalChecks}
onChange={(e) =>
  setNewServiceRecord({
    ...newServiceRecord,
    additionalChecks: e.target.value.split(","),
  })
}
className="p-3 border border-gray-300 rounded-md w-full bg-gray-100"
placeholder="List additional checks, separated by commas"
/>
</div>

<div className="mb-4">
<button
type="submit"
className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
>
Add Service Record
</button>
</div>
</form>
</div>
</div>
</div>
)}

{/* Add Vehicle Modal */}
{showAddVehicle && (
<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
<div className="bg-white p-6 rounded-lg w-3/4">
<h2 className="text-xl font-bold text-gray-800 mb-4">Add New Vehicle</h2>
<form onSubmit={handleAddVehicle}>
<div className="mb-4">
<label className="block text-gray-700">VIN</label>
<input
type="text"
value={newVehicle.vin}
onChange={(e) =>
setNewVehicle({ ...newVehicle, vin: e.target.value })
}
className="p-3 border border-gray-300 rounded-md w-full bg-gray-100"
required
/>
</div>
<div className="mb-4">
<label className="block text-gray-700">Make</label>
<input
type="text"
value={newVehicle.make}
onChange={(e) =>
setNewVehicle({ ...newVehicle, make: e.target.value })
}
className="p-3 border border-gray-300 rounded-md w-full bg-gray-100"
required
/>
</div>
<div className="mb-4">
<label className="block text-gray-700">Model</label>
<input
type="text"
value={newVehicle.model}
onChange={(e) =>
setNewVehicle({ ...newVehicle, model: e.target.value })
}
className="p-3 border border-gray-300 rounded-md w-full bg-gray-100"
required
/>
</div>
<div className="mb-4">
<label className="block text-gray-700">Year</label>
<input
type="text"
value={newVehicle.year}
onChange={(e) =>
setNewVehicle({ ...newVehicle, year: e.target.value })
}
className="p-3 border border-gray-300 rounded-md w-full bg-gray-100"
required
/>
</div>
<div className="mb-4">
<label className="block text-gray-700">Owner Name</label>
<input
type="text"
value={newVehicle.ownerName}
onChange={(e) =>
setNewVehicle({ ...newVehicle, ownerName: e.target.value })
}
className="p-3 border border-gray-300 rounded-md w-full bg-gray-100"
required
/>
</div>
<div className="mb-4">
<label className="block text-gray-700">Owner Phone</label>
<input
type="text"
value={newVehicle.ownerPhone}
onChange={(e) =>
setNewVehicle({ ...newVehicle, ownerPhone: e.target.value })
}
className="p-3 border border-gray-300 rounded-md w-full bg-gray-100"
required
/>
</div>

<div className="mb-4">
<button
type="submit"
className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
>
Add Vehicle
</button>
</div>
</form>
<button
onClick={() => setShowAddVehicle(false)}
className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 mt-4"
>
Close
</button>
</div>
</div>
)}

<ToastContainer />
</div>
);
};

export default OilChangeTracker;

"use client"; // This directive indicates it's a client-side component

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OilChangeTracker = () => {
  const [vehicles, setVehicles] = useState(() => {
    const savedVehicles = localStorage.getItem("vehicles");
    return savedVehicles ? JSON.parse(savedVehicles) : [];
  });

  const [newVehicle, setNewVehicle] = useState({
    vin: "",
    make: "",
    model: "",
    year: "",
    ownerName: "",
    ownerPhone: "",
    serviceHistory: [],
  });

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "make",
    direction: "asc",
  });
  const [newServiceRecord, setNewServiceRecord] = useState({
    serviceDate: "",
    mileage: "",
    oilType: "",
    oilCapacity: "",
    filterType: "",
    filterPartNumber: "",
    additionalChecks: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showServiceHistory, setShowServiceHistory] = useState(false);

  useEffect(() => {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }, [vehicles]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedVehicles = [...vehicles].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setVehicles(sortedVehicles);
  };

  const handleDeleteVehicle = (vin) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.vin !== vin));
    toast.success("Vehicle deleted successfully!");
    setShowDeleteConfirm(null); // close the confirm dialog
  };

  const handleAddServiceRecord = (e) => {
    e.preventDefault();
    if (selectedVehicle) {
      const updatedVehicle = { ...selectedVehicle };
      updatedVehicle.serviceHistory.push(newServiceRecord);
      setVehicles(
        vehicles.map((vehicle) =>
          vehicle.vin === selectedVehicle.vin ? updatedVehicle : vehicle
        )
      );
      setNewServiceRecord({
        serviceDate: "",
        mileage: "",
        oilType: "",
        oilCapacity: "",
        filterType: "",
        filterPartNumber: "",
        additionalChecks: [],
      });
      toast.success("Service record added successfully!");
      setShowServiceHistory(false); // Close the service history modal
    }
  };

  const handleSendSMS = (vin) => {
    const vehicle = vehicles.find((vehicle) => vehicle.vin === vin);
    if (vehicle && vehicle.ownerPhone) {
      const settings = {
        url: "https://api.d7networks.com/messages/v1/send",
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoLWJhY2tlbmQ6YXBwIiwic3ViIjoiZjYxMDA4OGUtMzI3Ny00ODI5LWEyNWEtNTgzOWJmZTU1MTI4In0.1Kpo58sbTW8BJoRBprR1VsL_YLMGzX0gktkknxnNhGU",
        },
        data: JSON.stringify({
          messages: [
            {
              channel: "sms",
              recipients: [vehicle.ownerPhone],
              content: "Greetings from D7 API",
              msg_type: "text",
              data_coding: "text",
            },
          ],
          message_globals: {
            originator: "SignOTP",
            report_url: "https://the_url_to_receive_delivery_report.com",
          },
        }),
      };

      fetch(settings.url, {
        method: settings.method,
        headers: settings.headers,
        body: settings.data,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          toast.success("SMS sent successfully!");
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Failed to send SMS.");
        });
    } else {
      toast.error("Vehicle owner phone number is missing.");
    }
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    setVehicles([...vehicles, newVehicle]);
    toast.success("Vehicle added successfully!");
    setNewVehicle({
      vin: "",
      make: "",
      model: "",
      year: "",
      ownerName: "",
      ownerPhone: "",
      serviceHistory: [],
    });
    setShowAddVehicle(false);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">
        Digital Oil Change Tracker
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Vehicles"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-md w-full bg-gray-100 text-black"
        />
      </div>

      {/* Add Vehicle Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddVehicle(true)}
          className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Add New Vehicle
        </button>
      </div>

      {/* Vehicle List */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-800">Vehicle List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full mt-2">
            <thead className="bg-blue-700 text-white">
              <tr>
                {["make", "model", "year", "ownerName", "vin"].map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-800"
                    onClick={() => handleSort(key)}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortConfig.key === key && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                ))}
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles
                .filter(
                  (vehicle) =>
                    vehicle.make
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    vehicle.model
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    vehicle.year.includes(searchTerm) ||
                    vehicle.vin.includes(searchTerm)
                )
                .map((vehicle, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-2 text-gray-800">{vehicle.make}</td>
                    <td className="px-4 py-2 text-gray-800">{vehicle.model}</td>
                    <td className="px-4 py-2 text-gray-800">{vehicle.year}</td>
                    <td className="px-4 py-2 text-gray-800">
                      {vehicle.ownerName}
                    </td>
                    <td className="px-4 py-2 text-gray-800">{vehicle.vin}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setShowServiceHistory(true);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 mr-2"
                      >
                        View Service History
                      </button>
                      <button
                        onClick={() => handleSendSMS(vehicle.vin)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 mr-2"
                      >
                        Send SMS
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(vehicle.vin)}
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

      {/* Service History Modal */}
      {showServiceHistory && selectedVehicle && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Service History for {selectedVehicle.make}{" "}
                {selectedVehicle.model}
              </h2>
              <button
                onClick={() => {
                  setShowServiceHistory(false);
                  setSelectedVehicle(null);
                }}
                className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Close
              </button>
            </div>

            {/* Service Record Table */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Service Records</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-blue-700 text-white">
                    <tr>
                      <th className="px-4 py-2">Service Date</th>
                      <th className="px-4 py-2">Mileage</th>
                      <th className="px-4 py-2">Oil Type</th>
                      <th className="px-4 py-2">Filter Type</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedVehicle.serviceHistory.length > 0 ? (
                      selectedVehicle.serviceHistory.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="px-4 py-2 text-gray-800">
                            {record.serviceDate}
                          </td>
                          <td className="px-4 py-2 text-gray-800">
                            {record.mileage}
                          </td>
                          <td className="px-4 py-2 text-gray-800">
                            {record.oilType}
                          </td>
                          <td className="px-4 py-2 text-gray-800">
                            {record.filterType}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => {
                                // Optional: Handle edit or delete service record
                              }}
                              className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition duration-200"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center text-gray-500 py-4"
                        >
                          No service records available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Service Record Form */}
            <form onSubmit={handleAddServiceRecord} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Add Service Record</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Service Date
                  </label>
                  <input
                    type="date"
                    value={newServiceRecord.serviceDate}
                    onChange={(e) =>
                      setNewServiceRecord({
                        ...newServiceRecord,
                        serviceDate: e.target.value,
                      })
                    }
                    className="p-2 border rounded w-full text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Mileage</label>
                  <input
                    type="number"
                    value={newServiceRecord.mileage}
                    onChange={(e) =>
                      setNewServiceRecord({
                        ...newServiceRecord,
                        mileage: e.target.value,
                      })
                    }
                    className="p-2 border rounded w-full text-gray-800"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Oil Type</label>
                  <input
                    type="text"
                    value={newServiceRecord.oilType}
                    onChange={(e) =>
                      setNewServiceRecord({
                        ...newServiceRecord,
                        oilType: e.target.value,
                      })
                    }
                    className="p-2 border rounded w-full text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Filter Type
                  </label>
                  <input
                    type="text"
                    value={newServiceRecord.filterType}
                    onChange={(e) =>
                      setNewServiceRecord({
                        ...newServiceRecord,
                        filterType: e.target.value,
                      })
                    }
                    className="p-2 border rounded w-full text-gray-800"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Add Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <p className="text-lg font-semibold text-red-600">
              Are you sure you want to delete this vehicle?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteVehicle(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add New Vehicle</h2>
            <form onSubmit={handleAddVehicle}>
              <input
                type="text"
                placeholder="VIN"
                value={newVehicle.vin}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, vin: e.target.value })
                }
                className="p-2 border rounded w-full mb-4 text-gray-800"
                required
              />
              <input
                type="text"
                placeholder="Make"
                value={newVehicle.make}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, make: e.target.value })
                }
                className="p-2 border rounded w-full mb-4 text-gray-800"
                required
              />
              <input
                type="text"
                placeholder="Model"
                value={newVehicle.model}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, model: e.target.value })
                }
                className="p-2 border rounded w-full mb-4 text-gray-800"
                required
              />
              <input
                type="text"
                placeholder="Year"
                value={newVehicle.year}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, year: e.target.value })
                }
                className="p-2 border rounded w-full mb-4 text-gray-800"
                required
              />
              <input
                type="text"
                placeholder="Owner Name"
                value={newVehicle.ownerName}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, ownerName: e.target.value })
                }
                className="p-2 border rounded w-full mb-4 text-gray-800"
                required
              />
              <input
                type="text"
                placeholder="Owner Phone"
                value={newVehicle.ownerPhone}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, ownerPhone: e.target.value })
                }
                className="p-2 border rounded w-full mb-4 text-gray-800"
                required
              />
              <button
                type="submit"
                className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Add Vehicle
              </button>
              <button
                onClick={() => setShowAddVehicle(false)}
                className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Container for Notifications */}
      <ToastContainer />
    </div>
  );
};

export default OilChangeTracker;

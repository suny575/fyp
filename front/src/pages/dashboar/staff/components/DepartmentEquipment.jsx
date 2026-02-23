import React, { useEffect, useState } from "react";
import axios from "axios";

const DepartmentEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await axios.get("/api/department/equipment", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setEquipment(res.data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleHistory = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <p>Loading equipment...</p>;

  return (
    <div>
      <h4 className="mb-4">Department Equipment</h4>

      {equipment.length === 0 ? (
        <p>No equipment assigned to your department.</p>
      ) : (
        <div className="list-group">
          {equipment.map((item) => (
            <div key={item._id} className="list-group-item mb-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{item.name}</h5>
                  <small>Status: {item.status}</small>
                </div>

                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => toggleHistory(item._id)}
                >
                  {expandedId === item._id ? "Hide History" : "View History"}
                </button>
              </div>

              {expandedId === item._id && (
                <div className="mt-3">
                  <h6>Service History</h6>
                  {item.serviceHistory?.length > 0 ? (
                    <ul>
                      {item.serviceHistory.map((service, index) => (
                        <li key={index}>
                          {service.date} — {service.description}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No service history available.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentEquipment;

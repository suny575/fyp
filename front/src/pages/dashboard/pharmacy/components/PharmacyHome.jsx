// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/PharmacyHome.css";

// const PharmacyHome = () => {
//   const navigate = useNavigate();

//   // Dummy data for overview cards
//   const dashboardData = [
//     {
//       title: "Total Equipment",
//       count: 120,
//       description: "All registered equipment in the pharmacy",
//       link: "/pharmacy/equipment",
//     },
//     {
//       title: "Total Stock Items",
//       count: 340,
//       description: "Consumables, spare parts, and accessories",
//       link: "/pharmacy/stock",
//     },
//     {
//       title: "Low Stock Items",
//       count: 15,
//       description: "Items that need restocking soon",
//       link: "/pharmacy/alerts",
//     },
//     {
//       title: "Expiring Soon",
//       count: 8,
//       description: "Consumables nearing expiry",
//       link: "/pharmacy/alerts",
//     },
//     {
//       title: "Recent Allocations",
//       count: 25,
//       description: "Assignments to departments",
//       link: "/pharmacy/allocation",
//     },
//     {
//       title: "Reports",
//       count: 12,
//       description: "Inventory and usage reports",
//       link: "/pharmacy/reports",
//     },
//   ];

//   return (
//     <div className="pharmacy-home-container">
//       <h3>Pharmacy Dashboard</h3>

//       <div className="dashboard-cards">
//         {dashboardData.map((card, index) => (
//           <div key={index} className="dashboard-card">
//             <h3>{card.title}</h3>
//             <p className="card-count">{card.count}</p>
//             <p className="card-desc">{card.description}</p>
//             <button onClick={() => navigate(card.link)}>View Details</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PharmacyHome;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PharmacyHome.css";

const PharmacyHome = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/pharmacy/dashboard");
        const data = await res.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    fetchDashboard();
  }, []);

  if (!dashboardData) return <p>Loading...</p>;

  const cards = [
    {
      title: "Total Equipment",
      count: dashboardData.totalEquipment,
      description: "All registered equipment in the pharmacy",
      link: "/pharmacy/equipment",
    },
    {
      title: "Total Stock Items",
      count: dashboardData.totalStock,
      description: "Consumables, spare parts, and accessories",
      link: "/pharmacy/stock",
    },
    {
      title: "Low Stock Items",
      count: dashboardData.lowStock,
      description: "Items that need restocking soon",
      link: "/pharmacy/alerts",
    },
    {
      title: "Expired Items",
      count: dashboardData.expired,
      description: "Consumables that already expired",
      link: "/pharmacy/alerts",
    },
    {
      title: "Total Allocations",
      count: dashboardData.totalAllocations,
      description: "Assignments to departments",
      link: "/pharmacy/allocation",
    },
    {
      title: "Reports",
      count: dashboardData.totalReports,
      description: "Inventory and usage reports",
      link: "/pharmacy/reports",
    },
  ];

  return (
    <div className="pharmacy-home-container">
      <h3>Pharmacy Dashboard</h3>

      <div className="dashboard-cards">
        {cards.map((card, index) => (
          <div key={index} className="dashboard-card">
            <h3>{card.title}</h3>
            <p className="card-count">{card.count}</p>
            <p className="card-desc">{card.description}</p>
            <button onClick={() => navigate(card.link)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PharmacyHome;
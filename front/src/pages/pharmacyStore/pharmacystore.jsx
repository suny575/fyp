import React from "react";
import { Container, Card, Table } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Sidebar from "../components/Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const data = {
  labels: ["MRI Scanner", "X-Ray Machine", "Ventilator", "ECG Monitor"],
  datasets: [
    {
      label: "Maintenance Completed",
      data: [5, 3, 7, 2],
      backgroundColor: "#4e73df",
    },
    {
      label: "Pending Maintenance",
      data: [2, 1, 1, 0],
      backgroundColor: "#f6c23e",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top", labels: { color: "#FFFFFF" } },
    title: { display: true, text: "Maintenance Report", color: "#FFFFFF" },
  },
  scales: {
    x: { ticks: { color: "#FFFFFF" } },
    y: { ticks: { color: "#FFFFFF" }, beginAtZero: true },
  },
};

function Login() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Container style={{ marginLeft: "240px", paddingTop: "30px" }}>
        <Card
          className="shadow-lg mb-4"
          style={{
            borderRadius: "15px",
            backgroundColor: "#121C3F",
            color: "#FFFFFF",
          }}
        >
          <Card.Body>
            <Bar data={data} options={options} />
          </Card.Body>
        </Card>
        <Card
          className="shadow-lg"
          style={{
            borderRadius: "15px",
            backgroundColor: "#1C294D",
            color: "#FFFFFF",
          }}
        >
          <Card.Body>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Completed Tasks</th>
                  <th>Pending Tasks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Router</td>
                  <td>5</td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>Printer</td>
                  <td>3</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>Laptop</td>
                  <td>7</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>Scanner</td>
                  <td>2</td>
                  <td>0</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Login;

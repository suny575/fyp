import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaBoxes, FaTools, FaInfoCircle, FaChartBar } from 'react-icons/fa';

function Sidebar() {
  const sidebarStyle = {
    height: '100vh',
    width: '220px',
    backgroundColor: '#121C3F',
    paddingTop: '20px',
    position: 'fixed'
  };

  const linkStyle = {
    color: '#A0B1D1',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px'
  };

  return (
    <div style={sidebarStyle}>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/" style={linkStyle}>
          <FaHome className="me-2" /> Home
        </Nav.Link>
        <Nav.Link as={Link} to="/stock" style={linkStyle}>
          <FaBoxes className="me-2" /> Stock Management
        </Nav.Link>
        <Nav.Link as={Link} to="/maintenance" style={linkStyle}>
          <FaTools className="me-2" /> Scheduled Maintenance
        </Nav.Link>
        <Nav.Link as={Link} to="/reporting" style={linkStyle}>
          <FaChartBar className="me-2" /> Reporting
        </Nav.Link>
        <Nav.Link as={Link} to="/aboutus" style={linkStyle}>
          <FaInfoCircle className="me-2" /> About Us
        </Nav.Link>
      </Nav>
    </div>
  );
}

export default Sidebar;

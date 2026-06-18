import axios from 'axios'; // Import Axios for making HTTP requests
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2'; // Import Pie chart component

Chart.register(ArcElement, Tooltip, Legend);

// Netlify वर काम करण्यासाठी Live URL सेट केला आहे
const API_URL = process.env.REACT_APP_BACKEND_URL || 'https://water-quality-monitoring-8.onrender.com';

const styles = {
    mainContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    container: {
        width: '65%', 
        margin: '20px',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    chartContainer: {
        width: '30%', 
        height: '350px', 
        margin: '20px',
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px', 
        boxSizing: 'border-box',
    },
    complaintItem: {
        marginBottom: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    buttonContainer: {
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'center',
    },
    button: {
        margin: '0 10px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '4px',
    },
    acceptButton: {
        backgroundColor: 'green',
        color: '#fff',
    },
    rejectButton: {
        backgroundColor: 'red',
        color: '#fff',
    },
    acknowledgement: {
        marginTop: '10px',
        textAlign: 'center',
    },
    complaintType: {
        fontWeight: 'bold',
        marginBottom: '10px',
    },
};

function Admin() {
    const [complaints, setComplaints] = useState([]);
    const [acknowledgements, setAcknowledgements] = useState({});
    const [statusCounts, setStatusCounts] = useState({ accepted: 0, rejected: 0, pending: 0 });

    useEffect(() => {
        // Fetch complaints from the backend
        const fetchComplaints = async () => {
            try {
                // इथे Live URL वापरला आहे
                const response = await axios.get(`${API_URL}/api/complaints/getAll`);
                setComplaints(response.data);
                updateStatusCounts(response.data);
            } catch (error) {
                console.error('Error fetching complaints:', error);
            }
        };

        fetchComplaints();
    }, []);

     const handleAccept = async (id) => {
    try {
        await axios.put(
            `${API_URL}/api/complaints/accept/${id}`
        );

        setAcknowledgements({
            ...acknowledgements,
            [id]: `Complaint with ID ${id} accepted`,
        });

        const updatedComplaints = complaints.map((complaint) =>
            complaint.id === id
                ? { ...complaint, status: "ACCEPTED" }
                : complaint
        );

        setComplaints(updatedComplaints);
        updateStatusCounts(updatedComplaints);

    } catch (error) {
        console.error("Error accepting complaint:", error);
    }
};
    const handleReject = async (id) => {
    try {
        await axios.put(
            `${API_URL}/api/complaints/reject/${id}`
        );

        setAcknowledgements({
            ...acknowledgements,
            [id]: `Complaint with ID ${id} rejected`,
        });

        const updatedComplaints = complaints.map((complaint) =>
            complaint.id === id
                ? { ...complaint, status: "REJECTED" }
                : complaint
        );

        setComplaints(updatedComplaints);
        updateStatusCounts(updatedComplaints);

    } catch (error) {
        console.error("Error rejecting complaint:", error);
    }
};


    const updateComplaintStatus = (id, status) => {
        setComplaints((prevComplaints) =>
            prevComplaints.map((complaint) =>
                complaint.id === id ? { ...complaint, status } : complaint
            )
        );
        updateStatusCounts(complaints.map((complaint) =>
            complaint.id === id ? { ...complaint, status } : complaint
        ));
    };

    const updateStatusCounts = (complaints) => {
        const counts = { accepted: 0, rejected: 0, pending: 0 };
        complaints.forEach((complaint) => {
            if (complaint.status === 'accepted') counts.accepted++;
            else if (complaint.status === 'rejected') counts.rejected++;
            else counts.pending++;
        });
        setStatusCounts(counts);
    };

    const data = {
        labels: ['Accepted', 'Rejected', 'Pending'],
        datasets: [
            {
                data: [statusCounts.accepted, statusCounts.rejected, statusCounts.pending],
                backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div style={styles.mainContainer}>
            <div style={styles.container}>
                <h2>Complaint Dashboard</h2>
                {complaints.map((complaint) => (
                    <div key={complaint.id} style={styles.complaintItem}>
                        <p style={styles.complaintType}>{complaint.complaintType}</p>
                        <p>Name: {complaint.name}</p>
                        <p>Address: {complaint.address}</p>
                        <p>Zone: {complaint.zone}</p>
                        <p>Phone Number: {complaint.phoneNumber}</p>
                        <p>Email Address: {complaint.emailAddress}</p>
                        <div style={styles.buttonContainer}>
                            <button
                                style={{ ...styles.button, ...styles.acceptButton }}
                                onClick={() => handleAccept(complaint.id)}
                            >
                                Accept
                            </button>
                            <button
                                style={{ ...styles.button, ...styles.rejectButton }}
                                onClick={() => handleReject(complaint.id)}
                            >
                                Reject
                            </button>
                        </div>
                        {acknowledgements[complaint.id] && (
                            <p style={styles.acknowledgement}>
                                {acknowledgements[complaint.id]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <div style={styles.chartContainer}>
                <h3>Complaints Status Overview</h3>
                <Pie data={data} options={options} width={300} height={300} />
            </div>
        </div>
    );
}

export default Admin;
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const UserDetail = ({ userId }) => {
   const { id: paramId } = useParams();
    const id = userId || paramId;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    // const API_BASE_URL = 'https://web-thitracnghiem-nhom15.onrender.com/api';
    const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";


    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            try {
                const response = await axios.get(`${API}/users/${id}`);
                setUser(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Không tìm thấy sinh viên');
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div></div>;
    if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
    if (!user) return null;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Chi tiết sinh viên: {user.studentid}</h4>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title text-success">{user.last_name} {user.first_name}</h5>
                            <hr />
                            <p className="card-text"><strong>Email:</strong> {user.email}</p>
                            <p className="card-text"><strong>Mã Khoa:</strong> {user.facultyid}</p>
                            <p className="card-text"><strong>Mã Lớp:</strong> {user.classid}</p>
                            
                          
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
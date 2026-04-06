import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    
    // const API_BASE_URL = 'https://web-thitracnghiem-nhom15.onrender.com/api';
    const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API}/users`);
                setUsers(response.data.data); 
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi tải danh sách người dùng:", error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div></div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-primary">Danh sách Người dùng</h2>
            <div className="card shadow">
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>MSSV</th>
                                <th>Họ</th>
                                <th>Tên</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map(user => (
                                    <tr key={user.uid}>
                                        <td>{user.uid}</td>
                                        <td>
                                            <Link to={`/users/${user.uid}`} >
                                                {user.studentid}
                                            </Link>
                                        </td>
                                        <td>{user.last_name}</td>
                                        <td>{user.first_name}</td>
                                        <td>{user.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserList;
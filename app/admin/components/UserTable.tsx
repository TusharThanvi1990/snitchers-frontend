"use client";

import React, { useState } from 'react';
import { Shield, ShieldAlert, Trash2, UserX, UserCheck, Search, ShieldCheck } from 'lucide-react';
import styles from '../admin.module.css';

interface User {
  _id: string;
  anonymousName: string;
  role: 'user' | 'admin' | 'super_admin';
  isSuspended: boolean;
  college: string;
}

interface UserTableProps {
  users: User[];
  onSuspend: (id: string) => void;
  onDelete: (id: string) => void;
  onRoleUpdate: (id: string, role: string, college?: string) => void;
}

export default function UserTable({ users, onSuspend, onDelete, onRoleUpdate }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.anonymousName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.college?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.userTableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search users by name, role, or college..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Identity</th>
              <th>Role</th>
              <th>Organization</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} className={user.isSuspended ? styles.suspendedRow : ''}>
                <td>
                  <div className={styles.userName}>
                    {user.anonymousName}
                    {user.role === 'super_admin' && <ShieldCheck size={14} className={styles.superAdminBadge} />}
                  </div>
                </td>
                <td>
                  <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.college || '—'}</td>
                <td>
                  <span className={`${styles.statusBadge} ${user.isSuspended ? styles.suspended : styles.active}`}>
                    {user.isSuspended ? 'Suspended' : 'Active'}
                  </span>
                </td>
                <td>
                  <div className={styles.rowActions}>
                    {user.role !== 'super_admin' && (
                      <>
                        <button 
                          onClick={() => onSuspend(user._id)}
                          className={styles.iconAction}
                          title={user.isSuspended ? "Unsuspend" : "Suspend"}
                        >
                          {user.isSuspended ? <UserCheck size={18} /> : <UserX size={18} />}
                        </button>
                        
                        <button 
                          onClick={() => {
                            const newRole = user.role === 'admin' ? 'user' : 'admin';
                            const college = newRole === 'admin' ? prompt('Enter organization/college for this admin:', user.college) : user.college;
                            if (newRole === 'admin' && !college) return;
                            onRoleUpdate(user._id, newRole, college || undefined);
                          }}
                          className={styles.iconAction}
                          title={user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                        >
                          {user.role === 'admin' ? <ShieldAlert size={18} /> : <Shield size={18} />}
                        </button>

                        <button 
                          onClick={() => onDelete(user._id)}
                          className={`${styles.iconAction} ${styles.deleteAction}`}
                          title="Erase Identity"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

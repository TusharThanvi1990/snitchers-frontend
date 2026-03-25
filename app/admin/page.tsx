"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, MessageSquare, Landmark, Flag, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './admin.module.css';
import UserTable from './components/UserTable';

interface Stats {
  totalWhispers: number;
  totalUsers: number;
  totalAdmins?: number;
  totalFlagged: number;
  totalColleges?: number;
  college?: string;
}

interface User {
  _id?: string;
  anonymousName?: string;
  role?: string;
  college?: string;
}

interface UserData {
  _id: string;
  anonymousName: string;
  role: 'user' | 'admin' | 'super_admin';
  isSuspended: boolean;
  college: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin' && parsedUser.role !== 'super_admin') {
        router.push('/');
        return;
      }
      setUser(parsedUser);
      fetchStats();
      if (parsedUser.role === 'super_admin') {
        fetchUsers();
      }
    } catch {
      router.push('/login');
    }
  }, [router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${apiBaseUrl}/api/auth/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await res.json();
      setStats(data);
    } catch {
      setError('Listening to the shadows failed. Could not retrieve statistics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBaseUrl}/api/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBaseUrl}/api/auth/users/${id}/suspend`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers();
        fetchStats(); // Update stats in case counts changed
      }
    } catch (err) {
      console.error('Suspend error:', err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you certain you want to erase this identity forever?')) return;
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBaseUrl}/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      console.error('Delete user error:', err);
    }
  };

  const handleRoleUpdate = async (id: string, role: string, college?: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBaseUrl}/api/auth/users/${id}/role`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role, college })
      });
      if (res.ok) {
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      console.error('Role update error:', err);
    }
  };

  if (loading) return <div className={styles.loading}>Accessing the Shadow Archive...</div>;
  if (error) return <div className={styles.noAccess}>{error}</div>;
  if (!user) return null;

  return (
    <div className={styles.adminContainer}>
      <Link href="/whispers" className={styles.backLink}>
        <ArrowLeft size={18} /> Back to Whispers
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>
          {user.role === 'super_admin' ? 'Omniscient Dashboard' : `${user.college} Moderation`}
        </h1>
        <p className={styles.subtitle}>
          {user.role === 'super_admin' 
            ? 'Overseeing every heartbeat and secret across the network.' 
            : `Managing the whispers of ${user.college}.`}
        </p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <MessageSquare className={styles.statIcon} size={32} />
          <div className={styles.statValue}>{stats?.totalWhispers}</div>
          <div className={styles.statLabel}>Total Whispers</div>
        </div>

        <div className={styles.statCard}>
          <Users className={styles.statIcon} size={32} />
          <div className={styles.statValue}>{stats?.totalUsers}</div>
          <div className={styles.statLabel}>Anonymous Souls</div>
        </div>

        {user.role === 'super_admin' && (
          <>
            <div className={styles.statCard}>
              <ShieldAlert className={styles.statIcon} size={32} />
              <div className={styles.statValue}>{stats?.totalAdmins}</div>
              <div className={styles.statLabel}>Watchers (Admins)</div>
            </div>
            <div className={styles.statCard}>
              <Landmark className={styles.statIcon} size={32} />
              <div className={styles.statValue}>{stats?.totalColleges}</div>
              <div className={styles.statLabel}>Colleges</div>
            </div>
          </>
        )}

        <div className={styles.statCard}>
          <Flag className={styles.statIcon} size={32} />
          <div className={styles.statValue}>{stats?.totalFlagged}</div>
          <div className={styles.statLabel}>Flagged Secrets</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <ShieldAlert size={28} /> Moderation Actions
        </h2>
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
          You can now moderate whispers directly from the <strong>Whispers Feed</strong>. 
          Look for the admin controls on each card.
        </p>
        <Link href="/whispers" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
          <button className="primary-btn">Go to Moderation Feed</button>
        </Link>
      </div>

      {user.role === 'super_admin' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Users size={28} /> User Management
          </h2>
          <UserTable 
            users={users} 
            onSuspend={handleSuspend} 
            onDelete={handleDeleteUser} 
            onRoleUpdate={handleRoleUpdate} 
          />
        </div>
      )}

      <div style={{ marginTop: '6rem', opacity: 0.5, fontSize: '0.8rem', textAlign: 'center' }}>
        Snitchers Admin Protocol v1.0 — Respect the Shadow.
      </div>
    </div>
  );
}

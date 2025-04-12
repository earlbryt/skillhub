
<template>
  <div class="admin-view">
    <h1>Admin Dashboard</h1>
    <p>This is the admin dashboard. Only authorized admin users can access this page.</p>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Checking admin status...</p>
    </div>
    
    <div v-else-if="!isAdmin" class="not-admin">
      <h2>Access Denied</h2>
      <p>You do not have admin privileges to access this page.</p>
      <button @click="goToHome" class="back-button">Back to Home</button>
    </div>
    
    <div v-else class="admin-panel">
      <h2>Welcome, Admin!</h2>
      <p>You have access to the admin panel.</p>
      
      <div class="admin-actions">
        <h3>Quick Actions</h3>
        <div class="action-buttons">
          <button @click="navigateTo('/admin/users')" class="action-button">
            <span class="icon">👥</span>
            Manage Users
          </button>
          <button @click="navigateTo('/admin/workshops')" class="action-button">
            <span class="icon">📅</span>
            Manage Workshops
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAdmin } from '@/contexts/AdminContext';

export default {
  name: 'AdminView',
  setup() {
    const router = useRouter();
    const { isAdmin, loading, checkAdminStatus } = useAdmin();
    
    onMounted(async () => {
      await checkAdminStatus();
    });
    
    const goToHome = () => {
      router.push('/');
    };
    
    const navigateTo = (path) => {
      router.push(path);
    };
    
    return {
      isAdmin,
      loading,
      goToHome,
      navigateTo
    };
  }
}
</script>

<style scoped>
.admin-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #1f2937;
  margin-bottom: 1rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3b82f6;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.not-admin {
  background-color: #fee2e2;
  border: 1px solid #ef4444;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  margin: 2rem 0;
}

.not-admin h2 {
  color: #b91c1c;
  margin-bottom: 1rem;
}

.back-button {
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
}

.admin-panel {
  margin-top: 2rem;
}

.admin-actions {
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-top: 2rem;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
</style>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-white">
    <div class="admin-view max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-6 md:p-8">
          <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%23ffffff%27%20fill-opacity%3D%270.05%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
          <div class="relative z-10">
            <h1 class="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p class="text-blue-100 text-lg">Manage your workshop platform with powerful admin tools</p>
          </div>
          
          <div class="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-8 -left-8 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center p-12">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p class="text-lg text-gray-600">Checking admin status...</p>
        </div>

        <div v-else-if="!isAdmin" class="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-8 text-center">
          <div class="max-w-md mx-auto">
            <h2 class="text-2xl font-bold text-red-800 mb-3">Access Denied</h2>
            <p class="text-red-600 mb-6">You do not have admin privileges to access this page.</p>
            <button 
              @click="goToHome" 
              class="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium transition-all hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Home
            </button>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome, Admin!</h2>
            <p class="text-gray-600">You have access to the admin panel.</p>
          </div>

          <div class="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                @click="navigateTo('/admin/users')" 
                class="group p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white text-2xl">
                    👥
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-medium text-gray-900 group-hover:text-blue-600">Manage Users</h4>
                    <p class="text-gray-500">View and manage user accounts</p>
                  </div>
                </div>
              </button>

              <button 
                @click="navigateTo('/admin/workshops')" 
                class="group p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white text-2xl">
                    📅
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-medium text-gray-900 group-hover:text-blue-600">Manage Workshops</h4>
                    <p class="text-gray-500">Create and edit workshop sessions</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
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
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

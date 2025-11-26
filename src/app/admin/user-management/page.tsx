'use client';

import { getUserList } from '@/lib/user-api';
import { User } from '@/types/user';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Users, Search, RefreshCw } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getUserList(page);
      if (response.code === 200) {
        setUsers(response.result.content);
        setTotalPages(response.result.totalPages);
        setTotalElements(response.result.totalElements);
        setCurrentPage(response.result.page);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Error loading users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.roles.some(role => role.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getRoleBadgeColor = (roleName: string): string => {
    switch (roleName.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'RECRUITER':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'CANDIDATE':
        return 'bg-green-500 hover:bg-green-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Management</h1>
          <div className="text-center p-12 bg-red-50 rounded-lg border border-red-200">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 mb-6">{error}</p>
            <Button 
              onClick={() => fetchUsers(currentPage)}
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and view all system users</p>
        </div>
        
        {!isLoading && (
          <div className="flex items-center gap-4">
            <div className="text-center px-6 py-3 bg-sky-50 rounded-lg border border-sky-200">
              <p className="text-xs text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-semibold text-sky-600">{totalElements}</p>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by username, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-20">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent mb-4"></div>
            <p className="text-gray-500">Loading users...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-20">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <p className="text-gray-600">
                {searchQuery ? 'No users found matching your search' : 'No users found'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-4">Username</TableHead>
                    <TableHead className="font-semibold text-gray-700">Email</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Roles</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <TableRow 
                      key={user.email}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <TableCell className="font-medium text-gray-800 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-semibold">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          {user.username}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          className={`${
                            user.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-red-100 text-red-700 border border-red-200'
                          } px-3 py-1 font-medium`}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          {user.roles.map((role) => (
                            <Badge 
                              key={role.name}
                              className={`${getRoleBadgeColor(role.name)} border-0 px-3 py-1 font-medium shadow-sm`}
                            >
                              {role.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(user)}
                          className="hover:bg-sky-50 hover:text-sky-600 transition-colors rounded-md"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page <span className="font-medium">{currentPage + 1}</span> of <span className="font-medium">{totalPages}</span>
                <span className="mx-2">•</span>
                Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="rounded-md border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  ← Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="rounded-md border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next →
                </Button>
              </div>
            </div>
          </>
        )}

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">User Details</DialogTitle>
            <DialogDescription className="text-gray-500">
              Complete information about the selected user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6 mt-4">
              {/* User Avatar and Basic Info */}
              <div className="flex items-center gap-4 p-6 bg-sky-50 rounded-lg">
                <div className="w-20 h-20 rounded-full bg-sky-500 flex items-center justify-center text-white text-3xl font-semibold">
                  {selectedUser.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">{selectedUser.username}</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <Badge 
                      className={`${
                        selectedUser.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-red-100 text-red-700 border border-red-200'
                      } mt-2 px-3 py-1`}
                    >
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>

                {/* User Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Username</p>
                    <p className="text-gray-800 font-medium">{selectedUser.username}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
                    <p className="text-gray-800 font-medium break-all">{selectedUser.email}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Account Status</p>
                    <p className="text-gray-800 font-medium">{selectedUser.status}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Number of Roles</p>
                    <p className="text-gray-800 font-medium">{selectedUser.roles.length}</p>
                  </div>
                </div>

                {/* Roles Section */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Assigned Roles</p>
                  <div className="space-y-3">
                    {selectedUser.roles.map((role) => (
                      <div key={role.name} className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${getRoleBadgeColor(role.name)} border-0 shadow-sm`}>
                            {role.name}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{role.description}</p>
                        {role.permissions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Permissions:</p>
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.map((permission, idx) => (
                                <span 
                                  key={idx}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                                  {permission}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
    </div>
  );
}
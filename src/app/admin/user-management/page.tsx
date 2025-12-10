'use client';

import { getUserList, updateUserStatus, deleteUser, AccountStatus } from '@/lib/user-api';
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Users, Search, RefreshCw, MoreHorizontal, Ban, CheckCircle, Lock, Trash2, UserX } from 'lucide-react';
import toast from 'react-hot-toast';

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
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ user: User; action: string; status?: AccountStatus } | null>(null);

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

  // Handle status change actions
  const handleStatusChange = async (user: User, status: AccountStatus) => {
    setConfirmAction({ user, action: 'status', status });
    setIsConfirmDialogOpen(true);
  };

  // Handle delete action
  const handleDelete = (user: User) => {
    setConfirmAction({ user, action: 'delete' });
    setIsConfirmDialogOpen(true);
  };

  // Execute confirmed action
  const executeAction = async () => {
    if (!confirmAction) return;

    try {
      setActionLoading(confirmAction.user.id);
      
      if (confirmAction.action === 'delete') {
        await deleteUser(confirmAction.user.id);
        toast.success(`User ${confirmAction.user.username} has been deleted`);
      } else if (confirmAction.action === 'status' && confirmAction.status) {
        await updateUserStatus(confirmAction.user.id, confirmAction.status);
        const statusMessages: Record<AccountStatus, string> = {
          ACTIVE: 'activated',
          INACTIVE: 'deactivated',
          LOCKED: 'locked',
          BANNED: 'banned',
        };
        toast.success(`User ${confirmAction.user.username} has been ${statusMessages[confirmAction.status]}`);
      }
      
      await fetchUsers(currentPage);
    } catch (error: any) {
      console.error('Action failed:', error);
      toast.error(error.message || 'Action failed. Please try again.');
    } finally {
      setActionLoading(null);
      setIsConfirmDialogOpen(false);
      setConfirmAction(null);
    }
  };

  // Get available actions based on current status
  const getAvailableActions = (user: User) => {
    const actions: Array<{ label: string; icon: React.ReactNode; status?: AccountStatus; action: string; variant: 'default' | 'destructive' }> = [];
    
    // Don't show actions for ADMIN users (can't change admin status)
    if (user.roles.some(role => role.name === 'ADMIN')) {
      return actions;
    }

    if (user.status !== 'ACTIVE') {
      actions.push({ label: 'Activate', icon: <CheckCircle className="h-4 w-4 mr-2" />, status: 'ACTIVE', action: 'status', variant: 'default' });
    }
    if (user.status !== 'INACTIVE') {
      actions.push({ label: 'Deactivate', icon: <UserX className="h-4 w-4 mr-2" />, status: 'INACTIVE', action: 'status', variant: 'default' });
    }
    if (user.status !== 'LOCKED') {
      actions.push({ label: 'Lock Account', icon: <Lock className="h-4 w-4 mr-2" />, status: 'LOCKED', action: 'status', variant: 'default' });
    }
    if (user.status !== 'BANNED') {
      actions.push({ label: 'Ban User', icon: <Ban className="h-4 w-4 mr-2" />, status: 'BANNED', action: 'status', variant: 'destructive' });
    }
    
    return actions;
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
    <div className="space-y-4 lg:space-y-5 xl:space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-xs lg:text-sm text-gray-600 mt-1">Manage and view all system users</p>
        </div>
        
        {!isLoading && (
          <div className="flex items-center">
            <div className="text-center px-4 lg:px-6 py-2 lg:py-3 bg-sky-50 rounded-lg border border-sky-200">
              <p className="text-xs lg:text-sm text-gray-600 mb-0.5 lg:mb-1">Total Users</p>
              <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-sky-600">{totalElements}</p>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 lg:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by username, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="font-semibold text-gray-700 py-3 lg:py-4 text-xs lg:text-sm whitespace-nowrap">Username</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs lg:text-sm whitespace-nowrap">Email</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs lg:text-sm whitespace-nowrap">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs lg:text-sm whitespace-nowrap">Roles</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center text-xs lg:text-sm whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow 
                        key={user.email}
                        className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <TableCell className="font-medium text-gray-800 py-3 lg:py-4">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-semibold text-sm lg:text-base shrink-0">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs lg:text-sm">{user.username}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-xs lg:text-sm">
                          <span className="block">{user.email}</span>
                        </TableCell>
                        <TableCell>
                        <Badge 
                          className={`${
                            user.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : user.status === 'BANNED'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : user.status === 'LOCKED'
                              ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              : 'bg-gray-100 text-gray-700 border border-gray-200'
                          } px-2 lg:px-3 py-0.5 lg:py-1 font-medium text-xs`}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 lg:gap-2 flex-wrap">
                          {user.roles.map((role) => (
                            <Badge 
                              key={role.name}
                              className={`${getRoleBadgeColor(role.name)} border-0 px-2 lg:px-3 py-0.5 lg:py-1 font-medium shadow-sm text-xs`}
                            >
                              {role.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 min-w-[72px]">
                          {/* View Details Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(user)}
                            className="hover:bg-sky-50 hover:text-sky-600 transition-colors rounded-md h-8 w-8 p-0"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {/* Actions Dropdown - Only show if not admin */}
                          {!user.roles.some(role => role.name === 'ADMIN') ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  disabled={actionLoading === user.id}
                                >
                                  {actionLoading === user.id ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <MoreHorizontal className="h-4 w-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                {getAvailableActions(user).map((action, idx) => (
                                  <DropdownMenuItem
                                    key={action.label}
                                    onClick={() => action.status && handleStatusChange(user, action.status)}
                                    className={action.variant === 'destructive' ? 'text-red-600 focus:text-red-600' : ''}
                                  >
                                    {action.icon}
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(user)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            /* Placeholder to maintain alignment for admin users */
                            <div className="h-8 w-8" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 lg:p-4 flex items-center justify-between gap-3">
              <div className="text-xs lg:text-sm text-gray-600">
                Page <span className="font-medium">{currentPage + 1}</span> of <span className="font-medium">{totalPages}</span>
                <span className="mx-2">•</span>
                Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="rounded-md border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-xs lg:text-sm"
                >
                  ← Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="rounded-md border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-xs lg:text-sm"
                >
                  Next →
                </Button>
              </div>
            </div>
          </>
        )}

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg lg:text-xl font-bold text-gray-900">User Details</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Complete information about the selected user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4 lg:space-y-6 mt-4">
              {/* User Avatar and Basic Info */}
              <div className="flex items-center gap-4 p-4 lg:p-6 bg-sky-50 rounded-lg">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-sky-500 flex items-center justify-center text-white text-2xl lg:text-3xl font-semibold shrink-0">
                  {selectedUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                    <h3 className="text-base lg:text-xl font-semibold text-gray-800 truncate">{selectedUser.username}</h3>
                    <p className="text-sm lg:text-base text-gray-600 truncate">{selectedUser.email}</p>
                    <Badge 
                      className={`${
                        selectedUser.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-red-100 text-red-700 border border-red-200'
                      } mt-2 px-2 lg:px-3 py-0.5 lg:py-1 text-xs`}
                    >
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>

                {/* User Information Grid */}
                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  <div className="p-3 lg:p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Username</p>
                    <p className="text-sm lg:text-base text-gray-800 font-medium truncate">{selectedUser.username}</p>
                  </div>
                  
                  <div className="p-3 lg:p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
                    <p className="text-sm lg:text-base text-gray-800 font-medium break-all">{selectedUser.email}</p>
                  </div>
                  
                  <div className="p-3 lg:p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Account Status</p>
                    <p className="text-sm lg:text-base text-gray-800 font-medium">{selectedUser.status}</p>
                  </div>
                  
                  <div className="p-3 lg:p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Number of Roles</p>
                    <p className="text-sm lg:text-base text-gray-800 font-medium">{selectedUser.roles.length}</p>
                  </div>
                </div>

                {/* Roles Section */}
                <div className="p-3 lg:p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 lg:mb-3">Assigned Roles</p>
                  <div className="space-y-2 lg:space-y-3">
                    {selectedUser.roles.map((role) => (
                      <div key={role.name} className="p-3 lg:p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${getRoleBadgeColor(role.name)} border-0 shadow-sm text-xs`}>
                            {role.name}
                          </Badge>
                        </div>
                        <p className="text-xs lg:text-sm text-gray-600">{role.description}</p>
                        {role.permissions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Permissions:</p>
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.map((permission, idx) => (
                                <span 
                                  key={idx}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 lg:py-1 rounded"
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

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.action === 'delete' 
                ? 'Delete User' 
                : `${confirmAction?.status === 'ACTIVE' ? 'Activate' : confirmAction?.status === 'INACTIVE' ? 'Deactivate' : confirmAction?.status === 'LOCKED' ? 'Lock' : 'Ban'} User`}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.action === 'delete' 
                ? 'Are you sure you want to delete this user? This action cannot be undone.'
                : `Are you sure you want to change this user's status to ${confirmAction?.status}?`}
            </DialogDescription>
          </DialogHeader>

          {confirmAction && (
            <div className={`p-4 rounded-md border ${
              confirmAction.action === 'delete' || confirmAction.status === 'BANNED'
                ? 'bg-red-50 border-red-200'
                : confirmAction.status === 'LOCKED'
                ? 'bg-yellow-50 border-yellow-200'
                : confirmAction.status === 'ACTIVE'
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-semibold">
                  {confirmAction.user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{confirmAction.user.username}</p>
                  <p className="text-sm text-gray-600">{confirmAction.user.email}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmDialogOpen(false);
                setConfirmAction(null);
              }}
              disabled={actionLoading !== null}
            >
              Cancel
            </Button>
            <Button
              onClick={executeAction}
              disabled={actionLoading !== null}
              className={
                confirmAction?.action === 'delete' || confirmAction?.status === 'BANNED'
                  ? 'bg-red-600 hover:bg-red-700'
                  : confirmAction?.status === 'ACTIVE'
                  ? 'bg-green-600 hover:bg-green-700'
                  : ''
              }
            >
              {actionLoading !== null ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
'use client';

import { getSkillList, createSkill, searchSkills, Skill } from '@/lib/skill-api';
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
import { Plus, Search, RefreshCw, Tag, Edit, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const ITEMS_PER_PAGE = 10;

export default function SkillManagementPage() {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [displayedSkills, setDisplayedSkills] = useState<Skill[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [newSkillName, setNewSkillName] = useState('');
  const [formError, setFormError] = useState('');

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getSkillList();
      
      if (response.code === 200) {
        setAllSkills(response.result);
        setFilteredSkills(response.result);
        updatePagination(response.result, 1);
      } else {
        setError('Failed to fetch skills');
      }
    } catch (error: any) {
      console.error('Error fetching skills:', error);
      setError(error.message || 'Error loading skills. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePagination = (skills: Skill[], page: number) => {
    const total = Math.ceil(skills.length / ITEMS_PER_PAGE);
    setTotalPages(total);
    
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedSkills(skills.slice(startIndex, endIndex));
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    updatePagination(filteredSkills, currentPage);
  }, [filteredSkills, currentPage]);

  const handleSearch = () => {
    const filtered = searchSkills(allSkills, searchQuery);
    setFilteredSkills(filtered);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredSkills(allSkills);
    setCurrentPage(1);
  };

  const handleCreateSkill = async () => {
    // Validate form
    if (!newSkillName.trim()) {
      setFormError('Skill name is required');
      return;
    }

    try {
      setIsCreating(true);
      setFormError('');
      
      const response = await createSkill(newSkillName.trim());

      if (response.code === 200) {
        // Success - refresh the list and close dialog
        setIsCreateDialogOpen(false);
        setNewSkillName('');
        setFormError('');
        
        // Show success message
        alert(`✅ Skill "${newSkillName.trim()}" created successfully!`);
        
        // Refresh the skills list
        fetchSkills();
      } else {
        setFormError(response.message || 'Failed to create skill');
      }
    } catch (error: any) {
      console.error('Error creating skill:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error creating skill. Please try again.';
      setFormError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Skill Management</h1>
          <div className="text-center p-12 bg-red-50 rounded-lg border border-red-200">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 mb-6">{error}</p>
            <Button 
              onClick={fetchSkills}
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
          <h1 className="text-2xl font-bold text-gray-900">Skill Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage job skills and competencies</p>
        </div>
        
        <div className="flex items-center gap-4">
          {!isLoading && (
            <div className="text-center px-6 py-3 bg-sky-50 rounded-lg border border-sky-200">
              <p className="text-xs text-gray-600 mb-1">Total Skills</p>
              <p className="text-2xl font-semibold text-sky-600">{allSkills.length}</p>
            </div>
          )}
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Skill
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search skills by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          {searchQuery && (
            <Button
              onClick={handleClearSearch}
              variant="outline"
              className="border-gray-300"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-20">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent mb-4"></div>
            <p className="text-gray-500">Loading skills...</p>
          </div>
        </div>
      ) : !displayedSkills || displayedSkills.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-20">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🎯</div>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'No skills found matching your search' : 'No skills found'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-sky-600 hover:bg-sky-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Skill
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-700 py-4 w-20">ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Skill Name</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedSkills.map((skill) => (
                  <TableRow 
                    key={skill.id}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <TableCell className="font-medium text-gray-600 py-4">
                      {skill.id}
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                          <Tag className="h-4 w-4 text-sky-600" />
                        </div>
                        <span>{skill.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-sky-300 text-sky-600 hover:bg-sky-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
              <span className="mx-2">•</span>
              Showing <span className="font-medium">{displayedSkills.length}</span> of <span className="font-medium">{filteredSkills.length}</span> skills
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-md border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                ← Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-md border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Next →
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Create Skill Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Add New Skill</DialogTitle>
            <DialogDescription className="text-gray-500">
              Create a new skill that can be assigned to job descriptions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{formError}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="e.g., JavaScript, Python, React"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                disabled={isCreating}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setNewSkillName('');
                setFormError('');
              }}
              disabled={isCreating}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSkill}
              disabled={isCreating || !newSkillName.trim()}
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Skill
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

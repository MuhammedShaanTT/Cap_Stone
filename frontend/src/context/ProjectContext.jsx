import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { notifyError } = useToast();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async (preferredProjectId = null) => {
    if (!isAuthenticated) {
      setProjects([]);
      setActiveProject(null);
      return [];
    }

    setLoading(true);
    try {
      const list = await projectService.getProjects();
      const safeList = Array.isArray(list) ? list : [];
      setProjects(safeList);

      if (safeList.length > 0) {
        // If preferred ID matches, set that, otherwise first
        const match = safeList.find((p) => p.id === preferredProjectId);
        setActiveProject((prev) => {
          if (match) return match;
          if (prev && safeList.some((p) => p.id === prev.id)) {
            return safeList.find((p) => p.id === prev.id);
          }
          return safeList[0];
        });
      } else {
        setActiveProject(null);
      }
      return safeList;
    } catch (err) {
      console.error('Failed to load projects:', err);
      // Only notify if not a 401/403 session expired
      if (!err.message?.includes('401') && !err.message?.includes('403')) {
        notifyError(err.message || 'Could not fetch projects');
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, notifyError]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const selectProjectById = useCallback((id) => {
    const found = projects.find((p) => p.id === id);
    if (found) {
      setActiveProject(found);
    }
  }, [projects]);

  const createProject = async (name, description) => {
    setLoading(true);
    try {
      const created = await projectService.createProject(name, description);
      await fetchProjects(created?.id);
      return created;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProject,
        selectProjectById,
        loading,
        refreshProjects: fetchProjects,
        createProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

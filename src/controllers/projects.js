import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    // Pass the constant into the model function
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    
    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    // Extract the ID from the URL parameters
    const projectId = req.params.id;
    
    // Fetch the project details
    const project = await getProjectDetails(projectId);
    
    // NEW: Fetch the categories for this specific project
    const categories = await getCategoriesByProjectId(projectId);
    
    // Optional: Update the title to be the project's actual name instead of a generic string
    const title = project.title;
    
    // NEW: Pass the categories variable to the EJS template
    res.render('project', { title, project, categories });
};

export { showProjectsPage, showProjectDetailsPage };
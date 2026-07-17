import db from './db.js';

const getAllProjects = async () => {
    // We use a JOIN to combine the service_project table with the organization table 
    // based on the matching organization_id.
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.location, 
            p.project_date, 
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o 
            ON p.organization_id = o.organization_id;
    `;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error executing query in getAllProjects:", error);
        throw error;
    }
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.location, 
            p.project_date AS date, 
            p.organization_id, 
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
    `;
    const result = await db.query(query, [number_of_projects]);
    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.location, 
            p.project_date AS date, 
            p.organization_id, 
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0]; // Return just the single object, not the whole array
};

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date AS date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY project_date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.location, 
            p.project_date AS date, 
            o.organization_id, /* <--- THIS IS THE MISSING PIECE! */
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.project_category pc ON p.project_id = pc.project_id
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date ASC;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

export { getAllProjects, getUpcomingProjects, getProjectDetails, getProjectsByOrganizationId, getProjectsByCategoryId }; 
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

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId };
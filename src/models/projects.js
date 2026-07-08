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

export { getAllProjects };
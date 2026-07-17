import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT category_id, category_name 
        FROM public.category
        ORDER BY category_name ASC;
    `;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error executing query in getAllCategories:", error);
        throw error;
    }
};

const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, category_name 
        FROM category 
        WHERE category_id = $1;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows[0];
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.category_name 
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

export { getAllCategories, getCategoryById, getCategoriesByProjectId };
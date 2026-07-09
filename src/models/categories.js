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

export { getAllCategories };
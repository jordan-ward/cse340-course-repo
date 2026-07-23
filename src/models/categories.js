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

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

// Add a new category to the database
const createCategory = async (categoryName) => {
    const query = `
        INSERT INTO category (category_name)
        VALUES ($1)
        RETURNING *;
    `;
    const result = await db.query(query, [categoryName]);
    return result.rows[0];
};

// Update an existing category in the database
const updateCategory = async (categoryId, categoryName) => {
    const query = `
        UPDATE category
        SET category_name = $1
        WHERE category_id = $2
        RETURNING *;
    `;
    const result = await db.query(query, [categoryName, categoryId]);
    
    if (result.rows.length === 0) {
        throw new Error(`Category with ID ${categoryId} not found.`);
    }
    return result.rows[0];
};

// Export the new functions
export { 
    getAllCategories, 
    getCategoryById, 
    getCategoriesByProjectId, 
    updateCategoryAssignments,
    createCategory,
    updateCategory 
};
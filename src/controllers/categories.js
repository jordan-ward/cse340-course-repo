import { body, validationResult } from 'express-validator';
import { 
    getAllCategories, 
    getCategoryById, 
    getCategoriesByProjectId, 
    updateCategoryAssignments,
    createCategory,
    updateCategory 
} from '../models/categories.js';
import { getProjectsByCategoryId, getProjectDetails } from '../models/projects.js';

// Define server-side validation rules for categories
const categoryValidation = [
    body('category_name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    
    const title = `${category.category_name} Projects`;
    
    res.render('category', { title, category, projects });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId); 
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    
    await updateCategoryAssignments(projectId, categoryIdsArray);
    
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

// NEW: Show Create Category Form
const showNewCategoryForm = (req, res) => {
    res.render('new-category', { 
        title: 'Create New Category', 
        category: null 
    });
};

// NEW: Process Create Category Form
const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => { req.flash('error', error.msg); });
        return res.render('new-category', { 
            title: 'Create New Category', 
            category: req.body // Pass data back so user doesn't lose what they typed
        });
    }

    try {
        await createCategory(req.body.category_name);
        req.flash('success', 'Category created successfully!');
        res.redirect('/categories');
    } catch (error) {
        req.flash('error', 'Error creating category. Please try again.');
        res.redirect('/new-category');
    }
};

// NEW: Show Edit Category Form
const showEditCategoryForm = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);
        
        if (!category) {
            req.flash('error', 'Category not found.');
            return res.redirect('/categories');
        }

        res.render('edit-category', { 
            title: 'Edit Category', 
            category 
        });
    } catch (error) {
        req.flash('error', 'Error loading category.');
        res.redirect('/categories');
    }
};

// Process Edit Category Form
const processEditCategoryForm = async (req, res) => {
    const errors = validationResult(req);
    const categoryId = req.params.id;

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => { req.flash('error', error.msg); });
        // Send data back with the correct ID so the form can still render properly
        return res.render('edit-category', { 
            title: 'Edit Category', 
            category: { category_id: categoryId, category_name: req.body.category_name } 
        });
    }

    try {
        await updateCategory(categoryId, req.body.category_name);
        req.flash('success', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (error) {
        req.flash('error', 'Error updating category. Please try again.');
        res.redirect(`/edit-category/${categoryId}`);
    }
};

export { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation // Exported to be used in routes
};
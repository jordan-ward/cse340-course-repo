-- ========================================
-- Reset Database (Run this first!)
-- ========================================
DROP TABLE IF EXISTS project_category CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS service_project CASCADE;
DROP TABLE IF EXISTS organization CASCADE;

-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Service Project Table
-- ========================================

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY(organization_id) 
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Service Projects
-- ========================================
INSERT INTO service_project (organization_id, title, description, location, project_date)
VALUES
-- Projects for BrightFuture Builders (ID 1)
(1, 'Oak Street Playground Build', 'Constructing a new wooden playground set for the local neighborhood park.', '123 Oak St Park', '2024-05-15'),
(1, 'Community Center Roof Repair', 'Patching leaks and replacing shingles on the aging downtown community center.', '450 Downtown Blvd', '2024-06-02'),
(1, 'Riverside Pathway Paving', 'Laying down sustainable concrete paths along the river to improve wheelchair accessibility.', 'Riverside Trailhead', '2024-06-20'),
(1, 'Library Gazebo Construction', 'Building a shaded outdoor reading gazebo in the library courtyard.', 'Central Public Library', '2024-07-10'),
(1, 'Shelter Bunk Bed Assembly', 'Building and installing 20 new sturdy bunk beds for the local family shelter.', 'Hope Family Shelter', '2024-08-05'),

-- Projects for GreenHarvest Growers (ID 2)
(2, 'Spring Seedling Distribution', 'Handing out free tomato, pepper, and squash seedlings to community members.', 'Downtown Farmer''s Market', '2024-04-10'),
(2, 'Urban Garden Prep Day', 'Tilling soil, building raised beds, and setting up irrigation for the new season.', 'Elm Street Community Garden', '2024-04-24'),
(2, 'Composting Workshop', 'A hands-on class teaching residents how to turn kitchen scraps into nutrient-rich compost.', 'GreenHarvest Main Office', '2024-05-08'),
(2, 'Mid-Summer Weeding Drive', 'A massive volunteer effort to clear invasive weeds from the cooperative farm plots.', 'Westside Co-op Farm', '2024-07-15'),
(2, 'Fall Harvest Festival Setup', 'Harvesting the final autumn crops and setting up booths for the neighborhood food festival.', 'Elm Street Community Garden', '2024-09-20'),

-- Projects for UnityServe Volunteers (ID 3)
(3, 'Annual Food Drive Sorting', 'Sorting and boxing donated canned goods for distribution to local food pantries.', 'UnityServe Warehouse', '2024-10-12'),
(3, 'Charity 5K Run Marshalling', 'Setting up water stations and directing runners for the charity fundraising marathon.', 'Centennial Park', '2024-09-05'),
(3, 'Senior Center Bingo Night', 'Hosting and calling a bingo night for residents, including providing prizes and snacks.', 'Shady Pines Senior Living', '2024-06-14'),
(3, 'Winter Coat Collection', 'Collecting, washing, and organizing donated winter coats for underprivileged youth.', 'UnityServe Warehouse', '2024-11-01'),
(3, 'Animal Shelter Deep Clean', 'Walking dogs, cleaning cages, and organizing supplies at the municipal animal shelter.', 'City Animal Rescue', '2024-05-22');

-- ========================================
-- Category Table
-- ========================================

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (category_name)
VALUES
('Environmental'),         -- ID 1
('Educational'),           -- ID 2
('Community Service'),     -- ID 3
('Health and Wellness');   -- ID 4

-- ========================================
-- Project Categories (Junction Table)
-- ========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    
    -- Composite Primary Key prevents duplicate associations
    CONSTRAINT pk_project_category 
        PRIMARY KEY (project_id, category_id),
        
    -- Foreign Key to service_project
    CONSTRAINT fk_project
        FOREIGN KEY (project_id) 
        REFERENCES service_project(project_id)
        ON DELETE CASCADE,
        
    -- Foreign Key to category
    CONSTRAINT fk_category
        FOREIGN KEY (category_id) 
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Associating Projects
-- ========================================
INSERT INTO project_category (project_id, category_id)
VALUES
-- BrightFuture Builders (Projects 1-5) -> Community Service (3)
(1, 3), 
(2, 3), 
(3, 3), 
(4, 3), 
(5, 3),

-- GreenHarvest Growers (Projects 6-10) -> Environmental (1)
(6, 1), 
(7, 1), 
(8, 1), (8, 2), -- Composting Workshop is both Environmental and Educational
(9, 1), 
(10, 1),

-- UnityServe Volunteers (Projects 11-15) -> Mixed
(11, 3), -- Food Drive -> Community Service
(12, 4), -- 5K Run -> Health and Wellness
(13, 3), -- Bingo Night -> Community Service
(14, 3), -- Winter Coat -> Community Service
(15, 3); -- Animal Shelter -> Community Service
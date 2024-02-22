CREATE SCHEMA IF NOT EXISTS ascent_db;
USE ascent_db;

/* User table */
CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    email VARCHAR(20) NOT NULL, -- Adjust the length as needed
    password VARCHAR(20) NOT NULL, -- Adjust the length as needed
    user_role VARCHAR(10) NOT NULL,
    manager_email VARCHAR(20) NOT NULL -- Adjust the length as needed
);

/* Training Plan Table */
CREATE TABLE IF NOT EXISTS training_plan (
    plan_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(45) NOT NULL,
    description TEXT NOT NULL, -- Use TEXT for large text fields
    status INT,
    create_by VARCHAR(25),/*changed to string*/
    create_date DATETIME NOT NULL,
    modify_by INT,
    modify_date DATETIME,
    training_area VARCHAR(20)
);

/* Training Detail Table */
CREATE TABLE IF NOT EXISTS training_detail (
    detail_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    plan_id INT,
    content_id INT
);

/* Training Content Table */
CREATE TABLE IF NOT EXISTS training_content (
    content_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(45) NOT NULL,
    description TEXT NOT NULL, -- Use TEXT for large text fields
    content_type VARCHAR(15) NOT NULL,
    content_link VARCHAR(255) NOT NULL, -- Adjust the length as needed
    created_by VARCHAR(20) NOT NULL,
    date_created DATETIME NOT NULL,
    has_quiz TINYINT(1) DEFAULT 0,
    status INT,
    training_area VARCHAR(20) NOT NULL 
);

/* Content Quiz Map Table */
CREATE TABLE IF NOT EXISTS content_quiz_map (
    content_quiz_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    content_id INT NOT NULL,
    quiz_id INT NOT NULL
);

/* Quiz Table */
CREATE TABLE IF NOT EXISTS quiz (
    quiz_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    description TEXT NOT NULL, -- Use TEXT for large text fields
    status INT, 
    create_by VARCHAR(25), /* changing to string*/
    create_date DATETIME NOT NULL,
    modify_by INT,
    modify_date DATETIME,
    difficulty VARCHAR(20) NOT NULL,
    passing_grade INT
);

/* Quiz Detail Table */
CREATE TABLE IF NOT EXISTS quiz_detail (
    quiz_detail_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_id INT NOT NULL
);

/* Quiz Question Table */
CREATE TABLE IF NOT EXISTS quiz_question (
    question_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL, -- Use TEXT for large text fields
    selections TEXT, -- Use TEXT for large text fields
    answer_key VARCHAR(45) NOT NULL,
    question_type VARCHAR(20),
    is_removed INT
);

/* Training Plan Assignment Table */
CREATE TABLE IF NOT EXISTS training_plan_assignment (
    assignment_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    plan_id INT,
    assigned_date DATETIME, -- Use DATETIME for date and time fields
    completed_date DATETIME, -- Use DATETIME for date and time fields
    due_date DATETIME, -- Use DATETIME for date and time fields
    status VARCHAR(20),
    is_required VARCHAR(45) NOT NULL,
    training_purpose TEXT, -- Use TEXT for large text fields
    user_id INT NOT NULL,
    is_Canceled INT,
    quiz_result VARCHAR(45) NOT NULL
);

/* Foreign Keys */

/* Connects the plan_id in training_plan to training_detail */
ALTER TABLE training_detail ADD CONSTRAINT 
fk_training_detail_training_plan FOREIGN KEY (plan_id) REFERENCES 
training_plan(plan_id);

/* Connects the content_id in training_content to training_detail */
ALTER TABLE training_detail ADD CONSTRAINT
fk_training_detail_training_content FOREIGN KEY (content_id) REFERENCES
training_content(content_id);

/* Connects the content_id in training_content to content_quiz_map */
ALTER TABLE content_quiz_map ADD CONSTRAINT
fk_content_quiz_map_training_content FOREIGN KEY (content_id) REFERENCES
training_content(content_id);

/* Connects the quiz_id in quiz to content_quiz_map */
ALTER TABLE content_quiz_map ADD CONSTRAINT 
fk_content_quiz_map_quiz FOREIGN KEY (quiz_id) REFERENCES 
quiz(quiz_id);

/* Connects the quiz_id in quiz to quiz_detail */
ALTER TABLE quiz_detail ADD CONSTRAINT
fk_quiz_detail_quiz FOREIGN KEY (quiz_id) REFERENCES
quiz(quiz_id);

/* Connects the question_id in quiz_question to quiz_detail */
ALTER TABLE quiz_detail ADD CONSTRAINT
fk_quiz_detail_quiz_question FOREIGN KEY (question_id) REFERENCES 
quiz_question(question_id);

/* Connects the plan_id from training_plan to training_plan_assignment */
ALTER TABLE training_plan_assignment ADD CONSTRAINT
fk_plan_id FOREIGN KEY (plan_id) REFERENCES
training_plan(plan_id);

/* Connects the user_id from users to training_plan_assignment */
ALTER TABLE training_plan_assignment ADD CONSTRAINT
fk_user_id FOREIGN KEY (user_id) REFERENCES
users(user_id);
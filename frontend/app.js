const API_URL = 'https://portfolio-project-n7e3.onrender.com/api/portfolio';

const portfolioForm = document.getElementById('portfolio-form');
const projectsContainer = document.getElementById('projects-container');
const formTitle = document.getElementById('form-title');
const projectIdInput = document.getElementById('project-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const technologiesInput = document.getElementById('technologies');
const linkInput = document.getElementById('link');
const cancelBtn = document.getElementById('cancel-btn');

document.addEventListener('DOMContentLoaded', fetchProjects);

async function fetchProjects() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        displayProjects(result.data);
    } catch (err) {
        console.error('Error fetching projects:', err);
    }
}

function displayProjects(projects) {
    projectsContainer.innerHTML = '';
    if (!projects || projects.length === 0) {
        projectsContainer.innerHTML = '<p>No portfolio projects found.</p>';
        return;
    }

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <span class="tech-tag">${project.technologies}</span>
                ${project.link ? `<p><a href="${project.link}" target="_blank">View Project</a></p>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn-edit" onclick="editProject(${project.id}, '${escapeHtml(project.title)}', '${escapeHtml(project.description)}', '${escapeHtml(project.technologies)}', '${project.link || ''}')">Edit</button>
                <button class="btn-delete" onclick="deleteProject(${project.id})">Delete</button>
            </div>
        `;
        projectsContainer.appendChild(card);
    });
}

portfolioForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = projectIdInput.value;
    const projectData = {
        title: titleInput.value,
        description: descriptionInput.value,
        technologies: technologiesInput.value,
        link: linkInput.value
    };

    try {
        if (id) {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });
        }
        resetForm();
        fetchProjects();
    } catch (err) {
        console.error('Error saving project:', err);
    }
});

function editProject(id, title, description, technologies, link) {
    formTitle.textContent = 'Edit Project';
    projectIdInput.value = id;
    titleInput.value = title;
    descriptionInput.value = description;
    technologiesInput.value = technologies;
    linkInput.value = link === 'null' ? '' : link;
    cancelBtn.style.display = 'inline-block';
}

async function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchProjects();
        } catch (err) {
            console.error('Error deleting project:', err);
        }
    }
}

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    portfolioForm.reset();
    projectIdInput.value = '';
    formTitle.textContent = 'Add New Project';
    cancelBtn.style.display = 'none';
}

function escapeHtml(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
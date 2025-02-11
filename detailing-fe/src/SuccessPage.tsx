import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string; // stored as TEXT in DB
}

interface Experience {
    id: number;
    company: string;
    role: string;
    duration: string;
    description: string;
}

interface User {
    id: number;
    name: string;
    title: string;
    bio: string;
    skills: string;
    projects: Project[];       // Real array from DB
    experiences: Experience[]; // Real array from DB
}

const SuccessPage: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth0();
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");

    // 1. Fetch the user (with projects & experiences) from the backend
    useEffect(() => {
        // Replace "1" with dynamic user ID if needed
        fetch("http://localhost:8080/api/user/1")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch user");
                }
                return res.json();
            })
            .then((data: User) => {
                setUserData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    // ---------- USER INFO HANDLERS ----------
    const handleUserChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (!userData) return;
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userData) return;

        // PUT /api/user/:id
        fetch(`http://localhost:8080/api/user/${userData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: userData.name,
                title: userData.title,
                bio: userData.bio,
                skills: userData.skills,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update user");
                return res.json();
            })
            .then((updated) => {
                setUserData((prev) => (prev ? { ...prev, ...updated } : prev));
                setMessage("User info updated!");
            })
            .catch((err) => {
                console.error(err);
                setMessage("Error updating user info.");
            });
    };

    // ---------- PROJECT HANDLERS ----------
    const handleAddProject = () => {
        if (!userData) return;

        const newProject: Partial<Project> = {
            title: "New Project",
            description: "",
            technologies: "",
        };

        // POST /api/user/:userId/projects
        fetch(`http://localhost:8080/api/user/${userData.id}/projects`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProject),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to create project");
                return res.json();
            })
            .then((createdProject: Project) => {
                setUserData((prev) =>
                    prev
                        ? { ...prev, projects: [...prev.projects, createdProject] }
                        : prev
                );
            })
            .catch((err) => console.error(err));
    };

    const handleUpdateProject = (index: number) => {
        if (!userData) return;
        const project = userData.projects[index];

        // PUT /api/projects/:projectId
        fetch(`http://localhost:8080/api/projects/${project.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update project");
                return res.json();
            })
            .then((updatedProject: Project) => {
                // Update local state
                setUserData((prev) => {
                    if (!prev) return null;
                    const updatedList = [...prev.projects];
                    updatedList[index] = updatedProject;
                    return { ...prev, projects: updatedList };
                });
                setMessage("Project updated!");
            })
            .catch((err) => {
                console.error(err);
                setMessage("Error updating project.");
            });
    };

    const handleDeleteProject = (index: number) => {
        if (!userData) return;
        const projectId = userData.projects[index].id;

        // DELETE /api/projects/:projectId
        fetch(`http://localhost:8080/api/projects/${projectId}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete project");
                // Remove from local state
                setUserData((prev) => {
                    if (!prev) return null;
                    const newProjects = [...prev.projects];
                    newProjects.splice(index, 1);
                    return { ...prev, projects: newProjects };
                });
            })
            .catch((err) => console.error(err));
    };

    // Helper to update local project fields as user types
    const handleProjectFieldChange = (
        index: number,
        field: keyof Project,
        value: string
    ) => {
        if (!userData) return;
        setUserData((prev) => {
            if (!prev) return null;
            const updatedProjects = [...prev.projects];
            // Replace the field with the new value
            updatedProjects[index] = { ...updatedProjects[index], [field]: value };
            return { ...prev, projects: updatedProjects };
        });
    };

    // ---------- EXPERIENCE HANDLERS ----------
    const handleAddExperience = () => {
        if (!userData) return;

        const newExp: Partial<Experience> = {
            company: "New Company",
            role: "",
            duration: "",
            description: "",
        };

        // POST /api/user/:userId/experiences
        fetch(`http://localhost:8080/api/user/${userData.id}/experiences`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newExp),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to create experience");
                return res.json();
            })
            .then((createdExp: Experience) => {
                setUserData((prev) =>
                    prev
                        ? { ...prev, experiences: [...prev.experiences, createdExp] }
                        : prev
                );
            })
            .catch((err) => console.error(err));
    };

    const handleUpdateExperience = (index: number) => {
        if (!userData) return;
        const exp = userData.experiences[index];

        // PUT /api/experiences/:expId
        fetch(`http://localhost:8080/api/experiences/${exp.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exp),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update experience");
                return res.json();
            })
            .then((updatedExp: Experience) => {
                // Update local state
                setUserData((prev) => {
                    if (!prev) return null;
                    const updatedList = [...prev.experiences];
                    updatedList[index] = updatedExp;
                    return { ...prev, experiences: updatedList };
                });
                setMessage("Experience updated!");
            })
            .catch((err) => {
                console.error(err);
                setMessage("Error updating experience.");
            });
    };

    const handleDeleteExperience = (index: number) => {
        if (!userData) return;
        const expId = userData.experiences[index].id;

        // DELETE /api/experiences/:expId
        fetch(`http://localhost:8080/api/experiences/${expId}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete experience");
                // Remove it from state
                setUserData((prev) => {
                    if (!prev) return null;
                    const newExps = [...prev.experiences];
                    newExps.splice(index, 1);
                    return { ...prev, experiences: newExps };
                });
            })
            .catch((err) => console.error(err));
    };

    // Helper to update local experience fields as user types
    const handleExperienceFieldChange = (
        index: number,
        field: keyof Experience,
        value: string
    ) => {
        if (!userData) return;
        setUserData((prev) => {
            if (!prev) return null;
            const updatedExps = [...prev.experiences];
            updatedExps[index] = { ...updatedExps[index], [field]: value };
            return { ...prev, experiences: updatedExps };
        });
    };

    // ---------- RENDER ----------
    if (!isAuthenticated) {
        return <div>You are not logged in!</div>;
    }
    if (loading) {
        return <div>Loading admin dashboard...</div>;
    }
    if (!userData) {
        return <div>No user data found.</div>;
    }

    return (
        <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
            <h1 style={{ textAlign: "center" }}>Admin Dashboard</h1>
            {message && <p style={{ textAlign: "center", color: "green" }}>{message}</p>}

            {/* USER INFO FORM */}
            <form onSubmit={handleUserSubmit} style={{ marginBottom: "2rem" }}>
                <fieldset>
                    <legend>User Info</legend>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleUserChange}
                            style={{ display: "block", margin: "0.5rem 0" }}
                        />
                    </label>
                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={userData.title}
                            onChange={handleUserChange}
                            style={{ display: "block", margin: "0.5rem 0" }}
                        />
                    </label>
                    <label>
                        Bio:
                        <textarea
                            name="bio"
                            value={userData.bio}
                            onChange={handleUserChange}
                            style={{ display: "block", margin: "0.5rem 0", width: "100%" }}
                        />
                    </label>
                    <label>
                        Skills:
                        <input
                            type="text"
                            name="skills"
                            value={userData.skills}
                            onChange={handleUserChange}
                            style={{ display: "block", margin: "0.5rem 0" }}
                        />
                    </label>
                    <button type="submit">Save User Info</button>
                </fieldset>
            </form>

            {/* PROJECTS SECTION */}
            <section style={{ marginBottom: "2rem" }}>
                <h2>Projects</h2>
                <button onClick={handleAddProject} style={{ marginBottom: "1rem" }}>
                    + Add Project
                </button>
                {userData.projects.length === 0 && <p>No projects found.</p>}
                {userData.projects.map((proj, index) => (
                    <div
                        key={proj.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "1rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <label>
                            Title:
                            <input
                                type="text"
                                value={proj.title}
                                onChange={(e) =>
                                    handleProjectFieldChange(index, "title", e.target.value)
                                }
                                style={{ display: "block", margin: "0.5rem 0" }}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                value={proj.description}
                                onChange={(e) =>
                                    handleProjectFieldChange(index, "description", e.target.value)
                                }
                                style={{ display: "block", margin: "0.5rem 0", width: "100%" }}
                            />
                        </label>
                        <label>
                            Technologies:
                            <input
                                type="text"
                                value={proj.technologies}
                                onChange={(e) =>
                                    handleProjectFieldChange(index, "technologies", e.target.value)
                                }
                                style={{ display: "block", margin: "0.5rem 0" }}
                            />
                        </label>
                        <div>
                            <button onClick={() => handleUpdateProject(index)}>Save</button>
                            <button
                                onClick={() => handleDeleteProject(index)}
                                style={{ marginLeft: "1rem" }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            {/* EXPERIENCES SECTION */}
            <section style={{ marginBottom: "2rem" }}>
                <h2>Experiences</h2>
                <button onClick={handleAddExperience} style={{ marginBottom: "1rem" }}>
                    + Add Experience
                </button>
                {userData.experiences.length === 0 && <p>No experiences found.</p>}
                {userData.experiences.map((exp, index) => (
                    <div
                        key={exp.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "1rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <label>
                            Company:
                            <input
                                type="text"
                                value={exp.company}
                                onChange={(e) =>
                                    handleExperienceFieldChange(index, "company", e.target.value)
                                }
                                style={{ display: "block", margin: "0.5rem 0" }}
                            />
                        </label>
                        <label>
                            Role:
                            <input
                                type="text"
                                value={exp.role}
                                onChange={(e) =>
                                    handleExperienceFieldChange(index, "role", e.target.value)
                                }
                                style={{ display: "block", margin: "0.5rem 0" }}
                            />
                        </label>
                        <label>
                            Duration:
                            <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) =>
                                    handleExperienceFieldChange(index, "duration", e.target.value)
                                }
                                style={{ display: "block", margin: "0.5rem 0" }}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                value={exp.description}
                                onChange={(e) =>
                                    handleExperienceFieldChange(
                                        index,
                                        "description",
                                        e.target.value
                                    )
                                }
                                style={{ display: "block", margin: "0.5rem 0", width: "100%" }}
                            />
                        </label>
                        <div>
                            <button onClick={() => handleUpdateExperience(index)}>Save</button>
                            <button
                                onClick={() => handleDeleteExperience(index)}
                                style={{ marginLeft: "1rem" }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            {/* LOGOUT */}
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default SuccessPage;
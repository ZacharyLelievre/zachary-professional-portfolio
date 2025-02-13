import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CardActions,
    Box,
    Stack
} from '@mui/material';

interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string;
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
    projects: Project[];
    experiences: Experience[];
}

interface Comment {
    id: number;
    authorName: string;
    content: string;
    status: string; // "PENDING" or "APPROVED"
}

const SuccessPage: React.FC = () => {
    const { isAuthenticated, logout } = useAuth0();

    // User info
    const [userData, setUserData] = useState<User | null>(null);

    // Array of ALL comments (approved + pending)
    const [allComments, setAllComments] = useState<Comment[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        // 1) Fetch user data
        // 2) Fetch all comments from /api/comments/all
        Promise.all([
            fetch("https://zachary-lelievre.com/api/user/1"),
            fetch("https://zachary-lelievre.com/api/comments/all")
        ])
            .then(async ([resUser, resAll]) => {
                if (!resUser.ok || !resAll.ok) throw new Error("Failed to fetch data");
                const userJson = await resUser.json();
                const allCommentsJson = await resAll.json();

                setUserData(userJson);
                setAllComments(allCommentsJson);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    // -------------- USER INFO --------------
    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!userData) return;
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userData) return;

        fetch(`https://zachary-lelievre.com/api/user/${userData.id}`, {
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

    // -------------- PROJECT HANDLERS --------------
    const handleAddProject = () => {
        if (!userData) return;
        const newProject = { title: "New Project", description: "", technologies: "" };

        fetch(`https://zachary-lelievre.com/api/user/${userData.id}/projects`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProject),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to create project");
                return res.json();
            })
            .then((createdProject: Project) => {
                setUserData((prev) => {
                    if (!prev) return null;
                    return { ...prev, projects: [...prev.projects, createdProject] };
                });
            })
            .catch((err) => console.error(err));
    };

    const handleUpdateProject = (index: number) => {
        if (!userData) return;
        const project = userData.projects[index];

        fetch(`https://zachary-lelievre.com/api/projects/${project.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update project");
                return res.json();
            })
            .then((updatedProject: Project) => {
                setUserData((prev) => {
                    if (!prev) return null;
                    const updatedProjects = [...prev.projects];
                    updatedProjects[index] = updatedProject;
                    return { ...prev, projects: updatedProjects };
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

        fetch(`https://zachary-lelievre.com/api/projects/${projectId}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete project");
                setUserData((prev) => {
                    if (!prev) return null;
                    const updatedProjects = [...prev.projects];
                    updatedProjects.splice(index, 1);
                    return { ...prev, projects: updatedProjects };
                });
            })
            .catch((err) => console.error(err));
    };

    const handleProjectFieldChange = (index: number, field: keyof Project, value: string) => {
        if (!userData) return;
        setUserData((prev) => {
            if (!prev) return null;
            const updatedProjects = [...prev.projects];
            updatedProjects[index] = { ...updatedProjects[index], [field]: value };
            return { ...prev, projects: updatedProjects };
        });
    };

    // -------------- EXPERIENCE HANDLERS --------------
    const handleAddExperience = () => {
        if (!userData) return;
        const newExp = { company: "New Company", role: "", duration: "", description: "" };

        fetch(`https://zachary-lelievre.com/api/user/${userData.id}/experiences`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newExp),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to create experience");
                return res.json();
            })
            .then((createdExp: Experience) => {
                setUserData((prev) => {
                    if (!prev) return null;
                    return { ...prev, experiences: [...prev.experiences, createdExp] };
                });
            })
            .catch((err) => console.error(err));
    };

    const handleUpdateExperience = (index: number) => {
        if (!userData) return;
        const exp = userData.experiences[index];

        fetch(`https://zachary-lelievre.com/api/experiences/${exp.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exp),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update experience");
                return res.json();
            })
            .then((updatedExp: Experience) => {
                setUserData((prev) => {
                    if (!prev) return null;
                    const updatedExperiences = [...prev.experiences];
                    updatedExperiences[index] = updatedExp;
                    return { ...prev, experiences: updatedExperiences };
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

        fetch(`https://zachary-lelievre.com/api/experiences/${expId}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete experience");
                setUserData((prev) => {
                    if (!prev) return null;
                    const updatedExps = [...prev.experiences];
                    updatedExps.splice(index, 1);
                    return { ...prev, experiences: updatedExps };
                });
            })
            .catch((err) => console.error(err));
    };

    const handleExperienceFieldChange = (
        index: number,
        field: keyof Experience,
        value: string
    ) => {
        if (!userData) return;
        setUserData((prev) => {
            if (!prev) return null;
            const updatedExperiences = [...prev.experiences];
            updatedExperiences[index] = { ...updatedExperiences[index], [field]: value };
            return { ...prev, experiences: updatedExperiences };
        });
    };

    // -------------- COMMENT HANDLERS (approve/delete) --------------
    const handleApproveComment = async (commentId: number) => {
        try {
            const res = await fetch(`https://zachary-lelievre.com/api/comments/${commentId}/approve`, {
                method: "PUT",
            });
            if (!res.ok) throw new Error("Failed to approve comment");

            // Once approved, update state so status changes to "APPROVED"
            setAllComments((prev) =>
                prev.map((c) => (c.id === commentId ? { ...c, status: "APPROVED" } : c))
            );

            setMessage("Comment approved!");
        } catch (err) {
            console.error(err);
            setMessage("Error approving comment.");
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            const res = await fetch(`https://zachary-lelievre.com/api/comments/${commentId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete comment");

            // Remove the comment from local state
            setAllComments((prev) => prev.filter((c) => c.id !== commentId));
            setMessage("Comment deleted.");
        } catch (err) {
            console.error(err);
            setMessage("Error deleting comment.");
        }
    };

    // -------------- RENDER --------------
    if (!isAuthenticated) {
        return <Container sx={{ textAlign: 'center', mt: 4 }}>You are not logged in!</Container>;
    }
    if (loading) {
        return <Container sx={{ textAlign: 'center', mt: 4 }}>Loading admin dashboard...</Container>;
    }
    if (!userData) {
        return <Container sx={{ textAlign: 'center', mt: 4 }}>No user data found.</Container>;
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" textAlign="center" gutterBottom>
                Admin Dashboard
            </Typography>

            {message && (
                <Typography variant="body1" color="success.main" textAlign="center" mb={2}>
                    {message}
                </Typography>
            )}

            {/* USER INFO FORM */}
            <Card component="form" onSubmit={handleUserSubmit} sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        User Info
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            label="Name"
                            name="name"
                            value={userData.name}
                            onChange={handleUserChange}
                        />
                        <TextField
                            label="Title"
                            name="title"
                            value={userData.title}
                            onChange={handleUserChange}
                        />
                        <TextField
                            label="Bio"
                            name="bio"
                            value={userData.bio}
                            multiline
                            rows={3}
                            onChange={handleUserChange}
                        />
                        <TextField
                            label="Skills"
                            name="skills"
                            value={userData.skills}
                            onChange={handleUserChange}
                        />
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button type="submit" variant="contained">
                        Save User Info
                    </Button>
                </CardActions>
            </Card>

            {/* PROJECTS SECTION */}
            <Typography variant="h6" gutterBottom>
                Projects
            </Typography>
            <Button onClick={handleAddProject} variant="outlined" sx={{ mb: 2 }}>
                + Add Project
            </Button>

            {userData.projects.length === 0 && <p>No projects found.</p>}
            {userData.projects.map((proj, index) => (
                <Card sx={{ mb: 2 }} key={proj.id}>
                    <CardContent>
                        <TextField
                            fullWidth
                            sx={{ mb: 2 }}
                            label="Title"
                            value={proj.title}
                            onChange={(e) => handleProjectFieldChange(index, "title", e.target.value)}
                        />
                        <TextField
                            fullWidth
                            sx={{ mb: 2 }}
                            label="Description"
                            multiline
                            rows={3}
                            value={proj.description}
                            onChange={(e) => handleProjectFieldChange(index, "description", e.target.value)}
                        />
                        <TextField
                            fullWidth
                            sx={{ mb: 2 }}
                            label="Technologies"
                            value={proj.technologies}
                            onChange={(e) => handleProjectFieldChange(index, "technologies", e.target.value)}
                        />
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" onClick={() => handleUpdateProject(index)}>
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteProject(index)}
                        >
                            Delete
                        </Button>
                    </CardActions>
                </Card>
            ))}

            {/* EXPERIENCES SECTION */}
            <Typography variant="h6" gutterBottom mt={4}>
                Experiences
            </Typography>
            <Button onClick={handleAddExperience} variant="outlined" sx={{ mb: 2 }}>
                + Add Experience
            </Button>

            {userData.experiences.length === 0 && <p>No experiences found.</p>}
            {userData.experiences.map((exp, index) => (
                <Card sx={{ mb: 2 }} key={exp.id}>
                    <CardContent>
                        <TextField
                            fullWidth
                            sx={{ mb: 2 }}
                            label="Company"
                            value={exp.company}
                            onChange={(e) => handleExperienceFieldChange(index, "company", e.target.value)}
                        />
                        <TextField
                            fullWidth
                            sx={{ mb: 2 }}
                            label="Role"
                            value={exp.role}
                            onChange={(e) => handleExperienceFieldChange(index, "role", e.target.value)}
                        />
                        <TextField
                            fullWidth
                            sx={{ mb: 2 }}
                            label="Duration"
                            value={exp.duration}
                            onChange={(e) => handleExperienceFieldChange(index, "duration", e.target.value)}
                        />
                        <TextField
                            fullWidth
                            sx={{ mb: 2 }}
                            label="Description"
                            multiline
                            rows={3}
                            value={exp.description}
                            onChange={(e) => handleExperienceFieldChange(index, "description", e.target.value)}
                        />
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" onClick={() => handleUpdateExperience(index)}>
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteExperience(index)}
                        >
                            Delete
                        </Button>
                    </CardActions>
                </Card>
            ))}

            {/* ALL COMMENTS (admin can approve or delete) */}
            <Typography variant="h6" gutterBottom mt={4}>
                All Comments
            </Typography>
            {allComments.length === 0 && <p>No comments found.</p>}
            {allComments.map((comment) => (
                <Card sx={{ mb: 2 }} key={comment.id}>
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {comment.authorName}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            {comment.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Status: {comment.status}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {/* Only show Approve button if it's PENDING */}
                        {comment.status === "PENDING" && (
                            <Button variant="contained" onClick={() => handleApproveComment(comment.id)}>
                                Approve
                            </Button>
                        )}
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteComment(comment.id)}
                        >
                            Delete
                        </Button>
                    </CardActions>
                </Card>
            ))}

            {/* LOGOUT */}
            <Box textAlign="center" mt={4}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                >
                    Logout
                </Button>
            </Box>
        </Container>
    );
};

export default SuccessPage;
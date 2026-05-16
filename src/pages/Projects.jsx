import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { projectsApi } from "../api/projectsApi";
import Spinner from "../components/Spinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import Button from "../components/Button";

function ProjectCard({ project, onEdit, onDelete, onManageMembers }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-bold text-gray-900">
            {project.name}
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {project.description}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
            onClick={() => onEdit(project)}
          >
            Edit
          </button>
          <button
            className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            onClick={() => onDelete(project.id || project._id)}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-gray-500">
          Members: {project.members?.length ?? project.memberCount ?? 0}
        </div>
        <button
          className="text-sm font-semibold text-blue-600 hover:underline"
          onClick={() => onManageMembers(project)}
        >
          Manage members
        </button>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [memberProject, setMemberProject] = useState(null);

  const [form, setForm] = useState({ name: "", description: "" });
  const [memberForm, setMemberForm] = useState({ userId: "" });

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectsApi.list();
      setProjects(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      name: project.name || "",
      description: project.description || ""
    });
    setModalOpen(true);
  };

  const onSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await projectsApi.update(editing.id || editing._id, form);
        toast.success("Project updated");
      } else {
        await projectsApi.create(form);
        toast.success("Project created");
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Save failed");
    }
  };

  const onDelete = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await projectsApi.remove(projectId);
      toast.success("Project deleted");
      fetchProjects();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Delete failed");
    }
  };

  const openMembers = (project) => {
    setMemberProject(project);
    setMemberForm({ userId: "" });
    setMemberModalOpen(true);
  };

  const onAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectsApi.addMember(memberProject.id || memberProject._id, {
        userId: memberForm.userId
      });
      toast.success("Member added");
      setMemberModalOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Add member failed");
    }
  };

  const onRemoveMember = async (userId) => {
    if (!window.confirm("Remove member?")) return;
    try {
      await projectsApi.removeMember(
        memberProject.id || memberProject._id,
        userId
      );
      toast.success("Member removed");
      fetchProjects();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Remove failed");
    }
  };

  const cards = useMemo(() => projects || [], [projects]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">Projects</div>
          <div className="mt-1 text-sm text-gray-600">
            Create, update, and manage project members.
          </div>
        </div>
        <Button variant="primary" className="w-full sm:w-auto" onClick={openCreate}>
          + New Project
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProjects} />
      ) : cards.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((p) => (
            <ProjectCard
              key={p.id || p._id}
              project={p}
              onEdit={openEdit}
              onDelete={onDelete}
              onManageMembers={openMembers}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects found"
          description="Create your first project to start tracking tasks."
          action={
            <button
              onClick={openCreate}
              className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create Project
            </button>
          }
        />
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Edit project" : "Create project"}
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" form="project-form" type="submit">
              Save
            </Button>
          </div>
        }
      >
        <form id="project-form" onSubmit={onSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={memberModalOpen}
        title="Manage project members"
        onClose={() => setMemberModalOpen(false)}
        footer={null}
      >
        {memberProject ? (
          <div className="space-y-4">
            <form onSubmit={onAddMember} className="flex gap-2">
              <input
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="User ID"
                required
                value={memberForm.userId}
                onChange={(e) => setMemberForm({ userId: e.target.value })}
              />
              <Button variant="primary" type="submit">
                Add
              </Button>
            </form>

            <div className="rounded-lg border bg-gray-50 p-3">
              <div className="text-sm font-semibold text-gray-800">Members</div>
              <div className="mt-2 space-y-2">
                {(memberProject.members || []).length ? (
                  memberProject.members.map((m) => {
                    const uid = m.userId || m.id || m._id;
                    return (
                      <div key={uid} className="flex items-center justify-between gap-3">
                        <div className="min-w-0 text-sm text-gray-700">
                          {m.name || m.email || uid}
                        </div>
                        <button
                          className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                          type="button"
                          onClick={() => onRemoveMember(uid)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-gray-600">No members yet.</div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}


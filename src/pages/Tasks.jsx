import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { tasksApi } from "../api/tasksApi";
import { projectsApi } from "../api/projectsApi";

const STATUSES = ["pending", "in_progress", "completed"];

function statusLabel(s) {
  switch (s) {
    case "pending":
      return "Pending";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    default:
      return s;
  }
}

function StatusBadge({ status }) {
  const cls =
    status === "completed"
      ? "bg-green-50 text-green-700 border-green-200"
      : status === "in_progress"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-amber-50 text-amber-700 border-amber-200";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold ${cls}`}
    >
      {statusLabel(status)}
    </span>
  );
}

function KanbanColumn({ title, status, tasks, onOpenTask, onDropTaskStatusUpdate }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">{tasks.length}</div>
      </div>

      <div
        className="mt-3 space-y-3 min-h-[120px]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const taskId = e.dataTransfer.getData("text/taskId");
          if (taskId) onDropTaskStatusUpdate(taskId, status);
        }}
      >
        {tasks.length ? (
          tasks.map((t) => (
            <div
              key={t.id || t._id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/taskId", t.id || t._id);
              }}
              className="cursor-grab rounded-lg border bg-gray-50 p-3 hover:bg-gray-100"
              onClick={() => onOpenTask(t)}
            >
              <div className="text-sm font-bold text-gray-900 truncate">{t.title}</div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <StatusBadge status={t.status} />
                {t.dueDate ? (
                  <div className="text-xs font-semibold text-gray-600">
                    {new Date(t.dueDate).toLocaleDateString()}
                  </div>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-500">Drag tasks here</div>
        )}
      </div>
    </div>
  );
}

export default function Tasks() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("all");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    status: "pending",
    priority: "medium",
    dueDate: ""
  });

  const fetchProjects = async () => {
    const res = await projectsApi.list();
    setProjects(res.data || []);
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tasksApi.list();
      setTasks(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const visibleTasks = useMemo(() => {
    if (selectedProjectId === "all") return tasks;
    return tasks.filter((t) => {
      const pid = t.projectId || t.project?.id || t.project?._id;
      return String(pid) === String(selectedProjectId);
    });
  }, [tasks, selectedProjectId]);

  const byStatus = useMemo(() => {
    const map = {};
    STATUSES.forEach((s) => (map[s] = []));
    visibleTasks.forEach((t) => {
      const st = t.status || "pending";
      map[st] = map[st] || [];
      map[st].push(t);
    });
    return map;
  }, [visibleTasks]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      projectId:
        selectedProjectId !== "all" ? selectedProjectId : projects[0]?.id || projects[0]?._id || "",
      status: "pending",
      priority: "medium",
      dueDate: ""
    });
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setForm({
      title: task.title || "",
      description: task.description || "",
      projectId: task.projectId || task.project?.id || task.project?._id || "",
      status: task.status || "pending",
      priority: task.priority || "medium",
      dueDate: task.dueDate ? String(new Date(task.dueDate).toISOString().slice(0, 10)) : ""
    });
    setModalOpen(true);
  };

  const onSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null
      };
      if (editing) {
        await tasksApi.update(editing.id || editing._id, payload);
        toast.success("Task updated");
      } else {
        await tasksApi.create(payload);
        toast.success("Task created");
      }
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Save failed");
    }
  };

  const onDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await tasksApi.remove(taskId);
      toast.success("Task deleted");
      fetchTasks();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Delete failed");
    }
  };

  const onUpdateStatus = async (taskId, status) => {
    try {
      await tasksApi.updateStatus(taskId, { status });
      toast.success("Status updated");
      fetchTasks();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Status update failed");
    }
  };

  const today = new Date();
  const dueMin = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">Tasks</div>
          <div className="mt-1 text-sm text-gray-600">
            Create, update status, and manage task workflow.
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={openCreate}>
            + New Task
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Project:</label>
          <select
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="all">All projects</option>
            {projects.map((p) => (
              <option key={p.id || p._id} value={p.id || p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-gray-500">
          Drag & drop between columns (if your backend supports status PATCH).
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTasks} />
      ) : visibleTasks.length ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <KanbanColumn
            title="Pending"
            status="pending"
            tasks={byStatus.pending || []}
            onOpenTask={openEdit}
            onDropTaskStatusUpdate={onUpdateStatus}
          />
          <KanbanColumn
            title="In Progress"
            status="in_progress"
            tasks={byStatus.in_progress || []}
            onOpenTask={openEdit}
            onDropTaskStatusUpdate={onUpdateStatus}
          />
          <KanbanColumn
            title="Completed"
            status="completed"
            tasks={byStatus.completed || []}
            onOpenTask={openEdit}
            onDropTaskStatusUpdate={onUpdateStatus}
          />
        </div>
      ) : (
        <EmptyState
          title="No tasks"
          description="Create tasks to track progress across your projects."
          action={
            <button
              onClick={openCreate}
              className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create Task
            </button>
          }
        />
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Edit task" : "Create task"}
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex items-center justify-between gap-3">
            {editing ? (
              <Button
                variant="danger"
                onClick={() => onDelete(editing.id || editing._id)}
              >
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" form="task-form">
                Save
              </Button>
            </div>
          </div>
        }
      >
        <form id="task-form" onSubmit={onSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full min-h-[90px] resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Project
              </label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                required
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              >
                {projects.map((p) => (
                  <option key={p.id || p._id} value={p.id || p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Due date
              </label>
              <input
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                min={dueMin}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}


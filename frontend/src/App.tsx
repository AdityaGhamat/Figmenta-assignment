import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import { Trash2, Edit, Plus, ExternalLink, Search, X } from "lucide-react";

interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  createdAt: string;
}

const API_URL =
  `${import.meta.env.VITE_API_URL}/bookmarks` ||
  "http://localhost:5000/bookmarks";

const BookmarkForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    url: "",
    title: "",
    description: "",
    tags: "",
  });

  useEffect(() => {
    if (isEdit && id) {
      axios.get(API_URL).then((res) => {
        const found = res.data.find((b: Bookmark) => b.id === id);
        if (found) {
          setFormData({
            url: found.url,
            title: found.title,
            description: found.description || "",
            tags: found.tags ? found.tags.join(", ") : "",
          });
        }
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
    };

    try {
      if (isEdit && id) {
        await axios.put(`${API_URL}/${id}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      navigate("/");
    } catch (err) {
      alert("Error saving bookmark");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? "Edit Bookmark" : "Add New Bookmark"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            URL *
          </label>
          <input
            type="url"
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tags (comma separated)
          </label>
          <input
            type="text"
            placeholder="tech, react, frontend"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            {isEdit ? "Update" : "Create"}
          </button>
          <Link
            to="/"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

// 2. Bookmark List (Home)
const BookmarkList = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    let url = `${API_URL}?`;
    if (search) url += `search=${search}&`;
    if (activeTag) url += `tag=${activeTag}`;

    try {
      const res = await axios.get(url);
      setBookmarks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(fetchBookmarks, 300);
    return () => clearTimeout(timer);
  }, [search, activeTag]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bookmark?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchBookmarks();
    } catch (err) {
      alert("Error deleting");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Bookmarks Manager
        </h1>
        <Link
          to="/add"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus size={18} /> Add New
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by title or URL..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Active Filter Badge */}
      {activeTag && (
        <div className="flex items-center gap-2 mb-4 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full w-fit text-sm font-medium">
          Filter: #{activeTag}
          <button onClick={() => setActiveTag(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-800 truncate pr-2">
                  {b.title}
                </h3>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-500 hover:underline flex items-center gap-1 mb-2 truncate"
                >
                  {new URL(b.url).hostname} <ExternalLink size={12} />
                </a>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  to={`/edit/${b.id}`}
                  className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"
                >
                  <Edit size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-10">
              {b.description || "No description provided."}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {b.tags?.map((tag) => (
                <span
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full cursor-pointer hover:bg-indigo-100 hover:text-indigo-600 transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        {bookmarks.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400">
            No bookmarks found.
          </div>
        )}
      </div>
    </div>
  );
};

// Main Layout
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 pb-20 font-sans">
        <Routes>
          <Route path="/" element={<BookmarkList />} />
          <Route path="/add" element={<BookmarkForm />} />
          <Route path="/edit/:id" element={<BookmarkForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

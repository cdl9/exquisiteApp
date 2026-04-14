import React, { useState, useEffect } from "react";
import "./Announcements.css";

export default function Announcements({title, storageKey}) {
  const [newsList, setNewsList] = useState([]);

  const [selectedNews, setSelectedNews] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // Load saved news once
  useEffect(() => {
    try {
      const storedNews = JSON.parse(localStorage.getItem(storageKey));
      if (storedNews) setNewsList(storedNews);
    } catch (e) {
      console.error("Failed to parse news from Local Storage", e);
    }
  }, []);

  // Add news
  const handleAddNews = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    const updatedList = [newPost, ...newsList];
    setNewsList(updatedList);
    localStorage.setItem("newsList", JSON.stringify(updatedList));

    setNewTitle("");
    setNewContent("");
    setShowAddModal(false);
  };

  const hideAddModal = () => {
    setShowAddModal(false);
    setNewTitle("");
    setNewContent("");
  }

  return (
    <div className="news-page">
      <div className="news-header-row">
        <h1 className="news-header">{title}</h1>
        <button className="btn" onClick={() => setShowAddModal(true)}>
          + Add Post
        </button>
      </div>

      <div className="news-grid">
        {newsList.length === 0 ? (
          <p>No news available.</p>
        ) : (
          newsList.map((item) => (
            <div
              className="news-card"
              key={item.id}
              onClick={() => setSelectedNews(item)}
            >
              <div className="news-card-header">
                <h2>{item.title}</h2>
                <p className="news-date">{item.date}</p>
              </div>
              <p className="news-content">
                {item.content.length > 120
                  ? item.content.slice(0, 120) + "..."
                  : item.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* View Modal */}
      {selectedNews && (
        <div className="modal-overlay" onClick={() => setSelectedNews(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedNews(null)}
            >
              ×
            </button>
            <h2>{selectedNews.title}</h2>
            <p className="news-date">{selectedNews.date}</p>
            <div className="modal-body">
              {selectedNews.content.split("\n").map((p, idx) => (
                <p key={idx}>{p.trim()}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add News Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={hideAddModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={hideAddModal}
            >
              ×
            </button>
            <h2>Add Post</h2>
            <form onSubmit={handleAddNews} className="add-news-form standard-form">
              <label>Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <label>Content</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows="5"
                required
                style={{resize:"none"}}
              ></textarea>
              <div className="modal-actions">
                <button type="submit" className="btn">
                  Publish
                </button>
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={hideAddModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

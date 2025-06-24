// src/admin/pages/AddCourse.js
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, serverTimestamp, doc, setDoc } from 'firebase/firestore';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import Select from 'react-select';
import Sidebar from '../components/Sidebar';
import { deleteDoc, doc as firestoreDoc } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import './AddCourse.css';

export default function AddCourse() {
  /* ──────────────────── core course form ──────────────────── */
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [curriculum, setCurriculum] = useState([{ title: '', content: '' }]);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [message, setMessage] = useState('');

  /* ──────────────────── listing & fetch ──────────────────── */
  const [courses, setCourses] = useState([]);
const [showEditModal, setShowEditModal] = useState(false);
const [courseToEdit, setCourseToEdit] = useState(null);
  /* ──────────────────── category, sub-category, tag state ──────────────────── */
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  /* ───────── inline add inputs ───────── */
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const [newSubcategory, setNewSubcategory] = useState('');
  const [newTag, setNewTag] = useState('');

  /* ──────────────────── initial fetch ──────────────────── */
  useEffect(() => {
    const fetchAll = async () => {
      /* courses */
      const courseSnap = await getDocs(collection(db, 'courses'));
      setCourses(courseSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      /* categories */
      const catSnap = await getDocs(collection(db, 'categories'));
      const cats = catSnap.docs.map(d => d.data());
      setCategoryOptions(cats);

      /* subcategories */
      const subSnap = await getDocs(collection(db, 'subcategories'));
      setSubcategoryOptions(subSnap.docs.map(d => d.data()));

      /* tags */
      const tagSnap = await getDocs(collection(db, 'tags'));
      setTagOptions(tagSnap.docs.map(d => d.data()));
    };
    fetchAll();
  }, []);

  const handleEditCourse = async (courseId, updatedData) => {
  try {
    const courseRef = firestoreDoc(db, 'courses', courseId);
    await updateDoc(courseRef, updatedData);
    setMessage('✅ Course updated successfully!');

    // re-fetch or patch locally
    setCourses(prev =>
      prev.map(c => (c.id === courseId ? { ...c, ...updatedData } : c))
    );
  } catch (err) {
    console.error('Update failed:', err);
    setMessage('❌ Failed to update course.');
  }
};


  const handleDeleteCourse = async (courseId) => {
  try {
    await deleteDoc(firestoreDoc(db, 'courses', courseId));
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setMessage('✅ Course deleted successfully!');
  } catch (err) {
    console.error('Delete failed:', err);
    setMessage('❌ Failed to delete course.');
  }
};

  /* ──────────────────── curriculum handlers ──────────────────── */
  const handleCurriculumChange = (idx, field, val) => {
    const updated = [...curriculum];
    updated[idx][field] = val;
    setCurriculum(updated);
  };
  const addModule = () =>
    setCurriculum([...curriculum, { title: '', content: '' }]);
  const removeModule = idx =>
    setCurriculum(curriculum.filter((_, i) => i !== idx));

  /* ──────────────────── inline adds (category / sub / tag) ──────────────────── */
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    const value = newCategory.toLowerCase().replace(/\s+/g, '-');
    const newCat = { label: newCategory.trim(), value };

    await addDoc(collection(db, 'categories'), newCat);
    setCategoryOptions(prev => [...prev, newCat]);
    setSelectedCategories(prev => [...prev, newCat]); // auto-select
    setNewCategory('');
    setShowAddCategory(false);
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategory.trim()) return;
    const value = newSubcategory.toLowerCase().replace(/\s+/g, '-');
    const newSub = { label: newSubcategory.trim(), value };

    await addDoc(collection(db, 'subcategories'), newSub);
    setSubcategoryOptions(prev => [...prev, newSub]);
    setSelectedSubcategories(prev => [...prev, newSub]);
    setNewSubcategory('');
  };

const handleAddTag = async () => {
  if (!newTag.trim()) return;

  const label = newTag.trim();
  const value = label.toLowerCase().replace(/\s+/g, '-');

  if (tagOptions.some(t => t.value === value)) {
    setNewTag('');
    return;
  }

  const tagObj = { label, value };

  await setDoc(doc(db, 'tags', value), tagObj);

  setTagOptions(prev => [...prev, tagObj]);
  setSelectedTags(prev => [...prev, tagObj]);
  setNewTag('');
};


const handleAddTags = async () => {
  if (!newTag.trim()) return;

  const batch = newTag
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
    .map(label => ({
      label,
      value: label.toLowerCase().replace(/\s+/g, '-')
    }))
    .filter(tag => !tagOptions.some(t => t.value === tag.value));

  if (!batch.length) {
    setNewTag('');
    return;
  }

  await Promise.all(
    batch.map(tagObj => setDoc(doc(db, 'tags', tagObj.value), tagObj))
  );

  setTagOptions(prev => [...prev, ...batch]);
  setSelectedTags(prev => [...prev, ...batch]);
  setNewTag('');
};


  /* ──────────────────── form submit ──────────────────── */
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      let thumbnailURL = '';
      if (thumbnail) {
        const storageRef = ref(storage, `course-thumbnails/${thumbnail.name}`);
        await uploadBytes(storageRef, thumbnail);
        thumbnailURL = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'courses'), {
        title,
        description,
        curriculum,
        thumbnailURL,
        categories: selectedCategories.map(c => c.value),
        subcategories: selectedSubcategories.map(sc => sc.value),
        tags: selectedTags.map(t => t.value),
        createdAt: serverTimestamp(),
      });

      setMessage('✅ Course added successfully!');
      /* clear form */
      setTitle('');
      setDescription('');
      setCurriculum([{ title: '', content: '' }]);
      setThumbnail(null);
      setPreviewURL('');
      setSelectedCategories([]);
      setSelectedSubcategories([]);
      setSelectedTags([]);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to add course.');
    }
  };

  /* ──────────────────── JSX ──────────────────── */
  return (
    <>
      <Sidebar />
      <div className="admin-container two-column-layout">
        {/* ───── left column ───── */}
        <div className="form-section">
          <h1>Add New Course</h1>
          {message && (
            <p
              className={`course-message ${
                message.includes('✅') ? 'success' : 'error'
              }`}
            >
              {message}
            </p>
          )}

          {/* ───── course form ───── */}
          <form onSubmit={handleSubmit} className="course-form">
            {/* title & description */}
            <label>Course Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <label>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />

            {/* curriculum builder */}
            <div className="curriculum-section">
              <label>Curriculum</label>
              {curriculum.map((mod, idx) => (
                <div className="curriculum-block" key={idx}>
                  <input
                    type="text"
                    placeholder={`Module ${idx + 1} Title`}
                    value={mod.title}
                    onChange={e =>
                      handleCurriculumChange(idx, 'title', e.target.value)
                    }
                  />
                  <textarea
                    placeholder="Module content"
                    value={mod.content}
                    onChange={e =>
                      handleCurriculumChange(idx, 'content', e.target.value)
                    }
                  />
                  {curriculum.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeModule(idx)}
                    >
                      🗑 Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addModule}>
                + Add Module
              </button>
            </div>

            {/* thumbnail */}
            <label>Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                setThumbnail(e.target.files[0]);
                setPreviewURL(URL.createObjectURL(e.target.files[0]));
              }}
            />

            {/* categories */}
            <label>Categories</label>
            <Select
              isMulti
              options={categoryOptions}
              value={selectedCategories}
              onChange={setSelectedCategories}
            />

            {/* inline add category */}
            <div className="add-category-inline">
              {!showAddCategory ? (
                <button
                  type="button"
                  onClick={() => setShowAddCategory(true)}
                >
                  ➕ Add New Category
                </button>
              ) : (
                <div className="inline-add-form">
                  <input
                    type="text"
                    placeholder="New Category"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                  />
                  <button type="button" onClick={handleAddCategory}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* subcategories */}
            <label>Subcategories</label>
            <Select
              isMulti
              options={subcategoryOptions}
              value={selectedSubcategories}
              onChange={setSelectedSubcategories}
            />

            {/* inline add subcategory */}
            <div className="add-subcategory-inline">
              <input
                type="text"
                placeholder="New Subcategory"
                value={newSubcategory}
                onChange={e => setNewSubcategory(e.target.value)}
              />
              <button type="button" onClick={handleAddSubcategory}>
                ➕ Add
              </button>
            </div>

            {/* tags */}
{/* tags multi-select */}
<label>Tags</label>
<Select
  isMulti
  options={tagOptions}
  value={selectedTags}
  onChange={setSelectedTags}
/>

{/* NEW: comma-separated add */}
<div className="add-tag-inline">
  <input
    type="text"
    placeholder="New tags (comma-separated)"
    value={newTag}
    onChange={e => setNewTag(e.target.value)}
  />
  <button type="button" onClick={handleAddTags}>
    ➕ Add Tags
  </button>
</div>


            <button type="submit">Add Course</button>
          </form>

          {/* ───── course list ───── */}
          <h2>All Courses</h2>
          <table className="enrollment-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Categories</th>
                <th>Subcategories</th>
                <th>Tags</th>
                <th>Thumbnail</th>
              </tr>
            </thead>
<tbody>
  {courses.map(c => (
    <tr key={c.id} className="course-row">
      {/* Title with action icons on hover */}
      <td>
        <div className="row-title-wrapper">
          {c.title}
          <div className="row-actions">
<button
  className="icon-button edit"
  title="Edit course"
  onClick={() => {
    setCourseToEdit(c);
    setShowEditModal(true);   // modal open
  }}
>
  <i className="fa-solid fa-pen-to-square"></i>
</button>


            <button
              className="icon-button delete"
onClick={() => {
  if (window.confirm('Are you sure you want to delete this course?')) {
    handleDeleteCourse(c.id);
  }
}}

              title="Delete course"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </td>

      {/* Categories */}
      <td>{(c.categories || []).join(', ')}</td>

      {/* Subcategories */}
      <td>{(c.subcategories || []).join(', ')}</td>

      {/* Tags */}
      <td>{(c.tags || []).join(', ')}</td>

      {/* Thumbnail */}
      <td>
        {c.thumbnailURL && (
          <img
            src={c.thumbnailURL}
            alt="thumb"
            style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6 }}
          />
        )}
      </td>
    </tr>
  ))}
</tbody>


          </table>
        </div>

        {/* ───── right column (preview / stats) ───── */}
        <div className="preview-section">
          <div className="preview-card">
            <h3>Course Preview</h3>
            {previewURL ? (
              <img src={previewURL} alt="preview" className="thumb-preview" />
            ) : (
              <p>No thumbnail selected</p>
            )}
            <p>
              <strong>Title:</strong> {title || '—'}
            </p>
            <p>
              <strong>Modules:</strong> {curriculum.length}
            </p>
          </div>

          <div className="course-stats">
            <h3>Stats</h3>
            <p>Total Courses: {courses.length}</p>
            <p>Latest: {courses[0]?.title || '—'}</p>
          </div>
        </div>
      </div>
    </>
  );
}

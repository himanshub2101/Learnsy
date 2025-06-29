import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import './EditCourseModal.css';

export default function EditCourseModal({
  show,
  onClose,
  onSave,
  course,
  categoryOptions,
  subcategoryOptions,
  tagOptions
}) {
  const [title, setTitle]               = useState('');
  const [description, setDescription]   = useState('');
  const [categories, setCategories]     = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tags, setTags]                 = useState([]);

  /* modal खुलते ही fields pre-fill */
  useEffect(() => {
    if (!course) return;
    setTitle(course.title || '');
    setDescription(course.description || '');

    setCategories(
      (course.categories || []).map(v =>
        categoryOptions.find(o => o.value === v)
      ).filter(Boolean)
    );

    setSubcategories(
      (course.subcategories || []).map(v =>
        subcategoryOptions.find(o => o.value === v)
      ).filter(Boolean)
    );

    setTags(
      (course.tags || []).map(v =>
        tagOptions.find(o => o.value === v)
      ).filter(Boolean)
    );
  }, [course, categoryOptions, subcategoryOptions, tagOptions]);

  if (!show) return null;          // hidden

  return (
    <div className="ecm-overlay">
      <div className="ecm-box">
        <h2>Edit Course</h2>

        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} />

        <label>Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <label>Categories</label>
        <Select
          isMulti
          options={categoryOptions}
          value={categories}
          onChange={setCategories}
        />

        <label>Sub-categories</label>
        <Select
          isMulti
          options={subcategoryOptions}
          value={subcategories}
          onChange={setSubcategories}
        />

        <label>Tags</label>
        <Select
          isMulti
          options={tagOptions}
          value={tags}
          onChange={setTags}
        />

        <div className="ecm-actions">
          <button className="ecm-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="ecm-btn-primary"
            onClick={() =>
              onSave(course.id, {
                title,
                description,
                categories: categories.map(c => c.value),
                subcategories: subcategories.map(s => s.value),
                tags: tags.map(t => t.value)
              })
            }
          >
            Save&nbsp;Changes
          </button>
        </div>
      </div>
    </div>
  );
}

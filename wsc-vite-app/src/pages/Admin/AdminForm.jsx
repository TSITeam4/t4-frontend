import React, { useState } from 'react';
import { getPublicUrl } from '../../lib/storageUtils';

/**
 * AdminForm — generic form component driven by field config.
 * Handles text inputs, textareas, selects, date inputs, and image uploads.
 */
function AdminForm({ fields, initialData, pathColumn, bucket, onSave, onCancel, saving, error }) {
  // Initialize form data from initialData or defaults
  const [formData, setFormData] = useState(() => {
    const data = {};
    for (const field of fields) {
      if (field.type === 'image') continue; // Handled separately
      data[field.name] = initialData?.[field.name] ?? field.defaultValue ?? '';
    }
    return data;
  });

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processFile = (selected) => {
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      setFilePreview(URL.createObjectURL(selected));
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    processFile(selected);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer?.files?.[0];
    processFile(dropped);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, file);
  };

  // Existing image URL for preview
  const existingImageUrl = initialData?.[pathColumn]
    ? getPublicUrl(bucket, initialData[pathColumn])
    : null;

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => {
        if (field.type === 'image') {
          return (
            <div key={field.name} className="admin-form-group">
              <label>{field.label}</label>
              <div
                className={`admin-dropzone ${dragActive ? 'admin-dropzone-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById(`file-input-${field.name}`)?.click()}
              >
                <input
                  id={`file-input-${field.name}`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileChange}
                  className="admin-file-input-hidden"
                />
                <span className="admin-dropzone-text">
                  {filePreview || existingImageUrl
                    ? 'Drop a new image or click to browse'
                    : 'Drag and drop an image here, or click to browse'}
                </span>
              </div>
              {(filePreview || existingImageUrl) && (
                <img
                  src={filePreview || existingImageUrl}
                  alt="Preview"
                  className="admin-image-preview"
                />
              )}
            </div>
          );
        }

        if (field.type === 'select') {
          return (
            <div key={field.name} className="admin-form-group">
              <label>{field.label}</label>
              <select
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
              >
                <option value="">Select...</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === 'textarea') {
          return (
            <div key={field.name} className="admin-form-group">
              <label>{field.label}</label>
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                placeholder={field.placeholder}
              />
            </div>
          );
        }

        if (field.type === 'date') {
          return (
            <div key={field.name} className="admin-form-group">
              <label>{field.label}</label>
              <input
                type="date"
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
              />
            </div>
          );
        }

        // Default: text input
        return (
          <div key={field.name} className="admin-form-group">
            <label>{field.label}</label>
            <input
              type="text"
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              placeholder={field.placeholder}
            />
          </div>
        );
      })}

      {error && <p className="admin-error-msg">{error.message}</p>}

      <div className="admin-form-actions">
        <button type="submit" className="admin-save-btn" disabled={saving}>
          {saving ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
        <button type="button" className="admin-cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AdminForm;

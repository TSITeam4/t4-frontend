import React, { useState, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useSupabaseQuery } from '../../lib/hooks/useSupabaseQuery';
import { useSupabaseMutation, deleteContentItem } from '../../lib/hooks/useSupabaseMutation';
import { uploadFile, getPublicUrl, deleteFile } from '../../lib/storageUtils';
import { validateImageDimensions } from '../../lib/imageUtils';
import { LIMITS } from '../../lib/constants';
import AsyncStateWrapper from '../../components/shared/AsyncStateWrapper';
import AdminForm from './AdminForm';
import { FORM_FIELDS } from './formConfig';

/**
 * AdminSection — generic CRUD list for any content table.
 * Receives a config from CONTENT_CONFIG and renders a table + form modal.
 */
function AdminSection({ configKey, config }) {
  const { table, bucket, pathColumn, visibilityColumn, displayName, limit, orderable = true } = config;
  const hasStorage = !!(bucket && pathColumn);
  const fields = FORM_FIELDS[configKey];

  // Fetch all rows (admin sees all rows via RLS FOR ALL policy)
  const { data: rows, loading, error, refetch } = useSupabaseQuery(table);
  const { mutate, loading: mutating, error: mutError, reset: resetMutError } = useSupabaseMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const atLimit = rows.length >= limit;

  // ── Visibility toggle (optimistic) ────────────────────────────
  const handleToggleVisibility = async (row) => {
    const newVal = !row[visibilityColumn];
    try {
      await mutate(async () => {
        const { error: updateError } = await supabase
          .from(table)
          .update({ [visibilityColumn]: newVal })
          .eq('id', row.id);
        if (updateError) throw updateError;
      });
      refetch();
    } catch {
      // error is set by the hook
    }
  };

  // ── Save (create or update) ───────────────────────────────────
  const handleSave = async (formData, file) => {
    try {
      await mutate(async () => {
        let payload = { ...formData };

        if (hasStorage) {
          let updatedPath = formData[pathColumn];

          // Upload new file if provided
          if (file) {
            if (!LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
              throw new Error('Invalid file type. Please use a JPEG, PNG, WebP, or AVIF image.');
            }
            // Headshots: 3000×3000. Logos: 2500×2500. Gallery: 1920×1080.
            const maxW = configKey === 'executives' ? LIMITS.MAX_HEADSHOT_DIMENSION : configKey === 'sponsors' ? LIMITS.MAX_LOGO_DIMENSION : LIMITS.MAX_IMAGE_WIDTH;
            const maxH = configKey === 'executives' ? LIMITS.MAX_HEADSHOT_DIMENSION : configKey === 'sponsors' ? LIMITS.MAX_LOGO_DIMENSION : LIMITS.MAX_IMAGE_HEIGHT;
            await validateImageDimensions(file, maxW, maxH);
            if (file.size > LIMITS.MAX_IMAGE_SIZE_MB * 1024 * 1024) {
              throw new Error(`The image file is too large. Maximum size is ${LIMITS.MAX_IMAGE_SIZE_MB} MB. Please use a smaller image or compress it before uploading.`);
            }

            const { objectName } = await uploadFile(bucket, file);
            updatedPath = objectName;

            // If updating, delete old file
            if (editingRow && editingRow[pathColumn] && editingRow[pathColumn] !== updatedPath) {
              try {
                await deleteFile(bucket, editingRow[pathColumn]);
              } catch {
                // Old file cleanup is best-effort
              }
            }
          }

          payload = { ...payload, [pathColumn]: updatedPath };
        }

        if (editingRow) {
          // Update existing row
          const { error: updateError } = await supabase
            .from(table)
            .update(payload)
            .eq('id', editingRow.id);
          if (updateError) throw updateError;
        } else {
          // Check row count guard before insert
          const { count, error: countError } = await supabase
            .from(table)
            .select('id', { count: 'exact', head: true });
          if (countError) throw countError;
          if (count >= limit) {
            throw new Error(`Maximum of ${limit} ${displayName.toLowerCase()} reached. Delete an existing item first.`);
          }

          const { error: insertError } = await supabase
            .from(table)
            .insert(payload);
          if (insertError) throw insertError;
        }
      });

      setShowForm(false);
      setEditingRow(null);
      resetMutError();
      refetch();
    } catch {
      // error shown in form via mutError
    }
  };

  // ── Delete (storage-first) ────────────────────────────────────
  const handleDelete = async (row) => {
    try {
      await mutate(async () => {
        if (hasStorage) {
          await deleteContentItem(table, row, bucket, pathColumn);
        } else {
          const { error } = await supabase.from(table).delete().eq('id', row.id);
          if (error) throw error;
        }
      });
      setDeleteConfirm(null);
      refetch();
    } catch {
      // error is set by the hook
    }
  };

  // ── Move display_order (only when orderable) ────────────────────
  const handleMove = async (row, direction) => {
    if (!orderable) return;
    const sorted = [...rows].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const idx = sorted.findIndex((r) => r.id === row.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const thisOrder = sorted[idx].display_order ?? 0;
    const otherOrder = sorted[swapIdx].display_order ?? 0;

    try {
      await mutate(async () => {
        const { error: e1 } = await supabase.from(table).update({ display_order: otherOrder }).eq('id', sorted[idx].id);
        if (e1) throw e1;
        const { error: e2 } = await supabase.from(table).update({ display_order: thisOrder }).eq('id', sorted[swapIdx].id);
        if (e2) throw e2;
      });
      refetch();
    } catch {
      // error shown by hook
    }
  };

  // ── Column headers from field config ──────────────────────────
  const columnHeaders = useMemo(() => {
    return fields
      .filter((f) => f.showInTable !== false)
      .map((f) => f.label);
  }, [fields]);

  const sortedRows = useMemo(
    () => (orderable ? [...rows].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)) : rows),
    [rows, orderable]
  );

  return (
    <div>
      {/* Header */}
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">{displayName}</h2>
          <span className="admin-row-count">
            {rows.length} / {limit} items
          </span>
        </div>
        <button
          className="admin-add-btn"
          disabled={atLimit || mutating}
          onClick={() => {
            setEditingRow(null);
            resetMutError();
            setShowForm(true);
          }}
        >
          + Add {displayName.replace(/s$/, '')}
        </button>
      </div>

      {/* Table */}
      <AsyncStateWrapper
        loading={loading}
        error={error}
        data={rows}
        onRetry={refetch}
        emptyMessage={`No ${displayName.toLowerCase()} yet. Click "Add" to create one.`}
      >
        <table className="admin-table">
          <thead>
            <tr>
              {orderable && <th>Order</th>}
              {columnHeaders.map((h) => (
                <th key={h}>{h}</th>
              ))}
              <th>{visibilityColumn === 'published' ? 'Published' : visibilityColumn === 'active' ? 'Active' : 'Visible'}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, idx) => (
              <tr key={row.id}>
                {orderable && (
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        className="admin-edit-btn"
                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                        disabled={idx === 0 || mutating}
                        onClick={() => handleMove(row, 'up')}
                      >
                        &#9650;
                      </button>
                      <button
                        className="admin-edit-btn"
                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                        disabled={idx === sortedRows.length - 1 || mutating}
                        onClick={() => handleMove(row, 'down')}
                      >
                        &#9660;
                      </button>
                    </div>
                  </td>
                )}
                {fields
                  .filter((f) => f.showInTable !== false)
                  .map((f) => (
                    <td key={f.name}>
                      {f.type === 'image' ? (
                        row[f.name] ? (
                          <img
                            src={getPublicUrl(bucket, row[f.name])}
                            alt=""
                            className="admin-image-preview"
                          />
                        ) : (
                          <span style={{ opacity: 0.4 }}>—</span>
                        )
                      ) : (
                        String(row[f.name] ?? '').slice(0, 60) || <span style={{ opacity: 0.4 }}>—</span>
                      )}
                    </td>
                  ))}
                <td>
                  <label className="admin-toggle">
                    <input
                      type="checkbox"
                      checked={!!row[visibilityColumn]}
                      onChange={() => handleToggleVisibility(row)}
                      disabled={mutating}
                    />
                    <span className="admin-toggle-slider" />
                  </label>
                </td>
                <td>
                  <div className="admin-action-btns">
                    <button
                      className="admin-edit-btn"
                      onClick={() => {
                        setEditingRow(row);
                        resetMutError();
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-delete-btn"
                      onClick={() => setDeleteConfirm(row)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AsyncStateWrapper>

      {/* Form Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => { setShowForm(false); setEditingRow(null); }}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingRow ? 'Edit' : 'Add'} {displayName.replace(/s$/, '')}</h3>
            <AdminForm
              fields={fields}
              initialData={editingRow}
              pathColumn={pathColumn}
              bucket={bucket}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingRow(null); }}
              saving={mutating}
              error={mutError}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h3>Confirm Delete</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Are you sure you want to delete{' '}
              <strong>{deleteConfirm.title || deleteConfirm.name || 'this item'}</strong>?
              {hasStorage && deleteConfirm[pathColumn] && ' The associated image will also be deleted.'}
              {' '}This action cannot be undone.
            </p>
            {mutError && <p className="admin-error-msg">{mutError.message}</p>}
            <div className="admin-form-actions">
              <button
                className="admin-delete-btn"
                style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                onClick={() => handleDelete(deleteConfirm)}
                disabled={mutating}
              >
                {mutating ? 'Deleting...' : 'Delete'}
              </button>
              <button
                className="admin-cancel-btn"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSection;

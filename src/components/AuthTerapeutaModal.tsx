import { useState } from 'react';

export function AuthTerapeutaModal({
  onConfirm,
  onCancel,
  loading = false,
  message = '',
}: {
  onConfirm: (nombre: string) => void;
  onCancel: () => void;
  loading?: boolean;
  message?: string;
}) {
  const [nombre, setNombre] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    onConfirm(nombre.trim());
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal card">
        <h3 style={{ marginTop: 0 }}>Validar terapeuta</h3>
        <p className="subtitle" style={{ marginTop: -6 }}>Ingresa el nombre del terapeuta para continuar</p>
        {message && <div className="msg">{message}</div>}
        <form onSubmit={submit} className="form">
          <div className="field">
            <label htmlFor="nombre-terapeuta">Nombre del terapeuta</label>
            <input
              id="nombre-terapeuta"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Laura"
              required
            />
          </div>
          <div className="actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !nombre.trim()}>
              {loading ? 'Validando...' : 'Continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

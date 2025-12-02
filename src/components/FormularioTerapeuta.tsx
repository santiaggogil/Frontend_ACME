import { useState } from 'react';
import type { UsuarioBase } from './RegistroUsuario';

export function FormularioTerapeuta({
  baseUsuario,
  onSubmit,
  onCancel,
}: {
  baseUsuario: UsuarioBase & { rol: 'terapeuta' };
  onSubmit: (payload: {
    id: string;
    nombre: string;
    rol: 'terapeuta';
    especialidad: string;
  }) => void;
  onCancel?: () => void;
}) {
  const [especialidad, setEspecialidad] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!especialidad) return;
    onSubmit({
      id: baseUsuario.id,
      nombre: baseUsuario.nombre,
      rol: 'terapeuta',
      especialidad,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card form">
      <h2>Datos de Terapeuta</h2>
      <div className="field">
        <label htmlFor="especialidad">Especialidad</label>
        <input
          id="especialidad"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
          required
        />
      </div>
      <div className="actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary">Crear Terapeuta</button>
      </div>
    </form>
  );
}


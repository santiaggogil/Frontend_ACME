import { useState } from 'react';

export type Rol = 'paciente' | 'terapeuta';

export interface UsuarioBase {
  id: string;
  nombre: string;
  rol: Rol;
}

export function RegistroUsuario({
  onSubmit,
}: {
  onSubmit: (data: UsuarioBase) => void;
}) {
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<Rol>('paciente');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !nombre || !rol) return;
    onSubmit({ id, nombre, rol });
  };

  return (
    <form onSubmit={handleSubmit} className="card form">
      <h2>Registrar Usuario</h2>
      <div className="field">
        <label htmlFor="id">ID</label>
        <input id="id" value={id} onChange={(e) => setId(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="rol">Rol</label>
        <select id="rol" value={rol} onChange={(e) => setRol(e.target.value as Rol)} required>
          <option value="paciente">paciente</option>
          <option value="terapeuta">terapeuta</option>
        </select>
      </div>
      <div className="actions">
        <button type="submit" className="btn btn-primary">Continuar</button>
      </div>
    </form>
  );
}

